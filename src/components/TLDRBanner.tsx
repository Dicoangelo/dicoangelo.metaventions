"use client";

import { useTheme } from "@/components/ThemeProvider";

export default function TLDRBanner() {
  const { theme } = useTheme();
  const isLight = theme === "light";

  return (
    <section
      className={`relative py-10 px-6 border-t border-b backdrop-blur-sm ${
        isLight
          ? "border-[#6366f1]/15 bg-white/60"
          : "border-[#6366f1]/20 bg-[#0a0a0a]/60"
      }`}
    >
      {/* Hairline accent */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-px h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(99,102,241,0.5) 50%, transparent 100%)",
        }}
      />
      {/* Ambient wash */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          background: isLight
            ? "radial-gradient(ellipse 40% 80% at 80% 50%, rgba(139,92,246,0.06), transparent 70%), radial-gradient(ellipse 40% 80% at 20% 50%, rgba(99,102,241,0.06), transparent 70%)"
            : "radial-gradient(ellipse 40% 80% at 80% 50%, rgba(139,92,246,0.10), transparent 70%), radial-gradient(ellipse 40% 80% at 20% 50%, rgba(99,102,241,0.10), transparent 70%)",
        }}
      />

      <div className="relative max-w-5xl mx-auto">
        <div className="grid md:grid-cols-3 gap-6 md:gap-8 items-center">
          {/* Left: Main TLDR */}
          <div className="md:col-span-2">
            <span
              className={`inline-block text-[11px] font-semibold uppercase tracking-[0.2em] mb-3 ${
                isLight ? "text-[#6366f1]/80" : "text-[#818cf8]"
              }`}
            >
              TLDR
            </span>
            <p className={`text-[15.5px] md:text-[16px] leading-relaxed ${isLight ? "text-gray-900" : "text-white"}`}>
              Operator who scales partner programs. Builder who ships AI infrastructure.{" "}
              <span className={isLight ? "text-gray-600" : "text-[#a3a3a3]"}>
                Partner SA is the seat where those two things collide.
              </span>
            </p>
            <p className={`text-[13px] md:text-[13.5px] leading-relaxed mt-2.5 ${isLight ? "text-gray-500" : "text-[#737373]"}`}>
              The receipts are above, the chat is below — interrogate either.
            </p>
          </div>

          {/* Right: CTA */}
          <div className="flex flex-col items-stretch md:items-center gap-2">
            <a
              href="#contact"
              className="group inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-[13px] font-medium text-white transition-all duration-200 active:scale-[0.98] hover:shadow-[0_10px_24px_-8px_rgba(99,102,241,0.55)]"
              style={{ background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)" }}
            >
              Schedule call
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
            </a>
            <p className={`text-[11px] text-center ${isLight ? "text-gray-500" : "text-[#737373]"}`}>
              ~30 min technical conversation
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
