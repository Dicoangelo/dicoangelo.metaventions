"use client";

import { useState } from "react";
import DepthSection from "./DepthSection";

interface Project {
  name: string;
  tagline: string;
  description: string;
  metrics: { label: string; value: string }[];
  techStack: string[];
  papers: string[];
  github: string;
  demo?: string;
  loc: string;
}

interface ProjectShowcaseProps {
  isLight: boolean;
}

const projects: Project[] = [
  {
    name: "Partnership Graph (Concept Demo)",
    tagline: "Hypothetical partner-intelligence layer, custom-built concept demo",
    description: "A custom-built concept demo (not a launched product): an MCP-native partner-intelligence layer with 13 tools, AI scoring, and a React 19 dashboard on the UCW substrate. Designed to complement partner-tech like Crossbeam, Reveal, and PartnerStack, not replace them. All partner data shown is illustrative sample data; the listed partners are unaffiliated.",
    metrics: [
      { label: "MCP Tools", value: "13" },
      { label: "Surface", value: "Dashboard + MCP" },
      { label: "Substrate", value: "UCW" },
      { label: "Stack", value: "React 19" }
    ],
    techStack: ["Prompt Engineering", "MCP Protocol", "AI Scoring", "Multi-Agent Orchestration"],
    papers: [
      "Partnership intelligence as a category",
      "MCP-native B2B tooling patterns",
      "Cognitive equity for relationship graphs"
    ],
    github: "https://github.com/Dicoangelo/partnership-ai-orchestration",
    demo: "https://partnerships.metaventionsai.com",
    loc: "Concept"
  },
  {
    name: "SBC-AutoOps / SBC Inspector",
    tagline: "Pre-Deploy Validation for Session Border Controllers",
    description: "Reads any SBC vendor's config before deploy and tells you, in plain English, exactly what will break. Local-first and air-gapped: raw configs never leave your environment. Ships an 11-tool SBC Inspector MCP that puts the same deterministic checks on an agent surface.",
    metrics: [
      { label: "Vendor Parsers", value: "5" },
      { label: "Validation Domains", value: "8" },
      { label: "Tests", value: "282" },
      { label: "MCP Tools", value: "11" }
    ],
    techStack: ["AI-Directed Build", "MCP Protocol", "Deterministic Validation", "Air-Gapped"],
    papers: [
      "Deterministic pre-deployment config validation",
      "Multi-vendor SBC normalization",
      "Agent-surfaced infrastructure inspection (MCP)"
    ],
    github: "https://github.com/Dicoangelo/sbc-validator",
    demo: "https://sbcvalidator.metaventionsai.com",
    loc: "v0.20.0"
  },
  {
    name: "Frontier Alpha",
    tagline: "Cognitive Factor Intelligence Platform",
    description: "AI-powered portfolio optimization with 80+ factors, episodic learning via CVRF, and explainable recommendations. Brings sovereign cognitive infrastructure into quantitative investment workflows.",
    metrics: [
      { label: "Factors", value: "80+" },
      { label: "Learning", value: "Episodic (CVRF)" },
      { label: "Output", value: "Explainable" },
      { label: "Domain", value: "Portfolio Opt" }
    ],
    techStack: ["AI-Directed Build", "Factor Models", "Episodic Memory", "CVRF"],
    papers: [
      "CVRF episodic learning",
      "Multi-factor portfolio construction",
      "Explainable AI for investment decisions"
    ],
    github: "https://github.com/Dicoangelo/frontier-alpha",
    demo: "https://frontier-alpha.metaventionsai.com",
    loc: "v1.13"
  },
  {
    name: "CareerCoach Antigravity",
    tagline: "Sovereign Career Intelligence",
    description: "AI-driven career operating system: eligibility-gate-first job matching, warm-line outreach, ATS-aware tailoring, and parallel-session coordination. Reclaims agency in an algorithmic hiring world.",
    metrics: [
      { label: "Tests", value: "3,227 passing" },
      { label: "Stack", value: "Next.js 16" },
      { label: "Tier", value: "$9 Single-Shot" },
      { label: "Surface", value: "Live" }
    ],
    techStack: ["Next.js 16", "React 19", "Tailwind 4", "TypeScript", "Stripe", "Prompt Engineering"],
    papers: [
      "Eligibility-gate-first hiring funnels",
      "Warm-line conversion vs cold apply",
      "ATS keyword fidelity in resume tailoring"
    ],
    github: "https://github.com/Dicoangelo/CareerCoachAntigravity",
    demo: "https://careers.metaventionsai.com",
    loc: "v2.6"
  },
  {
    name: "FriendlyFace",
    tagline: "Forensic Evidence Generation Platform",
    description: "Forensic-friendly facial recognition with on-chain evidence sealing. Implements Mohammed's ICDF2C 2024 schema with SOTA 2026 components. ForensicSeal is the core invention, compliance proxy the business model.",
    metrics: [
      { label: "Architecture", value: "Layer 3: Blockchain" },
      { label: "Schema", value: "ICDF2C 2024" },
      { label: "Mode", value: "Demo-ready" },
      { label: "Core", value: "ForensicSeal" }
    ],
    techStack: ["Prompt Engineering", "Blockchain", "Computer Vision", "ForensicSeal"],
    papers: [
      "Mohammed et al. ICDF2C 2024: Forensic FR schema",
      "On-chain evidence sealing patterns",
      "Compliance-by-proxy business model"
    ],
    github: "https://github.com/Dicoangelo/FriendlyFace",
    demo: "https://friendlyface.metaventionsai.com",
    loc: "Demo-ready"
  },
  {
    name: "ACE",
    tagline: "Adaptive Consensus Engine",
    description: "Multi-agent voting system achieving consensus through adaptive thresholds, DQ-weighted voting, and auction-based agent selection.",
    metrics: [
      { label: "Actionability", value: "100% vs 1.7% baseline" },
      { label: "Token Reduction", value: "300x" },
      { label: "Consensus Rounds", value: "50% faster" },
      { label: "Test Coverage", value: "95%" }
    ],
    techStack: ["AI-Directed Build", "Multi-Agent Systems", "DQ-Weighted Voting", "Vitest"],
    papers: [
      "arXiv:2511.15755 - DQ Scoring Framework",
      "arXiv:2511.13193 - Agent Auctions (DALA)",
      "arXiv:2508.17536 - Voting vs Debate"
    ],
    github: "https://github.com/Dicoangelo/OS-App/blob/main/services/adaptiveConsensus.ts",
    demo: "https://app.metaventionsai.com",
    loc: "1,462 LOC"
  },
  {
    name: "ARCHON",
    tagline: "Meta-Orchestrator",
    description: "Autonomous AI coordinator that manages 7 subsystems to achieve user goals with minimal human intervention. Complexity-adaptive routing across 4 LLM providers.",
    metrics: [
      { label: "Subsystems", value: "7 integrated" },
      { label: "Time-to-Solution", value: "40% faster" },
      { label: "Providers", value: "4 LLMs" },
      { label: "Budget Management", value: "Token-aware" }
    ],
    techStack: ["Prompt Engineering", "Multi-Provider Routing", "Multi-Agent Orchestration"],
    papers: [
      "arXiv:2601.09742 - Adaptive Orchestration",
      "arXiv:2506.12508 - AgentOrchestra",
      "arXiv:2508.07407 - Self-Evolving Agents"
    ],
    github: "https://github.com/Dicoangelo/OS-App/blob/main/services/archon/index.ts",
    demo: "https://app.metaventionsai.com",
    loc: "1,280 LOC"
  },
  {
    name: "META-VENGINE",
    tagline: "Self-Improving AI Infrastructure",
    description: "9-system bidirectional co-evolution framework. The infrastructure that improves itself through feedback loops and pattern recognition.",
    metrics: [
      { label: "Auto-Fix Rate", value: "70%" },
      { label: "Error Patterns", value: "700+" },
      { label: "DQ Score Avg", value: "0.889" },
      { label: "Systems", value: "9 integrated" }
    ],
    techStack: ["AI-Directed Build", "Pattern Recognition", "Self-Healing Systems", "SQLite"],
    papers: [
      "Self-healing systems",
      "Feedback loop optimization",
      "Cognitive pattern learning"
    ],
    github: "https://github.com/Dicoangelo",
    loc: "51K+ LOC"
  },
  {
    name: "UCW",
    tagline: "Universal Cognitive Wallet",
    description: "Sovereign cross-platform cognitive capture system. Processes 163K+ events from 5 AI platforms into PostgreSQL with pgvector. 12.15M knowledge graph edges, 7.1K memory items, 270K+ interactions.",
    metrics: [
      { label: "Graph Edges", value: "12.15M" },
      { label: "Memory Items", value: "7,130" },
      { label: "Platforms", value: "5 integrated" },
      { label: "Interactions", value: "270K+" }
    ],
    techStack: ["AI-Directed Build", "PostgreSQL", "pgvector", "MCP Protocol"],
    papers: [
      "Cognitive equity thesis",
      "Cross-platform capture architecture",
      "Vector similarity search at scale"
    ],
    github: "https://github.com/Dicoangelo/ucw",
    loc: "900K+ LOC"
  },
  {
    name: "ResearchGravity",
    tagline: "Research Orchestration MCP Server",
    description: "Temporal knowledge graph with ReACT synthesis agent. FastAPI backend with Qdrant vector search, 114+ archived research sessions, and meta-learning engine with 87% error prevention accuracy.",
    metrics: [
      { label: "Sessions", value: "114+" },
      { label: "Embeddings", value: "2,530" },
      { label: "URLs Tracked", value: "8,935" },
      { label: "Error Prevention", value: "87%" }
    ],
    techStack: ["AI-Directed Build", "FastAPI", "Qdrant", "Vector Search"],
    papers: [
      "Temporal knowledge graphs",
      "ReACT synthesis agents",
      "Meta-learning error prevention"
    ],
    github: "https://github.com/Dicoangelo/ResearchGravity",
    loc: "35K+ LOC"
  },
  {
    name: "Burstiness Engine",
    tagline: "In-Generation Rhythm Control for Language Models",
    description: "Research collaboration with Vittoria Lanzo on controlling burstiness, the rhythm of sentence-length variation, during generation rather than as a post-edit. Framing, formal definition, ablation, and a documented negative result are complete; a working controller is the open frontier.",
    metrics: [
      { label: "Stage", value: "Active Research" },
      { label: "Corpus", value: "43 papers" },
      { label: "Research Passes", value: "4" },
      { label: "Output", value: "Paper draft" }
    ],
    techStack: ["AI-Directed Build", "Research Synthesis", "Controlled Generation", "Ablation Studies"],
    papers: [
      "In-generation burstiness control vs prompt-level baselines",
      "Formal definition of rhythm and burstiness in generated text",
      "Negative-result methodology"
    ],
    github: "https://github.com/Dicoangelo/burstiness-engine",
    loc: "Research"
  }
];

export default function ProjectShowcase({ isLight }: ProjectShowcaseProps) {
  const [expanded, setExpanded] = useState(false);
  const previewCount = 4;
  const visibleProjects = expanded ? projects : projects.slice(0, previewCount);
  const hiddenCount = projects.length - previewCount;

  return (
    <section id="projects" className={`relative py-20 px-6 ${isLight ? 'bg-transparent' : 'bg-[#050505]'}`}>
      <div className="relative max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span
            className={`inline-block text-[11px] font-semibold uppercase tracking-[0.2em] mb-4 ${
              isLight ? "text-[#6366f1]/80" : "text-[#818cf8]"
            }`}
          >
            Owned Projects
          </span>
          <h2
            className={`text-4xl md:text-5xl font-bold tracking-tight ${
              isLight ? "text-gray-900" : "text-white"
            }`}
          >
            Specified in English. Built by AI.
          </h2>
          <p
            className={`mt-5 max-w-2xl mx-auto text-[15px] leading-relaxed ${
              isLight ? "text-gray-600" : "text-[#a3a3a3]"
            }`}
          >
            Directed Claude Code, Codex, and Gemini to ship 20+ production systems. arXiv research → live infrastructure.
          </p>
        </div>

        <div className="space-y-6 md:space-y-12">
          {visibleProjects.map((project, index) => (
            <DepthSection
              key={index}
              className={`p-5 md:p-8 rounded-2xl border ${
                isLight
                  ? 'bg-gradient-to-br from-white to-gray-50 border-gray-200'
                  : 'bg-gradient-to-br from-[#0a0a0a] to-[#141414] border-[#262626]'
              } hover:border-[#6366f1] transition-all`}
              showMoreLabel="Tech stack & research"
              showLessLabel="Hide tech & research"
              title={
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">{project.name}</h3>
                    <p className={`text-lg ${isLight ? 'text-gray-600' : 'text-[#8a8a8a]'}`}>
                      {project.tagline}
                    </p>
                  </div>
                  <div className="flex gap-3 mt-4 md:mt-0">
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                        isLight
                          ? 'border-gray-300 hover:bg-gray-100'
                          : 'border-[#262626] hover:bg-[#1a1a1a]'
                      }`}
                    >
                      GitHub →
                    </a>
                    {project.demo && (
                      <a
                        href={project.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-lg bg-[#6366f1] hover:bg-[#5558e3] text-white text-sm font-medium transition-colors"
                      >
                        Live Demo →
                      </a>
                    )}
                  </div>
                </div>
              }
              summary={
                <div className="mt-6">
                  <p className={`mb-6 leading-relaxed ${isLight ? 'text-gray-700' : 'text-[#a3a3a3]'}`}>
                    {project.description}
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {project.metrics.map((metric, idx) => (
                      <div
                        key={idx}
                        className={`p-4 rounded-lg ${
                          isLight ? 'bg-white border border-gray-200' : 'bg-[#0a0a0a] border border-[#1a1a1a]'
                        }`}
                      >
                        <p className="text-2xl font-bold text-[#6366f1] mb-1">{metric.value}</p>
                        <p className={`text-xs ${isLight ? 'text-gray-600' : 'text-[#737373]'}`}>
                          {metric.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              }
              deep={
                <div className="mt-6 space-y-6">
                  <div>
                    <p className={`text-sm font-semibold mb-2 ${isLight ? 'text-gray-700' : 'text-[#a3a3a3]'}`}>
                      Tech Stack:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {project.techStack.map((tech, idx) => (
                        <span
                          key={idx}
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            isLight
                              ? 'bg-gray-100 text-gray-700'
                              : 'bg-[#1a1a1a] text-[#a3a3a3]'
                          }`}
                        >
                          {tech}
                        </span>
                      ))}
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          isLight
                            ? 'bg-blue-50 text-blue-700'
                            : 'bg-[#1a1a2a] text-[#8a8aff]'
                        }`}
                      >
                        {project.loc}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className={`text-sm font-semibold mb-2 ${isLight ? 'text-gray-700' : 'text-[#a3a3a3]'}`}>
                      Research Implemented:
                    </p>
                    <ul className="space-y-1">
                      {project.papers.map((paper, idx) => (
                        <li
                          key={idx}
                          className={`text-sm ${isLight ? 'text-gray-600' : 'text-[#737373]'}`}
                        >
                          • {paper}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              }
            />
          ))}
        </div>

        {/* Expand / collapse toggle */}
        {hiddenCount > 0 && (
          <div className="mt-10 text-center">
            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg border font-medium transition-colors ${
                isLight
                  ? 'border-indigo-300 text-indigo-700 hover:bg-indigo-50'
                  : 'border-indigo-500/40 text-indigo-300 hover:bg-indigo-500/10'
              }`}
              aria-expanded={expanded}
            >
              {expanded ? (
                <>Show fewer projects</>
              ) : (
                <>Show {hiddenCount} more projects</>
              )}
              <svg
                className={`w-4 h-4 transition-transform ${expanded ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        )}

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className={`mb-4 ${isLight ? 'text-gray-600' : 'text-[#737373]'}`}>
            All projects are open source on GitHub
          </p>
          <a
            href="https://github.com/Dicoangelo"
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-block px-6 py-3 rounded-lg border font-medium transition-colors ${
              isLight
                ? 'border-gray-300 hover:bg-gray-100'
                : 'border-[#262626] hover:bg-[#141414]'
            }`}
          >
            View All 44 Repositories →
          </a>
        </div>
      </div>
    </section>
  );
}
