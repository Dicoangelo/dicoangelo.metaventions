/**
 * DQ Score Calculation Module
 *
 * Implements Data Quality scoring with confidence tracking.
 * DQ Score = Validity (40%) + Specificity (30%) + Correctness (30%)
 *
 * Part of Phase 7 - Metacognitive State Vector Integration.
 */

import { calculateConfidence } from './confidence';

/**
 * DQ Score interface with confidence dimension.
 *
 * Note: `overall` and `composite` are aliases for backwards compatibility.
 */
export interface DQScore {
  /** Validity score (0.0 to 1.0) - measures if query/response is well-formed */
  validity: number;
  /** Specificity score (0.0 to 1.0) - measures detail and precision */
  specificity: number;
  /** Correctness score (0.0 to 1.0) - measures factual accuracy signals */
  correctness: number;
  /** Overall DQ score (0.0 to 1.0) - weighted combination */
  overall: number;
  /** Alias for overall - backwards compatibility with types.ts */
  composite: number;
  /** Confidence score (0.0 to 1.0) - derived from response uncertainty signals */
  confidence: number;
}

/**
 * Calculate validity score from query.
 * Measures if the query is well-formed and actionable.
 */
function calculateValidity(query: string): number {
  if (!query || !query.trim()) {
    return 0.0;
  }

  let score = 0.5; // Baseline

  // Check for question structure
  const hasQuestionMark = query.includes('?');
  const startsWithQuestionWord = /^(what|who|where|when|why|how|is|are|can|could|would|should|do|does|did)/i.test(
    query.trim()
  );

  if (hasQuestionMark || startsWithQuestionWord) {
    score += 0.15;
  }

  // Check for command/action verbs
  const hasActionVerb = /^(create|implement|build|fix|update|add|remove|delete|explain|describe|show|list|find|search|help|tell)/i.test(
    query.trim()
  );

  if (hasActionVerb) {
    score += 0.15;
  }

  // Check for reasonable length (too short = vague, too long = potentially rambling)
  const wordCount = query.split(/\s+/).filter(Boolean).length;

  if (wordCount >= 3 && wordCount <= 50) {
    score += 0.1;
  } else if (wordCount > 50 && wordCount <= 100) {
    score += 0.05;
  }

  // Check for specificity indicators
  const hasSpecificContext = /\b(file|function|class|component|api|endpoint|error|bug|issue|feature)\b/i.test(query);

  if (hasSpecificContext) {
    score += 0.1;
  }

  return Math.min(1.0, score);
}

/**
 * Calculate specificity score from response.
 * Measures how detailed and precise the response is.
 */
function calculateSpecificity(response: string): number {
  if (!response || !response.trim()) {
    return 0.0;
  }

  let score = 0.4; // Baseline

  // Check for code blocks (indicates technical detail)
  const hasCodeBlocks = /```[\s\S]*?```|`[^`]+`/.test(response);
  if (hasCodeBlocks) {
    score += 0.15;
  }

  // Check for structured content (lists, numbers)
  const hasLists = /^[\s]*[-*\d.]+\s/m.test(response);
  if (hasLists) {
    score += 0.1;
  }

  // Check for specific technical terms
  const technicalTerms = response.match(
    /\b(function|class|method|api|endpoint|database|query|parameter|variable|constant|module|component|interface|type|object|array|string|number|boolean)\b/gi
  );
  const termCount = technicalTerms ? technicalTerms.length : 0;

  if (termCount > 0) {
    score += Math.min(0.2, termCount * 0.02);
  }

  // Check for file paths or URLs
  const hasPathsOrUrls = /\/[\w.-]+\/|https?:\/\/|\.ts|\.js|\.tsx|\.jsx|\.json/.test(response);
  if (hasPathsOrUrls) {
    score += 0.1;
  }

  // Check response length (reasonable detail)
  const charCount = response.length;
  if (charCount >= 100 && charCount <= 5000) {
    score += 0.05;
  }

  return Math.min(1.0, score);
}

/**
 * Calculate correctness score from response.
 * Measures signals that suggest factual accuracy.
 * Note: This is a heuristic, not true fact-checking.
 */
function calculateCorrectness(response: string): number {
  if (!response || !response.trim()) {
    return 0.0;
  }

  let score = 0.5; // Baseline - assume moderate correctness

  // Check for citation-like patterns
  const hasCitations = /\([\w\s,]+\d{4}\)|according to|\bsource:\b|\bref:\b|\bdocs:\b/i.test(response);
  if (hasCitations) {
    score += 0.15;
  }

  // Check for concrete examples
  const hasExamples = /\bfor example\b|\be\.g\.\b|\bsuch as\b|\blike this\b/i.test(response);
  if (hasExamples) {
    score += 0.1;
  }

  // Check for quantitative data
  const hasNumbers = /\b\d+(\.\d+)?%|\b\d+\s*(ms|seconds?|minutes?|hours?|MB|GB|KB)\b/i.test(response);
  if (hasNumbers) {
    score += 0.1;
  }

  // Check for logical structure (step-by-step, numbered lists)
  const hasLogicalStructure = /\bstep\s*\d+\b|\bfirst\b.*\bthen\b|\b1\.\s|\b2\.\s/i.test(response);
  if (hasLogicalStructure) {
    score += 0.1;
  }

  // Penalize vague statements
  const vaguePatterns = /\bit varies\b|\bit depends\b|\bin general\b|\busually\b/gi;
  const vagueCount = (response.match(vaguePatterns) || []).length;
  score -= vagueCount * 0.03;

  return Math.max(0.0, Math.min(1.0, score));
}

/**
 * Calculate comprehensive DQ score with confidence tracking.
 *
 * DQ Score breakdown:
 * - Validity (40%): Is the query well-formed and actionable?
 * - Specificity (30%): Is the response detailed and precise?
 * - Correctness (30%): Does the response show signals of accuracy?
 *
 * Confidence is calculated separately from the response text,
 * analyzing hedging language and uncertainty signals.
 *
 * @param query - The input query/request
 * @param response - The AI response to evaluate
 * @returns Complete DQ score with all dimensions including confidence
 */
export function calculateDQScore(query: string, response: string): DQScore {
  const validity = calculateValidity(query);
  const specificity = calculateSpecificity(response);
  const correctness = calculateCorrectness(response);
  const confidence = calculateConfidence(response);

  // Calculate weighted overall score
  // DQ = Validity (40%) + Specificity (30%) + Correctness (30%)
  const overall = validity * 0.4 + specificity * 0.3 + correctness * 0.3;

  return {
    validity,
    specificity,
    correctness,
    overall,
    composite: overall, // Alias for backwards compatibility
    confidence,
  };
}

/**
 * Legacy DQ score calculation without confidence (backwards compatible).
 *
 * @param query - The input query/request
 * @param response - The AI response to evaluate
 * @returns DQ score without confidence dimension
 */
export function calculateDQScoreLegacy(
  query: string,
  response: string
): Omit<DQScore, 'confidence'> {
  const { validity, specificity, correctness, overall, composite } = calculateDQScore(query, response);
  return { validity, specificity, correctness, overall, composite };
}

/**
 * Quick DQ score calculation returning just the overall score.
 *
 * @param query - The input query/request
 * @param response - The AI response to evaluate
 * @returns Overall DQ score (0.0 to 1.0)
 */
export function quickDQScore(query: string, response: string): number {
  return calculateDQScore(query, response).overall;
}

/**
 * Get DQ score category label.
 *
 * @param score - The DQ score (0.0 to 1.0)
 * @returns Category label
 */
export function getDQCategory(score: number): 'poor' | 'fair' | 'good' | 'excellent' {
  if (score < 0.4) return 'poor';
  if (score < 0.6) return 'fair';
  if (score < 0.8) return 'good';
  return 'excellent';
}
