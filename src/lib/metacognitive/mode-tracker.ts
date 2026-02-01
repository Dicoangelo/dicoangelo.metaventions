/**
 * Mode Tracker Module
 *
 * Phase 7 - Metacognitive State Vector Integration
 * US-007: System 1/System 2 mode indicator
 *
 * Tracks reasoning mode based on dual-process theory:
 * - System 1 (S1): Fast, intuitive, automatic - high confidence
 * - System 2 (S2): Slow, deliberate, analytical - low confidence
 *
 * Features:
 * - Mode state tracking with transitions
 * - Callback system for mode change events
 * - Routing display format integration
 * - Mode distribution statistics
 */

import { ReasoningMode, ModeTrigger } from './types';
import { isDebugEnabled, METACOGNITIVE_CONFIG } from './config';

/**
 * Mode transition event logged when switching between S1 and S2.
 */
export interface ModeTransition {
  /** Previous reasoning mode */
  from: ReasoningMode;
  /** New reasoning mode */
  to: ReasoningMode;
  /** What triggered the transition */
  trigger: ModeTrigger;
  /** Unix timestamp of the transition */
  timestamp: number;
  /** Confidence value at time of transition */
  confidence?: number;
  /** Current model being used */
  model?: string;
}

/**
 * Callback type for mode transition events.
 */
export type ModeTransitionCallback = (transition: ModeTransition) => void;

/**
 * Confidence threshold for mode determination.
 * Above this threshold = System 1 (fast thinking)
 * Below this threshold = System 2 (slow thinking)
 */
const MODE_CONFIDENCE_THRESHOLD = 0.6;

/**
 * Mode Tracker
 *
 * Tracks reasoning mode (System 1 vs System 2) based on confidence levels.
 * System 1 is used for high-confidence, fast thinking tasks.
 * System 2 is used for low-confidence, deliberate thinking tasks.
 *
 * @example
 * ```typescript
 * import { modeTracker } from './mode-tracker';
 *
 * // Register transition callback
 * modeTracker.onTransition((transition) => {
 *   console.log(`Mode changed: ${transition.from} -> ${transition.to}`);
 * });
 *
 * // Update mode based on confidence
 * modeTracker.updateFromConfidence(0.45, 'sonnet');
 * // Logs: [ModeTracker] Transition: S1 -> S2 (confidence: 0.450, trigger: low_confidence)
 *
 * // Get routing display string
 * const display = modeTracker.getRoutingDisplay(0.75, 0.45);
 * // Returns: "[DQ:0.75 C:0.45 S2]"
 * ```
 */
export class ModeTracker {
  private currentMode: ReasoningMode;
  private transitions: ModeTransition[] = [];
  private callbacks: ModeTransitionCallback[] = [];
  private startTime: number;
  private modeStartTime: number;
  private modeTimeAccumulator: { [key in ReasoningMode]: number } = {
    [ReasoningMode.SYSTEM_1]: 0,
    [ReasoningMode.SYSTEM_2]: 0,
  };

  /**
   * Create a new ModeTracker.
   *
   * @param initialMode - Optional initial mode (defaults to SYSTEM_1)
   */
  constructor(initialMode: ReasoningMode = ReasoningMode.SYSTEM_1) {
    this.currentMode = initialMode;
    this.startTime = Date.now();
    this.modeStartTime = this.startTime;
  }

  /**
   * Get the current reasoning mode.
   *
   * @returns Current mode (SYSTEM_1 or SYSTEM_2)
   */
  getMode(): ReasoningMode {
    return this.currentMode;
  }

  /**
   * Get the mode display string for CLI output.
   *
   * @returns Mode indicator string: "[S1]" or "[S2]"
   */
  getModeDisplay(): string {
    return `[${this.currentMode}]`;
  }

  /**
   * Get the full routing display string including DQ score, confidence, and mode.
   *
   * Format: [DQ:X.XX C:X.XX S1] or [DQ:X.XX C:X.XX S2]
   *
   * @param dqScore - The DQ score (0.0 to 1.0)
   * @param confidence - The confidence score (0.0 to 1.0)
   * @returns Formatted routing display string
   */
  getRoutingDisplay(dqScore: number, confidence: number): string {
    const dqFormatted = dqScore.toFixed(2);
    const confidenceFormatted = confidence.toFixed(2);
    return `[DQ:${dqFormatted} C:${confidenceFormatted} ${this.currentMode}]`;
  }

  /**
   * Set the reasoning mode explicitly.
   *
   * If the mode is different from current, logs a transition event
   * and triggers all registered callbacks.
   *
   * @param mode - New reasoning mode
   * @param trigger - What caused the mode change
   * @param metadata - Optional additional data (confidence, model)
   */
  setMode(
    mode: ReasoningMode,
    trigger: ModeTrigger,
    metadata?: { confidence?: number; model?: string }
  ): void {
    if (mode === this.currentMode) {
      return;
    }

    const timestamp = Date.now();

    // Accumulate time spent in previous mode
    const timeInPreviousMode = timestamp - this.modeStartTime;
    this.modeTimeAccumulator[this.currentMode] += timeInPreviousMode;

    // Create transition event
    const transition: ModeTransition = {
      from: this.currentMode,
      to: mode,
      trigger,
      timestamp,
      confidence: metadata?.confidence,
      model: metadata?.model,
    };

    // Update state
    this.currentMode = mode;
    this.modeStartTime = timestamp;

    // Log transition
    this.transitions.unshift(transition);

    // Trim history if needed
    if (this.transitions.length > METACOGNITIVE_CONFIG.monitoring.maxHistorySize) {
      this.transitions = this.transitions.slice(
        0,
        METACOGNITIVE_CONFIG.monitoring.maxHistorySize
      );
    }

    if (isDebugEnabled()) {
      const confidenceStr = metadata?.confidence
        ? ` (confidence: ${metadata.confidence.toFixed(3)})`
        : '';
      const modelStr = metadata?.model ? ` [${metadata.model}]` : '';
      console.log(
        `[ModeTracker] Transition: ${transition.from} -> ${transition.to}${confidenceStr}${modelStr}, trigger: ${trigger}`
      );
    }

    // Trigger callbacks
    for (const callback of this.callbacks) {
      try {
        callback(transition);
      } catch (error) {
        if (isDebugEnabled()) {
          console.error('[ModeTracker] Callback error:', error);
        }
      }
    }
  }

  /**
   * Determine the appropriate mode based on confidence level.
   *
   * System 1 (fast) for high confidence (>= 0.6)
   * System 2 (slow) for low confidence (< 0.6)
   *
   * @param confidence - The confidence score (0.0 to 1.0)
   * @returns Appropriate reasoning mode
   */
  determineModeFromConfidence(confidence: number): ReasoningMode {
    return confidence >= MODE_CONFIDENCE_THRESHOLD
      ? ReasoningMode.SYSTEM_1
      : ReasoningMode.SYSTEM_2;
  }

  /**
   * Update mode automatically based on confidence level.
   *
   * Convenience method that determines the appropriate mode
   * from confidence and sets it with the 'low_confidence' trigger.
   *
   * @param confidence - The confidence score (0.0 to 1.0)
   * @param model - Optional current model name
   */
  updateFromConfidence(confidence: number, model?: string): void {
    const newMode = this.determineModeFromConfidence(confidence);
    const trigger: ModeTrigger =
      confidence < MODE_CONFIDENCE_THRESHOLD ? 'low_confidence' : 'initial';

    this.setMode(newMode, trigger, { confidence, model });
  }

  /**
   * Register a callback to be invoked when mode transitions occur.
   *
   * @param callback - The callback function to register
   * @returns Unsubscribe function to remove the callback
   */
  onTransition(callback: ModeTransitionCallback): () => void {
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
   * Get the transition history.
   *
   * @returns Array of transitions, newest first
   */
  getTransitions(): ReadonlyArray<ModeTransition> {
    return [...this.transitions];
  }

  /**
   * Get the distribution of time spent in each mode.
   *
   * @returns Object with percentages for System 1 and System 2
   */
  getModeDistribution(): { system1Percent: number; system2Percent: number } {
    // Include current session time
    const currentTime = Date.now();
    const currentModeTime = currentTime - this.modeStartTime;

    const system1Time =
      this.modeTimeAccumulator[ReasoningMode.SYSTEM_1] +
      (this.currentMode === ReasoningMode.SYSTEM_1 ? currentModeTime : 0);

    const system2Time =
      this.modeTimeAccumulator[ReasoningMode.SYSTEM_2] +
      (this.currentMode === ReasoningMode.SYSTEM_2 ? currentModeTime : 0);

    const totalTime = system1Time + system2Time;

    if (totalTime === 0) {
      return { system1Percent: 100, system2Percent: 0 };
    }

    return {
      system1Percent: Math.round((system1Time / totalTime) * 100),
      system2Percent: Math.round((system2Time / totalTime) * 100),
    };
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
   * Clear the transition history.
   */
  clearHistory(): void {
    this.transitions = [];
  }

  /**
   * Reset the tracker to initial state.
   *
   * @param mode - Optional new initial mode (defaults to SYSTEM_1)
   */
  reset(mode: ReasoningMode = ReasoningMode.SYSTEM_1): void {
    this.currentMode = mode;
    this.transitions = [];
    this.startTime = Date.now();
    this.modeStartTime = this.startTime;
    this.modeTimeAccumulator = {
      [ReasoningMode.SYSTEM_1]: 0,
      [ReasoningMode.SYSTEM_2]: 0,
    };
  }

  /**
   * Get current state as a serializable object.
   *
   * @returns Current mode state
   */
  getState(): {
    mode: ReasoningMode;
    modeLabel: string;
    timestamp: number;
    transitionCount: number;
    distribution: { system1Percent: number; system2Percent: number };
  } {
    return {
      mode: this.currentMode,
      modeLabel: this.currentMode === ReasoningMode.SYSTEM_1 ? 'System 1' : 'System 2',
      timestamp: Date.now(),
      transitionCount: this.transitions.length,
      distribution: this.getModeDistribution(),
    };
  }
}

/**
 * Default mode tracker instance.
 *
 * Pre-configured and ready to use.
 *
 * @example
 * ```typescript
 * import { modeTracker } from './mode-tracker';
 *
 * // Check current mode
 * const mode = modeTracker.getMode(); // 'S1' or 'S2'
 *
 * // Get display string
 * const display = modeTracker.getRoutingDisplay(0.75, 0.85);
 * // "[DQ:0.75 C:0.85 S1]"
 *
 * // Update from confidence
 * modeTracker.updateFromConfidence(0.45);
 * // Now in System 2 mode
 * ```
 */
export const modeTracker = new ModeTracker();
