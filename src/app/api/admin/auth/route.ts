import { cookies, headers } from "next/headers";
import { ADMIN_SESSION_COOKIE, ADMIN_SESSION_DURATION, createAdminSession, verifyAdminSession } from "@/lib/admin-auth";
import { adminAuthRateLimit, getClientIdentifier } from "@/lib/ratelimit";
import { verifyAdminPassword } from "@/lib/password";
import * as Sentry from "@sentry/nextjs";

export async function POST(request: Request) {
  const adminPassword = process.env.ADMIN_PASSWORD;
  // Apply rate limiting (3 attempts per minute)
  const headersList = await headers();
  const identifier = getClientIdentifier(headersList);
  const { success } = await adminAuthRateLimit.limit(identifier);

  if (!success) {
    Sentry.captureMessage(`Admin auth rate limit exceeded for ${identifier}`, 'warning');
    return new Response(
      JSON.stringify({ error: "Too many authentication attempts. Try again later." }),
      { status: 429, headers: { "Content-Type": "application/json" } }
    );
  }

  if (!adminPassword) {
    Sentry.captureMessage('Admin authentication not configured', 'error');
    return new Response(
      JSON.stringify({ error: "Admin authentication not configured" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const { password } = await request.json();

    if (!password || typeof password !== 'string') {
      return new Response(
        JSON.stringify({ error: "Invalid request" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const isValid = await verifyAdminPassword(password, adminPassword);

    if (!isValid) {
      Sentry.captureMessage(`Failed admin authentication attempt from ${identifier}`, 'warning');
      return new Response(
        JSON.stringify({ error: "Invalid password" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const cookieStore = await cookies();
    cookieStore.set(ADMIN_SESSION_COOKIE, createAdminSession(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: ADMIN_SESSION_DURATION / 1000,
      path: "/",
    });

    Sentry.captureMessage(`Successful admin authentication from ${identifier}`, 'info');

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    Sentry.captureException(error);
    console.error("Admin auth error:", error);
    return new Response(
      JSON.stringify({ error: "Authentication failed" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE);

  return new Response(
    JSON.stringify({ success: true }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}

// Verify session
export async function GET() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(ADMIN_SESSION_COOKIE);
  const authenticated = !!sessionToken && verifyAdminSession(sessionToken.value);
  if (sessionToken && !authenticated) cookieStore.delete(ADMIN_SESSION_COOKIE);
  return Response.json({ authenticated }, {
    status: authenticated ? 200 : 401,
    headers: { "Cache-Control": "private, no-store" },
  });
}
