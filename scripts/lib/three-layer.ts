/**
 * Three-Layer Ingestion Framework.
 *
 * Every ingestion script that wants to play nice with the
 * dicoangelo.metaventions chat retrieval should use this.
 *
 * Layer 1 — Title:    crisp, slug-friendly, single-line
 * Layer 2 — Summary:  fact-dense, ≤80 words, surfaces concrete facts
 * Layer 3 — Content:  full body, will be chunked + embedded later
 *
 * Plus two cross-cutting concerns:
 *   - Labels: 5-dimension classification stored as namespaced strings
 *     in the artifact's `tags` TEXT[] column.
 *   - Catalog: every ingestion appends an entry to
 *     data/artifact-catalog.json — the manifest of "what's in the corpus".
 *
 * No DB schema migration needed. Pure data convention on top of the
 * existing artifacts table.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import Anthropic from "@anthropic-ai/sdk";
import type { SupabaseClient } from "@supabase/supabase-js";

export const LABEL_DIMENSIONS = {
  audience: ["recruiter", "partner", "peer-engineer", "investor", "general"] as const,
  role_cuts: [
    "partner-ops",
    "cloud-alliance",
    "gtm-systems-architect",
    "revops-ai-infra",
    "solutions-architect",
    "founder-cto",
    "applied-ai-product",
    "general",
  ] as const,
  sensitivity: ["public", "internal", "private"] as const,
  evidence_strength: [
    "verifiable-external",
    "verifiable-machine-generated",
    "self-reported",
    "inferred-synthesis",
  ] as const,
  evidence_type: [
    "metric",
    "narrative",
    "code-artifact",
    "named-person",
    "press",
    "award",
    "process-description",
    "synthesis",
  ] as const,
};

export type Audience = (typeof LABEL_DIMENSIONS.audience)[number];
export type RoleCut = (typeof LABEL_DIMENSIONS.role_cuts)[number];
export type Sensitivity = (typeof LABEL_DIMENSIONS.sensitivity)[number];
export type EvidenceStrength = (typeof LABEL_DIMENSIONS.evidence_strength)[number];
export type EvidenceType = (typeof LABEL_DIMENSIONS.evidence_type)[number];

export interface Labels {
  audience: Audience[];
  role_cuts: RoleCut[];
  sensitivity: Sensitivity;
  evidence_strength: EvidenceStrength;
  evidence_type: EvidenceType[];
}

const PREFIX = {
  audience: "aud:",
  role_cuts: "role:",
  sensitivity: "sens:",
  evidence_strength: "evid:",
  evidence_type: "type:",
} as const;

/** Convert label object to namespaced tag strings for storage in tags[]. */
export function labelsToTags(labels: Labels): string[] {
  const tags: string[] = [];
  for (const a of labels.audience) tags.push(`${PREFIX.audience}${a}`);
  for (const r of labels.role_cuts) tags.push(`${PREFIX.role_cuts}${r}`);
  tags.push(`${PREFIX.sensitivity}${labels.sensitivity}`);
  tags.push(`${PREFIX.evidence_strength}${labels.evidence_strength}`);
  for (const t of labels.evidence_type) tags.push(`${PREFIX.evidence_type}${t}`);
  return tags;
}

/** Reverse: extract Labels from a tags array (with non-label tags preserved separately). */
export function tagsToLabels(tags: string[]): { labels: Partial<Labels>; topical: string[] } {
  const labels: Partial<Labels> = {
    audience: [],
    role_cuts: [],
    evidence_type: [],
  };
  const topical: string[] = [];
  for (const t of tags) {
    if (t.startsWith(PREFIX.audience))
      (labels.audience as Audience[]).push(t.slice(PREFIX.audience.length) as Audience);
    else if (t.startsWith(PREFIX.role_cuts))
      (labels.role_cuts as RoleCut[]).push(t.slice(PREFIX.role_cuts.length) as RoleCut);
    else if (t.startsWith(PREFIX.sensitivity))
      labels.sensitivity = t.slice(PREFIX.sensitivity.length) as Sensitivity;
    else if (t.startsWith(PREFIX.evidence_strength))
      labels.evidence_strength = t.slice(PREFIX.evidence_strength.length) as EvidenceStrength;
    else if (t.startsWith(PREFIX.evidence_type))
      (labels.evidence_type as EvidenceType[]).push(
        t.slice(PREFIX.evidence_type.length) as EvidenceType
      );
    else topical.push(t);
  }
  return { labels, topical };
}

const SUMMARY_SYSTEM = `You write FACT-DENSE summaries of portfolio artifacts. The summaries get loaded into a voice chat assistant's system prompt — they are often the ONLY thing the chat sees about an artifact when retrieval is degraded, so the chat will hallucinate concrete details if your summary is abstract.

CRITICAL: Lead with the most important SPECIFIC FACTS from the artifact (a name, number, headline, claim, URL, named person), not a meta-description of what the artifact is.

Rules:
- 2-3 sentences. Maximum 80 words.
- If the artifact contains key/value facts (a headline, location, metrics, names, URLs, dates, awards), surface those VERBATIM in the summary. Quote them exactly.
- Plain text only. No markdown.
- Use third person.
- Do NOT invent details.
- Do NOT use marketing fluff.
- Do NOT start with "This artifact", "A reference document", "The X is a", or any other meta-description.

Output ONLY the summary text.`;

const LABELS_SYSTEM = `You classify portfolio artifacts on FIVE dimensions. The classification is used to bias chat retrieval — surfacing the right artifact for the right asker.

Output VALID JSON matching this exact schema:

{
  "audience": ["recruiter" | "partner" | "peer-engineer" | "investor" | "general"],
  "role_cuts": ["partner-ops" | "cloud-alliance" | "gtm-systems-architect" | "revops-ai-infra" | "solutions-architect" | "founder-cto" | "applied-ai-product" | "general"],
  "sensitivity": "public" | "internal" | "private",
  "evidence_strength": "verifiable-external" | "verifiable-machine-generated" | "self-reported" | "inferred-synthesis",
  "evidence_type": ["metric" | "narrative" | "code-artifact" | "named-person" | "press" | "award" | "process-description" | "synthesis"]
}

Multi-label dimensions (audience, role_cuts, evidence_type) — pick ALL that apply.
Single-label dimensions (sensitivity, evidence_strength) — pick exactly one.

Guidance:
- "audience": who benefits MOST from this content. "general" only when truly universal.
- "role_cuts": which target role lane this evidence supports. Be selective — don't pick all of them.
- "sensitivity":
    public = already on dicoangelo.metaventionsai.com or LinkedIn or in published press;
    internal = work history / system internals — fine for a verified recruiter or partner;
    private = application history, salary, personal, things a stranger should NEVER see.
- "evidence_strength":
    verifiable-external = third-party press, public award, third-party case study, public repo;
    verifiable-machine-generated = session logs, git history, metrics from running systems Dico controls;
    self-reported = Dico's first-person claim about his own work or process;
    inferred-synthesis = derived/synthesized from other artifacts (the synthesis-* meta-artifacts).
- "evidence_type": what KIND of evidence this artifact contains. Mix labels for richer artifacts.

Output ONLY the JSON object. No preamble, no markdown fence, no commentary.`;

interface DeepSeekClient {
  messages: {
    create: (args: {
      model: string;
      max_tokens: number;
      temperature: number;
      thinking?: { type: "disabled" };
      system: string;
      messages: { role: string; content: string }[];
    }) => Promise<{ content: { type: string; text?: string }[] }>;
  };
}

const SUMMARY_MODEL = "deepseek-v4-pro";
const LABELS_MODEL = "deepseek-v4-pro";

export async function generateSummary(
  client: Anthropic | DeepSeekClient,
  title: string,
  content: string
): Promise<string> {
  const trimmed = content.length > 8000 ? content.slice(0, 8000) + "\n\n[truncated]" : content;
  const response = await (client as Anthropic).messages.create({
    model: SUMMARY_MODEL,
    max_tokens: 220,
    temperature: 0.3,
    thinking: { type: "disabled" } as never,
    system: SUMMARY_SYSTEM,
    messages: [{ role: "user", content: `Title: ${title}\n\n---\n\n${trimmed}` }],
  });
  const block = response.content.find((b) => b.type === "text");
  return block && "text" in block ? (block.text as string).trim() : "";
}

export async function generateLabels(
  client: Anthropic | DeepSeekClient,
  title: string,
  category: string,
  content: string
): Promise<Labels> {
  const trimmed = content.length > 6000 ? content.slice(0, 6000) + "\n\n[truncated]" : content;
  const response = await (client as Anthropic).messages.create({
    model: LABELS_MODEL,
    max_tokens: 400,
    temperature: 0.2,
    thinking: { type: "disabled" } as never,
    system: LABELS_SYSTEM,
    messages: [
      {
        role: "user",
        content: `Title: ${title}\nCategory: ${category}\n\n---\n\n${trimmed}`,
      },
    ],
  });
  const block = response.content.find((b) => b.type === "text");
  const raw = block && "text" in block ? (block.text as string).trim() : "";
  const cleaned = raw.replace(/^```json\s*/i, "").replace(/\s*```$/i, "").trim();
  try {
    const parsed = JSON.parse(cleaned) as Labels;
    return validateLabels(parsed);
  } catch (err) {
    throw new Error(`Failed to parse labels JSON: ${(err as Error).message}\nRaw: ${raw.slice(0, 400)}`);
  }
}

function validateLabels(labels: Labels): Labels {
  const cleanArray = <T extends string>(arr: unknown, allowed: readonly T[]): T[] => {
    if (!Array.isArray(arr)) return [];
    return arr.filter((v): v is T => typeof v === "string" && (allowed as readonly string[]).includes(v));
  };
  return {
    audience: cleanArray(labels.audience, LABEL_DIMENSIONS.audience),
    role_cuts: cleanArray(labels.role_cuts, LABEL_DIMENSIONS.role_cuts),
    sensitivity: (LABEL_DIMENSIONS.sensitivity as readonly string[]).includes(labels.sensitivity)
      ? labels.sensitivity
      : "internal",
    evidence_strength: (LABEL_DIMENSIONS.evidence_strength as readonly string[]).includes(
      labels.evidence_strength
    )
      ? labels.evidence_strength
      : "self-reported",
    evidence_type: cleanArray(labels.evidence_type, LABEL_DIMENSIONS.evidence_type),
  };
}

export interface CatalogEntry {
  slug: string;
  title: string;
  category: string;
  summary: string;
  content_chars: number;
  labels: Labels;
  topical_tags: string[];
  source: {
    kind: string;
    paths?: string[];
    urls?: string[];
    notes?: string;
  };
  ingested_at: string;
  ingested_by: string;
  artifact_id: string;
}

const CATALOG_PATH = "data/artifact-catalog.json";

export function loadCatalog(repoRoot: string): CatalogEntry[] {
  const path = join(repoRoot, CATALOG_PATH);
  if (!existsSync(path)) return [];
  try {
    return JSON.parse(readFileSync(path, "utf8")) as CatalogEntry[];
  } catch {
    return [];
  }
}

export function saveCatalog(repoRoot: string, entries: CatalogEntry[]): void {
  const path = join(repoRoot, CATALOG_PATH);
  const dir = dirname(path);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  // Sort by slug for stable diffs in PRs
  const sorted = [...entries].sort((a, b) => a.slug.localeCompare(b.slug));
  writeFileSync(path, JSON.stringify(sorted, null, 2) + "\n", "utf8");
}

export function upsertCatalogEntry(entries: CatalogEntry[], entry: CatalogEntry): CatalogEntry[] {
  const filtered = entries.filter((e) => e.slug !== entry.slug);
  filtered.push(entry);
  return filtered;
}

export interface IngestArgs {
  sb: SupabaseClient;
  client: Anthropic | DeepSeekClient;
  repoRoot: string;
  ingestedBy: string; // script name, used for catalog provenance
  slug: string;
  title: string;
  content: string;
  category: "project" | "skill" | "experience" | "faq" | "deep-dive";
  topicalTags?: string[];
  source: CatalogEntry["source"];
  // Optional pre-computed (for callers that already have these)
  summary?: string;
  labels?: Labels;
}

/**
 * Three-layer ingest: produces summary + labels, upserts artifact,
 * appends to data catalog. Returns the inserted artifact id.
 */
export async function threeLayerIngest(args: IngestArgs): Promise<string> {
  const { sb, client, repoRoot, ingestedBy, slug, title, content, category, topicalTags = [], source } = args;

  const summary = args.summary ?? (await generateSummary(client, title, content));
  if (!summary || summary.length < 30) {
    throw new Error(`generateSummary returned too short: "${summary}"`);
  }

  const labels = args.labels ?? (await generateLabels(client, title, category, content));
  const labelTags = labelsToTags(labels);
  const allTags = [...new Set([...labelTags, ...topicalTags])];

  // Upsert artifact (delete + insert pattern matches existing scripts)
  const { data: existing } = await sb.from("artifacts").select("id").eq("slug", slug).maybeSingle();
  if (existing?.id) {
    await sb.from("artifact_chunks").delete().eq("artifact_id", existing.id);
    await sb.from("artifacts").delete().eq("id", existing.id);
  }

  const { data, error } = await sb
    .from("artifacts")
    .insert({
      title,
      slug,
      content,
      summary,
      category,
      tags: allTags,
      status: "published",
      published_at: new Date().toISOString(),
      version: 1,
    })
    .select()
    .single();

  if (error || !data) {
    throw new Error(`artifact insert failed: ${error?.message ?? "unknown"}`);
  }
  const artifactId = data.id as string;

  // Update catalog
  const catalog = loadCatalog(repoRoot);
  const entry: CatalogEntry = {
    slug,
    title,
    category,
    summary,
    content_chars: content.length,
    labels,
    topical_tags: topicalTags,
    source,
    ingested_at: new Date().toISOString(),
    ingested_by: ingestedBy,
    artifact_id: artifactId,
  };
  const next = upsertCatalogEntry(catalog, entry);
  saveCatalog(repoRoot, next);

  return artifactId;
}
