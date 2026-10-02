#!/usr/bin/env tsx
/**
 * Summary fact-density auditor.
 *
 * Scores each artifact's summary on whether it contains *facts* the
 * chat can cite, vs. abstract meta-description. Low scores indicate
 * the summary will cause the chat to hallucinate concrete details
 * when retrieval is degraded (Cohere off, etc).
 *
 * Scoring (additive, max 5):
 *   +1 contains a digit
 *   +1 contains a quoted string (verbatim fact)
 *   +1 contains a URL or @-handle
 *   +1 contains a Capitalized Multi-Word Proper Noun beyond "Dico Angelo"
 *   +1 does NOT start with a meta-description anti-pattern
 *
 * Run: npx tsx scripts/audit-summary-fact-density.ts
 */

import { config } from "dotenv";
import { resolve } from "path";
import { createClient } from "@supabase/supabase-js";

config({ path: resolve(process.cwd(), ".env.local") });

const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Missing env: SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const META_ANTIPATTERNS = [
  /^this artifact/i,
  /^a reference document/i,
  /^the (?:[a-z]+ ){1,3}is a /i,
  /^an? (?:overview|summary|reference|document|guide) (?:of|to|for) /i,
  /^outlines /i,
  /^describes /i,
  /^covers /i,
  /^details /i,
];

interface ScoredSummary {
  slug: string;
  title: string;
  summary: string;
  score: number;
  reasons: string[];
}

function score(summary: string | null): { score: number; reasons: string[] } {
  if (!summary) return { score: 0, reasons: ["no summary"] };
  const reasons: string[] = [];
  let s = 0;

  if (/\d/.test(summary)) {
    s++;
    reasons.push("digit");
  } else {
    reasons.push("NO digit");
  }

  if (/["'][^"']{3,}["']/.test(summary)) {
    s++;
    reasons.push("quoted-fact");
  }

  if (/https?:\/\/|@\w+|\w+\.(?:com|io|ai|org|net)/i.test(summary)) {
    s++;
    reasons.push("url/handle");
  }

  // Capitalized multi-word proper noun (org/product/person name) beyond "Dico Angelo"
  const proper = summary.match(/\b[A-Z][a-z]+(?: [A-Z][a-z]+)+\b/g) || [];
  const beyondDico = proper.filter(
    (p) => p !== "Dico Angelo" && !/^Dico\b/.test(p)
  );
  if (beyondDico.length >= 2) {
    s++;
    reasons.push(`proper-nouns(${beyondDico.length})`);
  }

  if (!META_ANTIPATTERNS.some((re) => re.test(summary.trim()))) {
    s++;
    reasons.push("non-meta-opener");
  } else {
    reasons.push("META-OPENER");
  }

  return { score: s, reasons };
}

async function main(): Promise<void> {
  const { data, error } = await sb
    .from("artifacts")
    .select("slug,title,summary")
    .eq("status", "published");
  if (error || !data) {
    console.error("load failed:", error);
    process.exit(1);
  }

  const scored: ScoredSummary[] = (
    data as { slug: string; title: string; summary: string | null }[]
  ).map((a) => {
    const { score: s, reasons } = score(a.summary);
    return { slug: a.slug, title: a.title, summary: a.summary ?? "", score: s, reasons };
  });

  scored.sort((a, b) => a.score - b.score);

  const buckets = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } as Record<number, number>;
  for (const s of scored) buckets[s.score]++;

  console.log(`Audited ${scored.length} published artifacts.\n`);
  console.log("Score distribution:");
  for (const [score, count] of Object.entries(buckets)) {
    const bar = "█".repeat(count);
    console.log(`  ${score}/5: ${count.toString().padStart(2)}  ${bar}`);
  }
  console.log("");

  const lowest = scored.filter((s) => s.score <= 2);
  if (lowest.length) {
    console.log(`⚠  ${lowest.length} artifacts with score ≤ 2 (re-summarize these):\n`);
    for (const s of lowest) {
      console.log(`  [${s.score}/5] ${s.slug}`);
      console.log(`    reasons: ${s.reasons.join(", ")}`);
      console.log(`    summary: ${s.summary.slice(0, 160)}${s.summary.length > 160 ? "…" : ""}\n`);
    }
  } else {
    console.log("✓ No artifacts with score ≤ 2.");
  }

  const exemplars = scored.filter((s) => s.score === 5).slice(0, 3);
  if (exemplars.length) {
    console.log(`\n✓ Top exemplar fact-dense summaries:\n`);
    for (const s of exemplars) {
      console.log(`  [5/5] ${s.slug}`);
      console.log(`    ${s.summary}\n`);
    }
  }
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
