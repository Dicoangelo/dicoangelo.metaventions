import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { verifyAdminPassword } from "@/lib/password";

export const ADMIN_SESSION_COOKIE = "jd_admin_session";
export const ADMIN_SESSION_DURATION = 24 * 60 * 60 * 1000;

function sessionSignature(payload: string): string | null {
  const secret = process.env.ADMIN_PASSWORD;
  if (!secret) return null;
  return createHmac("sha256", secret)
    .update(`portfolio-admin-session:v1:${payload}`)
    .digest("hex");
}

export function createAdminSession(now = Date.now()): string {
  const payload = Buffer.from(JSON.stringify({
    issuedAt: now,
    expiresAt: now + ADMIN_SESSION_DURATION,
    nonce: randomBytes(32).toString("hex"),
  })).toString("base64url");
  const signature = sessionSignature(payload);
  if (!signature) throw new Error("Admin authentication not configured");
  return `v1.${payload}.${signature}`;
}

export function verifyAdminSession(token: string, now = Date.now()): boolean {
  if (token.length > 1024) return false;
  const parts = token.split(".");
  if (parts.length !== 3 || parts[0] !== "v1" || !/^[a-f0-9]{64}$/.test(parts[2])) {
    return false;
  }
  const expected = sessionSignature(parts[1]);
  if (!expected || !timingSafeEqual(Buffer.from(parts[2], "hex"), Buffer.from(expected, "hex"))) {
    return false;
  }
  try {
    const session = JSON.parse(Buffer.from(parts[1], "base64url").toString("utf8"));
    return Number.isSafeInteger(session.issuedAt)
      && Number.isSafeInteger(session.expiresAt)
      && session.issuedAt <= now
      && session.expiresAt > now
      && session.expiresAt - session.issuedAt === ADMIN_SESSION_DURATION
      && typeof session.nonce === "string"
      && /^[a-f0-9]{64}$/.test(session.nonce);
  } catch {
    return false;
  }
}

/** Authenticate every server-side read and mutation; UI login checks are insufficient. */
export async function isAdminRequest(request: Request): Promise<boolean> {
  const cookie = request.headers.get("cookie")?.split(";")
    .map(value => value.trim())
    .find(value => value.startsWith(`${ADMIN_SESSION_COOKIE}=`));
  if (cookie && verifyAdminSession(cookie.slice(ADMIN_SESSION_COOKIE.length + 1))) {
    return true;
  }

  // The CLI supplies the password, never the stored bcrypt hash itself.
  const match = request.headers.get("authorization")?.match(/^Bearer (.+)$/i);
  if (!match || match[1].length > 1024 || !process.env.ADMIN_PASSWORD) return false;
  return verifyAdminPassword(match[1], process.env.ADMIN_PASSWORD);
}

export function adminUnauthorizedResponse(): Response {
  return Response.json({ error: "Unauthorized" }, {
    status: 401,
    headers: { "Cache-Control": "private, no-store" },
  });
}
