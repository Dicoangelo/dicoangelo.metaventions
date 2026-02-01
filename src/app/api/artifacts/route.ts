import { NextResponse } from "next/server";
import { listArtifacts, createArtifact, CreateArtifactInput } from "@/lib/artifacts";
import { z } from "zod";
import { validateRequest } from "@/lib/schemas";

// ================================================================
// SCHEMAS
// ================================================================

const createArtifactSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(100, "Slug too long")
    .regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  content: z.string().min(1, "Content is required"),
  summary: z.string().max(500, "Summary too long").optional(),
  category: z.enum(["project", "skill", "experience", "faq", "deep-dive"]),
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
 * GET /api/artifacts
 * List artifacts with optional filtering
 * Query params: status, category
 */
export async function GET(request: Request, context: unknown) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") as "draft" | "published" | "archived" | null;
    const category = searchParams.get("category") as
      | "project"
      | "skill"
      | "experience"
      | "faq"
      | "deep-dive"
      | null;

    const artifacts = await listArtifacts({
      status: status || undefined,
      category: category || undefined,
    });

    return NextResponse.json({ artifacts });
  } catch (error) {
    console.error("GET /api/artifacts error:", error);
    return NextResponse.json(
      { error: "Failed to list artifacts" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/artifacts
 * Create a new artifact
 * Requires admin authentication
 */
export async function POST(request: Request, context: unknown) {
  try {
    // Check admin authentication
    if (!isAdmin(request)) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validate request body
    const validation = validateRequest(createArtifactSchema, body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    const artifact = await createArtifact(validation.data as CreateArtifactInput);

    return NextResponse.json({ artifact }, { status: 201 });
  } catch (error) {
    console.error("POST /api/artifacts error:", error);

    // Check for unique constraint violation (duplicate slug)
    if (error instanceof Error && error.message.includes("duplicate key")) {
      return NextResponse.json(
        { error: "An artifact with this slug already exists" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create artifact" },
      { status: 500 }
    );
  }
}
