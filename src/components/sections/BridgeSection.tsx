"use client";

import { useReadingDepth } from "@/components/ReadingDepthProvider";

interface BridgeColumn {
  title: string;
  kicker: string;
  Icon: () => React.ReactElement;
  items: string[];
  accent: boolean;
}

const HandshakeIcon = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 17l-5-5 7-7 4 4-1.5 1.5" />
    <path d="M16 12l3 3-3 3-3-3" />
    <path d="M8 21l-3-3 7-7" />
    <path d="M14 7l2-2 3 3-2 2" />
  </svg>
);

const BridgeIcon = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12h20" />
    <path d="M5 12V7a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v5" />
    <path d="M5 12v6" />
    <path d="M19 12v6" />
    <path d="M9 12v6" />
    <path d="M15 12v6" />
    <path d="M12 4v8" />
  </svg>
);

const ChipIcon = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="6" y="6" width="12" height="12" rx="1.5" />
    <path d="M9 9h6v6H9z" />
    <path d="M3 10v4M3 7v0M3 17v0M21 10v4M21 7v0M21 17v0M10 3h4M7 3v0M17 3v0M10 21h4M7 21v0M17 21v0" />
  </svg>
);

const columns: BridgeColumn[] = [
  {
    title: "Partner Side",
    kicker: "Co-sell motion",
    Icon: HandshakeIcon,
    items: [
      "$800M+ deal registration engine",
      "Co-sell motion with AWS & Microsoft",
      "6 CRM platform integrations",
      "GSI and cloud partner operations",
      "2x Microsoft Partner of the Year",
    ],
    accent: false,
  },
  {
    title: "The Bridge",
    kicker: "Where it compounds",
    Icon: BridgeIcon,
    items: [
      "Partnership Graph: partner ops as queryable intelligence",
      "GenAI enablement materials for partner teams",
      "Business case development from partner pain",
      "Technical ↔ business translation",
      "From co-sell friction to AI-native motion",
    ],
    accent: true,
  },
  {
    title: "AI Side",
    kicker: "What I shipped",
    Icon: ChipIcon,
    items: [
      "58 MCP tools built on Claude",
      "Multi-agent orchestration framework",
      "4,035 Claude sessions",
      "20+ deployed AI systems, 900K+ LOC",
      "Partnership Graph + Frontier Alpha + UCW",
    ],
    accent: false,
  },
];

export function BridgeSection({ isLight }: { isLight: boolean }) {
  const { depth } = useReadingDepth();
  const showSubtitle = depth !== "skim";
  const showItems = depth !== "skim";

  return (
    <section className="relative py-20 px-6">
      {/* Ambient brand wash — sets the section apart without using a card */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 h-[60%] blur-3xl opacity-50"
        style={{
          background: isLight
            ? "radial-gradient(ellipse 50% 60% at 50% 50%, rgba(99,102,241,0.10), transparent 70%)"
            : "radial-gradient(ellipse 50% 60% at 50% 50%, rgba(99,102,241,0.16), transparent 70%)",
        }}
      />

      <div className="relative max-w-5xl mx-auto">
        <div className={`text-center ${showSubtitle ? "mb-14" : "mb-10"}`}>
          <span
            className={`inline-block text-[11px] font-semibold uppercase tracking-[0.2em] mb-4 ${
              isLight ? "text-[#6366f1]/80" : "text-[#818cf8]"
            }`}
          >
            Both sides of the table
          </span>
          <h2 className={`text-4xl md:text-5xl font-bold tracking-tight ${isLight ? "text-gray-900" : "text-white"}`}>
            I speak both languages.
          </h2>
          {showSubtitle && (
            <p className={`mt-5 max-w-2xl mx-auto text-[16px] leading-relaxed ${isLight ? "text-gray-600" : "text-[#a3a3a3]"}`}>
              Most people live on one side. Partner ops people understand business but not the AI stack. AI builders understand the tech but not the co-sell motion. I&apos;ve operated both.
            </p>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-5 md:gap-4">
          {columns.map((col) => {
            const { Icon } = col;
            return (
              <div
                key={col.title}
                className={`group relative p-6 rounded-2xl border transition-all duration-300 backdrop-blur-sm ${
                  col.accent
                    ? isLight
                      ? "bg-gradient-to-b from-[#6366f1]/[0.06] to-[#6366f1]/[0.02] border-[#6366f1]/40 shadow-[0_8px_30px_-10px_rgba(99,102,241,0.35)]"
                      : "bg-gradient-to-b from-[#6366f1]/[0.10] to-[#6366f1]/[0.03] border-[#6366f1]/45 shadow-[0_8px_30px_-10px_rgba(99,102,241,0.45)]"
                    : isLight
                      ? "bg-white/70 border-gray-200/80 hover:border-gray-300 hover:-translate-y-0.5"
                      : "bg-white/[0.025] border-white/[0.07] hover:border-white/[0.12] hover:-translate-y-0.5"
                }`}
              >
                {/* Accent glow on the bridge column */}
                {col.accent && (
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-6 -top-px h-px"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent 0%, rgba(99,102,241,0.7) 50%, transparent 100%)",
                    }}
                  />
                )}

                {/* Icon block */}
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-all ${
                    col.accent
                      ? "bg-gradient-to-br from-[#6366f1] to-[#5558e3] text-white shadow-[0_4px_14px_-4px_rgba(99,102,241,0.45)]"
                      : isLight
                        ? "bg-gray-100 text-gray-700 group-hover:bg-gray-200"
                        : "bg-white/[0.05] text-[#a3a3a3] group-hover:bg-white/[0.08] group-hover:text-white"
                  }`}
                >
                  <span className="w-5 h-5 block">
                    <Icon />
                  </span>
                </div>

                {/* Kicker */}
                <p
                  className={`text-[10.5px] font-semibold uppercase tracking-[0.16em] mb-1.5 ${
                    col.accent
                      ? isLight
                        ? "text-[#6366f1]/80"
                        : "text-[#818cf8]"
                      : isLight
                        ? "text-gray-400"
                        : "text-[#525252]"
                  }`}
                >
                  {col.kicker}
                </p>

                <h3
                  className={`text-[18px] font-bold tracking-tight ${showItems ? "mb-4" : ""} ${
                    col.accent
                      ? isLight
                        ? "text-[#6366f1]"
                        : "text-[#818cf8]"
                      : isLight
                        ? "text-gray-900"
                        : "text-white"
                  }`}
                >
                  {col.title}
                </h3>

                {showItems && (
                  <ul className="space-y-2">
                    {col.items.map((item) => (
                      <li
                        key={item}
                        className={`text-[13px] leading-snug flex items-start gap-2 ${
                          isLight ? "text-gray-700" : "text-[#a3a3a3]"
                        }`}
                      >
                        <span
                          className={`mt-[7px] shrink-0 inline-block w-1 h-1 rounded-full ${
                            col.accent
                              ? "bg-[#6366f1]"
                              : isLight
                                ? "bg-gray-400"
                                : "bg-[#525252]"
                          }`}
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
