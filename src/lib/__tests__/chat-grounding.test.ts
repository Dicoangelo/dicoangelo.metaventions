import { describe, expect, it } from "vitest";
import { buildGroundedChatPrompt, buildKnowledgeQuery } from "../chat-grounding";
import { parseChatSources } from "../chat-sources";

describe("public chat grounding", () => {
  it("uses the preceding visitor topic for a follow-up without retrieving model-invented claims", () => {
    const query = buildKnowledgeQuery([
      { role: "user", content: "Tell me about Partnership Graph." },
      { role: "assistant", content: "Fabricated customer and revenue claim." },
      { role: "user", content: "Is that used in production?" },
    ]);
    expect(query).toContain("Partnership Graph");
    expect(query).toContain("production");
    expect(query).not.toContain("Fabricated");
  });

  it("does not carry an unrelated earlier topic into a new question", () => {
    expect(buildKnowledgeQuery([
      { role: "user", content: "Tell me about Partnership Graph." },
      { role: "user", content: "What is Dico's current role at EZRA?" },
    ])).toBe("What is Dico's current role at EZRA?");
  });

  it("keeps career corrections and governing rules after retrieved content", () => {
    const prompt = buildGroundedChatPrompt("A record claims a main-conference paper.", false);
    expect(prompt.lastIndexOf("LP4FM workshop poster, not a main-conference paper")).toBeGreaterThan(prompt.indexOf("A record claims"));
    expect(prompt).toContain("Conversation history helps resolve references; it is not independent evidence");
    expect(prompt).toContain("registered pipeline value, not closed revenue");
  });

  it("acknowledges an empty evidence match without inventing supporting sources", () => {
    const prompt = buildGroundedChatPrompt("", true);
    expect(prompt).toContain("No additional reviewed public record matched");
    expect(prompt).toContain("reading URLs aloud");
  });
});

describe("public source links", () => {
  const source = { slug: "research", title: "Accepted workshop poster", url: "https://openreview.net/forum?id=1E20ig92Zi", reviewedAt: "2026-10-01", reviewAfter: "2026-12-30" };
  it("accepts structured evidence metadata from a response", () => {
    expect(parseChatSources(encodeURIComponent(JSON.stringify([source])))).toEqual([source]);
  });
  it("rejects unsafe links and malformed metadata from restored history", () => {
    expect(parseChatSources([
      { ...source, url: "javascript:alert(1)" },
      { ...source, url: "https://secret:password@example.com" },
      { ...source, title: 12 },
    ])).toEqual([]);
    expect(parseChatSources("broken%encoded")).toEqual([]);
  });
});
