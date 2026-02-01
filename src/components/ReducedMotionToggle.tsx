"use client";

import { useReducedMotion } from "@/hooks/useReducedMotion";

interface ReducedMotionToggleProps {
  isLight: boolean;
}

/**
 * Toggle component for enabling/disabling reduced motion mode.
 * Shows current state and respects system preferences.
 */
export default function ReducedMotionToggle({ isLight }: ReducedMotionToggleProps) {
  const { isReduced, preference, setPreference, systemPrefersReduced } = useReducedMotion();

  // Cycle through preferences: system -> on -> off -> system
  const handleToggle = () => {
    if (preference === "system") {
      setPreference(systemPrefersReduced ? "off" : "on");
    } else if (preference === "on") {
      setPreference("off");
    } else {
      setPreference("system");
    }
  };

  // Get display text based on current state
  const getStatusText = () => {
    if (preference === "system") {
      return `System (${systemPrefersReduced ? "reduced" : "normal"})`;
    }
    return isReduced ? "Reduced" : "Normal";
  };

  return (
    <button
      onClick={handleToggle}
      className={`
        inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium
        transition-all duration-200
        ${isLight
          ? "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200"
          : "bg-[#1f1f1f] hover:bg-[#2a2a2a] text-[#a3a3a3] border border-[#262626]"
        }
        hover:scale-105 active:scale-95
        focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6366f1] focus-visible:ring-offset-2
        ${isLight ? "focus-visible:ring-offset-white" : "focus-visible:ring-offset-[#0a0a0a]"}
      `}
      aria-label={`Motion preference: ${getStatusText()}. Click to change.`}
      aria-pressed={isReduced}
      title="Toggle reduced motion for accessibility"
    >
      {/* Motion icon - animated or static based on state */}
      <svg
        className={`w-4 h-4 ${isReduced ? "" : "motion-safe:animate-pulse"}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        {isReduced ? (
          // Pause/stop icon when reduced
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        ) : (
          // Play/motion icon when normal
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
          />
        )}
        {!isReduced && (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        )}
      </svg>

      {/* Status text */}
      <span className="hidden sm:inline">
        Motion: {isReduced ? "Off" : "On"}
      </span>
      <span className="sm:hidden">
        {isReduced ? "Off" : "On"}
      </span>

      {/* Indicator dot showing preference source */}
      {preference === "system" && (
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            isLight ? "bg-blue-500" : "bg-blue-400"
          }`}
          title="Following system preference"
          aria-hidden="true"
        />
      )}
    </button>
  );
}
