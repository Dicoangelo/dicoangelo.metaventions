import Anthropic from "@anthropic-ai/sdk";
import { getSupabase } from "@/lib/supabase-server";
import { getDossierContextForJD, getCombinedContextForJD } from "@/lib/dossier";
import { jdAnalyzerRateLimit, getClientIdentifier, createRateLimitHeaders } from "@/lib/ratelimit";
import { jdAnalyzerSchema, validateRequest } from "@/lib/schemas";
import { resolveRerank } from "@/lib/rerank-control";
import { getArtifactIndex } from "@/lib/artifact-index";

// JD Analyzer also runs on DeepSeek V4 Pro via the Anthropic-compat
// endpoint, same as the chat route. Falls back to V4 Flash on errors.
// Migrated off Anthropic for cost (Sonnet 4.6 was ~$3/$15 per 1M tokens
// and JD analyses are 3-5K tokens each — adds up fast).
const deepseek = new Anthropic({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: "https://api.deepseek.com/anthropic",
});

const JD_MODEL = process.env.DEEPSEEK_JD_MODEL || "deepseek-v4-pro";
const JD_FALLBACK_MODEL = process.env.DEEPSEEK_FALLBACK_MODEL || "deepseek-v4-flash";

interface JDAnalysisAssessment {
  summary: string;
  strengths: Array<{
    skill: string;
    evidence: string;
    match_score: number;
  }>;
  gaps: Array<{
    requirement: string;
    reality: string;
    severity: "high" | "medium" | "low";
  }>;
  recommendations: string[];
  fit_score: number;
  fit_tier: "strong" | "moderate" | "weak" | "poor";
}

/**
 * Clean markdown code blocks and other LLM-generated noise from a JSON
 * response. Tolerates leading prose, trailing commentary, and trailing
 * commas inside arrays/objects (a common DeepSeek V4 emission).
 */
function cleanJsonResponse(response: string): string {
  let cleaned = response.trim();

  // Strip markdown code fences if present.
  if (cleaned.startsWith("```json")) cleaned = cleaned.slice(7);
  else if (cleaned.startsWith("```")) cleaned = cleaned.slice(3);
  if (cleaned.endsWith("```")) cleaned = cleaned.slice(0, -3);
  cleaned = cleaned.trim();

  // If there's any leading prose before the first {, drop it. Same for
  // any trailing prose after the last matching }.
  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");
  if (firstBrace > 0) cleaned = cleaned.slice(firstBrace);
  if (lastBrace > -1 && lastBrace < cleaned.length - 1) {
    cleaned = cleaned.slice(0, lastBrace + 1);
  }

  // Remove trailing commas before } or ] — strict JSON forbids these
  // but LLMs emit them all the time.
  cleaned = cleaned.replace(/,(\s*[}\]])/g, "$1");

  return cleaned.trim();
}

const BRUTALLY_HONEST_PROMPT = `You are a BRUTALLY HONEST career fit analyzer. Your job is to assess how well Dico Angelo matches a job description.

## Rules - FOLLOW EXACTLY:
1. **NO FLATTERY** - If there's a gap, say it directly. No sugarcoating.
2. **NO HEDGING** - Don't say "could potentially" or "might be able to" - say "does" or "doesn't"
3. **EVIDENCE-BASED** - Every strength MUST cite specific proof from the dossier. If no evidence, it's not a strength.
4. **QUANTIFY** - Use percentages, scores, specific numbers where possible
5. **BE SPECIFIC** - Don't say "strong technical background" - say exactly which skills match

## Fit Score Guidelines (0-100):
- **85-100 (Strong)**: Most requirements met with concrete evidence. Ready to interview.
- **70-84 (Moderate)**: Core requirements met, some gaps but transferable. Worth a conversation.
- **50-69 (Weak)**: Significant gaps. Would need substantial ramp-up.
- **0-49 (Poor)**: Major misalignment. Not a fit.

## Example Tone:
- "Dico has 0 years of enterprise Kubernetes. The JD requires 3+ years."
- "Strong match: $800M+ TCV processed through cloud marketplace operations aligns with the deal flow requirement."
- "No evidence of Rust experience. The JD lists it as required."
- "5+ years of cloud marketplace operations matches the requirement."

## Your Output Format:
Respond with a JSON object matching this exact structure:
{
  "summary": "One paragraph brutally honest assessment (3-4 sentences)",
  "strengths": [
    {
      "skill": "Skill name",
      "evidence": "Specific quote or fact from dossier",
      "match_score": 85
    }
  ],
  "gaps": [
    {
      "requirement": "What the JD requires",
      "reality": "What Dico has (or doesn't)",
      "severity": "high|medium|low"
    }
  ],
  "recommendations": [
    "Specific advice for this application"
  ],
  "fit_score": 72,
  "fit_tier": "moderate"
}

## UCW-Derived Skills (treat these as verified, demonstrated capabilities):
Dico built the Universal Cognitive Wallet (UCW) — a production system that captures, embeds, and analyzes AI interactions across 5 platforms (Claude, ChatGPT, Gemini, ResearchGravity, NotebookLM). Current scale (snapshot 2026-03):

- **12.15 million graph edges** across 7,130 memory items (~1,704 avg connections per node)
- **243,922 tool interactions** logged, 50,624 in DB
- **4,954 DQ routing decisions** (avg score 0.889) and 4,435 ACE-scored session outcomes
- **2,848 learnings** with spaced-repetition consolidation
- **900K+ lines of production code** across 20+ repos, all AI-directed

This demonstrates:

- **Data Pipeline Engineering at Scale**: ETL across 5 AI platforms into PostgreSQL with pgvector; 12.15M-edge knowledge graph
- **Vector Embeddings / Semantic Search**: cosine similarity over 1024-dim embeddings, three-layer retrieval (title → summary → chunks) shipped to production chat
- **Cross-Platform Data Integration**: unified Claude / ChatGPT / Gemini / ResearchGravity / NotebookLM into a single cognitive view
- **MCP Protocol Implementation**: raw MCP transport for cognitive capture, 3-layer semantic enrichment
- **PostgreSQL + pgvector at production scale**: 11 tables, JSONB metadata queries, IVFFlat vector indexes
- **Decision-Quality (DQ) Scoring**: 4,954 routing decisions averaging 0.889 quality score, autonomous model selection
- **Multi-Agent Orchestration**: 6-agent ACE consensus with bicameral voting, 21-agent SUPERMAX coordination
- **Coherence Detection Algorithms**: semantic echo, synchronicity, signature matching
- **AI-Directed Pipeline Engineering**: specifies 30K+ line subsystems in plain English, directs Claude Code, Codex, Gemini, and DeepSeek V4 to implement
- **RAG Pipelines**: production three-layer retrieval shipped to portfolio chat 2026-05; verified 99% KV cache hit ratio after warm-up
- **Event-Driven Architecture**: real-time event processing with PostgreSQL triggers, daemon services with stall detection

## Recently Demonstrated Engineering Capabilities (2026-04 / 2026-05)

These are concrete shipped wins from the last 30 days, not aspirational claims:

- **Provider Abstraction & Migration**: migrated production AI surfaces (chat + JD analyzer) from Anthropic Sonnet to DeepSeek V4 Pro via the Anthropic-compatible Messages API. Same SDK, swapped baseURL — ~28x cost reduction end-to-end with no behavioral regression.
- **KV Cache Optimization**: structured prompt prefix as static-then-dynamic so DeepSeek's auto-cache hits 99% on warm requests. Verified with cache_hit_tokens telemetry logged per request.
- **Runtime Feature Flags + A/B Testing**: shipped a 3-state toggle (off / on / ab) for Cohere rerank, with hash-stable variant assignment per visitor and metadata logging for offline quality comparison.
- **Resilient Degradation**: when Cohere hit its monthly billing cap mid-day, the chat and JD analyzer continued working by gracefully falling back to the always-loaded artifact title+summary index. No customer-facing outage.
- **Multi-Provider Abstraction with Fallback**: V4 Pro primary with automatic V4 Flash fallback on rate-limit / 5xx / model-unavailable. One try/catch, transparent observability via X-Chat-Model header.
- **Observability Instrumentation**: per-request logging of model_used, cache_hit_tokens, cache_miss_tokens, rerank_mode, rerank_variant into Supabase chat_logs.metadata for post-hoc analysis.
- **Anti-Hallucination Prompt Engineering**: caught a live production hallucination (chat fabricated a Partnership Graph project that didn't exist), shipped explicit anti-hallucination guards with project-name examples. Verified the fix by re-asking the same query.
- **Live Voice + Text Chat**: voice orb with thinking-mode disabled to keep TTS latency under 500ms, conversation persistence via sessionStorage, copy/regenerate buttons.

When a JD mentions AI operations, AI infrastructure, multi-agent systems, embeddings, vector search, semantic search, RAG, cognitive computing, prompt engineering, LLM evaluation, agentic architectures, observability, feature flags, A/B testing, multi-provider abstraction, or GTM/marketplace operations — these capabilities are STRONG matches. Score them accordingly.

IMPORTANT — How to score language requirements:

Dico ships production code in TypeScript, Python, SQL, and Bash, but he produces it by directing AI coding agents (Claude Code, Codex, Gemini, DeepSeek V4) in plain English. He reviews, tests, and ships. He does NOT claim whiteboard fluency in any specific language.

This is a SCORING RULE, not a flat skip rule. Different language requirements warrant different treatment:

STRONG MATCH (cite the actual production work, do not flag as a gap):
- Python for data pipelines, ETL, ML feature engineering, RAG ingestion, scripting, automation, or MCP server work — Dico has shipped this in ResearchGravity, META-VENGINE, and the UCW system.
- TypeScript / JavaScript for React, Next.js, partner-facing web tooling, dashboards, internal tooling — Dico has shipped 152K+ lines of OS-App and the dicoangelo.metaventions site.
- SQL for analytics, partner ops reporting, dashboards, vector queries — Dico has shipped Supabase + pgvector at production scale.
- Bash / shell for ops automation, deployment scripts — routine in his stack.
- AI Engineering / LLM Engineering / RAG / Multi-Agent / Embedding work — these are production-shipped strengths.

MEDIUM/LOW MATCH (caveat the AI-assisted production model, but don't kill the score):
- Python or TS for product-engineering work where the role is partner-facing or ops-leaning rather than core IC (e.g. solutions engineering with implementation expectations, technical PM with code review).

HARD SKIP regardless of adjacent skills (these archetypes assume hand-fluency Dico does not claim):
- Senior whiteboard-coding SWE roles (Backend / Frontend / Full-Stack / Mobile)
- ML Engineer / Data Engineer / Data Scientist with model-training expectations
- SRE / DevOps / Platform Engineer / Security Engineer with on-call ownership
- Senior pre-sales Solutions Engineer with 5+ years Solutions Consulting at a hyperscaler
- Salesforce-architect-dressed-as-SE with 6+ years Salesforce declarative tooling
- Code-test-driven hiring loops (LeetCode-style interviews)

OK SE/SA archetypes (these are learnable):
- Solution Engineer / Solutions Architect with 3+ yrs and a "learn our product" framing where the product is learnable in 90 days.

Default policy when ambiguous: lean toward MATCH if the role is operational, partner-facing, ops-architecture, RevOps, partner ops, or strategic. Lean toward SKIP if the role is pure IC engineering or pre-sales SE with senior fluency expectations.

CRITICAL: Your response must be valid JSON only. No markdown, no explanation, just the JSON object.`;

export async function POST(request: Request) {
  try {
    // Rate limiting check
    const identifier = getClientIdentifier(request.headers as any);
    const { success, limit, remaining, reset } = await jdAnalyzerRateLimit.limit(identifier);

    if (!success) {
      return new Response(
        JSON.stringify({
          error: "Rate limit exceeded. Please wait a moment before trying again."
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            ...createRateLimitHeaders(limit, remaining, reset),
          },
        }
      );
    }

    const body = await request.json();

    // Validate request body
    const validation = validateRequest(jdAnalyzerSchema, body);
    if (!validation.success) {
      return new Response(
        JSON.stringify({ error: validation.error }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const { jd_text, session_id } = validation.data;

    // Resolve rerank from the runtime toggle (off / on / ab) so JD
    // analysis honors the same control as chat. Default off keeps the
    // Cohere bill at zero. Pass the identifier so A/B mode is stable.
    const rerankDecision = resolveRerank(identifier);

    // Always-loaded baseline: title + summary index for every published
    // artifact. Works without Cohere/PageIndex and is enough on its own
    // for most JD assessments. Three-layer retrieval Layer 1+2.
    const artifactIndex = await getArtifactIndex();

    // Optional augmentation: deep RAG chunks. Will return empty if Cohere
    // is rate-limited / at billing cap; that's fine — we still have the
    // artifact index as a fallback so the analyzer never hard-fails.
    let chunkContext = "";
    try {
      const result = await getCombinedContextForJD(jd_text, {
        rerank: rerankDecision.shouldRerank,
      });
      chunkContext = result.context || "";
    } catch (ragErr) {
      console.warn("[analyze-jd] chunk retrieval failed, falling back to artifact index only:", ragErr);
    }

    // Compose: index always present, deep chunks when available.
    const dossierContext = [artifactIndex, chunkContext].filter(Boolean).join("\n\n---\n\n");

    if (!dossierContext) {
      return new Response(
        JSON.stringify({ error: "Unable to retrieve dossier context. Please try again." }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // Extract JD title and company if possible (heuristic)
    const titleMatch = jd_text.match(/^(?:job\s+title|position|role)[:\s]*(.+?)(?:\n|$)/im);
    const companyMatch = jd_text.match(/(?:company|employer|at)[:\s]*(.+?)(?:\n|$)/im);
    const jd_title = titleMatch?.[1]?.trim() || extractFirstLine(jd_text);
    const company_name = companyMatch?.[1]?.trim() || null;

    // Build the analysis prompt
    const analysisPrompt = `## Job Description to Analyze:
${jd_text}

## Dico Angelo's Career Dossier (Retrieved Context):
${dossierContext}

Based on the job description and dossier context above, provide your brutally honest fit assessment.`;

    // Collect the full response before sending to avoid partial/empty stream errors
    let fullResponse = "";
    let modelUsed: string = JD_MODEL;

    const baseRequest = {
      max_tokens: 3000,
      temperature: 0.2,
      // Thinking is OFF by default for JD analysis — V4's chain-of-thought
      // makes structured JSON output less deterministic. The brutally-
      // honest prompt itself is structured enough to drive the assessment.
      // Set DEEPSEEK_JD_THINKING=on to opt back in if needed.
      ...(process.env.DEEPSEEK_JD_THINKING === "on"
        ? {}
        : { thinking: { type: "disabled" as const } }),
      system: BRUTALLY_HONEST_PROMPT,
      messages: [{ role: "user" as const, content: analysisPrompt }],
    };

    async function runStream(model: string) {
      const stream = await deepseek.messages.stream({ model, ...baseRequest });
      let collected = "";
      for await (const event of stream) {
        if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
          collected += event.delta.text;
        }
      }
      return collected;
    }

    try {
      fullResponse = await runStream(JD_MODEL);
    } catch (primaryErr) {
      console.warn("[analyze-jd] primary model failed, falling back to", JD_FALLBACK_MODEL, primaryErr);
      try {
        modelUsed = JD_FALLBACK_MODEL;
        fullResponse = await runStream(JD_FALLBACK_MODEL);
      } catch (apiError) {
        console.error("DeepSeek API error (both Pro and Flash failed):", apiError);
        return new Response(
          JSON.stringify({ error: "AI analysis service temporarily unavailable. Please try again." }),
          { status: 502, headers: { "Content-Type": "application/json" } }
        );
      }
    }

    // Parse the completed response
    let assessment: JDAnalysisAssessment;
    try {
      const cleanedResponse = cleanJsonResponse(fullResponse);
      assessment = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error("Failed to parse analysis response:", parseError);
      await getSupabase().from("jd_analyses").insert({
        jd_raw_text: jd_text,
        jd_title,
        company_name,
        assessment: { raw_response: fullResponse, parse_error: true },
        model_used: modelUsed,
        session_id: session_id || null,
      });
      return new Response(
        JSON.stringify({ error: "Failed to parse analysis. Please try again." }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // Store in database
    const { error: dbError } = await getSupabase().from("jd_analyses").insert({
      jd_raw_text: jd_text,
      jd_title,
      company_name,
      fit_score: assessment.fit_score,
      fit_tier: assessment.fit_tier,
      assessment,
      model_used: modelUsed,
      session_id: session_id || null,
    });

    if (dbError) {
      console.error("Failed to store analysis:", dbError);
    }

    // Update skill gap analytics
    await updateSkillGapAnalytics(assessment.gaps);

    return new Response(
      JSON.stringify(assessment),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("JD Analysis API error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to analyze job description" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

function extractFirstLine(text: string): string {
  const firstLine = text.trim().split("\n")[0];
  return firstLine.length > 100 ? firstLine.substring(0, 100) + "..." : firstLine;
}

async function updateSkillGapAnalytics(
  gaps: Array<{ requirement: string; reality: string; severity: string }>
): Promise<void> {
  for (const gap of gaps) {
    // Normalize skill name from requirement
    const skillName = gap.requirement
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .trim()
      .substring(0, 100);

    if (!skillName) continue;

    const { data: existing } = await getSupabase()
      .from("skill_gap_analytics")
      .select("id, gap_count, total_occurrences")
      .eq("skill_name", skillName)
      .single();

    if (existing) {
      await getSupabase()
        .from("skill_gap_analytics")
        .update({
          gap_count: existing.gap_count + 1,
          total_occurrences: existing.total_occurrences + 1,
          last_seen: new Date().toISOString(),
        })
        .eq("id", existing.id);
    } else {
      await getSupabase().from("skill_gap_analytics").insert({
        skill_name: skillName,
        gap_count: 1,
        total_occurrences: 1,
      });
    }
  }
}
