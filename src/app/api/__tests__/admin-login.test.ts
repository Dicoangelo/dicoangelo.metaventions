import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { hashSync } from "bcryptjs";
import { ADMIN_SESSION_COOKIE, ADMIN_SESSION_DURATION, createAdminSession, verifyAdminSession } from "@/lib/admin-auth";

const mocks = vi.hoisted(() => ({
  get: vi.fn(), set: vi.fn(), delete: vi.fn(), limit: vi.fn(),
}));
vi.mock("next/headers", () => ({
  cookies: async () => ({ get: mocks.get, set: mocks.set, delete: mocks.delete }),
  headers: async () => new Headers(),
}));
vi.mock("@/lib/ratelimit", () => ({
  adminAuthRateLimit: { limit: mocks.limit }, getClientIdentifier: () => "test-client",
}));
vi.mock("@sentry/nextjs", () => ({ captureMessage: vi.fn(), captureException: vi.fn() }));
import { GET, POST } from "../admin/auth/route";

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv("ADMIN_PASSWORD", hashSync("test password", 4));
  mocks.limit.mockResolvedValue({ success: true });
});
afterEach(() => vi.unstubAllEnvs());

describe("admin login session", () => {
  it("issues a signed HTTP-only cookie after password verification", async () => {
    const response = await POST(new Request("https://example.test/api/admin/auth", {
      method: "POST", body: JSON.stringify({ password: "test password" }),
    }));
    expect(response.status).toBe(200);
    const [name, token, options] = mocks.set.mock.calls[0];
    expect(name).toBe(ADMIN_SESSION_COOKIE);
    expect(verifyAdminSession(token)).toBe(true);
    expect(options).toMatchObject({ httpOnly: true, sameSite: "strict", path: "/" });
  });

  it("does not issue a session for an invalid password", async () => {
    const response = await POST(new Request("https://example.test/api/admin/auth", {
      method: "POST", body: JSON.stringify({ password: "wrong password" }),
    }));
    expect(response.status).toBe(401);
    expect(mocks.set).not.toHaveBeenCalled();
  });

  it("uses the same signature and expiry check for the login UI", async () => {
    for (const value of [
      Buffer.from(`admin:${Date.now()}:forged`).toString("base64"),
      createAdminSession(Date.now() - ADMIN_SESSION_DURATION - 1),
    ]) {
      mocks.get.mockReturnValue({ value });
      expect((await GET()).status).toBe(401);
      expect(mocks.delete).toHaveBeenCalledWith(ADMIN_SESSION_COOKIE);
    }
    mocks.get.mockReturnValue({ value: createAdminSession() });
    const response = await GET();
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ authenticated: true });
  });
});
