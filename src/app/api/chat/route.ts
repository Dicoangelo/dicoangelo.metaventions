import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@supabase/supabase-js";
import { getDossierContext, getCombinedContext } from "@/lib/dossier";
import { getPageIndexContext, isPageIndexAvailable, stripCitationsForVoice } from "@/lib/pageindex";
import { chatRateLimit, getClientIdentifier, createRateLimitHeaders } from "@/lib/ratelimit";
import { chatMessageSchema, validateRequest } from "@/lib/schemas";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

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
BAD (written): "His skills include: React, TypeScript, and Python."
GOOD (spoken): "He's skilled in React, TypeScript, and Python."

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

## Your Role
- Answer questions about Dico's background, skills, projects, and career
- Be warm, professional, and genuinely helpful
- ONLY use information from the retrieved context
- If the context doesn't have the answer, say "I don't have that specific information, but you can reach out to Dico directly"

## CRITICAL Rules
- NEVER invent statistics, user counts, or metrics not in the context
- NEVER read out URLs character by character — describe them naturally
- NEVER use abbreviations that TTS can't handle (use "dollars" not "$")
- Response length: aim for under 20 seconds when spoken aloud
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

    // Build the full system prompt with RAG context
    const fullSystemPrompt = dossierContext
      ? `${SYSTEM_PROMPT}\n\n${dossierContext}`
      : SYSTEM_PROMPT;

    const stream = await anthropic.messages.stream({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: fullSystemPrompt,
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    });

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

        // Log to Supabase after streaming completes (non-blocking)
        logChatToSupabase({
          query,
          ragSource,
          retrievalTimeMs,
          contextLength,
          responsePreview: fullResponse.substring(0, 200),
          clientIp: identifier,
          isVoice: isVoiceRequest,
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
async function logChatToSupabase(data: {
  query: string;
  ragSource: string;
  retrievalTimeMs: number;
  contextLength: number;
  responsePreview: string;
  clientIp: string;
  isVoice: boolean;
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
      },
    } as Record<string, unknown>);
  } catch (err) {
    // Silent fail - don't break chat for logging errors
    console.error('Failed to log chat:', err);
  }
}
