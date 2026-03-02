"use client";

import { useEffect, useState, useRef } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const dimensions = [
  {
    id: "boundary-sensing",
    name: "Boundary Sensing",
    score: 96,
    definition:
      "Maintaining accurate, up-to-date operational intuition about where the human-agent boundary sits. Updates with every model release — not static knowledge.",
    evidence: [
      "meta-vengine DQ scorer routes per model (Haiku/Sonnet/Opus) with data-driven boundary model across 3 models",
      "Upgraded JD analyzer mid-session when API changed (Sonnet 4 → Sonnet 4.5-20251001) — noticed capability shift immediately",
      "UCW captures 163K+ cognitive events across 6 AI platforms — empirical boundary dataset",
    ],
  },
  {
    id: "seam-design",
    name: "Seam Design",
    score: 98,
    definition:
      "Structuring work so transitions between human and agent phases are clean, verifiable, and recoverable. Knowing WHICH phases are agent-executable vs human-in-the-loop vs irreducibly human.",
    evidence: [
      "SUPERMAX: 5 councils, 21 agents, 9 explicit cross-agent handoff wires (sovereignty↔token, qa→platform, ux→product+protocol)",
      "GoMotion: 4 agents + 13 sub-agents with explicit MEDDPICC scoring seam between qualification and routing",
      "ACE (Adaptive Consensus Engine): 6-agent voting at output seam with DQ numerical validation at every transition",
    ],
  },
  {
    id: "failure-model",
    name: "Failure Model Maintenance",
    score: 94,
    definition:
      "Maintaining an accurate current mental model of HOW agents fail — not just that they fail. Differentiated failure taxonomy per task type.",
    evidence: [
      "Recovery Engine: 94% coverage, 70% auto-fix rate, 8 tracked error patterns — failure taxonomy in production",
      "DQ Scorer: validity (40%) + specificity (30%) + correctness (30%) — three-axis failure model",
      "Coherence detection: semantic echo (cosine similarity), synchronicity (temporal alignment), signature matching",
    ],
  },
  {
    id: "capability-forecasting",
    name: "Capability Forecasting",
    score: 89,
    definition:
      "Ability to forecast where the AI boundary will move next — tracking model releases and adjusting workflows before the seam shifts.",
    evidence: [
      "arXiv weekly sync auto-updates model baselines in meta-vengine; arXiv:2511.15755 (DQ Scoring) referenced 599 times across the ecosystem",
      "meta-vengine co-evolution: system reads own patterns and modifies own instructions — designed for capability drift",
      "Migrated entire coordinator to Opus 4.6 on release day; Cognitive OS energy-aware routing adapts to new model capabilities",
    ],
  },
  {
    id: "attention-calibration",
    name: "Attention Calibration",
    score: 92,
    definition:
      "Knowing where human attention creates most value at the current boundary — managing attention across agent-assisted work.",
    evidence: [
      "Cognitive OS: energy-aware routing by time of day (morning/peak/dip/evening/deep_night) with flow state detection (0–1 score)",
      "Session optimizer: budget/window management, strategically reserves Opus tasks for high-cognition moments",
      "Activity tracker: real-time telemetry on tool usage and context budget — prevents attention blowout",
    ],
  },
];

function getScoreColor(score: number, isLight: boolean) {
  if (score >= 90) {
    return {
      bar: "bg-emerald-500",
      text: "text-emerald-500",
      badge: isLight
        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
        : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
      bullet: "text-emerald-400",
    };
  }
  if (score >= 80) {
    return {
      bar: "bg-indigo-500",
      text: "text-indigo-400",
      badge: isLight
        ? "bg-indigo-50 text-indigo-700 border-indigo-200"
        : "bg-indigo-500/10 text-indigo-400 border-indigo-500/30",
      bullet: "text-indigo-400",
    };
  }
  return {
    bar: "bg-amber-500",
    text: "text-amber-500",
    badge: isLight
      ? "bg-amber-50 text-amber-700 border-amber-200"
      : "bg-amber-500/10 text-amber-400 border-amber-500/30",
    bullet: "text-amber-400",
  };
}

interface ProgressBarProps {
  score: number;
  colorClass: string;
  animate: boolean;
}

function ProgressBar({ score, colorClass, animate }: ProgressBarProps) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (animate) {
      const timeout = setTimeout(() => setWidth(score), 100);
      return () => clearTimeout(timeout);
    }
  }, [animate, score]);

  return (
    <div className="relative h-2 rounded-full bg-gray-200/40 overflow-hidden">
      <div
        className={`h-full rounded-full ${colorClass} transition-all duration-700 ease-out`}
        style={{ width: `${width}%` }}
      />
    </div>
  );
}

export function FrontierOpsScore({ isLight }: { isLight: boolean }) {
  const { ref: sectionRef, isVisible } = useScrollReveal({ threshold: 0.1 });

  return (
    <section
      ref={sectionRef as React.RefObject<HTMLElement>}
      className="py-20 px-6"
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div
          className={`text-center mb-12 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border mb-6 bg-indigo-500/10 border-indigo-500/30 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
            <span>Frontier Operations Framework</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Frontier Operations Score
          </h2>
          <p
            className={`max-w-2xl mx-auto text-lg mb-6 ${
              isLight ? "text-gray-600" : "text-gray-400"
            }`}
          >
            Scored against Ethan Mollick&apos;s Frontier Operations framework — the skill of working at the surface of the AI capability bubble.
          </p>

          {/* Overall score badge */}
          <div
            className={`inline-flex items-center gap-3 px-6 py-3 rounded-2xl border-2 font-bold text-lg ${
              isLight
                ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                : "border-emerald-500/50 bg-emerald-500/10 text-emerald-300"
            }`}
          >
            <span className="text-3xl font-extrabold text-emerald-500">94</span>
            <span
              className={`text-sm font-normal ${
                isLight ? "text-emerald-700" : "text-emerald-400"
              }`}
            >
              / 100
            </span>
            <span
              className={`text-base ${
                isLight ? "text-emerald-800" : "text-emerald-300"
              }`}
            >
              — Deep Frontier Operator
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
          className={`mt-10 text-center transition-all duration-700 delay-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <p
            className={`max-w-3xl mx-auto text-sm leading-relaxed ${
              isLight ? "text-gray-500" : "text-gray-500"
            }`}
          >
            <span
              className={`font-semibold ${
                isLight ? "text-gray-700" : "text-gray-300"
              }`}
            >
              Frontier Operations
            </span>{" "}
            is the skill of working at the surface of the AI capability bubble — sensing where agents succeed, designing clean handoffs, maintaining failure models, and calibrating human attention as capabilities shift quarterly. Scores are evidence-based, derived from production systems built and operated over 4,035+ Claude sessions.
          </p>
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

  useEffect(() => {
    if (animate) {
      const timeout = setTimeout(() => setVisible(true), delay);
      return () => clearTimeout(timeout);
    }
  }, [animate, delay]);

  return (
    <div
      className={`p-6 rounded-2xl border transition-all duration-500 ${
        isLight
          ? "border-gray-200 bg-white shadow-sm"
          : "border-white/10 bg-white/5"
      } ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
    >
      {/* Top row: name + score */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3
          className={`text-base font-bold leading-tight ${
            isLight ? "text-gray-900" : "text-white"
          }`}
        >
          {dim.name}
        </h3>
        <span
          className={`shrink-0 text-xl font-extrabold tabular-nums ${colors.text}`}
        >
          {dim.score}
          <span className="text-sm font-normal opacity-60">/100</span>
        </span>
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <ProgressBar
          score={dim.score}
          colorClass={colors.bar}
          animate={visible}
        />
      </div>

      {/* Definition */}
      <p
        className={`text-xs leading-relaxed mb-4 ${
          isLight ? "text-gray-500" : "text-gray-400"
        }`}
      >
        {dim.definition}
      </p>

      {/* Evidence bullets */}
      <ul className="space-y-2">
        {dim.evidence.map((point, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className={`shrink-0 mt-0.5 ${colors.bullet}`}>→</span>
            <span
              className={`text-xs leading-relaxed ${
                isLight ? "text-gray-700" : "text-gray-300"
              }`}
            >
              {point}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
