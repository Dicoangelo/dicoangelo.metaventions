/**
 * Forgetting Mechanism
 * Phase 8 - Adaptive Memory Lifecycle (US-005)
 *
 * Implements scheduled pruning of low-value memories with:
 * - Configurable thresholds for decay and relevance
 * - Soft delete with 30-day recovery window
 * - Hard delete after retention period
 * - Pruning summary statistics
 */

import {
  MemoryRecord,
  MemoryType,
  calculateDecay,
} from './types';

// ============================================================================
// Configuration Constants
// ============================================================================

/** Decay score threshold below which memories become prune candidates */
export const PRUNE_DECAY_THRESHOLD = 0.1;

/** Relevance score threshold below which memories become prune candidates */
export const PRUNE_RELEVANCE_THRESHOLD = 0.2;

/** Days to retain archived memories before permanent deletion */
export const ARCHIVE_RETENTION_DAYS = 30;

/** Archive retention in milliseconds */
export const ARCHIVE_RETENTION_MS = ARCHIVE_RETENTION_DAYS * 24 * 60 * 60 * 1000;

// ============================================================================
// Types
// ============================================================================

/**
 * Extended memory record with archive metadata
 */
export interface ArchivedMemoryRecord extends MemoryRecord {
  /** When the memory was soft deleted (Unix timestamp in ms) */
  archivedAt: number;
  /** Scheduled permanent deletion date (Unix timestamp in ms) */
  scheduledDeletionAt: number;
  /** Whether this memory is in archived state */
  isArchived: true;
}

/**
 * Configuration for the pruning thresholds
 */
export interface PruneConfig {
  /** Decay threshold - memories below this are candidates */
  decayThreshold: number;
  /** Relevance threshold - memories below this are candidates */
  relevanceThreshold: number;
  /** Days to retain archived memories */
  archiveRetentionDays: number;
}

/**
 * Statistics about a pruning operation
 */
export interface PruningSummary {
  /** Total memories pruned in this operation */
  totalPruned: number;
  /** Breakdown by memory type */
  byType: Record<MemoryType, number>;
  /** Timestamp of the pruning operation */
  prunedAt: number;
  /** Thresholds used for this pruning */
  thresholds: {
    decay: number;
    relevance: number;
  };
}

/**
 * Summary of archived memories pending deletion
 */
export interface ArchiveSummary {
  /** Total archived memories */
  totalArchived: number;
  /** Breakdown by memory type */
  byType: Record<MemoryType, number>;
  /** Memories due for hard delete */
  dueForDeletion: number;
  /** Oldest archive date */
  oldestArchive: number | null;
  /** Newest archive date */
  newestArchive: number | null;
}

/**
 * Pruning schedule interval
 */
export type PruneInterval = 'daily' | 'weekly';

/**
 * Callback for scheduled pruning execution
 */
export type PruneCallback = (summary: PruningSummary) => void;

// ============================================================================
// ForgettingManager Class
// ============================================================================

/**
 * Manages memory pruning and archival with configurable thresholds.
 *
 * The forgetting mechanism follows a two-phase deletion:
 * 1. Soft delete: Mark as archived, retain for recovery window
 * 2. Hard delete: Permanently remove after retention period
 */
export class ForgettingManager {
  private config: PruneConfig;
  private scheduledInterval: ReturnType<typeof setInterval> | null = null;
  private pruneCallback: PruneCallback | null = null;

  constructor(config?: Partial<PruneConfig>) {
    this.config = {
      decayThreshold: config?.decayThreshold ?? PRUNE_DECAY_THRESHOLD,
      relevanceThreshold: config?.relevanceThreshold ?? PRUNE_RELEVANCE_THRESHOLD,
      archiveRetentionDays: config?.archiveRetentionDays ?? ARCHIVE_RETENTION_DAYS,
    };
  }

  getConfig(): Readonly<PruneConfig> {
    return { ...this.config };
  }

  setConfig(config: Partial<PruneConfig>): void {
    if (config.decayThreshold !== undefined) {
      this.config.decayThreshold = Math.max(0, Math.min(1, config.decayThreshold));
    }
    if (config.relevanceThreshold !== undefined) {
      this.config.relevanceThreshold = Math.max(0, Math.min(1, config.relevanceThreshold));
    }
    if (config.archiveRetentionDays !== undefined) {
      this.config.archiveRetentionDays = Math.max(1, config.archiveRetentionDays);
    }
  }

  identifyPruneCandidates(
    memories: MemoryRecord[],
    currentTime: number = Date.now()
  ): MemoryRecord[] {
    return memories.filter(memory => {
      const currentDecay = calculateDecay(memory, currentTime);
      const relevance = memory.relevanceScore;
      return (
        currentDecay < this.config.decayThreshold &&
        relevance < this.config.relevanceThreshold
      );
    });
  }

  isPruneCandidate(
    memory: MemoryRecord,
    currentTime: number = Date.now()
  ): boolean {
    const currentDecay = calculateDecay(memory, currentTime);
    return (
      currentDecay < this.config.decayThreshold &&
      memory.relevanceScore < this.config.relevanceThreshold
    );
  }

  softDelete(memory: MemoryRecord): ArchivedMemoryRecord {
    const now = Date.now();
    const retentionMs = this.config.archiveRetentionDays * 24 * 60 * 60 * 1000;
    return {
      ...memory,
      archivedAt: now,
      scheduledDeletionAt: now + retentionMs,
      isArchived: true,
    };
  }

  softDeleteBatch(memories: MemoryRecord[]): ArchivedMemoryRecord[] {
    return memories.map(m => this.softDelete(m));
  }

  isDueForHardDelete(
    memory: ArchivedMemoryRecord,
    currentTime: number = Date.now()
  ): boolean {
    return currentTime >= memory.scheduledDeletionAt;
  }

  hardDelete(memory: ArchivedMemoryRecord): string {
    if (!memory.isArchived) {
      throw new Error(`Memory ${memory.id} is not archived - cannot hard delete`);
    }
    if (!this.isDueForHardDelete(memory)) {
      const daysRemaining = Math.ceil(
        (memory.scheduledDeletionAt - Date.now()) / (24 * 60 * 60 * 1000)
      );
      throw new Error(
        `Memory ${memory.id} is not due for deletion. ` +
        `${daysRemaining} days remaining in recovery window.`
      );
    }
    return memory.id;
  }

  getMemoriesDueForHardDelete(
    archivedMemories: ArchivedMemoryRecord[],
    currentTime: number = Date.now()
  ): ArchivedMemoryRecord[] {
    return archivedMemories.filter(m => this.isDueForHardDelete(m, currentTime));
  }

  hardDeleteExpired(
    archivedMemories: ArchivedMemoryRecord[],
    currentTime: number = Date.now()
  ): string[] {
    const dueForDeletion = this.getMemoriesDueForHardDelete(archivedMemories, currentTime);
    return dueForDeletion.map(m => m.id);
  }

  restore(archivedMemory: ArchivedMemoryRecord): MemoryRecord {
    const now = Date.now();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { archivedAt, scheduledDeletionAt, isArchived, ...baseMemory } = archivedMemory;
    const restorationBoost = 0.15;
    const boostedDecay = Math.min(1.0, baseMemory.decayScore + restorationBoost);
    return {
      ...baseMemory,
      decayScore: boostedDecay,
      lastAccessedAt: now,
      accessCount: baseMemory.accessCount + 1,
    };
  }

  getPruningSummary(prunedMemories: MemoryRecord[]): PruningSummary {
    const byType: Record<MemoryType, number> = {
      [MemoryType.FACTUAL]: 0,
      [MemoryType.EXPERIENTIAL]: 0,
      [MemoryType.WORKING]: 0,
    };
    for (const memory of prunedMemories) {
      byType[memory.type]++;
    }
    return {
      totalPruned: prunedMemories.length,
      byType,
      prunedAt: Date.now(),
      thresholds: {
        decay: this.config.decayThreshold,
        relevance: this.config.relevanceThreshold,
      },
    };
  }

  getArchiveSummary(
    archivedMemories: ArchivedMemoryRecord[],
    currentTime: number = Date.now()
  ): ArchiveSummary {
    const byType: Record<MemoryType, number> = {
      [MemoryType.FACTUAL]: 0,
      [MemoryType.EXPERIENTIAL]: 0,
      [MemoryType.WORKING]: 0,
    };
    let oldestArchive: number | null = null;
    let newestArchive: number | null = null;
    let dueForDeletion = 0;

    for (const memory of archivedMemories) {
      byType[memory.type]++;
      if (oldestArchive === null || memory.archivedAt < oldestArchive) {
        oldestArchive = memory.archivedAt;
      }
      if (newestArchive === null || memory.archivedAt > newestArchive) {
        newestArchive = memory.archivedAt;
      }
      if (this.isDueForHardDelete(memory, currentTime)) {
        dueForDeletion++;
      }
    }
    return {
      totalArchived: archivedMemories.length,
      byType,
      dueForDeletion,
      oldestArchive,
      newestArchive,
    };
  }

  schedulePruning(interval: PruneInterval, callback?: PruneCallback): void {
    this.cancelScheduledPruning();
    const intervalMs = interval === 'daily'
      ? 24 * 60 * 60 * 1000
      : 7 * 24 * 60 * 60 * 1000;
    this.pruneCallback = callback ?? null;
    this.scheduledInterval = setInterval(() => {
      console.log(
        `[ForgettingManager] Scheduled ${interval} pruning triggered at ${new Date().toISOString()}`
      );
    }, intervalMs);
    console.log(
      `[ForgettingManager] Pruning scheduled: ${interval} ` +
      `(every ${interval === 'daily' ? '24 hours' : '7 days'})`
    );
  }

  cancelScheduledPruning(): void {
    if (this.scheduledInterval) {
      clearInterval(this.scheduledInterval);
      this.scheduledInterval = null;
      this.pruneCallback = null;
      console.log('[ForgettingManager] Scheduled pruning cancelled');
    }
  }

  isPruningScheduled(): boolean {
    return this.scheduledInterval !== null;
  }

  executePruningCycle(memories: MemoryRecord[]): {
    archived: ArchivedMemoryRecord[];
    summary: PruningSummary;
  } {
    const candidates = this.identifyPruneCandidates(memories);
    const archived = this.softDeleteBatch(candidates);
    const summary = this.getPruningSummary(candidates);
    console.log(
      `[ForgettingManager] Pruning cycle complete: ` +
      `${summary.totalPruned} memories archived ` +
      `(F:${summary.byType.FACTUAL}, E:${summary.byType.EXPERIENTIAL}, W:${summary.byType.WORKING})`
    );
    if (this.pruneCallback) {
      this.pruneCallback(summary);
    }
    return { archived, summary };
  }
}

// ============================================================================
// Utility Functions
// ============================================================================

export function isArchivedMemory(
  memory: MemoryRecord | ArchivedMemoryRecord
): memory is ArchivedMemoryRecord {
  return 'isArchived' in memory && memory.isArchived === true;
}

export function getDaysUntilHardDelete(
  memory: ArchivedMemoryRecord,
  currentTime: number = Date.now()
): number {
  const msRemaining = memory.scheduledDeletionAt - currentTime;
  return Math.max(0, Math.ceil(msRemaining / (24 * 60 * 60 * 1000)));
}

export function getDaysSinceArchival(
  memory: ArchivedMemoryRecord,
  currentTime: number = Date.now()
): number {
  const msElapsed = currentTime - memory.archivedAt;
  return Math.floor(msElapsed / (24 * 60 * 60 * 1000));
}

export function formatPruningSummary(summary: PruningSummary): string {
  const date = new Date(summary.prunedAt).toISOString();
  const lines = [
    `=== Pruning Summary (${date}) ===`,
    `Total Pruned: ${summary.totalPruned}`,
    `By Type:`,
    `  - Factual: ${summary.byType.FACTUAL}`,
    `  - Experiential: ${summary.byType.EXPERIENTIAL}`,
    `  - Working: ${summary.byType.WORKING}`,
    `Thresholds:`,
    `  - Decay: < ${summary.thresholds.decay}`,
    `  - Relevance: < ${summary.thresholds.relevance}`,
  ];
  return lines.join('\n');
}

// ============================================================================
// Default Instance
// ============================================================================

export const forgettingManager = new ForgettingManager();
