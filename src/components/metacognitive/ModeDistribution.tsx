'use client';

import { useMemo } from 'react';
import { ReasoningMode } from '@/lib/metacognitive/types';

interface ModeDistributionProps {
  /** Percentage of time in System 1 mode (0-100) */
  s1Percent: number;
  /** Percentage of time in System 2 mode (0-100) */
  s2Percent: number;
  /** Optional CSS class name */
  className?: string;
}

/**
 * Color configuration for reasoning modes.
 */
const modeConfig = {
  [ReasoningMode.SYSTEM_1]: {
    color: 'var(--mode-s1, #6366f1)',
    label: 'System 1',
    description: 'Fast, intuitive',
  },
  [ReasoningMode.SYSTEM_2]: {
    color: 'var(--mode-s2, #8b5cf6)',
    label: 'System 2',
    description: 'Slow, analytical',
  },
};

/**
 * Donut/pie chart showing distribution of System 1 vs System 2 reasoning time.
 * Uses CSS conic-gradient for simple implementation without chart libraries.
 */
export function ModeDistribution({
  s1Percent,
  s2Percent,
  className = '',
}: ModeDistributionProps) {
  // Normalize percentages to ensure they sum to 100
  const total = s1Percent + s2Percent;
  const normalizedS1 = total > 0 ? (s1Percent / total) * 100 : 50;
  const normalizedS2 = total > 0 ? (s2Percent / total) * 100 : 50;

  // Calculate conic gradient stops
  const gradientStyle = useMemo(() => {
    const s1End = normalizedS1;
    return {
      background: `conic-gradient(
        ${modeConfig[ReasoningMode.SYSTEM_1].color} 0% ${s1End}%,
        ${modeConfig[ReasoningMode.SYSTEM_2].color} ${s1End}% 100%
      )`,
    };
  }, [normalizedS1]);

  // Dominant mode
  const dominant =
    normalizedS1 > normalizedS2 ? ReasoningMode.SYSTEM_1 : ReasoningMode.SYSTEM_2;

  return (
    <div className={`mode-distribution ${className}`}>
      <h4 className="mode-distribution__title">Mode Distribution</h4>

      <div className="mode-distribution__chart-container">
        {/* Pie chart */}
        <div className="mode-distribution__chart" style={gradientStyle}>
          <div className="mode-distribution__chart-inner">
            <span className="mode-distribution__dominant">
              {dominant === ReasoningMode.SYSTEM_1 ? 'S1' : 'S2'}
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="mode-distribution__legend">
          <div className="mode-distribution__legend-item">
            <span
              className="mode-distribution__legend-dot"
              style={{ backgroundColor: modeConfig[ReasoningMode.SYSTEM_1].color }}
            />
            <div className="mode-distribution__legend-text">
              <span className="mode-distribution__legend-label">
                {modeConfig[ReasoningMode.SYSTEM_1].label}
              </span>
              <span className="mode-distribution__legend-value">
                {normalizedS1.toFixed(1)}%
              </span>
              <span className="mode-distribution__legend-desc">
                {modeConfig[ReasoningMode.SYSTEM_1].description}
              </span>
            </div>
          </div>

          <div className="mode-distribution__legend-item">
            <span
              className="mode-distribution__legend-dot"
              style={{ backgroundColor: modeConfig[ReasoningMode.SYSTEM_2].color }}
            />
            <div className="mode-distribution__legend-text">
              <span className="mode-distribution__legend-label">
                {modeConfig[ReasoningMode.SYSTEM_2].label}
              </span>
              <span className="mode-distribution__legend-value">
                {normalizedS2.toFixed(1)}%
              </span>
              <span className="mode-distribution__legend-desc">
                {modeConfig[ReasoningMode.SYSTEM_2].description}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModeDistribution;
