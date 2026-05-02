#!/usr/bin/env tsx
/**
 * Backfill: run the 5-dimension classifier on every published artifact
 * and append namespaced label tags to its tags[] column. Also build the
 * version-controlled data catalog at data/artifact-catalog.json.
 *
 * Idempotent: re-running re-classifies and overwrites both. Safe to
 * run after every corpus expansion.
 *
 * Run: npx tsx scripts/classify-and-catalog-existing.ts [--dry-run]
 *      npx tsx scripts/classify-and-catalog-existing.ts --slug X
 */

import { config } from "dotenv";
import { resolve } from "path";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import Anthropic from "@anthropic-ai/sdk";
import {
  generateLabels,
  labelsToTags,
  tagsToLabels,
  loadCatalog,
  saveCatalog,
  upsertCatalogEntry,
  type CatalogEntry,
} from "./lib/three-layer";

config({ path: resolve(process.cwd(), ".env.local") });

const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, DEEPSEEK_API_KEY } = process.env;
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !DEEPSEEK_API_KEY) {
  console.error("Missing env: SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY / DEEPSEEK_API_KEY");
  process.exit(1);
}

const sb: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
const deepseek = new Anthropic({ apiKey: DEEPSEEK_API_KEY, baseURL: "https://api.deepseek.com/anthropic" });
const REPO_ROOT = process.cwd();

const args = process.argv.slice(2);
const DRY = args.includes("--dry-run");
const slugIdx = args.indexOf("--slug");
const ONLY_SLUG = slugIdx >= 0 ? args[slugIdx + 1] : null;

interface Artifact {
  id: string;
  slug: string;
  title: string;
  category: string;
  summary: string | null;
  content: string;
  tags: string[];
}

function inferSourceFromArtifact(a: Artifact): CatalogEntry["source"] {
  const slug = a.slug;
  if (slug.startsWith("synthesis-"))
    return { kind: "compound-synthesis", notes: "Synthesized from corpus by DeepSeek V4 Pro" };
  if (slug === "elevator-briefing-30-second-pitch")
    return { kind: "compound-synthesis", notes: "Compound synthesis on synthesis artifacts" };
  if (slug === "verified-session-activity-evidence-by-project")
    return { kind: "machine-generated", paths: ["~/.claude/projects/"] };
  if (slug === "linkedin-public-profile-snapshot")
    return {
      kind: "manual-curation",
      paths: ["~/projects/career/job-search/linkedin-audit-2026-04-24/AUDIT.md", "~/projects/career/resume-hub/resumes/linkedin_bio.txt"],
    };
  if (slug === "press-urls-and-public-awards-index")
    return {
      kind: "manual-curation",
      urls: [
        "https://newsletter.partnerinsight.io/p/0-to-30m-in-30-months-how-a-marketing",
        "https://aws.amazon.com/partners/success/contentsquare/",
        "https://www.microsoft.com/en/customers/story/25531-contentsquare-azure-synapse-analytics",
        "https://www.suger.io/blog/how-suger-help-contentsquare-grow-partnerships-without-limits",
      ],
    };
  if (slug.startsWith("project-") || slug.startsWith("contentsquare-") || slug.startsWith("metaventions-"))
    return { kind: "memory-and-readme", notes: "From ~/.claude/memory/ + project README" };
  if (a.category === "experience") return { kind: "manual-curation" };
  if (a.category === "skill") return { kind: "manual-curation" };
  if (a.category === "faq") return { kind: "manual-curation" };
  return { kind: "manual-curation" };
}

async function main(): Promise<void> {
  console.log(`[classify] loading published artifacts…`);
  let q = sb
    .from("artifacts")
    .select("id,slug,title,category,summary,content,tags")
    .eq("status", "published")
    .order("slug");
  if (ONLY_SLUG) q = q.eq("slug", ONLY_SLUG);

  const { data, error } = await q;
  if (error || !data) {
    console.error("load failed:", error);
    process.exit(1);
  }

  const artifacts = data as Artifact[];
  console.log(`[classify] processing ${artifacts.length} artifacts${DRY ? " (dry-run)" : ""}`);

  const catalog = loadCatalog(REPO_ROOT);
  let nextCatalog = catalog;
  let ok = 0;
  let failed = 0;

  for (const a of artifacts) {
    process.stdout.write(`  · ${a.slug.slice(0, 60).padEnd(60)} `);
    try {
      const labels = await generateLabels(deepseek, a.title, a.category, a.content);
      const newLabelTags = labelsToTags(labels);
      const { topical } = tagsToLabels(a.tags ?? []);
      const allTags = [...new Set([...newLabelTags, ...topical])];

      console.log(
        `→ ${labels.role_cuts.slice(0, 2).join("/") || "general"} | ${labels.sensitivity} | ${labels.evidence_strength}`
      );

      if (!DRY) {
        const { error: upErr } = await sb.from("artifacts").update({ tags: allTags }).eq("id", a.id);
        if (upErr) {
          console.log(`    ✗ tags update failed: ${upErr.message}`);
          failed++;
          continue;
        }

        const entry: CatalogEntry = {
          slug: a.slug,
          title: a.title,
          category: a.category,
          summary: a.summary ?? "",
          content_chars: (a.content ?? "").length,
          labels,
          topical_tags: topical,
          source: inferSourceFromArtifact(a),
          ingested_at: new Date().toISOString(),
          ingested_by: "scripts/classify-and-catalog-existing.ts",
          artifact_id: a.id,
        };
        nextCatalog = upsertCatalogEntry(nextCatalog, entry);
      }
      ok++;
    } catch (err) {
      console.log(`    ✗ ${(err as Error).message.slice(0, 100)}`);
      failed++;
    }
  }

  if (!DRY) {
    saveCatalog(REPO_ROOT, nextCatalog);
    console.log(`\n[classify] catalog written: ${nextCatalog.length} entries`);
  }
  console.log(`[classify] done: ${ok} ok, ${failed} failed`);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
