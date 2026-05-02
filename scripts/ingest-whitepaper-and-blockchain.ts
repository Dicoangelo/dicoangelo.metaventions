#!/usr/bin/env tsx
/**
 * Ingest the Metaventions whitepaper as TWO purpose-cut artifacts:
 *
 *   1. metaventions-ai-founding-vision-and-cognitive-equity
 *      The founding narrative: why Metaventions exists, the cognitive
 *      extraction problem, the cognitive-equity thesis, sourced from
 *      the abstract + sections 1–2 of the whitepaper.
 *
 *   2. ucw-and-meta-token-blockchain-substrate
 *      The blockchain story: UCW architecture, $META tokenomics, BASIX
 *      index, the "blockchain-native substrate" claim, sourced from
 *      sections 3–5 of the whitepaper.
 *
 * Splitting them lets the chat surface ONE without the other depending
 * on the audience (an investor wants the token thesis; a recruiter
 * wants the founding vision and cognitive-equity thesis).
 *
 * Uses scripts/lib/three-layer.ts — auto-generates fact-dense summary,
 * 5-dimension labels, and appends to the data catalog.
 *
 * Run: npx tsx scripts/ingest-whitepaper-and-blockchain.ts [--dry-run]
 */

import { config } from "dotenv";
import { resolve } from "path";
import { homedir } from "os";
import { readFileSync, existsSync } from "fs";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import Anthropic from "@anthropic-ai/sdk";
import { threeLayerIngest, type IngestArgs } from "./lib/three-layer";

config({ path: resolve(process.cwd(), ".env.local") });

const HOME = homedir();
const WHITEPAPER = `${HOME}/.agent-core/pitch-deck/01_vision/WHITEPAPER.md`;

const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, DEEPSEEK_API_KEY } = process.env;
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !DEEPSEEK_API_KEY) {
  console.error("Missing env: SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY / DEEPSEEK_API_KEY");
  process.exit(1);
}

const sb: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
const deepseek = new Anthropic({ apiKey: DEEPSEEK_API_KEY, baseURL: "https://api.deepseek.com/anthropic" });
const REPO_ROOT = process.cwd();
const DRY = process.argv.includes("--dry-run");

if (!existsSync(WHITEPAPER)) {
  console.error(`whitepaper not found at ${WHITEPAPER}`);
  process.exit(1);
}

const FULL = readFileSync(WHITEPAPER, "utf8");
console.log(`[whitepaper] loaded ${FULL.length} chars from ${WHITEPAPER}`);

/**
 * Extract a section by heading. Greedy match between this heading
 * and the next H1/H2.
 */
function extractSections(...headingsLowerSubstr: string[]): string {
  const lines = FULL.split("\n");
  const out: string[] = [];
  let inMatch = false;
  for (const line of lines) {
    const isH1 = line.startsWith("# ");
    const isH2 = line.startsWith("## ");
    if (isH1 || isH2) {
      const lower = line.toLowerCase();
      const hit = headingsLowerSubstr.some((h) => lower.includes(h));
      if (hit) {
        inMatch = true;
        out.push(line);
        continue;
      }
      if (inMatch) {
        // Only break on H1 or a non-matched H2 of equal/higher priority
        if (isH1) {
          inMatch = false;
          continue;
        }
        // For H2, check if we just finished the matched section
        inMatch = false;
        continue;
      }
    }
    if (inMatch) out.push(line);
  }
  return out.join("\n").trim();
}

const ABSTRACT = extractSections("abstract").slice(0, 4000);
const PROBLEM = extractSections("cognitive extraction problem", "the cognitive equity primitive");
const ORIGIN = extractSections("origin story", "from black amethyst", "the name");
const TOKENOMICS = extractSections("token economics", "$meta", "9. token", "9.1 core thesis");
const UCW_ARCH = extractSections("universal cognitive wallet architecture", "ucw semantic layers");
const BASIX = extractSections("basix", "8. basix", "the sovereign ai-cloud index");
const COHERENCE = extractSections("cross-platform coherence engine", "6. cross-platform");

console.log(`[whitepaper] extracted sections: abstract=${ABSTRACT.length}, problem=${PROBLEM.length}, origin=${ORIGIN.length}, ucw=${UCW_ARCH.length}, token=${TOKENOMICS.length}, basix=${BASIX.length}, coherence=${COHERENCE.length}`);

const FOUNDING_VISION_BODY = `# Metaventions AI: Founding Vision & Cognitive Equity Thesis

This is the canonical founding narrative for Metaventions AI, sourced from the v1.0 whitepaper (February 2026, ~/.agent-core/pitch-deck/01_vision/WHITEPAPER.md). When asked "why does Metaventions exist?", "what's the founding thesis?", or "what's Dico actually building?", reach for THIS artifact — not generic ecosystem-overview content.

## The one-line thesis

> *"Let the invention be hidden in your vision."*

Metaventions is a sovereign substrate for **cognitive equity** — making the value of human-AI cognitive production an owned, compounding, sovereign asset rather than free training data harvested by platforms.

## Quick framing for the chat

Bitcoin introduced **digital scarcity**. Ethereum introduced **programmable value**. Metaventions introduces **cognitive equity** — where thinking is owning.

The pitch is structurally analogous to the previous two paradigms but applied to a different substrate (cognitive output rather than financial transactions). This is the same canonical framing Dico uses with investors, partners, and recruiters.

## The Cognitive Extraction Problem (canonical framing)

400M+ daily AI users generate unprecedented cognitive value, but every interaction's value flows to the platform — not to the human producing the cognitive output. The trillion-dollar AI infrastructure layer is being built on extracted, uncompensated human cognitive labor.

Metaventions inverts this: the cognitive output is captured at the user's edge, owned by the user, and the value compounds to the user — not the platform.

## Whitepaper abstract (verbatim from source)

${ABSTRACT}

## The Origin Story (Appendix A — Black Amethyst → Cognitive Equity)

${ORIGIN.slice(0, 6000)}

${ORIGIN.length > 6000 ? "\n*[truncated — full Appendix A at ~/.agent-core/pitch-deck/01_vision/WHITEPAPER.md]*" : ""}

## The cognitive extraction problem (verbatim from source)

${PROBLEM.slice(0, 5000)}

${PROBLEM.length > 5000 ? "\n*[truncated — full source at ~/.agent-core/pitch-deck/01_vision/WHITEPAPER.md]*" : ""}

## What Metaventions is NOT

- NOT another LLM wrapper. The product is the substrate underneath — capture, ownership, valuation — not the model.
- NOT another personal-knowledge-management tool. Existing PKM (Notion, Obsidian, Mem) keeps you locked in the platform's silo. Metaventions makes the knowledge a portable, owned, on-chain asset.
- NOT another web3-for-AI hand-wave. The proof is 174,169 cognitive events captured, 33,240 research findings indexed, and 68,341 tool interactions tracked by a working system before the token ever existed.

## What the chat should USE this artifact for

**Strong patterns:**
- "He's the founder of Metaventions AI — the thesis is cognitive equity, the substrate making human-AI cognitive production an owned asset rather than extracted training data"
- "The whitepaper v1.0 published February 2026 frames it as Bitcoin → digital scarcity, Ethereum → programmable value, Metaventions → cognitive equity"
- "The Universal Cognitive Wallet — UCW for short — is the user-facing surface; the on-chain substrate is the underlying ownership layer"

**When asked "is this just hype":** Cite the proof — 174,169 cognitive events captured, working system pre-token. The infrastructure shipped before the financial layer.

**When asked about token / blockchain specifics:** Defer to the companion artifact "ucw-and-meta-token-blockchain-substrate" which has the tokenomics + UCW architecture in detail.
`;

const TOKEN_AND_UCW_BODY = `# UCW & $META Token: Blockchain Substrate Architecture

This artifact covers the blockchain + tokenomics half of Metaventions, sourced from the whitepaper sections on UCW architecture, $META token, and the BASIX index. The founding thesis (cognitive equity, the extraction problem) lives in the companion artifact "metaventions-ai-founding-vision-and-cognitive-equity" — keep them separated so the chat can surface ONE without the other depending on audience.

When asked about UCW architecture, the $META token, on-chain mechanics, BASIX, or "what's the blockchain piece", reach for THIS artifact.

## The five-layer substrate (canonical from whitepaper)

The UCW is described in the whitepaper as a **five-layer substrate from capture to blockchain ownership**:

1. **Capture** — always-on capture across AI platforms (Claude, ChatGPT, Grok, etc.)
2. **Synthesis** — long-term memory + research index (the supermemory layer)
3. **Valuation** — quantifying cognitive output as economic value
4. **Ownership** — wrapping cognitive output as on-chain assets
5. **Coordination** — $META token as the coordination mechanism

## Universal Cognitive Wallet Architecture (verbatim from Section 4)

${UCW_ARCH.slice(0, 5000)}

${UCW_ARCH.length > 5000 ? "\n*[truncated — full Section 4 at ~/.agent-core/pitch-deck/01_vision/WHITEPAPER.md]*" : ""}

## Cross-Platform Coherence Engine (verbatim from Section 6 — operational proof)

${COHERENCE.slice(0, 3500)}

${COHERENCE.length > 3500 ? "\n*[truncated — full Section 6 at ~/.agent-core/pitch-deck/01_vision/WHITEPAPER.md]*" : ""}

## Token Economics — $META (verbatim from Section 9)

${TOKENOMICS.slice(0, 5000)}

${TOKENOMICS.length > 5000 ? "\n*[truncated — full Section 9 at ~/.agent-core/pitch-deck/01_vision/WHITEPAPER.md]*" : ""}

## BASIX — Sovereign AI-Cloud Index (verbatim from Section 8)

${BASIX.slice(0, 3000)}

${BASIX.length > 3000 ? "\n*[truncated — full Section 8 at ~/.agent-core/pitch-deck/01_vision/WHITEPAPER.md]*" : ""}

## Status of the on-chain layer (be honest)

The UCW capture and synthesis layers are LIVE — verifiable via the 174,169 cognitive events, 33,240 research findings, 68,341 tool interactions tracked by working systems. The on-chain ownership and $META token coordination layers are documented in whitepaper v1.0 (February 2026) but are PRE-LAUNCH. The off-chain substrate exists; the token is the planned coordination mechanism on top.

When asked "is the token live?": be truthful — "the off-chain substrate is shipping with measurable usage; the on-chain $META coordination layer is whitepaper-stage as of February 2026 v1.0. Dico can speak to the launch timing directly."

## Compliance posture (important)

Anything investor-facing about the $META token should funnel to Dico personally for jurisdictional + securities compliance reasons. The chat should NEVER quote unit economics, fundraising terms, or sale schedules — those are deal-stage, not chat-stage. Cite the whitepaper as the public-facing reference and route the live conversation to Dico.

## How the chat should USE this artifact

**Strong patterns:**
- "The UCW is described as a five-layer substrate — capture, synthesis, valuation, ownership, coordination — with the bottom three already shipping and the top two in whitepaper-stage"
- "$META is the planned coordination token; the BASIX index tracks the emerging sovereign AI-cloud infrastructure layer"
- "The proof of implementation is the 174K cognitive events + 33K research findings + 68K tool interactions captured by working software, not just whitepaper claims"

**Anti-patterns to AVOID:**
- Quoting any specific token allocation, sale price, or fundraising amount — those are deal-stage, not in the chat corpus
- Speculating about token launch dates beyond what the whitepaper states
- Conflating UCW (live software) with $META (pre-launch token)
`;

interface Block {
  slug: string;
  title: string;
  body: string;
  topicalTags: string[];
}

const BLOCKS: Block[] = [
  {
    slug: "metaventions-ai-founding-vision-and-cognitive-equity",
    title: "Metaventions AI: Founding Vision & Cognitive Equity Thesis",
    body: FOUNDING_VISION_BODY,
    topicalTags: ["whitepaper", "founding-narrative", "cognitive-equity", "thesis", "metaventions-origin"],
  },
  {
    slug: "ucw-and-meta-token-blockchain-substrate",
    title: "UCW & $META Token: Blockchain Substrate Architecture",
    body: TOKEN_AND_UCW_BODY,
    topicalTags: ["whitepaper", "blockchain", "tokenomics", "$meta", "ucw-architecture", "basix-index", "web3"],
  },
];

const SOURCE: IngestArgs["source"] = {
  kind: "whitepaper-extraction",
  paths: ["~/.agent-core/pitch-deck/01_vision/WHITEPAPER.md"],
  notes: "Whitepaper v1.0, February 2026. Sections extracted by heading match.",
};

async function main(): Promise<void> {
  for (const block of BLOCKS) {
    console.log(`\n[ingest] ${block.slug} (${block.body.length} chars)`);
    if (DRY) {
      console.log(`  [dry] preview:\n${block.body.slice(0, 600)}\n...`);
      continue;
    }
    try {
      const id = await threeLayerIngest({
        sb,
        client: deepseek,
        repoRoot: REPO_ROOT,
        ingestedBy: "scripts/ingest-whitepaper-and-blockchain.ts",
        slug: block.slug,
        title: block.title,
        content: block.body,
        category: "deep-dive",
        topicalTags: block.topicalTags,
        source: SOURCE,
      });
      console.log(`  ✓ inserted ${id}`);
    } catch (err) {
      console.error(`  ✗ ${(err as Error).message}`);
    }
  }
  console.log(`\n[ingest] done.`);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
