"use client";

import { AnimatedSection } from "@/components/AnimatedSection";
import { StaggeredGrid } from "@/components/StaggeredGrid";
import { ProjectCard } from "@/components/ProjectCard";

interface ProjectsSectionProps {
  isLight: boolean;
}

export function ProjectsSection({ isLight }: ProjectsSectionProps) {
  return (
    <AnimatedSection id="projects" className="py-20 px-6 section-alt">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">AI-Directed Projects</h2>
          <p className={isLight ? "text-gray-600" : "text-[#737373]"}>
            Specified in English, built with AI coding tools, reviewed and tested. Applications, internal tools and prototypes.
          </p>
        </div>

        <StaggeredGrid className="space-y-6" itemSelector="> div">
          <ProjectCard
            name="OS-App"
            tagline="Sovereign AI Operating System"
            description="A prototype interface for voice, multi-model routing and agent workflows. Includes experimental consensus and context tools; no validated stress detection or speed improvement is claimed."
            tech={["Prompt Engineering", "Multi-Agent Orchestration", "Gemini API", "ElevenLabs"]}
            stats={{ stage: "Prototype", interface: "Voice", workflow: "Agents", review: "Human" }}
            github="https://github.com/Dicoangelo"
            demo="https://app.metaventionsai.com"
            isLight={isLight}
          />

          <ProjectCard
            name="ResearchGravity"
            tagline="Research Orchestration Platform"
            description="Research capture and retrieval tools with a FastAPI backend, Qdrant vector search and an MCP interface. Organizes source URLs and session notes for later review. Routing scores are internal heuristics."
            tech={["AI-Directed Build", "FastAPI", "Qdrant", "Vector Search"]}
            stats={{
              capture: "Notes",
              search: "Vectors",
              sources: "URLs",
              interface: "MCP",
            }}
            github="https://github.com/Dicoangelo/ResearchGravity"
            isLight={isLight}
          />

          <ProjectCard
            name="CareerCoachAntigravity"
            tagline="AI Career Governance System"
            description="Multi-agent hiring panel simulation. Generates role-specific feedback from AI personas representing different interview perspectives."
            tech={["Prompt Engineering", "Multi-Agent Orchestration", "Claude API", "MCP Protocol"]}
            stats={{ workflow: "Career", feedback: "AI-assisted", panel: "Simulated" }}
            github="https://github.com/Dicoangelo"
            demo="https://careers.metaventionsai.com"
            isLight={isLight}
          />
        </StaggeredGrid>

        {/* npm Packages */}
        <div className="mt-12">
          <h3 className="text-xl font-bold mb-6 text-center">Published npm Packages</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="card p-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">📦</span>
                <div>
                  <h4 className="font-bold">@metaventionsai/cpb-core</h4>
                  <span className={`text-sm ${isLight ? "text-gray-500" : "text-[#737373]"}`}>
                    v1.1.0
                  </span>
                </div>
              </div>
              <p className={`text-sm mb-4 ${isLight ? "text-gray-600" : "text-[#a3a3a3]"}`}>
                Cognitive Precision Bridge — multi-provider orchestration and configurable model routing. DQ scores are internal heuristics, not independently validated measures of decision quality.
              </p>
              <code
                className={`text-sm px-3 py-2 rounded block ${
                  isLight
                    ? "text-indigo-600 bg-indigo-50"
                    : "text-[#6366f1] bg-[#1a1a2e]"
                }`}
              >
                npm install @metaventionsai/cpb-core
              </code>
            </div>

            <div className="card p-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">📦</span>
                <div>
                  <h4 className="font-bold">@metaventionsai/voice-nexus</h4>
                  <span className={`text-sm ${isLight ? "text-gray-500" : "text-[#737373]"}`}>
                    v1.1.0
                  </span>
                </div>
              </div>
              <p className={`text-sm mb-4 ${isLight ? "text-gray-600" : "text-[#a3a3a3]"}`}>
                Multi-provider voice workflow connecting speech recognition, reasoning and speech synthesis, with configurable voice and conversation behavior.
              </p>
              <code
                className={`text-sm px-3 py-2 rounded block ${
                  isLight
                    ? "text-indigo-600 bg-indigo-50"
                    : "text-[#6366f1] bg-[#1a1a2e]"
                }`}
              >
                npm install @metaventionsai/voice-nexus
              </code>
            </div>
          </div>
        </div>

        {/* Metaventions AI Ecosystem */}
        <div className="mt-12">
          <h3 className="text-xl font-bold mb-2 text-center">Metaventions AI Ecosystem</h3>
          <p className={`text-sm text-center mb-6 ${isLight ? "text-gray-500" : "text-[#737373]"}`}>
            Public demos and project references; historical work links to the current overview.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {[
              {
                name: "Metaventions AI",
                url: "https://metaventionsai.com",
                description: "Independent AI projects and research tools",
                subdomain: "metaventionsai.com",
              },
              {
                name: "Portfolio",
                url: "https://dicoangelo.metaventionsai.com",
                description: "This site — career dossier, JD Fit Analyzer & AI chat",
                subdomain: "dicoangelo.",
              },
              {
                name: "OS-App",
                url: "https://app.metaventionsai.com",
                description: "Application prototype — voice and agent workflows",
                subdomain: "app.",
              },
              {
                name: "Frontier Alpha",
                url: "https://frontier-alpha.metaventionsai.com",
                description: "Experimental investment-research interface",
                subdomain: "frontier-alpha.",
              },
              {
                name: "Career Coach",
                url: "https://careers.metaventionsai.com",
                description: "AI career governance & hiring panel simulation",
                subdomain: "careers.",
              },
              {
                name: "Enterprise Deck",
                url: "https://dicoangelo.metaventionsai.com/showcase",
                description: "Historical enterprise concept — current project overview",
                subdomain: "Project overview",
              },
              {
                name: "Sovereign Deck",
                url: "https://dicoangelo.metaventionsai.com/showcase",
                description: "Historical architecture concept — current project overview",
                subdomain: "Project overview",
              },
              {
                name: "Paper to Production",
                url: "https://dicoangelo.metaventionsai.com/TECHNICAL_DOSSIER.md",
                description: "Implementations informed by other authors’ research",
                subdomain: "Technical overview",
              },
              {
                name: "Antigravity Demo",
                url: "https://dicoangelo.metaventionsai.com/showcase",
                description: "Archived implementation walkthrough in the showcase",
                subdomain: "Showcase archive",
              },
              {
                name: "Mass Fintech Hub",
                url: "https://dicoangelo.metaventionsai.com",
                description: "Mentoring context and verified professional profile",
                subdomain: "Professional profile",
              },
              {
                name: "Signature Event",
                url: "https://thesignatureevent.metaventionsai.com",
                description: "Published event website and recap",
                subdomain: "thesignatureevent.",
              },
              {
                name: "BXL Hospitality",
                url: "https://bxl.metaventionsai.com",
                description: "Hospitality website and membership information",
                subdomain: "bxl.",
              },
              {
                name: "FriendlyFace",
                url: "https://friendlyface.metaventionsai.com",
                description: "Collaborative prototype — AI evidence records and traceability",
                subdomain: "friendlyface.",
              },
              {
                name: "DQ Scoring",
                url: "https://arxiv.org/abs/2511.15755",
                description: "Philip Drammeh’s study withdrawn Aug 31, 2026; see source notice",
                subdomain: "Withdrawal notice",
              },
              {
                name: "Career Workflow Notes",
                url: "https://dicoangelo.metaventionsai.com/showcase",
                description: "Career workflow context in the public project overview",
                subdomain: "Project overview",
              },
              {
                name: "The Partnership Graph",
                url: "https://partnerships.metaventionsai.com",
                description: "Concept demo with illustrative partner data; no commercial deployment or affiliation",
                subdomain: "partnerships.",
              },
            ].map((item) => (
              <a
                key={item.name}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`p-4 rounded-xl border transition-all hover:border-[#6366f1] group ${
                  isLight
                    ? "bg-white border-gray-200 hover:shadow-md"
                    : "bg-[#0a0a0a] border-[#1f1f1f] hover:bg-[#111]"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-sm">{item.name}</span>
                  <svg
                    className={`w-4 h-4 transition-transform group-hover:translate-x-0.5 ${
                      isLight ? "text-gray-400" : "text-[#525252]"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </div>
                <p className={`text-xs mb-2 ${isLight ? "text-gray-500" : "text-[#737373]"}`}>
                  {item.description}
                </p>
                <span className={`text-xs font-mono ${isLight ? "text-indigo-500" : "text-[#6366f1]"}`}>
                  {item.subdomain}
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
