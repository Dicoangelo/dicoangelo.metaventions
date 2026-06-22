import { getSupabase } from "@/lib/supabase-server";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, context: RouteContext) {

  const { id } = await context.params;

  const { data, error } = await getSupabase()
    .from("jd_analyses")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return new Response(
      JSON.stringify({ error: "Analysis not found" }),
      { status: 404, headers: { "Content-Type": "application/json" } }
    );
  }

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function PATCH(request: Request, context: RouteContext) {

  const { id } = await context.params;

  try {
    const updates = await request.json();

    // Only allow specific fields to be updated
    const allowedFields = ["admin_notes", "is_starred", "jd_title", "company_name"];
    const sanitizedUpdates: Record<string, unknown> = {};

    for (const field of allowedFields) {
      if (field in updates) {
        sanitizedUpdates[field] = updates[field];
      }
    }

    if (Object.keys(sanitizedUpdates).length === 0) {
      return new Response(
        JSON.stringify({ error: "No valid fields to update" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const { data, error } = await getSupabase()
      .from("jd_analyses")
      .update(sanitizedUpdates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Update error:", error);
      return new Response(
        JSON.stringify({ error: "Failed to update analysis" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("PATCH error:", error);
    return new Response(
      JSON.stringify({ error: "Invalid request body" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function DELETE(request: Request, context: RouteContext) {

  const { id } = await context.params;

  const { error } = await getSupabase().from("jd_analyses").delete().eq("id", id);

  if (error) {
    return new Response(
      JSON.stringify({ error: "Failed to delete analysis" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
