# Project: META-VENGINE

## Overview

META-VENGINE is a bidirectional co-evolution framework that routes AI queries to optimal providers, learns from every session, and self-modifies its own configuration. The system closes the feedback loop between human and AI — telemetry flows up from interactions, the meta-analyzer proposes modifications, and the next session starts measurably better. It supports multi-provider intelligent routing across Ollama, Gemini, Claude, and OpenAI with DQ (Decision Quality) scoring, pattern detection, and autonomous recovery.

## GitHub

https://github.com/Dicoangelo/meta-vengine

## Technical Architecture

- **Languages:** Python 3.8+ / Node.js 18+ / Bash
- **Storage:** SQLite3 + JSONL (append-only telemetry)
- **Dependencies:** Zero external frameworks — vanilla JS + stdlib Python
- **Routing:** DQ Scorer with HSRGS (Homeomorphic Self-Routing Godel System) for emergent routing
- **Learning:** Thompson Sampling bandit engine with 19 learnable parameters, 5% max drift/epoch, automatic rollback on 8% reward drop
- **Providers:** Ollama (local), Gemini 2.0, Claude Opus, OpenAI GPT-4

## Core Systems (9)

| System | Function |
|--------|----------|
| **Meta-Analyzer** | Aggregates telemetry from 6 sources, proposes and applies modifications with human approval |
| **Pattern Detector** | Identifies 8 session types (debugging, research, architecture, etc.) and predicts context needs |
| **DQ Scorer** | Routes queries to optimal models; scores on validity (40%), specificity (30%), correctness (30%) |
| **HSRGS** | Emergent routing system using homeomorphic self-routing; A/B tested against keyword-based DQ |
| **Prefetcher** | Pattern-aware proactive context loading based on temporal prediction and usage habits |
| **Recovery Engine** | 94% error coverage (655/700 historical errors), 70% auto-fix rate, 90% success on attempted fixes |
| **Cognitive OS** | Energy-aware task routing with flow state detection, focus session tracking, and time-of-day optimization |
| **Supermemory** | Unified long-term memory with FTS + embeddings (SQLite-backed) |
| **Observatory** | Complete metrics and analytics with 12-tab Command Center dashboard |

## Key Metrics

| Metric | Value |
|--------|-------|
| **DQ Decisions Scored** | 4,687+ |
| **DQ Average Score** | 0.889 |
| **Error Coverage** | 94% (655/700 historical errors) |
| **Auto-Fix Rate** | 70% without human intervention |
| **Session Types Detected** | 8 |
| **Learnable Parameters** | 19 across 5 groups |
| **Lines of Code** | 51,000+ |
| **Data Authenticity** | 100% real (zero simulated data) |

## DQ Benchmark Results

100-query benchmark (arXiv:2511.15755). 8/8 passed. SUPERMAX multi-agent consensus produced +12.4% DQ improvement and -95.4% variance compared to single-model routing.

## Transferable Skills Demonstrated

- **Self-Improving Systems:** Bidirectional co-evolution loop where the system reads its own telemetry and modifies its own configuration
- **Multi-Provider AI Routing:** Intelligent model selection across 4 providers using Decision Quality scoring with Thompson Sampling weight learning
- **Autonomous Recovery:** Self-healing infrastructure that detects, classifies, and repairs errors with safe-path validation
- **Reinforcement Learning:** Bandit-based parameter optimization with drift clamping, rollback safety, and feature flags
- **Observability Engineering:** 12-tab command center, append-only JSONL telemetry, real data verification, and multi-dimensional metrics
- **Zero-Dependency Architecture:** Entire system built with vanilla JavaScript and stdlib Python — no framework lock-in
