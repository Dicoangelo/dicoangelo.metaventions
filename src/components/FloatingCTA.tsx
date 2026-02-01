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
          role="menu"
          aria-label="Quick actions menu"
        >
          <button
            onClick={scrollToResume}
            className={`btn-ghost shadow-lg text-sm ${isLight
                ? "bg-white border border-gray-200 hover:border-blue-300"
                : "bg-[#1f1f1f] border border-[#262626] hover:border-[#6366f1]"
              }`}
            style={{ animationDelay: '0ms' }}
            role="menuitem"
            aria-label="Download resume - Opens resume section"
          >
            📄 Download Resume
          </button>
          <button
            onClick={scrollToContact}
            className={`btn-ghost shadow-lg text-sm ${isLight
                ? "bg-white border border-gray-200 hover:border-blue-300"
                : "bg-[#1f1f1f] border border-[#262626] hover:border-[#6366f1]"
              }`}
            style={{ animationDelay: '50ms' }}
            role="menuitem"
            aria-label="Schedule interview - Opens contact section"
          >
            📅 Schedule Interview
          </button>
          <a
            href="https://www.linkedin.com/in/dicoangelo"
            target="_blank"
            rel="noopener noreferrer"
            className={`btn-ghost shadow-lg text-sm ${isLight
                ? "bg-white border border-gray-200 hover:border-blue-300"
                : "bg-[#1f1f1f] border border-[#262626] hover:border-[#6366f1]"
              }`}
            style={{ animationDelay: '100ms' }}
            role="menuitem"
            aria-label="Visit LinkedIn profile - Opens in new window"
          >
            💼 LinkedIn
          </a>
        </div>
      )}

      {/* Main button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`btn-icon w-14 h-14 transition-transform duration-300 ${isExpanded ? "rotate-45" : ""}`}
        aria-label={isExpanded ? "Close menu" : "Open quick actions"}
        aria-expanded={isExpanded}
      >
        {isExpanded ? (
          // Close icon
          <svg
            aria-hidden="true"
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
            aria-hidden="true"
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
