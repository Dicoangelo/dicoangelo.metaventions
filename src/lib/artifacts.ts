import "server-only";
/** Historical artifact administration. Public retrieval uses the reviewed knowledge allowlist. */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { RerankableChunk } from "./reranker";
import { getPublicKnowledgeEntries, rankPublicKnowledge } from "./dossier";
let supabase: SupabaseClient | null = null;
function getSupabase(): SupabaseClient {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) throw new Error("Server-side artifact administration is unavailable");
  return supabase ??= createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
}
export interface Artifact {
  id: string;
  title: string;
  slug: string;
  content: string;
  summary: string | null;
  category: "project" | "skill" | "experience" | "faq" | "deep-dive";
  tags: string[];
  related_artifacts: string[];
  external_links: Record<string, string>;
  metrics: Record<string, string>;
  status: "draft" | "published" | "archived";
  version: number;
  created_at: string;
  updated_at: string;
  published_at: string | null;
}

export interface ArtifactChunk extends RerankableChunk {
  artifact_id: string;
  heading: string | null;
  chunk_index: number;
  token_count: number | null;
  chunk_type: string | null;
  technologies: string[];
  companies: string[];
  papers: string[];
  skills: string[];
  similarity?: number;
  // From join
  artifact_title?: string;
  artifact_slug?: string;
}

export interface CreateArtifactInput {
  title: string;
  slug: string;
  content: string;
  summary?: string;
  category: Artifact["category"];
  tags?: string[];
  external_links?: Record<string, string>;
  metrics?: Record<string, string>;
}

export interface SearchArtifactsOptions {
  threshold?: number; // default: 0.15
  limit?: number; // default: 20
  category?: string;
  tags?: string[];
  /**
   * Cohere rerank — OFF by default to avoid per-search cost.
   * The rerank code in ./reranker.ts is intentionally preserved so we
   * can flip this back on, run A/B tests, or selectively rerank for
   * specific surfaces. See lib/rerank-control.ts for the runtime toggle.
   */
  rerank?: boolean; // default: false
  rerankTopK?: number; // default: 5
}


function assertSafeDraft(input: Partial<CreateArtifactInput>): void {
  const text = `${input.title ?? ""}\n${input.content ?? ""}\n${input.summary ?? ""}`;
  if (/application[-_ ]profile|APPLICATION AUTOFILL PROFILE|"(?:eeo|legal_name|street_address)"/i.test(text)) {
    throw new Error("Private application profiles cannot be ingested into portfolio artifacts");
  }
  if ((input as Record<string, unknown>).status === "published") throw new Error("Public content requires the reviewed knowledge workflow");
}
function draftFields(input: Partial<CreateArtifactInput>) {
  return Object.fromEntries(Object.entries(input).filter(([key]) => ["title", "slug", "content", "summary", "category", "tags", "external_links", "metrics"].includes(key)));
}
export async function createArtifact(input: CreateArtifactInput): Promise<Artifact> {
  assertSafeDraft(input);
  const { data, error } = await getSupabase().from("artifacts").insert({ ...draftFields(input), status: "draft", version: 1 }).select().single();
  if (error || !data) throw new Error("Failed to create private draft artifact");
  return data;
}
export async function updateArtifact(id: string, input: Partial<CreateArtifactInput>): Promise<Artifact> {
  assertSafeDraft(input);
  const current = await getArtifact(id);
  if (!current) throw new Error("Artifact not found");
  // Preserve archival chunks. Draft edits never regenerate or publish historical embeddings.
  const { data, error } = await getSupabase().from("artifacts").update({ ...draftFields(input), status: current.status === "archived" ? "archived" : "draft", version: current.version + 1, updated_at: new Date().toISOString() }).eq("id", id).select().single();
  if (error || !data) throw new Error("Failed to update private draft artifact");
  return data;
}
export async function publishArtifact(_id: string): Promise<Artifact> { void _id; throw new Error("Legacy artifacts cannot be published. Use the reviewed public knowledge workflow."); }
export async function rechunkArtifact(_id: string): Promise<number> { void _id; throw new Error("Historical chunks are preserved. Re-ingest reviewed entries through the knowledge workflow."); }
/** Archive instead of destroying source material and provenance. */
export async function deleteArtifact(id: string): Promise<void> {
  const { error } = await getSupabase().from("artifacts").update({ status: "archived", updated_at: new Date().toISOString() }).eq("id", id);
  if (error) throw new Error("Failed to archive artifact");
}
export async function getArtifact(id: string): Promise<Artifact | null> {
  const { data, error } = await getSupabase().from("artifacts").select("*").eq("id", id).maybeSingle();
  if (error) throw new Error("Failed to read private artifact");
  return data;
}
export async function getArtifactBySlug(slug: string): Promise<Artifact | null> {
  const { data, error } = await getSupabase().from("artifacts").select("*").eq("slug", slug).maybeSingle();
  if (error) throw new Error("Failed to read private artifact");
  return data;
}
export async function listArtifacts(options?: { status?: string; category?: string }): Promise<Artifact[]> {
  let query = getSupabase().from("artifacts").select("*").order("created_at", { ascending: false });
  if (options?.status) query = query.eq("status", options.status);
  if (options?.category) query = query.eq("category", options.category);
  const { data, error } = await query;
  if (error) throw new Error("Failed to list private artifacts");
  return data ?? [];
}
export async function searchArtifacts(query: string, options: SearchArtifactsOptions = {}): Promise<ArtifactChunk[]> {
  const entries = (await getPublicKnowledgeEntries()).filter((entry) => !options.category || entry.category === options.category);
  if (options.tags?.length) return []; // The curated schema does not establish arbitrary historical tags.
  return rankPublicKnowledge(query, entries, options.limit ?? 5).map((entry) => ({ id: entry.slug, artifact_id: entry.slug, content: entry.content, heading: entry.title, artifact_title: entry.title, artifact_slug: entry.slug, chunk_index: 0, token_count: null, chunk_type: "reviewed-entry", technologies: [], companies: [], papers: [], skills: [] }));
}
export function formatArtifactContext(chunks: ArtifactChunk[]): string {
  return chunks.map((chunk) => `## ${chunk.artifact_title}\nReviewed source: ${chunk.artifact_slug}\n${chunk.content}`).join("\n\n");
}
