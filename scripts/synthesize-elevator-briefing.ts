#!/usr/bin/env tsx
/**
 * Elevator briefing — compound synthesis pass.
 *
 * Reads the 3 PR-#20 synthesis artifacts plus any other deep-dive
 * artifacts and asks DeepSeek V4 Pro to produce a single ~2-page
 * max-density "elevator briefing" — the chat's go-to source for
 * short answers like "tell me about Dico in 30 seconds", "give me
 * his top-3 strengths", "what's the elevator pitch".
 *
 * Compound, not raw: this is synthesis OF synthesis. Cheap, rare,
 * high leverage.
 *
 * Run: npx tsx scripts/synthesize-elevator-briefing.ts [--dry-run]
 */

import { config } from "dotenv";
import { resolve } from "path";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import Anthropic from "@anthropic-ai/sdk";

config({ path: resolve(process.cwd(), ".env.local") });

const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, DEEPSEEK_API_KEY } = process.env;
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !DEEPSEEK_API_KEY) {
  console.error("Missing env: SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY / DEEPSEEK_API_KEY");
  process.exit(1);
}

const sb: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
const deepseek = new Anthropic({ apiKey: DEEPSEEK_API_KEY, baseURL: "https://api.deepseek.com/anthropic" });
const DRY = process.argv.includes("--dry-run");
const SYNTH_MODEL = process.env.SYNTH_MODEL ?? "deepseek-v4-pro";

const TARGET_SLUG = "elevator-briefing-30-second-pitch";
const TARGET_TITLE = "Elevator Briefing: 30-Second & 2-Minute Pitches";

// Prefer compound input — the synthesis artifacts already digested the corpus.
const SOURCE_SLUGS_PRIORITY = [
  "synthesis-cross-artifact-themes-and-patterns",
  "synthesis-strongest-evidence-clusters",
  "synthesis-hirability-across-archetypes",
  "press-urls-and-public-awards-index",
  "linkedin-public-profile-snapshot",
  "live-site-headline-facts",
  "quantified-achievement-atlas",
  "stories-and-specifics-named-people-and-anecdotes",
];

interface Artifact {
  id: string;
  slug: string;
  title: string;
  category: string;
  summary: string | null;
  content: string;
}

async function loadSources(): Promise<Artifact[]> {
  const { data, error } = await sb
    .from("artifacts")
    .select("id,slug,title,category,summary,content")
    .in("slug", SOURCE_SLUGS_PRIORITY)
    .eq("status", "published");
  if (error || !data) {
    console.error("load failed:", error);
    process.exit(1);
  }
  // Order by SOURCE_SLUGS_PRIORITY
  const order = new Map(SOURCE_SLUGS_PRIORITY.map((s, i) => [s, i]));
  return (data as Artifact[]).sort(
    (a, b) => (order.get(a.slug) ?? 99) - (order.get(b.slug) ?? 99)
  );
}

function buildPacket(sources: Artifact[]): string {
  const parts: string[] = [`# Compound Source Material — Synthesis Inputs\n`];
  for (const a of sources) {
    parts.push(
      `\n---\n\n## [${a.category}] ${a.title}\n\n` +
        `**Slug:** ${a.slug}\n\n` +
        (a.summary ? `**Summary:** ${a.summary}\n\n` : "") +
        `**Full content:**\n\n${a.content}\n`
    );
  }
  return parts.join("");
}

const BRIEF =
  `Produce a HIGH-DENSITY elevator briefing artifact. Output is consumed by another LLM ` +
  `(the chat agent on Dico's portfolio site) — not by humans directly. The chat will reach ` +
  `for this artifact when a visitor asks for a SHORT answer about Dico — "elevator pitch", ` +
  `"top 3 strengths", "30-second summary", "TL;DR", or any question that needs the most ` +
  `compressed possible truthful answer.\n\n` +
  `STRUCTURE THE OUTPUT AS:\n\n` +
  `## 1. The 30-Second Pitch (≤80 words)\n` +
  `Single paragraph. What Dico is, what he's done, what he's looking for. No filler. ` +
  `One concrete metric anchor.\n\n` +
  `## 2. The 2-Minute Pitch (≤300 words)\n` +
  `Three short paragraphs: (a) operator backbone (Contentsquare cloud alliance), ` +
  `(b) builder velocity (Metaventions AI shipped systems + arXiv-to-prod), ` +
  `(c) what role lane he's targeting + why that intersection is rare. Each paragraph ` +
  `must include 1-2 specific evidence anchors with artifact slugs in [brackets].\n\n` +
  `## 3. Top 3 Strengths (with the strongest evidence anchor for each)\n` +
  `Bullet list. Each strength: one short claim + the single best supporting fact ` +
  `(metric, named person, dated artifact). No more than 25 words per bullet.\n\n` +
  `## 4. Top 3 Probes a Skeptical Recruiter Will Make (and the honest counter for each)\n` +
  `Bullet list. Acknowledge the kernel of truth, then the strongest counter-evidence with slug.\n\n` +
  `## 5. The "When You Should Hire Him Right Now" Trigger List\n` +
  `5-7 bullets describing concrete role/company signals that indicate immediate fit. ` +
  `Be specific (e.g. "Series B AI infra company building first formal partner program") ` +
  `not generic ("any company").\n\n` +
  `## 6. The "When You Should NOT Pitch Him" Skip List\n` +
  `4-6 bullets describing role types, company stages, or contexts where this corpus ` +
  `does NOT support a strong fit. Honest > tempting.\n\n` +
  `RULES:\n` +
  `- Ground every claim in the source material below; cite by slug in [brackets]\n` +
  `- Do NOT invent metrics; if a number isn't in the sources, don't use it\n` +
  `- No filler, no "in conclusion", no emojis, no apologetic hedging\n` +
  `- Use plain markdown headings; no fancy formatting tricks\n` +
  `- Output ONLY the artifact body — no preamble`;

async function generate(packet: string): Promise<string> {
  const response = await deepseek.messages.create({
    model: SYNTH_MODEL,
    max_tokens: 4000,
    temperature: 0.35,
    thinking: { type: "disabled" } as never,
    system:
      `You are writing the highest-density single artifact in Dico Angelo's portfolio chat ` +
      `corpus. This artifact will be reached for whenever the chat needs a compressed truthful ` +
      `answer. Optimize for: factual density, cite-ability via [slug] references, zero ` +
      `fabrication. If a claim cannot be supported by the source material below, omit it. ` +
      `Be terse, factual, and structurally crisp.`,
    messages: [
      {
        role: "user",
        content: `${packet}\n\n---\n\n# Your task\n\n## Title: ${TARGET_TITLE}\n\n## Brief\n\n${BRIEF}\n\nWrite the artifact body now. Markdown. Start with an H1 of the title.`,
      },
    ],
  });
  const block = response.content.find((b: { type: string }) => b.type === "text");
  return block && "text" in block ? (block.text as string).trim() : "";
}

async function summarize(title: string, content: string): Promise<string> {
  const trimmed = content.length > 8000 ? content.slice(0, 8000) + "\n\n[truncated]" : content;
  const response = await deepseek.messages.create({
    model: SYNTH_MODEL,
    max_tokens: 200,
    temperature: 0.3,
    thinking: { type: "disabled" } as never,
    system: `You write factual one-paragraph summaries (2-3 sentences, max 80 words). Lead with WHAT it is. Plain text, third person. Output only the summary.`,
    messages: [{ role: "user", content: `Title: ${title}\n\n---\n\n${trimmed}` }],
  });
  const block = response.content.find((b: { type: string }) => b.type === "text");
  return block && "text" in block ? (block.text as string).trim() : "";
}

async function main(): Promise<void> {
  console.log(`[elevator] loading source artifacts…`);
  const sources = await loadSources();
  console.log(`[elevator] sources loaded: ${sources.length}`);
  for (const s of sources) console.log(`  · ${s.slug} (${s.content.length} chars)`);

  const packet = buildPacket(sources);
  console.log(`[elevator] packet: ${packet.length} chars (~${Math.round(packet.length / 4)} tok)`);

  if (DRY) {
    console.log(`[dry] would generate elevator briefing`);
    return;
  }

  console.log(`\n[elevator] generating…`);
  const body = await generate(packet);
  if (!body || body.length < 800) {
    console.error(`✗ output too short (${body.length} chars)`);
    process.exit(1);
  }
  console.log(`  · generated ${body.length} chars`);

  const { data: existing } = await sb.from("artifacts").select("id").eq("slug", TARGET_SLUG).maybeSingle();
  if (existing?.id) {
    await sb.from("artifact_chunks").delete().eq("artifact_id", existing.id);
    await sb.from("artifacts").delete().eq("id", existing.id);
    console.log(`  · removed prior ${existing.id}`);
  }

  const { data, error } = await sb
    .from("artifacts")
    .insert({
      title: TARGET_TITLE,
      slug: TARGET_SLUG,
      content: body,
      category: "deep-dive",
      tags: ["elevator-pitch", "compound-synthesis", "tldr", "high-density"],
      status: "published",
      published_at: new Date().toISOString(),
      version: 1,
    })
    .select()
    .single();

  if (error || !data) {
    console.error(`✗ insert failed:`, error);
    process.exit(1);
  }
  console.log(`✓ inserted ${data.id}`);

  const summary = await summarize(TARGET_TITLE, body);
  if (summary && summary.length >= 30) {
    await sb.from("artifacts").update({ summary }).eq("id", data.id);
    console.log(`✓ summary: ${summary}`);
  }
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
