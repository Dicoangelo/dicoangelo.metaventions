import { getSupabase } from "@/lib/supabase-server";

export async function GET(request: Request) {

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "20", 10);
  const tier = searchParams.get("tier");
  const starred = searchParams.get("starred");

  const offset = (page - 1) * limit;

  let query = getSupabase()
    .from("jd_analyses")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (tier && ["strong", "moderate", "weak", "poor"].includes(tier)) {
    query = query.eq("fit_tier", tier);
  }

  if (starred === "true") {
    query = query.eq("is_starred", true);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error("Failed to fetch analyses:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch analyses" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  return new Response(
    JSON.stringify({
      analyses: data,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}
