/**
 * US-004: Memory Consolidation Pipeline
 * Phase 8 - Adaptive Memory Lifecycle
 *
 * Processes memories through lifecycle phases:
 * - FORMATION: New memories with initial decay and relevance
 * - EVOLUTION: Strengthened through repeated access, consolidated with related memories
 * - RETRIEVAL: Mature memories optimized for fast recall
 *
 * Transition thresholds (from PRD):
 * - Formation -> Evolution: accessCount >= 3 AND decayScore >= 0.7
 * - Evolution -> Retrieval: accessCount >= 10 AND relevanceScore >= 0.8
 */

import {
  MemoryRecord,
  MemoryPhase,
  MemoryType,
} from './types';
import { RelevanceScorer, relevanceScorer } from './relevance';
import { MemoryDecayManager, decayManager } from './decay';

/**
 * Phase transition thresholds for the consolidation pipeline
 */
export const CONSOLIDATION_THRESHOLDS = {
  /** Formation -> Evolution: minimum access count */
  formationAccessCount: 3,
  /** Formation -> Evolution: minimum decay score */
  formationDecayScore: 0.7,
  /** Evolution -> Retrieval: minimum access count */
  evolutionAccessCount: 10,
  /** Evolution -> Retrieval: minimum relevance score */
  evolutionRelevanceScore: 0.8,
  /** Context similarity threshold for memory consolidation */
  contextSimilarityThreshold: 0.6,
} as const;

/**
 * Result of a phase transition check
 */
export interface TransitionCheckResult {
  /** Whether the memory is ready to transition */
  ready: boolean;
  /** Current phase of the memory */
  currentPhase: MemoryPhase;
  /** Target phase if ready, null if not */
  targetPhase: MemoryPhase | null;
  /** Reasons why the memory is or isn't ready */
  reasons: string[];
}

/**
 * Result of memory consolidation
 */
export interface ConsolidationResult {
  /** The consolidated memory record */
  memory: MemoryRecord;
  /** Whether consolidation occurred */
  consolidated: boolean;
  /** IDs of memories that were merged into this one */
  mergedMemoryIds: string[];
  /** Combined context from merged memories */
  mergedContext: string | null;
}

/**
 * Configuration for the consolidation pipeline
 */
export interface ConsolidationConfig {
  thresholds: typeof CONSOLIDATION_THRESHOLDS;
  relevanceScorer: RelevanceScorer;
  decayManager: MemoryDecayManager;
}

const DEFAULT_CONFIG: ConsolidationConfig = {
  thresholds: CONSOLIDATION_THRESHOLDS,
  relevanceScorer: relevanceScorer,
  decayManager: decayManager,
};

/**
 * ConsolidationPipeline processes memories through their lifecycle phases.
 *
 * Phase transitions:
 * - FORMATION -> EVOLUTION: When memory is accessed enough times with good retention
 * - EVOLUTION -> RETRIEVAL: When memory is mature and highly relevant
 *
 * Consolidation merges related memories to strengthen associations.
 */
export class ConsolidationPipeline {
  private config: ConsolidationConfig;

  constructor(config?: Partial<ConsolidationConfig>) {
    this.config = {
      ...DEFAULT_CONFIG,
      ...config,
      thresholds: {
        ...DEFAULT_CONFIG.thresholds,
        ...config?.thresholds,
      },
    };
  }

  /**
   * Process a memory through the consolidation pipeline.
   * Checks for phase transitions and applies them if ready.
   *
   * @param memory - The memory record to process
   * @returns The processed memory with updated phase
   */
  process(memory: MemoryRecord): MemoryRecord {
    // Ensure memory has a phase
    const currentPhase = memory.phase ?? MemoryPhase.FORMATION;
    const memoryWithPhase: MemoryRecord = { ...memory, phase: currentPhase };

    // Check for phase transition
    const transitionCheck = this.checkTransition(memoryWithPhase);

    if (transitionCheck.ready && transitionCheck.targetPhase) {
      return this.applyTransition(memoryWithPhase, transitionCheck.targetPhase);
    }

    return memoryWithPhase;
  }

  /**
   * Check if a memory is ready to transition to the next phase.
   *
   * @param memory - The memory record to check
   * @returns TransitionCheckResult with details about readiness
   */
  checkTransition(memory: MemoryRecord): TransitionCheckResult {
    const currentPhase = memory.phase ?? MemoryPhase.FORMATION;
    const reasons: string[] = [];
    let targetPhase: MemoryPhase | null = null;
    let ready = false;

    switch (currentPhase) {
      case MemoryPhase.FORMATION: {
        // Formation -> Evolution check
        const accessOk = memory.accessCount >= this.config.thresholds.formationAccessCount;
        const decayOk = memory.decayScore >= this.config.thresholds.formationDecayScore;

        if (accessOk) {
          reasons.push(`Access count (${memory.accessCount}) meets threshold (${this.config.thresholds.formationAccessCount})`);
        } else {
          reasons.push(`Access count (${memory.accessCount}) below threshold (${this.config.thresholds.formationAccessCount})`);
        }

        if (decayOk) {
          reasons.push(`Decay score (${memory.decayScore.toFixed(2)}) meets threshold (${this.config.thresholds.formationDecayScore})`);
        } else {
          reasons.push(`Decay score (${memory.decayScore.toFixed(2)}) below threshold (${this.config.thresholds.formationDecayScore})`);
        }

        ready = accessOk && decayOk;
        if (ready) {
          targetPhase = MemoryPhase.EVOLUTION;
        }
        break;
      }

      case MemoryPhase.EVOLUTION: {
        // Evolution -> Retrieval check
        const accessOk = memory.accessCount >= this.config.thresholds.evolutionAccessCount;
        const relevanceOk = memory.relevanceScore >= this.config.thresholds.evolutionRelevanceScore;

        if (accessOk) {
          reasons.push(`Access count (${memory.accessCount}) meets threshold (${this.config.thresholds.evolutionAccessCount})`);
        } else {
          reasons.push(`Access count (${memory.accessCount}) below threshold (${this.config.thresholds.evolutionAccessCount})`);
        }

        if (relevanceOk) {
          reasons.push(`Relevance score (${memory.relevanceScore.toFixed(2)}) meets threshold (${this.config.thresholds.evolutionRelevanceScore})`);
        } else {
          reasons.push(`Relevance score (${memory.relevanceScore.toFixed(2)}) below threshold (${this.config.thresholds.evolutionRelevanceScore})`);
        }

        ready = accessOk && relevanceOk;
        if (ready) {
          targetPhase = MemoryPhase.RETRIEVAL;
        }
        break;
      }

      case MemoryPhase.RETRIEVAL: {
        // Retrieval is the final phase - no further transitions
        reasons.push('Memory is in RETRIEVAL phase (mature state)');
        ready = false;
        targetPhase = null;
        break;
      }
    }

    return {
      ready,
      currentPhase,
      targetPhase,
      reasons,
    };
  }

  /**
   * Apply a phase transition to a memory.
   *
   * @param memory - The memory to transition
   * @param newPhase - The target phase
   * @returns Memory with updated phase
   */
  private applyTransition(memory: MemoryRecord, newPhase: MemoryPhase): MemoryRecord {
    return {
      ...memory,
      phase: newPhase,
      metadata: {
        ...memory.metadata,
        lastPhaseTransition: Date.now(),
        previousPhase: memory.phase,
      },
    };
  }

  /**
   * Consolidate a memory with related memories by merging their contexts.
   * This strengthens memory associations during the EVOLUTION phase.
   *
   * @param memory - The primary memory to consolidate
   * @param relatedMemories - Array of potentially related memories
   * @returns ConsolidationResult with merged memory and details
   */
  consolidate(
    memory: MemoryRecord,
    relatedMemories: MemoryRecord[]
  ): ConsolidationResult {
    // Only consolidate during EVOLUTION phase
    if (memory.phase !== MemoryPhase.EVOLUTION) {
      return {
        memory,
        consolidated: false,
        mergedMemoryIds: [],
        mergedContext: null,
      };
    }

    // Find memories with similar context
    const similarMemories = this.findSimilarMemories(memory, relatedMemories);

    if (similarMemories.length === 0) {
      return {
        memory,
        consolidated: false,
        mergedMemoryIds: [],
        mergedContext: null,
      };
    }

    // Merge contexts from similar memories
    const mergedContext = this.mergeContexts(memory, similarMemories);
    const mergedIds = similarMemories.map(m => m.id);

    // Calculate boosted relevance from consolidation
    const consolidationBoost = Math.min(0.1 * similarMemories.length, 0.3);
    const newRelevance = Math.min(1.0, memory.relevanceScore + consolidationBoost);

    const consolidatedMemory: MemoryRecord = {
      ...memory,
      context: mergedContext,
      relevanceScore: newRelevance,
      metadata: {
        ...memory.metadata,
        consolidatedAt: Date.now(),
        consolidatedFrom: mergedIds,
        consolidationCount: (memory.metadata?.consolidationCount as number ?? 0) + 1,
      },
    };

    return {
      memory: consolidatedMemory,
      consolidated: true,
      mergedMemoryIds: mergedIds,
      mergedContext,
    };
  }

  /**
   * Find memories with similar context using tokenization and Jaccard similarity.
   *
   * @param memory - The reference memory
   * @param candidates - Array of candidate memories to compare
   * @returns Array of memories meeting the similarity threshold
   */
  private findSimilarMemories(
    memory: MemoryRecord,
    candidates: MemoryRecord[]
  ): MemoryRecord[] {
    if (!memory.context) {
      return [];
    }

    const memoryTokens = this.tokenize(memory.context);

    return candidates.filter(candidate => {
      // Skip self and memories without context
      if (candidate.id === memory.id || !candidate.context) {
        return false;
      }

      // Must be same memory type for consolidation
      if (candidate.type !== memory.type) {
        return false;
      }

      const candidateTokens = this.tokenize(candidate.context);
      const similarity = this.calculateJaccardSimilarity(memoryTokens, candidateTokens);

      return similarity >= this.config.thresholds.contextSimilarityThreshold;
    });
  }

  /**
   * Tokenize text into normalized word set.
   */
  private tokenize(text: string): Set<string> {
    return new Set(
      text
        .toLowerCase()
        .replace(/[^\w\s]/g, ' ')
        .split(/\s+/)
        .filter(word => word.length >= 3)
        .map(word => word.trim())
    );
  }

  /**
   * Calculate Jaccard similarity between two token sets.
   */
  private calculateJaccardSimilarity(setA: Set<string>, setB: Set<string>): number {
    if (setA.size === 0 || setB.size === 0) {
      return 0;
    }

    const intersection = new Set<string>();
    for (const token of setA) {
      if (setB.has(token)) {
        intersection.add(token);
      }
    }

    const union = new Set([...setA, ...setB]);
    return intersection.size / union.size;
  }

  /**
   * Merge contexts from multiple memories into a combined context.
   * Deduplicates and orders by relevance.
   *
   * @param primary - The primary memory
   * @param related - Array of related memories to merge from
   * @returns Combined context string
   */
  private mergeContexts(primary: MemoryRecord, related: MemoryRecord[]): string {
    const contextParts: string[] = [];

    // Add primary context first
    if (primary.context) {
      contextParts.push(primary.context);
    }

    // Add unique context parts from related memories
    const seenTokens = primary.context ? this.tokenize(primary.context) : new Set<string>();

    for (const memory of related) {
      if (!memory.context) continue;

      const tokens = this.tokenize(memory.context);
      const newTokens: string[] = [];

      for (const token of tokens) {
        if (!seenTokens.has(token)) {
          newTokens.push(token);
          seenTokens.add(token);
        }
      }

      if (newTokens.length > 0) {
        contextParts.push(newTokens.join(' '));
      }
    }

    return contextParts.join(' | ');
  }

  /**
   * Get the current configuration.
   */
  getConfig(): Readonly<ConsolidationConfig> {
    return { ...this.config };
  }

  /**
   * Update configuration thresholds.
   */
  updateThresholds(thresholds: Partial<typeof CONSOLIDATION_THRESHOLDS>): void {
    this.config.thresholds = {
      ...this.config.thresholds,
      ...thresholds,
    };
  }
}

// Export singleton instance with default configuration
export const consolidationPipeline = new ConsolidationPipeline();

/**
 * Convenience function: Consolidate a memory with related memories.
 *
 * @param memory - The primary memory to consolidate
 * @param relatedMemories - Array of potentially related memories
 * @returns ConsolidationResult with merged memory and details
 */
export function consolidateMemory(
  memory: MemoryRecord,
  relatedMemories: MemoryRecord[]
): ConsolidationResult {
  return consolidationPipeline.consolidate(memory, relatedMemories);
}

/**
 * Convenience function: Advance a memory to the next phase if ready.
 *
 * @param memory - The memory to potentially advance
 * @returns The memory with updated phase (unchanged if not ready)
 */
export function advancePhase(memory: MemoryRecord): MemoryRecord {
  return consolidationPipeline.process(memory);
}

/**
 * Convenience function: Check if a memory is ready to transition phases.
 *
 * @param memory - The memory to check
 * @returns TransitionCheckResult with details about readiness
 */
export function isReadyForTransition(memory: MemoryRecord): TransitionCheckResult {
  return consolidationPipeline.checkTransition(memory);
}
