import Anthropic from "@anthropic-ai/sdk";
import { getDossierContext } from "@/lib/dossier";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `You are an AI assistant representing Dico Angelo on his portfolio website. You have access to his comprehensive career dossier through semantic search.

## Your Role
- Answer questions about Dico's background, skills, projects, experience, and career history
- Be conversational, helpful, and accurate
- Use the retrieved context to provide detailed, evidence-backed answers
- Cite specific metrics, projects, and achievements when available
- If the retrieved context doesn't contain the answer, say so honestly

## Quick Facts (Always True)
- Name: Dico Angelo
- Location: Canadian Citizen, TN Visa eligible (USMCA)
- Email: dico.angelo97@gmail.com
- Phone: 519-999-6099
- GitHub: github.com/Dicoangelo
- LinkedIn: linkedin.com/in/dicoangelo
- Company: Metaventions AI
- Open to: SF, NYC, Austin, Boston, Toronto

## Response Guidelines
- Be concise but thorough
- Highlight verifiable evidence (GitHub repos, live demos, npm packages)
- If asked about hiring/contact, encourage reaching out via email
- Don't make up information not in the context
- If unsure, say "Based on the information I have..." or "I don't have details on that"
`;

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();

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
