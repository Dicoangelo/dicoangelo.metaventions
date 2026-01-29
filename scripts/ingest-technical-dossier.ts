/**
 * Ingest Technical Dossier into Supabase pgvector
 *
 * This script chunks TECHNICAL_DOSSIER.md and RECRUITER_QUICK_FACTS.md
 * and uploads them to Supabase with embeddings for semantic search.
 *
 * Usage: npx tsx scripts/ingest-technical-dossier.ts
 */

import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { createClient } from "@supabase/supabase-js";
import { CohereClient } from "cohere-ai";

// Load environment variables from .env.local
const envPath = join(process.cwd(), ".env.local");
if (existsSync(envPath)) {
  const envContent = readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match) {
      const [, key, value] = match;
      process.env[key.trim()] = value.trim();
    }
  }
}

// Initialize clients
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY!,
});

interface DossierChunk {
  content: string;
  heading: string | null;
  category: string;
  file_path: string;
  metadata: {
    technologies?: string[];
    metrics?: string[];
    companies?: string[];
  };
}

/**
 * Parse markdown file into chunks by heading
 */
function chunkMarkdown(content: string, filePath: string, category: string): DossierChunk[] {
  const chunks: DossierChunk[] = [];
  const lines = content.split("\n");

  let currentHeading: string | null = null;
  let currentContent: string[] = [];
  let currentMetadata: DossierChunk["metadata"] = {};

  const flushChunk = () => {
    if (currentContent.length > 0) {
      const content = currentContent.join("\n").trim();
      if (content.length > 30) {
        // Only add chunks with some content
        chunks.push({
          content,
          heading: currentHeading,
          category,
          file_path: filePath,
          metadata: { ...currentMetadata },
        });
      }
    }
    currentContent = [];
    currentMetadata = {};
  };

  for (const line of lines) {
    // Detect headings (# or ## or ###)
    const headingMatch = line.match(/^#{1,3}\s+(.+)$/);
    if (headingMatch) {
      // Flush previous chunk
      flushChunk();
      currentHeading = headingMatch[1];
      continue;
    }

    // Extract metadata from content
    if (line.includes("arXiv:")) {
      if (!currentMetadata.technologies) currentMetadata.technologies = [];
      const arxivMatch = line.match(/arXiv:([0-9.]+)/g);
      if (arxivMatch) {
        currentMetadata.technologies.push(...arxivMatch);
      }
    }

    // Extract company names
    const companies = ["Metaventions", "Contentsquare", "Rocket Mortgage", "DeepMind", "Anthropic", "OpenAI", "Google"];
    for (const company of companies) {
      if (line.includes(company)) {
        if (!currentMetadata.companies) currentMetadata.companies = [];
        if (!currentMetadata.companies.includes(company)) {
          currentMetadata.companies.push(company);
        }
      }
    }

    // Extract metrics
    const metricMatch = line.match(/\$(\d+[MK]?\+?)|(\d+[%KM]?\+?)/g);
    if (metricMatch) {
      if (!currentMetadata.metrics) currentMetadata.metrics = [];
      currentMetadata.metrics.push(...metricMatch);
    }

    currentContent.push(line);
  }

  // Flush final chunk
  flushChunk();

  return chunks;
}

/**
 * Generate embeddings for chunks (batched to respect Cohere's 96 text limit)
 */
async function generateEmbeddings(chunks: DossierChunk[]): Promise<number[][]> {
  console.log(`Generating embeddings for ${chunks.length} chunks...`);

  const texts = chunks.map((chunk) => {
    const heading = chunk.heading || "";
    const content = chunk.content;
    return `${heading}\n\n${content}`;
  });

  const BATCH_SIZE = 96;
  const allEmbeddings: number[][] = [];
  const totalBatches = Math.ceil(texts.length / BATCH_SIZE);

  let batchIndex = 0;
  while (batchIndex < totalBatches) {
    const start = batchIndex * BATCH_SIZE;
    const batch = texts.slice(start, start + BATCH_SIZE);
    const batchNum = batchIndex + 1;
    console.log(`   Processing batch ${batchNum}/${totalBatches} (${batch.length} texts)...`);

    try {
      const response = await cohere.embed({
        texts: batch,
        model: "embed-english-v3.0",
        inputType: "search_document",
        truncate: "END",
      });

      // Handle both array and object response types from Cohere
      const embeddings = response.embeddings;
      if (Array.isArray(embeddings)) {
        allEmbeddings.push(...embeddings);
      } else if ((embeddings as { float?: number[][] }).float) {
        allEmbeddings.push(...(embeddings as { float?: number[][] }).float!);
      } else {
        throw new Error("Unexpected embedding format from Cohere");
      }

      batchIndex++; // Move to next batch only on success

      // Longer delay to avoid rate limiting (Cohere trial: 100k tokens/min)
      if (batchIndex < totalBatches) {
        console.log(`   Waiting 5s to avoid rate limits...`);
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    } catch (error: any) {
      // Retry on rate limit with exponential backoff
      if (error?.statusCode === 429) {
        console.log(`   Rate limited! Waiting 65s before retry...`);
        await new Promise(resolve => setTimeout(resolve, 65000));
        // Don't increment batchIndex - retry same batch
        continue;
      }
      console.error(`Failed to generate embeddings for batch ${batchNum}:`, error);
      throw error;
    }
  }

  return allEmbeddings;
}

/**
 * Upload chunks to Supabase (clears existing data first)
 */
async function uploadChunks(chunks: DossierChunk[], embeddings: number[][]): Promise<void> {
  console.log(`Uploading ${chunks.length} chunks to Supabase...`);

  // Clear existing chunks first
  console.log("   Clearing existing chunks...");
  const { error: deleteError } = await supabase
    .from("career_dossier_chunks")
    .delete()
    .gte("id", 0); // Delete all rows

  if (deleteError) {
    console.error("Failed to clear existing chunks:", deleteError);
    // Continue anyway - might be empty table
  }

  const rows = chunks.map((chunk, i) => ({
    content: chunk.content,
    heading: chunk.heading,
    chunk_index: i,
    metadata: {
      ...chunk.metadata,
      category: chunk.category,
      file_path: chunk.file_path,
      source: "technical_dossier",
    },
    embedding: embeddings[i],
  }));

  const { error } = await supabase.from("career_dossier_chunks").insert(rows);

  if (error) {
    console.error("Failed to upload chunks:", error);
    throw error;
  }

  console.log(`✅ Successfully uploaded ${chunks.length} chunks`);
}

/**
 * Main ingestion function
 */
async function main() {
  console.log("🚀 Starting Technical Dossier ingestion...\n");

  // Read files
  const technicalDossierPath = join(process.cwd(), "public", "TECHNICAL_DOSSIER.md");
  const quickFactsPath = join(process.cwd(), "public", "RECRUITER_QUICK_FACTS.md");
  const repoDataPath = join(process.cwd(), "scripts", "repo-data", "all-repos.md");

  const technicalDossier = readFileSync(technicalDossierPath, "utf-8");
  const quickFacts = readFileSync(quickFactsPath, "utf-8");

  // Chunk files
  console.log("📄 Chunking TECHNICAL_DOSSIER.md...");
  const technicalChunks = chunkMarkdown(technicalDossier, "TECHNICAL_DOSSIER.md", "technical");
  console.log(`   → ${technicalChunks.length} chunks created\n`);

  console.log("📄 Chunking RECRUITER_QUICK_FACTS.md...");
  const quickFactsChunks = chunkMarkdown(quickFacts, "RECRUITER_QUICK_FACTS.md", "overview");
  console.log(`   → ${quickFactsChunks.length} chunks created\n`);

  // Chunk GitHub repos and scanned content
  let repoChunks: DossierChunk[] = [];
  const repoDataFiles = [
    { path: join(process.cwd(), "scripts", "repo-data", "all-repos.md"), category: "github_repos" },
    { path: join(process.cwd(), "scripts", "repo-data", "deep-scan.md"), category: "github_tech_stack" },
    { path: join(process.cwd(), "scripts", "repo-data", "docs-scan.md"), category: "github_docs" },
    { path: join(process.cwd(), "scripts", "repo-data", "key-files.md"), category: "github_source" },
    { path: join(process.cwd(), "scripts", "repo-data", "architecture-deep.md"), category: "architecture" },
    { path: join(process.cwd(), "scripts", "repo-data", "github-stats.md"), category: "github_stats" },
    { path: join(process.cwd(), "scripts", "repo-data", "tests-configs.md"), category: "configs" },
    { path: join(process.cwd(), "scripts", "repo-data", "source-code.md"), category: "source_code" },
  ];

  for (const { path, category } of repoDataFiles) {
    if (existsSync(path)) {
      const filename = path.split("/").pop() || path;
      console.log(`📄 Chunking ${filename}...`);
      const data = readFileSync(path, "utf-8");
      const chunks = chunkMarkdown(data, filename, category);
      console.log(`   → ${chunks.length} chunks created\n`);
      repoChunks.push(...chunks);
    }
  }

  const allChunks = [...technicalChunks, ...quickFactsChunks, ...repoChunks];

  // Generate embeddings
  const embeddings = await generateEmbeddings(allChunks);
  console.log(`✅ Generated ${embeddings.length} embeddings\n`);

  // Upload to Supabase
  await uploadChunks(allChunks, embeddings);

  console.log("\n✨ Technical Dossier ingestion complete!");
  console.log("\n📊 Summary:");
  console.log(`   Technical Dossier chunks: ${technicalChunks.length}`);
  console.log(`   Quick Facts chunks: ${quickFactsChunks.length}`);
  console.log(`   GitHub content chunks: ${repoChunks.length}`);
  console.log(`   ─────────────────────────`);
  console.log(`   Total chunks uploaded: ${allChunks.length}`);
}

// Run
main().catch((error) => {
  console.error("❌ Ingestion failed:", error);
  process.exit(1);
});
