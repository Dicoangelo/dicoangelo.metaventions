import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@supabase/supabase-js";
import { getDossierContextForJD } from "@/lib/dossier";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);

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
- "Strong match: $800M+ TCV managed aligns with the $500M quota requirement."
- "No evidence of Rust experience. The JD lists it as required."
- "8 years of Python matches the 5+ requirement."

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

CRITICAL: Your response must be valid JSON only. No markdown, no explanation, just the JSON object.`;

export async function POST(request: Request) {
  try {
    const { jd_text, session_id } = await request.json();

    if (!jd_text || typeof jd_text !== "string" || jd_text.trim().length < 50) {
      return new Response(
        JSON.stringify({ error: "Job description must be at least 50 characters" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Get comprehensive dossier context
    const { context: dossierContext, chunks } = await getDossierContextForJD(jd_text);

    if (chunks.length === 0) {
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

    // Stream the analysis
    const encoder = new TextEncoder();
    let fullResponse = "";

    const readable = new ReadableStream({
      async start(controller) {
        try {
          const stream = await anthropic.messages.stream({
            model: "claude-sonnet-4-20250514",
            max_tokens: 2048,
            system: BRUTALLY_HONEST_PROMPT,
            messages: [{ role: "user", content: analysisPrompt }],
          });

          for await (const event of stream) {
            if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
              fullResponse += event.delta.text;
              controller.enqueue(encoder.encode(event.delta.text));
            }
          }

          // After streaming completes, parse and store the result
          try {
            const cleanedResponse = cleanJsonResponse(fullResponse);
            const assessment: JDAnalysisAssessment = JSON.parse(cleanedResponse);

            // Store in database
            const { error: dbError } = await supabase.from("jd_analyses").insert({
              jd_raw_text: jd_text,
              jd_title,
              company_name,
              fit_score: assessment.fit_score,
              fit_tier: assessment.fit_tier,
              assessment,
              model_used: "claude-sonnet-4-20250514",
              session_id: session_id || null,
            });

            if (dbError) {
              console.error("Failed to store analysis:", dbError);
            }

            // Update skill gap analytics
            await updateSkillGapAnalytics(assessment.gaps);
          } catch (parseError) {
            console.error("Failed to parse analysis response:", parseError);
            // Still store the raw response even if parsing fails
            await supabase.from("jd_analyses").insert({
              jd_raw_text: jd_text,
              jd_title,
              company_name,
              assessment: { raw_response: fullResponse, parse_error: true },
              model_used: "claude-sonnet-4-20250514",
              session_id: session_id || null,
            });
          }

          controller.close();
        } catch (streamError) {
          console.error("Stream error:", streamError);
          controller.error(streamError);
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });
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

    const { data: existing } = await supabase
      .from("skill_gap_analytics")
      .select("id, gap_count, total_occurrences")
      .eq("skill_name", skillName)
      .single();

    if (existing) {
      await supabase
        .from("skill_gap_analytics")
        .update({
          gap_count: existing.gap_count + 1,
          total_occurrences: existing.total_occurrences + 1,
          last_seen: new Date().toISOString(),
        })
        .eq("id", existing.id);
    } else {
      await supabase.from("skill_gap_analytics").insert({
        skill_name: skillName,
        gap_count: 1,
        total_occurrences: 1,
      });
    }
  }
}
