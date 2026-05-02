#!/usr/bin/env tsx
/**
 * Two more artifacts to round out the data engine:
 *
 * 1. Application Outcomes & Conversion Patterns — pulled from
 *    career_intel.db (applications, application_events). Tells the JD
 *    analyzer which archetypes have HISTORICALLY converted to
 *    interviews vs ghosted. Real conversion signal beats keyword
 *    matching.
 *
 * 2. Recruiter Quick-Fire FAQ — pulled from
 *    ~/projects/career/resume-hub/_profile/application-profile.json.
 *    Work auth, TN visa nuance, salary expectations, start date,
 *    notice period, background-check / drug-test / criminal-record /
 *    non-compete answers. Direct, recruiter-ready.
 *
 * Run: npx tsx scripts/ingest-applications-and-recruiter-faq.ts [--dry-run]
 */

import { config } from "dotenv";
import { resolve } from "path";
import { homedir } from "os";
import { execSync } from "child_process";
import { readFileSync } from "fs";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import Anthropic from "@anthropic-ai/sdk";

config({ path: resolve(process.cwd(), ".env.local") });

const HOME = homedir();
const CAREER_DB = `${HOME}/projects/career/resume-hub/career_intel.db`;
const PROFILE_PATH = `${HOME}/projects/career/resume-hub/_profile/application-profile.json`;

const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, DEEPSEEK_API_KEY } = process.env;
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !DEEPSEEK_API_KEY) {
  console.error("Missing env");
  process.exit(1);
}
const sb: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
const deepseek = new Anthropic({ apiKey: DEEPSEEK_API_KEY, baseURL: "https://api.deepseek.com/anthropic" });

const DRY = process.argv.includes("--dry-run");

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
    system: `You write factual one-paragraph summaries (2-3 sentences, max 80 words). Lead with WHAT it is. Plain text, third person. No fluff. Output only the summary.`,
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
// 1. Application Outcomes & Conversion Patterns
// =================================================================
function buildApplicationsArtifact(): ArtifactSpec {
  const apps = query<{ id: string; campaign: string; company: string; role: string; location: string; salary_range: string | null; status: string; archetype: string | null; match_score: number | null; applied_at: string | null; response_at: string | null; notes: string | null }>(
    `SELECT id, campaign, company, role, location, salary_range, status, archetype, match_score, applied_at, response_at, notes FROM applications ORDER BY archetype, status, company`
  );

  const events = query<{ application_id: string; event_type: string; timestamp: string; note: string | null }>(
    `SELECT application_id, event_type, timestamp, note FROM application_events ORDER BY timestamp DESC`
  );

  // Aggregate by archetype.
  const byArchetype = new Map<string, typeof apps>();
  for (const a of apps) {
    const arch = a.archetype || "unspecified";
    const list = byArchetype.get(arch) ?? [];
    list.push(a);
    byArchetype.set(arch, list);
  }

  // Status counts.
  const statusCount = new Map<string, number>();
  for (const a of apps) statusCount.set(a.status, (statusCount.get(a.status) ?? 0) + 1);

  const sections: string[] = [];
  sections.push(`# Application Outcomes & Conversion Patterns

This artifact tracks Dico's actual applications, archetype labels, match scores, and outcome status. Use this when matching a JD to identify which archetype has the strongest conversion signal historically — keyword overlap is one input; real conversion data is another. Not all roles he matches on paper convert, and not all roles that convert score perfectly on keywords.

## Status snapshot (current pipeline)

${[...statusCount.entries()].sort((a, b) => b[1] - a[1]).map(([s, c]) => `- ${s}: ${c}`).join("\n")}

## Per-archetype breakdown
`);

  for (const [arch, list] of byArchetype) {
    const interviewing = list.filter((a) => ["screening", "interview", "offer"].includes(a.status));
    const ghostedOrRejected = list.filter((a) => ["rejected", "withdrawn"].includes(a.status));
    sections.push(`### Archetype: ${arch} (${list.length} apps)

- Active / advanced (screening / interview / offer): ${interviewing.length}
- Ghosted / rejected / withdrawn: ${ghostedOrRejected.length}
- In-flight or generated: ${list.length - interviewing.length - ghostedOrRejected.length}

Companies under this archetype:
${list.slice(0, 12).map((a) => `- **${a.company}** — ${a.role} (${a.status}${a.match_score ? `, match ${(a.match_score * 100).toFixed(0)}%` : ""}${a.location ? `, ${a.location}` : ""}${a.salary_range ? `, ${a.salary_range}` : ""})`).join("\n")}`);
  }

  sections.push(`## Recent application events (lifecycle activity)

${events.slice(0, 20).map((e) => `- ${e.timestamp.slice(0, 10)} **${e.application_id}** [${e.event_type}]${e.note ? `: ${e.note.slice(0, 200)}` : ""}`).join("\n")}`);

  sections.push(`## How to use this in JD matching

When a new JD comes in:
1. Identify which archetype it most resembles (gtm_operations, ai_engineer, partner_solutions, data_operations, technical_pm).
2. Check this artifact for whether that archetype has had screening / interview / offer conversion.
3. Weight the fit_score accordingly. An archetype with multiple advanced-stage apps is a higher-confidence fit than one with only ghosted apps.
4. The Anthropic Data Operations Manager app (anthropic-dataops-20260118, 95% match) is the best-documented archetype-fit example to anchor against.`);

  return {
    slug: "application-outcomes-and-conversion-patterns",
    title: "Application Outcomes & Conversion Patterns",
    category: "deep-dive",
    tags: ["applications", "outcomes", "archetypes", "conversion", "pipeline"],
    content: sections.join("\n\n"),
  };
}

// =================================================================
// 2. Recruiter Quick-Fire FAQ
// =================================================================
interface ApplicationProfile {
  identity: Record<string, unknown>;
  contact: Record<string, unknown>;
  address: Record<string, unknown>;
  work_authorization: Record<string, unknown>;
  location_preferences: Record<string, unknown>;
  salary_expectations: Record<string, unknown>;
  current_employment: Record<string, unknown>;
  previous_employment: Record<string, unknown>;
  education: Record<string, unknown>;
  common_questions: Record<string, unknown>;
}

function buildRecruiterFAQArtifact(): ArtifactSpec {
  const profile = JSON.parse(readFileSync(PROFILE_PATH, "utf8")) as ApplicationProfile;

  const wa = profile.work_authorization;
  const sal = profile.salary_expectations;
  const cq = profile.common_questions;
  const locPrefs = profile.location_preferences;

  const sections: string[] = [];
  sections.push(`# Recruiter Quick-Fire FAQ

The fast, recruiter-ready answers to common screening questions. Sourced from Dico's canonical application autofill profile. Use these verbatim — they have been tuned across 700+ applications and reflect his current operating reality.

## Work authorization (CRITICAL — answer this carefully)

- **Citizenship**: ${wa.citizenship}
- **Currently authorized to work in the US for any employer**: ${wa.us_authorized_for_any_employer ? "Yes" : "No"}
- **Authorized in Canada**: yes (Canadian citizen)
- **Requires US sponsorship now or in the future**: ${wa.requires_us_sponsorship_now_or_future ? "Yes" : "No"}
- **Sponsorship type**: ${wa.us_sponsorship_type}

**Long-form explanation (use this verbatim when a recruiter asks)**:

> ${wa.us_authorized_for_any_employer_explanation}

${wa.us_sponsorship_details ? `**Additional sponsorship detail**:\n\n> ${wa.us_sponsorship_details}\n` : ""}

**TN visa quick-fire facts**:
- Issued at the US port of entry with a job offer letter
- No lottery, no quota, no premium-processing wait
- 3-year initial term, renewable indefinitely in 3-year increments
- Spouse can get TD status (no work authorization, but can study)
- Faster than H-1B (port-of-entry processing, not USCIS petition)

## Salary expectations

**Default response (use this when asked early in the screen)**:

> ${sal.default_response}

**TN-specific note for negotiation**:

> ${sal.tn_specific_note}

## Location preferences

${Object.entries(locPrefs).map(([k, v]) => `- **${k}**: ${typeof v === "string" ? v : JSON.stringify(v)}`).join("\n")}

## Common screening questions (canonical answers)

${Object.entries(cq).map(([k, v]) => `### ${k.replace(/_/g, " ")}\n\n> ${typeof v === "string" ? v : JSON.stringify(v)}`).join("\n\n")}

## Recruiter conversation guidance

When a recruiter is reading the chat:
- Answer work authorization questions plainly. Do not hedge — the TN process is well-defined and fast.
- If asked about salary in a screening call, default to the open-to-discussion response above. Don't anchor.
- If asked "why are you leaving Contentsquare," reference the Recruiter FAQ artifact (slug: recruiter-faq-common-questions-answered) which has the canonical answer.
- If asked about availability / start date, the answer is 2-3 weeks from offer (the TN port-of-entry timing).
- Always offer to take their email for direct follow-up if a question is too sensitive for chat.`);

  return {
    slug: "recruiter-quick-fire-faq",
    title: "Recruiter Quick-Fire FAQ: Work Auth, Salary, Common Screens",
    category: "faq",
    tags: ["recruiter", "faq", "work-auth", "tn-visa", "salary", "screening"],
    content: sections.join("\n\n"),
  };
}

// =================================================================
async function upsert(spec: ArtifactSpec) {
  console.log(`\n[${spec.category}] ${spec.title}`);
  console.log(`  slug: ${spec.slug}, content: ${spec.content.length} bytes`);
  if (DRY) {
    console.log("  [dry] would upsert + summarize");
    return;
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
    content: spec.content,
    category: spec.category,
    tags: spec.tags,
    status: "published",
    published_at: new Date().toISOString(),
    version: 1,
  }).select().single();

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
  await upsert(buildApplicationsArtifact());
  await upsert(buildRecruiterFAQArtifact());
  console.log("\nDone.");
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
