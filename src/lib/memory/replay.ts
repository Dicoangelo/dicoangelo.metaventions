/**
 * Memory Replay System
 * Phase 8 - Adaptive Memory Lifecycle (US-006)
 *
 * Implements spaced repetition for memory reinforcement.
 * Targets high-relevance memories with declining decay scores
 * and schedules optimal replay intervals to maintain retention.
 *
 * Algorithm: Leitner-style box system with configurable intervals
 * - Box 1: 1 day (new/struggling memories)
 * - Box 2: 2 days
 * - Box 3: 4 days
 * - Box 4: 7 days (weekly)
 * - Box 5: 14 days (bi-weekly)
 * - Box 6: 30 days (monthly, mastered)
 */

import { MemoryRecord, MemoryPhase, PHASE_THRESHOLDS } from './types';

// Configuration constants
export const REPLAY_RELEVANCE_THRESHOLD = 0.7;
export const REPLAY_DECAY_THRESHOLD = 0.5;
export const REPLAY_BOOST = 0.3;

// Leitner-style interval multipliers (in days)
export const REPLAY_INTERVALS = [1, 2, 4, 7, 14, 30] as const;

// Maximum replay box (0-indexed, so 5 = box 6)
export const MAX_REPLAY_BOX = REPLAY_INTERVALS.length - 1;

// Milliseconds per day
const MS_PER_DAY = 24 * 60 * 60 * 1000;

/**
 * Extended memory record with replay tracking metadata
 */
export interface ReplayableMemory extends MemoryRecord {
  metadata?: MemoryRecord['metadata'] & {
    /** Current replay box (0-5, Leitner system) */
    replayBox?: number;
    /** Unix timestamp of last replay */
    lastReplayAt?: number;
    /** Total number of successful replays */
    replayCount?: number;
    /** Consecutive successful replays (resets on failure) */
    replayStreak?: number;
  };
}

/**
 * Result of a replay operation
 */
export interface ReplayResult {
  /** The updated memory after replay */
  memory: ReplayableMemory;
  /** Previous decay score before boost */
  previousDecay: number;
  /** New decay score after boost */
  newDecay: number;
  /** Whether phase was advanced */
  phaseAdvanced: boolean;
  /** Previous phase if advanced */
  previousPhase?: MemoryPhase;
  /** Next scheduled replay date */
  nextReplayDate: Date;
}

/**
 * Scheduled replay item for the queue
 */
export interface ScheduledReplay {
  /** The memory to replay */
  memory: ReplayableMemory;
  /** Urgency score (0-1, higher = more urgent) */
  urgency: number;
  /** Days overdue (negative = not yet due) */
  daysOverdue: number;
  /** Scheduled replay date */
  dueDate: Date;
}

/**
 * Configuration for the replay manager
 */
export interface ReplayConfig {
  /** Minimum relevance to consider for replay */
  relevanceThreshold: number;
  /** Maximum decay score to trigger replay */
  decayThreshold: number;
  /** Amount to boost decay on successful replay */
  replayBoost: number;
  /** Interval multipliers in days */
  intervals: readonly number[];
}

/**
 * MemoryReplayManager implements spaced repetition for memory maintenance.
 *
 * Identifies memories that are valuable (high relevance) but fading (low decay)
 * and schedules optimal replay intervals based on the Leitner box system.
 */
export class MemoryReplayManager {
  private config: ReplayConfig;

  constructor(config?: Partial<ReplayConfig>) {
    this.config = {
      relevanceThreshold: config?.relevanceThreshold ?? REPLAY_RELEVANCE_THRESHOLD,
      decayThreshold: config?.decayThreshold ?? REPLAY_DECAY_THRESHOLD,
      replayBoost: config?.replayBoost ?? REPLAY_BOOST,
      intervals: config?.intervals ?? REPLAY_INTERVALS,
    };
  }

  /**
   * Identify memories that are candidates for replay.
   *
   * Target: High relevance (>= 0.7) but declining decay (< 0.5)
   * These are valuable memories at risk of being lost.
   *
   * @param memories - Array of memory records to evaluate
   * @returns Array of memories that need replay
   */
  identifyReplayTargets(memories: MemoryRecord[]): ReplayableMemory[] {
    return memories.filter((memory): memory is ReplayableMemory => {
      // Must meet relevance threshold (valuable memory)
      if (memory.relevanceScore < this.config.relevanceThreshold) {
        return false;
      }

      // Must be below decay threshold (fading memory)
      if (memory.decayScore >= this.config.decayThreshold) {
        return false;
      }

      return true;
    });
  }

  /**
   * Calculate the next replay interval based on memory's current box.
   *
   * Uses Leitner-style spaced repetition:
   * - Success: Move to next box (longer interval)
   * - The interval increases with each successful replay
   *
   * @param memory - Memory record with optional replay metadata
   * @returns Interval in days until next replay
   */
  calculateNextReplayInterval(memory: ReplayableMemory): number {
    const currentBox = memory.metadata?.replayBox ?? 0;

    // Get interval for current box (capped at max)
    const boxIndex = Math.min(currentBox, MAX_REPLAY_BOX);
    return this.config.intervals[boxIndex];
  }

  /**
   * Execute a replay for a memory, boosting its decay score.
   *
   * Effects:
   * - Boosts decay score by REPLAY_BOOST (capped at 1.0)
   * - Updates lastAccessedAt to now
   * - Increments accessCount
   * - Advances replay box (Leitner progression)
   * - May advance phase if thresholds met
   *
   * @param memory - Memory to replay
   * @returns ReplayResult with updated memory and metadata
   */
  executeReplay(memory: ReplayableMemory): ReplayResult {
    const now = Date.now();
    const previousDecay = memory.decayScore;
    const previousPhase = memory.phase;

    // Calculate new decay score (boost, capped at 1.0)
    const newDecay = Math.min(1.0, previousDecay + this.config.replayBoost);

    // Get current replay metadata
    const currentBox = memory.metadata?.replayBox ?? 0;
    const currentReplayCount = memory.metadata?.replayCount ?? 0;
    const currentStreak = memory.metadata?.replayStreak ?? 0;

    // Advance to next box (capped at max)
    const newBox = Math.min(currentBox + 1, MAX_REPLAY_BOX);

    // Calculate next replay date
    const nextInterval = this.config.intervals[Math.min(newBox, MAX_REPLAY_BOX)];
    const nextReplayDate = new Date(now + nextInterval * MS_PER_DAY);

    // Increment access count
    const newAccessCount = memory.accessCount + 1;

    // Check for phase advancement
    let newPhase = memory.phase ?? MemoryPhase.FORMATION;
    let phaseAdvanced = false;

    if (newPhase === MemoryPhase.FORMATION &&
        newAccessCount >= PHASE_THRESHOLDS.formationToEvolution) {
      newPhase = MemoryPhase.EVOLUTION;
      phaseAdvanced = true;
    } else if (newPhase === MemoryPhase.EVOLUTION &&
               newAccessCount >= PHASE_THRESHOLDS.evolutionToRetrieval) {
      newPhase = MemoryPhase.RETRIEVAL;
      phaseAdvanced = true;
    }

    // Build updated memory
    const updatedMemory: ReplayableMemory = {
      ...memory,
      decayScore: newDecay,
      lastAccessedAt: now,
      accessCount: newAccessCount,
      phase: newPhase,
      metadata: {
        ...memory.metadata,
        replayBox: newBox,
        lastReplayAt: now,
        replayCount: currentReplayCount + 1,
        replayStreak: currentStreak + 1,
      },
    };

    return {
      memory: updatedMemory,
      previousDecay,
      newDecay,
      phaseAdvanced,
      previousPhase: phaseAdvanced ? previousPhase : undefined,
      nextReplayDate,
    };
  }

  /**
   * Get a prioritized replay schedule for a set of memories.
   *
   * Returns memories sorted by urgency (lowest decay first = most urgent).
   * Includes due date calculation based on Leitner intervals.
   *
   * @param memories - Array of memories to schedule
   * @returns Sorted array of scheduled replays
   */
  getReplaySchedule(memories: MemoryRecord[]): ScheduledReplay[] {
    const now = Date.now();
    const targets = this.identifyReplayTargets(memories);

    const scheduled: ScheduledReplay[] = targets.map((memory) => {
      const lastReplay = (memory as ReplayableMemory).metadata?.lastReplayAt;
      const interval = this.calculateNextReplayInterval(memory);

      // Calculate due date
      let dueDate: Date;
      if (lastReplay) {
        dueDate = new Date(lastReplay + interval * MS_PER_DAY);
      } else {
        // Never replayed - due immediately
        dueDate = new Date(now);
      }

      // Calculate days overdue (positive = overdue, negative = not yet due)
      const daysOverdue = (now - dueDate.getTime()) / MS_PER_DAY;

      // Calculate urgency (0-1 scale)
      // Based on: how low decay is + how overdue
      const decayUrgency = 1 - memory.decayScore; // Lower decay = higher urgency
      const overdueUrgency = Math.max(0, Math.min(1, daysOverdue / 7)); // Cap at 1 week overdue
      const urgency = (decayUrgency * 0.7) + (overdueUrgency * 0.3);

      return {
        memory,
        urgency,
        daysOverdue,
        dueDate,
      };
    });

    // Sort by urgency (highest first = most urgent)
    return scheduled.sort((a, b) => b.urgency - a.urgency);
  }

  /**
   * Check if a memory is due for replay.
   *
   * A memory is due if:
   * 1. It meets replay criteria (high relevance, low decay)
   * 2. The scheduled interval has elapsed since last replay
   *
   * @param memory - Memory to check
   * @returns True if memory should be replayed now
   */
  isDueForReplay(memory: MemoryRecord): boolean {
    // First check if it meets basic criteria
    if (memory.relevanceScore < this.config.relevanceThreshold) {
      return false;
    }

    if (memory.decayScore >= this.config.decayThreshold) {
      return false;
    }

    const replayableMemory = memory as ReplayableMemory;
    const lastReplay = replayableMemory.metadata?.lastReplayAt;

    // Never replayed - due now
    if (!lastReplay) {
      return true;
    }

    // Check if interval has elapsed
    const interval = this.calculateNextReplayInterval(replayableMemory);
    const now = Date.now();
    const nextDue = lastReplay + interval * MS_PER_DAY;

    return now >= nextDue;
  }

  /**
   * Get memories that are due for replay right now.
   *
   * @param memories - Array of memories to check
   * @returns Array of memories due for replay
   */
  getMemoriesDueForReplay(memories: MemoryRecord[]): ReplayableMemory[] {
    return memories.filter((memory) =>
      this.isDueForReplay(memory)
    ) as ReplayableMemory[];
  }

  /**
   * Calculate replay statistics for a set of memories.
   *
   * @param memories - Array of memories to analyze
   * @returns Statistics about replay state
   */
  getReplayStats(memories: MemoryRecord[]): ReplayStats {
    const targets = this.identifyReplayTargets(memories);
    const due = this.getMemoriesDueForReplay(memories);

    // Count by box
    const byBox = new Array(this.config.intervals.length).fill(0);
    let totalReplays = 0;

    for (const memory of memories) {
      const replayable = memory as ReplayableMemory;
      const box = replayable.metadata?.replayBox ?? 0;
      byBox[Math.min(box, MAX_REPLAY_BOX)]++;
      totalReplays += replayable.metadata?.replayCount ?? 0;
    }

    return {
      totalMemories: memories.length,
      targetsCount: targets.length,
      dueCount: due.length,
      byBox,
      totalReplays,
      averageBox: targets.length > 0
        ? targets.reduce((sum, m) => sum + ((m as ReplayableMemory).metadata?.replayBox ?? 0), 0) / targets.length
        : 0,
    };
  }

  /**
   * Reset a memory's replay progress (e.g., after failed recall).
   *
   * @param memory - Memory to reset
   * @returns Updated memory with reset replay metadata
   */
  resetReplayProgress(memory: ReplayableMemory): ReplayableMemory {
    return {
      ...memory,
      metadata: {
        ...memory.metadata,
        replayBox: 0,
        replayStreak: 0,
        // Keep lastReplayAt and replayCount for history
      },
    };
  }

  /**
   * Get the current configuration.
   *
   * @returns Copy of the current configuration
   */
  getConfig(): ReplayConfig {
    return {
      ...this.config,
      intervals: [...this.config.intervals],
    };
  }

  /**
   * Update configuration values.
   *
   * @param updates - Partial configuration to merge
   */
  updateConfig(updates: Partial<ReplayConfig>): void {
    this.config = {
      ...this.config,
      ...updates,
    };
  }
}

/**
 * Statistics about replay state
 */
export interface ReplayStats {
  /** Total number of memories analyzed */
  totalMemories: number;
  /** Number of memories that are replay targets */
  targetsCount: number;
  /** Number of memories currently due for replay */
  dueCount: number;
  /** Count of memories in each Leitner box */
  byBox: number[];
  /** Total replay events across all memories */
  totalReplays: number;
  /** Average box number for targets */
  averageBox: number;
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Create a formatted schedule report for CLI display.
 *
 * @param schedule - Replay schedule from getReplaySchedule
 * @param limit - Maximum items to show
 * @returns Formatted string for CLI output
 */
export function formatReplaySchedule(
  schedule: ScheduledReplay[],
  limit: number = 10
): string {
  if (schedule.length === 0) {
    return 'No memories due for replay.';
  }

  const lines: string[] = [
    '=== Memory Replay Schedule ===',
    '',
    `Total items: ${schedule.length}`,
    '',
    'Priority | Decay | Relevance | Due | Content',
    '---------|-------|-----------|-----|--------',
  ];

  const itemsToShow = schedule.slice(0, limit);

  for (const item of itemsToShow) {
    const priority = (item.urgency * 100).toFixed(0).padStart(3) + '%';
    const decay = item.memory.decayScore.toFixed(2);
    const relevance = item.memory.relevanceScore.toFixed(2);
    const dueStr = item.daysOverdue > 0
      ? `${item.daysOverdue.toFixed(0)}d overdue`
      : item.daysOverdue < -1
        ? `in ${Math.abs(item.daysOverdue).toFixed(0)}d`
        : 'now';
    const content = item.memory.content.substring(0, 30) +
      (item.memory.content.length > 30 ? '...' : '');

    lines.push(`${priority}    | ${decay}  | ${relevance}     | ${dueStr.padEnd(10)} | ${content}`);
  }

  if (schedule.length > limit) {
    lines.push(`... and ${schedule.length - limit} more items`);
  }

  return lines.join('\n');
}

/**
 * Format replay statistics for CLI display.
 *
 * @param stats - Statistics from getReplayStats
 * @returns Formatted string for CLI output
 */
export function formatReplayStats(stats: ReplayStats): string {
  const boxLabels = ['1 day', '2 days', '4 days', '7 days', '14 days', '30 days'];

  const lines: string[] = [
    '=== Replay Statistics ===',
    '',
    `Total memories: ${stats.totalMemories}`,
    `Replay targets: ${stats.targetsCount}`,
    `Due for replay: ${stats.dueCount}`,
    `Total replays: ${stats.totalReplays}`,
    `Average box: ${stats.averageBox.toFixed(1)}`,
    '',
    'Distribution by Leitner Box:',
  ];

  for (let i = 0; i < stats.byBox.length; i++) {
    const label = boxLabels[i] || `${REPLAY_INTERVALS[i]} days`;
    const count = stats.byBox[i];
    const bar = '#'.repeat(Math.min(count, 20));
    lines.push(`  Box ${i + 1} (${label}): ${count} ${bar}`);
  }

  return lines.join('\n');
}

/**
 * Get the Leitner box label for a given box number.
 *
 * @param box - Box number (0-5)
 * @returns Human-readable label
 */
export function getBoxLabel(box: number): string {
  const labels = [
    'New (1 day)',
    'Learning (2 days)',
    'Reviewing (4 days)',
    'Weekly (7 days)',
    'Bi-weekly (14 days)',
    'Mastered (30 days)',
  ];
  return labels[Math.min(box, labels.length - 1)];
}

/**
 * Calculate optimal replay time based on decay curve.
 *
 * Returns the ideal moment to replay (when decay is around threshold).
 *
 * @param memory - Memory to analyze
 * @param decayRate - Decay rate per hour (from memory type)
 * @returns Date of optimal replay
 */
export function calculateOptimalReplayTime(
  memory: MemoryRecord,
  decayRate: number
): Date {
  // Calculate time until decay reaches threshold
  // Using: threshold = current * e^(-rate * t)
  // Solving: t = -ln(threshold / current) / rate

  const current = memory.decayScore;
  const threshold = REPLAY_DECAY_THRESHOLD;

  if (current <= threshold) {
    // Already below threshold - replay now
    return new Date();
  }

  const hoursUntilThreshold = -Math.log(threshold / current) / decayRate;
  const msUntilThreshold = hoursUntilThreshold * 60 * 60 * 1000;

  return new Date(Date.now() + msUntilThreshold);
}

// ============================================================================
// Singleton Instance
// ============================================================================

/**
 * Default singleton instance of the replay manager.
 * Use this for simple cases; create new instances for custom configs.
 */
export const replayManager = new MemoryReplayManager();
