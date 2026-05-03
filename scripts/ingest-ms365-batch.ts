#!/usr/bin/env tsx
/**
 * MS 365 batch ingest — reads pre-staged markdown files from
 * /tmp/ms365-ingest/<slug>.md plus a manifest at
 * /tmp/ms365-ingest/manifest.json, runs each through threeLayerIngest.
 *
 * The manifest is the source of truth for slug, title, category, tags,
 * source provenance, and (optionally) override labels for sensitive items.
 *
 * Run: npx tsx scripts/ingest-ms365-batch.ts [--dry-run] [--only=<slug>]
 */

import { config } from "dotenv";
import { resolve } from "path";
import { readFileSync, existsSync } from "fs";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import Anthropic from "@anthropic-ai/sdk";
import {
  threeLayerIngest,
  type IngestArgs,
  type Labels,
} from "./lib/three-layer";

config({ path: resolve(process.cwd(), ".env.local") });

const STAGING = "/tmp/ms365-ingest";
const MANIFEST = `${STAGING}/manifest.json`;

const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, DEEPSEEK_API_KEY } = process.env;
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !DEEPSEEK_API_KEY) {
  console.error("Missing env: SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY / DEEPSEEK_API_KEY");
  process.exit(1);
}

const sb: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
const deepseek = new Anthropic({ apiKey: DEEPSEEK_API_KEY, baseURL: "https://api.deepseek.com/anthropic" });
const REPO_ROOT = process.cwd();
const DRY = process.argv.includes("--dry-run");
const ONLY = process.argv.find((a) => a.startsWith("--only="))?.slice(7);

interface ManifestEntry {
  slug: string;
  title: string;
  localFile: string; // path under STAGING
  category: "project" | "skill" | "experience" | "faq" | "deep-dive";
  topicalTags: string[];
  source: IngestArgs["source"];
  /** Optional preface to inject above the extracted body — adds canonical framing */
  prefaceMarkdown?: string;
  /** Optional pre-computed labels (override the auto-classifier — use for sensitive items) */
  labels?: Labels;
}

interface Manifest {
  entries: ManifestEntry[];
}

function loadManifest(): Manifest {
  if (!existsSync(MANIFEST)) {
    console.error(`Manifest not found: ${MANIFEST}`);
    process.exit(1);
  }
  return JSON.parse(readFileSync(MANIFEST, "utf8")) as Manifest;
}

async function ingestOne(entry: ManifestEntry): Promise<void> {
  const fullPath = `${STAGING}/${entry.localFile}`;
  if (!existsSync(fullPath)) {
    console.error(`  ✗ missing local file: ${fullPath}`);
    return;
  }
  const body = readFileSync(fullPath, "utf8");
  const content = entry.prefaceMarkdown
    ? `${entry.prefaceMarkdown}\n\n---\n\n${body}`
    : body;

  console.log(`\n[ingest] ${entry.slug} (${content.length} chars from ${entry.localFile})`);
  if (DRY) {
    console.log(`  [dry] preview:\n${content.slice(0, 400)}\n...`);
    return;
  }
  try {
    const id = await threeLayerIngest({
      sb,
      client: deepseek,
      repoRoot: REPO_ROOT,
      ingestedBy: "scripts/ingest-ms365-batch.ts",
      slug: entry.slug,
      title: entry.title,
      content,
      category: entry.category,
      topicalTags: entry.topicalTags,
      source: entry.source,
      labels: entry.labels,
    });
    console.log(`  ✓ inserted ${id}`);
  } catch (err) {
    console.error(`  ✗ ${(err as Error).message}`);
  }
}

async function main(): Promise<void> {
  const m = loadManifest();
  const targets = ONLY ? m.entries.filter((e) => e.slug === ONLY) : m.entries;
  if (targets.length === 0) {
    console.error(ONLY ? `No entry matching --only=${ONLY}` : "Manifest empty");
    process.exit(1);
  }
  console.log(`[ms365-ingest] ${targets.length} target(s)${DRY ? " (DRY RUN)" : ""}`);
  for (const entry of targets) {
    await ingestOne(entry);
  }
  console.log(`\n[ms365-ingest] done.`);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
