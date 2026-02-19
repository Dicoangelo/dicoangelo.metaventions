"use client";

import { useState } from "react";

interface UCWInsightsSectionProps {
  isLight: boolean;
}

const COGNITIVE_STATS = {
  totalEvents: 163113,
  embeddings: 150742,
  sessions: 11072,
  coherenceMoments: 72,
  platforms: 6,
  coherenceArcs: 7,
};

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
  { type: "Signature Match", count: 2, confidence: 0.950, description: "Exact cognitive fingerprint on different platforms" },
];

const PEAK_HOURS = [
  { hour: "3 AM", events: 36184, highlight: true },
  { hour: "10 PM", events: 8152, highlight: false },
  { hour: "11 PM", events: 7208, highlight: false },
  { hour: "9 PM", events: 6775, highlight: false },
  { hour: "5 PM", events: 6490, highlight: false },
];

export function UCWInsightsSection({ isLight }: UCWInsightsSectionProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "cognition" | "coherence">("overview");

  const maxTopicCount = TOP_TOPICS[0].count;

  return (
    <section id="ucw-insights" className={`py-20 px-6 ${isLight ? "bg-white" : "bg-[#0a0a0a]"}`}>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#6366f1]/10 border border-[#6366f1]/30 mb-4">
            <svg aria-hidden="true" className="w-4 h-4 text-[#6366f1]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-semibold text-[#6366f1]">Universal Cognitive Wallet</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            What 163K AI Interactions Reveal
          </h2>
          <p className={`text-lg max-w-2xl mx-auto ${isLight ? "text-gray-600" : "text-[#a3a3a3]"}`}>
            Real data from the UCW — a system that captures every AI interaction across 6 platforms,
            generates semantic embeddings, and detects cross-platform coherence.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center gap-2 mb-8">
          {(["overview", "cognition", "coherence"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === tab
                  ? "bg-[#6366f1] text-white"
                  : isLight
                    ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    : "bg-[#1a1a1a] text-[#a3a3a3] hover:bg-[#262626]"
              }`}
            >
              {tab === "overview" ? "Scale" : tab === "cognition" ? "How I Think" : "Cross-Platform"}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { value: "163K+", label: "Cognitive Events", sub: "Across 6 platforms" },
                { value: "150K+", label: "Embeddings", sub: "Semantic vectors" },
                { value: "11K+", label: "Sessions", sub: "Tracked interactions" },
                { value: "72", label: "Coherence Moments", sub: "Cross-platform alignment" },
                { value: "7", label: "Active Arcs", sub: "Persistent thought threads" },
                { value: "6", label: "Platforms", sub: "Claude, ChatGPT, Grok+" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className={`p-5 rounded-xl border text-center ${
                    isLight ? "bg-gray-50 border-gray-200" : "bg-[#0f0f1f] border-[#262626]"
                  }`}
                >
                  <p className="text-2xl md:text-3xl font-bold text-[#6366f1] mb-1">{stat.value}</p>
                  <p className={`text-sm font-semibold ${isLight ? "text-gray-800" : "text-white"}`}>{stat.label}</p>
                  <p className={`text-xs mt-1 ${isLight ? "text-gray-500" : "text-[#737373]"}`}>{stat.sub}</p>
                </div>
              ))}
            </div>

            {/* Topic Distribution */}
            <div className={`p-6 rounded-xl border ${isLight ? "bg-gray-50 border-gray-200" : "bg-[#0f0f1f] border-[#262626]"}`}>
              <h3 className={`text-lg font-bold mb-4 ${isLight ? "text-gray-900" : "text-white"}`}>
                What I Think About Most
              </h3>
              <div className="space-y-3">
                {TOP_TOPICS.map((t) => (
                  <div key={t.topic} className="flex items-center gap-3">
                    <span className={`text-sm w-28 shrink-0 font-medium ${isLight ? "text-gray-700" : "text-[#ededed]"}`}>
                      {t.topic}
                    </span>
                    <div className="flex-1 h-6 rounded-full overflow-hidden bg-[#1a1a1a]/20">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] transition-all duration-700"
                        style={{ width: `${(t.count / maxTopicCount) * 100}%` }}
                      />
                    </div>
                    <span className={`text-xs w-14 text-right tabular-nums ${isLight ? "text-gray-500" : "text-[#737373]"}`}>
                      {(t.count / 1000).toFixed(1)}K
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "cognition" && (
          <div className="space-y-8">
            {/* Cognitive Mode Split */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className={`p-6 rounded-xl border ${isLight ? "bg-gray-50 border-gray-200" : "bg-[#0f0f1f] border-[#262626]"}`}>
                <h3 className={`text-lg font-bold mb-4 ${isLight ? "text-gray-900" : "text-white"}`}>
                  Cognitive Modes
                </h3>
                <div className="space-y-4">
                  {COGNITIVE_MODES.map((mode) => (
                    <div key={mode.label}>
                      <div className="flex justify-between mb-1">
                        <span className={`text-sm font-medium ${isLight ? "text-gray-700" : "text-[#ededed]"}`}>
                          {mode.label}
                        </span>
                        <span className="text-sm font-bold text-[#6366f1]">{mode.value}%</span>
                      </div>
                      <div className={`h-3 rounded-full overflow-hidden ${isLight ? "bg-gray-200" : "bg-[#1a1a1a]"}`}>
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${mode.value}%`, backgroundColor: mode.color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <p className={`text-xs mt-4 ${isLight ? "text-gray-500" : "text-[#737373]"}`}>
                  51.3% deep work means over half of all AI interactions are focused, production-oriented building sessions.
                </p>
              </div>

              <div className={`p-6 rounded-xl border ${isLight ? "bg-gray-50 border-gray-200" : "bg-[#0f0f1f] border-[#262626]"}`}>
                <h3 className={`text-lg font-bold mb-4 ${isLight ? "text-gray-900" : "text-white"}`}>
                  Intent Profile
                </h3>
                <div className="space-y-3">
                  {INTENT_PROFILE.map((item) => (
                    <div key={item.intent} className="flex items-center gap-3">
                      <span className="text-sm font-bold text-[#6366f1] w-12 tabular-nums">{item.pct}%</span>
                      <div className="flex-1">
                        <span className={`text-sm font-semibold ${isLight ? "text-gray-800" : "text-white"}`}>
                          {item.intent}
                        </span>
                        <span className={`text-xs ml-2 ${isLight ? "text-gray-500" : "text-[#737373]"}`}>
                          {item.description}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <p className={`text-xs mt-4 italic ${isLight ? "text-gray-500" : "text-[#737373]"}`}>
                  Cognitive fingerprint: Create &gt; Explore &gt; Search &gt; Analyze
                </p>
              </div>
            </div>

            {/* Peak Hours */}
            <div className={`p-6 rounded-xl border ${isLight ? "bg-gray-50 border-gray-200" : "bg-[#0f0f1f] border-[#262626]"}`}>
              <h3 className={`text-lg font-bold mb-4 ${isLight ? "text-gray-900" : "text-white"}`}>
                When I Work
              </h3>
              <div className="flex items-end gap-2 md:gap-4 justify-center h-40">
                {PEAK_HOURS.map((h) => {
                  const heightPct = (h.events / PEAK_HOURS[0].events) * 100;
                  return (
                    <div key={h.hour} className="flex flex-col items-center gap-2 flex-1 max-w-20">
                      <span className={`text-xs font-bold tabular-nums ${h.highlight ? "text-[#6366f1]" : isLight ? "text-gray-500" : "text-[#737373]"}`}>
                        {(h.events / 1000).toFixed(1)}K
                      </span>
                      <div
                        className={`w-full rounded-t-lg transition-all duration-500 ${
                          h.highlight
                            ? "bg-gradient-to-t from-[#6366f1] to-[#8b5cf6]"
                            : isLight
                              ? "bg-gray-300"
                              : "bg-[#262626]"
                        }`}
                        style={{ height: `${heightPct}%`, minHeight: 8 }}
                      />
                      <span className={`text-xs font-medium ${h.highlight ? "text-[#6366f1] font-bold" : isLight ? "text-gray-600" : "text-[#a3a3a3]"}`}>
                        {h.hour}
                      </span>
                    </div>
                  );
                })}
              </div>
              <p className={`text-center text-xs mt-4 ${isLight ? "text-gray-500" : "text-[#737373]"}`}>
                3 AM is peak output — 4.4x any other hour. 33.4% of all work happens between 2-5 AM.
              </p>
            </div>
          </div>
        )}

        {activeTab === "coherence" && (
          <div className="space-y-8">
            {/* Coherence Explanation */}
            <div className={`p-6 rounded-xl border ${isLight ? "bg-indigo-50 border-indigo-200" : "bg-indigo-950/20 border-indigo-500/20"}`}>
              <p className={`text-sm leading-relaxed ${isLight ? "text-indigo-900" : "text-indigo-200"}`}>
                <strong>Cross-platform coherence</strong> is when the same insight emerges independently on different AI platforms
                without being copied. The UCW detects these by comparing semantic embeddings across 150K+ vectors
                from Claude, ChatGPT, and Grok. 72 such moments have been detected so far.
              </p>
            </div>

            {/* Coherence Types */}
            <div className="grid md:grid-cols-3 gap-4">
              {COHERENCE_TYPES.map((ct) => (
                <div
                  key={ct.type}
                  className={`p-5 rounded-xl border ${isLight ? "bg-gray-50 border-gray-200" : "bg-[#0f0f1f] border-[#262626]"}`}
                >
                  <p className="text-3xl font-bold text-[#6366f1] mb-1">{ct.count}</p>
                  <p className={`text-sm font-bold mb-2 ${isLight ? "text-gray-800" : "text-white"}`}>{ct.type}</p>
                  <p className={`text-xs mb-3 ${isLight ? "text-gray-600" : "text-[#a3a3a3]"}`}>{ct.description}</p>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs ${isLight ? "text-gray-500" : "text-[#737373]"}`}>Avg confidence:</span>
                    <span className="text-xs font-bold text-[#6366f1]">{(ct.confidence * 100).toFixed(1)}%</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Innovation Signals */}
            <div className={`p-6 rounded-xl border ${isLight ? "bg-gray-50 border-gray-200" : "bg-[#0f0f1f] border-[#262626]"}`}>
              <h3 className={`text-lg font-bold mb-4 ${isLight ? "text-gray-900" : "text-white"}`}>
                Innovation Signals
              </h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-[#6366f1]">11K</p>
                  <p className={`text-xs ${isLight ? "text-gray-600" : "text-[#a3a3a3]"}`}>Breakthrough potential events (6.7%)</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#6366f1]">15K</p>
                  <p className={`text-xs ${isLight ? "text-gray-600" : "text-[#a3a3a3]"}`}>Excellent quality events (0.8+ score)</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#6366f1]">7</p>
                  <p className={`text-xs ${isLight ? "text-gray-600" : "text-[#a3a3a3]"}`}>Active coherence arcs spanning weeks</p>
                </div>
              </div>
            </div>

            {/* What it proves */}
            <div className={`p-6 rounded-xl border-2 border-[#6366f1]/30 ${isLight ? "bg-white" : "bg-[#0a0a1a]"}`}>
              <h3 className={`text-lg font-bold mb-3 ${isLight ? "text-gray-900" : "text-white"}`}>
                What This Proves
              </h3>
              <ul className={`space-y-2 text-sm ${isLight ? "text-gray-700" : "text-[#ededed]"}`}>
                <li className="flex items-start gap-2">
                  <span className="text-[#6366f1] mt-0.5 shrink-0">1.</span>
                  <span><strong>Distributed cognition is real.</strong> The same innovations emerge across platforms independently — verified by semantic similarity.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#6366f1] mt-0.5 shrink-0">2.</span>
                  <span><strong>AI usage can be sovereign.</strong> Every interaction is captured, owned, and analyzed by the user — not the platform.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#6366f1] mt-0.5 shrink-0">3.</span>
                  <span><strong>Cognitive data has structure.</strong> 163K events with 3-layer semantic enrichment (Data + Light + Instinct) create a queryable cognitive graph.</span>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
