/**
 * Metacognitive State Type Definitions
 *
 * Types for tracking AI reasoning modes based on dual-process theory:
 * - System 1: Fast, intuitive, automatic (Haiku-level)
 * - System 2: Slow, deliberate, analytical (Opus-level)
 */

// Confidence levels with semantic meaning
export type ConfidenceLevel = 'high' | 'medium' | 'low' | 'very_low';

// Thresholds: high >= 0.8, medium >= 0.6, low >= 0.4, very_low < 0.4
export const CONFIDENCE_THRESHOLDS = {
  high: 0.8,
  medium: 0.6,
  low: 0.4,
  very_low: 0
} as const;

/**
 * System 1: Fast, intuitive, automatic (Haiku-level)
 * System 2: Slow, deliberate, analytical (Opus-level)
 */
export enum ReasoningMode {
  SYSTEM_1 = 'S1',  // Fast thinking
  SYSTEM_2 = 'S2'   // Slow thinking
}

// Alias enums for clarity
export const System1Mode = ReasoningMode.SYSTEM_1;
export const System2Mode = ReasoningMode.SYSTEM_2;

// What triggered a mode switch
export type ModeTrigger =
  | 'low_confidence'
  | 'complex_query'
  | 'explicit_request'
  | 'escalation'
  | 'initial';

/**
 * Full metacognitive state tracking
 */
export interface MetacognitiveState {
  confidence: number;           // 0.0-1.0
  confidenceLevel: ConfidenceLevel;
  mode: ReasoningMode;
  previousMode: ReasoningMode | null;
  trigger: ModeTrigger;
  timestamp: number;            // Unix timestamp
  model: string;                // Current model (haiku, sonnet, opus)
  queryContext?: string;        // Optional query that triggered state
}

/**
 * DQ Score with confidence
 * DQ = Validity (40%) + Specificity (30%) + Correctness (30%)
 */
export interface DQScore {
  validity: number;      // 0-1
  specificity: number;   // 0-1
  correctness: number;   // 0-1
  composite: number;     // Weighted average
  confidence: number;    // 0-1
}

/**
 * Escalation event when model switches due to confidence
 */
export interface EscalationEvent {
  fromModel: string;
  toModel: string;
  reason: string;
  confidence: number;
  timestamp: number;
}

// Model hierarchy for escalation decisions
const MODEL_HIERARCHY = ['haiku', 'sonnet', 'opus'] as const;
export type ModelName = typeof MODEL_HIERARCHY[number];

/**
 * Convert numeric confidence to semantic level
 */
export function getConfidenceLevel(confidence: number): ConfidenceLevel {
  if (confidence >= CONFIDENCE_THRESHOLDS.high) return 'high';
  if (confidence >= CONFIDENCE_THRESHOLDS.medium) return 'medium';
  if (confidence >= CONFIDENCE_THRESHOLDS.low) return 'low';
  return 'very_low';
}

/**
 * Determine if current model should escalate to a more capable one
 *
 * Escalation rules:
 * - haiku escalates at confidence < 0.6 (medium threshold)
 * - sonnet escalates at confidence < 0.4 (low threshold)
 * - opus never escalates (top of hierarchy)
 */
export function shouldEscalate(confidence: number, currentModel: string): boolean {
  const normalizedModel = currentModel.toLowerCase();

  switch (normalizedModel) {
    case 'haiku':
      // Haiku escalates if confidence drops below medium
      return confidence < CONFIDENCE_THRESHOLDS.medium;
    case 'sonnet':
      // Sonnet escalates if confidence drops below low
      return confidence < CONFIDENCE_THRESHOLDS.low;
    case 'opus':
      // Opus is top-tier, never escalates
      return false;
    default:
      // Unknown model, be conservative
      return confidence < CONFIDENCE_THRESHOLDS.medium;
  }
}

/**
 * Get the next model in the escalation hierarchy
 */
export function getEscalationTarget(currentModel: string): ModelName | null {
  const normalizedModel = currentModel.toLowerCase() as ModelName;
  const currentIndex = MODEL_HIERARCHY.indexOf(normalizedModel);

  if (currentIndex === -1 || currentIndex === MODEL_HIERARCHY.length - 1) {
    return null;
  }

  return MODEL_HIERARCHY[currentIndex + 1];
}

/**
 * Calculate DQ composite score
 * Weights: Validity (40%) + Specificity (30%) + Correctness (30%)
 */
export function calculateDQComposite(
  validity: number,
  specificity: number,
  correctness: number
): number {
  return validity * 0.4 + specificity * 0.3 + correctness * 0.3;
}

/**
 * Create initial metacognitive state
 */
export function createInitialState(model: string): MetacognitiveState {
  return {
    confidence: 1.0,
    confidenceLevel: 'high',
    mode: ReasoningMode.SYSTEM_1,
    previousMode: null,
    trigger: 'initial',
    timestamp: Date.now(),
    model
  };
}
