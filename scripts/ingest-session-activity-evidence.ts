#!/usr/bin/env tsx
/**
 * Session Activity Evidence Miner.
 *
 * Walks ~/.claude/projects/  subdirs (each subdir = one project Claude
 * has worked in) and aggregates per-project session evidence: session
 * count, total messages, date range, total bytes, last-touched.
 *
 * Privacy guard: extracts AGGREGATES ONLY. Never reads message
 * content. Only timestamps, line counts, and file sizes.
 *
 * Output: a "Verified Session Activity Evidence by Project" artifact
 * the chat can cite when asked "what's he actually been working on",
 * "how much time has he put into X", "what's the recent velocity".
 *
 * Run: npx tsx scripts/ingest-session-activity-evidence.ts [--dry-run]
 */

import { config } from "dotenv";
import { resolve } from "path";
import { homedir } from "os";
import { readdirSync, readFileSync, statSync } from "fs";
import { join } from "path";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import Anthropic from "@anthropic-ai/sdk";

config({ path: resolve(process.cwd(), ".env.local") });

const HOME = homedir();
const PROJECTS_ROOT = `${HOME}/.claude/projects`;

const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, DEEPSEEK_API_KEY } = process.env;
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !DEEPSEEK_API_KEY) {
  console.error("Missing env: SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY / DEEPSEEK_API_KEY");
  process.exit(1);
}

const sb: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
const deepseek = new Anthropic({ apiKey: DEEPSEEK_API_KEY, baseURL: "https://api.deepseek.com/anthropic" });
const DRY = process.argv.includes("--dry-run");

const TITLE = "Verified Session Activity Evidence by Project";
const SLUG = "verified-session-activity-evidence-by-project";

interface ProjectStat {
  rawDir: string;
  decodedPath: string;
  displayName: string;
  sessions: number;
  totalLines: number;
  totalBytes: number;
  earliest: string | null;
  latest: string | null;
  recentLast30Days: number;
}

function decodePath(rawDir: string): string {
  // -Users-dicoangelo-friendlyface  ->  /Users/dicoangelo/friendlyface
  return "/" + rawDir.replace(/^-/, "").replace(/-/g, "/");
}

function displayNameFor(decoded: string): string {
  const parts = decoded.split("/").filter(Boolean);
  // Drop /Users/dicoangelo prefix
  if (parts[0] === "Users" && parts[1] === "dicoangelo") parts.splice(0, 2);
  if (parts.length === 0) return "(home)";
  // Skip irrelevant top-level
  if (parts[0] === "Library" || parts[0] === ".cache" || parts[0] === "tmp") return "";
  return parts.join("/");
}

function getEarliestLatest(file: string): { earliest: string | null; latest: string | null } {
  // Read first and last few lines only — JSONL with timestamps usually
  // has timestamp on every event. Sample first 50 + last 50 to bracket.
  let earliest: string | null = null;
  let latest: string | null = null;
  try {
    const head = readFileSync(file, "utf8").slice(0, 50000);
    const tailStart = Math.max(0, statSync(file).size - 50000);
    const fd = require("fs").openSync(file, "r");
    const tailBuf = Buffer.alloc(50000);
    require("fs").readSync(fd, tailBuf, 0, 50000, tailStart);
    require("fs").closeSync(fd);
    const tail = tailBuf.toString("utf8");

    const tsRe = /"timestamp":"([^"]+)"/g;
    const found: string[] = [];
    let m: RegExpExecArray | null;
    while ((m = tsRe.exec(head)) !== null) found.push(m[1]);
    while ((m = tsRe.exec(tail)) !== null) found.push(m[1]);
    if (found.length) {
      found.sort();
      earliest = found[0];
      latest = found[found.length - 1];
    }
  } catch {
    /* ignore */
  }
  return { earliest, latest };
}

function walkJsonl(dir: string, out: string[]): void {
  let entries: import("fs").Dirent[];
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const e of entries) {
    const full = join(dir, e.name);
    if (e.isDirectory()) {
      walkJsonl(full, out);
    } else if (e.isFile() && e.name.endsWith(".jsonl")) {
      out.push(full);
    }
  }
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/;

function countSessionsForProject(dirPath: string): number {
  // A "session" is either:
  //   - a UUID-named directory at depth 1 (newer Claude Code), OR
  //   - a UUID.jsonl file at depth 1 (older Claude Code).
  // Subagent / task-log JSONLs nested below don't count as separate sessions.
  let entries: import("fs").Dirent[];
  try {
    entries = readdirSync(dirPath, { withFileTypes: true });
  } catch {
    return 0;
  }
  let n = 0;
  for (const e of entries) {
    if (e.isDirectory() && UUID_RE.test(e.name)) n++;
    else if (e.isFile() && e.name.endsWith(".jsonl") && UUID_RE.test(e.name)) n++;
  }
  return n;
}

function processProject(rawDir: string): ProjectStat | null {
  const dirPath = join(PROJECTS_ROOT, rawDir);
  const allJsonl: string[] = [];
  walkJsonl(dirPath, allJsonl);
  if (allJsonl.length === 0) return null;

  const decoded = decodePath(rawDir);
  const display = displayNameFor(decoded);
  if (!display) return null;

  const sessions = countSessionsForProject(dirPath);
  let totalLines = 0;
  let totalBytes = 0;
  let earliest: string | null = null;
  let latest: string | null = null;
  let recent30 = 0;
  const cutoff30 = Date.now() - 30 * 24 * 60 * 60 * 1000;

  for (const fp of allJsonl) {
    let st: import("fs").Stats;
    try {
      st = statSync(fp);
    } catch {
      continue;
    }
    totalBytes += st.size;
    if (st.mtimeMs > cutoff30) recent30++;

    // line count
    try {
      const content = readFileSync(fp, "utf8");
      totalLines += content.split("\n").filter((l) => l.trim()).length;
    } catch {
      /* skip */
    }

    const { earliest: e, latest: l } = getEarliestLatest(fp);
    if (e && (!earliest || e < earliest)) earliest = e;
    if (l && (!latest || l > latest)) latest = l;
  }

  return {
    rawDir,
    decodedPath: decoded,
    displayName: display,
    sessions,
    totalLines,
    totalBytes,
    earliest: earliest ? earliest.slice(0, 10) : null,
    latest: latest ? latest.slice(0, 10) : null,
    recentLast30Days: recent30,
  };
}

function bucketDirs(): string[] {
  return readdirSync(PROJECTS_ROOT).filter((d) => {
    try {
      return statSync(join(PROJECTS_ROOT, d)).isDirectory();
    } catch {
      return false;
    }
  });
}

function fmtBytes(b: number): string {
  if (b < 1024) return `${b}B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)}KB`;
  if (b < 1024 * 1024 * 1024) return `${(b / 1024 / 1024).toFixed(1)}MB`;
  return `${(b / 1024 / 1024 / 1024).toFixed(2)}GB`;
}

function fmtNum(n: number): string {
  return n.toLocaleString();
}

async function summarize(title: string, content: string): Promise<string> {
  const trimmed = content.length > 8000 ? content.slice(0, 8000) + "\n\n[truncated]" : content;
  const response = await deepseek.messages.create({
    model: "deepseek-v4-pro",
    max_tokens: 220,
    temperature: 0.3,
    thinking: { type: "disabled" } as never,
    system: `You write FACT-DENSE summaries. Lead with the most important specific fact (number, name, project). Surface key/value facts VERBATIM. 2-3 sentences, max 80 words. Plain text. Third person. No markdown. Do NOT start with "This artifact" or "A reference".`,
    messages: [{ role: "user", content: `Title: ${title}\n\n---\n\n${trimmed}` }],
  });
  const block = response.content.find((b: { type: string }) => b.type === "text");
  return block && "text" in block ? (block.text as string).trim() : "";
}

async function main(): Promise<void> {
  console.log(`[sessions] scanning ${PROJECTS_ROOT}…`);
  const dirs = bucketDirs();
  console.log(`[sessions] found ${dirs.length} project directories`);

  const stats: ProjectStat[] = [];
  for (const d of dirs) {
    const s = processProject(d);
    if (s && s.sessions > 0) stats.push(s);
  }

  // Sort: most active in last 30 days first, then by total sessions
  stats.sort((a, b) => {
    if (b.recentLast30Days !== a.recentLast30Days) return b.recentLast30Days - a.recentLast30Days;
    return b.sessions - a.sessions;
  });

  // Aggregates
  const totalSessions = stats.reduce((s, x) => s + x.sessions, 0);
  const totalLines = stats.reduce((s, x) => s + x.totalLines, 0);
  const totalBytes = stats.reduce((s, x) => s + x.totalBytes, 0);
  const totalRecent30 = stats.reduce((s, x) => s + x.recentLast30Days, 0);

  console.log(`[sessions] aggregated: ${totalSessions} sessions, ${fmtNum(totalLines)} events, ${fmtBytes(totalBytes)}`);
  console.log(`[sessions] recent (last 30d): ${totalRecent30} sessions across ${stats.filter((s) => s.recentLast30Days > 0).length} projects`);

  // Build artifact body
  const lines: string[] = [];
  lines.push(`# Verified Session Activity Evidence by Project\n`);
  lines.push(`This artifact is **machine-generated from local Claude session logs** at \`~/.claude/projects/\`. Every number below is a count or date taken directly from the JSONL files on disk — no human input, no interpretation. Privacy-safe: session content is NEVER included, only aggregates (session count, message-event count, byte size, date range).\n`);
  lines.push(`Use this artifact when a recruiter asks "what's he actually been working on", "how much time has he put into X", or "is this verifiable". The numbers come from a real log of every Claude conversation Dico has had.\n`);
  lines.push(`## Headline aggregates (corpus-wide)\n`);
  lines.push(`- **${fmtNum(totalSessions)} total Claude sessions** across **${stats.length} distinct project directories**`);
  lines.push(`- **${fmtNum(totalLines)} total event records** (each event is a message, tool call, tool result, or attachment)`);
  lines.push(`- **${fmtBytes(totalBytes)}** of session log data on disk`);
  lines.push(`- **${totalRecent30} sessions in the last 30 days** across **${stats.filter((s) => s.recentLast30Days > 0).length} active projects**`);
  lines.push(`- Generated: ${new Date().toISOString().slice(0, 10)}\n`);

  lines.push(`## Per-project activity (sorted by last-30-day activity, then total sessions)\n`);
  lines.push(`| Project (path) | Sessions | Last-30d | Events | Size | First Touch | Last Touch |`);
  lines.push(`|---|---:|---:|---:|---:|---|---|`);

  // Top 30
  const top = stats.slice(0, 30);
  for (const s of top) {
    lines.push(
      `| \`${s.displayName}\` | ${fmtNum(s.sessions)} | ${s.recentLast30Days} | ${fmtNum(s.totalLines)} | ${fmtBytes(s.totalBytes)} | ${s.earliest ?? "-"} | ${s.latest ?? "-"} |`
    );
  }

  if (stats.length > top.length) {
    const tailCount = stats.length - top.length;
    const tailSessions = stats.slice(top.length).reduce((s, x) => s + x.sessions, 0);
    lines.push(`\n*Plus ${tailCount} additional smaller project directories with ${fmtNum(tailSessions)} more sessions.*\n`);
  }

  lines.push(`\n## How the chat should USE this artifact\n`);
  lines.push(`**Strong patterns** (cite verifiable specifics):`);
  lines.push(`- "He's run ${fmtNum(totalSessions)}+ Claude sessions across ${stats.length} project directories — there's a real, machine-generated audit trail at ~/.claude/projects/"`);
  lines.push(`- "On [project name], he ran X sessions between [first date] and [last date], generating Y event records — that's not self-reported, it's directly from the local log"`);
  lines.push(`- "In the last 30 days, he's been actively working in [N] projects, with [top project name] getting the most sessions"\n`);
  lines.push(`**Anti-patterns to AVOID:**`);
  lines.push(`- Don't extrapolate hours from session counts — events ≠ active hours`);
  lines.push(`- Don't quote specific message content (none was extracted, none should be claimed)`);
  lines.push(`- Don't conflate session events with code commits — these are separate metrics (commits live in git, events live in session logs)\n`);
  lines.push(`**When asked "is this real?":** "The session log directory is local on his machine at ~/.claude/projects/ — every Claude conversation since he started is preserved as a JSONL file. Anyone with terminal access on his laptop can verify the counts themselves. The numbers in this artifact were generated by a script that walks that directory and aggregates."\n`);

  const content = lines.join("\n");
  console.log(`[sessions] artifact body: ${content.length} chars`);

  if (DRY) {
    console.log(`\n[dry] preview:\n${content.slice(0, 1500)}\n...\n${content.slice(-600)}`);
    return;
  }

  const { data: existing } = await sb.from("artifacts").select("id").eq("slug", SLUG).maybeSingle();
  if (existing?.id) {
    await sb.from("artifact_chunks").delete().eq("artifact_id", existing.id);
    await sb.from("artifacts").delete().eq("id", existing.id);
    console.log(`  · removed prior ${existing.id}`);
  }

  const { data, error } = await sb
    .from("artifacts")
    .insert({
      title: TITLE,
      slug: SLUG,
      content,
      category: "deep-dive",
      tags: ["sessions", "verifiable-activity", "machine-generated", "audit-trail"],
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

  const summary = await summarize(TITLE, content);
  if (summary && summary.length >= 30) {
    await sb.from("artifacts").update({ summary }).eq("id", data.id);
    console.log(`✓ summary: ${summary}`);
  }
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
