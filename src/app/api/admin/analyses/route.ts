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

export async function GET(request: Request) {
  if (!(await verifyAdmin())) {
    return new Response(
      JSON.stringify({ error: "Unauthorized" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "20", 10);
  const tier = searchParams.get("tier");
  const starred = searchParams.get("starred");

  const offset = (page - 1) * limit;

  let query = supabase
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
