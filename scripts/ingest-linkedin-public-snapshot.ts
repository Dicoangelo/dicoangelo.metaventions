#!/usr/bin/env tsx
/**
 * LinkedIn Public Profile Snapshot.
 *
 * What a recruiter would see if they opened linkedin.com/in/dico-angelo.
 * Public-facing only: bio, headline, location, contact, "Open to" titles,
 * profile URL, follower/connection counts. Excludes private application
 * history and the internal diagnostic audit.
 *
 * Source: ~/projects/career/job-search/linkedin-audit-2026-04-24/AUDIT.md
 * (snapshot fields only — diagnosis content is internal and not ingested)
 * + ~/projects/career/resume-hub/resumes/linkedin_bio.txt (current bio).
 *
 * Run: npx tsx scripts/ingest-linkedin-public-snapshot.ts [--dry-run]
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

const TITLE = "LinkedIn Public Profile Snapshot";
const SLUG = "linkedin-public-profile-snapshot";

const CONTENT = `# LinkedIn Public Profile Snapshot

Public-facing snapshot of what a recruiter sees on Dico's LinkedIn profile. Use this artifact when asked "is this on his LinkedIn?", "what does his LinkedIn say?", or "where can I see more?".

## Profile URL

https://www.linkedin.com/in/dico-angelo/

## Identity (public)

- **Name:** Dico Angelo (He/Him)
- **Headline:** Partner Operations
- **Current company:** Metaventions AI (Founder & Systems Architect)
- **Location:** Canada (Canadian citizen, TN Visa eligible under USMCA)
- **Followers:** 3,300+
- **Connections:** 500+
- **LinkedIn Premium:** Active

## Open to Work — what he's actively seeking

LinkedIn "Open to Work" frame is enabled on his profile photo. The titles he's surfacing to recruiters are partner-operations focused (per the most recent profile snapshot from 2026-04-24):

- Operations Partner
- Operations Manager
- Partner Operations / Partner Operations Manager
- Other partner-ops / GTM-systems titles in the same lane

**Locations he's open to** (on-site or hybrid): San Francisco Bay Area, New York, Washington, Seattle, California; **remote**: Toronto, San Francisco, New York, Washington, Vancouver.

**Employment type:** Full-time only. **Start date:** Immediate.

If a recruiter asks "what kind of role is he looking for" — the answer is partner operations, cloud alliance ops, RevOps for AI infrastructure, or GTM systems leadership. He is NOT looking for: SWE, ML Engineer, Data Engineer, DevOps, SRE, Security Engineer, or pure pre-sales Solutions Engineer roles. Those titles fall outside his target lane (per his role blocklist).

## Current LinkedIn Bio (Founder bio — what's in the About section context)

Dico maintains a separate Metaventions AI Founder & Systems Architect bio that he uses as his canonical About-section copy:

---

> Founder & Systems Architect at Metaventions AI
>
> Let the invention be hidden in your vision.
>
> Research studio transforming frontier AI into production-ready systems. We build what others are still theorizing about.
>
> **WHAT WE'VE BUILT**
> - **ResearchGravity:** Research-to-implementation pipeline. Captures signals from arXiv, synthesizes insights, tracks lineage from paper to production.
> - **Structura:** Sovereign AI operating system. Voice-native, multi-agent orchestration, biometric-aware. 27,000+ lines.
> - **CareerCoachAntigravity:** Career intelligence with multi-agent hiring simulation.
> - **Agent Core:** Unified orchestration across environments. Context continuity, memory persistence.
> - **Universal Cognitive Wallet:** Portable AI memory with economics.
>
> **THE PROCESS**
> We start with research, not code. Capture. Synthesize. Build. Every system traces to validated frontier research.
>
> **THE PROMISE**
> If you can imagine it, we can architect it. Intelligent systems that amplify intent. Autonomous workflows that execute with precision. Sovereign architectures where your data stays yours.
>
> Architected Intelligence.
>
> metaventionsai.com | github.com/Dicoangelo

---

## Public connection points

- **GitHub:** https://github.com/Dicoangelo
- **Portfolio:** https://dicoangelo.metaventionsai.com
- **Studio site:** https://metaventionsai.com
- **Email (public):** dico.angelo97@gmail.com
- **Phone (public):** 519-999-6099

## How the chat should USE this artifact

**Strong patterns:**
- "His LinkedIn is at linkedin.com/in/dico-angelo — his current headline is Partner Operations"
- "He has Open to Work enabled and is targeting Partner Operations, Operations Manager, and similar roles"
- "He's a Canadian citizen, TN Visa eligible, open to SF, NYC, Austin, Boston, Seattle, and Toronto"

**Anti-patterns to AVOID:**
- Citing follower / connection counts as proof of network strength (numbers are public but not credentials)
- Listing his LinkedIn skills verbatim — those are being actively re-curated and may have changed since the 2026-04-24 snapshot
- Implying he's interested in any role outside the partner-ops / cloud-alliance / GTM-systems lane (his blocklist is enforced)

**When asked "what should I look at on his LinkedIn":**
"His About section covers the Metaventions AI work in his own words, his Experience covers the Contentsquare cloud alliance role, and he's actively posting and engaged. Easiest is just linkedin.com/in/dico-angelo."
`;

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

async function main(): Promise<void> {
  console.log(`[linkedin] content: ${CONTENT.length} chars`);
  if (DRY) {
    console.log(`[dry] would upsert artifact ${SLUG}`);
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
      content: CONTENT,
      category: "deep-dive",
      tags: ["linkedin", "public-profile", "open-to-work", "external-presence"],
      status: "published",
      published_at: new Date().toISOString(),
      version: 1,
    })
    .select()
    .single();

  if (error || !data) {
    console.error(`  ✗ insert failed:`, error);
    process.exit(1);
  }
  console.log(`  ✓ inserted ${data.id}`);

  const summary = await summarize(TITLE, CONTENT);
  if (summary && summary.length >= 30) {
    await sb.from("artifacts").update({ summary }).eq("id", data.id);
    console.log(`  ✓ summary: ${summary}`);
  }
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
