/**
 * Cohere Reranker Module
 *
 * Provides semantic reranking of text chunks using Cohere's rerank API.
 * Works with any chunk type (artifact_chunks, dossier_chunks, etc.)
 */

import { CohereClient } from "cohere-ai";

// Initialize client lazily to avoid build-time errors
let cohere: CohereClient | null = null;

function getCohere(): CohereClient | null {
  if (!process.env.COHERE_API_KEY) {
    return null;
  }
  if (!cohere) {
    cohere = new CohereClient({ token: process.env.COHERE_API_KEY });
  }
  return cohere;
}

/**
 * Generic chunk interface for reranking
 */
export interface RerankableChunk {
  id: string;
  content: string;
  [key: string]: unknown; // Allow additional properties
}

/**
 * Configuration options for reranking
 */
export interface RerankOptions {
  topK?: number; // default: 5
  threshold?: number; // default: 0.0 (no filtering)
  model?: string; // default: 'rerank-v3.5'
}

/**
 * Reranking result with relevance score
 */
export interface RerankResult<T extends RerankableChunk> {
  chunk: T;
  relevanceScore: number;
  index: number;
}

/**
 * Rerank chunks based on query relevance using Cohere
 *
 * @param query - The search query to rerank against
 * @param chunks - Array of chunks to rerank
 * @param options - Optional configuration
 * @returns Reranked chunks sorted by relevance score (descending)
 *
 * @example
 * ```typescript
 * const chunks = await searchDossier(query);
 * const reranked = await rerankChunks(query, chunks, { topK: 5, threshold: 0.3 });
 * const topChunks = reranked.map(r => r.chunk);
 * ```
 */
export async function rerankChunks<T extends RerankableChunk>(
  query: string,
  chunks: T[],
  options: RerankOptions = {}
): Promise<RerankResult<T>[]> {
  const { topK = 5, threshold = 0.0, model = "rerank-v3.5" } = options;

  const cohereClient = getCohere();

  // If Cohere is unavailable or no chunks to rerank, return original order with score 0
  if (!cohereClient || chunks.length === 0) {
    if (!cohereClient) {
      console.warn("Reranking unavailable: missing COHERE_API_KEY");
    }
    return chunks.map((chunk, index) => ({
      chunk,
      relevanceScore: 0,
      index,
    }));
  }

  const startTime = performance.now();

  try {
    // Extract document texts from chunks
    const documents = chunks.map((chunk) => chunk.content);

    // Call Cohere rerank API
    const response = await cohereClient.rerank({
      model,
      query,
      documents,
      topN: Math.min(topK, chunks.length), // Don't request more than we have
    });

    const endTime = performance.now();
    const duration = (endTime - startTime).toFixed(0);

    // Map Cohere results back to original chunks
    const results: RerankResult<T>[] = response.results.map((result) => ({
      chunk: chunks[result.index],
      relevanceScore: result.relevanceScore,
      index: result.index,
    }));

    // Filter by threshold if specified
    const filtered =
      threshold > 0
        ? results.filter((r) => r.relevanceScore >= threshold)
        : results;

    // Log metrics
    console.log(
      `[Reranker] Input: ${chunks.length} chunks | Output: ${filtered.length} chunks | Time: ${duration}ms | Model: ${model}`
    );

    return filtered;
  } catch (error) {
    console.error("Reranking failed, returning original order:", error);

    // Graceful degradation: return original chunks with score 0
    return chunks.map((chunk, index) => ({
      chunk,
      relevanceScore: 0,
      index,
    }));
  }
}

/**
 * Determine if reranking is worthwhile for a given chunk count
 *
 * @param chunkCount - Number of chunks to potentially rerank
 * @returns true if reranking would be beneficial (> 3 chunks)
 *
 * @example
 * ```typescript
 * if (shouldRerank(chunks.length)) {
 *   chunks = await rerankChunks(query, chunks);
 * }
 * ```
 */
export function shouldRerank(chunkCount: number): boolean {
  return chunkCount > 3;
}
