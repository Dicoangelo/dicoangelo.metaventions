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

  for (let i = 0; i < texts.length; i += BATCH_SIZE) {
    const batch = texts.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(texts.length / BATCH_SIZE);
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

      // Small delay to avoid rate limiting
      if (i + BATCH_SIZE < texts.length) {
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    } catch (error) {
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

  // Chunk GitHub repos if available
  let repoChunks: DossierChunk[] = [];
  if (existsSync(repoDataPath)) {
    console.log("📄 Chunking GitHub repositories (all-repos.md)...");
    const repoData = readFileSync(repoDataPath, "utf-8");
    repoChunks = chunkMarkdown(repoData, "all-repos.md", "github_repos");
    console.log(`   → ${repoChunks.length} chunks created\n`);
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
  console.log(`   GitHub Repos chunks: ${repoChunks.length}`);
  console.log(`   Total chunks uploaded: ${allChunks.length}`);
}

// Run
main().catch((error) => {
  console.error("❌ Ingestion failed:", error);
  process.exit(1);
});
