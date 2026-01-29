# Test Suites & Configurations

Generated: Thu 29 Jan 2026 10:40:03 EST

## OS-App

### vite.config.ts
```typescript
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  // Resolve @ to the current working directory
  const rootPath = path.resolve('.');

  return {
    server: {
      port: 5173,
      strictPort: false,
      host: '0.0.0.0',
      // SPA Fallback for local development
      historyApiFallback: true,
    },
    plugins: [react()],
    // Enable SPA support for deployments like Vercel
    appType: 'spa',
    define: {
      // Support both VITE_GEMINI_API_KEY and legacy GEMINI_API_KEY from .env
      'process.env.API_KEY': JSON.stringify(env.VITE_GEMINI_API_KEY || env.GEMINI_API_KEY || ''),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.VITE_GEMINI_API_KEY || env.GEMINI_API_KEY || '')
    },
    resolve: {
      alias: {
        '@': rootPath,
        'libs': path.resolve('libs'),
      }
    },
    build: {
      chunkSizeWarningLimit: 2000,
      // Strip console.log and debugger in production
      minify: 'esbuild',
      esbuild: {
        drop: mode === 'production' ? ['console', 'debugger'] : [],
      },
      rollupOptions: {
        external: ['mermaid'],
        output: {
          globals: {
            mermaid: 'mermaid'
          },
          manualChunks(id) {
            if (id.includes('node_modules')) {
              // Heavy libs - lazy loaded, separate chunks
              if (id.includes('three')) {
                return 'vendor-three';
              }
              if (id.includes('face-api')) {
                return 'vendor-faceapi';
              }
              if (id.includes('recharts')) {
                return 'vendor-recharts';
              }
              if (id.includes('framer-motion')) {
                return 'vendor-framer';
              }
              if (id.includes('lucide-react')) {
                return 'vendor-lucide';
              }
              if (id.includes('@xyflow')) {
                return 'vendor-xyflow';
              }
              if (id.includes('@google/genai')) {
                return 'vendor-genai';
              }
              if (id.includes('@tensorflow')) {
                return 'vendor-tensorflow';
              }
              return 'vendor';
            }
          },
        },
      },
    },
  };
});
```

### vitest.config.ts
```typescript
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'happy-dom',
    include: ['**/*.test.ts', '**/*.spec.ts'],
    exclude: ['node_modules', 'dist'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules', 'dist', '**/*.test.ts', '**/*.spec.ts']
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
      'libs': path.resolve(__dirname, 'libs'),
    }
  }
});
```

### tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "experimentalDecorators": true,
    "useDefineForClassFields": false,
    "module": "ESNext",
    "lib": [
      "ES2022",
      "DOM",
      "DOM.Iterable"
    ],
    "skipLibCheck": true,
    "types": [
      "node",
      "vite/client"
    ],
    "moduleResolution": "bundler",
    "isolatedModules": true,
    "moduleDetection": "force",
    "allowJs": true,
    "jsx": "react-jsx",
    "paths": {
      "@/*": [
        "./*"
      ],
      "libs/*": [
        "./libs/*"
      ]
    },
    "allowImportingTsExtensions": true,
    "noEmit": true
  }
}
```

## cpb-core (npm package)

### src/index.ts (Full)
```typescript
/**
 * Cognitive Precision Bridge (CPB)
 *
 * Unified orchestration layer for precision-aware AI processing.
 * Routes queries through optimal paths based on complexity analysis.
 *
 * @example
 * ```typescript
 * import { createCPB, type CPBProvider } from '@antigravity/cpb-core';
 *
 * // Define your provider
 * const myProvider: CPBProvider = {
 *     name: 'openai',
 *     isConfigured: () => true,
 *     generate: async (prompt) => {
 *         // Your LLM call here
 *         return response;
 *     }
 * };
 *
 * // Create CPB instance
 * const cpb = createCPB({
 *     fast: myProvider,
 *     balanced: myProvider,
 *     deep: myProvider
 * });
 *
 * // Execute with auto-routing
 * const result = await cpb.execute({
 *     query: 'Analyze the trade-offs of microservices vs monolith',
 *     context: systemDesignDoc
 * }, (status) => {
 *     console.log(`${status.phase}: ${status.progress}%`);
 * });
 *
 * console.log(result.output);
 * console.log(`Path: ${result.path}, DQ: ${result.dqScore.overall}%`);
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
    CPBProvider,
    GenerateOptions,
    PathSignals,
    RoutingDecision,
    DQScore,
    RLMStatus,
    RLMResult,
    ACEResult,
    ImageInput,
    MultimodalContent,
    ModelTier,
    CPBPattern,
    LearnedRouting,
    CPBStatusCallback
} from './types';

export { DEFAULT_CPB_CONFIG, STANDARD_CPB_CONFIG } from './types';

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
    CognitivePrecisionBridge,
    createCPB,
    cpbExecute
} from './orchestrator';

// Default export
export { default } from './orchestrator';
```

### tsup.config.ts

## voice-nexus (npm package)

### src/index.ts (Full)
```typescript
/**
 * VOICE NEXUS
 *
 * Universal multi-provider voice architecture.
 * Seamlessly routes between STT, reasoning, and TTS providers.
 *
 * @example
 * ```typescript
 * import { createVoiceNexus, type ReasoningProvider } from '@antigravity/voice-nexus';
 *
 * // Define your reasoning provider
 * const myReasoning: ReasoningProvider = {
 *     name: 'openai',
 *     models: { fast: 'gpt-3.5-turbo', balanced: 'gpt-4', deep: 'gpt-4-turbo' },
 *     isAvailable: () => true,
 *     generate: async (prompt, config) => {
 *         // Your LLM call here
 *         return { text: response, model: config.model || 'gpt-4' };
 *     }
 * };
 *
 * // Create Voice Nexus instance
 * const nexus = createVoiceNexus({
 *     config: {
 *         mode: 'turn-based',
 *         knowledgeInjection: false,
 *         providers: {
 *             reasoning: myReasoning
 *         }
 *     },
 *     events: {
 *         onTranscriptUpdate: (t) => console.log(`[${t.role}] ${t.text}`),
 *         onComplexityAnalyzed: (c) => console.log(`Complexity: ${c.score.toFixed(2)}`)
 *     }
 * });
 *
 * // Process text input
 * const response = await nexus.processTextInput('How do I implement authentication?');
 * console.log(response?.text);
 * ```
 */

// Types
export type {
    // Core configuration
    VoiceNexusConfig,
    VoiceNexusState,
    VoiceNexusOptions,
    VoiceNexusEvents,
    VoiceMode,
    ReasoningTier,

    // Transcripts
    Transcript,
    PartialTranscript,

    // Provider interfaces
    STTProvider,
    TTSProvider,
    TTSSettings,
    VoiceConfig,
    ReasoningProvider,
    ReasoningConfig,
    ReasoningResult,

    // Complexity
    ComplexitySignals,
    ComplexityResult,
    ProviderSelection,

    // Knowledge
    SearchResult,
    Finding,
    KnowledgeContext,
    KnowledgeInjectorConfig,
    KnowledgeInjector,

    // Audio
    AudioConfig,
    FrequencyData,

    // Tools
    VoiceToolCall,
    VoiceToolResult,
    VoiceToolHandler
} from './types';

// Complexity Router
export {
    analyzeComplexity,
    extractComplexitySignals,
    calculateComplexityScore,
    getComplexityTier,
    selectProviders,
    hasExplicitOverride,
    formatComplexityResult,
    STANDARD_THRESHOLDS,
    ELITE_THRESHOLDS
} from './router';

// Orchestrator
export {
    VoiceNexusOrchestrator,
    createVoiceNexus,
    createMinimalVoiceNexus
} from './orchestrator';

// Default export
export { default } from './orchestrator';
```

## ResearchGravity

### requirements.txt
```
# ResearchGravity Dependencies
# ============================

# MCP Server
mcp>=1.0.0

# API Server
fastapi>=0.100.0
uvicorn>=0.20.0

# Storage
aiofiles>=23.0.0

# Context Packs V2
sentence-transformers>=2.2.0
numpy>=1.24.0

# Include CPB dependencies
-r cpb/requirements.txt
```

### pyproject.toml

