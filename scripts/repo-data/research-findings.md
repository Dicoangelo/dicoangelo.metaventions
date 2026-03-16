# ResearchGravity - Technical Research & Development Data

Generated: Mon 16 Mar 2026

This file contains research findings, innovations, and development patterns from Dico Angelo's ResearchGravity system -- a comprehensive research tracking framework.

## About ResearchGravity

ResearchGravity is a custom-built research session tracking framework with:
- **Storage Triad**: SQLite + Qdrant vectors + Supabase sync
- **Cohere Embeddings**: embed-english-v3.0 (1024 dimensions)
- **Semantic Search**: Full-text + vector similarity + reranking
- **Auto-Capture**: Automatic session tracking and lineage
- **MCP Server**: 37 tools exposed via Model Context Protocol
- **Multi-Platform Capture**: Claude Code, ChatGPT, Cursor, Grok, Command Center
- **Knowledge Graph**: Concept graph, lineage tracking, persona generation, ontology construction
- **Webhook System**: GitHub, Slack, generic handlers with security and audit
- **MiroFish Integration**: Temporal graph, ReACT synthesis, ontology, personas, oracle (latest)

**Current Stats**:
- 138+ session archives in ~/.agent-core/
- 120+ commits in ResearchGravity repo
- 15+ modules across capture, graph, coherence, delegation, webhook, critic, methods
- Context packs system with 7-layer semantic selection

---

## Research Index (from ~/.agent-core/)

### Data Infrastructure
- `context-packs/` -- Semantic context packs with domain, pattern, project, paper registries
- `oracle/` -- Oracle system (people, productions, streams, human-in-loop targets)
- `research/` -- Research references and proposals
- `memory/` -- Long-term memory store
- `career/` -- Career intelligence data
- `brand/` -- Brand assets and guidelines
- `case-studies/` -- Case study materials
- `guardian/` -- Guardian safety system
- `precision/` -- Precision metrics
- `principles/` -- Operating principles
- `playbooks/` -- Operational playbooks
- `schemas/` -- Data schemas
- `config/` -- Configuration registry
- `qdrant_storage/` -- Vector storage

### Key Documents
- `INVENTION.md`, `INVENTION_v2.md`, `INVENTION_FINAL.md` -- Invention documentation
- `100M_SPRINT.md` -- Strategic sprint plan
- `INTEGRATION_STATUS.md` -- System integration tracking

---

## Key Research Areas

### Multi-Agent Systems
- Adaptive Consensus Engine (ACE) -- 6-agent autonomous analysis
- DQ Scoring (Deliberation Quality) -- validity + specificity + correctness
- Voting vs debate consensus mechanisms
- Heterogeneous agent specialization
- Agent auction mechanisms
- Multi-agent coordinator with 4 strategies (parallel research, parallel implement, review build, full orchestration)
- Supermax coordination mode
- Conflict resolution and work distribution

### Cognitive Computing
- Cognitive Precision Bridge (CPB) -- precision-aware AI routing
- Recursive Language Modeling (RLM) -- infinite context windows
- Energy-aware task routing (Cognitive OS)
- Flow state detection and optimization
- Bayesian optimization for routing parameters
- LRF (Learning Rate Factor) clustering
- Behavioral outcome tracking

### Voice & Multimodal AI
- Voice Nexus -- universal multi-provider voice architecture
- Real-time STT/TTS with Deepgram and ElevenLabs
- Complexity-based provider selection
- Turn-based and continuous modes
- Knowledge injection into voice pipeline

### Systems Architecture
- Session optimization and window management
- Error pattern recognition and self-healing (94% coverage, 70% auto-fix)
- Context pack selection with semantic embeddings (7-layer system)
- Research lineage tracking and provenance
- Dual-write persistence (SQLite + JSONL)
- MCP protocol integration across multiple tools

### Biometric & Adaptive UI
- Face detection and stress sensing
- Gaze tracking and fixation analysis
- Adaptive UI complexity levels
- Semantic gaze for UI intelligence
- DOM regeneration and component registry

### Knowledge Management
- Temporal knowledge graph (MiroFish integration)
- Concept graph with lineage tracking
- Persona generation and ontology construction
- ReACT synthesis agent
- Oracle system for strategic intelligence
- Coherence engine for cross-session tracking

### Financial Intelligence
- Cognitive Factor Intelligence (frontier-alpha)
- CVRF (Cognitive Value Risk Framework) belief-wired portfolio optimization
- Black-Litterman inspired belief integration
- GPU pricing, mining stats, power analysis

---

## Development Tool Proficiency

Tool usage patterns from 138+ development sessions:

| Tool | Category | Usage Level |
|------|----------|-------------|
| Bash | Execution | Primary |
| Read | File Access | Primary |
| Edit | File Modification | Primary |
| Write | File Creation | High |
| WebSearch | Research | High |
| Glob | File Discovery | High |
| Grep | Code Search | High |
| WebFetch | Data Retrieval | High |
| Chrome DevTools | UI Testing | Medium |
| Task | Background Work | Medium |

---

## Project Development Tracking

### OS-App
- **Type**: vite (React 19 + Vite)
- **Status**: active
- **Commits**: ~589
- **Stack**: React 19, Vite, Zustand 5, TypeScript, Three.js, Framer Motion
- **Focus**: agentic-os, biometric-ui, multi-agent-orchestration, voice-native

### CareerCoachAntigravity
- **Type**: nextjs (Next.js 15)
- **Status**: active
- **Commits**: ~192
- **Stack**: Next.js 15, React 18, Zustand, TypeScript, Sentry, Supabase
- **Focus**: career-intelligence, ai-agents, resume-builder, skill-graphs

### ResearchGravity
- **Type**: python
- **Status**: active
- **Commits**: ~120
- **Stack**: Python, SQLite, Qdrant, Supabase, Cohere, MCP
- **Focus**: research-tracking, auto-capture, knowledge-graph, webhook-system

### frontier-alpha
- **Type**: typescript
- **Status**: active
- **Commits**: ~135
- **Stack**: TypeScript, CVRF, Black-Litterman
- **Focus**: portfolio-optimization, factor-intelligence, episodic-learning

### FriendlyFace
- **Type**: python
- **Status**: active (newest, Mar 2026)
- **Commits**: ~90
- **Stack**: Python, AI Facial Recognition, Blockchain Forensic
- **Focus**: forensic-evidence, compliance-proxy, patent-pending

### meta-vengine
- **Type**: python
- **Status**: active
- **Commits**: ~99
- **Stack**: Python, Shell, SQLite, Bayesian Optimization
- **Focus**: ai-routing, self-healing, multi-agent-coordination

### UCW (Universal Cognitive Wallet)
- **Type**: python
- **Status**: active
- **Commits**: ~13
- **Stack**: Python, SQLite, MCP, Embeddings
- **Focus**: session-capture, cognitive-wallet, cross-platform

### PageIndex
- **Type**: python
- **Status**: active
- **Commits**: ~235
- **Stack**: Python, Multi-model LLM
- **Focus**: document-indexing, vectorless-rag, reasoning-based

---

## Innovation Highlights

1. **Universal Cognitive Wallet (UCW)** -- Cross-platform AI session capture. Every interaction creates cognitive equity.
2. **Cognitive Precision Bridge (CPB)** -- Precision-aware routing with DQ scoring. Published as @metaventionsai/cpb-core.
3. **MiroFish Integration** -- Temporal knowledge graph + ReACT synthesis ported into ResearchGravity.
4. **Archon Agent** -- Self-maintaining autonomous agent with event bus and state machine.
5. **Organism Layers** -- Bio-inspired architecture: Cognitive, Genome, Organism, Swarm layers.
6. **Recovery Engine** -- Self-healing infrastructure: 94% error coverage, 70% auto-fix rate, <5s recovery.
7. **Voice Nexus** -- Universal voice routing across STT/reasoning/TTS providers with complexity-based selection.
8. **FriendlyFace ForensicSeal** -- Forensic evidence generation system for AI facial recognition.
9. **CVRF** -- Cognitive Value Risk Framework for belief-wired portfolio optimization.
10. **Context Packs V2** -- 7-layer semantic system for intelligent context selection.
