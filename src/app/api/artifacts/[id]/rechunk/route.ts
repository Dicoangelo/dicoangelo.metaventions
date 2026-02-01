import { NextResponse } from "next/server";
import { getArtifact, rechunkArtifact } from "@/lib/artifacts";

// ================================================================
// HELPERS
// ================================================================

/**
 * Check if request has valid admin authorization
 */
function isAdmin(request: Request): boolean {
  const auth = request.headers.get("Authorization");
  if (!auth) return false;
  const token = auth.replace("Bearer ", "");
  return token === process.env.ADMIN_PASSWORD;
}

// ================================================================
// ROUTES
// ================================================================

/**
 * POST /api/artifacts/[id]/rechunk
 * Force re-chunk and re-embed an artifact (regardless of content change)
 * Requires admin authentication
 */
export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Check admin authentication
    if (!isAdmin(request)) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    // Validate UUID format
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return NextResponse.json(
        { error: "Invalid artifact ID format" },
        { status: 400 }
      );
    }

    // Check if artifact exists
    const existingArtifact = await getArtifact(id);
    if (!existingArtifact) {
      return NextResponse.json(
        { error: "Artifact not found" },
        { status: 404 }
      );
    }

    const chunkCount = await rechunkArtifact(id);

    return NextResponse.json({
      success: true,
      artifact_id: id,
      chunks_created: chunkCount
    });
  } catch (error) {
    const params = await context.params;
    console.error(`POST /api/artifacts/${params.id}/rechunk error:`, error);
    return NextResponse.json(
      { error: "Failed to rechunk artifact" },
      { status: 500 }
    );
  }
}
