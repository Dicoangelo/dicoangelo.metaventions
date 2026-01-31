"use client";

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
    name: "ACE",
    tagline: "Adaptive Consensus Engine",
    description: "Multi-agent voting system achieving consensus through adaptive thresholds, DQ-weighted voting, and auction-based agent selection.",
    metrics: [
      { label: "Actionability", value: "100% vs 1.7% baseline" },
      { label: "Token Reduction", value: "300x" },
      { label: "Consensus Rounds", value: "50% faster" },
      { label: "Test Coverage", value: "95%" }
    ],
    techStack: ["TypeScript", "Vitest", "Multi-Agent Systems"],
    papers: [
      "arXiv:2511.15755 - DQ Scoring Framework",
      "arXiv:2511.13193 - Agent Auctions (DALA)",
      "arXiv:2508.17536 - Voting vs Debate"
    ],
    github: "https://github.com/Dicoangelo/OS-App/blob/main/services/adaptiveConsensus.ts",
    demo: "https://os-app-woad.vercel.app",
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
    techStack: ["TypeScript", "React 19", "Multi-Provider Routing"],
    papers: [
      "arXiv:2601.09742 - Adaptive Orchestration",
      "arXiv:2506.12508 - AgentOrchestra",
      "arXiv:2508.07407 - Self-Evolving Agents"
    ],
    github: "https://github.com/Dicoangelo/OS-App/blob/main/services/archon/index.ts",
    demo: "https://os-app-woad.vercel.app",
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
    techStack: ["Python", "Bash", "SQLite", "Pattern Recognition"],
    papers: [
      "Self-healing systems",
      "Feedback loop optimization",
      "Cognitive pattern learning"
    ],
    github: "https://github.com/Dicoangelo",
    loc: "51K+ LOC"
  }
];

export default function ProjectShowcase({ isLight }: ProjectShowcaseProps) {
  return (
    <section id="projects" className={`py-20 px-6 ${isLight ? 'bg-white' : 'bg-[#050505]'}`}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Major Projects</h2>
          <p className={`text-lg ${isLight ? 'text-gray-600' : 'text-[#737373]'}`}>
            Research-driven AI systems implementing arXiv papers into production code
          </p>
        </div>

        <div className="space-y-12">
          {projects.map((project, index) => (
            <div
              key={index}
              className={`p-8 rounded-2xl border ${
                isLight
                  ? 'bg-gradient-to-br from-white to-gray-50 border-gray-200'
                  : 'bg-gradient-to-br from-[#0a0a0a] to-[#141414] border-[#262626]'
              } hover:border-[#6366f1] transition-all`}
            >
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
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

              {/* Description */}
              <p className={`mb-6 leading-relaxed ${isLight ? 'text-gray-700' : 'text-[#a3a3a3]'}`}>
                {project.description}
              </p>

              {/* Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
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

              {/* Tech Stack */}
              <div className="mb-6">
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

              {/* Papers */}
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
          ))}
        </div>

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
            View All 20 Repositories →
          </a>
        </div>
      </div>
    </section>
  );
}
