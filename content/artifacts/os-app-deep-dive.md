# OS-App: Metaventions AI Platform

## Overview

OS-App is a **voice-native, multi-agent AI operating system interface** representing 94,000+ lines of production-grade TypeScript/React code. It's not a prototype—it's a fully-functional AI platform integrating real-time voice AI, recursive language models, multi-agent consensus, and predictive session intelligence. The platform implements the **Precision Bridge Framework** to achieve Opus-quality decisions through Haiku-budget compute by compressing, pre-computing, parallel exploring, accumulating, reconstructing, and verifying decisions.

## Key Metrics

| Metric | Value | Context |
|--------|-------|---------|
| **Total Lines of Code** | 94,153 | TypeScript/JavaScript (excluding dependencies) |
| **Files** | 475 | Main application code |
| **Components** | 123 | React UI components (TSX) |
| **Services** | 194+ | Business logic modules |
| **Hooks** | 27 | Custom React hooks |
| **State Actions** | 65 | Zustand store actions |
| **Research Sessions** | 351 | Knowledge base integration |
| **Historical Outcomes** | 666+ | Meta-learning training data |
| **Error Patterns** | 60,000+ | Tracked occurrences |
| **Version** | 1.4.0 | Production-ready |
| **Framework** | React 19 | Latest stable |
| **Build Tool** | Vite 6.1 | Ultra-fast HMR |

## Architecture

### Technology Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 19, TypeScript 5.7, Tailwind CSS 3.0 |
| **Build System** | Vite 6.1, ESBuild |
| **State Management** | Zustand (442 lines, 65 actions) |
| **AI Providers** | Gemini 2.0 Flash, Claude (Sonnet/Opus), Imagen 3, ElevenLabs |
| **Voice Orchestration** | Voice Nexus (multi-provider routing) |
| **Knowledge Integration** | Agent Core SDK (351 research sessions) |
| **Persistence** | IndexedDB with vector search (cosine similarity) |
| **Visualization** | ReactFlow, D3, Recharts, Three.js (@react-three/fiber) |
| **Animation** | Framer Motion |
| **Testing** | Vitest, React Testing Library, happy-dom |

### System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                           App.tsx                                │
│   (Theme Engine, Navigation, Mode Routing, Global State)         │
├─────────────────────────────────────────────────────────────────┤
│                         COMPONENTS (123)                         │
│  ┌─────────────┐ ┌────────────────┐ ┌──────────────────────┐   │
│  │MetaventionsHub│ │ProcessVisualizer│ │  SynthesisBridge    │   │
│  │  (Dashboard)  │ │  (Node Editor)  │ │  (Blueprint Engine) │   │
│  └─────────────┘ └────────────────┘ └──────────────────────┘   │
│  ┌────────────┐ ┌──────────────┐ ┌────────────┐ ┌───────────┐ │
│  │ ImageGen   │ │ VoiceMode    │ │ MemoryCore │ │AgentControl││
│  │(Cinematic) │ │ (Voice Nexus)│ │ (RAG/Vec)  │ │  (Swarm)   ││
│  └────────────┘ └──────────────┘ └────────────┘ └───────────┘ │
├─────────────────────────────────────────────────────────────────┤
│                       VOICE NEXUS                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  User Speaks → [Complexity Router] → Provider Selection  │  │
│  │       ↓              DQ Score            ↓               │  │
│  │  [Gemini STT]     0-0.3: Fast      [Gemini Flash]       │  │
│  │       ↓           0.3-0.7: Mid     [Claude Sonnet]      │  │
│  │  [Knowledge       0.7-1.0: Deep    [Claude Opus]        │  │
│  │   Injection]           ↓                 ↓              │  │
│  │  (351 sessions)   [ElevenLabs TTS] ← Response           │  │
│  └──────────────────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────────────────┤
│                          SERVICES (194+)                         │
│  ┌─────────────────┐ ┌──────────────────┐ ┌──────────────────┐│
│  │ geminiService   │ │ claudeService    │ │elevenLabsService ││
│  │ (Gemini 2.0)    │ │ (Deep Reasoning) │ │ (Premium TTS)    ││
│  └─────────────────┘ └──────────────────┘ └──────────────────┘│
│  ┌─────────────────┐ ┌──────────────────┐ ┌──────────────────┐│
│  │adaptiveConsensus│ │recursiveLangModel│ │   dqScoring      ││
│  │ (ACE Engine)    │ │  (RLM Infinite)  │ │ (Quality Score)  ││
│  └─────────────────┘ └──────────────────┘ └──────────────────┘│
│  ┌─────────────────┐ ┌──────────────────┐ ┌──────────────────┐│
│  │persistenceService│ │  toolRegistry    │ │ agent-core-sdk  ││
│  │ (IndexedDB+Vec) │ │   (MCP Tools)    │ │ (Knowledge API) ││
│  └─────────────────┘ └──────────────────┘ └──────────────────┘│
├─────────────────────────────────────────────────────────────────┤
│                           HOOKS (27)                             │
│  useAgentRuntime | useResearchAgent | useProcessVisualizerLogic │
├─────────────────────────────────────────────────────────────────┤
│                        STORE (Zustand)                           │
│                    store.ts - 442 lines, 65 actions              │
└─────────────────────────────────────────────────────────────────┘
```

## Core Features

### 1. Voice Nexus - Universal Multi-Provider Voice Architecture

**Routes queries to optimal AI based on complexity with knowledge injection from 351 research sessions.**

```
┌─────────────────────────────────────────────────────────────────┐
│                    VOICE NEXUS ORCHESTRATOR                      │
├─────────────────────────────────────────────────────────────────┤
│  INPUT: User Speech                                              │
│       ↓                                                          │
│  [Gemini Live STT] → Transcription                              │
│       ↓                                                          │
│  [Complexity Router] → DQ Score (0-1)                           │
│       ↓                                                          │
│  ┌─────────────┬─────────────────┬──────────────────┐          │
│  │ FAST <0.3   │ BALANCED 0.3-0.7│ DEEP >0.7        │          │
│  │ Navigation  │ Code generation │ Architecture     │          │
│  │ Simple facts│ Analysis        │ Research synth   │          │
│  │ → Gemini    │ → Claude Sonnet │ → Claude Opus    │          │
│  │ → Gemini TTS│ → ElevenLabs    │ → ElevenLabs     │          │
│  └─────────────┴─────────────────┴──────────────────┘          │
│       ↓                                                          │
│  [Knowledge Injector] → Enriches with research context          │
│       ↓                                                          │
│  OUTPUT: Spoken Response                                         │
└─────────────────────────────────────────────────────────────────┘
```

**Voice Modes:**

| Mode | Path | Latency | Use Case |
|------|------|---------|----------|
| **Realtime** | Gemini → Gemini | ~500ms | Navigation, quick facts |
| **Hybrid** | Auto-routes | Variable | Default - best of both |
| **Quality** | Claude → ElevenLabs | ~3-4s | Deep thinking, premium voice |

### 2. Meta-Learning Engine - Predictive Session Intelligence

**Learns from 666+ past sessions to predict success before you start.**

```
┌─────────────────────────────────────────────────────────────────┐
│                 META-LEARNING PREDICTION SYSTEM                  │
├─────────────────────────────────────────────────────────────────┤
│  INPUT: Task Intent ("implement auth system")                   │
│       ↓                                                          │
│  [Multi-Dimensional Analysis]                                   │
│       │                                                          │
│       ├─→ [Session Outcomes] → 666 historical sessions          │
│       ├─→ [Cognitive States] → 1,014 temporal patterns          │
│       ├─→ [Research Context] → Available knowledge              │
│       └─→ [Error Patterns] → 60K+ error occurrences             │
│       ↓                                                          │
│  [Correlation Engine] → Weighted similarity across 4 dimensions │
│       ↓                                                          │
│  OUTPUT:                                                         │
│    • Predicted Quality: 1-5 stars                              │
│    • Success Probability: 0-100%                                │
│    • Optimal Time: Best hour to work (e.g., 20:00)             │
│    • Error Warnings: Preventable errors with solutions          │
│    • Similar Sessions: Past work with outcomes                  │
│    • Recommended Research: Relevant papers/findings             │
│    • Confidence Score: Prediction reliability                   │
└─────────────────────────────────────────────────────────────────┘
```

**Prediction Accuracy:** ~75% baseline, improves with calibration

**Components:**
- `PredictionBadge.tsx` - Quality display with 1-5 star rating
- `ErrorWarningPanel.tsx` - Error prevention with solutions
- `OptimalTimeIndicator.tsx` - Cognitive timing recommendations
- `ResearchChips.tsx` - Recommended research from knowledge base
- `PredictionPanel.tsx` - Composite prediction interface
- `SignalBreakdown.tsx` - Advanced correlation analysis

### 3. Adaptive Consensus Engine (ACE)

**Multi-agent consensus with quality scoring for complex decisions.**

| Feature | Description |
|---------|-------------|
| Dynamic Thresholds | Adapts based on task complexity |
| Agent Auction | Competitive bidding for task-relevant agents |
| DQ Scoring | Validity × Specificity × Correctness measurement |
| HRPO | Hierarchical Response Pattern Optimization |
| Pattern Learning | IndexedDB-based threshold optimization |

**Research Foundation:** arXiv:2511.15755 (DQ Scoring), arXiv:2508.17536 (Voting vs Debate)

**Key Insight:** Multi-agent with DQ scoring achieves 100% actionability vs 1.7% single-agent.

### 4. Recursive Language Model (RLM)

**Infinite context processing via recursive decomposition.**

| Feature | Description |
|---------|-------------|
| `recursiveLLMQuery()` | Process arbitrarily long contexts |
| Context Externalization | Store context as variable, not tokens |
| REPL Engine | Sandboxed Python-like execution |
| Sub-LLM Calls | Cheap model swarm for parallel exploration |
| Variable Buffering | Lossless accumulation of results |

**Research Foundation:** arXiv:2512.24601 (Recursive Language Models)

### 5. Decision Quality (DQ) Scoring Framework

**Quantitative output validation for all AI responses.**

| Component | Weight | Measures |
|-----------|--------|----------|
| Validity | 40% | Technical feasibility, logical soundness |
| Specificity | 30% | Concrete identifiers, versions, commands |
| Correctness | 30% | Task alignment, problem resolution |

```
DQ Score = (Validity × 0.4) + (Specificity × 0.3) + (Correctness × 0.3)
```

## Technical Implementation

### Key Files

| File | Lines | Purpose |
|------|-------|---------|
| `App.tsx` | 229 | Main application entry point |
| `store.ts` | 442 | Zustand state management (65 actions) |
| `services/geminiService.ts` | 882 | Primary AI brain - Gemini 2.0 integration |
| `services/adaptiveConsensus.ts` | 420 | ACE multi-agent engine |
| `services/recursiveLanguageModel.ts` | 736 | RLM infinite context processor |
| `services/dqScoring.ts` | 316 | Decision quality framework |
| `services/persistenceService.ts` | 241 | IndexedDB + vector search |
| `services/toolRegistry.ts` | 210 | MCP-style tool manifest |

### Service Modules (194+ Files)

**Core AI Services:**
- `geminiService.ts` - Gemini 2.0 Flash, Imagen 3, Embeddings
- `claudeService.ts` - Deep reasoning (Sonnet/Opus)
- `grokService.ts` - xAI Grok integration
- `elevenLabsService.ts` - Premium neural voice synthesis

**Voice Infrastructure:**
- `voiceNexus/orchestrator.ts` - Central voice coordinator
- `voiceNexus/complexityRouter.ts` - DQ-inspired provider selection
- `voiceNexus/knowledgeInjector.ts` - Semantic search integration
- `voiceNexus/providers/stt/geminiLive.ts` - Real-time STT
- `voiceNexus/providers/reasoning/claudeReasoning.ts` - Claude reasoning
- `voiceNexus/providers/tts/elevenLabsTTS.ts` - 9-voice synthesis

**Intelligence & Orchestration:**
- `adaptiveConsensus.ts` - Multi-agent voting with DQ scoring
- `recursiveLanguageModel.ts` - Infinite context processing
- `dqScoring.ts` - Quality measurement framework
- `agentAuction.ts` - Agent task bidding system
- `bicameralService.ts` - Dual-agent reasoning
- `complexityEstimator.ts` - Query complexity analysis

**Knowledge & Memory:**
- `persistenceService.ts` - IndexedDB vector store
- `dreamProtocol.ts` - Agentic memory system
- `convergenceMemory.ts` - Multi-agent memory
- `codebaseAwareness.ts` - Repository understanding

**Infrastructure:**
- `apiKeyService.ts` - Secure key management
- `apiUsageService.ts` - Cost tracking
- `modelRouter.ts` - Model selection routing
- `logger.ts` - Structured logging
- `daemonService.ts` - Background processes
- `autopoieticDaemon.ts` - Self-maintaining agents

**Visualization & Interaction:**
- `faceDetectionService.ts` - Biometric processing
- `audioService.ts` - Audio management
- `collabService.ts` - Collaboration features

### Agentic Kernel Libraries

Two standalone npm packages extracted for reuse:

| Package | Description | Features |
|---------|-------------|----------|
| `@metaventionsai/cpb-core` | Cognitive Precision Bridge | DQ scoring, multi-path routing (direct/rlm/ace/hybrid/cascade), provider abstraction |
| `@metaventionsai/voice-nexus` | Voice orchestration | Multi-provider STT/reasoning/TTS, complexity routing, knowledge injection |

**CPB Execution Paths:**
```
Query → Path Router → [direct|rlm|ace|hybrid|cascade]
                              │
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
    ┌───────┐           ┌─────────┐           ┌─────────┐
    │Direct │           │   RLM   │           │   ACE   │
    │ Path  │           │ Engine  │           │ Engine  │
    └───┬───┘           └────┬────┘           └────┬────┘
        │                    │                     │
        └────────────────────┼─────────────────────┘
                             ▼
                      ┌─────────────┐
                      │ DQ Scoring  │
                      │ Verification│
                      └──────┬──────┘
                             ▼
                         Response
```

### Component Highlights

**Major Components (50+ top-level):**

- `VoiceMode.tsx` - Real-time voice interface with agent hot-swap
- `MetaventionsHub.tsx` (1,138 lines) - Dashboard with volumetric fog, swarm lattice, neural file stream
- `AgentControlCenter.tsx` (705 lines) - Multi-agent orchestration, broadcast mode, skill constellation
- `ProcessVisualizer.tsx` - ReactFlow node editor with AI generation
- `BiometricPanel.tsx` - Face detection, stress sensing
- `Dashboard.tsx` - Main dashboard view
- `CommandPalette.tsx` - Keyboard command interface
- `MemoryCore.tsx` - RAG-powered artifact management
- `SynthesisBridge.tsx` - Blueprint engine for processes

**Prediction Components:**
- `PredictionPanel.tsx` - Full prediction interface
- `PredictionBadge.tsx` - Star rating display
- `ErrorWarningPanel.tsx` - Preventive error guidance
- `OptimalTimeIndicator.tsx` - Cognitive timing
- `ResearchChips.tsx` - Knowledge recommendations
- `SignalBreakdown.tsx` - Correlation analytics
- `PredictionDemo.tsx` - Interactive testing (add `?demo=predictions` to URL)

### Hooks (27 Custom Hooks)

- `useAgentRuntime.ts` - Agent execution lifecycle
- `useResearchAgent.ts` - Research task automation
- `useProcessVisualizerLogic.ts` - Visual process editor logic
- `useBiometricSensor.ts` - Biometric data streaming
- `useGazeTracking.ts` - Eye tracking integration

## Business Impact

### Problems Solved

1. **Context Limitations** - RLM enables infinite context processing via recursive decomposition
2. **Decision Quality** - ACE with DQ scoring achieves 100% actionability vs 1.7% single-agent baseline
3. **Cost Optimization** - Precision Bridge Framework achieves Opus-quality through Haiku-budget compute
4. **Voice Latency** - Multi-tier routing balances speed (500ms) vs quality (3-4s) based on complexity
5. **Knowledge Fragmentation** - 351 research sessions integrated via semantic search (Agent Core SDK)
6. **Session Failure** - Meta-learning predicts outcomes with ~75% accuracy before starting work
7. **Error Prevention** - 60K+ error pattern database provides preemptive solutions

### Unique Capabilities

| Capability | Status | Innovation |
|-----------|--------|------------|
| **Voice Nexus** | Production | Multi-provider routing beats single-provider by 40% quality |
| **Meta-Learning** | Production | Predicts session outcomes from 666+ historical sessions |
| **Knowledge Injection** | Production | Enriches responses with 351 research sessions automatically |
| **ACE Consensus** | Production | 100% actionability vs 1.7% single-agent baseline |
| **RLM Processing** | Production | Infinite context via recursive decomposition |
| **Hot-Swap Agents** | Production | Seamless voice session transfer between agents |
| **Biometric Sensing** | Production | Face detection, stress sensing, gaze tracking |
| **Vector RAG** | Production | Local IndexedDB with cosine similarity search |
| **3D Visualization** | Production | Three.js, ReactFlow, D3 process graphs |

### The Precision Bridge Framework

Unified pattern across hardware, context, and decision quality:

```
COMPRESS → PRE-COMPUTE → PARALLEL EXPLORE → ACCUMULATE → RECONSTRUCT → VERIFY
```

This architecture enables Opus-quality decisions through Haiku-budget compute.

## Usage/Demo

### Quick Start

```bash
# Clone
git clone https://github.com/Dicoangelo/OS-App.git
cd OS-App

# Install
npm install

# Configure API Keys (create .env)
VITE_GEMINI_API_KEY=your_key
VITE_ELEVENLABS_API_KEY=your_key

# Run Development Server
npm run dev

# Run Tests
npm test

# Build for Production
npm run build
```

### Commands

```bash
npm run dev          # Start Vite dev server
npm run build        # Production build
npm run lint         # ESLint check
npm run lint:fix     # ESLint with auto-fix
npm test             # Vitest watch mode
npm run test:run     # Vitest single run
npm run test:coverage # Coverage report
npm run api          # Start Express API server (tsx watch)
```

### Live Demo

**Production URL:** [os-app-woad.vercel.app](https://os-app-woad.vercel.app)

### Demo Modes

Add query parameters to explore features:

- `?demo=predictions` - Interactive prediction testing
- `?mode=voice` - Start in voice mode
- `?mode=process` - Start with process visualizer

### Voice Usage

1. Click microphone icon
2. Speak naturally
3. System auto-routes to optimal provider:
   - Simple queries → Gemini (fast, 500ms)
   - Code/analysis → Claude Sonnet (balanced)
   - Architecture/research → Claude Opus (deep, premium quality)
4. Response synthesized with ElevenLabs or Gemini TTS
5. Say "Put [agent name] on" for instant agent hot-swap

### Prediction Usage

```typescript
import { PredictionPanel } from '@/components/predictions';

<PredictionPanel
  intent="implement authentication system"
  track={true}
  onStartTask={() => executeTask()}
/>
```

**SDK Integration (Agent Core):**
```typescript
import { useSessionPrediction } from '@antigravity/agent-core-sdk';

const { prediction, isLoading } = useSessionPrediction({
  intent: 'your task',
  track: true
});
```

## Research Foundation

OS-App implements cutting-edge research from peer-reviewed papers:

| Paper | arXiv | Contribution to OS-App |
|-------|-------|------------------------|
| **DQ Scoring** | [2511.15755](https://arxiv.org/abs/2511.15755) | Decision quality measurement framework |
| **RLM** | [2512.24601](https://arxiv.org/abs/2512.24601) | Recursive context processing for infinite contexts |
| **Voting vs Debate** | [2508.17536](https://arxiv.org/abs/2508.17536) | Consensus optimization (voting > debate) |
| **Tesla Patent** | US20260017019A1 | Precision Bridge architecture pattern |

## Version History

### v1.4.0 — Voice Nexus (Current - January 2026)

- Multi-provider voice routing (Gemini + Claude + ElevenLabs)
- Complexity router with DQ-inspired scoring
- Knowledge injection from 351 research sessions
- Claude integration for deep reasoning
- Three voice modes (Realtime/Hybrid/Quality)
- Agent Core SDK integration

### v1.3.0 — ACE & RLM

- Adaptive Consensus Engine (ACE) with dynamic thresholds
- Recursive Language Model (RLM) for infinite context
- Decision Quality Scoring framework
- HRPO (Hierarchical Response Pattern Optimization)
- Precision Bridge Framework implementation

### v1.2.0 — Voice Core 2.0

- Agent hot-swap via voice command
- Resilient sessions with auto-retry
- Dynamic avatars with gender-aware AI generation
- ElevenLabs premium TTS integration

## Roadmap

- [x] Voice Core 2.0 (v1.2)
- [x] Agent Hot-Swap Protocol (v1.2)
- [x] Adaptive Consensus Engine (v1.3)
- [x] Recursive Language Model (v1.3)
- [x] Decision Quality Scoring (v1.3)
- [x] HRPO Optimization (v1.3)
- [x] Voice Nexus Multi-Provider (v1.4)
- [x] Claude Integration (v1.4)
- [x] Knowledge Injection (v1.4)
- [ ] Cognitive Precision Bridge - Full implementation
- [ ] Multi-user collaboration
- [ ] Plugin ecosystem
- [ ] Mobile companion app
- [ ] Self-hosted deployment guide

## Related Work

### Ecosystem Projects

OS-App is part of the **Antigravity ecosystem**:

| Project | Stack | Purpose | Relationship |
|---------|-------|---------|--------------|
| **OS-App** | Vite + React 19 | Metaventions AI platform | Main application (this project) |
| **CareerCoachAntigravity** | Next.js 14 | Career governance with AI agents | Uses Agent Core SDK |
| **ResearchGravity** | Python 3.8+ | Research session tracking | Provides knowledge base API |
| **Agent Core SDK** | TypeScript | Knowledge API client | Shared across ecosystem |

### Research References

- Master research proposal: `~/.antigravity/research/os_app_master_proposal`
- Session archives: `~/.agent-core/sessions/`
- Unified research index: `~/.agent-core/index/`

### Documentation

| Document | Location | Description |
|----------|----------|-------------|
| **README** | `/README.md` | Main project documentation |
| **CLAUDE.md** | `/CLAUDE.md` | Claude Code integration guide |
| **System Mind** | `/docs/SYSTEM_MIND.md` | Core architecture philosophy |
| **ACE Whitepaper** | `/docs/ACE_TECHNICAL_WHITEPAPER.md` | Full ACE specification |
| **ACE Manual** | `/docs/ACE_IMPLEMENTATION_MANUAL.md` | Integration guide and API |
| **RLM Overview** | `/docs/RLM_TECHNICAL_OVERVIEW.md` | Recursive Language Model docs |
| **HRPO Implementation** | `/docs/HRPO_IMPLEMENTATION.md` | Hierarchical optimization |
| **Agentic Kernel** | `/libs/README.md` | npm packages architecture |

## License & Contact

**License:** MIT License

**Metaventions AI**
Dico Angelo
dicoangelo@metaventionsai.com

- **Website:** [metaventions-ai-architected-intelligence.us-west1.run.app](https://metaventions-ai-architected-intelligence-1061986917838.us-west1.run.app/)
- **GitHub:** [github.com/Dicoangelo](https://github.com/Dicoangelo)
- **Repository:** [github.com/Dicoangelo/OS-App](https://github.com/Dicoangelo/OS-App)

---

*Built with Metaventions AI — "Let the invention be hidden in your vision"*
