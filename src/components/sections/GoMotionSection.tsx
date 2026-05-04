"use client";

import { useReadingDepth } from "@/components/ReadingDepthProvider";

const SPECS = ["4 core AI agents", "13 sub-agents", "MCP server", "MEDDPICC scoring", "Crossbeam · SF · HubSpot · Slack"];
const DELIVERED = ["Technical specification", "Onboarding playbooks", "MEDDPICC instruction set", "Orchestration quickstart"];

export function GoMotionSection({ isLight }: { isLight: boolean }) {
  const { depth } = useReadingDepth();
  const showSummary = depth !== "skim";
  const showDeep = depth === "deep";

  return (
    <section className="relative py-16 px-6">
      {/* Ambient brand wash */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 h-[60%] blur-3xl opacity-40"
        style={{
          background: isLight
            ? "radial-gradient(ellipse 50% 50% at 50% 50%, rgba(99,102,241,0.10), transparent 70%)"
            : "radial-gradient(ellipse 50% 50% at 50% 50%, rgba(99,102,241,0.16), transparent 70%)",
        }}
      />

      <div className="relative max-w-4xl mx-auto">
        {/* Featured glass card */}
        <div
          className={`relative overflow-hidden rounded-2xl border backdrop-blur-xl ${
            isLight
              ? "bg-white/70 border-[#6366f1]/30 shadow-[0_24px_60px_-20px_rgba(99,102,241,0.30),0_8px_24px_-8px_rgba(15,23,42,0.10)]"
              : "bg-[#0a0a0a]/70 border-[#6366f1]/35 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.7),0_8px_24px_-8px_rgba(99,102,241,0.30)]"
          }`}
        >
          {/* Top hairline accent */}
          <div
            aria-hidden="true"
            className="absolute inset-x-8 -top-px h-px"
            style={{ background: "linear-gradient(90deg, transparent 0%, rgba(99,102,241,0.7) 50%, transparent 100%)" }}
          />

          <div className="p-7 md:p-9">
            {/* Top badge row */}
            <div className="flex items-center gap-2 mb-5">
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10.5px] font-semibold uppercase tracking-[0.16em] ${
                  isLight ? "bg-[#6366f1]/10 text-[#6366f1] border border-[#6366f1]/30" : "bg-[#6366f1]/15 text-[#818cf8] border border-[#6366f1]/30"
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#6366f1]" />
                Case Study
              </span>
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10.5px] font-semibold uppercase tracking-[0.14em] ${
                  isLight ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                }`}
              >
                Built live · 1 session
              </span>
            </div>

            {/* Title */}
            <h3 className={`text-[24px] md:text-[28px] font-bold tracking-tight leading-tight ${isLight ? "text-gray-900" : "text-white"}`}>
              GoMotion: Partner Sales Orchestration Platform
            </h3>

            {showSummary && (
              <p className={`mt-2 text-[14.5px] leading-relaxed ${isLight ? "text-gray-600" : "text-[#a3a3a3]"}`}>
                Architected live in a single Claude session with a partner manager. This is the Partner SA motion.
              </p>
            )}

            {showSummary && (
              <>
                <p className={`mt-7 text-[10.5px] font-semibold uppercase tracking-[0.16em] mb-3 ${isLight ? "text-gray-400" : "text-[#525252]"}`}>
                  System spec
                </p>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                  {SPECS.map((spec) => (
                    <div
                      key={spec}
                      className={`px-3 py-2.5 rounded-xl text-[11.5px] font-medium text-center backdrop-blur-sm ${
                        isLight
                          ? "bg-white/80 border border-gray-200/80 text-gray-700"
                          : "bg-white/[0.025] border border-white/[0.07] text-[#a3a3a3]"
                      }`}
                    >
                      {spec}
                    </div>
                  ))}
                </div>
              </>
            )}

            {showDeep && (
              <>
                <p className={`mt-7 text-[10.5px] font-semibold uppercase tracking-[0.16em] mb-3 ${isLight ? "text-gray-400" : "text-[#525252]"}`}>
                  Delivered live
                </p>
                <div className="flex flex-wrap gap-2">
                  {DELIVERED.map((d) => (
                    <span
                      key={d}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium backdrop-blur-sm ${
                        isLight ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                      }`}
                    >
                      <svg aria-hidden="true" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      {d}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
