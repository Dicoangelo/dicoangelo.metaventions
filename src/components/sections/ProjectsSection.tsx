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
          <h2 className="text-3xl font-bold mb-4">Technical Projects</h2>
          <p className={isLight ? "text-gray-600" : "text-[#737373]"}>
            Open source. Live demos. Verifiable code.
          </p>
        </div>

        <StaggeredGrid className="space-y-6" itemSelector="> div">
          <ProjectCard
            name="OS-App"
            tagline="Sovereign AI Operating System"
            description="Voice-native interface with Gemini 2.0 Live, ElevenLabs TTS, biometric stress detection. Adaptive Consensus Engine (ACE) reducing consensus rounds by 50%. Recursive Language Model (RLM) for 100x context extension."
            tech={["React 19", "TypeScript", "Gemini API", "ElevenLabs"]}
            stats={{ loc: "33K+", components: 71, services: 62, coverage: "95%" }}
            github="https://github.com/Dicoangelo/OS-App"
            demo="https://app.metaventionsai.com"
            isLight={isLight}
          />

          <ProjectCard
            name="ResearchGravity"
            tagline="Research Orchestration Platform"
            description="FastAPI backend with Qdrant vector search (2,530 embeddings). Meta-Learning Engine with 87% error prevention accuracy. Cognitive Precision Bridge with 5-agent ensemble and complexity-based routing."
            tech={["Python", "FastAPI", "Qdrant", "SQLite"]}
            stats={{
              sessions: 114,
              findings: "2,530",
              urls: "8,935",
              accuracy: "87%",
            }}
            github="https://github.com/Dicoangelo/ResearchGravity"
            isLight={isLight}
          />

          <ProjectCard
            name="CareerCoachAntigravity"
            tagline="AI Career Governance System"
            description="Multi-agent hiring panel simulation. Generates role-specific feedback from AI personas representing different interview perspectives."
            tech={["Next.js 14", "TypeScript", "Zustand", "Claude API"]}
            stats={{ loc: "15K+", agents: 5, panels: "N/A" }}
            github="https://github.com/Dicoangelo/CareerCoachAntigravity"
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
                Cognitive Precision Bridge — AI orchestration with precision-aware routing. Multi-provider LLM support, DQ scoring, adaptive model selection.
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
                Universal multi-provider voice architecture. STT, reasoning, TTS pipeline. Echo elimination, sovereignty personality injection.
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
            Live products across the metaventionsai.com platform
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {[
              {
                name: "Metaventions AI",
                url: "https://www.metaventionsai.com",
                description: "Main platform — sovereign AI infrastructure",
                subdomain: "metaventionsai.com",
              },
              {
                name: "OS-App",
                url: "https://app.metaventionsai.com",
                description: "Agentic OS with voice, multi-agent orchestration",
                subdomain: "app.",
              },
              {
                name: "Career Coach",
                url: "https://careers.metaventionsai.com",
                description: "AI career governance & hiring panel simulation",
                subdomain: "careers.",
              },
              {
                name: "Frontier Alpha",
                url: "https://frontier-alpha.metaventionsai.com/landing",
                description: "Frontier research & alpha experiments",
                subdomain: "frontier-alpha.",
              },
              {
                name: "Pitch Deck",
                url: "https://deck.metaventionsai.com",
                description: "Metaventions AI pitch — UCW presentation",
                subdomain: "deck.",
              },
              {
                name: "Portfolio",
                url: "https://dicoangelo.metaventionsai.com",
                description: "This site — career dossier & live chat",
                subdomain: "dicoangelo.",
              },
              {
                name: "Signature Event",
                url: "https://thesignatureevent.metaventionsai.com",
                description: "Event marketing & RSVP platform",
                subdomain: "thesignatureevent.",
              },
              {
                name: "BXL Hospitality",
                url: "https://bxl.metaventionsai.com",
                description: "Luxury hospitality membership platform",
                subdomain: "bxl.",
              },
              {
                name: "FriendlyFace",
                url: "https://friendlyface.metaventionsai.com",
                description: "AI compliance proxy & forensic evidence",
                subdomain: "friendlyface.",
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
