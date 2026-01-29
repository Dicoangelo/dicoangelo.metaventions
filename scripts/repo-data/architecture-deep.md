# Architecture Deep Dive

Generated: Thu 29 Jan 2026 10:37:38 EST

## OS-App Architecture

### App.tsx (Main Application)
```typescript

import React, { useEffect, Suspense, lazy } from 'react';
import { useAppStore } from './store';
import { useSystemMind } from './stores/useSystemMind';
import { AppTheme } from './types';
import Starfield from './components/Starfield';
import { BackgroundEffect } from './components/shared';
import { CommandPalette } from './components/core';
import SystemNotification from './components/SystemNotification';
import OverlayOS from './components/OverlayOS';
import HoloProjector from './components/HoloProjector';
import SynapticRouter from './components/SynapticRouter';
import UserProfileOverlay from './components/UserProfileOverlay';
import VisualCortexOverlay from './components/VisualCortexOverlay';
import GlobalStatusBar from './components/GlobalStatusBar';
import PeerMeshOverlay from './components/PeerMeshOverlay';
import AppFooter from './components/AppFooter';
import AuthModule from './components/AuthModule';
import SynapticContextHub from './components/SynapticContextHub';
import { useAutoSave } from './hooks/useAutoSave';
import { useDaemonSwarm } from './hooks/useDaemonSwarm';
import { useVoiceControl } from './hooks/useVoiceControl';
import { useResearchAgent } from './hooks/useResearchAgent';
import { useVisualCortex } from './hooks/useVisualCortex';
import { useBiometricSensor } from './hooks/useBiometricSensor';
import { useStressDetector } from './hooks/useStressDetector';
import { useFixationGlow } from './hooks/useFixationGlow';
import { useThemeVariables } from './hooks/useThemeVariables';
import { useApiKeyModal } from './hooks/useApiKeyModal';
import { useKernelUptime } from './hooks/useKernelUptime';
import { useKernelLifecycle } from './hooks/useKernelLifecycle';
import { useTimeTravel } from './hooks/useTimeTravel';
import { useAuthPersistence } from './hooks/useAuthPersistence';
import { hasFixedLayout } from './config/navigation';
import { audio } from './services/audioService';
import { AnimatePresence } from 'framer-motion';
import { cn } from './utils/cn';
import { GlobalErrorBoundary } from './components/GlobalErrorBoundary';
import MasterStabilizationProtocol from './components/MasterStabilizationProtocol';
import FocusOverlay from './components/overlays/FocusOverlay';
import AppHeader from './components/layout/AppHeader';

import { VoiceSystem } from './components/voice';

// Lazy-loaded components (conditionally rendered)
const HelpCenter = lazy(() => import('./components/HelpCenter'));
const AgenticHUD = lazy(() => import('./components/agents/AgenticHUD'));
const TimeTravelScrubber = lazy(() => import('./components/TimeTravelScrubber'));
const ApiKeyModal = lazy(() => import('./components/ApiKeyModal'));
const OperationalSidebar = lazy(() => import('./components/OperationalSidebar'));
const PredictionDemo = lazy(() => import('./components/predictions/PredictionDemo'));

const App: React.FC = () => {
    const mode = useAppStore(s => s.mode);
    const theme = useAppStore(s => s.theme);
    const system = useAppStore(s => s.system);
    const holo = useAppStore(s => s.holo);
    const authenticated = useAppStore(s => s.authenticated);
    const actions = useAppStore(s => s.actions);
    const isHelpOpen = useAppStore(s => s.isHelpOpen);
    const isScrubberOpen = useAppStore(s => s.isScrubberOpen);
    const isDiagnosticsOpen = useAppStore(s => s.isDiagnosticsOpen);
    const isSidebarOpen = useAppStore(s => s.isSidebarOpen);
    const isHUDClosed = useAppStore(s => s.isHUDClosed);

    // Prediction demo toggle (via URL param: ?demo=predictions)
    const [showPredictionDemo, setShowPredictionDemo] = React.useState(() => {
        const params = new URLSearchParams(window.location.search);
        return params.get('demo') === 'predictions';
    });

    const { setSector } = useSystemMind();

    // Auth persistence (restore login state from localStorage)
    useAuthPersistence();

    // Hooks
    const { isOpen: isApiKeyModalOpen, setIsOpen: setIsApiKeyModalOpen } = useApiKeyModal();
    const { restore } = useTimeTravel();
    useKernelUptime();
    useKernelLifecycle();

    useAutoSave();
    useDaemonSwarm();
    useVoiceControl();
    useResearchAgent();
    useVisualCortex();

    // Biometric Integration
    useBiometricSensor();
    useStressDetector();
    useFixationGlow();

    useEffect(() => { setSector(mode); }, [mode, setSector]);

    // Global Context Menu Hijack
    useEffect(() => {
        const handleContextMenu = (e: MouseEvent) => {
            e.preventDefault();
            actions.openContextMenu(e.clientX, e.clientY, 'GLOBAL', null);
            audio.playClick();
        };
        window.addEventListener('contextmenu', handleContextMenu);
        return () => window.removeEventListener('contextmenu', handleContextMenu);
    }, [actions]);

    const themeVars = useThemeVariables(theme);
    const isFixedLayout = hasFixedLayout(mode);

    // MATERIAL SOVEREIGNTY: Deep Refraction Stacking
    const isDeepRefracted = system.isTerminalOpen || holo.isOpen;

    return (
        <GlobalErrorBoundary>
            <div
                className={cn(
                    "h-screen w-screen font-sans overflow-hidden flex flex-col transition-all duration-700 ease-in-out relative",
                    isDeepRefracted && "deep-refraction-active"
                )}
                style={{ backgroundColor: 'var(--bg-app)', color: 'var(--text-primary)', ...themeVars as any }}
            >
                <MasterStabilizationProtocol />
                <Starfield mode={mode} />
                <BackgroundEffect isDarkMode={theme !== AppTheme.LIGHT} />


                <div className="absolute inset-0 pointer-events-none z-[200] opacity-[0.04] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>

                {/* SOVEREIGN GATE: Hard authentication barrier */}
                {!authenticated ? (
                    <AuthModule />
                ) : (
                    <>
                        <SynapticContextHub />

                        <FocusOverlay />
                        <UserProfileOverlay />
                        <VisualCortexOverlay />
                        <CommandPalette />
                        <PeerMeshOverlay />
                        <SystemNotification isOpen={isDiagnosticsOpen} onClose={() => actions.setDiagnosticsOpen(false)} />
                        <OverlayOS />
                        <HoloProjector />

                        {/* Unified Voice Stack (always mounted for voice functionality) */}
                        <VoiceSystem />

                        {/* Time Travel Scrubber (lazy-loaded, conditionally rendered) */}
                        {isScrubberOpen && (
                            <Suspense fallback={null}>
                                <TimeTravelScrubber mode={mode} onRestore={restore} isOpen={isScrubberOpen} onClose={() => actions.setScrubberOpen(false)} />
                            </Suspense>
                        )}

                        {/* API Key Configuration Modal (lazy-loaded) */}
                        {isApiKeyModalOpen && (
                            <Suspense fallback={null}>
                                <ApiKeyModal isOpen={isApiKeyModalOpen} onClose={() => setIsApiKeyModalOpen(false)} />
                            </Suspense>
                        )}

                        <AnimatePresence>
                            {!isHUDClosed && (
                                <Suspense fallback={null}>
                                    <AgenticHUD />
                                </Suspense>
                            )}
                        </AnimatePresence>

                        <AnimatePresence>
                            {isHelpOpen && (
                                <Suspense fallback={null}>
                                    <HelpCenter onClose={() => actions.setHelpOpen(false)} />
                                </Suspense>
                            )}
                        </AnimatePresence>

                        <AnimatePresence>
                            {showPredictionDemo && (
                                <Suspense fallback={null}>
                                    <div className="fixed inset-0 z-[9999] bg-black/95 overflow-y-auto">
                                        <button
                                            onClick={() => setShowPredictionDemo(false)}
                                            className="fixed top-4 right-4 z-[10000] px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 rounded-lg text-white font-mono text-sm transition-all"
                                        >
                                            ✕ Close Demo
                                        </button>
                                        <PredictionDemo />
                                    </div>
                                </Suspense>
                            )}
                        </AnimatePresence>

                        <AppHeader />

                        {/* OS Kernel Dock Layer */}
                        <GlobalStatusBar />

                        <div className="flex-1 flex overflow-hidden relative">
                            <div className={cn(
```

### store.ts (State Management)
```typescript
import { create } from 'zustand';
import {
    AppMode, AppTheme, UserProfile, Task,
    MetaventionsState, AutonomousAgent, TechnicalManifest,
    SwarmProposal, AppPreferences, BiometricState, UIComplexityLevel,
    // Slice types
    KernelState, SystemState, VoiceState, VoiceNexusState,
    CPBState, VisualCortexState, HoloState, SearchState,
    MarketDataState, ContextMenuState, DashboardState, ProcessState,
    ImageGenState, CodeStudioState, HardwareState, MemorySliceState,
    BibliomorphicState, DiscoveryState, ResearchState, BicameralState,
    AgentsState, CollaborationState, SynthesisState, KnowledgeState,
    // Action types
    SliceUpdater, HoloArtifact, ProcessNodeUpdateParams, TaskParams,
    TaskUpdateParams, ResearchTaskParams, ResearchTaskUpdateParams,
    SwarmEventParams, DockItemParams
} from './types';
import { neuralVault } from './services/persistenceService';
import { INITIAL_AGENTS } from './data/initialAgents';
import { INITIAL_METAVENTIONS } from './data/initialMetaventions';
import {
    INITIAL_USER, INITIAL_PREFERENCES, INITIAL_KERNEL, INITIAL_BIOMETRIC,
    INITIAL_SYSTEM, INITIAL_VOICE, INITIAL_VOICE_NEXUS, INITIAL_CPB,
    INITIAL_VISUAL_CORTEX, INITIAL_SEARCH, INITIAL_HOLO, INITIAL_CONTEXT_MENU,
    INITIAL_MARKET_DATA, INITIAL_DASHBOARD, INITIAL_KNOWLEDGE, INITIAL_PROCESS,
    INITIAL_IMAGE_GEN, INITIAL_CODE_STUDIO, INITIAL_HARDWARE, INITIAL_MEMORY,
    INITIAL_BIBLIOMORPHIC, INITIAL_DISCOVERY, INITIAL_RESEARCH, INITIAL_BICAMERAL,
    INITIAL_AGENTS_STATE, INITIAL_COLLABORATION, INITIAL_SYNTHESIS
} from './data/initialState';

interface AppState {
    mode: AppMode;
    previousMode: AppMode | null;
    isTransitioning: boolean;
    theme: AppTheme;
    user: UserProfile;
    authenticated: boolean;
    isProfileOpen: boolean;
    isCommandPaletteOpen: boolean;
    isSidebarOpen: boolean;
    operationalContext: string;
    kernel: KernelState;
    biometric: BiometricState;
    system: SystemState;
    marketData: MarketDataState;
    search: SearchState;
    voice: VoiceState;
    voiceNexus: VoiceNexusState;
    cpb: CPBState;
    visualCortex: VisualCortexState;
    holo: HoloState;
    dashboard: DashboardState;
    knowledge: KnowledgeState;
    process: ProcessState;
    imageGen: ImageGenState;
    codeStudio: CodeStudioState;
    hardware: HardwareState;
    memory: MemorySliceState;
    bibliomorphic: BibliomorphicState;
    discovery: DiscoveryState;
    research: ResearchState;
    bicameral: BicameralState;
    agents: AgentsState;
    collaboration: CollaborationState;
    contextMenu: ContextMenuState;
    synthesis: SynthesisState;
    isHelpOpen: boolean;
    isScrubberOpen: boolean;
    isDiagnosticsOpen: boolean;
    isHUDClosed: boolean;
    focusedSelector: string | null;
    tasks: Task[];
    metaventions: MetaventionsState;
    preferences: AppPreferences;

    actions: {
        setMode: (mode: AppMode) => void;
        setPreferences: (prefs: Partial<AppPreferences>) => void;
        setTheme: (theme: AppTheme) => void;
        setUserProfile: (profile: Partial<UserProfile>) => void;
        setAuthenticated: (auth: boolean) => void;
        toggleProfile: (open?: boolean) => void;
        toggleCommandPalette: (open?: boolean) => void;
        setSidebarOpen: (open: boolean) => void;
        addLog: (level: 'ERROR' | 'WARN' | 'SUCCESS' | 'INFO' | 'SYSTEM', message: string) => void;
        toggleTerminal: (open?: boolean) => void;
        // Typed slice setters
        setSearchState: (update: SliceUpdater<SearchState>) => void;
        setVoiceState: (update: SliceUpdater<VoiceState>) => void;
        setVoiceNexusState: (update: SliceUpdater<VoiceNexusState>) => void;
        setCPBState: (update: SliceUpdater<CPBState>) => void;
        setVisualCortexState: (update: SliceUpdater<VisualCortexState>) => void;
        openHoloProjector: (artifact: HoloArtifact) => void;
        closeHoloProjector: () => void;
        setHoloAnalysis: (result: string | null) => void;
        setHoloAnalyzing: (busy: boolean) => void;
        setDashboardState: (update: SliceUpdater<DashboardState>) => void;
        toggleKnowledgeLayer: (id: string) => void;
        optimizeLayer: (id: string) => void;
        setProcessState: (update: SliceUpdater<ProcessState>) => void;
        updateProcessNode: (id: string, update: ProcessNodeUpdateParams) => void;
        setImageGenState: (update: SliceUpdater<ImageGenState>) => void;
        setCodeStudioState: (update: SliceUpdater<CodeStudioState>) => void;
        setHardwareState: (update: SliceUpdater<HardwareState>) => void;
        setMemoryState: (update: SliceUpdater<MemorySliceState>) => void;
        setBibliomorphicState: (update: SliceUpdater<BibliomorphicState>) => void;
        setDiscoveryState: (update: SliceUpdater<DiscoveryState>) => void;
        addResearchTask: (task: ResearchTaskParams) => void;
        updateResearchTask: (id: string, update: ResearchTaskUpdateParams) => void;
        removeResearchTask: (id: string) => void;
        cancelResearchTask: (id: string) => void;
        setBicameralState: (update: SliceUpdater<BicameralState>) => void;
        setCollabState: (update: SliceUpdater<CollaborationState>) => void;
        addSwarmEvent: (event: SwarmEventParams) => void;
        openContextMenu: (x: number, y: number, type: string, content: string | Record<string, unknown> | null) => void;
        closeContextMenu: () => void;
        addTask: (task: TaskParams) => void;
        updateTask: (id: string, update: TaskUpdateParams) => void;
        deleteTask: (id: string) => void;
        toggleSubTask: (taskId: string, subTaskId: string) => void;
        setHelpOpen: (open: boolean) => void;
        setScrubberOpen: (open: boolean) => void;
        setDiagnosticsOpen: (open: boolean) => void;
        setHUDClosed: (closed: boolean) => void;
        setFocusedSelector: (selector: string | null) => void;
        addDockItem: (item: DockItemParams) => void;
        removeDockItem: (id: string) => void;
        archiveIntervention: (protocol: TechnicalManifest) => void;
        removeStrategy: (id: string) => void;
        setMetaventionsState: (update: SliceUpdater<MetaventionsState>) => void;
        pushToInvestmentQueue: (metavention: { title: string; viability: number; riskVector: string; logic: string }) => void;
        commitInvestment: (id: string, amount: number) => void;
        setAgentState: (update: SliceUpdater<AgentsState>) => void;
        updateAgent: (id: string, update: Partial<AutonomousAgent>) => void;
        addAgent: (agent: AutonomousAgent) => void;
        hydrateAgents: () => Promise<void>;
        deployStrategyToLattice: (strategy: TechnicalManifest) => void;
        addSwarmProposal: (proposal: SwarmProposal) => void;
        dismissProposal: (id: string) => void;
        // Kernel & Biometric actions
        setKernelState: (update: Partial<KernelState>) => void;
        setBiometricState: (update: Partial<BiometricState>) => void;
        setUIComplexity: (level: UIComplexityLevel) => void;
    };
}

export const useAppStore = create<AppState>((set, get) => ({
    // Core state
    mode: AppMode.METAVENTIONS_HUB,
    previousMode: null,
```

### types.ts (Type Definitions)
```typescript
export * from './types/domain/core';
export * from './types/domain/agents';
export * from './types/domain/tasks';
export * from './types/domain/memory';
export * from './types/domain/codebase';
export * from './types/domain/visuals';
export * from './types/domain/finance';
export * from './types/domain/kernel';
export * from './types/domain/evolution';
export * from './types/domain/convergence';
export * from './types/domain/hardware';
export * from './types/domain/slices';
export * from './types/domain/actions';
```

### CLAUDE.md (Project Documentation)
# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

OS-App (Metaventions AI) is a React 19 + Vite application featuring an Agentic Kernel with 3D visualizations, biometric sensing, and multi-agent orchestration.

## Commands

```bash
npm run dev          # Start Vite dev server
npm run build        # Production build
npm run lint         # ESLint check
npm run lint:fix     # ESLint with auto-fix
npm run format       # Prettier formatting
npm test             # Vitest watch mode
npm run test:run     # Vitest single run
npm run test:coverage # Coverage report
npm run api          # Start Express API server (tsx watch)
npm run api:start    # Start API server (production)
```

## Architecture

### Core Files

- `App.tsx` — Main application (~30K lines). **Read sections, not the entire file.**
- `store.ts` — Zustand state management
- `index.tsx` — Entry point with providers

### Key Directories

```
components/       # 75 UI components
├── AgentControlCenter.tsx  # Multi-agent orchestration
├── BiometricPanel.tsx      # Face detection, stress sensing
├── Dashboard.tsx           # Main dashboard view
├── CommandPalette.tsx      # Keyboard command interface
└── ...

services/         # 30 service modules
├── geminiService.ts        # Primary LLM integration (largest)
├── agents.ts               # Agent definitions
├── faceDetectionService.ts # Biometric processing
├── dreamProtocol.ts        # Agentic memory system
└── ...

hooks/            # 20 custom hooks
├── useBiometricSensor.ts   # Biometric data hook
├── useGazeTracking.ts      # Eye tracking
├── useAgentRuntime.ts      # Agent execution
└── ...

api/              # Express backend
libs/             # Agentic Kernel libraries (npm packages)
```

### Agentic Kernel Libraries

Published npm packages in `libs/`:

| Package | Version | Description |
|---------|---------|-------------|
| `@metaventionsai/cpb-core` | 1.1.0 | Cognitive Precision Bridge - AI orchestration with DQ scoring |
| `@metaventionsai/voice-nexus` | 1.1.0 | Multi-provider voice architecture (STT/reasoning/TTS) |

```bash
# Build packages
cd libs/cpb-core && npm run build
cd libs/voice-nexus && npm run build
```

See `libs/README.md` for architecture details.

### State Management

Uses Zustand with slices pattern. Global state in `store.ts`.

### AI Services

- Primary: Gemini (`geminiService.ts`)
- Secondary: Claude (`claudeService.ts`), Grok (`grokService.ts`)
- Voice: ElevenLabs (`elevenLabsService.ts`)

## Testing

```bash
npm test                    # Watch mode
npm run test:run            # Single run
npm run test:run -- <file>  # Run specific test file
```

Tests use Vitest with React Testing Library and happy-dom.

## Linting

ESLint is configured with relaxed rules for the existing codebase:

- `@typescript-eslint/no-explicit-any`: off
- `@typescript-eslint/no-unused-vars`: off
- `react-hooks/exhaustive-deps`: warn

## Session Context

Check these files before starting work:

- `.agent/memory.md` — Agent memory state
- `~/.antigravity/research/os_app_master_proposal` — Master research proposal

## Cost Awareness

Prefer targeted file reads over broad exploration. App.tsx is large—read specific line ranges when needed.

### Services Directory
```
file DynamicToolRegistry.ts
dir __tests__
dir actions
file adaptiveConsensus.ts
file agentAuction.ts
file agents.ts
file agoraService.ts
file apiKeyService.ts
file apiUsageService.ts
dir archon
file audioService.ts
file autopoieticDaemon.ts
file bicameralService.ts
dir biometric
file claudeService.ts
file codebaseAwareness.ts
dir cognitivePrecisionBridge
file collabService.ts
file complexityEstimator.ts
file componentActionRegistry.ts
file convergenceMemory.ts
file cpbProviders.ts
file cpbService.ts
file daemonService.ts
file dqScoring.ts
file dreamProtocol.ts
file elevenLabsService.ts
file faceDetectionService.ts
file geminiService.ts
file gpuPricingService.ts
file grokService.ts
file hopGrouping.ts
file infracostService.ts
dir kernel
file liveSession.ts
dir memory
file metaventionService.ts
file minerstatService.ts
file modelRouter.ts
file ollamaService.ts
file openaiService.ts
dir persistence
file persistenceService.ts
file powerService.ts
file priceApiService.ts
file recursiveLanguageModel.ts
file selfEvolution.ts
file supabaseService.ts
file tabNavigationRegistry.ts
file toolRegistry.ts
dir ui
file unifiedActionRegistry.ts
file unitTestingService.ts
file universalVoiceHooks.ts
file vendorService.ts
dir voice
file voiceActionRegistry.ts
file voiceCoreIntegration.ts
dir voiceNexus
file voiceUIContext.ts
```

### Components Directory
```
file AgentCoreTest.tsx
file AgoraPanel.tsx
file ApiKeyModal.tsx
file ApiUsageIndicator.tsx
file AppFooter.tsx
file AuthModule.tsx
file BicameralEngine.tsx
file CPBMonitor.tsx
file CPBStatusOverlay.tsx
file CPBTest.tsx
file ContextVelocityChart.tsx
file DEcosystem.tsx
file DynamicVisuals.tsx
file DynamicWidget.tsx
file EmotionalResonanceGraph.tsx
file ExperimentLogger.tsx
file FlywheelOrbit.tsx
file GlobalErrorBoundary.tsx
file GlobalStatusBar.tsx
file HelpCenter.tsx
file HoloProjector.tsx
file HolographicCommandDeck.tsx
file KnowledgeGraph.tsx
file LayerToggle.tsx
file MasterStabilizationProtocol.tsx
file MemoryCore.tsx
file MermaidDiagram.tsx
dir MetaventionsHub
file MetaventionsLogo.tsx
file ModelSelector.tsx
file NeuralDebuggerPanel.tsx
file NeuralDock.tsx
file NeuralHeader.tsx
file NexusAPIExplorer.tsx
file OperationalSidebar.tsx
file OverlayOS.tsx
file PeerMeshOverlay.tsx
file Starfield.tsx
file StrategicConsole.tsx
file SunMoonToggle.tsx
file SynapticContextHub.tsx
file SynapticRouter.tsx
dir SynthesisBridge
file SystemNotification.tsx
file TacticalScanner.tsx
file TaskBoard.tsx
file ThemeSwitcher.tsx
file TimeTravelScrubber.tsx
file UniversalVoiceProvider.tsx
file UserProfileOverlay.tsx
file VisualCortexOverlay.tsx
dir Visualizations
file ZenithDisplay.tsx
dir agents
dir autogen
dir biometric
dir core
dir finance
dir generation
dir graph
dir hardware
file index.ts
dir layout
dir overlays
dir predictions
dir research
dir shared
dir voice
```

### Hooks Directory
```
file useAdaptiveUI.ts
file useAgentRuntime.ts
file useApiKeyModal.ts
file useApiUsage.ts
file useAuthPersistence.ts
file useAutoSave.ts
file useBiometricSensor.ts
file useConversationalVoice.ts
file useDaemonSwarm.ts
file useFixationGlow.ts
file useFlywheel.ts
file useGazeTracking.ts
file useGpuCatalog.ts
file useKernelLifecycle.ts
file useKernelUptime.ts
file useNavigation.ts
file usePerformanceMonitor.ts
file usePerspectiveRefraction.ts
file useProcessVisualizerLogic.ts
file useResearchAgent.ts
file useStressDetector.ts
file useThemeVariables.ts
file useTimeTravel.ts
file useVisualCortex.ts
file useVoiceAction.ts
file useVoiceControl.ts
file useVoiceExpose.ts
```

## META-VENGINE Architecture

### Root Structure
```
file .DS_Store
dir .agent
file .gitignore
file .session.lock
file .watchdog-heartbeat
file ARCHITECTURE_PRINCIPLES.md
file AUTONOMOUS_CAPABILITIES.md
file CAPABILITY_QUICK_REFERENCE.md
file CHANGELOG.md
file CLAUDE.md
file DASHBOARD_README.md
file ERRORS.md
file OBSERVATORY_README.md
file README.md
file RESEARCHGRAVITY_UPDATE.md
file ROUTING_ARCHITECTURE_DIAGRAM.txt
file ROUTING_DOCS_INDEX.md
file ROUTING_QUICK_REFERENCE.md
file ROUTING_SYSTEM_README.md
file SECURITY.md
file SKILL-GUIDE.md
dir briefs
file claude-md-history
dir commands
dir config
dir coordinator
dir daemon
dir dashboard
dir data
dir docs
dir hooks
file init.sh
dir kernel
dir logs
dir memory
dir plugins
dir scripts
dir session-summaries
file settings.json
dir skills
file statusline-command.sh
file statusline-command.sh.bak
dir supermemory
dir tasks
dir tmp
dir versions
```

## agent-core Architecture

### Root Structure
```
dir .github
file .gitignore
file CHANGELOG.md
file CONTRIBUTING.md
file LICENSE
file README.md
file SKILL.md
dir assets
dir references
dir scripts
file setup.sh
dir specs
dir workflows
```

## CareerCoachAntigravity Architecture

### App Directory
```
dir api
dir career-intelligence
dir components
file globals.css
file layout.tsx
file page.tsx
dir resume-builder
```

### Lib Directory
```
dir ai
file api-client.ts
file archetypes.ts
dir career-intelligence
file data-sources.ts
file error-tracking.ts
dir hooks
dir interview-prep
dir job-scraper
dir job-tracker
file logger.test.ts
file logger.ts
file middleware.test.ts
file middleware.ts
file nexus.ts
dir onboarding
dir playbooks
file rate-limiter.ts
dir rate-limiter
dir resume-builder
file settings-store.ts
dir storage
file store.ts
file utils.ts
dir voice
```

