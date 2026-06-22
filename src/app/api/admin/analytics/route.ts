import { getSupabase } from "@/lib/supabase-server";

export async function GET() {

  // Get skill gap analytics
  const { data: skillGaps, error: gapsError } = await getSupabase()
    .from("skill_gap_analytics")
    .select("*")
    .order("gap_count", { ascending: false })
    .limit(20);

  if (gapsError) {
    console.error("Failed to fetch skill gaps:", gapsError);
  }

  // Get analysis summary stats
  const { data: analyses, error: analysesError } = await getSupabase()
    .from("jd_analyses")
    .select("fit_tier, fit_score, created_at");

  if (analysesError) {
    console.error("Failed to fetch analyses for stats:", analysesError);
  }

  // Calculate statistics
  const totalAnalyses = analyses?.length || 0;
  const avgScore = analyses?.length
    ? analyses.reduce((sum, a) => sum + (a.fit_score || 0), 0) / analyses.length
    : 0;

  const tierCounts = {
    strong: 0,
    moderate: 0,
    weak: 0,
    poor: 0,
  };

  analyses?.forEach((a) => {
    if (a.fit_tier && a.fit_tier in tierCounts) {
      tierCounts[a.fit_tier as keyof typeof tierCounts]++;
    }
  });

  // Get analyses over time (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const analysesOverTime = analyses
    ?.filter((a) => new Date(a.created_at) >= thirtyDaysAgo)
    .reduce(
      (acc, a) => {
        const date = new Date(a.created_at).toISOString().split("T")[0];
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

  return new Response(
    JSON.stringify({
      skillGaps: skillGaps || [],
      summary: {
        totalAnalyses,
        avgScore: Math.round(avgScore * 10) / 10,
        tierCounts,
      },
      analysesOverTime: analysesOverTime || {},
    }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}
