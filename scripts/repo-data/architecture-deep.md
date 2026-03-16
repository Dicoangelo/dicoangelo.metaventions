# Architecture Deep Dive

Generated: Mon 16 Mar 2026

## OS-App Architecture

### Core Entry Points
- `App.tsx` -- Main application shell with sovereign gate authentication, overlay system, voice stack
- `store.ts` -- Zustand state management with 25+ slices (kernel, voice, CPB, visual cortex, agents, etc.)
- `index.tsx` -- React 19 entry with providers
- `types.ts` -- Barrel export from `types/domain/` (core, agents, tasks, memory, codebase, visuals, finance, kernel, evolution, convergence, hardware, slices, actions)

### Component Architecture (65+ components)
```
components/
  agents/             # AgenticHUD, agent control
  autogen/            # Auto-generated UI
  biometric/          # Face detection, stress UI
  core/               # CommandPalette, Dashboard, GlobalSearchBar
  finance/            # Financial visualizations
  generation/         # Content generation
  graph/              # RelatedConcepts, LineageGraph
  hardware/           # PowerControlPanel, ProcurementModal, PowerXRay
  layout/             # AppHeader
  MetaventionsHub/    # Hub index
  overlays/           # FocusOverlay
  predictions/        # PredictionDemo
  research/           # ResearchTray, EvolutionConsole, BibliomorphicEngine, DiscoveryLab
  shared/             # Shared utilities
  SovereignGallery/   # Gallery view
  SynthesisBridge/    # Synthesis UI
  Visualizations/     # 3D visualization components
  voice/              # VoiceSystem unified stack

  # Top-level components
  AuthModule.tsx, HoloProjector.tsx, SynapticRouter.tsx,
  GlobalStatusBar.tsx, OverlayOS.tsx, Starfield.tsx,
  PeerMeshOverlay.tsx, CommandPalette.tsx, UserProfileOverlay.tsx,
  VisualCortexOverlay.tsx, BicameralEngine.tsx, KnowledgeGraph.tsx,
  MemoryCore.tsx, TaskBoard.tsx, StrategicConsole.tsx,
  NeuralDock.tsx, NexusAPIExplorer.tsx, ZenithDisplay.tsx
```

### Service Layer (100+ files, 12 subdirectories)
```
services/
  actions/            # registry.ts, priority.ts, sectorMap.ts, types.ts
  archon/             # Archon autonomous agent (config, eventBus, state, utils)
  biometric/          # processor.ts, stressAnalysis.ts
  capabilities/       # cpb.ts, registry.ts
  cognitivePrecisionBridge/  # orchestrator.ts, router.ts
  kernel/             # AgentKernel.ts, IntentResolver.ts, KernelScheduler.ts, mcpContextBridge.ts
  legacy/             # Archived service code
  memory/             # AgenticFileSystem, ArtifactStore, ContextCompiler, KnowledgeLayerProcessor, MemoryStore, SemanticPager
  organisms/          # CognitiveLayer, GenomeLayer, OrganismLayer, SwarmLayer
  persistence/        # vectorMath.ts
  security/           # auditLog, promptAccessMonitor, promptIsolation
  ui/                 # AUIEngine, ComponentRegistry, DOMRegenerator, JudgeAgent, SemanticGaze
  voice/              # actions, discovery, service
  voiceNexus/         # complexityRouter, healthCheck, knowledgeInjector, orchestrator, preflightCheck

  # Root services
  geminiService.ts, claudeService.ts, grokService.ts, ollamaService.ts     # LLM providers
  elevenLabsService.ts                                                       # TTS
  faceDetectionService.ts                                                    # Biometrics
  dqScoring.ts, modelRouter.ts, complexityEstimator.ts                      # Routing
  dreamProtocol.ts, selfEvolution.ts, autopoieticDaemon.ts                  # Autonomous systems
  adaptiveConsensus.ts, agentAuction.ts, agents.ts                          # Multi-agent
  persistenceService.ts, supabaseService.ts, convergenceMemory.ts           # Storage
  DynamicToolRegistry.ts, toolRegistry.ts, tabNavigationRegistry.ts         # Registries
  cpbService.ts, cpbProviders.ts                                             # CPB integration
  collabService.ts, liveSession.ts, agoraService.ts                         # Collaboration
  powerService.ts, gpuPricingService.ts, minerstatService.ts, priceApiService.ts  # Hardware/Finance
  apiKeyService.ts, apiUsageService.ts                                       # API management
  audioService.ts, bicameralService.ts, codebaseAwareness.ts                # Misc
  hopGrouping.ts, metaventionService.ts, vendorService.ts                   # Domain
  recursiveLanguageModel.ts, logger.ts                                       # Infrastructure
```

### Hooks (25 custom hooks)
```
hooks/
  useAdaptiveUI.ts, useAgentRuntime.ts, useApiKeyModal.ts, useApiUsage.ts,
  useAuthPersistence.ts, useAutoSave.ts, useBiometricSensor.ts,
  useConversationalVoice.ts, useDaemonSwarm.ts, useFixationGlow.ts,
  useFlywheel.ts, useKernelLifecycle.ts, useKernelUptime.ts,
  useNavigation.ts, usePerformanceMonitor.ts, usePerspectiveRefraction.ts,
  useProcessVisualizerLogic.ts, useResearchAgent.ts, useServiceHealth.ts,
  useStressDetector.ts, useThemeVariables.ts, useTimeTravel.ts,
  useVisualCortex.ts, useVoiceControl.ts, useVoiceExpose.ts
```

### Lib Packages (internal npm)
```
libs/
  cpb-core/           # @metaventionsai/cpb-core — router, orchestrator, feedbackAdapter
  voice-nexus/        # @metaventionsai/voice-nexus — router, orchestrator
  graph-reasoning-engine/  # engine.ts, simulate_career.ts, benchmark.ts
  codebase-scanner/   # index.ts
```

### Type System
```
types/
  api/gemini.ts       # Gemini API types
  domain/
    core.ts, agents.ts, tasks.ts, memory.ts, codebase.ts,
    visuals.ts, finance.ts, kernel.ts, evolution.ts,
    convergence.ts, hardware.ts, slices.ts, actions.ts
```

---

## META-VENGINE Architecture

### Core Subsystems
```
kernel/
  cognitive-os.py            # Personal Cognitive Operating System
  recovery-engine.py         # Auto-recovery orchestration
  recovery_actions.py        # 8 recovery action implementations
  supermemory.py             # Long-term memory layer
  bayesian_optimizer.py      # Bayesian optimization for routing
  expertise-router.py        # Expertise-based task routing
  dq-calibrator.py           # DQ score calibration
  hsrgs.py                   # Hierarchical Session Routing
  context-compressor.py      # Context window optimization
  predictive-recovery.py     # Predictive error recovery
  weight-safety.py           # Weight safety checks
  weight-snapshot-daemon.py  # Weight snapshot persistence
  lrf-clustering.py          # Learning Rate Factor clustering
  lrf-update-daemon.py       # LRF update daemon
  bo-monthly-daemon.py       # Monthly Bayesian optimization
  behavioral-outcome.py      # Behavioral outcome tracking
  memory-api.py              # Memory API endpoints
  param_registry.py          # Parameter registry
  graph-confidence-daemon.py # Graph confidence tracking
```

### Coordinator (Multi-Agent)
```
coordinator/
  orchestrator.py    # Main multi-agent orchestrator
  executor.py        # Task execution
  synthesizer.py     # Result synthesis
  conflict.py        # Conflict resolution
  distribution.py    # Work distribution
  supermax.py        # Supermax coordination mode
  registry.py        # Agent registry
  status.py          # Status reporting
  constants.py, utils.py
  strategies/
    parallel_research.py, parallel_implement.py,
    review_build.py, full_orchestration.py
```

### Hooks & Daemons
```
hooks/
  sqlite-hook.py, dual_write_lib.py, project-scanner.py
  error-capture.sh, post-tool.sh, post-response.sh, post-session-hook.sh
  session-optimizer-start.sh, session-optimizer-tool.sh, session-optimizer-stop.sh
  flow-protection.sh, intelligence-advisor.sh, username-check.sh
  auto-version-bump.sh, auto-archive.sh, pre-commit-data-arch-check.sh

daemon/
  agent-daemon.sh, agent-runner.py
```

### Scripts (50+ operational scripts)
```
scripts/
  model-sweep.py             # Model ID health check
  ccc-api-server.py          # Command Center API
  ccc-autonomous-brain.py    # Autonomous brain
  ccc-watchdog.py            # Watchdog process
  ccc-self-heal.py           # Self-healing
  migrate-to-sqlite.py       # Data migration
  backfill-*.py              # 10+ backfill scripts
  dashboard-sql-loader.py    # Dashboard data
  routing-feedback.py        # Routing feedback loop
  ab-test-analyzer.py        # A/B test analysis
  cost-alert.py              # Cost monitoring
  meta-analyzer.py           # Meta analysis
```

### Config & Data
```
config/pricing.py, config/pricing.sh, config/datastore.py
supermemory/cli.py, supermemory/__init__.py
plugins/, commands/, skills/, data/, memory/
```

---

## ResearchGravity Architecture

### Core Modules
```
mcp_server.py        # MCP server entry point (37 tools)
capture/             # Multi-platform session capture
  manager.py, base.py, dedup.py, quality.py, normalizer.py
  claudecode/        # Claude Code adapter + normalizer
  chatgpt/           # ChatGPT adapter + normalizer
  cursor/            # Cursor adapter + normalizer
  grok/              # Grok adapter + normalizer
  ccc/               # Command Center adapter + normalizer

graph/               # Knowledge graph
  concept_graph.py, lineage.py, queries.py
  persona_generator.py, ontology_generator.py

coherence_engine/    # Coherence tracking
webhook/             # Webhook ingestion
  server.py, poller.py, normalizer.py, security.py, audit.py
  handlers/github.py, handlers/slack.py, handlers/generic.py

delegation/          # Research delegation
ucw/                 # UCW integration (adapters for claude, openai)
cpb/                 # Cognitive Precision Bridge integration
critic/              # Research critic
methods/             # Research methods
cli/                 # CLI tools
api/                 # API endpoints
dashboard/           # Dashboard
storage/             # Storage layer (SQLite + Qdrant + Supabase)
frontier-alpha-cvrf/ # CVRF ML integration
notebooklm_mcp/      # NotebookLM integration
visual/, visual_assets/  # Visual output
```

---

## UCW (Universal Cognitive Wallet) Architecture

### Source Layout
```
src/ucw/
  cli.py             # CLI entry point
  config.py          # Configuration
  db/
    sqlite.py        # SQLite storage layer
  server/
    server.py        # MCP server
    router.py        # Request routing
    protocol.py      # Protocol handling
    capture.py       # Session capture
    transport.py     # Transport layer
    embeddings.py    # Embedding generation
    ucw_bridge.py    # Bridge to UCW data
    logger.py        # Structured logging
  tools/
    ucw_tools.py     # UCW MCP tools
    coherence_tools.py  # Coherence tracking tools
```

### Test Coverage (17 test files)
```
tests/
  test_protocol.py, test_server_unit.py, test_router.py,
  test_embeddings.py, test_protocol_extras.py, test_transport.py,
  test_coherence_tools.py, test_mcp_live.py, test_config.py,
  test_coherence_moments_db.py, test_capture.py, test_ucw_bridge.py,
  test_cli.py, test_ucw_tools.py, test_logger.py, test_sqlite.py
```

---

## CareerCoachAntigravity Architecture

### App Directory (Next.js 15)
```
app/
  api/               # API routes
  career-intelligence/  # Career intelligence pages
  components/        # Page-level components
    job-tracker/     # Extracted job tracker components
    resume-builder/  # Extracted resume components
  resume-builder/    # Resume builder pages
  layout.tsx, page.tsx, globals.css
```

### Lib Directory
```
lib/
  ai/               # AI integration
    tools/           # Modular tool definitions
  career-intelligence/
    nexus-engine/    # Modular nexus engine
    skill-graph/     # Modular skill graph
  hooks/             # Custom hooks
  interview-prep/    # Interview preparation
  job-scraper/       # Job scraping
  job-tracker/       # Job tracking
  onboarding/        # Onboarding flow
  playbooks/         # Career playbooks
  resume-builder/    # Resume builder service
  storage/           # Storage adapters (Supabase + file)
  rate-limiter/      # Rate limiting (Redis/Upstash)
  voice/             # Voice integration
  logger.ts, middleware.ts, store.ts, utils.ts
```

---

## Cross-Repository Patterns

### Shared Architectural Principles
1. **Sovereign-first**: All data local, browser-based DB (IndexedDB), no external dependencies
2. **Multi-agent consensus**: ACE (Adaptive Consensus Engine) with DQ scoring across OS-App, meta-vengine, coordinator
3. **MCP Protocol**: ResearchGravity, UCW, and NotebookLM all expose MCP servers
4. **Zustand state management**: OS-App and CareerCoachAntigravity both use Zustand
5. **SQLite + JSONL dual-write**: meta-vengine hooks persist to both formats
6. **Self-healing infrastructure**: Recovery engine in meta-vengine, auto-capture in ResearchGravity

### Technology Stack Summary
| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, Tailwind, Framer Motion, Three.js |
| State | Zustand (slices pattern) |
| Backend | Express (OS-App API), Next.js (CareerCoach), FastAPI (ResearchGravity) |
| AI Providers | Gemini, Claude, Grok, OpenAI, Ollama |
| Voice | ElevenLabs, Deepgram, Voice Nexus routing |
| Storage | IndexedDB, SQLite, Qdrant, Supabase |
| Testing | Vitest, pytest |
| Build | Vite, tsup, Next.js |
| Orchestration | meta-vengine coordinator, antigravity-coordinator |
