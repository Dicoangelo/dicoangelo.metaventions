/**
 * Metacognitive State Vector Module
 *
 * Phase 7 - Metacognitive State Vector Integration
 *
 * This module provides tools for tracking AI confidence levels
 * and calculating Data Quality (DQ) scores with confidence tracking.
 */

// Confidence tracking
export {
  calculateConfidence,
  getConfidenceLevel,
  analyzeConfidence,
  type ConfidenceAnalysis,
} from './confidence';

// DQ Score calculation
export {
  calculateDQScore,
  calculateDQScoreLegacy,
  quickDQScore,
  getDQCategory,
  type DQScore,
} from './dq-score';

// Logging utilities
export {
  logDQScore,
  logDQScoreDetailed,
  logDQScoreJSON,
  formatDQScore,
  formatDQScoreWithLabels,
  createLogEntry,
  DQScoreLogger,
  defaultLogger,
  type DQLogEntry,
  type LoggerConfig,
} from './logger';

// Configuration
export {
  METACOGNITIVE_CONFIG,
  getConfig,
  isDebugEnabled,
  isEscalationEnabled,
  getDefaultThreshold,
  type MetacognitiveConfig,
} from './config';

// Threshold detection
export {
  ConfidenceThresholdDetector,
  defaultDetector,
  type ThresholdBreachCallback,
  type ThresholdDetectorConfig,
  type ConfidenceCheckResult,
  type BreachEvent,
} from './threshold-detector';

// Confidence history tracking (US-006)
export {
  ConfidenceHistoryTracker,
  historyTracker,
  type ConfidenceReading,
  type ConfidenceHistory,
  type ConfidenceStats,
} from './history';

// Model escalation (US-004)
export {
  ModelEscalationManager,
  escalationManager,
  type Model,
  type EscalationThresholds,
  type EscalationResult,
  type EscalationCallback,
} from './escalation';

// Mode tracking (US-007)
export {
  ModeTracker,
  modeTracker,
  type ModeTransition,
  type ModeTransitionCallback,
} from './mode-tracker';

// Metacognitive alerts (US-008)
export {
  MetacognitiveAlertManager,
  alertManager,
  type AlertMode,
  type AlertType,
  type ModeAlert,
  type AlertConfig,
  type AlertCallback,
} from './alerts';

// Metacognitive state types (from pre-existing types.ts)
export {
  ReasoningMode,
  System1Mode,
  System2Mode,
  CONFIDENCE_THRESHOLDS,
  shouldEscalate,
  getEscalationTarget,
  calculateDQComposite,
  createInitialState,
  getConfidenceLevel as getConfidenceLevelLegacy,
  type ConfidenceLevel,
  type ModeTrigger,
  type MetacognitiveState,
  type EscalationEvent,
  type ModelName,
  type DQScore as DQScoreLegacy,
} from './types';
