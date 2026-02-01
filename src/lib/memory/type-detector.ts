/**
 * Memory Type Detection Heuristics
 *
 * Phase 8 - Adaptive Memory Lifecycle
 *
 * Auto-classifies memory content into FACTUAL, EXPERIENTIAL, or WORKING
 * based on linguistic patterns and content analysis.
 */

import { MemoryType, TypeDetectionResult } from './types';

/**
 * Signal patterns for FACTUAL memory detection
 * Facts, definitions, concepts, technical knowledge
 */
const FACTUAL_SIGNALS = {
  // Definitional patterns
  definitions: [
    /\bis\s+a(n)?\s+/i,                    // "is a", "is an"
    /\bare\s+/i,                            // "are"
    /\bmeans?\s+/i,                         // "means", "mean"
    /\brefers?\s+to\s+/i,                   // "refers to"
    /\bdefine[ds]?\s+(as\s+)?/i,           // "defined as", "defines"
    /\bknown\s+as\s+/i,                     // "known as"
  ],
  // Technical indicators
  technical: [
    /\bfunction\s+/,                        // code: function
    /\bclass\s+/,                           // code: class
    /\binterface\s+/,                       // code: interface
    /\btype\s+\w+\s*=/,                     // code: type alias
    /\bconst\s+\w+\s*=/,                    // code: const declaration
    /```\w*/,                               // code blocks
    /\bAPI\b/i,                             // API mentions
    /\bHTTP\b/i,                            // HTTP mentions
    /\bSQL\b/i,                             // SQL mentions
  ],
  // Conceptual language
  conceptual: [
    /\bprinciple\s+/i,                      // "principle"
    /\bconcept\s+/i,                        // "concept"
    /\bpattern\s+/i,                        // "pattern"
    /\balgorithm\s+/i,                      // "algorithm"
    /\btheory\s+/i,                         // "theory"
    /\brule\s+/i,                           // "rule"
  ],
  // Factual assertions
  assertions: [
    /\balways\s+/i,                         // "always"
    /\bnever\s+/i,                          // "never"
    /\brequires?\s+/i,                      // "requires"
    /\bmust\s+/i,                           // "must"
    /\bshould\s+/i,                         // "should"
  ]
};

/**
 * Signal patterns for EXPERIENTIAL memory detection
 * Events, experiences, episodes, interactions
 */
const EXPERIENTIAL_SIGNALS = {
  // Past tense indicators
  pastTense: [
    /\b\w+ed\b/,                            // Past tense verbs (-ed ending)
    /\bwas\s+/i,                            // "was"
    /\bwere\s+/i,                           // "were"
    /\bhad\s+/i,                            // "had"
    /\bdid\s+/i,                            // "did"
    /\bhappened\s+/i,                       // "happened"
    /\boccurred\s+/i,                       // "occurred"
  ],
  // Temporal markers
  temporal: [
    /\byesterday\b/i,                       // "yesterday"
    /\blast\s+(week|month|year|time)/i,    // "last week/month/year"
    /\bon\s+\d{4}-\d{2}-\d{2}/,            // date: "on 2026-01-15"
    /\b\d{1,2}\/\d{1,2}\/\d{2,4}\b/,       // date: "1/15/2026"
    /\b(january|february|march|april|may|june|july|august|september|october|november|december)\s+\d/i,
    /\bago\b/i,                             // "ago"
    /\brecently\b/i,                        // "recently"
  ],
  // Personal experience markers
  personal: [
    /\bI\s+(did|saw|found|encountered|experienced|noticed)/i,
    /\bwe\s+(did|saw|found|encountered|experienced|noticed)/i,
    /\buser\s+(did|reported|encountered|experienced)/i,
    /\bsession\b/i,                         // "session"
    /\bincident\b/i,                        // "incident"
    /\bevent\b/i,                           // "event"
  ],
  // Error/issue patterns (often experiential)
  issues: [
    /\berror\s+/i,                          // "error"
    /\bfailed\s+/i,                         // "failed"
    /\bcrashed\s+/i,                        // "crashed"
    /\bbug\s+/i,                            // "bug"
    /\bissue\s+/i,                          // "issue"
    /\bproblem\s+/i,                        // "problem"
  ]
};

/**
 * Signal patterns for WORKING memory detection
 * Temporary, task-specific, context-bound
 */
const WORKING_SIGNALS = {
  // Task markers
  task: [
    /\btodo\b/i,                            // "todo"
    /\bto-do\b/i,                           // "to-do"
    /\btask\s*:/i,                          // "task:"
    /\bcurrent(ly)?\s+/i,                   // "current", "currently"
    /\bin\s+progress\b/i,                   // "in progress"
    /\bworking\s+on\s+/i,                   // "working on"
  ],
  // Imperative/reminder patterns
  reminders: [
    /\bremember\s+to\s+/i,                  // "remember to"
    /\bdon't\s+forget\s+/i,                 // "don't forget"
    /\bneed\s+to\s+/i,                      // "need to"
    /\bshould\s+check\s+/i,                 // "should check"
    /\bmake\s+sure\s+/i,                    // "make sure"
  ],
  // Temporary/context markers
  temporary: [
    /\bfor\s+now\b/i,                       // "for now"
    /\btemporary\b/i,                       // "temporary"
    /\bplaceholder\b/i,                     // "placeholder"
    /\bwip\b/i,                             // "WIP"
    /\bdraft\b/i,                           // "draft"
    /\bpending\b/i,                         // "pending"
  ],
  // Context-specific references
  contextual: [
    /\bthis\s+(file|function|component|module)/i,
    /\bhere\s+/i,                           // "here"
    /\babove\b/i,                           // "above"
    /\bbelow\b/i,                           // "below"
    /\bthe\s+current\s+/i,                  // "the current"
  ]
};

/**
 * Count how many patterns from a signal group match the content
 */
function countMatches(content: string, patterns: RegExp[]): { count: number; matched: string[] } {
  const matched: string[] = [];
  let count = 0;

  for (const pattern of patterns) {
    const match = content.match(pattern);
    if (match) {
      count++;
      matched.push(pattern.source.substring(0, 20)); // Truncate for readability
    }
  }

  return { count, matched };
}

/**
 * Calculate score for a memory type based on signal matches
 */
function calculateTypeScore(
  content: string,
  signals: Record<string, RegExp[]>
): { score: number; matchedSignals: string[] } {
  let totalScore = 0;
  const allMatched: string[] = [];

  for (const [category, patterns] of Object.entries(signals)) {
    const { count, matched } = countMatches(content, patterns);
    // Weight by category importance (all equal for now)
    totalScore += count;
    allMatched.push(...matched.map(m => `${category}:${m}`));
  }

  return { score: totalScore, matchedSignals: allMatched };
}

/**
 * Detect the memory type from content using heuristics
 *
 * @param content - The memory content to classify
 * @param context - Optional context string for additional signals
 * @returns TypeDetectionResult with type, confidence, and signals
 */
export function detectMemoryType(
  content: string,
  context?: string
): TypeDetectionResult {
  const fullContent = context ? `${content} ${context}` : content;

  // Calculate scores for each type
  const factualResult = calculateTypeScore(fullContent, FACTUAL_SIGNALS);
  const experientialResult = calculateTypeScore(fullContent, EXPERIENTIAL_SIGNALS);
  const workingResult = calculateTypeScore(fullContent, WORKING_SIGNALS);

  // Find the winning type
  const scores = [
    { type: MemoryType.FACTUAL, ...factualResult },
    { type: MemoryType.EXPERIENTIAL, ...experientialResult },
    { type: MemoryType.WORKING, ...workingResult }
  ];

  // Sort by score descending
  scores.sort((a, b) => b.score - a.score);

  const winner = scores[0];
  const totalSignals = scores.reduce((sum, s) => sum + s.score, 0);

  // Calculate confidence based on signal clarity
  // High confidence if winner has significantly more signals than others
  let confidence = 0.5; // Base confidence

  if (totalSignals > 0) {
    // Ratio of winner's signals to total
    const dominance = winner.score / totalSignals;
    confidence = Math.min(1.0, 0.3 + dominance * 0.7);
  }

  // If no signals matched at all, default to WORKING with low confidence
  if (totalSignals === 0) {
    return {
      type: MemoryType.WORKING,
      confidence: 0.3,
      signals: ['no_signals_detected']
    };
  }

  return {
    type: winner.type,
    confidence: Math.round(confidence * 100) / 100, // Round to 2 decimals
    signals: winner.matchedSignals
  };
}

/**
 * Detect memory type with explanation
 * Returns a human-readable explanation of the classification
 */
export function detectMemoryTypeWithExplanation(
  content: string,
  context?: string
): TypeDetectionResult & { explanation: string } {
  const result = detectMemoryType(content, context);

  const typeDescriptions: Record<MemoryType, string> = {
    [MemoryType.FACTUAL]: 'factual knowledge (definitions, concepts, technical information)',
    [MemoryType.EXPERIENTIAL]: 'experiential memory (events, experiences, past occurrences)',
    [MemoryType.WORKING]: 'working memory (temporary, task-specific, context-bound)'
  };

  const explanation = `Classified as ${typeDescriptions[result.type]} ` +
    `with ${Math.round(result.confidence * 100)}% confidence. ` +
    `Signals detected: ${result.signals.length > 0 ? result.signals.join(', ') : 'none'}`;

  return { ...result, explanation };
}

/**
 * Batch detect types for multiple memory contents
 */
export function detectMemoryTypes(
  items: Array<{ content: string; context?: string }>
): TypeDetectionResult[] {
  return items.map(item => detectMemoryType(item.content, item.context));
}

/**
 * Check if content strongly matches a specific type
 * Useful for validation or override decisions
 */
export function isStrongMatch(
  content: string,
  targetType: MemoryType,
  confidenceThreshold: number = 0.7
): boolean {
  const result = detectMemoryType(content);
  return result.type === targetType && result.confidence >= confidenceThreshold;
}
