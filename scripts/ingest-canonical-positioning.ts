#!/usr/bin/env tsx
/**
 * Ingest Dico's canonical applied positioning into the artifacts table.
 *
 * Pulls the master profile v3 + every tailored resume from job-search/
 * + the application autofill profile, combines into a single artifact,
 * and inserts via service role (bypasses RLS + does NOT call Cohere
 * since we're hitting the billing cap mid-month).
 *
 * Without chunk embeddings, this artifact still surfaces in the
 * three-layer-retrieval prompt index used by both chat and the JD
 * analyzer because that index loads title + summary for every
 * published artifact regardless of whether chunks exist.
 *
 * Run: npx tsx scripts/ingest-canonical-positioning.ts [--dry-run]
 */

import { config } from "dotenv";
import { resolve } from "path";
import { readFileSync, existsSync } from "fs";
import { homedir } from "os";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import Anthropic from "@anthropic-ai/sdk";

config({ path: resolve(process.cwd(), ".env.local") });

const HOME = homedir();
const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, DEEPSEEK_API_KEY } = process.env;
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !DEEPSEEK_API_KEY) {
  console.error("Missing required env: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, DEEPSEEK_API_KEY");
  process.exit(1);
}
const sb: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
const deepseek = new Anthropic({
  apiKey: DEEPSEEK_API_KEY,
  baseURL: "https://api.deepseek.com/anthropic",
});

const DRY = process.argv.includes("--dry-run");

const SOURCES = {
  master: `${HOME}/projects/career/resume-hub/templates/dico-angelo-master-profile-v3-final.md`,
  appProfile: `${HOME}/projects/career/resume-hub/_profile/application-profile.json`,
  tailored: [
    { role: "Partner Ops Recruitment Activation @ Anthropic", path: `${HOME}/projects/career/job-search/anthropic-partner-ops-recruitment-activation/resume.md` },
    { role: "Sr RevOps Analyst @ Lightspeed", path: `${HOME}/projects/career/job-search/lightspeed-sr-revops-analyst/resume.md` },
    { role: "Partner Success Strategy & Ops @ Ramp", path: `${HOME}/projects/career/job-search/ramp-partner-success-strategy-ops/resume.md` },
    { role: "Black is Tech Houston 2026 — Resume Book", path: `${HOME}/projects/career/job-search/blackistech-houston-2026/RESUME_BOOK_SUBMISSION.md` },
    { role: "Citi (combined)", path: `${HOME}/projects/career/job-search/citi/resume-combined.md` },
    { role: "Nebius (combined)", path: `${HOME}/projects/career/job-search/nebius/research/resume-combined.md` },
    { role: "Iterable (combined)", path: `${HOME}/projects/career/job-search/iterable/resume-combined.md` },
    { role: "Partnership Leaders (combined)", path: `${HOME}/projects/career/job-search/partnership-leaders/resume-combined.md` },
  ],
};

function read(path: string): string | null {
  if (!existsSync(path)) return null;
  return readFileSync(path, "utf8").trim();
}

const SUMMARY_SYSTEM = `You write factual one-paragraph summaries of portfolio artifacts for a voice chat assistant's system prompt.

Rules:
- 2-3 sentences. Maximum 80 words.
- Lead with WHAT it is and WHO it's for. Then most concrete facts.
- Plain text only. No markdown, no headers, no bullets.
- Use third person.
- Do NOT invent. Do NOT use marketing fluff.
- Output ONLY the summary text. No preamble.`;

async function summarize(title: string, content: string): Promise<string> {
  const trimmed = content.length > 8000 ? content.slice(0, 8000) + "\n\n[truncated]" : content;
  const response = await deepseek.messages.create({
    model: "deepseek-v4-pro",
    max_tokens: 200,
    temperature: 0.3,
    thinking: { type: "disabled" } as never,
    system: SUMMARY_SYSTEM,
    messages: [{ role: "user", content: `Title: ${title}\n\n---\n\n${trimmed}` }],
  });
  const block = response.content.find((b: { type: string }) => b.type === "text");
  return block && "text" in block ? (block.text as string).trim() : "";
}

async function main() {
  const sections: string[] = [];
  sections.push(`# Canonical Applied Positioning — Resume Corpus

This is Dico Angelo's distilled, policy-checked positioning across every role he's applied to. Each tailored resume below shows how he frames his experience for a different role archetype (partner ops, revops, partner success, solutions, strategy). The master profile is the canonical source he derives from.

**For the JD analyzer:** when matching a JD, prefer language and metrics that appear in this corpus over speculative framings. The closest archetype here is the strongest fit signal.`);

  // Master profile
  const master = read(SOURCES.master);
  if (master) {
    sections.push(`## MASTER PROFILE (v3 final)\n\n${master}`);
    console.log(`  ✓ master profile: ${master.length} chars`);
  } else {
    console.log("  [warn] master profile missing");
  }

  // Application autofill (legal name, location, EEO defaults — useful baseline)
  const appProfile = read(SOURCES.appProfile);
  if (appProfile) {
    sections.push(`## APPLICATION AUTOFILL PROFILE\n\nThe canonical legal/personal data Dico submits to ATS forms. Use as the source of truth for name, location, visa status, EEO defaults.\n\n\`\`\`json\n${appProfile}\n\`\`\``);
    console.log(`  ✓ application profile: ${appProfile.length} chars`);
  }

  // Tailored resumes
  for (const t of SOURCES.tailored) {
    const body = read(t.path);
    if (!body) {
      console.log(`  [warn] missing: ${t.role}`);
      continue;
    }
    sections.push(`## TAILORED RESUME — ${t.role}\n\n${body}`);
    console.log(`  ✓ ${t.role}: ${body.length} chars`);
  }

  const content = sections.join("\n\n---\n\n");
  console.log("");
  console.log(`Total artifact body: ${content.length} chars`);

  const slug = "canonical-applied-positioning-resume-corpus";
  const title = "Canonical Applied Positioning: Resume Corpus";

  if (DRY) {
    console.log("\n[dry run] would upsert artifact + generate summary; skipping writes");
    return;
  }

  // Upsert: delete any prior version then insert fresh.
  const { data: existing } = await sb
    .from("artifacts")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();

  if (existing?.id) {
    await sb.from("artifact_chunks").delete().eq("artifact_id", existing.id);
    await sb.from("artifacts").delete().eq("id", existing.id);
    console.log(`  removed prior artifact ${existing.id}`);
  }

  const { data: artifact, error: insertErr } = await sb
    .from("artifacts")
    .insert({
      title,
      slug,
      content,
      category: "deep-dive",
      tags: ["positioning", "resumes", "applied-narrative", "jd-matching"],
      external_links: {},
      status: "published",
      published_at: new Date().toISOString(),
      version: 1,
    })
    .select()
    .single();

  if (insertErr || !artifact) {
    console.error("Insert failed:", insertErr);
    process.exit(1);
  }
  console.log(`  ✓ inserted artifact ${artifact.id}`);

  // Generate summary
  const summary = await summarize(title, content);
  if (summary && summary.length >= 30) {
    await sb.from("artifacts").update({ summary }).eq("id", artifact.id);
    console.log(`  ✓ summary written:`);
    console.log(`    ${summary}`);
  } else {
    console.log("  [warn] summary generation produced empty result");
  }

  console.log("\nDone. Artifact will appear in the chat + JD analyzer prompt index on next request (5-min cache TTL).");
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
