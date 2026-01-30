"use client";

import { useEffect, useState } from "react";
import { useTheme } from "./ThemeProvider";

interface FitScoreGaugeProps {
  score: number;
  tier: "strong" | "moderate" | "weak" | "poor";
  animated?: boolean;
}

const tierConfig = {
  strong: {
    label: "Strong Fit",
    color: "#22c55e",
    bgColor: "bg-green-500/10",
    textColor: "text-green-500",
    borderColor: "border-green-500",
  },
  moderate: {
    label: "Moderate Fit",
    color: "#eab308",
    bgColor: "bg-yellow-500/10",
    textColor: "text-yellow-500",
    borderColor: "border-yellow-500",
  },
  weak: {
    label: "Weak Fit",
    color: "#f97316",
    bgColor: "bg-orange-500/10",
    textColor: "text-orange-500",
    borderColor: "border-orange-500",
  },
  poor: {
    label: "Poor Fit",
    color: "#ef4444",
    bgColor: "bg-red-500/10",
    textColor: "text-red-500",
    borderColor: "border-red-500",
  },
};

export default function FitScoreGauge({
  score,
  tier,
  animated = true,
}: FitScoreGaugeProps) {
  const [displayScore, setDisplayScore] = useState(animated ? 0 : score);
  const { theme } = useTheme();
  const config = tierConfig[tier];

  useEffect(() => {
    if (!animated) {
      setDisplayScore(score);
      return;
    }

    const duration = 1500;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (ease-out-cubic)
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayScore(Math.round(eased * score));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [score, animated]);

  // SVG circle calculations
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (displayScore / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Circular gauge */}
      <div className="relative">
        <svg width="180" height="180" className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="90"
            cy="90"
            r={radius}
            fill="none"
            stroke={theme === "light" ? "#e5e7eb" : "#374151"}
            strokeWidth="12"
          />
          {/* Progress circle */}
          <circle
            cx="90"
            cy="90"
            r={radius}
            fill="none"
            stroke={config.color}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-300"
          />
        </svg>

        {/* Score display in center */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="text-4xl font-bold"
            style={{ color: config.color }}
          >
            {displayScore}
          </span>
          <span className={`text-sm ${theme === "light" ? "text-gray-500" : "text-gray-400"}`}>
            out of 100
          </span>
        </div>
      </div>

      {/* Tier badge */}
      <div
        className={`
          px-4 py-2 rounded-full font-semibold text-sm
          ${config.bgColor} ${config.textColor}
          border ${config.borderColor}
        `}
      >
        {config.label}
      </div>
    </div>
  );
}
