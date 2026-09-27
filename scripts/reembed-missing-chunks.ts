#!/usr/bin/env tsx
/**
 * Rebuild chunks + Cohere embeddings for published artifacts that have content but no chunks.
 *
 * Added 2026-09-26: the DQ-claims correction rewrote 12 artifacts and deleted their stale
 * chunks while the Cohere embed key was at its billing cap (HTTP 402). Run this once
 * embeddings work again so those artifacts are searchable by the Supabase RAG fallback.
 *
 * By default it only touches the 12 corrected artifacts below; many other artifacts are
 * intentionally unchunked. --slug <slug> targets one artifact instead.
 *
 * Run: npx tsx scripts/reembed-missing-chunks.ts [--dry-run] [--slug <slug>]
 */
import { config } from "dotenv";
import { resolve } from "path";
import { createClient } from "@supabase/supabase-js";
import { CohereClient } from "cohere-ai";
import { chunkMarkdown } from "../src/lib/chunker";

config({ path: resolve(process.cwd(), ".env.local") });
const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, COHERE_API_KEY } = process.env;
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !COHERE_API_KEY) {
  console.error("Missing SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY or COHERE_API_KEY");
  process.exit(1);
}
const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
const cohere = new CohereClient({ token: COHERE_API_KEY });
const DRY = process.argv.includes("--dry-run");
const onlySlug = process.argv.includes("--slug") ? process.argv[process.argv.indexOf("--slug") + 1] : null;
const CORRECTED_2026_09_26 = [
  "recruiter-faq-common-questions-answered",
  "project-meta-vengine",
  "metaventions-ai-founder-systems-architect",
  "ace-adaptive-consensus-engine",
  "education-credentials",
  "archon-autonomous-recursive-coordination-hierarchical-orchestration-network",
  "project-paper-to-production",
  "project-supermax",
  "os-app-metaventions-ai-platform",
  "supermemory-long-term-memory-layer",
  "collaboration-drammeh-dq-scoring",
  "technical-skills-deep-dive",
];

async function main() {
  let q = sb.from("artifacts").select("id,slug,content").eq("status", "published");
  q = onlySlug ? q.eq("slug", onlySlug) : q.in("slug", CORRECTED_2026_09_26);
  const { data: arts, error } = await q;
  if (error) throw error;

  for (const a of arts || []) {
    const { count } = await sb.from("artifact_chunks").select("id", { count: "exact", head: true }).eq("artifact_id", a.id);
    if ((count ?? 0) > 0 || !a.content?.trim()) continue;
    const chunks = chunkMarkdown(a.content, { maxTokens: 350, minTokens: 50, preserveHeading: true, extractMetadata: true });
    console.log(`${DRY ? "[dry] " : ""}${a.slug}: ${chunks.length} chunks`);
    if (DRY || chunks.length === 0) continue;

    const embeddings: number[][] = [];
    for (let i = 0; i < chunks.length; i += 96) {
      const res = await cohere.embed({
        texts: chunks.slice(i, i + 96).map((c) => c.content),
        model: "embed-english-v3.0",
        inputType: "search_document",
      });
      const e = res.embeddings;
      embeddings.push(...(Array.isArray(e) ? e : (e as { float?: number[][] }).float || []));
    }
    if (embeddings.length !== chunks.length) throw new Error(`${a.slug}: embedding count mismatch`);

    const rows = chunks.map((c, i) => ({
      artifact_id: a.id,
      content: c.content,
      heading: c.heading || null,
      chunk_index: c.chunkIndex,
      token_count: c.tokenCount,
      chunk_type: c.chunkType,
      technologies: c.metadata.technologies,
      companies: c.metadata.companies,
      papers: c.metadata.papers,
      skills: c.metadata.skills,
      embedding: embeddings[i],
    }));
    const { error: insErr } = await sb.from("artifact_chunks").insert(rows);
    if (insErr) throw insErr;
    console.log(`  inserted ${rows.length}`);
  }
}

main().catch((err) => { console.error("Fatal:", err.message || err); process.exit(1); });
