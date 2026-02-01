/**
 * Memory System Types
 * Phase 8 - Adaptive Memory Lifecycle
 *
 * Memory types based on cognitive science:
 * - FACTUAL: Facts, definitions, concepts (long retention)
 * - EXPERIENTIAL: Events, experiences, episodes (medium retention)
 * - WORKING: Temporary, task-specific (short retention)
 */

/**
 * Types of memories with different decay characteristics.
 *
 * FACTUAL (Semantic Memory):
 *   - Facts, definitions, concepts, technical knowledge
 *   - Long retention (90-day half-life), slow decay
 *   - Example: "TypeScript uses structural typing"
 *
 * EXPERIENTIAL (Episodic Memory):
 *   - Events, experiences, episodes, interactions
 *   - Medium retention (30-day half-life), moderate decay
 *   - Example: "User encountered auth error on 2026-01-15"
 *
 * WORKING (Working Memory):
 *   - Temporary, task-specific, context-bound
 *   - Short retention (7-day half-life), fast decay
 *   - Example: "Current task: implement memory types"
 */
export enum MemoryType {
  /** Long-term factual knowledge (90-day half-life) */
  FACTUAL = 'FACTUAL',

  /** Experiential memories from interactions (30-day half-life) */
  EXPERIENTIAL = 'EXPERIENTIAL',

  /** Short-term working memory (7-day half-life) */
  WORKING = 'WORKING',
}

/**
 * Memory lifecycle phases following cognitive consolidation model
 *
 * FORMATION:
 *   - Newly created memory, not yet consolidated
 *   - High plasticity, can be easily modified
 *   - Transitions to EVOLUTION after initial access/reinforcement
 *
 * EVOLUTION:
 *   - Being strengthened through repeated access
 *   - Consolidation in progress, building associations
 *   - Transitions to RETRIEVAL when mature
 *
 * RETRIEVAL:
 *   - Mature memory optimized for recall
 *   - Stable, well-connected, easy to access
 *   - May decay back to EVOLUTION if unused
 */
export enum MemoryPhase {
  FORMATION = 'formation',
  EVOLUTION = 'evolution',
  RETRIEVAL = 'retrieval'
}

/**
 * Decay rate multipliers per memory type (per hour)
 * Lower = slower decay = longer retention
 */
export const MEMORY_DECAY_RATES = {
  [MemoryType.FACTUAL]: 0.01,      // Very slow decay (facts persist)
  [MemoryType.EXPERIENTIAL]: 0.05, // Moderate decay (experiences fade)
  [MemoryType.WORKING]: 0.15       // Fast decay (working memory is temporary)
} as const;

/**
 * Default retention periods in milliseconds
 */
export const MEMORY_RETENTION_MS = {
  [MemoryType.FACTUAL]: 90 * 24 * 60 * 60 * 1000,      // 90 days
  [MemoryType.EXPERIENTIAL]: 30 * 24 * 60 * 60 * 1000, // 30 days
  [MemoryType.WORKING]: 7 * 24 * 60 * 60 * 1000        // 7 days
} as const;

/**
 * Phase transition thresholds
 */
export const PHASE_THRESHOLDS = {
  /** Access count to move from FORMATION to EVOLUTION */
  formationToEvolution: 2,
  /** Access count to move from EVOLUTION to RETRIEVAL */
  evolutionToRetrieval: 5,
  /** Decay score below which RETRIEVAL regresses to EVOLUTION */
  retrievalRegression: 0.3
} as const;

/**
 * A memory record stored in the system.
 */
export interface MemoryRecord {
  /** Unique identifier for the memory */
  id: string;

  /** The type of memory */
  type: MemoryType;

  /** Current lifecycle phase */
  phase?: MemoryPhase;

  /** The content or data of the memory */
  content: string;

  /** When the memory was created (Unix timestamp in ms) */
  createdAt: number;

  /** When the memory was last accessed (Unix timestamp in ms) */
  lastAccessedAt: number;

  /** Number of times this memory has been accessed */
  accessCount: number;

  /** Current decay score (0.0 to 1.0) - time-based decay */
  decayScore: number;

  /** Relevance score (0.0 to 1.0) - access/context-based */
  relevanceScore: number;

  /** Optional context string for categorization and matching */
  context?: string;

  /** Optional metadata */
  metadata?: Record<string, unknown>;
}

/**
 * Result of type detection heuristics
 */
export interface TypeDetectionResult {
  /** Detected memory type */
  type: MemoryType;

  /**
   * Confidence in the detection: 0-1
   * Higher = more signals matched
   */
  confidence: number;

  /** List of signals/patterns that led to this classification */
  signals: string[];
}

/**
 * Options for creating a new memory
 */
export interface CreateMemoryOptions {
  content: string;
  type?: MemoryType;           // If not provided, will auto-detect
  context?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Options for memory retrieval/search
 */
export interface MemorySearchOptions {
  query?: string;
  type?: MemoryType;
  phase?: MemoryPhase;
  minRelevance?: number;
  minDecay?: number;
  limit?: number;
  context?: string;
}

/**
 * Memory statistics summary
 */
export interface MemoryStats {
  total: number;
  byType: Record<MemoryType, number>;
  byPhase: Record<MemoryPhase, number>;
  averageDecay: number;
  averageRelevance: number;
  oldestMemory: number | null;    // Unix timestamp
  newestMemory: number | null;    // Unix timestamp
}

/**
 * Generate a unique memory ID
 */
export function generateMemoryId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `mem_${timestamp}_${random}`;
}

/**
 * Create a new memory record with defaults
 */
export function createMemoryRecord(options: CreateMemoryOptions): MemoryRecord {
  const now = Date.now();

  return {
    id: generateMemoryId(),
    content: options.content,
    type: options.type ?? MemoryType.WORKING, // Default to working if not specified
    phase: MemoryPhase.FORMATION,
    createdAt: now,
    lastAccessedAt: now,
    accessCount: 0,
    decayScore: 1.0,
    relevanceScore: 1.0,
    context: options.context,
    metadata: options.metadata
  };
}

/**
 * Calculate the decay for a memory based on time elapsed
 */
export function calculateDecay(
  memory: MemoryRecord,
  currentTime: number = Date.now()
): number {
  const elapsedMs = currentTime - memory.lastAccessedAt;
  const elapsedHours = elapsedMs / (1000 * 60 * 60);
  const decayRate = MEMORY_DECAY_RATES[memory.type];

  // Exponential decay: score * e^(-rate * time)
  const newDecay = memory.decayScore * Math.exp(-decayRate * elapsedHours);

  // Clamp to [0, 1]
  return Math.max(0, Math.min(1, newDecay));
}

/**
 * Reinforce a memory (called on access)
 * Increases decay score and access count, may transition phase
 */
export function reinforceMemory(memory: MemoryRecord): MemoryRecord {
  const now = Date.now();

  // Boost decay score (capped at 1.0)
  const reinforcementBoost = 0.1;
  const newDecayScore = Math.min(1.0, memory.decayScore + reinforcementBoost);

  // Determine new phase based on access count
  let newPhase = memory.phase ?? MemoryPhase.FORMATION;
  const newAccessCount = memory.accessCount + 1;

  if (newPhase === MemoryPhase.FORMATION &&
      newAccessCount >= PHASE_THRESHOLDS.formationToEvolution) {
    newPhase = MemoryPhase.EVOLUTION;
  } else if (newPhase === MemoryPhase.EVOLUTION &&
             newAccessCount >= PHASE_THRESHOLDS.evolutionToRetrieval) {
    newPhase = MemoryPhase.RETRIEVAL;
  }

  return {
    ...memory,
    lastAccessedAt: now,
    accessCount: newAccessCount,
    decayScore: newDecayScore,
    phase: newPhase
  };
}

/**
 * Check if a memory should be considered expired
 */
export function isMemoryExpired(memory: MemoryRecord): boolean {
  const now = Date.now();
  const age = now - memory.createdAt;
  const maxAge = MEMORY_RETENTION_MS[memory.type];
  const decayThreshold = 0.1;

  // Expired if: too old OR decayed below threshold
  return age > maxAge || calculateDecay(memory) < decayThreshold;
}
