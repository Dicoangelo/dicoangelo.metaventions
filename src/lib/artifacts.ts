/**
 * Artifacts RAG Service
 *
 * Manages portfolio artifacts with semantic search capabilities.
 * Uses Cohere for embeddings/reranking and Supabase pgvector for similarity search.
 */

import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { CohereClient } from "cohere-ai";
import { chunkMarkdown, Chunk } from "./chunker";
import { rerankChunks, shouldRerank, RerankableChunk } from "./reranker";

// Initialize clients lazily to avoid build-time errors
let supabase: SupabaseClient | null = null;
let cohere: CohereClient | null = null;

function getSupabase(): SupabaseClient | null {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
    return null;
  }
  if (!supabase) {
    supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
  }
  return supabase;
}

function getCohere(): CohereClient | null {
  if (!process.env.COHERE_API_KEY) {
    return null;
  }
  if (!cohere) {
    cohere = new CohereClient({ token: process.env.COHERE_API_KEY });
  }
  return cohere;
}

// ==================== Types ====================

export interface Artifact {
  id: string;
  title: string;
  slug: string;
  content: string;
  summary: string | null;
  category: "project" | "skill" | "experience" | "faq" | "deep-dive";
  tags: string[];
  related_artifacts: string[];
  external_links: Record<string, string>;
  metrics: Record<string, string>;
  status: "draft" | "published" | "archived";
  version: number;
  created_at: string;
  updated_at: string;
  published_at: string | null;
}

export interface ArtifactChunk extends RerankableChunk {
  artifact_id: string;
  heading: string | null;
  chunk_index: number;
  token_count: number | null;
  chunk_type: string | null;
  technologies: string[];
  companies: string[];
  papers: string[];
  skills: string[];
  similarity?: number;
  // From join
  artifact_title?: string;
  artifact_slug?: string;
}

export interface CreateArtifactInput {
  title: string;
  slug: string;
  content: string;
  summary?: string;
  category: Artifact["category"];
  tags?: string[];
  external_links?: Record<string, string>;
  metrics?: Record<string, string>;
}

export interface SearchArtifactsOptions {
  threshold?: number; // default: 0.15
  limit?: number; // default: 20
  category?: string;
  tags?: string[];
  rerank?: boolean; // default: true
  rerankTopK?: number; // default: 5
}

// ==================== Helper Functions ====================

/**
 * Generate embeddings for chunks using Cohere
 * Processes in batches of 96 (Cohere's max batch size)
 */
async function generateEmbeddings(
  chunks: Chunk[]
): Promise<number[][] | null> {
  const cohereClient = getCohere();

  if (!cohereClient || chunks.length === 0) {
    console.warn("Cannot generate embeddings: missing COHERE_API_KEY");
    return null;
  }

  try {
    const BATCH_SIZE = 96;
    const allEmbeddings: number[][] = [];

    // Process in batches
    for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
      const batch = chunks.slice(i, i + BATCH_SIZE);
      const texts = batch.map((chunk) => chunk.content);

      console.log(
        `[Artifacts] Generating embeddings for chunks ${i + 1}-${i + batch.length}`
      );

      const response = await cohereClient.embed({
        texts,
        model: "embed-english-v3.0",
        inputType: "search_document",
        truncate: "END",
      });

      // Handle both array and object response types from Cohere
      const embeddings = response.embeddings;
      const batchEmbeddings = Array.isArray(embeddings)
        ? embeddings
        : (embeddings as { float?: number[][] }).float || [];

      allEmbeddings.push(...batchEmbeddings);
    }

    return allEmbeddings;
  } catch (error) {
    console.error("Failed to generate embeddings:", error);
    return null;
  }
}

/**
 * Insert artifact chunks with embeddings into database
 */
async function insertChunks(
  artifactId: string,
  chunks: Chunk[]
): Promise<void> {
  const supabaseClient = getSupabase();

  if (!supabaseClient) {
    throw new Error("Supabase client unavailable");
  }

  // Generate embeddings
  const embeddings = await generateEmbeddings(chunks);

  if (!embeddings || embeddings.length !== chunks.length) {
    throw new Error("Failed to generate embeddings for all chunks");
  }

  // Prepare chunk rows
  const rows = chunks.map((chunk, index) => ({
    artifact_id: artifactId,
    content: chunk.content,
    heading: chunk.heading || null,
    chunk_index: chunk.chunkIndex,
    token_count: chunk.tokenCount,
    chunk_type: chunk.chunkType,
    technologies: chunk.metadata.technologies,
    companies: chunk.metadata.companies,
    papers: chunk.metadata.papers,
    skills: chunk.metadata.skills,
    embedding: embeddings[index],
  }));

  // Insert in batches of 100 (Supabase recommended batch size)
  const BATCH_SIZE = 100;
  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE);

    const { error } = await supabaseClient
      .from("artifact_chunks")
      .insert(batch);

    if (error) {
      throw new Error(`Failed to insert chunks: ${error.message}`);
    }

    console.log(
      `[Artifacts] Inserted chunks ${i + 1}-${i + batch.length} for artifact ${artifactId}`
    );
  }
}

/**
 * Delete all chunks for an artifact
 */
async function deleteChunks(artifactId: string): Promise<void> {
  const supabaseClient = getSupabase();

  if (!supabaseClient) {
    throw new Error("Supabase client unavailable");
  }

  const { error } = await supabaseClient
    .from("artifact_chunks")
    .delete()
    .eq("artifact_id", artifactId);

  if (error) {
    throw new Error(`Failed to delete chunks: ${error.message}`);
  }

  console.log(`[Artifacts] Deleted chunks for artifact ${artifactId}`);
}

// ==================== Public API ====================

/**
 * Create a new artifact with chunking and embedding
 */
export async function createArtifact(
  input: CreateArtifactInput
): Promise<Artifact> {
  const supabaseClient = getSupabase();

  if (!supabaseClient) {
    throw new Error("Supabase client unavailable");
  }

  console.log(`[Artifacts] Creating artifact: ${input.title}`);

  // Insert artifact
  const { data: artifact, error: insertError } = await supabaseClient
    .from("artifacts")
    .insert({
      title: input.title,
      slug: input.slug,
      content: input.content,
      summary: input.summary || null,
      category: input.category,
      tags: input.tags || [],
      related_artifacts: [],
      external_links: input.external_links || {},
      metrics: input.metrics || {},
      status: "draft",
      version: 1,
    })
    .select()
    .single();

  if (insertError || !artifact) {
    throw new Error(`Failed to create artifact: ${insertError?.message}`);
  }

  console.log(`[Artifacts] Created artifact ${artifact.id}, now chunking...`);

  // Chunk the content
  const chunks = chunkMarkdown(input.content, {
    maxTokens: 350,
    minTokens: 50,
    preserveHeading: true,
    extractMetadata: true,
  });

  console.log(`[Artifacts] Generated ${chunks.length} chunks`);

  // Insert chunks with embeddings
  if (chunks.length > 0) {
    await insertChunks(artifact.id, chunks);
  }

  console.log(`[Artifacts] Successfully created artifact ${artifact.id}`);

  return artifact as Artifact;
}

/**
 * Update an existing artifact
 */
export async function updateArtifact(
  id: string,
  input: Partial<CreateArtifactInput>
): Promise<Artifact> {
  const supabaseClient = getSupabase();

  if (!supabaseClient) {
    throw new Error("Supabase client unavailable");
  }

  console.log(`[Artifacts] Updating artifact ${id}`);

  // Get current artifact to check version
  const { data: current, error: fetchError } = await supabaseClient
    .from("artifacts")
    .select("version, content")
    .eq("id", id)
    .single();

  if (fetchError || !current) {
    throw new Error(`Artifact not found: ${id}`);
  }

  const contentChanged = input.content && input.content !== current.content;

  // Update artifact
  const { data: artifact, error: updateError } = await supabaseClient
    .from("artifacts")
    .update({
      ...input,
      version: current.version + 1,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (updateError || !artifact) {
    throw new Error(`Failed to update artifact: ${updateError?.message}`);
  }

  // If content changed, re-chunk and re-embed
  if (contentChanged && input.content) {
    console.log(`[Artifacts] Content changed, re-chunking...`);

    // Delete old chunks
    await deleteChunks(id);

    // Generate new chunks
    const chunks = chunkMarkdown(input.content, {
      maxTokens: 350,
      minTokens: 50,
      preserveHeading: true,
      extractMetadata: true,
    });

    console.log(`[Artifacts] Generated ${chunks.length} new chunks`);

    // Insert new chunks
    if (chunks.length > 0) {
      await insertChunks(id, chunks);
    }
  }

  console.log(`[Artifacts] Successfully updated artifact ${id}`);

  return artifact as Artifact;
}

/**
 * Publish an artifact
 */
export async function publishArtifact(id: string): Promise<Artifact> {
  const supabaseClient = getSupabase();

  if (!supabaseClient) {
    throw new Error("Supabase client unavailable");
  }

  console.log(`[Artifacts] Publishing artifact ${id}`);

  const { data: artifact, error } = await supabaseClient
    .from("artifacts")
    .update({
      status: "published",
      published_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error || !artifact) {
    throw new Error(`Failed to publish artifact: ${error?.message}`);
  }

  console.log(`[Artifacts] Successfully published artifact ${id}`);

  return artifact as Artifact;
}

/**
 * Delete an artifact (cascades to chunks)
 */
export async function deleteArtifact(id: string): Promise<void> {
  const supabaseClient = getSupabase();

  if (!supabaseClient) {
    throw new Error("Supabase client unavailable");
  }

  console.log(`[Artifacts] Deleting artifact ${id}`);

  const { error } = await supabaseClient
    .from("artifacts")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(`Failed to delete artifact: ${error.message}`);
  }

  console.log(`[Artifacts] Successfully deleted artifact ${id}`);
}

/**
 * Get a single artifact by ID
 */
export async function getArtifact(id: string): Promise<Artifact | null> {
  const supabaseClient = getSupabase();

  if (!supabaseClient) {
    throw new Error("Supabase client unavailable");
  }

  const { data, error } = await supabaseClient
    .from("artifacts")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      // Not found
      return null;
    }
    throw new Error(`Failed to fetch artifact: ${error.message}`);
  }

  return data as Artifact;
}

/**
 * Get a single artifact by slug
 */
export async function getArtifactBySlug(slug: string): Promise<Artifact | null> {
  const supabaseClient = getSupabase();

  if (!supabaseClient) {
    throw new Error("Supabase client unavailable");
  }

  const { data, error } = await supabaseClient
    .from("artifacts")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      // Not found
      return null;
    }
    throw new Error(`Failed to fetch artifact: ${error.message}`);
  }

  return data as Artifact;
}

/**
 * List artifacts with optional filtering
 */
export async function listArtifacts(options?: {
  status?: string;
  category?: string;
}): Promise<Artifact[]> {
  const supabaseClient = getSupabase();

  if (!supabaseClient) {
    throw new Error("Supabase client unavailable");
  }

  let query = supabaseClient
    .from("artifacts")
    .select("*")
    .order("created_at", { ascending: false });

  if (options?.status) {
    query = query.eq("status", options.status);
  }

  if (options?.category) {
    query = query.eq("category", options.category);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to list artifacts: ${error.message}`);
  }

  return (data || []) as Artifact[];
}

/**
 * Search artifacts using semantic similarity
 */
export async function searchArtifacts(
  query: string,
  options: SearchArtifactsOptions = {}
): Promise<ArtifactChunk[]> {
  const {
    threshold = 0.15,
    limit = 20,
    category,
    tags,
    rerank = true,
    rerankTopK = 5,
  } = options;

  const supabaseClient = getSupabase();
  const cohereClient = getCohere();

  if (!supabaseClient || !cohereClient) {
    console.warn(
      "Artifact search unavailable: missing SUPABASE or COHERE credentials"
    );
    return [];
  }

  try {
    console.log(`[Artifacts] Searching for: "${query}"`);

    // Generate query embedding with Cohere
    const embedResponse = await cohereClient.embed({
      texts: [query],
      model: "embed-english-v3.0",
      inputType: "search_query",
      truncate: "END",
    });

    // Handle both array and object response types from Cohere
    const embeddings = embedResponse.embeddings;
    const queryEmbedding = Array.isArray(embeddings)
      ? embeddings[0]
      : (embeddings as { float?: number[][] }).float?.[0] || [];

    // Search Supabase using the match_artifact_chunks RPC function
    const { data, error } = await supabaseClient.rpc("match_artifact_chunks", {
      query_embedding: queryEmbedding,
      match_threshold: threshold,
      match_count: limit,
    });

    if (error) {
      console.error("Artifact search error:", error);
      return [];
    }

    let results = data as ArtifactChunk[];

    // Apply category filter if specified
    if (category && results.length > 0) {
      // Need to join with artifacts table to filter by category
      const artifactIds = [...new Set(results.map((r) => r.artifact_id))];
      const { data: artifacts } = await supabaseClient
        .from("artifacts")
        .select("id")
        .eq("category", category)
        .in("id", artifactIds);

      if (artifacts) {
        const filteredIds = new Set(artifacts.map((a) => a.id));
        results = results.filter((r) => filteredIds.has(r.artifact_id));
      }
    }

    // Apply tags filter if specified
    if (tags && tags.length > 0 && results.length > 0) {
      const artifactIds = [...new Set(results.map((r) => r.artifact_id))];
      const { data: artifacts } = await supabaseClient
        .from("artifacts")
        .select("id, tags")
        .in("id", artifactIds);

      if (artifacts) {
        const filteredIds = new Set(
          artifacts
            .filter((a) => tags.some((tag) => a.tags.includes(tag)))
            .map((a) => a.id)
        );
        results = results.filter((r) => filteredIds.has(r.artifact_id));
      }
    }

    console.log(`[Artifacts] Found ${results.length} matching chunks`);

    // Rerank if enabled and worthwhile
    if (rerank && shouldRerank(results.length)) {
      console.log(`[Artifacts] Reranking top ${rerankTopK} chunks...`);

      const reranked = await rerankChunks<ArtifactChunk>(query, results, {
        topK: rerankTopK,
        threshold: 0.0,
      });

      // Map back to ArtifactChunk[] with reranked order
      return reranked.map((r) => ({
        ...r.chunk,
        similarity: r.relevanceScore,
      } as ArtifactChunk));
    }

    return results;
  } catch (error) {
    console.error("Artifact search failed:", error);
    return [];
  }
}

/**
 * Format artifact chunks into context for LLM
 */
export function formatArtifactContext(chunks: ArtifactChunk[]): string {
  if (chunks.length === 0) {
    return "";
  }

  const sections = chunks.map((chunk, i) => {
    const artifactTitle = chunk.artifact_title || "Unknown Artifact";
    const heading = chunk.heading || `Section ${i + 1}`;
    const header = `### ${heading}`;
    const source = `[Artifact: ${artifactTitle}${chunk.artifact_slug ? ` (/${chunk.artifact_slug})` : ""}]`;
    const relevance = chunk.similarity
      ? `Relevance: ${(chunk.similarity * 100).toFixed(0)}%`
      : "";

    let content = chunk.content;

    // Add metadata if available
    const meta: string[] = [];
    if (chunk.technologies?.length) {
      meta.push(`Technologies: ${chunk.technologies.join(", ")}`);
    }
    if (chunk.skills?.length) {
      meta.push(`Skills: ${chunk.skills.join(", ")}`);
    }
    if (chunk.companies?.length) {
      meta.push(`Companies: ${chunk.companies.join(", ")}`);
    }
    if (chunk.papers?.length) {
      meta.push(`Papers: ${chunk.papers.join(", ")}`);
    }

    const metaLine = meta.length ? `\n\n${meta.join(" | ")}` : "";

    return `${header}\n${source}${relevance ? " | " + relevance : ""}\n\n${content}${metaLine}`;
  });

  return `## Retrieved Context from Artifacts\n\nThe following information was retrieved from portfolio artifacts based on the query:\n\n${sections.join("\n\n---\n\n")}`;
}

/**
 * Get relevant artifact context for a query
 */
export async function getArtifactContext(
  query: string,
  options?: SearchArtifactsOptions
): Promise<string> {
  const chunks = await searchArtifacts(query, {
    threshold: 0.15,
    limit: 20,
    rerank: true,
    rerankTopK: 5,
    ...options,
  });

  return formatArtifactContext(chunks);
}
