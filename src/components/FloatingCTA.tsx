"use client";

import { useState, useEffect } from "react";

interface FloatingCTAProps {
  isLight: boolean;
}

export default function FloatingCTA({ isLight }: FloatingCTAProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show button after scrolling down 300px
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToContact = () => {
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToResume = () => {
    const resumeSection = document.getElementById("resume");
    if (resumeSection) {
      resumeSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
      {/* Expanded menu */}
      {isExpanded && (
        <div
          className={`flex flex-col gap-2 mb-2 animate-in slide-in-from-bottom-2 fade-in duration-200 ${isLight ? "text-gray-700" : "text-white"
            }`}
        >
          <button
            onClick={scrollToResume}
            className={`px-4 py-2 rounded-lg shadow-lg transition-all hover:scale-105 text-sm font-medium ${isLight
                ? "bg-white border border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                : "bg-[#1f1f1f] border border-[#262626] hover:border-[#6366f1] hover:bg-[#2a2a2a]"
              }`}
          >
            📄 Download Resume
          </button>
          <button
            onClick={scrollToContact}
            className={`px-4 py-2 rounded-lg shadow-lg transition-all hover:scale-105 text-sm font-medium ${isLight
                ? "bg-white border border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                : "bg-[#1f1f1f] border border-[#262626] hover:border-[#6366f1] hover:bg-[#2a2a2a]"
              }`}
          >
            📅 Schedule Interview
          </button>
          <a
            href="https://www.linkedin.com/in/dicoangelo"
            target="_blank"
            rel="noopener noreferrer"
            className={`px-4 py-2 rounded-lg shadow-lg transition-all hover:scale-105 text-sm font-medium ${isLight
                ? "bg-white border border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                : "bg-[#1f1f1f] border border-[#262626] hover:border-[#6366f1] hover:bg-[#2a2a2a]"
              }`}
          >
            💼 LinkedIn
          </a>
        </div>
      )}

      {/* Main button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-14 h-14 rounded-full shadow-2xl transition-all duration-300 flex items-center justify-center hover:scale-110 active:scale-95 ${isExpanded ? "rotate-45" : ""
          } ${isLight
            ? "bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] text-white"
            : "bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] text-white"
          }`}
        aria-label={isExpanded ? "Close menu" : "Open quick actions"}
      >
        {isExpanded ? (
          // Close icon
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          // Lightning bolt icon
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        )}
      </button>
    </div>
  );
}
