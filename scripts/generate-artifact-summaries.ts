#!/usr/bin/env tsx
/**
 * Generate per-artifact summaries for Layer 2 of three-layer retrieval.
 *
 * For each published artifact missing a real summary, calls DeepSeek V4 Pro
 * to produce a 2-3 sentence factual summary, then writes it back to the
 * artifacts.summary column.
 *
 * The summaries get inlined into the system prompt at request time alongside
 * the title index, so the chat always has a one-paragraph TL;DR for every
 * project/role/skill before deep-diving into chunks.
 *
 * Usage:
 *   npx tsx scripts/generate-artifact-summaries.ts            # all artifacts missing summaries
 *   npx tsx scripts/generate-artifact-summaries.ts --force    # regenerate all
 *   npx tsx scripts/generate-artifact-summaries.ts --slug X   # specific artifact
 *   npx tsx scripts/generate-artifact-summaries.ts --dry-run  # preview, no writes
 */

import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(process.cwd(), ".env.local") });

const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, DEEPSEEK_API_KEY } = process.env;
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !DEEPSEEK_API_KEY) {
  console.error("Missing required env: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, DEEPSEEK_API_KEY");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
const deepseek = new Anthropic({
  apiKey: DEEPSEEK_API_KEY,
  baseURL: "https://api.deepseek.com/anthropic",
});

const args = process.argv.slice(2);
const FORCE = args.includes("--force");
const DRY = args.includes("--dry-run");
const slugIdx = args.indexOf("--slug");
const ONLY_SLUG = slugIdx >= 0 ? args[slugIdx + 1] : null;

const SUMMARY_SYSTEM = `You write FACT-DENSE summaries of portfolio artifacts. The summaries get loaded into a voice chat assistant's system prompt — they are often the ONLY thing the chat sees about an artifact when retrieval is degraded, so the chat will hallucinate concrete details if your summary is abstract.

CRITICAL: Lead with the most important SPECIFIC FACTS from the artifact (a name, number, headline, claim, URL, named person), not a meta-description of what the artifact is. The chat already knows the artifact exists — it needs the FACTS inside.

Rules:
- 2-3 sentences. Maximum 80 words.
- If the artifact contains key/value facts (a headline, location, metrics, names, URLs, dates, awards), surface those VERBATIM in the summary. Quote them exactly.
- Plain text only. No markdown, no headers, no bullet points.
- Use third person.
- Do NOT invent details. If the source doesn't include a fact, don't fabricate it.
- Do NOT use marketing fluff ("revolutionary", "cutting-edge", "comprehensive"). Be direct.
- Do NOT start with "This artifact", "A reference document", "The X is a", or any other meta-description. Lead with the actual fact.

GOOD example: "Dico's LinkedIn (linkedin.com/in/dico-angelo) headline is 'Partner Operations'. Based in Canada, 3,300+ followers. Open to Work enabled targeting Operations Partner, Operations Manager, and Partner Operations Manager roles. About section is the Metaventions AI Founder bio."

BAD example: "The LinkedIn Public Profile Snapshot is a reference document detailing Dico Angelo's public LinkedIn profile, including his identity, job-seeking preferences, and professional bio."

The good example tells the chat WHAT his headline is; the bad example only tells the chat that an artifact exists describing his headline.

Output ONLY the summary text. No preamble, no headers, no quotes.`;

async function summarize(title: string, content: string): Promise<string> {
  const trimmed = content.length > 8000 ? content.slice(0, 8000) + "\n\n[truncated]" : content;
  const response = await deepseek.messages.create({
    model: "deepseek-v4-pro",
    max_tokens: 200,
    temperature: 0.3,
    thinking: { type: "disabled" } as never,
    system: SUMMARY_SYSTEM,
    messages: [
      {
        role: "user",
        content: `Title: ${title}\n\n---\n\n${trimmed}`,
      },
    ],
  });
  const block = response.content.find((b: { type: string }) => b.type === "text");
  return block && "text" in block ? (block.text as string).trim() : "";
}

interface ArtifactRow {
  id: string;
  title: string;
  slug: string;
  category: string;
  content: string;
  summary: string | null;
}

async function main() {
  let query = supabase
    .from("artifacts")
    .select("id, title, slug, category, content, summary")
    .eq("status", "published")
    .order("category")
    .order("title");

  if (ONLY_SLUG) query = query.eq("slug", ONLY_SLUG);

  const { data, error } = await query;
  if (error) {
    console.error("Fetch failed:", error);
    process.exit(1);
  }

  const rows = (data as ArtifactRow[]) ?? [];
  // Treat the literal junk "## Overview" as missing.
  const targets = rows.filter((r) => {
    if (FORCE) return true;
    if (!r.summary) return true;
    if (r.summary.trim() === "## Overview") return true;
    return false;
  });

  console.log(`Found ${rows.length} published artifacts.`);
  console.log(`${targets.length} need summaries.${DRY ? " (dry run — no writes)" : ""}`);
  console.log("");

  let ok = 0;
  let failed = 0;

  for (const row of targets) {
    process.stdout.write(`[${row.category}] ${row.title.slice(0, 60)} ... `);
    try {
      const summary = await summarize(row.title, row.content);
      if (!summary || summary.length < 30) {
        console.log("EMPTY (skipped)");
        failed++;
        continue;
      }
      if (DRY) {
        console.log(`OK\n   ${summary}\n`);
        ok++;
        continue;
      }
      const { error: updateError } = await supabase
        .from("artifacts")
        .update({ summary, updated_at: new Date().toISOString() })
        .eq("id", row.id);
      if (updateError) {
        console.log(`UPDATE FAILED: ${updateError.message}`);
        failed++;
      } else {
        console.log("OK");
        console.log(`   ${summary}`);
        console.log("");
        ok++;
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.log(`ERROR: ${msg}`);
      failed++;
    }
  }

  console.log("");
  console.log(`Done. ${ok} succeeded, ${failed} failed.`);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
