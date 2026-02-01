/**
 * Deepgram Token API Route
 * Returns the Deepgram API key for authenticated clients.
 * Requires valid admin session cookie.
 */

import { cookies } from "next/headers";

const SESSION_COOKIE_NAME = "jd_admin_session";

async function verifyAdminSession(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get(SESSION_COOKIE_NAME);

    if (!sessionToken) {
      return false;
    }

    const decoded = Buffer.from(sessionToken.value, "base64").toString();
    const [prefix, timestamp] = decoded.split(":");

    if (prefix !== "admin") {
      return false;
    }

    const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours
    const sessionAge = Date.now() - parseInt(timestamp, 10);

    return sessionAge <= SESSION_DURATION;
  } catch {
    return false;
  }
}

export async function GET() {
  // Verify admin authentication
  const isAuthenticated = await verifyAdminSession();
  if (!isAuthenticated) {
    return new Response(JSON.stringify({ error: "Unauthorized - admin session required" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
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
    headers: { "Content-Type": "application/json" },
  });
}
