/**
 * Memory Health Metrics and Alerts
 * Phase 8 - Adaptive Memory Lifecycle (US-008)
 *
 * Provides health monitoring for the memory system:
 * - Comprehensive health metrics calculation
 * - Configurable alert thresholds
 * - Health check with pass/warn/fail status
 * - CLI-friendly health reports
 */

import {
  MemoryRecord,
  MemoryType,
  calculateDecay,
} from './types';
import { PruningSummary } from './forgetting';
import { ConsolidationResult } from './consolidation';

// ============================================================================
// Types
// ============================================================================

/**
 * Metrics tracked by the health monitor
 */
export interface HealthMetrics {
  /** Total number of active memories */
  totalMemories: number;
  /** Average decay score across all memories (0-1) */
  averageDecay: number;
  /** Percentage of memories pruned in last run (0-100) */
  pruneRate: number;
  /** Success rate of consolidation operations (0-100) */
  consolidationSuccessRate: number;
  /** Memory growth rate over period (positive = growth, negative = shrinkage) */
  memoryGrowthRate: number;
  /** Breakdown by memory type */
  byType: Record<MemoryType, number>;
  /** Timestamp of metrics calculation */
  timestamp: number;
}

/**
 * Record of a pruning operation for history tracking
 */
export interface PruningHistoryEntry {
  /** Timestamp of the pruning */
  timestamp: number;
  /** Number of memories before pruning */
  totalBefore: number;
  /** Number of memories pruned */
  prunedCount: number;
  /** Pruning summary if available */
  summary?: PruningSummary;
}

/**
 * Record of a consolidation operation for history tracking
 */
export interface ConsolidationHistoryEntry {
  /** Timestamp of the consolidation */
  timestamp: number;
  /** Whether consolidation succeeded */
  success: boolean;
  /** Number of memories consolidated */
  memoriesConsolidated: number;
  /** Error message if failed */
  error?: string;
  /** Consolidation result if available */
  result?: ConsolidationResult;
}

/**
 * Health check status
 */
export type HealthStatus = 'pass' | 'warn' | 'fail';

/**
 * Result of a health check
 */
export interface HealthCheckResult {
  /** Overall health status */
  status: HealthStatus;
  /** List of issues found */
  issues: string[];
  /** Detailed metrics */
  metrics: HealthMetrics;
  /** Timestamp of the check */
  timestamp: number;
}

/**
 * Active alert from the health monitor
 */
export interface HealthAlert {
  /** Alert severity */
  severity: 'warning' | 'critical';
  /** Alert message */
  message: string;
  /** Metric that triggered the alert */
  metric: keyof HealthMetrics | 'custom';
  /** Current value */
  currentValue: number;
  /** Threshold that was exceeded */
  threshold: number;
  /** Timestamp when alert was triggered */
  timestamp: number;
}

/**
 * Configuration for health alert thresholds
 */
export interface HealthConfig {
  /** Minimum total memories (warn if below) */
  minTotalMemories: number;
  /** Minimum average decay score (warn if below) */
  minAverageDecay: number;
  /** Maximum prune rate per run (warn if above, %) */
  maxPruneRate: number;
  /** Minimum consolidation success rate (warn if below, %) */
  minConsolidationSuccessRate: number;
  /** Memory growth rate threshold (warn if below over period) */
  minMemoryGrowthRate: number;
  /** Period in days for growth rate calculation */
  growthRatePeriodDays: number;
}

// ============================================================================
// Default Configuration
// ============================================================================

/**
 * Default health alert thresholds
 */
export const DEFAULT_HEALTH_CONFIG: HealthConfig = {
  minTotalMemories: 50,
  minAverageDecay: 0.3,
  maxPruneRate: 10,
  minConsolidationSuccessRate: 80,
  minMemoryGrowthRate: 0,
  growthRatePeriodDays: 7,
};

// ============================================================================
// MemoryHealthMonitor Class
// ============================================================================

/**
 * Monitors memory system health and generates alerts.
 *
 * Tracks:
 * - Total memory count
 * - Average decay across memories
 * - Pruning rate per cycle
 * - Consolidation success rate
 * - Memory growth trends
 */
export class MemoryHealthMonitor {
  private config: HealthConfig;
  private alerts: HealthAlert[] = [];
  private lastMetrics: HealthMetrics | null = null;

  constructor(config?: Partial<HealthConfig>) {
    this.config = {
      ...DEFAULT_HEALTH_CONFIG,
      ...config,
    };
  }

  // ============================================================================
  // Core Methods
  // ============================================================================

  /**
   * Calculate comprehensive health metrics from memories and history.
   *
   * @param memories - Current active memories
   * @param pruningHistory - History of pruning operations
   * @param consolidationHistory - History of consolidation operations
   * @returns Comprehensive health metrics
   */
  calculateHealthMetrics(
    memories: MemoryRecord[],
    pruningHistory: PruningHistoryEntry[] = [],
    consolidationHistory: ConsolidationHistoryEntry[] = []
  ): HealthMetrics {
    const now = Date.now();

    // Calculate total memories
    const totalMemories = memories.length;

    // Calculate average decay
    const decayValues = memories.map(m => calculateDecay(m));
    const averageDecay = totalMemories > 0
      ? decayValues.reduce((sum, d) => sum + d, 0) / totalMemories
      : 0;

    // Calculate prune rate from last pruning
    const pruneRate = this.calculatePruneRate(pruningHistory);

    // Calculate consolidation success rate
    const consolidationSuccessRate = this.calculateConsolidationSuccessRate(consolidationHistory);

    // Calculate memory growth rate
    const memoryGrowthRate = this.calculateGrowthRate(pruningHistory);

    // Count by type
    const byType: Record<MemoryType, number> = {
      [MemoryType.FACTUAL]: 0,
      [MemoryType.EXPERIENTIAL]: 0,
      [MemoryType.WORKING]: 0,
    };
    for (const memory of memories) {
      byType[memory.type]++;
    }

    const metrics: HealthMetrics = {
      totalMemories,
      averageDecay,
      pruneRate,
      consolidationSuccessRate,
      memoryGrowthRate,
      byType,
      timestamp: now,
    };

    this.lastMetrics = metrics;
    return metrics;
  }

  /**
   * Perform a health check and return status with issues.
   *
   * @param memories - Current active memories
   * @param pruningHistory - Optional pruning history
   * @param consolidationHistory - Optional consolidation history
   * @returns Health check result with status and issues
   */
  checkHealth(
    memories: MemoryRecord[],
    pruningHistory: PruningHistoryEntry[] = [],
    consolidationHistory: ConsolidationHistoryEntry[] = []
  ): HealthCheckResult {
    const metrics = this.calculateHealthMetrics(
      memories,
      pruningHistory,
      consolidationHistory
    );

    const issues: string[] = [];
    let hasFailure = false;
    let hasWarning = false;

    // Check total memories
    if (metrics.totalMemories < this.config.minTotalMemories) {
      issues.push(
        `Low memory count: ${metrics.totalMemories} (minimum: ${this.config.minTotalMemories})`
      );
      hasWarning = true;
    }

    // Check average decay
    if (metrics.averageDecay < this.config.minAverageDecay) {
      issues.push(
        `Low average decay: ${metrics.averageDecay.toFixed(3)} (minimum: ${this.config.minAverageDecay})`
      );
      hasWarning = true;
    }

    // Check prune rate
    if (metrics.pruneRate > this.config.maxPruneRate) {
      issues.push(
        `High prune rate: ${metrics.pruneRate.toFixed(1)}% (maximum: ${this.config.maxPruneRate}%)`
      );
      hasWarning = true;
      // High prune rate is a failure condition
      if (metrics.pruneRate > this.config.maxPruneRate * 2) {
        hasFailure = true;
      }
    }

    // Check consolidation success rate
    if (metrics.consolidationSuccessRate < this.config.minConsolidationSuccessRate) {
      issues.push(
        `Low consolidation success rate: ${metrics.consolidationSuccessRate.toFixed(1)}% ` +
        `(minimum: ${this.config.minConsolidationSuccessRate}%)`
      );
      hasWarning = true;
      // Very low success rate is a failure
      if (metrics.consolidationSuccessRate < 50) {
        hasFailure = true;
      }
    }

    // Check memory growth rate
    if (metrics.memoryGrowthRate < this.config.minMemoryGrowthRate) {
      issues.push(
        `Negative memory growth rate: ${metrics.memoryGrowthRate.toFixed(1)}% over ` +
        `${this.config.growthRatePeriodDays} days`
      );
      hasWarning = true;
    }

    // Determine overall status
    let status: HealthStatus;
    if (hasFailure) {
      status = 'fail';
    } else if (hasWarning) {
      status = 'warn';
    } else {
      status = 'pass';
    }

    return {
      status,
      issues,
      metrics,
      timestamp: Date.now(),
    };
  }

  /**
   * Get active alerts based on current metrics.
   *
   * @param metrics - Health metrics to evaluate
   * @returns Array of active alerts
   */
  getAlerts(metrics: HealthMetrics): HealthAlert[] {
    this.alerts = [];
    const now = Date.now();

    // Check total memories
    if (metrics.totalMemories < this.config.minTotalMemories) {
      this.alerts.push({
        severity: metrics.totalMemories < this.config.minTotalMemories / 2 ? 'critical' : 'warning',
        message: `Memory count below threshold: ${metrics.totalMemories} < ${this.config.minTotalMemories}`,
        metric: 'totalMemories',
        currentValue: metrics.totalMemories,
        threshold: this.config.minTotalMemories,
        timestamp: now,
      });
    }

    // Check average decay
    if (metrics.averageDecay < this.config.minAverageDecay) {
      this.alerts.push({
        severity: metrics.averageDecay < this.config.minAverageDecay / 2 ? 'critical' : 'warning',
        message: `Average decay below threshold: ${metrics.averageDecay.toFixed(3)} < ${this.config.minAverageDecay}`,
        metric: 'averageDecay',
        currentValue: metrics.averageDecay,
        threshold: this.config.minAverageDecay,
        timestamp: now,
      });
    }

    // Check prune rate
    if (metrics.pruneRate > this.config.maxPruneRate) {
      this.alerts.push({
        severity: metrics.pruneRate > this.config.maxPruneRate * 2 ? 'critical' : 'warning',
        message: `Prune rate exceeds threshold: ${metrics.pruneRate.toFixed(1)}% > ${this.config.maxPruneRate}%`,
        metric: 'pruneRate',
        currentValue: metrics.pruneRate,
        threshold: this.config.maxPruneRate,
        timestamp: now,
      });
    }

    // Check consolidation success rate
    if (metrics.consolidationSuccessRate < this.config.minConsolidationSuccessRate) {
      this.alerts.push({
        severity: metrics.consolidationSuccessRate < 50 ? 'critical' : 'warning',
        message: `Consolidation success rate below threshold: ${metrics.consolidationSuccessRate.toFixed(1)}% < ${this.config.minConsolidationSuccessRate}%`,
        metric: 'consolidationSuccessRate',
        currentValue: metrics.consolidationSuccessRate,
        threshold: this.config.minConsolidationSuccessRate,
        timestamp: now,
      });
    }

    // Check memory growth rate
    if (metrics.memoryGrowthRate < this.config.minMemoryGrowthRate) {
      this.alerts.push({
        severity: metrics.memoryGrowthRate < -10 ? 'critical' : 'warning',
        message: `Memory growth rate negative: ${metrics.memoryGrowthRate.toFixed(1)}% over ${this.config.growthRatePeriodDays} days`,
        metric: 'memoryGrowthRate',
        currentValue: metrics.memoryGrowthRate,
        threshold: this.config.minMemoryGrowthRate,
        timestamp: now,
      });
    }

    return this.alerts;
  }

  /**
   * Set an alert threshold for a specific metric.
   *
   * @param metric - The metric to configure
   * @param threshold - The new threshold value
   */
  setAlertThreshold(
    metric: 'totalMemories' | 'averageDecay' | 'pruneRate' | 'consolidationSuccessRate' | 'memoryGrowthRate',
    threshold: number
  ): void {
    switch (metric) {
      case 'totalMemories':
        this.config.minTotalMemories = Math.max(0, threshold);
        break;
      case 'averageDecay':
        this.config.minAverageDecay = Math.max(0, Math.min(1, threshold));
        break;
      case 'pruneRate':
        this.config.maxPruneRate = Math.max(0, Math.min(100, threshold));
        break;
      case 'consolidationSuccessRate':
        this.config.minConsolidationSuccessRate = Math.max(0, Math.min(100, threshold));
        break;
      case 'memoryGrowthRate':
        this.config.minMemoryGrowthRate = threshold;
        break;
    }
  }

  /**
   * Format a CLI-friendly health report.
   *
   * @param healthCheck - Optional pre-computed health check result
   * @param memories - Optional memories to compute health check from
   * @returns Formatted string for CLI output
   */
  formatHealthReport(
    healthCheck?: HealthCheckResult,
    memories?: MemoryRecord[],
    pruningHistory?: PruningHistoryEntry[],
    consolidationHistory?: ConsolidationHistoryEntry[]
  ): string {
    const result = healthCheck ?? (memories
      ? this.checkHealth(memories, pruningHistory, consolidationHistory)
      : null);

    if (!result) {
      return 'Error: No health check data or memories provided';
    }

    const lines: string[] = [];
    const timestamp = new Date(result.timestamp).toISOString();

    // Header with status
    lines.push('');
    lines.push('================================================================');
    lines.push('              MEMORY HEALTH CHECK');
    lines.push('================================================================');
    lines.push(`  Timestamp: ${timestamp}`);
    lines.push(`  Status:    ${this.formatStatus(result.status)}`);
    lines.push('');

    // Metrics summary
    lines.push('--- METRICS ---');
    lines.push(`  Total Memories:            ${this.padValue(result.metrics.totalMemories.toString(), 8)} ${this.formatThresholdIndicator(result.metrics.totalMemories, this.config.minTotalMemories, 'min')}`);
    lines.push(`  Average Decay:             ${this.padValue(result.metrics.averageDecay.toFixed(3), 8)} ${this.formatThresholdIndicator(result.metrics.averageDecay, this.config.minAverageDecay, 'min')}`);
    lines.push(`  Prune Rate:                ${this.padValue(result.metrics.pruneRate.toFixed(1) + '%', 8)} ${this.formatThresholdIndicator(result.metrics.pruneRate, this.config.maxPruneRate, 'max')}`);
    lines.push(`  Consolidation Success:     ${this.padValue(result.metrics.consolidationSuccessRate.toFixed(1) + '%', 8)} ${this.formatThresholdIndicator(result.metrics.consolidationSuccessRate, this.config.minConsolidationSuccessRate, 'min')}`);
    lines.push(`  Memory Growth Rate:        ${this.padValue(result.metrics.memoryGrowthRate.toFixed(1) + '%', 8)} ${this.formatThresholdIndicator(result.metrics.memoryGrowthRate, this.config.minMemoryGrowthRate, 'min')}`);
    lines.push('');

    // By type breakdown
    lines.push('--- BY TYPE ---');
    lines.push(`  Factual:      ${this.padValue(result.metrics.byType.FACTUAL.toString(), 5)}`);
    lines.push(`  Experiential: ${this.padValue(result.metrics.byType.EXPERIENTIAL.toString(), 5)}`);
    lines.push(`  Working:      ${this.padValue(result.metrics.byType.WORKING.toString(), 5)}`);
    lines.push('');

    // Issues
    lines.push('--- ISSUES ---');
    if (result.issues.length === 0) {
      lines.push('  No issues detected');
    } else {
      for (const issue of result.issues) {
        lines.push(`  [!] ${issue}`);
      }
    }
    lines.push('');

    // Active alerts
    const alerts = this.getAlerts(result.metrics);
    lines.push('--- ALERTS ---');
    if (alerts.length === 0) {
      lines.push('  No active alerts');
    } else {
      for (const alert of alerts) {
        const badge = alert.severity === 'critical' ? '[CRIT]' : '[WARN]';
        lines.push(`  ${badge} ${alert.message}`);
      }
    }
    lines.push('');

    // Thresholds reference
    lines.push('--- THRESHOLDS ---');
    lines.push(`  Min Total Memories:        ${this.config.minTotalMemories}`);
    lines.push(`  Min Average Decay:         ${this.config.minAverageDecay}`);
    lines.push(`  Max Prune Rate:            ${this.config.maxPruneRate}%`);
    lines.push(`  Min Consolidation Success: ${this.config.minConsolidationSuccessRate}%`);
    lines.push(`  Min Growth Rate:           ${this.config.minMemoryGrowthRate}% (over ${this.config.growthRatePeriodDays} days)`);
    lines.push('');

    lines.push('================================================================');
    lines.push('  Commands: sm health | sm stats | sm lifecycle');
    lines.push('================================================================');
    lines.push('');

    return lines.join('\n');
  }

  // ============================================================================
  // Configuration Methods
  // ============================================================================

  /**
   * Get the current configuration.
   */
  getConfig(): Readonly<HealthConfig> {
    return { ...this.config };
  }

  /**
   * Update configuration.
   */
  setConfig(config: Partial<HealthConfig>): void {
    this.config = {
      ...this.config,
      ...config,
    };
  }

  /**
   * Get the last calculated metrics.
   */
  getLastMetrics(): HealthMetrics | null {
    return this.lastMetrics ? { ...this.lastMetrics } : null;
  }

  /**
   * Get current alerts.
   */
  getCurrentAlerts(): HealthAlert[] {
    return [...this.alerts];
  }

  // ============================================================================
  // Private Helper Methods
  // ============================================================================

  /**
   * Calculate prune rate from the most recent pruning operation.
   */
  private calculatePruneRate(pruningHistory: PruningHistoryEntry[]): number {
    if (pruningHistory.length === 0) {
      return 0;
    }

    // Get most recent pruning
    const sorted = [...pruningHistory].sort((a, b) => b.timestamp - a.timestamp);
    const latest = sorted[0];

    if (latest.totalBefore === 0) {
      return 0;
    }

    return (latest.prunedCount / latest.totalBefore) * 100;
  }

  /**
   * Calculate consolidation success rate from history.
   */
  private calculateConsolidationSuccessRate(
    consolidationHistory: ConsolidationHistoryEntry[]
  ): number {
    if (consolidationHistory.length === 0) {
      return 100; // No consolidations = no failures
    }

    const successCount = consolidationHistory.filter(c => c.success).length;
    return (successCount / consolidationHistory.length) * 100;
  }

  /**
   * Calculate memory growth rate over the configured period.
   */
  private calculateGrowthRate(pruningHistory: PruningHistoryEntry[]): number {
    if (pruningHistory.length < 2) {
      return 0;
    }

    const periodMs = this.config.growthRatePeriodDays * 24 * 60 * 60 * 1000;
    const now = Date.now();
    const periodStart = now - periodMs;

    // Filter to relevant period
    const inPeriod = pruningHistory.filter(p => p.timestamp >= periodStart);

    if (inPeriod.length < 2) {
      return 0;
    }

    // Sort by timestamp
    const sorted = [...inPeriod].sort((a, b) => a.timestamp - b.timestamp);

    // Calculate net change
    const oldest = sorted[0];
    const newest = sorted[sorted.length - 1];

    const startCount = oldest.totalBefore;
    const endCount = newest.totalBefore - newest.prunedCount;

    if (startCount === 0) {
      return endCount > 0 ? 100 : 0;
    }

    return ((endCount - startCount) / startCount) * 100;
  }

  /**
   * Format health status for display.
   */
  private formatStatus(status: HealthStatus): string {
    switch (status) {
      case 'pass':
        return '[PASS] All systems healthy';
      case 'warn':
        return '[WARN] Issues detected';
      case 'fail':
        return '[FAIL] Critical issues';
    }
  }

  /**
   * Format threshold indicator.
   */
  private formatThresholdIndicator(
    value: number,
    threshold: number,
    type: 'min' | 'max'
  ): string {
    const isOk = type === 'min' ? value >= threshold : value <= threshold;
    return isOk ? '[OK]' : '[!]';
  }

  /**
   * Pad a value for alignment.
   */
  private padValue(value: string, width: number): string {
    return value.padStart(width, ' ');
  }
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Create a health monitor with default or custom configuration.
 */
export function createHealthMonitor(config?: Partial<HealthConfig>): MemoryHealthMonitor {
  return new MemoryHealthMonitor(config);
}

/**
 * Quick health check function.
 */
export function quickHealthCheck(
  memories: MemoryRecord[],
  pruningHistory?: PruningHistoryEntry[],
  consolidationHistory?: ConsolidationHistoryEntry[]
): HealthCheckResult {
  const monitor = new MemoryHealthMonitor();
  return monitor.checkHealth(memories, pruningHistory, consolidationHistory);
}

/**
 * Quick function to get health metrics.
 */
export function getHealthMetrics(
  memories: MemoryRecord[],
  pruningHistory?: PruningHistoryEntry[],
  consolidationHistory?: ConsolidationHistoryEntry[]
): HealthMetrics {
  const monitor = new MemoryHealthMonitor();
  return monitor.calculateHealthMetrics(memories, pruningHistory, consolidationHistory);
}

/**
 * Quick function to format health report for CLI.
 */
export function formatHealthReportForCLI(
  memories: MemoryRecord[],
  pruningHistory?: PruningHistoryEntry[],
  consolidationHistory?: ConsolidationHistoryEntry[]
): string {
  const monitor = new MemoryHealthMonitor();
  return monitor.formatHealthReport(undefined, memories, pruningHistory, consolidationHistory);
}

/**
 * Create a pruning history entry from a summary.
 */
export function createPruningHistoryEntry(
  totalBefore: number,
  summary: PruningSummary
): PruningHistoryEntry {
  return {
    timestamp: summary.prunedAt,
    totalBefore,
    prunedCount: summary.totalPruned,
    summary,
  };
}

/**
 * Create a consolidation history entry from a result.
 */
export function createConsolidationHistoryEntry(
  result: ConsolidationResult,
  error?: string
): ConsolidationHistoryEntry {
  return {
    timestamp: Date.now(),
    success: result.consolidated && !error,
    memoriesConsolidated: result.mergedMemoryIds.length,
    error,
    result,
  };
}

// ============================================================================
// Default Instance
// ============================================================================

/** Default health monitor instance */
export const healthMonitor = new MemoryHealthMonitor();
