/**
 * Runtime control for Cohere rerank.
 *
 * Three modes via env CHAT_RERANK_MODE:
 *   - "off"   (default) — never rerank. Saves money. Use this when the
 *               Cohere bill is a concern; embedding similarity alone is
 *               good enough for chat at our current scale.
 *   - "on"    — always rerank. Use when budget allows and we want best
 *               possible recall on every query.
 *   - "ab"    — split traffic 50/50 by hashed client identifier and log
 *               the variant to chat_logs.metadata so we can compare
 *               quality signals (regenerate-rate, response length, etc.)
 *               between rerank ON and OFF.
 *
 * The rerank code path itself lives in ./reranker.ts and is preserved
 * intact — we want it ready to switch on the moment budget opens up
 * or an A/B run shows it's worth the spend.
 */

export type RerankMode = "off" | "on" | "ab";
export type RerankVariant = "on" | "off";

export function getRerankMode(): RerankMode {
  const raw = (process.env.CHAT_RERANK_MODE || "off").toLowerCase().trim();
  if (raw === "on" || raw === "ab" || raw === "off") return raw;
  return "off";
}

/**
 * Stable, deterministic 50/50 split based on client identifier hash so a
 * given visitor always sees the same variant within an A/B run.
 * Returns "on" for half the hashes, "off" for the other half.
 */
export function variantForClient(identifier: string): RerankVariant {
  let hash = 0;
  for (let i = 0; i < identifier.length; i++) {
    hash = (hash * 31 + identifier.charCodeAt(i)) | 0;
  }
  return (hash & 1) === 0 ? "on" : "off";
}

/**
 * Returns whether rerank should fire for the current request, plus the
 * variant label to log. The "expected" variant lets the caller record
 * the assignment even when rerank itself is skipped (e.g. mode=off).
 */
export function resolveRerank(identifier: string): {
  shouldRerank: boolean;
  variant: RerankVariant;
  mode: RerankMode;
} {
  const mode = getRerankMode();
  if (mode === "on") return { shouldRerank: true, variant: "on", mode };
  if (mode === "off") return { shouldRerank: false, variant: "off", mode };
  // mode === "ab"
  const variant = variantForClient(identifier);
  return { shouldRerank: variant === "on", variant, mode };
}
