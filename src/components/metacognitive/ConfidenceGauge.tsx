'use client';

import { useEffect, useState } from 'react';
import type { ConfidenceLevel } from '@/lib/metacognitive/types';

interface ConfidenceGaugeProps {
  /** Confidence value from 0 to 1 */
  confidence: number;
  /** Semantic confidence level */
  confidenceLevel: ConfidenceLevel;
  /** Whether to animate the gauge on mount */
  animated?: boolean;
  /** Optional CSS class name */
  className?: string;
}

/**
 * Color configuration for each confidence level.
 * Colors follow a traffic-light pattern for intuitive understanding.
 */
const levelConfig: Record<ConfidenceLevel, {
  color: string;
  bgColor: string;
  label: string;
}> = {
  high: {
    color: '#22c55e',
    bgColor: 'rgba(34, 197, 94, 0.1)',
    label: 'High Confidence',
  },
  medium: {
    color: '#eab308',
    bgColor: 'rgba(234, 179, 8, 0.1)',
    label: 'Medium Confidence',
  },
  low: {
    color: '#f97316',
    bgColor: 'rgba(249, 115, 22, 0.1)',
    label: 'Low Confidence',
  },
  very_low: {
    color: '#ef4444',
    bgColor: 'rgba(239, 68, 68, 0.1)',
    label: 'Very Low',
  },
};

/**
 * Circular gauge component displaying current confidence level.
 * Shows a filled arc proportional to confidence score (0-100%).
 */
export function ConfidenceGauge({
  confidence,
  confidenceLevel,
  animated = true,
  className = '',
}: ConfidenceGaugeProps) {
  const [displayValue, setDisplayValue] = useState(animated ? 0 : confidence);
  const config = levelConfig[confidenceLevel];
  const percentage = Math.round(displayValue * 100);

  // Animate the gauge fill on mount
  useEffect(() => {
    if (!animated) {
      setDisplayValue(confidence);
      return;
    }

    const duration = 1200;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out cubic for smooth deceleration
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(eased * confidence);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [confidence, animated]);

  // SVG circle calculations
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - displayValue * circumference;

  return (
    <div className={`confidence-gauge ${className}`}>
      <div className="confidence-gauge__container">
        <svg
          aria-hidden="true"
          width="160"
          height="160"
          className="confidence-gauge__svg"
        >
          {/* Background circle */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            className="confidence-gauge__track"
            strokeWidth="10"
          />
          {/* Progress arc */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke={config.color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="confidence-gauge__progress"
          />
        </svg>

        {/* Center display */}
        <div className="confidence-gauge__center">
          <span
            className="confidence-gauge__value"
            style={{ color: config.color }}
          >
            {percentage}%
          </span>
        </div>
      </div>

      {/* Level badge */}
      <div
        className="confidence-gauge__badge"
        style={{
          backgroundColor: config.bgColor,
          color: config.color,
          borderColor: config.color,
        }}
      >
        {config.label}
      </div>
    </div>
  );
}

export default ConfidenceGauge;
