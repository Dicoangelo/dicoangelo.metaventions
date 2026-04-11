"use client";

import { useState, useCallback, useEffect } from "react";
import { useReadingDepth } from "./ReadingDepthProvider";

interface DepthSectionProps {
  /** Always-visible header layer (L1). Title, key identifier, primary CTA. */
  title: React.ReactNode;
  /** Mid layer (L2): summary, top metrics, taglines. Visible at standard+ depth. */
  summary?: React.ReactNode;
  /** Deep layer (L3): full evidence — only rendered when expanded or in deep mode. */
  deep?: React.ReactNode;
  /** Optional className for the outer wrapper. */
  className?: string;
  /** Optional id used for analytics/anchoring. */
  id?: string;
  /** When true, the deep layer is mounted lazily (only after expand). Default true. */
  lazyDeep?: boolean;
  /** Optional label for the show-more toggle (e.g., "Show details"). */
  showMoreLabel?: string;
  /** Optional label for the show-less toggle. */
  showLessLabel?: string;
}

/**
 * Progressive disclosure primitive.
 * Renders title (L1) always, summary (L2) at standard/deep, deep (L3) on expand or in deep mode.
 * Per-section override toggle lets power users dive without changing global mode.
 */
export default function DepthSection({
  title,
  summary,
  deep,
  className = "",
  id,
  lazyDeep = true,
  showMoreLabel = "Show details",
  showLessLabel = "Hide details",
}: DepthSectionProps) {
  const { depth, mounted } = useReadingDepth();
  const [overrideExpanded, setOverrideExpanded] = useState(false);

  // Reset per-section override when global depth changes so the user's choice doesn't get stuck.
  useEffect(() => {
    setOverrideExpanded(false);
  }, [depth]);

  const showSummary = depth !== "skim";
  const showDeep = depth === "deep" || overrideExpanded;
  const hasDeepContent = Boolean(deep);
  const hasSummary = Boolean(summary);

  const toggle = useCallback(() => setOverrideExpanded((v) => !v), []);

  // Until mounted, render standard view (no flash) — matches default depth state.
  const effectiveShowSummary = mounted ? showSummary : true;
  const effectiveShowDeep = mounted ? showDeep : false;
  const shouldMountDeep = hasDeepContent && (effectiveShowDeep || !lazyDeep);

  return (
    <div className={className} id={id} data-depth={depth}>
      {title}

      {hasSummary && effectiveShowSummary && (
        <div className="depth-summary">{summary}</div>
      )}

      {shouldMountDeep && (
        <div
          className="depth-deep"
          style={{
            display: effectiveShowDeep ? "block" : "none",
          }}
        >
          {deep}
        </div>
      )}

      {hasDeepContent && depth !== "deep" && (
        <button
          type="button"
          onClick={toggle}
          aria-expanded={effectiveShowDeep}
          className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[#6366f1] hover:text-[#8b5cf6] transition-colors"
        >
          <span>{effectiveShowDeep ? showLessLabel : showMoreLabel}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-3.5 h-3.5"
            style={{
              transform: effectiveShowDeep ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s ease",
            }}
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 111.08 1.04l-4.25 4.39a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
