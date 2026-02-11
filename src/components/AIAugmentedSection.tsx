"use client";

import { useTheme } from "./ThemeProvider";
import { useScrollReveal } from "@/hooks/useScrollReveal";

interface AIAugmentedSectionProps {
  className?: string;
}

export default function AIAugmentedSection({ className = "" }: AIAugmentedSectionProps) {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const { ref, isVisible } = useScrollReveal({ threshold: 0.15, once: true });

  const capabilities = [
    {
      human: "Strategic Vision",
      ai: "Pattern Recognition",
      outcome: "Systems that anticipate needs",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
    },
    {
      human: "Quality Judgment",
      ai: "Rapid Iteration",
      outcome: "Refined solutions at scale",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      human: "Domain Expertise",
      ai: "Cross-Domain Synthesis",
      outcome: "Novel approaches from diverse fields",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      ),
    },
    {
      human: "Ethical Oversight",
      ai: "Efficiency Optimization",
      outcome: "Responsible automation",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
  ];

  const systems = [
    { name: "9-System AI Architecture", desc: "Self-improving cognitive infrastructure" },
    { name: "Autonomous Research Agents", desc: "Multi-modal knowledge synthesis" },
    { name: "Adaptive Routing Engine", desc: "Intelligent model orchestration" },
    { name: "Cognitive State Management", desc: "Energy-aware task optimization" },
  ];

  return (
    <section
      ref={ref}
      id="approach"
      className={`py-20 px-6 overflow-hidden ${className}`}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header with Badge */}
        <div
          className={`
            text-center mb-16 transition-all duration-700
            ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
          `}
        >
          {/* Premium Badge */}
          <div
            className={`
              inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6
              border backdrop-blur-sm
              ${isLight
                ? "bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200"
                : "bg-gradient-to-r from-indigo-950/50 to-purple-950/50 border-indigo-500/30"
              }
            `}
          >
            <div className="relative">
              <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              <div className="absolute inset-0 w-2 h-2 rounded-full bg-indigo-500 animate-ping opacity-40" />
            </div>
            <span
              className={`
                text-xs font-bold uppercase tracking-widest
                ${isLight ? "text-indigo-700" : "text-indigo-300"}
              `}
            >
              AI-Augmented Operator
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Human Judgment × AI Capability
          </h2>
          <p
            className={`
              max-w-2xl mx-auto text-lg
              ${isLight ? "text-gray-600" : "text-gray-400"}
            `}
          >
            I don&apos;t just use AI tools—I architect systems where human expertise
            and artificial intelligence amplify each other.
          </p>
        </div>

        {/* Main Visual: Human + AI = Outcome */}
        <div
          className={`
            grid md:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-16 transition-all duration-700 delay-200
            ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
          `}
        >
          {/* Human Side */}
          <div
            className={`
              p-6 rounded-2xl border text-center
              ${isLight
                ? "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200"
                : "bg-gradient-to-br from-blue-950/30 to-indigo-950/30 border-blue-500/30"
              }
            `}
          >
            <div
              className={`
                w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center
                ${isLight ? "bg-blue-100" : "bg-blue-500/20"}
              `}
            >
              <svg
                className={`w-8 h-8 ${isLight ? "text-blue-600" : "text-blue-400"}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="font-bold text-lg mb-2">Human</h3>
            <p className={`text-sm ${isLight ? "text-gray-600" : "text-gray-400"}`}>
              Vision, judgment, context, ethics, creativity
            </p>
          </div>

          {/* Multiplication Symbol / Connection */}
          <div className="flex items-center justify-center">
            <div
              className={`
                relative w-20 h-20 rounded-full flex items-center justify-center
                ${isLight
                  ? "bg-gradient-to-br from-indigo-100 to-purple-100"
                  : "bg-gradient-to-br from-indigo-500/20 to-purple-500/20"
                }
              `}
            >
              {/* Rotating ring */}
              <div
                className="absolute inset-0 rounded-full border-2 border-dashed border-indigo-400/50"
                style={{ animation: "spin 20s linear infinite" }}
              />
              <span className="text-3xl font-light text-indigo-500">×</span>
            </div>
          </div>

          {/* AI Side */}
          <div
            className={`
              p-6 rounded-2xl border text-center
              ${isLight
                ? "bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200"
                : "bg-gradient-to-br from-purple-950/30 to-pink-950/30 border-purple-500/30"
              }
            `}
          >
            <div
              className={`
                w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center
                ${isLight ? "bg-purple-100" : "bg-purple-500/20"}
              `}
            >
              <svg
                className={`w-8 h-8 ${isLight ? "text-purple-600" : "text-purple-400"}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="font-bold text-lg mb-2">AI</h3>
            <p className={`text-sm ${isLight ? "text-gray-600" : "text-gray-400"}`}>
              Speed, scale, pattern matching, synthesis
            </p>
          </div>
        </div>

        {/* Capability Matrix */}
        <div
          className={`
            mb-16 transition-all duration-700 delay-300
            ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
          `}
        >
          <h3
            className={`
              text-center text-lg font-semibold mb-8
              ${isLight ? "text-gray-700" : "text-gray-300"}
            `}
          >
            The Augmentation Effect
          </h3>

          <div className="grid md:grid-cols-2 gap-3 md:gap-4">
            {capabilities.map((cap, index) => (
              <div
                key={cap.outcome}
                className={`
                  p-5 rounded-xl border transition-all duration-300
                  hover:scale-[1.02]
                  ${isLight
                    ? "bg-white border-gray-200 hover:border-indigo-300 hover:shadow-lg"
                    : "bg-white/5 border-white/10 hover:border-indigo-500/50"
                  }
                `}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`
                      p-2 rounded-lg flex-shrink-0
                      ${isLight ? "bg-indigo-50 text-indigo-600" : "bg-indigo-500/20 text-indigo-400"}
                    `}
                  >
                    {cap.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 text-sm">
                      <span className={`font-medium ${isLight ? "text-blue-600" : "text-blue-400"}`}>
                        {cap.human}
                      </span>
                      <span className={isLight ? "text-gray-400" : "text-gray-500"}>+</span>
                      <span className={`font-medium ${isLight ? "text-purple-600" : "text-purple-400"}`}>
                        {cap.ai}
                      </span>
                    </div>
                    <p className={`text-sm ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                      → {cap.outcome}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Systems Built */}
        <div
          className={`
            p-8 rounded-2xl border transition-all duration-700 delay-400
            ${isLight
              ? "bg-gradient-to-br from-gray-50 to-indigo-50/50 border-gray-200"
              : "bg-gradient-to-br from-gray-900/50 to-indigo-950/30 border-white/10"
            }
            ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
          `}
        >
          <h3 className="text-center font-bold text-lg mb-6">
            Systems I&apos;ve Orchestrated
          </h3>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {systems.map((system, index) => (
              <div
                key={system.name}
                className={`
                  p-4 rounded-xl text-center transition-all duration-300
                  ${isLight
                    ? "bg-white hover:shadow-md"
                    : "bg-white/5 hover:bg-white/10"
                  }
                `}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <p className="font-semibold text-sm mb-1">{system.name}</p>
                <p className={`text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                  {system.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Philosophy Quote */}
          <div className="mt-8 text-center">
            <blockquote
              className={`
                text-lg italic
                ${isLight ? "text-gray-600" : "text-gray-400"}
              `}
            >
              &ldquo;The future belongs to those who can orchestrate AI systems with
              <span className="text-indigo-500 font-medium"> vision</span>,
              <span className="text-purple-500 font-medium"> judgment</span>, and
              <span className="text-pink-500 font-medium"> integrity</span>.&rdquo;
            </blockquote>
          </div>
        </div>
      </div>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </section>
  );
}
