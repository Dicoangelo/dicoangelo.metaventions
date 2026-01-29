/**
 * Career Dossier RAG Service
 *
 * Retrieves relevant context from the career dossier using semantic search.
 * Uses Cohere for query embeddings and Supabase pgvector for similarity search.
 */

import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { CohereClient } from "cohere-ai";

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

interface DossierChunk {
  id: string;
  content: string;
  heading: string | null;
  category: string;
  file_path: string;
  similarity: number;
  metadata: {
    technologies?: string[];
    metrics?: string[];
    companies?: string[];
  };
}

/**
 * Search the career dossier for relevant chunks
 */
export async function searchDossier(
  query: string,
  options: {
    threshold?: number;
    limit?: number;
    category?: string;
  } = {}
): Promise<DossierChunk[]> {
  const { threshold = 0.3, limit = 8, category } = options;

  const supabaseClient = getSupabase();
  const cohereClient = getCohere();

  if (!supabaseClient || !cohereClient) {
    console.warn("Dossier search unavailable: missing SUPABASE or COHERE credentials");
    return [];
  }

  try {
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

    // Search Supabase using the match_dossier_chunks RPC function
    const { data, error } = await supabaseClient.rpc("match_dossier_chunks", {
      query_embedding: queryEmbedding,
      match_threshold: threshold,
      match_count: limit,
    });

    if (error) {
      console.error("Dossier search error:", error);
      return [];
    }

    let results = data as DossierChunk[];

    // Apply category filter if specified
    if (category) {
      results = results.filter((r) => r.category === category);
    }

    return results;
  } catch (error) {
    console.error("Dossier search failed:", error);
    return [];
  }
}

/**
 * Format dossier chunks into context for the LLM
 */
export function formatDossierContext(chunks: DossierChunk[]): string {
  if (chunks.length === 0) {
    return "";
  }

  const sections = chunks.map((chunk, i) => {
    const header = chunk.heading ? `### ${chunk.heading}` : `### Section ${i + 1}`;
    const source = `[Source: ${chunk.category}/${chunk.file_path}]`;
    const relevance = `Relevance: ${(chunk.similarity * 100).toFixed(0)}%`;

    let content = chunk.content;

    // Add metadata if available
    const meta: string[] = [];
    if (chunk.metadata?.technologies?.length) {
      meta.push(`Technologies: ${chunk.metadata.technologies.join(", ")}`);
    }
    if (chunk.metadata?.metrics?.length) {
      meta.push(`Key metrics: ${chunk.metadata.metrics.join(", ")}`);
    }

    return `${header}\n${source} | ${relevance}\n\n${content}${meta.length ? "\n\n" + meta.join(" | ") : ""}`;
  });

  return `## Retrieved Context from Career Dossier\n\nThe following information was retrieved from Dico Angelo's comprehensive career dossier based on the user's question:\n\n${sections.join("\n\n---\n\n")}`;
}

/**
 * Get relevant context for a chat query
 */
export async function getDossierContext(query: string): Promise<string> {
  const chunks = await searchDossier(query, {
    threshold: 0.15,  // Lower threshold to catch more relevant content
    limit: 10,        // More chunks for richer context
  });

  return formatDossierContext(chunks);
}
