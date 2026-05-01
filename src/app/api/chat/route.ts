import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@supabase/supabase-js";
import { getDossierContext, getCombinedContext } from "@/lib/dossier";
import { getPageIndexContext, isPageIndexAvailable, stripCitationsForVoice } from "@/lib/pageindex";
import { chatRateLimit, getClientIdentifier, createRateLimitHeaders } from "@/lib/ratelimit";
import { chatMessageSchema, validateRequest } from "@/lib/schemas";

// DeepSeek V4 via the Anthropic-compatible Messages API (same SDK, different baseURL).
// V4 Pro: $0.43/$0.87 per 1M tokens during 75% promo through 2026-05-31.
// V4 Flash: $0.14/$0.28 per 1M tokens — used as fallback on rate-limit / 5xx.
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

/**
 * Speech-optimized system prompt
 *
 * CRITICAL: This prompt generates SPOKEN responses, not written text.
 * The output goes directly to Text-to-Speech, so it must sound natural.
 */
const SYSTEM_PROMPT = `You are Dico Angelo's voice assistant on his portfolio website. You SPEAK to visitors naturally.

## CRITICAL: You are SPEAKING, not writing
- Use natural conversational language as if talking face-to-face
- NEVER use colons followed by lists (TTS reads "colon" literally)
- NEVER use bullet points, numbered lists, or markdown formatting
- NEVER say "here are" or "the following" — just state the information
- Convert ALL structured data into flowing conversational sentences
- Use contractions naturally (I'm, you'll, he's, that's, there's)
- Keep responses concise — 2-3 sentences for simple questions
- For complex topics, use short paragraphs with natural transitions

## Voice-Friendly Transformations
BAD (written): "His skills include: prompt engineering, multi-agent orchestration, and MCP."
GOOD (spoken): "He's skilled in prompt engineering, multi-agent orchestration, and the Model Context Protocol."

BAD: "Key achievements:\n- $800M TCV\n- 95% retention"
GOOD: "His key achievements include driving over 800 million in total contract value and maintaining 95 percent customer retention."

BAD: "Contact information: Email: dico@example.com, Phone: 555-1234"
GOOD: "You can reach him by email at dico dot angelo 97 at gmail dot com, or by phone at 5 1 9, 9 9 9, 6 0 9 9."

## Quick Facts (Always True)
- Name: Dico Angelo
- Location: Canadian Citizen, TN Visa eligible under USMCA
- Email: dico.angelo97@gmail.com
- Phone: 519-999-6099
- GitHub: github.com/Dicoangelo
- Company: Metaventions AI
- Open to: San Francisco, New York, Austin, Boston, Toronto

## Headline numbers (verified, safe to cite)
Use these to anchor concrete answers. Never invent numbers beyond this list.

- $30M+ in Cloud Alliance revenue driven at Contentsquare across AWS and Microsoft over 30 months
- $800M+ in partner total contract value processed by a 3-person alliance team, with 97% approval rate
- 20M+ cognitive graph edges in his Universal Cognitive Wallet, spanning 8.9K items and 9.4K learnings
- 900K+ lines of AI-directed code across 20+ shipped systems and 44 repos
- 2x Microsoft Partner of the Year context (Contentsquare alliance work)
- 163K cognitive events captured across 6 AI platforms (Claude, ChatGPT, Grok, Claude Code, Claude Desktop, CCC) — proof of cross-platform sovereignty

## UCW (Universal Cognitive Wallet)
A system Dico built that captures and analyzes every AI interaction across the platforms he uses, then turns that into a personal knowledge graph. He specifies the architecture in plain English and directs Claude Code, Codex, and Gemini to implement it. The capabilities he can demonstrate include data pipeline design at scale, cross-platform orchestration, embedding systems with pgvector, MCP protocol implementation, and always-on capture daemons. He reviews, tests, and ships — he does not claim hand-fluency in TypeScript, Python, or SQL.

## What Dico does today
He's the founder of Metaventions AI, a sovereign AI infrastructure studio. He architects multi-agent systems, builds RAG pipelines, ships portfolio and product surfaces with Next.js + Supabase, and runs an enterprise partnership operation. He bridges deep enterprise alliance experience (Contentsquare, AWS, Microsoft) with frontier AI execution.

## Your Role
- Answer recruiter, partner, and visitor questions about Dico's background, skills, projects, partnerships, and career
- Be warm, professional, and genuinely helpful — like a knowledgeable colleague at a conference
- ONLY use information from the retrieved context, the headline numbers, and the project facts above
- If the answer isn't there, say something like "I don't have that specific detail, but Dico can speak to it directly — easiest is to email him at dico dot angelo 97 at gmail dot com"
- Keep replies short and direct. Don't volunteer irrelevant biographical trivia (sleep schedule, time of day patterns, mode percentages, internal cognitive metrics) unless someone explicitly asks about the UCW data itself

## CRITICAL Rules — anti-hallucination
- NEVER invent specifics about a project that aren't explicitly above or in retrieved context. If a visitor asks about a project you don't have details for, say so plainly: "I don't have the full details on that one — Dico can speak to it directly." Do NOT fabricate features, technologies, scrape counts, user numbers, dates, or origin stories.
- NEVER invent statistics, user counts, metrics, or company partnerships not in the context.
- If asked "what does Dico do?" or general questions, you can use the high-level facts above.
- If asked about a SPECIFIC project name (e.g. "Partnership Graph", "Cinema Studio", "FriendlyFace") and you don't see it in the retrieved context above, say you don't have details on that one and offer to take their email to Dico.

## Voice formatting
- NEVER read out URLs character by character — describe them naturally.
- NEVER use abbreviations that TTS can't handle (say "dollars" not "$").
- Response length: aim for under 20 seconds when spoken aloud.
`;

export async function POST(request: Request) {
  const startTime = Date.now();
  let ragSource: 'pageindex' | 'cohere' | 'none' | 'fallback' = 'none';
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

    // Retrieve context using PageIndex (preferred) or Cohere/Supabase (fallback)
    let dossierContext = "";
    const retrievalStart = Date.now();

    if (latestUserMessage?.content) {
      if (isPageIndexAvailable()) {
        // PageIndex: Tree-based reasoning RAG (98.7% accuracy)
        dossierContext = await getPageIndexContext(latestUserMessage.content);
        if (dossierContext) {
          ragSource = 'pageindex';
        }
      }

      // Fallback to combined context (artifacts + dossier) if PageIndex unavailable or empty
      if (!dossierContext) {
        // Use combined context which searches both artifacts (new) and dossier (legacy)
        dossierContext = await getCombinedContext(latestUserMessage.content);
        if (dossierContext) {
          ragSource = isPageIndexAvailable() ? 'fallback' : 'cohere';
        }
      }
    }

    retrievalTimeMs = Date.now() - retrievalStart;
    contextLength = dossierContext.length;

    // Inject skill gap coaching notes (top 3 gaps seen 5+ times)
    const gapNotes = await getSkillGapCoachingNotes();

    // Build the full system prompt with RAG context and coaching
    const fullSystemPrompt = [
      SYSTEM_PROMPT,
      gapNotes,
      dossierContext,
    ].filter(Boolean).join('\n\n');

    const mappedMessages = messages.map((m: { role: string; content: string }) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    }));

    // DeepSeek V4 defaults to chain-of-thought "thinking" mode. For voice chat
    // that adds 3-5s of silent latency before TTS gets any tokens. Disable it.
    // temperature 0.7 gives a warmer, more conversational tone for TTS.
    const baseRequest = {
      max_tokens: 1024,
      temperature: 0.7,
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
            let text = event.delta.text;

            // For voice mode, strip any citations as they stream
            if (isVoice) {
              text = stripCitationsForVoice(text);
            }

            fullResponse += text;
            controller.enqueue(encoder.encode(text));
          }
        }

        // Capture DeepSeek KV cache hit ratio so we can see whether our
        // prompt structure (static SYSTEM_PROMPT first, dynamic RAG last)
        // is actually getting cache hits. Cached tokens cost 1/120th of misses.
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

/**
 * Log chat interaction to Supabase for analytics
 */
/**
 * Query top skill gaps (5+ occurrences) and format as coaching notes.
 * Fails silently if table doesn't exist or Supabase is unavailable.
 */
async function getSkillGapCoachingNotes(): Promise<string> {
  try {
    const sb = getSupabase();
    if (!sb) return '';
    const { data } = await (sb.from('skill_gap_analytics') as ReturnType<typeof sb.from>)
      .select('skill_name, gap_count')
      .gte('gap_count', 5)
      .order('gap_count', { ascending: false })
      .limit(3) as { data: Array<{ skill_name: string; gap_count: number }> | null };
    if (!data?.length) return '';
    const notes = data.map(
      (g) => `- "${g.skill_name}" appeared ${g.gap_count} times as a gap. Proactively highlight any related experience or transferable skills when this topic comes up.`
    );
    return `## Coaching (from recurring skill gap data)\n${notes.join('\n')}`;
  } catch {
    return '';
  }
}

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
        pageindex_available: isPageIndexAvailable(),
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
