# Documentation & Architecture Files

Generated: Thu 29 Jan 2026 10:33:39 EST

## OS-App

### CONTRIBUTING.md
# Contributing to OS-App

Thank you for your interest in contributing to **OS-App** — the Sovereign AI Operating System by Metaventions AI!

## Ways to Contribute

### 1. Report Bugs
Use the [Bug Report template](https://github.com/Dicoangelo/OS-App/issues/new?template=bug_report.yml) to report issues.

### 2. Suggest Features
Use the [Feature Request template](https://github.com/Dicoangelo/OS-App/issues/new?template=feature_request.yml) to propose new features.

### 3. Submit Pull Requests

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Ensure code quality (see below)
5. Commit (`git commit -m 'Add amazing feature'`)
6. Push (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/OS-App.git
cd OS-App

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Add your API keys to .env

# Start development server
npm run dev
```

## Code Quality

### TypeScript/React Standards

- Use TypeScript strict mode
- Follow existing component patterns
- Use Tailwind CSS for styling
- Keep components focused and composable
- Add types for all props and state

### Before Submitting

```bash
# Type checking
npm run build

# Lint check
npm run lint

# Test locally
npm run dev
```

## Architecture Guidelines

- **Services** (`/services`) — API integrations, business logic
- **Components** — React components with clear responsibilities
- **Hooks** (`/hooks`) — Reusable stateful logic
- **Store** (`store.ts`) — Zustand global state

## Metaventions Quality Standards

All contributions should align with the Metaventions philosophy:

- **Signal density** — Every addition should move the project forward
- **Compounding potential** — Features should enable future innovation
- **Sovereignty** — User data stays with the user
- **Premium experience** — Polish matters

## Questions?

Contact: dicoangelo@metaventionsai.com

---

*"Let the invention be hidden in your vision"*
**Metaventions AI** — Architected Intelligence

### index.html



  
    
    
    Metaventions AI V1
    
    
    
    
    
       :root {
          /* --- SOVEREIGN BRAND VECTORS // ZENITH SYNC --- */
          --amethyst: #7B2CFF;
          --cyan: #18E6FF;
          --executive-gold: #f1c21b;
          --obsidian: #020204;
          --plasma-green: #10b981;
          
          /* --- MATERIAL SOVEREIGNTY: LUMINOUS INTENSITY SCALES --- */
          --luminous-high: rgba(255, 255, 255, 0.12);
          --luminous-med: rgba(255, 255, 255, 0.06);
          --luminous-low: rgba(255, 255, 255, 0.02);
          --refractive-index: 1.8;
          --specular-rim: rgba(255, 255, 255, 0.15);
          
          /* --- OPTICAL DEPTH SYSTEM --- */
          --bg-app: var(--obsidian);
          --bg-header: rgba(2, 2, 4, 0.85);
          --bg-panel: rgba(255, 255, 255, 0.015);
          --border-main: rgba(255, 255, 255, 0.06);
          --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
       }

       /* --- AGGRESSIVE GLOBAL SCROLLBAR REMOVAL --- */
       * {
          scrollbar-width: none !important; /* Firefox */
          -ms-overflow-style: none !important;  /* IE and Edge */
       }

       *::-webkit-scrollbar {
          display: none !important; /* Chrome, Safari and Opera */
          width: 0 !important;
          height: 0 !important;
       }

       body { 
          font-family: 'Inter', sans-serif; 
          background-color: var(--bg-app); 
          color: white; 
          margin: 0; 
          padding: 0; 
          -webkit-font-smoothing: antialiased;
          overflow: hidden;
       }

       .font-mono { font-family: 'Fira Code', monospace; }
       
       /* --- MATERIAL SOVEREIGNTY: APPLE-STYLE CRYSTALLINE GLASS --- */
       .crystalline {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.01) 100%) !important;
          backdrop-filter: blur(40px) saturate(180%) !important;
          -webkit-backdrop-filter: blur(40px) saturate(180%) !important;
          border: 0.5px solid var(--specular-rim) !important;
          box-shadow: 
            inset 0 1px 1px rgba(255, 255, 255, 0.1),
            0 25px 50px -12px rgba(0, 0, 0, 0.7);
          transition: border-color 0.4s var(--ease-out-expo), box-shadow 0.4s var(--ease-out-expo);
       }

       .crystalline:hover {
          border-color: rgba(255, 255, 255, 0.25) !important;
          box-shadow: 
            inset 0 1px 1px rgba(255, 255, 255, 0.2),
            0 40px 80px -20px rgba(0, 0, 0, 0.85);
       }

       /* --- DEEP REFRACTION STACKING --- */
       .deep-refraction-active .main-content-layer {
          filter: blur(8px) saturate(110%) brightness(0.6);
          transform: scale(0.98);
          transition: all 0.8s var(--ease-out-expo);
       }

       .glass-refraction {
          position: relative;
          overflow: hidden;
       }
       .glass-refraction::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(105deg, transparent 40%, rgba(24, 230, 255, 0.05) 45%, rgba(24, 230, 255, 0.1) 50%, rgba(24, 230, 255, 0.05) 55%, transparent 60%);
          background-size: 200% 200%;
          animation: refraction-sweep 8s infinite linear;
          pointer-events: none;
          z-index: 1;
       }

       @keyframes refraction-sweep {
          0% { background-position: -200% -200%; }
          100% { background-position: 200% 200%; }
       }

       .invisible-glass {
          background: rgba(255, 255, 255, 0.003) !important;
          backdrop-filter: blur(25px) saturate(140%) !important;
          border: 1px solid rgba(255, 255, 255, 0.05);
       }
       
       .shimmer-text {
          background: linear-gradient(90deg, #fff, var(--cyan), #fff);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 4s linear infinite;
       }

       @keyframes shimmer {
          to { background-position: 200% center; }
       }

       .no-scrollbar::-webkit-scrollbar {
          display: none !important;
       }
       .no-scrollbar {
          -ms-overflow-style: none !important;
          scrollbar-width: none !important;
       }
    
    
{
  "imports": {
    "react": "https://esm.sh/react@19.0.0",
    "react-dom": "https://esm.sh/react-dom@19.0.0",
    "react-dom/client": "https://esm.sh/react-dom@19.0.0/client",
    "framer-motion": "https://esm.sh/framer-motion@11.11.17?external=react,react-dom",
    "recharts": "https://esm.sh/recharts@2.12.7?external=react,react-dom",
    "lucide-react": "https://esm.sh/lucide-react@0.460.0",
    "@google/genai": "https://esm.sh/@google/genai@1.33.0",
    "zustand": "https://esm.sh/zustand@5.0.1?external=react",
    "@xyflow/react": "https://esm.sh/@xyflow/react@12.10.0?external=react,react-dom",
    "idb": "https://esm.sh/idb@8.0.3",
    "jszip": "https://esm.sh/jszip@3.10.1",
    "html-to-image": "https://esm.sh/html-to-image@1.11.13?external=react,react-dom",
    "d3": "https://esm.sh/d3@7.9.0",
    "three": "https://esm.sh/three@0.170.0",
    "@react-three/fiber": "https://esm.sh/@react-three/fiber@9.0.0-rc.0?external=react,react-dom,three",
    "react-dom/": "https://esm.sh/react-dom@^19.2.3/",
    "react/": "https://esm.sh/react@^19.2.3/",
    "mermaid": "https://esm.sh/mermaid@^11.12.2",
    "@vitejs/plugin-react": "https://esm.sh/@vitejs/plugin-react@^5.1.2",
    "vite": "https://esm.sh/vite@^^7.3.0",
    "tailwind-merge": "https://esm.sh/tailwind-merge@^3.4.0",
    "clsx": "https://esm.sh/clsx@^2.1.1",
    "path": "https://esm.sh/path@^0.12.7"
  }
}

  

  
    
    
  


## ResearchGravity

### CONTRIBUTING.md
# Contributing to ResearchGravity

Thank you for your interest in contributing to **ResearchGravity** by Metaventions AI!

## Ways to Contribute

### 1. Report Bugs
Use the [Bug Report template](https://github.com/Dicoangelo/ResearchGravity/issues/new?template=bug_report.yml) to report issues.

### 2. Suggest Features
Use the [Feature Request template](https://github.com/Dicoangelo/ResearchGravity/issues/new?template=feature_request.yml) to propose new features.

### 3. Submit Pull Requests

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Ensure code quality (see below)
5. Commit (`git commit -m 'Add amazing feature'`)
6. Push (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## Code Quality

### Python Scripts

- Follow PEP 8 style guidelines
- Add docstrings to functions
- Keep functions focused and small
- Test locally before submitting

### Documentation

- Keep SKILL.md up to date with changes
- Use clear, concise language
- Include examples where helpful

## Metaventions Quality Standards

All contributions should align with the Metaventions philosophy:

- **Signal density** — Every addition should move the project forward
- **Compounding potential** — Features should enable future innovation
- **Sovereignty** — User data stays with the user

## Questions?

Contact: dicoangelo@metaventionsai.com

---

*"Let the invention be hidden in your vision"*
**Metaventions AI** — Architected Intelligence

### ROADMAP.md
# ResearchGravity + Context Packs - Roadmap

**Last Updated:** 2026-01-21

---

## ✅ Completed (v3.1 - v3.6)

### v3.1 - Session Management
- ✅ **Auto-capture sessions** - `session_tracker.py`, `auto_capture.py`
  - Automatic session initialization and tracking
  - Full transcript archival
  - URL and findings capture
  - Checkpoints and duration tracking

- ✅ **Cross-project lineage tracking**
  - Link research sessions to implementation projects
  - Lineage stored in `session_tracker.json`
  - Bidirectional traceability (research → implementation)

### v3.2 - Project Context
- ✅ **Project registry** - `projects.json`
  - Track active projects (OS-App, CareerCoach, Metaventions)
  - Project metadata (tech stack, status, focus areas)
  - Cross-project indexing

- ✅ **Context loader** - `project_context.py`
  - Auto-detect project from current directory
  - Load project-specific research files
  - Integration with unified index

- ✅ **Unified research index** - `~/.agent-core/research/INDEX.md`
  - Cross-project paper references
  - Centralized concept tracking
  - Research convergence analysis

### v3.4 - Memory & Context
- ✅ **Context prefetcher** - `prefetch.py`
  - Auto-detect project and inject relevant context
  - Filter by topic, papers, learnings
  - Clipboard or direct injection to `~/CLAUDE.md`
  - Smart context selection based on recent sessions

- ✅ **Learnings backfill** - `backfill_learnings.py`
  - Extract learnings from all archived sessions
  - Regenerate `~/.agent-core/memory/learnings.md`
  - Time-based filtering (last N days)
  - Dry-run preview mode

### v3.5 - Context Packs V2 (NEW - 2026-01-18)
- ✅ **7-Layer Context Management System**
  - Layer 1: Multi-graph memory (4 graphs)
  - Layer 2: Multi-agent routing (5 agents, 3 rounds)
  - Layer 3: Attention pruning (6.3x compression)
  - Layer 4: RL pack operations (5 operations)
  - Layer 5: Active focus compression (22.7%)
  - Layer 6: Continuum memory evolution
  - Layer 7: Trainable pack weights

- ✅ **Production Deployment**
  - V1/V2 automatic routing with fallback
  - Real semantic embeddings (sentence-transformers)
  - 80-400ms selection time (<500ms target)
  - Comprehensive documentation (9 files, 2,542+ lines)

- ✅ **First Convergence**
  - 7 January 2026 research papers converged
  - No existing system has all features combined
  - 99%+ token reduction on realistic baseline

### v3.6 - CPB Precision Mode v2.5 (NEW - 2026-01-21)
- ✅ **Deep Research Integration**
  - Gemini + Perplexity external research APIs
  - Google Search grounding for real-time web research
  - Provider fallback chain (Gemini → Perplexity)
  - Migrated to new `google-genai` SDK

- ✅ **Pioneer Mode & Trust Context**
  - Adjusted DQ weights for cutting-edge research queries
  - User-provided context treated as Tier 1 sources
  - Auto-detection from query signals and sparse results

- ✅ **Hardening & Reliability**
  - 15-minute TTL caching layer for deep research
  - Retry logic with exponential backoff (1s, 2s, 4s)
  - Hardened Gemini grounding extraction (3 fallback methods)
  - Cost tracking (tokens, USD, phase timings)

- ✅ **CLI Enhancements**
  - `--status`: System status (dependencies, providers, cache)
  - `--dry-run`: Execution plan preview without API calls
  - `--pioneer`, `--deep-research`, `--trust-context` flags

- ✅ **Testing Infrastructure**
  - 17 test cases covering v2.4/2.5 features
  - Pytest fixtures and mock factories
  - All tests passing

### v3.7 - MCP Integration (NEW - 2026-01-21)
- ✅ **MCP Server Implementation**
  - Full MCP server in `mcp_server.py` (606 lines)
  - 8 tools: get_session_context, search_learnings, get_project_research, log_finding, select_context_packs, get_research_index, list_projects, get_session_stats
  - 4 resources: session://active, learnings://all, research://index, project://{name}/research

- ✅ **Claude Code Integration**
  - Registered in `~/.claude.json` mcpServers
  - Auto-starts with Claude Code sessions
  - Cross-tool context sharing ready

- ✅ **Dependencies**
  - MCP SDK v1.25.0 installed
  - requirements.txt updated with mcp>=1.0.0

---

## 🚧 In Progress

### v4.0 - Advanced Integration

#### Auto-Synthesis via LLM
**Status:** Planned
**Priority:** Medium

Automatic synthesis of research sessions:
- Generate thesis statements from URLs and findings
- Identify gaps automatically
- Suggest innovation directions
- Create summaries for archived sessions

**Implementation:**
```python
# Planned structure
researchgravity/
├── synthesizer.py         # LLM-based synthesis engine
├── synthesis_prompts/     # Prompt templates
│   ├── thesis.txt
│   ├── gap.txt
│   └── innovation.txt
└── synthesis_config.json  # Model settings
```

**Expected Features:**
- Auto-generate `session_log.md` synthesis sections
- Suggest related papers based on findings
- Identify cross-session patterns
- Quality scoring for research sessions

**Integration Points:**
- Context Packs V2 for relevant context injection
- Prefetcher for loading related papers
- Archive system for historical context

**Target:** v4.1 (Q2 2026)

---

#### Browser Extension for URL Capture
**Status:** Planned
**Priority:** Medium

Chrome/Firefox extension for seamless URL logging:
- One-click logging to active session
- Automatic tier/category detection
- Relevance scoring suggestions
- Inline notes and highlights

**Implementation:**
```
browser-extension/
├── manifest.json          # Extension manifest
├── background.js          # Background service
├── popup.html             # Extension popup UI
├── popup.js               # Popup logic
├── content.js             # Page content analysis
└── api.js                 # ResearchGravity API client
```

**Expected Features:**
- Detect source tier automatically (arXiv, GitHub, etc.)
- Suggest relevance score based on content
- Keyboard shortcuts for quick logging
- Session status indicator
- Recent URLs list
- Quick notes with highlights

**Integration:**
- POST to `log_url.py` via local API
- Real-time sync with `session_tracker.json`
- Highlight capture to findings

**Target:** v4.2 (Q2 2026)

---

#### Team Collaboration Features
**Status:** Planned
**Priority:** Low

Enable multi-user research collaboration:
- Shared session access

## agent-core

### CONTRIBUTING.md
# Contributing to Agent Core

Thank you for your interest in contributing to **Agent Core** by Metaventions AI!

## Ways to Contribute

### 1. Report Bugs
Use the [Bug Report template](https://github.com/Dicoangelo/agent-core/issues/new?template=bug_report.yml) to report issues.

### 2. Suggest Features
Use the [Feature Request template](https://github.com/Dicoangelo/agent-core/issues/new?template=feature_request.yml) to propose new features.

### 3. Submit Pull Requests

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Ensure code quality (see below)
5. Commit (`git commit -m 'Add amazing feature'`)
6. Push (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/agent-core.git
cd agent-core

# Run setup
chmod +x setup.sh
./setup.sh

# Source aliases
source ~/.zshrc
```

## Code Quality

### Python Scripts

- Follow PEP 8 style guidelines
- Add docstrings to functions
- Keep functions focused and small
- Test locally before submitting:
  ```bash
  python -m py_compile scripts/*.py
  ```

### Bash Scripts

- Validate syntax: `bash -n setup.sh`
- Use shellcheck if available

### Workflows

- Keep SKILL.md up to date with changes
- Use clear, concise language
- Include examples where helpful

## Metaventions Quality Standards

All contributions should align with the Metaventions philosophy:

- **Signal density** — Every addition should move the project forward
- **Compounding potential** — Features should enable future innovation
- **Sovereignty** — User data stays with the user

## Questions?

Contact: dicoangelo@metaventionsai.com

---

*"Let the invention be hidden in your vision"*
**Metaventions AI** — Architected Intelligence

## CareerCoachAntigravity

### CONTRIBUTING.md
# Contributing to Metaventions AI

This system is Architected Intelligence. We welcome contributions that align with our core philosophy:
**Sovereignty, Privacy, Agency.**

### Core Principles
1.  **Your Data, Your Keys:** We never store prompts or data centrally.
2.  **Model Agnostic:** Support for Grok, Claude, Gemini, OpenAI is mandatory.
3.  **Local-First:** Features should work without external dependency (except LLMs) where possible.

### Development Standards
- **Linting:** Ensure `npm run lint` passes (0 errors).
- **Types:** Strict TypeScript usage. No `any` (unless absolutely necessary for legacy boundaries).
- **Architecture:** Follow the established `app/` vs `lib/` separation.

### How to Contribute
1.  Fork the repository.
2.  Create a feature branch (`feat/sovereign-identity`).
3.  Submit a Pull Request with specific evidence of functionality (Receipts).

### Contact
For questions or security concerns, please open a GitHub issue or use the repository's security reporting feature.

## cpb-core

### CONTRIBUTING.md
# Contributing to CPB Core

Thank you for your interest in contributing to Cognitive Precision Bridge!

## Development Setup

```bash
# Clone the repo
git clone https://github.com/Dicoangelo/cpb-core.git
cd cpb-core

# Install dependencies
npm install

# Run in watch mode
npm run dev

# Run tests
npm test

# Type check
npm run typecheck

# Lint
npm run lint
```

## Project Structure

```
src/
├── index.ts        # Main exports
├── types.ts        # TypeScript interfaces
├── router.ts       # Path selection logic
└── orchestrator.ts # Main CPB coordinator
```

## Adding a New Feature

1. **Fork & Branch**: Create a feature branch from `main`
2. **Types First**: Add interfaces to `types.ts`
3. **Implement**: Add logic to appropriate module
4. **Test**: Add tests in `__tests__/`
5. **Document**: Update README if API changes
6. **PR**: Open a pull request with description

## Code Style

- TypeScript strict mode
- Functional style preferred
- Document public APIs with JSDoc
- Keep functions focused and small

## Commit Messages

Follow conventional commits:

```
feat: Add new execution path
fix: Handle edge case in router
docs: Update API reference
test: Add router unit tests
```

## Pull Request Process

1. Ensure tests pass: `npm test`
2. Ensure types check: `npm run typecheck`
3. Ensure lint passes: `npm run lint`
4. Update documentation if needed
5. Request review from maintainers

## Questions?

Open an issue for questions or discussions.

## voice-nexus

### CONTRIBUTING.md
# Contributing to Voice Nexus

Thank you for your interest in contributing to Voice Nexus!

## Development Setup

```bash
# Clone the repo
git clone https://github.com/Dicoangelo/voice-nexus.git
cd voice-nexus

# Install dependencies
npm install

# Run in watch mode
npm run dev

# Run tests
npm test

# Type check
npm run typecheck

# Lint
npm run lint
```

## Project Structure

```
src/
├── index.ts        # Main exports
├── types.ts        # TypeScript interfaces (STT, TTS, Reasoning providers)
├── router.ts       # Complexity analysis and tier selection
└── orchestrator.ts # Voice pipeline coordinator
```

## Adding a Provider Example

Create example providers in `examples/providers/`:

```typescript
// examples/providers/openai-reasoning.ts
import type { ReasoningProvider } from '../../src';

export const openaiReasoning: ReasoningProvider = {
    name: 'openai',
    models: {
        fast: 'gpt-3.5-turbo',
        balanced: 'gpt-4',
        deep: 'gpt-4-turbo'
    },
    isAvailable: () => !!process.env.OPENAI_API_KEY,
    generate: async (prompt, config) => {
        // Implementation
    }
};
```

## Code Style

- TypeScript strict mode
- Provider-agnostic design (no hardcoded services)
- Document public APIs with JSDoc
- Keep the core library dependency-free

## Commit Messages

Follow conventional commits:

```
feat: Add streaming TTS support
fix: Handle audio context lifecycle
docs: Add ElevenLabs provider example
test: Add complexity router tests
```

## Pull Request Process

1. Ensure tests pass: `npm test`
2. Ensure types check: `npm run typecheck`
3. Ensure lint passes: `npm run lint`
4. Update documentation if needed
5. Request review from maintainers

## Provider Guidelines

When adding provider examples:

1. Keep them in `examples/` not `src/`
2. Document required environment variables
3. Handle errors gracefully
4. Support both streaming and non-streaming where applicable

## Questions?

Open an issue for questions or discussions.

## enterprise-deck

### index.html



    
    
    Metaventions AI — Business Pitch
    
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&family=Space+Grotesk:wght@400;500;600;700&display=swap');

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        :root {
            /* Metaventions AI Brand Colors */
            --midnight: #0B1020;
            --obsidian: #05070D;
            --deep-space: #080C18;
            --fog-white: #F5F7FA;
            --cyan: #18E6FF;
            --amethyst: #7B2CFF;
            --magenta: #FF3DF2;
            --gold: #D7B26D;
            --rose: #FF6B8A;
            --teal: #00FFC6;
            --electric-blue: #00D4FF;

            /* Text */
            --text-primary: #FFFFFF;
            --text-secondary: #B8C4D4;
            --text-muted: #5A6A7A;

            /* Gradients */
            --sovereign-spectrum: linear-gradient(135deg, #FF3DF2 0%, #7B2CFF 50%, #18E6FF 100%);
            --gold-spectrum: linear-gradient(135deg, #D7B26D 0%, #F5E6C8 50%, #D7B26D 100%);
            --compute-halo: linear-gradient(135deg, #00FFC6 0%, #18E6FF 50%, #7B2CFF 100%);
            --fire-spectrum: linear-gradient(135deg, #FF3DF2 0%, #FF6B8A 50%, #D7B26D 100%);
            --header-gradient: linear-gradient(90deg, rgba(5,7,13,0.95) 0%, rgba(11,16,32,0.9) 50%, rgba(5,7,13,0.95) 100%);

            /* Glows */
            --glow-cyan: 0 0 40px rgba(24, 230, 255, 0.4);
            --glow-amethyst: 0 0 30px rgba(123, 44, 255, 0.4);
            --glow-magenta: 0 0 30px rgba(255, 61, 242, 0.3);
            --glow-gold: 0 0 25px rgba(215, 178, 109, 0.3);
        }

        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            background: var(--obsidian);
            color: var(--text-primary);
            line-height: 1.6;
            scroll-behavior: smooth;
        }

        /* ═══════════════════════════════════════════════════════════════
           HEADER BAR - Fixed Navigation
           ═══════════════════════════════════════════════════════════════ */
        .header-bar {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            height: 70px;
            background: var(--header-gradient);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border-bottom: 1px solid rgba(24, 230, 255, 0.1);
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 50px;
        }

        .header-left {
            display: flex;
            align-items: center;
            gap: 20px;
        }

        .logo-container {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .logo-icon {
            width: 36px;
            height: 36px;
            background: var(--sovereign-spectrum);
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 900;
            font-size: 18px;
            color: white;
            box-shadow: var(--glow-magenta);
            position: relative;
            overflow: hidden;
        }

        .logo-icon::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent);
            animation: logo-shine 3s ease-in-out infinite;
        }

        @keyframes logo-shine {
            0%, 100% { transform: translateX(-100%) rotate(45deg); }
            50% { transform: translateX(100%) rotate(45deg); }
        }

        .logo-text {
            font-family: 'Space Grotesk', sans-serif;
            font-size: 18px;
            font-weight: 700;
            letter-spacing: 0.5px;
            color: var(--text-primary);
        }

        .logo-text span {
            background: var(--sovereign-spectrum);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .header-badge {
            font-size: 9px;
            color: var(--teal);
            background: rgba(0, 255, 198, 0.1);
            border: 1px solid rgba(0, 255, 198, 0.3);
            padding: 5px 12px;
            border-radius: 20px;
            font-weight: 600;
            letter-spacing: 1.5px;
            text-transform: uppercase;
        }

        .header-center {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .nav-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: rgba(24, 230, 255, 0.2);
            transition: all 0.3s ease;
            cursor: pointer;
        }

        .nav-dot:hover {
            background: rgba(24, 230, 255, 0.5);
            transform: scale(1.3);
        }

        .nav-dot.active {
            background: var(--cyan);
            box-shadow: 0 0 10px var(--cyan);
            transform: scale(1.2);
        }

        .header-right {
            display: flex;
            align-items: center;
            gap: 20px;
        }

        .slide-indicator {
            font-family: 'JetBrains Mono', monospace;
            font-size: 13px;
            color: var(--text-muted);
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .slide-indicator .current {
            color: var(--cyan);
            font-weight: 600;
            font-size: 16px;
        }

        .slide-indicator .total {
            color: var(--text-muted);
        }

        .progress-bar {
            position: fixed;

## sovereign-deck

### index.html



    
    
    Sovereign Cognitive Equity — Metaventions AI
    
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        :root {
            --bg-primary: #0a0610;
            --bg-secondary: #120d1a;
            --bg-tertiary: #1a1228;
            --amethyst: #8B5CF6;
            --amethyst-light: #A78BFA;
            --amethyst-dark: #5B21B6;
            --amethyst-deep: #3B0764;
            --gold: #D4AF37;
            --gold-light: #F5D76E;
            --gold-dark: #B8962E;
            --gold-pale: #E8D5A3;
            --text-primary: #ffffff;
            --text-secondary: #c4b5d8;
            --text-muted: #7c6a8a;
            --gradient-title: linear-gradient(135deg, #D4AF37 0%, #F5D76E 25%, #D4AF37 50%, #A78BFA 100%);
            --gradient-gold: linear-gradient(135deg, #D4AF37 0%, #F5D76E 50%, #D4AF37 100%);
            --glow-amethyst: 0 0 60px rgba(139, 92, 246, 0.4);
            --glow-gold: 0 0 40px rgba(212, 175, 55, 0.35);
            --glass-bg: rgba(18, 13, 26, 0.7);
            --glass-border: rgba(139, 92, 246, 0.2);
            --glass-shine: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%);
        }

        html {
            scroll-behavior: smooth;
            scroll-snap-type: y mandatory;
        }

        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            background: var(--bg-primary);
            color: var(--text-primary);
            line-height: 1.6;
            overflow-x: hidden;
        }

        /* Particle Canvas */
        #particles {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
        }

        /* Progress Bar */
        .progress-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 4px;
            background: rgba(112, 48, 160, 0.2);
            z-index: 1000;
        }

        .progress-bar {
            height: 100%;
            background: linear-gradient(90deg, var(--amethyst), var(--gold), var(--amethyst));
            background-size: 200% 100%;
            animation: shimmer 2s infinite;
            width: 0%;
            transition: width 0.3s ease;
        }

        @keyframes shimmer {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
        }

        /* Navigation Dots */
        .nav-dots {
            position: fixed;
            right: 30px;
            top: 50%;
            transform: translateY(-50%);
            z-index: 1000;
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        .nav-dot {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: rgba(112, 48, 160, 0.3);
            border: 2px solid var(--amethyst);
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
        }

        .nav-dot:hover {
            background: var(--amethyst);
            transform: scale(1.3);
            box-shadow: var(--glow-amethyst);
        }

        .nav-dot.active {
            background: var(--gold);
            border-color: var(--gold);
            box-shadow: var(--glow-gold);
            transform: scale(1.2);
        }

        .nav-dot::before {
            content: attr(data-title);
            position: absolute;
            right: 25px;
            top: 50%;
            transform: translateY(-50%);
            white-space: nowrap;
            font-size: 12px;
            color: var(--text-secondary);
            opacity: 0;
            transition: opacity 0.3s, transform 0.3s;
            pointer-events: none;
            background: var(--bg-secondary);
            padding: 5px 12px;
            border-radius: 4px;
            border: 1px solid var(--amethyst);
        }

        .nav-dot:hover::before {
            opacity: 1;
            transform: translateY(-50%) translateX(-5px);
        }

        /* Glassmorphism Cards */
        .glass-card {
            background: var(--glass-bg);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border: 1px solid var(--glass-border);
            border-radius: 16px;
            position: relative;
            overflow: hidden;
        }

        .glass-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 1px;
            background: linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.5), transparent);
        }

        .glass-card::after {
            content: '';
            position: absolute;
            inset: 0;
            background: var(--glass-shine);
            pointer-events: none;
        }

        /* Crystal Edge Frame */
        .crystal-frame {
            position: relative;
        }

        .crystal-frame::before,
        .crystal-frame::after {
            content: '';
            position: absolute;
            width: 60px;
            height: 60px;
            border: 2px solid var(--gold);
            opacity: 0.6;
        }

        .crystal-frame::before {
            top: -10px;
            left: -10px;
            border-right: none;
            border-bottom: none;
        }

        .crystal-frame::after {
            bottom: -10px;

## metaventions-pitch-deck-2026

### index.html



    
    
    Metaventions AI — Business Pitch
    
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&family=Space+Grotesk:wght@400;500;600;700&display=swap');

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        :root {
            /* Metaventions AI Brand Colors */
            --midnight: #0B1020;
            --obsidian: #05070D;
            --deep-space: #080C18;
            --fog-white: #F5F7FA;
            --cyan: #18E6FF;
            --amethyst: #7B2CFF;
            --magenta: #FF3DF2;
            --gold: #D7B26D;
            --rose: #FF6B8A;
            --teal: #00FFC6;
            --electric-blue: #00D4FF;

            /* Text */
            --text-primary: #FFFFFF;
            --text-secondary: #B8C4D4;
            --text-muted: #5A6A7A;

            /* Gradients */
            --sovereign-spectrum: linear-gradient(135deg, #FF3DF2 0%, #7B2CFF 50%, #18E6FF 100%);
            --gold-spectrum: linear-gradient(135deg, #D7B26D 0%, #F5E6C8 50%, #D7B26D 100%);
            --compute-halo: linear-gradient(135deg, #00FFC6 0%, #18E6FF 50%, #7B2CFF 100%);
            --fire-spectrum: linear-gradient(135deg, #FF3DF2 0%, #FF6B8A 50%, #D7B26D 100%);
            --header-gradient: linear-gradient(90deg, rgba(5,7,13,0.95) 0%, rgba(11,16,32,0.9) 50%, rgba(5,7,13,0.95) 100%);

            /* Glows */
            --glow-cyan: 0 0 40px rgba(24, 230, 255, 0.4);
            --glow-amethyst: 0 0 30px rgba(123, 44, 255, 0.4);
            --glow-magenta: 0 0 30px rgba(255, 61, 242, 0.3);
            --glow-gold: 0 0 25px rgba(215, 178, 109, 0.3);
        }

        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            background: var(--obsidian);
            color: var(--text-primary);
            line-height: 1.6;
            scroll-behavior: smooth;
        }

        /* ═══════════════════════════════════════════════════════════════
           HEADER BAR - Fixed Navigation
           ═══════════════════════════════════════════════════════════════ */
        .header-bar {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            height: 70px;
            background: var(--header-gradient);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border-bottom: 1px solid rgba(24, 230, 255, 0.1);
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 50px;
        }

        .header-left {
            display: flex;
            align-items: center;
            gap: 20px;
        }

        .logo-container {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .logo-icon {
            width: 36px;
            height: 36px;
            background: var(--sovereign-spectrum);
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 900;
            font-size: 18px;
            color: white;
            box-shadow: var(--glow-magenta);
            position: relative;
            overflow: hidden;
        }

        .logo-icon::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent);
            animation: logo-shine 3s ease-in-out infinite;
        }

        @keyframes logo-shine {
            0%, 100% { transform: translateX(-100%) rotate(45deg); }
            50% { transform: translateX(100%) rotate(45deg); }
        }

        .logo-text {
            font-family: 'Space Grotesk', sans-serif;
            font-size: 18px;
            font-weight: 700;
            letter-spacing: 0.5px;
            color: var(--text-primary);
        }

        .logo-text span {
            background: var(--sovereign-spectrum);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .header-badge {
            font-size: 9px;
            color: var(--teal);
            background: rgba(0, 255, 198, 0.1);
            border: 1px solid rgba(0, 255, 198, 0.3);
            padding: 5px 12px;
            border-radius: 20px;
            font-weight: 600;
            letter-spacing: 1.5px;
            text-transform: uppercase;
        }

        .header-center {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .nav-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: rgba(24, 230, 255, 0.2);
            transition: all 0.3s ease;
            cursor: pointer;
        }

        .nav-dot:hover {
            background: rgba(24, 230, 255, 0.5);
            transform: scale(1.3);
        }

        .nav-dot.active {
            background: var(--cyan);
            box-shadow: 0 0 10px var(--cyan);
            transform: scale(1.2);
        }

        .header-right {
            display: flex;
            align-items: center;
            gap: 20px;
        }

        .slide-indicator {
            font-family: 'JetBrains Mono', monospace;
            font-size: 13px;
            color: var(--text-muted);
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .slide-indicator .current {
            color: var(--cyan);
            font-weight: 600;
            font-size: 16px;
        }

        .slide-indicator .total {
            color: var(--text-muted);
        }

        .progress-bar {
            position: fixed;

