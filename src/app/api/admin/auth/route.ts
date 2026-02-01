import { cookies, headers } from "next/headers";
import { randomBytes } from "crypto";
import { adminAuthRateLimit, getClientIdentifier } from "@/lib/ratelimit";
import { verifyAdminPassword } from "@/lib/password";
import * as Sentry from "@sentry/nextjs";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const SESSION_COOKIE_NAME = "jd_admin_session";
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export async function POST(request: Request) {
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

  if (!ADMIN_PASSWORD) {
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

    // Use password verification utility (supports both plaintext and bcrypt hashes)
    const isValid = await verifyAdminPassword(password, ADMIN_PASSWORD);

    if (!isValid) {
      Sentry.captureMessage(`Failed admin authentication attempt from ${identifier}`, 'warning');
      return new Response(
        JSON.stringify({ error: "Invalid password" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    // Create a cryptographically secure session token using randomBytes
    const sessionToken = randomBytes(32).toString("hex");
    const tokenWithMetadata = Buffer.from(
      `admin:${Date.now()}:${sessionToken}`
    ).toString("base64");

    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, tokenWithMetadata, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: SESSION_DURATION / 1000,
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
  cookieStore.delete(SESSION_COOKIE_NAME);

  return new Response(
    JSON.stringify({ success: true }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}

// Verify session
export async function GET() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(SESSION_COOKIE_NAME);

  if (!sessionToken) {
    return new Response(
      JSON.stringify({ authenticated: false }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const decoded = Buffer.from(sessionToken.value, "base64").toString();
    const [prefix, timestamp] = decoded.split(":");

    if (prefix !== "admin") {
      throw new Error("Invalid session");
    }

    const sessionAge = Date.now() - parseInt(timestamp, 10);
    if (sessionAge > SESSION_DURATION) {
      cookieStore.delete(SESSION_COOKIE_NAME);
      return new Response(
        JSON.stringify({ authenticated: false, reason: "Session expired" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ authenticated: true }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch {
    return new Response(
      JSON.stringify({ authenticated: false }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }
}
