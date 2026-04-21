// ─── Showcase Data Model ─────────────────────────────────────────────────────
// Ported from command-center/gallery.html and command-center/index.html

export interface ShowcaseTag {
  cls: string;
  label: string;
}

export interface ShowcaseItem {
  id: number;
  num: number;
  system: string;
  file: string;
  title: string;
  subtitle: string;
  description: string;
  category: string;
  tags: ShowcaseTag[];
  talkingPoints: string[];
}

export interface SystemGroup {
  name: string;
  color: string;
  items: ShowcaseItem[];
}

export interface LiveSite {
  name: string;
  tech: string;
  description: string;
  url: string;
}

export interface GithubRepo {
  name: string;
  description: string;
  match: string;
  matchLevel: "strong" | "partial";
  visibility: "public" | "private";
}

export interface DockerProject {
  project: string;
  files: string;
  proof: string;
}

export interface AnomalyStat {
  value: string;
  label: string;
}

// ─── System Colors ───────────────────────────────────────────────────────────

export const systemColors: Record<string, string> = {
  "Antigravity OS": "#4f8fff",
  "ResearchGravity": "#06b6d4",
  "UCW Dashboard": "#a855f7",
  "Command Center": "#22c55e",
  "Metaventions AI": "#f59e0b",
};

export const systemOrder = [
  "Antigravity OS",
  "ResearchGravity",
  "UCW Dashboard",
  "Command Center",
  "Metaventions AI",
];

// ─── Categories ──────────────────────────────────────────────────────────────

export const categories = [
  { id: "all", label: "All" },
  { id: "monitoring", label: "Monitoring" },
  { id: "orchestration", label: "Orchestration" },
  { id: "ai", label: "AI / ML" },
  { id: "data", label: "Data & Analytics" },
  { id: "rag", label: "RAG & Search" },
  { id: "cloud", label: "Cloud & Infra" },
];

// ─── Highlight Indices (best 8 for presentation mode) ────────────────────────

export const highlightIndices = [0, 1, 2, 6, 7, 13, 15, 18];

// ─── Tech Stack Chips ────────────────────────────────────────────────────────

export const techStackChips = [
  "Claude API",
  "GPT-4",
  "Gemini",
  "MCP (Model Context Protocol)",
  "Multi-Agent Orchestration",
  "Prompt Engineering",
  "RAG / pgvector",
  "Qdrant",
  "Cohere",
  "LLM Evaluation Frameworks",
  "Agentic Workflow Automation",
  "Claude Code / Codex / Gemini CLI",
  "SQLite",
  "Supabase",
  "Vercel",
  "Fly.io",
];

// ─── 20 Showcase Items ──────────────────────────────────────────────────────

export const showcaseItems: ShowcaseItem[] = [
  // === SYSTEM: Antigravity OS (13 screenshots) ===
  {
    id: 1,
    num: 1,
    system: "Antigravity OS",
    file: "/showcase/antigravity-dashboard.png",
    title: "Antigravity OS — Dashboard",
    subtitle: "Native macOS App (Tauri + React 19 + Rust)",
    description:
      "Real-time analytics: 412 sessions, 14.8K messages, 28.7K tools, 94.2% cache efficiency. Daily activity charts with multi-metric visualization. SSE streaming from SQLite.",
    category: "monitoring",
    tags: [
      { cls: "tag-monitoring", label: "MONITORING" },
      { cls: "tag-data", label: "ANALYTICS" },
      { cls: "tag-cloud", label: "SSE STREAMING" },
    ],
    talkingPoints: [
      "This is a native macOS desktop app I built with Tauri, React 19, and Rust — it monitors my entire AI development infrastructure in real-time.",
      "412 sessions tracked, 14.8K messages, 28.7K tool calls — all streamed via SSE from a SQLite backend. It\u2019s how I monitor system health at scale.",
      "The daily activity chart shows multi-model usage patterns across Opus, Sonnet, and Haiku — relevant to multi-service orchestration at scale.",
    ],
  },
  {
    id: 2,
    num: 2,
    system: "Antigravity OS",
    file: "/showcase/antigravity-routing.png",
    title: "DQ-Scored Model Routing",
    subtitle: "Multi-Service AI Orchestration",
    description:
      "Decision Quality scoring across Opus/Sonnet/Haiku. 158 decisions, 0.890 avg DQ, 89.9% Opus accuracy. Histogram distribution, per-model accuracy bars, recent decisions table.",
    category: "orchestration",
    tags: [
      { cls: "tag-orchestration", label: "ORCHESTRATION" },
      { cls: "tag-ai", label: "LLM ROUTING" },
      { cls: "tag-data", label: "DQ SCORING" },
    ],
    talkingPoints: [
      "This is my Decision Quality scoring system — it routes queries to the optimal AI model based on complexity, domain, and cost.",
      "158 routing decisions with 0.890 average DQ score and 89.9% accuracy on Opus. This is the kind of intelligent orchestration layer needed for enterprise AI systems.",
      "The histogram shows DQ distribution — most decisions cluster above 0.85, meaning the routing heuristic is well-calibrated.",
    ],
  },
  {
    id: 3,
    num: 3,
    system: "Antigravity OS",
    file: "/showcase/antigravity-agents.png",
    title: "Multi-Agent Launch Interface",
    subtitle: "Agent Orchestration with Model Selection",
    description:
      "Launch agents with model selection (Haiku/Sonnet/Opus). Active agents panel showing running tasks with PID tracking, model assignment, and completion status. Constellation background.",
    category: "ai",
    tags: [
      { cls: "tag-ai", label: "AGENTIC AI" },
      { cls: "tag-orchestration", label: "MULTI-AGENT" },
    ],
    talkingPoints: [
      "This is a multi-agent launch interface — I can spin up parallel AI agents with different model assignments and track their execution.",
      "Each agent gets a PID, model selection (Haiku for fast tasks, Opus for deep reasoning), and real-time status tracking.",
      "This maps directly to agentic AI workflows — I\u2019ve built the orchestration layer, not just consumed APIs.",
    ],
  },
  {
    id: 4,
    num: 4,
    system: "Antigravity OS",
    file: "/showcase/antigravity-cognitive.png",
    title: "Cognitive OS — Energy-Aware Routing",
    subtitle: "Flow State Detection + Task Recommendations",
    description:
      "Peak performance mode detection, energy gauge (82/100), flow score (0.75). Weekly energy heatmap. AI recommendations: deep architecture, multi-agent coordination, complex refactoring.",
    category: "ai",
    tags: [
      { cls: "tag-ai", label: "COGNITIVE AI" },
      { cls: "tag-monitoring", label: "FLOW DETECTION" },
    ],
    talkingPoints: [
      "Cognitive OS detects my flow state and energy level, then routes tasks to the right model — peak energy gets complex architecture work, dips get routine tasks.",
      "The energy gauge reads 82/100 with a flow score of 0.75 — it uses time-of-day patterns and session history to predict productivity.",
      "This kind of intelligent automation demonstrates systems that adapt to context, not just follow rules.",
    ],
  },
  {
    id: 5,
    num: 5,
    system: "Antigravity OS",
    file: "/showcase/antigravity-sessions.png",
    title: "Session Intelligence",
    subtitle: "412 Sessions Tracked with Quality Scoring",
    description:
      "Session history with model, messages, tools, outcome, quality (star rating), duration, and cost. Outcome distribution: 48.9% completed, 21.1% partial. Filterable by model/outcome/project.",
    category: "data",
    tags: [
      { cls: "tag-data", label: "ANALYTICS" },
      { cls: "tag-monitoring", label: "SESSION TRACKING" },
    ],
    talkingPoints: [
      "Session intelligence tracking with quality scoring — every AI session gets rated on outcome, complexity, and cost efficiency.",
      "48.9% completion rate with filterable views by model, outcome, and project. This is operational telemetry at scale.",
      "The star rating system uses multi-agent consensus (ACE engine) — 6 agents vote on session quality.",
    ],
  },
  {
    id: 6,
    num: 6,
    system: "Antigravity OS",
    file: "/showcase/antigravity-memory.png",
    title: "Long-Term Memory System",
    subtitle: "1,842 Items / 248 Learnings / 6 Sources",
    description:
      "Semantic search across memory with tabs for Search, Learnings, Error Patterns, and Stats. Constellation visualization of knowledge nodes. Spaced repetition review system.",
    category: "rag",
    tags: [
      { cls: "tag-rag", label: "SEMANTIC SEARCH" },
      { cls: "tag-ai", label: "MEMORY" },
      { cls: "tag-data", label: "KNOWLEDGE BASE" },
    ],
    talkingPoints: [
      "This is a semantic search system over long-term memory — 1,842 items including learnings, error patterns, and knowledge nodes.",
      "It uses spaced repetition for review and constellation visualization for knowledge graph exploration.",
      "This is essentially a RAG system I built for my own knowledge management — the same architecture applicable to enterprise search problems.",
    ],
  },
  {
    id: 7,
    num: 7,
    system: "Antigravity OS",
    file: "/showcase/antigravity-tools.png",
    title: "MCP Server & Tools Registry",
    subtitle: "5 Servers / 178 Tools / 15.6K Total Calls",
    description:
      "Live MCP server monitoring: x-twitter (70 tools), researchgravity (21), notebooklm (37), chrome-devtools (28), supabase (22). All connected via stdio protocol. Real-time status.",
    category: "cloud",
    tags: [
      { cls: "tag-cloud", label: "MCP PROTOCOL" },
      { cls: "tag-monitoring", label: "TOOL MONITORING" },
      { cls: "tag-orchestration", label: "178 TOOLS" },
    ],
    talkingPoints: [
      "5 MCP servers with 178 tools, all connected via the Model Context Protocol. 15.6K total tool calls tracked in real-time.",
      "This is microservices architecture in practice — each server is independent (x-twitter, researchgravity, notebooklm, chrome-devtools, supabase) with stdio protocol communication.",
      "I designed the tool registry, health monitoring, and usage analytics from scratch.",
    ],
  },
  {
    id: 8,
    num: 8,
    system: "Antigravity OS",
    file: "/showcase/antigravity-automations.png",
    title: "Self-Healing Automation Engine",
    subtitle: "6 Rules / 3 Active / 16 Times Fired",
    description:
      "Event-driven automation: auto-upgrade to Opus when DQ drops, energy dip break suggestions, session duration saves, error spike recovery. WHEN/AND/THEN rule syntax.",
    category: "cloud",
    tags: [
      { cls: "tag-cloud", label: "CI/CD PATTERNS" },
      { cls: "tag-monitoring", label: "SELF-HEALING" },
      { cls: "tag-ai", label: "AUTOMATION" },
    ],
    talkingPoints: [
      "Event-driven automation engine with WHEN/AND/THEN rule syntax — 6 rules, 3 currently active, fired 16 times.",
      "Auto-upgrades to Opus when DQ drops, suggests breaks during energy dips, triggers recovery on error spikes.",
      "This is self-healing infrastructure — the same pattern applicable to cloud reliability for enterprise clients.",
    ],
  },
  {
    id: 9,
    num: 9,
    system: "Antigravity OS",
    file: "/showcase/antigravity-antifragile.png",
    title: "Antifragile System View",
    subtitle: "Self-Improving Error Recovery",
    description:
      "System health and antifragility metrics. 9,153 autonomous self-heal repairs, 94% error pattern coverage. Tracks system resilience over time.",
    category: "cloud",
    tags: [
      { cls: "tag-cloud", label: "SELF-HEALING" },
      { cls: "tag-monitoring", label: "RESILIENCE" },
    ],
    talkingPoints: [
      "Antifragile system view showing 9,153 autonomous self-heal repairs with 94% error pattern coverage.",
      "The system doesn\u2019t just detect problems — it fixes them automatically. 70% auto-fix rate without human intervention.",
      "This is the kind of resilience engineering that matters at enterprise scale.",
    ],
  },
  {
    id: 10,
    num: 10,
    system: "Antigravity OS",
    file: "/showcase/antigravity-temporal.png",
    title: "Temporal Analysis",
    subtitle: "Time-Series Pattern Detection",
    description:
      "Temporal analysis of development patterns, productivity cycles, and system performance over time. Identifies optimal working windows and energy patterns.",
    category: "data",
    tags: [
      { cls: "tag-data", label: "TIME-SERIES" },
      { cls: "tag-ai", label: "PATTERN DETECTION" },
    ],
    talkingPoints: [
      "Temporal analysis of development patterns — identifies optimal working windows, productivity cycles, and energy patterns over time.",
      "This is time-series analytics applied to developer productivity — the same observability approach applicable to cloud system performance monitoring.",
    ],
  },
  {
    id: 11,
    num: 11,
    system: "Antigravity OS",
    file: "/showcase/antigravity-modifications.png",
    title: "Co-Evolution Modifications",
    subtitle: "Self-Modifying Configuration System",
    description:
      "Bidirectional co-evolution: system reads its own patterns and proposes configuration modifications. Tracks applied vs pending changes with audit trail.",
    category: "ai",
    tags: [
      { cls: "tag-ai", label: "CO-EVOLUTION" },
      { cls: "tag-orchestration", label: "SELF-IMPROVING" },
    ],
    talkingPoints: [
      "Co-evolution modifications — the system reads its own behavioral patterns and proposes configuration changes with an audit trail.",
      "Applied vs pending changes are tracked. It\u2019s a self-improving system — the configuration evolves based on measured outcomes.",
      "This demonstrates iterative improvement methodology — measure, propose, review, apply — which maps to cloud architecture optimization.",
    ],
  },
  {
    id: 12,
    num: 12,
    system: "Antigravity OS",
    file: "/showcase/antigravity-projects.png",
    title: "Project Registry",
    subtitle: "Multi-Project Orchestration Dashboard",
    description:
      "Unified view across all active projects with session counts, activity status, and cross-project context linking. Supports 30+ repositories.",
    category: "monitoring",
    tags: [
      { cls: "tag-monitoring", label: "PROJECT TRACKING" },
      { cls: "tag-data", label: "MULTI-REPO" },
    ],
    talkingPoints: [
      "Unified project registry across 30+ repositories with session counts, activity status, and cross-project context linking.",
      "This is how I manage complexity across a large codebase — each project\u2019s health, dependencies, and recent activity visible in one view.",
      "For multi-client engagements, this kind of project orchestration dashboard is exactly what enterprise delivery needs.",
    ],
  },
  {
    id: 13,
    num: 13,
    system: "Antigravity OS",
    file: "/showcase/antigravity-universal.png",
    title: "Universal Cognitive Wallet",
    subtitle: "Cross-Platform AI Event Capture",
    description:
      "UCW integration view: captures cognitive events from Claude, ChatGPT, Gemini, Grok, and CLI. 174,169 events across 6 platforms. Sovereign data ownership.",
    category: "rag",
    tags: [
      { cls: "tag-rag", label: "DATA CAPTURE" },
      { cls: "tag-cloud", label: "CROSS-PLATFORM" },
      { cls: "tag-ai", label: "UCW" },
    ],
    talkingPoints: [
      "Universal Cognitive Wallet — captures and unifies cognitive events from Claude, ChatGPT, Gemini, Grok, and CLI. 174,169 events across 6 platforms.",
      "This is cross-platform data integration at scale — different APIs, different schemas, unified into a single queryable store.",
      "The architecture pattern — capture, normalize, enrich, store — is the same for any enterprise data pipeline.",
    ],
  },
  // === SYSTEM: ResearchGravity (2 screenshots) ===
  {
    id: 14,
    num: 14,
    system: "ResearchGravity",
    file: "/showcase/researchgravity-architecture.png",
    title: "ResearchGravity v6.1 Architecture",
    subtitle: "8-Tier Sovereign Research Intelligence System",
    description:
      "Full RAG pipeline: MCP Server (21 tools) -> Signal Capture -> Intelligence Engine (Cohere embeddings, Qdrant vectors, DQ scoring) -> Knowledge Graph -> REST API. 174K+ events, 43K vectors, 7 platforms.",
    category: "rag",
    tags: [
      { cls: "tag-rag", label: "RAG" },
      { cls: "tag-ai", label: "VECTOR SEARCH" },
      { cls: "tag-orchestration", label: "MCP TOOLS" },
    ],
    talkingPoints: [
      "ResearchGravity\u2019s full architecture — an 8-tier sovereign research intelligence system with 21 MCP tools.",
      "Full RAG pipeline: signal capture, Cohere embeddings, Qdrant vector search, DQ scoring, knowledge graph, and REST API.",
      "174K+ events processed, 43K vectors indexed across 7 platforms. This is production RAG, not a demo.",
    ],
  },
  {
    id: 15,
    num: 15,
    system: "ResearchGravity",
    file: "/showcase/researchgravity-proof.gif",
    title: "ResearchGravity Proof Deck",
    subtitle: "Animated System Walkthrough",
    description:
      "Animated showcase of the full ResearchGravity system: session management, URL logging, semantic search, knowledge graph, and research synthesis pipeline.",
    category: "rag",
    tags: [
      { cls: "tag-rag", label: "RAG PIPELINE" },
      { cls: "tag-ai", label: "DEMO" },
    ],
    talkingPoints: [
      "Animated walkthrough of the ResearchGravity system — session management, URL logging, semantic search, and synthesis pipeline.",
      "This is the system I use daily for research — it captures, indexes, and synthesizes across multiple knowledge sources.",
    ],
  },
  // === SYSTEM: UCW Dashboard (3 screenshots) ===
  {
    id: 16,
    num: 16,
    system: "UCW Dashboard",
    file: "/showcase/researchgravity-dashboard.png",
    title: "UCW Coherence Dashboard",
    subtitle: "Cross-Platform Intelligence — 161K Events / 150K Embeddings",
    description:
      "Cognitive Sync Pulse visualization showing 7-platform data flow (CLI, ChatGPT, Grok, test, code). Coherence timeline, confidence distribution, signal breakdown radar. Real-time refresh.",
    category: "data",
    tags: [
      { cls: "tag-data", label: "CROSS-PLATFORM" },
      { cls: "tag-rag", label: "EMBEDDINGS" },
      { cls: "tag-ai", label: "COHERENCE" },
    ],
    talkingPoints: [
      "UCW Coherence Dashboard — cross-platform intelligence capturing 161K events with 150K embeddings.",
      "It unifies data from Claude, ChatGPT, Grok, and CLI into a single coherence timeline with confidence distribution.",
      "The Cognitive Sync Pulse visualization shows real-time cross-platform data flow — this is the kind of data pipeline integration enterprise systems need.",
    ],
  },
  {
    id: 17,
    num: 17,
    system: "UCW Dashboard",
    file: "/showcase/researchgravity-dashboard2.png",
    title: "UCW Coherence Dashboard — Timeline",
    subtitle: "Coherence Arc Detection Over Time",
    description:
      "Temporal view of coherence moments across platforms. Signal type breakdown with radar chart visualization. Confidence distribution histogram.",
    category: "data",
    tags: [
      { cls: "tag-data", label: "TEMPORAL" },
      { cls: "tag-ai", label: "PATTERN DETECTION" },
    ],
    talkingPoints: [
      "Temporal view of coherence moments across platforms — identifies when insights from different AI systems converge on the same topic.",
      "Signal type breakdown with radar chart and confidence distribution histogram — multi-dimensional analysis of knowledge quality.",
    ],
  },
  {
    id: 18,
    num: 18,
    system: "UCW Dashboard",
    file: "/showcase/researchgravity-dashboard3.png",
    title: "UCW Coherence Dashboard — Signals",
    subtitle: "Multi-Dimensional Signal Analysis",
    description:
      "Deep signal analysis across cognitive dimensions: Concept, Temporal, Semantic, Meta-Cognitive, Instinct. Platform network graph showing cross-platform knowledge flow.",
    category: "ai",
    tags: [
      { cls: "tag-ai", label: "SIGNAL ANALYSIS" },
      { cls: "tag-data", label: "MULTI-DIMENSIONAL" },
    ],
    talkingPoints: [
      "Deep signal analysis across 5 cognitive dimensions: Concept, Temporal, Semantic, Meta-Cognitive, and Instinct.",
      "Platform network graph shows cross-platform knowledge flow — which systems contribute to which insights.",
      "This multi-dimensional analytics approach is applicable to any complex data analysis problem.",
    ],
  },
  // === SYSTEM: Command Center (1 screenshot) ===
  {
    id: 19,
    num: 19,
    system: "Command Center",
    file: "/showcase/command-center-dashboard.gif",
    title: "Claude Command Center",
    subtitle: "Real-Time 17-Tab Analytics Dashboard",
    description:
      "SSE-streaming dashboard monitoring 174K+ events across sessions, routing, tools, costs, and model performance. Specified in English, built by directing AI coding agents. Zero external dependencies.",
    category: "monitoring",
    tags: [
      { cls: "tag-monitoring", label: "REAL-TIME" },
      { cls: "tag-cloud", label: "SSE STREAMING" },
      { cls: "tag-data", label: "17 TABS" },
    ],
    talkingPoints: [
      "Claude Command Center — a 17-tab real-time analytics dashboard streaming via SSE.",
      "Specified in English, built by directing Claude Code against an HTTP server and SQLite — zero external dependencies. Monitors 174K+ events.",
      "This shows systems thinking at scale — real-time streaming, monitoring, and ~9,000 lines of reviewed AI-generated code.",
    ],
  },
  // === SYSTEM: Metaventions AI (1 screenshot) ===
  {
    id: 20,
    num: 20,
    system: "Metaventions AI",
    file: "/showcase/metaventions-landing.png",
    title: "Metaventions AI — Brand",
    subtitle: "Company Identity & Landing Page",
    description:
      "Metaventions AI brand identity. Company behind the sovereign AI infrastructure portfolio. Landing page, product vision, and ecosystem overview.",
    category: "cloud",
    tags: [
      { cls: "tag-cloud", label: "BRAND" },
      { cls: "tag-data", label: "COMPANY" },
    ],
    talkingPoints: [
      "Metaventions AI is the company behind this entire ecosystem — sovereign AI infrastructure as a product.",
      "This represents the full journey: from individual tools to an integrated platform to a company with a whitepaper, token economics, and go-to-market.",
      "It shows thinking at the product and business level, not just the code level — which matters for any client-facing role.",
    ],
  },
];

// ─── Anomaly Stats ───────────────────────────────────────────────────────────

export const anomalyStats: AnomalyStat[] = [
  { value: "41", label: "GitHub Repos" },
  { value: "10,871", label: "Commits" },
  { value: "99,590", label: "Tool Calls Orchestrated" },
  { value: "174K+", label: "Events Captured" },
  { value: "43,092", label: "Vectors in Qdrant" },
  { value: "58", label: "MCP Tools Built" },
  { value: "64", label: "arXiv Papers to Code" },
  { value: "212", label: "Automated Tests" },
  { value: "93.1%", label: "Routing Accuracy" },
  { value: "9,153", label: "Self-Heal Repairs" },
  { value: "$800M+", label: "TCV Processed" },
  { value: "2,500+", label: "Deals Registered" },
  { value: "13", label: "Cloud Certifications" },
  { value: "4", label: "Dockerized Projects" },
  { value: "3", label: "Multi-Region Deploys" },
  { value: "NeurIPS", label: "2025 Attendee" },
];

// ─── Live Sites ──────────────────────────────────────────────────────────────

export const liveSites: LiveSite[] = [
  // ─── Custom Domain Sites ───
  {
    name: "Metaventions AI",
    tech: "VITE / COMPANY LANDING",
    description: "Official Metaventions AI landing — sovereign AI infrastructure platform",
    url: "https://metaventionsai.com",
  },
  {
    name: "Portfolio + JD Fit Analyzer",
    tech: "NEXT.JS 16 / REACT 19 / AI CHAT / TAILWIND 4",
    description: "700+ indexed chunks, real-time fit scoring, interactive timeline, AI chatbot",
    url: "https://dicoangelo.metaventionsai.com",
  },
  {
    name: "OS-App — Sovereign AI OS",
    tech: "REACT 19 / VITE / GEMINI 2.0 / ELEVENLABS / 33K LOC",
    description: "Voice-native AI OS with multi-agent orchestration and biometric sensing",
    url: "https://app.metaventionsai.com",
  },
  {
    name: "Frontier Alpha",
    tech: "AI-DIRECTED BUILD / CVRF / 80+ FACTORS",
    description: "Cognitive Factor Intelligence Platform — AI-powered portfolio optimization with CVRF",
    url: "https://frontier-alpha.metaventionsai.com",
  },
  {
    name: "FriendlyFace",
    tech: "FASTAPI / AI COMPLIANCE / FORENSIC EVIDENCE",
    description: "AI compliance proxy & forensic evidence generation system — ForensicSeal",
    url: "https://friendlyface.metaventionsai.com",
  },
  {
    name: "Career Coach",
    tech: "NEXT.JS 15 / MULTI-AGENT / ZUSTAND",
    description: "AI career governance — multi-agent hiring panel simulation, NSRG patterns",
    url: "https://careers.metaventionsai.com",
  },
  {
    name: "Enterprise Deck",
    tech: "HTML / PITCH DECK",
    description: "Metaventions AI enterprise pitch — UCW, protocol substrate, 94% margin model",
    url: "https://deck.metaventionsai.com",
  },
  {
    name: "Sovereign Deck",
    tech: "HTML / INVESTOR DECK",
    description: "Sovereign AI architecture presentation for investors and partners",
    url: "https://sovereign.metaventionsai.com",
  },
  {
    name: "Paper to Production",
    tech: "HTML / ARCHITECTURE REPORTS",
    description: "arXiv papers translated into deployed systems — technical architecture reports",
    url: "https://paper-to-production.metaventionsai.com",
  },
  {
    name: "Antigravity Demo",
    tech: "HTML / INTERACTIVE DEMO",
    description: "Interactive demo of the Antigravity ecosystem — live system walkthrough",
    url: "https://anti-gravity.metaventionsai.com",
  },
  {
    name: "Mass Fintech Hub",
    tech: "HTML / MENTORING PLATFORM",
    description: "Fintech bootcamp mentoring hub — playbooks, coaching, roundtable prep",
    url: "https://mfth.metaventionsai.com",
  },
  // ─── Client Projects ───
  {
    name: "Jordan Signature Event",
    tech: "NEXT.JS 16 / VERCEL / CLIENT PROJECT",
    description: "Production client website — event marketing & RSVP platform",
    url: "https://thesignatureevent.metaventionsai.com",
  },
  {
    name: "BXLENCE Hospitality",
    tech: "NEXT.JS 16 / SUPABASE / STRIPE / CLIENT PROJECT",
    description: "Luxury hospitality membership platform — 3-tier membership, event packages",
    url: "https://bxl.metaventionsai.com",
  },
  // ─── Vercel-Only Sites ───
  {
    name: "DQ Scoring Collaboration",
    tech: "HTML / RESEARCH PRESENTATION",
    description: "Philip Drammeh x D'Angelo — DQ scoring production validation (arXiv:2511.15755)",
    url: "https://dqscoring.vercel.app",
  },
  {
    name: "Muchen Roadmap",
    tech: "HTML / CAREER ROADMAP",
    description: "Strategic career roadmap and positioning document",
    url: "https://muchen-roadmap.vercel.app",
  },
  {
    name: "Dashboard",
    tech: "VITE / ANALYTICS",
    description: "Analytics dashboard for ecosystem monitoring",
    url: "https://dashboard-nu-three-99.vercel.app",
  },
];

// ─── GitHub Repos ────────────────────────────────────────────────────────────

export const githubRepos: GithubRepo[] = [
  // ─── Public Repos (22) ───
  {
    name: "antigravity-coordinator",
    description: "Multi-agent orchestration framework: parallel research, consensus voting (ACE), 212 tests, 93.1% routing",
    match: "RAG + AGENTS",
    matchLevel: "strong",
    visibility: "public",
  },
  {
    name: "ResearchGravity",
    description: "Multi-tier signal capture — 21 MCP tools, knowledge graph, hybrid search, FastAPI, Qdrant",
    match: "RAG + SEARCH",
    matchLevel: "strong",
    visibility: "public",
  },
  {
    name: "meta-vengine",
    description: "Multi-provider AI routing engine with DQ scoring, 9,153 self-heal repairs, monitoring",
    match: "AI + MONITORING",
    matchLevel: "strong",
    visibility: "public",
  },
  {
    name: "claude-command-center",
    description: "Real-time 17-tab analytics dashboard, SSE streaming, AI-directed build, 174K+ events",
    match: "MONITORING + DATA",
    matchLevel: "strong",
    visibility: "public",
  },
  {
    name: "frontier-alpha",
    description: "Cognitive Factor Intelligence Platform — AI-powered portfolio optimization with CVRF, 80+ factors",
    match: "AI + FINANCE",
    matchLevel: "strong",
    visibility: "public",
  },
  {
    name: "notebooklm-mcp-cli",
    description: "NotebookLM MCP server and CLI — 37 tools for notebook management, source curation, AI content",
    match: "AI WORKFLOWS",
    matchLevel: "strong",
    visibility: "public",
  },
  {
    name: "ucw",
    description: "Cross-platform AI session capture via MCP protocol — Claude, ChatGPT, Gemini, Grok",
    match: "MULTI-SERVICE AI",
    matchLevel: "strong",
    visibility: "public",
  },
  {
    name: "PageIndex",
    description: "Vectorless reasoning-based RAG — novel document indexing architecture",
    match: "RAG INNOVATION",
    matchLevel: "strong",
    visibility: "public",
  },
  {
    name: "dicoangelo.metaventions",
    description: "Portfolio & AI showcase — specified in English, built by directing Claude Code against Next.js 16 / React 19, 59 components, JD Fit Analyzer",
    match: "AI-DIRECTED BUILD",
    matchLevel: "strong",
    visibility: "public",
  },
  {
    name: "voice-nexus",
    description: "Universal multi-provider voice architecture — seamless routing between STT, reasoning, TTS",
    match: "AI + AUDIO",
    matchLevel: "strong",
    visibility: "public",
  },
  {
    name: "career-coach-mvp",
    description: "AI Hiring Panel Verdict — multi-agent resume analysis with Nexus Engine",
    match: "MULTI-AGENT",
    matchLevel: "partial",
    visibility: "public",
  },
  {
    name: "data-arch-guard",
    description: "Claude Code skill preventing data architecture mistakes — duplicate stores, schema drift",
    match: "ARCHITECTURE",
    matchLevel: "partial",
    visibility: "public",
  },
  {
    name: "paper-to-production",
    description: "arXiv papers translated into deployed systems — technical architecture reports",
    match: "RESEARCH + DOCS",
    matchLevel: "partial",
    visibility: "public",
  },
  {
    name: "FlowDesk",
    description: "Multi-monitor workspace automation for macOS — 5 layouts, auto-launch, smart hiding",
    match: "DEVTOOLS",
    matchLevel: "partial",
    visibility: "public",
  },
  {
    name: "The-Decosystem",
    description: "Sovereign AI systems — uncovering untapped value, synthesizing data streams",
    match: "ARCHITECTURE",
    matchLevel: "partial",
    visibility: "public",
  },
  {
    name: "Metaventions-AI-Landing",
    description: "Official landing page for Metaventions AI — Architected Intelligence",
    match: "BRAND",
    matchLevel: "partial",
    visibility: "public",
  },
  {
    name: "OpenViking",
    description: "Open-source context database for AI agents — semantic search, Viking URI system",
    match: "AI + DATABASE",
    matchLevel: "strong",
    visibility: "public",
  },
  {
    name: "cpb-core",
    description: "Cognitive Precision Bridge — AI orchestration with precision-aware routing",
    match: "AI ORCHESTRATION",
    matchLevel: "partial",
    visibility: "public",
  },
  {
    name: "hive",
    description: "Outcome-driven agent development framework that evolves",
    match: "AGENTS",
    matchLevel: "partial",
    visibility: "public",
  },
  {
    name: "openclaw",
    description: "Personal AI assistant — any OS, any platform, Claude-powered",
    match: "AI ASSISTANT",
    matchLevel: "partial",
    visibility: "public",
  },
  {
    name: "DicoroseAngelo.github.io",
    description: "Original personal site — Black Amethyst Gem, futurist portfolio",
    match: "PORTFOLIO",
    matchLevel: "partial",
    visibility: "public",
  },
  {
    name: "Dicoangelo",
    description: "GitHub profile README — Architecting Sovereign AI Infrastructure",
    match: "PROFILE",
    matchLevel: "partial",
    visibility: "public",
  },
  // ─── Private Repos (19) ───
  {
    name: "OS-App",
    description: "Sovereign AI OS — 33K LOC, React 19, Vite, Gemini 2.0, ElevenLabs TTS, biometric sensing",
    match: "AI + AGENTIC SYSTEMS",
    matchLevel: "strong",
    visibility: "private",
  },
  {
    name: "FriendlyFace",
    description: "Forensic-friendly AI facial recognition — Docker + Fly.io 3-region, LiteFS, ForensicSeal",
    match: "CONTAINERS + CLOUD",
    matchLevel: "strong",
    visibility: "private",
  },
  {
    name: "CareerCoachAntigravity",
    description: "Sovereign career intelligence — Next.js 15, multi-agent hiring panels, Zustand",
    match: "AI + NEXT.JS",
    matchLevel: "strong",
    visibility: "private",
  },
  {
    name: "agent-core",
    description: "Unified research orchestration — session archives, project registry, 174K events",
    match: "DATA + ORCHESTRATION",
    matchLevel: "strong",
    visibility: "private",
  },
  {
    name: "partnership-ai-orchestration",
    description: "The Partnership Graph — Bloomberg Terminal for Partnership Intelligence, MCP-native",
    match: "AI + STRATEGY",
    matchLevel: "strong",
    visibility: "private",
  },
  {
    name: "metagravity",
    description: "Native macOS desktop app for Claude Code infrastructure management (Tauri)",
    match: "DESKTOP + RUST",
    matchLevel: "strong",
    visibility: "private",
  },
  {
    name: "cognitiveforge",
    description: "Manufacturing Intelligence Protocol — sovereign agentic AI for manufacturing",
    match: "AI + MANUFACTURING",
    matchLevel: "strong",
    visibility: "private",
  },
  {
    name: "parallax",
    description: "Parallax — Architected Intelligence Engine by Metaventions",
    match: "AI ENGINE",
    matchLevel: "strong",
    visibility: "private",
  },
  {
    name: "jordan-signature-event",
    description: "Production client website — Next.js 16, Vercel deployment, event marketing",
    match: "CLIENT DELIVERY",
    matchLevel: "strong",
    visibility: "private",
  },
  {
    name: "bxlence-hospitality",
    description: "BXLENCE Hospitality — neon-luxe ultra-luxury hospitality portfolio, Next.js + Supabase",
    match: "CLIENT DELIVERY",
    matchLevel: "strong",
    visibility: "private",
  },
  {
    name: "mass-fintech-hub",
    description: "Mass Fintech Hub — bootcamp mentoring platform, playbooks, coaching resources",
    match: "FINTECH + MENTORING",
    matchLevel: "partial",
    visibility: "private",
  },
  {
    name: "sovereign-deck",
    description: "Sovereign AI architecture presentation deck for investors and partners",
    match: "STRATEGY",
    matchLevel: "partial",
    visibility: "private",
  },
  {
    name: "enterprise-deck",
    description: "Metaventions Enterprise Pitch Deck — UCW protocol substrate, 94% margin model",
    match: "STRATEGY",
    matchLevel: "partial",
    visibility: "private",
  },
  {
    name: "metaventions-pitch-deck-2026",
    description: "Metaventions AI Enterprise Pitch Deck 2026 — updated investor materials",
    match: "STRATEGY",
    matchLevel: "partial",
    visibility: "private",
  },
  {
    name: "metaventions-landing",
    description: "Metaventions AI landing page — company site source",
    match: "BRAND",
    matchLevel: "partial",
    visibility: "private",
  },
  {
    name: "career-dossier",
    description: "Career management dossier — metrics, interview prep, resume artifacts",
    match: "CAREER",
    matchLevel: "partial",
    visibility: "private",
  },
  {
    name: "chrome-history-export",
    description: "Transform Chrome browsing history into AI-ready insights — multi-platform export",
    match: "DATA + TOOLS",
    matchLevel: "partial",
    visibility: "private",
  },
  {
    name: ".github",
    description: "Organization profile, templates, and community health files",
    match: "ORG CONFIG",
    matchLevel: "partial",
    visibility: "private",
  },
  {
    name: "metaventions-ai-v1--18-",
    description: "Metaventions AI landing — legacy version archive",
    match: "ARCHIVE",
    matchLevel: "partial",
    visibility: "private",
  },
];

// ─── Docker Evidence ─────────────────────────────────────────────────────────

export const dockerEvidence: DockerProject[] = [
  {
    project: "FriendlyFace",
    files: "Dockerfile, fly.toml, docker-compose.yml",
    proof: "3-region deployment (IAD/LHR/SIN), LiteFS distributed DB, auto-scaling, private networking",
  },
  {
    project: "ClawdBot",
    files: "Dockerfile, fly.toml, docker-compose.yml",
    proof: "AI assistant with Docker + Fly.io deployment",
  },
  {
    project: "Frontier Alpha",
    files: "Dockerfile, docker-compose.yml",
    proof: "Cognitive factor intelligence platform — containerized via Docker",
  },
  {
    project: "Metaventions Landing",
    files: "Dockerfile",
    proof: "Web deployment via Docker",
  },
];

// ─── Certifications ──────────────────────────────────────────────────────────

export const certifications = [
  "Microsoft Copilot for Security Sales Training",
  "Microsoft CSP Technical Training",
  "Microsoft Azure AI Cloud Week",
  "Microsoft Marketplace Private Offer Best Practices",
  "Microsoft PRACR Office Hours (recurring)",
  "AWS Partner Generative AI on AWS Essentials",
  "AWS Knowledge: Cloud Essentials",
  "AWS Partner Business Accreditation",
  "Mastering Cloud Marketplaces — Partner Insight",
  "AI-First Product Leader (LinkedIn Learning)",
];
