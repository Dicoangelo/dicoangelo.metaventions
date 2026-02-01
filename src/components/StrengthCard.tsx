"use client";

import { useTheme } from "./ThemeProvider";

interface StrengthCardProps {
  skill: string;
  evidence: string;
  matchScore: number;
}

export default function StrengthCard({
  skill,
  evidence,
  matchScore,
}: StrengthCardProps) {
  const { theme } = useTheme();

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-500";
    if (score >= 75) return "text-green-400";
    if (score >= 60) return "text-yellow-500";
    return "text-orange-500";
  };

  const getScoreBg = (score: number) => {
    if (score >= 90) return "bg-green-500/10";
    if (score >= 75) return "bg-green-400/10";
    if (score >= 60) return "bg-yellow-500/10";
    return "bg-orange-500/10";
  };

  return (
    <div
      className={`
        p-4 rounded-xl border
        ${theme === "light"
          ? "bg-white border-gray-200 hover:border-green-300"
          : "bg-[#141414] border-[#262626] hover:border-green-500/30"
        }
        transition-all duration-200
      `}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <svg
              aria-hidden="true"
              className="w-5 h-5 text-green-500 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <h4 className={`font-semibold ${theme === "light" ? "text-gray-900" : "text-white"}`}>
              {skill}
            </h4>
          </div>
          <p className={`text-sm leading-relaxed ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>
            {evidence}
          </p>
        </div>
        <div
          className={`
            px-3 py-1 rounded-full text-sm font-semibold flex-shrink-0
            ${getScoreBg(matchScore)} ${getScoreColor(matchScore)}
          `}
        >
          {matchScore}%
        </div>
      </div>
    </div>
  );
}
