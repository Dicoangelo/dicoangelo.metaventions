"use client";

import { AnimatedSection } from "@/components/AnimatedSection";
import { StaggeredGrid } from "@/components/StaggeredGrid";
import { MetricCard } from "@/components/MetricCard";
import { RevealOnScroll } from "@/components/RevealOnScroll";

interface ProofSectionProps {
  isLight: boolean;
}

export function ProofSection({ isLight }: ProofSectionProps) {
  return (
    <AnimatedSection
      id="proof"
      className={`py-20 px-6 bg-gradient-to-b ${
        isLight ? "from-transparent to-gray-50" : "from-transparent to-[#0f0f0f]"
      }`}
    >
      <div className="max-w-6xl mx-auto">
        <RevealOnScroll direction="up" threshold={0.2}>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Verifiable Proof</h2>
            <p className={isLight ? "text-gray-600" : "text-[#737373]"}>
              Every metric below has documentation. Click to see the evidence.
            </p>
          </div>
        </RevealOnScroll>

        <StaggeredGrid className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 mb-12">
          {/* Row 1 - Enterprise Metrics */}
          <MetricCard
            value="$800M+"
            label="TCV Processed"
            context="Registered through cloud marketplace infrastructure"
            proof="Operations lead (team of 3), 97% approval rate"
            isLight={isLight}
          />
          <MetricCard
            value="2,500+"
            label="Deal Registrations"
            context="600+ deals/quarter capacity"
            proof="97% approval rate, AWS ACE & Microsoft Partner Center"
            isLight={isLight}
          />
          <MetricCard
            value="90%"
            label="Automation Improvement"
            context="Registration time: 8 min → 30 sec"
            proof="Process automation at Contentsquare"
            isLight={isLight}
          />

          {/* Row 2 - Cloud Partnership Metrics */}
          <MetricCard
            value="$30M+"
            label="ACV Growth Support"
            context="Operations lead (team of 3) at Contentsquare"
            proof="2024 AWS & Microsoft partnership results"
            isLight={isLight}
          />
          <MetricCard
            value="40%"
            label="Cloud Attachment"
            context="Enterprise deals with cloud platforms"
            proof="Quarterly reports, 2x Microsoft POY"
            isLight={isLight}
          />
          <MetricCard
            value="50+"
            label="Dynamic Reports"
            context="6 platform integrations built"
            proof="Salesforce, AWS ACE, PartnerStack, Reveal, Suger, Crossbeam"
            isLight={isLight}
          />

          {/* Row 3 - Operational Excellence */}
          <MetricCard
            value="$222,750"
            label="Annual Savings"
            context="Rocket Mortgage Canada"
            proof="Process optimization documentation"
            isLight={isLight}
          />
          <MetricCard
            value="45"
            label="Team Size Led"
            context="90% satisfaction score"
            proof="Team management records"
            isLight={isLight}
          />
          <MetricCard
            value="98%"
            label="Accuracy Rate"
            context="Quality control metrics"
            proof="Performance reviews"
            isLight={isLight}
          />

          {/* Row 4 - Technical Metrics */}
          <MetricCard
            value="900K+"
            label="Lines of Code"
            context="Across 4 deployed systems"
            proof="Structura (85.5K), CareerCoach (26.6K), ResearchGravity (35.2K), Claude Infrastructure (262.4K)"
            isLight={isLight}
          />
          <MetricCard
            value="8+"
            label="Papers Implemented"
            context="arXiv research → production"
            proof="ACE (2511.15755), ARCHON (2601.09742), agent auctions (2511.13193)"
            isLight={isLight}
          />
          <MetricCard
            value="2"
            label="npm Packages"
            context="Published & maintained"
            proof="npmjs.com/@metaventionsai"
            isLight={isLight}
          />
        </StaggeredGrid>

        {/* Verification CTA */}
        <div className="text-center">
          <p className={`text-sm mb-4 ${isLight ? "text-gray-500" : "text-[#525252]"}`}>
            Skeptical? Good. Verify everything.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a
              href="https://github.com/Dicoangelo"
              target="_blank"
              className={`text-sm px-4 py-2 border rounded-lg transition-colors ${
                isLight
                  ? "border-gray-200 hover:bg-gray-100"
                  : "border-[#262626] hover:bg-[#141414]"
              }`}
            >
              GitHub Commits →
            </a>
            <a
              href="https://www.npmjs.com/org/metaventionsai"
              target="_blank"
              className={`text-sm px-4 py-2 border rounded-lg transition-colors ${
                isLight
                  ? "border-gray-200 hover:bg-gray-100"
                  : "border-[#262626] hover:bg-[#141414]"
              }`}
            >
              npm Packages →
            </a>
            <a
              href="https://app.metaventionsai.com"
              target="_blank"
              className={`text-sm px-4 py-2 border rounded-lg transition-colors ${
                isLight
                  ? "border-gray-200 hover:bg-gray-100"
                  : "border-[#262626] hover:bg-[#141414]"
              }`}
            >
              Live Demo →
            </a>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
