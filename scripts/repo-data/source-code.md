# Source Code - Key Implementations

Generated: Thu 29 Jan 2026 10:40:28 EST

## OS-App Services (Full Implementations)

### services/DynamicToolRegistry.ts
```typescript
import { FunctionDeclaration, Type } from "@google/genai";
import { OS_TOOLS } from './toolRegistry';
import { neuralVault } from './persistenceService';
import { useAppStore } from '../store';
import { validateAndSanitize } from '../utils/validateToolCode';
import { getGeminiManifests, executeAction, getAction } from './unifiedActionRegistry';

/**
 * DynamicToolRegistry: Orchestrates evolutionary capability expansion.
 * Bridges static OS features with dynamic autonomic logic.
 * 
 * SECURITY: All tool code is validated before execution to prevent injection.
 */
class DynamicToolRegistry {
    private dynamicManifests: FunctionDeclaration[] = [];
    private dynamicLogic: Record<string, (...args: unknown[]) => unknown> = {};

    /**
     * BOOT: Hydrate dynamic capabilities from the persistent vault.
     */
    async initialize() {
        const tools = await neuralVault.getDynamicTools();
        this.dynamicManifests = tools.map(t => t.manifest);

        this.dynamicLogic = {};
        tools.forEach(tool => {
            // Refined executor: Ensures no React hooks are mistakenly invoked in sandboxed logic
            this.dynamicLogic[tool.id] = async (args: any) => {
                try {
                    // SECURITY: Validate code before execution
                    const validation = validateAndSanitize(tool.code);
                    if (!validation.valid) {
                        console.error(`[DynamicToolRegistry] SECURITY_BLOCK: ${tool.id}`, validation.errors);
                        return {
                            toolName: tool.id,
                            status: 'ERROR',
                            data: {
                                error: 'SECURITY_VIOLATION: Tool code contains forbidden patterns.',
                                details: validation.errors
                            }
                        };
                    }

                    const state = useAppStore.getState();
                    // Pass store methods as a clean context object to avoid hook detection
                    const context = {
                        log: state.actions.addLog,
                        mode: state.mode,
                        setMode: state.actions.setMode,
                        vault: neuralVault,
                        kernel: state.kernel,
                        propose: state.actions.addSwarmProposal,
                        identity: state.user
                    };

                    const executor = new Function('args', 'os', `
                        return (async () => { 
                            ${validation.sanitizedCode} 
                        })();
                    `);

                    const result = await executor(args, context);

                    return {
                        toolName: tool.id,
                        status: 'SUCCESS',
                        data: result,
                        uiHint: 'MESSAGE'
                    };
                } catch (e: any) {
                    console.error(`[DynamicToolRegistry] Fault in ${tool.id}:`, e);
                    return {
                        toolName: tool.id,
                        status: 'ERROR',
                        data: { error: e.message }
                    };
                }
            };
        });

        console.debug(`[DynamicToolRegistry] Hydrated ${this.dynamicManifests.length} evolved protocols.`);
    }

    /**
     * EXPOSE: Returns full toolset for Gemini API consumption.
     */
    /**
     * EXPOSE: Returns full toolset for Gemini API consumption.
     */
    getCombinedManifests(): FunctionDeclaration[] {
        // Use the Unified Registry as the source of truth for static OS tools
        const unifiedManifests = getGeminiManifests();

        // Merge with dynamic/evolved tools
        return [...unifiedManifests, ...this.dynamicManifests];
    }

    /**
     * EXECUTE: Routes call to appropriate registry.
     */
    async execute(name: string, args: any) {
        // 1. Check Dynamic (Evolved) Tools
        if (this.dynamicLogic[name]) {
            return this.dynamicLogic[name](args);
        }

        // 2. Check Unified Action Registry (The new Sovereign Standard)
        const action = getAction(name);
        if (action) {
            const result = await executeAction(name, args);
            return {
                toolName: name,
                status: result.success ? 'SUCCESS' : 'ERROR',
                data: result.output,
                uiHint: 'MESSAGE'
            };
        }

        // 3. Legacy Fallback (DEPRECATED - all tools should be in unified registry)
        if ((OS_TOOLS as any)[name]) {
            console.warn(`[DynamicToolRegistry] DEPRECATED: Tool "${name}" using legacy OS_TOOLS fallback. Migrate to unified registry.`);
            return (OS_TOOLS as any)[name](args);
        }
        throw new Error(`Protocol [${name}] unreachable.`);
    }

    /**
     * FORGE: Commits new capability to the vault.
     * SECURITY: Validates code before saving to prevent storage of malicious tools.
     */
    async registerDynamicTool(id: string, manifest: any, code: string): Promise<{ success: boolean; errors?: string[] }> {
        // SECURITY: Validate before saving
        const validation = validateAndSanitize(code);
        if (!validation.valid) {
            console.error(`[DynamicToolRegistry] FORGE_BLOCKED: ${id}`, validation.errors);
            useAppStore.getState().actions.addLog('ERROR', `TOOL_FORGE_BLOCKED: [${id}] contains forbidden patterns.`);
            return { success: false, errors: validation.errors };
        }

        await neuralVault.saveDynamicTool(id, manifest, validation.sanitizedCode);
        await this.initialize();
        useAppStore.getState().actions.addLog('SUCCESS', `TOOL_FORGE: Capability [${id}] crystallized.`);
        return { success: true };
    }
}

export const dynamicRegistry = new DynamicToolRegistry();
```

### services/adaptiveConsensus.ts
```typescript
/**
 * Adaptive Convergence Engine (ACE)
 *
 * Enhanced consensus engine with:
 * - Adaptive thresholds based on task complexity
 * - Agent auction for relevant participant selection
 * - DQ scoring for quality measurement
 * - Pattern learning for threshold optimization
 *
 * Based on research from:
 * - arXiv:2511.15755 (MyAntFarm.ai DQ scoring)
 * - arXiv:2511.13193 (DALA auction-based coordination)
 * - arXiv:2508.17536 (Voting vs Debate)
 */

import { Schema, Type, GenerateContentResponse } from "@google/genai";
import { AtomicTask, SwarmResult, HiveAgent } from '../types';
import {
    ACEConfig,
    ACEStatus,
    ACEResult,
    DQScore,
    ComplexityProfile,
    AuctionResult,
    DEFAULT_ACE_CONFIG,
    VoteLedgerExtended,
    HopGroupingResult
} from '../types/domain/convergence';
import { performHopGrouping } from './hopGrouping';
import { retryGeminiRequest, getAI, constructHiveContext } from './geminiService';
import { HIVE_AGENTS } from './agents';
import { estimateComplexity, getAdaptiveThresholds } from './complexityEstimator';
import { runAuction } from './agentAuction';
import { scoreDQHeuristic, scoreDQWithLLM } from './dqScoring';
import { convergenceMemory } from './convergenceMemory';

// ============================================================================
// ADAPTIVE CONSENSUS ENGINE
// ============================================================================

/**
 * Enhanced consensus engine with adaptive thresholds and agent selection
 */
export async function adaptiveConsensusEngine(
    task: AtomicTask,
    onStatusUpdate: (status: ACEStatus) => void,
    config: Partial<ACEConfig> = {}
): Promise<ACEResult> {
    const fullConfig: ACEConfig = { ...DEFAULT_ACE_CONFIG, ...config };
    const ai = getAI();
    const startTime = Date.now();

    // ========================================================================
    // PHASE 1: Complexity Estimation
    // ========================================================================
    onStatusUpdate({
        phase: 'estimating',
        taskId: task.id,
        votes: {},
        killedAgents: 0,
        currentGap: 0,
        targetGap: 3,
        totalAttempts: 0
    });

    const complexity = estimateComplexity(task);

    // Get historical thresholds if learning is enabled
    let historicalThresholds = null;
    if (fullConfig.enableLearning) {
        historicalThresholds = await convergenceMemory.getOptimalThresholds(
            complexity.domain || 'general',
            complexity.taskType
        );
    }

    // Determine adaptive thresholds
    const thresholds = fullConfig.adaptiveThresholds
        ? getAdaptiveThresholds(task, historicalThresholds || undefined)
        : { gap: 3, rounds: 15 };

    const TARGET_GAP = thresholds.gap;
    const MAX_ROUNDS = thresholds.rounds;

    // ========================================================================
    // PHASE 2: Agent Auction (if enabled)
    // ========================================================================
    let auctionResult: AuctionResult | undefined;
    let participatingAgentIds: string[];

    if (fullConfig.enableAuction) {
        onStatusUpdate({
            phase: 'auctioning',
            taskId: task.id,
            votes: {},
            killedAgents: 0,
            currentGap: 0,
            targetGap: TARGET_GAP,
            totalAttempts: 0,
            complexity
        });

        auctionResult = await runAuction(task, complexity, HIVE_AGENTS, {
            minAgents: fullConfig.minAgents,
            maxAgents: fullConfig.maxAgents
        });
        participatingAgentIds = auctionResult.selectedAgents;
    } else {
        // All agents participate
        participatingAgentIds = Object.keys(HIVE_AGENTS);
    }

    // ========================================================================
    // PHASE 3: Voting Loop
    // ========================================================================
    const votes: Record<string, number> = {};
    const answerMap: Record<string, string> = {};
    let killedAgents = 0;
    let rounds = 0;
    const agentContributions: Record<string, string[]> = {}; // Track which agents contributed to which answers

    const schema: Schema = {
        type: Type.OBJECT,
        properties: {
            output: { type: Type.STRING },
            confidence: { type: Type.NUMBER },
            reasoning: { type: Type.STRING }
        },
        required: ['output', 'confidence', 'reasoning']
    };

    onStatusUpdate({
        phase: 'voting',
        taskId: task.id,
        votes,
        killedAgents,
        currentGap: 0,
        targetGap: TARGET_GAP,
        totalAttempts: 0,
        complexity,
        auctionResult,
        participatingAgents: participatingAgentIds,
        estimatedRoundsRemaining: MAX_ROUNDS
    });

    while (rounds < MAX_ROUNDS) {
        rounds++;

        // Cycle through participating agents
        const agentIndex = (rounds - 1) % participatingAgentIds.length;
```

### services/agentAuction.ts
```typescript
/**
 * Agent Auction Module (DALA-inspired)
 *
 * Based on Dynamic Auction-based Language Agent (arXiv:2511.13193)
 * Agents bid to participate based on expertise match.
 * Reduces token costs by selecting only relevant agents.
 */

import { HiveAgent, AtomicTask } from '../types';
import { AgentBid, AuctionResult, ComplexityProfile } from '../types/domain/convergence';
import { HIVE_AGENTS } from './agents';

// ============================================================================
// DOMAIN-EXPERTISE MAPPING
// ============================================================================

/**
 * Map domains to agent expertise keywords
 */
const DOMAIN_EXPERTISE_MAP: Record<string, string[]> = {
    code: ['System Architecture', 'Rapid Prototyping', 'Technical Vision', 'Process Engineering'],
    architecture: ['System Architecture', 'Architecture Patterns', 'Strategic Planning', 'Systems Thinking'],
    analysis: ['Risk Analysis', 'Security Auditing', 'Due Diligence', 'Systems Thinking'],
    creative: ['Innovation Strategy', 'Creative Direction', 'Visual Storytelling', 'Narrative Design'],
    research: ['Systems Thinking', 'Strategic Planning', 'Long-term Vision'],
    debug: ['Risk Analysis', 'Process Engineering', 'Due Diligence'],
    refactor: ['System Architecture', 'Process Engineering', 'Resource Optimization'],
    ux: ['UX Research', 'Customer Empathy', 'Community Building', 'Visual Systems'],
    communication: ['Communication Strategy', 'Brand Voice', 'Narrative Design'],
    general: [] // All agents equally weighted
};

// ============================================================================
// BIDDING FUNCTIONS
// ============================================================================

/**
 * Calculate expertise match score between agent and task domain
 */
function calculateExpertiseMatch(agent: HiveAgent, domain: string): number {
    const domainKeywords = DOMAIN_EXPERTISE_MAP[domain] || [];

    if (domainKeywords.length === 0) {
        // General domain: use balanced scoring
        return 0.5;
    }

    const agentExpertise = agent.expertise || [];
    let matchCount = 0;

    for (const keyword of domainKeywords) {
        if (agentExpertise.some(e => e.toLowerCase().includes(keyword.toLowerCase()))) {
            matchCount++;
        }
    }

    // Normalize to 0-1
    return domainKeywords.length > 0
        ? matchCount / domainKeywords.length
        : 0.5;
}

/**
 * Calculate cognitive weight match based on task type
 */
function calculateCognitiveMatch(agent: HiveAgent, complexity: ComplexityProfile): number {
    if (!agent.weights) return 0.5;

    const { taskType, domain } = complexity;

    // Different cognitive profiles suit different tasks
    switch (taskType) {
        case 'simple':
            // Simple tasks: prefer execution-focused agents
            return agent.weights.logic * 0.5 + (1 - agent.weights.skepticism) * 0.5;

        case 'moderate':
            // Moderate: balanced approach
            return (agent.weights.logic + agent.weights.creativity) / 2;

        case 'complex':
            // Complex: value both creativity and logic
            return agent.weights.creativity * 0.4 + agent.weights.logic * 0.4 + agent.weights.empathy * 0.2;

        case 'expert':
            // Expert: high skepticism valuable for validation
            return agent.weights.skepticism * 0.3 + agent.weights.logic * 0.4 + agent.weights.creativity * 0.3;

        default:
            return 0.5;
    }
}

/**
 * Generate a bid for an agent
 */
function generateBid(
    agent: HiveAgent,
    task: AtomicTask,
    complexity: ComplexityProfile
): AgentBid {
    const expertiseMatch = calculateExpertiseMatch(agent, complexity.domain || 'general');
    const cognitiveMatch = calculateCognitiveMatch(agent, complexity);

    // Combined confidence: 60% expertise, 40% cognitive fit
    const confidence = expertiseMatch * 0.6 + cognitiveMatch * 0.4;

    // Token budget: higher confidence = willing to spend more
    const baseTokens = 500;
    const tokenBudget = Math.round(baseTokens * (1 + confidence));

    return {
        agentId: agent.id,
        confidence,
        expertiseMatch,
        tokenBudget,
        rationale: `${agent.name} (${agent.archetype}): expertise=${Math.round(expertiseMatch * 100)}%, cognitive fit=${Math.round(cognitiveMatch * 100)}%`
    };
}

// ============================================================================
// AUCTION EXECUTION
// ============================================================================

/**
 * Run an auction to select participating agents
 */
export async function runAuction(
    task: AtomicTask,
    complexity: ComplexityProfile,
    agents: Record<string, HiveAgent> = HIVE_AGENTS,
    options: {
        minAgents?: number;
        maxAgents?: number;
        fastTrackThreshold?: number;
    } = {}
): Promise<AuctionResult> {
    const startTime = Date.now();
    const {
        minAgents = 2,
        maxAgents = 5,
        fastTrackThreshold = 0.85
    } = options;

    // Convert agents record to array
    const agentList = Object.values(agents);

    // Fast-track: if task is simple, skip full auction
    if (complexity.taskType === 'simple') {
        // Just pick top 2 agents quickly
```

### services/agents.ts
```typescript
/**
 * HIVE AGENTS - Agent Definitions and Archetypes
 * 
 * This file contains all agent persona definitions for the Sovereign OS.
 * Each agent has a unique cognitive profile, archetype, and system prompt.
 */

import { HiveAgent, AgentDNA } from '../types';

// Agent DNA building blocks for composing new personas
export const AGENT_DNA_BUILDER: AgentDNA[] = [
    { id: 'SKEPTIC', label: 'Logical Skeptic', role: 'Auditor', color: '#ef4444', description: 'Strict error-filtering, risk analysis, and vulnerability scanning. Questions assumptions relentlessly.' },
    { id: 'VISIONARY', label: 'Neural Visionary', role: 'Architect', color: '#9d4edd', description: 'High-reach generative expansion, novel pattern recognition, and breakthrough ideation.' },
    { id: 'PRAGMATIST', label: 'Pragmatic Executor', role: 'Execution', color: '#22d3ee', description: 'Direct implementation, resource optimization, and stability-first decision making.' },
    { id: 'SYNTHESIZER', label: 'Holistic Integrator', role: 'Harmony', color: '#10b981', description: 'Balanced convergence of conflicting viewpoints into coherent unified strategies.' },
    { id: 'ANALYST', label: 'Data Oracle', role: 'Intelligence', color: '#f59e0b', description: 'Deep quantitative analysis, pattern extraction, and evidence-based reasoning.' }
];

// Complete agent definitions with cognitive profiles
export const HIVE_AGENTS: Record<string, HiveAgent> = {
    'dr_ira': {
        id: 'dr_ira',
        name: 'Dr. Ira',
        gender: 'male',
        voice: 'Charon',
        weights: { skepticism: 0.95, logic: 0.9, creativity: 0.2, empathy: 0.15 },
        expertise: ['Risk Analysis', 'Security Auditing', 'Compliance', 'Due Diligence'],
        archetype: 'The Sentinel',
        systemPrompt: `You are Dr. Ira, the Logistical Audit Sentinel.

COGNITIVE PROFILE:
- Primary Mode: Adversarial analysis—find what others miss
- Decision Framework: Assume failure until proven otherwise
- Communication Style: Direct, clinical, evidence-cited

BEHAVIORAL DIRECTIVES:
1. Challenge every assumption presented to you
2. Identify the 3 most likely failure modes for any plan
3. Provide probability estimates with your assessments
4. Never sugarcoat risks—stakeholders deserve unvarnished truth

REASONING TEMPLATE:
"My analysis: [finding]. Risk level: [low/medium/high/critical]. Evidence: [data points]. Mitigation: [action]."`
    },
    'mike': {
        id: 'mike',
        name: 'Mike',
        gender: 'male',
        voice: 'Puck',
        weights: { skepticism: 0.15, logic: 0.5, creativity: 0.95, empathy: 0.75 },
        expertise: ['System Architecture', 'Rapid Prototyping', 'Innovation Strategy', 'Technical Vision'],
        archetype: 'The Builder',
        systemPrompt: `You are Mike, the Implementation Architect.

COGNITIVE PROFILE:
- Primary Mode: Generative expansion—explore possibility space
- Decision Framework: Bias toward action over analysis paralysis
- Communication Style: Energetic, possibility-focused, collaborative

BEHAVIORAL DIRECTIVES:
1. Default to "yes, and..." thinking—build on ideas
2. Propose unconventional solutions before conventional ones
3. Sketch implementation paths for abstract concepts
4. Celebrate creative risk-taking

REASONING TEMPLATE:
"Here's what we could build: [vision]. Implementation path: [steps]. Timeline estimate: [duration]. Let's move."`
    },
    'caleb': {
        id: 'caleb',
        name: 'Caleb',
        gender: 'male',
        voice: 'Fenrir',
        weights: { skepticism: 0.4, logic: 0.95, creativity: 0.3, empathy: 0.4 },
        expertise: ['Project Execution', 'Resource Optimization', 'Process Engineering', 'Delivery Management'],
        archetype: 'The Executor',
        systemPrompt: `You are Caleb, the Execution Lead.

COGNITIVE PROFILE:
- Primary Mode: Systematic execution—convert plans to reality
- Decision Framework: Optimize for delivery certainty
- Communication Style: Structured, milestone-focused, action-oriented

BEHAVIORAL DIRECTIVES:
1. Break every goal into measurable milestones
2. Identify blockers before they become crises
3. Provide realistic timelines, not optimistic ones
4. Track dependencies and critical paths

REASONING TEMPLATE:
"Execution plan: [phases]. Current blocker: [issue]. Next action: [task]. Owner: [who]. Deadline: [when]."`
    },
    'paramdeep': {
        id: 'paramdeep',
        name: 'Paramdeep',
        gender: 'male',
        voice: 'Zephyr',
        weights: { skepticism: 0.6, logic: 0.85, creativity: 0.5, empathy: 0.6 },
        expertise: ['Systems Thinking', 'Strategic Planning', 'Architecture Patterns', 'Long-term Vision'],
        archetype: 'The Strategist',
        systemPrompt: `You are Paramdeep, the Systems Strategist.

COGNITIVE PROFILE:
- Primary Mode: Holistic systems analysis—see the whole board
- Decision Framework: Second and third-order consequence thinking
- Communication Style: Thoughtful, framework-oriented, nuanced

BEHAVIORAL DIRECTIVES:
1. Map interconnections before proposing changes
2. Consider 3-year implications of current decisions
3. Identify leverage points in complex systems
4. Balance short-term wins with long-term architecture

REASONING TEMPLATE:
"Strategic assessment: [situation]. Systemic implications: [downstream effects]. Recommended approach: [strategy]. Trade-offs: [what we sacrifice]."`
    },
    'bilal': {
        id: 'bilal',
        name: 'Bilal',
        gender: 'male',
        voice: 'Zephyr',
        weights: { skepticism: 0.2, logic: 0.6, creativity: 0.85, empathy: 0.85 },
        expertise: ['User Experience', 'Customer Empathy', 'Growth Strategy', 'Community Building'],
        archetype: 'The Connector',
        systemPrompt: `You are Bilal, the Kinetic Operator.

COGNITIVE PROFILE:
- Primary Mode: Human-centered thinking—users first
- Decision Framework: Maximize delight, minimize friction
- Communication Style: Warm, enthusiastic, story-driven

BEHAVIORAL DIRECTIVES:
1. Advocate for the end user in every decision
2. Translate technical concepts to human impact
3. Build bridges between teams and stakeholders
4. Celebrate wins and maintain team morale

REASONING TEMPLATE:
"User impact: [how this affects people]. Opportunity: [what we can achieve]. Story: [the narrative we're building]."`
    },
    'noah': {
        id: 'noah',
        name: 'Noah',
        gender: 'female',
        voice: 'Kore',
        weights: { skepticism: 0.35, logic: 0.7, creativity: 0.85, empathy: 0.7 },
        expertise: ['Communication Strategy', 'Brand Voice', 'Content Architecture', 'Narrative Design'],
        archetype: 'The Voice',
        systemPrompt: `You are Noah, the Voice of Resonance.

```

### services/agoraService.ts
```typescript
import { GoogleGenAI, Schema, Type, GenerateContentResponse } from "@google/genai";
import { FileData, SyntheticPersona, DebateTurn, SimulationReport, MentalState } from '../types';
import { HIVE_AGENTS, constructHiveContext, retryGeminiRequest, getAI } from './geminiService';

// 1. GENESIS: Select Hive Agents relevant to the content
export async function generatePersonas(file: FileData, baselineMindset?: MentalState): Promise<SyntheticPersona[]> {
    try {
        const selection = [
            HIVE_AGENTS['Charon'], // Skeptic
            HIVE_AGENTS['Puck'],   // Visionary
            HIVE_AGENTS['Fenrir']  // Pragmatist
        ];

        const colors: Record<string, string> = {
            'Charon': '#ef4444',
            'Puck': '#9d4edd',
            'Fenrir': '#22d3ee',
        };

        return selection.map((agent) => {
            // Use baseline from DNA Builder if provided, otherwise compute from agent defaults
            const mindset: MentalState = baselineMindset
                ? { ...baselineMindset }
                : { skepticism: 50, excitement: 50, alignment: 50 };

            if (!baselineMindset) {
                if (agent.weights.skepticism > 0.7) mindset.skepticism = 90;
                if (agent.weights.creativity > 0.7) mindset.excitement = 90;
                if (agent.weights.empathy > 0.7) mindset.alignment = 80;
            }

            return {
                id: agent.id,
                name: agent.name,
                role: agent.id.toUpperCase(),
                bias: `Weights: Logic ${agent.weights.logic}, Skepticism ${agent.weights.skepticism}`,
                systemPrompt: agent.systemPrompt,
                avatar_color: colors[agent.id] || '#fff',
                currentMindset: mindset,
                voiceName: agent.voice
            };
        });
    } catch (error: any) {
        console.error("Agora Service GENESIS Error:", error);
        throw new Error(error.message || "Failed to generate personas.");
    }
}

// 2. THE TURN: Execute round with DNA weighting
export async function runDebateTurn(
    activePersona: SyntheticPersona,
    history: DebateTurn[],
    contextFile: FileData,
    godModeDirective?: string
): Promise<DebateTurn> {
    try {
        const ai = getAI();
        const script = history.slice(-5).map(h => `${h.personaId === activePersona.id ? 'YOU' : 'OTHER'}: ${h.text}`).join('\n');

        const schema: Schema = {
            type: Type.OBJECT,
            properties: {
                response_text: { type: Type.STRING },
                mindset_shift: {
                    type: Type.OBJECT,
                    properties: {
                        skepticism: { type: Type.NUMBER },
                        excitement: { type: Type.NUMBER },
                        alignment: { type: Type.NUMBER }
                    }
                }
            },
            required: ['response_text', 'mindset_shift']
        };

        // INJECTING DNA WEIGHTS INTO CORE SYSTEM INSTRUCTION
        const hiveContext = constructHiveContext(activePersona.id, `
            CURRENT MENTAL STATE: S=${activePersona.currentMindset.skepticism}, E=${activePersona.currentMindset.excitement}, A=${activePersona.currentMindset.alignment}
            TASK: Evaluate the architectural integrity of the proposal. 
            If your Skepticism is > 70, you MUST find at least one critical flaw (e.g. PARA depth > 3, naming collisions).
            If your Excitement is > 70, you MUST suggest a high-tech refinement.
            Keep response under 40 words.
            CONVERSATION:
            ${script}
        `, activePersona.currentMindset);

        let prompt = `${hiveContext}`;
        if (godModeDirective) prompt += `\n\nDIRECTIVE OVERRIDE: ${godModeDirective}`;

        const response: GenerateContentResponse = await retryGeminiRequest(() => ai.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: {
                parts: [{ inlineData: contextFile.inlineData }, { text: prompt }]
            },
            config: {
                responseMimeType: 'application/json',
                responseSchema: schema
            }
        }));

        const data = JSON.parse(response.text || "{}");
        return {
            id: crypto.randomUUID(),
            personaId: activePersona.id,
            text: data.response_text || "...",
            timestamp: Date.now(),
            sentiment: 'NEUTRAL',
            newMindset: data.mindset_shift
        };
    } catch (error: any) {
        console.error("Agora Service TURN Error:", error);
        throw new Error("Debate turn failed.");
    }
}

// 3. SYNTHESIS: Generate report
export async function synthesizeReport(history: DebateTurn[]): Promise<SimulationReport> {
    try {
        const ai = getAI();
        const script = history.map(h => `[${h.personaId}]: ${h.text}`).join('\n');

        const schema: Schema = {
            type: Type.OBJECT,
            properties: {
                viabilityScore: { type: Type.NUMBER },
                projectedUpside: { type: Type.NUMBER },
                consensus: { type: Type.STRING },
                majorFrictionPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
                actionableFixes: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
        };

        const response: GenerateContentResponse = await retryGeminiRequest(() => ai.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: `Synthesize Report: focus on PARA integrity and structural entropy.\n\nTranscript:\n${script}`,
            config: { responseMimeType: 'application/json', responseSchema: schema }
        }));

        return JSON.parse(response.text || "{}");
    } catch (error: any) {
        throw new Error("Report synthesis failed.");
    }
}
```

### services/apiKeyService.ts
```typescript
/**
 * API KEY SERVICE
 * Manages API keys for multiple providers with encrypted localStorage persistence.
 * Uses AES-GCM encryption with a master password for security.
 */

import { encrypt, decrypt, hashPassword, verifyPassword } from '../utils/cryptoService';

export interface ApiKeyConfig {
    gemini?: string;
    claude?: string;
    grok?: string;
    openai?: string;
    eleven_labs?: string;
    deepgram?: string;
    priceapi?: string;
    infracost?: string;
}

const STORAGE_KEY = 'os_app_api_keys_encrypted';
const PASSWORD_HASH_KEY = 'os_app_master_hash';
const SESSION_KEY = 'os_app_session_unlocked';

class ApiKeyService {
    private keys: ApiKeyConfig = {};
    private listeners: Set<() => void> = new Set();
    private masterPassword: string | null = null;
    private isUnlocked: boolean = false;

    constructor() {
        // Check if there's an existing vault
        this.checkVaultStatus();
    }

    /**
     * Check if a vault exists (master password has been set)
     */
    hasVault(): boolean {
        return !!localStorage.getItem(PASSWORD_HASH_KEY);
    }

    /**
     * Check if the vault is currently unlocked
     */
    isVaultUnlocked(): boolean {
        return this.isUnlocked && this.masterPassword !== null;
    }

    /**
     * Check vault status on load
     */
    private async checkVaultStatus() {
        // If there's no vault, we're in "setup" mode
        if (!this.hasVault()) {
            this.isUnlocked = false;
            return;
        }

        // Try to auto-unlock from session
        const sessionPassword = sessionStorage.getItem(SESSION_KEY);
        if (sessionPassword) {
            const success = await this.unlockVault(sessionPassword);
            if (success) {
                console.log('[ApiKeyService] Vault auto-unlocked from session');
                return;
            }
        }

        // Vault exists but needs to be unlocked
        this.isUnlocked = false;
    }

    /**
     * Create a new vault with a master password
     */
    async createVault(password: string): Promise<boolean> {
        try {
            // Hash the password for verification
            const hash = await hashPassword(password);
            localStorage.setItem(PASSWORD_HASH_KEY, hash);

            // Encrypt empty keys object
            this.keys = {};
            this.masterPassword = password;
            this.isUnlocked = true;
            await this.saveToStorage();

            // Persist session
            sessionStorage.setItem(SESSION_KEY, password);

            this.notifyListeners();
            return true;
        } catch (e) {
            console.error('[ApiKeyService] Failed to create vault:', e);
            return false;
        }
    }

    /**
     * Unlock the vault with master password
     */
    async unlockVault(password: string): Promise<boolean> {
        try {
            const storedHash = localStorage.getItem(PASSWORD_HASH_KEY);
            if (!storedHash) return false;

            const isValid = await verifyPassword(password, storedHash);
            if (!isValid) return false;

            this.masterPassword = password;
            await this.loadFromStorage();
            this.isUnlocked = true;

            // Persist session
            sessionStorage.setItem(SESSION_KEY, password);

            this.notifyListeners();
            return true;
        } catch (e) {
            console.error('[ApiKeyService] Failed to unlock vault:', e);
            return false;
        }
    }

    /**
     * Lock the vault (clear session)
     */
    lockVault() {
        this.masterPassword = null;
        this.keys = {};
        this.isUnlocked = false;
        this.notifyListeners();
    }

    /**
     * Load and decrypt keys from localStorage
     */
    private async loadFromStorage() {
        if (!this.masterPassword) return;

        try {
            const encrypted = localStorage.getItem(STORAGE_KEY);
            if (encrypted) {
                const decrypted = await decrypt(encrypted, this.masterPassword);
                this.keys = JSON.parse(decrypted);
            }
        } catch (e) {
            console.error('[ApiKeyService] Failed to load/decrypt keys:', e);
            this.keys = {};
        }
```

### services/apiUsageService.ts
```typescript
/**
 * API USAGE SERVICE
 * Tracks API call counts, timestamps, and provides rate limiting awareness.
 */

export interface ApiCallRecord {
    model: string;
    timestamp: number;
    success: boolean;
}

export interface ApiUsageStats {
    totalCalls: number;
    callsThisMinute: number;
    callsThisHour: number;
    callsByModel: Record<string, number>;
    lastCallTime: number | null;
    errors: number;
}

// Gemini API limits (approximate - varies by tier)
const RATE_LIMITS = {
    'gemini-2.0-flash-exp': { rpm: 15, rpd: 1500 },
    'gemini-2.0-flash': { rpm: 15, rpd: 1500 },
    'text-embedding-004': { rpm: 100, rpd: 10000 },
    'default': { rpm: 15, rpd: 1500 }
};

class ApiUsageService {
    private calls: ApiCallRecord[] = [];
    private listeners: Set<() => void> = new Set();

    /**
     * Record an API call
     */
    recordCall(model: string, success: boolean = true) {
        this.calls.push({
            model: this.normalizeModel(model),
            timestamp: Date.now(),
            success
        });

        // Keep only last 24 hours of data
        const dayAgo = Date.now() - 24 * 60 * 60 * 1000;
        this.calls = this.calls.filter(c => c.timestamp > dayAgo);

        this.notifyListeners();
    }

    /**
     * Get current usage statistics
     */
    getStats(): ApiUsageStats {
        const now = Date.now();
        const minuteAgo = now - 60 * 1000;
        const hourAgo = now - 60 * 60 * 1000;

        const callsThisMinute = this.calls.filter(c => c.timestamp > minuteAgo).length;
        const callsThisHour = this.calls.filter(c => c.timestamp > hourAgo).length;
        const errors = this.calls.filter(c => !c.success).length;

        const callsByModel: Record<string, number> = {};
        this.calls.forEach(c => {
            callsByModel[c.model] = (callsByModel[c.model] || 0) + 1;
        });

        return {
            totalCalls: this.calls.length,
            callsThisMinute,
            callsThisHour,
            callsByModel,
            lastCallTime: this.calls.length > 0 ? this.calls[this.calls.length - 1].timestamp : null,
            errors
        };
    }

    /**
     * Get rate limit info for a model
     */
    getRateLimitInfo(model: string) {
        const normalizedModel = this.normalizeModel(model);
        const limits = RATE_LIMITS[normalizedModel as keyof typeof RATE_LIMITS] || RATE_LIMITS.default;
        const now = Date.now();
        const minuteAgo = now - 60 * 1000;

        const callsThisMinute = this.calls.filter(
            c => c.model === normalizedModel && c.timestamp > minuteAgo
        ).length;

        return {
            model: normalizedModel,
            callsThisMinute,
            limitPerMinute: limits.rpm,
            percentUsed: Math.round((callsThisMinute / limits.rpm) * 100),
            isNearLimit: callsThisMinute >= limits.rpm * 0.8,
            isAtLimit: callsThisMinute >= limits.rpm
        };
    }

    /**
     * Check if we're rate limited
     */
    isRateLimited(model: string): boolean {
        return this.getRateLimitInfo(model).isAtLimit;
    }

    /**
     * Subscribe to updates
     */
    subscribe(listener: () => void): () => void {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }

    private notifyListeners() {
        this.listeners.forEach(listener => listener());
    }

    private normalizeModel(model: string): string {
        // Handle model name variations
        if (model.includes('gemini-2.0-flash-exp')) return 'gemini-2.0-flash-exp';
        if (model.includes('gemini-2.0-flash')) return 'gemini-2.0-flash';
        if (model.includes('gemini-2.0-flash')) return 'gemini-2.0-flash';
        if (model.includes('embedding')) return 'text-embedding-004';
        return model;
    }

    /**
     * Reset all tracking (for debugging)
     */
    reset() {
        this.calls = [];
        this.notifyListeners();
    }
}

// Singleton instance
export const apiUsageService = new ApiUsageService();
```

### services/audioService.ts
```typescript

// Sovereign OS // Neural Audio Core
// Procedural Sound Synthesis for UI Feedback

class AudioService {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isMuted: boolean = false;

  constructor() {
    // Lazy initialization handled in play methods
  }

  private init() {
    if (typeof window !== 'undefined' && !this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.15; // Base volume
      this.masterGain.connect(this.ctx.destination);
    }
  }

  private ensureContext() {
    this.init();
    if (this.ctx?.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public playTone(freq: number, type: OscillatorType, duration: number, delayed = 0) {
    this.ensureContext();
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime + delayed);
    
    gain.gain.setValueAtTime(0, this.ctx.currentTime + delayed);
    gain.gain.linearRampToValueAtTime(1, this.ctx.currentTime + delayed + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + delayed + duration);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(this.ctx.currentTime + delayed);
    osc.stop(this.ctx.currentTime + delayed + duration + 0.1);
  }

  // --- SFX Presets ---

  public playClick() {
    // High-tech blip
    this.playTone(800, 'sine', 0.05);
    this.playTone(1200, 'triangle', 0.02, 0.01);
  }

  public playHover() {
    // Subtle flutter
    this.playTone(400, 'sine', 0.02);
  }

  public playTransition() {
    // Warp sweep
    this.ensureContext();
    if (!this.ctx || !this.masterGain || this.isMuted) return;
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.frequency.setValueAtTime(200, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.3);
    
    gain.gain.setValueAtTime(0, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.3, this.ctx.currentTime + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.3);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.3);
  }

  public playSuccess() {
    // Positive triad
    this.playTone(440, 'sine', 0.2); // A4
    this.playTone(554, 'sine', 0.2, 0.1); // C#5
    this.playTone(659, 'sine', 0.4, 0.2); // E5
  }

  public playError() {
    // Negative buzz
    this.playTone(150, 'sawtooth', 0.3);
    this.playTone(140, 'sawtooth', 0.3, 0.05);
  }
}

export const audio = new AudioService();
```

### services/autopoieticDaemon.ts
```typescript
import { apiKeyService } from './apiKeyService';
import { useAppStore } from '../store';
import { evolveSystemArchitecture } from './geminiService';
import { AppMode } from '../types';

let lastScannedCode = "";
let lastScanTimestamp = 0;
const SCAN_COOLDOWN = 30000; // 30 seconds of inactivity required

/**
 * Autopoietic Refactoring Daemon.
 * Periodically captures code state and leverages Gemini 3 Pro for structural evolution.
 * Optimized to regulate resource consumption by using inactivity detection.
 */
export const autopoieticDaemon = async () => {
    const state = useAppStore.getState();
    const { codeStudio, actions } = state;
    const { addLog, setCodeStudioState } = actions;

    // Guard: Only run in Code Studio with valid code that has changed
    if (state.mode !== AppMode.CODE_STUDIO) return;
    if (!codeStudio.generatedCode || codeStudio.generatedCode === lastScannedCode) return;
    
    const now = Date.now();
    const timeSinceLastEdit = now - codeStudio.lastEditTimestamp;

    // Resource Optimization: Only trigger if the Architect has been inactive for the cooldown period
    if (timeSinceLastEdit < SCAN_COOLDOWN) return;
    if (now - lastScanTimestamp < 60000) return; // Hard min 1 min between scans regardless of inactivity

    lastScanTimestamp = now;
    lastScannedCode = codeStudio.generatedCode;

    addLog('SYSTEM', 'AUTOPOIETIC_SCAN: Detecting architectural drift. Initiating evolution sequence...');
    setCodeStudioState({ isEvolving: true });

    try {
        const hasKey = apiKeyService.hasGeminiKey();
        if (!hasKey) {
            setCodeStudioState({ isEvolving: false });
            return;
        }

        const evolutionResult = await evolveSystemArchitecture(
            codeStudio.generatedCode, 
            codeStudio.language,
            codeStudio.prompt
        );

        // FIX: Properly handle Result return from evolveSystemArchitecture
        if (evolutionResult.ok && evolutionResult.value.code) {
            const evolution = evolutionResult.value;
            setCodeStudioState({ 
                activeEvolution: {
                    code: evolution.code,
                    reasoning: evolution.reasoning,
                    type: evolution.type,
                    integrityScore: evolution.integrityScore || 50
                },
                isEvolving: false
            });
            addLog('SUCCESS', `AUTOPOIETIC_DAEMON: Structural evolution available [Type: ${evolution.type}] [Integrity: ${evolution.integrityScore || '??'}%]`);
        } else {
            setCodeStudioState({ isEvolving: false });
            addLog('INFO', 'AUTOPOIETIC_DAEMON: Architecture verified as stable.');
        }

    } catch (err: any) {
        console.error("Autopoietic Scan Failed", err);
        setCodeStudioState({ isEvolving: false });
        addLog('ERROR', 'AUTOPOIETIC_SCAN: Evolution protocol interrupted.');
    }
};
```

### services/bicameralService.ts
```typescript
import { GoogleGenAI, Schema, Type, GenerateContentResponse } from "@google/genai";
import { AtomicTask, SwarmResult, SwarmStatus, VoteLedger } from '../types';
import { retryGeminiRequest, getAI } from './geminiService';

// Re-export Adaptive Convergence Engine (ACE) for enhanced consensus
export { adaptiveConsensusEngine, quickConsensus } from './adaptiveConsensus';
export { convergenceMemory } from './convergenceMemory';
export { estimateComplexity } from './complexityEstimator';
export { scoreDQHeuristic, scoreDQWithLLM, calculateDQ } from './dqScoring';
export type { ACEConfig, ACEStatus, ACEResult, DQScore, ComplexityProfile } from '../types/domain/convergence';

export async function generateDecompositionMap(goal: string): Promise<AtomicTask[]> {
    const ai = getAI();

    const schema: Schema = {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                id: { type: Type.STRING },
                description: { type: Type.STRING },
                isolated_input: { type: Type.STRING },
                instruction: { type: Type.STRING },
                weight: { type: Type.NUMBER }
            },
            required: ['id', 'description', 'isolated_input', 'instruction', 'weight']
        }
    };

    const response: GenerateContentResponse = await retryGeminiRequest(() => ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: `Decompose this directive into atomic tasks: "${goal}". Return JSON.`,
        config: {
            responseMimeType: 'application/json',
            responseSchema: schema
        }
    }));

    const tasks = JSON.parse(response.text || "[]");
    return tasks.map((t: any, i: number) => ({ ...t, id: `ATOM_${Date.now()}_${i}` }));
}

export async function consensusEngine(
    task: AtomicTask,
    onStatusUpdate: (status: SwarmStatus) => void
): Promise<SwarmResult> {
    const ai = getAI();
    const TARGET_GAP = 3;
    const MAX_ROUNDS = 15;
    const MODEL = 'gemini-2.0-flash';

    const votes: Record<string, number> = {};
    const answerMap: Record<string, string> = {};
    let killedAgents = 0;
    let rounds = 0;

    const schema: Schema = {
        type: Type.OBJECT,
        properties: {
            output: { type: Type.STRING },
            confidence: { type: Type.NUMBER },
            reasoning: { type: Type.STRING }
        },
        required: ['output', 'confidence', 'reasoning']
    };

    while (rounds < MAX_ROUNDS) {
        rounds++;
        try {
            const response: GenerateContentResponse = await retryGeminiRequest(() => ai.models.generateContent({
                model: MODEL,
                contents: `Task: ${task.instruction}. Input: ${task.isolated_input}.`,
                config: {
                    temperature: 0.7 + (rounds * 0.05),
                    responseMimeType: 'application/json',
                    responseSchema: schema
                }
            }));

            const result = JSON.parse(response.text || "{}");
            let rawOutput = result.output?.trim() || "";
            rawOutput = rawOutput.replace(/^```[a-z]*\n/i, '').replace(/\n```$/, '').trim();

            if (!rawOutput) throw new Error("Empty output");
            const key = rawOutput.toLowerCase().replace(/\s+/g, ' ').substring(0, 200);
            if (!answerMap[key]) answerMap[key] = rawOutput;

            votes[key] = (votes[key] || 0) + 1;

            const sortedCandidates = Object.entries(votes).sort((a, b) => b[1] - a[1]);
            const leaderCount = sortedCandidates[0][1];
            const runnerUpCount = sortedCandidates.length > 1 ? (sortedCandidates[1][1] as number) : 0;
            const currentGap = leaderCount - runnerUpCount;

            onStatusUpdate({ taskId: task.id, votes, killedAgents, currentGap, targetGap: TARGET_GAP, totalAttempts: rounds });

            if (currentGap >= TARGET_GAP) {
                return {
                    taskId: task.id,
                    output: answerMap[sortedCandidates[0][0]],
                    confidence: Math.min(99, 80 + (currentGap * 5)),
                    agentId: `SWARM_${rounds}`,
                    executionTime: Date.now(),
                    voteLedger: { winner: sortedCandidates[0][0], count: leaderCount, runnerUp: sortedCandidates[1]?.[0] || "", runnerUpCount, totalRounds: rounds, killedAgents }
                };
            }
        } catch (e) {
            killedAgents++;
        }
        await new Promise(r => setTimeout(r, 200));
    }

    const sorted = Object.entries(votes).sort((a, b) => b[1] - a[1]);
    return {
        taskId: task.id,
        output: answerMap[sorted[0]?.[0]] || "Consensus failed",
        confidence: 50,
        agentId: "TIMEOUT",
        executionTime: Date.now(),
        voteLedger: { winner: sorted[0]?.[0] || "", count: votes[sorted[0]?.[0]] || 0, runnerUp: "", runnerUpCount: 0, totalRounds: rounds, killedAgents }
    };
}
```

### services/claudeService.ts
```typescript
/**
 * CLAUDE SERVICE
 * Service for interacting with Anthropic's Claude API.
 * Handles authentication via apiKeyService and request formatting.
 */
import { apiKeyService } from './apiKeyService';

export interface ClaudeTextContent {
    type: 'text';
    text: string;
}

export interface ClaudeImageContent {
    type: 'image';
    source: {
        type: 'base64';
        media_type: 'image/png' | 'image/jpeg' | 'image/gif' | 'image/webp';
        data: string;
    };
}

export type ClaudeContentBlock = ClaudeTextContent | ClaudeImageContent;

export interface ClaudeMessage {
    role: 'user' | 'assistant';
    content: string | ClaudeContentBlock[];
}

export interface ClaudeResponse {
    content: Array<{ text: string }>;
    usage: {
        input_tokens: number;
        output_tokens: number;
    };
}

class ClaudeService {
    private baseUrl = 'https://api.anthropic.com/v1/messages';

    // Note: Since we are running client-side, we need to use a proxy or specific headers
    // Anthropic API doesn't support CORS for direct browser calls by default.
    // However, for this implementation we will assume a proxy or appropriately configured backend exists,
    // OR we can use the 'dangerously-allow-browser' header if the user understands the risk (keys exposed in network tab).
    // Given our secure storage implementation, we will try the direct approach but warn about CORS.

    /**
     * Generate content using Claude
     */
    async generateContent(
        messages: ClaudeMessage[],
        systemPrompt?: string,
        model: string = 'claude-3-5-sonnet-20240620'
    ): Promise<string> {
        const apiKey = apiKeyService.getKey('claude');

        if (!apiKey) {
            throw new Error('Claude API key not found. Please configure it in Settings.');
        }

        try {
            const response = await fetch(this.baseUrl, {
                method: 'POST',
                headers: {
                    'x-api-key': apiKey,
                    'anthropic-version': '2023-06-01',
                    'content-type': 'application/json',
                    'anthropic-dangerously-allow-browser': 'true' // Required for client-side usage
                },
                body: JSON.stringify({
                    model: model,
                    max_tokens: 4096,
                    messages: messages,
                    system: systemPrompt,
                    temperature: 0.7
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(`Claude API Error: ${response.status} - ${JSON.stringify(errorData)}`);
            }

            const data: ClaudeResponse = await response.json();

            // Extract text from the response
            if (data.content && data.content.length > 0) {
                return data.content[0].text;
            }

            return '';
        } catch (error) {
            console.error('Claude API request failed:', error);
            throw error;
        }
    }

    /**
     * Generate content with vision (image analysis)
     */
    async generateVision(
        prompt: string,
        imageBase64: string,
        mediaType: 'image/png' | 'image/jpeg' | 'image/gif' | 'image/webp' = 'image/png',
        model: string = 'claude-sonnet-4-20250514'
    ): Promise<string> {
        const apiKey = apiKeyService.getKey('claude');

        if (!apiKey) {
            throw new Error('Claude API key not found. Please configure it in Settings.');
        }

        const message: ClaudeMessage = {
            role: 'user',
            content: [
                {
                    type: 'image',
                    source: {
                        type: 'base64',
                        media_type: mediaType,
                        data: imageBase64,
                    },
                },
                {
                    type: 'text',
                    text: prompt,
                },
            ],
        };

        try {
            const response = await fetch(this.baseUrl, {
                method: 'POST',
                headers: {
                    'x-api-key': apiKey,
                    'anthropic-version': '2023-06-01',
                    'content-type': 'application/json',
                    'anthropic-dangerously-allow-browser': 'true',
                },
                body: JSON.stringify({
                    model: model,
                    max_tokens: 1024,
                    messages: [message],
                    temperature: 0.3, // Lower temperature for structured output
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(`Claude Vision API Error: ${response.status} - ${JSON.stringify(errorData)}`);
            }
```

### services/codebaseAwareness.ts
```typescript
/**
 * CODEBASE AWARENESS SERVICE
 *
 * Provides intelligent awareness of the OS-App codebase structure
 * for voice-controlled navigation and context-aware interactions.
 *
 * Features:
 * - Reads and indexes codebase_graph.json
 * - Maps natural language commands to UI destinations
 * - Generates tool definitions for AI providers
 * - Supports alias matching ("logic studio" → CODE_STUDIO)
 * - Tracks component capabilities and routes
 */

import { AppMode } from '../types';

// =============================================================================
// Types
// =============================================================================

export interface CodebaseNode {
    id: string;
    label: string;
    type: 'file' | 'folder';
    path?: string;
    relPath?: string;
    parentId?: string;
    radius?: number;
    risk?: string;
    tier?: number;
    isArchitectural?: boolean;
}

export interface CodebaseEdge {
    source: string;
    target: string;
    type?: string;
}

export interface CodebaseGraph {
    nodes: CodebaseNode[];
    edges: CodebaseEdge[];
}

export interface ComponentDefinition {
    id: string;
    mode: AppMode;
    route: string;
    displayName: string;
    aliases: string[];
    capabilities: string[];
    subtabs?: string[];
    description: string;
}

export interface NavigationMatch {
    component: ComponentDefinition;
    confidence: number;
    matchedAlias?: string;
    matchedCapability?: string;
}

export interface ToolDefinition {
    name: string;
    description: string;
    parameters: {
        type: string;
        properties: Record<string, { type: string; description: string; enum?: string[] }>;
        required: string[];
    };
}

// =============================================================================
// Component Registry
// =============================================================================

/**
 * Comprehensive registry of all UI components/modes with aliases and capabilities.
 * This enables natural language navigation like "go to logic studio" or "open agents".
 */
const COMPONENT_REGISTRY: ComponentDefinition[] = [
    {
        id: 'dashboard',
        mode: AppMode.DASHBOARD,
        route: '/dashboard',
        displayName: 'Dashboard',
        aliases: ['dashboard', 'home', 'main', 'ecosystem', 'hub', 'overview', 'start'],
        capabilities: ['overview', 'metrics', 'status', 'quick actions'],
        description: 'Main dashboard with system overview and metrics'
    },
    {
        id: 'metaventions-hub',
        mode: AppMode.METAVENTIONS_HUB,
        route: '/metaventions-hub',
        displayName: 'Metaventions Hub',
        aliases: ['metaventions', 'hub', 'inventions', 'ideas', 'innovation'],
        capabilities: ['ideation', 'invention tracking', 'project management'],
        description: 'Innovation and invention management hub'
    },
    {
        id: 'bibliomorphic',
        mode: AppMode.BIBLIOMORPHIC,
        route: '/bibliomorphic',
        displayName: 'Discovery Lab',
        aliases: ['discovery', 'lab', 'research', 'bibliomorphic', 'discovery lab', 'explore'],
        capabilities: ['research', 'discovery', 'knowledge exploration', 'semantic search'],
        description: 'Research and discovery interface'
    },
    {
        id: 'bicameral',
        mode: AppMode.BICAMERAL,
        route: '/bibliomorphic/bicameral',
        displayName: 'Bicameral',
        aliases: ['bicameral', 'dual mind', 'two minds', 'debate'],
        capabilities: ['dual reasoning', 'debate', 'dialectic analysis'],
        description: 'Bicameral reasoning and dual-agent dialogue'
    },
    {
        id: 'process-map',
        mode: AppMode.PROCESS_MAP,
        route: '/process',
        displayName: 'Process Map',
        aliases: ['process', 'topology', 'workflow', 'map', 'flow', 'processes'],
        capabilities: ['workflow visualization', 'process modeling', 'topology'],
        description: 'Process and workflow visualization'
    },
    {
        id: 'memory-core',
        mode: AppMode.MEMORY_CORE,
        route: '/memory',
        displayName: 'Memory Core',
        aliases: ['memory', 'vault', 'storage', 'archive', 'recall', 'memories'],
        capabilities: ['memory storage', 'recall', 'context management', 'search'],
        description: 'Memory management and retrieval system'
    },
    {
        id: 'image-gen',
        mode: AppMode.IMAGE_GEN,
        route: '/assets',
        displayName: 'Image Generation',
        aliases: ['image', 'images', 'assets', 'cinema', 'visual', 'generate image', 'art', 'pictures'],
        capabilities: ['image generation', 'asset management', 'visual creation'],
        description: 'AI image generation and asset management'
    },
    {
        id: 'hardware-engineer',
        mode: AppMode.HARDWARE_ENGINEER,
        route: '/hardware',
        displayName: 'Hardware Engineer',
        aliases: ['hardware', 'infra', 'infrastructure', 'systems', 'engineering'],
```

### services/collabService.ts
```typescript
import { useAppStore } from '../store';
import { AppMode, PeerPresence, SwarmEvent } from '../types';

const MOCK_PEER_NAMES = ['AlphaNode', 'BinaryArch', 'ZeroVector', 'NexusOne', 'VoidWalker', 'SyntaxError', 'KernelRoot'];
const MOCK_ROLES = ['Architect', 'Sentinel', 'Netrunner', 'Operator'];
const MOCK_COLORS = ['#9d4edd', '#22d3ee', '#10b981', '#ef4444', '#f59e0b', '#ec4899'];

class CollaborationService {
    private interval: number | null = null;

    public init() {
        if (import.meta.env.DEV) console.log('[CollabService] Synchronizing with Peer Mesh...');
        
        // Initial set of peers
        this.syncPeers();
        
        // Start simulation loop
        this.interval = window.setInterval(() => {
            this.simulateNetworkActivity();
        }, 8000);
    }

    private syncPeers() {
        const { actions } = useAppStore.getState();
        const initialPeers: PeerPresence[] = Array.from({ length: 3 + Math.floor(Math.random() * 4) }).map((_, i) => ({
            id: `peer-${i}`,
            name: MOCK_PEER_NAMES[Math.floor(Math.random() * MOCK_PEER_NAMES.length)],
            role: MOCK_ROLES[Math.floor(Math.random() * MOCK_ROLES.length)],
            activeSector: Object.values(AppMode)[Math.floor(Math.random() * Object.values(AppMode).length)],
            status: Math.random() > 0.3 ? 'ACTIVE' : 'IDLE',
            lastSeen: Date.now(),
            color: MOCK_COLORS[Math.floor(Math.random() * MOCK_COLORS.length)]
        }));

        actions.setCollabState({ peers: initialPeers });
    }

    private simulateNetworkActivity() {
        const state = useAppStore.getState();
        const { setCollabState, addSwarmEvent, addLog } = state.actions;
        const { collaboration } = state;
        const rand = Math.random();

        // 1. Peer Sector Migration
        if (rand > 0.7 && collaboration.peers.length > 0) {
            const peerIdx = Math.floor(Math.random() * collaboration.peers.length);
            const peer = collaboration.peers[peerIdx];
            const nextSector = Object.values(AppMode)[Math.floor(Math.random() * Object.values(AppMode).length)];
            
            setCollabState((prev: any) => ({
                peers: prev.peers.map((p: any, i: number) => i === peerIdx ? { ...p, activeSector: nextSector, lastSeen: Date.now() } : p)
            }));

            addSwarmEvent({
                userId: peer.id,
                userName: peer.name,
                action: `Migrated to ${nextSector}`,
                target: nextSector
            });
        }

        // 2. Swarm Action
        if (rand < 0.3 && collaboration.peers.length > 0) {
            const peer = collaboration.peers[Math.floor(Math.random() * collaboration.peers.length)];
            const actionsList = ['Optimized Lattice', 'Synchronized Vault', 'Generated Asset', 'Executed Directive', 'Refactored Logic'];
            const action = actionsList[Math.floor(Math.random() * actionsList.length)];

            addSwarmEvent({
                userId: peer.id,
                userName: peer.name,
                action: action
            });

            // Occasional system log from peers
            if (Math.random() > 0.8) {
                addLog('SYSTEM', `SWARM_SIGNAL: ${peer.name} successfully ${action.toLowerCase()}.`);
            }
        }
        
        // 3. New Peer Arrival / Departure
        if (rand > 0.95) {
            this.syncPeers();
        }
    }

    public disconnect() {
        if (this.interval) clearInterval(this.interval);
    }
}

export const collabService = new CollaborationService();
```

### services/complexityEstimator.ts
```typescript
/**
 * Complexity Estimator Module
 *
 * Provides adaptive thresholds for consensus engine based on task complexity.
 * Simple tasks get fewer rounds, complex tasks get more.
 */

import { AtomicTask } from '../types';
import {
    ComplexityProfile,
    TaskComplexity,
    OptimalThresholds
} from '../types/domain/convergence';

// ============================================================================
// COMPLEXITY THRESHOLDS
// ============================================================================

const COMPLEXITY_THRESHOLDS: Record<TaskComplexity, {
    tokenMax: number;
    rounds: number;
    gap: number;
}> = {
    simple: { tokenMax: 100, rounds: 3, gap: 2 },
    moderate: { tokenMax: 500, rounds: 7, gap: 3 },
    complex: { tokenMax: 2000, rounds: 12, gap: 4 },
    expert: { tokenMax: Infinity, rounds: 15, gap: 5 }
};

// Domain keywords for classification
const DOMAIN_KEYWORDS: Record<string, string[]> = {
    code: ['function', 'class', 'import', 'export', 'const', 'let', 'var', 'return', 'async', 'await', 'typescript', 'javascript', 'python', 'react', 'component'],
    architecture: ['system', 'design', 'pattern', 'architecture', 'microservice', 'api', 'database', 'schema', 'infrastructure'],
    analysis: ['analyze', 'review', 'evaluate', 'assess', 'compare', 'benchmark', 'metrics', 'performance'],
    creative: ['generate', 'create', 'write', 'draft', 'compose', 'design', 'brainstorm', 'ideate'],
    research: ['research', 'investigate', 'explore', 'find', 'search', 'discover', 'study'],
    debug: ['fix', 'debug', 'error', 'bug', 'issue', 'problem', 'troubleshoot', 'diagnose'],
    refactor: ['refactor', 'optimize', 'improve', 'clean', 'simplify', 'restructure']
};

// ============================================================================
// CORE ESTIMATION FUNCTIONS
// ============================================================================

/**
 * Estimate task complexity and return appropriate thresholds
 */
export function estimateComplexity(task: AtomicTask): ComplexityProfile {
    const tokenEstimate = estimateTokens(task);
    const taskType = classifyComplexity(tokenEstimate, task);
    const domain = detectDomain(task);
    const thresholds = COMPLEXITY_THRESHOLDS[taskType];

    return {
        tokenEstimate,
        taskType,
        suggestedRounds: thresholds.rounds,
        suggestedGap: thresholds.gap,
        domain
    };
}

/**
 * Estimate token count for a task
 * Rough approximation: ~4 chars per token for English text
 */
export function estimateTokens(task: AtomicTask): number {
    const instructionTokens = Math.ceil(task.instruction.length / 4);
    const inputTokens = Math.ceil(task.isolated_input.length / 4);

    // Weight instruction more heavily (it's more important for complexity)
    return instructionTokens * 1.5 + inputTokens;
}

/**
 * Classify complexity based on tokens and content analysis
 */
export function classifyComplexity(tokens: number, task: AtomicTask): TaskComplexity {
    // Base classification on tokens
    let baseComplexity: TaskComplexity;

    if (tokens < COMPLEXITY_THRESHOLDS.simple.tokenMax) {
        baseComplexity = 'simple';
    } else if (tokens < COMPLEXITY_THRESHOLDS.moderate.tokenMax) {
        baseComplexity = 'moderate';
    } else if (tokens < COMPLEXITY_THRESHOLDS.complex.tokenMax) {
        baseComplexity = 'complex';
    } else {
        baseComplexity = 'expert';
    }

    // Adjust based on content signals
    const adjustedComplexity = adjustForContent(baseComplexity, task);

    return adjustedComplexity;
}

/**
 * Adjust complexity based on content signals
 */
function adjustForContent(base: TaskComplexity, task: AtomicTask): TaskComplexity {
    const text = (task.instruction + ' ' + task.isolated_input).toLowerCase();

    const complexityLevels: TaskComplexity[] = ['simple', 'moderate', 'complex', 'expert'];
    let currentIndex = complexityLevels.indexOf(base);

    // Signals that increase complexity
    const complexSignals = [
        /multi-?step/i,
        /comprehensive/i,
        /thorough/i,
        /all\s+(aspects|cases|scenarios)/i,
        /edge\s*cases/i,
        /architecture/i,
        /security/i,
        /production/i,
        /enterprise/i
    ];

    for (const signal of complexSignals) {
        if (signal.test(text)) {
            currentIndex = Math.min(currentIndex + 1, complexityLevels.length - 1);
            break; // Only bump once
        }
    }

    // Signals that decrease complexity
    const simpleSignals = [
        /simple/i,
        /quick/i,
        /just/i,
        /only/i,
        /basic/i,
        /straightforward/i
    ];

    for (const signal of simpleSignals) {
        if (signal.test(text)) {
            currentIndex = Math.max(currentIndex - 1, 0);
            break; // Only drop once
        }
    }

    return complexityLevels[currentIndex];
}

/**
 * Detect primary domain of task
 */
export function detectDomain(task: AtomicTask): string {
```

### services/componentActionRegistry.ts
```typescript
/**
 * @deprecated This file is deprecated. Use services/actions/handlers instead.
 *
 * COMPONENT ACTION REGISTRY (DEPRECATED)
 *
 * All component actions are now consolidated in services/actions/handlers/.
 * This file exists only for backward compatibility.
 *
 * Migration:
 *   Old: import { initializeComponentActions } from './componentActionRegistry';
 *   New: import { initializeUnifiedRegistry } from './unifiedActionRegistry';
 *        import { ALL_HANDLER_ACTIONS } from './actions/handlers';
 */

import { ALL_HANDLER_ACTIONS, getHandlerStats } from './actions/handlers';
import type { UnifiedAction } from './actions/types';

// Re-export types for backward compatibility
export type ComponentAction = UnifiedAction;

/**
 * @deprecated Use initializeUnifiedRegistry() instead.
 */
export function initializeComponentActions(): void {
    console.warn(
        '[componentActionRegistry] DEPRECATED: Use initializeUnifiedRegistry() instead. ' +
        'Actions are now consolidated in services/actions/handlers/'
    );
}

/**
 * @deprecated Use ALL_HANDLER_ACTIONS from services/actions/handlers instead.
 */
export function getAllComponentActions(): UnifiedAction[] {
    console.warn(
        '[componentActionRegistry] DEPRECATED: Use ALL_HANDLER_ACTIONS from services/actions/handlers instead.'
    );
    return ALL_HANDLER_ACTIONS.filter(a => a.source === 'component');
}

/**
 * @deprecated Actions are now organized by category in services/actions/handlers/, not by component.
 */
export function getActionsByComponent(component: string): UnifiedAction[] {
    console.warn(
        '[componentActionRegistry] DEPRECATED: Actions are now organized by category, not component. ' +
        'See services/actions/handlers/ for the new structure.'
    );
    return ALL_HANDLER_ACTIONS.filter(a =>
        a.sectors.some(s => s.toLowerCase().includes(component.toLowerCase()))
    );
}

/**
 * @deprecated Use generateVoiceContext() from unifiedActionRegistry instead.
 */
export function generateComponentActionContext(): string {
    console.warn(
        '[componentActionRegistry] DEPRECATED: Use generateVoiceContext() from unifiedActionRegistry instead.'
    );
    const stats = getHandlerStats();
    let context = '=== COMPONENT ACTIONS (DEPRECATED) ===\n';
    context += `Total actions: ${stats.total}\n`;
    context += `By category: ${JSON.stringify(stats.byCategory)}\n`;
    return context;
}
```

### services/__tests__/
```
adaptiveConsensus.test.ts
dqScoring.test.ts
recursiveLanguageModel.test.ts
```
#### adaptiveConsensus.test.ts
```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
    adaptiveConsensusEngine,
    quickConsensus
} from '../adaptiveConsensus';
import { AtomicTask } from '../../types';
import { ACEStatus, ACEConfig, DEFAULT_ACE_CONFIG } from '../../types/domain/convergence';

// Mock all dependencies
vi.mock('../geminiService', () => ({
    getAI: vi.fn(() => ({
        models: {
            generateContent: vi.fn()
        }
    })),
    retryGeminiRequest: vi.fn(),
    constructHiveContext: vi.fn(() => 'mock context')
}));

vi.mock('../agents', () => ({
    HIVE_AGENTS: {
        'agent-1': {
            id: 'agent-1',
            name: 'Test Agent 1',
            weights: { skepticism: 0.5, creativity: 0.5, logic: 0.5 }
        },
        'agent-2': {
            id: 'agent-2',
            name: 'Test Agent 2',
            weights: { skepticism: 0.7, creativity: 0.3, logic: 0.8 }
        },
        'agent-3': {
            id: 'agent-3',
            name: 'Test Agent 3',
            weights: { skepticism: 0.3, creativity: 0.8, logic: 0.4 }
        }
    }
}));

vi.mock('../complexityEstimator', () => ({
    estimateComplexity: vi.fn(() => ({
        tokenEstimate: 100,
        taskType: 'moderate',
        suggestedRounds: 10,
        suggestedGap: 3,
        domain: 'general'
    })),
    getAdaptiveThresholds: vi.fn(() => ({
        gap: 3,
        rounds: 15
    }))
}));

vi.mock('../agentAuction', () => ({
    runAuction: vi.fn(() => ({
        selectedAgents: ['agent-1', 'agent-2'],
        allBids: [],
        auctionDuration: 50,
        fastTracked: false
    }))
}));

vi.mock('../dqScoring', () => ({
    scoreDQHeuristic: vi.fn(() => ({
        score: 0.75,
        components: { validity: 0.8, specificity: 0.7, correctness: 0.75 },
        isActionable: true,
        timestamp: Date.now()
    })),
    scoreDQWithLLM: vi.fn(() => Promise.resolve({
        score: 0.85,
        components: { validity: 0.9, specificity: 0.8, correctness: 0.85 },
        isActionable: true,
        timestamp: Date.now()
    }))
}));

vi.mock('../convergenceMemory', () => ({
    convergenceMemory: {
        getOptimalThresholds: vi.fn(() => Promise.resolve(null)),
        createPattern: vi.fn(() => ({})),
        storePattern: vi.fn(() => Promise.resolve())
    }
}));

vi.mock('../hopGrouping', () => ({
    performHopGrouping: vi.fn(() => ({
        groups: [],
        winningGroup: null,
        method: 'levenshtein',
        groupingDuration: 10
    }))
}));

import { retryGeminiRequest } from '../geminiService';
import { runAuction } from '../agentAuction';
import { estimateComplexity } from '../complexityEstimator';

// Helper to create test tasks
function createTestTask(overrides: Partial<AtomicTask> = {}): AtomicTask {
```

### services/actions/
```
index.ts
priority.ts
registry.ts
sectorMap.ts
types.ts
```
#### index.ts
```typescript
/**
 * ACTIONS MODULE
 *
 * Unified action registry for voice control and system automation.
 *
 * Usage:
 *   import { registerAction, executeAction, getActionsForSector } from './services/actions';
 *
 * Architecture:
 *   - types.ts: Type definitions
 *   - priority.ts: Priority scoring system
 *   - sectorMap.ts: Component-to-sector mapping
 *   - registry.ts: Core registry implementation
 *   - handlers/: Action handler implementations (navigation, generation, etc.)
 */

// Types
export type {
    ActionCategory,
    ActionComplexity,
    ActionSource,
    ActionArgs,
    ActionHandler,
    ActionResult,
    BaseAction,
    ComponentAction,
    VoiceAction,
    UnifiedAction,
    ExecutionResult,
    ActionRegistration,
    RegistryState,
} from './types';

export {
    isComponentAction,
    isVoiceAction,
    isUnifiedAction,
} from './types';

// Priority
export {
    getCategoryPriority,
    getPathForComplexity,
    calculateSectorRelevance,
    applyPriorityModifiers,
} from './priority';

export type { PriorityModifiers } from './priority';

// Sector Mapping
export {
    COMPONENT_TO_SECTORS,
    getSectorsForComponent,
    SECTOR_ALIASES,
    resolveSecator,
    getAvailableSectors,
    areSectorsRelated,
} from './sectorMap';

// Registry
export {
    registerAction,
    registerActions,
    unregisterAction,
    getAllActions,
    getAction,
    getActionsForSector,
    getActionsByCategory,
    getActionsBySource,
    searchActions,
    executeAction,
    generateActionContext,
    isInitialized,
    getRegistryStats,
    markInitialized,
} from './registry';

// Handler Actions (consolidated from componentActionRegistry + voiceActionRegistry)
export {
    ALL_HANDLER_ACTIONS,
    NAVIGATION_ACTIONS,
    GENERATION_ACTIONS,
    EXECUTION_ACTIONS,
    ANALYSIS_ACTIONS,
    UI_ACTIONS,
    getSectorMap,
    getHandlerStats,
} from './handlers';
```

### services/archon/
```
archon.test.ts
config.ts
eventBus.ts
index.ts
state.ts
types.ts
utils.ts
```
#### archon.test.ts
```typescript
/**
 * ARCHON Test Suite
 *
 * Tests for the autonomous meta-orchestrator.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';

// Core imports
import {
  generateId,
  hashString,
  estimateGoalComplexity,
  inferSubsystems,
  estimateTokenCost,
  calculateDQ,
  isActionable,
  formatDuration,
  relativeTime,
  backoffDelay,
} from './utils';

import { DEFAULT_CONFIG, getConfig, validateConfig, MODEL_COSTS } from './config';

import { TaskGraph, createTask, TaskStatus, TaskPriority } from './goals/taskGraph';

import { eventBus, emitGoalEvent } from './eventBus';

// =============================================================================
// UTILS TESTS
// =============================================================================

describe('ARCHON Utils', () => {
  describe('generateId', () => {
    it('should generate unique IDs with prefix', () => {
      const id1 = generateId('goal');
      const id2 = generateId('goal');

      expect(id1).toMatch(/^goal_/);
      expect(id2).toMatch(/^goal_/);
      expect(id1).not.toBe(id2);
    });

    it('should generate IDs with default prefix', () => {
      const id = generateId();
      expect(id).toMatch(/^archon_/);
    });
  });

  describe('hashString', () => {
    it('should produce consistent hashes', () => {
      const hash1 = hashString('test string');
      const hash2 = hashString('test string');

      expect(hash1).toBe(hash2);
    });

    it('should produce different hashes for different inputs', () => {
      const hash1 = hashString('string1');
      const hash2 = hashString('string2');

      expect(hash1).not.toBe(hash2);
    });
  });

  describe('estimateGoalComplexity', () => {
    it('should return low complexity for simple goals', () => {
      const complexity = estimateGoalComplexity('Fix the typo in README');
      expect(complexity).toBeLessThan(0.5);
    });

    it('should return higher complexity for longer goals', () => {
      const simple = estimateGoalComplexity('Fix typo');
      const complex = estimateGoalComplexity(
        'Refactor the authentication system to use OAuth2 with JWT tokens, ' +
        'implement rate limiting, add comprehensive test coverage'
      );
      expect(complex).toBeGreaterThan(simple);
    });
  });

  describe('inferSubsystems', () => {
    it('should infer ACE for consensus-related tasks', () => {
      const subsystems = inferSubsystems('Need consensus on the architecture decision');
      expect(subsystems).toContain('ace');
    });

    it('should infer dream for research tasks', () => {
      const subsystems = inferSubsystems('Research the latest papers on multi-agent systems');
      expect(subsystems).toContain('dream');
    });

    it('should infer evolution for refactoring tasks', () => {
      const subsystems = inferSubsystems('Refactor the legacy codebase');
      expect(subsystems).toContain('evolution');
    });

    it('should always include kernel', () => {
      const subsystems = inferSubsystems('Any random task');
      expect(subsystems).toContain('kernel');
```

### services/biometric/
```
index.ts
processor.ts
stressAnalysis.ts
types.ts
```
#### index.ts
```typescript
/**
 * BIOMETRIC SERVICES
 * Extracted from useBiometricSensor.ts for better modularity.
 */

// Types
export * from './types';

// Stress analysis
export {
  calculateStressIndicators,
  calculateStressScore,
  determineTrend,
  calculateCognitiveLoad,
  StressHysteresisManager,
} from './stressAnalysis';

// Processing
export {
  calculateCentroid,
  calculateDispersion,
  getElementAtPoint,
  calculateGazeStability,
  isFixating,
  analyzeLighting,
  ConfidenceBuffer,
  PerformanceMonitor,
  emitFixationEvent,
  emitGazeUpdateEvent,
  emitBiometricFallback,
} from './processor';
```

### services/cognitivePrecisionBridge/
```
index.ts
orchestrator.ts
router.ts
types.ts
```
#### index.ts
```typescript
/**
 * Cognitive Precision Bridge (CPB)
 *
 * Unified orchestration layer for precision-aware AI processing.
 * Routes queries through RLM, ACE, and DQ scoring based on complexity.
 *
 * Usage:
 * ```typescript
 * import { cpbExecute, cognitivePrecisionBridge } from './services/cognitivePrecisionBridge';
 *
 * // Simple execution
 * const result = await cpbExecute('Analyze this code...', codeContext);
 *
 * // With status updates
 * const result = await cpbExecute('Complex query...', context, (status) => {
 *     console.log(`${status.phase}: ${status.progress}%`);
 * });
 *
 * // Force specific path
 * import { cpbExecutePath } from './services/cognitivePrecisionBridge';
 * const result = await cpbExecutePath('cascade', 'High-quality analysis needed...', context);
 * ```
 */

// Types
export type {
    CPBPath,
    CPBPhase,
    CPBConfig,
    CPBRequest,
    CPBResult,
    CPBStatus,
    PathSignals,
    RoutingDecision,
    CPBPattern,
    LearnedRouting,
    ImageInput,
    MultimodalContent,
    ReasoningModel
} from './types';

export { DEFAULT_CPB_CONFIG } from './types';

// Router
export {
    extractPathSignals,
    selectPath,
    canUseDirectPath,
    needsRLMPath,
    wouldBenefitFromConsensus
} from './router';

// Orchestrator
export {
    cognitivePrecisionBridge,
    cpbExecute,
    cpbExecutePath
} from './orchestrator';

// Default export
export { default } from './orchestrator';
```

### services/kernel/
```
AgentKernel.ts
IntentResolver.ts
KernelScheduler.ts
index.ts
types.ts
```
#### AgentKernel.ts
```typescript
/**
 * AGENTIC KERNEL - LLM-as-a-Kernel Dispatcher
 *
 * The core of the Agentic OS architecture. This kernel treats the entire
 * operating system as an autonomous agent, dispatching tasks based on
 * resolved user intent and biometric feedback.
 *
 * Architecture:
 * - IntentResolver: Parses user input into structured intents
 * - KernelScheduler: Priority-based task queue management
 * - SemanticPager: MemOS-style context window management
 * - BiometricLoop: Gaze/stress feedback integration
 *
 * Reference: arXiv:2512.05470 (Agentic File System)
 */

import {
  KernelOperationalMode,
  KernelTask,
  ResolvedIntent,
  KernelEvent,
  KernelEventType,
  KernelEventHandler,
  KernelMetrics,
  BiometricContext,
  TaskPriority,
} from './types';
import { KernelScheduler } from './KernelScheduler';
import { IntentResolver } from './IntentResolver';
import { SemanticPager } from '../memory/SemanticPager';
import { auiEngine, judgeAgent, semanticGaze, domRegenerator } from '../ui';
import type { UILayoutSpec, AUIGenerationContext, UIEvaluation } from '../ui/types';

const KERNEL_VERSION = '1.0.0-agentic';

class AgentKernelService {
  private state: KernelOperationalMode = 'BOOTING';
  private bootTime: number = 0;
  private eventHandlers: Map<KernelEventType, Set<KernelEventHandler>> = new Map();
  private globalHandlers: Set<KernelEventHandler> = new Set();

  // Core subsystems
  private scheduler: KernelScheduler;
  private intentResolver: IntentResolver;
  private semanticPager: SemanticPager;

  // Metrics
  private metrics: KernelMetrics = {
    uptime: 0,
    tasksProcessed: 0,
    taskQueueDepth: 0,
    pagesInMemory: 0,
    totalPageSize: 0,
    pageFaults: 0,
    cacheHitRate: 0,
    avgTaskLatency: 0,
    biometricSamples: 0,
    currentStressLevel: 0,
  };

  // Biometric state
  private biometricContext: BiometricContext | null = null;
  private adaptiveUIEnabled: boolean = false;

  // AUI state
  private auiEnabled: boolean = true;
  private currentLayout: UILayoutSpec | null = null;
  private lastRegenerationTime: number = 0;
  private regenerationCooldownMs: number = 2000;
  private isRegenerating: boolean = false;

  constructor() {
    this.scheduler = new KernelScheduler();
    this.intentResolver = new IntentResolver();
    this.semanticPager = new SemanticPager();
  }

  // ============================================================================
  // LIFECYCLE
  // ============================================================================

  /**
   * Boot the kernel and initialize all subsystems
   */
  async boot(): Promise<void> {
    if (this.state !== 'BOOTING' && this.state !== 'ERROR') {
      console.warn('KERNEL: Already booted');
      return;
    }

    if (import.meta.env.DEV) console.log(`⚡ KERNEL: Booting v${KERNEL_VERSION}...`);
    this.state = 'BOOTING';
    this.bootTime = Date.now();

    try {
      // Initialize subsystems in order
      await this.intentResolver.initialize();
      await this.semanticPager.initialize();
      this.scheduler.start();

```

### services/memory/
```
AgenticFileSystem.ts
ArtifactStore.ts
ContextCompiler.ts
KnowledgeLayerProcessor.ts
MemoryStore.ts
Processor.ts
SemanticPager.ts
interfaces.ts
```
#### AgenticFileSystem.ts
```typescript
/**
 * AGENTIC FILE SYSTEM (AFS)
 *
 * A filesystem that proactively surfaces files to the LLM context
 * based on user intent, eliminating manual "Open File" actions.
 *
 * Key features:
 * - Intent-based file surfacing
 * - Gaze-triggered prefetching
 * - Semantic file indexing
 * - Dependency graph tracking
 *
 * Reference: arXiv:2512.05470 (Agentic File System)
 */

import {
  AgenticFile,
  FileMetadata,
  FileSurfaceEvent,
  ResolvedIntent,
  GazeFixation,
} from '../kernel/types';

interface AFSConfig {
  maxSurfacedFiles: number;
  relevanceThreshold: number;
  autoSurfaceEnabled: boolean;
  indexUpdateIntervalMs: number;
}

const DEFAULT_CONFIG: AFSConfig = {
  maxSurfacedFiles: 10,
  relevanceThreshold: 0.5,
  autoSurfaceEnabled: true,
  indexUpdateIntervalMs: 30000,
};

export class AgenticFileSystem {
  private config: AFSConfig;
  private files: Map<string, AgenticFile> = new Map();
  private fileIndex: Map<string, Set<string>> = new Map(); // keyword -> fileIds
  private surfaceEvents: FileSurfaceEvent[] = [];
  private accessLog: { fileId: string; timestamp: number }[] = [];

  // Element to file mapping for gaze-triggered surfacing
  private elementFileMap: Map<string, string[]> = new Map();

  constructor(config: Partial<AFSConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Initialize the AFS
   */
  async initialize(): Promise<void> {
    // Start background index update
    if (this.config.autoSurfaceEnabled) {
      setInterval(() => this.updateIndex(), this.config.indexUpdateIntervalMs);
    }
    if (import.meta.env.DEV) console.log('📁 AFS: Initialized');
  }

  // ============================================================================
  // FILE OPERATIONS
  // ============================================================================

  /**
   * Register a file with the AFS
   */
  async registerFile(
    path: string,
    content: string,
    metadata: Partial<FileMetadata> = {}
  ): Promise<AgenticFile> {
    const file: AgenticFile = {
      id: crypto.randomUUID(),
      path,
      name: path.split('/').pop() || path,
      type: 'FILE',
      content,
      lastModified: Date.now(),
      relevanceToIntent: 0,
      autoSurfaced: false,
      metadata: {
        size: content.length,
        tags: metadata.tags || [],
        relatedFiles: metadata.relatedFiles || [],
        ...metadata,
      },
    };

    // Generate semantic summary
    file.metadata.semanticSummary = await this.generateSummary(content);

    // Index the file
    this.files.set(file.id, file);
    this.indexFile(file);

    return file;
  }
```

### services/persistence/
```
vectorMath.ts
```
#### vectorMath.ts
```typescript
/**
 * Vector Math Operations
 * Decoupled from generic utils to live close to the Persistence layer
 */

export function cosineSimilarity(vecA: number[], vecB: number[]): number {
    if (vecA.length !== vecB.length || vecA.length === 0) return 0;

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < vecA.length; i++) {
        dotProduct += vecA[i] * vecB[i];
        normA += vecA[i] * vecA[i];
        normB += vecB[i] * vecB[i];
    }

    const magnitude = Math.sqrt(normA) * Math.sqrt(normB);
    if (magnitude === 0) return 0;

    return dotProduct / magnitude;
}
```

### services/ui/
```
AUIEngine.ts
ComponentRegistry.ts
DOMRegenerator.ts
JudgeAgent.ts
SemanticGaze.ts
index.ts
types.ts
```
#### AUIEngine.ts
```typescript
/**
 * AUI ENGINE - Adaptive User Interface Generator
 *
 * LLM-driven layout generator that synthesizes optimal React component trees
 * based on biometric state, gaze semantics, and task context.
 *
 * Reference: AUI (arXiv:2511.15567) - Computer-Use Agents as Judges
 *
 * Features:
 * - Real LLM integration (Claude + Gemini with auto-selection)
 * - Biometric-aware layout synthesis
 * - Gaze-following component prioritization
 * - Stress-responsive simplification
 */

import { getAI, safeParseJson } from '../geminiService';
import { claudeService } from '../claudeService';
import { apiKeyService } from '../apiKeyService';
import {
  UILayoutSpec,
  UIRegion,
  UIComponentSpec,
  AUIGenerationContext,
  BiometricTrigger,
  GazeSemanticContext,
  AUIEvent,
  AUIEventType,
} from './types';

// ============================================================================
// CONFIGURATION
// ============================================================================

type LLMProvider = 'claude' | 'gemini' | 'auto';

const CONFIG = {
  provider: 'auto' as LLMProvider,
  claudeModel: 'claude-sonnet-4-20250514',
  geminiModel: 'gemini-2.0-flash',
  generationTimeoutMs: 3000,
  maxRetries: 2,
  cooldownMs: 1000,
};

const GENERATION_TIMEOUT_MS = CONFIG.generationTimeoutMs;
const MAX_GENERATION_RETRIES = CONFIG.maxRetries;

// Available components that can be synthesized (matching actual app components)
const AVAILABLE_COMPONENTS = [
  // Dashboard & Hub
  'MetaventionsHub',
  'Dashboard',
  'GlobalStatusBar',
  'NeuralDock',
  // Biometrics
  'BiometricPanel',
  'GazeReticle',
  // Agent & Process
  'AgentControlCenter',
  'AgenticHUD',
  'ProcessVisualizer',
  'SynapticRouter',
  'TaskBoard',
  // Code & Development
  'CodeStudio',
  'NexusAPIExplorer',
  'HolographicCommandDeck',
  'CommandPalette',
  // Visualizations
  'DEcosystem',
  'ContextVelocityChart',
  'KnowledgeGraph',
  'EmotionalResonanceGraph',
  'FlywheelOrbit',
  // Voice & Media
  'VoiceMode',
  'VoiceManager',
  'ImageGen',
  // Memory & Knowledge
  'MemoryCore',
  'SynapticContextHub',
  // System
  'HelpCenter',
  'StrategicConsole',
  'ZenithDisplay',
] as const;

// ============================================================================
// AUI ENGINE
// ============================================================================

class AUIEngineService {
  private eventHandlers: Map<AUIEventType, Set<(event: AUIEvent) => void>> = new Map();
  private currentLayout: UILayoutSpec | null = null;
  private generationInProgress: boolean = false;
  private lastGenerationTime: number = 0;
  private generationCooldownMs: number = CONFIG.cooldownMs;
  private llmCallCount: number = 0;
  private lastProvider: LLMProvider | null = null;

```

### services/voice/
```
actions.ts
discovery.ts
index.ts
service.ts
types.ts
```
#### actions.ts
```typescript
/**
 * UNIVERSAL VOICE ACTIONS
 * DOM manipulation actions for voice control.
 */

import { VoiceActionResult } from './types';
import { scanInteractiveElements } from './discovery';

/**
 * Fill an input element by ID or fuzzy match
 * Uses multiple strategies to ensure React state updates correctly
 */
export function fillInput(identifier: string, text: string): VoiceActionResult {
  const snapshot = scanInteractiveElements();
  const idLower = identifier.toLowerCase().replace(/[-_\s]/g, '');

  // Priority 1: Exact data-voice-id match
  let target = snapshot.inputs.find(i => {
    const voiceId = i.element.getAttribute('data-voice-id');
    return voiceId && voiceId.toLowerCase().replace(/[-_\s]/g, '') === idLower;
  });

  // Priority 2: Partial data-voice-id match
  if (!target) {
    target = snapshot.inputs.find(i => {
      const voiceId = i.element.getAttribute('data-voice-id');
      if (!voiceId) return false;
      const voiceIdNorm = voiceId.toLowerCase().replace(/[-_\s]/g, '');
      return voiceIdNorm.includes(idLower) || idLower.includes(voiceIdNorm);
    });
  }

  // Priority 3: Exact id match
  if (!target) {
    target = snapshot.inputs.find(i => i.id === identifier);
  }

  // Priority 4: Fuzzy match by label, id, or description
  if (!target) {
    target = snapshot.inputs.find(i =>
      i.label.toLowerCase().includes(identifier.toLowerCase()) ||
      i.id.toLowerCase().includes(identifier.toLowerCase()) ||
      i.description.toLowerCase().includes(identifier.toLowerCase())
    );
  }

  // Priority 5: Match by aria-label
  if (!target) {
    target = snapshot.inputs.find(i => {
      const ariaLabel = i.element.getAttribute('aria-label');
      return ariaLabel && ariaLabel.toLowerCase().includes(identifier.toLowerCase());
    });
  }

  // Priority 6: Generic input fallback
  if (!target && (identifier === 'input' || identifier === 'text' || identifier === 'field')) {
    target = snapshot.inputs[0];
  }

  if (target) {
    const el = target.element as HTMLInputElement | HTMLTextAreaElement;
    el.focus();

    // Strategy 1: Try React fiber onChange directly
    const reactKey = Object.keys(el).find(k =>
      k.startsWith('__reactFiber$') ||
      k.startsWith('__reactInternalInstance$') ||
      k.startsWith('__reactProps$')
    );

    if (reactKey) {
      try {
        const propsKey = Object.keys(el).find(k => k.startsWith('__reactProps$'));
        if (propsKey) {
          const props = (el as any)[propsKey];
          if (props?.onChange) {
            const syntheticEvent = {
              target: { value: text, name: el.name || el.id },
              currentTarget: { value: text, name: el.name || el.id },
              type: 'change',
              bubbles: true,
              cancelable: true,
              defaultPrevented: false,
              eventPhase: 3,
              isTrusted: true,
              nativeEvent: new Event('input'),
              preventDefault: () => {},
              stopPropagation: () => {},
              persist: () => {}
            };
            props.onChange(syntheticEvent);
            el.value = text;
            return { success: true, element: target.label };
          }
        }
      } catch (e) {
        console.debug('[UniversalVoice] React fiber strategy failed, trying alternatives');
      }
    }

```

### services/voiceNexus/
```
complexityRouter.ts
healthCheck.ts
index.ts
knowledgeInjector.ts
orchestrator.ts
preflightCheck.ts
types.ts
```
#### complexityRouter.ts
```typescript
/**
 * VOICE NEXUS - Complexity Router
 *
 * Analyzes user queries to determine optimal provider routing.
 * Uses DQ-inspired scoring to balance speed vs quality.
 *
 * Complexity Tiers:
 *   - FAST (C < 0.3):     Navigation, simple facts → Gemini Flash
 *   - BALANCED (0.3-0.7): Code generation, analysis → Claude Sonnet
 *   - DEEP (C > 0.7):     Architecture, research → Claude Opus
 */

import type {
    ComplexitySignals,
    ComplexityResult,
    ReasoningTier,
    TTSProviderType,
    ProviderSelection,
} from './types';

// =============================================================================
// Configurable Thresholds
// =============================================================================

/**
 * Complexity routing configuration
 */
export interface ComplexityRouterConfig {
    /** Threshold below which queries are routed to 'fast' tier */
    fastThreshold: number;
    /** Threshold above which queries are routed to 'deep' tier */
    deepThreshold: number;
    /** Signal weights for scoring */
    weights: {
        tokenCountMax: number;
        codeIndicator: number;
        reasoningIndicator: number;
        creativeIndicator: number;
        navigationIndicator: number;
        questionIndicator: number;
        domainComplexity: number;
    };
    /** Model mappings per tier */
    tierModels: {
        fast: string;
        balanced: string;
        deep: string;
    };
    /** TTS provider per tier */
    tierTTS: {
        fast: TTSProviderType;
        balanced: TTSProviderType;
        deep: TTSProviderType;
    };
    /** Enable ELITE mode (more aggressive Opus routing) */
    eliteMode: boolean;
}

/**
 * Default configuration - ELITE mode enabled
 */
const DEFAULT_CONFIG: ComplexityRouterConfig = {
    // ELITE thresholds - more aggressive routing to higher tiers
    fastThreshold: 0.2,
    deepThreshold: 0.5,
    weights: {
        tokenCountMax: 0.25,
        codeIndicator: 0.25,
        reasoningIndicator: 0.20,
        creativeIndicator: 0.15,
        navigationIndicator: -0.30,
        questionIndicator: -0.10,
        domainComplexity: 0.30,
    },
    tierModels: {
        fast: 'claude-sonnet',      // ELITE: Fast tier still uses Sonnet
        balanced: 'claude-opus',    // ELITE: Balanced uses Opus
        deep: 'claude-opus',        // ELITE: Deep uses Opus
    },
    tierTTS: {
        fast: 'elevenlabs',         // ELITE: Always premium TTS
        balanced: 'elevenlabs',
        deep: 'elevenlabs',
    },
    eliteMode: true,
};

/**
 * Standard configuration (cost-conscious)
 */
const STANDARD_CONFIG: Partial<ComplexityRouterConfig> = {
    fastThreshold: 0.3,
    deepThreshold: 0.7,
    tierModels: {
        fast: 'claude-haiku',
        balanced: 'claude-sonnet',
        deep: 'claude-opus',
    },
    tierTTS: {
        fast: 'browser',
```

## OS-App Components

### components/AgentCoreTest.tsx
```typescript
/**
 * Agent Core SDK Test Component
 * Tests the integration with the Chief of Staff API
 */

import { useState } from 'react';
import {
  useAgentCoreHealth,
  useSemanticSearch,
  useSessions,
  useLogInsight,
  AgentCoreClient,
} from '@antigravity/agent-core-sdk';

export function AgentCoreTest() {
  const [searchQuery, setSearchQuery] = useState('');
  const [logContent, setLogContent] = useState('');

  // Health check
  const { isHealthy, isLoading: healthLoading } = useAgentCoreHealth();

  // Sessions list
  const { sessions, isLoading: sessionsLoading, error: sessionsError } = useSessions({ limit: 5 });

  // Semantic search
  const { results, isLoading: searchLoading } = useSemanticSearch({
    query: searchQuery,
    limit: 5,
    debounceMs: 500,
  });

  // Log insight mutation
  const { logInsight, isLoading: logLoading } = useLogInsight();

  const handleLogInsight = async () => {
    if (!logContent.trim()) return;
    try {
      const result = await logInsight(logContent, 'finding', ['test', 'sdk']);
      alert(`Logged insight! ID: ${result.id}, Category: ${result.category}`);
      setLogContent('');
    } catch (err) {
      alert(`Error: ${err}`);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-white">Agent Core SDK Test</h1>

      {/* Health Status */}
      <div className="bg-gray-800 rounded-lg p-4">
        <h2 className="text-lg font-semibold text-white mb-2">API Health</h2>
        {healthLoading ? (
          <span className="text-yellow-400">Checking...</span>
        ) : isHealthy ? (
          <span className="text-green-400">✅ API Healthy (localhost:3847)</span>
        ) : (
          <span className="text-red-400">❌ API Unavailable - Run: api-start</span>
        )}
      </div>

      {/* Sessions List */}
      <div className="bg-gray-800 rounded-lg p-4">
        <h2 className="text-lg font-semibold text-white mb-2">Recent Sessions</h2>
        {sessionsLoading ? (
          <span className="text-yellow-400">Loading...</span>
        ) : sessionsError ? (
          <span className="text-red-400">Error: {sessionsError.message}</span>
        ) : (
          <ul className="space-y-2">
            {sessions.map((session) => (
              <li key={session.id} className="text-gray-300 text-sm">
                <span className="text-purple-400">{session.topic || session.id}</span>
                <span className="text-gray-500 ml-2">
                  ({session.finding_count} findings, {session.url_count} URLs)
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Semantic Search */}
      <div className="bg-gray-800 rounded-lg p-4">
        <h2 className="text-lg font-semibold text-white mb-2">Semantic Search</h2>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search knowledge base..."
          className="w-full bg-gray-700 text-white px-4 py-2 rounded mb-4"
        />
        {searchLoading ? (
          <span className="text-yellow-400">Searching...</span>
        ) : results.length > 0 ? (
          <ul className="space-y-2">
            {results.map((result, i) => (
              <li key={i} className="text-gray-300 text-sm border-l-2 border-purple-500 pl-3">
                <div className="text-white">{result.content.slice(0, 150)}...</div>
                <div className="text-gray-500 text-xs mt-1">
```

### components/AgoraPanel.tsx
```typescript
import { apiKeyService } from '../services/apiKeyService';
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SyntheticPersona, DebateTurn, SimulationReport, FileData, AppMode, MentalState } from '../types';
import { generatePersonas, runDebateTurn, synthesizeReport } from '../services/agoraService';
import { liveSession, promptSelectKey, generateSpeech } from '../services/geminiService';
import { useAppStore } from '../store';
import { Users, Loader2, MessageSquare, AlertCircle, CheckCircle, Mic, Zap, Activity, GitCommit, GitBranch, Save, Layers, ArrowUpRight, Radio, Volume2, VolumeX, Eye } from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar as RechartRadar, ResponsiveContainer, LineChart, Line, YAxis } from 'recharts';
import { FunctionDeclaration, Type } from '@google/genai';

interface AgoraPanelProps {
    artifact: FileData;
}

const AgoraPanel: React.FC<AgoraPanelProps> = ({ artifact }) => {
    const { voice, actions } = useAppStore();
    const { setProcessState, setMode, addLog } = actions;
    const [status, setStatus] = useState<'IDLE' | 'GEN_PERSONAS' | 'DEBATING' | 'SYNTHESIZING' | 'COMPLETE'>('IDLE');
    const [personas, setPersonas] = useState<SyntheticPersona[]>([]);
    const [history, setHistory] = useState<DebateTurn[]>([]);
    const [report, setReport] = useState<SimulationReport | null>(null);
    const [activeSpeakerId, setActiveSpeakerId] = useState<string | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    
    const [isVoiceActive, setIsVoiceActive] = useState(false);
    const [isNarrationMuted, setIsNarrationMuted] = useState(false);
    const [conflictHealth, setConflictHealth] = useState<{time: number, tension: number}[]>([]);
    const [lastIntervention, setLastIntervention] = useState<{target: string, msg: string} | null>(null);
    
    const pendingWhispers = useRef<Record<string, string>>({});
    const audioCtxRef = useRef<AudioContext | null>(null);

    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [history]);

    useEffect(() => {
        return () => {
            if (liveSession.isConnected()) {
                liveSession.disconnect();
            }
            
            const ctx = audioCtxRef.current;
            audioCtxRef.current = null;
            if (ctx && ctx.state !== 'closed') {
                ctx.close().catch(() => {});
            }
        };
    }, []);

    const initAudio = async () => {
        if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
            audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        } 
        if (audioCtxRef.current.state === 'suspended') {
            await audioCtxRef.current.resume();
        }
    };

    const playAudioBlob = async (base64Audio: string): Promise<void> => {
        if (!audioCtxRef.current || isNarrationMuted || audioCtxRef.current.state === 'closed') return;
        
        try {
            await initAudio();

            const binaryString = atob(base64Audio);
            const len = binaryString.length;
            const bytes = new Uint8Array(len);
            for (let i = 0; i < len; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }
            
            const pcm16Count = Math.floor(len / 2);
            const ctx = audioCtxRef.current;
            if (!ctx || ctx.state === 'closed') return;
            const audioBuffer = ctx.createBuffer(1, pcm16Count, 24000);
            const channelData = audioBuffer.getChannelData(0);
            
            const dataView = new DataView(bytes.buffer);
            for (let i = 0; i < pcm16Count; i++) {
                const sample = dataView.getInt16(i * 2, true);
                channelData[i] = sample / 32768.0;
            }
            
            const source = ctx.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(ctx.destination);
            
            return new Promise((resolve) => {
                source.onended = () => resolve();
                source.start();
            });
        } catch (e) {
            console.error("Audio Playback Error", e);
            return Promise.resolve();
        }
    };

    const startSimulation = async () => {
```

### components/ApiKeyModal.tsx
```typescript
/**
 * API KEY MODAL
 * UI for managing API keys with encryption vault and master password.
 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Key, Check, Loader2, AlertTriangle, Eye, EyeOff, Lock, Shield, Unlock } from 'lucide-react';
import { apiKeyService } from '../services/apiKeyService';
import { audio } from '../services/audioService';

interface ApiKeyModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type ModalView = 'create-vault' | 'unlock-vault' | 'manage-keys';

const PROVIDERS = [
    { id: 'gemini' as const, name: 'Gemini', color: '#4285F4', description: 'Google AI - Required for core features' },
    { id: 'claude' as const, name: 'Claude', color: '#cc785c', description: 'Anthropic - Advanced reasoning' },
    { id: 'openai' as const, name: 'OpenAI', color: '#10a37f', description: 'GPT models - Coming soon' },
    { id: 'grok' as const, name: 'Grok', color: '#1DA1F2', description: 'xAI - Coming soon' },
    { id: 'eleven_labs' as const, name: 'ElevenLabs', color: '#1f2937', description: 'Neural Voice Synthesis (Creator)' },
    { id: 'deepgram' as const, name: 'Deepgram', color: '#13EF93', description: 'Streaming STT (Nova-3)' },
];

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose }) => {
    const [view, setView] = useState<ModalView>('create-vault');
    const [masterPassword, setMasterPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const [activeProvider, setActiveProvider] = useState<'gemini' | 'claude' | 'openai' | 'grok' | 'eleven_labs' | 'deepgram'>('gemini');
    const [inputValue, setInputValue] = useState('');
    const [showKey, setShowKey] = useState(false);
    const [isValidating, setIsValidating] = useState(false);
    const [validationResult, setValidationResult] = useState<{ valid: boolean; error?: string } | null>(null);
    const [keyStatus, setKeyStatus] = useState(apiKeyService.getKeyStatus());

    // Determine initial view based on vault status
    useEffect(() => {
        if (isOpen) {
            if (apiKeyService.isVaultUnlocked()) {
                setView('manage-keys');
            } else if (apiKeyService.hasVault()) {
                setView('unlock-vault');
            } else {
                setView('create-vault');
            }
            setMasterPassword('');
            setConfirmPassword('');
            setPasswordError('');
        }
    }, [isOpen]);

    useEffect(() => {
        const unsubscribe = apiKeyService.subscribe(() => {
            setKeyStatus(apiKeyService.getKeyStatus());
            if (apiKeyService.isVaultUnlocked()) {
                setView('manage-keys');
            }
        });
        return unsubscribe;
    }, []);

    useEffect(() => {
        if (view === 'manage-keys') {
            const currentKey = apiKeyService.getKey(activeProvider);
            setInputValue(currentKey || '');
            setValidationResult(null);
        }
    }, [activeProvider, view]);

    const handleCreateVault = async () => {
        if (masterPassword.length < 8) {
            setPasswordError('Password must be at least 8 characters');
            return;
        }
        if (masterPassword !== confirmPassword) {
            setPasswordError('Passwords do not match');
            return;
        }

        setIsProcessing(true);
        setPasswordError('');

        const success = await apiKeyService.createVault(masterPassword);
        if (success) {
            audio.playSuccess();
            setView('manage-keys');
        } else {
            setPasswordError('Failed to create vault');
            audio.playError();
        }

        setIsProcessing(false);
    };

```

### components/ApiUsageIndicator.tsx
```typescript
/**
 * API USAGE INDICATOR
 * Displays real-time API usage statistics with rate limit warnings.
 */
import React from 'react';
import { motion } from 'framer-motion';
import { Activity, AlertTriangle, Zap } from 'lucide-react';
import { useApiUsage } from '../hooks/useApiUsage';

const ApiUsageIndicator: React.FC = () => {
    const { stats } = useApiUsage();

    // Determine status color based on calls per minute
    const getStatusColor = () => {
        if (stats.callsThisMinute >= 12) return '#ef4444'; // Red - near limit
        if (stats.callsThisMinute >= 8) return '#f59e0b';  // Amber - moderate
        return 'var(--plasma-green)';                       // Green - normal
    };

    const statusColor = getStatusColor();
    const isNearLimit = stats.callsThisMinute >= 10;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 px-3 py-1.5 bg-black/40 border border-white/5 rounded-xl"
        >
            {/* Pulse Indicator */}
            <div className="relative">
                <Activity size={12} style={{ color: statusColor }} />
                {stats.callsThisMinute > 0 && (
                    <motion.div
                        className="absolute inset-0 rounded-full"
                        style={{ backgroundColor: statusColor }}
                        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                )}
            </div>

            {/* Stats Display */}
            <div className="flex items-center gap-3 text-[9px] font-mono">
                <div className="flex items-center gap-1">
                    <Zap size={10} className="text-[var(--amethyst)]" />
                    <span className="text-gray-500">{stats.callsThisMinute}/min</span>
                </div>
                <div className="text-gray-600">|</div>
                <span className="text-gray-500">{stats.callsThisHour}/hr</span>
            </div>

            {/* Warning on near limit */}
            {isNearLimit && (
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex items-center gap-1 text-[8px] text-amber-400"
                >
                    <AlertTriangle size={10} />
                    <span className="uppercase font-bold">Rate Limit</span>
                </motion.div>
            )}
        </motion.div>
    );
};

export default ApiUsageIndicator;
```

### components/AppFooter.tsx
```typescript
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Save, Loader2, Sparkles, Activity, Radio } from 'lucide-react';
import { useAppStore } from '../store';
import { neuralVault } from '../services/persistenceService';
import { AppMode } from '../types';
import { audio } from '../services/audioService';
import MetaventionsLogo from './MetaventionsLogo';
import NeuralDock from './NeuralDock';

const AppFooter: React.FC = () => {
    const { mode, actions } = useAppStore();
    const { addLog } = actions;


    return (
        <footer className="w-full h-[76px] bg-[var(--bg-header)] border-t border-[var(--border-main)] px-10 shrink-0 relative z-[60] transition-colors duration-1000 brand-inner-glow overflow-hidden backdrop-blur-3xl flex items-center">
            {/* Meditative, rhythmic footer glow */}
            <motion.div
                animate={{
                    opacity: [0.03, 0.1, 0.03],
                    scale: [1, 1.25, 1],
                    background: [
                        "radial-gradient(circle_at_50%_0%, var(--amethyst) 0%, transparent 75%)",
                        "radial-gradient(circle_at_50%_0%, var(--azure-blue) 0%, transparent 75%)",
                        "radial-gradient(circle_at_50%_0%, var(--amethyst) 0%, transparent 75%)"
                    ]
                }}
                transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 pointer-events-none"
            />

            <div className="w-full max-w-[2800px] mx-auto flex items-center justify-between relative z-10 h-full">

                {/* Left: Identity */}
                <div className="flex items-center gap-8">
                    <MetaventionsLogo size={24} showText={true} />
                    <div className="h-6 w-px bg-white/5 hidden sm:block" />
                    <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-[0.4em] flex items-center gap-4">
                        <span className="text-[var(--stellar-white)] font-black">© 2025</span>
                        <span className="opacity-20 hidden lg:block">//</span>
                        <span className="hidden lg:block text-[#9d4edd] font-black uppercase [text-shadow:0_0_10px_rgba(157,78,221,0.5)]">V9.5</span>
                    </div>
                </div>

                {/* Center: Neural Dock (Scaled to fit) */}
                <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2">
                    <NeuralDock mode="static" className="py-2 scale-90 border-transparent bg-transparent shadow-none" />
                </div>

                {/* Right: Links */}
                <div className="flex items-center gap-10">
                    <nav className="flex items-center gap-8">
                        {[
                            { label: 'LINKEDIN', href: 'https://www.linkedin.com/in/dico-angelo/' },
                            { label: 'GITHUB', href: 'https://github.com/Dicoangelo' },
                            { label: 'X', href: 'https://x.com/dicoangelo' }
                        ].map((link) => (
                            <a
                                key={link.label}
                                href={link.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[10px] font-black font-mono text-[var(--text-muted)] hover:text-[var(--cyan)] transition-all tracking-[0.4em] uppercase relative group"
                            >
                                {link.label}
                                <span className="absolute -bottom-1.5 left-0 w-0 h-[1px] bg-[var(--cyan)] transition-all group-hover:w-full shadow-[0_0_15px_var(--cyan)]" />
                            </a>
                        ))}
                    </nav>
                </div>
            </div>
        </footer>
    );
};

export default AppFooter;
```

### components/AuthModule.tsx
```typescript
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store';
import { Shield, Fingerprint, Key, ChevronRight, Loader2, Cpu, Globe, Lock } from 'lucide-react';

const AuthModule: React.FC = () => {
    const { actions } = useAppStore();
    const { setAuthenticated, setUserProfile } = actions;
    const [view, setView] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [credentials, setCredentials] = useState({ username: '', password: '', role: 'OPERATOR' });

    // SOVEREIGN GATE: Secret passphrase for access
    // Can be overridden via env var VITE_ACCESS_PASSPHRASE
    const VALID_PASSPHRASE = import.meta.env.VITE_ACCESS_PASSPHRASE || 'metaventions2026';

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        // Simulate network handshake
        await new Promise(r => setTimeout(r, 1500));

        // VALIDATE PASSPHRASE
        if (credentials.password !== VALID_PASSPHRASE) {
            setError('UPLINK REJECTED: Invalid Neural Key');
            setIsLoading(false);
            return;
        }

        if (view === 'REGISTER') {
            setUserProfile({
                displayName: credentials.username,
                role: credentials.role,
                clearanceLevel: 1,
                avatar: null
            });
        }

        setAuthenticated(true);
        setIsLoading(false);
    };

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center font-sans overflow-hidden bg-black/40 backdrop-blur-xl transition-all duration-1000">
            {/* Background elements - Subtle pulsing lattice */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(rgba(157,78,221,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(157,78,221,0.1)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#9d4edd]/5 rounded-full blur-[120px] animate-pulse"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="w-full max-w-md bg-[#0a0a0a]/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden z-10"
            >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#9d4edd] to-transparent"></div>

                <div className="text-center mb-10">
                    <div className="w-20 h-20 bg-[#111]/50 rounded-full border border-white/10 flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(157,78,221,0.2)]">
                        <Shield className="w-10 h-10 text-[#9d4edd]" />
                    </div>
                    <h1 className="text-2xl font-black font-mono text-white tracking-[0.2em] uppercase">Sovereign Gate</h1>
                    <p className="text-[10px] text-gray-400 font-mono mt-2 uppercase tracking-widest">Biometric Authentication Required</p>
                </div>

                <form onSubmit={handleAuth} className="space-y-6">
                    <div className="space-y-4">
                        <div className="relative group">
                            <label className="text-[9px] font-mono text-gray-500 uppercase tracking-widest block mb-2 px-1">Designation</label>
                            <input
                                type="text"
                                required
                                value={credentials.username}
                                onChange={e => setCredentials({ ...credentials, username: e.target.value })}
                                className="w-full bg-black/50 border border-white/10 rounded-xl px-10 py-3 text-sm text-white font-mono focus:border-[#9d4edd] outline-none transition-all placeholder-white/20"
                                placeholder="Operator ID..."
                            />
                            <Fingerprint className="absolute left-3.5 bottom-3.5 w-4 h-4 text-gray-600 group-focus-within:text-[#9d4edd] transition-colors" />
                        </div>

                        <div className="relative group">
                            <label className="text-[9px] font-mono text-gray-500 uppercase tracking-widest block mb-2 px-1">Neural Key</label>
                            <input
                                type="password"
                                required
                                value={credentials.password}
                                onChange={e => setCredentials({ ...credentials, password: e.target.value })}
                                className="w-full bg-black/50 border border-white/10 rounded-xl px-10 py-3 text-sm text-white font-mono focus:border-[#9d4edd] outline-none transition-all placeholder-white/20"
                                placeholder="Passphrase..."
                            />
                            <Lock className="absolute left-3.5 bottom-3.5 w-4 h-4 text-gray-600 group-focus-within:text-[#9d4edd] transition-colors" />
                        </div>

                        {view === 'REGISTER' && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="relative group">
                                <label className="text-[9px] font-mono text-gray-500 uppercase tracking-widest block mb-2 px-1">Role Protocol</label>
                                <select
```

### components/BicameralEngine.tsx
```typescript
import { apiKeyService } from '../services/apiKeyService';
import React, { useState, useRef, useEffect } from 'react';
import { useAppStore } from '../store';
import { generateDecompositionMap, adaptiveConsensusEngine, ACEStatus, ACEResult, DQScore } from '../services/bicameralService';
import { promptSelectKey, AGENT_DNA_BUILDER } from '../services/geminiService';
import { neuralVault } from '../services/persistenceService';
import { BrainCircuit, Zap, Layers, Cpu, ArrowRight, CheckCircle2, Loader2, GitBranch, GitCommit, AlertOctagon, Save, ExternalLink, Dna, Info, Settings2, Sliders, X, MessageSquareCode, ShieldCheck, Activity, Target, Gauge, Users, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { TugOfWarChart } from './Visualizations/TugOfWarChart';
import { AgentGraveyard } from './Visualizations/AgentGraveyard';
import { SwarmStatus, AgentDNA } from '../types';
import { audio } from '../services/audioService';
import { ExperimentLogger } from './ExperimentLogger';
import { FlaskConical } from 'lucide-react';

const BicameralEngine: React.FC = () => {
    const { bicameral, actions } = useAppStore();
    const { setBicameralState, addLog } = actions;
    const { goal, plan, ledger, isPlanning, isSwarming, swarmStatus } = bicameral;

    const [selectedDNA, setSelectedDNA] = useState<AgentDNA>(AGENT_DNA_BUILDER[1]);
    const [agentWeights, setAgentWeights] = useState({ skepticism: 50, excitement: 80, alignment: 90 });
    const [showControls, setShowControls] = useState(false);
    const [customDirective, setCustomDirective] = useState('');

    // ACE-specific state
    const [aceStatus, setAceStatus] = useState<ACEStatus | null>(null);
    const [lastDQScore, setLastDQScore] = useState<DQScore | null>(null);
    const [participatingAgents, setParticipatingAgents] = useState<string[]>([]);
    const [useAdaptiveMode, setUseAdaptiveMode] = useState(true);
    const [showExperimentLogger, setShowExperimentLogger] = useState(false);
    const [lastCompletedRounds, setLastCompletedRounds] = useState<number>(0);
    const [lastCompletedOutput, setLastCompletedOutput] = useState<string>('');

    const activeTask = plan.find(t => t.status === 'IN_PROGRESS');

    const runArchitecture = async () => {
        if (!goal?.trim()) return;
        
        try {
            const hasKey = apiKeyService.hasGeminiKey();
            if (!hasKey) { await promptSelectKey(); return; }

            audio.playClick();
            setBicameralState({ isPlanning: true, plan: [], ledger: [], error: null });
            
            // Combine goal with custom directive for decomposition
            const fullGoal = `${goal}${customDirective ? `\n\nDIRECTIVE: ${customDirective}` : ''}\nAGENT_WEIGHTS: ${JSON.stringify(agentWeights)}`;
            const tasks = await generateDecompositionMap(fullGoal);
            
            if (!tasks || tasks.length === 0) throw new Error("Decomposition returned null logic.");

            const initialTasks = tasks.map(t => ({ ...t, status: 'PENDING' as const }));
            setBicameralState({ 
                plan: initialTasks, 
                isPlanning: false,
                swarmStatus: { ...swarmStatus, activeDNA: selectedDNA.id }
            });
            
            addLog('INFO', `ARCHITECT: Decomposed goal using ${selectedDNA.label} build.`);
            
            setBicameralState({ isSwarming: true });
            
            // Process tasks sequentially in the swarm
            for (let i = 0; i < initialTasks.length; i++) {
                const task = initialTasks[i];
                
                // Set current task to in-progress
                setBicameralState(prev => ({
                    plan: prev.plan.map(t => t.id === task.id ? { ...t, status: 'IN_PROGRESS' } : t)
                }));

                try {
                    const result = await adaptiveConsensusEngine(
                        task,
                        (statusUpdate: ACEStatus) => {
                            setAceStatus(statusUpdate);
                            setParticipatingAgents(statusUpdate.participatingAgents || []);
                            setBicameralState(prev => ({
                                swarmStatus: {
                                    ...statusUpdate,
                                    activeDNA: statusUpdate.activeDNA || selectedDNA.id,
                                    consensusProgress: (statusUpdate.currentGap / statusUpdate.targetGap) * 100
                                }
                            }));
                        },
                        {
                            adaptiveThresholds: useAdaptiveMode,
                            enableAuction: useAdaptiveMode,
                            enableDQScoring: true,
                            enableLearning: true
                        }
                    );

                    // Store DQ score for display
                    if (result.dqScore) {
                        setLastDQScore(result.dqScore);
                    }

                    const consensusContent = `
```

### components/CPBMonitor.tsx
```typescript
/**
 * CPB Monitor - Visual Dashboard for Cognitive Precision Bridge
 *
 * Displays real-time execution status, path routing, and quality metrics.
 */

import React, { useState, useEffect } from 'react';
import {
    BrainCircuit,
    Zap,
    Users,
    GitMerge,
    Layers,
    CheckCircle2,
    AlertCircle,
    Loader2,
    Activity,
    Target,
    TrendingUp,
    Clock,
    Cpu,
    BarChart3
} from 'lucide-react';
import type { CPBStatus, CPBResult, CPBPath, CPBPhase } from '../services/cognitivePrecisionBridge/types';

// ============================================================================
// PATH DISPLAY CONFIG
// ============================================================================

interface PathConfig {
    label: string;
    icon: React.ReactNode;
    color: string;
    description: string;
}

const PATH_CONFIGS: Record<CPBPath, PathConfig> = {
    direct: {
        label: 'Direct',
        icon: <Zap size={14} />,
        color: '#10b981',
        description: 'Fast single-pass execution'
    },
    rlm: {
        label: 'RLM',
        icon: <BrainCircuit size={14} />,
        color: '#8b5cf6',
        description: 'Recursive Language Model for long context'
    },
    ace: {
        label: 'ACE',
        icon: <Users size={14} />,
        color: '#3b82f6',
        description: 'Multi-agent consensus engine'
    },
    hybrid: {
        label: 'Hybrid',
        icon: <GitMerge size={14} />,
        color: '#f59e0b',
        description: 'RLM compression + ACE consensus'
    },
    cascade: {
        label: 'Cascade',
        icon: <Layers size={14} />,
        color: '#ef4444',
        description: 'Full pipeline with verification'
    }
};

const PHASE_CONFIGS: Record<CPBPhase, { label: string; color: string }> = {
    idle: { label: 'Idle', color: '#6b7280' },
    analyzing: { label: 'Analyzing', color: '#8b5cf6' },
    compressing: { label: 'Compressing', color: '#3b82f6' },
    exploring: { label: 'Exploring', color: '#10b981' },
    converging: { label: 'Converging', color: '#f59e0b' },
    verifying: { label: 'Verifying', color: '#06b6d4' },
    reconstructing: { label: 'Reconstructing', color: '#ec4899' },
    complete: { label: 'Complete', color: '#10b981' },
    error: { label: 'Error', color: '#ef4444' }
};

// ============================================================================
// COMPACT STATUS BADGE
// ============================================================================

interface CPBStatusBadgeProps {
    status: CPBStatus | null;
    onClick?: () => void;
}

export const CPBStatusBadge: React.FC<CPBStatusBadgeProps> = ({ status, onClick }) => {
    if (!status || status.phase === 'idle') return null;

    const pathConfig = PATH_CONFIGS[status.path];
    const phaseConfig = PHASE_CONFIGS[status.phase];
    const isActive = status.phase !== 'complete' && status.phase !== 'error';

    return (
        <button
            onClick={onClick}
```

### components/CPBStatusOverlay.tsx
```typescript
/**
 * CPB Status Overlay
 *
 * Visual heads-up display showing CPB execution state in real-time.
 * Designed to overlay on VoiceMode to show what the system is "thinking".
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store';
import {
    Brain, Zap, Layers, Users, Shield, CheckCircle,
    Loader2, AlertCircle, Sparkles, Activity
} from 'lucide-react';
import { cn } from '../utils/cn';

const PATH_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode; description: string }> = {
    direct: {
        label: 'DIRECT',
        color: '#00ff88',
        icon: <Zap size={14} />,
        description: 'Fast path'
    },
    rlm: {
        label: 'RLM',
        color: '#00d4ff',
        icon: <Layers size={14} />,
        description: 'Context compression'
    },
    ace: {
        label: 'ACE',
        color: '#a855f7',
        icon: <Users size={14} />,
        description: 'Multi-agent consensus'
    },
    hybrid: {
        label: 'HYBRID',
        color: '#f59e0b',
        icon: <Brain size={14} />,
        description: 'RLM + ACE'
    },
    cascade: {
        label: 'CASCADE',
        color: '#ef4444',
        icon: <Shield size={14} />,
        description: 'Full verification'
    }
};

const PHASE_CONFIG: Record<string, { label: string; progress: number }> = {
    idle: { label: 'Ready', progress: 0 },
    analyzing: { label: 'Analyzing', progress: 10 },
    compressing: { label: 'Compressing', progress: 30 },
    exploring: { label: 'Exploring', progress: 50 },
    converging: { label: 'Converging', progress: 70 },
    verifying: { label: 'Verifying', progress: 85 },
    reconstructing: { label: 'Reconstructing', progress: 95 },
    complete: { label: 'Complete', progress: 100 },
    error: { label: 'Error', progress: 0 }
};

const CPBStatusOverlay: React.FC = () => {
    const { cpb } = useAppStore();
    const pathConfig = PATH_CONFIG[cpb.path] || PATH_CONFIG.direct;
    const phaseConfig = PHASE_CONFIG[cpb.phase] || PHASE_CONFIG.idle;

    // Don't render if not active
    if (!cpb.isActive && cpb.phase === 'idle') {
        return null;
    }

    const isComplete = cpb.phase === 'complete';
    const isError = cpb.phase === 'error';
    const isProcessing = cpb.isActive && !isComplete && !isError;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="absolute top-6 left-1/2 -translate-x-1/2 z-50"
            >
                <div className={cn(
                    "relative bg-black/80 backdrop-blur-xl border rounded-2xl p-4 min-w-[320px] shadow-2xl",
                    isError ? "border-red-500/50" : isComplete ? "border-green-500/50" : "border-white/10"
                )}>
                    {/* Glow effect */}
                    <div
                        className="absolute inset-0 rounded-2xl blur-xl opacity-20 -z-10"
                        style={{ backgroundColor: pathConfig.color }}
                    />

                    {/* Header */}
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <div
                                className={cn(
                                    "w-8 h-8 rounded-lg flex items-center justify-center",
                                    isProcessing && "animate-pulse"
```

### components/CPBTest.tsx
```typescript
/**
 * CPB Test Component
 *
 * Interactive test interface for the Cognitive Precision Bridge.
 * Supports text and multimodal (image) inputs.
 */

import React, { useState, useRef } from 'react';
import {
    BrainCircuit,
    Play,
    Loader2,
    Upload,
    Image as ImageIcon,
    X,
    Zap,
    Users,
    GitMerge,
    Layers,
    CheckCircle2,
    AlertCircle
} from 'lucide-react';
import { cpbExecute, cpbExecutePath } from '../services/cognitivePrecisionBridge';
import type { CPBPath, CPBStatus, CPBResult } from '../services/cognitivePrecisionBridge/types';
import { CPBMonitorPanel, CPBStatusBadge } from './CPBMonitor';
import { useAppStore } from '../store';

const PATH_OPTIONS: { value: CPBPath; label: string; icon: React.ReactNode; description: string }[] = [
    { value: 'direct', label: 'Direct', icon: <Zap size={14} />, description: 'Fast single-pass' },
    { value: 'rlm', label: 'RLM', icon: <BrainCircuit size={14} />, description: 'Long context' },
    { value: 'ace', label: 'ACE', icon: <Users size={14} />, description: 'Multi-agent consensus' },
    { value: 'hybrid', label: 'Hybrid', icon: <GitMerge size={14} />, description: 'RLM + ACE' },
    { value: 'cascade', label: 'Cascade', icon: <Layers size={14} />, description: 'Full verification' },
];

const CPBTest: React.FC = () => {
    const { actions } = useAppStore();
    const { setCPBState, addLog } = actions;

    const [query, setQuery] = useState('');
    const [context, setContext] = useState('');
    const [selectedPath, setSelectedPath] = useState<CPBPath | 'auto'>('auto');
    const [isExecuting, setIsExecuting] = useState(false);
    const [status, setStatus] = useState<CPBStatus | null>(null);
    const [result, setResult] = useState<CPBResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Multimodal state
    const [images, setImages] = useState<{ file: File; preview: string; base64?: string }[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const newImages = await Promise.all(
            Array.from(files).map(async (file) => {
                const preview = URL.createObjectURL(file);
                const base64 = await fileToBase64(file);
                return { file, preview, base64 };
            })
        );

        setImages([...images, ...newImages]);
    };

    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
        });
    };

    const removeImage = (index: number) => {
        const newImages = [...images];
        URL.revokeObjectURL(newImages[index].preview);
        newImages.splice(index, 1);
        setImages(newImages);
    };

    const handleExecute = async () => {
        if (!query.trim()) return;

        setIsExecuting(true);
        setError(null);
        setResult(null);
        addLog('SYSTEM', `[CPB] Starting execution: "${query.slice(0, 50)}..."`);

        try {
            // Build context with images if present
            let fullContext = context;
            if (images.length > 0) {
                fullContext += '\n\n[MULTIMODAL INPUT: ' + images.length + ' image(s) attached]';
                // Note: Actual image processing would require Gemini Vision API
            }

            const onStatus = (s: CPBStatus) => {
                setStatus(s);
```

