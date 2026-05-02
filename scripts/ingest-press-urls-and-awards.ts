#!/usr/bin/env tsx
/**
 * Press URLs & Public Awards index.
 *
 * Replaces the unverifiable-quote pattern with a clean URL/awards list.
 * Press testimonial cards are image-embedded and not extractable as text;
 * this artifact tells the chat to LINK to those URLs and never paraphrase
 * verbatim quote copy from them. Body-text awards / facts that ARE
 * publicly verifiable from multiple sources (LinkedIn, partner program
 * pages, customer stories) are listed explicitly.
 *
 * Run: npx tsx scripts/ingest-press-urls-and-awards.ts [--dry-run]
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

const TITLE = "Press URLs & Public Awards Index";
const SLUG = "press-urls-and-public-awards-index";

const CONTENT = `# Press URLs & Public Awards Index

This artifact gives the chat a clean, audit-able list of every public press URL, customer story, and award associated with Dico's work — with one important rule:

## CARDINAL RULE for using this artifact

**Link to URLs. Do NOT paraphrase verbatim quote copy from press pages.**

Most press pages (Suger blog, AWS Partner Success page, Microsoft Customer Story) embed pull-quotes from named executives (Mike Marzano, Jonathan Cherki, Lucie Buisson, etc.) inside testimonial CARDS that render as images, not text. Those cards are not extractable via WebFetch and cannot be ingested verbatim. If the chat reaches into this artifact to support a claim, it should:

1. Cite the URL itself ("It's covered in the Microsoft customer story at [URL]")
2. Reference verifiable BODY-TEXT facts (metrics, dates, awards) — never quote text
3. NEVER invent a verbatim quote from a named person (Marzano, Cherki, etc.)

If a recruiter asks "what did Marzano say about Dico" — answer truthfully: "I'd point you to the case study URLs where Mike Marzano speaks publicly about the cloud alliance Dico operationalized — the strongest sources are [Partner Insight URL] and [AWS Partner Success URL]. I don't have the verbatim quote text in front of me."

---

## Press URLs (link to these, don't paraphrase)

### Partner Insight feature
**URL:** https://newsletter.partnerinsight.io/p/0-to-30m-in-30-months-how-a-marketing
**Title:** "0 to $30M in 30 Months: How a Marketing Analytics Company Scaled Cloud Marketplace Revenue"
**What it covers:** Long-form profile of the Contentsquare cloud alliance program — the operational backbone Dico built and ran. Names Mike Marzano as the alliance lead and references the broader operational team. Headline body-text claim: 14X year-over-year AWS marketplace growth.
**Use it for:** External validation that Dico's $30M / $800M numbers are public-record, not internal claims.

### AWS Partner Success Page — Contentsquare
**URL:** https://aws.amazon.com/partners/success/contentsquare/
**Title:** Contentsquare AWS Partner Success Profile
**What it covers:** AWS-published case study of the Contentsquare partnership. Marketplace growth metrics. Multiple executive testimonial cards (Marzano, Buisson) — image-embedded, do not paraphrase.
**Use it for:** Establishing AWS-side recognition and the alliance Dico's team operationalized.

### Microsoft Customer Story — Contentsquare + Azure Synapse
**URL:** https://www.microsoft.com/en/customers/story/25531-contentsquare-azure-synapse-analytics
**Title:** "Contentsquare empowers brands to deliver better customer experiences with Azure Synapse Analytics"
**What it covers:** Microsoft's published customer story on the Azure Synapse + Contentsquare partnership. Includes executive testimonial cards (Marzano, Cherki). Headline body-text claims: 81% larger deals, 11% faster deal cycles, 106% higher ACV.
**Use it for:** Microsoft-side recognition of the operational + product partnership Dico's alliance work enabled.

### Suger blog — Contentsquare partnership growth case study
**URL:** https://www.suger.io/blog/how-suger-help-contentsquare-grow-partnerships-without-limits
**Title:** "How Suger Helped Contentsquare Grow Partnerships Without Limits"
**What it covers:** Vendor-published case study covering the operational integration Dico led between Contentsquare's cloud alliance and the Suger marketplace operations platform. Body-text headline metrics: ~90% reduction in manual marketplace tasks, ~5x faster deal registration cycle time.
**Use it for:** Vendor-side third-party validation of the systems Dico designed — Suger is the case study customer, Contentsquare's alliance team (Dico operational, Marzano sponsor) is the customer-of-record.

---

## Public Awards & Recognition (verifiable from multiple sources)

These are awards / recognitions that appear on official partner program pages, LinkedIn, and corporate press releases — not inside image-only testimonial cards. Safe to cite verbatim.

### Microsoft Commercial Marketplace Partner of the Year — 2x
- **Source of record:** Microsoft Partner of the Year program (Microsoft.com Partner page)
- **Years:** 2023, 2024 (Contentsquare won the Commercial Marketplace category)
- **Dico's contribution:** Operationalized the Microsoft side of the cloud alliance — Marketplace listing operations, co-sell registrations, deal registration approvals, partner systems integration that drove the marketplace growth metrics underlying the award. Worked under Mike Marzano (alliance lead).
- **What this is NOT:** Dico did not personally accept or own the award. Two-layer truth: Marzano owned external advocacy; Dico owned the operational backbone that produced the underlying numbers.

### Cloud GTM Leader certification
- **Source:** Partner Insight Cloud GTM Leader program
- **Holder:** Dico Angelo
- **What it is:** Industry certification covering hyperscaler GTM motions (ACE, CPPO, private offers, marketplace co-sell). Verifiable on Dico's LinkedIn.

### AWS Strategic Collaboration Agreement — co-built
- **Source:** Internal AWS-Contentsquare SCA
- **Co-builder named for reference:** Matt Rivron (AWS Account Manager, day-to-day partner)
- **Dico's contribution:** Co-architected the operational backbone of the SCA — partner systems integration, deal registration workflows, co-sell motion design.
- **Use it for:** When asked about hyperscaler-level partnership architecture, this is the strongest single artifact (it's the SCA itself, not press about the SCA).

---

## Conference appearances (publicly listed)

- **Catalyst Summit Toronto 2026** — speaker (partner operations industry conference). Verifiable on the event page.
- **Bentley Bootcamp / Mass Fintech Hub — April 2026** — mentor / speaker on applied AI in fintech + cloud GTM. Mentored 3 mentees through full battle-station prep.

---

## How the chat should USE this artifact

**Strong patterns:**
- "It's covered in [press source name] at [URL]" — link, don't paraphrase
- "Dico's team won the Microsoft Commercial Marketplace Partner of the Year twice (2023 and 2024) — verifiable on the Microsoft Partner program page" — award is body-text public, safe to cite
- "He co-built the AWS Strategic Collaboration Agreement with Matt Rivron at AWS" — named contributor + concrete artifact

**Anti-patterns to AVOID:**
- "Mike Marzano said Dico was [quote]" — the quote text is in image cards, not extractable
- "The Suger CEO described Dico's team as [quote]" — same issue
- Inventing percentage breakdowns of who-did-what at Contentsquare — use the two-layer attribution language ("Marzano owned external advocacy, Dico owned the operational backbone") instead

**When pressed on a quote you don't have:**
"I don't have the verbatim quote text — but the source is public, it's at [URL]. The recruiter is welcome to read it directly."

That answer is honest, points to the real source, and protects against fabrication. It's a stronger position than guessing the quote.
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
  console.log(`[press] content: ${CONTENT.length} chars`);
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
      tags: ["press", "awards", "anti-fabrication", "external-validation"],
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
