/** Public retrieval is an explicit reviewed allowlist. Historical dossier rows are admin-only. */
import { createHash } from "node:crypto";
import { PUBLIC_KNOWLEDGE_ENTRIES, type PublicKnowledgeEntry } from "@/content/knowledge/public-knowledge";

export interface PublicKnowledgeEntryRecord extends PublicKnowledgeEntry {
  id: string;
  content_hash: string;
  revision: number;
  review_after: string;
  origin: "database" | "reviewed_pack";
}
export interface PublicKnowledgeSource {
  slug: string;
  title: string;
  url: string;
  reviewedAt: string;
  reviewAfter: string;
}
export interface PublicKnowledgeResult {
  context: string;
  sources: PublicKnowledgeSource[];
  status: "ready" | "no_match" | "unavailable";
}
const sha256 = (text: string) => createHash("sha256").update(text).digest("hex");
const canonical = new Map(PUBLIC_KNOWLEDGE_ENTRIES.map((entry) => [entry.slug, entry]));
const STOP_WORDS = new Set("a an and are as at be been by can could dico angelo did do does for from had has have he her his how i in is it its me my of on or our please she should tell that the their them these they this to us was we were what when where which who why will with would you your about more work experience background".split(" "));
const normalizeWord = (word: string) => ({ partners: "partner", partnerships: "partner", partnership: "partner", built: "build", building: "build", coaching: "coach", resumes: "resume" }[word] ?? word);
const tokens = (text: string) => [...new Set((text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").match(/[a-z0-9]+/g) ?? []).map(normalizeWord).filter((word) => word.length > 1 && !STOP_WORDS.has(word)))];
const SEARCH_ALIASES: Record<string, string> = {
  "current-role-ezra": "current job employer title",
  "career-contentsquare": "partner alliance marketplace pipeline",
  "career-rocket-mortgage-canada": "edison mortgage rocket",
  "project-career-board": "career coach coaching careercoach resume job hiring build demo",
  "project-partnership-graph": "partner partnership graph demo build",
  "project-researchgravity": "research gravity researchgravity build",
  "project-universal-cognitive-wallet": "ucw cognitive wallet memory build",
  "project-sbc-inspector": "sbc inspector autoops configuration build",
};

/** Fail closed on stale/private rows or independently changed titles, summaries or provenance. */
export function isEligiblePublicKnowledge(value: unknown, now = Date.now()): value is PublicKnowledgeEntryRecord {
  if (!value || typeof value !== "object") return false;
  const row = value as PublicKnowledgeEntryRecord;
  const approved = canonical.get(row.slug);
  if (!approved || row.status !== "reviewed" || row.visibility !== "public" || typeof row.content !== "string") return false;
  const reviewed = Date.parse(row.reviewed_at), expires = Date.parse(row.review_after);
  if (!Number.isFinite(reviewed) || !Number.isFinite(expires) || reviewed > now || expires <= now || expires <= reviewed) return false;
  return row.content_hash === sha256(row.content) && row.content === approved.content && row.title === approved.title &&
    row.category === approved.category && (row.summary ?? null) === (approved.summary ?? null) &&
    JSON.stringify(row.source_refs) === JSON.stringify(approved.source_refs) &&
    reviewed === Date.parse(approved.reviewed_at) && expires === Date.parse(approved.review_after ?? "");
}

function localEntries(): PublicKnowledgeEntryRecord[] {
  return PUBLIC_KNOWLEDGE_ENTRIES.map((entry) => ({ ...entry, id: entry.slug,
    content_hash: sha256(entry.content), revision: 1, review_after: entry.review_after ?? "",
    origin: "reviewed_pack" as const,
  })).filter((entry) => isEligiblePublicKnowledge(entry));
}

/** A bounded database read; outage fallback uses the same dated reviewed pack, never a legacy table. */
export async function getPublicKnowledgeEntries(): Promise<PublicKnowledgeEntryRecord[]> {
  const url = process.env.SUPABASE_URL, key = process.env.SUPABASE_KEY;
  if (!url || !key) return localEntries();
  try {
    const response = await fetch(`${url.replace(/\/$/, "")}/rest/v1/portfolio_knowledge?select=slug,title,category,content,summary,source_refs,content_hash,reviewed_at,review_after,visibility,status,revision&order=slug&limit=${Math.max(100, PUBLIC_KNOWLEDGE_ENTRIES.length)}`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` }, cache: "no-store", signal: AbortSignal.timeout(1500),
    });
    if (!response.ok) return localEntries();
    const rows: unknown = await response.json();
    if (!Array.isArray(rows)) return localEntries();
    // An available database can intentionally quarantine a record. Do not replace missing rows with fallback.
    return rows.filter((row) => isEligiblePublicKnowledge(row)).map((row) => ({
      ...row, id: row.slug, origin: "database" as const,
    }));
  } catch { return localEntries(); }
}

export function rankPublicKnowledge(query: string, entries: PublicKnowledgeEntryRecord[], limit = 5): PublicKnowledgeEntryRecord[] {
  const words = tokens(query);
  if (!words.length) return entries.filter((entry) => ["current-role-ezra", "faq-professional-focus"].includes(entry.slug));
  return entries.map((entry) => {
    const title = new Set(tokens(`${entry.title} ${entry.slug} ${SEARCH_ALIASES[entry.slug] ?? ""}`));
    const body = new Set(tokens(entry.content));
    const score = words.reduce((sum, word) => sum + (title.has(word) ? 5 : body.has(word) ? 1 : 0), 0);
    return { entry, score };
  }).filter(({ score }) => score > 0).sort((a, b) => b.score - a.score || a.entry.slug.localeCompare(b.entry.slug))
    .slice(0, limit).map(({ entry }) => entry);
}

function publicUrl(entry: PublicKnowledgeEntryRecord): string {
  return entry.source_refs.find((ref) => /^https:\/\/openreview\.net\//.test(ref)) ??
    entry.source_refs.find((ref) => /^https:\/\//.test(ref)) ?? "https://dicoangelo.metaventionsai.com";
}
export async function getPublicKnowledgeContext(query: string): Promise<PublicKnowledgeResult> {
  const entries = await getPublicKnowledgeEntries();
  if (!entries.length) return { context: "", sources: [], status: "unavailable" };
  const matched = rankPublicKnowledge(query, entries);
  const sources = matched.map((entry) => ({ slug: entry.slug, title: entry.title, url: publicUrl(entry),
    reviewedAt: entry.reviewed_at, reviewAfter: entry.review_after }));
  const context = matched.map((entry, i) => `## ${entry.title}\n[Source ${entry.slug}: ${sources[i].url}; reviewed ${entry.reviewed_at}; review due ${entry.review_after}]\n${entry.content}`).join("\n\n");
  return { context, sources, status: matched.length ? "ready" : "no_match" };
}

// Compatibility entry points intentionally cannot access historical or opaque remote sources.
export interface DossierChunk { id: string; content: string; heading: string | null; category: string; file_path: string; similarity: number; metadata: Record<string, string[]>; }
export async function searchDossier(query: string, options: { threshold?: number; limit?: number; category?: string } = {}): Promise<DossierChunk[]> {
  const entries = (await getPublicKnowledgeEntries()).filter((entry) => !options.category || entry.category === options.category);
  return rankPublicKnowledge(query, entries, options.limit ?? 5).map((entry) => ({ id: entry.slug, content: entry.content, heading: entry.title, category: entry.category, file_path: publicUrl(entry), similarity: 0, metadata: {} }));
}
export function formatDossierContext(chunks: DossierChunk[]): string { return chunks.map((chunk) => `## ${chunk.heading}\nSource: ${chunk.file_path}\n${chunk.content}`).join("\n\n"); }
export async function getDossierContext(query: string): Promise<string> { return (await getPublicKnowledgeContext(query)).context; }
export async function getDossierContextForJD(query: string) { const chunks = await searchDossier(query); return { context: formatDossierContext(chunks), chunks }; }
export async function getCombinedContext(query: string, _options: { rerank?: boolean } = {}): Promise<string> { void _options; return getDossierContext(query); }
export async function getCombinedContextForJD(query: string, _options: { rerank?: boolean } = {}) { void _options; const result = await getDossierContextForJD(query); return { context: result.context, artifactChunks: [], dossierChunks: result.chunks }; }
