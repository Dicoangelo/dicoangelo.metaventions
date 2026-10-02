import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  retrieve: vi.fn(),
  stream: vi.fn(),
  legacy: vi.fn(() => { throw new Error("Unreviewed retrieval must not be used"); }),
}));
vi.mock("@anthropic-ai/sdk", () => ({ default: class { messages = { stream: mocks.stream }; } }));
vi.mock("@/lib/dossier", () => ({ getPublicKnowledgeContext: mocks.retrieve, getCombinedContext: mocks.legacy }));
vi.mock("@/lib/pageindex", () => ({ getPageIndexContext: mocks.legacy, isPageIndexAvailable: () => true }));
vi.mock("@/lib/artifact-index", () => ({ getArtifactIndex: mocks.legacy }));
vi.mock("@/lib/ratelimit", () => ({
  chatRateLimit: { limit: async () => ({ success: true }) },
  getClientIdentifier: () => "test-visitor",
  createRateLimitHeaders: () => ({}),
}));
import { POST } from "./route";

const source = { slug: "current-role-ezra", title: "Current role: EZRA", url: "https://dicoangelo.metaventionsai.com/#timeline", reviewedAt: "2026-10-01", reviewAfter: "2026-12-30" };

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv("SUPABASE_URL", "");
  mocks.stream.mockImplementation(() => ({
    async *[Symbol.asyncIterator]() {
      yield { type: "content_block_delta", delta: { type: "text_delta", text: "Dico is Revenue Technology Manager at EZRA." } };
    },
    finalMessage: async () => ({ usage: {} }),
  }));
});

describe("chat evidence boundary", () => {
  it("uses reviewed retrieval and exposes its public references without consulting legacy indexes", async () => {
    mocks.retrieve.mockResolvedValue({ context: "Reviewed current role evidence", sources: [source], status: "ready" });
    const response = await POST(new Request("https://portfolio.test/api/chat", {
      method: "POST", body: JSON.stringify({ messages: [{ role: "user", content: "What is Dico's current role?" }] }),
    }));
    expect(await response.text()).toContain("EZRA");
    expect(response.headers.get("X-Knowledge-Status")).toBe("ready");
    expect(JSON.parse(decodeURIComponent(response.headers.get("X-Knowledge-Sources")!))).toEqual([source]);
    expect(mocks.stream.mock.calls[0][0].system).toContain("Reviewed current role evidence");
    expect(mocks.legacy).not.toHaveBeenCalled();
  });

  it("falls back to the verified profile without reopening unreviewed stores when there is no match", async () => {
    mocks.retrieve.mockResolvedValue({ context: "", sources: [], status: "no_match" });
    const response = await POST(new Request("https://portfolio.test/api/chat", {
      method: "POST", body: JSON.stringify({ messages: [{ role: "user", content: "What is an unverified client budget?" }], isVoice: true }),
    }));
    await response.text();
    expect(response.headers.get("X-RAG-Source")).toBe("verified-profile");
    expect(mocks.stream.mock.calls[0][0].system).toContain("No additional reviewed public record matched");
    expect(mocks.legacy).not.toHaveBeenCalled();
  });
});
