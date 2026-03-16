# Services & Components - Deep Architecture

Generated: Mon 16 Mar 2026

## OS-App Services

### Service Files (Root Level)
```
adaptiveConsensus.ts       # ACE consensus engine for multi-agent voting
agentAuction.ts            # Agent task auction mechanism
agents.ts                  # Agent definitions and lifecycle management
agoraService.ts            # Agora collaboration space
apiKeyService.ts           # API key management and vault
apiUsageService.ts         # API usage tracking and cost monitoring
audioService.ts            # Audio playback (click sounds, notifications)
autopoieticDaemon.ts       # Self-maintaining autonomous daemon
bicameralService.ts        # Bicameral reasoning engine
claudeService.ts           # Claude AI integration
codebaseAwareness.ts       # Codebase graph awareness
collabService.ts           # Collaboration service
complexityEstimator.ts     # Task complexity analysis for routing
convergenceMemory.ts       # Cross-session memory convergence
cpbProviders.ts            # CPB provider configuration
cpbService.ts              # Cognitive Precision Bridge integration
daemonService.ts           # Daemon management
dqScoring.ts               # Deliberation Quality scoring (validity + specificity + correctness)
dreamProtocol.ts           # Agentic memory consolidation (dream cycles)
DynamicToolRegistry.ts     # Dynamic tool registration
elevenLabsService.ts       # ElevenLabs TTS integration
faceDetectionService.ts    # Face API biometric processing
geminiService.ts           # Gemini LLM integration (primary provider)
gpuPricingService.ts       # GPU pricing data
grokService.ts             # Grok AI integration
hopGrouping.ts             # Hop-based grouping algorithm
liveSession.ts             # Live session management
logger.ts                  # Structured logging
metaventionService.ts      # Metavention lifecycle management
minerstatService.ts        # Mining statistics
modelRouter.ts             # Multi-provider AI model routing
ollamaService.ts           # Ollama local model integration
persistenceService.ts      # Neural vault (IndexedDB persistence)
powerService.ts            # Power consumption tracking
priceApiService.ts         # Price API integration
recursiveLanguageModel.ts  # RLM infinite context window
selfEvolution.ts           # Self-evolution engine
supabaseService.ts         # Supabase cloud sync
tabNavigationRegistry.ts   # Tab navigation management
toolRegistry.ts            # Tool registry
universalVoiceHooks.ts     # Universal voice hook system
vendorService.ts           # Vendor management
voiceCoreIntegration.ts    # Core voice integration bridge
voiceUIContext.ts           # Voice UI context provider
```

### Service Subdirectories

#### actions/
```
index.ts           # Action barrel export
priority.ts        # Action priority system
registry.ts        # Action registry
sectorMap.ts       # Sector-to-action mapping
types.ts           # Action type definitions
```

#### archon/ (Autonomous Agent)
```
config.ts          # Archon configuration
eventBus.ts        # Event bus for agent communication
index.ts           # Barrel export
state.ts           # State machine
types.ts           # Type definitions
utils.ts           # Utility functions
archon.test.ts     # Tests
```

#### biometric/
```
index.ts           # Barrel export
processor.ts       # Biometric data processing
stressAnalysis.ts  # Stress level analysis
types.ts           # Biometric types
```

#### capabilities/
```
cpb.ts             # CPB capability definition
index.ts           # Barrel export
registry.ts        # Capability registry
types.ts           # Capability types
```

#### cognitivePrecisionBridge/
```
index.ts           # Barrel export
orchestrator.ts    # CPB orchestration engine
router.ts          # Precision-aware routing
types.ts           # CPB types
```

#### kernel/ (Agentic Kernel)
```
AgentKernel.ts     # Core agent kernel
index.ts           # Barrel export
IntentResolver.ts  # Natural language intent resolution
KernelScheduler.ts # Task scheduling
mcpContextBridge.ts # MCP context bridge
types.ts           # Kernel types
```

#### memory/
```
AgenticFileSystem.ts       # Virtual file system for agents
ArtifactStore.ts           # Artifact storage and retrieval
ContextCompiler.ts         # Context compilation for LLM calls
interfaces.ts              # Memory interfaces
KnowledgeLayerProcessor.ts # Knowledge layer processing
MemoryStore.ts             # Core memory store
Processor.ts               # Memory processing pipeline
SemanticPager.ts           # Semantic paging for large contexts
```

#### organisms/ (Bio-Inspired Architecture)
```
CognitiveLayer.ts   # Cognitive processing layer
GenomeLayer.ts       # Genome-based evolution layer
index.ts             # Barrel export
OrganismLayer.ts     # Organism lifecycle layer
SwarmLayer.ts        # Swarm intelligence layer
```

#### persistence/
```
vectorMath.ts      # Vector math for similarity calculations
```

#### security/
```
auditLog.ts            # Audit logging
index.ts               # Barrel export
promptAccessMonitor.ts # Prompt access monitoring
promptIsolation.ts     # Prompt injection isolation
```

#### ui/ (Adaptive UI Intelligence)
```
AUIEngine.ts        # Adaptive UI Engine
ComponentRegistry.ts # UI component registry
DOMRegenerator.ts   # DOM regeneration system
index.ts            # Barrel export
JudgeAgent.ts       # UI quality judge agent
SemanticGaze.ts     # Semantic gaze tracking for UI
types.ts            # UI types
```

#### voice/
```
actions.ts         # Voice action definitions
discovery.ts       # Voice capability discovery
index.ts           # Barrel export
service.ts         # Core voice service
types.ts           # Voice types
```

#### voiceNexus/
```
complexityRouter.ts   # Complexity-based voice routing
healthCheck.ts        # Voice system health monitoring
index.ts              # Barrel export
knowledgeInjector.ts  # Knowledge injection into voice pipeline
orchestrator.ts       # Voice orchestration
preflightCheck.ts     # Pre-flight system checks
types.ts              # VoiceNexus types
```

---

## OS-App Components

### Top-Level Components
```
AgoraPanel.tsx              # Agora collaboration panel
ApiKeyModal.tsx             # API key configuration modal
ApiUsageIndicator.tsx       # API usage display
AppFooter.tsx               # Application footer
AuthModule.tsx              # Authentication gate
BicameralEngine.tsx         # Bicameral reasoning UI
ContextVelocityChart.tsx    # Context velocity visualization
CPBMonitor.tsx              # CPB status monitor
CPBStatusOverlay.tsx        # CPB overlay display
DEcosystem.tsx              # D-Ecosystem visualization
DynamicVisuals.tsx          # Dynamic visual effects
DynamicWidget.tsx           # Dynamic widget system
EmotionalResonanceGraph.tsx # Emotional resonance visualization
ExperimentLogger.tsx        # Experiment logging UI
FlywheelOrbit.tsx           # Flywheel orbit animation
GlobalErrorBoundary.tsx     # Error boundary
GlobalStatusBar.tsx         # OS-level status bar
HelpCenter.tsx              # Help center overlay
HolographicCommandDeck.tsx  # Holographic command interface
HoloProjector.tsx           # Holographic projector overlay
KnowledgeGraph.tsx          # Knowledge graph visualization
MasterStabilizationProtocol.tsx # Layout stabilization
MemoryCore.tsx              # Memory visualization
MermaidDiagram.tsx          # Mermaid diagram renderer
MetaventionsLogo.tsx        # Brand logo
ModelSelector.tsx           # AI model selection
NeuralDebuggerPanel.tsx     # Neural debugging panel
NeuralDock.tsx              # Neural dock navigation
NexusAPIExplorer.tsx        # API explorer
OperationalSidebar.tsx      # Operational sidebar
OverlayOS.tsx               # OS overlay system
PeerMeshOverlay.tsx         # P2P mesh overlay
Starfield.tsx               # Starfield background animation
StrategicConsole.tsx        # Strategic planning console
SynapticContextHub.tsx      # Synaptic context management
SynapticRouter.tsx          # Synaptic routing display
SystemNotification.tsx      # System notification panel
TacticalScanner.tsx         # Tactical scanning interface
TaskBoard.tsx               # Task management board
ThemeSwitcher.tsx           # Theme switching
TimeTravelScrubber.tsx      # Time travel / state scrubber
UniversalVoiceProvider.tsx  # Voice provider wrapper
UserProfileOverlay.tsx      # User profile overlay
VisualCortexOverlay.tsx     # Visual cortex overlay
ZenithDisplay.tsx           # Zenith display panel
```

### Component Subdirectories
```
agents/              # AgenticHUD, agent control center
autogen/             # Auto-generated UI components
biometric/           # Biometric visualization panels
core/                # CommandPalette, Dashboard, GlobalSearchBar
finance/             # Financial data visualizations
generation/          # Content generation UI
graph/               # RelatedConcepts, LineageGraph
hardware/            # PowerControlPanel, ProcurementModal, PowerXRay
layout/              # AppHeader
MetaventionsHub/     # Main hub view
overlays/            # FocusOverlay
predictions/         # PredictionDemo
research/            # ResearchTray, EvolutionConsole, BibliomorphicEngine, DiscoveryLab
shared/              # Shared component utilities
SovereignGallery/    # Gallery view
SynthesisBridge/     # Synthesis bridge UI
Visualizations/      # 3D visualization components
voice/               # VoiceSystem unified stack
```

---

## OS-App Hooks

```
useAdaptiveUI.ts            # Adaptive UI complexity adjustment
useAgentRuntime.ts          # Agent execution runtime
useApiKeyModal.ts           # API key modal state
useApiUsage.ts              # API usage tracking
useAuthPersistence.ts       # Authentication state persistence
useAutoSave.ts              # Auto-save functionality
useBiometricSensor.ts       # Biometric sensor data processing
useConversationalVoice.ts   # Conversational voice mode
useDaemonSwarm.ts           # Daemon swarm management
useFixationGlow.ts          # Gaze fixation visual effect
useFlywheel.ts              # Flywheel animation
useKernelLifecycle.ts       # Kernel boot/shutdown lifecycle
useKernelUptime.ts          # Kernel uptime tracking
useNavigation.ts            # Navigation state management
usePerformanceMonitor.ts    # Performance monitoring
usePerspectiveRefraction.ts # Perspective refraction effect
useProcessVisualizerLogic.ts # Process visualizer logic
useResearchAgent.ts         # Research agent integration
useServiceHealth.ts         # Service health monitoring
useStressDetector.ts        # Stress level detection
useThemeVariables.ts        # CSS theme variables
useTimeTravel.ts            # State time travel (undo/redo)
useVisualCortex.ts          # Visual cortex processing
useVoiceControl.ts          # Voice command control
useVoiceExpose.ts           # Voice exposure for components
```

---

## OS-App Lib Packages

### @metaventionsai/cpb-core
```
index.ts             # Main entry
router.ts            # Precision-aware routing
orchestrator.ts      # CPB orchestration
feedbackAdapter.ts   # Feedback loop adapter
types.ts             # Type definitions
tsup.config.ts       # Build config
```

### @metaventionsai/voice-nexus
```
index.ts             # Main entry
router.ts            # Voice provider routing
orchestrator.ts      # Voice orchestration
types.ts             # Type definitions
tsup.config.ts       # Build config
```

### graph-reasoning-engine
```
engine.ts            # Core reasoning engine
simulate_career.ts   # Career simulation
benchmark.ts         # Performance benchmarks
```

### codebase-scanner
```
index.ts             # Codebase scanning and graph generation
```
