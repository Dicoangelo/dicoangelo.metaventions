import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { hashSync } from "bcryptjs";
import {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_DURATION,
  createAdminSession,
  isAdminRequest,
  verifyAdminSession,
} from "../admin-auth";

const password = "local test password only";
const passwordHash = hashSync(password, 4);

beforeEach(() => vi.stubEnv("ADMIN_PASSWORD", passwordHash));
afterEach(() => vi.unstubAllEnvs());

describe("signed admin sessions", () => {
  it("accepts an issued session and rejects it at expiry or before issuance", () => {
    const now = Date.now();
    const session = createAdminSession(now);
    expect(verifyAdminSession(session, now)).toBe(true);
    expect(verifyAdminSession(session, now + ADMIN_SESSION_DURATION - 1)).toBe(true);
    expect(verifyAdminSession(session, now + ADMIN_SESSION_DURATION)).toBe(false);
    expect(verifyAdminSession(session, now - 1)).toBe(false);
  });

  it.each(["not-a-time", String(Date.now() + 86_400_000), String(Date.now())])(
    "rejects an unsigned legacy cookie with timestamp %s", timestamp => {
      const forged = Buffer.from(`admin:${timestamp}:attacker-chosen-token`).toString("base64");
      expect(verifyAdminSession(forged)).toBe(false);
    },
  );

  it("rejects payload tampering, malformed signatures, and credential rotation", () => {
    const session = createAdminSession();
    const [version, payload, signature] = session.split(".");
    const decoded = JSON.parse(Buffer.from(payload, "base64url").toString());
    decoded.expiresAt += ADMIN_SESSION_DURATION;
    const changed = Buffer.from(JSON.stringify(decoded)).toString("base64url");
    expect(verifyAdminSession(`${version}.${changed}.${signature}`)).toBe(false);
    expect(verifyAdminSession(`${version}.${payload}.short`)).toBe(false);
    vi.stubEnv("ADMIN_PASSWORD", hashSync("new test password", 4));
    expect(verifyAdminSession(session)).toBe(false);
  });

  it("fails closed without configured authentication", async () => {
    const session = createAdminSession();
    vi.stubEnv("ADMIN_PASSWORD", "");
    expect(verifyAdminSession(session)).toBe(false);
    expect(() => createAdminSession()).toThrow("not configured");
    expect(await isAdminRequest(new Request("https://example.test"))).toBe(false);
  });

  it("authenticates a signed cookie or the CLI password, never the stored hash", async () => {
    const request = (headers: HeadersInit) => new Request("https://example.test", { headers });
    expect(await isAdminRequest(request({ cookie: `${ADMIN_SESSION_COOKIE}=${createAdminSession()}` }))).toBe(true);
    expect(await isAdminRequest(request({ authorization: `Bearer ${password}` }))).toBe(true);
    expect(await isAdminRequest(request({ authorization: `Bearer ${passwordHash}` }))).toBe(false);
    expect(await isAdminRequest(request({ authorization: "Bearer wrong-password" }))).toBe(false);
  });
});
