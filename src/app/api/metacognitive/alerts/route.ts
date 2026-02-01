/**
 * Metacognitive Alerts API Route
 *
 * Phase 7 - Metacognitive State Vector Integration
 * US-008: Metacognitive alerts when mode switches
 *
 * GET /api/metacognitive/alerts
 * Returns alert history and current configuration.
 *
 * POST /api/metacognitive/alerts/acknowledge
 * Acknowledge alert(s) by ID or all.
 *
 * PATCH /api/metacognitive/alerts
 * Update alert configuration (mode, enable/disable alert types).
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  alertManager,
  type ModeAlert,
  type AlertMode,
  type AlertConfig,
} from '@/lib/metacognitive/alerts';

/**
 * Response type for GET /api/metacognitive/alerts
 */
interface AlertsGetResponse {
  /** All alerts in history */
  alerts: ReadonlyArray<ModeAlert>;
  /** Number of unacknowledged alerts */
  unacknowledgedCount: number;
  /** Total alerts in history */
  totalCount: number;
  /** Current alert configuration */
  config: AlertConfig;
  /** Formatted CLI output */
  cliOutput: string;
}

/**
 * Response type for POST /api/metacognitive/alerts (acknowledge)
 */
interface AlertsAcknowledgeResponse {
  /** Whether the operation succeeded */
  success: boolean;
  /** Number of alerts acknowledged */
  acknowledgedCount: number;
  /** Alert IDs that were acknowledged */
  acknowledgedIds: string[];
}

/**
 * Response type for PATCH /api/metacognitive/alerts (config update)
 */
interface AlertsConfigResponse {
  /** Whether the operation succeeded */
  success: boolean;
  /** Updated configuration */
  config: AlertConfig;
}

/**
 * Error response type
 */
interface AlertsErrorResponse {
  error: string;
  message: string;
}

/**
 * GET /api/metacognitive/alerts
 *
 * Returns the current alert history and configuration.
 *
 * Query parameters:
 * - unacknowledged: If 'true', only return unacknowledged alerts
 * - limit: Maximum number of alerts to return (default: 100)
 */
export async function GET(
  request: NextRequest
): Promise<NextResponse<AlertsGetResponse>> {
  const searchParams = request.nextUrl.searchParams;
  const unacknowledgedOnly = searchParams.get('unacknowledged') === 'true';
  const limit = Math.min(
    parseInt(searchParams.get('limit') || '100', 10),
    1000
  );

  let alerts = unacknowledgedOnly
    ? alertManager.getUnacknowledged()
    : [...alertManager.getAlerts()];

  // Apply limit
  alerts = alerts.slice(0, limit);

  const response: AlertsGetResponse = {
    alerts,
    unacknowledgedCount: alertManager.getUnacknowledgedCount(),
    totalCount: alertManager.getAlerts().length,
    config: alertManager.getConfig(),
    cliOutput: alertManager.formatForCLI(),
  };

  return NextResponse.json(response, {
    headers: {
      'Cache-Control': 'no-store, max-age=0',
    },
  });
}

/**
 * POST /api/metacognitive/alerts
 *
 * Acknowledge alert(s).
 *
 * Request body:
 * - alertIds: string[] - Array of alert IDs to acknowledge
 * - all: boolean - If true, acknowledge all alerts (ignores alertIds)
 */
export async function POST(
  request: NextRequest
): Promise<NextResponse<AlertsAcknowledgeResponse | AlertsErrorResponse>> {
  try {
    const body = await request.json();
    const { alertIds, all } = body as {
      alertIds?: string[];
      all?: boolean;
    };

    const acknowledgedIds: string[] = [];
    let acknowledgedCount = 0;

    if (all === true) {
      // Acknowledge all
      acknowledgedCount = alertManager.acknowledgeAll();
      // Get all alert IDs that were acknowledged
      for (const alert of alertManager.getAlerts()) {
        if (alert.acknowledged) {
          acknowledgedIds.push(alert.id);
        }
      }
    } else if (alertIds && Array.isArray(alertIds)) {
      // Acknowledge specific alerts
      for (const id of alertIds) {
        if (typeof id === 'string' && alertManager.acknowledge(id)) {
          acknowledgedIds.push(id);
          acknowledgedCount++;
        }
      }
    } else {
      return NextResponse.json(
        {
          error: 'bad_request',
          message: 'Request must include either "alertIds" array or "all: true"',
        },
        { status: 400 }
      );
    }

    const response: AlertsAcknowledgeResponse = {
      success: true,
      acknowledgedCount,
      acknowledgedIds,
    };

    return NextResponse.json(response);
  } catch {
    return NextResponse.json(
      {
        error: 'invalid_json',
        message: 'Request body must be valid JSON',
      },
      { status: 400 }
    );
  }
}

/**
 * PATCH /api/metacognitive/alerts
 *
 * Update alert configuration.
 *
 * Request body (all fields optional):
 * - mode: 'silent' | 'console' | 'notification'
 * - enableModeSwitch: boolean
 * - enableEscalation: boolean
 * - enableLowConfidence: boolean
 */
export async function PATCH(
  request: NextRequest
): Promise<NextResponse<AlertsConfigResponse | AlertsErrorResponse>> {
  try {
    const body = await request.json();
    const { mode, enableModeSwitch, enableEscalation, enableLowConfidence } =
      body as Partial<AlertConfig>;

    // Validate mode if provided
    if (mode !== undefined) {
      const validModes: AlertMode[] = ['silent', 'console', 'notification'];
      if (!validModes.includes(mode)) {
        return NextResponse.json(
          {
            error: 'invalid_mode',
            message: `Invalid mode "${mode}". Must be one of: ${validModes.join(', ')}`,
          },
          { status: 400 }
        );
      }
    }

    // Build update object with only defined values
    const update: Partial<AlertConfig> = {};
    if (mode !== undefined) update.mode = mode;
    if (enableModeSwitch !== undefined) update.enableModeSwitch = enableModeSwitch;
    if (enableEscalation !== undefined) update.enableEscalation = enableEscalation;
    if (enableLowConfidence !== undefined) update.enableLowConfidence = enableLowConfidence;

    // Apply update
    alertManager.updateConfig(update);

    const response: AlertsConfigResponse = {
      success: true,
      config: alertManager.getConfig(),
    };

    return NextResponse.json(response);
  } catch {
    return NextResponse.json(
      {
        error: 'invalid_json',
        message: 'Request body must be valid JSON',
      },
      { status: 400 }
    );
  }
}

/**
 * DELETE /api/metacognitive/alerts
 *
 * Clear alert history.
 */
export async function DELETE(): Promise<
  NextResponse<{ success: boolean; message: string }>
> {
  alertManager.clearHistory();

  return NextResponse.json({
    success: true,
    message: 'Alert history cleared',
  });
}
