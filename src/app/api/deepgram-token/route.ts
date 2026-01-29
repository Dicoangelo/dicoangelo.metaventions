/**
 * Deepgram Token API Route
 * Returns the Deepgram API key for client-side WebSocket connections.
 * In production, you'd want to implement proper authentication.
 */

export async function GET() {
  const apiKey = process.env.DEEPGRAM_API_KEY;

  if (!apiKey) {
    return new Response(JSON.stringify({ error: "Deepgram API key not configured" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ key: apiKey }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
