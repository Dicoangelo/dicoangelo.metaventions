"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useReadingDepth } from "@/components/ReadingDepthProvider";

const dimensions = [
  {
    id: "boundary-sensing",
    name: "Boundary Sensing",
    score: 96,
    definition:
      "Assessing which parts of a workflow can benefit from AI, and where business context and human review are needed.",
    evidence: [
      "Compare AI output with the requirements of the specific task",
      "Use ResearchGravity and UCW to organize useful context",
      "Keep required human review explicit in an AI-assisted workflow",
    ],
  },
  {
    id: "seam-design",
    name: "Seam Design",
    score: 98,
    definition:
      "Defining inputs, outputs and responsibilities so work can move clearly between people and AI tools.",
    evidence: [
      "Specify system requirements in plain English and direct AI coding tools",
      "Review, test and deploy the resulting implementation",
      "Explore partner-data workflows through the Partnership Graph concept demo",
    ],
  },
  {
    id: "failure-model",
    name: "Failure Model Maintenance",
    score: 94,
    definition:
      "Checking AI-assisted work for the failure modes that matter to the task, then revising the workflow when problems appear.",
    evidence: [
      "Treat generated output as work to review and test",
      "Apply configuration checks in the independent SBC Inspector project",
      "Tie validation to the intended behavior and operational requirements",
    ],
  },
  {
    id: "capability-forecasting",
    name: "Capability Forecasting",
    score: 89,
    definition:
      "Following changes in AI tools and considering how they may affect existing workflows and future implementation choices.",
    evidence: [
      "Organize research sources and findings through ResearchGravity",
      "Evaluate opportunities for AI integration across the GTM stack",
      "Revisit tool choices as capabilities and team needs change",
    ],
  },
  {
    id: "attention-calibration",
    name: "Attention Calibration",
    score: 92,
    definition:
      "Keeping business judgment, review and adoption central while using automation for repeatable operational work.",
    evidence: [
      "Keep business decisions and required approvals with people",
      "Use automation to support repeatable operational workflows",
      "Support adoption through onboarding, documentation and practical enablement",
    ],
  },
];

function getScoreColor(score: number, isLight: boolean) {
  if (score >= 90) {
    return {
      bar: "bg-emerald-400 text-emerald-400/40",
      text: isLight ? "text-emerald-600" : "text-emerald-400",
      badge: isLight
        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
        : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
      bullet: "bg-emerald-400/70",
    };
  }
  if (score >= 80) {
    return {
      bar: "bg-[#6366f1] text-[#6366f1]/40",
      text: isLight ? "text-[#6366f1]" : "text-[#818cf8]",
      badge: isLight
        ? "bg-indigo-50 text-indigo-700 border-indigo-200"
        : "bg-indigo-500/10 text-indigo-400 border-indigo-500/30",
      bullet: "bg-[#818cf8]/70",
    };
  }
  return {
    bar: "bg-amber-500 text-amber-500/40",
    text: isLight ? "text-amber-600" : "text-amber-400",
    badge: isLight
      ? "bg-amber-50 text-amber-700 border-amber-200"
      : "bg-amber-500/10 text-amber-400 border-amber-500/30",
    bullet: "bg-amber-400/70",
  };
}

interface ProgressBarProps {
  score: number;
  colorClass: string;
  animate: boolean;
}

function ProgressBar({ score, colorClass, animate, isLight }: ProgressBarProps & { isLight: boolean }) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (animate) {
      const timeout = setTimeout(() => setWidth(score), 100);
      return () => clearTimeout(timeout);
    }
  }, [animate, score]);

  return (
    <div aria-hidden="true" className={`relative h-1.5 rounded-full overflow-hidden ${isLight ? "bg-gray-200/60" : "bg-white/[0.06]"}`}>
      <div
        className={`h-full rounded-full ${colorClass} transition-all duration-700 ease-out`}
        style={{ width: `${width}%`, boxShadow: "0 0 12px currentColor" }}
      />
    </div>
  );
}

export function FrontierOpsScore({ isLight }: { isLight: boolean }) {
  const { ref: sectionRef, isVisible } = useScrollReveal({ threshold: 0.1 });

  return (
    <section
      id="frontier-ops"
      ref={sectionRef as React.RefObject<HTMLElement>}
      className="relative py-24 px-6"
    >
      {/* Ambient brand wash */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 h-[60%] blur-3xl opacity-40"
        style={{
          background: isLight
            ? "radial-gradient(ellipse 50% 60% at 50% 50%, rgba(16,185,129,0.08), transparent 70%)"
            : "radial-gradient(ellipse 50% 60% at 50% 50%, rgba(16,185,129,0.12), transparent 70%)",
        }}
      />

      <div className="relative max-w-5xl mx-auto">
        {/* Header */}
        <div
          className={`text-center mb-14 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <span
            className={`inline-block text-[11px] font-semibold uppercase tracking-[0.2em] mb-4 ${
              isLight ? "text-[#6366f1]/80" : "text-[#818cf8]"
            }`}
          >
            Personal practice review
          </span>
          <h2 className={`text-4xl md:text-5xl font-bold tracking-tight ${isLight ? "text-gray-900" : "text-white"}`}>
            Frontier Operations Practice.
          </h2>
          <p className={`mt-5 max-w-2xl mx-auto text-[15px] leading-relaxed ${isLight ? "text-gray-600" : "text-[#a3a3a3]"}`}>
            An informal self-assessment of my AI-assisted working practices. The bars indicate illustrative emphasis; the examples explain the work behind each area.
          </p>

          {/* Overall score chip */}
          <div
            className={`mt-7 inline-flex items-center gap-3 pl-2 pr-5 py-2 rounded-2xl border backdrop-blur-sm ${
              isLight
                ? "border-emerald-200/80 bg-white/70"
                : "border-emerald-500/30 bg-white/[0.025]"
            }`}
          >
            <span
              className="px-3 py-1.5 rounded-xl text-[22px] font-bold leading-none tabular-nums"
              style={{
                fontFamily: "var(--font-jetbrains-mono, 'JetBrains Mono', ui-monospace, monospace)",
                background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                filter: "drop-shadow(0 2px 12px rgba(16,185,129,0.35))",
              }}
            >
              SELF
            </span>
            <span className={`text-[12px] tabular-nums ${isLight ? "text-emerald-700/70" : "text-emerald-400/80"}`}>/ review</span>
            <span className={`text-[13px] font-semibold ${isLight ? "text-emerald-800" : "text-emerald-300"}`}>
              Informal Self-Assessment
            </span>
          </div>
        </div>

        {/* Dimension cards — 2 + 3 layout on desktop */}
        <div className="space-y-6">
          {/* Row 1: 2 cards */}
          <div className="grid md:grid-cols-2 gap-6">
            {dimensions.slice(0, 2).map((dim, i) => {
              const colors = getScoreColor(dim.score, isLight);
              return (
                <DimensionCard
                  key={dim.id}
                  dim={dim}
                  colors={colors}
                  isLight={isLight}
                  animate={isVisible}
                  delay={i * 120}
                />
              );
            })}
          </div>

          {/* Row 2: 3 cards */}
          <div className="grid md:grid-cols-3 gap-6">
            {dimensions.slice(2).map((dim, i) => {
              const colors = getScoreColor(dim.score, isLight);
              return (
                <DimensionCard
                  key={dim.id}
                  dim={dim}
                  colors={colors}
                  isLight={isLight}
                  animate={isVisible}
                  delay={(i + 2) * 120}
                />
              );
            })}
          </div>
        </div>

        {/* Footer note */}
        <div
          className={`mt-12 text-center transition-all duration-700 delay-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <p className={`max-w-3xl mx-auto text-[13.5px] leading-relaxed mb-6 ${isLight ? "text-gray-500" : "text-[#737373]"}`}>
            <span className={`font-semibold ${isLight ? "text-gray-700" : "text-gray-300"}`}>Frontier Operations</span>{" "}
            is how I think about AI-assisted work: understanding capabilities, designing handoffs, checking failures and keeping human judgment involved. This is a personal reflection with no independent scoring or certification. The examples combine current role responsibilities and concurrent independent projects.
          </p>

          {/* Score Yourself CTA */}
          <Link
            href="/frontier-ops"
            className="group inline-flex items-center gap-2 px-5 py-3 rounded-xl text-[13px] font-medium text-white transition-all duration-200 active:scale-[0.98] hover:shadow-[0_8px_20px_-8px_rgba(99,102,241,0.5)]"
            style={{ background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)" }}
          >
            Explore the framework
            <svg
              aria-hidden="true"
              width="11"
              height="11"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-transform group-hover:translate-x-0.5"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

interface DimensionCardProps {
  dim: (typeof dimensions)[number];
  colors: ReturnType<typeof getScoreColor>;
  isLight: boolean;
  animate: boolean;
  delay: number;
}

function DimensionCard({
  dim,
  colors,
  isLight,
  animate,
  delay,
}: DimensionCardProps) {
  const [visible, setVisible] = useState(false);
  const { depth } = useReadingDepth();
  const showDefinition = depth !== "skim";
  const autoExpandEvidence = depth === "deep";
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    setExpanded(false);
  }, [depth]);

  const showEvidence = autoExpandEvidence || expanded;

  useEffect(() => {
    if (animate) {
      const timeout = setTimeout(() => setVisible(true), delay);
      return () => clearTimeout(timeout);
    }
  }, [animate, delay]);

  return (
    <div
      className={`group relative p-5 md:p-6 rounded-2xl border backdrop-blur-sm transition-all duration-500 hover:-translate-y-0.5 ${
        isLight
          ? "bg-white/70 border-gray-200/80 hover:border-[#6366f1]/40 hover:shadow-[0_12px_28px_-12px_rgba(99,102,241,0.20)]"
          : "bg-white/[0.025] border-white/[0.07] hover:border-[#6366f1]/40 hover:bg-white/[0.04]"
      } ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
    >
      {/* Top row: name + score */}
      <div className="flex items-start justify-between gap-3 mb-3.5">
        <h3 className={`text-[14px] font-bold tracking-tight leading-tight ${isLight ? "text-gray-900" : "text-white"}`}>
          {dim.name}
        </h3>
        <span
          className={`shrink-0 text-[20px] font-bold leading-none tabular-nums ${colors.text}`}
          style={{
            fontFamily: "var(--font-jetbrains-mono, 'JetBrains Mono', ui-monospace, monospace)",
          }}
        >
          Self
          <span className="text-[11px] font-normal opacity-60 ml-0.5">review</span>
        </span>
      </div>

      {/* Progress bar */}
      <div className={showDefinition || showEvidence ? "mb-4" : ""}>
        <ProgressBar score={dim.score} colorClass={colors.bar} animate={visible} isLight={isLight} />
      </div>

      {/* Definition */}
      {showDefinition && (
        <p className={`text-[12px] leading-relaxed ${showEvidence ? "mb-3.5" : ""} ${isLight ? "text-gray-600" : "text-[#a3a3a3]"}`}>
          {dim.definition}
        </p>
      )}

      {/* Evidence bullets */}
      {showEvidence && (
        <ul className="space-y-2 pt-1">
          {dim.evidence.map((point) => (
            <li key={point} className="flex items-start gap-2">
              <span className={`shrink-0 mt-[7px] inline-block w-1 h-1 rounded-full ${colors.bullet}`} />
              <span className={`text-[11.5px] leading-snug ${isLight ? "text-gray-700" : "text-[#d4d4d4]"}`}>
                {point}
              </span>
            </li>
          ))}
        </ul>
      )}

      {/* Expand button */}
      {!autoExpandEvidence && showDefinition && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className={`mt-3 inline-flex items-center gap-1 text-[10.5px] font-semibold uppercase tracking-[0.14em] transition-colors ${
            isLight ? "text-gray-500 hover:text-[#6366f1]" : "text-[#737373] hover:text-[#818cf8]"
          }`}
        >
          {expanded ? "Hide examples" : "Show examples"}
          <span className={`transition-transform ${expanded ? "rotate-180" : ""}`}>▾</span>
        </button>
      )}
    </div>
  );
}
