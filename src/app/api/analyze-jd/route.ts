import Anthropic from "@anthropic-ai/sdk";
import { getSupabase } from "@/lib/supabase-server";
import { getCombinedContextForJD } from "@/lib/dossier";
import { jdAnalyzerRateLimit, getClientIdentifier, createRateLimitHeaders } from "@/lib/ratelimit";
import { jdAnalyzerSchema, validateRequest } from "@/lib/schemas";
import { resolveRerank } from "@/lib/rerank-control";
import { getArtifactIndex } from "@/lib/artifact-index";
import { PROFESSIONAL_PROFILE_CONTEXT } from "@/lib/professional-profile";

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

const BRUTALLY_HONEST_PROMPT = `Assess how well Dico Angelo's verified experience matches the supplied job description. Be specific, evidence-based, and candid.

${PROFESSIONAL_PROFILE_CONTEXT}

## Assessment rules
- Every strength must cite a concrete fact from the verified profile or non-conflicting retrieved evidence. Distinguish adjacent experience from a directly demonstrated requirement.
- Do not inflate tenure, scope, savings, technical fluency, credentials, or personal contribution to team results. Do not infer completed outcomes from current-role responsibilities.
- AI-directed development demonstrates workflow design, implementation with AI tools, testing, and deployment. It is not evidence of unaided programming fluency, senior software engineering experience, ML model training, or production on-call responsibilities.
- Explain meaningful gaps in plain language and recommend practical next steps. Do not automatically award a strong fit because a job mentions AI, Python, or operations.
- Never reproduce private source text, internal employer information, or personal addresses.
- A fit score is an indicative assessment of documented overlap, not a hiring prediction. Use 85-100 for strong documented alignment, 70-84 for substantial alignment with manageable gaps, 50-69 for adjacent experience with material gaps, and below 50 for limited alignment.

Return valid JSON only, using this structure:
{
  "summary": "Brief assessment with relevant context and limitations",
  "strengths": [{"skill": "Relevant requirement", "evidence": "Concrete supported experience", "match_score": 0}],
  "gaps": [{"requirement": "Job requirement", "reality": "What is and is not established", "severity": "high|medium|low"}],
  "recommendations": ["Practical recommendation"],
  "fit_score": 0,
  "fit_tier": "strong|moderate|weak|poor"
}
`;

export async function POST(request: Request) {
  try {
    // Rate limiting check
    const identifier = getClientIdentifier(request.headers);
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
