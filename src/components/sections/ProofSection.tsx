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
    <AnimatedSection id="proof" className="relative py-20 px-6">
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
          <div className="text-center mb-10">
            <span
              className={`inline-block text-[11px] font-semibold uppercase tracking-[0.2em] mb-4 ${
                isLight ? "text-[#6366f1]/80" : "text-[#818cf8]"
              }`}
            >
              Experience in practice
            </span>
            <h2 className={`text-4xl md:text-5xl font-bold tracking-tight ${isLight ? "text-gray-900" : "text-white"}`}>
              Work, with context.
            </h2>
            {showSummary && (
              <p className={`mt-5 max-w-2xl mx-auto text-[15px] leading-relaxed ${isLight ? "text-gray-600" : "text-[#a3a3a3]"}`}>
                Current responsibilities, previous team outcomes and independent builds. Switch to Deep mode for attribution and scope.
              </p>
            )}
          </div>
        </RevealOnScroll>

        <StaggeredGrid className="grid grid-cols-2 md:grid-cols-3 gap-2.5 md:gap-3 mb-10">
          <MetricCard value="$800M+" label="Shared Pipeline TCV" context="Registered pipeline at Contentsquare, not closed sales" proof="Across a three-person cloud alliance team, May 2023–Nov 2025" isLight={isLight} />
          <MetricCard value="2,500+" label="Deal Registrations" context="Shared cloud alliance team activity at Contentsquare" proof="AWS ACE and Microsoft Partner Center; 97% approval rate across the team" isLight={isLight} />
          <MetricCard value="GTM" label="Workflow Automation" context="Partner systems and deal-registration workflows" proof="Dico contributed systems administration, connected workflows and enablement" isLight={isLight} />
          <MetricCard value="$30M+" label="Marketplace Program Revenue" context="Contentsquare program outcome over 30 months" proof="Dico contributed the operations work on a three-person alliance team" isLight={isLight} />
          <MetricCard value="CRM" label="Connected Workflows" context="Partner platforms, data and process handoffs" proof="Salesforce, AWS ACE, Microsoft Partner Center, Suger, PartnerStack, Crossbeam and Reveal" isLight={isLight} />
          <MetricCard value="Data" label="Partner Reporting" context="Reporting and enablement for regional teams" proof="Previous Contentsquare role: Sr. Partner Systems and Operations Specialist" isLight={isLight} />
          <MetricCard value="Ops" label="Product Operations" context="Rocket Mortgage Canada, formerly Edison Financial" proof="Supported Salesforce data, reporting, document quality and onboarding" isLight={isLight} />
          <MetricCard value="45" label="Agent Operation Supported" context="Operational support, not 45 direct reports" proof="Quality-control and evaluation workflows at Rocket Mortgage Canada" isLight={isLight} />
          <MetricCard value="QA" label="Quality Workflows" context="Document quality and operational evaluation" proof="Product Operations Specialist, June 2020–May 2023" isLight={isLight} />
          <MetricCard value="AI" label="AI-Assisted Builds" context="Concurrent independent work at Metaventions AI" proof="Specify systems, direct AI coding tools, then review, test and deploy the output" isLight={isLight} />
          <MetricCard value="R&D" label="Applied Research" context="Research capture, retrieval and implementation" proof="ResearchGravity and UCW; research papers are by other authors" isLight={isLight} />
          <MetricCard value="MCP" label="Tool Integrations" context="Connecting AI tools with useful application workflows" proof="Independent implementation work; selected projects and public links below" isLight={isLight} />
        </StaggeredGrid>

        {showDeep && (
          <div className="text-center">
            <p className={`text-[11.5px] uppercase tracking-[0.18em] font-semibold mb-4 ${isLight ? "text-[#6366f1]/70" : "text-[#818cf8]/80"}`}>
              Explore public work
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
