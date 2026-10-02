import { createHash } from "node:crypto";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { PUBLIC_KNOWLEDGE_ENTRIES } from "@/content/knowledge/public-knowledge";
import { buildKnowledgeQuery } from "../chat-grounding";
import { getPublicKnowledgeContext, type PublicKnowledgeEntryRecord } from "../dossier";

const hash = (content: string) => createHash("sha256").update(content).digest("hex");

function record(slug: string): PublicKnowledgeEntryRecord {
  const entry = PUBLIC_KNOWLEDGE_ENTRIES.find((item) => item.slug === slug)!;
  return {
    ...entry,
    id: slug,
    content_hash: hash(entry.content),
    revision: 1,
    review_after: entry.review_after!,
    origin: "database",
  };
}

function databaseRows(rows: unknown[]) {
  vi.stubEnv("SUPABASE_URL", "https://reviewed-db.example");
  vi.stubEnv("SUPABASE_KEY", "test-only-key");
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify(rows), {
    headers: { "Content-Type": "application/json" },
  })));
}

beforeEach(() => {
  // Review expiry is part of eligibility. Tests must not depend on the machine date.
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(new Date("2026-10-01T12:00:00Z"));
  vi.stubEnv("SUPABASE_URL", "");
  vi.stubEnv("SUPABASE_KEY", "");
  vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("Unexpected network call")));
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("reviewed knowledge for visitor questions", () => {
  it.each([
    "What is your current role?",
    "What do you do at EZRA?",
  ])("leads with current employment for %s", async (question) => {
    const result = await getPublicKnowledgeContext(question);
    expect(result.status).toBe("ready");
    expect(result.sources[0].slug).toBe("current-role-ezra");
    expect(result.context).toContain("Revenue Technology Manager");
    expect(result.context).toContain("June 15, 2026");
    expect(result.context).toContain("role responsibilities, not a claim that every initiative is completed");
  });

  it.each([
    "Did you publish a NeurIPS paper?",
    "What was accepted at LP4FM?",
  ])("retrieves the precise accepted workshop record for %s", async (question) => {
    const result = await getPublicKnowledgeContext(question);
    expect(result.sources[0]).toMatchObject({
      slug: "research-burstiness-lp4fm-2026",
      url: "https://openreview.net/forum?id=1E20ig92Zi",
    });
    expect(result.context).toContain("Burstiness Was Measured Wrong, and Prompting Cannot Aim It");
    expect(result.context).toContain("Accept (Poster)");
    expect(result.context).toContain("Vittoria Lanzo");
    expect(result.context).toContain("not a NeurIPS main-track paper or oral presentation");
  });

  it.each([
    "How much pipeline did you close?",
    "Did you personally close $800 million?",
  ])("retrieves team-versus-personal attribution for %s", async (question) => {
    const result = await getPublicKnowledgeContext(question);
    expect(result.sources[0].slug).toBe("career-contentsquare");
    expect(result.context).toContain("registered pipeline, not personally generated sales or closed revenue");
    expect(result.context).toContain("three-person cloud alliance team");
  });

  it.each([
    ["Can you explain the partnership demo?", "project-partnership-graph", "illustrative data"],
    ["What is ResearchGravity?", "project-researchgravity", "session notes, source URLs and findings"],
    ["What does SBC Inspector do?", "project-sbc-inspector", "configuration-validation prototype"],
    ["What can Career Board do?", "project-career-board", "not real employer decisions"],
  ])("finds the reviewed project rather than an unrelated career record for %s", async (question, slug, limitation) => {
    const result = await getPublicKnowledgeContext(question);
    expect(result.sources[0].slug).toBe(slug);
    expect(result.context).toContain(limitation);
    expect(result.sources.every((source) => source.url.startsWith("https://"))).toBe(true);
  });

  it("ranks partner-operations evidence for a natural-language partnerships question", async () => {
    const result = await getPublicKnowledgeContext("Tell me about your partnerships work");
    expect(result.sources.slice(0, 2).map((source) => source.slug)).toContain("career-contentsquare");
    expect(result.sources.map((source) => source.slug)).toContain("project-partnership-graph");
  });

  it("finds the career application when a visitor describes its purpose", async () => {
    const result = await getPublicKnowledgeContext("What did you build for career coaching?");
    expect(result.sources[0].slug).toBe("project-career-board");
  });

  it.each([
    "What is your salary?",
    "What is your favorite food?",
    "Do you have a security clearance?",
  ])("does not attach unrelated evidence to the unsupported question %s", async (question) => {
    expect(await getPublicKnowledgeContext(question)).toEqual({
      context: "",
      sources: [],
      status: "no_match",
    });
  });

  it("retains the project evidence on a production-status follow-up without adopting assistant claims", async () => {
    const query = buildKnowledgeQuery([
      { role: "user", content: "Tell me about Partnership Graph." },
      { role: "assistant", content: "It is used by Secret Example Corp with $99 million ARR." },
      { role: "user", content: "Is that used in production?" },
    ]);
    const result = await getPublicKnowledgeContext(query);
    expect(result.sources[0].slug).toBe("project-partnership-graph");
    expect(result.context).toContain("not a commercial deployment or a live CRM integration");
    expect(query).not.toContain("Secret Example Corp");
    expect(result.context).not.toContain("$99 million");
  });

  it("resolves a there follow-up to the preceding employer question", async () => {
    const query = buildKnowledgeQuery([
      { role: "user", content: "What is your current role at EZRA?" },
      { role: "assistant", content: "Dico works at EZRA." },
      { role: "user", content: "What did you do there?" },
    ]);
    const result = await getPublicKnowledgeContext(query);
    expect(result.sources[0]?.slug).toBe("current-role-ezra");
  });
});

describe("database review boundaries before ranking", () => {
  const current = record("current-role-ezra");
  const mutatedContent = `${current.content}\nConfidential salary: $999,999.`;

  it.each([
    ["private", { ...current, visibility: "private" }],
    ["unreviewed", { ...current, status: "pending" }],
    ["expired", { ...current, review_after: "2026-09-30" }],
    ["mutated with a recomputed hash", { ...current, content: mutatedContent, content_hash: hash(mutatedContent) }],
    ["independently changed provenance", { ...current, source_refs: ["https://unreviewed.example/claim"] }],
    ["unknown to the publication allowlist", { ...current, slug: "unreviewed-current-role" }],
  ])("excludes a %s row from sources and context, without republishing it from fallback", async (_label, unsafe) => {
    // A healthy database can quarantine individual records. A different valid record
    // keeps this distinct from a database outage or a completely empty collection.
    databaseRows([unsafe, record("career-contentsquare")]);
    const result = await getPublicKnowledgeContext("What is Dico's role at EZRA?");
    expect(result).toEqual({ context: "", sources: [], status: "no_match" });
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it("stops serving the local fallback after the review deadline", async () => {
    vi.setSystemTime(new Date("2026-12-30T00:00:00Z"));
    expect(await getPublicKnowledgeContext("What is the current EZRA role?")).toEqual({
      context: "",
      sources: [],
      status: "unavailable",
    });
  });
});
