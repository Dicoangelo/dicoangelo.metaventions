#!/usr/bin/env tsx
/**
 * Synthesis layer. Reads all published artifacts, sends a compact
 * (summary + head-of-body) packet to DeepSeek V4 Pro, asks it to
 * generate three meta-artifacts that capture cross-cutting patterns
 * the chat can cite without grepping the whole corpus:
 *
 *   1. Cross-Artifact Themes & Patterns
 *   2. Strongest Evidence Clusters (where multiple artifacts reinforce
 *      the same fact from different angles)
 *   3. Hirability Synthesis Across Archetypes
 *
 * Each is inserted as its own artifact (status=published, category=
 * deep-dive). Service-role direct insert; no chunk embeddings (Cohere
 * is at billing cap — these will surface via the always-loaded title
 * index + summary layer until embeddings come back).
 *
 * Run: npx tsx scripts/synthesize-meta-artifacts.ts [--dry-run]
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
const deepseek = new Anthropic({
  apiKey: DEEPSEEK_API_KEY,
  baseURL: "https://api.deepseek.com/anthropic",
});
const DRY = process.argv.includes("--dry-run");
const SYNTH_MODEL = process.env.SYNTH_MODEL ?? "deepseek-v4-pro";

interface Artifact {
  id: string;
  slug: string;
  title: string;
  category: string;
  summary: string | null;
  content: string;
}

const HEAD_CHARS = 1500; // per-artifact body excerpt
const MAX_PACKET = 90000; // safety cap on packet size

function buildPacket(artifacts: Artifact[]): string {
  const parts: string[] = [];
  parts.push(
    `# Dico Angelo — Full Artifact Corpus (compact view)\n\n` +
      `${artifacts.length} published artifacts. Each entry shows category, title, summary, ` +
      `and the first ${HEAD_CHARS} characters of the body.\n`
  );
  let used = parts.join("").length;
  for (const a of artifacts) {
    const body = (a.content ?? "").slice(0, HEAD_CHARS);
    const truncated = (a.content ?? "").length > HEAD_CHARS;
    const block =
      `\n---\n\n## [${a.category}] ${a.title}\n\n` +
      `**Slug:** ${a.slug}\n\n` +
      (a.summary ? `**Summary:** ${a.summary}\n\n` : "") +
      `**Body excerpt${truncated ? " (truncated)" : ""}:**\n\n${body}\n`;
    if (used + block.length > MAX_PACKET) {
      parts.push(`\n---\n\n[truncated — packet cap reached at ${used} chars]\n`);
      break;
    }
    parts.push(block);
    used += block.length;
  }
  return parts.join("");
}

interface MetaSpec {
  slug: string;
  title: string;
  brief: string;
}

const METAS: MetaSpec[] = [
  {
    slug: "synthesis-cross-artifact-themes-and-patterns",
    title: "Synthesis: Cross-Artifact Themes & Patterns",
    brief:
      `Identify the 6-10 highest-signal RECURRING THEMES that appear across multiple artifacts ` +
      `in the corpus. For each theme: name it crisply, list the 3-5 artifacts where it surfaces, ` +
      `and explain WHY this pattern matters for evaluating Dico as a hire. Themes should be ` +
      `cross-cutting (e.g., "ships own infra to 90%+ before involving anyone", "operational ` +
      `strategy disguised as IC role", "implements arXiv papers in days, not quarters"). ` +
      `Avoid restating headline metrics — focus on patterns of HOW he works.`,
  },
  {
    slug: "synthesis-strongest-evidence-clusters",
    title: "Synthesis: Strongest Evidence Clusters",
    brief:
      `Map the 8-12 specific CLAIMS in the corpus that are reinforced from MULTIPLE independent ` +
      `angles (different artifacts, different time windows, different evidence types). For each ` +
      `cluster: state the claim once, list the 3+ corroborating sources (artifact slugs / press ` +
      `URLs / metric tables / named people / dated commits), and rate corroboration strength ` +
      `(strong / medium / weak). This is the "what is most defensible if a recruiter pushes back" ` +
      `inventory. Skip single-source claims.`,
  },
  {
    slug: "synthesis-hirability-across-archetypes",
    title: "Synthesis: Hirability Across Target Role Archetypes",
    brief:
      `For each of the following archetypes, write a 200-word section: (1) Partner Operations / ` +
      `Cloud Alliance Strategist, (2) GTM Systems Architect / RevOps for AI infra, (3) Founding ` +
      `or early Product/Eng at AI-native company, (4) AI Product Strategist / Applied AI Lead, ` +
      `(5) Solutions Architect / Solutions Engineer (product-learnable, not deep-tech presales). ` +
      `Each section: (a) the 3 strongest fits from the corpus with artifact slugs, (b) the 1-2 ` +
      `honest gaps a recruiter will probe, (c) the counter-evidence Dico can cite for those ` +
      `gaps. End with a "hard-skip" list of role types this corpus does NOT support applying to.`,
  },
];

async function generateMeta(packet: string, spec: MetaSpec): Promise<string> {
  const response = await deepseek.messages.create({
    model: SYNTH_MODEL,
    max_tokens: 4000,
    temperature: 0.4,
    thinking: { type: "disabled" } as never,
    system:
      `You are a synthesis analyst building a HIGH-DENSITY meta-artifact about Dico Angelo from ` +
      `his full artifact corpus. Output is consumed by another LLM (the chat agent on his portfolio ` +
      `site) — not by humans directly. Optimize for: factual density, cite-ability, and crisp ` +
      `cross-references using artifact slugs in [brackets]. Do NOT invent facts; ground every ` +
      `claim in the corpus. If a claim cannot be supported by 2+ artifacts, mark it [single-source]. ` +
      `Use markdown headings. Be terse. No filler. No emojis. No "in conclusion" wrap-ups. ` +
      `Output ONLY the artifact body — no preamble, no apology, no "here is the synthesis".`,
    messages: [
      {
        role: "user",
        content:
          `# Corpus\n\n${packet}\n\n---\n\n# Your task\n\n## Title: ${spec.title}\n\n## Brief\n\n${spec.brief}\n\n` +
          `Write the artifact body now. Markdown. Start with an H1 of the title, then the analysis.`,
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
    system:
      `You write factual one-paragraph summaries (2-3 sentences, max 80 words). ` +
      `Lead with WHAT it is. Plain text, third person. Output only the summary.`,
    messages: [{ role: "user", content: `Title: ${title}\n\n---\n\n${trimmed}` }],
  });
  const block = response.content.find((b: { type: string }) => b.type === "text");
  return block && "text" in block ? (block.text as string).trim() : "";
}

async function upsertArtifact(spec: MetaSpec, body: string): Promise<void> {
  const { data: existing } = await sb
    .from("artifacts")
    .select("id")
    .eq("slug", spec.slug)
    .maybeSingle();

  if (existing?.id) {
    await sb.from("artifact_chunks").delete().eq("artifact_id", existing.id);
    await sb.from("artifacts").delete().eq("id", existing.id);
    console.log(`  · removed prior ${existing.id}`);
  }

  const { data, error } = await sb
    .from("artifacts")
    .insert({
      title: spec.title,
      slug: spec.slug,
      content: body,
      category: "deep-dive",
      tags: ["synthesis", "meta-artifact", "cross-cutting"],
      status: "published",
      published_at: new Date().toISOString(),
      version: 1,
    })
    .select()
    .single();

  if (error || !data) {
    console.error(`  ✗ insert failed:`, error);
    return;
  }
  console.log(`  ✓ inserted ${data.id} (${body.length} chars)`);

  const summary = await summarize(spec.title, body);
  if (summary && summary.length >= 30) {
    await sb.from("artifacts").update({ summary }).eq("id", data.id);
    console.log(`  ✓ summary: ${summary.slice(0, 120)}…`);
  }
}

async function main(): Promise<void> {
  console.log(`[synthesis] loading published artifacts…`);
  const { data, error } = await sb
    .from("artifacts")
    .select("id,slug,title,category,summary,content")
    .eq("status", "published")
    .order("category", { ascending: true })
    .order("title", { ascending: true });

  if (error || !data) {
    console.error("load failed:", error);
    process.exit(1);
  }

  // Skip prior synthesis artifacts so we don't feed the model its own output.
  const corpus = (data as Artifact[]).filter((a) => !a.slug.startsWith("synthesis-"));
  console.log(`[synthesis] corpus: ${corpus.length} artifacts`);

  const packet = buildPacket(corpus);
  console.log(`[synthesis] packet: ${packet.length} chars (~${Math.round(packet.length / 4)} tok)`);

  if (DRY) {
    console.log(`[dry] would generate ${METAS.length} meta-artifacts and skip insert.`);
    console.log(`[dry] packet preview:\n${packet.slice(0, 600)}\n…\n${packet.slice(-400)}`);
    return;
  }

  for (const spec of METAS) {
    console.log(`\n[synthesis] generating: ${spec.title}`);
    try {
      const body = await generateMeta(packet, spec);
      if (!body || body.length < 500) {
        console.error(`  ✗ output too short (${body.length} chars), skipping`);
        continue;
      }
      await upsertArtifact(spec, body);
    } catch (err) {
      console.error(`  ✗ generation failed:`, err);
    }
  }

  console.log(`\n[synthesis] done.`);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
