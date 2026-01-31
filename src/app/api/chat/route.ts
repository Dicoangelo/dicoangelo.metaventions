import Anthropic from "@anthropic-ai/sdk";
import { getDossierContext } from "@/lib/dossier";
import { chatRateLimit, getClientIdentifier, createRateLimitHeaders } from "@/lib/ratelimit";
import { chatMessageSchema, validateRequest } from "@/lib/schemas";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `You are an AI assistant representing Dico Angelo on his portfolio website. You have access to his comprehensive career dossier through semantic search.

## Your Role
- Answer questions about Dico's background, skills, projects, experience, and career history
- Be conversational, helpful, and accurate
- ONLY use information from the retrieved context below
- If the retrieved context doesn't contain the answer, say "I don't have that information in my records"

## Quick Facts (Always True)
- Name: Dico Angelo
- Location: Canadian Citizen, TN Visa eligible (USMCA)
- Email: dico.angelo97@gmail.com
- Phone: 519-999-6099
- GitHub: github.com/Dicoangelo
- LinkedIn: linkedin.com/in/dicoangelo
- Company: Metaventions AI
- Open to: SF, NYC, Austin, Boston, Toronto

## CRITICAL Rules
- NEVER invent statistics, user counts, or metrics not explicitly in the context
- NEVER say "thousands of users" or similar unless that exact phrase appears in context
- If asked about something not in context, say "I don't have specific information about that"
- Keep responses concise (2-3 sentences for simple questions)
- For voice: responses should be speakable in under 30 seconds
`;

export async function POST(request: Request) {
  try {
    // Rate limiting check
    const identifier = getClientIdentifier(request.headers as any);
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

    const { messages } = validation.data;

    // Get the latest user message for RAG query
    const latestUserMessage = messages
      .filter((m: { role: string }) => m.role === "user")
      .pop();

    // Retrieve relevant context from the career dossier
    let dossierContext = "";
    if (latestUserMessage?.content) {
      dossierContext = await getDossierContext(latestUserMessage.content);
    }

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
    const readable = new ReadableStream({
      async start(controller) {
        for await (const event of stream) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        controller.close();
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response(JSON.stringify({ error: "Failed to process request" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
