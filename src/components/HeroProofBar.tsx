"use client";

import { useTheme } from "@/components/ThemeProvider";
import { useReadingDepth } from "@/components/ReadingDepthProvider";

interface Tile {
  value: string;
  label: string;
  sub: string;
  accent: string;
}

const tiles: Tile[] = [
  {
    value: "$30M+",
    label: "Cloud Alliance Revenue",
    sub: "AWS + Microsoft, 30 months",
    accent: "#10b981",
  },
  {
    value: "$800M+",
    label: "Partner TCV Processed",
    sub: "3-person alliance team, 97% approval",
    accent: "#6366f1",
  },
  {
    value: "20M+",
    label: "Cognitive Graph Edges",
    sub: "UCW — 8.9K items, 9.4K learnings",
    accent: "#8b5cf6",
  },
  {
    value: "900K+",
    label: "Lines of AI-Directed Code",
    sub: "20+ shipped systems, 44 repos",
    accent: "#ec4899",
  },
];

export default function HeroProofBar() {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const { depth } = useReadingDepth();
  const showSub = depth !== "skim";

  return (
    <section
      aria-label="Key metrics"
      className={`px-6 -mt-4 md:-mt-8 relative z-10 ${
        isLight ? "" : ""
      }`}
    >
      <div className="max-w-6xl mx-auto">
        <div
          className={`grid grid-cols-2 md:grid-cols-4 gap-px rounded-2xl overflow-hidden border ${
            isLight
              ? "bg-gray-200 border-gray-200 shadow-xl"
              : "bg-white/10 border-white/10 shadow-2xl"
          }`}
        >
          {tiles.map((t) => (
            <div
              key={t.label}
              className={`p-5 md:p-6 text-center ${
                isLight ? "bg-white" : "bg-[#0a0a1a]"
              }`}
            >
              <div
                className="text-2xl md:text-4xl font-bold tabular-nums tracking-tight"
                style={{
                  background: `linear-gradient(135deg, ${t.accent} 0%, ${
                    isLight ? "#8b5cf6" : "#a855f7"
                  } 100%)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {t.value}
              </div>
              <p
                className={`mt-2 text-xs md:text-sm font-semibold ${
                  isLight ? "text-gray-900" : "text-white"
                }`}
              >
                {t.label}
              </p>
              {showSub && (
                <p
                  className={`mt-1 text-[10px] md:text-xs ${
                    isLight ? "text-gray-500" : "text-gray-400"
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
