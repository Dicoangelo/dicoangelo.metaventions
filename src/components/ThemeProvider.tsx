"use client";

import { createContext, useContext, useEffect, useState, useRef, useCallback } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: (e?: React.MouseEvent) => void;
  isTransitioning: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionOrigin, setTransitionOrigin] = useState({ x: 0, y: 0 });
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("theme") as Theme | null;
    if (stored) {
      setTheme(stored);
    } else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
      setTheme("light");
    }

    // Check for reduced motion preference
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(motionQuery.matches);
    const handleMotionChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    motionQuery.addEventListener("change", handleMotionChange);
    return () => motionQuery.removeEventListener("change", handleMotionChange);
  }, []);

  useEffect(() => {
    if (mounted) {
      document.documentElement.setAttribute("data-theme", theme);
      localStorage.setItem("theme", theme);
    }
  }, [theme, mounted]);

  const toggleTheme = useCallback((e?: React.MouseEvent) => {
    // Get click origin for radial transition
    if (e) {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      setTransitionOrigin({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      });
    } else {
      // Default to center if no event
      setTransitionOrigin({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
      });
    }

    // Start transition
    if (!prefersReducedMotion) {
      setIsTransitioning(true);
    }

    // Change theme after a short delay for the visual effect
    setTimeout(() => {
      setTheme((prev) => (prev === "dark" ? "light" : "dark"));
    }, prefersReducedMotion ? 0 : 150);

    // End transition
    setTimeout(() => {
      setIsTransitioning(false);
    }, prefersReducedMotion ? 0 : 600);
  }, [prefersReducedMotion]);

  if (!mounted) {
    return <>{children}</>;
  }

  const nextTheme = theme === "dark" ? "light" : "dark";

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isTransitioning }}>
      {children}

      {/* Cinematic Theme Transition Overlay */}
      {isTransitioning && !prefersReducedMotion && (
        <div
          className="fixed inset-0 z-[9999] pointer-events-none"
          style={{
            background: nextTheme === "light" ? "#ffffff" : "#0a0a0a",
            clipPath: `circle(${isTransitioning ? "150%" : "0%"} at ${transitionOrigin.x}px ${transitionOrigin.y}px)`,
            transition: "clip-path 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        />
      )}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    // Return a default during SSR
    return { theme: "dark" as const, toggleTheme: () => {}, isTransitioning: false };
  }
  return context;
}

export function ThemeToggle() {
  const { theme, toggleTheme, isTransitioning } = useTheme();
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    toggleTheme(e);
  };

  return (
    <button
      ref={buttonRef}
      onClick={handleToggle}
      disabled={isTransitioning}
      className="relative p-2.5 rounded-xl hover:bg-[var(--card)] transition-all group overflow-hidden"
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      {/* Background glow on hover */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[var(--accent)]/0 to-[var(--accent)]/0 group-hover:from-[var(--accent)]/10 group-hover:to-[var(--accent)]/5 transition-all duration-300" />

      {/* Rotating ring effect during transition */}
      {isTransitioning && (
        <div className="absolute inset-0 rounded-xl">
          <div
            className="absolute inset-0 rounded-xl border-2 border-[var(--accent)] animate-ping"
            style={{ animationDuration: "0.6s" }}
          />
        </div>
      )}

      {/* Icon container with smooth morph */}
      <div
        className="relative z-10 w-5 h-5"
        style={{
          transform: isTransitioning ? "scale(1.2) rotate(180deg)" : "scale(1) rotate(0deg)",
          transition: "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
      >
        {/* Sun icon (visible in dark mode) */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="absolute inset-0 transition-all duration-300"
          style={{
            opacity: theme === "dark" ? 1 : 0,
            transform: theme === "dark" ? "rotate(0deg) scale(1)" : "rotate(-90deg) scale(0.5)",
          }}
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2" />
          <path d="M12 20v2" />
          <path d="m4.93 4.93 1.41 1.41" />
          <path d="m17.66 17.66 1.41 1.41" />
          <path d="M2 12h2" />
          <path d="M20 12h2" />
          <path d="m6.34 17.66-1.41 1.41" />
          <path d="m19.07 4.93-1.41 1.41" />
        </svg>

        {/* Moon icon (visible in light mode) */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="absolute inset-0 transition-all duration-300"
          style={{
            opacity: theme === "light" ? 1 : 0,
            transform: theme === "light" ? "rotate(0deg) scale(1)" : "rotate(90deg) scale(0.5)",
          }}
        >
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
      </div>

      {/* Ripple effect on click */}
      <span className="absolute inset-0 rounded-xl overflow-hidden">
        <span
          className="absolute inset-0 rounded-xl"
          style={{
            background: `radial-gradient(circle at center, var(--accent) 0%, transparent 70%)`,
            opacity: isTransitioning ? 0.2 : 0,
            transform: isTransitioning ? "scale(2)" : "scale(0)",
            transition: "transform 0.5s ease-out, opacity 0.5s ease-out",
          }}
        />
      </span>
    </button>
  );
}

/**
 * Alternative minimal theme toggle for use in other contexts
 */
export function ThemeToggleMinimal() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={(e) => toggleTheme(e)}
      className="p-1.5 rounded-lg hover:bg-[var(--card)] transition-colors"
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      {theme === "dark" ? "☀️" : "🌙"}
    </button>
  );
}
