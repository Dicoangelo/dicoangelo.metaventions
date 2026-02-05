"use client";

import { useState, useEffect, useCallback } from "react";
import { useTheme } from "./ThemeProvider";

interface Section {
  id: string;
  label: string;
}

const sections: Section[] = [
  { id: "hero", label: "Home" },
  { id: "approach", label: "Approach" },
  { id: "ask", label: "Ask AI" },
  { id: "testimonials", label: "Testimonials" },
  { id: "projects", label: "Projects" },
  { id: "resume", label: "Resume" },
  { id: "timeline", label: "Timeline" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
];

export default function SectionNav() {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const [activeSection, setActiveSection] = useState("hero");
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Track scroll position and active section
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;

      // Calculate overall scroll progress
      const progress = scrollY / (docHeight - windowHeight);
      setScrollProgress(Math.min(progress, 1));

      // Show/hide based on scroll position
      setIsVisible(scrollY > windowHeight * 0.5);

      // Find active section
      let currentSection = "hero";
      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= windowHeight * 0.4) {
            currentSection = section.id;
          }
        }
      }
      setActiveSection(currentSection);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = useCallback((id: string) => {
    if (id === "hero") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  // Don't render on mobile
  const [isMobile, setIsMobile] = useState(true);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (isMobile) return null;

  return (
    <div
      className={`
        fixed right-6 top-1/2 -translate-y-1/2 z-40
        transition-all duration-500
        ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"}
      `}
    >
      {/* Progress line background */}
      <div
        className={`
          absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-0.5 rounded-full
          ${isLight ? "bg-gray-200" : "bg-white/10"}
        `}
      />

      {/* Progress line fill */}
      <div
        className="absolute left-1/2 -translate-x-1/2 top-0 w-0.5 rounded-full bg-gradient-to-b from-indigo-500 to-purple-500 transition-all duration-300"
        style={{ height: `${scrollProgress * 100}%` }}
      />

      {/* Section dots */}
      <div className="relative flex flex-col gap-4">
        {sections.map((section, index) => {
          const isActive = section.id === activeSection;
          const isHovered = section.id === hoveredSection;
          const isPast = sections.findIndex((s) => s.id === activeSection) >= index;

          return (
            <div key={section.id} className="relative group">
              {/* Tooltip */}
              <div
                className={`
                  absolute right-full mr-4 top-1/2 -translate-y-1/2
                  px-3 py-1.5 rounded-lg whitespace-nowrap
                  text-sm font-medium
                  transition-all duration-200
                  pointer-events-none
                  ${isHovered || isActive
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 translate-x-2"
                  }
                  ${isLight
                    ? "bg-gray-900 text-white"
                    : "bg-white text-gray-900"
                  }
                `}
              >
                {section.label}
                {/* Arrow */}
                <div
                  className={`
                    absolute left-full top-1/2 -translate-y-1/2
                    border-4 border-transparent
                    ${isLight
                      ? "border-l-gray-900"
                      : "border-l-white"
                    }
                  `}
                />
              </div>

              {/* Dot button */}
              <button
                onClick={() => scrollToSection(section.id)}
                onMouseEnter={() => setHoveredSection(section.id)}
                onMouseLeave={() => setHoveredSection(null)}
                className={`
                  relative w-3 h-3 rounded-full
                  transition-all duration-300
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2
                  ${isActive
                    ? "bg-indigo-500 scale-125"
                    : isPast
                    ? isLight
                      ? "bg-indigo-300"
                      : "bg-indigo-500/50"
                    : isLight
                    ? "bg-gray-300 hover:bg-gray-400"
                    : "bg-white/20 hover:bg-white/40"
                  }
                `}
                aria-label={`Go to ${section.label}`}
              >
                {/* Active ring */}
                {isActive && (
                  <span
                    className="absolute inset-0 rounded-full bg-indigo-500/30 animate-ping"
                    style={{ animationDuration: "2s" }}
                  />
                )}

                {/* Hover expansion */}
                {isHovered && !isActive && (
                  <span className="absolute inset-[-4px] rounded-full bg-indigo-500/20" />
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Scroll percentage */}
      <div
        className={`
          mt-6 text-center text-xs font-mono tabular-nums
          transition-opacity duration-300
          ${isLight ? "text-gray-400" : "text-gray-500"}
          ${scrollProgress > 0.05 ? "opacity-100" : "opacity-0"}
        `}
      >
        {Math.round(scrollProgress * 100)}%
      </div>
    </div>
  );
}
