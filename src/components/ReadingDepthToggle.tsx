"use client";

import { useReadingDepth, type ReadingDepth } from "./ReadingDepthProvider";

const options: { value: ReadingDepth; label: string; title: string }[] = [
  { value: "skim", label: "Skim", title: "Titles only — fastest scan" },
  { value: "standard", label: "Standard", title: "Titles + summaries (default)" },
  { value: "deep", label: "Deep", title: "Everything expanded" },
];

export default function ReadingDepthToggle() {
  const { depth, setDepth, mounted } = useReadingDepth();

  if (!mounted) {
    return (
      <div className="hidden md:inline-flex items-center h-9 w-[180px] rounded-lg border border-[var(--border)] bg-[var(--card)]/40" aria-hidden="true" />
    );
  }

  return (
    <div
      role="radiogroup"
      aria-label="Reading depth"
      className="hidden md:inline-flex items-center rounded-lg border border-[var(--border)] bg-[var(--card)]/40 p-0.5 text-xs font-semibold"
    >
      {options.map((opt) => {
        const active = depth === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={active}
            title={opt.title}
            onClick={() => setDepth(opt.value)}
            className={`px-2.5 py-1.5 rounded-md transition-all ${
              active
                ? "bg-[#6366f1] text-white shadow-sm"
                : "text-[var(--foreground)]/70 hover:text-[var(--foreground)] hover:bg-[var(--card)]"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

/**
 * Mobile variant — compact cycling button.
 */
export function ReadingDepthToggleMobile() {
  const { depth, setDepth, mounted } = useReadingDepth();

  if (!mounted) return null;

  const next = (): ReadingDepth => {
    if (depth === "skim") return "standard";
    if (depth === "standard") return "deep";
    return "skim";
  };

  const labelByDepth: Record<ReadingDepth, string> = {
    skim: "S",
    standard: "M",
    deep: "L",
  };

  return (
    <button
      type="button"
      onClick={() => setDepth(next())}
      className="md:hidden inline-flex items-center justify-center w-9 h-9 rounded-lg border border-[var(--border)] bg-[var(--card)]/40 text-xs font-bold text-[var(--foreground)]/80 hover:text-[#6366f1] hover:border-[#6366f1] transition-colors"
      aria-label={`Reading depth: ${depth}. Tap to cycle.`}
      title={`Reading depth: ${depth}`}
    >
      {labelByDepth[depth]}
    </button>
  );
}
