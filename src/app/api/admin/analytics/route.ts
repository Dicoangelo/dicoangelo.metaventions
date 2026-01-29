import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);

const SESSION_COOKIE_NAME = "jd_admin_session";

async function verifyAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(SESSION_COOKIE_NAME);

  if (!sessionToken) return false;

  try {
    const decoded = Buffer.from(sessionToken.value, "base64").toString();
    const [prefix, timestamp] = decoded.split(":");

    if (prefix !== "admin") return false;

    const sessionAge = Date.now() - parseInt(timestamp, 10);
    if (sessionAge > 24 * 60 * 60 * 1000) return false;

    return true;
  } catch {
    return false;
  }
}

export async function GET() {
  if (!(await verifyAdmin())) {
    return new Response(
      JSON.stringify({ error: "Unauthorized" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  // Get skill gap analytics
  const { data: skillGaps, error: gapsError } = await supabase
    .from("skill_gap_analytics")
    .select("*")
    .order("gap_count", { ascending: false })
    .limit(20);

  if (gapsError) {
    console.error("Failed to fetch skill gaps:", gapsError);
  }

  // Get analysis summary stats
  const { data: analyses, error: analysesError } = await supabase
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
