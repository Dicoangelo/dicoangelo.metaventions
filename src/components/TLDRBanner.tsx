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
              Operated cloud ops on the 3-person alliance team at Contentsquare. Program scaled{" "}
              <span
                className="font-bold tabular-nums"
                style={{
                  fontFamily: "var(--font-jetbrains-mono, 'JetBrains Mono', ui-monospace, monospace)",
                  background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                $0 → $30M+
              </span>{" "}
              across AWS and Microsoft, $800M+ in registered deals, 2x MSFT Partner of the Year — I ran the operational layer (CRM, automation, dashboards) that turned strategy into velocity. At the same time: specified 58 production MCP tools in English, directed Claude Code / Codex / Gemini to build them, shipped multi-agent infrastructure processing 163K+ events on Claude. Not sequentially — <em className="not-italic font-semibold">simultaneously</em>.
            </p>
            <p className={`text-[14px] md:text-[14.5px] leading-relaxed mt-3 ${isLight ? "text-gray-700" : "text-[#a3a3a3]"}`}>
              I&rsquo;m the operations expert who is also literally at the frontier, building. Partner SA is exactly where those two things collide.
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
