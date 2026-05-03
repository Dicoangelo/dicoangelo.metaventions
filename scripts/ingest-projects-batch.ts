#!/usr/bin/env tsx
/**
 * Batch-ingest missing projects into the artifacts + artifact_chunks tables.
 *
 * Reads source markdown from disk (project README / CLAUDE.md / memory file),
 * concatenates them into a single artifact body, then calls createArtifact()
 * which handles chunking + Cohere embedding + Supabase insert.
 *
 * After all artifacts land, auto-generates summaries via the existing
 * scripts/generate-artifact-summaries.ts logic so they show up in the
 * three-layer-retrieval prompt index immediately.
 *
 * Usage:
 *   npx tsx scripts/ingest-projects-batch.ts             # ingest all configured
 *   npx tsx scripts/ingest-projects-batch.ts --dry-run   # preview only
 *   npx tsx scripts/ingest-projects-batch.ts --slug X    # one specific project
 */

import { config } from "dotenv";
import { resolve } from "path";
import { readFileSync, existsSync } from "fs";
import { homedir } from "os";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { CohereClient } from "cohere-ai";

config({ path: resolve(process.cwd(), ".env.local") });

const HOME = homedir();

const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, COHERE_API_KEY } = process.env;
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !COHERE_API_KEY) {
  console.error("Missing required env: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, COHERE_API_KEY");
  process.exit(1);
}

const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
const cohere = new CohereClient({ token: COHERE_API_KEY });

interface ProjectSpec {
  slug: string;
  title: string;
  category: "project";
  tags: string[];
  external_links: Record<string, string>;
  sources: string[];
  oneLineLeadIn: string; // injected at the top to anchor the artifact
}

const PROJECTS: ProjectSpec[] = [
  {
    slug: "project-partnership-graph",
    title: "Partnership Graph: AI Orchestration Layer for Cloud Alliances",
    category: "project",
    tags: ["partnerships", "ai-orchestration", "ucw", "bloomberg-for-partnerships"],
    external_links: {
      live: "https://partnerships.metaventionsai.com",
    },
    sources: [
      `${HOME}/projects/partnership-ai-orchestration/README.md`,
      `${HOME}/projects/partnership-ai-orchestration/STRATEGY.md`,
      `${HOME}/.claude/memory/project_partnership_graph.md`,
    ],
    oneLineLeadIn:
      "Partnership Graph is an AI orchestration layer for enterprise cloud alliances — Bloomberg for partnerships, built on top of the UCW substrate. It claims a $3.2B SAM and was launched with a 30-day category-claim window in March 2026.",
  },
  {
    slug: "project-cinema-studio",
    title: "Cinema Studio: Multi-Provider Video Generation",
    category: "project",
    tags: ["video-generation", "kling", "luma", "seedance", "fal", "cinema"],
    external_links: {},
    sources: [
      `${HOME}/.claude/memory/project_cinema_studio.md`,
      `${HOME}/.claude/memory/project_cinema_substrate_pivot.md`,
      `${HOME}/.claude/memory/project_cinema_buildout_roadmap.md`,
    ],
    oneLineLeadIn:
      "Cinema Studio is a multi-provider cinematic video generation system Dico built into the OS-App platform in May 2026. It uses Kling 3.0 Pro/Master and Luma Ray 2 as the face-lock substrate (Seedance 2.0 was abandoned for face-lock work), with auto-download to a renders directory and a 4-tier execution roadmap.",
  },
  {
    slug: "project-convergence-stack",
    title: "Convergence Stack: 8-Layer Digital Infrastructure Model",
    category: "project",
    tags: ["infrastructure", "thesis", "research", "bentley-bootcamp"],
    external_links: {},
    sources: [
      `${HOME}/projects/convergence-stack/CLAUDE.md`,
      `${HOME}/.claude/memory/project_convergence_stack.md`,
    ],
    oneLineLeadIn:
      "Convergence Stack is an 8-layer model of digital infrastructure convergence Dico developed coming out of the Bentley Bootcamp. It encompasses research papers, an interactive app, visual assets, and a dynasty-thesis framing for how AI infrastructure stacks up.",
  },
  {
    slug: "project-brooks-vitality",
    title: "Brooks Vitality: Coaching Brand Build for Donovan Brooks",
    category: "project",
    tags: ["client-work", "coaching", "vercel", "stripe", "cal-com", "tally"],
    external_links: {
      preview: "https://brooksvitality.metaventionsai.com",
    },
    sources: [
      `${HOME}/projects/donovan/README.md`,
      `${HOME}/.claude/memory/project_donovan_coaching.md`,
    ],
    oneLineLeadIn:
      "Brooks Vitality is a coaching and vitality brand Dico is building for client Donovan Brooks. The stack is Vercel static + Cal.com + Stripe + Tally, with the preview live at brooksvitality.metaventionsai.com. Status as of April 2026 is pre-intake — blocked on niche, credentials, transformations, pricing, and photos.",
  },
  {
    slug: "project-nile-savannah",
    title: "Nile Savannah Co.: Heritage Homewares for Monica Kuku",
    category: "project",
    tags: ["client-work", "shopify", "ecommerce", "heritage-brand"],
    external_links: {
      preview: "https://nilesavannah.metaventionsai.com",
    },
    sources: [
      `${HOME}/projects/monica/README.md`,
      `${HOME}/.claude/memory/project_nile_savannah.md`,
    ],
    oneLineLeadIn:
      "Nile Savannah Co. is a heritage homewares brand Dico built for client Monica Kuku, a Sudanese-Egyptian founder in Springfield MA. Eight Kenyan soapstone SKUs, Shopify-bound. The site is a multi-page static deploy at nilesavannah.metaventionsai.com.",
  },
];

interface CreateArtifactResponse {
  ok: boolean;
  artifact?: { id: string; title: string; slug: string };
  error?: string;
}

/**
 * Lightweight markdown chunker. Splits on h2/h3 headings, packs paragraphs
 * into ~350-token chunks. Mirrors the production chunker enough for our
 * purposes; full reuse would require importing src/lib/chunker through tsx.
 */
function chunkMarkdown(content: string): { content: string; heading: string | null; chunkIndex: number }[] {
  const sections: { heading: string | null; body: string }[] = [];
  let currentHeading: string | null = null;
  let currentBody: string[] = [];
  for (const line of content.split("\n")) {
    const headingMatch = line.match(/^(#{1,3})\s+(.*)/);
    if (headingMatch) {
      if (currentBody.length) {
        sections.push({ heading: currentHeading, body: currentBody.join("\n").trim() });
      }
      currentHeading = headingMatch[2].trim();
      currentBody = [];
    } else {
      currentBody.push(line);
    }
  }
  if (currentBody.length) {
    sections.push({ heading: currentHeading, body: currentBody.join("\n").trim() });
  }

  const MAX_CHARS = 1400; // ~350 tokens
  const chunks: { content: string; heading: string | null; chunkIndex: number }[] = [];
  let idx = 0;
  for (const sec of sections) {
    if (!sec.body) continue;
    if (sec.body.length <= MAX_CHARS) {
      chunks.push({ content: sec.body, heading: sec.heading, chunkIndex: idx++ });
      continue;
    }
    // Split into ~MAX_CHARS pieces on paragraph boundaries.
    const paras = sec.body.split(/\n\n+/);
    let buf = "";
    for (const p of paras) {
      if (buf.length + p.length + 2 > MAX_CHARS && buf.length > 0) {
        chunks.push({ content: buf.trim(), heading: sec.heading, chunkIndex: idx++ });
        buf = p;
      } else {
        buf = buf ? `${buf}\n\n${p}` : p;
      }
    }
    if (buf.trim()) chunks.push({ content: buf.trim(), heading: sec.heading, chunkIndex: idx++ });
  }
  return chunks;
}

async function embedAll(texts: string[]): Promise<number[][]> {
  const all: number[][] = [];
  const BATCH = 96;
  for (let i = 0; i < texts.length; i += BATCH) {
    const batch = texts.slice(i, i + BATCH);
    const response = await cohere.embed({
      texts: batch,
      model: "embed-english-v3.0",
      inputType: "search_document",
      truncate: "END",
    });
    const e = response.embeddings;
    const list = Array.isArray(e) ? e : ((e as { float?: number[][] }).float || []);
    all.push(...list);
  }
  return all;
}

async function createArtifact(spec: ProjectSpec, content: string): Promise<CreateArtifactResponse> {
  // Step 1: insert artifact row with service role (bypasses RLS).
  const { data: artifact, error: insertErr } = await supabase
    .from("artifacts")
    .insert({
      title: spec.title,
      slug: spec.slug,
      content,
      category: spec.category,
      tags: spec.tags,
      external_links: spec.external_links,
      status: "published",
      published_at: new Date().toISOString(),
      version: 1,
    })
    .select()
    .single();
  if (insertErr || !artifact) {
    return { ok: false, error: `insert: ${insertErr?.message ?? "no row returned"}` };
  }

  // Step 2: chunk + embed + insert chunks.
  const chunks = chunkMarkdown(content);
  if (chunks.length === 0) {
    return { ok: false, error: "no chunks produced — content too small" };
  }
  const embeddings = await embedAll(chunks.map((c) => c.content));
  if (embeddings.length !== chunks.length) {
    return { ok: false, error: `embedding count ${embeddings.length} != chunks ${chunks.length}` };
  }

  const rows = chunks.map((c, i) => ({
    artifact_id: artifact.id,
    content: c.content,
    heading: c.heading,
    chunk_index: c.chunkIndex,
    token_count: Math.ceil(c.content.length / 4),
    chunk_type: "narrative",
    technologies: [],
    companies: [],
    papers: [],
    skills: [],
    embedding: embeddings[i],
  }));
  const { error: chunksErr } = await supabase.from("artifact_chunks").insert(rows);
  if (chunksErr) {
    return { ok: false, error: `chunks insert: ${chunksErr.message}` };
  }

  return {
    ok: true,
    artifact: { id: artifact.id as string, title: artifact.title as string, slug: artifact.slug as string },
  };
}

function readSources(spec: ProjectSpec): string {
  const sections: string[] = [`# ${spec.title}\n\n${spec.oneLineLeadIn}\n`];
  for (const path of spec.sources) {
    if (!existsSync(path)) {
      console.warn(`  [warn] missing: ${path}`);
      continue;
    }
    const raw = readFileSync(path, "utf8").trim();
    if (raw.length === 0) continue;
    const label = path.split("/").slice(-2).join("/");
    sections.push(`## Source: ${label}\n\n${raw}`);
  }
  return sections.join("\n\n---\n\n");
}

async function main() {
  const args = process.argv.slice(2);
  const DRY = args.includes("--dry-run");
  const slugIdx = args.indexOf("--slug");
  const ONLY_SLUG = slugIdx >= 0 ? args[slugIdx + 1] : null;

  const targets = ONLY_SLUG ? PROJECTS.filter((p) => p.slug === ONLY_SLUG) : PROJECTS;
  console.log(`Ingesting ${targets.length} project artifacts.${DRY ? " (dry run)" : ""}`);
  console.log("");

  let ok = 0;
  let failed = 0;

  for (const spec of targets) {
    console.log(`[${spec.category}] ${spec.title}`);
    console.log(`  slug: ${spec.slug}`);
    const content = readSources(spec);
    console.log(`  content: ${content.length} bytes from ${spec.sources.length} sources`);

    if (DRY) {
      console.log(`  [dry-run] would POST to /api/admin/artifacts`);
      console.log("");
      ok++;
      continue;
    }

    const result = await createArtifact(spec, content);
    if (result.ok) {
      console.log(`  ✓ created ${result.artifact?.id}`);
      ok++;
    } else {
      console.log(`  ✗ FAILED: ${result.error}`);
      failed++;
    }
    console.log("");
  }

  console.log(`Done. ${ok} succeeded, ${failed} failed.`);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
