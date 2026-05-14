"use client";

import { AnimatedSection } from "@/components/AnimatedSection";
import { WorldCard } from "@/components/WorldCard";
import { LocationBadge } from "@/components/LocationBadge";
import { useReadingDepth } from "@/components/ReadingDepthProvider";

interface ArenaSectionProps {
  isLight: boolean;
}

const CIRCLES = [
  {
    title: "Investor Networks",
    items: [
      { name: "CoinFund", note: "Attended several events, Jake Brukhman's network" },
      { name: "Pompliano", note: "Invited to annual Christmas party" },
      { name: "BitAngels", note: "Angel investor network access" },
      { name: "Maja Vujinovic", note: "OGroup MD, FinTech/Digital Assets" },
    ],
  },
  {
    title: "Builder Communities",
    items: [
      { name: "Detroit Blockchain", note: "15+ events, community leader" },
      { name: "AI Collective Detroit", note: "Active builder participant" },
      { name: "Web3 Toronto", note: "Conference, every few months" },
      { name: "AI Friends Toronto", note: "Research community" },
    ],
  },
  {
    title: "Exclusive Access",
    items: [
      { name: "Tavern Cohorts", note: "Application-only founder programs" },
      { name: "Jeremy Piven events", note: "Delmonico's, Legacy series" },
      { name: "Hamptons Legacy", note: "Invitation" },
      { name: "Health Board Advisors", note: "Mastermind member" },
    ],
  },
];

const MEANINGS = [
  { title: "Cross-Cultural Fluency", body: "Comfortable with artists, researchers, executives, investors, and founders. Can translate between worlds." },
  { title: "Early Adopter Pattern", body: "AI events in Feb 2023 — before the boom. Sees what's coming, positions early." },
  { title: "Relationship Over Transaction", body: "Same communities for 3+ years. Builder Series, Detroit Blockchain, Blockchain Collective — consistent presence." },
  { title: "Community Builder", body: "Not just attending — contributing. Education workshops, local scene building, advocacy." },
];

export function ArenaSection({ isLight }: ArenaSectionProps) {
  const { depth } = useReadingDepth();
  const showSummary = depth !== "skim";
  const showDeep = depth === "deep";

  return (
    <AnimatedSection id="arena" className="relative py-24 px-6">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 h-[60%] blur-3xl opacity-40"
        style={{
          background: isLight
            ? "radial-gradient(ellipse 50% 60% at 50% 50%, rgba(139,92,246,0.08), transparent 70%)"
            : "radial-gradient(ellipse 50% 60% at 50% 50%, rgba(139,92,246,0.14), transparent 70%)",
        }}
      />

      <div className="relative max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <span className={`inline-block text-[11px] font-semibold uppercase tracking-[0.2em] mb-4 ${isLight ? "text-[#6366f1]/80" : "text-[#818cf8]"}`}>
            Where I show up
          </span>
          <h2 className={`text-4xl md:text-5xl font-bold tracking-tight ${isLight ? "text-gray-900" : "text-white"}`}>
            In the arena.
          </h2>
          <p className={`mt-3 text-[13px] md:text-sm font-medium tracking-[0.14em] uppercase ${isLight ? "text-gray-500" : "text-[#a3a3a3]"}`}>
            Technology, Innovation &amp; Culture
          </p>
          {showSummary && (
            <p className={`mt-5 max-w-2xl mx-auto text-[15px] leading-relaxed ${isLight ? "text-gray-600" : "text-[#a3a3a3]"}`}>
              150+ events across 8 cities over 7 years. Not just attending — building relationships, contributing to communities, and moving between worlds that rarely overlap.
            </p>
          )}
        </div>

        {/* Worlds */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-16">
          <WorldCard
            title="Art & Culture"
            events="3 consecutive Art Basel Miami"
            insight="Where collectors, artists, VCs, and visionaries collide. Understanding taste, aesthetics, and the creative economy."
            highlights={["BitBasel", "Kaliner Gallery", "Superchief NFT"]}
            isLight={isLight}
          />
          <WorldCard
            title="Global Finance"
            events="F1: Miami, Monaco, Montreal"
            insight="The paddock, not the grandstand. International mobility and comfort in high-context environments."
            highlights={["Hamptons Legacy", "Family Office Forums", "Accredited Investor Roundtables"]}
            isLight={isLight}
          />
          <WorldCard
            title="Founder Networks"
            events="Builder Series NYC (monthly)"
            insight="Not transactional networking. Consistent presence, real relationships, mutual support over years."
            highlights={["Tavern Cohorts", "CoinFund Miami", "Startup Detroit"]}
            isLight={isLight}
          />
          <WorldCard
            title="Frontier Research"
            events="NeurIPS 2025"
            insight="Where papers become products. Proximity to the researchers pushing boundaries."
            highlights={["Thermo AI Meetup", "NVIDIA DGX Spark", "AWS Builder Loft"]}
            isLight={isLight}
          />
        </div>

        {/* Circles */}
        {showDeep && (
          <div className="mb-16">
            <h3 className={`text-center text-[12px] font-semibold uppercase tracking-[0.18em] mb-6 ${isLight ? "text-gray-500" : "text-[#737373]"}`}>
              Circles &amp; access
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {CIRCLES.map((circle) => (
                <div
                  key={circle.title}
                  className={`p-5 rounded-2xl border backdrop-blur-sm ${
                    isLight ? "bg-white/70 border-gray-200/80" : "bg-white/[0.025] border-white/[0.07]"
                  }`}
                >
                  <h4 className={`font-bold text-[13.5px] tracking-tight mb-3 ${isLight ? "text-[#6366f1]" : "text-[#818cf8]"}`}>
                    {circle.title}
                  </h4>
                  <ul className="space-y-2">
                    {circle.items.map((item) => (
                      <li
                        key={item.name}
                        className={`text-[12.5px] leading-snug flex items-start gap-2 ${isLight ? "text-gray-600" : "text-[#a3a3a3]"}`}
                      >
                        <span className={`mt-[7px] shrink-0 inline-block w-1 h-1 rounded-full ${isLight ? "bg-gray-400" : "bg-[#525252]"}`} />
                        <span>
                          <strong className={isLight ? "text-gray-900" : "text-white"}>{item.name}</strong>
                          <span className="ml-1">{item.note}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Geo */}
        {showSummary && (
          <div className="mb-16">
            <h3 className={`text-center text-[12px] font-semibold uppercase tracking-[0.18em] mb-6 ${isLight ? "text-gray-500" : "text-[#737373]"}`}>
              Geographic presence
            </h3>
            <div className="flex flex-wrap justify-center gap-2.5">
              <LocationBadge city="Miami" count="40+" role="Primary Hub" isLight={isLight} />
              <LocationBadge city="Detroit" count="20+" role="Community Leader" isLight={isLight} />
              <LocationBadge city="NYC" count="15+" role="Founder Network" isLight={isLight} />
              <LocationBadge city="Toronto" count="15+" role="Canadian Tech" isLight={isLight} />
              <LocationBadge city="San Francisco" count="5+" role="Enterprise AI" isLight={isLight} />
              <LocationBadge city="Monaco" count="F1" role="International" isLight={isLight} />
              <LocationBadge city="Hamptons" count="3+" role="Investor Circuit" isLight={isLight} />
              <LocationBadge city="Cannes" count="1" role="Global Summit" isLight={isLight} />
            </div>
          </div>
        )}

        {/* Meaning */}
        {showDeep && (
          <div
            className={`relative overflow-hidden p-8 rounded-2xl border backdrop-blur-sm max-w-4xl mx-auto ${
              isLight ? "bg-white/85 border-[#6366f1]/30" : "bg-[#0a0a0a]/85 border-[#6366f1]/35"
            }`}
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-8 -top-px h-px"
              style={{ background: "linear-gradient(90deg, transparent 0%, rgba(99,102,241,0.7) 50%, transparent 100%)" }}
            />
            <h3 className={`text-center text-[14px] font-semibold mb-6 tracking-tight ${isLight ? "text-gray-900" : "text-white"}`}>
              What 150+ events actually means
            </h3>
            <div className="grid md:grid-cols-2 gap-x-8 gap-y-5">
              {MEANINGS.map((m) => (
                <div key={m.title}>
                  <p className={`text-[10.5px] font-semibold uppercase tracking-[0.14em] mb-1.5 ${isLight ? "text-[#6366f1]/80" : "text-[#818cf8]"}`}>
                    {m.title}
                  </p>
                  <p className={`text-[13px] leading-relaxed ${isLight ? "text-gray-700" : "text-[#a3a3a3]"}`}>{m.body}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AnimatedSection>
  );
}
