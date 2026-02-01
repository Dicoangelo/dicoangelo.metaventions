#!/usr/bin/env tsx
/**
 * CLI Helper for Artifact Management
 *
 * This script allows creating and managing artifacts from the command line.
 * Artifacts are portfolio content pieces (projects, skills, experiences, etc.)
 * that are chunked and embedded for semantic search.
 *
 * Usage Examples:
 *
 * # Create from markdown file
 * ADMIN_PASSWORD=secret npx tsx scripts/create-artifact.ts \
 *   --file ./content/ace-deep-dive.md \
 *   --category project \
 *   --tags "multi-agent,consensus,typescript" \
 *   --publish
 *
 * # List all artifacts
 * ADMIN_PASSWORD=secret npx tsx scripts/create-artifact.ts --list
 *
 * # Get artifact by ID
 * ADMIN_PASSWORD=secret npx tsx scripts/create-artifact.ts --get <id>
 *
 * # Publish existing artifact
 * ADMIN_PASSWORD=secret npx tsx scripts/create-artifact.ts --publish-id <id>
 *
 * # Delete artifact
 * ADMIN_PASSWORD=secret npx tsx scripts/create-artifact.ts --delete <id>
 */

import { readFileSync, existsSync } from "fs";
import { join } from "path";

// ============================================================================
// Types
// ============================================================================

interface CreateArtifactPayload {
  title: string;
  slug: string;
  content: string;
  summary?: string;
  category: "project" | "skill" | "experience" | "faq" | "deep-dive";
  tags?: string[];
}

interface Artifact {
  id: string;
  title: string;
  slug: string;
  content: string;
  summary?: string;
  category: string;
  tags: string[];
  status: string;
  created_at: string;
  updated_at: string;
  published_at?: string;
}

// ============================================================================
// CLI Argument Parsing
// ============================================================================

interface CLIArgs {
  // Create options
  file?: string;
  title?: string;
  slug?: string;
  category?: string;
  tags?: string;
  summary?: string;
  publish?: boolean;

  // Other commands
  list?: boolean;
  get?: string;
  delete?: string;
  publishId?: string;

  // Config
  apiUrl?: string;
  help?: boolean;
}

function parseArgs(): CLIArgs {
  const args: CLIArgs = {};
  const argv = process.argv.slice(2);

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];

    switch (arg) {
      case "--file":
        args.file = argv[++i];
        break;
      case "--title":
        args.title = argv[++i];
        break;
      case "--slug":
        args.slug = argv[++i];
        break;
      case "--category":
        args.category = argv[++i];
        break;
      case "--tags":
        args.tags = argv[++i];
        break;
      case "--summary":
        args.summary = argv[++i];
        break;
      case "--publish":
        args.publish = true;
        break;
      case "--list":
        args.list = true;
        break;
      case "--get":
        args.get = argv[++i];
        break;
      case "--delete":
        args.delete = argv[++i];
        break;
      case "--publish-id":
        args.publishId = argv[++i];
        break;
      case "--api-url":
        args.apiUrl = argv[++i];
        break;
      case "--help":
      case "-h":
        args.help = true;
        break;
      default:
        console.error(`Unknown option: ${arg}`);
        process.exit(1);
    }
  }

  return args;
}

function showHelp() {
  console.log(`
Artifact Management CLI

Usage: npx tsx scripts/create-artifact.ts [options]

Create Options:
  --file <path>       Path to markdown file (required for create)
  --title <title>     Artifact title (optional, defaults to first # heading)
  --slug <slug>       URL slug (optional, auto-generated from title)
  --category <cat>    Category: project|skill|experience|faq|deep-dive (required)
  --tags <tags>       Comma-separated tags (optional)
  --summary <text>    Summary text (optional, auto-extracted from content)
  --publish           Publish immediately after creation (optional flag)

Other Commands:
  --list              List all artifacts
  --get <id>          Get artifact by ID
  --delete <id>       Delete artifact by ID
  --publish-id <id>   Publish existing artifact by ID

Configuration:
  --api-url <url>     API base URL (default: http://localhost:3000)
  --help, -h          Show this help message

Environment Variables:
  ADMIN_PASSWORD      Admin password for API authentication (required)

Examples:

  # Create and publish artifact from markdown
  ADMIN_PASSWORD=secret npx tsx scripts/create-artifact.ts \\
    --file ./content/ace-deep-dive.md \\
    --category project \\
    --tags "multi-agent,consensus,typescript" \\
    --publish

  # List all artifacts
  ADMIN_PASSWORD=secret npx tsx scripts/create-artifact.ts --list

  # Get specific artifact
  ADMIN_PASSWORD=secret npx tsx scripts/create-artifact.ts --get abc123

  # Publish existing artifact
  ADMIN_PASSWORD=secret npx tsx scripts/create-artifact.ts --publish-id abc123

  # Delete artifact
  ADMIN_PASSWORD=secret npx tsx scripts/create-artifact.ts --delete abc123
`);
}

// ============================================================================
// Utilities
// ============================================================================

/**
 * Generate URL-friendly slug from title
 */
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single
    .replace(/^-|-$/g, ""); // Remove leading/trailing hyphens
}

/**
 * Extract first # heading from markdown
 */
function extractTitle(markdown: string): string | null {
  const match = markdown.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : null;
}

/**
 * Extract summary from content (first paragraph or first 200 chars)
 */
function extractSummary(markdown: string): string {
  // Remove title
  const withoutTitle = markdown.replace(/^#\s+.+$/m, "").trim();

  // Find first paragraph (non-empty text before double newline)
  const paragraphMatch = withoutTitle.match(/^([^\n]+(?:\n(?!\n)[^\n]+)*)/m);

  if (paragraphMatch) {
    const paragraph = paragraphMatch[1].trim();
    // Limit to ~200 characters at word boundary
    if (paragraph.length > 200) {
      return paragraph.substring(0, 200).replace(/\s+\S*$/, "") + "...";
    }
    return paragraph;
  }

  // Fallback: first 200 characters
  return withoutTitle.substring(0, 200).trim() + "...";
}

/**
 * Make API request with auth header
 */
async function apiRequest(
  endpoint: string,
  options: RequestInit = {},
  apiUrl: string
): Promise<Response> {
  const password = process.env.ADMIN_PASSWORD;

  if (!password) {
    console.error("❌ Error: ADMIN_PASSWORD environment variable not set");
    process.exit(1);
  }

  const url = `${apiUrl}${endpoint}`;
  const headers = {
    Authorization: `Bearer ${password}`,
    "Content-Type": "application/json",
    ...options.headers,
  };

  return fetch(url, { ...options, headers });
}

// ============================================================================
// Commands
// ============================================================================

/**
 * Create artifact from markdown file
 */
async function createArtifact(args: CLIArgs, apiUrl: string): Promise<void> {
  const { file, category, tags, summary } = args;

  // Validation
  if (!file) {
    console.error("❌ Error: --file is required");
    process.exit(1);
  }

  if (!category) {
    console.error("❌ Error: --category is required");
    console.error(
      "   Valid categories: project, skill, experience, faq, deep-dive"
    );
    process.exit(1);
  }

  const validCategories = ["project", "skill", "experience", "faq", "deep-dive"];
  if (!validCategories.includes(category)) {
    console.error(`❌ Error: Invalid category "${category}"`);
    console.error(`   Valid categories: ${validCategories.join(", ")}`);
    process.exit(1);
  }

  // Resolve file path
  const filePath = file.startsWith("/") ? file : join(process.cwd(), file);

  if (!existsSync(filePath)) {
    console.error(`❌ Error: File not found: ${filePath}`);
    process.exit(1);
  }

  // Read content
  console.log(`📄 Reading ${filePath}...`);
  const content = readFileSync(filePath, "utf-8");

  // Extract or use provided title
  let title = args.title;
  if (!title) {
    const extractedTitle = extractTitle(content);
    if (!extractedTitle) {
      console.error(
        "❌ Error: Could not extract title from markdown. Please provide --title"
      );
      process.exit(1);
    }
    title = extractedTitle;
  }

  // Generate slug
  const slug = args.slug || generateSlug(title);

  // Extract or use provided summary
  const artifactSummary = summary || extractSummary(content);

  // Parse tags
  const artifactTags = tags ? tags.split(",").map((t) => t.trim()) : [];

  // Build payload
  const payload: CreateArtifactPayload = {
    title,
    slug,
    content,
    summary: artifactSummary,
    category: category as CreateArtifactPayload["category"],
    tags: artifactTags,
  };

  console.log("\n📦 Creating artifact:");
  console.log(`   Title: ${title}`);
  console.log(`   Slug: ${slug}`);
  console.log(`   Category: ${category}`);
  console.log(`   Tags: ${artifactTags.join(", ") || "(none)"}`);
  console.log(`   Summary: ${artifactSummary.substring(0, 80)}...`);
  console.log("");

  // Create artifact
  const response = await apiRequest("/api/artifacts", {
    method: "POST",
    body: JSON.stringify(payload),
  }, apiUrl);

  if (!response.ok) {
    const error = await response.text();
    console.error(`❌ Failed to create artifact: ${response.status}`);
    console.error(error);
    process.exit(1);
  }

  const artifact: Artifact = await response.json();
  console.log(`✅ Artifact created successfully!`);
  console.log(`   ID: ${artifact.id}`);
  console.log(`   Slug: ${artifact.slug}`);
  console.log(`   Status: ${artifact.status}`);

  // Publish if requested
  if (args.publish) {
    console.log("\n📤 Publishing artifact...");
    const publishResponse = await apiRequest(
      `/api/artifacts/${artifact.id}/publish`,
      { method: "POST" },
      apiUrl
    );

    if (!publishResponse.ok) {
      const error = await publishResponse.text();
      console.error(`❌ Failed to publish artifact: ${publishResponse.status}`);
      console.error(error);
      process.exit(1);
    }

    console.log(`✅ Artifact published successfully!`);
  }

  console.log(`\n🔗 View at: ${apiUrl.replace('/api', '')}/artifacts/${artifact.slug}`);
}

/**
 * List all artifacts
 */
async function listArtifacts(apiUrl: string): Promise<void> {
  console.log("📋 Fetching artifacts...\n");

  const response = await apiRequest("/api/artifacts", {}, apiUrl);

  if (!response.ok) {
    const error = await response.text();
    console.error(`❌ Failed to fetch artifacts: ${response.status}`);
    console.error(error);
    process.exit(1);
  }

  const artifacts: Artifact[] = await response.json();

  if (artifacts.length === 0) {
    console.log("No artifacts found.");
    return;
  }

  console.log(`Found ${artifacts.length} artifact(s):\n`);

  for (const artifact of artifacts) {
    const status = artifact.status === "published" ? "✅" : "📝";
    console.log(`${status} ${artifact.title}`);
    console.log(`   ID: ${artifact.id}`);
    console.log(`   Slug: ${artifact.slug}`);
    console.log(`   Category: ${artifact.category}`);
    console.log(`   Status: ${artifact.status}`);
    console.log(`   Tags: ${artifact.tags.join(", ") || "(none)"}`);
    console.log(`   Created: ${new Date(artifact.created_at).toLocaleDateString()}`);
    console.log("");
  }
}

/**
 * Get artifact by ID
 */
async function getArtifact(id: string, apiUrl: string): Promise<void> {
  console.log(`🔍 Fetching artifact ${id}...\n`);

  const response = await apiRequest(`/api/artifacts/${id}`, {}, apiUrl);

  if (!response.ok) {
    const error = await response.text();
    console.error(`❌ Failed to fetch artifact: ${response.status}`);
    console.error(error);
    process.exit(1);
  }

  const artifact: Artifact = await response.json();

  console.log(`📄 ${artifact.title}`);
  console.log(`   ID: ${artifact.id}`);
  console.log(`   Slug: ${artifact.slug}`);
  console.log(`   Category: ${artifact.category}`);
  console.log(`   Status: ${artifact.status}`);
  console.log(`   Tags: ${artifact.tags.join(", ") || "(none)"}`);
  console.log(`   Created: ${new Date(artifact.created_at).toLocaleString()}`);
  console.log(`   Updated: ${new Date(artifact.updated_at).toLocaleString()}`);
  if (artifact.published_at) {
    console.log(`   Published: ${new Date(artifact.published_at).toLocaleString()}`);
  }
  console.log("");
  console.log("Summary:");
  console.log(artifact.summary || "(no summary)");
  console.log("");
  console.log("Content Preview:");
  console.log(artifact.content.substring(0, 500));
  if (artifact.content.length > 500) {
    console.log(`\n... (${artifact.content.length - 500} more characters)`);
  }
}

/**
 * Delete artifact by ID
 */
async function deleteArtifact(id: string, apiUrl: string): Promise<void> {
  console.log(`🗑️  Deleting artifact ${id}...\n`);

  const response = await apiRequest(`/api/artifacts/${id}`, {
    method: "DELETE",
  }, apiUrl);

  if (!response.ok) {
    const error = await response.text();
    console.error(`❌ Failed to delete artifact: ${response.status}`);
    console.error(error);
    process.exit(1);
  }

  console.log("✅ Artifact deleted successfully!");
}

/**
 * Publish artifact by ID
 */
async function publishArtifact(id: string, apiUrl: string): Promise<void> {
  console.log(`📤 Publishing artifact ${id}...\n`);

  const response = await apiRequest(`/api/artifacts/${id}/publish`, {
    method: "POST",
  }, apiUrl);

  if (!response.ok) {
    const error = await response.text();
    console.error(`❌ Failed to publish artifact: ${response.status}`);
    console.error(error);
    process.exit(1);
  }

  console.log("✅ Artifact published successfully!");
}

// ============================================================================
// Main
// ============================================================================

async function main() {
  const args = parseArgs();

  if (args.help) {
    showHelp();
    return;
  }

  const apiUrl = args.apiUrl || "http://localhost:3000";

  // Route to appropriate command
  if (args.list) {
    await listArtifacts(apiUrl);
  } else if (args.get) {
    await getArtifact(args.get, apiUrl);
  } else if (args.delete) {
    await deleteArtifact(args.delete, apiUrl);
  } else if (args.publishId) {
    await publishArtifact(args.publishId, apiUrl);
  } else if (args.file) {
    await createArtifact(args, apiUrl);
  } else {
    console.error("❌ Error: No command specified");
    console.error("   Run with --help for usage information");
    process.exit(1);
  }
}

// Run
main().catch((error) => {
  console.error("❌ Unexpected error:", error.message);
  if (process.env.NODE_ENV === "development") {
    console.error(error.stack);
  }
  process.exit(1);
});
