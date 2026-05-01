/**
 * Three-layer retrieval — Layer 1: artifact title index
 *
 * Always-loaded directory of every published artifact, grouped by category.
 * Acts as a "table of contents" for the chat: the model learns what
 * specific projects, roles, and topics it has detail on, and can refuse
 * cleanly when asked about something not in the index instead of
 * hallucinating plausible-sounding fiction.
 *
 * Cached in-memory for 5 minutes so we hit Supabase at most ~12 times/hour
 * even under heavy chat traffic. The DeepSeek prompt cache will keep this
 * stable across requests within the same window.
 */
import { createClient, SupabaseClient } from "@supabase/supabase-js";

interface IndexEntry {
  title: string;
  slug: string;
  category: string;
  summary: string | null;
}

const TTL_MS = 5 * 60 * 1000;
let cached: { value: string; entries: IndexEntry[]; expiresAt: number } | null = null;

let _supabase: SupabaseClient | null = null;
function getSupabase(): SupabaseClient | null {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) return null;
  if (!_supabase) {
    _supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
  }
  return _supabase;
}

const CATEGORY_LABEL: Record<string, string> = {
  project: "PROJECTS Dico has built and shipped",
  experience: "ROLES and CLIENTS Dico has worked with",
  skill: "SKILL DEEP-DIVES",
  faq: "RECRUITER FAQs covered in detail",
  "deep-dive": "PHILOSOPHY and POSITIONING deep-dives",
};

const CATEGORY_ORDER = ["project", "experience", "skill", "faq", "deep-dive"];

export async function getArtifactIndex(): Promise<string> {
  const now = Date.now();
  if (cached && cached.expiresAt > now) return cached.value;

  const sb = getSupabase();
  if (!sb) return "";

  const { data, error } = await sb
    .from("artifacts")
    .select("title, slug, category, summary")
    .eq("status", "published")
    .order("category")
    .order("title");

  if (error || !data) return cached?.value ?? "";

  const entries = data as IndexEntry[];
  const grouped = new Map<string, IndexEntry[]>();
  for (const entry of entries) {
    const list = grouped.get(entry.category) ?? [];
    list.push(entry);
    grouped.set(entry.category, list);
  }

  // Layer 1+2 combined: title is the heading, the summary follows on the
  // next line as the "what is this" gloss. With ~27 artifacts at ~80 words
  // each this comes out to ~2-3K tokens — small enough to inline. After
  // the first request DeepSeek's KV cache makes it nearly free.
  const sections: string[] = [];
  for (const cat of CATEGORY_ORDER) {
    const list = grouped.get(cat);
    if (!list?.length) continue;
    const label = CATEGORY_LABEL[cat] ?? cat.toUpperCase();
    const lines = list
      .map((e) => {
        const sum = e.summary?.trim();
        if (!sum || sum === "## Overview") return `  - ${e.title}`;
        const oneLine = sum.replace(/\s+/g, " ").trim();
        return `  - ${e.title}\n      ${oneLine}`;
      })
      .join("\n");
    sections.push(`${label}:\n${lines}`);
  }

  const value = `## Knowledge Index — what Dico has detailed information on

Each item below is followed by a one-paragraph TL;DR. Use these summaries to answer general questions accurately and cite specific numbers. For deeper questions, retrieved chunks (further down) will give you the full text.

If a visitor asks about ANYTHING NOT on this list, do NOT invent details — say plainly "I don't have specifics on that one, but Dico can speak to it directly" and offer to take their email.

${sections.join("\n\n")}`;

  cached = { value, entries, expiresAt: now + TTL_MS };
  return value;
}

/**
 * Force-clear the cache (used by tests or after artifact mutations).
 */
export function clearArtifactIndexCache() {
  cached = null;
}
