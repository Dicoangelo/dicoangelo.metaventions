"use client";

import { AnimatedSection } from "@/components/AnimatedSection";
import { WorldCard } from "@/components/WorldCard";
import { LocationBadge } from "@/components/LocationBadge";

interface ArenaSectionProps {
  isLight: boolean;
}

export function ArenaSection({ isLight }: ArenaSectionProps) {
  return (
    <AnimatedSection id="arena" className="py-20 px-6 section-alt">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">In The Arena</h2>
          <p className={`max-w-2xl mx-auto ${isLight ? 'text-gray-600' : 'text-[#737373]'}`}>
            150+ events across 8 cities over 7 years. Not just attending — building relationships,
            contributing to communities, and moving between worlds that rarely overlap.
          </p>
        </div>

        {/* Worlds I Move In */}
        <div className="grid md:grid-cols-4 gap-4 mb-12">
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

        {/* Key Relationships */}
        <div className="mb-12">
          <h3 className="text-xl font-bold mb-6 text-center">Circles & Access</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="card p-5">
              <h4 className="font-bold text-[#6366f1] mb-3">Investor Networks</h4>
              <ul className={`text-sm space-y-2 ${isLight ? 'text-gray-600' : 'text-[#a3a3a3]'}`}>
                <li>• <strong>CoinFund</strong> — Monthly attendee, Jake Brukhman&apos;s events</li>
                <li>• <strong>Pompliano</strong> — Invited to annual Christmas party</li>
                <li>• <strong>BitAngels</strong> — Angel investor network access</li>
                <li>• <strong>Maja Vujinovic</strong> — OGroup MD, FinTech/Digital Assets</li>
              </ul>
            </div>
            <div className="card p-5">
              <h4 className="font-bold text-[#6366f1] mb-3">Builder Communities</h4>
              <ul className={`text-sm space-y-2 ${isLight ? 'text-gray-600' : 'text-[#a3a3a3]'}`}>
                <li>• <strong>Detroit Blockchain</strong> — 15+ events, community pillar</li>
                <li>• <strong>AI Collective Detroit</strong> — Active builder participant</li>
                <li>• <strong>Web3 Toronto</strong> — Conference, Builder&apos;s Week regular</li>
                <li>• <strong>AI Friends Toronto</strong> — Research community</li>
              </ul>
            </div>
            <div className="card p-5">
              <h4 className="font-bold text-[#6366f1] mb-3">Exclusive Access</h4>
              <ul className={`text-sm space-y-2 ${isLight ? 'text-gray-600' : 'text-[#a3a3a3]'}`}>
                <li>• <strong>Tavern Cohorts</strong> — Application-only founder programs</li>
                <li>• <strong>Jeremy Piven events</strong> — Delmonico&apos;s, Legacy series</li>
                <li>• <strong>Hamptons</strong> — Summer investor circuit</li>
                <li>• <strong>Health Board Advisors</strong> — Mastermind member</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Geographic Footprint */}
        <div className="mb-12">
          <h3 className="text-xl font-bold mb-6 text-center">Geographic Presence</h3>
          <div className="flex flex-wrap justify-center gap-3">
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

        {/* What This Means */}
        <div className="card p-8 text-center max-w-3xl mx-auto">
          <h3 className="text-xl font-bold mb-4">What 150+ Events Actually Means</h3>
          <div className="grid md:grid-cols-2 gap-6 text-left text-sm">
            <div>
              <p className="text-[#6366f1] font-medium mb-2">Cross-Cultural Fluency</p>
              <p className={isLight ? 'text-gray-600' : 'text-[#a3a3a3]'}>Comfortable with artists, researchers, executives, investors, and founders. Can translate between worlds.</p>
            </div>
            <div>
              <p className="text-[#6366f1] font-medium mb-2">Early Adopter Pattern</p>
              <p className={isLight ? 'text-gray-600' : 'text-[#a3a3a3]'}>AI events in Feb 2023 — before the boom. Sees what&apos;s coming, positions early.</p>
            </div>
            <div>
              <p className="text-[#6366f1] font-medium mb-2">Relationship Over Transaction</p>
              <p className={isLight ? 'text-gray-600' : 'text-[#a3a3a3]'}>Same communities for 3+ years. Builder Series, CoinFund, Detroit Blockchain — consistent presence.</p>
            </div>
            <div>
              <p className="text-[#6366f1] font-medium mb-2">Community Builder</p>
              <p className={isLight ? 'text-gray-600' : 'text-[#a3a3a3]'}>Not just attending — contributing. Education workshops, local scene building, advocacy.</p>
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
