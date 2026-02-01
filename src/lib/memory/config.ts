/**
 * Memory System Configuration
 * Phase 8 - Adaptive Memory Lifecycle
 *
 * Centralized configuration for the memory system.
 * Values can be overridden via environment variables.
 */

/**
 * Parse an integer from environment variable with fallback.
 */
function parseEnvInt(key: string, defaultValue: number): number {
  const value = process.env[key];
  if (value === undefined || value === '') {
    return defaultValue;
  }
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
}

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
function parseEnvBool(key: string, defaultValue: boolean): boolean {
  const value = process.env[key];
  if (value === undefined || value === '') {
    return defaultValue;
  }
  return value.toLowerCase() === 'true' || value === '1';
}

/**
 * Memory system configuration object.
 * All values can be overridden via environment variables.
 */
export const MEMORY_CONFIG = {
  /**
   * Half-lives in days for each memory type.
   * Determines how quickly memories decay over time.
   */
  halfLives: {
    factual: parseEnvInt('MEMORY_HALFLIFE_FACTUAL', 90),
    experiential: parseEnvInt('MEMORY_HALFLIFE_EXPERIENTIAL', 30),
    working: parseEnvInt('MEMORY_HALFLIFE_WORKING', 7),
  },

  /**
   * Decay threshold below which memories are eligible for pruning.
   * Range: 0.0 to 1.0 (default: 0.1 = 10%)
   */
  pruneThreshold: parseEnvFloat('MEMORY_PRUNE_THRESHOLD', 0.1),

  /**
   * Minimum decay score - memories never go below this value.
   * Range: 0.0 to 1.0 (default: 0.01 = 1%)
   */
  minimumDecay: parseEnvFloat('MEMORY_MINIMUM_DECAY', 0.01),

  /**
   * Multiplier applied when a memory is accessed/recalled.
   * Higher values mean stronger reinforcement (default: 1.5)
   */
  accessBoostMultiplier: parseEnvFloat('MEMORY_ACCESS_BOOST', 1.5),

  /**
   * Maximum decay score after boosting (capped at 1.0)
   */
  maxDecayScore: 1.0,

  /**
   * Automatic pruning settings
   */
  pruning: {
    /** Enable automatic pruning of decayed memories */
    enabled: parseEnvBool('MEMORY_PRUNING_ENABLED', true),

    /** Interval in hours between automatic prune runs */
    intervalHours: parseEnvInt('MEMORY_PRUNING_INTERVAL', 24),

    /** Maximum number of memories to prune in a single run */
    batchSize: parseEnvInt('MEMORY_PRUNING_BATCH_SIZE', 100),

    /** Keep pruned memories in archive instead of deleting */
    archiveBeforeDelete: parseEnvBool('MEMORY_PRUNING_ARCHIVE', true),
  },

  /**
   * Memory capacity limits
   */
  capacity: {
    /** Maximum total memories to store */
    maxMemories: parseEnvInt('MEMORY_MAX_TOTAL', 10000),

    /** Maximum working memories (short-term) */
    maxWorkingMemories: parseEnvInt('MEMORY_MAX_WORKING', 100),

    /** Maximum experiential memories */
    maxExperientialMemories: parseEnvInt('MEMORY_MAX_EXPERIENTIAL', 5000),

    /** Maximum factual memories */
    maxFactualMemories: parseEnvInt('MEMORY_MAX_FACTUAL', 5000),
  },

  /**
   * Storage settings
   */
  storage: {
    /** Storage provider: 'local' | 'supabase' | 'memory' */
    provider: process.env.MEMORY_STORAGE_PROVIDER || 'local',

    /** Local storage path (if using local provider) */
    localPath: process.env.MEMORY_STORAGE_PATH || '.memory',

    /** Enable compression for stored memories */
    compression: parseEnvBool('MEMORY_COMPRESSION', true),

    /** Encryption key for sensitive memories (optional) */
    encryptionKey: process.env.MEMORY_ENCRYPTION_KEY,
  },

  /**
   * Analytics and monitoring
   */
  analytics: {
    /** Track memory access patterns */
    trackAccess: parseEnvBool('MEMORY_TRACK_ACCESS', true),

    /** Track decay score changes over time */
    trackDecay: parseEnvBool('MEMORY_TRACK_DECAY', true),

    /** Retention period for analytics data in days */
    retentionDays: parseEnvInt('MEMORY_ANALYTICS_RETENTION', 90),
  },
} as const;

/**
 * Type for the memory configuration object
 */
export type MemoryConfigType = typeof MEMORY_CONFIG;

/**
 * Get a specific config value by path.
 * Useful for dynamic access.
 *
 * @example
 * getConfigValue('halfLives.factual') // 90
 * getConfigValue('pruning.enabled') // true
 */
export function getConfigValue<T = unknown>(path: string): T | undefined {
  const keys = path.split('.');
  let current: unknown = MEMORY_CONFIG;

  for (const key of keys) {
    if (current === null || current === undefined) {
      return undefined;
    }
    current = (current as Record<string, unknown>)[key];
  }

  return current as T;
}

/**
 * Validate the current configuration.
 * Returns an array of validation errors (empty if valid).
 */
export function validateConfig(): string[] {
  const errors: string[] = [];

  // Validate half-lives
  if (MEMORY_CONFIG.halfLives.factual <= 0) {
    errors.push('Factual half-life must be positive');
  }
  if (MEMORY_CONFIG.halfLives.experiential <= 0) {
    errors.push('Experiential half-life must be positive');
  }
  if (MEMORY_CONFIG.halfLives.working <= 0) {
    errors.push('Working half-life must be positive');
  }

  // Validate thresholds
  if (MEMORY_CONFIG.pruneThreshold < 0 || MEMORY_CONFIG.pruneThreshold > 1) {
    errors.push('Prune threshold must be between 0 and 1');
  }
  if (MEMORY_CONFIG.minimumDecay < 0 || MEMORY_CONFIG.minimumDecay > 1) {
    errors.push('Minimum decay must be between 0 and 1');
  }
  if (MEMORY_CONFIG.minimumDecay >= MEMORY_CONFIG.pruneThreshold) {
    errors.push('Minimum decay should be less than prune threshold');
  }

  // Validate boost multiplier
  if (MEMORY_CONFIG.accessBoostMultiplier <= 0) {
    errors.push('Access boost multiplier must be positive');
  }

  // Validate capacity limits
  if (MEMORY_CONFIG.capacity.maxMemories <= 0) {
    errors.push('Maximum memories must be positive');
  }

  return errors;
}

/**
 * Export a summary of the current configuration for logging/debugging.
 */
export function getConfigSummary(): Record<string, string | number | boolean> {
  return {
    'halfLife.factual': `${MEMORY_CONFIG.halfLives.factual} days`,
    'halfLife.experiential': `${MEMORY_CONFIG.halfLives.experiential} days`,
    'halfLife.working': `${MEMORY_CONFIG.halfLives.working} days`,
    'pruneThreshold': MEMORY_CONFIG.pruneThreshold,
    'minimumDecay': MEMORY_CONFIG.minimumDecay,
    'accessBoost': MEMORY_CONFIG.accessBoostMultiplier,
    'pruning.enabled': MEMORY_CONFIG.pruning.enabled,
    'capacity.max': MEMORY_CONFIG.capacity.maxMemories,
    'storage.provider': MEMORY_CONFIG.storage.provider,
  };
}
