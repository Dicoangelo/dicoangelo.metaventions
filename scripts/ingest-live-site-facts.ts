#!/usr/bin/env tsx
/**
 * Pull the homepage of dicoangelo.metaventionsai.com and ingest the
 * canonical headline facts as a published artifact. Ensures every chat
 * and JD-analyzer answer is grounded in exactly what visitors are
 * reading on the live site, no drift between marketing copy and AI.
 *
 * Run: npx tsx scripts/ingest-live-site-facts.ts [--dry-run]
 */

import { config } from "dotenv";
import { resolve } from "path";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import Anthropic from "@anthropic-ai/sdk";

config({ path: resolve(process.cwd(), ".env.local") });

const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, DEEPSEEK_API_KEY } = process.env;
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !DEEPSEEK_API_KEY) {
  console.error("Missing required env");
  process.exit(1);
}
const sb: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
const deepseek = new Anthropic({
  apiKey: DEEPSEEK_API_KEY,
  baseURL: "https://api.deepseek.com/anthropic",
});

const DRY = process.argv.includes("--dry-run");

const SITE_URL = process.env.LIVE_SITE_URL || "https://dicoangelo.metaventionsai.com";

async function fetchSite(): Promise<string> {
  const res = await fetch(SITE_URL, { headers: { "user-agent": "DicoMetaventionsBot/1.0" } });
  if (!res.ok) throw new Error(`fetch ${res.status}`);
  return await res.text();
}

function htmlToText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/g, "")
    .replace(/<style[\s\S]*?<\/style>/g, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
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

async function main() {
  console.log("Fetching live site...");
  const html = await fetchSite();
  const text = htmlToText(html);
  console.log(`  fetched ${html.length} bytes, extracted ${text.length} chars`);

  // Build artifact body — use the fetched text as ground truth and
  // structure it for retrieval. We split out the headline numbers
  // separately because those are the most-cited facts.
  const today = new Date().toISOString().slice(0, 10);

  const content = `# Live Site Headline Facts (dicoangelo.metaventionsai.com)

This artifact captures the canonical, customer-facing headline numbers and positioning copy from Dico Angelo's portfolio site as of ${today}. When the chat or JD analyzer is asked about Dico's work, prefer language and figures that appear here — these are the facts a recruiter or partner is currently reading on the live site, and AI answers must not drift from them.

## Hero positioning (verbatim from the homepage)

- **Tagline**: "Partner-Builder | Operated cloud ops on the 3-person alliance team at Contentsquare. Program scaled \$0 → \$30M+ across AWS and Microsoft (2x MSFT Partner of the Year, \$800M+ TCV) — I ran the operational layer (CRM, automation, dashboards, enablement) that turned strategy into velocity."

- **Differentiator**: "While running those deals — specified 58 production AI tools in English, directed Claude Code / Codex / Gemini to build them, and shipped infrastructure capturing 275K+ tool events and 20M+ knowledge-graph edges on Claude. Most people are either operators or builders. I'm both. At the frontier."

- **Status**: Canadian Citizen · TN Visa Eligible
- **CTAs**: Live Demo: OS-App | Live Demo: Partnership Graph | GitHub (44 repos) | Resume

## Headline proof numbers (the four cards on the homepage)

1. **\$30M+ Cloud Alliance Revenue** — AWS + Microsoft, 30 months
2. **\$800M+ Partner TCV Processed** — 3-person alliance team, 97% approval
3. **20M+ Cognitive Graph Edges** — UCW — 8.9K items, 9.4K learnings
4. **900K+ Lines of AI-Directed Code** — 20+ shipped systems, 44 repos

## TLDR (verbatim)

"Operated cloud ops on the 3-person alliance team at Contentsquare. Program scaled \$0 → \$30M+ across AWS and Microsoft, \$800M+ in registered deals, 2x MSFT Partner of the Year — I ran the operational layer (CRM, automation, dashboards) that turned strategy into velocity. At the same time: specified 58 production MCP tools in English, directed Claude Code / Codex / Gemini to build them, shipped multi-agent infrastructure processing 163K+ events on Claude. Not sequentially — simultaneously. I'm the operations expert who is also literally at the frontier, building. Partner SA is exactly where those two things collide."

## Bridge framing — "AI-Augmented Operator"

"I speak both languages. Most people live on one side. Partner ops people understand business but not the AI stack. AI builders understand the tech but not the co-sell motion. I've operated both."

### Partner Side
- \$800M+ deal registration engine
- Co-sell motion with AWS & Microsoft
- 6 CRM platform integrations
- GSI and cloud partner operations
- 2x Microsoft Partner of the Year

### The Bridge
- Partnership Graph: partner ops as queryable intelligence
- GenAI enablement materials for partner teams
- Business case development from partner pain
- Technical ↔ business translation
- From the frontier of AI infrastructure

## Full extracted page text (for deeper retrieval)

${text}`;

  console.log(`Artifact body: ${content.length} chars`);

  const slug = "live-site-headline-facts";
  const title = "Live Site Headline Facts (dicoangelo.metaventionsai.com)";

  if (DRY) {
    console.log("[dry] would upsert");
    return;
  }

  const { data: existing } = await sb
    .from("artifacts")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();

  if (existing?.id) {
    await sb.from("artifact_chunks").delete().eq("artifact_id", existing.id);
    await sb.from("artifacts").delete().eq("id", existing.id);
    console.log(`removed prior artifact ${existing.id}`);
  }

  const { data, error } = await sb
    .from("artifacts")
    .insert({
      title,
      slug,
      content,
      category: "deep-dive",
      tags: ["live-site", "homepage", "canonical-narrative", "headline-facts"],
      status: "published",
      published_at: new Date().toISOString(),
      version: 1,
    })
    .select()
    .single();

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

  console.log("\nDone. Will appear in chat + JD analyzer prompts after artifact-index TTL refresh (5 min).");
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
