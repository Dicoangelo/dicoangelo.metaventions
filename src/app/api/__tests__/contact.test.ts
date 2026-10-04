import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const mocks = vi.hoisted(() => ({ limit: vi.fn(), fetch: vi.fn() }));
vi.mock("@/lib/ratelimit", () => ({
  contactRateLimit: { limit: mocks.limit },
  getClientIdentifier: () => "test-client",
  createRateLimitHeaders: () => ({ "X-RateLimit-Limit": "3" }),
}));
import { POST } from "../contact/route";

const validMessage = {
  name: "  A Visitor  ",
  email: "  visitor@example.com  ",
  message: "  Hello Dico, let's discuss a project.  ",
};
const request = (body: unknown = validMessage, headers?: HeadersInit) => new NextRequest("https://example.test/api/contact", {
  method: "POST", headers, body: JSON.stringify(body),
});

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubGlobal("fetch", mocks.fetch);
  vi.stubEnv("RESEND_API_KEY", "test-key");
  vi.stubEnv("CONTACT_FROM_EMAIL", "Portfolio <website@example.com>");
  vi.stubEnv("CONTACT_TO_EMAIL", "");
  vi.spyOn(console, "error").mockImplementation(() => {});
  mocks.limit.mockResolvedValue({ success: true, limit: 3, remaining: 2, reset: Date.now() + 60_000 });
  mocks.fetch.mockResolvedValue(new Response(JSON.stringify({ id: "accepted-email-id" }), { status: 200 }));
});
afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("contact email delivery", () => {
  it("sends trimmed content to Dico's Gmail with the visitor as Reply-To", async () => {
    const response = await POST(request());
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ success: true });
    expect(mocks.limit).toHaveBeenCalledWith("contact:test-client");
    const [url, options] = mocks.fetch.mock.calls[0];
    expect(url).toBe("https://api.resend.com/emails");
    expect(options.headers.Authorization).toBe("Bearer test-key");
    expect(JSON.parse(options.body)).toEqual({
      from: "Portfolio <website@example.com>",
      to: ["dico.angelo97@gmail.com"],
      reply_to: "visitor@example.com",
      subject: "New message from dicoangelo.metaventionsai.com",
      text: "Name: A Visitor\nEmail: visitor@example.com\n\nHello Dico, let's discuss a project.",
    });
  });

  it("uses the configured recipient and keeps visitor HTML in plain text", async () => {
    vi.stubEnv("CONTACT_TO_EMAIL", "dicoangelo@metaventionsai.com");
    await POST(request({ ...validMessage, message: '<script>alert("x")</script>' }));
    const body = JSON.parse(mocks.fetch.mock.calls[0][1].body);
    expect(body.to).toEqual(["dicoangelo@metaventionsai.com"]);
    expect(body.text).toContain('<script>alert("x")</script>');
    expect(body).not.toHaveProperty("html");
  });

  it.each([
    null,
    { ...validMessage, name: 1 },
    { ...validMessage, name: " " },
    { ...validMessage, name: "a".repeat(101) },
    { ...validMessage, email: "invalid" },
    { ...validMessage, email: "visitor@example.com\r\nBcc: attacker@example.com" },
    { ...validMessage, message: "short" },
    { ...validMessage, message: "a".repeat(5001) },
  ])("rejects invalid input before calling the provider (%j)", async (input) => {
    expect((await POST(request(input))).status).toBe(400);
    expect(mocks.fetch).not.toHaveBeenCalled();
  });

  it("rejects malformed JSON", async () => {
    const response = await POST(new NextRequest("https://example.test/api/contact", { method: "POST", body: "{" }));
    expect(response.status).toBe(400);
    expect(mocks.fetch).not.toHaveBeenCalled();
  });

  it("rejects an oversized body with and without a declared content length", async () => {
    for (const headers of [undefined, { "content-length": "40000" }]) {
      expect((await POST(request({ ...validMessage, extra: "a".repeat(40000) }, headers))).status).toBe(413);
    }
    expect(mocks.fetch).not.toHaveBeenCalled();
  });

  it.each(["RESEND_API_KEY", "CONTACT_FROM_EMAIL"])("does not claim success without %s", async (key) => {
    vi.stubEnv(key, "");
    const response = await POST(request());
    expect(response.status).toBe(503);
    expect(await response.json()).not.toHaveProperty("success");
    expect(mocks.fetch).not.toHaveBeenCalled();
  });

  it("returns a rate limit response without sending email", async () => {
    mocks.limit.mockResolvedValue({ success: false, limit: 3, remaining: 0, reset: Date.now() + 60_000 });
    const response = await POST(request());
    expect(response.status).toBe(429);
    expect(Number(response.headers.get("Retry-After"))).toBeGreaterThan(0);
    expect(mocks.fetch).not.toHaveBeenCalled();
  });

  it.each([
    [403, { message: "Internal provider details" }],
    [500, { id: "unreliable-id" }],
    [200, {}],
    [200, { id: "" }],
  ])("requires a successful provider response and receipt (%s, %j)", async (status, body) => {
    mocks.fetch.mockResolvedValue(new Response(JSON.stringify(body), { status }));
    const response = await POST(request());
    expect(response.status).toBe(502);
    expect(await response.text()).not.toContain("Internal provider details");
  });

  it("reports network failure without exposing provider details or message content", async () => {
    mocks.fetch.mockRejectedValue(new Error("secret provider details"));
    const response = await POST(request());
    expect(response.status).toBe(502);
    expect(await response.text()).not.toContain("secret provider details");
    expect(console.error).toHaveBeenCalledWith("Contact email delivery request failed.");
  });
});
