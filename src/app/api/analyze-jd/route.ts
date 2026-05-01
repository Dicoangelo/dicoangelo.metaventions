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
 * Clean markdown code blocks from LLM response
 */
function cleanJsonResponse(response: string): string {
  let cleaned = response.trim();
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.slice(7);
  }
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.slice(3);
  }
  if (cleaned.endsWith("```")) {
    cleaned = cleaned.slice(0, -3);
  }
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
Dico built the Universal Cognitive Wallet (UCW) — a production system that captures, embeds, and analyzes cognitive events across 6 AI platforms. This demonstrates:

- **Data Pipeline Engineering**: Built ETL pipeline processing 163,113 events from 6 platforms into PostgreSQL with pgvector
- **Vector Embeddings / Semantic Search**: Generated 150,742 SBERT embeddings, implemented cosine similarity search at scale
- **Cross-Platform Data Integration**: Unified Claude CLI, ChatGPT, Grok, Claude Code, Claude Desktop into single cognitive view
- **Real-Time Data Capture**: LaunchAgent daemon architecture polling every 5 minutes, always-on capture
- **MCP Protocol Implementation**: Raw MCP transport (no SDK) for cognitive event capture with 3-layer semantic enrichment
- **PostgreSQL + pgvector**: Production database with vector similarity search, 11 tables, complex JSONB queries
- **Quality Scoring / Evaluation**: Automated quality assessment across 163K events with multi-tier scoring
- **Coherence Detection Algorithms**: Semantic echo (cosine similarity), synchronicity (temporal alignment), signature matching
- **Daemon / Service Architecture**: LaunchAgent-based services, background processing, stall detection
- **AI-Directed Pipeline Engineering**: Specified 35K+ lines in ResearchGravity (importers, scorers, embedding pipelines) in English, built by directing Claude Code / Codex / Gemini
- **Multi-Agent Orchestration**: 6-agent ACE consensus engine, DQ scoring for autonomous model routing
- **RAG Pipelines**: Vector embeddings for knowledge retrieval across multiple production systems
- **Event-Driven Architecture**: Real-time event processing with PostgreSQL triggers and notification channels

When a JD mentions AI operations, AI infrastructure, multi-agent systems, embeddings, vector search, semantic search, RAG, cognitive computing, prompt engineering, LLM evaluation, agentic architectures, or GTM/marketplace operations — these UCW skills are STRONG matches. Score them accordingly.

IMPORTANT: Dico specifies systems in English and directs AI coding agents (Claude Code, Codex, Gemini) to implement them. He reviews, tests, and ships. He does NOT claim hand-fluency in TypeScript, JavaScript, Python, SQL, or Bash. If a JD requires deep language fluency (whiteboard coding in a specific language, senior SWE / ML Engineer / Data Engineer / DevOps / SRE / Platform Engineer / Security Engineer / deep-tech Solutions Architect / pre-sales SE at a hyperscaler), flag this as a HIGH-severity gap regardless of adjacent skills.

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
      max_tokens: 2048,
      // JD analysis benefits from V4's reasoning, so unlike voice chat
      // we leave thinking enabled by default. Set DEEPSEEK_JD_THINKING=off
      // to override if the analysis ever runs over latency budget.
      ...(process.env.DEEPSEEK_JD_THINKING === "off"
        ? { thinking: { type: "disabled" as const } }
        : {}),
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
