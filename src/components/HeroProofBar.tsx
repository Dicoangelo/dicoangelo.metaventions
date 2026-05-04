"use client";

import { useTheme } from "@/components/ThemeProvider";
import { useReadingDepth } from "@/components/ReadingDepthProvider";

interface Tile {
  value: string;
  label: string;
  sub: string;
  accent: string;
  glow: string;
}

const tiles: Tile[] = [
  {
    value: "$30M+",
    label: "Cloud Alliance Revenue",
    sub: "AWS + Microsoft, 30 months",
    accent: "#10b981",
    glow: "rgba(16,185,129,0.18)",
  },
  {
    value: "$800M+",
    label: "Partner TCV Processed",
    sub: "3-person team, 97% approval",
    accent: "#6366f1",
    glow: "rgba(99,102,241,0.22)",
  },
  {
    value: "20M+",
    label: "Cognitive Graph Edges",
    sub: "UCW · 8.9K items, 9.4K learnings",
    accent: "#8b5cf6",
    glow: "rgba(139,92,246,0.20)",
  },
  {
    value: "900K+",
    label: "Lines AI-Directed Code",
    sub: "20+ shipped systems · 44 repos",
    accent: "#ec4899",
    glow: "rgba(236,72,153,0.18)",
  },
];

export default function HeroProofBar() {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const { depth } = useReadingDepth();
  const showSub = depth !== "skim";

  return (
    <section aria-label="Key metrics" className="px-6 -mt-4 md:-mt-8 relative z-10">
      <div className="max-w-6xl mx-auto">
        <div
          className={`relative grid grid-cols-2 md:grid-cols-4 rounded-2xl overflow-hidden border backdrop-blur-xl ${
            isLight
              ? "bg-white/70 border-gray-200/80 shadow-[0_24px_60px_-20px_rgba(15,23,42,0.18),0_8px_24px_-8px_rgba(15,23,42,0.08)]"
              : "bg-[#0a0a0a]/70 border-white/[0.07] shadow-[0_24px_60px_-20px_rgba(0,0,0,0.7),0_8px_24px_-8px_rgba(0,0,0,0.4)]"
          }`}
        >
          {tiles.map((t, i) => (
            <div
              key={t.label}
              className={`group relative px-5 py-6 md:px-6 md:py-7 text-center transition-all duration-300 ${
                i > 0
                  ? isLight
                    ? "md:border-l border-gray-200/60"
                    : "md:border-l border-white/[0.05]"
                  : ""
              } ${i === 2 ? (isLight ? "border-t md:border-t-0 border-gray-200/60" : "border-t md:border-t-0 border-white/[0.05]") : ""} ${
                i === 1 ? (isLight ? "border-l border-gray-200/60" : "border-l border-white/[0.05]") : ""
              } ${i === 3 ? (isLight ? "border-l border-t md:border-t-0 border-gray-200/60" : "border-l border-t md:border-t-0 border-white/[0.05]") : ""}`}
              style={
                {
                  "--tile-glow": t.glow,
                } as React.CSSProperties
              }
            >
              {/* Glow on hover */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: `radial-gradient(ellipse 80% 70% at 50% 50%, var(--tile-glow), transparent 70%)` }}
              />

              <div
                className="relative text-3xl md:text-[40px] font-bold tabular-nums leading-none tracking-tight transition-transform duration-300 group-hover:-translate-y-0.5"
                style={{
                  fontFamily: "var(--font-jetbrains-mono, 'JetBrains Mono', ui-monospace, monospace)",
                  background: `linear-gradient(135deg, ${t.accent} 0%, ${isLight ? "#8b5cf6" : "#a855f7"} 100%)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  filter: `drop-shadow(0 2px 14px ${t.glow})`,
                }}
              >
                {t.value}
              </div>
              <p
                className={`relative mt-3 text-[11.5px] md:text-[13px] font-semibold tracking-tight ${
                  isLight ? "text-gray-900" : "text-white"
                }`}
              >
                {t.label}
              </p>
              {showSub && (
                <p
                  className={`relative mt-1 text-[10px] md:text-[11px] leading-snug tracking-[-0.005em] ${
                    isLight ? "text-gray-500" : "text-[#737373]"
                  }`}
                >
                  {t.sub}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
