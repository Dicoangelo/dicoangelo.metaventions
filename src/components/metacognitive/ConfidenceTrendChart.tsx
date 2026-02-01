'use client';

import { useMemo } from 'react';
import type { ConfidenceReading } from '@/lib/metacognitive/history';

interface ConfidenceTrendChartProps {
  /** Array of confidence readings (most recent last) */
  readings: ConfidenceReading[];
  /** Chart width in pixels */
  width?: number;
  /** Chart height in pixels */
  height?: number;
  /** Optional CSS class name */
  className?: string;
}

/**
 * Format timestamp for display on x-axis.
 */
function formatTime(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * SVG line chart showing confidence trend over time.
 * X-axis: time, Y-axis: confidence (0-1)
 */
export function ConfidenceTrendChart({
  readings,
  width = 400,
  height = 200,
  className = '',
}: ConfidenceTrendChartProps) {
  // Chart dimensions with padding
  const padding = { top: 20, right: 20, bottom: 40, left: 50 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Filter readings to last 24 hours
  const twentyFourHoursAgo = Date.now() - 24 * 60 * 60 * 1000;
  const filteredReadings = useMemo(
    () => readings.filter((r) => r.timestamp >= twentyFourHoursAgo),
    [readings, twentyFourHoursAgo]
  );

  // Calculate chart data
  const chartData = useMemo(() => {
    if (filteredReadings.length === 0) {
      return { points: [], pathD: '', minTime: 0, maxTime: 0 };
    }

    const minTime = filteredReadings[0].timestamp;
    const maxTime = filteredReadings[filteredReadings.length - 1].timestamp;
    const timeRange = maxTime - minTime || 1; // Avoid division by zero

    const points = filteredReadings.map((reading) => {
      const x =
        padding.left +
        ((reading.timestamp - minTime) / timeRange) * chartWidth;
      const y =
        padding.top +
        (1 - reading.confidence) * chartHeight; // Invert Y for SVG coords
      return { x, y, reading };
    });

    // Generate SVG path
    const pathD = points
      .map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`))
      .join(' ');

    return { points, pathD, minTime, maxTime };
  }, [filteredReadings, chartWidth, chartHeight, padding]);

  // Generate Y-axis labels
  const yLabels = [1.0, 0.75, 0.5, 0.25, 0];

  // Generate area path for gradient fill
  const areaPath = useMemo(() => {
    if (chartData.points.length === 0) return '';

    const first = chartData.points[0];
    const last = chartData.points[chartData.points.length - 1];

    return `${chartData.pathD} L ${last.x} ${padding.top + chartHeight} L ${first.x} ${padding.top + chartHeight} Z`;
  }, [chartData, padding, chartHeight]);

  // Empty state
  if (filteredReadings.length === 0) {
    return (
      <div className={`confidence-trend-chart ${className}`}>
        <h4 className="confidence-trend-chart__title">Confidence Trend (24h)</h4>
        <div className="confidence-trend-chart__empty">
          <span>No readings in the last 24 hours</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`confidence-trend-chart ${className}`}>
      <h4 className="confidence-trend-chart__title">Confidence Trend (24h)</h4>

      <svg
        width={width}
        height={height}
        className="confidence-trend-chart__svg"
        role="img"
        aria-label="Confidence trend line chart showing confidence levels over the last 24 hours"
      >
        <defs>
          {/* Gradient for area fill */}
          <linearGradient id="confidenceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.05" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {yLabels.map((label) => {
          const y = padding.top + (1 - label) * chartHeight;
          return (
            <line
              key={label}
              x1={padding.left}
              y1={y}
              x2={padding.left + chartWidth}
              y2={y}
              className="confidence-trend-chart__grid-line"
            />
          );
        })}

        {/* Y-axis labels */}
        {yLabels.map((label) => {
          const y = padding.top + (1 - label) * chartHeight;
          return (
            <text
              key={label}
              x={padding.left - 10}
              y={y + 4}
              className="confidence-trend-chart__y-label"
            >
              {(label * 100).toFixed(0)}%
            </text>
          );
        })}

        {/* Area fill */}
        {areaPath && (
          <path
            d={areaPath}
            fill="url(#confidenceGradient)"
            className="confidence-trend-chart__area"
          />
        )}

        {/* Line */}
        {chartData.pathD && (
          <path
            d={chartData.pathD}
            fill="none"
            className="confidence-trend-chart__line"
          />
        )}

        {/* Data points */}
        {chartData.points.map((point, index) => (
          <circle
            key={index}
            cx={point.x}
            cy={point.y}
            r={4}
            className="confidence-trend-chart__point"
          >
            <title>
              {formatTime(point.reading.timestamp)}: {(point.reading.confidence * 100).toFixed(0)}%
            </title>
          </circle>
        ))}

        {/* X-axis labels (start and end time) */}
        <text
          x={padding.left}
          y={height - 10}
          className="confidence-trend-chart__x-label"
        >
          {formatTime(chartData.minTime)}
        </text>
        <text
          x={width - padding.right}
          y={height - 10}
          className="confidence-trend-chart__x-label"
          textAnchor="end"
        >
          {formatTime(chartData.maxTime)}
        </text>
      </svg>
    </div>
  );
}

export default ConfidenceTrendChart;
