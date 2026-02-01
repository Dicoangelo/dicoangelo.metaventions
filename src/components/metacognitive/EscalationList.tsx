'use client';

import type { EscalationEvent } from '@/lib/metacognitive/types';

interface EscalationListProps {
  /** Array of escalation events (most recent first) */
  events: EscalationEvent[];
  /** Maximum number of events to display */
  maxEvents?: number;
  /** Optional CSS class name */
  className?: string;
}

/**
 * Format timestamp for display.
 */
function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - timestamp;
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  // Show relative time for recent events
  if (diffMins < 1) {
    return 'Just now';
  } else if (diffMins < 60) {
    return `${diffMins}m ago`;
  } else if (diffHours < 24) {
    return `${diffHours}h ago`;
  }

  // Show date for older events
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

/**
 * Get color for model badge based on model name.
 */
function getModelColor(model: string): string {
  const normalizedModel = model.toLowerCase();
  switch (normalizedModel) {
    case 'haiku':
      return 'var(--escalation-haiku, #22c55e)';
    case 'sonnet':
      return 'var(--escalation-sonnet, #eab308)';
    case 'opus':
      return 'var(--escalation-opus, #ef4444)';
    default:
      return 'var(--muted)';
  }
}

/**
 * List component displaying recent model escalation events.
 * Shows timestamp, model transition, reason, and confidence at escalation time.
 */
export function EscalationList({
  events,
  maxEvents = 10,
  className = '',
}: EscalationListProps) {
  // Sort by timestamp descending and limit
  const sortedEvents = [...events]
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, maxEvents);

  return (
    <div className={`escalation-list ${className}`}>
      <h4 className="escalation-list__title">Recent Escalations</h4>

      {sortedEvents.length === 0 ? (
        <div className="escalation-list__empty">
          <span className="escalation-list__empty-icon">&#x2713;</span>
          <span>No escalations recorded</span>
        </div>
      ) : (
        <ul className="escalation-list__items">
          {sortedEvents.map((event, index) => (
            <li key={`${event.timestamp}-${index}`} className="escalation-list__item">
              <div className="escalation-list__header">
                <span className="escalation-list__timestamp">
                  {formatTimestamp(event.timestamp)}
                </span>
                <span className="escalation-list__confidence">
                  {(event.confidence * 100).toFixed(0)}%
                </span>
              </div>

              <div className="escalation-list__transition">
                <span
                  className="escalation-list__model"
                  style={{ backgroundColor: getModelColor(event.fromModel) }}
                >
                  {event.fromModel}
                </span>
                <span className="escalation-list__arrow">&#8594;</span>
                <span
                  className="escalation-list__model"
                  style={{ backgroundColor: getModelColor(event.toModel) }}
                >
                  {event.toModel}
                </span>
              </div>

              <p className="escalation-list__reason">{event.reason}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default EscalationList;
