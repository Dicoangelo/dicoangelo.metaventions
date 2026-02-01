/**
 * Adaptive Memory Lifecycle Module
 *
 * Phase 8 - Memory types and lifecycle management
 *
 * This module provides tools for classifying and managing memories
 * based on cognitive science principles:
 * - FACTUAL: Facts, definitions, concepts (long retention)
 * - EXPERIENTIAL: Events, experiences, episodes (medium retention)
 * - WORKING: Temporary, task-specific (short retention)
 */

// Core types and enums
export {
  MemoryType,
  MemoryPhase,
  MEMORY_DECAY_RATES,
  MEMORY_RETENTION_MS,
  PHASE_THRESHOLDS,
  generateMemoryId,
  createMemoryRecord,
  calculateDecay,
  reinforceMemory,
  isMemoryExpired,
  type MemoryRecord,
  type TypeDetectionResult,
  type CreateMemoryOptions,
  type MemorySearchOptions,
  type MemoryStats,
} from './types';

// Type detection heuristics
export {
  detectMemoryType,
  detectMemoryTypeWithExplanation,
  detectMemoryTypes,
  isStrongMatch,
} from './type-detector';

// Decay system
export {
  MemoryDecayManager,
  decayManager,
  DEFAULT_HALF_LIVES,
  DEFAULT_MINIMUM_DECAY,
  ACCESS_BOOST_MULTIPLIER,
  MAX_DECAY_SCORE,
  type DecayConfig,
} from './decay';

// Configuration
export {
  MEMORY_CONFIG,
  getConfigValue,
  validateConfig,
  getConfigSummary,
  type MemoryConfigType,
} from './config';

// Relevance scoring
export {
  RelevanceScorer,
  relevanceScorer,
  type RelevanceFactors,
  type RelevanceConfig,
} from './relevance';

// Consolidation pipeline
export {
  ConsolidationPipeline,
  consolidationPipeline,
  consolidateMemory,
  advancePhase,
  isReadyForTransition,
  CONSOLIDATION_THRESHOLDS,
  type TransitionCheckResult,
  type ConsolidationResult,
  type ConsolidationConfig,
} from './consolidation';

// Forgetting mechanism
export {
  ForgettingManager,
  forgettingManager,
  PRUNE_DECAY_THRESHOLD,
  PRUNE_RELEVANCE_THRESHOLD,
  ARCHIVE_RETENTION_DAYS,
  isArchivedMemory,
  getDaysUntilHardDelete,
  getDaysSinceArchival,
  formatPruningSummary,
  type ArchivedMemoryRecord,
  type PruneConfig,
  type PruningSummary,
  type ArchiveSummary,
  type PruneInterval,
  type PruneCallback,
} from './forgetting';

// Lifecycle dashboard (US-007)
export {
  MemoryLifecycleDashboard,
  lifecycleDashboard,
  createDashboard,
  getMemoryCountsByType,
  getMemoryCountsByPhase,
  getDecayDistribution,
  getAtRiskMemories,
  formatDashboardForCLI,
  type MemoryCountsByType,
  type MemoryCountsByPhase,
  type DecayBucket,
  type DecayDistribution,
  type AtRiskMemory,
  type DashboardReport,
} from './dashboard';

// Memory replay system (US-006)
export {
  MemoryReplayManager,
  replayManager,
  REPLAY_RELEVANCE_THRESHOLD,
  REPLAY_DECAY_THRESHOLD,
  REPLAY_BOOST,
  REPLAY_INTERVALS,
  MAX_REPLAY_BOX,
  formatReplaySchedule,
  formatReplayStats,
  getBoxLabel,
  calculateOptimalReplayTime,
  type ReplayableMemory,
  type ReplayResult,
  type ScheduledReplay,
  type ReplayConfig,
  type ReplayStats,
} from './replay';

// Health monitoring (US-008)
export {
  MemoryHealthMonitor,
  healthMonitor,
  createHealthMonitor,
  quickHealthCheck,
  getHealthMetrics,
  formatHealthReportForCLI,
  createPruningHistoryEntry,
  createConsolidationHistoryEntry,
  DEFAULT_HEALTH_CONFIG,
  type HealthMetrics,
  type PruningHistoryEntry,
  type ConsolidationHistoryEntry,
  type HealthStatus,
  type HealthCheckResult,
  type HealthAlert,
  type HealthConfig,
} from './health';
