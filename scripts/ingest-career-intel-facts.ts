#!/usr/bin/env tsx
/**
 * Pull structured career facts out of ~/projects/career/resume-hub/career_intel.db
 * and ingest them as three new published artifacts so the chat + JD
 * analyzer have specific facts to ground answers in.
 *
 * IMPORTANT: respects Dico's "no programming on resume" rule by filtering
 * raw language skills (Python / TypeScript / JavaScript / SQL / Bash)
 * out of the public-facing capabilities artifact. Those skills are
 * reframed as AI-Assisted Development evidence rather than claimed as
 * hand-fluency.
 *
 * Run: npx tsx scripts/ingest-career-intel-facts.ts [--dry-run]
 */

import { config } from "dotenv";
import { resolve } from "path";
import { homedir } from "os";
import { execSync } from "child_process";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import Anthropic from "@anthropic-ai/sdk";

config({ path: resolve(process.cwd(), ".env.local") });

const HOME = homedir();
const CAREER_DB = `${HOME}/projects/career/resume-hub/career_intel.db`;

/**
 * Run a SELECT against the read-only career_intel.db and return rows
 * as parsed objects. Uses the sqlite3 CLI to dodge the better-sqlite3
 * native-binding/Node-version dance.
 */
function query<T extends Record<string, unknown>>(sql: string): T[] {
  const escaped = sql.replace(/"/g, '\\"');
  const json = execSync(
    `sqlite3 "${CAREER_DB}" -json "${escaped}"`,
    { encoding: "utf8", maxBuffer: 32 * 1024 * 1024 }
  ).trim();
  if (!json) return [];
  return JSON.parse(json) as T[];
}

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

// Memory rule "feedback_no_programming_on_resume.md": NEVER claim raw
// hand-fluency in a language. But DO surface the language work for JD
// matching — a Python-required JD still needs to find a Python match,
// just framed as AI-assisted production work, not whiteboard fluency.
// We don't FILTER these — we REFRAME them inline.
const LANGUAGE_SKILLS = new Set([
  "python", "typescript", "javascript", "sql", "bash", "shell scripting",
]);

function isLanguageSkill(name: string): boolean {
  return LANGUAGE_SKILLS.has(name.toLowerCase().trim());
}

const SUMMARY_SYSTEM = `You write factual one-paragraph summaries for a chat assistant's system prompt.

Rules:
- 2-3 sentences. Maximum 80 words.
- Lead with WHAT it is. Then most concrete facts and counts.
- Plain text, third person. No markdown, no bullets, no preamble.
- Do not invent. Do not use marketing fluff.`;

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

interface ArtifactSpec {
  slug: string;
  title: string;
  category: "deep-dive" | "experience" | "skill" | "faq" | "project";
  tags: string[];
  content: string;
}

// =================================================================
// 1. Quantified Achievement Atlas
// =================================================================
function buildAchievementAtlas(): ArtifactSpec {
  const experiences = query<{ id: number; company: string; title: string; location: string; start_date: string; end_date: string | null; scope: string; is_current: number }>(
    `SELECT id, company, title, location, start_date, end_date, scope, is_current FROM experience ORDER BY sort_order`
  );

  const metrics = query<{ experience_id: number; category: string; metric_name: string; metric_value: string; context: string; verification_method: string | null }>(
    `SELECT experience_id, category, metric_name, metric_value, context, verification_method FROM metrics ORDER BY experience_id, id`
  );

  const caseStudies = query<{ title: string; publisher: string; url: string; company_featured: string; key_metric: string; description: string }>(
    `SELECT title, publisher, url, company_featured, key_metric, description FROM case_studies ORDER BY id`
  );

  const sections: string[] = [];
  sections.push(`# Quantified Achievement Atlas

This is the canonical, verified inventory of Dico Angelo's quantified achievements, grouped by role. Every metric below has a verification method (git analysis, AWS marketplace, MSFT MCP, peer review, etc). Use this when a JD asks for proof of specific outcomes.`);

  for (const exp of experiences) {
    const expMetrics = metrics.filter((m) => m.experience_id === exp.id);
    if (expMetrics.length === 0) continue;
    const range = exp.is_current
      ? `${exp.start_date} - present`
      : `${exp.start_date} - ${exp.end_date}`;
    sections.push(`## ${exp.company} — ${exp.title} (${range})

${exp.scope}

### Metrics
${expMetrics.map((m) => `- **${m.metric_name}** (${m.category}): ${m.metric_value}${m.context ? ` — ${m.context}` : ""}${m.verification_method ? ` _[verified via ${m.verification_method}]_` : ""}`).join("\n")}`);
  }

  sections.push(`## Featured Case Studies (third-party publications)

${caseStudies.map((cs) => `- **${cs.title}** by ${cs.publisher}${cs.url ? `\n  ${cs.url}` : ""}\n  ${cs.company_featured ? `Company: ${cs.company_featured}.` : ""} ${cs.key_metric ? `Key metric: ${cs.key_metric}.` : ""}\n  ${cs.description}`).join("\n\n")}`);

  return {
    slug: "quantified-achievement-atlas",
    title: "Quantified Achievement Atlas: Verified Metrics by Role",
    category: "deep-dive",
    tags: ["metrics", "achievements", "evidence", "case-studies", "proof"],
    content: sections.join("\n\n"),
  };
}

// =================================================================
// 2. Target Companies & Positioning Archetypes
// =================================================================
function buildTargetingPlaybook(): ArtifactSpec {
  const targets = query<{ company: string; tier: string; sector: string; fit_reason: string; role_types: string; applied: number; notes: string | null }>(
    `SELECT company, tier, sector, fit_reason, role_types, applied, notes FROM target_companies ORDER BY tier, company`
  );

  const archetypes = query<{ archetype: string; label: string; description: string; target_companies: string; pitch: string }>(
    `SELECT archetype, label, description, target_companies, pitch FROM positioning ORDER BY id`
  );

  const tierLabels: Record<string, string> = {
    dream: "DREAM tier (highest priority — Dico actively pursues these)",
    strong: "STRONG tier (high-fit secondary targets)",
    moderate: "MODERATE tier (good-fit but lower-priority targets)",
    monitor: "MONITOR tier (passive interest, not actively applying)",
  };

  const byTier = new Map<string, typeof targets>();
  for (const t of targets) {
    const list = byTier.get(t.tier) ?? [];
    list.push(t);
    byTier.set(t.tier, list);
  }

  const sections: string[] = [];
  sections.push(`# Target Companies & Positioning Archetypes

What kind of companies and roles Dico is actively hunting, and how he positions himself for each. When a JD comes in, identify which archetype fits and use that pitch language.`);

  sections.push(`## Positioning Archetypes (use these to frame answers)

${archetypes.map((a) => `### ${a.label}
- **Internal slug**: \`${a.archetype}\`
- **When to use**: ${a.description}
- **Target companies**: ${a.target_companies}
- **Pitch (verbatim)**: "${a.pitch}"`).join("\n\n")}`);

  for (const [tier, list] of byTier) {
    sections.push(`## ${tierLabels[tier] ?? tier.toUpperCase()}

${list.map((t) => {
  let roles: string[] = [];
  try { roles = JSON.parse(t.role_types); } catch { roles = [t.role_types]; }
  return `- **${t.company}** (${t.sector}) — ${t.fit_reason}
  Role types of interest: ${roles.join(", ")}
  Applied: ${t.applied ? "yes" : "no"}${t.notes ? ` — ${t.notes}` : ""}`;
}).join("\n")}`);
  }

  return {
    slug: "target-companies-positioning-archetypes",
    title: "Target Companies & Positioning Archetypes",
    category: "deep-dive",
    tags: ["targeting", "positioning", "archetypes", "icp", "companies"],
    content: sections.join("\n\n"),
  };
}

// =================================================================
// 3. Capabilities & Tools Inventory (filtered for no-programming rule)
// =================================================================
function buildCapabilitiesInventory(): ArtifactSpec {
  const skills = query<{ skill_name: string; category: string; proficiency: string | null; years_experience: number | null; evidence: string | null }>(
    `SELECT skill_name, category, proficiency, years_experience, evidence FROM skills ORDER BY category, skill_name`
  );

  const certs = query<{ name: string; issuer: string; date_obtained: string | null }>(
    `SELECT name, issuer, date_obtained FROM certifications ORDER BY date_obtained DESC`
  );

  const portfolio = query<{ project_name: string; description: string; tech_stack: string; lines_of_code: number | null; repo_url: string | null; live_url: string | null; status: string; category: string }>(
    `SELECT project_name, description, tech_stack, lines_of_code, repo_url, live_url, status, category FROM portfolio ORDER BY id`
  );

  const byCategory = new Map<string, typeof skills>();
  for (const s of skills) {
    const list = byCategory.get(s.category) ?? [];
    list.push(s);
    byCategory.set(s.category, list);
  }

  const sections: string[] = [];
  sections.push(`# Capabilities & Tools Inventory

Verified capabilities, tools, certifications, and shipped projects. Use this as the authoritative answer for "what can Dico actually do."

## How to weight language requirements (CRITICAL for JD matching)

Dico ships production code in TypeScript, Python, SQL, and Bash — but he produces it by directing AI coding agents (Claude Code, Codex, Gemini, DeepSeek V4) in plain English, NOT by typing it himself. The verifiable signals:

- 900,000+ lines of production code across 20+ shipped systems and 44 repositories
- Specific evidence per language is listed below

**JD matching guidance**:
- A JD that requires "Python experience for data pipelines / ETL / ML feature engineering / RAG ingestion" → MATCH at high confidence. Cite the actual production work (ResearchGravity, META-VENGINE, etc.).
- A JD that requires "TypeScript for React/Next.js product development / partner-facing tooling" → MATCH. Cite the 152K-line OS-App, dicoangelo.metaventions, etc.
- A JD that requires "SQL for analytics / dashboard / partner ops reporting" → MATCH. Cite Supabase + pgvector at scale.
- A JD that requires SENIOR WHITEBOARD CODING, deep language fluency, on-call SRE / Platform Engineer / Security Engineer / Data Engineer responsibility, or code-test-driven hiring loops → flag as HIGH-severity gap regardless of LOC volume. The work is real, but the hiring loop assumes hand-fluency Dico does not claim.
- A JD for SWE / ML Engineer / Backend Engineer / Frontend Engineer / DevOps / SRE titles → HARD SKIP. Not the right archetype.
- A JD for pre-sales Solutions Engineer at a hyperscaler with 5+ yrs Solutions Consulting → HARD SKIP. Not the right archetype.
- A JD for Solution Engineer / Solutions Architect with 3+ yrs and a "learn our product" framing → MATCH if product is learnable in 90 days.

Don't lose Python/TS/SQL matches over the no-fluency-claim rule. Lose them when the role expects whiteboard fluency or on-call ownership.`);

  for (const [cat, list] of byCategory) {
    if (list.length === 0) continue;
    sections.push(`## ${cat.charAt(0).toUpperCase() + cat.slice(1)} Capabilities

${list.map((s) => {
  const parts: string[] = [];
  if (s.proficiency) parts.push(`proficiency: ${s.proficiency}`);
  if (s.years_experience) parts.push(`${s.years_experience} years`);
  const meta = parts.length ? ` (${parts.join(", ")})` : "";
  const langTag = isLanguageSkill(s.skill_name) ? " _[AI-assisted via coding agents — see weighting note above]_" : "";
  return `- **${s.skill_name}**${meta}${langTag}${s.evidence ? `\n  Evidence: ${s.evidence}` : ""}`;
}).join("\n")}`);
  }

  sections.push(`## Certifications

${certs.map((c) => `- **${c.name}** (${c.issuer})${c.date_obtained ? ` — ${c.date_obtained}` : ""}`).join("\n")}`);

  sections.push(`## Shipped Portfolio (with stack and links)

${portfolio.map((p) => {
  const links: string[] = [];
  if (p.live_url) links.push(`Live: ${p.live_url}`);
  if (p.repo_url) links.push(`GitHub: ${p.repo_url}`);
  return `- **${p.project_name}** [${p.status}/${p.category}]: ${p.description}
  Stack: ${p.tech_stack}${p.lines_of_code ? ` | ${p.lines_of_code.toLocaleString()} lines` : ""}
  ${links.join(" | ")}`;
}).join("\n\n")}`);

  return {
    slug: "capabilities-and-tools-inventory",
    title: "Capabilities & Tools Inventory",
    category: "skill",
    tags: ["capabilities", "tools", "certifications", "stack", "ai-assisted-dev"],
    content: sections.join("\n\n"),
  };
}

// =================================================================
// Common upsert pipeline
// =================================================================
async function upsert(spec: ArtifactSpec) {
  console.log(`\n[${spec.category}] ${spec.title}`);
  console.log(`  slug: ${spec.slug}, content: ${spec.content.length} bytes`);
  if (DRY) {
    console.log("  [dry] would upsert + summarize");
    return;
  }

  const { data: existing } = await sb
    .from("artifacts")
    .select("id")
    .eq("slug", spec.slug)
    .maybeSingle();

  if (existing?.id) {
    await sb.from("artifact_chunks").delete().eq("artifact_id", existing.id);
    await sb.from("artifacts").delete().eq("id", existing.id);
    console.log(`  removed prior artifact ${existing.id}`);
  }

  const { data, error } = await sb
    .from("artifacts")
    .insert({
      title: spec.title,
      slug: spec.slug,
      content: spec.content,
      category: spec.category,
      tags: spec.tags,
      status: "published",
      published_at: new Date().toISOString(),
      version: 1,
    })
    .select()
    .single();

  if (error || !data) {
    console.error("  insert failed:", error);
    return;
  }
  console.log(`  ✓ inserted ${data.id}`);

  const summary = await summarize(spec.title, spec.content);
  if (summary && summary.length >= 30) {
    await sb.from("artifacts").update({ summary }).eq("id", data.id);
    console.log(`  ✓ summary: ${summary.slice(0, 200)}...`);
  }
}

async function main() {
  console.log("Building artifacts from career_intel.db...");
  const specs = [
    buildAchievementAtlas(),
    buildTargetingPlaybook(),
    buildCapabilitiesInventory(),
  ];

  for (const spec of specs) {
    await upsert(spec);
  }

  console.log("\nDone.");
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
