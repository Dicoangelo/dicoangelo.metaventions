/**
 * Confidence Tracking Module
 *
 * Analyzes text for uncertainty signals to derive confidence levels.
 * Part of Phase 7 - Metacognitive State Vector Integration.
 */

/**
 * Hedging phrases that indicate uncertainty in responses.
 * Each phrase is weighted by how strongly it suggests uncertainty.
 */
const HEDGING_PHRASES: ReadonlyArray<{ pattern: RegExp; weight: number }> = [
  // Strong uncertainty (weight: 0.15)
  { pattern: /\bi(?:'m| am) not sure\b/gi, weight: 0.15 },
  { pattern: /\bi(?:'m| am) uncertain\b/gi, weight: 0.15 },
  { pattern: /\bi don(?:'t| not) know\b/gi, weight: 0.15 },
  { pattern: /\bno idea\b/gi, weight: 0.15 },

  // Moderate uncertainty (weight: 0.10)
  { pattern: /\bi think\b/gi, weight: 0.10 },
  { pattern: /\bi believe\b/gi, weight: 0.10 },
  { pattern: /\bi guess\b/gi, weight: 0.10 },
  { pattern: /\bi suppose\b/gi, weight: 0.10 },
  { pattern: /\bmaybe\b/gi, weight: 0.10 },
  { pattern: /\bperhaps\b/gi, weight: 0.10 },

  // Light uncertainty (weight: 0.05)
  { pattern: /\bprobably\b/gi, weight: 0.05 },
  { pattern: /\bmight\b/gi, weight: 0.05 },
  { pattern: /\bcould be\b/gi, weight: 0.05 },
  { pattern: /\bmay be\b/gi, weight: 0.05 },
  { pattern: /\bseems like\b/gi, weight: 0.05 },
  { pattern: /\bappears to\b/gi, weight: 0.05 },
];

/**
 * Qualifier phrases that indicate hedged statements.
 * Lower weights as they suggest caution rather than outright uncertainty.
 */
const QUALIFIER_PHRASES: ReadonlyArray<{ pattern: RegExp; weight: number }> = [
  // Moderate qualifiers (weight: 0.08)
  { pattern: /\bpossibly\b/gi, weight: 0.08 },
  { pattern: /\blikely\b/gi, weight: 0.08 },
  { pattern: /\buncertain\b/gi, weight: 0.08 },
  { pattern: /\bit seems\b/gi, weight: 0.08 },

  // Light qualifiers (weight: 0.04)
  { pattern: /\bapproximately\b/gi, weight: 0.04 },
  { pattern: /\broughly\b/gi, weight: 0.04 },
  { pattern: /\babout\b/gi, weight: 0.04 },
  { pattern: /\baround\b/gi, weight: 0.04 },
  { pattern: /\bgenerally\b/gi, weight: 0.04 },
  { pattern: /\btypically\b/gi, weight: 0.04 },
  { pattern: /\busually\b/gi, weight: 0.04 },
  { pattern: /\boften\b/gi, weight: 0.04 },
  { pattern: /\bsometimes\b/gi, weight: 0.04 },
  { pattern: /\bin some cases\b/gi, weight: 0.04 },
  { pattern: /\bit depends\b/gi, weight: 0.04 },
  { pattern: /\bdepending on\b/gi, weight: 0.04 },
];

/**
 * Confidence signals that indicate certainty (positive weight).
 */
const CONFIDENCE_SIGNALS: ReadonlyArray<{ pattern: RegExp; weight: number }> = [
  { pattern: /\bdefinitely\b/gi, weight: 0.10 },
  { pattern: /\bcertainly\b/gi, weight: 0.10 },
  { pattern: /\babsolutely\b/gi, weight: 0.10 },
  { pattern: /\bwithout a doubt\b/gi, weight: 0.15 },
  { pattern: /\bclearly\b/gi, weight: 0.08 },
  { pattern: /\bobviously\b/gi, weight: 0.08 },
  { pattern: /\bundoubtedly\b/gi, weight: 0.12 },
  { pattern: /\bfor sure\b/gi, weight: 0.10 },
  { pattern: /\bI(?:'m| am) confident\b/gi, weight: 0.12 },
  { pattern: /\bI(?:'m| am) certain\b/gi, weight: 0.12 },
];

/**
 * Count all matches of a pattern in text.
 */
function countMatches(text: string, pattern: RegExp): number {
  const matches = text.match(pattern);
  return matches ? matches.length : 0;
}

/**
 * Calculate the total uncertainty score from hedging and qualifier phrases.
 * Returns a value between 0 and 1 where higher means more uncertainty.
 */
function calculateUncertaintyScore(text: string): number {
  let uncertaintyScore = 0;

  // Sum hedging phrase weights
  for (const { pattern, weight } of HEDGING_PHRASES) {
    const count = countMatches(text, pattern);
    uncertaintyScore += count * weight;
  }

  // Sum qualifier phrase weights
  for (const { pattern, weight } of QUALIFIER_PHRASES) {
    const count = countMatches(text, pattern);
    uncertaintyScore += count * weight;
  }

  return uncertaintyScore;
}

/**
 * Calculate the total confidence boost from certainty signals.
 * Returns a value between 0 and 1 where higher means more confidence.
 */
function calculateConfidenceBoost(text: string): number {
  let confidenceBoost = 0;

  for (const { pattern, weight } of CONFIDENCE_SIGNALS) {
    const count = countMatches(text, pattern);
    confidenceBoost += count * weight;
  }

  return confidenceBoost;
}

/**
 * Normalize text length factor.
 * Longer texts naturally have more signal words, so we adjust.
 */
function getTextLengthFactor(text: string): number {
  const wordCount = text.split(/\s+/).filter(Boolean).length;

  // Base factor for texts under 50 words
  if (wordCount < 50) {
    return 1.0;
  }

  // Gradually reduce impact for longer texts
  // Every 100 words, the factor increases (meaning signals have less per-word impact)
  return 1.0 + Math.log10(wordCount / 50) * 0.5;
}

/**
 * Analyzes text for uncertainty signals and calculates a confidence score.
 *
 * The confidence score is derived from:
 * - Hedging phrases (e.g., "I think", "maybe", "probably")
 * - Qualifier phrases (e.g., "possibly", "likely", "it seems")
 * - Confidence signals (e.g., "definitely", "certainly")
 *
 * @param text - The text to analyze for uncertainty signals
 * @returns A confidence score between 0.0 and 1.0, where:
 *   - 1.0 = High confidence (no uncertainty signals, or strong confidence signals)
 *   - 0.5 = Moderate confidence (some uncertainty signals)
 *   - 0.0 = Low confidence (many uncertainty signals)
 */
export function calculateConfidence(text: string): number {
  // Handle empty or whitespace-only text
  if (!text || !text.trim()) {
    return 0.5; // Neutral confidence for empty text
  }

  const normalizedText = text.toLowerCase();
  const lengthFactor = getTextLengthFactor(text);

  // Calculate raw scores
  const uncertaintyScore = calculateUncertaintyScore(normalizedText);
  const confidenceBoost = calculateConfidenceBoost(normalizedText);

  // Normalize by text length
  const normalizedUncertainty = uncertaintyScore / lengthFactor;
  const normalizedConfidence = confidenceBoost / lengthFactor;

  // Start at baseline confidence of 0.8 (assume responses are reasonably confident)
  // Subtract uncertainty and add confidence boost
  const rawConfidence = 0.8 - normalizedUncertainty + normalizedConfidence * 0.5;

  // Clamp to [0.0, 1.0] range
  return Math.max(0.0, Math.min(1.0, rawConfidence));
}

/**
 * Get a human-readable confidence level label.
 *
 * @param confidence - The confidence score (0.0 to 1.0)
 * @returns A label: "very_low", "low", "moderate", "high", or "very_high"
 */
export function getConfidenceLevel(
  confidence: number
): 'very_low' | 'low' | 'moderate' | 'high' | 'very_high' {
  if (confidence < 0.2) return 'very_low';
  if (confidence < 0.4) return 'low';
  if (confidence < 0.6) return 'moderate';
  if (confidence < 0.8) return 'high';
  return 'very_high';
}

/**
 * Detailed confidence analysis result.
 */
export interface ConfidenceAnalysis {
  /** The overall confidence score (0.0 to 1.0) */
  confidence: number;
  /** Human-readable confidence level */
  level: ReturnType<typeof getConfidenceLevel>;
  /** Number of hedging phrases detected */
  hedgingCount: number;
  /** Number of qualifier phrases detected */
  qualifierCount: number;
  /** Number of confidence signals detected */
  confidenceSignalCount: number;
}

/**
 * Performs detailed confidence analysis on text.
 *
 * @param text - The text to analyze
 * @returns Detailed analysis including counts of different signal types
 */
export function analyzeConfidence(text: string): ConfidenceAnalysis {
  if (!text || !text.trim()) {
    return {
      confidence: 0.5,
      level: 'moderate',
      hedgingCount: 0,
      qualifierCount: 0,
      confidenceSignalCount: 0,
    };
  }

  const normalizedText = text.toLowerCase();

  // Count signals
  let hedgingCount = 0;
  for (const { pattern } of HEDGING_PHRASES) {
    hedgingCount += countMatches(normalizedText, pattern);
  }

  let qualifierCount = 0;
  for (const { pattern } of QUALIFIER_PHRASES) {
    qualifierCount += countMatches(normalizedText, pattern);
  }

  let confidenceSignalCount = 0;
  for (const { pattern } of CONFIDENCE_SIGNALS) {
    confidenceSignalCount += countMatches(normalizedText, pattern);
  }

  const confidence = calculateConfidence(text);

  return {
    confidence,
    level: getConfidenceLevel(confidence),
    hedgingCount,
    qualifierCount,
    confidenceSignalCount,
  };
}
