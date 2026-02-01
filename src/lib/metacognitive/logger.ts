/**
 * DQ Score Logger Module
 *
 * Logs DQ scores with confidence tracking and reasoning mode.
 * Part of Phase 7 - Metacognitive State Vector Integration.
 *
 * Output format: [DQ:X.XX C:X.XX S1] or [DQ:X.XX C:X.XX S2]
 */

import { DQScore, getDQCategory } from './dq-score';
import { getConfidenceLevel } from './confidence';
import { modeTracker } from './mode-tracker';
import { ReasoningMode } from './types';

/**
 * Environment detection for conditional logging.
 */
const isDevelopment = process.env.NODE_ENV === 'development';

/**
 * Log DQ score to console in development mode.
 *
 * Format: [DQ:0.75 C:0.85 S1] or [DQ:0.75 C:0.85 S2]
 *
 * Also updates the mode tracker based on confidence.
 *
 * @param score - The DQ score to log
 * @param model - Optional current model name for tracking
 */
export function logDQScore(score: DQScore, model?: string): void {
  // Update mode tracker based on confidence
  modeTracker.updateFromConfidence(score.confidence, model);

  if (!isDevelopment) {
    return;
  }

  // Primary format: [DQ:0.75 C:0.85 S1]
  const display = modeTracker.getRoutingDisplay(score.overall, score.confidence);
  console.log(display);
}

/**
 * Log detailed DQ score breakdown to console in development mode.
 *
 * @param score - The DQ score to log
 * @param options - Optional configuration
 */
export function logDQScoreDetailed(
  score: DQScore,
  options: { label?: string; includeBreakdown?: boolean } = {}
): void {
  if (!isDevelopment) {
    return;
  }

  const { label, includeBreakdown = true } = options;
  const dqCategory = getDQCategory(score.overall);
  const confidenceLevel = getConfidenceLevel(score.confidence);

  const prefix = label ? `[${label}] ` : '';

  console.log(
    `${prefix}[DQ:${score.overall.toFixed(2)} C:${score.confidence.toFixed(2)}] ` +
      `(${dqCategory}/${confidenceLevel})`
  );

  if (includeBreakdown) {
    console.log(
      `  Validity: ${(score.validity * 100).toFixed(0)}% | ` +
        `Specificity: ${(score.specificity * 100).toFixed(0)}% | ` +
        `Correctness: ${(score.correctness * 100).toFixed(0)}%`
    );
  }
}

/**
 * Log entry for structured logging.
 */
export interface DQLogEntry {
  timestamp: string;
  dqScore: number;
  confidence: number;
  validity: number;
  specificity: number;
  correctness: number;
  dqCategory: ReturnType<typeof getDQCategory>;
  confidenceLevel: ReturnType<typeof getConfidenceLevel>;
  mode: ReasoningMode;
  modeLabel: 'System 1' | 'System 2';
}

/**
 * Create a structured log entry from a DQ score.
 *
 * @param score - The DQ score to convert
 * @returns Structured log entry with mode information
 */
export function createLogEntry(score: DQScore): DQLogEntry {
  const mode = modeTracker.getMode();
  return {
    timestamp: new Date().toISOString(),
    dqScore: score.overall,
    confidence: score.confidence,
    validity: score.validity,
    specificity: score.specificity,
    correctness: score.correctness,
    dqCategory: getDQCategory(score.overall),
    confidenceLevel: getConfidenceLevel(score.confidence),
    mode,
    modeLabel: mode === ReasoningMode.SYSTEM_1 ? 'System 1' : 'System 2',
  };
}

/**
 * Log DQ score as JSON for structured logging systems.
 *
 * @param score - The DQ score to log
 */
export function logDQScoreJSON(score: DQScore): void {
  if (!isDevelopment) {
    return;
  }

  const entry = createLogEntry(score);
  console.log(JSON.stringify(entry));
}

/**
 * Format DQ score as a compact string with mode indicator.
 *
 * @param score - The DQ score to format
 * @param mode - Optional mode override (uses current tracker mode if not provided)
 * @returns Formatted string like "[DQ:0.75 C:0.85 S1]"
 */
export function formatDQScore(score: DQScore, mode?: ReasoningMode): string {
  const currentMode = mode ?? modeTracker.getMode();
  return `[DQ:${score.overall.toFixed(2)} C:${score.confidence.toFixed(2)} ${currentMode}]`;
}

/**
 * Format DQ score with category labels and mode.
 *
 * @param score - The DQ score to format
 * @param mode - Optional mode override (uses current tracker mode if not provided)
 * @returns Formatted string like "[DQ:0.75 (good) C:0.85 (high) S1]"
 */
export function formatDQScoreWithLabels(score: DQScore, mode?: ReasoningMode): string {
  const dqCategory = getDQCategory(score.overall);
  const confidenceLevel = getConfidenceLevel(score.confidence);
  const currentMode = mode ?? modeTracker.getMode();

  return (
    `[DQ:${score.overall.toFixed(2)} (${dqCategory}) ` +
    `C:${score.confidence.toFixed(2)} (${confidenceLevel}) ${currentMode}]`
  );
}

/**
 * Logger configuration options.
 */
export interface LoggerConfig {
  /** Enable/disable logging (overrides environment check) */
  enabled?: boolean;
  /** Include timestamp in logs */
  includeTimestamp?: boolean;
  /** Use JSON format for structured logging */
  jsonFormat?: boolean;
  /** Include detailed breakdown */
  detailed?: boolean;
}

/**
 * Configurable DQ score logger.
 */
export class DQScoreLogger {
  private config: Required<LoggerConfig>;

  constructor(config: LoggerConfig = {}) {
    this.config = {
      enabled: config.enabled ?? isDevelopment,
      includeTimestamp: config.includeTimestamp ?? false,
      jsonFormat: config.jsonFormat ?? false,
      detailed: config.detailed ?? false,
    };
  }

  /**
   * Log a DQ score based on logger configuration.
   *
   * @param score - The DQ score to log
   * @param label - Optional label prefix
   */
  log(score: DQScore, label?: string): void {
    if (!this.config.enabled) {
      return;
    }

    if (this.config.jsonFormat) {
      const entry = createLogEntry(score);
      if (label) {
        console.log(JSON.stringify({ ...entry, label }));
      } else {
        console.log(JSON.stringify(entry));
      }
      return;
    }

    const parts: string[] = [];

    if (this.config.includeTimestamp) {
      parts.push(`[${new Date().toISOString()}]`);
    }

    if (label) {
      parts.push(`[${label}]`);
    }

    parts.push(formatDQScore(score));

    if (this.config.detailed) {
      const dqCategory = getDQCategory(score.overall);
      const confidenceLevel = getConfidenceLevel(score.confidence);
      parts.push(`(${dqCategory}/${confidenceLevel})`);
    }

    console.log(parts.join(' '));

    if (this.config.detailed) {
      console.log(
        `  V:${(score.validity * 100).toFixed(0)}% ` +
          `S:${(score.specificity * 100).toFixed(0)}% ` +
          `C:${(score.correctness * 100).toFixed(0)}%`
      );
    }
  }

  /**
   * Update logger configuration.
   *
   * @param config - New configuration options
   */
  configure(config: Partial<LoggerConfig>): void {
    this.config = { ...this.config, ...config };
  }
}

/**
 * Default logger instance.
 */
export const defaultLogger = new DQScoreLogger();
