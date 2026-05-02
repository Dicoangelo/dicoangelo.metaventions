/**
 * Query archetype detection — fast, no LLM call.
 *
 * Classifies the latest user message into hints about who's asking
 * and what role lane the question is about. The chat retrieval layer
 * uses these hints to bias which artifacts get surfaced first.
 *
 * Pattern-based on purpose: zero added latency for chat. Imperfect
 * classification is fine — the index still shows all artifacts, the
 * archetype just biases ordering/emphasis.
 */

export type Audience = "recruiter" | "partner" | "peer-engineer" | "investor" | "general";

export type RoleCut =
  | "partner-ops"
  | "cloud-alliance"
  | "gtm-systems-architect"
  | "revops-ai-infra"
  | "solutions-architect"
  | "founder-cto"
  | "applied-ai-product"
  | "general";

export interface QueryArchetype {
  audience: Audience;
  role_cuts: RoleCut[];
  matched_signals: string[];
}

interface PatternMap {
  [key: string]: string[]; // regex source -> signal label
}

const AUDIENCE_PATTERNS: Record<Exclude<Audience, "general">, PatternMap> = {
  recruiter: {
    "salary|comp(ensation)?|pay range|expected salary": ["salary"],
    "work auth|visa|tn visa|sponsorship|h-?1b|relocation|immigrat": ["work-auth"],
    "available|availability|start date|notice period|how soon|ramp": ["availability"],
    "fit for|good fit|right fit|is he a fit|suitable": ["fit-question"],
    "screening|screen|recruiter|hiring manager|interview": ["screening"],
    "open to (work|moving|relocat)|looking for|seeking": ["job-search"],
    "(elevator|30.second|2.minute|short) (pitch|summary|version)": ["pitch-request"],
  },
  partner: {
    "partnership|partner ops|cloud alliance|co-?sell|co-?build": ["partnership"],
    "(integration|integrate) with|api|connector|webhook": ["integration"],
    "marketplace|cppo|ace|private offer|listing": ["marketplace-mech"],
    "(aws|microsoft|azure|gcp|google cloud).{0,30}(partner|alliance|deal|registration)": ["hyperscaler-partner"],
    "(suger|tackle|crossbeam|reveal|partnerstack)": ["partner-tooling"],
    "tcv|deal value|attached revenue|partner.sourced": ["partner-revenue"],
  },
  "peer-engineer": {
    "how does (he|the|it) (build|architect|implement|design)": ["build-deep"],
    "architecture|system design|stack|tech stack|repo|codebase": ["arch-question"],
    "rag|embedding|vector|chunking|cohere|deepseek": ["rag-stack"],
    "mcp|protocol|server|tool calling": ["mcp-question"],
    "(typescript|python|next\\.?js|react|tailwind|node)": ["lang-stack"],
    "model context protocol|claude code|sonnet|opus": ["claude-stack"],
    "git ?hub|commit|deploy|ci|vercel": ["devops"],
    "arxiv|paper.{0,30}(implement|production|to.code|to.prod)|implement.{0,30}paper": ["paper-to-prod"],
    "agent(ic)?|orchestration|multi.agent|sub.?agent": ["agentic-systems"],
  },
  investor: {
    "token|tokenomics|\\$meta|vesting|allocation|sale": ["token"],
    "tam|sam|som|market size|addressable market": ["market-sizing"],
    "valuation|round|raise|fundraising|seed|series [a-z]": ["fundraising"],
    "moat|defensib(ility|le)|competitive advantage|positioning": ["moat"],
    "monetization|revenue model|business model|unit economics": ["business-model"],
    "thesis|whitepaper|cognitive equity|sovereign(ty)?": ["thesis"],
    "basix|index|portfolio": ["basix"],
  },
};

const ROLE_CUT_PATTERNS: Record<Exclude<RoleCut, "general">, PatternMap> = {
  "partner-ops": {
    "partner ops|partner operations|alliance ops|alliance operations": ["partner-ops-direct"],
    "operationali[sz]|ops backbone|operational layer": ["ops-language"],
    "deal registration|deal reg|approval rate|attachment scoring": ["partner-process"],
  },
  "cloud-alliance": {
    "cloud alliance|hyperscaler alliance|cloud partner": ["cloud-alliance-direct"],
    "(aws|microsoft|azure|gcp).{0,30}(alliance|gtm|co-?sell|marketplace|listing|cppo|ace|private offer)": ["hyperscaler-alliance"],
    "(aws|azure) marketplace|gcp marketplace|aws marketplace": ["marketplace-direct"],
    "msft|microsoft partner of the year|sca|strategic collaboration": ["msft-alliance"],
  },
  "gtm-systems-architect": {
    "gtm systems|gtm architect|revenue ops|salesforce|crm architect": ["gtm-systems-direct"],
    "automation|workflow|crm integration|onecrm": ["gtm-tooling"],
  },
  "revops-ai-infra": {
    "revops|revenue operations": ["revops-direct"],
    "ai infra|ai infrastructure|ai-native": ["ai-infra"],
  },
  "solutions-architect": {
    "solutions architect|solutions engineer|presales|pre-?sales": ["sa-direct"],
    "demo|poc|proof of concept|customer architecture": ["sa-activity"],
  },
  "founder-cto": {
    "founder|cto|technical co-?founder|chief technology": ["founder-direct"],
    "metaventions|antigravity|sovereign ai|ucw|universal cognitive|black ?amethyst": ["metaventions-stack"],
    "\\$meta\\b|meta token|cognitive equity": ["meta-token"],
    "ship(ped|ing)?|build(s|ing)? in public|solo built|founder mode": ["founder-mode"],
  },
  "applied-ai-product": {
    "applied ai|ai product|ai pm|product strategist": ["applied-direct"],
    "agentic|multi-?agent|orchestrat|coordination": ["agentic-systems"],
    "rag|vector|embedding|llm|gen ?ai|generative": ["genai-product"],
  },
};

function matchAny(text: string, patterns: PatternMap): { matched: boolean; signals: string[] } {
  const signals: string[] = [];
  for (const [pattern, labels] of Object.entries(patterns)) {
    if (new RegExp(pattern, "i").test(text)) {
      signals.push(...labels);
    }
  }
  return { matched: signals.length > 0, signals };
}

export function detectArchetype(latestUserMessage: string): QueryArchetype {
  const text = (latestUserMessage ?? "").toLowerCase();
  if (!text || text.length < 3) {
    return { audience: "general", role_cuts: ["general"], matched_signals: [] };
  }

  const allSignals: string[] = [];

  // Audience: take the highest-signal-count category, with priority order
  // recruiter > investor > partner > peer-engineer (recruiter wins ties because
  // chat is on a portfolio site optimized for hiring conversations)
  const audienceScores: Array<{ aud: Audience; signals: string[] }> = [];
  for (const aud of ["recruiter", "investor", "partner", "peer-engineer"] as const) {
    const { signals } = matchAny(text, AUDIENCE_PATTERNS[aud]);
    if (signals.length) audienceScores.push({ aud, signals });
  }
  audienceScores.sort((a, b) => b.signals.length - a.signals.length);
  const audience: Audience = audienceScores[0]?.aud ?? "general";
  if (audienceScores[0]) allSignals.push(...audienceScores[0].signals.map((s) => `aud:${s}`));

  // Role cuts: collect ALL matching role-cut patterns (multi-label)
  const role_cuts: RoleCut[] = [];
  for (const role of [
    "partner-ops",
    "cloud-alliance",
    "gtm-systems-architect",
    "revops-ai-infra",
    "solutions-architect",
    "founder-cto",
    "applied-ai-product",
  ] as const) {
    const { matched, signals } = matchAny(text, ROLE_CUT_PATTERNS[role]);
    if (matched) {
      role_cuts.push(role);
      allSignals.push(...signals.map((s) => `role:${s}`));
    }
  }
  if (role_cuts.length === 0) role_cuts.push("general");

  return { audience, role_cuts, matched_signals: allSignals };
}
