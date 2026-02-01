import { NextResponse } from "next/server";
import {
  getArtifact,
  updateArtifact,
  deleteArtifact,
  CreateArtifactInput,
} from "@/lib/artifacts";
import { z } from "zod";
import { validateRequest } from "@/lib/schemas";

// ================================================================
// SCHEMAS
// ================================================================

const updateArtifactSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long").optional(),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(100, "Slug too long")
    .regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens")
    .optional(),
  content: z.string().min(1, "Content is required").optional(),
  summary: z.string().max(500, "Summary too long").optional(),
  category: z.enum(["project", "skill", "experience", "faq", "deep-dive"]).optional(),
  tags: z.array(z.string()).optional(),
  related_artifacts: z.array(z.string().uuid()).optional(),
  external_links: z.record(z.string(), z.string()).optional(),
  metrics: z.record(z.string(), z.any()).optional(),
  status: z.enum(["draft", "published", "archived"]).optional(),
});

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
 * GET /api/artifacts/[id]
 * Get a single artifact by ID
 */
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
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

    const artifact = await getArtifact(id);

    if (!artifact) {
      return NextResponse.json(
        { error: "Artifact not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ artifact });
  } catch (error) {
    const params = await context.params;
    console.error(`GET /api/artifacts/${params.id} error:`, error);
    return NextResponse.json(
      { error: "Failed to retrieve artifact" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/artifacts/[id]
 * Update an existing artifact
 * Requires admin authentication
 */
export async function PUT(
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

    const body = await request.json();

    // Validate request body
    const validation = validateRequest(updateArtifactSchema, body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error },
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

    const artifact = await updateArtifact(id, validation.data as Partial<CreateArtifactInput>);

    return NextResponse.json({ artifact });
  } catch (error) {
    const params = await context.params;
    console.error(`PUT /api/artifacts/${params.id} error:`, error);

    // Check for unique constraint violation (duplicate slug)
    if (error instanceof Error && error.message.includes("duplicate key")) {
      return NextResponse.json(
        { error: "An artifact with this slug already exists" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update artifact" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/artifacts/[id]
 * Delete an artifact
 * Requires admin authentication
 */
export async function DELETE(
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

    await deleteArtifact(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    const params = await context.params;
    console.error(`DELETE /api/artifacts/${params.id} error:`, error);
    return NextResponse.json(
      { error: "Failed to delete artifact" },
      { status: 500 }
    );
  }
}
