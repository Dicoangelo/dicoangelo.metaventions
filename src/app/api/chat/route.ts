import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@supabase/supabase-js";
import { getPublicKnowledgeContext, type PublicKnowledgeSource } from "@/lib/dossier";
import { chatRateLimit, getClientIdentifier, createRateLimitHeaders } from "@/lib/ratelimit";
import { chatMessageSchema, validateRequest } from "@/lib/schemas";
import { buildGroundedChatPrompt, buildKnowledgeQuery } from "@/lib/chat-grounding";

// DeepSeek V4 via the Anthropic-compatible Messages API (same SDK, different baseURL).
const deepseek = new Anthropic({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: "https://api.deepseek.com/anthropic",
});

const CHAT_MODEL = process.env.DEEPSEEK_CHAT_MODEL || "deepseek-v4-pro";
const CHAT_FALLBACK_MODEL = process.env.DEEPSEEK_FALLBACK_MODEL || "deepseek-v4-flash";

// Lazy init Supabase for logging
let supabase: ReturnType<typeof createClient> | null = null;
function getSupabase() {
  if (!supabase && process.env.SUPABASE_URL && process.env.SUPABASE_KEY) {
    supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
  }
  return supabase;
}

export async function POST(request: Request) {
  let ragSource = 'verified-profile';
  let knowledgeStatus = 'unavailable';
  let knowledgeSources: PublicKnowledgeSource[] = [];
  let retrievalTimeMs = 0;
  let contextLength = 0;
  let query = '';
  let isVoiceRequest = false;

  try {
    // Rate limiting check
    const identifier = getClientIdentifier(request.headers as unknown as Headers);
    const { success, limit, remaining, reset } = await chatRateLimit.limit(identifier);

    if (!success) {
      return new Response(
        JSON.stringify({
          error: "Rate limit exceeded. Please wait a moment before trying again."
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            ...createRateLimitHeaders(limit, remaining, reset),
          },
        }
      );
    }

    const body = await request.json();

    // Validate request body
    const validation = validateRequest(chatMessageSchema, body);
    if (!validation.success) {
      return new Response(
        JSON.stringify({ error: validation.error }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const { messages, isVoice } = validation.data;
    isVoiceRequest = isVoice || false;

    // Get the latest user message for RAG query
    const latestUserMessage = messages
      .filter((m: { role: string }) => m.role === "user")
      .pop();

    query = latestUserMessage?.content || '';

    // Only reviewed, public, current records may enter the model context.
    // There is deliberately no fallback to raw dossiers, PageIndex or recruiter notes.
    const retrievalStart = Date.now();
    const knowledge = await getPublicKnowledgeContext(buildKnowledgeQuery(messages));
    knowledgeStatus = knowledge.status;
    knowledgeSources = knowledge.sources;
    ragSource = knowledge.context ? 'reviewed-public' : 'verified-profile';
    retrievalTimeMs = Date.now() - retrievalStart;
    contextLength = knowledge.context.length;
    const fullSystemPrompt = buildGroundedChatPrompt(knowledge.context, isVoice);

    const mappedMessages = messages.map((m: { role: string; content: string }) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    }));

    // DeepSeek V4 defaults to chain-of-thought "thinking" mode. For voice chat
    // that adds 3-5s of silent latency before TTS gets any tokens. Disable it.
    // A lower temperature keeps evidence-backed answers consistent.
    const baseRequest = {
      max_tokens: 1024,
      temperature: 0.3,
      thinking: { type: "disabled" as const },
      system: fullSystemPrompt,
      messages: mappedMessages,
    };

    let modelUsed = CHAT_MODEL;
    let stream: Awaited<ReturnType<typeof deepseek.messages.stream>>;
    try {
      stream = await deepseek.messages.stream({
        model: CHAT_MODEL,
        ...baseRequest,
      });
    } catch (primaryErr) {
      // Fall back to V4 Flash on rate-limit / 5xx / model-unavailable.
      modelUsed = CHAT_FALLBACK_MODEL;
      stream = await deepseek.messages.stream({
        model: CHAT_FALLBACK_MODEL,
        ...baseRequest,
      });
      if (process.env.NODE_ENV === "development") {
        console.warn("[chat] primary model failed, fell back to", CHAT_FALLBACK_MODEL, primaryErr);
      }
    }

    const encoder = new TextEncoder();
    let fullResponse = "";

    const readable = new ReadableStream({
      async start(controller) {
        for await (const event of stream) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            const text = event.delta.text;

            fullResponse += text;
            controller.enqueue(encoder.encode(text));
          }
        }

        // Record provider usage for operational diagnostics.
        let cacheHitTokens = 0;
        let cacheMissTokens = 0;
        try {
          const finalMessage = await stream.finalMessage();
          const usage = finalMessage.usage as unknown as {
            cache_read_input_tokens?: number;
            cache_creation_input_tokens?: number;
            input_tokens?: number;
          };
          cacheHitTokens = usage?.cache_read_input_tokens ?? 0;
          cacheMissTokens = (usage?.input_tokens ?? 0) + (usage?.cache_creation_input_tokens ?? 0);
          if (process.env.NODE_ENV === "development") {
            const total = cacheHitTokens + cacheMissTokens;
            const hitPct = total > 0 ? Math.round((cacheHitTokens / total) * 100) : 0;
            console.log(`[chat] ${modelUsed} cache: ${cacheHitTokens} hit / ${cacheMissTokens} miss (${hitPct}%)`);
          }
        } catch {
          // Best-effort metrics, don't fail the response.
        }

        // Log to Supabase after streaming completes (non-blocking)
        logChatToSupabase({
          query,
          ragSource,
          retrievalTimeMs,
          contextLength,
          responsePreview: fullResponse.substring(0, 200),
          clientIp: identifier,
          isVoice: isVoiceRequest,
          model: modelUsed,
          cacheHitTokens,
          cacheMissTokens,
          knowledgeStatus,
          knowledgeSources,
        }).catch(() => {}); // Ignore logging errors

        controller.close();
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
        "X-RAG-Source": ragSource,
        "X-Retrieval-Time-Ms": retrievalTimeMs.toString(),
        "X-Chat-Model": modelUsed,
        "X-Knowledge-Status": knowledgeStatus,
        "X-Knowledge-Sources": encodeURIComponent(JSON.stringify(knowledgeSources)),
      },
    });
  } catch (error) {
    // Log error for debugging (Sentry integration)
    if (process.env.NODE_ENV === "development") {
      console.error("Chat API error:", error);
    }

    // Import Sentry at top of file if not already imported
    try {
      const Sentry = await import("@sentry/nextjs");
      Sentry.captureException(error, {
        tags: {
          action: "process_message",
        },
      });
    } catch {
      // Sentry import failed, continue
    }

    // Return generic error message to client (don't expose stack traces)
    return new Response(
      JSON.stringify({
        error: "Unable to process your message. Please try again or contact support if the issue persists.",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

/** Log the reviewed records used for each answer, without copying their bodies. */
async function logChatToSupabase(data: {
  query: string;
  ragSource: string;
  retrievalTimeMs: number;
  contextLength: number;
  responsePreview: string;
  clientIp: string;
  isVoice: boolean;
  model?: string;
  cacheHitTokens?: number;
  cacheMissTokens?: number;
  knowledgeStatus: string;
  knowledgeSources: PublicKnowledgeSource[];
}) {
  const sb = getSupabase();
  if (!sb) return;

  try {
    // Type assertion needed - chat_logs table not in generated types yet
    await (sb.from('chat_logs') as ReturnType<typeof sb.from>).insert({
      query: data.query.substring(0, 500), // Truncate long queries
      rag_source: data.ragSource,
      retrieval_time_ms: data.retrievalTimeMs,
      context_length: data.contextLength,
      response_preview: data.responsePreview,
      client_ip: data.clientIp,
      is_voice: data.isVoice,
      metadata: {
        knowledge_status: data.knowledgeStatus,
        knowledge_sources: data.knowledgeSources.map(({ slug, reviewedAt }) => ({ slug, reviewed_at: reviewedAt })),
        model: data.model,
        cache_hit_tokens: data.cacheHitTokens,
        cache_miss_tokens: data.cacheMissTokens,
      },
    } as Record<string, unknown>);
  } catch (err) {
    // Silent fail - don't break chat for logging errors
    console.error('Failed to log chat:', err);
  }
}
