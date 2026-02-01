/**
 * Metacognitive Alerts Module
 *
 * Phase 7 - Metacognitive State Vector Integration
 * US-008: Metacognitive alerts when mode switches
 *
 * Features:
 * - Alerts triggered on System 1 -> System 2 transitions
 * - Alert includes reason for switch (low confidence, complex query, etc.)
 * - Configurable alert modes: silent, console, notification
 * - Alert history accessible via dashboard or API
 */

import { ReasoningMode, ModeTrigger } from './types';
import { modeTracker, type ModeTransition } from './mode-tracker';
import { METACOGNITIVE_CONFIG, isDebugEnabled } from './config';

/**
 * Alert output mode.
 * - silent: No output, alerts are just logged to history
 * - console: Output to console.log/console.warn
 * - notification: Browser notification (if supported)
 */
export type AlertMode = 'silent' | 'console' | 'notification';

/**
 * Type of metacognitive alert.
 * - mode_switch: Transition between S1 and S2
 * - escalation: Model escalation event
 * - low_confidence: Confidence dropped below threshold
 */
export type AlertType = 'mode_switch' | 'escalation' | 'low_confidence';

/**
 * A metacognitive alert event.
 */
export interface ModeAlert {
  /** Unique identifier for the alert */
  id: string;
  /** Type of alert */
  type: AlertType;
  /** Previous reasoning mode */
  fromMode: ReasoningMode;
  /** New reasoning mode */
  toMode: ReasoningMode;
  /** Human-readable reason for the alert */
  reason: string;
  /** What triggered the mode change */
  trigger: ModeTrigger;
  /** Confidence value at time of alert (if applicable) */
  confidence?: number;
  /** Unix timestamp of the alert */
  timestamp: number;
  /** Whether the alert has been acknowledged */
  acknowledged: boolean;
}

/**
 * Configuration for the alert manager.
 */
export interface AlertConfig {
  /** Output mode for alerts */
  mode: AlertMode;
  /** Enable alerts on mode switches (S1 <-> S2) */
  enableModeSwitch: boolean;
  /** Enable alerts on model escalation events */
  enableEscalation: boolean;
  /** Enable alerts when confidence drops below threshold */
  enableLowConfidence: boolean;
}

/**
 * Callback type for alert events.
 */
export type AlertCallback = (alert: ModeAlert) => void;

/**
 * Default alert configuration.
 */
const DEFAULT_ALERT_CONFIG: AlertConfig = {
  mode: 'console',
  enableModeSwitch: true,
  enableEscalation: true,
  enableLowConfidence: true,
};

/**
 * Generate a unique alert ID.
 */
function generateAlertId(): string {
  return `alert_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Format a mode switch alert message.
 */
function formatAlertMessage(alert: ModeAlert): string {
  const modeLabels = {
    [ReasoningMode.SYSTEM_1]: 'S1',
    [ReasoningMode.SYSTEM_2]: 'S2',
  };

  const confidenceStr = alert.confidence !== undefined
    ? ` (${alert.confidence.toFixed(2)})`
    : '';

  return `[ALERT] Mode switch ${modeLabels[alert.fromMode]}\u2192${modeLabels[alert.toMode]}: ${alert.reason}${confidenceStr}`;
}

/**
 * Metacognitive Alert Manager
 *
 * Manages alerts for metacognitive state changes including mode switches,
 * escalations, and low confidence events.
 *
 * @example
 * ```typescript
 * import { alertManager } from './alerts';
 *
 * // Configure alert mode
 * alertManager.setMode('console');
 *
 * // Register alert callback
 * alertManager.onAlert((alert) => {
 *   console.log(`Alert: ${alert.reason}`);
 * });
 *
 * // Manual alert trigger
 * alertManager.alertModeSwitch(
 *   ReasoningMode.SYSTEM_1,
 *   ReasoningMode.SYSTEM_2,
 *   'low_confidence',
 *   'Low confidence triggered deeper reasoning',
 *   0.45
 * );
 *
 * // Get alert history
 * const alerts = alertManager.getAlerts();
 * const unacknowledged = alertManager.getUnacknowledged();
 * ```
 */
export class MetacognitiveAlertManager {
  private config: AlertConfig;
  private alerts: ModeAlert[] = [];
  private callbacks: AlertCallback[] = [];

  /**
   * Create a new MetacognitiveAlertManager.
   *
   * @param config - Optional partial configuration (merged with defaults)
   */
  constructor(config?: Partial<AlertConfig>) {
    this.config = { ...DEFAULT_ALERT_CONFIG, ...config };
  }

  /**
   * Set the alert output mode.
   *
   * @param mode - New alert mode: 'silent', 'console', or 'notification'
   */
  setMode(mode: AlertMode): void {
    this.config.mode = mode;

    if (isDebugEnabled()) {
      console.log(`[AlertManager] Alert mode set to: ${mode}`);
    }
  }

  /**
   * Get the current alert output mode.
   *
   * @returns Current alert mode
   */
  getMode(): AlertMode {
    return this.config.mode;
  }

  /**
   * Get the current alert configuration.
   *
   * @returns Current alert configuration
   */
  getConfig(): AlertConfig {
    return { ...this.config };
  }

  /**
   * Update alert configuration.
   *
   * @param config - Partial configuration to merge
   */
  updateConfig(config: Partial<AlertConfig>): void {
    this.config = { ...this.config, ...config };

    if (isDebugEnabled()) {
      console.log('[AlertManager] Configuration updated:', this.config);
    }
  }

  /**
   * Trigger an alert.
   *
   * The alert is added to history and output according to the configured mode.
   * All registered callbacks are invoked with the alert.
   *
   * @param alertData - Alert data (id, timestamp, acknowledged are auto-generated)
   * @returns The created alert
   */
  trigger(alertData: Omit<ModeAlert, 'id' | 'timestamp' | 'acknowledged'>): ModeAlert {
    const alert: ModeAlert = {
      ...alertData,
      id: generateAlertId(),
      timestamp: Date.now(),
      acknowledged: false,
    };

    // Add to history
    this.alerts.unshift(alert);

    // Trim history if needed
    if (this.alerts.length > METACOGNITIVE_CONFIG.monitoring.maxHistorySize) {
      this.alerts = this.alerts.slice(0, METACOGNITIVE_CONFIG.monitoring.maxHistorySize);
    }

    // Output based on mode
    this.outputAlert(alert);

    // Trigger callbacks
    for (const callback of this.callbacks) {
      try {
        callback(alert);
      } catch (error) {
        if (isDebugEnabled()) {
          console.error('[AlertManager] Callback error:', error);
        }
      }
    }

    return alert;
  }

  /**
   * Alert specifically for mode switches.
   *
   * Only triggers an alert if:
   * 1. Mode switch alerts are enabled
   * 2. The transition is from System 1 to System 2 (escalation)
   *
   * @param from - Previous mode
   * @param to - New mode
   * @param trigger - What triggered the switch
   * @param reason - Human-readable reason for the switch
   * @param confidence - Optional confidence value at time of switch
   * @returns The created alert, or null if alerts are disabled/not applicable
   */
  alertModeSwitch(
    from: ReasoningMode,
    to: ReasoningMode,
    trigger: ModeTrigger,
    reason: string,
    confidence?: number
  ): ModeAlert | null {
    if (!this.config.enableModeSwitch) {
      return null;
    }

    // Only alert on S1 -> S2 transitions (escalations to deeper thinking)
    if (from !== ReasoningMode.SYSTEM_1 || to !== ReasoningMode.SYSTEM_2) {
      return null;
    }

    return this.trigger({
      type: 'mode_switch',
      fromMode: from,
      toMode: to,
      trigger,
      reason,
      confidence,
    });
  }

  /**
   * Alert for escalation events.
   *
   * @param from - Previous mode
   * @param to - New mode
   * @param trigger - What triggered the escalation
   * @param reason - Human-readable reason
   * @param confidence - Optional confidence value
   * @returns The created alert, or null if escalation alerts are disabled
   */
  alertEscalation(
    from: ReasoningMode,
    to: ReasoningMode,
    trigger: ModeTrigger,
    reason: string,
    confidence?: number
  ): ModeAlert | null {
    if (!this.config.enableEscalation) {
      return null;
    }

    return this.trigger({
      type: 'escalation',
      fromMode: from,
      toMode: to,
      trigger,
      reason,
      confidence,
    });
  }

  /**
   * Alert for low confidence events.
   *
   * @param currentMode - Current reasoning mode
   * @param confidence - The low confidence value
   * @param reason - Human-readable reason
   * @returns The created alert, or null if low confidence alerts are disabled
   */
  alertLowConfidence(
    currentMode: ReasoningMode,
    confidence: number,
    reason: string
  ): ModeAlert | null {
    if (!this.config.enableLowConfidence) {
      return null;
    }

    return this.trigger({
      type: 'low_confidence',
      fromMode: currentMode,
      toMode: currentMode, // Mode didn't change
      trigger: 'low_confidence',
      reason,
      confidence,
    });
  }

  /**
   * Get all alerts in history.
   *
   * @returns Array of alerts, newest first
   */
  getAlerts(): ReadonlyArray<ModeAlert> {
    return [...this.alerts];
  }

  /**
   * Get unacknowledged alerts.
   *
   * @returns Array of unacknowledged alerts, newest first
   */
  getUnacknowledged(): ModeAlert[] {
    return this.alerts.filter((alert) => !alert.acknowledged);
  }

  /**
   * Get the count of unacknowledged alerts.
   *
   * @returns Number of unacknowledged alerts
   */
  getUnacknowledgedCount(): number {
    return this.alerts.filter((alert) => !alert.acknowledged).length;
  }

  /**
   * Acknowledge a specific alert by ID.
   *
   * @param alertId - The ID of the alert to acknowledge
   * @returns True if alert was found and acknowledged, false otherwise
   */
  acknowledge(alertId: string): boolean {
    const alert = this.alerts.find((a) => a.id === alertId);
    if (alert) {
      alert.acknowledged = true;
      return true;
    }
    return false;
  }

  /**
   * Acknowledge all unacknowledged alerts.
   *
   * @returns Number of alerts acknowledged
   */
  acknowledgeAll(): number {
    let count = 0;
    for (const alert of this.alerts) {
      if (!alert.acknowledged) {
        alert.acknowledged = true;
        count++;
      }
    }
    return count;
  }

  /**
   * Register a callback to be invoked when alerts are triggered.
   *
   * @param callback - The callback function to register
   * @returns Unsubscribe function to remove the callback
   */
  onAlert(callback: AlertCallback): () => void {
    this.callbacks.push(callback);

    return () => {
      const index = this.callbacks.indexOf(callback);
      if (index !== -1) {
        this.callbacks.splice(index, 1);
      }
    };
  }

  /**
   * Clear all alert history.
   */
  clearHistory(): void {
    this.alerts = [];

    if (isDebugEnabled()) {
      console.log('[AlertManager] Alert history cleared');
    }
  }

  /**
   * Get the number of registered callbacks.
   *
   * @returns Number of callbacks
   */
  getCallbackCount(): number {
    return this.callbacks.length;
  }

  /**
   * Remove all registered callbacks.
   */
  clearCallbacks(): void {
    this.callbacks = [];
  }

  /**
   * Format alert history for CLI output.
   *
   * @returns Formatted string for CLI display
   */
  formatForCLI(): string {
    if (this.alerts.length === 0) {
      return 'No alerts in history.';
    }

    const lines = [
      '=== Metacognitive Alerts ===',
      `Total: ${this.alerts.length} | Unacknowledged: ${this.getUnacknowledgedCount()}`,
      '',
    ];

    for (const alert of this.alerts.slice(0, 20)) {
      const ackStatus = alert.acknowledged ? '[ACK]' : '[NEW]';
      const timestamp = new Date(alert.timestamp).toISOString().slice(11, 19);
      const confidenceStr = alert.confidence !== undefined
        ? ` C:${alert.confidence.toFixed(2)}`
        : '';

      lines.push(
        `${ackStatus} ${timestamp} ${alert.fromMode}->${alert.toMode}${confidenceStr}: ${alert.reason}`
      );
    }

    if (this.alerts.length > 20) {
      lines.push(`... and ${this.alerts.length - 20} more`);
    }

    return lines.join('\n');
  }

  /**
   * Output an alert according to the configured mode.
   */
  private outputAlert(alert: ModeAlert): void {
    const message = formatAlertMessage(alert);

    switch (this.config.mode) {
      case 'silent':
        // No output
        break;

      case 'console':
        if (alert.type === 'low_confidence') {
          console.warn(message);
        } else {
          console.log(message);
        }
        break;

      case 'notification':
        // Console fallback + notification if available
        console.log(message);
        this.sendNotification(alert, message);
        break;
    }
  }

  /**
   * Send a browser notification (if supported).
   */
  private sendNotification(alert: ModeAlert, message: string): void {
    // Check if we're in a browser environment with Notification support
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return;
    }

    // Check permission
    if (Notification.permission === 'granted') {
      new Notification('Metacognitive Alert', {
        body: message,
        icon: '/favicon.ico',
        tag: alert.id, // Prevent duplicate notifications
      });
    } else if (Notification.permission !== 'denied') {
      // Request permission
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          new Notification('Metacognitive Alert', {
            body: message,
            icon: '/favicon.ico',
            tag: alert.id,
          });
        }
      });
    }
  }
}

/**
 * Default alert manager instance.
 *
 * Pre-configured and ready to use. Auto-wired to modeTracker
 * to receive mode transition events.
 *
 * @example
 * ```typescript
 * import { alertManager } from './alerts';
 *
 * // Configure
 * alertManager.setMode('notification');
 *
 * // Get alerts
 * const alerts = alertManager.getAlerts();
 * const unack = alertManager.getUnacknowledged();
 *
 * // Acknowledge
 * alertManager.acknowledgeAll();
 *
 * // Format for CLI
 * console.log(alertManager.formatForCLI());
 * ```
 */
export const alertManager = new MetacognitiveAlertManager();

/**
 * Auto-wire to modeTracker for S1->S2 transitions.
 *
 * This sets up automatic alerting when the modeTracker detects
 * a transition from System 1 (fast thinking) to System 2 (slow thinking).
 */
modeTracker.onTransition((transition: ModeTransition) => {
  if (
    transition.from === ReasoningMode.SYSTEM_1 &&
    transition.to === ReasoningMode.SYSTEM_2
  ) {
    // Generate reason based on trigger
    let reason: string;
    switch (transition.trigger) {
      case 'low_confidence':
        reason = `Low confidence${transition.confidence !== undefined ? ` (${transition.confidence.toFixed(2)})` : ''} triggered deeper reasoning`;
        break;
      case 'complex_query':
        reason = 'Complex query detected, escalating to deliberate analysis';
        break;
      case 'explicit_request':
        reason = 'Explicit request for deeper analysis';
        break;
      case 'escalation':
        reason = 'Model escalation triggered mode switch';
        break;
      default:
        reason = 'Mode escalated to deeper reasoning';
    }

    alertManager.alertModeSwitch(
      transition.from,
      transition.to,
      transition.trigger,
      reason,
      transition.confidence
    );
  }
});
