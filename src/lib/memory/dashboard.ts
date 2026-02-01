/**
 * Memory Lifecycle Dashboard
 * Phase 8 - Adaptive Memory Lifecycle (US-007)
 *
 * Provides visualization and monitoring of memory lifecycle:
 * - Memory counts by type and phase
 * - Decay distribution histograms
 * - At-risk memory identification
 * - CLI-friendly formatted reports
 */

import {
  MemoryRecord,
  MemoryType,
  MemoryPhase,
  calculateDecay,
} from './types';
import { PRUNE_DECAY_THRESHOLD, PRUNE_RELEVANCE_THRESHOLD } from './forgetting';

// ============================================================================
// Types
// ============================================================================

/**
 * Memory counts grouped by type
 */
export interface MemoryCountsByType {
  [MemoryType.FACTUAL]: number;
  [MemoryType.EXPERIENTIAL]: number;
  [MemoryType.WORKING]: number;
}

/**
 * Memory counts grouped by lifecycle phase
 */
export interface MemoryCountsByPhase {
  [MemoryPhase.FORMATION]: number;
  [MemoryPhase.EVOLUTION]: number;
  [MemoryPhase.RETRIEVAL]: number;
}

/**
 * Histogram bucket for decay distribution
 */
export interface DecayBucket {
  /** Lower bound of the bucket (inclusive) */
  min: number;
  /** Upper bound of the bucket (exclusive, except for last bucket) */
  max: number;
  /** Number of memories in this bucket */
  count: number;
  /** Percentage of total memories */
  percentage: number;
}

/**
 * Decay distribution across histogram buckets
 */
export interface DecayDistribution {
  buckets: DecayBucket[];
  totalMemories: number;
  averageDecay: number;
  medianDecay: number;
}

/**
 * Memory at risk of being pruned
 */
export interface AtRiskMemory {
  memory: MemoryRecord;
  currentDecay: number;
  daysUntilThreshold: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

/**
 * Complete dashboard report data
 */
export interface DashboardReport {
  timestamp: number;
  totalMemories: number;
  countsByType: MemoryCountsByType;
  countsByPhase: MemoryCountsByPhase;
  decayDistribution: DecayDistribution;
  atRiskMemories: AtRiskMemory[];
  healthScore: number; // 0-100
}

// ============================================================================
// Dashboard Configuration
// ============================================================================

/** Default decay histogram bucket boundaries */
const DEFAULT_DECAY_BUCKETS = [0, 0.2, 0.4, 0.6, 0.8, 1.0];

/** Risk level thresholds based on decay proximity to prune threshold */
const RISK_THRESHOLDS = {
  critical: 0.05,  // Within 5% of threshold
  high: 0.1,       // Within 10% of threshold
  medium: 0.2,     // Within 20% of threshold
  low: 0.3,        // Within 30% of threshold
};

// ============================================================================
// MemoryLifecycleDashboard Class
// ============================================================================

/**
 * Dashboard for monitoring and visualizing memory lifecycle metrics.
 *
 * Provides methods for:
 * - Counting memories by type and phase
 * - Analyzing decay distribution
 * - Identifying at-risk memories
 * - Generating formatted reports for CLI
 */
export class MemoryLifecycleDashboard {
  private pruneDecayThreshold: number;
  private pruneRelevanceThreshold: number;

  constructor(config?: {
    pruneDecayThreshold?: number;
    pruneRelevanceThreshold?: number;
  }) {
    this.pruneDecayThreshold = config?.pruneDecayThreshold ?? PRUNE_DECAY_THRESHOLD;
    this.pruneRelevanceThreshold = config?.pruneRelevanceThreshold ?? PRUNE_RELEVANCE_THRESHOLD;
  }

  /**
   * Count memories grouped by type.
   *
   * @param memories - Array of memory records to analyze
   * @returns Counts for each memory type
   */
  getMemoryCountsByType(memories: MemoryRecord[]): MemoryCountsByType {
    const counts: MemoryCountsByType = {
      [MemoryType.FACTUAL]: 0,
      [MemoryType.EXPERIENTIAL]: 0,
      [MemoryType.WORKING]: 0,
    };

    for (const memory of memories) {
      counts[memory.type]++;
    }

    return counts;
  }

  /**
   * Count memories grouped by lifecycle phase.
   *
   * @param memories - Array of memory records to analyze
   * @returns Counts for each lifecycle phase
   */
  getMemoryCountsByPhase(memories: MemoryRecord[]): MemoryCountsByPhase {
    const counts: MemoryCountsByPhase = {
      [MemoryPhase.FORMATION]: 0,
      [MemoryPhase.EVOLUTION]: 0,
      [MemoryPhase.RETRIEVAL]: 0,
    };

    for (const memory of memories) {
      const phase = memory.phase ?? MemoryPhase.FORMATION;
      counts[phase]++;
    }

    return counts;
  }

  /**
   * Calculate decay distribution as histogram buckets.
   *
   * @param memories - Array of memory records to analyze
   * @param bucketBoundaries - Optional custom bucket boundaries (default: 0, 0.2, 0.4, 0.6, 0.8, 1.0)
   * @returns Decay distribution with buckets, average, and median
   */
  getDecayDistribution(
    memories: MemoryRecord[],
    bucketBoundaries: number[] = DEFAULT_DECAY_BUCKETS
  ): DecayDistribution {
    const totalMemories = memories.length;

    if (totalMemories === 0) {
      return {
        buckets: this.createEmptyBuckets(bucketBoundaries),
        totalMemories: 0,
        averageDecay: 0,
        medianDecay: 0,
      };
    }

    // Calculate current decay for all memories
    const decayValues = memories.map(m => calculateDecay(m));

    // Build histogram buckets
    const buckets: DecayBucket[] = [];
    for (let i = 0; i < bucketBoundaries.length - 1; i++) {
      const min = bucketBoundaries[i];
      const max = bucketBoundaries[i + 1];
      const isLastBucket = i === bucketBoundaries.length - 2;

      // Count memories in this bucket
      const count = decayValues.filter(decay => {
        if (isLastBucket) {
          return decay >= min && decay <= max;
        }
        return decay >= min && decay < max;
      }).length;

      buckets.push({
        min,
        max,
        count,
        percentage: (count / totalMemories) * 100,
      });
    }

    // Calculate statistics
    const sortedDecays = [...decayValues].sort((a, b) => a - b);
    const averageDecay = decayValues.reduce((sum, d) => sum + d, 0) / totalMemories;
    const medianDecay = this.calculateMedian(sortedDecays);

    return {
      buckets,
      totalMemories,
      averageDecay,
      medianDecay,
    };
  }

  /**
   * Identify memories approaching the prune threshold.
   *
   * @param memories - Array of memory records to analyze
   * @param threshold - Optional custom threshold (default: pruneDecayThreshold + 0.2)
   * @returns Array of at-risk memories with risk assessment
   */
  getAtRiskMemories(
    memories: MemoryRecord[],
    threshold?: number
  ): AtRiskMemory[] {
    const riskThreshold = threshold ?? (this.pruneDecayThreshold + 0.2);
    const atRisk: AtRiskMemory[] = [];

    for (const memory of memories) {
      const currentDecay = calculateDecay(memory);

      // Check if memory is near threshold
      if (currentDecay < riskThreshold) {
        const distanceToThreshold = currentDecay - this.pruneDecayThreshold;
        const riskLevel = this.calculateRiskLevel(distanceToThreshold);
        const daysUntilThreshold = this.estimateDaysUntilThreshold(memory, currentDecay);

        atRisk.push({
          memory,
          currentDecay,
          daysUntilThreshold,
          riskLevel,
        });
      }
    }

    // Sort by risk level (critical first) then by decay (lowest first)
    const riskOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    return atRisk.sort((a, b) => {
      const riskDiff = riskOrder[a.riskLevel] - riskOrder[b.riskLevel];
      if (riskDiff !== 0) return riskDiff;
      return a.currentDecay - b.currentDecay;
    });
  }

  /**
   * Generate a complete dashboard report.
   *
   * @param memories - Array of memory records to analyze
   * @returns Complete dashboard report with all metrics
   */
  generateDashboardReport(memories: MemoryRecord[]): DashboardReport {
    const countsByType = this.getMemoryCountsByType(memories);
    const countsByPhase = this.getMemoryCountsByPhase(memories);
    const decayDistribution = this.getDecayDistribution(memories);
    const atRiskMemories = this.getAtRiskMemories(memories);

    // Calculate health score (0-100)
    const healthScore = this.calculateHealthScore(memories, decayDistribution, atRiskMemories);

    return {
      timestamp: Date.now(),
      totalMemories: memories.length,
      countsByType,
      countsByPhase,
      decayDistribution,
      atRiskMemories,
      healthScore,
    };
  }

  /**
   * Format dashboard report for CLI output.
   *
   * @param report - Optional pre-generated report, or pass memories array
   * @param memories - Optional memories array to generate report from
   * @returns CLI-friendly formatted string
   */
  formatForCLI(report?: DashboardReport, memories?: MemoryRecord[]): string {
    const dashboardReport = report ?? (memories ? this.generateDashboardReport(memories) : null);

    if (!dashboardReport) {
      return 'Error: No report data or memories provided';
    }

    const timestamp = new Date(dashboardReport.timestamp).toISOString();
    const lines: string[] = [];

    // Header
    lines.push('');
    lines.push('================================================================');
    lines.push('           MEMORY LIFECYCLE DASHBOARD');
    lines.push('================================================================');
    lines.push(`  Generated: ${timestamp}`);
    lines.push(`  Health Score: ${this.formatHealthScore(dashboardReport.healthScore)}`);
    lines.push('');

    // Summary
    lines.push('--- SUMMARY ---');
    lines.push(`  Total Memories: ${dashboardReport.totalMemories}`);
    lines.push('');

    // Counts by Type
    lines.push('--- BY TYPE ---');
    lines.push(`  Factual:      ${this.padNumber(dashboardReport.countsByType.FACTUAL, 5)} ${this.makeBar(dashboardReport.countsByType.FACTUAL, dashboardReport.totalMemories)}`);
    lines.push(`  Experiential: ${this.padNumber(dashboardReport.countsByType.EXPERIENTIAL, 5)} ${this.makeBar(dashboardReport.countsByType.EXPERIENTIAL, dashboardReport.totalMemories)}`);
    lines.push(`  Working:      ${this.padNumber(dashboardReport.countsByType.WORKING, 5)} ${this.makeBar(dashboardReport.countsByType.WORKING, dashboardReport.totalMemories)}`);
    lines.push('');

    // Counts by Phase
    lines.push('--- BY PHASE ---');
    lines.push(`  Formation:  ${this.padNumber(dashboardReport.countsByPhase.formation, 5)} ${this.makeBar(dashboardReport.countsByPhase.formation, dashboardReport.totalMemories)}`);
    lines.push(`  Evolution:  ${this.padNumber(dashboardReport.countsByPhase.evolution, 5)} ${this.makeBar(dashboardReport.countsByPhase.evolution, dashboardReport.totalMemories)}`);
    lines.push(`  Retrieval:  ${this.padNumber(dashboardReport.countsByPhase.retrieval, 5)} ${this.makeBar(dashboardReport.countsByPhase.retrieval, dashboardReport.totalMemories)}`);
    lines.push('');

    // Decay Distribution
    lines.push('--- DECAY DISTRIBUTION ---');
    lines.push(`  Average: ${dashboardReport.decayDistribution.averageDecay.toFixed(3)}  Median: ${dashboardReport.decayDistribution.medianDecay.toFixed(3)}`);
    lines.push('');
    for (const bucket of dashboardReport.decayDistribution.buckets) {
      const label = `  ${bucket.min.toFixed(1)}-${bucket.max.toFixed(1)}:`;
      const bar = this.makeBar(bucket.count, dashboardReport.totalMemories, 20);
      lines.push(`${label.padEnd(12)} ${this.padNumber(bucket.count, 5)} ${bar} (${bucket.percentage.toFixed(1)}%)`);
    }
    lines.push('');

    // At-Risk Memories
    lines.push('--- AT-RISK MEMORIES ---');
    if (dashboardReport.atRiskMemories.length === 0) {
      lines.push('  No memories at risk of pruning');
    } else {
      lines.push(`  ${dashboardReport.atRiskMemories.length} memories approaching prune threshold:`);
      lines.push('');

      // Show top 10 at-risk memories
      const toShow = dashboardReport.atRiskMemories.slice(0, 10);
      for (const atRisk of toShow) {
        const riskBadge = this.formatRiskBadge(atRisk.riskLevel);
        const preview = this.truncateContent(atRisk.memory.content, 40);
        const daysLabel = atRisk.daysUntilThreshold <= 0
          ? 'NOW'
          : `${atRisk.daysUntilThreshold}d`;
        lines.push(`  ${riskBadge} [${atRisk.currentDecay.toFixed(3)}] ${daysLabel.padStart(4)} | ${preview}`);
      }

      if (dashboardReport.atRiskMemories.length > 10) {
        lines.push(`  ... and ${dashboardReport.atRiskMemories.length - 10} more`);
      }
    }
    lines.push('');

    lines.push('================================================================');
    lines.push('  Commands: sm lifecycle | sm-dash | sm stats');
    lines.push('================================================================');
    lines.push('');

    return lines.join('\n');
  }

  // ============================================================================
  // Private Helper Methods
  // ============================================================================

  private createEmptyBuckets(boundaries: number[]): DecayBucket[] {
    const buckets: DecayBucket[] = [];
    for (let i = 0; i < boundaries.length - 1; i++) {
      buckets.push({
        min: boundaries[i],
        max: boundaries[i + 1],
        count: 0,
        percentage: 0,
      });
    }
    return buckets;
  }

  private calculateMedian(sortedValues: number[]): number {
    const len = sortedValues.length;
    if (len === 0) return 0;
    if (len % 2 === 0) {
      return (sortedValues[len / 2 - 1] + sortedValues[len / 2]) / 2;
    }
    return sortedValues[Math.floor(len / 2)];
  }

  private calculateRiskLevel(distanceToThreshold: number): 'low' | 'medium' | 'high' | 'critical' {
    if (distanceToThreshold <= RISK_THRESHOLDS.critical) return 'critical';
    if (distanceToThreshold <= RISK_THRESHOLDS.high) return 'high';
    if (distanceToThreshold <= RISK_THRESHOLDS.medium) return 'medium';
    return 'low';
  }

  private estimateDaysUntilThreshold(memory: MemoryRecord, currentDecay: number): number {
    // Simple linear estimate based on decay rate
    // In reality, this would use the half-life formula from decay.ts
    if (currentDecay <= this.pruneDecayThreshold) return 0;

    // Rough estimate: assume decay continues at same rate
    // This is a simplification; actual decay is exponential
    const daysSinceCreation = (Date.now() - memory.createdAt) / (1000 * 60 * 60 * 24);
    if (daysSinceCreation <= 0) return 999;

    const decayRate = (1 - currentDecay) / daysSinceCreation;
    if (decayRate <= 0) return 999;

    const remainingDecay = currentDecay - this.pruneDecayThreshold;
    const daysUntil = remainingDecay / decayRate;

    return Math.max(0, Math.round(daysUntil));
  }

  private calculateHealthScore(
    memories: MemoryRecord[],
    decayDistribution: DecayDistribution,
    atRiskMemories: AtRiskMemory[]
  ): number {
    if (memories.length === 0) return 100;

    let score = 100;

    // Penalty for at-risk memories
    const atRiskRatio = atRiskMemories.length / memories.length;
    score -= atRiskRatio * 30; // Max 30 point penalty

    // Penalty for critical/high risk memories
    const criticalCount = atRiskMemories.filter(m => m.riskLevel === 'critical').length;
    const highCount = atRiskMemories.filter(m => m.riskLevel === 'high').length;
    score -= criticalCount * 5; // 5 points per critical
    score -= highCount * 2;    // 2 points per high

    // Bonus for healthy distribution (memories spread across phases)
    const phaseBalance = this.calculatePhaseBalance(memories);
    score += phaseBalance * 10; // Up to 10 point bonus

    // Penalty for low average decay
    if (decayDistribution.averageDecay < 0.3) {
      score -= 20;
    } else if (decayDistribution.averageDecay < 0.5) {
      score -= 10;
    }

    return Math.max(0, Math.min(100, Math.round(score)));
  }

  private calculatePhaseBalance(memories: MemoryRecord[]): number {
    if (memories.length === 0) return 0;

    const counts = this.getMemoryCountsByPhase(memories);
    const total = memories.length;
    const ideal = total / 3;

    // Calculate how balanced the distribution is (1.0 = perfectly balanced)
    const variance =
      Math.abs(counts.formation - ideal) +
      Math.abs(counts.evolution - ideal) +
      Math.abs(counts.retrieval - ideal);

    const maxVariance = total * 2; // Worst case: all in one phase
    return 1 - variance / maxVariance;
  }

  private formatHealthScore(score: number): string {
    if (score >= 80) return `${score}/100 [HEALTHY]`;
    if (score >= 60) return `${score}/100 [FAIR]`;
    if (score >= 40) return `${score}/100 [DEGRADED]`;
    return `${score}/100 [CRITICAL]`;
  }

  private formatRiskBadge(level: 'low' | 'medium' | 'high' | 'critical'): string {
    switch (level) {
      case 'critical': return '[CRIT]';
      case 'high':     return '[HIGH]';
      case 'medium':   return '[MED] ';
      case 'low':      return '[LOW] ';
    }
  }

  private makeBar(count: number, total: number, width: number = 20): string {
    if (total === 0) return '[' + ' '.repeat(width) + ']';
    const filled = Math.round((count / total) * width);
    const empty = width - filled;
    return '[' + '#'.repeat(filled) + ' '.repeat(empty) + ']';
  }

  private padNumber(num: number, width: number): string {
    return num.toString().padStart(width, ' ');
  }

  private truncateContent(content: string, maxLength: number): string {
    const cleaned = content.replace(/\s+/g, ' ').trim();
    if (cleaned.length <= maxLength) return cleaned;
    return cleaned.substring(0, maxLength - 3) + '...';
  }
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Create a dashboard instance with default configuration
 */
export function createDashboard(config?: {
  pruneDecayThreshold?: number;
  pruneRelevanceThreshold?: number;
}): MemoryLifecycleDashboard {
  return new MemoryLifecycleDashboard(config);
}

/**
 * Quick function to get memory counts by type
 */
export function getMemoryCountsByType(memories: MemoryRecord[]): MemoryCountsByType {
  const dashboard = new MemoryLifecycleDashboard();
  return dashboard.getMemoryCountsByType(memories);
}

/**
 * Quick function to get memory counts by phase
 */
export function getMemoryCountsByPhase(memories: MemoryRecord[]): MemoryCountsByPhase {
  const dashboard = new MemoryLifecycleDashboard();
  return dashboard.getMemoryCountsByPhase(memories);
}

/**
 * Quick function to get decay distribution
 */
export function getDecayDistribution(memories: MemoryRecord[]): DecayDistribution {
  const dashboard = new MemoryLifecycleDashboard();
  return dashboard.getDecayDistribution(memories);
}

/**
 * Quick function to get at-risk memories
 */
export function getAtRiskMemories(
  memories: MemoryRecord[],
  threshold?: number
): AtRiskMemory[] {
  const dashboard = new MemoryLifecycleDashboard();
  return dashboard.getAtRiskMemories(memories, threshold);
}

/**
 * Quick function to generate formatted CLI output
 */
export function formatDashboardForCLI(memories: MemoryRecord[]): string {
  const dashboard = new MemoryLifecycleDashboard();
  return dashboard.formatForCLI(undefined, memories);
}

// ============================================================================
// Default Instance
// ============================================================================

/** Default dashboard instance */
export const lifecycleDashboard = new MemoryLifecycleDashboard();
