'use client';

import { useMemo } from 'react';
import { ConfidenceGauge } from './metacognitive/ConfidenceGauge';
import { ConfidenceTrendChart } from './metacognitive/ConfidenceTrendChart';
import { EscalationList } from './metacognitive/EscalationList';
import { ModeDistribution } from './metacognitive/ModeDistribution';
import type { ConfidenceLevel, EscalationEvent, ReasoningMode } from '@/lib/metacognitive/types';
import type { ConfidenceReading } from '@/lib/metacognitive/history';

/**
 * Props for MetacognitiveDashboard component.
 */
interface MetacognitiveDashboardProps {
  /** Current confidence score (0-1) */
  currentConfidence?: number;
  /** Current confidence level */
  currentConfidenceLevel?: ConfidenceLevel;
  /** Array of historical confidence readings */
  historyReadings?: ConfidenceReading[];
  /** Array of escalation events */
  escalationEvents?: EscalationEvent[];
  /** Percentage of time spent in System 1 mode */
  s1Percent?: number;
  /** Percentage of time spent in System 2 mode */
  s2Percent?: number;
  /** Optional CSS class name */
  className?: string;
}

/**
 * Generate mock data for demonstration purposes.
 * Used when no real data is provided.
 */
function generateMockData(): {
  confidence: number;
  confidenceLevel: ConfidenceLevel;
  readings: ConfidenceReading[];
  escalations: EscalationEvent[];
  s1Percent: number;
  s2Percent: number;
} {
  const now = Date.now();
  const hourMs = 60 * 60 * 1000;

  // Generate mock readings over 24 hours
  const readings: ConfidenceReading[] = [];
  for (let i = 0; i < 24; i++) {
    const timestamp = now - (24 - i) * hourMs;
    // Simulate varying confidence with some randomness
    const baseConfidence = 0.7 + Math.sin(i / 4) * 0.15;
    const confidence = Math.min(1, Math.max(0, baseConfidence + (Math.random() - 0.5) * 0.1));

    let confidenceLevel: ConfidenceLevel;
    if (confidence >= 0.8) confidenceLevel = 'high';
    else if (confidence >= 0.6) confidenceLevel = 'medium';
    else if (confidence >= 0.4) confidenceLevel = 'low';
    else confidenceLevel = 'very_low';

    readings.push({
      confidence,
      confidenceLevel,
      timestamp,
      model: confidence >= 0.6 ? 'sonnet' : 'opus',
      outcome: confidence >= 0.5 ? 'success' : 'escalated',
    });
  }

  // Generate mock escalation events
  const escalations: EscalationEvent[] = [
    {
      fromModel: 'haiku',
      toModel: 'sonnet',
      reason: 'Complex query detected requiring deeper analysis',
      confidence: 0.45,
      timestamp: now - 2 * hourMs,
    },
    {
      fromModel: 'sonnet',
      toModel: 'opus',
      reason: 'Low confidence on architectural decision',
      confidence: 0.32,
      timestamp: now - 5 * hourMs,
    },
    {
      fromModel: 'haiku',
      toModel: 'sonnet',
      reason: 'Multi-step reasoning required',
      confidence: 0.52,
      timestamp: now - 8 * hourMs,
    },
  ];

  const currentReading = readings[readings.length - 1];

  return {
    confidence: currentReading.confidence,
    confidenceLevel: currentReading.confidenceLevel,
    readings,
    escalations,
    s1Percent: 65,
    s2Percent: 35,
  };
}

/**
 * MetacognitiveDashboard displays the current metacognitive state of the AI system.
 *
 * Shows four key metrics:
 * 1. Current Confidence - Circular gauge with confidence level
 * 2. Confidence Trend - Line chart of last 24 hours
 * 3. Recent Escalations - List of model escalation events
 * 4. Mode Distribution - Pie chart of S1 vs S2 reasoning time
 *
 * @example
 * ```tsx
 * <MetacognitiveDashboard
 *   currentConfidence={0.75}
 *   currentConfidenceLevel="medium"
 *   historyReadings={readings}
 *   escalationEvents={events}
 *   s1Percent={70}
 *   s2Percent={30}
 * />
 * ```
 */
export function MetacognitiveDashboard({
  currentConfidence,
  currentConfidenceLevel,
  historyReadings,
  escalationEvents,
  s1Percent,
  s2Percent,
  className = '',
}: MetacognitiveDashboardProps) {
  // Use mock data if no real data provided
  const mockData = useMemo(() => {
    const hasSomeData =
      currentConfidence !== undefined ||
      historyReadings !== undefined ||
      escalationEvents !== undefined;

    return hasSomeData ? null : generateMockData();
  }, [currentConfidence, historyReadings, escalationEvents]);

  // Resolve values, preferring props over mock data
  const confidence = currentConfidence ?? mockData?.confidence ?? 0.75;
  const confidenceLevel = currentConfidenceLevel ?? mockData?.confidenceLevel ?? 'medium';
  const readings = historyReadings ?? mockData?.readings ?? [];
  const escalations = escalationEvents ?? mockData?.escalations ?? [];
  const system1Percent = s1Percent ?? mockData?.s1Percent ?? 50;
  const system2Percent = s2Percent ?? mockData?.s2Percent ?? 50;

  return (
    <div className={`metacognitive-dashboard ${className}`}>
      <div className="metacognitive-dashboard__header">
        <h2 className="metacognitive-dashboard__title">Metacognitive State</h2>
        <p className="metacognitive-dashboard__subtitle">
          Real-time AI reasoning transparency
        </p>
      </div>

      <div className="metacognitive-dashboard__grid">
        {/* Current Confidence Gauge */}
        <div className="metacognitive-dashboard__panel metacognitive-dashboard__panel--gauge">
          <ConfidenceGauge
            confidence={confidence}
            confidenceLevel={confidenceLevel}
            animated={true}
          />
        </div>

        {/* Confidence Trend Chart */}
        <div className="metacognitive-dashboard__panel metacognitive-dashboard__panel--trend">
          <ConfidenceTrendChart
            readings={readings}
            width={400}
            height={200}
          />
        </div>

        {/* Recent Escalations List */}
        <div className="metacognitive-dashboard__panel metacognitive-dashboard__panel--escalations">
          <EscalationList
            events={escalations}
            maxEvents={10}
          />
        </div>

        {/* Mode Distribution Chart */}
        <div className="metacognitive-dashboard__panel metacognitive-dashboard__panel--distribution">
          <ModeDistribution
            s1Percent={system1Percent}
            s2Percent={system2Percent}
          />
        </div>
      </div>
    </div>
  );
}

export default MetacognitiveDashboard;
