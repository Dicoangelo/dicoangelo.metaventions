/**
 * Metacognitive Mode API Route
 *
 * Phase 7 - Metacognitive State Vector Integration
 * US-007: System 1/System 2 mode indicator
 *
 * GET /api/metacognitive/mode
 * Returns current reasoning mode state.
 *
 * Response:
 * {
 *   mode: 'S1' | 'S2',
 *   modeLabel: 'System 1' | 'System 2',
 *   confidence: number | null,
 *   timestamp: number,
 *   transitionCount: number,
 *   distribution: { system1Percent: number, system2Percent: number },
 *   recentTransitions: ModeTransition[]
 * }
 */

import { NextResponse } from 'next/server';
import { modeTracker, type ModeTransition } from '@/lib/metacognitive/mode-tracker';
import { ReasoningMode } from '@/lib/metacognitive/types';

/**
 * Response type for the mode API endpoint.
 */
interface ModeApiResponse {
  /** Current mode: 'S1' or 'S2' */
  mode: ReasoningMode;
  /** Human-readable mode label */
  modeLabel: 'System 1' | 'System 2';
  /** Last known confidence value (if available) */
  confidence: number | null;
  /** Current timestamp */
  timestamp: number;
  /** Total number of mode transitions */
  transitionCount: number;
  /** Time distribution between modes */
  distribution: {
    system1Percent: number;
    system2Percent: number;
  };
  /** Last 5 transitions for context */
  recentTransitions: ModeTransition[];
}

/**
 * GET /api/metacognitive/mode
 *
 * Returns the current reasoning mode state.
 */
export async function GET(): Promise<NextResponse<ModeApiResponse>> {
  const state = modeTracker.getState();
  const transitions = modeTracker.getTransitions();

  // Get most recent confidence from last transition (if available)
  const lastTransition = transitions[0];
  const confidence = lastTransition?.confidence ?? null;

  // Get last 5 transitions for context
  const recentTransitions = transitions.slice(0, 5);

  const response: ModeApiResponse = {
    mode: state.mode,
    modeLabel: state.modeLabel as 'System 1' | 'System 2',
    confidence,
    timestamp: state.timestamp,
    transitionCount: state.transitionCount,
    distribution: state.distribution,
    recentTransitions,
  };

  return NextResponse.json(response, {
    headers: {
      'Cache-Control': 'no-store, max-age=0',
    },
  });
}
