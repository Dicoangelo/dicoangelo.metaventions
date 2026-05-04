"use client";

import { useState } from "react";
import { useReadingDepth } from "@/components/ReadingDepthProvider";

interface UCWInsightsSectionProps {
  isLight: boolean;
}

const COGNITIVE_MODES = [
  { label: "Deep Work", value: 51.3, color: "#6366f1" },
  { label: "Exploration", value: 32.6, color: "#8b5cf6" },
  { label: "Casual", value: 16.0, color: "#a78bfa" },
];

const INTENT_PROFILE = [
  { intent: "Create", pct: 24.7, description: "Building, generating, shipping" },
  { intent: "Explore", pct: 23.0, description: "Research, ideation, discovery" },
  { intent: "Search", pct: 15.5, description: "Finding specific information" },
  { intent: "Analyze", pct: 14.8, description: "Debugging and evaluation" },
  { intent: "Retrieve", pct: 14.3, description: "Fetching context and data" },
  { intent: "Execute", pct: 5.3, description: "Running commands, deploying" },
];

const TOP_TOPICS = [
  { topic: "AI Agents", count: 15418 },
  { topic: "Coding", count: 12828 },
  { topic: "DevOps", count: 10867 },
  { topic: "Research", count: 7605 },
  { topic: "Product", count: 5416 },
  { topic: "Database", count: 4845 },
  { topic: "Frontend", count: 4082 },
  { topic: "Career", count: 3899 },
  { topic: "MCP Protocol", count: 3236 },
  { topic: "Strategy", count: 2788 },
];

const COHERENCE_TYPES = [
  { type: "Semantic Echo", count: 41, confidence: 0.839, description: "Same idea surfacing independently on different platforms" },
  { type: "Synchronicity", count: 29, confidence: 0.834, description: "Temporal alignment of thought across systems" },
  { type: "Signature Match", count: 2, confidence: 0.95, description: "Exact cognitive fingerprint on different platforms" },
];

const PEAK_HOURS = [
  { hour: "3 AM", events: 36184, highlight: true },
  { hour: "10 PM", events: 8152, highlight: false },
  { hour: "11 PM", events: 7208, highlight: false },
  { hour: "9 PM", events: 6775, highlight: false },
  { hour: "5 PM", events: 6490, highlight: false },
];

const STATS = [
  { value: "163K+", label: "Cognitive Events", sub: "Across 6 platforms", glow: "rgba(99,102,241,0.20)" },
  { value: "150K+", label: "Embeddings", sub: "Semantic vectors", glow: "rgba(139,92,246,0.20)" },
  { value: "11K+", label: "Sessions", sub: "Tracked interactions", glow: "rgba(167,139,250,0.20)" },
  { value: "72", label: "Coherence Moments", sub: "Cross-platform alignment", glow: "rgba(99,102,241,0.20)" },
  { value: "7", label: "Active Arcs", sub: "Persistent thought threads", glow: "rgba(139,92,246,0.20)" },
  { value: "6", label: "Platforms", sub: "Claude · ChatGPT · Grok+", glow: "rgba(167,139,250,0.20)" },
];

const TABS = [
  { id: "overview", label: "Scale" },
  { id: "cognition", label: "How I Think" },
  { id: "coherence", label: "Cross-Platform" },
] as const;

export function UCWInsightsSection({ isLight }: UCWInsightsSectionProps) {
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]["id"]>("overview");
  const { depth } = useReadingDepth();
  const showSummary = depth !== "skim";
  const showDeep = depth === "deep";

  const maxTopicCount = TOP_TOPICS[0].count;

  const monoFont = "var(--font-jetbrains-mono, 'JetBrains Mono', ui-monospace, monospace)";
  const cardClass = isLight
    ? "bg-white/70 border border-gray-200/80 backdrop-blur-sm"
    : "bg-[#0a0a0a]/70 border border-white/[0.07] backdrop-blur-sm";

  return (
    <section id="ucw-insights" className="relative py-24 px-6">
      {/* Ambient brand wash */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-1/3 h-[60%] blur-3xl opacity-40"
        style={{
          background: isLight
            ? "radial-gradient(ellipse 50% 60% at 50% 50%, rgba(99,102,241,0.10), transparent 70%)"
            : "radial-gradient(ellipse 50% 60% at 50% 50%, rgba(99,102,241,0.16), transparent 70%)",
        }}
      />

      <div className="relative max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <span
            className={`inline-block text-[11px] font-semibold uppercase tracking-[0.2em] mb-4 ${
              isLight ? "text-[#6366f1]/80" : "text-[#818cf8]"
            }`}
          >
            Universal Cognitive Wallet
          </span>
          <h2 className={`text-4xl md:text-5xl font-bold tracking-tight ${isLight ? "text-gray-900" : "text-white"}`}>
            What 163K AI interactions reveal.
          </h2>
          {showSummary && (
            <p className={`mt-5 max-w-2xl mx-auto text-[16px] leading-relaxed ${isLight ? "text-gray-600" : "text-[#a3a3a3]"}`}>
              Real data from the UCW — a system that captures every AI interaction across 6 platforms, generates semantic embeddings, and detects cross-platform coherence.
            </p>
          )}
        </div>

        {/* Pill tab navigation */}
        <div className="flex justify-center mb-10">
          <div
            className={`inline-flex items-center gap-1 p-1 rounded-full backdrop-blur-sm ${
              isLight ? "bg-white/70 border border-gray-200/80" : "bg-white/[0.04] border border-white/[0.08]"
            }`}
          >
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-1.5 rounded-full text-[12.5px] font-semibold transition-all ${
                  activeTab === tab.id
                    ? "bg-gradient-to-br from-[#6366f1] to-[#5558e3] text-white shadow-[0_4px_14px_-4px_rgba(99,102,241,0.5)]"
                    : isLight
                      ? "text-gray-500 hover:text-gray-900"
                      : "text-[#737373] hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Stats grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {STATS.map((stat) => (
                <div
                  key={stat.label}
                  className={`group relative p-5 rounded-2xl text-center transition-all duration-300 hover:-translate-y-0.5 ${cardClass}`}
                  style={{ ["--glow" as string]: stat.glow } as React.CSSProperties}
                >
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: `radial-gradient(ellipse 80% 70% at 50% 50%, var(--glow), transparent 70%)` }}
                  />
                  <p
                    className="relative text-[28px] md:text-[32px] font-bold leading-none tracking-tight"
                    style={{
                      fontFamily: monoFont,
                      background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      filter: `drop-shadow(0 2px 14px ${stat.glow})`,
                    }}
                  >
                    {stat.value}
                  </p>
                  <p className={`relative text-[12px] font-semibold mt-3 tracking-tight ${isLight ? "text-gray-900" : "text-white"}`}>
                    {stat.label}
                  </p>
                  <p className={`relative text-[10.5px] mt-1 tracking-[-0.005em] ${isLight ? "text-gray-500" : "text-[#737373]"}`}>
                    {stat.sub}
                  </p>
                </div>
              ))}
            </div>

            {/* Topic distribution */}
            <div className={`p-6 rounded-2xl ${cardClass}`}>
              <h3 className={`text-[14px] font-semibold mb-5 tracking-tight ${isLight ? "text-gray-900" : "text-white"}`}>
                What I think about most
              </h3>
              <div className="space-y-2.5">
                {TOP_TOPICS.map((t) => (
                  <div key={t.topic} className="flex items-center gap-3">
                    <span className={`text-[12px] w-24 md:w-28 shrink-0 font-medium ${isLight ? "text-gray-700" : "text-[#ededed]"}`}>
                      {t.topic}
                    </span>
                    <div className={`flex-1 h-2 rounded-full overflow-hidden ${isLight ? "bg-gray-100" : "bg-white/[0.04]"}`}>
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] transition-all duration-700"
                        style={{ width: `${(t.count / maxTopicCount) * 100}%` }}
                      />
                    </div>
                    <span
                      className={`text-[11px] w-12 text-right tabular-nums ${isLight ? "text-gray-500" : "text-[#737373]"}`}
                      style={{ fontFamily: monoFont }}
                    >
                      {(t.count / 1000).toFixed(1)}K
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* COGNITION */}
        {activeTab === "cognition" && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              {/* Cognitive modes */}
              <div className={`p-6 rounded-2xl ${cardClass}`}>
                <h3 className={`text-[14px] font-semibold mb-5 tracking-tight ${isLight ? "text-gray-900" : "text-white"}`}>
                  Cognitive modes
                </h3>
                <div className="space-y-4">
                  {COGNITIVE_MODES.map((mode) => (
                    <div key={mode.label}>
                      <div className="flex justify-between mb-1.5">
                        <span className={`text-[12.5px] font-medium ${isLight ? "text-gray-700" : "text-[#ededed]"}`}>
                          {mode.label}
                        </span>
                        <span className="text-[12px] font-bold text-[#6366f1]" style={{ fontFamily: monoFont }}>
                          {mode.value}%
                        </span>
                      </div>
                      <div className={`h-1.5 rounded-full overflow-hidden ${isLight ? "bg-gray-100" : "bg-white/[0.04]"}`}>
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${mode.value}%`, backgroundColor: mode.color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                {showSummary && (
                  <p className={`text-[11.5px] mt-5 leading-relaxed ${isLight ? "text-gray-500" : "text-[#737373]"}`}>
                    51.3% deep work means over half of all AI interactions are focused, production-oriented building sessions.
                  </p>
                )}
              </div>

              {/* Intent profile */}
              <div className={`p-6 rounded-2xl ${cardClass}`}>
                <h3 className={`text-[14px] font-semibold mb-5 tracking-tight ${isLight ? "text-gray-900" : "text-white"}`}>
                  Intent profile
                </h3>
                <div className="space-y-3">
                  {INTENT_PROFILE.map((item) => (
                    <div key={item.intent} className="flex items-baseline gap-3">
                      <span
                        className="text-[13px] font-bold text-[#6366f1] w-12 tabular-nums shrink-0"
                        style={{ fontFamily: monoFont }}
                      >
                        {item.pct}%
                      </span>
                      <div className="flex-1 min-w-0">
                        <span className={`text-[12.5px] font-semibold ${isLight ? "text-gray-800" : "text-white"}`}>
                          {item.intent}
                        </span>
                        <span className={`text-[11.5px] ml-2 ${isLight ? "text-gray-500" : "text-[#737373]"}`}>
                          {item.description}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                {showSummary && (
                  <p className={`text-[11.5px] mt-5 italic ${isLight ? "text-gray-500" : "text-[#737373]"}`}>
                    Cognitive fingerprint: Create &gt; Explore &gt; Search &gt; Analyze
                  </p>
                )}
              </div>
            </div>

            {/* Peak hours */}
            <div className={`p-6 rounded-2xl ${cardClass}`}>
              <h3 className={`text-[14px] font-semibold mb-5 tracking-tight ${isLight ? "text-gray-900" : "text-white"}`}>
                When I work
              </h3>
              <div className="flex items-end gap-3 md:gap-5 justify-center h-44">
                {PEAK_HOURS.map((h) => {
                  const heightPct = (h.events / PEAK_HOURS[0].events) * 100;
                  return (
                    <div key={h.hour} className="flex flex-col items-center gap-2 flex-1 max-w-20">
                      <span
                        className={`text-[11px] font-bold tabular-nums ${
                          h.highlight ? "text-[#6366f1]" : isLight ? "text-gray-500" : "text-[#737373]"
                        }`}
                        style={{ fontFamily: monoFont }}
                      >
                        {(h.events / 1000).toFixed(1)}K
                      </span>
                      <div
                        className={`w-full rounded-t-xl transition-all duration-500 ${
                          h.highlight
                            ? "bg-gradient-to-t from-[#6366f1] to-[#8b5cf6] shadow-[0_-4px_20px_-4px_rgba(99,102,241,0.55)]"
                            : isLight
                              ? "bg-gray-200"
                              : "bg-white/[0.06]"
                        }`}
                        style={{ height: `${heightPct}%`, minHeight: 8 }}
                      />
                      <span
                        className={`text-[11px] font-medium ${
                          h.highlight
                            ? "text-[#6366f1] font-bold"
                            : isLight
                              ? "text-gray-600"
                              : "text-[#a3a3a3]"
                        }`}
                      >
                        {h.hour}
                      </span>
                    </div>
                  );
                })}
              </div>
              {showSummary && (
                <p className={`text-center text-[11.5px] mt-5 ${isLight ? "text-gray-500" : "text-[#737373]"}`}>
                  3 AM is peak output — 4.4x any other hour. 33.4% of all work happens between 2-5 AM.
                </p>
              )}
            </div>
          </div>
        )}

        {/* COHERENCE */}
        {activeTab === "coherence" && (
          <div className="space-y-6">
            {showSummary && (
              <div
                className={`relative overflow-hidden p-6 rounded-2xl border backdrop-blur-sm ${
                  isLight
                    ? "bg-gradient-to-b from-[#6366f1]/[0.07] to-[#6366f1]/[0.02] border-[#6366f1]/30"
                    : "bg-gradient-to-b from-[#6366f1]/[0.10] to-[#6366f1]/[0.03] border-[#6366f1]/35"
                }`}
              >
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-6 -top-px h-px"
                  style={{ background: "linear-gradient(90deg, transparent 0%, rgba(99,102,241,0.7) 50%, transparent 100%)" }}
                />
                <p className={`text-[13.5px] leading-relaxed ${isLight ? "text-gray-800" : "text-[#ededed]"}`}>
                  <strong className={isLight ? "text-[#6366f1]" : "text-[#818cf8]"}>Cross-platform coherence</strong> is when the same insight emerges independently on different AI platforms without being copied. The UCW detects these by comparing semantic embeddings across 150K+ vectors from Claude, ChatGPT, and Grok. <span className={isLight ? "text-gray-900 font-semibold" : "text-white font-semibold"}>72 such moments</span> have been detected so far.
                </p>
              </div>
            )}

            {/* Coherence types */}
            <div className="grid md:grid-cols-3 gap-3">
              {COHERENCE_TYPES.map((ct) => (
                <div key={ct.type} className={`p-5 rounded-2xl ${cardClass}`}>
                  <p
                    className="text-[32px] font-bold leading-none tracking-tight"
                    style={{
                      fontFamily: monoFont,
                      background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      filter: "drop-shadow(0 2px 14px rgba(99,102,241,0.20))",
                    }}
                  >
                    {ct.count}
                  </p>
                  <p className={`text-[13px] font-semibold mt-3 ${isLight ? "text-gray-900" : "text-white"}`}>{ct.type}</p>
                  <p className={`text-[11.5px] mt-1.5 leading-snug ${isLight ? "text-gray-600" : "text-[#a3a3a3]"}`}>{ct.description}</p>
                  <div
                    className={`flex items-center gap-2 mt-4 pt-3 border-t ${
                      isLight ? "border-gray-200/70" : "border-white/[0.06]"
                    }`}
                  >
                    <span className={`text-[10.5px] uppercase tracking-[0.12em] ${isLight ? "text-gray-400" : "text-[#525252]"}`}>
                      Avg confidence
                    </span>
                    <span className="text-[11.5px] font-bold text-[#6366f1] tabular-nums" style={{ fontFamily: monoFont }}>
                      {(ct.confidence * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Innovation signals */}
            <div className={`p-6 rounded-2xl ${cardClass}`}>
              <h3 className={`text-[14px] font-semibold mb-5 tracking-tight ${isLight ? "text-gray-900" : "text-white"}`}>
                Innovation signals
              </h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                {[
                  { value: "11K", label: "Breakthrough potential events (6.7%)" },
                  { value: "15K", label: "Excellent quality events (0.8+ score)" },
                  { value: "7", label: "Active coherence arcs spanning weeks" },
                ].map((s) => (
                  <div key={s.label}>
                    <p
                      className="text-[26px] md:text-[28px] font-bold leading-none tracking-tight"
                      style={{
                        fontFamily: monoFont,
                        background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      {s.value}
                    </p>
                    <p className={`text-[10.5px] mt-2 leading-tight ${isLight ? "text-gray-600" : "text-[#a3a3a3]"}`}>{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* What it proves */}
            {showDeep && (
              <div
                className={`relative overflow-hidden p-6 rounded-2xl border backdrop-blur-sm ${
                  isLight ? "bg-white/85 border-[#6366f1]/30" : "bg-[#0a0a0a]/85 border-[#6366f1]/35"
                }`}
              >
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-6 -top-px h-px"
                  style={{ background: "linear-gradient(90deg, transparent 0%, rgba(99,102,241,0.7) 50%, transparent 100%)" }}
                />
                <h3 className={`text-[14px] font-semibold mb-4 tracking-tight ${isLight ? "text-gray-900" : "text-white"}`}>
                  What this proves
                </h3>
                <ul className={`space-y-3 text-[13.5px] leading-relaxed ${isLight ? "text-gray-700" : "text-[#ededed]"}`}>
                  {[
                    {
                      n: "01",
                      bold: "Distributed cognition is real.",
                      rest: "The same innovations emerge across platforms independently — verified by semantic similarity.",
                    },
                    {
                      n: "02",
                      bold: "AI usage can be sovereign.",
                      rest: "Every interaction is captured, owned, and analyzed by the user — not the platform.",
                    },
                    {
                      n: "03",
                      bold: "Cognitive data has structure.",
                      rest: "163K events with 3-layer semantic enrichment (Data + Light + Instinct) create a queryable cognitive graph.",
                    },
                  ].map((p) => (
                    <li key={p.n} className="flex items-start gap-3">
                      <span
                        className="text-[#6366f1] font-bold tabular-nums shrink-0 text-[11px] mt-1"
                        style={{ fontFamily: monoFont }}
                      >
                        {p.n}
                      </span>
                      <span>
                        <strong className={isLight ? "text-gray-900" : "text-white"}>{p.bold}</strong>{" "}
                        {p.rest}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
