/**
 * Deepgram Token API Route
 * Returns the Deepgram API key for voice interactions.
 * Rate limited to prevent abuse.
 */

import { NextRequest } from "next/server";

// Simple in-memory rate limiter (resets on deploy)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT = 20; // requests per window
const RATE_WINDOW = 60 * 1000; // 1 minute

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
  // Rate limiting
  const key = getRateLimitKey(request);
  const { allowed, remaining } = checkRateLimit(key);

  if (!allowed) {
    return new Response(JSON.stringify({ error: "Rate limit exceeded. Try again in a minute." }), {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "X-RateLimit-Remaining": "0",
        "Retry-After": "60",
      },
    });
  }

  const apiKey = process.env.DEEPGRAM_API_KEY;

  if (!apiKey) {
    return new Response(JSON.stringify({ error: "Deepgram API key not configured" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ key: apiKey }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "X-RateLimit-Remaining": remaining.toString(),
      "Cache-Control": "no-store",
    },
  });
}
