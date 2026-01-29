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
 * Generate embeddings for chunks
 */
async function generateEmbeddings(chunks: DossierChunk[]): Promise<number[][]> {
  console.log(`Generating embeddings for ${chunks.length} chunks...`);

  const texts = chunks.map((chunk) => {
    const heading = chunk.heading || "";
    const content = chunk.content;
    return `${heading}\n\n${content}`;
  });

  try {
    const response = await cohere.embed({
      texts,
      model: "embed-english-v3.0",
      inputType: "search_document",
      truncate: "END",
    });

    // Handle both array and object response types from Cohere
    const embeddings = response.embeddings;
    if (Array.isArray(embeddings)) {
      return embeddings;
    } else if ((embeddings as { float?: number[][] }).float) {
      return (embeddings as { float?: number[][] }).float!;
    }

    throw new Error("Unexpected embedding format from Cohere");
  } catch (error) {
    console.error("Failed to generate embeddings:", error);
    throw error;
  }
}

/**
 * Upload chunks to Supabase
 */
async function uploadChunks(chunks: DossierChunk[], embeddings: number[][]): Promise<void> {
  console.log(`Uploading ${chunks.length} chunks to Supabase...`);

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

  const technicalDossier = readFileSync(technicalDossierPath, "utf-8");
  const quickFacts = readFileSync(quickFactsPath, "utf-8");

  // Chunk files
  console.log("📄 Chunking TECHNICAL_DOSSIER.md...");
  const technicalChunks = chunkMarkdown(technicalDossier, "TECHNICAL_DOSSIER.md", "technical");
  console.log(`   → ${technicalChunks.length} chunks created\n`);

  console.log("📄 Chunking RECRUITER_QUICK_FACTS.md...");
  const quickFactsChunks = chunkMarkdown(quickFacts, "RECRUITER_QUICK_FACTS.md", "overview");
  console.log(`   → ${quickFactsChunks.length} chunks created\n`);

  const allChunks = [...technicalChunks, ...quickFactsChunks];

  // Generate embeddings
  const embeddings = await generateEmbeddings(allChunks);
  console.log(`✅ Generated ${embeddings.length} embeddings\n`);

  // Upload to Supabase
  await uploadChunks(allChunks, embeddings);

  console.log("\n✨ Technical Dossier ingestion complete!");
  console.log("\n📊 Summary:");
  console.log(`   Technical Dossier chunks: ${technicalChunks.length}`);
  console.log(`   Quick Facts chunks: ${quickFactsChunks.length}`);
  console.log(`   Total chunks uploaded: ${allChunks.length}`);
}

// Run
main().catch((error) => {
  console.error("❌ Ingestion failed:", error);
  process.exit(1);
});
