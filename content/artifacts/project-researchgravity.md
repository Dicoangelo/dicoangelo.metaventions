# Project: ResearchGravity

## Overview

ResearchGravity is a Python-based research intelligence framework that tracks, indexes, and synthesizes AI research sessions. It provides an MCP server with 21+ tools, a FastAPI-based API, semantic search via Cohere embeddings and Qdrant, a temporal knowledge graph (MiroFish integration), and a ReACT synthesis agent. The system auto-captures research findings from Claude sessions, maintains source lineage, and enables cross-session intelligence through pattern detection and predictive analytics.

## GitHub

https://github.com/Dicoangelo/ResearchGravity

## Technical Architecture

- **Framework:** FastAPI server on port 3847 (API v2.1.0)
- **Language:** Python 3.8+
- **Vector Search:** Qdrant (primary) + sqlite-vec (fallback) + FTS (always available)
- **Embeddings:** Cohere embed-v4.0 (Matryoshka 256-1536d) with v3 and SBERT offline fallback
- **Reranking:** Cohere rerank-v3.5 with hybrid BM25+cosine
- **Storage:** SQLite with semaphore-guarded connection pool and WAL mode
- **Security:** JWT authentication, API key support, slowapi rate limiting, input sanitization
- **Reliability:** Dead-letter queue with exponential backoff, async Cohere calls, dual-write engine
- **MCP Tools:** 21+ tools including delegation, coherence analysis, and research capture
- **Delegation System:** Intelligent task delegation with Bayesian trust scoring (arXiv:2602.11865), contract-first decomposition, 4Ds gates, and escalation chains
- **Cognitive Precision Bridge:** 7-agent cascade with ground truth validation, pioneer mode, and deep research (Gemini/Perplexity)
- **Critics:** 3 writer-critic agents (archive, evidence, pack validation)

## Key Metrics

| Metric | Value |
|--------|-------|
| **Archived Sessions** | 114+ |
| **Findings/Embeddings** | 2,530+ |
| **URLs Tracked** | 8,935+ |
| **Tokens Processed** | 27M+ |
| **Graph Nodes** | 11,579 |
| **API Endpoints** | 25 |
| **Error Prevention** | 87% |
| **Version** | 6.1.0 |

## Core Capabilities

| Capability | Description |
|------------|-------------|
| **Auto-Capture V2** | Automatic URL and finding extraction from Claude sessions (+70% capture rate) |
| **Interactive REPL** | Rich terminal UI for real-time research with semantic search and quality predictions |
| **Intelligence Layer** | Session quality prediction, optimal work-time detection, error prevention, pattern analysis |
| **File Watcher** | Implicit session creation from Claude activity (daemon mode) |
| **Context Packs V2** | 7-layer semantic system for intelligent context selection and injection |
| **Intelligent Delegation** | Bayesian trust-scored task routing with 4Ds gates and escalation chains |

## Transferable Skills Demonstrated

- **RAG Pipeline Engineering:** Production semantic search with Cohere embeddings, Qdrant vectors, hybrid BM25+cosine retrieval, and reranking
- **API Security:** JWT authentication, rate limiting, input validation, dead-letter queues for reliability
- **Knowledge Graph Systems:** 11K+ node temporal graph with MiroFish integration for cross-session pattern discovery
- **Multi-Agent Orchestration:** 7-agent Cognitive Precision Bridge, 3-critic validation, and delegation framework with Bayesian trust scoring
- **Research Methodology:** Tiered source hierarchy (arXiv, HuggingFace, industry), lineage tracking, and structured synthesis workflows
- **Developer Tooling:** Interactive REPL, CLI tools, auto-capture daemon, and MCP server integration
