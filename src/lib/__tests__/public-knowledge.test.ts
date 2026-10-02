import { afterEach, describe, expect, it, vi } from "vitest";
import { PUBLIC_KNOWLEDGE_ENTRIES } from "@/content/knowledge/public-knowledge";
import { getPublicKnowledgeContext, getPublicKnowledgeEntries, isEligiblePublicKnowledge, rankPublicKnowledge } from "../dossier";
import { isPageIndexAvailable, retrieveFromPageIndex } from "../pageindex";

afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); });
async function local() { vi.stubEnv("SUPABASE_URL", ""); return getPublicKnowledgeEntries(); }
describe("reviewed public knowledge", () => {
  it("covers the reviewed pack without stale legacy retrieval", async () => {
    const entries = await local();
    expect(entries).toHaveLength(PUBLIC_KNOWLEDGE_ENTRIES.length);
    expect(entries.every((entry) => isEligiblePublicKnowledge(entry))).toBe(true);
    expect(entries.every((entry) => entry.id === entry.slug)).toBe(true);
    expect(rankPublicKnowledge("current role EZRA", entries)[0].slug).toBe("current-role-ezra");
    expect(rankPublicKnowledge("NeurIPS LP4FM burstiness accepted poster", entries)[0].slug).toBe("research-burstiness-lp4fm-2026");
  });
  it("rejects private, unreviewed, expired, altered and independently rewritten metadata", async () => {
    const [entry] = await local();
    for (const change of [{ visibility: "private" }, { status: "pending" }, { review_after: "2026-09-01" }, { reviewed_at: "2999-01-01" }, { content: "Fabricated result" }, { title: "Fabricated title" }, { summary: "Fabricated metric" }, { source_refs: [] }, { content_hash: "wrong" }]) {
      expect(isEligiblePublicKnowledge({ ...entry, ...change })).toBe(false);
    }
    expect(isEligiblePublicKnowledge(entry, Date.parse("2027-01-01"))).toBe(false);
  });
  it("binds database dates, content and metadata to the current local review manifest", async () => {
    const entries = await local();
    vi.stubEnv("SUPABASE_URL", "https://db.example"); vi.stubEnv("SUPABASE_KEY", "test");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => [
      { ...entries[0], reviewed_at: "2026-10-01T00:00:00+00:00", review_after: "2026-12-30T00:00:00+00:00" },
      { ...entries[1], summary: "Unreviewed summary" },
    ] }));
    expect((await getPublicKnowledgeEntries()).map((entry) => entry.slug)).toEqual([entries[0].slug]);
  });
  it("keeps database quarantines effective and uses reviewed fallback only on unavailable service", async () => {
    vi.stubEnv("SUPABASE_URL", "https://db.example"); vi.stubEnv("SUPABASE_KEY", "test");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => [] }));
    expect(await getPublicKnowledgeEntries()).toEqual([]);
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
    const fallback = await getPublicKnowledgeEntries();
    expect(fallback.length).toBeGreaterThan(0);
    expect(fallback.every((entry) => entry.origin === "reviewed_pack")).toBe(true);
  });
  it("returns public citations and explicit no-match for unsupported topics", async () => {
    await local();
    const result = await getPublicKnowledgeContext("LP4FM accepted paper");
    expect(result.context).toContain("Burstiness Was Measured Wrong");
    expect(result.sources[0].url).toBe("https://openreview.net/forum?id=1E20ig92Zi");
    expect(await getPublicKnowledgeContext("zygomorphic quasar propulsion")).toEqual({ context: "", sources: [], status: "no_match" });
  });
  it("cannot reactivate the unreviewed remote dossier by adding credentials", async () => {
    vi.stubEnv("PAGEINDEX_API_KEY", "configured");
    expect(isPageIndexAvailable()).toBe(false);
    expect(await retrieveFromPageIndex("private salary")).toBeNull();
  });
});
