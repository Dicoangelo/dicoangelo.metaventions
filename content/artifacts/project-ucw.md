# Project: Universal Cognitive Wallet (UCW)

## Overview

UCW is an MCP server that captures every AI conversation with semantic enrichment across multiple platforms. It sits between the user and AI assistants, intercepting every message and enriching it with three semantic layers: Data (raw facts), Light (meaning and intent), and Instinct (emergence signals and coherence potential). The system enables cross-platform knowledge continuity and cognitive equity — the idea that every AI interaction generates compounding intellectual value.

## GitHub

https://github.com/Dicoangelo/ucw

## Technical Architecture

- **Protocol:** MCP (Model Context Protocol) over STDIO with JSON-RPC 2.0 validation
- **Language:** Python 3.8+
- **Storage:** SQLite (WAL mode) for local capture, PostgreSQL + pgvector for production semantic search
- **Embeddings:** SBERT (sentence-transformers) for local semantic similarity, Cohere for production
- **MCP Tools:** 8 tools — capture stats, timeline, emergence detection, coherence status/moments/search/scan, cross-platform coherence
- **CLI:** Click-based (init, server, status, mcp-config)
- **Transport:** Raw STDIO with nanosecond timestamps and turn tracking
- **Deployment:** LaunchAgent daemon for persistent background capture

## Semantic Enrichment — Three Layers

| Layer | Purpose | Signals |
|-------|---------|---------|
| **Data** | What was said | Method, parameters, token estimates, byte counts |
| **Light** | What it means | Intent classification, topic detection, concept extraction, content summary |
| **Instinct** | What it signals | Coherence potential (0.0-1.0), emergence indicators, gut signal (routine/interesting/breakthrough) |

## Key Metrics

| Metric | Value |
|--------|-------|
| **Knowledge Graph Edges** | 12.15M |
| **Memory Items** | 7,130 |
| **Total Interactions** | 270,000+ |
| **Events Captured** | 163,000+ |
| **Platforms** | 5 (Claude, ChatGPT, Grok, Gemini, NotebookLM) |
| **Tests** | 133 passing |
| **Lint Errors** | 0 |

## Transferable Skills Demonstrated

- **Protocol Engineering:** Custom MCP server implementation with JSON-RPC 2.0, STDIO transport, and zero-latency message passthrough
- **Semantic AI Systems:** Three-layer enrichment pipeline combining intent classification, topic detection, concept extraction, and emergence scoring
- **Cross-Platform Architecture:** Unified capture across 5 distinct AI platforms with coherence signature matching (SHA-256, 5-minute time buckets)
- **Knowledge Graph Design:** 12M+ edge graph with semantic embeddings for similarity search and pattern discovery
- **Data Infrastructure:** PostgreSQL + pgvector for production, SQLite WAL mode for local, with background initialization for zero user-facing latency
- **Developer Experience:** pip-installable package with CLI, auto-configuration, and optional embedding dependencies
