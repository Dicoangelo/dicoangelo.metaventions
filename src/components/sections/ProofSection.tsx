"use client";

import { AnimatedSection } from "@/components/AnimatedSection";
import { StaggeredGrid } from "@/components/StaggeredGrid";
import { MetricCard } from "@/components/MetricCard";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { useReadingDepth } from "@/components/ReadingDepthProvider";

interface ProofSectionProps {
  isLight: boolean;
}

const VERIFY_LINKS = [
  { label: "GitHub commits", href: "https://github.com/Dicoangelo" },
  { label: "npm packages", href: "https://www.npmjs.com/org/metaventionsai" },
  { label: "Live demo", href: "https://app.metaventionsai.com" },
];

export function ProofSection({ isLight }: ProofSectionProps) {
  const { depth } = useReadingDepth();
  const showSummary = depth !== "skim";
  const showDeep = depth === "deep";

  return (
    <AnimatedSection id="proof" className="relative py-24 px-6">
      {/* Ambient brand wash */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 h-[60%] blur-3xl opacity-40"
        style={{
          background: isLight
            ? "radial-gradient(ellipse 50% 60% at 50% 50%, rgba(99,102,241,0.10), transparent 70%)"
            : "radial-gradient(ellipse 50% 60% at 50% 50%, rgba(99,102,241,0.16), transparent 70%)",
        }}
      />

      <div className="relative max-w-6xl mx-auto">
        <RevealOnScroll direction="up" threshold={0.2}>
          <div className="text-center mb-14">
            <span
              className={`inline-block text-[11px] font-semibold uppercase tracking-[0.2em] mb-4 ${
                isLight ? "text-[#6366f1]/80" : "text-[#818cf8]"
              }`}
            >
              Receipts
            </span>
            <h2 className={`text-4xl md:text-5xl font-bold tracking-tight ${isLight ? "text-gray-900" : "text-white"}`}>
              Verifiable proof.
            </h2>
            {showSummary && (
              <p className={`mt-5 max-w-2xl mx-auto text-[15px] leading-relaxed ${isLight ? "text-gray-600" : "text-[#a3a3a3]"}`}>
                Every metric below is documented. Hover for context, switch to Deep mode for the full trail.
              </p>
            )}
          </div>
        </RevealOnScroll>

        <StaggeredGrid className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-14">
          <MetricCard value="$800M+" label="TCV Processed" context="Registered through cloud marketplace infrastructure" proof="Operations on 3-person alliance team, 97% approval rate" isLight={isLight} />
          <MetricCard value="2,500+" label="Deal Registrations" context="600+ deals/quarter capacity" proof="97% approval rate, AWS ACE & Microsoft Partner Center" isLight={isLight} />
          <MetricCard value="90%" label="Automation Improvement" context="Registration time: 8 min → 30 sec" proof="Process automation at Contentsquare" isLight={isLight} />
          <MetricCard value="$30M+" label="Cloud Alliance Revenue" context="Operations on 3-person alliance team; ran the operational layer (CRM, automation, dashboards)" proof="AWS + Microsoft, $0 → $30M+ in 30 months" isLight={isLight} />
          <MetricCard value="40%" label="Cloud Attachment" context="Enterprise deals with cloud platforms" proof="Quarterly reports, 2x Microsoft POY" isLight={isLight} />
          <MetricCard value="50+" label="Dynamic Reports" context="6 platform integrations built" proof="Salesforce, AWS ACE, PartnerStack, Reveal, Suger, Crossbeam" isLight={isLight} />
          <MetricCard value="$222,750" label="Annual Savings" context="Rocket Mortgage Canada" proof="Process optimization documentation" isLight={isLight} />
          <MetricCard value="45" label="Team Size Led" context="90% satisfaction score" proof="Team management records" isLight={isLight} />
          <MetricCard value="98%" label="Accuracy Rate" context="Quality control metrics" proof="Performance reviews" isLight={isLight} />
          <MetricCard value="900K+" label="Lines of AI-Directed Code" context="Across 20+ shipped systems, 44 repos" proof="Structura (85.5K), CareerCoach (26.6K), ResearchGravity (35.2K), Claude Infra (262.4K), plus 16+ production systems" isLight={isLight} />
          <MetricCard value="8+" label="Papers Implemented" context="arXiv research → production" proof="ACE (2511.15755), ARCHON (2601.09742), agent auctions (2511.13193)" isLight={isLight} />
          <MetricCard value="2" label="npm Packages" context="Published & maintained" proof="npmjs.com/@metaventionsai" isLight={isLight} />
        </StaggeredGrid>

        {showDeep && (
          <div className="text-center">
            <p className={`text-[12.5px] uppercase tracking-[0.16em] font-semibold mb-5 ${isLight ? "text-gray-500" : "text-[#737373]"}`}>
              Want to verify? Here&rsquo;s the trail.
            </p>
            <div className="flex gap-2.5 justify-center flex-wrap">
              {VERIFY_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group inline-flex items-center gap-2 text-[13px] font-medium px-4 py-2.5 rounded-xl border backdrop-blur-sm transition-all duration-200 active:scale-[0.98] ${
                    isLight
                      ? "bg-white/70 border-gray-200/80 hover:border-[#6366f1]/40 hover:bg-white text-gray-700 hover:text-[#6366f1]"
                      : "bg-white/[0.04] border-white/[0.08] hover:border-[#6366f1]/40 hover:bg-white/[0.07] text-[#a3a3a3] hover:text-white"
                  }`}
                >
                  {link.label}
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
              ))}
            </div>
          </div>
        )}
      </div>
    </AnimatedSection>
  );
}
