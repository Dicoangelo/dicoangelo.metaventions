"use client";

import { useRef, useEffect, useState } from "react";
import { useTheme } from "./ThemeProvider";
import { useScrollReveal } from "@/hooks/useScrollReveal";

interface Logo {
  name: string;
  description: string;
  svg: React.ReactNode;
  color: string;
}

interface LogoWallProps {
  className?: string;
  animated?: boolean;
}

// SVG logos for companies/technologies worked with
const logos: Logo[] = [
  {
    name: "AWS",
    description: "AWS Partner Network",
    color: "#FF9900",
    svg: (
      <svg viewBox="0 0 64 64" className="w-full h-full">
        <path
          fill="currentColor"
          d="M18.6 35.3c0 .9.1 1.6.3 2.2.2.5.5 1.1.9 1.7.1.2.2.4.2.5 0 .2-.1.4-.4.6l-1.2.8c-.2.1-.4.2-.5.2-.2 0-.4-.1-.6-.3-.3-.3-.5-.7-.7-1-.2-.4-.4-.8-.6-1.3-1.5 1.8-3.4 2.6-5.7 2.6-1.6 0-2.9-.5-3.9-1.4-.9-.9-1.4-2.2-1.4-3.7 0-1.6.6-3 1.8-3.9 1.2-1 2.7-1.5 4.7-1.5.6 0 1.3 0 2 .1.7.1 1.4.2 2.2.4v-1.4c0-1.5-.3-2.5-.9-3.1-.6-.6-1.7-.9-3.2-.9-.7 0-1.4.1-2.1.3-.7.2-1.5.4-2.1.8-.3.2-.5.3-.7.3-.2 0-.3-.1-.3-.4v-.9c0-.3 0-.5.1-.6.1-.1.2-.2.5-.4.7-.4 1.5-.7 2.5-.9 1-.3 2-.4 3.1-.4 2.4 0 4.1.5 5.2 1.6 1.1 1.1 1.6 2.7 1.6 4.9v6.4l.2.1zm-7.8 2.9c.6 0 1.2-.1 1.9-.3.7-.2 1.3-.6 1.8-1.1.3-.3.5-.7.7-1.1.1-.4.2-1 .2-1.7v-.8c-.6-.1-1.2-.2-1.8-.3-.6-.1-1.2-.1-1.8-.1-1.3 0-2.2.2-2.8.7-.6.5-1 1.2-1 2.1 0 .9.2 1.5.7 2 .5.4 1.2.6 2.1.6zm15.4 2c-.3 0-.5 0-.6-.1-.2-.1-.3-.3-.4-.6l-4.4-14.5c-.1-.3-.2-.5-.2-.7 0-.3.1-.4.4-.4h1.8c.3 0 .5 0 .7.1.2.1.3.3.4.6l3.1 12.3 2.9-12.3c.1-.3.2-.5.3-.6.2-.1.4-.1.7-.1h1.5c.3 0 .5 0 .7.1.2.1.3.3.3.6l3 12.5 3.2-12.5c.1-.3.2-.5.4-.6.2-.1.4-.1.6-.1h1.7c.3 0 .5.2.5.4 0 .1 0 .2-.1.3 0 .1-.1.3-.2.5l-4.5 14.5c-.1.3-.2.5-.4.6-.2.1-.4.1-.6.1h-1.6c-.3 0-.5 0-.7-.1-.2-.1-.3-.3-.3-.7l-2.9-12-2.9 12c-.1.3-.2.5-.3.7-.2.1-.4.1-.7.1h-1.6l.1-.1zm24.7.5c-1 0-2-.1-2.9-.4-.9-.2-1.6-.5-2.1-.8-.3-.2-.5-.4-.5-.5-.1-.2-.1-.3-.1-.5v-.9c0-.3.1-.5.4-.5.1 0 .2 0 .3.1.1 0 .2.1.4.2.6.3 1.2.5 1.9.7.7.2 1.4.2 2 .2 1.1 0 1.9-.2 2.5-.6.6-.4.9-.9.9-1.6 0-.5-.2-.9-.5-1.2-.3-.3-1-.6-1.9-.9l-2.8-.9c-1.4-.4-2.4-1.1-3-1.9-.6-.8-.9-1.7-.9-2.6 0-.8.2-1.4.5-2 .3-.6.8-1.1 1.3-1.5.6-.4 1.2-.7 2-1 .7-.2 1.5-.3 2.4-.3.4 0 .9 0 1.3.1.5.1.9.2 1.3.3.4.1.8.3 1.2.4.4.2.7.3.9.5.2.1.4.3.5.5.1.2.1.4.1.7v.9c0 .3-.1.5-.4.5-.1 0-.3-.1-.6-.2-.9-.4-1.9-.6-3-.6-1 0-1.8.2-2.3.5-.5.3-.8.8-.8 1.5 0 .5.2.9.5 1.2.4.3 1 .6 2 1l2.7.9c1.4.4 2.3 1.1 2.9 1.8.6.7.8 1.6.8 2.5 0 .8-.2 1.5-.5 2.1-.3.6-.8 1.2-1.4 1.6-.6.5-1.3.8-2.1 1-.8.3-1.7.4-2.6.4h.1z"
        />
      </svg>
    ),
  },
  {
    name: "Microsoft Azure",
    description: "Azure Cloud Partner",
    color: "#0078D4",
    svg: (
      <svg viewBox="0 0 64 64" className="w-full h-full">
        <path
          fill="currentColor"
          d="M20.5 44.1l12.9-22.6h-9.6L32 6.5l-19.2 34h7.7l.1 3.6zm23-5.5l-11.3-6.7V17l11.3 21.6zm-9.3 9.9l17.3-30.4-8-4.6-9.3 16.3v18.7z"
        />
      </svg>
    ),
  },
  {
    name: "Google Cloud",
    description: "GCP Marketplace",
    color: "#4285F4",
    svg: (
      <svg viewBox="0 0 64 64" className="w-full h-full">
        <path
          fill="currentColor"
          d="M40.5 22.6l5.2-5.2 .3-2.2c-7.8-7.1-19.8-7.1-27.3.6-1.8 1.9-3.2 4.1-4.2 6.5l1.9-.3 10.4-1.7.8-.8c4-3.8 10.3-3.6 14 .4l-.1-.3zm7.7 8.9c-.8-3-2.4-5.7-4.6-7.9l-5.3 5.3c1.9 1.7 3 4.2 3 6.9v.9c2.5 0 4.6 2.1 4.6 4.6s-2.1 4.6-4.6 4.6H27.7l-.9.9v5.5l.9.9h13.6c5.6.1 10.3-4.3 10.5-9.9.1-3.6-1.6-6.9-4.6-9l1 2.2zm-22.5 16.8h-5.5c-2.5 0-4.6-2.1-4.6-4.6s2.1-4.6 4.6-4.6h5.5v-4.6h-5.5c-5.1 0-9.2 4.1-9.2 9.2s4.1 9.2 9.2 9.2h5.5l.9-.9v-5.5l-.9.8zm-4.6-23.2c0-1.3.5-2.5 1.4-3.4l-7.4 7.4c-.5 2.1-.7 4.3-.7 6.5l6.7-6.7v-3.8z"
        />
      </svg>
    ),
  },
  {
    name: "Contentsquare",
    description: "Cloud Alliance Operations",
    color: "#6366f1",
    svg: (
      <svg viewBox="0 0 64 64" className="w-full h-full">
        <rect fill="currentColor" x="12" y="12" width="40" height="40" rx="8" />
        <rect fill="white" x="18" y="18" width="12" height="12" rx="2" />
        <rect fill="white" x="34" y="18" width="12" height="12" rx="2" />
        <rect fill="white" x="18" y="34" width="12" height="12" rx="2" />
        <rect fill="white" x="34" y="34" width="12" height="12" rx="2" />
      </svg>
    ),
  },
  {
    name: "Suger",
    description: "Marketplace Operations Platform",
    color: "#ec4899",
    svg: (
      <svg viewBox="0 0 64 64" className="w-full h-full">
        <circle fill="currentColor" cx="32" cy="32" r="24" />
        <path fill="white" d="M28 20h8v8l8 8v8h-8v-8l-8-8z" />
      </svg>
    ),
  },
  {
    name: "Anthropic",
    description: "Claude AI Integration",
    color: "#D4A574",
    svg: (
      <svg viewBox="0 0 64 64" className="w-full h-full">
        <path
          fill="currentColor"
          d="M32 8L12 56h10l4-10h20l4 10h10L40 8H32zm0 14l6 18H26l6-18z"
        />
      </svg>
    ),
  },
  {
    name: "OpenAI",
    description: "GPT Integration",
    color: "#10a37f",
    svg: (
      <svg viewBox="0 0 64 64" className="w-full h-full">
        <path
          fill="currentColor"
          d="M54.4 28.1c1.3-4 .7-8.4-1.7-12-3.6-5.4-10.1-7.9-16.3-6.2C33.4 5.3 28 3 22.5 3.7 14.7 4.6 8.5 11 8.1 18.9c-4.8 1.5-8.5 5.6-9.2 10.7-.9 6.2 2.3 12.2 7.9 14.8-1.3 4-.7 8.4 1.7 12 3.6 5.4 10.1 7.9 16.3 6.2 3 4.6 8.4 6.9 13.9 6.2 7.8-.9 14-7.3 14.4-15.2 4.8-1.5 8.5-5.6 9.2-10.7.9-6.2-2.3-12.2-7.9-14.8z"
        />
      </svg>
    ),
  },
  {
    name: "Vercel",
    description: "Deployment Platform",
    color: "#000000",
    svg: (
      <svg viewBox="0 0 64 64" className="w-full h-full">
        <path fill="currentColor" d="M32 8L56 56H8L32 8z" />
      </svg>
    ),
  },
];

// Duplicate for infinite scroll effect
const duplicatedLogos = [...logos, ...logos];

export default function LogoWall({ className = "", animated = true }: LogoWallProps) {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const scrollRef = useRef<HTMLDivElement>(null);
  const { ref: sectionRef, isVisible } = useScrollReveal({ threshold: 0.1, once: true });
  const [isPaused, setIsPaused] = useState(false);

  // Pause animation on hover
  useEffect(() => {
    if (!animated || !scrollRef.current) return;

    const scrollEl = scrollRef.current;

    const handleMouseEnter = () => setIsPaused(true);
    const handleMouseLeave = () => setIsPaused(false);

    scrollEl.addEventListener("mouseenter", handleMouseEnter);
    scrollEl.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      scrollEl.removeEventListener("mouseenter", handleMouseEnter);
      scrollEl.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [animated]);

  return (
    <section
      ref={sectionRef}
      className={`py-16 px-6 overflow-hidden ${className}`}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div
          className={`
            text-center mb-10 transition-all duration-700
            ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
          `}
        >
          <h3 className={`text-sm font-semibold uppercase tracking-wider mb-2 ${
            isLight ? "text-gray-500" : "text-gray-400"
          }`}>
            Trusted By & Built With
          </h3>
          <p className={`text-lg ${isLight ? "text-gray-600" : "text-gray-400"}`}>
            Enterprise partnerships and cutting-edge technology stack
          </p>
        </div>

        {/* Scrolling Logo Container */}
        <div
          ref={scrollRef}
          className="relative"
          style={{
            maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
            WebkitMaskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
          }}
        >
          <div
            className={`
              flex gap-8 md:gap-12
              ${animated && !isPaused ? "animate-scroll" : ""}
            `}
            style={{
              width: animated ? "max-content" : "auto",
              animationPlayState: isPaused ? "paused" : "running",
            }}
          >
            {(animated ? duplicatedLogos : logos).map((logo, index) => (
              <div
                key={`${logo.name}-${index}`}
                className="group relative flex-shrink-0"
              >
                {/* Logo Card */}
                <div
                  className={`
                    w-24 h-24 md:w-28 md:h-28 p-4 rounded-2xl border
                    flex items-center justify-center
                    transition-all duration-300 cursor-pointer
                    ${isLight
                      ? "bg-white border-gray-200 hover:border-gray-300 hover:shadow-lg"
                      : "bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10"
                    }
                  `}
                >
                  {/* Logo SVG - grayscale by default, color on hover */}
                  <div
                    className={`
                      w-12 h-12 md:w-14 md:h-14 transition-all duration-300
                      ${isLight ? "text-gray-400" : "text-gray-500"}
                      group-hover:scale-110
                    `}
                    style={{
                      color: undefined,
                      filter: "grayscale(100%)",
                      transition: "filter 0.3s, color 0.3s, transform 0.3s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.filter = "grayscale(0%)";
                      e.currentTarget.style.color = logo.color;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.filter = "grayscale(100%)";
                      e.currentTarget.style.color = "";
                    }}
                  >
                    {logo.svg}
                  </div>
                </div>

                {/* Tooltip */}
                <div
                  className={`
                    absolute left-1/2 -translate-x-1/2 -bottom-2 translate-y-full
                    px-3 py-2 rounded-lg text-center whitespace-nowrap
                    opacity-0 group-hover:opacity-100
                    pointer-events-none transition-all duration-200
                    group-hover:-translate-y-0 z-10
                    ${isLight
                      ? "bg-gray-900 text-white"
                      : "bg-white text-gray-900"
                    }
                  `}
                >
                  <p className="font-semibold text-sm">{logo.name}</p>
                  <p className="text-xs opacity-80">{logo.description}</p>
                  {/* Arrow */}
                  <div
                    className={`
                      absolute left-1/2 -translate-x-1/2 -top-1.5
                      w-3 h-3 rotate-45
                      ${isLight ? "bg-gray-900" : "bg-white"}
                    `}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CSS for infinite scroll animation */}
      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
      `}</style>
    </section>
  );
}
