# Deep Repository Scan - Technical Details

Generated: Mon 16 Mar 2026

---
## OS-App

### package.json (Tech Stack)
```json
{
  "name": "metaventions-ai-v1",
  "dependencies": {
    "@antigravity/agent-core-sdk": "file:./libs/agent-core-sdk",
    "@deepgram/sdk": "^3.9.0",
    "@google/genai": "^1.31.0",
    "@ricky0123/vad-web": "^0.0.22",
    "@metaventionsai/cpb-core": "file:./libs/cpb-core",
    "@metaventionsai/voice-nexus": "file:./libs/voice-nexus",
    "@react-three/fiber": "^9.0.0-rc.0",
    "@supabase/supabase-js": "^2.91.1",
    "@xyflow/react": "^12.10.0",
    "clsx": "^2.1.1",
    "d3": "^7.9.0",
    "face-api.js": "^0.20.0",
    "framer-motion": "^11.18.2",
    "html-to-image": "^1.11.11",
    "idb": "^8.0.0",
    "jszip": "^3.10.1",
    "lucide-react": "^0.475.0",
    "mermaid": "^10.9.5",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "recharts": "^2.15.0",
    "serve": "^14.2.3",
    "tailwind-merge": "^2.5.2",
    "three": "^0.170.0",
    "zustand": "^5.0.3"
  },
  "devDependencies": {
    "@testing-library/react": "^16.3.1",
    "@vitejs/plugin-react": "^4.3.4",
    "@vitest/coverage-v8": "^4.0.18",
    "happy-dom": "^20.3.1",
    "tsx": "^4.21.0",
    "typescript": "^5.7.3",
    "vite": "^6.1.1",
    "vitest": "^4.0.17"
  }
}
```

### Key Service Abstractions

#### AI Provider Services
- `geminiService.ts` -- Primary LLM (Gemini Flash/Pro)
- `claudeService.ts` -- Claude integration
- `grokService.ts` -- Grok integration
- `ollamaService.ts` -- Local model support
- `modelRouter.ts` -- Multi-provider routing with DQ scoring
- `complexityEstimator.ts` -- Task complexity analysis for routing

#### Cognitive Precision Bridge (CPB)
- `services/cognitivePrecisionBridge/` -- orchestrator, router, types
- `cpbService.ts` -- CPB integration layer
- `cpbProviders.ts` -- Provider configuration
- `dqScoring.ts` -- Deliberation Quality scoring (validity + specificity + correctness)

#### Agent System
- `agents.ts` -- Agent definitions and lifecycle
- `agentAuction.ts` -- Agent task auction mechanism
- `adaptiveConsensus.ts` -- ACE consensus engine
- `services/archon/` -- Archon autonomous agent (eventBus, state machine)
- `services/kernel/AgentKernel.ts` -- Core kernel with IntentResolver, KernelScheduler
- `services/organisms/` -- CognitiveLayer, GenomeLayer, OrganismLayer, SwarmLayer

#### Memory & Persistence
- `persistenceService.ts` -- Neural vault (IndexedDB)
- `supabaseService.ts` -- Cloud sync
- `convergenceMemory.ts` -- Cross-session memory convergence
- `dreamProtocol.ts` -- Agentic memory consolidation
- `services/memory/` -- AgenticFileSystem, ArtifactStore, ContextCompiler, MemoryStore, SemanticPager

#### Voice Stack
- `elevenLabsService.ts` -- ElevenLabs TTS
- `services/voice/` -- Unified voice actions, discovery, service
- `services/voiceNexus/` -- complexityRouter, healthCheck, knowledgeInjector, orchestrator
- `voiceCoreIntegration.ts` -- Core voice integration
- `universalVoiceHooks.ts` -- Universal voice hook system

#### Biometric & UI Intelligence
- `faceDetectionService.ts` -- Face API integration
- `services/biometric/` -- processor, stressAnalysis
- `services/ui/` -- AUIEngine, ComponentRegistry, DOMRegenerator, JudgeAgent, SemanticGaze
- `services/security/` -- auditLog, promptAccessMonitor, promptIsolation

#### Autonomous Systems
- `autopoieticDaemon.ts` -- Self-maintaining daemon
- `selfEvolution.ts` -- Self-evolution engine
- `recursiveLanguageModel.ts` -- RLM infinite context

### Repository Structure
```
App.tsx, store.ts, index.tsx, types.ts
components/          # 65+ UI components in 15+ subdirectories
services/            # 100+ service files in 12 subdirectories
hooks/               # 25 custom hooks
libs/                # 4 internal packages (cpb-core, voice-nexus, graph-reasoning-engine, codebase-scanner)
types/               # Domain type system (13 domain files)
config/              # colors.ts, navigation.ts
stores/              # useSystemMind.ts
utils/               # cn.ts, logic.ts, cryptoService.ts, renderSafe.tsx, hardwareCalculations.ts, validateToolCode.ts
styles/              # CSS styles
data/                # Initial state, agents, metaventions
scripts/             # Build and sync scripts
supabase/            # Supabase configuration
```

---
## meta-vengine

### Architecture Layers

#### Kernel Layer (15 Python modules)
- Bayesian optimization, DQ calibration, cognitive OS
- Recovery engine with 8 auto-fix actions
- Context compression, weight safety, LRF clustering
- Supermemory long-term storage
- Predictive recovery, behavioral outcome tracking

#### Coordinator Layer (Multi-Agent)
- Orchestrator with 4 strategies: parallel_research, parallel_implement, review_build, full_orchestration
- Conflict resolution, work distribution, result synthesis
- Supermax coordination mode
- Agent registry and status reporting

#### Hook System (18 hooks)
- SQLite dual-write hooks
- Session optimization (start/tool/stop)
- Error capture and flow protection
- Git post-commit, username check
- Intelligence advisor, project scanner

#### Scripts (50+ operational)
- Model sweep and health check
- Command Center API, autonomous brain, watchdog
- SQLite migration and backfill (10+ scripts)
- A/B test analysis, cost alerts, routing feedback

### Repository Structure
```
kernel/              # 15 Python modules + tests
coordinator/         # Multi-agent orchestration + strategies
hooks/               # 18 hook scripts (Python + Shell)
daemon/              # Agent daemon and runner
scripts/             # 50+ operational scripts
config/              # pricing.py, pricing.sh, datastore.py
dashboard/           # HTML dashboard
data/                # Runtime data
supermemory/         # Memory CLI
plugins/             # Plugin system
commands/            # Claude commands
skills/              # Skill definitions
```

---
## ResearchGravity

### Core Architecture

#### MCP Server (37 tools)
- `mcp_server.py` -- Entry point for Model Context Protocol

#### Multi-Platform Capture
- 5 adapters: Claude Code, ChatGPT, Cursor, Grok, Command Center
- Each with adapter.py + normalizer.py pattern
- Deduplication, quality scoring, manager orchestration

#### Knowledge Graph
- concept_graph.py -- Concept relationships
- lineage.py -- Research lineage tracking
- persona_generator.py -- Research persona generation
- ontology_generator.py -- Ontology construction
- queries.py -- Graph queries

#### Webhook System
- Multi-handler: GitHub, Slack, generic
- Security, audit logging, polling mode
- Event normalization pipeline

#### Storage Triad
- SQLite for structured data
- Qdrant for vector similarity search
- Supabase for cloud sync

### Repository Structure
```
mcp_server.py        # MCP entry point
capture/             # 5 platform adapters
graph/               # Knowledge graph (5 modules)
coherence_engine/    # Coherence tracking
webhook/             # Webhook ingestion (7 modules + handlers)
delegation/          # Research delegation
ucw/                 # UCW integration
cpb/                 # CPB integration
critic/              # Research critic
methods/             # Research methods
cli/                 # CLI tools
api/                 # API endpoints
dashboard/           # Dashboard
storage/             # Storage triad
frontier-alpha-cvrf/ # ML integration
notebooklm_mcp/      # NotebookLM integration
visual/              # Visual output
```

---
## CareerCoachAntigravity

### package.json (Tech Stack)
```json
{
  "name": "career-board",
  "version": "2.3.0",
  "dependencies": {
    "@anthropic-ai/sdk": "^0.71.2",
    "@google/genai": "^1.35.0",
    "@google/generative-ai": "^0.24.1",
    "@react-three/drei": "^9.122.0",
    "@react-three/fiber": "^8.18.0",
    "@sentry/nextjs": "^10.36.0",
    "@xyflow/react": "^12.10.0",
    "ai": "^6.0.11",
    "framer-motion": "^12.25.0",
    "lucide-react": "^0.441.0",
    "next": "^15.5.9",
    "openai": "^6.16.0",
    "react": "^18.3.1",
    "tailwindcss": "^3.4.0",
    "three": "^0.182.0",
    "zod": "^3.23.0",
    "zustand": "^4.5.0"
  }
}
```

### Key Modules
- **Nexus Engine** -- Career intelligence with multi-agent hiring simulation
- **Skill Graph** -- Career skill relationship mapping with adjacency list memoization
- **AI Tools** -- Modular tool definitions (extracted from 1,095 LOC monolith)
- **Model Gateway** -- Multi-provider AI routing (Grok, Gemini, OpenAI, Claude)
- **Interview Prep** -- Interview simulation and preparation
- **Resume Builder** -- Chameleon resume builder with multi-agent evaluation
- **Job Scraper/Tracker** -- Job pipeline management
- **Playbooks** -- Career positioning playbooks

### Quality
- 382+ passing tests (Vitest)
- Sentry error tracking
- Supabase storage with file fallback
- Redis rate limiting via Upstash
- Structured logging with Pino

---
## UCW (Universal Cognitive Wallet)

### Architecture
- MCP server exposing cognitive wallet tools
- SQLite-backed session capture from Claude, ChatGPT, Gemini
- Coherence tracking across AI interactions
- Embedding generation for semantic search
- Bridge pattern for cross-platform data access

### Test Coverage: 17 test files covering protocol, server, router, embeddings, transport, coherence, CLI, capture, config, SQLite

---
## Cross-Repository Technical Patterns

### Design Patterns Observed
1. **Adapter + Normalizer**: ResearchGravity capture system, UCW bridge
2. **Registry Pattern**: OS-App (toolRegistry, tabNavigationRegistry, componentActionRegistry, DynamicToolRegistry)
3. **Slice Architecture**: Zustand state slices in OS-App (25+ slices)
4. **Daemon Pattern**: meta-vengine (agent-daemon, watchdog, weight-snapshot, LRF-update, BO-monthly)
5. **Hook Pipeline**: meta-vengine hooks (pre-commit, post-tool, post-response, post-session, error-capture)
6. **Strategy Pattern**: Coordinator strategies (parallel_research, parallel_implement, review_build, full_orchestration)
7. **Dual-Write**: SQLite + JSONL for all telemetry data
8. **Organism Layers**: OS-App services/organisms (Cognitive, Genome, Organism, Swarm)
