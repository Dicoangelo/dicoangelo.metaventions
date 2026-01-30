# DICO ANGELO - TECHNICAL DOSSIER
> **For Recruiters & Technical Hiring Managers**
> Last Updated: January 29, 2026
> Contact: dico.angelo97@gmail.com | 519-999-6099

---

## EXECUTIVE SUMMARY

**Architect-Operator Hybrid** with proven track record building operational infrastructure that processed $800M+ in cloud marketplace deal registrations while shipping production AI systems. Published 2 npm packages, implemented 8+ arXiv papers into 297K+ lines of production code, and delivered measurable business impact at scale.

**Unique Value Proposition:** I bridge the gap between cutting-edge AI research and enterprise operations. I don't just read papers—I implement them into production systems. I don't just register deals—I build the automation infrastructure that makes them flow at scale.

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

## GITHUB REPOSITORIES - COMPLETE LIST

### Core AI Systems
| Repository | Language | Description |
|------------|----------|-------------|
| **OS-App** | TypeScript | Sovereign AI Operating System — Voice-native, multi-agent interface powered by Gemini Live & ElevenLabs |
| **meta-vengine** | Python | THE CLOSED LOOP — The system that improves itself. Bidirectional Co-Evolution, HSRGS Routing, D-Ecosystem |
| **ResearchGravity** | Python | Metaventions AI Research Framework — Multi-tier signal capture for frontier intelligence |
| **agent-core** | Python | Unified research orchestration for CLI, Antigravity, and web — Innovation Scout, URL logging, cross-environment sync |

### Career & Professional Tools
| Repository | Language | Description |
|------------|----------|-------------|
| **CareerCoachAntigravity** | TypeScript | Sovereign Career Intelligence — AI-powered positioning, skill graphs, and multi-agent hiring simulation |
| **career-coach-mvp** | TypeScript | AI Hiring Panel Verdict - Multi-agent resume analysis with Nexus Engine |
| **dicoangelo.com** | TypeScript | Personal portfolio site - Builder-Operator Hybrid showcasing AI systems and enterprise GTM experience |

### Published npm Packages
| Repository | Language | Description |
|------------|----------|-------------|
| **cpb-core** | TypeScript | Cognitive Precision Bridge - AI orchestration with precision-aware routing through RLM, ACE, and DQ scoring |
| **voice-nexus** | TypeScript | Universal multi-provider voice architecture - seamless routing between STT, reasoning, and TTS providers |

### Investor & Enterprise Materials
| Repository | Language | Description |
|------------|----------|-------------|
| **enterprise-deck** | HTML | Metaventions Enterprise Pitch Deck |
| **sovereign-deck** | HTML | Metaventions AI — Investor presentation and pitch deck materials |
| **metaventions-pitch-deck-2026** | HTML | Metaventions AI Enterprise Pitch Deck - Protocol substrate ownership, 94% margin model |
| **Metaventions-AI-Landing** | TypeScript | Official landing page for Metaventions AI — Architected Intelligence |

### Productivity & Utilities
| Repository | Language | Description |
|------------|----------|-------------|
| **FlowDesk** | Lua | Multi-monitor workspace automation for macOS — 5 layouts, auto-launch, smart hide, numpad controls |
| **chrome-history-export** | Python | Transform Chrome browsing history into AI-ready insights. Multi-platform export optimized for NotebookLM, Gemini, Grok, Cursor |

### Brand & Identity
| Repository | Language | Description |
|------------|----------|-------------|
| **Dicoangelo** | Markdown | Profile README — Architecting Sovereign AI Infrastructure |
| **The-Decosystem** | Markdown | Uncovering Untapped Value, Synthesizing Data Streams, Building Sovereign Outputs |

**Note:** 14 repositories are private (proprietary code). 7 are public for demonstration and open-source contribution.

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

### Enterprise Partner Tools (from Contentsquare)
- ✅ Salesforce (CRM automation)
- ✅ AWS Partner Central / AWS ACE
- ✅ Microsoft Partner Center (MPN)
- ✅ PartnerStack (affiliate management)
- ✅ Reveal (partner data, MACC reporting admin)
- ✅ Suger (AI marketplace automation - admin, thought leader)
- ✅ SuperGlue (AI workflow automation)
- ✅ Skilljar (training/LMS integration)
- ✅ Tableau (data visualization)
- ✅ Monday.com (project management)
- ✅ Miro (lifecycle mapping, process design)
- ✅ Crossbeam (account mapping)
- ✅ AirTable (database/project management)

### Mortgage & Financial Tools (from Rocket Mortgage / Edison)
- ✅ Finmo (mortgage origination)
- ✅ Lendesk (mortgage platform)
- ✅ Floify (loan origination)
- ✅ DocuSign (e-signatures)
- ✅ Lender Portals (multi-lender integrations)
- ✅ Product Board (product management)
- ✅ Wrike (project management)

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

### Contentsquare (Jan 2022 - Nov 2025)
**Cloud Alliance Operations Lead | Systems Integration | Partner Intelligence | Platform Administration**

**Role:** Operations lead (team of 3) building infrastructure that enabled $30M+ ACV growth through AWS and Microsoft partnerships.

**Scope of Work:**
Operated across four concurrent tracks: (1) cloud alliance operations with AWS and Microsoft (deal registration, marketplace operations, PRACR reporting), (2) systems integration architecture across CRM, PRM, and data platforms, (3) partner intelligence and reporting infrastructure (50+ dynamic reports), and (4) platform administration for GTM tools. Led multiple iteration workstreams while managing program consolidation across 3 acquired companies (Contentsquare, Hotjar, Heap).

**Key Metrics:**
- Registered/processed **$800M+ TCV** through cloud marketplace systems
- **2,500+ deal registrations** with 97% approval rate
- Built automation reducing manual work by 90% (registration time: 8 min → 30 sec)
- 600+ deals/quarter processing capacity
- Platform admin: Salesforce, AWS ACE, Microsoft Partner Center, PartnerStack, Reveal, Suger

---

#### Track 1: Alliance Strategy & Revenue Impact

**2024 Metrics:**
- **$30M+ ACV growth** via AWS and Microsoft partnerships (single year)
- **$19M marketplace milestone** achieved
- **3,000+ co-sell registrations** processed
- **300+ partners onboarded** with tiered governance frameworks
- **2x Microsoft Partner of the Year** awards

**Career-Span Metrics:**
- **$800M+ TCV** in registered deals
- **40%** cloud attachment rate
- **10%** of company revenue via cloud channel

**Partner Program Impact:**
- Partners contributed to **50%+ of new business** (new logos)
- Partner-involved deals are **31% larger** on average
- **5.4x more likely to convert** with 2+ partners involved
- **2.5x less churn** with 1 integration → **5.2x less** with 2+

---

#### Track 2: Systems Integration Architecture

**Work Stream Leadership:**
Led the **Systems & Admins work stream** with weekly cross-functional coordination across engineering, product, data architecture, legal, privacy, and finance.

**Integration Layer Owned:**
- **Salesforce ↔ AWS ACE**: Co-sell data sync, deal attribution, partner lifecycle traceability
- **Salesforce ↔ PartnerStack**: Lead routing, deal registration, commission calculation
- **Crossbeam Integration**: Account mapping, co-sell overlays, strategic account activation
- **Data Warehouse Integration**: Event tracking for ACV/TCV-based commission models
- Built internal bridging solutions where automated integrations weren't production-ready

**PartnerStack ↔ Salesforce UAT Leadership:**
Led end-to-end User Acceptance Testing for the PartnerStack-Salesforce bidirectional sync, ensuring data integrity across partner operations.

*Test Coverage Designed & Executed:*
- **Partner Registration Flow**: Application submission → account verification → T&S acceptance → Salesforce sync validation
- **Bidirectional Data Sync**: Partner profile updates, group transfers, manager assignments syncing between PRM ↔ CRM
- **Deal Registration Pipeline**: Referral partner deal submissions → lead creation in Salesforce with proper attribution (source, partner key, deal key)
- **Contract Lifecycle**: Agreement creation, status transitions (Target → Active), signee tracking
- **Hotjar/Contentsquare Migration**: Partner consolidation planning across acquired entities

*UAT Outcomes:*
- Validated 10+ integration test cases across registration, sync, and deal flows
- Identified critical sync gaps (owner/manager bidirectional sync failures) for engineering remediation
- Documented field mapping requirements: billing address, partner key, employee count, sessions, referral source
- Enabled 3,000+ partner ecosystem to operate on unified PRM-CRM infrastructure

**Iteration Workstreams Delivered:**
| Iteration | Objective | Outputs |
|-----------|-----------|---------|
| **V1 – AWS CRM** | Salesforce ↔ AWS Partner Central alignment | Automation, accuracy, co-sell data sync |
| **V1 – SCA AWS PM** | Structured execution on AWS workstreams | Roadmap management, escalation handling |
| **V1 – Product Innovation** | Co-sell/market enhancements via partner integrations | GTM accelerators, revenue innovation |
| **V1 – Cloud Intelligence** | Scalable intelligence layer for partnerships | Dashboards, propensity models, pipeline scoring |
| **V1 – Reveal** | Operationalize Reveal for Microsoft/AWS GTM | MACC reporting, co-sell overlays |
| **Infinite – R&D** | Vision-casting and future tooling | AI forecasting, Fabric/PRM design thinking |

---

#### Track 3: Partner Intelligence & Reporting

**Cloud Intelligence Layer Built:**
- **Executive Dashboards**: Microsoft, AWS, NA, Global rollups
- **Propensity Frameworks**: Scoring models for partner-led pipeline
- **Pipeline Scoring Systems**: Real-time deal health and conversion probability
- **QBR/MBO Reporting**: Quarterly business reviews, objective tracking
- **50+ dynamic reports** powering partner insights across teams

**Reporting Cadence:**
- Deal-level breakdowns with partner-aligned KPIs
- Quarterly review packages (MSFT Q4, AWS QPR)
- Executive-level summaries for leadership consumption

---

#### Track 4: Platform Administration

**Full Admin Ownership:**
| Platform | Role | Scope |
|----------|------|-------|
| **Reveal** | Platform Administrator | MACC reporting, co-sell overlays, strategic account activation |
| **Suger** | Admin + Thought Leader | AI marketplace automation, public recognition |
| **PartnerStack** | Core PRM Admin | 3,000+ partner ecosystem management |
| **Salesforce** | CRM Workflows | Deal registration, lead routing, attribution |
| **AWS ACE** | Partner Central | Co-sell registration, opportunity tracking |
| **MSFT MPN** | Partner Center | Benefits, co-sell, marketplace |
| **Skilljar** | Partner University | Training/LMS integration |
| **Crossbeam** | Account Mapping | Partner overlap analysis |

**Additional Tools:** Tableau, Monday.com, Miro, SuperGlue

---

#### Program Design & Governance

**Tiered Partner Ecosystem (3-program consolidation):**
- **Premier Tier** (~50 partners): Dedicated PSMs, MDF, joint business planning, beta access
- **Select Tier** (~200 partners): Monthly check-ins, directory listing, moderate support
- **Member Tier** (~3,000 partners): Scalable automation via PartnerStack + Skilljar

**Commission Models Designed:**
- **PLG (Product-Led Growth)**: Flat 15% on paid ACV (first 12 months)
- **SLG (Sales-Led Growth)**: 10-15% on committed TCV
  - Sourcing: 10% (15% for Premier)
  - Co-sell + Fulfill: 15%
  - Standalone Fulfill: 10%

**Automation Impact:**
- **60% reduction** in manual effort through deal registration automation
- **10% pipeline boost** via Suger + Salesforce integration

---

#### Operational Framework: "Laws of Organization"
Personal methodology applied across all workstreams:
1. **Automation** - Eliminate repetitive manual work
2. **Data** - Evidence-based decision making
3. **Synergy** - Cross-functional alignment
4. **Velocity** - Optimize for speed-to-value

---

#### Recognition
- "Best-in-class" reporting — executive praise
- Suger thought leader — public recognition
- 2x Microsoft Partner of the Year contributor
- **Catalyst 2026 Speaker** — Featured testimonial: *"Catalyst gave us the opportunity to connect meaningfully with partner leaders through deep, topic-driven discussions. It was an incredible experience."* ([source](https://www.joincatalyst.com/catalyst26))
- **1159.ai Innovation Workshop** — Featured testimonial on rapid prototyping and iterative design: *"This workshop highlighted the importance of rapid prototyping and the benefits of working in a creative environment... The iterative process we followed enabled us to test and refine our ideas rapidly, collaboratively engaging with previous iterations to find the best solution."* ([source](https://blog.1159.ai/the-art-and-science-of-innovation))
- **Suger.io Case Study** — Featured in vendor case study as Cloud Alliance Operations Lead: *"Suger has been a game-changer for us, their platform has not only streamlined our marketplace management but also allowed us to grow our cloud partnerships with AWS and Azure in ways we never thought possible. It's more than just a tool—it's become an extension of our team."* ([source](https://www.suger.io/blog/how-suger-help-contentsquare-grow-partnerships-without-limits))

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

**Product & Systems Ownership:**
- **System Administrator** for multiple platforms (Finmo, Lendesk, Floify, DocuSign)
- Product owner prioritization of backlog features
- Wrote user stories for tech product development
- Agile methodology implementation
- Conducted market research and scheduled product demos with external companies
- Created and maintained onboarding processes and product maintenance documentation

**Skills Demonstrated:**
- Team leadership (45 agents)
- Process optimization
- Quality assurance
- Automation implementation
- Stakeholder management
- Product ownership & backlog management

---

### Edison Financial (Jul 2021 - Apr 2022)
**Document Review Specialist** *(Concurrent with Rocket Mortgage)*

**Impact:**
- Processed and analyzed technology documents for operations at high speed
- Provided technical support for operations team, clients, and agents
- Successfully reduced the number of documents needed to process while maintaining pipeline quality
- Improved financial opportunity throughput from application start to funding

---

### Bridge Training Services - Up2Youth (Mar 2019 - Present)
**Director & Project Administrator**

**Leadership Scope:**
- Serve as Director of Bridge Training Services and project administrator
- Operate workshops focused on educating, employing, and developing general skills in youth
- Oversee organizational functions including financing, marketing, and accounting

**Partnerships:**
- **Ontario Trillium Foundation** — Grant partnership
- **United Way** — Community partnership

**Community Impact:**
- Train and mentor at-risk youth through sports and personal development
- Seek sponsorships and maintain program website and social media
- Marketing coordinator for outreach initiatives

*This role demonstrates non-profit leadership, community engagement, and youth mentorship outside of corporate experience.*

---

## CERTIFICATIONS

**AWS (2023-2024)**
- AWS Partner: Business Accreditation
- AWS Partner: Generative AI on AWS Essentials
- AWS Knowledge: Cloud Essentials

**Microsoft (2024)**
- Microsoft Copilot for Security Sales Training

**Cloud & AI Development**
- Azure Development Learning Certifications
- Artificial Intelligence Strategies for Business
- Mastering Cloud Marketplaces: Partner Insight

**Professional Development**
- Project Management Professional Development (Coursera)

---

## EDUCATION

**University of Windsor - Odette School of Business**
- Bachelor of Business Administration (BBA), Marketing
- Graduated: 2019
- **SpaceX Hyperloop 2019 Competition Finalist** — Engineering Business Marketing Lead for UWindsor Loop team

---

## LEADERSHIP & EXTRACURRICULARS

**University of Windsor (2015-2019)**

| Role | Organization | Duration |
|------|--------------|----------|
| **Engineering Business Marketing Lead** | UWindsor Hyperloop (SpaceX Competition) | Sept 2018 - Aug 2019 |
| **VP of Marketing** | Odette High School Leadership Initiative | Sept 2015 - 2019 |
| **Lead Mentor** | Enactus Windsor | Jan 2016 - May 2017 |
| **Lead** | AIESEC Windsor | Sept 2015 - 2018 |

**What This Demonstrates:**
- Early leadership pattern (4 concurrent leadership roles)
- Marketing expertise across technical and non-profit contexts
- Mentorship and community building
- International exposure (AIESEC is global organization)

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

**Web3 & Blockchain Conferences:**
- **Capital Factory** — Austin
- **Miami Art Basel / Miami Hack Week** — Miami
- **NFT NYC** — New York
- **Blockchain Futurist / EthToronto** — Toronto

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
- Company: https://metaventionsai.com

**Code:**
- GitHub: https://github.com/Dicoangelo
- npm: https://www.npmjs.com/org/metaventionsai

**Professional:**
- LinkedIn: https://linkedin.com/in/dicoangelo
- Twitter: https://x.com/dicoangelo
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
At Contentsquare, I built operational infrastructure that processed $800M+ in cloud marketplace deal registrations across Microsoft and AWS partnerships. I understand enterprise sales cycles, procurement, security reviews, and multi-stakeholder coordination. I've built systems that handle real business complexity at scale (2,500+ registrations, 600+ deals/quarter capacity).

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

---

## THE D-ECOSYSTEM - DEEP ARCHITECTURE

### Core Thesis: Systems That Evolve Themselves

Every project implements one recursive pattern:

```
OBSERVE → SYNTHESIZE → BUILD → COMPOUND
     ↑__________________________|
```

| Project | Observe | Synthesize | Build | Compound |
|---------|---------|------------|-------|----------|
| **OS-App** | Biometric sensors + friction signals | Multi-agent consensus | Self-evolution protocol | Convergence memory |
| **CareerCoach** | Resume text + job descriptions | Nexus Engine (NSRG) | Chameleon narratives | Skill graph propagation |
| **ResearchGravity** | Multi-tier sources | Thesis-Gap-Direction | Session archives | Cross-project lineage |

---

### META-VENGINE: The 9 Systems

META-VENGINE is a **bidirectional co-evolution engine** — a sophisticated self-improving AI productivity system containing 9 integrated systems across 2,051 code artifacts.

#### System 1: Cognitive OS — Energy-Aware Routing
**Purpose:** Time-aware cognitive modeling that predicts session outcomes and protects flow states.

**Implementation:** Python (`~/.claude/kernel/cognitive-os.py` — 1,901 LOC)

**Features:**
- 5 cognitive modes (morning, peak, dip, evening, deep_night)
- SessionFate Predictor for completion probability
- FlowState Protector (defers alerts when flow >0.75)
- PersonalRouter for energy-aware model selection
- Peak hours tracked: 20:00, 12:00, 02:00

#### System 2: DQ Routing System — Decision Quality Model Selection
**Purpose:** Intelligent multi-model routing (Haiku/Sonnet/Opus) using DQ scoring.

**Implementation:** JavaScript/Python (`~/.claude/kernel/dq-scorer.js` — 21,910 LOC)

**Algorithm:**
```
DQ Score = Validity (40%) + Specificity (30%) + Correctness (30%)

Route to:
- Haiku (0.0-0.30): Simple queries
- Sonnet (0.30-0.70): Code generation
- Opus (0.70-1.00): Complex reasoning
```

**Metrics:**
- 428 routing decisions tracked
- 0.889 average DQ score
- 93% cache efficiency

#### System 3: Recovery Engine — Self-Healing Infrastructure
**Purpose:** Automatic error detection and remediation.

**Implementation:** Python (`~/.claude/kernel/recovery-engine.py`)

**Coverage:** 94% (655/700 historical patterns)

**Categories:** Git errors, concurrency, permissions, quota, crash, recursion, syntax

**Auto-Fix Actions:**
- `fix_username_case` — Correct GitHub username
- `clear_git_locks` — Remove stale locks
- `reset_permissions` — Fix file access
- `rebuild_cache` — Clear corrupted state

#### System 4: Supermemory — Cross-Session Intelligence
**Purpose:** Transform telemetry into compounding cross-session knowledge.

**Implementation:** Python/SQLite (`~/.claude/kernel/supermemory.py` — 1,051 LOC)

**Components:**
- Session Synthesis — Post-session learning extraction
- Context Linking — Connect orphaned data
- Weekly Synthesis — Cross-domain correlation
- Knowledge Graph — Semantic relationships
- Briefing Generator — Pre-session context
- Spaced Repetition — Error pattern learning

#### System 5: Multi-Agent Coordinator — Parallel Orchestration
**Purpose:** Orchestrate multiple Claude agents for parallel research, building, and review.

**Strategies:**

| Strategy | Agents | Use Case |
|----------|--------|----------|
| `coord research` | 3 explore (parallel) | Understanding, investigation |
| `coord implement` | N builders (locked) | Multi-file changes |
| `coord review` | builder + reviewer | Quality-assured implementation |
| `coord full` | research → build → review | Complete feature development |

**Architecture:**
```
USER REQUEST
     │
     ▼
┌─────────────────────────────────────────────────────────────┐
│                    ORCHESTRATOR                              │
│  1. Decompose task into subtasks                            │
│  2. Detect dependencies (parallel vs sequential)            │
│  3. Check file conflicts                                    │
│  4. Select strategy (research/implement/review/full)        │
└─────────────────────────────────────────────────────────────┘
     │
     ├──────────────┬──────────────┬──────────────┐
     ▼              ▼              ▼              ▼
┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐
│ Agent 1 │   │ Agent 2 │   │ Agent 3 │   │ Agent N │
│ haiku   │   │ sonnet  │   │ haiku   │   │ opus    │
│ research│   │ implement│  │ review  │   │ arch    │
└────┬────┘   └────┬────┘   └────┬────┘   └────┬────┘
     │              │              │              │
     └──────────────┴──────────────┴──────────────┘
                          │
                          ▼
              ┌───────────────────────┐
              │    ACE CONSENSUS      │
              │  DQ-weighted voting   │
              │  Synthesize results   │
              └───────────────────────┘
```

#### System 6: ACE — Adaptive Consensus Engine
**Purpose:** Synthesize results from multiple agents using DQ-weighted voting.

**Architecture:**
```
Agent Results (7 agents)
    ↓
DQ Weight Calculation
    ↓
Weighted Voting → Outcome consensus
                → Quality consensus
                → Confidence score
                → Contrarian insights
```

**Contrarian Agent (7th agent):**
- Challenges consensus when all agree
- Identifies hidden assumptions
- Prevents groupthink

#### System 7: Observatory — Unified Analytics
**Purpose:** Comprehensive metrics across all Claude Code operations.

**Metrics Tracked:**
- Cost: $6,040.55 across 285 sessions
- Productivity: 9,821 LOC, 441.4 LOC/day
- Routing: 158 decisions, 0.889 avg DQ
- Sessions: 120 sessions with quality ratings
- Git: 216 commits backfilled
- Tools: 26,000+ tool calls

**Data Authenticity:** 97% real, 3% calculated, 0% simulated

#### System 8: Context Packs V2 — 7-Layer Semantic Selection
**Purpose:** Intelligent context selection using embeddings and layered scoring.

**Layers:**
1. Semantic embedding similarity
2. Project relevance
3. Recency weighting
4. Topic clustering
5. Dependency analysis
6. Historical utility
7. Token budget optimization

#### System 9: Learning Hub — Cross-Domain Correlation
**Purpose:** Unified aggregation of all learning systems.

**Features:**
- Weekly sync identifies cross-domain patterns
- Connects learnings across projects
- Generates improvement suggestions
- Tracks expertise evolution

---

### The 5 Hidden Inventions

#### 1. Self-Evolution Protocol (OS-App)
```
Friction Signal → Hypothesis → Code Generation → Sandbox Test → User Approval → Hot Reload
```
The OS watches for repeated errors, long pauses, dead ends — then **writes its own improvements**.

#### 2. Dream Protocol (OS-App)
When idle 5+ minutes:
- Processes queued research queries
- Analyzes system logs for patterns
- Generates predictive insights
- Compiles "morning briefing"

**An OS that thinks while you sleep.**

#### 3. Convergence Memory (OS-App)
IndexedDB learning system:
- Stores optimal thresholds from each consensus
- After 20 runs: knows "code review" takes 7 rounds, gap=3
- **The system gets faster at its own decision-making.**

#### 4. NSRG (Neuro-Symbolic Resume Graph) (CareerCoach)
Pure symbolic reasoning, no LLM needed:
- 5-level verb depth scoring ("architected" > "managed" > "built" > "used" > "familiar")
- 229 trigger patterns → inferred skills with confidence
- Evidence chains traceable to source text
- **Anti-bullshit resume design** — claims are structurally verifiable

#### 5. Research → Implementation Lineage (ResearchGravity)
```
arXiv:2511.15755 (Decision Quality Paper)
    ↓
backfill-multi-agent-orchestr-20260113 (Research Session)
    ↓
OS-App (Project)
    ↓
ACE Feature (Adaptive Consensus Engine)
    ↓
projects.json lineage.features_implemented
```
**Can trace any feature back to the research that enabled it.**

---

### OS-App Deep Architecture

#### Agentic Kernel (/services/kernel/)
- **AgentKernel.ts** — Central dispatcher with state machine: BOOTING → IDLE → PROCESSING → PAGING → SUSPENDED
- **KernelScheduler.ts** — Priority queue: CRITICAL(100) → HIGH(75) → NORMAL(50) → LOW(25) → BACKGROUND(10)
- **IntentResolver.ts** — 8 intent categories: NAVIGATION, QUERY, MUTATION, CREATION, ANALYSIS, ORCHESTRATION, BIOMETRIC, UI_REGENERATION
- **SemanticPager.ts** — Context management with LRU/LFU/RELEVANCE eviction policies

#### The 5-Agent Hive
| Agent | Role | Skepticism | Logic | Creativity |
|-------|------|------------|-------|------------|
| **Mike** | Implementation Architect | 0.15 | 0.50 | 0.95 |
| **Dr. Ira** | Audit Sentinel | 0.95 | 0.90 | 0.20 |
| **Caleb** | Execution Lead | 0.40 | 0.95 | 0.30 |
| **Paramdeep** | Systems Strategist | 0.60 | 0.85 | 0.50 |
| **Bilal** | Kinetic Operator | 0.20 | 0.60 | 0.70 |

---

### CareerCoach Deep Architecture

#### Chameleon Engine v2
4 archetypes with semantic transformation:
- **Speed** (startups): "Managed" → "Accelerated", focus on velocity
- **Safety** (enterprise): "fast" → "reliable", focus on compliance
- **Ecosystem** (platforms): Individual → Network metrics
- **Creative** (agencies): "optimized" → "invented", focus on novelty

#### Multi-Agent Hiring Committee
- **Hiring Manager** (Claude): Business impact, revenue, strategy
- **Tech Lead** (Grok/Gemini): Technical depth, architecture
- **HR Partner** (OpenAI): Culture fit, collaboration, growth

#### Skill Graph Navigator
- 70+ skill nodes with demand scores and growth rates
- 86+ edges: prerequisite, complement, substitute, evolution, adjacent
- BFS path finding for skill transitions
- Agglomerative clustering for skill groups

---

### The Sovereignty Stack

Every layer implements **user ownership**:

| Layer | Sovereignty Implementation |
|-------|---------------------------|
| **Data** | Local JSON files, no cloud lock-in |
| **Reasoning** | Symbolic algorithms, no black-box ML |
| **LLMs** | Optional enhancement, not dependency |
| **Memory** | User-accessible ~/.agent-core/ |
| **Evolution** | User approval required for self-modifications |

---

### Brand Philosophy: D-Ecosystem

**D-Ecosystem** = **D**(ico) + **ECO**(system) = The architect embedded in the architecture itself.

The name contains multiple layers:
- **Layer 1**: Decentralized Ecosystem (the philosophy)
- **Layer 2**: D-ICO-SYSTEM (phonetic encoding)
- **Layer 3**: Dico's System (ownership signature)
- **Layer 4**: System within system (intentional redundancy)

**Core Tagline:** *"Let the invention be hidden in your vision"*
- The invention (Dico) IS hidden in the vision (D-Ecosystem)

---

### Integration Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                     THE COMPOUNDING LOOP                        │
└─────────────────────────────────────────────────────────────────┘

     ┌──────────────┐
     │  RESEARCH    │ ← ResearchGravity captures frontier signals
     │  GRAVITY     │ ← Auto-archive to ~/.agent-core/sessions/
     └──────┬───────┘
            │ Lineage link
            ↓
     ┌──────────────┐
     │   AGENT      │ ← Unified orchestration across CLI/Web/IDE
     │   CORE       │ ← Innovation Scout finds viral + groundbreaker
     └──────┬───────┘
            │ Implementation
            ↓
     ┌──────────────┐
     │   OS-APP     │ ← Multi-agent consensus (ACE)
     │              │ ← Self-evolution from friction
     │              │ ← Dream Protocol background cognition
     │              │ ← Biometric-adaptive UI
     └──────┬───────┘
            │ Career application
            ↓
     ┌──────────────┐
     │  CAREER      │ ← Chameleon Engine adapts narratives
     │  COACH       │ ← NSRG analyzes skill depth
     │              │ ← Hiring Committee simulates interviews
     └──────┬───────┘
            │ Learnings
            ↓
     ┌──────────────┐
     │   MEMORY     │ ← ~/.agent-core/memory/learnings.md
     │   LAYER      │ ← projects.json tracks features implemented
     └──────┬───────┘
            │
            └──────────→ LOOP (next research session compounds)
```

---

### Key File Paths

```
Configuration:
  ~/.agent-core/config.json
  ~/.agent-core/projects.json
  ~/.agent-core/session_tracker.json

Research:
  ~/.agent-core/research/INDEX.md
  ~/.agent-core/research/os-app/os_app_master_proposal.md
  ~/.agent-core/brand/D-ECOSYSTEM-BRAND.md

Projects:
  ~/OS-App/
  ~/CareerCoachAntigravity/
  ~/researchgravity/

Ecosystem Guidance:
  ~/CLAUDE.md (master)
  ~/.claude/CLAUDE.md (user preferences)
```
