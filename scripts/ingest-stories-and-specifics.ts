#!/usr/bin/env tsx
/**
 * Build a Stories & Specifics artifact: named people, specific arXiv
 * papers, conference appearances, third-party press / case studies,
 * and anecdote-rich detail. The chat was repeating the same 4-5
 * headline metrics across every answer because the data engine was
 * metric-heavy and anecdote-poor. This artifact gives the model a
 * deep bench of varied evidence to draw from.
 *
 * Run: npx tsx scripts/ingest-stories-and-specifics.ts [--dry-run]
 */

import { config } from "dotenv";
import { resolve } from "path";
import { homedir } from "os";
import { execSync } from "child_process";
import { readFileSync, existsSync } from "fs";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import Anthropic from "@anthropic-ai/sdk";

config({ path: resolve(process.cwd(), ".env.local") });

const HOME = homedir();
const CAREER_DB = `${HOME}/projects/career/resume-hub/career_intel.db`;

const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, DEEPSEEK_API_KEY } = process.env;
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !DEEPSEEK_API_KEY) {
  console.error("Missing env");
  process.exit(1);
}
const sb: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
const deepseek = new Anthropic({ apiKey: DEEPSEEK_API_KEY, baseURL: "https://api.deepseek.com/anthropic" });
const DRY = process.argv.includes("--dry-run");

function read(path: string): string | null {
  if (!existsSync(path)) return null;
  return readFileSync(path, "utf8").trim();
}

function query<T extends Record<string, unknown>>(sql: string): T[] {
  const escaped = sql.replace(/"/g, '\\"');
  const json = execSync(`sqlite3 "${CAREER_DB}" -json "${escaped}"`, { encoding: "utf8", maxBuffer: 32 * 1024 * 1024 }).trim();
  return json ? (JSON.parse(json) as T[]) : [];
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

const SOURCES = [
  // Memory files with named people, specific anecdotes, quotes
  `${HOME}/.claude/memory/project_drammeh_collaboration.md`,
  `${HOME}/.claude/memory/project_amazon_matt_rivron.md`,
  `${HOME}/.claude/memory/project_mohammed_contact.md`,
  `${HOME}/.claude/memory/project_friendlyface_core_insight.md`,
  `${HOME}/.claude/memory/project_friendlyface_session_march25.md`,
  `${HOME}/.claude/memory/project_friendlyface_observer_report.md`,
  `${HOME}/.claude/memory/project_mfth_session_insights.md`,
  `${HOME}/.claude/memory/project_mfth_bootcamp_final.md`,
  `${HOME}/.claude/memory/project_osapp_march25_session.md`,
  `${HOME}/.claude/memory/project_ccant_session_2026-04-10.md`,
  `${HOME}/.claude/memory/project_partnership_graph.md`,
  `${HOME}/.claude/memory/project_cinema_substrate_pivot.md`,
  `${HOME}/.claude/memory/project_convergence_stack.md`,
  `${HOME}/.claude/memory/project_nightingale.md`,
  `${HOME}/.claude/memory/feedback_contentsquare_attribution.md`,
  `${HOME}/.claude/memory/feedback_onecrm_attribution.md`,
  `${HOME}/.claude/memory/feedback_reference_strategy.md`,
];

async function main() {
  const sections: string[] = [];
  sections.push(`# Stories & Specifics — Named People, Quotes, Conferences, Anecdotes

This artifact is the deep bench of *varied* evidence Dico has accumulated. When the chat is asked open-ended questions, REACH INTO HERE for specific facts that change between answers — named people, specific projects, specific arXiv papers, specific case studies, specific conference appearances. Don't just keep citing the same \$800M / \$30M / 900K LOC headline numbers across every answer.

Each section below is a self-contained story or fact pocket. Pull from a different section per question to keep answers varied.

## Named research collaborators

- **Philip Drammeh** — Global Technical Program Executive, Cloud Communications & Telco Innovation. Author of arXiv:2511.15755 (Multi-Agent LLM Orchestration / DQ Scoring), the #1 most-referenced paper across Dico's ecosystem (599 references). Met 2026-03-06. Drammeh personally said the production implementation was "phenomenal." Co-authored paper proposal in flight.

- **Matt Rivron** — AWS Account Manager who co-built the AWS Strategic Collaboration Agreement with Dico day-to-day at Contentsquare. Internal referral for Amazon roles.

- **Safiia Mohammed** — University of Windsor PhD candidate, framework creator. Active research collaboration (mohamm7d@uwindsor.ca, smohammed@aimsammi.org).

- **Zack Goldfarb** — Co-founder of Project Nightingale (surgical robotics / OR workflow venture). Background at Pulmonx and Stryker. Health Board Advisors network.

## Third-party press and case studies (verifiable URLs)

- **Partner Insight** — "0 to \$30M in 30 Months: How a Marketing Analytics Company Scaled Cloud Marketplace Revenue" — features Dico's Contentsquare cloud alliance work directly. URL: https://newsletter.partnerinsight.io/p/0-to-30m-in-30-months-how-a-marketing
- **AWS Partner Success Page** — Contentsquare profile, 14x YoY AWS growth — operational backbone Dico's team built. URL: https://aws.amazon.com/partners/success/contentsquare/
- **Microsoft Customer Story** — "81% Larger Deals" via Azure Synapse Analytics. URL: https://www.microsoft.com/en/customers/story/25531-contentsquare-azure-synapse-analytics
- **Suger blog** — "How Suger Helped Contentsquare Grow Partnerships Without Limits" — case study covering the operational integration Dico led. Reference the URL only; do NOT invent verbatim quotes from press pages (image-embedded testimonial cards are not extractable as text). URL: https://www.suger.io/blog/how-suger-help-contentsquare-grow-partnerships-without-limits

## Conference appearances

- **Catalyst Summit Toronto 2026** — speaker. Dico spoke at the partner ops industry gathering.
- **Bentley Bootcamp / Mass Fintech Hub (April 2026)** — speaker / mentor on AI applied to fintech and cloud GTM. Mentored 3 mentees through full battle-station prep.

## Specific arXiv papers Dico has implemented into production

- **arXiv:2511.15755** (Drammeh et al, Multi-Agent LLM Orchestration / DQ Scoring) — implemented in META-VENGINE routing engine, 4,687+ decisions over 50 days, DQ scores improved from 0.575 to 0.870, 95.4% variance reduction.
- **arXiv:2408.15620** (CAPER — Ternary User-Position-Company relationships for career graphs)
- **arXiv:2509.19677** (CareerScape — Graph-based resume validation)
- **arXiv:2508.17536** (Multi-agent voting captures most gains)
- **arXiv:2512.05470** (Agentic File System / AFS concept)

That's 5 named papers as of this snapshot, plus 3+ more across the broader portfolio. When asked "which papers has he implemented," cite specific arXiv IDs and what each one became in production.

## Project-specific anecdotes

### FriendlyFace
The core insight is that FriendlyFace is forensic-evidence generation, not facial-recognition with compliance bolted on. The real invention is the **ForensicSeal** — a W3C Verifiable Credential that cryptographically binds six verification dimensions into one publicly-verifiable artifact. The compliance proxy is the Trojan horse business model: pip-installable wrapper around AWS Rekognition. 42K+ lines of code.

### Cinema Studio (substrate pivot, May 2026)
First production Dico videos rendered May 1. Seedance 2.0 was DEAD for face-lock — could not maintain identity across frames. Real substrate stack is Kling 3.0 Pro/Master + Luma Ray 2 on fal.ai. Single-image i2v has 0-3s + 7-10s golden windows with 3-7s drift. Closed-mouth prompts hold identity. cfg_scale 0.9 for face-lock.

### Partnership Graph
Launched 2026-03-25 with a 30-day category-claim window. Strategy doc claims a \$3.2B SAM. The pitch is "Bloomberg Terminal for partnerships," built on UCW substrate. Captures *partnership metabolism* — response velocity, referral conversion, engagement trends — not just static account overlap.

### CareerCoachAntigravity (April 10 2026 session)
8 commits in one session: API v1 flip, React 19 upgrade, +25 test files, Node 22 CI fix. Trap discovered: Node 25 vs Node 22 ABI mismatch on better-sqlite3.

### OS-App / Structura March 25 2026 session
18 commits: Vite 8, TypeScript 6, Tailwind v4, PWA, mobile, accessibility, settings panel, onboarding, voice fixes, bundle split.

### Convergence Stack
8-layer model of digital infrastructure convergence developed coming out of the Bentley Bootcamp. Layers: security, data infrastructure, data provenance, financial agents, payment rails, governance, capital formation, cognitive equity. Each layer depends on the one below; cognitive equity is the missing apex.

### Project Nightingale (with Zack Goldfarb)
Surgical robotics + OR workflow venture. First-principles redesign of surgical workflows through AI-driven instrument anticipation, real-time EHR capture, and supply-chain optimization. Currently in observer phase — building domain knowledge and clinical relationships before product.

## Contentsquare attribution nuance (read this carefully when asked)

Two-layer truth: Mike Marzano owned the cloud-alliance vision, exec sponsorship, and external advocacy. Dico (hired as IC2, promoted to Sr. Partner Systems and Operations Specialist) owned the operational strategy — attachment scoring, SPIFF design, sequencing, CRM/automation, OneCRM integration on the cloud-alliance side. Both layers are strategy. Avoid both over-claim ("Dico ran the alliance") AND under-claim ("Dico was just an executor"). Marzano has been consolidating the narrative since the November 2025 Contentsquare cut; counter-narrative is: Dico designed and ran the operational backbone. Cross-reference: published case studies and partner press attributions (Suger, AWS, Microsoft, Partner Insight) — link to URLs, do not paraphrase image-embedded testimonial copy.

## OneCRM specifically

Dico did NOT design or architect OneCRM. It was a Contentsquare-wide initiative spanning Heap, Contentsquare, and Hotjar product lines. Dico contributed by integrating the cloud-alliance side (AWS, Microsoft, PartnerStack, Crossbeam, Reveal, Suger) into OneCRM. Use verbs: *integrated*, *contributed*, *owned the cloud-alliance side of*, *connected*. Never *designed* or *built*.

## Reference strategy

For external references, source from partners (Suger, Tackle, Crossbeam, Reveal vendors), peers, and numerical artifacts (case studies, marketplace data). Do NOT route recruiters to ex-Contentsquare managers — the verbal IC4 promotion praise was a retention lever and won't translate to written recommendations.

`);

  // Append the actual source files for deeper retrieval
  for (const path of SOURCES) {
    const body = read(path);
    if (!body) continue;
    const label = path.split("/").slice(-2).join("/");
    sections.push(`---\n\n## SOURCE: ${label}\n\n${body}`);
  }

  // Also pull case_studies table
  const caseStudies = query<{ title: string; publisher: string; url: string; company_featured: string; key_metric: string; description: string }>(
    `SELECT title, publisher, url, company_featured, key_metric, description FROM case_studies ORDER BY id`
  );
  if (caseStudies.length) {
    sections.push(`---\n\n## SOURCE: career_intel.db case_studies\n\n${caseStudies.map((c) => `**${c.title}** by ${c.publisher} (${c.url}). ${c.company_featured} — ${c.key_metric}. ${c.description}`).join("\n\n")}`);
  }

  const content = sections.join("\n\n");
  console.log(`Total: ${content.length} chars across ${sections.length} sections`);

  if (DRY) {
    console.log("[dry] would upsert");
    return;
  }

  const slug = "stories-and-specifics-named-people-and-anecdotes";
  const title = "Stories & Specifics: Named People, Quotes, Conferences, Anecdotes";

  const { data: existing } = await sb.from("artifacts").select("id").eq("slug", slug).maybeSingle();
  if (existing?.id) {
    await sb.from("artifact_chunks").delete().eq("artifact_id", existing.id);
    await sb.from("artifacts").delete().eq("id", existing.id);
    console.log(`removed prior ${existing.id}`);
  }

  const { data, error } = await sb.from("artifacts").insert({
    title,
    slug,
    content,
    category: "deep-dive",
    tags: ["stories", "anecdotes", "people", "papers", "press", "anti-repetition"],
    status: "published",
    published_at: new Date().toISOString(),
    version: 1,
  }).select().single();

  if (error || !data) {
    console.error("insert failed:", error);
    return;
  }
  console.log(`✓ inserted ${data.id}`);

  const summary = await summarize(title, content);
  if (summary && summary.length >= 30) {
    await sb.from("artifacts").update({ summary }).eq("id", data.id);
    console.log(`✓ summary: ${summary}`);
  }
}

main().catch((err) => { console.error("Fatal:", err); process.exit(1); });
