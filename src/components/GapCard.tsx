"use client";

import { useTheme } from "./ThemeProvider";

interface GapCardProps {
  requirement: string;
  reality: string;
  severity: "high" | "medium" | "low";
}

const severityConfig = {
  high: {
    label: "Critical Gap",
    icon: "!",
    bgColor: "bg-red-500/10",
    textColor: "text-red-500",
    borderColor: "border-red-500/30",
    iconBg: "bg-red-500",
  },
  medium: {
    label: "Notable Gap",
    icon: "~",
    bgColor: "bg-orange-500/10",
    textColor: "text-orange-500",
    borderColor: "border-orange-500/30",
    iconBg: "bg-orange-500",
  },
  low: {
    label: "Minor Gap",
    icon: "-",
    bgColor: "bg-yellow-500/10",
    textColor: "text-yellow-500",
    borderColor: "border-yellow-500/30",
    iconBg: "bg-yellow-500",
  },
};

export default function GapCard({
  requirement,
  reality,
  severity,
}: GapCardProps) {
  const { theme } = useTheme();
  const config = severityConfig[severity];

  return (
    <div
      className={`
        p-4 rounded-xl border
        ${theme === "light"
          ? `bg-white ${config.borderColor} hover:border-opacity-50`
          : `bg-[#141414] ${config.borderColor} hover:border-opacity-50`
        }
        transition-all duration-200
      `}
    >
      <div className="flex items-start gap-3">
        <div
          className={`
            w-6 h-6 rounded-full flex items-center justify-center
            text-white text-xs font-bold flex-shrink-0 mt-0.5
            ${config.iconBg}
          `}
        >
          {config.icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between gap-2 mb-2">
            <h4 className={`font-semibold ${theme === "light" ? "text-gray-900" : "text-white"}`}>
              {requirement}
            </h4>
            <span
              className={`
                px-2 py-0.5 rounded text-xs font-medium
                ${config.bgColor} ${config.textColor}
              `}
            >
              {config.label}
            </span>
          </div>
          <p className={`text-sm leading-relaxed ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>
            {reality}
          </p>
        </div>
      </div>
    </div>
  );
}
