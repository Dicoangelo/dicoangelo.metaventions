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

  const barsByDepth: Record<ReadingDepth, number> = {
    skim: 1,
    standard: 2,
    deep: 3,
  };
  const shortLabel: Record<ReadingDepth, string> = {
    skim: "Skim",
    standard: "Std",
    deep: "Deep",
  };
  const activeBars = barsByDepth[depth];

  return (
    <button
      type="button"
      onClick={() => setDepth(next())}
      className="md:hidden inline-flex items-center gap-1.5 h-9 px-2.5 rounded-lg border border-[var(--border)] bg-[var(--card)]/40 text-[10px] font-semibold uppercase tracking-wider text-[var(--foreground)]/80 hover:text-[#6366f1] hover:border-[#6366f1] transition-colors"
      aria-label={`Reading depth: ${depth}. Tap to cycle.`}
      title={`Reading depth: ${depth} — tap to cycle`}
    >
      <span className="flex items-end gap-[2px]" aria-hidden="true">
        <span className={`w-[3px] h-[6px] rounded-sm ${activeBars >= 1 ? "bg-[#6366f1]" : "bg-current opacity-30"}`} />
        <span className={`w-[3px] h-[10px] rounded-sm ${activeBars >= 2 ? "bg-[#6366f1]" : "bg-current opacity-30"}`} />
        <span className={`w-[3px] h-[14px] rounded-sm ${activeBars >= 3 ? "bg-[#6366f1]" : "bg-current opacity-30"}`} />
      </span>
      <span>{shortLabel[depth]}</span>
    </button>
  );
}
