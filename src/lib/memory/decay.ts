/**
 * Memory Decay System
 * Phase 8 - Adaptive Memory Lifecycle
 *
 * Implements exponential decay with configurable half-lives per memory type.
 * Formula: score = initialScore * e^(-λt) where λ = ln(2) / halfLife
 */

import { MemoryType, MemoryRecord } from './types';

// Default half-lives in days
export const DEFAULT_HALF_LIVES: Record<MemoryType, number> = {
  [MemoryType.FACTUAL]: 90,      // 90 days - Long-term knowledge
  [MemoryType.EXPERIENTIAL]: 30, // 30 days - Experiences and events
  [MemoryType.WORKING]: 7        // 7 days - Short-term operational memory
};

// Minimum decay score before memory is pruned
export const DEFAULT_MINIMUM_DECAY = 0.01;

// Decay boost multiplier when memory is accessed
export const ACCESS_BOOST_MULTIPLIER = 1.5;

// Maximum decay score after boost (capped at 1.0)
export const MAX_DECAY_SCORE = 1.0;

export interface DecayConfig {
  halfLives: Record<MemoryType, number>;
  minimumDecay: number;  // Don't go below this (default: 0.01)
}

/**
 * MemoryDecayManager handles the lifecycle of memory decay scores.
 *
 * Uses exponential decay curve to simulate natural memory fading.
 * Memories can be reinforced through access, which boosts their decay score.
 */
export class MemoryDecayManager {
  private config: DecayConfig;

  constructor(config?: Partial<DecayConfig>) {
    this.config = {
      halfLives: config?.halfLives ?? { ...DEFAULT_HALF_LIVES },
      minimumDecay: config?.minimumDecay ?? DEFAULT_MINIMUM_DECAY,
    };
  }

  /**
   * Calculate current decay score based on time elapsed since memory creation.
   *
   * @param memory - The memory record to calculate decay for
   * @param currentTime - Optional current timestamp in ms (defaults to Date.now())
   * @returns The calculated decay score between minimumDecay and 1.0
   */
  calculateDecay(memory: MemoryRecord, currentTime?: number): number {
    const now = currentTime ?? Date.now();
    const createdAt = memory.createdAt;

    const daysSinceCreation = (now - createdAt) / (1000 * 60 * 60 * 24);
    const halfLife = this.config.halfLives[memory.type];

    // Start with current decay score or 1.0 if not set
    const initialScore = memory.decayScore ?? 1.0;

    return this.exponentialDecay(initialScore, daysSinceCreation, halfLife);
  }

  /**
   * Exponential decay formula: score = initialScore * e^(-λt)
   * where λ = ln(2) / halfLife
   *
   * @param initialScore - Starting decay score
   * @param daysSinceCreation - Days elapsed since memory creation
   * @param halfLifeDays - Half-life in days for this memory type
   * @returns Decayed score (never below minimumDecay)
   */
  private exponentialDecay(
    initialScore: number,
    daysSinceCreation: number,
    halfLifeDays: number
  ): number {
    // λ (decay constant) = ln(2) / halfLife
    const lambda = Math.LN2 / halfLifeDays;

    // Exponential decay: score = initialScore * e^(-λt)
    const decayedScore = initialScore * Math.exp(-lambda * daysSinceCreation);

    // Ensure score doesn't go below minimum
    return Math.max(decayedScore, this.config.minimumDecay);
  }

  /**
   * Boost decay score when memory is accessed (refreshes it).
   * This simulates the strengthening of memories through recall.
   *
   * @param memory - The memory record being accessed
   * @returns The new decay score after boost (capped at MAX_DECAY_SCORE)
   */
  onAccess(memory: MemoryRecord): number {
    const currentDecay = memory.decayScore ?? 1.0;

    // Boost the decay score by the multiplier
    const boostedScore = currentDecay * ACCESS_BOOST_MULTIPLIER;

    // Cap at maximum score
    return Math.min(boostedScore, MAX_DECAY_SCORE);
  }

  /**
   * Calculate days until memory decays below a given threshold.
   *
   * @param memory - The memory record to analyze
   * @param threshold - The decay threshold to check against
   * @returns Number of days until decay falls below threshold (can be negative if already below)
   */
  getDaysUntilDecay(memory: MemoryRecord, threshold: number): number {
    const currentScore = memory.decayScore ?? 1.0;
    const halfLife = this.config.halfLives[memory.type];

    // If already below threshold, return 0
    if (currentScore <= threshold) {
      return 0;
    }

    // Solving for t: threshold = currentScore * e^(-λt)
    // t = -ln(threshold / currentScore) / λ
    // t = -ln(threshold / currentScore) * halfLife / ln(2)
    const lambda = Math.LN2 / halfLife;
    const daysUntil = -Math.log(threshold / currentScore) / lambda;

    return Math.max(0, daysUntil);
  }

  /**
   * Check if memory should be pruned (decay below minimum threshold).
   *
   * @param memory - The memory record to check
   * @returns True if memory's decay score is at or below the minimum threshold
   */
  shouldPrune(memory: MemoryRecord): boolean {
    const currentDecay = this.calculateDecay(memory);
    return currentDecay <= this.config.minimumDecay;
  }

  /**
   * Update half-life for a specific memory type.
   *
   * @param type - The memory type to update
   * @param days - New half-life in days (must be positive)
   * @throws Error if days is not a positive number
   */
  setHalfLife(type: MemoryType, days: number): void {
    if (days <= 0) {
      throw new Error(`Half-life must be positive, got: ${days}`);
    }
    this.config.halfLives[type] = days;
  }

  /**
   * Get the current decay configuration.
   *
   * @returns A copy of the current configuration
   */
  getConfig(): DecayConfig {
    return {
      halfLives: { ...this.config.halfLives },
      minimumDecay: this.config.minimumDecay,
    };
  }

  /**
   * Update the minimum decay threshold.
   *
   * @param threshold - New minimum decay value (must be between 0 and 1)
   * @throws Error if threshold is not in valid range
   */
  setMinimumDecay(threshold: number): void {
    if (threshold < 0 || threshold > 1) {
      throw new Error(`Minimum decay must be between 0 and 1, got: ${threshold}`);
    }
    this.config.minimumDecay = threshold;
  }

  /**
   * Calculate the decay rate (lambda) for a memory type.
   * Useful for external analysis or visualization.
   *
   * @param type - The memory type
   * @returns The decay constant (lambda)
   */
  getDecayRate(type: MemoryType): number {
    return Math.LN2 / this.config.halfLives[type];
  }

  /**
   * Predict the decay score at a future time.
   *
   * @param memory - The memory record
   * @param daysInFuture - Number of days in the future to predict
   * @returns Predicted decay score at the future time
   */
  predictDecayAt(memory: MemoryRecord, daysInFuture: number): number {
    const currentScore = memory.decayScore ?? 1.0;
    const halfLife = this.config.halfLives[memory.type];

    return this.exponentialDecay(currentScore, daysInFuture, halfLife);
  }
}

// Export singleton instance with default configuration
export const decayManager = new MemoryDecayManager();
