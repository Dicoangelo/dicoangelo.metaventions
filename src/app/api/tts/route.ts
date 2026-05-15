/**
 * TTS Route — xAI Custom Voices primary, ElevenLabs Mike fallback.
 *
 * Provider selection:
 *   1. If XAI_API_KEY is set → use xAI /v1/tts (newer, supports custom-cloned voice)
 *   2. Else if ELEVENLABS_API_KEY is set → fall back to ElevenLabs Mike
 *   3. Else → 503
 *
 * Voice ID resolution for xAI:
 *   - XAI_VOICE_ID env var if set (use this for Dico's cloned voice once minted)
 *   - Falls back to "eve" stock voice so the site works before cloning
 *
 * To put Dico's actual voice on the site:
 *   1. Record ~1 min of clean audio in xAI console (with verification phrase)
 *   2. Copy the resulting voice_id
 *   3. Set XAI_VOICE_ID=<id> in Vercel env
 *   4. Redeploy — no code change needed.
 */

import { NextRequest } from "next/server";
import { ttsRateLimit, getClientIdentifier, createRateLimitHeaders } from "@/lib/ratelimit";
import { ttsSchema, validateRequest } from "@/lib/schemas";

const ELEVENLABS_VOICES = {
  MIKE: "TX3LPaxmHKxFdv7VOQHJ",
  PERRI: "21m00Tcm4TlvDq8ikWAM",
};

async function synthesizeWithXAI(text: string): Promise<Response> {
  const apiKey = process.env.XAI_API_KEY!;
  const voiceId = process.env.XAI_VOICE_ID || "eve";
  const language = process.env.XAI_VOICE_LANGUAGE || "en";

  const response = await fetch("https://api.x.ai/v1/tts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      Accept: "audio/mpeg",
    },
    body: JSON.stringify({
      text,
      voice_id: voiceId,
      language,
    }),
  });

  if (!response.ok) {
    const err = await response.text().catch(() => "unknown");
    console.error("[xAI TTS] Failed:", response.status, err);
    throw new Error(`xAI TTS failed: ${response.status}`);
  }

  const audioBuffer = await response.arrayBuffer();
  return new Response(audioBuffer, {
    headers: {
      "Content-Type": "audio/mpeg",
      "Cache-Control": "no-cache",
      "X-TTS-Provider": "xai",
      "X-TTS-Voice": voiceId,
    },
  });
}

async function synthesizeWithElevenLabs(text: string): Promise<Response> {
  const apiKey = process.env.ELEVENLABS_API_KEY!;
  const voiceId = process.env.ELEVENLABS_VOICE_ID || ELEVENLABS_VOICES.MIKE;

  // /stream endpoint + optimize_streaming_latency=3 returns the first audio bytes
  // ~400ms sooner than the buffered endpoint. We proxy ElevenLabs' ReadableStream
  // straight back to the browser so playback can start before synthesis finishes.
  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream?optimize_streaming_latency=3&output_format=mp3_22050_32`,
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

  if (!response.ok || !response.body) {
    const err = await response.text().catch(() => "unknown");
    console.error("[ElevenLabs] Failed:", response.status, err);
    throw new Error("ElevenLabs TTS failed");
  }

  return new Response(response.body, {
    headers: {
      "Content-Type": "audio/mpeg",
      "Cache-Control": "no-cache",
      "X-TTS-Provider": "elevenlabs",
      "X-TTS-Voice": voiceId,
      "Transfer-Encoding": "chunked",
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const identifier = getClientIdentifier(request.headers as any);
    const { success, limit, remaining, reset } = await ttsRateLimit.limit(identifier);

    if (!success) {
      return new Response(
        JSON.stringify({
          error: "Rate limit exceeded. Please wait a moment before trying again.",
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
    const validation = validateRequest(ttsSchema, body);
    if (!validation.success) {
      return new Response(JSON.stringify({ error: validation.error }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { text } = validation.data;

    const hasXAI = !!process.env.XAI_API_KEY;
    const hasEleven = !!process.env.ELEVENLABS_API_KEY;

    if (!hasXAI && !hasEleven) {
      return new Response("TTS not configured", { status: 503 });
    }

    // Explicit provider selection via TTS_PROVIDER env (elevenlabs | xai).
    // ElevenLabs is the production default — it hosts Dico's actual cloned voice.
    // xAI is kept wired for future use (Voice Agent migration, alternate clones).
    const preferred = (process.env.TTS_PROVIDER || "elevenlabs").toLowerCase();
    const tryXAIFirst = preferred === "xai" && hasXAI;
    const tryElevenFirst = preferred === "elevenlabs" && hasEleven;

    if (tryElevenFirst) {
      try {
        return await synthesizeWithElevenLabs(text);
      } catch (e) {
        console.warn("[TTS] ElevenLabs failed, falling back to xAI:", e);
        if (!hasXAI) {
          return new Response("TTS generation failed", { status: 502 });
        }
        return await synthesizeWithXAI(text);
      }
    }

    if (tryXAIFirst) {
      try {
        return await synthesizeWithXAI(text);
      } catch (e) {
        console.warn("[TTS] xAI failed, falling back to ElevenLabs:", e);
        if (!hasEleven) {
          return new Response("TTS generation failed", { status: 502 });
        }
        return await synthesizeWithElevenLabs(text);
      }
    }

    // Default fallback when no preference and only one provider configured.
    return hasEleven
      ? await synthesizeWithElevenLabs(text)
      : await synthesizeWithXAI(text);
  } catch (error) {
    console.error("TTS error:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
