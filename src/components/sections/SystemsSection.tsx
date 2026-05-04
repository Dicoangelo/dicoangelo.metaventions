"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { AnimatedSection } from "@/components/AnimatedSection";
import { useReadingDepth } from "@/components/ReadingDepthProvider";

const ThreeSystemsNetwork = dynamic(() => import("../ThreeSystemsNetwork"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] bg-gradient-to-br from-black/20 to-black/5 rounded-2xl animate-pulse flex items-center justify-center">
      <p className="text-gray-500 text-sm">Loading 3D visualization...</p>
    </div>
  ),
});

interface SystemsSectionProps {
  isLight: boolean;
}

export function SystemsSection({ isLight }: SystemsSectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const { depth } = useReadingDepth();
  const showSummary = depth !== "skim";
  const showDeep = depth === "deep";

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Stop observing once visible
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const heroMetrics = [
    { value: "428K+", label: "Autonomous Decisions", note: "Real-time quality scoring" },
    { value: "94%", label: "Error Auto-Resolution", note: "700+ patterns recognized" },
    { value: "24/7", label: "Production Uptime", note: "Since November 2025" },
  ];

  return (
    <div ref={sectionRef}>
      <AnimatedSection id="systems" className="relative py-24 px-6">
        {/* Ambient brand wash */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 h-[60%] blur-3xl opacity-40"
          style={{
            background: isLight
              ? "radial-gradient(ellipse 50% 60% at 50% 50%, rgba(99,102,241,0.10), transparent 70%)"
              : "radial-gradient(ellipse 50% 60% at 50% 50%, rgba(99,102,241,0.16), transparent 70%)",
          }}
        />

        <div className="relative max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-14">
            <span className={`inline-block text-[11px] font-semibold uppercase tracking-[0.2em] mb-4 ${isLight ? "text-[#6366f1]/80" : "text-[#818cf8]"}`}>
              Production AI Infrastructure
            </span>
            <h2 className={`text-4xl md:text-5xl font-bold tracking-tight ${isLight ? "text-gray-900" : "text-white"}`}>
              Self-improving systems.
            </h2>
            {showSummary && (
              <p className={`mt-5 max-w-3xl mx-auto text-[15px] leading-relaxed ${isLight ? "text-gray-700" : "text-[#a3a3a3]"}`}>
                Autonomous engineering infrastructure that learns from every interaction, self-heals errors, and optimizes performance — cutting development cycles in half while holding enterprise-grade reliability.
              </p>
            )}

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 max-w-4xl mx-auto mt-10">
              {heroMetrics.map((m) => (
                <div
                  key={m.label}
                  className={`group p-5 md:p-6 rounded-2xl border backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 ${
                    isLight
                      ? "bg-white/70 border-gray-200/80 hover:border-[#6366f1]/40 hover:shadow-[0_8px_24px_-8px_rgba(99,102,241,0.20)]"
                      : "bg-white/[0.025] border-white/[0.07] hover:border-[#6366f1]/40 hover:bg-white/[0.04]"
                  }`}
                >
                  <div
                    className="text-[28px] md:text-[32px] font-bold leading-none tabular-nums tracking-tight"
                    style={{
                      fontFamily: "var(--font-jetbrains-mono, 'JetBrains Mono', ui-monospace, monospace)",
                      background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      filter: "drop-shadow(0 2px 14px rgba(99,102,241,0.20))",
                    }}
                  >
                    {m.value}
                  </div>
                  <div className={`mt-3 text-[13px] font-semibold tracking-tight ${isLight ? "text-gray-900" : "text-white"}`}>
                    {m.label}
                  </div>
                  <div className={`text-[11.5px] mt-1.5 leading-snug ${isLight ? "text-gray-500" : "text-[#737373]"}`}>
                    {m.note}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3D Network Visualization */}
          <div className="mb-14">
            <p className={`text-center text-[12px] font-semibold uppercase tracking-[0.18em] mb-5 ${isLight ? "text-gray-500" : "text-[#737373]"}`}>
              9 Interconnected AI Systems
            </p>
            <div
              className={`w-full h-[600px] rounded-2xl border backdrop-blur-sm overflow-hidden ${
                isLight ? "bg-white/60 border-gray-200/80" : "bg-white/[0.02] border-white/[0.07]"
              }`}
            >
              {isVisible && <ThreeSystemsNetwork />}
            </div>
            {showSummary && (
              <p className={`text-[12px] text-center mt-4 ${isLight ? "text-gray-500" : "text-[#737373]"}`}>
                Interactive 3D architecture — hover to explore each system
              </p>
            )}
          </div>

          {/* Business Value Section */}
          {showDeep && (
            <div className="grid md:grid-cols-2 gap-4 md:gap-5 mt-12">
              <ValueCard
                isLight={isLight}
                title="Built for scale"
                body="Autonomous systems optimize resource allocation, predict failures before they occur, and continuously improve performance from historical patterns — same playbook that scaled Contentsquare's marketplace operations from days to minutes."
                icon={
                  <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                }
              />
              <ValueCard
                isLight={isLight}
                title="Data-driven innovation"
                body="Every system decision is measured, analyzed, and optimized. Real-time analytics track quality scores, error patterns, and efficiency metrics — surfacing actionable insights that drive continuous improvement."
                icon={
                  <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 3v18h18" />
                    <path d="M7 14l4-4 4 4 6-6" />
                  </svg>
                }
              />
            </div>
          )}

          {/* Why This Matters */}
          {showDeep && (
            <div
              className={`relative overflow-hidden mt-10 p-8 rounded-2xl border backdrop-blur-sm ${
                isLight ? "bg-white/85 border-[#6366f1]/30" : "bg-[#0a0a0a]/85 border-[#6366f1]/35"
              }`}
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-8 -top-px h-px"
                style={{ background: "linear-gradient(90deg, transparent 0%, rgba(99,102,241,0.7) 50%, transparent 100%)" }}
              />
              <div className="max-w-4xl mx-auto text-center">
                <p className={`text-[10.5px] font-semibold uppercase tracking-[0.18em] mb-3 ${isLight ? "text-[#6366f1]/80" : "text-[#818cf8]"}`}>
                  Why this matters
                </p>
                <h3 className={`text-[20px] md:text-[22px] font-bold tracking-tight mb-4 ${isLight ? "text-gray-900" : "text-white"}`}>
                  Systems that compound, not tools that decay.
                </h3>
                <p className={`text-[14px] leading-relaxed ${isLight ? "text-gray-700" : "text-[#a3a3a3]"}`}>
                  These aren&apos;t scripts — they&apos;re a systematic approach to building intelligent, self-optimizing infrastructure. The same principles applied at Contentsquare to transform marketplace operations (enabling 81% ACV growth) are now embedded in autonomous systems that scale engineering productivity while holding enterprise reliability.
                </p>
              </div>
            </div>
          )}
        </div>
      </AnimatedSection>
    </div>
  );
}

interface ValueCardProps {
  isLight: boolean;
  title: string;
  body: string;
  icon: React.ReactNode;
}

function ValueCard({ isLight, title, body, icon }: ValueCardProps) {
  return (
    <div
      className={`group relative p-6 md:p-7 rounded-2xl border backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 ${
        isLight
          ? "bg-white/70 border-gray-200/80 hover:border-[#6366f1]/40 hover:shadow-[0_12px_28px_-12px_rgba(99,102,241,0.20)]"
          : "bg-white/[0.025] border-white/[0.07] hover:border-[#6366f1]/40 hover:bg-white/[0.04]"
      }`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-xl ${
            isLight ? "bg-[#6366f1]/10 text-[#6366f1]" : "bg-[#6366f1]/15 text-[#818cf8]"
          }`}
        >
          {icon}
        </div>
        <div>
          <h4 className={`text-[15px] font-bold tracking-tight mb-2 ${isLight ? "text-gray-900" : "text-white"}`}>
            {title}
          </h4>
          <p className={`text-[13px] leading-relaxed ${isLight ? "text-gray-700" : "text-[#a3a3a3]"}`}>
            {body}
          </p>
        </div>
      </div>
    </div>
  );
}
