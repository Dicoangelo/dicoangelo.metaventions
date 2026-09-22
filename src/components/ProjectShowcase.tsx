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
    description: "A concept demo for partner intelligence: an MCP interface and dashboard for exploring partner health, co-sell workflows and attribution. Partner data is illustrative; named platforms and partners are unaffiliated. No commercial deployment or live CRM integration is claimed.",
    metrics: [
      { label: "Interface", value: "MCP" },
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
    github: "https://github.com/Dicoangelo",
    demo: "https://partnerships.metaventionsai.com",
    loc: "Concept"
  },
  {
    name: "SBC-AutoOps / SBC Inspector",
    tagline: "Pre-Deploy Validation for Session Border Controllers",
    description: "A configuration-validation prototype for supported session border controller formats. Combines deterministic checks with plain-English explanations and an MCP interface for inspection. Findings support human review before deployment; they do not guarantee a safe configuration.",
    metrics: [
      { label: "Input", value: "SBC configs" },
      { label: "Checks", value: "Validation" },
      { label: "Output", value: "Review notes" },
      { label: "Interface", value: "MCP" }
    ],
    techStack: ["AI-Directed Build", "MCP Protocol", "Deterministic Validation", "Config Parsing"],
    papers: [
      "Deterministic pre-deployment config validation",
      "Multi-vendor SBC normalization",
      "Agent-surfaced infrastructure inspection (MCP)"
    ],
    github: "https://github.com/Dicoangelo",
    demo: "https://sbcvalidator.metaventionsai.com",
    loc: "Prototype"
  },
  {
    name: "Frontier Alpha",
    tagline: "Investment Research Prototype",
    description: "An experimental interface for exploring factor exposure, portfolio scenarios and AI-assisted investment research. The demo illustrates a workflow; no investment performance or validated forecasting accuracy is claimed.",
    metrics: [
      { label: "Research", value: "Factors" },
      { label: "Workflow", value: "Scenarios" },
      { label: "Output", value: "Explanations" },
      { label: "Stage", value: "Prototype" }
    ],
    techStack: ["AI-Directed Build", "Factor Models", "Episodic Memory", "CVRF"],
    papers: [
      "CVRF episodic learning",
      "Multi-factor portfolio construction",
      "Explainable AI for investment decisions"
    ],
    github: "https://github.com/Dicoangelo",
    demo: "https://frontier-alpha.metaventionsai.com",
    loc: "Prototype"
  },
  {
    name: "CareerCoach Antigravity",
    tagline: "AI-Assisted Career Workflows",
    description: "An AI-assisted career application for résumé review, role comparison and tailored feedback. Dico specifies the workflows, directs AI coding tools, and reviews, tests and deploys the implementation. Hiring-panel personas are simulations, not employer decisions.",
    metrics: [
      { label: "Workflow", value: "Résumé review" },
      { label: "Stack", value: "Next.js" },
      { label: "Feedback", value: "AI-assisted" },
      { label: "Surface", value: "Web app" }
    ],
    techStack: ["Next.js 16", "React 19", "Tailwind 4", "TypeScript", "Stripe", "Prompt Engineering"],
    papers: [
      "Eligibility-gate-first hiring funnels",
      "Warm-line conversion vs cold apply",
      "ATS keyword fidelity in resume tailoring"
    ],
    github: "https://github.com/Dicoangelo",
    demo: "https://careers.metaventionsai.com",
    loc: "Application"
  },
  {
    name: "FriendlyFace",
    tagline: "AI Evidence Prototype",
    description: "A collaborative prototype exploring traceability and evidence sealing for AI systems. Draws on forensic facial-recognition research by other authors. Demonstrates implementation ideas rather than certified compliance, legal admissibility or validated recognition performance.",
    metrics: [
      { label: "Architecture", value: "Evidence records" },
      { label: "Research", value: "Forensic AI" },
      { label: "Mode", value: "Prototype" },
      { label: "Workflow", value: "Traceability" }
    ],
    techStack: ["Prompt Engineering", "Blockchain", "Computer Vision", "ForensicSeal"],
    papers: [
      "Forensic facial-recognition research (ICDF2C 2024)",
      "Evidence-sealing implementation patterns",
      "Traceability and review workflows"
    ],
    github: "https://github.com/Dicoangelo",
    demo: "https://friendlyface.metaventionsai.com",
    loc: "Prototype"
  },
  {
    name: "ACE",
    tagline: "Adaptive Consensus Engine",
    description: "An experimental multi-agent voting implementation with configurable thresholds, heuristic weights and agent selection. The DQ source study (arXiv:2511.15755, Philip Drammeh) was withdrawn on August 31, 2026; its actionability and DQ results are not evidence of this implementation’s efficacy.",
    metrics: [
      { label: "Method", value: "Agent voting" },
      { label: "Weights", value: "Heuristic" },
      { label: "Thresholds", value: "Configurable" },
      { label: "Status", value: "Experimental" }
    ],
    techStack: ["AI-Directed Build", "Multi-Agent Systems", "DQ-Weighted Voting", "Vitest"],
    papers: [
      "arXiv:2511.15755 — Drammeh; withdrawn Aug 31, 2026",
      "arXiv:2511.13193 — Agent Auctions (DALA)",
      "arXiv:2508.17536 — Voting vs Debate"
    ],
    github: "https://github.com/Dicoangelo",
    demo: "https://app.metaventionsai.com",
    loc: "Prototype"
  },
  {
    name: "ARCHON",
    tagline: "Meta-Orchestrator",
    description: "An experimental coordinator for delegating tasks across agents and model providers. Explores complexity-based routing, token budgets and review checkpoints; it does not establish a measured speed improvement or autonomous reliability.",
    metrics: [
      { label: "Workflow", value: "Coordination" },
      { label: "Routing", value: "Configurable" },
      { label: "Providers", value: "Multi-model" },
      { label: "Budgets", value: "Token-aware" }
    ],
    techStack: ["Prompt Engineering", "Multi-Provider Routing", "Multi-Agent Orchestration"],
    papers: [
      "arXiv:2601.09742 - Adaptive Orchestration",
      "arXiv:2506.12508 - AgentOrchestra",
      "arXiv:2508.07407 - Self-Evolving Agents"
    ],
    github: "https://github.com/Dicoangelo",
    demo: "https://app.metaventionsai.com",
    loc: "Prototype"
  },
  {
    name: "META-VENGINE",
    tagline: "AI Workflow Infrastructure",
    description: "Connected routing, error handling, memory and monitoring components for AI-assisted work. Uses recorded feedback to propose changes that can be reviewed; performance and reliability are not independently validated.",
    metrics: [
      { label: "Recovery", value: "Error handling" },
      { label: "Memory", value: "Pattern records" },
      { label: "Routing", value: "Heuristic" },
      { label: "Design", value: "Connected" }
    ],
    techStack: ["AI-Directed Build", "Pattern Recognition", "Self-Healing Systems", "SQLite"],
    papers: [
      "Self-healing systems",
      "Feedback loop optimization",
      "Cognitive pattern learning"
    ],
    github: "https://github.com/Dicoangelo",
    loc: "Internal tools"
  },
  {
    name: "UCW",
    tagline: "Universal Cognitive Wallet",
    description: "A cross-platform research capture and retrieval project. Normalizes captured AI session records, stores searchable context and explores relationships between records. Coverage depends on configured integrations; semantic similarity is not proof of independent discovery or cognition.",
    metrics: [
      { label: "Capture", value: "Session records" },
      { label: "Retrieval", value: "Semantic search" },
      { label: "Access", value: "MCP tools" },
      { label: "Context", value: "Cross-platform" }
    ],
    techStack: ["AI-Directed Build", "PostgreSQL", "pgvector", "MCP Protocol"],
    papers: [
      "Cognitive equity thesis",
      "Cross-platform capture architecture",
      "Vector similarity search at scale"
    ],
    github: "https://github.com/Dicoangelo",
    loc: "Research tools"
  },
  {
    name: "ResearchGravity",
    tagline: "Research Orchestration MCP Server",
    description: "Research capture and retrieval tools with a FastAPI backend, vector search and an MCP interface. Organizes session notes, source URLs and findings so prior work can be retrieved and reviewed. No error-prevention accuracy is claimed.",
    metrics: [
      { label: "Capture", value: "Research notes" },
      { label: "Search", value: "Vectors" },
      { label: "Sources", value: "URL records" },
      { label: "Interface", value: "MCP" }
    ],
    techStack: ["AI-Directed Build", "FastAPI", "Qdrant", "Vector Search"],
    papers: [
      "Temporal knowledge graphs",
      "ReACT synthesis agents",
      "Meta-learning error prevention"
    ],
    github: "https://github.com/Dicoangelo",
    loc: "Research tools"
  },
  {
    name: "Burstiness Engine",
    tagline: "In-Generation Rhythm Control for Language Models",
    description: "An exploratory research project on sentence-length variation during language-model generation. Includes research notes and proposed evaluation work. A working controller and validated improvement remain open questions; this is not a published research result.",
    metrics: [
      { label: "Stage", value: "Exploration" },
      { label: "Material", value: "Research notes" },
      { label: "Method", value: "Evaluation" },
      { label: "Output", value: "Draft ideas" }
    ],
    techStack: ["AI-Directed Build", "Research Synthesis", "Controlled Generation", "Ablation Studies"],
    papers: [
      "In-generation burstiness control vs prompt-level baselines",
      "Formal definition of rhythm and burstiness in generated text",
      "Negative-result methodology"
    ],
    github: "https://github.com/Dicoangelo",
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
            Projects specified in English, implemented with AI coding tools, then reviewed and tested. Includes applications, internal tools and prototypes; research references are work by other authors.
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
                      GitHub profile →
                    </a>
                    {project.demo && (
                      <a
                        href={project.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-lg bg-[#6366f1] hover:bg-[#5558e3] text-white text-sm font-medium transition-colors"
                      >
                        View demo →
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
                      Research &amp; implementation notes:
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
            Project source access varies. Explore the public GitHub profile.
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
            View All Repositories →
          </a>
        </div>
      </div>
    </section>
  );
}
