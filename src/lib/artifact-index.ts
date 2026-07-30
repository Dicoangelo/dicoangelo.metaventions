/**
 * Three-layer retrieval — Layer 1: artifact title index
 *
 * Always-loaded directory of every published artifact, grouped by category.
 * Acts as a "table of contents" for the chat: the model learns what
 * specific projects, roles, and topics it has detail on, and can refuse
 * cleanly when asked about something not in the index instead of
 * hallucinating plausible-sounding fiction.
 *
 * As of PR #25 the index supports archetype-biased rendering: when the
 * caller passes a QueryArchetype, artifacts whose labels match the
 * detected audience + role_cuts get marked PRIORITY and ordered first
 * within their category. The full list still appears so the model can
 * still refuse cleanly for things outside the corpus.
 *
 * Sensitivity gate: artifacts tagged sens:private are NEVER included.
 * That's a permanent filter, not configurable from the request layer.
 *
 * Cached in-memory for 5 minutes per archetype-key so we hit Supabase
 * at most ~12 times/hour even under heavy chat traffic.
 */
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import type { QueryArchetype } from "./query-archetype";

interface IndexEntry {
  title: string;
  slug: string;
  category: string;
  summary: string | null;
  tags: string[];
}

const TTL_MS = 5 * 60 * 1000;

// Cache key includes archetype so different askers get correctly-biased indexes
// (and cache hits when the same archetype repeats).
interface CacheEntry {
  value: string;
  entries: IndexEntry[];
  expiresAt: number;
}
const cache = new Map<string, CacheEntry>();

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

function archetypeCacheKey(arch?: QueryArchetype): string {
  if (!arch) return "_default";
  return `${arch.audience}|${[...arch.role_cuts].sort().join(",")}`;
}

/**
 * Score an artifact by how well its labels match the query archetype.
 * Higher = better match. Used for in-category ordering, not filtering.
 */
function scoreEntry(entry: IndexEntry, arch: QueryArchetype): number {
  if (!entry.tags?.length) return 0;
  let score = 0;
  for (const tag of entry.tags) {
    if (tag === `aud:${arch.audience}`) score += 3;
    if (arch.role_cuts.some((r) => tag === `role:${r}`)) score += 4;
    // Verifiable evidence is preferred over self-reported when relevance is tied
    if (tag === "evid:verifiable-external" || tag === "evid:verifiable-machine-generated")
      score += 1;
    // Press, awards, named-people are higher-signal than generic narrative
    if (tag === "type:press" || tag === "type:award" || tag === "type:named-person") score += 1;
  }
  return score;
}

export async function getArtifactIndex(archetype?: QueryArchetype): Promise<string> {
  const key = archetypeCacheKey(archetype);
  const now = Date.now();
  const cached = cache.get(key);
  if (cached && cached.expiresAt > now) return cached.value;

  const sb = getSupabase();
  if (!sb) return "";

  const { data, error } = await sb
    .from("artifacts")
    .select("title, slug, category, summary, tags")
    .eq("status", "published")
    .order("category")
    .order("title");

  if (error || !data) return cached?.value ?? "";

  // Sensitivity gate: NEVER surface sens:private artifacts.
  const filtered = (data as IndexEntry[]).filter(
    (e) => !(e.tags ?? []).includes("sens:private")
  );

  const grouped = new Map<string, IndexEntry[]>();
  for (const entry of filtered) {
    const list = grouped.get(entry.category) ?? [];
    list.push(entry);
    grouped.set(entry.category, list);
  }

  // If we have an archetype, sort each category by relevance score (descending)
  // and mark the top 3 as PRIORITY for that asker.
  const priorityBySlug = new Set<string>();
  if (archetype) {
    for (const [, list] of grouped) {
      list.sort((a, b) => scoreEntry(b, archetype) - scoreEntry(a, archetype));
      // Top 3 in each category get the priority marker (only if they actually score > 0)
      for (const e of list.slice(0, 3)) {
        if (scoreEntry(e, archetype) > 0) priorityBySlug.add(e.slug);
      }
    }
  }

  const sections: string[] = [];
  for (const cat of CATEGORY_ORDER) {
    const list = grouped.get(cat);
    if (!list?.length) continue;
    const label = CATEGORY_LABEL[cat] ?? cat.toUpperCase();
    const lines = list
      .map((e) => {
        const sum = e.summary?.trim();
        const isPriority = priorityBySlug.has(e.slug);
        const marker = isPriority ? " ★ PRIORITY for this query" : "";
        if (!sum || sum === "## Overview") return `  - ${e.title}${marker}`;
        const oneLine = sum.replace(/\s+/g, " ").trim();
        return `  - ${e.title}${marker}\n      ${oneLine}`;
      })
      .join("\n");
    sections.push(`${label}:\n${lines}`);
  }

  const archetypeNote = archetype
    ? `\n\n*Routing hint: this query looks like ${archetype.audience.toUpperCase()} asking about ${archetype.role_cuts.join("/")}. Items marked ★ are the strongest match — reach for those first if relevant. Still answer from the full index when needed; the marker is bias, not a filter.*\n`
    : "";

  const value = `## Knowledge Index — what Dico has detailed information on
${archetypeNote}
Each item below is followed by a one-paragraph TL;DR. Use these summaries to answer general questions accurately and cite specific numbers. For deeper questions, retrieved chunks (further down) will give you the full text.

If a visitor asks about ANYTHING NOT on this list, do NOT invent details — say plainly "I don't have specifics on that one, but Dico can speak to it directly" and offer to take their email.

${sections.join("\n\n")}`;

  cache.set(key, { value, entries: filtered, expiresAt: now + TTL_MS });
  return value;
}

/**
 * Force-clear the cache (used by tests or after artifact mutations).
 */
export function clearArtifactIndexCache(): void {
  cache.clear();
}
