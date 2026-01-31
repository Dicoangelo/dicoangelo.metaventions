import { NextRequest } from "next/server";
import { ttsRateLimit, getClientIdentifier, createRateLimitHeaders } from "@/lib/ratelimit";
import { ttsSchema, validateRequest } from "@/lib/schemas";

// ElevenLabs voice IDs
const VOICES = {
  MIKE: "TX3LPaxmHKxFdv7VOQHJ", // Male, narrative
  PERRI: "21m00Tcm4TlvDq8ikWAM", // Female, clear
};

export async function POST(request: NextRequest) {
  try {
    // Rate limiting check
    const identifier = getClientIdentifier(request.headers as any);
    const { success, limit, remaining, reset } = await ttsRateLimit.limit(identifier);

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
    const validation = validateRequest(ttsSchema, body);
    if (!validation.success) {
      return new Response(
        JSON.stringify({ error: validation.error }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const { text } = validation.data;

    const apiKey = process.env.ELEVENLABS_API_KEY;

    if (!apiKey) {
      // Fallback - return empty audio so client can use browser TTS
      return new Response("TTS not configured", { status: 503 });
    }

    // Use Mike voice for Dico's persona
    const voiceId = VOICES.MIKE;

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: "POST",
        headers: {
          Accept: "audio/mpeg",
          "Content-Type": "application/json",
          "xi-api-key": apiKey,
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_turbo_v2_5",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
            style: 0.3,
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: "Unknown error" }));
      console.error("ElevenLabs error:", error);
      return new Response("TTS generation failed", { status: 500 });
    }

    const audioBuffer = await response.arrayBuffer();

    return new Response(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    console.error("TTS error:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
