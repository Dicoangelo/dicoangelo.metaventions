/**
 * US-003: Relevance Scoring for Memory Retention
 * Phase 8 - Adaptive Memory Lifecycle
 *
 * Calculates relevance scores for memories based on:
 * - Access frequency (weight: 0.4)
 * - Recency of access (weight: 0.3)
 * - Context match (weight: 0.3)
 */

import type { MemoryRecord } from './types';

/**
 * Individual factors contributing to relevance score
 */
export interface RelevanceFactors {
  accessFrequency: number;   // Weight: 0.4
  recency: number;           // Weight: 0.3
  contextMatch: number;      // Weight: 0.3
}

/**
 * Configuration for relevance scoring
 */
export interface RelevanceConfig {
  weights: {
    accessFrequency: number;
    recency: number;
    contextMatch: number;
  };
  lowRelevanceThreshold: number;  // Default: 0.2
  boostAmount: number;            // Default: 0.1
  recencyHalfLifeDays: number;    // Default: 7 (score halves every 7 days)
  maxAccessCountForNormalization: number; // Default: 100
}

const DEFAULT_CONFIG: RelevanceConfig = {
  weights: {
    accessFrequency: 0.4,
    recency: 0.3,
    contextMatch: 0.3,
  },
  lowRelevanceThreshold: 0.2,
  boostAmount: 0.1,
  recencyHalfLifeDays: 7,
  maxAccessCountForNormalization: 100,
};

/**
 * Scorer for calculating memory relevance based on multiple factors
 */
export class RelevanceScorer {
  private config: RelevanceConfig;

  constructor(config?: Partial<RelevanceConfig>) {
    this.config = {
      ...DEFAULT_CONFIG,
      ...config,
      weights: {
        ...DEFAULT_CONFIG.weights,
        ...config?.weights,
      },
    };

    // Ensure weights sum to 1.0
    const weightSum =
      this.config.weights.accessFrequency +
      this.config.weights.recency +
      this.config.weights.contextMatch;

    if (Math.abs(weightSum - 1.0) > 0.001) {
      // Normalize weights
      this.config.weights.accessFrequency /= weightSum;
      this.config.weights.recency /= weightSum;
      this.config.weights.contextMatch /= weightSum;
    }
  }

  /**
   * Calculate overall relevance score for a memory
   * @param memory - The memory record to score
   * @param currentContext - Optional current context for context matching
   * @returns Score between 0.0 and 1.0
   */
  calculateRelevance(memory: MemoryRecord, currentContext?: string): number {
    const now = Date.now();
    const daysSinceCreation = Math.max(1, (now - memory.createdAt) / (1000 * 60 * 60 * 24));

    const factors: RelevanceFactors = {
      accessFrequency: this.calculateAccessFrequencyScore(
        memory.accessCount,
        daysSinceCreation
      ),
      recency: this.calculateRecencyScore(
        memory.lastAccessedAt,
        now
      ),
      contextMatch: this.calculateContextMatchScore(
        memory.context,
        currentContext
      ),
    };

    const score =
      factors.accessFrequency * this.config.weights.accessFrequency +
      factors.recency * this.config.weights.recency +
      factors.contextMatch * this.config.weights.contextMatch;

    // Clamp to [0, 1]
    return Math.max(0, Math.min(1, score));
  }

  /**
   * Calculate access frequency score using logarithmic normalization
   * More accesses = higher score, with diminishing returns
   * @param accessCount - Number of times memory has been accessed
   * @param daysSinceCreation - Days since memory was created
   * @returns Score between 0.0 and 1.0
   */
  private calculateAccessFrequencyScore(
    accessCount: number,
    daysSinceCreation: number
  ): number {
    if (accessCount <= 0) return 0;

    // Calculate access rate (accesses per day)
    const accessRate = accessCount / daysSinceCreation;

    // Log scale normalization with diminishing returns
    // Using log1p to handle small values gracefully
    const normalizedCount = Math.log1p(accessCount) / Math.log1p(this.config.maxAccessCountForNormalization);

    // Bonus for consistent access rate (at least 0.5 accesses per day)
    const consistencyBonus = accessRate >= 0.5 ? 0.1 : 0;

    return Math.min(1, normalizedCount + consistencyBonus);
  }

  /**
   * Calculate recency score using exponential decay
   * Recent access = higher score
   * @param lastAccessedAt - Timestamp of last access
   * @param currentTime - Current timestamp
   * @returns Score between 0.0 and 1.0
   */
  private calculateRecencyScore(
    lastAccessedAt: number,
    currentTime: number
  ): number {
    const daysSinceAccess = (currentTime - lastAccessedAt) / (1000 * 60 * 60 * 24);

    if (daysSinceAccess <= 0) return 1.0;

    // Exponential decay: score = 0.5^(days / halfLife)
    const halfLife = this.config.recencyHalfLifeDays;
    const decayFactor = Math.pow(0.5, daysSinceAccess / halfLife);

    return decayFactor;
  }

  /**
   * Calculate context match score using keyword overlap (TF-IDF style)
   * @param memoryContext - Context string stored with the memory
   * @param currentContext - Current context to match against
   * @returns Score between 0.0 and 1.0
   */
  private calculateContextMatchScore(
    memoryContext: string | undefined,
    currentContext: string | undefined
  ): number {
    // If no contexts provided, return neutral score
    if (!memoryContext || !currentContext) {
      return 0.5;
    }

    // Tokenize and normalize
    const memoryTokens = this.tokenize(memoryContext);
    const currentTokens = this.tokenize(currentContext);

    if (memoryTokens.size === 0 || currentTokens.size === 0) {
      return 0.5;
    }

    // Calculate Jaccard similarity with TF weighting
    const intersection = new Set<string>();
    const union = new Set<string>([...memoryTokens, ...currentTokens]);

    for (const token of memoryTokens) {
      if (currentTokens.has(token)) {
        intersection.add(token);
      }
    }

    // Jaccard similarity
    const jaccardScore = intersection.size / union.size;

    // Apply inverse document frequency bonus for rare matching terms
    // (simplified: longer words are treated as more significant)
    let idfBonus = 0;
    for (const token of intersection) {
      if (token.length >= 6) {
        idfBonus += 0.05; // Bonus for longer/more specific terms
      }
    }

    return Math.min(1, jaccardScore + idfBonus);
  }

  /**
   * Tokenize text into normalized word set
   */
  private tokenize(text: string): Set<string> {
    return new Set(
      text
        .toLowerCase()
        .replace(/[^\w\s]/g, ' ')
        .split(/\s+/)
        .filter(word => word.length >= 3) // Filter short words
        .map(word => word.trim())
    );
  }

  /**
   * Boost relevance score when memory is accessed
   * @param memory - Memory being accessed
   * @param currentContext - Optional current context
   * @returns New relevance score after boost
   */
  onAccess(memory: MemoryRecord, currentContext?: string): number {
    // Calculate base relevance
    const baseRelevance = this.calculateRelevance(memory, currentContext);

    // Apply boost with diminishing returns near 1.0
    const headroom = 1.0 - baseRelevance;
    const actualBoost = this.config.boostAmount * headroom;

    const boostedScore = Math.min(1.0, baseRelevance + actualBoost);

    return boostedScore;
  }

  /**
   * Check if a memory is below the low relevance threshold
   * @param memory - Memory to check
   * @returns True if memory is candidate for pruning
   */
  isLowRelevance(memory: MemoryRecord): boolean {
    // Use stored relevance score if available and recent
    if (memory.relevanceScore !== undefined) {
      return memory.relevanceScore < this.config.lowRelevanceThreshold;
    }

    // Calculate fresh score
    const score = this.calculateRelevance(memory);
    return score < this.config.lowRelevanceThreshold;
  }

  /**
   * Get all memories below the low relevance threshold
   * @param memories - Array of memories to filter
   * @returns Memories flagged for potential pruning
   */
  getLowRelevanceMemories(memories: MemoryRecord[]): MemoryRecord[] {
    return memories.filter(memory => this.isLowRelevance(memory));
  }

  /**
   * Rank memories by relevance score (highest first)
   * @param memories - Memories to rank
   * @param currentContext - Optional context for scoring
   * @returns Sorted array with most relevant memories first
   */
  rankByRelevance(
    memories: MemoryRecord[],
    currentContext?: string
  ): MemoryRecord[] {
    return [...memories].sort((a, b) => {
      const scoreA = this.calculateRelevance(a, currentContext);
      const scoreB = this.calculateRelevance(b, currentContext);
      return scoreB - scoreA; // Descending order
    });
  }

  /**
   * Get the current configuration
   */
  getConfig(): Readonly<RelevanceConfig> {
    return { ...this.config };
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<RelevanceConfig>): void {
    this.config = {
      ...this.config,
      ...newConfig,
      weights: {
        ...this.config.weights,
        ...newConfig?.weights,
      },
    };
  }
}

// Export singleton instance with default configuration
export const relevanceScorer = new RelevanceScorer();
