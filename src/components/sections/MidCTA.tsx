"use client";

import { useReadingDepth } from "@/components/ReadingDepthProvider";

interface MidCTAProps {
  isLight: boolean;
}

export function MidCTA({ isLight }: MidCTAProps) {
  const { depth } = useReadingDepth();
  const showSub = depth !== "skim";

  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToResume = () => {
    document.getElementById("resume")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section aria-label="Hire me" className="relative py-14 px-6">
      <div className="relative max-w-4xl mx-auto">
        <div
          className={`relative overflow-hidden rounded-2xl border backdrop-blur-xl p-8 md:p-12 text-center ${
            isLight
              ? "bg-white/70 border-gray-200/80 shadow-[0_24px_60px_-20px_rgba(15,23,42,0.18)]"
              : "bg-[#0a0a0a]/70 border-white/[0.07] shadow-[0_24px_60px_-20px_rgba(0,0,0,0.7)]"
          }`}
        >
          {/* Indigo glow blob top-right */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-16 -right-16 w-64 h-64 rounded-full blur-3xl opacity-70"
            style={{ background: "radial-gradient(circle, rgba(99,102,241,0.30) 0%, transparent 70%)" }}
          />
          {/* Violet glow blob bottom-left */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-16 -left-16 w-64 h-64 rounded-full blur-3xl opacity-50"
            style={{ background: "radial-gradient(circle, rgba(139,92,246,0.25) 0%, transparent 70%)" }}
          />

          <div className="relative">
            <span
              className={`inline-block text-[11px] font-semibold uppercase tracking-[0.2em] mb-4 ${
                isLight ? "text-[#6366f1]/80" : "text-[#818cf8]"
              }`}
            >
              Hire signal
            </span>

            <h2 className={`text-[28px] md:text-[36px] font-bold tracking-tight ${isLight ? "text-gray-900" : "text-white"}`}>
              Want this on your team?
            </h2>

            {showSub && (
              <p className={`mt-4 text-[15px] md:text-[16px] leading-relaxed max-w-xl mx-auto ${isLight ? "text-gray-600" : "text-[#a3a3a3]"}`}>
                20-minute intro call. Bring whichever questions matter — happy to walk through partner ops, AI infrastructure, or anything in between.
              </p>
            )}

            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                type="button"
                onClick={scrollToContact}
                className="group inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-br from-[#6366f1] to-[#5558e3] hover:from-[#5558e3] hover:to-[#4548c7] text-white text-[14px] font-semibold shadow-[0_8px_24px_-8px_rgba(99,102,241,0.55)] hover:shadow-[0_10px_28px_-8px_rgba(99,102,241,0.7)] transition-all duration-200 active:scale-[0.98]"
              >
                <svg
                  aria-hidden="true"
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                Book a 20-min intro
              </button>
              <button
                type="button"
                onClick={scrollToResume}
                className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-[14px] font-semibold transition-all duration-200 active:scale-[0.98] backdrop-blur-sm ${
                  isLight
                    ? "bg-white/80 border border-gray-200 text-gray-800 hover:bg-white"
                    : "bg-white/[0.04] border border-white/[0.08] text-white hover:bg-white/[0.07]"
                }`}
              >
                <svg
                  aria-hidden="true"
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Download resume
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
