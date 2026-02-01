/**
 * Confidence History Tracking Module
 *
 * Tracks confidence readings over time with rolling window management.
 * Part of Phase 7 - Metacognitive State Vector Integration (US-006).
 *
 * Features:
 * - Rolling window of last 100 confidence readings
 * - Timestamps and query context for each reading
 * - Statistical analysis (average, min, max, trend)
 * - Export/import functionality for analysis
 * - localStorage persistence (client-side)
 */

import { type ConfidenceLevel, getConfidenceLevel } from './types';

/**
 * Represents a single confidence reading with full context.
 */
export interface ConfidenceReading {
  /** Confidence score (0.0 to 1.0) */
  confidence: number;
  /** Semantic confidence level derived from score */
  confidenceLevel: ConfidenceLevel;
  /** Unix timestamp when reading was recorded */
  timestamp: number;
  /** Optional query context that produced this confidence */
  queryContext?: string;
  /** Model that produced this reading (haiku, sonnet, opus) */
  model: string;
  /** Outcome of the interaction */
  outcome?: 'success' | 'escalated' | 'failed';
  /** Optional DQ score associated with this reading */
  dqScore?: number;
}

/**
 * Container for confidence history with metadata.
 */
export interface ConfidenceHistory {
  /** Array of confidence readings (most recent last) */
  readings: ConfidenceReading[];
  /** Maximum number of readings to retain */
  maxSize: number;
  /** Timestamp when history was created */
  createdAt: number;
  /** Timestamp of last update */
  updatedAt: number;
}

/**
 * Statistical summary of confidence history.
 */
export interface ConfidenceStats {
  /** Average confidence across all readings */
  average: number;
  /** Minimum confidence observed */
  min: number;
  /** Maximum confidence observed */
  max: number;
  /** Trend direction based on recent vs older readings */
  trend: 'improving' | 'declining' | 'stable';
  /** Total number of readings in history */
  totalReadings: number;
}

/**
 * Storage key for localStorage persistence.
 */
const STORAGE_KEY = 'metacognitive_confidence_history';

/**
 * Check if we're in a browser environment with localStorage.
 */
function hasLocalStorage(): boolean {
  try {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  } catch {
    return false;
  }
}

/**
 * ConfidenceHistoryTracker manages a rolling window of confidence readings.
 *
 * Usage:
 * ```typescript
 * import { historyTracker } from './history';
 *
 * // Record a new reading
 * historyTracker.record({
 *   confidence: 0.85,
 *   confidenceLevel: 'high',
 *   model: 'sonnet',
 *   queryContext: 'What is TypeScript?',
 *   outcome: 'success'
 * });
 *
 * // Get statistics
 * const stats = historyTracker.getStats();
 * console.log(`Average confidence: ${stats.average}, Trend: ${stats.trend}`);
 *
 * // Export for analysis
 * const json = historyTracker.export();
 * ```
 */
export class ConfidenceHistoryTracker {
  private history: ConfidenceHistory;
  private readonly MAX_READINGS = 100;

  constructor() {
    this.history = this.createEmptyHistory();
    // Attempt to load from storage on initialization
    this.loadFromStorage();
  }

  /**
   * Create an empty history container.
   */
  private createEmptyHistory(): ConfidenceHistory {
    const now = Date.now();
    return {
      readings: [],
      maxSize: this.MAX_READINGS,
      createdAt: now,
      updatedAt: now,
    };
  }

  /**
   * Add a new confidence reading to the history.
   * Automatically prunes oldest readings if over MAX_READINGS.
   *
   * @param reading - The reading to record (timestamp added automatically)
   */
  record(reading: Omit<ConfidenceReading, 'timestamp'>): void {
    const fullReading: ConfidenceReading = {
      ...reading,
      timestamp: Date.now(),
    };

    this.history.readings.push(fullReading);
    this.history.updatedAt = Date.now();

    // Prune if over limit (remove oldest)
    if (this.history.readings.length > this.MAX_READINGS) {
      const excess = this.history.readings.length - this.MAX_READINGS;
      this.history.readings.splice(0, excess);
    }

    // Persist to storage
    this.saveToStorage();
  }

  /**
   * Record a reading with minimal required fields.
   * Confidence level is automatically derived from score.
   *
   * @param confidence - Confidence score (0.0 to 1.0)
   * @param model - Model name (haiku, sonnet, opus)
   * @param options - Optional additional fields
   */
  recordSimple(
    confidence: number,
    model: string,
    options?: {
      queryContext?: string;
      outcome?: 'success' | 'escalated' | 'failed';
      dqScore?: number;
    }
  ): void {
    this.record({
      confidence,
      confidenceLevel: getConfidenceLevel(confidence),
      model,
      ...options,
    });
  }

  /**
   * Get all readings in the history.
   *
   * @returns Array of all confidence readings
   */
  getHistory(): ConfidenceReading[] {
    return [...this.history.readings];
  }

  /**
   * Get readings within a specific time range.
   *
   * @param startTime - Start of range (Unix timestamp)
   * @param endTime - End of range (Unix timestamp)
   * @returns Readings within the specified range
   */
  getRange(startTime: number, endTime: number): ConfidenceReading[] {
    return this.history.readings.filter(
      (r) => r.timestamp >= startTime && r.timestamp <= endTime
    );
  }

  /**
   * Get the most recent N readings.
   *
   * @param n - Number of readings to retrieve
   * @returns Array of most recent readings (newest last)
   */
  getRecent(n: number): ConfidenceReading[] {
    const count = Math.min(n, this.history.readings.length);
    return this.history.readings.slice(-count);
  }

  /**
   * Get readings filtered by model.
   *
   * @param model - Model name to filter by
   * @returns Readings from the specified model
   */
  getByModel(model: string): ConfidenceReading[] {
    const normalizedModel = model.toLowerCase();
    return this.history.readings.filter(
      (r) => r.model.toLowerCase() === normalizedModel
    );
  }

  /**
   * Get readings filtered by outcome.
   *
   * @param outcome - Outcome to filter by
   * @returns Readings with the specified outcome
   */
  getByOutcome(outcome: 'success' | 'escalated' | 'failed'): ConfidenceReading[] {
    return this.history.readings.filter((r) => r.outcome === outcome);
  }

  /**
   * Calculate statistics across all readings.
   *
   * @returns Statistical summary of confidence history
   */
  getStats(): ConfidenceStats {
    const readings = this.history.readings;

    if (readings.length === 0) {
      return {
        average: 0,
        min: 0,
        max: 0,
        trend: 'stable',
        totalReadings: 0,
      };
    }

    const confidences = readings.map((r) => r.confidence);

    const average = confidences.reduce((sum, c) => sum + c, 0) / confidences.length;
    const min = Math.min(...confidences);
    const max = Math.max(...confidences);

    // Calculate trend by comparing first half average to second half average
    const trend = this.calculateTrend(confidences);

    return {
      average,
      min,
      max,
      trend,
      totalReadings: readings.length,
    };
  }

  /**
   * Calculate trend direction from confidence values.
   * Compares average of first half to second half of readings.
   */
  private calculateTrend(
    confidences: number[]
  ): 'improving' | 'declining' | 'stable' {
    if (confidences.length < 4) {
      return 'stable'; // Not enough data to determine trend
    }

    const midpoint = Math.floor(confidences.length / 2);
    const firstHalf = confidences.slice(0, midpoint);
    const secondHalf = confidences.slice(midpoint);

    const firstAvg = firstHalf.reduce((sum, c) => sum + c, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, c) => sum + c, 0) / secondHalf.length;

    const diff = secondAvg - firstAvg;

    // Use a threshold of 5% to determine significance
    if (diff > 0.05) {
      return 'improving';
    } else if (diff < -0.05) {
      return 'declining';
    } else {
      return 'stable';
    }
  }

  /**
   * Get stats filtered by model.
   *
   * @param model - Model to get stats for
   * @returns Stats for the specified model
   */
  getStatsByModel(model: string): ConfidenceStats {
    const readings = this.getByModel(model);

    if (readings.length === 0) {
      return {
        average: 0,
        min: 0,
        max: 0,
        trend: 'stable',
        totalReadings: 0,
      };
    }

    const confidences = readings.map((r) => r.confidence);
    const average = confidences.reduce((sum, c) => sum + c, 0) / confidences.length;

    return {
      average,
      min: Math.min(...confidences),
      max: Math.max(...confidences),
      trend: this.calculateTrend(confidences),
      totalReadings: readings.length,
    };
  }

  /**
   * Export history as JSON string for analysis.
   *
   * @returns JSON string representation of history
   */
  export(): string {
    return JSON.stringify(this.history, null, 2);
  }

  /**
   * Export as CSV format for spreadsheet analysis.
   *
   * @returns CSV string with header row
   */
  exportCSV(): string {
    const headers = [
      'timestamp',
      'confidence',
      'confidenceLevel',
      'model',
      'outcome',
      'dqScore',
      'queryContext',
    ];

    const rows = this.history.readings.map((r) => [
      new Date(r.timestamp).toISOString(),
      r.confidence.toFixed(4),
      r.confidenceLevel,
      r.model,
      r.outcome || '',
      r.dqScore !== undefined ? r.dqScore.toFixed(4) : '',
      r.queryContext ? `"${r.queryContext.replace(/"/g, '""')}"` : '',
    ]);

    return [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
  }

  /**
   * Import history from JSON string.
   * Validates structure before importing.
   *
   * @param json - JSON string to import
   * @throws Error if JSON is invalid or malformed
   */
  import(json: string): void {
    try {
      const parsed = JSON.parse(json);

      // Validate structure
      if (!this.isValidHistory(parsed)) {
        throw new Error('Invalid history structure');
      }

      this.history = parsed;

      // Ensure max size is respected
      if (this.history.readings.length > this.MAX_READINGS) {
        const excess = this.history.readings.length - this.MAX_READINGS;
        this.history.readings.splice(0, excess);
      }

      this.history.maxSize = this.MAX_READINGS;
      this.history.updatedAt = Date.now();

      this.saveToStorage();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to import history: ${message}`);
    }
  }

  /**
   * Validate that an object matches ConfidenceHistory structure.
   */
  private isValidHistory(obj: unknown): obj is ConfidenceHistory {
    if (!obj || typeof obj !== 'object') {
      return false;
    }

    const history = obj as Record<string, unknown>;

    if (!Array.isArray(history.readings)) {
      return false;
    }

    if (typeof history.createdAt !== 'number' || typeof history.updatedAt !== 'number') {
      return false;
    }

    // Validate each reading
    for (const reading of history.readings) {
      if (!this.isValidReading(reading)) {
        return false;
      }
    }

    return true;
  }

  /**
   * Validate that an object matches ConfidenceReading structure.
   */
  private isValidReading(obj: unknown): obj is ConfidenceReading {
    if (!obj || typeof obj !== 'object') {
      return false;
    }

    const reading = obj as Record<string, unknown>;

    return (
      typeof reading.confidence === 'number' &&
      typeof reading.confidenceLevel === 'string' &&
      typeof reading.timestamp === 'number' &&
      typeof reading.model === 'string'
    );
  }

  /**
   * Clear all history data.
   */
  clear(): void {
    this.history = this.createEmptyHistory();
    this.saveToStorage();
  }

  /**
   * Save history to localStorage (client-side only).
   */
  saveToStorage(): void {
    if (!hasLocalStorage()) {
      return;
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.history));
    } catch (error) {
      // Silently fail if storage is full or unavailable
      console.warn('Failed to save confidence history to localStorage:', error);
    }
  }

  /**
   * Load history from localStorage (client-side only).
   */
  loadFromStorage(): void {
    if (!hasLocalStorage()) {
      return;
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (this.isValidHistory(parsed)) {
          this.history = parsed;
          // Update max size in case it changed
          this.history.maxSize = this.MAX_READINGS;
        }
      }
    } catch (error) {
      // Silently fail and use empty history
      console.warn('Failed to load confidence history from localStorage:', error);
    }
  }

  /**
   * Get the raw history object (for debugging).
   */
  getRawHistory(): ConfidenceHistory {
    return { ...this.history, readings: [...this.history.readings] };
  }

  /**
   * Get the number of readings currently stored.
   */
  get size(): number {
    return this.history.readings.length;
  }

  /**
   * Check if history is empty.
   */
  get isEmpty(): boolean {
    return this.history.readings.length === 0;
  }

  /**
   * Get the most recent reading, or undefined if empty.
   */
  get latest(): ConfidenceReading | undefined {
    return this.history.readings[this.history.readings.length - 1];
  }

  /**
   * Get the oldest reading, or undefined if empty.
   */
  get oldest(): ConfidenceReading | undefined {
    return this.history.readings[0];
  }
}

/**
 * Default singleton instance for global use.
 *
 * Usage:
 * ```typescript
 * import { historyTracker } from './history';
 *
 * historyTracker.record({
 *   confidence: 0.85,
 *   confidenceLevel: 'high',
 *   model: 'sonnet'
 * });
 * ```
 */
export const historyTracker = new ConfidenceHistoryTracker();
