"use client";

import Link from "next/link";

interface DeepDivePivotProps {
  isLight: boolean;
}

interface PivotCard {
  href: string;
  kicker: string;
  title: string;
  body: string;
  tag: string;
  accent: string;
  external?: boolean;
}

const CARDS: PivotCard[] = [
  {
    href: "/showcase",
    kicker: "Gallery",
    title: "Production AI Showcase",
    body: "20 architecture screenshots across 5 production systems. Built, deployed, measured.",
    tag: "20 shots · 5 systems",
    accent: "#4f8fff",
  },
  {
    href: "/frontier-ops",
    kicker: "Self-score",
    title: "Frontier Ops Score",
    body: "Score yourself against Mollick's framework — five dimensions, evidence-based.",
    tag: "Live · 94/100",
    accent: "#10b981",
  },
  {
    href: "/see-more",
    kicker: "Architecture",
    title: "Technical Deep Dive",
    body: "9-system self-improving AI architecture. Interactive code, 3D network viz.",
    tag: "9 systems · 3D",
    accent: "#8b5cf6",
  },
  {
    href: "/ai-augmented",
    kicker: "Operator",
    title: "AI-Augmented Operator",
    body: "How a 3-person alliance team out-shipped 30-person ops orgs.",
    tag: "Operator profile",
    accent: "#ec4899",
  },
];

export function DeepDivePivot({ isLight }: DeepDivePivotProps) {
  return (
    <section id="deep-dive" aria-label="Go deeper" className="relative py-20 px-6">
      {/* Ambient brand wash */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 h-[55%] blur-3xl opacity-40"
        style={{
          background: isLight
            ? "radial-gradient(ellipse 50% 60% at 50% 50%, rgba(99,102,241,0.08), transparent 70%)"
            : "radial-gradient(ellipse 50% 60% at 50% 50%, rgba(99,102,241,0.14), transparent 70%)",
        }}
      />

      <div className="relative max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <span
            className={`inline-block text-[11px] font-semibold uppercase tracking-[0.2em] mb-4 ${
              isLight ? "text-[#6366f1]/80" : "text-[#818cf8]"
            }`}
          >
            Deeper Proof
          </span>
          <h2
            className={`text-3xl md:text-4xl font-bold tracking-tight ${
              isLight ? "text-gray-900" : "text-white"
            }`}
          >
            The headline above. The gallery below.
          </h2>
          <p
            className={`mt-4 max-w-xl mx-auto text-[14px] leading-relaxed ${
              isLight ? "text-gray-600" : "text-[#a3a3a3]"
            }`}
          >
            Receipts are summaries. Pick a thread and pull.
          </p>
        </div>

        {/* Tab/card grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {CARDS.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              {...(card.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className={`group relative overflow-hidden p-5 md:p-6 rounded-2xl border backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 ${
                isLight
                  ? "bg-white/70 border-gray-200/80 hover:border-[#6366f1]/40 hover:shadow-[0_12px_32px_-12px_rgba(99,102,241,0.20)]"
                  : "bg-white/[0.025] border-white/[0.07] hover:border-[#6366f1]/40 hover:bg-white/[0.04]"
              }`}
              style={{ ["--accent" as string]: card.accent } as React.CSSProperties}
            >
              {/* Hover glow */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: `radial-gradient(ellipse 80% 70% at 50% 0%, ${card.accent}1f, transparent 70%)` }}
              />
              {/* Top accent hairline */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-6 -top-px h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: `linear-gradient(90deg, transparent 0%, ${card.accent}b3 50%, transparent 100%)`,
                }}
              />

              <div className="relative flex flex-col h-full">
                <div
                  className={`text-[10px] font-semibold uppercase tracking-[0.16em] mb-2`}
                  style={{ color: card.accent }}
                >
                  {card.kicker}
                </div>
                <h3
                  className={`text-[15px] md:text-[16px] font-bold tracking-tight leading-tight mb-2 ${
                    isLight ? "text-gray-900" : "text-white"
                  }`}
                >
                  {card.title}
                </h3>
                <p
                  className={`text-[12.5px] leading-snug mb-4 flex-1 ${
                    isLight ? "text-gray-600" : "text-[#a3a3a3]"
                  }`}
                >
                  {card.body}
                </p>
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10.5px] font-medium tracking-tight px-2 py-0.5 rounded-md ${
                      isLight ? "bg-gray-100/80 text-gray-700" : "bg-white/[0.04] text-[#a3a3a3]"
                    }`}
                  >
                    {card.tag}
                  </span>
                  <span
                    className={`inline-flex items-center justify-center w-7 h-7 rounded-full transition-transform duration-200 group-hover:translate-x-0.5 ${
                      isLight ? "text-gray-400 group-hover:text-[#6366f1]" : "text-[#525252] group-hover:text-white"
                    }`}
                  >
                    <svg
                      aria-hidden="true"
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
