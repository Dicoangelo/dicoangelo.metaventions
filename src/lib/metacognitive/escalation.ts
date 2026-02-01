/**
 * Model Escalation Manager
 *
 * Phase 7 - Metacognitive State Vector Integration
 * US-004: Add model escalation logic (low confidence -> Opus)
 *
 * Handles automatic model escalation based on confidence thresholds:
 * - Haiku (< 0.6 confidence) -> Sonnet
 * - Sonnet (< 0.5 confidence) -> Opus
 * - Opus -> No escalation (top of hierarchy)
 *
 * Features:
 * - Configurable thresholds per model
 * - Escalation event logging with reasons
 * - Callback system for escalation events
 * - Enable/disable via configuration
 */

import { EscalationEvent } from './types';
import { isEscalationEnabled, isDebugEnabled, METACOGNITIVE_CONFIG } from './config';

/**
 * Model types in the escalation hierarchy.
 */
export type Model = 'haiku' | 'sonnet' | 'opus';

/**
 * Confidence thresholds for each model.
 * When confidence falls below the threshold, escalation is triggered.
 */
export interface EscalationThresholds {
  /** Haiku escalates to Sonnet when confidence < 0.6 */
  haiku: number;
  /** Sonnet escalates to Opus when confidence < 0.5 */
  sonnet: number;
  /** Opus never escalates (top of hierarchy) */
  opus: number;
}

/**
 * Result of an escalation evaluation.
 */
export interface EscalationResult {
  /** Whether escalation should occur */
  shouldEscalate: boolean;
  /** Current model before escalation */
  fromModel: Model;
  /** Target model after escalation (null if no escalation needed) */
  toModel: Model | null;
  /** Reason for escalation decision */
  reason: string;
  /** Confidence value that triggered evaluation */
  confidence: number;
  /** Timestamp of the evaluation */
  timestamp: number;
}

/**
 * Callback type for escalation events.
 */
export type EscalationCallback = (event: EscalationEvent) => void;

/**
 * Default escalation thresholds per model.
 *
 * Based on acceptance criteria:
 * - Haiku: < 0.6 confidence triggers escalation to Sonnet
 * - Sonnet: < 0.5 confidence triggers escalation to Opus
 * - Opus: 0 (never escalates, always at top)
 */
const DEFAULT_THRESHOLDS: EscalationThresholds = {
  haiku: 0.6,
  sonnet: 0.5,
  opus: 0, // Never escalates
};

/**
 * Model hierarchy from lowest to highest capability.
 */
const MODEL_HIERARCHY: readonly Model[] = ['haiku', 'sonnet', 'opus'] as const;

/**
 * Model Escalation Manager
 *
 * Manages automatic model escalation based on confidence levels.
 * When confidence drops below model-specific thresholds, escalation
 * to a more capable model is recommended/executed.
 *
 * @example
 * ```typescript
 * import { escalationManager } from './escalation';
 *
 * // Register escalation callback
 * escalationManager.onEscalation((event) => {
 *   console.log(`Escalated from ${event.fromModel} to ${event.toModel}`);
 * });
 *
 * // Evaluate if escalation needed
 * const result = escalationManager.evaluate(0.45, 'sonnet');
 * if (result.shouldEscalate) {
 *   // Handle escalation
 * }
 *
 * // Or directly escalate (logs and triggers callbacks)
 * const event = escalationManager.escalate(0.45, 'sonnet', 'Low confidence on complex query');
 * ```
 */
export class ModelEscalationManager {
  private thresholds: EscalationThresholds;
  private enabled: boolean;
  private callbacks: EscalationCallback[] = [];
  private escalationLog: EscalationEvent[] = [];

  /**
   * Create a new ModelEscalationManager.
   *
   * @param thresholds - Optional custom thresholds (defaults to standard thresholds)
   */
  constructor(thresholds?: Partial<EscalationThresholds>) {
    this.thresholds = {
      ...DEFAULT_THRESHOLDS,
      ...thresholds,
    };
    this.enabled = isEscalationEnabled();
  }

  /**
   * Evaluate whether escalation is needed based on confidence and current model.
   *
   * Does NOT trigger callbacks or log the event. Use `escalate()` for that.
   *
   * @param confidence - Current confidence value (0.0-1.0)
   * @param currentModel - Current model being used
   * @returns EscalationResult with decision details
   */
  evaluate(confidence: number, currentModel: Model): EscalationResult {
    const normalizedModel = currentModel.toLowerCase() as Model;
    const timestamp = Date.now();

    // Validate model
    if (!MODEL_HIERARCHY.includes(normalizedModel)) {
      return {
        shouldEscalate: false,
        fromModel: normalizedModel,
        toModel: null,
        reason: `Unknown model: ${currentModel}`,
        confidence,
        timestamp,
      };
    }

    // Check if escalation is enabled
    if (!this.enabled) {
      return {
        shouldEscalate: false,
        fromModel: normalizedModel,
        toModel: null,
        reason: 'Escalation disabled via configuration',
        confidence,
        timestamp,
      };
    }

    // Get threshold for current model
    const threshold = this.thresholds[normalizedModel];

    // Opus never escalates
    if (normalizedModel === 'opus') {
      return {
        shouldEscalate: false,
        fromModel: normalizedModel,
        toModel: null,
        reason: 'Opus is top-tier model, no escalation possible',
        confidence,
        timestamp,
      };
    }

    // Check if confidence is below threshold
    const shouldEscalate = confidence < threshold;
    const toModel = shouldEscalate ? this.getNextModel(normalizedModel) : null;

    let reason: string;
    if (shouldEscalate) {
      reason = `Confidence ${confidence.toFixed(3)} below ${normalizedModel} threshold ${threshold}`;
    } else {
      reason = `Confidence ${confidence.toFixed(3)} meets ${normalizedModel} threshold ${threshold}`;
    }

    if (isDebugEnabled()) {
      console.log(
        `[EscalationManager] Evaluate: ${normalizedModel} @ ${confidence.toFixed(3)} => ${shouldEscalate ? `ESCALATE to ${toModel}` : 'NO ESCALATION'}`
      );
    }

    return {
      shouldEscalate,
      fromModel: normalizedModel,
      toModel,
      reason,
      confidence,
      timestamp,
    };
  }

  /**
   * Execute escalation: evaluate, log the event, and trigger callbacks.
   *
   * @param confidence - Current confidence value (0.0-1.0)
   * @param currentModel - Current model being used
   * @param reason - Optional custom reason for the escalation
   * @returns EscalationEvent if escalation occurred, null otherwise
   */
  escalate(
    confidence: number,
    currentModel: Model,
    reason?: string
  ): EscalationEvent | null {
    const result = this.evaluate(confidence, currentModel);

    if (!result.shouldEscalate || !result.toModel) {
      return null;
    }

    // Create escalation event
    const event: EscalationEvent = {
      fromModel: result.fromModel,
      toModel: result.toModel,
      reason: reason ?? result.reason,
      confidence: result.confidence,
      timestamp: result.timestamp,
    };

    // Log the event
    this.escalationLog.unshift(event);

    // Trim log if needed
    if (this.escalationLog.length > METACOGNITIVE_CONFIG.monitoring.maxHistorySize) {
      this.escalationLog = this.escalationLog.slice(
        0,
        METACOGNITIVE_CONFIG.monitoring.maxHistorySize
      );
    }

    if (isDebugEnabled()) {
      console.log(
        `[EscalationManager] Escalation: ${event.fromModel} -> ${event.toModel} (confidence: ${event.confidence.toFixed(3)}, reason: ${event.reason})`
      );
    }

    // Trigger callbacks
    for (const callback of this.callbacks) {
      try {
        callback(event);
      } catch (error) {
        if (isDebugEnabled()) {
          console.error('[EscalationManager] Callback error:', error);
        }
      }
    }

    return event;
  }

  /**
   * Register a callback to be invoked when escalation occurs.
   *
   * @param callback - The callback function to register
   * @returns Unsubscribe function to remove the callback
   */
  onEscalation(callback: EscalationCallback): () => void {
    this.callbacks.push(callback);

    // Return unsubscribe function
    return () => {
      const index = this.callbacks.indexOf(callback);
      if (index !== -1) {
        this.callbacks.splice(index, 1);
      }
    };
  }

  /**
   * Enable or disable escalation.
   *
   * @param enabled - Whether escalation should be enabled
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;

    if (isDebugEnabled()) {
      console.log(`[EscalationManager] Escalation ${enabled ? 'enabled' : 'disabled'}`);
    }
  }

  /**
   * Check if escalation is currently enabled.
   *
   * @returns True if escalation is enabled
   */
  isEnabled(): boolean {
    return this.enabled;
  }

  /**
   * Get the escalation event history.
   *
   * @returns Array of escalation events, newest first
   */
  getHistory(): ReadonlyArray<EscalationEvent> {
    return [...this.escalationLog];
  }

  /**
   * Clear the escalation history.
   */
  clearHistory(): void {
    this.escalationLog = [];
  }

  /**
   * Get the next model in the escalation hierarchy.
   *
   * @param current - Current model
   * @returns Next model in hierarchy, or null if at top
   */
  getNextModel(current: Model): Model | null {
    const currentIndex = MODEL_HIERARCHY.indexOf(current);

    if (currentIndex === -1 || currentIndex === MODEL_HIERARCHY.length - 1) {
      return null;
    }

    return MODEL_HIERARCHY[currentIndex + 1];
  }

  /**
   * Get the current thresholds.
   *
   * @returns Current escalation thresholds
   */
  getThresholds(): Readonly<EscalationThresholds> {
    return { ...this.thresholds };
  }

  /**
   * Update escalation thresholds.
   *
   * @param thresholds - Partial thresholds to update
   */
  setThresholds(thresholds: Partial<EscalationThresholds>): void {
    this.thresholds = {
      ...this.thresholds,
      ...thresholds,
    };

    if (isDebugEnabled()) {
      console.log('[EscalationManager] Thresholds updated:', this.thresholds);
    }
  }

  /**
   * Get the number of registered callbacks.
   *
   * @returns Number of callbacks
   */
  getCallbackCount(): number {
    return this.callbacks.length;
  }

  /**
   * Remove all registered callbacks.
   */
  clearCallbacks(): void {
    this.callbacks = [];
  }
}

/**
 * Default escalation manager instance.
 *
 * Pre-configured with default thresholds:
 * - Haiku: < 0.6 -> Sonnet
 * - Sonnet: < 0.5 -> Opus
 *
 * @example
 * ```typescript
 * import { escalationManager } from './escalation';
 *
 * // Check if escalation needed
 * const result = escalationManager.evaluate(0.55, 'haiku');
 * // result.shouldEscalate === true
 * // result.toModel === 'sonnet'
 *
 * // Execute escalation with logging
 * const event = escalationManager.escalate(0.55, 'haiku');
 * ```
 */
export const escalationManager = new ModelEscalationManager();
