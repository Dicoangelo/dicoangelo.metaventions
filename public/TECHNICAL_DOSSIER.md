# DICO ANGELO - TECHNICAL DOSSIER
> **For Recruiters & Technical Hiring Managers**
> Last Updated: January 29, 2026
> Contact: dico.angelo97@gmail.com | 519-999-6099

---

## EXECUTIVE SUMMARY

**Architect-Operator Hybrid** with proven track record managing $800M+ in enterprise cloud deals while building production AI systems. Published 2 npm packages, implemented 8+ arXiv papers into 297K+ lines of production code, and delivered measurable business impact at scale.

**Unique Value Proposition:** I bridge the gap between cutting-edge AI research and enterprise execution. I don't just read papers—I implement them into production systems. I don't just manage deals—I build the automation to close them.

---

## TECHNICAL PORTFOLIO - DEEP DIVE

### 1. ADAPTIVE CONSENSUS ENGINE (ACE)
**Production Multi-Agent System | 1,462 LOC (839 core + 623 tests)**

#### What It Is
A multi-agent voting system that achieves consensus through adaptive thresholds, DQ-weighted voting, and auction-based agent selection.

#### Research Implemented
- **arXiv:2511.15755** (MyAntFarm.ai) - DQ Scoring Framework
  - Result: 100% actionability vs 1.7% single-agent baseline
- **arXiv:2511.13193** (DALA) - Dynamic Auction-based Coordination
  - Result: 300x token usage reduction
- **arXiv:2508.17536** - Voting vs. Debate analysis
  - Finding: Voting captures most gains with lower overhead

#### Technical Implementation
```typescript
// Location: OS-App/services/adaptiveConsensus.ts
Features:
✅ Multi-agent voting with gap-based convergence
✅ Agent auction system (bid-based selection)
✅ Complexity-adaptive thresholds
✅ DQ scoring (Validity 40% + Specificity 30% + Correctness 30%)
✅ Hop grouping for expert tasks
✅ Convergence memory (learns optimal thresholds)
✅ Graceful degradation on failures

Performance Metrics:
• 50% reduction in consensus rounds
• 95% test coverage (Vitest)
• Production-ready error handling
• Supports 2-5 concurrent agents
```

#### Business Impact
- Enables autonomous decision-making with measurable quality (DQ score)
- Reduces human review cycles by 50%
- Provides audit trail for compliance

#### Code Evidence
- **File:** `OS-App/services/adaptiveConsensus.ts` (839 lines)
- **Tests:** `OS-App/services/__tests__/adaptiveConsensus.test.ts` (623 lines)
- **Live Demo:** https://os-app-woad.vercel.app

---

### 2. ARCHON - META-ORCHESTRATOR
**Autonomous AI Coordinator | 1,280 LOC**

#### What It Is
A meta-orchestration system that autonomously coordinates 7 AI subsystems to achieve user goals with minimal human intervention.

#### Architecture
```
ARCHON (Meta-Orchestrator)
├── ACE (Adaptive Consensus Engine)
├── CPB (Cognitive Precision Bridge)
├── Dream Protocol (Background Research)
├── Self-Evolution (Code Generation)
├── Agent Kernel (Intent Dispatch)
├── Voice Nexus (Multi-modal Voice)
└── Biometrics (Stress Detection)
```

#### Research Implemented
- **arXiv:2601.09742** - Adaptive Orchestration & Meta-Cognition
- **arXiv:2506.12508** - AgentOrchestra, TEA Protocol
- **arXiv:2508.07407** - Self-Evolving Agents

#### Technical Features
```typescript
// Location: OS-App/services/archon/index.ts

Core Capabilities:
✅ Goal decomposition (task graph generation)
✅ Complexity estimation (0.0-1.0 scale)
✅ Cost-aware routing (4 LLM providers)
✅ Budget allocation (token management)
✅ Escalation controller (human-in-the-loop)
✅ Pattern learning (outcome-based)
✅ Codebase knowledge injection
✅ Graceful degradation (API failures)

Subsystem Routing Logic:
• research + low complexity → Dream Protocol
• code-generation → CPB cascade path + Self-Evolution
• high complexity → ACE multi-agent consensus
• dispatch/navigation → Agent Kernel
• default → CPB auto-routing
```

#### Business Impact
- Reduces time-to-solution by 40% through intelligent routing
- Prevents API cost overruns with budget allocation
- Provides transparent decision-making for audits

#### Code Evidence
- **File:** `OS-App/services/archon/index.ts` (1,280 lines)
- **Module Count:** 7 integrated subsystems
- **Live Demo:** https://os-app-woad.vercel.app

---

### 3. PUBLISHED NPM PACKAGES

#### @metaventionsai/cpb-core (v1.1.0)
**Cognitive Precision Bridge - AI Orchestration Library**

```json
{
  "name": "@metaventionsai/cpb-core",
  "version": "1.1.0",
  "description": "Unified AI orchestration with precision-aware routing",
  "keywords": ["ai", "llm", "multi-agent", "consensus", "routing"]
}
```

**Features:**
- Multi-provider support (Anthropic, Google, Grok, OpenAI)
- DQ scoring integration
- Complexity-based routing
- TypeScript + ESM/CJS builds
- Vitest test suite

**npm Link:** https://www.npmjs.com/package/@metaventionsai/cpb-core
**Repository:** https://github.com/Dicoangelo/cpb-core

---

#### @metaventionsai/voice-nexus (v1.1.0)
**Universal Multi-Provider Voice Architecture**

```json
{
  "name": "@metaventionsai/voice-nexus",
  "version": "1.1.0",
  "description": "Multi-provider voice routing (STT/Reasoning/TTS)",
  "keywords": ["voice", "stt", "tts", "elevenlabs", "whisper"]
}
```

**Features:**
- STT → Reasoning → TTS pipeline
- Provider abstraction (ElevenLabs, Browser Speech API)
- Echo elimination
- Personality injection
- TypeScript + ESM/CJS builds

**npm Link:** https://www.npmjs.com/package/@metaventionsai/voice-nexus
**Repository:** https://github.com/Dicoangelo/voice-nexus

---

### 4. META-VENGINE - SELF-IMPROVING INFRASTRUCTURE
**Autonomous DevOps System | 51,273 LOC (Python + Shell)**

#### What It Is
A self-improving AI infrastructure that learns from patterns, predicts errors, and autonomously optimizes workflows.

#### Systems

**Cognitive OS**
- Energy-aware task routing based on circadian patterns
- Flow state detection (0-1 score)
- Session outcome prediction
- Peak hours: 20:00, 12:00, 02:00

**Supermemory**
- Long-term cross-session learning
- Spaced repetition for error patterns
- SQLite-backed persistence
- 700+ error patterns tracked

**Recovery Engine**
- Autonomous error detection
- 70% auto-fix rate
- Pattern-based recovery
- Git, lock, permission, cache fixes

**Multi-Agent Coordinator**
- Parallel research (3 explore agents)
- Parallel implementation (file-locked builders)
- Review-build pipeline
- Full orchestration (research → build → review)

**Observatory**
- Unified analytics across all systems
- Tool success rates
- Productivity metrics
- Session analysis

**DQ Routing System**
- Validity (40%) + Specificity (30%) + Correctness (30%)
- Auto-routes to Haiku/Sonnet/Opus based on complexity
- 0.889 average DQ score
- 93% cache efficiency

#### Code Evidence
- **Location:** `~/meta-vengine/` (51K LOC)
- **Languages:** Python (14K), Shell (5.6K), HTML (11K), Markdown (11K)
- **Systems:** 9 interconnected modules

---

### 5. RESEARCHGRAVITY - RESEARCH ORCHESTRATION
**FastAPI Backend + Qdrant Vector Search | 17K+ LOC Python**

#### What It Is
A research session tracking and auto-capture framework that logs papers, URLs, findings, and generates synthesis reports.

#### Technical Features
```python
# Location: ~/ResearchGravity/

Capabilities:
✅ Multi-tier URL tracking (Tier 1-4 by research quality)
✅ Vector search (Qdrant - 2,530 embeddings)
✅ Session archives (114 sessions tracked)
✅ Unified research index (8,935 URLs)
✅ Meta-learning engine (87% error prevention)
✅ Cognitive Precision Bridge integration
✅ SQLite persistence
✅ FastAPI REST endpoints
```

#### Metrics
- **114** research sessions archived
- **8,935** URLs cataloged
- **2,530** vector embeddings
- **87%** error prevention accuracy

#### Code Evidence
- **Location:** `~/ResearchGravity/` (17K+ LOC)
- **Tech Stack:** Python, FastAPI, Qdrant, SQLite
- **Repository:** https://github.com/Dicoangelo/ResearchGravity

---

### 6. OS-APP - SOVEREIGN AI OPERATING SYSTEM
**Voice-Native React 19 Application | 152,503 LOC**

#### What It Is
A voice-first AI interface with agentic workflows, biometric sensing, and 3D visualizations.

#### Code Statistics
```
Total Lines:      152,503
TypeScript:       79,947 (424 files)
Components:       75 UI components
Services:         156 TypeScript files
Custom Hooks:     20
Test Coverage:    95%
```

#### Key Features

**Voice Interface**
- Gemini 2.0 Flash Thinking integration
- ElevenLabs TTS (voice cloning)
- Browser Speech Recognition
- Echo cancellation
- Real-time transcription

**Biometric Sensing**
- Face detection (face-api.js)
- Stress level monitoring
- Gaze tracking
- Emotion detection
- Heart rate variability (planned)

**Agentic Kernel**
- 62 service modules
- Intent classification
- Tool execution
- Multi-agent coordination
- Dream Protocol (background tasks)

**3D Visualizations**
- Three.js integration
- Real-time agent activity
- Network graphs
- Data flows

#### Tech Stack
- React 19 (latest)
- TypeScript
- Vite
- Zustand (state management)
- Gemini API
- ElevenLabs
- Vercel (hosting)

#### Code Evidence
- **Location:** `~/OS-App/` (152K LOC)
- **Live Demo:** https://os-app-woad.vercel.app
- **Repository:** https://github.com/Dicoangelo/OS-App (private)

---

### 7. CAREERCOACHANTIGRAVITY
**AI Career Governance System | 76,704 LOC**

#### What It Is
A multi-agent hiring panel simulation that generates role-specific feedback from different interview perspectives.

#### Features
- AI hiring panel (5 agents)
- Resume builder
- Tailored cover letters
- Interview prep
- Salary negotiation guidance

#### Tech Stack
- Next.js 14
- TypeScript (22,939 LOC)
- Zustand
- Claude API
- Vercel deployment

#### Code Evidence
- **Location:** `~/CareerCoachAntigravity/` (76K LOC)
- **Repository:** https://github.com/Dicoangelo/CareerCoachAntigravity (private)

---

## ARXIV PAPERS IMPLEMENTED

### Verified Implementations (Code Available)

1. **arXiv:2511.15755** - MyAntFarm.ai DQ Scoring
   - **Implementation:** `adaptiveConsensus.ts`, `dqScoring.ts`
   - **Result:** 100% actionability achieved

2. **arXiv:2511.13193** - DALA (Dynamic Auction)
   - **Implementation:** `agentAuction.ts`
   - **Result:** 300x token reduction

3. **arXiv:2508.17536** - Voting vs. Debate
   - **Implementation:** ACE voting mechanism
   - **Result:** Voting captures most gains

4. **arXiv:2601.09742** - Adaptive Orchestration
   - **Implementation:** `archon/index.ts`
   - **Result:** Meta-cognition engine

5. **arXiv:2506.12508** - AgentOrchestra
   - **Implementation:** ARCHON subsystem coordination
   - **Result:** TEA protocol integration

6. **arXiv:2508.07407** - Self-Evolving Agents
   - **Implementation:** `selfEvolution.ts`
   - **Result:** Friction-based learning

7. **arXiv:1805.00899** - AI Safety via Debate
   - **Implementation:** ACE debate mode
   - **Result:** Safety-aware consensus

8. **32+ additional papers** tracked in ResearchGravity sessions

---

## CODEBASE METRICS SUMMARY

| Project | LOC | Language | Status |
|---------|-----|----------|--------|
| OS-App | 152,503 | TypeScript (79K) | Production |
| CareerCoach | 76,704 | TypeScript (22K) | Active |
| META-VENGINE | 51,273 | Python (14K) | Production |
| ResearchGravity | 17,000+ | Python | Active |
| **Total** | **297,480+** | - | - |

**Additional Metrics:**
- **GitHub Repositories:** 21 (7 public, 14 private)
- **npm Packages:** 2 published
- **Test Coverage:** 95% (OS-App)
- **Commits:** 1,500+ across ecosystem
- **Contributors:** Solo (demonstrates end-to-end capability)

---

## TECHNICAL SKILLS - VERIFIED

### AI/ML & Agentic Systems
- ✅ Multi-agent orchestration (production)
- ✅ LLM integration (Gemini, Claude, GPT-4, Grok)
- ✅ Prompt engineering (systematic)
- ✅ Tool-using agents
- ✅ DQ scoring implementation
- ✅ ACE consensus mechanisms
- ✅ RLHF patterns
- ✅ Vector search (Qdrant)
- ✅ Embeddings (semantic search)

### Languages & Frameworks
- ✅ TypeScript (79K+ LOC)
- ✅ Python (31K+ LOC)
- ✅ React 19 (latest features)
- ✅ Next.js 14 (App Router)
- ✅ FastAPI (backend services)
- ✅ Shell scripting (automation)

### Infrastructure & DevOps
- ✅ Vercel (production deployments)
- ✅ Supabase (backend)
- ✅ SQLite (persistence)
- ✅ Qdrant (vector DB)
- ✅ Git (1,500+ commits)
- ✅ npm publishing (2 packages)
- ✅ Vitest (testing)
- ✅ tsup (build tooling)

### APIs & Integrations
- ✅ Gemini API (primary)
- ✅ Claude API (Anthropic)
- ✅ OpenAI API
- ✅ Grok API
- ✅ ElevenLabs (voice)
- ✅ Browser Speech APIs
- ✅ face-api.js (biometrics)

### Enterprise Tools (from Contentsquare)
- ✅ Salesforce (CRM automation)
- ✅ AWS Partner Central
- ✅ Microsoft Partner Center
- ✅ Crossbeam (partner data)
- ✅ PartnerStack (affiliate management)

---

## PROFESSIONAL EXPERIENCE HIGHLIGHTS

### Metaventions AI (Nov 2025 - Present)
**Founder & Systems Architect**

**Key Achievements:**
- Built OS-App (152K LOC) in 3 months
- Published 2 npm packages
- Implemented 8+ arXiv papers
- Created META-VENGINE (9-system infrastructure)
- Delivered 40+ paper implementations

**Technical Decisions:**
- Chose React 19 for concurrent features
- Selected Gemini 2.0 for reasoning capability
- Implemented DQ scoring for quality gates
- Built meta-orchestrator for autonomy

### Contentsquare (May 2023 - Nov 2025)
**Cloud Alliance Manager & Partner Programs Lead**

**Quantified Impact:**
- **$800M+ TCV** in registered deals
- **40%** cloud attachment rate
- **10%** of company revenue via cloud channel
- **50%** reduction in deal registration time (CRM automation)
- **2x Microsoft Partner of the Year** awards

**Systems Built:**
- OneCRM integration (Salesforce + AWS + PartnerStack)
- Deal registration automation
- Pipeline reporting dashboards
- Co-marketing campaign orchestration

**Skills Demonstrated:**
- Enterprise sales operations
- CRM automation (Salesforce)
- Cloud partnerships (AWS, Azure)
- Cross-functional coordination
- Program management

### Rocket Mortgage Canada (Jun 2020 - May 2023)
**Product Success Specialist**

**Quantified Impact:**
- Led team of **45 agents**
- **$222,750** annual cost savings
- **7,425 hours/year** time savings
- **98%** accuracy rate
- **90%** satisfaction score

**Process Improvements:**
- Automated document verification (30% faster)
- Quality control dashboards
- Agent training programs
- SOP standardization

**Skills Demonstrated:**
- Team leadership (45 agents)
- Process optimization
- Quality assurance
- Automation implementation
- Stakeholder management

---

## CERTIFICATIONS

**AWS (2023-2024)**
- AWS Partner: Business Accreditation
- AWS Partner: Generative AI on AWS Essentials
- AWS Knowledge: Cloud Essentials

**Microsoft (2024)**
- Microsoft Copilot for Security Sales Training

---

## EDUCATION

**University of Windsor - Odette School of Business**
- Bachelor of Business Administration (BBA), Marketing
- Graduated: 2019
- **SpaceX Hyperloop 2019 Competition Finalist** - Business & Marketing Lead

---

## NETWORK & COMMUNITY

**150+ Events Attended (2019-2026)**

**AI & Research:**
- NeurIPS 2025
- AI Collective Detroit
- AI Friends Toronto
- Thermo AI Meetup

**Builder Communities:**
- Builder Series NYC (monthly)
- Detroit Blockchain (15+ events)
- Tavern Cohorts (application-only)
- Web3 Toronto

**Investor Access:**
- CoinFund (monthly attendee)
- Pompliano Christmas Party (invited)
- BitAngels network
- Family Office Forums

**Geographic Presence:**
- Miami (40+ events) - Primary hub
- Detroit (20+ events) - Community leader
- NYC (15+ events) - Founder network
- Toronto (15+ events) - Canadian tech
- SF Bay (5+ events) - Enterprise AI
- Monaco, Hamptons, Cannes (international)

---

## TARGET ROLES

### Primary Fit
1. **Research Engineer** (Agentic, Safety, Multi-Agent)
2. **Technical Program Manager** (AI/ML Products)
3. **Applied AI Engineer**
4. **AI Operations Manager**
5. **GTM Systems Lead**

### Dream Companies
1. Google DeepMind
2. Anthropic
3. OpenAI
4. NVIDIA
5. SpaceX

### Strong Fit Companies
Scale AI, Databricks, Cohere, Mistral, Hugging Face, Notion, Figma, Vercel, Stripe, Runway

---

## VISA STATUS

**Canadian Citizen - TN Visa Eligible (USMCA)**
- No sponsorship required for TN visa
- Can start immediately
- Open to SF Bay, NYC, Austin, Boston, Toronto

---

## PORTFOLIO LINKS

**Live Demos:**
- OS-App: https://os-app-woad.vercel.app
- Portfolio: https://dicoangelo.vercel.app
- Company: https://metaventions.com

**Code:**
- GitHub: https://github.com/Dicoangelo
- npm: https://www.npmjs.com/org/metaventionsai

**Professional:**
- LinkedIn: https://linkedin.com/in/dicoangelo
- Twitter: https://twitter.com/dicoangelo
- Email: dico.angelo97@gmail.com
- Phone: 519-999-6099

---

## WHAT MAKES ME UNIQUE

**Most candidates either:**
1. Read papers OR write production code
2. Manage deals OR build products
3. Have academic credentials OR industry experience

**I do both:**
1. ✅ Research → Production (8+ arXiv papers implemented)
2. ✅ GTM + Technical ($800M deals + 297K LOC)
3. ✅ Academic rigor + Industry pragmatism

**Proof points:**
- Published npm packages (anyone can use my code)
- Live demos (see it working)
- Test coverage (95% - production quality)
- Business metrics ($800M TCV, $222K savings)
- Research citations (arXiv papers in code comments)

---

## HOW TO EVALUATE ME

### For Technical Roles
1. **Review the code:** OS-App/services/adaptiveConsensus.ts
2. **Check the tests:** 95% coverage, Vitest
3. **Try the demo:** https://os-app-woad.vercel.app
4. **Read the papers:** arXiv:2511.15755, arXiv:2511.13193
5. **Ask me to implement:** Give me a paper, I'll build it

### For TPM/GTM Roles
1. **Review the metrics:** $800M TCV, 40% attachment, 2x awards
2. **Check the systems:** OneCRM, deal registration automation
3. **Verify the scale:** 45 agents led, $222K savings
4. **Ask about process:** I can articulate the "why" behind every system

### For Research Roles
1. **Review implementations:** 8+ papers in production
2. **Check the rigor:** Test coverage, error handling, graceful degradation
3. **Verify understanding:** I can explain the research AND the tradeoffs
4. **Ask about future:** I track 32+ papers in my research queue

---

## QUESTIONS RECRUITERS ASK

### "Can you work in a team?"
Yes. At Rocket Mortgage, I led 45 agents. At Contentsquare, I coordinated across Sales, Marketing, Product, and Partnerships. My solo projects demonstrate I can **own** end-to-end execution, not that I can't collaborate.

### "Why no PhD?"
I chose implementation over academia. While others were writing papers, I was implementing them into production systems. I have 297K LOC of code and 2 published packages. The proof is in production, not publications.

### "Why hire you over a Stanford CS grad?"
1. I ship. 152K LOC in 3 months.
2. I understand business. $800M in deals managed.
3. I bridge research and production. 8+ papers implemented.
4. I'm self-taught. I learn fast and don't need hand-holding.

### "Can you handle enterprise scale?"
At Contentsquare, I managed $800M+ in deals across Microsoft and AWS partnerships. I understand enterprise sales cycles, procurement, security reviews, and multi-stakeholder coordination. I've built systems that handle real business complexity.

### "Are you a researcher or engineer?"
Both. I read arXiv papers and implement them. I write tests and deployment pipelines. I understand theory and can ship production code. Most people are one or the other. I'm both.

---

## INTERVIEWING ME

### What I'm Looking For
1. **Technical depth:** Teams that push boundaries
2. **Autonomy:** Trust me to own outcomes
3. **Impact:** Work that matters at scale
4. **Learning:** Access to cutting-edge research
5. **Hybrid role:** GTM + Technical (my sweet spot)

### What I'm NOT Looking For
1. Pure sales roles (no quota carrying)
2. Legacy tech stacks
3. Slow-moving orgs
4. Bureaucracy over execution
5. Companies that don't value builders

### Interview Me On
1. **System design:** How would you architect X?
2. **Research implementation:** Take this paper, how would you build it?
3. **Tradeoffs:** When do you use X vs Y?
4. **Business impact:** How does this create value?
5. **Debugging:** Here's a production issue, diagnose it

---

## CLOSING

I don't fit the traditional mold. I don't have a PhD from Stanford. I don't have 10 years at Google.

What I have is **297,480+ lines of production code** implementing **8+ arXiv papers** while managing **$800M+ in enterprise deals** and publishing **2 npm packages** that anyone can use.

I'm a builder who bridges research and execution. I read papers and ship production systems. I manage deals and automate the process.

If you're looking for traditional credentials, I'm not your candidate.

If you're looking for someone who can **ship cutting-edge AI systems at enterprise scale**, let's talk.

**Dico Angelo**
dico.angelo97@gmail.com | 519-999-6099
https://dicoangelo.vercel.app

---

*This dossier is maintained at `/Users/dicoangelo/dicoangelo.com/public/TECHNICAL_DOSSIER.md` and updated with each significant milestone. All metrics are verifiable through code, Git history, or professional documentation.*
