#!/usr/bin/env tsx
/**
 * Audit + scrub named persons from `sens:public` artifacts.
 *
 * Pattern: replace specific real names with role-anchored descriptors so
 * the chat (which surfaces artifacts via Layer 1 always-loaded title+summary
 * index) never leaks colleague/contact names.
 *
 * Also demotes any artifact whose entire purpose IS the named-person evidence
 * to `sens:internal` so it stops surfacing in chat.
 *
 * Run: npx tsx scripts/scrub-names-from-public-artifacts.ts [--dry-run]
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

// Name -> role-anchored replacement map.
// Order matters: longest-first so "Mike Marzano" is matched before "Marzano".
// First entry catches the tautology that naive regex creates.
const NAME_REPLACEMENTS: Array<[RegExp, string]> = [
  // Tautology fixes (must run first)
  [/In our organization, the Head of Global Cloud Alliances served as the Head of Global Cloud Alliances\./g, "Our organization had a dedicated Head of Global Cloud Alliances who led the program."],
  [/, the Head of Global Cloud Alliances served as the Head of Global Cloud Alliances/g, ", a dedicated Head of Global Cloud Alliances led the program"],
  [/the Head of Global Cloud Alliances served as the Head of Global Cloud Alliances/g, "the Head of Global Cloud Alliances led the program"],
  [/, led the Global Cloud Alliances function\./g, ", a dedicated lead ran the Global Cloud Alliances function."],
  [/Where Mike focused on/g, "Where he focused on"],
  [/As Mike focused/g, "As he focused"],
  [/Mike defined/g, "He defined"],
  [/\bMike Marzano\b/g, "the Head of Global Cloud Alliances"],
  [/\bMarzano\b/g, "the Head of Global Cloud Alliances"],
  [/\bCaleb Kozak\b/g, "a strategic partnership confidant"],
  [/\bGianfranco Prior\b/g, "the CEO of the Mida NFT project I studied"],
  [/\bDavide Petrelli\b/g, "the CFO of that Mida NFT project"],
  [/\bRiccardo Biavati\b/g, "the UX lead of that NFT project"],
  [/\bFederico Tocanne\b/g, "the DeFi architecture lead of that NFT project"],
  [/\bDapo Ogunfeitimi\b/g, "a partner contact at a Web3 ventures fund"],
  [/\bDapo\b/g, "a partner contact at a Web3 ventures fund"],
  [/\bAlec Alfonso\b/g, "a contact at a creative/web3 studio"],
  [/\bJustin Carrothers\b/g, "a contact at a capital partner firm"],
  [/\bWill Taylor\b/g, "a Bowtie contact"],
  [/\bSarrah Rose\b/g, "a podcast host I connected with"],
  [/\bJake Diab\b/g, "a strategy contact"],
  [/\bTerence Fiteni\b/g, "a partner network contact"],
  [/\bEgin Govender\b/g, "a partner network contact"],
  [/\bIdowu Sodiq\b/g, "a partner network contact"],
  [/\bJoel Northrop\b/g, "a partner network contact"],
  // Personal action-item names from The Journey.docx (defense in depth)
  [/\bFahmid\b/g, "a collaborator"],
  [/\bNeha\b/g, "a teammate"],
  [/\bBruce Webber\b/g, "an external contact"],
];

// Slugs that should be demoted to sens:internal (their entire content is
// named-person evidence; cleaning them piecemeal destroys the artifact).
const DEMOTE_TO_INTERNAL: string[] = [
  "ms365-black-amethyst-founding-network-named-persons-2022-2024",
  "stories-and-specifics-named-people-and-anecdotes",
  "press-urls-and-public-awards-index",
];

async function regenerateSummary(content: string, title: string): Promise<string> {
  const resp = await deepseek.messages.create({
    model: "deepseek-chat",
    max_tokens: 600,
    messages: [
      {
        role: "user",
        content: `Rewrite a fact-dense 3-5 sentence summary of this artifact for chat retrieval. NO em dashes. Anti-hype. No specific person names (use role descriptors instead). Anchor to systems, scope, and outcomes.

TITLE: ${title}

CONTENT:
${content.slice(0, 8000)}

Return only the summary, no preamble.`,
      },
    ],
  });
  const block = resp.content[0];
  return (block.type === "text" ? block.text : "").trim();
}

interface ArtifactRow {
  id: string;
  slug: string;
  title: string;
  content: string;
  summary: string | null;
  tags: string[];
}

async function scrubContent(content: string): Promise<{ scrubbed: string; replacementCount: number }> {
  let scrubbed = content;
  let count = 0;
  for (const [pattern, replacement] of NAME_REPLACEMENTS) {
    const matches = scrubbed.match(pattern);
    if (matches) {
      count += matches.length;
      scrubbed = scrubbed.replace(pattern, replacement);
    }
  }
  return { scrubbed, replacementCount: count };
}

async function main() {
  console.log(`[scrub-names] ${DRY ? "DRY RUN" : "LIVE"} starting`);

  // 1. Demote known named-person evidence artifacts to sens:internal
  for (const slug of DEMOTE_TO_INTERNAL) {
    const { data: existing } = await sb
      .from("artifacts")
      .select("id, slug, tags, status")
      .eq("slug", slug)
      .maybeSingle();
    if (!existing) {
      console.log(`  [demote] ${slug}: not found, skipping`);
      continue;
    }
    const tags = (existing.tags || []) as string[];
    const newTags = tags.map((t) =>
      t === "sens:public" ? "sens:internal" : t,
    );
    if (!newTags.includes("sens:internal")) newTags.push("sens:internal");
    if (DRY) {
      console.log(`  [demote-DRY] ${slug}: tags would become [${newTags.join(", ")}]`);
    } else {
      const { error } = await sb
        .from("artifacts")
        .update({ tags: newTags })
        .eq("id", existing.id);
      if (error) console.error(`  [demote-FAIL] ${slug}:`, error);
      else console.log(`  [demote-OK] ${slug} -> sens:internal`);
    }
  }

  // 2. Pull all sens:public artifacts and scan for names
  const { data: artifacts, error } = await sb
    .from("artifacts")
    .select("id, slug, title, content, summary, tags")
    .contains("tags", ["sens:public"]);
  if (error) {
    console.error("Failed to query artifacts:", error);
    process.exit(1);
  }

  console.log(`\n[scrub-names] scanning ${artifacts.length} sens:public artifacts...`);

  let scrubbedCount = 0;
  let totalReplacements = 0;

  for (const artifact of artifacts as ArtifactRow[]) {
    const { scrubbed: scrubbedContent, replacementCount: contentCount } = await scrubContent(
      artifact.content,
    );
    const { scrubbed: scrubbedSummary } = await scrubContent(artifact.summary || "");

    if (contentCount === 0) continue;

    scrubbedCount++;
    totalReplacements += contentCount;
    console.log(`  [match] ${artifact.slug}: ${contentCount} name reference(s)`);

    if (DRY) continue;

    // Regenerate summary from the scrubbed content
    let newSummary = scrubbedSummary;
    try {
      newSummary = await regenerateSummary(scrubbedContent, artifact.title);
    } catch (e) {
      console.error(`    [summary-fail] ${artifact.slug}, keeping naive scrub:`, e);
    }

    const { error: updateError } = await sb
      .from("artifacts")
      .update({
        content: scrubbedContent,
        summary: newSummary,
      })
      .eq("id", artifact.id);
    if (updateError) {
      console.error(`    [update-fail] ${artifact.slug}:`, updateError);
    } else {
      console.log(`    [scrubbed] ${artifact.slug} (content+summary updated)`);
    }
  }

  console.log(
    `\n[scrub-names] done. ${scrubbedCount} artifacts touched, ${totalReplacements} name refs replaced.`,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
