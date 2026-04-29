"use client";

import { useState } from "react";
import Link from "next/link";
import { useTheme } from "@/components/ThemeProvider";

// ─── Dimension definitions ────────────────────────────────────────────────────

const DICO_SCORES: Record<string, number> = {
  "boundary-sensing": 96,
  "seam-design": 98,
  "failure-model": 94,
  "capability-forecasting": 89,
  "attention-calibration": 92,
};

type AnswerValue = "yes" | "partial" | "no" | null;

interface Question {
  text: string;
  yes: number;
  partial: number;
  no: number;
}

interface Dimension {
  id: string;
  name: string;
  max: number;
  definition: string;
  questions: Question[];
}

const dimensions: Dimension[] = [
  {
    id: "boundary-sensing",
    name: "Boundary Sensing",
    max: 20,
    definition:
      "Maintaining accurate, up-to-date operational intuition about where the human-agent boundary sits.",
    questions: [
      {
        text: "Do you know which tasks your AI tools handle reliably vs where they fail?",
        yes: 7,
        partial: 4,
        no: 0,
      },
      {
        text: "Have you updated your mental model of AI capabilities in the last 30 days?",
        yes: 7,
        partial: 4,
        no: 0,
      },
      {
        text: "Can you name 3 specific tasks where you shifted from manual to AI-delegated this quarter?",
        yes: 6,
        partial: 3,
        no: 0,
      },
    ],
  },
  {
    id: "seam-design",
    name: "Seam Design",
    max: 20,
    definition:
      "Structuring work so transitions between human and agent phases are clean, verifiable, and recoverable.",
    questions: [
      {
        text: "When you delegate work to AI, do you define explicit verification checkpoints?",
        yes: 7,
        partial: 4,
        no: 0,
      },
      {
        text: "Can you break a project into agent-executable vs human-required phases?",
        yes: 7,
        partial: 4,
        no: 0,
      },
      {
        text: "Do you have documented handoff artifacts between AI and human work?",
        yes: 6,
        partial: 3,
        no: 0,
      },
    ],
  },
  {
    id: "failure-model",
    name: "Failure Model Maintenance",
    max: 20,
    definition:
      "Maintaining an accurate current mental model of HOW agents fail — not just that they fail.",
    questions: [
      {
        text: "Can you describe HOW your AI tools fail on specific task types (not just that they fail)?",
        yes: 7,
        partial: 4,
        no: 0,
      },
      {
        text: "Do you verify AI output differently based on task type?",
        yes: 7,
        partial: 4,
        no: 0,
      },
      {
        text: "Have you logged or tracked AI failure patterns systematically?",
        yes: 6,
        partial: 3,
        no: 0,
      },
    ],
  },
  {
    id: "capability-forecasting",
    name: "Capability Forecasting",
    max: 20,
    definition:
      "Ability to forecast where the AI boundary will move next — tracking model releases and adjusting workflows before the seam shifts.",
    questions: [
      {
        text: "Do you track AI model releases and how they affect your workflow?",
        yes: 7,
        partial: 4,
        no: 0,
      },
      {
        text: "Have you redesigned a workflow in response to a new model capability?",
        yes: 7,
        partial: 4,
        no: 0,
      },
      {
        text: "Can you predict which of your current manual tasks will be AI-delegatable within 6 months?",
        yes: 6,
        partial: 3,
        no: 0,
      },
    ],
  },
  {
    id: "attention-calibration",
    name: "Attention Calibration",
    max: 20,
    definition:
      "Knowing where human attention creates most value at the current boundary — managing attention across agent-assisted work.",
    questions: [
      {
        text: "Do you review AI output at different depths depending on task risk?",
        yes: 7,
        partial: 4,
        no: 0,
      },
      {
        text: "Can you articulate where your attention creates value vs where it's wasted on AI review?",
        yes: 7,
        partial: 4,
        no: 0,
      },
      {
        text: "Do you have a system for deciding what to deeply review vs what to trust?",
        yes: 6,
        partial: 3,
        no: 0,
      },
    ],
  },
];

// ─── Score helpers ─────────────────────────────────────────────────────────────

function scoreTier(total: number): { label: string; description: string; color: string } {
  if (total >= 90)
    return {
      label: "Deep Frontier Operator",
      description:
        "You're in the top 0.1% of professionals operating at the AI frontier. You don't just use AI — you architect the seam between human and machine cognition.",
      color: "emerald",
    };
  if (total >= 75)
    return {
      label: "Active Frontier Practitioner",
      description:
        "You're ahead of 95% of professionals. Your AI practice is systematic — you're building the habits that will compound into deep frontier ops.",
      color: "indigo",
    };
  if (total >= 55)
    return {
      label: "Frontier Aware",
      description:
        "You understand the concepts but aren't systematically practicing. The gap between knowing and operating is where leverage lives.",
      color: "violet",
    };
  if (total >= 35)
    return {
      label: "AI User",
      description:
        "You use AI regularly but don't yet operate at the frontier. You're leaving 80% of the leverage on the table.",
      color: "amber",
    };
  return {
    label: "Pre-Frontier",
    description:
      "Significant opportunity ahead. The professionals who build frontier ops skills now will have a 5-year head start by 2028.",
    color: "orange",
  };
}

function getDimScore(dim: Dimension, answers: Record<string, AnswerValue>): number {
  return dim.questions.reduce((acc, q, qi) => {
    const key = `${dim.id}-${qi}`;
    const ans = answers[key];
    if (ans === "yes") return acc + q.yes;
    if (ans === "partial") return acc + q.partial;
    return acc;
  }, 0);
}

function getAnsweredCount(answers: Record<string, AnswerValue>): number {
  return Object.values(answers).filter((v) => v !== null).length;
}

const TOTAL_QUESTIONS = dimensions.reduce((a, d) => a + d.questions.length, 0);

// ─── Color helpers ─────────────────────────────────────────────────────────────

function barColor(score: number, max: number) {
  const pct = (score / max) * 100;
  if (pct >= 85) return "bg-emerald-500";
  if (pct >= 70) return "bg-indigo-500";
  if (pct >= 50) return "bg-violet-500";
  return "bg-amber-500";
}

function textColor(score: number, max: number, isLight: boolean) {
  const pct = (score / max) * 100;
  if (pct >= 85) return isLight ? "text-emerald-700" : "text-emerald-400";
  if (pct >= 70) return isLight ? "text-indigo-700" : "text-indigo-400";
  if (pct >= 50) return isLight ? "text-violet-700" : "text-violet-400";
  return isLight ? "text-amber-700" : "text-amber-400";
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function AnswerButton({
  label,
  value,
  selected,
  isLight,
  onClick,
}: {
  label: string;
  value: AnswerValue;
  selected: boolean;
  isLight: boolean;
  onClick: () => void;
}) {
  const base =
    "px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-200 cursor-pointer";

  const style = selected
    ? value === "yes"
      ? "bg-emerald-500 border-emerald-500 text-white"
      : value === "partial"
      ? "bg-indigo-500 border-indigo-500 text-white"
      : "bg-gray-500 border-gray-500 text-white"
    : isLight
    ? "border-gray-200 text-gray-600 hover:border-indigo-300 hover:text-indigo-600 bg-white"
    : "border-white/10 text-gray-400 hover:border-indigo-500/50 hover:text-indigo-400 bg-white/5";

  return (
    <button className={`${base} ${style}`} onClick={onClick}>
      {label}
    </button>
  );
}

function CompareBar({
  label,
  userScore,
  dicoScore,
  max,
  isLight,
}: {
  label: string;
  userScore: number;
  dicoScore: number;
  max: number;
  isLight: boolean;
}) {
  const userPct = (userScore / max) * 100;
  const dicoPct = (dicoScore / max) * 100;

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <span className={`text-xs font-semibold ${isLight ? "text-gray-700" : "text-gray-300"}`}>
          {label}
        </span>
        <div className="flex items-center gap-3 text-xs">
          <span className={isLight ? "text-gray-500" : "text-gray-500"}>
            You:{" "}
            <span className={`font-bold ${isLight ? "text-gray-900" : "text-white"}`}>
              {userScore}/{max}
            </span>
          </span>
          <span className={isLight ? "text-gray-400" : "text-gray-600"}>|</span>
          <span className="text-emerald-500">
            Dico:{" "}
            <span className="font-bold">{dicoScore}/{max}</span>
          </span>
        </div>
      </div>
      {/* User bar */}
      <div className={`relative h-2 rounded-full overflow-hidden ${isLight ? "bg-gray-100" : "bg-white/10"}`}>
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${barColor(userScore, max)}`}
          style={{ width: `${userPct}%` }}
        />
      </div>
      {/* Dico bar */}
      <div className={`relative h-1.5 rounded-full overflow-hidden ${isLight ? "bg-gray-100" : "bg-white/10"}`}>
        <div
          className="h-full rounded-full transition-all duration-700 ease-out bg-emerald-500/50"
          style={{ width: `${dicoPct}%` }}
        />
      </div>
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────

export default function FrontierOpsAssessment() {
  const { theme } = useTheme();
  const isLight = theme === "light";

  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});

  function setAnswer(dimId: string, qi: number, value: AnswerValue) {
    setAnswers((prev) => ({ ...prev, [`${dimId}-${qi}`]: value }));
  }

  const answeredCount = getAnsweredCount(answers);
  const allAnswered = answeredCount === TOTAL_QUESTIONS;

  const dimScores = dimensions.map((dim) => ({
    ...dim,
    userScore: getDimScore(dim, answers),
    dicoScore: DICO_SCORES[dim.id],
  }));

  const totalUserScore = dimScores.reduce((acc, d) => acc + d.userScore, 0);
  const tier = scoreTier(totalUserScore);

  // Colors for the tier badge
  const tierColors: Record<string, string> = {
    emerald: isLight
      ? "border-emerald-300 bg-emerald-50 text-emerald-800"
      : "border-emerald-500/50 bg-emerald-500/10 text-emerald-300",
    indigo: isLight
      ? "border-indigo-300 bg-indigo-50 text-indigo-800"
      : "border-indigo-500/50 bg-indigo-500/10 text-indigo-300",
    violet: isLight
      ? "border-violet-300 bg-violet-50 text-violet-800"
      : "border-violet-500/50 bg-violet-500/10 text-violet-300",
    amber: isLight
      ? "border-amber-300 bg-amber-50 text-amber-800"
      : "border-amber-500/50 bg-amber-500/10 text-amber-300",
    orange: isLight
      ? "border-orange-300 bg-orange-50 text-orange-800"
      : "border-orange-500/50 bg-orange-500/10 text-orange-300",
  };

  const tierScoreColors: Record<string, string> = {
    emerald: "text-emerald-500",
    indigo: "text-indigo-500",
    violet: "text-violet-500",
    amber: "text-amber-500",
    orange: "text-orange-500",
  };

  return (
    <main className={`min-h-screen ${isLight ? "bg-gray-50" : "bg-[#0a0a0a]"}`}>
      {/* Back nav */}
      <div className={`border-b ${isLight ? "border-gray-200 bg-white" : "border-white/10 bg-[#0a0a0a]"}`}>
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className={`flex items-center gap-2 text-sm font-medium transition-colors ${
              isLight ? "text-gray-500 hover:text-gray-900" : "text-gray-500 hover:text-white"
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to portfolio
          </Link>
          <div className="flex items-center gap-2">
            <span className={`text-xs ${isLight ? "text-gray-400" : "text-gray-600"}`}>
              {answeredCount}/{TOTAL_QUESTIONS} answered
            </span>
            <div className={`h-1.5 w-24 rounded-full overflow-hidden ${isLight ? "bg-gray-200" : "bg-white/10"}`}>
              <div
                className="h-full bg-indigo-500 rounded-full transition-all duration-300"
                style={{ width: `${(answeredCount / TOTAL_QUESTIONS) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border mb-6 bg-indigo-500/10 border-indigo-500/30 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
            <span>Self-Assessment</span>
          </div>

          <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${isLight ? "text-gray-900" : "text-white"}`}>
            Frontier Operations<br />
            <span className="text-indigo-500">Self-Assessment</span>
          </h1>

          <p className={`max-w-2xl mx-auto text-lg mb-3 ${isLight ? "text-gray-600" : "text-gray-400"}`}>
            Score yourself against the 5 frontier ops skills. No AI required — honest self-assessment only.
          </p>
          <p className={`text-sm ${isLight ? "text-gray-400" : "text-gray-600"}`}>
            Framework by Ethan Mollick. Infrastructure by Dico Angelo.
          </p>
        </div>

        {/* Questions */}
        <div className="space-y-8 mb-12">
          {dimensions.map((dim) => {
            const dimScore = getDimScore(dim, answers);
            const dimAnsweredCount = dim.questions.filter(
              (_, qi) => answers[`${dim.id}-${qi}`] !== undefined && answers[`${dim.id}-${qi}`] !== null
            ).length;

            return (
              <div
                key={dim.id}
                className={`rounded-2xl border p-6 transition-all ${
                  isLight ? "border-gray-200 bg-white shadow-sm" : "border-white/10 bg-white/5"
                }`}
              >
                {/* Dim header */}
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div>
                    <h2 className={`text-lg font-bold ${isLight ? "text-gray-900" : "text-white"}`}>
                      {dim.name}
                    </h2>
                    <p className={`text-xs mt-1 ${isLight ? "text-gray-500" : "text-gray-500"}`}>
                      {dim.definition}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <span className={`text-2xl font-extrabold tabular-nums ${textColor(dimScore, dim.max, isLight)}`}>
                      {dimScore}
                    </span>
                    <span className={`text-sm ${isLight ? "text-gray-400" : "text-gray-600"}`}>/{dim.max}</span>
                  </div>
                </div>

                {/* Dim progress */}
                <div className={`h-1.5 rounded-full overflow-hidden mb-6 ${isLight ? "bg-gray-100" : "bg-white/10"}`}>
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${barColor(dimScore, dim.max)}`}
                    style={{ width: `${(dimScore / dim.max) * 100}%` }}
                  />
                </div>

                {/* Questions */}
                <div className="space-y-5">
                  {dim.questions.map((q, qi) => {
                    const key = `${dim.id}-${qi}`;
                    const current = answers[key] ?? null;

                    return (
                      <div key={qi}>
                        <p className={`text-sm font-medium mb-3 leading-relaxed ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                          {qi + 1}. {q.text}
                        </p>
                        <div className="flex gap-2 flex-wrap">
                          <AnswerButton
                            label={`Yes (+${q.yes})`}
                            value="yes"
                            selected={current === "yes"}
                            isLight={isLight}
                            onClick={() => setAnswer(dim.id, qi, "yes")}
                          />
                          <AnswerButton
                            label={`Partially (+${q.partial})`}
                            value="partial"
                            selected={current === "partial"}
                            isLight={isLight}
                            onClick={() => setAnswer(dim.id, qi, "partial")}
                          />
                          <AnswerButton
                            label="No (+0)"
                            value="no"
                            selected={current === "no"}
                            isLight={isLight}
                            onClick={() => setAnswer(dim.id, qi, "no")}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Dim completion hint */}
                {dimAnsweredCount < dim.questions.length && (
                  <p className={`mt-4 text-xs ${isLight ? "text-gray-400" : "text-gray-600"}`}>
                    {dim.questions.length - dimAnsweredCount} question{dim.questions.length - dimAnsweredCount !== 1 ? "s" : ""} remaining
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Results — show as soon as any answers exist */}
        {answeredCount > 0 && (
          <div
            className={`rounded-2xl border p-8 transition-all ${
              isLight
                ? "border-indigo-200 bg-gradient-to-br from-indigo-50 to-violet-50"
                : "border-indigo-500/30 bg-gradient-to-br from-indigo-950/30 to-violet-950/30"
            }`}
          >
            <h2 className={`text-2xl font-bold mb-2 ${isLight ? "text-gray-900" : "text-white"}`}>
              Your Results
            </h2>

            {!allAnswered && (
              <p className={`text-sm mb-6 ${isLight ? "text-gray-500" : "text-gray-500"}`}>
                Answer all {TOTAL_QUESTIONS} questions to see your final score.{" "}
                <span className={isLight ? "text-indigo-600" : "text-indigo-400"}>
                  {TOTAL_QUESTIONS - answeredCount} remaining.
                </span>
              </p>
            )}

            {/* Score badge */}
            <div className="flex items-center gap-4 mb-8 flex-wrap">
              <div
                className={`inline-flex items-center gap-3 px-6 py-3 rounded-2xl border-2 font-bold text-lg ${tierColors[tier.color]}`}
              >
                <span className={`text-4xl font-extrabold tabular-nums ${tierScoreColors[tier.color]}`}>
                  {totalUserScore}
                </span>
                <span className={`text-sm font-normal ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                  / 100
                </span>
                <span className="text-base font-semibold">— {tier.label}</span>
              </div>

              {/* Dico comparison */}
              <div
                className={`inline-flex items-center gap-3 px-5 py-3 rounded-2xl border font-medium text-sm ${
                  isLight
                    ? "border-emerald-200 bg-emerald-50/50 text-emerald-800"
                    : "border-emerald-500/20 bg-emerald-500/5 text-emerald-400"
                }`}
              >
                <span className="text-emerald-500 text-2xl font-extrabold tabular-nums">94</span>
                <span className={`text-xs ${isLight ? "text-emerald-700" : "text-emerald-500"}`}>
                  Dico&apos;s score
                </span>
              </div>
            </div>

            {/* Tier description */}
            <p className={`mb-8 leading-relaxed ${isLight ? "text-gray-700" : "text-gray-300"}`}>
              {tier.description}
            </p>

            {/* Per-dimension comparison */}
            <div className="space-y-5 mb-8">
              <h3 className={`text-sm font-semibold uppercase tracking-wider ${isLight ? "text-gray-500" : "text-gray-500"}`}>
                Score by dimension (thick = you, thin = Dico)
              </h3>
              {dimScores.map((d) => (
                <CompareBar
                  key={d.id}
                  label={d.name}
                  userScore={d.userScore}
                  dicoScore={d.dicoScore}
                  max={d.max}
                  isLight={isLight}
                />
              ))}
            </div>

            {/* Score scale reference */}
            <div className={`rounded-xl p-4 mb-6 text-xs space-y-1.5 ${isLight ? "bg-white/70" : "bg-white/5"}`}>
              <p className={`font-semibold mb-2 ${isLight ? "text-gray-700" : "text-gray-300"}`}>Score Reference</p>
              {[
                { range: "90–100", label: "Deep Frontier Operator", color: "text-emerald-500" },
                { range: "75–89", label: "Active Frontier Practitioner", color: "text-indigo-400" },
                { range: "55–74", label: "Frontier Aware", color: "text-violet-400" },
                { range: "35–54", label: "AI User", color: "text-amber-400" },
                { range: "0–34", label: "Pre-Frontier", color: "text-orange-400" },
              ].map((tier) => (
                <div key={tier.range} className="flex items-center gap-3">
                  <span className={`font-mono w-14 ${isLight ? "text-gray-400" : "text-gray-600"}`}>{tier.range}</span>
                  <span className={`font-semibold ${tier.color}`}>{tier.label}</span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/#frontier-ops"
                className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all hover:scale-105 border ${
                  isLight
                    ? "border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                    : "border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20"
                }`}
              >
                <span>See how Dico scored 94/100 →</span>
              </Link>
              <p className={`self-center text-sm ${isLight ? "text-gray-500" : "text-gray-500"}`}>
                Want to develop these skills? Start by giving your AI agent a task that surprises you.
              </p>
            </div>
          </div>
        )}

        {/* Empty state CTA */}
        {answeredCount === 0 && (
          <div className={`text-center py-8 ${isLight ? "text-gray-400" : "text-gray-600"}`}>
            <p className="text-sm">Answer the questions above to see your score update in real time.</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className={`border-t mt-16 py-8 text-center ${isLight ? "border-gray-200" : "border-white/10"}`}>
        <p className={`text-sm ${isLight ? "text-gray-400" : "text-gray-600"}`}>
          Framework by Ethan Mollick. Assessment built by{" "}
          <Link href="/" className={`font-medium ${isLight ? "text-indigo-600 hover:text-indigo-500" : "text-indigo-400 hover:text-indigo-300"}`}>
            Dico Angelo
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
