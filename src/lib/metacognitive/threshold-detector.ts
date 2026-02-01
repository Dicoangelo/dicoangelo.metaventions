/**
 * Confidence Threshold Detection Module
 *
 * Real-time confidence monitoring with configurable thresholds
 * and breach callbacks. Part of Phase 7 - Metacognitive State Vector Integration.
 *
 * Features:
 * - Configurable confidence threshold (default: 0.6)
 * - Real-time confidence monitoring during response generation
 * - Threshold breach triggers callback/event for downstream handling
 * - Threshold can be adjusted via config or CONFIDENCE_THRESHOLD env var
 */

import { METACOGNITIVE_CONFIG, getDefaultThreshold, isDebugEnabled } from './config';

/**
 * Callback function type for threshold breach events.
 *
 * @param confidence - The confidence value that triggered the breach
 * @param threshold - The threshold that was breached
 * @param context - Optional context about where the breach occurred
 */
export type ThresholdBreachCallback = (
  confidence: number,
  threshold: number,
  context?: string
) => void;

/**
 * Configuration options for the threshold detector.
 */
export interface ThresholdDetectorConfig {
  /**
   * Default confidence threshold (0.0-1.0).
   * When confidence drops below this value, a breach is triggered.
   * @default 0.6 (or CONFIDENCE_THRESHOLD env var)
   */
  defaultThreshold?: number;

  /**
   * Initial breach callback to register.
   */
  onBreach?: ThresholdBreachCallback;
}

/**
 * Result of a confidence check or monitoring iteration.
 */
export interface ConfidenceCheckResult {
  /** The confidence value that was checked */
  confidence: number;
  /** Whether the confidence breached the threshold */
  breached: boolean;
  /** The threshold that was used for comparison */
  threshold: number;
  /** Timestamp of the check */
  timestamp: number;
}

/**
 * Breach event for history tracking.
 */
export interface BreachEvent {
  confidence: number;
  threshold: number;
  context?: string;
  timestamp: number;
}

/**
 * Confidence Threshold Detector
 *
 * Monitors confidence values and triggers callbacks when
 * the confidence drops below the configured threshold.
 *
 * @example
 * ```typescript
 * const detector = new ConfidenceThresholdDetector({ defaultThreshold: 0.6 });
 *
 * // Register breach callback
 * detector.onBreach((confidence, threshold, context) => {
 *   console.log(`Confidence ${confidence} breached threshold ${threshold}`);
 *   // Trigger escalation, alert, or other action
 * });
 *
 * // Check confidence values
 * detector.check(0.8); // Returns false (no breach)
 * detector.check(0.5, 'response-generation'); // Returns true (breach), triggers callback
 * ```
 */
export class ConfidenceThresholdDetector {
  private threshold: number;
  private callbacks: ThresholdBreachCallback[] = [];
  private breachHistory: BreachEvent[] = [];
  private lastBreachTime: number = 0;

  /**
   * Create a new ConfidenceThresholdDetector.
   *
   * @param config - Configuration options
   */
  constructor(config?: ThresholdDetectorConfig) {
    // Use provided threshold, or fall back to env var, or default
    this.threshold = config?.defaultThreshold ?? getDefaultThreshold();

    // Validate threshold is in valid range
    this.threshold = Math.max(
      METACOGNITIVE_CONFIG.minConfidence,
      Math.min(METACOGNITIVE_CONFIG.maxConfidence, this.threshold)
    );

    // Register initial callback if provided
    if (config?.onBreach) {
      this.callbacks.push(config.onBreach);
    }
  }

  /**
   * Set the confidence threshold dynamically.
   *
   * @param threshold - New threshold value (0.0-1.0)
   * @throws Error if threshold is outside valid range
   */
  setThreshold(threshold: number): void {
    if (threshold < METACOGNITIVE_CONFIG.minConfidence || threshold > METACOGNITIVE_CONFIG.maxConfidence) {
      throw new Error(
        `Threshold must be between ${METACOGNITIVE_CONFIG.minConfidence} and ${METACOGNITIVE_CONFIG.maxConfidence}`
      );
    }
    this.threshold = threshold;

    if (isDebugEnabled()) {
      console.log(`[ThresholdDetector] Threshold updated to ${threshold}`);
    }
  }

  /**
   * Get the current threshold.
   *
   * This method checks the CONFIDENCE_THRESHOLD environment variable first,
   * allowing runtime override of the threshold.
   *
   * @returns Current threshold value (0.0-1.0)
   */
  getThreshold(): number {
    // Check env var for runtime override
    const envThreshold = process.env.CONFIDENCE_THRESHOLD;
    if (envThreshold !== undefined && envThreshold !== '') {
      const parsed = parseFloat(envThreshold);
      if (!isNaN(parsed) && parsed >= 0 && parsed <= 1) {
        return parsed;
      }
    }
    return this.threshold;
  }

  /**
   * Check if a confidence value breaches the threshold.
   *
   * If the confidence is below the threshold, all registered callbacks
   * are triggered with the breach details.
   *
   * @param confidence - The confidence value to check (0.0-1.0)
   * @param context - Optional context string for the breach
   * @returns True if confidence breached the threshold, false otherwise
   */
  check(confidence: number, context?: string): boolean {
    const currentThreshold = this.getThreshold();
    const breached = confidence < currentThreshold;

    if (breached) {
      this.handleBreach(confidence, currentThreshold, context);
    }

    if (isDebugEnabled()) {
      console.log(
        `[ThresholdDetector] Check: ${confidence.toFixed(3)} vs ${currentThreshold} => ${breached ? 'BREACH' : 'OK'}`
      );
    }

    return breached;
  }

  /**
   * Register a callback to be invoked when confidence breaches threshold.
   *
   * @param callback - The callback function to register
   * @returns Unsubscribe function to remove the callback
   */
  onBreach(callback: ThresholdBreachCallback): () => void {
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
   * Monitor an async stream of confidence values.
   *
   * Yields results for each confidence value, indicating whether
   * the threshold was breached. Callbacks are triggered for breaches.
   *
   * @param confidenceStream - AsyncIterable of confidence values
   * @yields ConfidenceCheckResult for each value in the stream
   *
   * @example
   * ```typescript
   * async function* generateConfidences() {
   *   yield 0.9;
   *   yield 0.7;
   *   yield 0.4; // breach
   * }
   *
   * for await (const result of detector.monitor(generateConfidences())) {
   *   console.log(result);
   * }
   * ```
   */
  async *monitor(
    confidenceStream: AsyncIterable<number>
  ): AsyncGenerator<ConfidenceCheckResult> {
    for await (const confidence of confidenceStream) {
      const currentThreshold = this.getThreshold();
      const breached = this.check(confidence);

      yield {
        confidence,
        breached,
        threshold: currentThreshold,
        timestamp: Date.now(),
      };
    }
  }

  /**
   * Get the breach history.
   *
   * @returns Array of breach events, newest first
   */
  getBreachHistory(): ReadonlyArray<BreachEvent> {
    return [...this.breachHistory];
  }

  /**
   * Clear the breach history.
   */
  clearHistory(): void {
    this.breachHistory = [];
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

  /**
   * Handle a threshold breach by recording it and triggering callbacks.
   */
  private handleBreach(confidence: number, threshold: number, context?: string): void {
    const now = Date.now();

    // Debounce rapid breaches
    if (now - this.lastBreachTime < METACOGNITIVE_CONFIG.monitoring.debounceInterval) {
      return;
    }
    this.lastBreachTime = now;

    // Record breach in history
    const breachEvent: BreachEvent = {
      confidence,
      threshold,
      context,
      timestamp: now,
    };

    this.breachHistory.unshift(breachEvent);

    // Trim history if needed
    if (this.breachHistory.length > METACOGNITIVE_CONFIG.monitoring.maxHistorySize) {
      this.breachHistory = this.breachHistory.slice(0, METACOGNITIVE_CONFIG.monitoring.maxHistorySize);
    }

    // Trigger all callbacks
    for (const callback of this.callbacks) {
      try {
        callback(confidence, threshold, context);
      } catch (error) {
        if (isDebugEnabled()) {
          console.error('[ThresholdDetector] Callback error:', error);
        }
      }
    }
  }
}

/**
 * Default threshold detector instance.
 *
 * Pre-configured with default threshold from config/environment.
 * Use this for simple use cases; create custom instances for
 * specialized configurations.
 *
 * @example
 * ```typescript
 * import { defaultDetector } from './threshold-detector';
 *
 * // Register a breach handler
 * defaultDetector.onBreach((confidence, threshold) => {
 *   console.warn(`Low confidence: ${confidence}`);
 * });
 *
 * // Check confidence values
 * if (defaultDetector.check(0.5)) {
 *   // Handle breach
 * }
 * ```
 */
export const defaultDetector = new ConfidenceThresholdDetector();
