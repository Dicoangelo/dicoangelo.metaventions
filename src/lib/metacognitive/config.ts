/**
 * Metacognitive Configuration Module
 *
 * Centralized configuration for metacognitive state tracking.
 * Part of Phase 7 - Metacognitive State Vector Integration.
 *
 * Configuration can be overridden via environment variables:
 * - CONFIDENCE_THRESHOLD: Default confidence threshold (0.0-1.0)
 * - AUTO_ESCALATION: Enable/disable auto-escalation ('true'/'false')
 * - METACOGNITIVE_DEBUG: Enable debug logging ('true'/'false')
 */

/**
 * Parse a float from environment variable with fallback.
 */
function parseEnvFloat(key: string, defaultValue: number): number {
  const value = process.env[key];
  if (value === undefined || value === '') {
    return defaultValue;
  }
  const parsed = parseFloat(value);
  return isNaN(parsed) ? defaultValue : parsed;
}

/**
 * Parse a boolean from environment variable with fallback.
 */
function parseEnvBoolean(key: string, defaultValue: boolean): boolean {
  const value = process.env[key];
  if (value === undefined || value === '') {
    return defaultValue;
  }
  return value.toLowerCase() === 'true';
}

/**
 * Metacognitive system configuration.
 *
 * All values can be overridden via environment variables.
 */
export const METACOGNITIVE_CONFIG = {
  /**
   * Default confidence threshold for breach detection.
   * When confidence drops below this value, a breach event is triggered.
   * Override with CONFIDENCE_THRESHOLD environment variable.
   * @default 0.6
   */
  defaultConfidenceThreshold: parseEnvFloat('CONFIDENCE_THRESHOLD', 0.6),

  /**
   * Whether automatic escalation is enabled.
   * When enabled, low confidence automatically triggers model escalation.
   * Override with AUTO_ESCALATION environment variable.
   * @default true
   */
  escalationEnabled: parseEnvBoolean('AUTO_ESCALATION', true),

  /**
   * Enable debug logging for metacognitive operations.
   * Override with METACOGNITIVE_DEBUG environment variable.
   * @default false
   */
  debugEnabled: parseEnvBoolean('METACOGNITIVE_DEBUG', false),

  /**
   * Minimum confidence value (floor).
   * Confidence cannot go below this value.
   */
  minConfidence: 0.0,

  /**
   * Maximum confidence value (ceiling).
   * Confidence cannot exceed this value.
   */
  maxConfidence: 1.0,

  /**
   * Confidence thresholds for different severity levels.
   * Used for categorizing confidence breaches.
   */
  thresholds: {
    high: 0.8,
    medium: 0.6,
    low: 0.4,
    critical: 0.2,
  },

  /**
   * Monitoring configuration.
   */
  monitoring: {
    /**
     * Minimum interval between breach callbacks (ms).
     * Prevents callback spam during rapid confidence changes.
     * @default 100
     */
    debounceInterval: 100,

    /**
     * Maximum number of breach events to store in history.
     * @default 100
     */
    maxHistorySize: 100,
  },
} as const;

/**
 * Type for the metacognitive configuration object.
 */
export type MetacognitiveConfig = typeof METACOGNITIVE_CONFIG;

/**
 * Get a specific config value with type safety.
 *
 * @param key - The config key to retrieve
 * @returns The config value
 */
export function getConfig<K extends keyof MetacognitiveConfig>(
  key: K
): MetacognitiveConfig[K] {
  return METACOGNITIVE_CONFIG[key];
}

/**
 * Check if debug mode is enabled.
 *
 * @returns True if debug logging is enabled
 */
export function isDebugEnabled(): boolean {
  return METACOGNITIVE_CONFIG.debugEnabled;
}

/**
 * Check if escalation is enabled.
 *
 * @returns True if automatic escalation is enabled
 */
export function isEscalationEnabled(): boolean {
  return METACOGNITIVE_CONFIG.escalationEnabled;
}

/**
 * Get the default confidence threshold.
 * This checks the environment variable first for runtime override.
 *
 * @returns The default confidence threshold (0.0-1.0)
 */
export function getDefaultThreshold(): number {
  // Re-check environment variable for runtime override
  const envThreshold = process.env.CONFIDENCE_THRESHOLD;
  if (envThreshold !== undefined && envThreshold !== '') {
    const parsed = parseFloat(envThreshold);
    if (!isNaN(parsed) && parsed >= 0 && parsed <= 1) {
      return parsed;
    }
  }
  return METACOGNITIVE_CONFIG.defaultConfidenceThreshold;
}
