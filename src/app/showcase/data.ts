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
    title: "Antigravity OS, Dashboard",
    subtitle: "Session and Tool Monitoring",
    description:
      "An archived desktop dashboard showing session, message and tool activity streamed from a local store. Screenshot totals and cache figures are historical display values, not current scale or independently verified performance.",
    category: "monitoring",
    tags: [
      { cls: "tag-monitoring", label: "MONITORING" },
      { cls: "tag-data", label: "ANALYTICS" },
      { cls: "tag-cloud", label: "SSE STREAMING" },
    ],
    talkingPoints: [
      "Specified with AI coding tools, then reviewed as a desktop monitoring implementation.",
      "The interface brings session and tool activity into one place for inspection.",
      "Charts help explore usage patterns; they do not establish the quality of model outputs.",
    ],
  },
  {
    id: 2,
    num: 2,
    system: "Antigravity OS",
    file: "/showcase/antigravity-routing.png",
    title: "Heuristic Model Routing",
    subtitle: "Experimental Multi-Model Orchestration",
    description:
      "An archived routing dashboard showing internal DQ heuristics across model choices. Accuracy labels in this screenshot are not validated accuracy. Philip Drammeh’s source study, arXiv:2511.15755, was withdrawn August 31, 2026; its DQ and actionability results are not valid supporting evidence.",
    category: "orchestration",
    tags: [
      { cls: "tag-orchestration", label: "ORCHESTRATION" },
      { cls: "tag-ai", label: "LLM ROUTING" },
      { cls: "tag-data", label: "DQ SCORING" },
    ],
    talkingPoints: [
      "Routing uses configurable heuristics for task complexity and model selection.",
      "The screenshot preserves a historical interface, not a measured claim of routing accuracy or calibration.",
      "Source status: arxiv.org/abs/2511.15755 was withdrawn after a code audit; the implementation remains experimental.",
    ],
  },
  {
    id: 3,
    num: 3,
    system: "Antigravity OS",
    file: "/showcase/antigravity-agents.png",
    title: "Multi-Agent Launch Interface",
    subtitle: "Agent Tasks and Model Selection",
    description:
      "An interface for launching agent tasks with model selection and viewing process IDs and task status. This screenshot documents an implementation, not autonomous completion or reliability.",
    category: "ai",
    tags: [
      { cls: "tag-ai", label: "AGENTIC AI" },
      { cls: "tag-orchestration", label: "MULTI-AGENT" },
    ],
    talkingPoints: [
      "The launch interface organizes concurrent AI tasks.",
      "Model assignments and process status support inspection during execution.",
      "Agent outputs still require task-appropriate review and testing.",
    ],
  },
  {
    id: 4,
    num: 4,
    system: "Antigravity OS",
    file: "/showcase/antigravity-cognitive.png",
    title: "Session-Aware Task Suggestions",
    subtitle: "Experimental Scheduling Heuristics",
    description:
      "An archived interface exploring task suggestions from time and session patterns. Displayed energy and flow scores are internal heuristics, not biometric measurements or validated assessments of a person.",
    category: "ai",
    tags: [
      { cls: "tag-ai", label: "COGNITIVE AI" },
      { cls: "tag-monitoring", label: "HEURISTICS" },
    ],
    talkingPoints: [
      "The prototype explores scheduling suggestions from recorded activity.",
      "Energy and flow labels are experimental interface concepts, not scientific measurements.",
      "The relevant implementation pattern is context-aware suggestions with human review.",
    ],
  },
  {
    id: 5,
    num: 5,
    system: "Antigravity OS",
    file: "/showcase/antigravity-sessions.png",
    title: "Session History",
    subtitle: "Session Records and Review",
    description:
      "Session records organized by model, outcome, duration and cost. Displayed outcomes and ratings are historical internal annotations, not audited performance results.",
    category: "data",
    tags: [
      { cls: "tag-data", label: "ANALYTICS" },
      { cls: "tag-monitoring", label: "SESSION TRACKING" },
    ],
    talkingPoints: [
      "Records make past AI-assisted work easier to inspect.",
      "Filters help locate sessions by model, project or recorded outcome.",
      "Internal annotations support review; they do not independently establish quality.",
    ],
  },
  {
    id: 6,
    num: 6,
    system: "Antigravity OS",
    file: "/showcase/antigravity-memory.png",
    title: "Long-Term Memory System",
    subtitle: "Stored Context and Semantic Retrieval",
    description:
      "A memory interface with search, learning notes, error patterns and review views. The screenshot illustrates retrieval of stored context; it does not establish completeness or recall accuracy.",
    category: "rag",
    tags: [
      { cls: "tag-rag", label: "SEMANTIC SEARCH" },
      { cls: "tag-ai", label: "MEMORY" },
      { cls: "tag-data", label: "KNOWLEDGE BASE" },
    ],
    talkingPoints: [
      "Semantic search helps retrieve stored notes and context.",
      "Review and visualization features support exploration of related records.",
      "The approach combines retrieval with source inspection for knowledge-management workflows.",
    ],
  },
  {
    id: 7,
    num: 7,
    system: "Antigravity OS",
    file: "/showcase/antigravity-tools.png",
    title: "MCP Server & Tools Registry",
    subtitle: "Tool Discovery and Monitoring",
    description:
      "A registry interface for configured MCP servers and tools. Tool counts and status in this archived screenshot reflect its captured state rather than the current deployment.",
    category: "cloud",
    tags: [
      { cls: "tag-cloud", label: "MCP PROTOCOL" },
      { cls: "tag-monitoring", label: "TOOL MONITORING" },
      { cls: "tag-orchestration", label: "MCP TOOLS" },
    ],
    talkingPoints: [
      "MCP exposes configured tools through a common interface.",
      "Server connections, tool discovery and invocation records support inspection.",
      "Dico directed the implementation with AI tools and reviewed the resulting workflow.",
    ],
  },
  {
    id: 8,
    num: 8,
    system: "Antigravity OS",
    file: "/showcase/antigravity-automations.png",
    title: "Rule-Based Automation Engine",
    subtitle: "Configurable Trigger and Action Rules",
    description:
      "An experimental WHEN/AND/THEN interface for routing changes, session saves and recovery actions. Its internal DQ and energy triggers are heuristics, not validated quality or biometric measurements.",
    category: "cloud",
    tags: [
      { cls: "tag-cloud", label: "CI/CD PATTERNS" },
      { cls: "tag-monitoring", label: "RECOVERY" },
      { cls: "tag-ai", label: "AUTOMATION" },
    ],
    talkingPoints: [
      "Rules connect recorded conditions to configured actions.",
      "Recovery and routing behavior needs explicit review before use in a new environment.",
      "This demonstrates automation configuration, not guaranteed self-healing or uptime.",
    ],
  },
  {
    id: 9,
    num: 9,
    system: "Antigravity OS",
    file: "/showcase/antigravity-antifragile.png",
    title: "Error Recovery View",
    subtitle: "Pattern Records and Recovery Actions",
    description:
      "An archived recovery dashboard showing recorded errors and configured responses. Repair counts and coverage percentages in the image are not verified reliability or success-rate claims.",
    category: "cloud",
    tags: [
      { cls: "tag-cloud", label: "RECOVERY" },
      { cls: "tag-monitoring", label: "RESILIENCE" },
    ],
    talkingPoints: [
      "The interface makes error patterns and recovery records visible.",
      "Configured actions can support recovery; they do not eliminate the need for human investigation.",
      "The implementation demonstrates operational visibility rather than an enterprise reliability guarantee.",
    ],
  },
  {
    id: 10,
    num: 10,
    system: "Antigravity OS",
    file: "/showcase/antigravity-temporal.png",
    title: "Temporal Analysis",
    subtitle: "Activity Patterns Over Time",
    description:
      "An interface for exploring activity patterns across recorded sessions. It does not validate productivity, energy levels or an optimal work schedule.",
    category: "data",
    tags: [
      { cls: "tag-data", label: "TIME-SERIES" },
      { cls: "tag-ai", label: "PATTERN DETECTION" },
    ],
    talkingPoints: [
      "Time-based charts help inspect recorded activity.",
      "Patterns can inform review questions; correlation alone does not establish productivity or causation.",
    ],
  },
  {
    id: 11,
    num: 11,
    system: "Antigravity OS",
    file: "/showcase/antigravity-modifications.png",
    title: "Configuration Review",
    subtitle: "Proposed Changes and Audit Records",
    description:
      "A configuration interface separating proposed and applied changes with an audit trail. Recorded feedback can prompt review; improvement is not automatic or scientifically validated.",
    category: "ai",
    tags: [
      { cls: "tag-ai", label: "CO-EVOLUTION" },
      { cls: "tag-orchestration", label: "SELF-IMPROVING" },
    ],
    talkingPoints: [
      "The workflow proposes configuration changes from stored patterns.",
      "Pending and applied states support human review of modifications.",
      "The implementation pattern is observe, propose, review and apply.",
    ],
  },
  {
    id: 12,
    num: 12,
    system: "Antigravity OS",
    file: "/showcase/antigravity-projects.png",
    title: "Project Registry",
    subtitle: "Project Activity and Context",
    description:
      "An archived registry organizing projects, session activity and related context. The screenshot demonstrates navigation and records rather than verified repository scale or delivery outcomes.",
    category: "monitoring",
    tags: [
      { cls: "tag-monitoring", label: "PROJECT TRACKING" },
      { cls: "tag-data", label: "MULTI-REPO" },
    ],
    talkingPoints: [
      "The registry groups project activity in one view.",
      "Context links help resume earlier work and locate related records.",
      "This is a workflow-management implementation rather than a claim about enterprise delivery performance.",
    ],
  },
  {
    id: 13,
    num: 13,
    system: "Antigravity OS",
    file: "/showcase/antigravity-universal.png",
    title: "Universal Cognitive Wallet",
    subtitle: "Cross-Platform Session Capture",
    description:
      "UCW captures selected AI session records through configured integrations and normalizes them for retrieval. Platform coverage and totals in this archived image are not current inventory guarantees.",
    category: "rag",
    tags: [
      { cls: "tag-rag", label: "DATA CAPTURE" },
      { cls: "tag-cloud", label: "CROSS-PLATFORM" },
      { cls: "tag-ai", label: "UCW" },
    ],
    talkingPoints: [
      "UCW explores a common record structure for captured AI sessions.",
      "Configured sources can be normalized into a searchable store.",
      "Capture, normalize, enrich and retrieve is the underlying architecture pattern.",
    ],
  },
  // === SYSTEM: ResearchGravity (2 screenshots) ===
  {
    id: 14,
    num: 14,
    system: "ResearchGravity",
    file: "/showcase/researchgravity-architecture.png",
    title: "ResearchGravity Architecture",
    subtitle: "Research Capture and Retrieval",
    description:
      "An architecture view connecting source capture, embeddings, vector search, stored context and MCP tools. DQ is an internal experimental heuristic; neither the withdrawn source study nor the screenshot establishes efficacy.",
    category: "rag",
    tags: [
      { cls: "tag-rag", label: "RAG" },
      { cls: "tag-ai", label: "VECTOR SEARCH" },
      { cls: "tag-orchestration", label: "MCP TOOLS" },
    ],
    talkingPoints: [
      "ResearchGravity organizes research sources and session context.",
      "The retrieval pipeline combines stored records, vector search and tool interfaces.",
      "This is an independent implementation overview, not a claim of enterprise deployment or validated research results.",
    ],
  },
  {
    id: 15,
    num: 15,
    system: "ResearchGravity",
    file: "/showcase/researchgravity-proof.gif",
    title: "ResearchGravity Walkthrough",
    subtitle: "Animated System Overview",
    description:
      "An archived walkthrough of session management, source logging, semantic search and research synthesis workflows.",
    category: "rag",
    tags: [
      { cls: "tag-rag", label: "RAG PIPELINE" },
      { cls: "tag-ai", label: "DEMO" },
    ],
    talkingPoints: [
      "The animation illustrates capture, retrieval and synthesis interfaces.",
      "Sources and generated synthesis need review; the walkthrough does not measure factual accuracy.",
    ],
  },
  // === SYSTEM: UCW Dashboard (3 screenshots) ===
  {
    id: 16,
    num: 16,
    system: "UCW Dashboard",
    file: "/showcase/researchgravity-dashboard.png",
    title: "UCW Similarity Dashboard",
    subtitle: "Cross-Platform Records and Embeddings",
    description:
      "An archived dashboard of stored records, similarity signals and configured sources. Confidence values are internal heuristics, not calibrated probabilities or scientific evidence of cognition.",
    category: "data",
    tags: [
      { cls: "tag-data", label: "CROSS-PLATFORM" },
      { cls: "tag-rag", label: "EMBEDDINGS" },
      { cls: "tag-ai", label: "COHERENCE" },
    ],
    talkingPoints: [
      "The dashboard organizes related records from configured sources.",
      "Similarity and timeline views can suggest material for human review.",
      "The visualization demonstrates a data-integration approach, not independent discovery or verified cognitive coherence.",
    ],
  },
  {
    id: 17,
    num: 17,
    system: "UCW Dashboard",
    file: "/showcase/researchgravity-dashboard2.png",
    title: "UCW Similarity Dashboard, Timeline",
    subtitle: "Record Matches Over Time",
    description:
      "A timeline and signal breakdown for related stored records. This is an exploratory interface; matching language does not establish independent insights or knowledge quality.",
    category: "data",
    tags: [
      { cls: "tag-data", label: "TEMPORAL" },
      { cls: "tag-ai", label: "PATTERN DETECTION" },
    ],
    talkingPoints: [
      "The timeline helps inspect when related records were captured.",
      "Signal charts organize heuristic results for review rather than validating their truth.",
    ],
  },
  {
    id: 18,
    num: 18,
    system: "UCW Dashboard",
    file: "/showcase/researchgravity-dashboard3.png",
    title: "UCW Similarity Dashboard, Signals",
    subtitle: "Exploratory Signal Categories",
    description:
      "A view of heuristic signal categories and relationships between stored records. Labels such as instinct or cognitive dimensions are experimental concepts, not scientific measurements.",
    category: "ai",
    tags: [
      { cls: "tag-ai", label: "SIGNAL ANALYSIS" },
      { cls: "tag-data", label: "MULTI-DIMENSIONAL" },
    ],
    talkingPoints: [
      "Signal categories provide ways to explore records.",
      "The network view shows configured relationships between sources and records.",
      "Similarity, metadata and chronology can guide review without proving correctness.",
    ],
  },
  // === SYSTEM: Command Center (1 screenshot) ===
  {
    id: 19,
    num: 19,
    system: "Command Center",
    file: "/showcase/command-center-dashboard.gif",
    title: "Claude Command Center",
    subtitle: "Session and Tool Analytics",
    description:
      "An archived analytics dashboard for sessions, routing, tools and costs. Dico specified the workflow and directed AI coding tools, then reviewed and tested the implementation. Screenshot totals are historical.",
    category: "monitoring",
    tags: [
      { cls: "tag-monitoring", label: "REAL-TIME" },
      { cls: "tag-cloud", label: "SSE STREAMING" },
      { cls: "tag-data", label: "17 TABS" },
    ],
    talkingPoints: [
      "The dashboard groups operational activity in a single interface.",
      "Streaming updates and local records support inspection of sessions and tool use.",
      "This illustrates specification, AI-assisted implementation and review, without a claim of unaided coding fluency.",
    ],
  },
  // === SYSTEM: Metaventions AI (1 screenshot) ===
  {
    id: 20,
    num: 20,
    system: "Metaventions AI",
    file: "/showcase/metaventions-landing.png",
    title: "Metaventions AI, Brand",
    subtitle: "Independent Project Website",
    description:
      "The public identity and landing page for Metaventions AI, Dico’s independent work on AI tools and connected knowledge.",
    category: "cloud",
    tags: [
      { cls: "tag-cloud", label: "BRAND" },
      { cls: "tag-data", label: "COMPANY" },
    ],
    talkingPoints: [
      "Metaventions AI brings together independent projects and prototypes.",
      "The website presents project ideas and implementation approaches, not a verified commercial adoption claim.",
      "It connects technical implementation with product requirements and intended users.",
    ],
  },
];

// ─── Anomaly Stats ───────────────────────────────────────────────────────────

export const anomalyStats: AnomalyStat[] = [
  { value: "Projects", label: "Public and Private Repositories" },
  { value: "Iterate", label: "Reviewed Implementation" },
  { value: "Tools", label: "Workflow Orchestration" },
  { value: "Capture", label: "Session Records" },
  { value: "Search", label: "Vector Retrieval" },
  { value: "MCP", label: "Tool Interfaces" },
  { value: "Study", label: "Other Authors’ Research" },
  { value: "Test", label: "Task-Specific Verification" },
  { value: "Route", label: "Internal Heuristics" },
  { value: "Recover", label: "Error-Handling Workflows" },
  { value: "$800M+", label: "Shared Pipeline TCV · 3-Person Team" },
  { value: "2,500+", label: "Team Deal Registrations · Contentsquare" },
  { value: "Learn", label: "Training and Accreditations" },
  { value: "Docker", label: "Container Configuration" },
  { value: "Deploy", label: "Reviewed Releases" },
  { value: "Review", label: "Human Accountability" },
];

// ─── Live Sites ──────────────────────────────────────────────────────────────

export const liveSites: LiveSite[] = [
  // ─── Custom Domain Sites ───
  {
    name: "Metaventions AI",
    tech: "INDEPENDENT PROJECT WEBSITE",
    description: "Independent work on AI tools and connected knowledge.",
    url: "https://metaventionsai.com",
  },
  {
    name: "Portfolio + Role Comparison",
    tech: "PROFESSIONAL PROFILE / AI TOOLS",
    description: "Verified career context, résumé, AI chat and an AI-assisted role comparison.",
    url: "https://dicoangelo.metaventionsai.com",
  },
  {
    name: "OS-App",
    tech: "APPLICATION PROTOTYPE",
    description: "A prototype interface for voice, model selection and agent workflows.",
    url: "https://app.metaventionsai.com",
  },
  {
    name: "Frontier Alpha",
    tech: "FINANCE RESEARCH PROTOTYPE",
    description: "An experimental interface for portfolio scenarios and investment research; no performance guarantee.",
    url: "https://frontier-alpha.metaventionsai.com",
  },
  {
    name: "Career Coach",
    tech: "CAREER APPLICATION",
    description: "AI-assisted résumé review, role comparison and simulated interview perspectives.",
    url: "https://careers.metaventionsai.com",
  },
  {
    name: "Enterprise Deck",
    tech: "HISTORICAL CONCEPT / CURRENT OVERVIEW",
    description: "Historical enterprise concepts; this link opens the current project overview.",
    url: "https://dicoangelo.metaventionsai.com/showcase",
  },
  {
    name: "Sovereign Deck",
    tech: "HISTORICAL CONCEPT / CURRENT OVERVIEW",
    description: "Historical architecture concepts; this link opens the current project overview.",
    url: "https://dicoangelo.metaventionsai.com/showcase",
  },
  {
    name: "Paper to Production",
    tech: "RESEARCH IMPLEMENTATION NOTES",
    description: "Implementations informed by other authors’ research. Read the current technical overview and source-status notes.",
    url: "https://dicoangelo.metaventionsai.com/TECHNICAL_DOSSIER.md",
  },
  {
    name: "Antigravity Demo",
    tech: "ARCHIVED WALKTHROUGH",
    description: "Archived implementation views are available in the current showcase.",
    url: "https://dicoangelo.metaventionsai.com/showcase",
  },
  {
    name: "Mass Fintech Hub",
    tech: "MENTORING CONTEXT",
    description: "Verified mentoring context is available in the professional profile; this is not a live mentoring platform.",
    url: "https://dicoangelo.metaventionsai.com",
  },
  // ─── Client Projects ───
  {
    name: "The Signature Event",
    tech: "PUBLISHED EVENT WEBSITE",
    description: "An event website with information, recap and photo gallery.",
    url: "https://thesignatureevent.metaventionsai.com",
  },
  {
    name: "BXLENCE Hospitality",
    tech: "HOSPITALITY WEBSITE",
    description: "Destinations, experiences and membership information.",
    url: "https://bxl.metaventionsai.com",
  },
  {
    name: "FriendlyFace",
    tech: "AI EVIDENCE PROTOTYPE",
    description: "A collaborative prototype exploring traceability and evidence records for AI systems.",
    url: "https://friendlyface.metaventionsai.com",
  },
  // ─── Vercel-Only Sites ───
  {
    name: "DQ Study: Withdrawal Notice",
    tech: "SOURCE STATUS / WITHDRAWN STUDY",
    description: "Philip Drammeh’s arXiv:2511.15755 was withdrawn August 31, 2026. Its DQ and actionability results cannot validate these projects.",
    url: "https://arxiv.org/abs/2511.15755",
  },
  {
    name: "Career Workflow Notes",
    tech: "PROJECT REFERENCE",
    description: "Public career-application context in the current project overview.",
    url: "https://dicoangelo.metaventionsai.com/showcase",
  },
  {
    name: "The Partnership Graph (concept demo)",
    tech: "CONCEPT DEMO / ILLUSTRATIVE DATA",
    description: "Partner-intelligence interface with illustrative data. No commercial deployment, live CRM integration or partner affiliation is claimed.",
    url: "https://partnerships.metaventionsai.com",
  },
];

// ─── GitHub Repos ────────────────────────────────────────────────────────────

export const githubRepos: GithubRepo[] = [
  // ─── Public Repos (22) ───
  {
    name: "antigravity-coordinator",
    description: "Multi-agent orchestration experiments with parallel tasks, voting and configurable routing; no validated DQ accuracy claim",
    match: "RAG + AGENTS",
    matchLevel: "strong",
    visibility: "public",
  },
  {
    name: "ResearchGravity",
    description: "Research capture, MCP tools, stored context, hybrid retrieval and vector search",
    match: "RAG + SEARCH",
    matchLevel: "strong",
    visibility: "public",
  },
  {
    name: "meta-vengine",
    description: "Multi-provider routing with internal heuristics, recorded error patterns and monitoring",
    match: "AI + MONITORING",
    matchLevel: "strong",
    visibility: "public",
  },
  {
    name: "claude-command-center",
    description: "Session and tool analytics, streaming updates and AI-assisted implementation",
    match: "MONITORING + DATA",
    matchLevel: "strong",
    visibility: "public",
  },
  {
    name: "frontier-alpha",
    description: "Experimental factor and portfolio research interface; no validated investment-performance claim",
    match: "AI + FINANCE",
    matchLevel: "strong",
    visibility: "private",
  },
  {
    name: "notebooklm-mcp-cli",
    description: "Notebook and source-management tooling; fork of an upstream project",
    match: "AI WORKFLOWS",
    matchLevel: "strong",
    visibility: "public",
  },
  {
    name: "ucw",
    description: "Cross-platform AI session capture via MCP protocol, Claude, ChatGPT, Gemini, Grok",
    match: "MULTI-SERVICE AI",
    matchLevel: "strong",
    visibility: "public",
  },
  {
    name: "PageIndex",
    description: "Fork exploring reasoning-based document retrieval; original architecture by its upstream authors",
    match: "RAG INNOVATION",
    matchLevel: "strong",
    visibility: "public",
  },
  {
    name: "dicoangelo.metaventions",
    description: "Portfolio with verified career context, retrieval-assisted chat and AI-assisted role comparison",
    match: "AI-DIRECTED BUILD",
    matchLevel: "strong",
    visibility: "public",
  },
  {
    name: "voice-nexus",
    description: "Configurable voice pipeline connecting speech recognition, reasoning and speech synthesis",
    match: "AI + AUDIO",
    matchLevel: "strong",
    visibility: "public",
  },
  {
    name: "career-coach-mvp",
    description: "AI-assisted career feedback and simulated hiring-panel perspectives",
    match: "MULTI-AGENT",
    matchLevel: "partial",
    visibility: "public",
  },
  {
    name: "data-arch-guard",
    description: "Workflow guidance for reviewing duplicate stores and schema changes",
    match: "ARCHITECTURE",
    matchLevel: "partial",
    visibility: "public",
  },
  {
    name: "paper-to-production",
    description: "Implementation notes informed by other authors’ research; study status and validation vary",
    match: "RESEARCH + DOCS",
    matchLevel: "partial",
    visibility: "public",
  },
  {
    name: "FlowDesk",
    description: "Multi-monitor workspace automation for macOS, 5 layouts, auto-launch, smart hiding",
    match: "DEVTOOLS",
    matchLevel: "partial",
    visibility: "public",
  },
  {
    name: "The-Decosystem",
    description: "Sovereign AI systems, uncovering untapped value, synthesizing data streams",
    match: "ARCHITECTURE",
    matchLevel: "partial",
    visibility: "public",
  },
  {
    name: "Metaventions-AI-Landing",
    description: "Official landing page for Metaventions AI, Architected Intelligence",
    match: "BRAND",
    matchLevel: "partial",
    visibility: "public",
  },
  {
    name: "OpenViking",
    description: "Fork of an upstream context database for AI agents",
    match: "AI + DATABASE",
    matchLevel: "strong",
    visibility: "public",
  },
  {
    name: "cpb-core",
    description: "Multi-provider AI orchestration with configurable internal routing heuristics",
    match: "AI ORCHESTRATION",
    matchLevel: "partial",
    visibility: "public",
  },
  {
    name: "hive",
    description: "Fork of an upstream agent-development framework",
    match: "AGENTS",
    matchLevel: "partial",
    visibility: "public",
  },
  {
    name: "openclaw",
    description: "Fork of an upstream personal AI assistant",
    match: "AI ASSISTANT",
    matchLevel: "partial",
    visibility: "public",
  },
  {
    name: "DicoroseAngelo.github.io",
    description: "Original personal site, Black Amethyst Gem, futurist portfolio",
    match: "PORTFOLIO",
    matchLevel: "partial",
    visibility: "public",
  },
  {
    name: "Dicoangelo",
    description: "GitHub profile README, Architecting Sovereign AI Infrastructure",
    match: "PROFILE",
    matchLevel: "partial",
    visibility: "public",
  },
  // ─── Private Repos (19) ───
  {
    name: "OS-App",
    description: "Voice and multi-agent application prototype implemented with AI coding tools",
    match: "AI + AGENTIC SYSTEMS",
    matchLevel: "strong",
    visibility: "private",
  },
  {
    name: "FriendlyFace",
    description: "Collaborative AI evidence and traceability prototype with container configuration",
    match: "CONTAINERS + CLOUD",
    matchLevel: "strong",
    visibility: "private",
  },
  {
    name: "CareerCoachAntigravity",
    description: "AI-assisted résumé and role-comparison workflows with simulated hiring perspectives",
    match: "AI + NEXT.JS",
    matchLevel: "strong",
    visibility: "private",
  },
  {
    name: "agent-core",
    description: "Research session archives, project records and orchestration tools",
    match: "DATA + ORCHESTRATION",
    matchLevel: "strong",
    visibility: "private",
  },
  {
    name: "partnership-ai-orchestration",
    description: "The Partnership Graph: a hypothetical MCP-native concept demo for a partner-intelligence layer (not a launched product), designed to complement partner-tech tooling rather than compete with it",
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
    description: "Exploratory agent-workflow concept for manufacturing",
    match: "AI + MANUFACTURING",
    matchLevel: "strong",
    visibility: "private",
  },
  {
    name: "parallax",
    description: "Parallax, Architected Intelligence Engine by Metaventions",
    match: "AI ENGINE",
    matchLevel: "strong",
    visibility: "private",
  },
  {
    name: "jordan-signature-event",
    description: "Published event website with information, recap and gallery",
    match: "CLIENT DELIVERY",
    matchLevel: "strong",
    visibility: "private",
  },
  {
    name: "bxlence-hospitality",
    description: "BXLENCE Hospitality, neon-luxe ultra-luxury hospitality portfolio, Next.js + Supabase",
    match: "CLIENT DELIVERY",
    matchLevel: "strong",
    visibility: "private",
  },
  {
    name: "mass-fintech-hub",
    description: "Mass Fintech Hub, bootcamp mentoring platform, playbooks, coaching resources",
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
    description: "Historical enterprise concept and architecture presentation; projections are not achieved revenue",
    match: "STRATEGY",
    matchLevel: "partial",
    visibility: "private",
  },
  {
    name: "metaventions-pitch-deck-2026",
    description: "Metaventions AI Enterprise Pitch Deck 2026, updated investor materials",
    match: "STRATEGY",
    matchLevel: "partial",
    visibility: "private",
  },
  {
    name: "metaventions-landing",
    description: "Metaventions AI landing page, company site source",
    match: "BRAND",
    matchLevel: "partial",
    visibility: "private",
  },
  {
    name: "career-dossier",
    description: "Career management dossier, metrics, interview prep, resume artifacts",
    match: "CAREER",
    matchLevel: "partial",
    visibility: "private",
  },
  {
    name: "chrome-history-export",
    description: "Transform Chrome browsing history into AI-ready insights, multi-platform export",
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
    description: "Metaventions AI landing, legacy version archive",
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
    proof: "Container and Fly.io configuration for an evidence-workflow prototype; configuration is not an uptime or deployment-scale guarantee",
  },
  {
    project: "ClawdBot",
    files: "Dockerfile, fly.toml, docker-compose.yml",
    proof: "Container and Fly.io configuration for an AI assistant",
  },
  {
    project: "Frontier Alpha",
    files: "Dockerfile, docker-compose.yml",
    proof: "Docker configuration for an investment-research prototype",
  },
  {
    project: "Metaventions Landing",
    files: "Dockerfile",
    proof: "Docker configuration for a website",
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
  "Mastering Cloud Marketplaces, Partner Insight",
  "AI-First Product Leader (LinkedIn Learning)",
];
