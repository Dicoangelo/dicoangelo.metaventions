#!/usr/bin/env tsx
/**
 * Ingest the 6 missing project artifacts that the chat was previously
 * hallucinating about. Uses service-role direct insert, NO chunk
 * embeddings (Cohere is at billing cap). Without chunks the artifact
 * still surfaces in chat + JD analyzer through the always-loaded
 * title+summary index — that's enough for the bot to refuse
 * cleanly OR answer accurately on each project.
 *
 * When Cohere/Voyage is restored, re-running with the existing
 * scripts/ingest-projects-batch.ts will chunk-embed the same content
 * for deeper retrieval.
 *
 * Run: npx tsx scripts/ingest-missing-projects-no-embeddings.ts [--dry-run]
 */

import { config } from "dotenv";
import { resolve } from "path";
import { homedir } from "os";
import { readFileSync, existsSync } from "fs";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import Anthropic from "@anthropic-ai/sdk";

config({ path: resolve(process.cwd(), ".env.local") });

const HOME = homedir();
const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, DEEPSEEK_API_KEY } = process.env;
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !DEEPSEEK_API_KEY) {
  console.error("Missing env");
  process.exit(1);
}
const sb: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
const deepseek = new Anthropic({ apiKey: DEEPSEEK_API_KEY, baseURL: "https://api.deepseek.com/anthropic" });
const DRY = process.argv.includes("--dry-run");

interface Spec {
  slug: string;
  title: string;
  category: "project";
  tags: string[];
  external_links: Record<string, string>;
  oneLineLeadIn: string;
  sources: string[];
}

const PROJECTS: Spec[] = [
  {
    slug: "project-partnership-graph",
    title: "Partnership Graph: AI Orchestration Layer for Cloud Alliances",
    category: "project",
    tags: ["partnerships", "ai-orchestration", "ucw", "bloomberg-for-partnerships", "live"],
    external_links: { live: "https://partnerships.metaventionsai.com" },
    oneLineLeadIn: "Partnership Graph is an AI orchestration layer for enterprise cloud alliances — Bloomberg for partnerships, built on top of the UCW substrate. Launched March 25, 2026 with a 30-day category-claim window. Strategy doc claims a $3.2B SAM.",
    sources: [
      `${HOME}/projects/partnership-ai-orchestration/README.md`,
      `${HOME}/projects/partnership-ai-orchestration/STRATEGY.md`,
      `${HOME}/.claude/memory/project_partnership_graph.md`,
    ],
  },
  {
    slug: "project-cinema-studio",
    title: "Cinema Studio: Multi-Provider Cinematic Video Generation",
    category: "project",
    tags: ["video-generation", "kling", "luma", "fal", "cinema", "os-app"],
    external_links: {},
    oneLineLeadIn: "Cinema Studio is a multi-provider cinematic video generation system Dico shipped into the OS-App platform in May 2026. The substrate is Kling 3.0 Pro/Master and Luma Ray 2 (Seedance 2.0 was abandoned for face-lock work). Approximately 2,300 lines of TypeScript, auto-download to a renders directory, 4-tier execution roadmap.",
    sources: [
      `${HOME}/.claude/memory/project_cinema_studio.md`,
      `${HOME}/.claude/memory/project_cinema_substrate_pivot.md`,
      `${HOME}/.claude/memory/project_cinema_buildout_roadmap.md`,
    ],
  },
  {
    slug: "project-convergence-stack",
    title: "Convergence Stack: 8-Layer Digital Infrastructure Model",
    category: "project",
    tags: ["infrastructure", "thesis", "research", "bentley-bootcamp", "framework"],
    external_links: {},
    oneLineLeadIn: "Convergence Stack is an 8-layer model of digital infrastructure convergence Dico developed coming out of the Bentley Bootcamp. It encompasses research papers, an interactive app, visual assets, and a dynasty-thesis framing for how AI infrastructure stacks up.",
    sources: [
      `${HOME}/projects/convergence-stack/CLAUDE.md`,
      `${HOME}/.claude/memory/project_convergence_stack.md`,
    ],
  },
  {
    slug: "project-brooks-vitality",
    title: "Brooks Vitality: Coaching Brand for Donovan Brooks",
    category: "project",
    tags: ["client-work", "coaching", "vercel", "stripe", "cal-com", "tally"],
    external_links: { preview: "https://brooksvitality.metaventionsai.com" },
    oneLineLeadIn: "Brooks Vitality is a coaching and vitality brand Dico is building for client Donovan Brooks. Stack is Vercel static + Cal.com + Stripe + Tally, preview live at brooksvitality.metaventionsai.com. Status as of late April 2026 is pre-intake — blocked on niche, credentials, transformations, pricing, and photos.",
    sources: [
      `${HOME}/projects/donovan/README.md`,
      `${HOME}/.claude/memory/project_donovan_coaching.md`,
    ],
  },
  {
    slug: "project-nile-savannah",
    title: "Nile Savannah Co.: Heritage Homewares for Monica Kuku",
    category: "project",
    tags: ["client-work", "shopify", "ecommerce", "heritage-brand", "live-preview"],
    external_links: { preview: "https://nilesavannah.metaventionsai.com" },
    oneLineLeadIn: "Nile Savannah Co. is a heritage homewares brand Dico built for client Monica Kuku, a Sudanese-Egyptian founder in Springfield MA. Eight Kenyan soapstone SKUs, Shopify-bound, multi-page static deploy at nilesavannah.metaventionsai.com.",
    sources: [
      `${HOME}/projects/monica/README.md`,
      `${HOME}/.claude/memory/project_nile_savannah.md`,
    ],
  },
  {
    slug: "project-nightingale",
    title: "Project Nightingale: Surgical Robotics & OR Workflow Venture",
    category: "project",
    tags: ["healthcare", "robotics", "venture", "research", "or-workflow"],
    external_links: {},
    oneLineLeadIn: "Project Nightingale is a surgical robotics and OR-workflow venture Dico is building with Zack Goldfarb (formerly of Pulmonx and Stryker). NotebookLM-based research notebook in flight, Health Board Advisors network engaged.",
    sources: [
      `${HOME}/.claude/memory/project_nightingale.md`,
    ],
  },
];

function readSources(spec: Spec): string {
  const sections: string[] = [`# ${spec.title}\n\n${spec.oneLineLeadIn}\n`];
  for (const path of spec.sources) {
    if (!existsSync(path)) {
      console.warn(`  [warn] missing: ${path}`);
      continue;
    }
    const raw = readFileSync(path, "utf8").trim();
    if (!raw) continue;
    const label = path.split("/").slice(-2).join("/");
    sections.push(`## Source: ${label}\n\n${raw}`);
  }
  return sections.join("\n\n---\n\n");
}

async function summarize(title: string, content: string): Promise<string> {
  const trimmed = content.length > 8000 ? content.slice(0, 8000) + "\n\n[truncated]" : content;
  const response = await deepseek.messages.create({
    model: "deepseek-v4-pro",
    max_tokens: 200,
    temperature: 0.3,
    thinking: { type: "disabled" } as never,
    system: `You write factual one-paragraph summaries (2-3 sentences, max 80 words). Lead with WHAT it is. Plain text, third person. Output only the summary.`,
    messages: [{ role: "user", content: `Title: ${title}\n\n---\n\n${trimmed}` }],
  });
  const block = response.content.find((b: { type: string }) => b.type === "text");
  return block && "text" in block ? (block.text as string).trim() : "";
}

async function main() {
  let ok = 0;
  let failed = 0;

  for (const spec of PROJECTS) {
    console.log(`\n[${spec.category}] ${spec.title}`);
    const content = readSources(spec);
    console.log(`  ${spec.sources.length} sources, ${content.length} bytes`);

    if (DRY) {
      console.log(`  [dry] would upsert`);
      ok++;
      continue;
    }

    const { data: existing } = await sb.from("artifacts").select("id").eq("slug", spec.slug).maybeSingle();
    if (existing?.id) {
      await sb.from("artifact_chunks").delete().eq("artifact_id", existing.id);
      await sb.from("artifacts").delete().eq("id", existing.id);
      console.log(`  removed prior ${existing.id}`);
    }

    const { data, error } = await sb.from("artifacts").insert({
      title: spec.title,
      slug: spec.slug,
      content,
      category: spec.category,
      tags: spec.tags,
      external_links: spec.external_links,
      status: "published",
      published_at: new Date().toISOString(),
      version: 1,
    }).select().single();

    if (error || !data) {
      console.error("  insert failed:", error);
      failed++;
      continue;
    }
    console.log(`  ✓ inserted ${data.id}`);

    const summary = await summarize(spec.title, content);
    if (summary && summary.length >= 30) {
      await sb.from("artifacts").update({ summary }).eq("id", data.id);
      console.log(`  ✓ ${summary}`);
      ok++;
    } else {
      console.log("  [warn] empty summary");
      failed++;
    }
  }

  console.log(`\nDone. ${ok} ok, ${failed} failed.`);
}

main().catch((err) => { console.error("Fatal:", err); process.exit(1); });
