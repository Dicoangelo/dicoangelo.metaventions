/**
 * Deepgram Token API Route
 *
 * Returns a SHORT-LIVED scoped token via Deepgram's /v1/auth/grant endpoint
 * instead of leaking the master API key to the browser. Tokens expire in 30s,
 * which is more than enough to open the listen WebSocket. Once the WS handshake
 * completes the token can expire — Deepgram keeps the connection alive.
 */

import { NextRequest } from "next/server";

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT = 20;
const RATE_WINDOW = 60 * 1000;

function getRateLimitKey(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";
  return ip;
}

function checkRateLimit(key: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const record = rateLimitMap.get(key);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + RATE_WINDOW });
    return { allowed: true, remaining: RATE_LIMIT - 1 };
  }

  if (record.count >= RATE_LIMIT) {
    return { allowed: false, remaining: 0 };
  }

  record.count++;
  return { allowed: true, remaining: RATE_LIMIT - record.count };
}

export async function GET(request: NextRequest) {
  const key = getRateLimitKey(request);
  const { allowed, remaining } = checkRateLimit(key);

  if (!allowed) {
    return new Response(
      JSON.stringify({ error: "Rate limit exceeded. Try again in a minute." }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "X-RateLimit-Remaining": "0",
          "Retry-After": "60",
        },
      }
    );
  }

  const apiKey = process.env.DEEPGRAM_API_KEY;

  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "Deepgram API key not configured" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  try {
    const grantRes = await fetch("https://api.deepgram.com/v1/auth/grant", {
      method: "POST",
      headers: {
        Authorization: `Token ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ttl_seconds: 30 }),
    });

    if (!grantRes.ok) {
      const errText = await grantRes.text().catch(() => "unknown");
      console.error("[Deepgram grant] Failed:", grantRes.status, errText);
      return new Response(
        JSON.stringify({ error: "Failed to mint Deepgram token" }),
        {
          status: 502,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const { access_token, expires_in } = (await grantRes.json()) as {
      access_token: string;
      expires_in: number;
    };

    return new Response(
      JSON.stringify({ token: access_token, expiresIn: expires_in }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "X-RateLimit-Remaining": remaining.toString(),
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (e) {
    console.error("[Deepgram grant] Exception:", e);
    return new Response(
      JSON.stringify({ error: "Failed to mint Deepgram token" }),
      {
        status: 502,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
