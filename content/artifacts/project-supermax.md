# Project: SUPERMAX Agent Coordination

## Overview

SUPERMAX is a 21-agent team coordination system that operates as a framework within Claude Code for complex multi-part tasks. It uses council-based architecture with specialized councils (technical, strategic, UCW, design), seam classification to identify integration points, attention routing for optimal agent assignment, and a failure taxonomy for structured error recovery. SUPERMAX enables autonomous escalation from single-model routing to multi-agent consensus when task complexity exceeds individual agent capacity.

## Repository

No separate repository — SUPERMAX is a skill and coordination framework embedded within the Claude Code environment, with council implementations in projects like CareerCoachAntigravity and META-VENGINE.

## Technical Architecture

- **Agents:** 21 specialized agents with distinct personas and capability profiles
- **Council System:** Multi-council architecture (technical, strategic, UCW, design) with weighted consensus
- **Routing:** Attention-based routing that matches task profiles to agent capabilities
- **Escalation:** Automatic escalation from single-agent to multi-agent consensus when DQ confidence drops
- **Integration:** Embedded in META-VENGINE DQ scoring pipeline — Wire 23 triggers auto-escalation

## Council Architecture

| Council | Agents | Function |
|---------|--------|----------|
| **Technical** | Principal Engineer, QA Lead, Security Reviewer | Code review, architecture validation, test coverage |
| **Strategic** | Product Strategist, Growth Analyst, Market Researcher | Feature prioritization, market fit, competitive analysis |
| **UCW** | Coherence Analyst, Pattern Detector, Emergence Scout | Knowledge graph integrity, cross-platform coherence |
| **Design** | UX Architect, Visual Designer, Accessibility Auditor | Interface design, design system compliance, a11y |

## Core Mechanisms

| Mechanism | Description |
|-----------|-------------|
| **Seam Classification** | Identifies integration boundaries between components for targeted multi-agent review |
| **Attention Routing** | Weighted agent selection based on task type, agent trust scores, and historical performance |
| **Failure Taxonomy** | Structured classification of failures (type, severity, recovery path) for systematic error handling |
| **Consensus Protocol** | Weighted voting across council members with conflict resolution and minority opinion preservation |
| **Frontier Operations** | Framework for tasks at the edge of known capability — pioneer mode with adjusted quality thresholds |

## Key Metrics

| Metric | Value |
|--------|-------|
| **Total Agents** | 21 |
| **DQ Improvement** | +12.4% vs single-model |
| **Variance Reduction** | -95.4% vs single-model |
| **Benchmark Result** | 8/8 passed (100-query benchmark, arXiv:2511.15755) |

## Deployments

SUPERMAX council implementations are active in:
- **CareerCoachAntigravity** — 3-agent review council (Principal Engineer, Product Strategist, QA Lead) with append-only JSONL review logging
- **META-VENGINE** — Wire 23 auto-escalation triggers SUPERMAX consensus when single-model DQ drops below threshold
- **Paper to Production** — DQ benchmark validation using SUPERMAX consensus scoring

## Transferable Skills Demonstrated

- **Multi-Agent Orchestration:** 21-agent coordination with council-based consensus, weighted voting, and conflict resolution
- **Intelligent Task Routing:** Capability-weighted agent selection with trust scoring and automatic escalation
- **System Reliability:** Failure taxonomy with structured recovery paths, -95.4% variance reduction through consensus
- **Framework Design:** Reusable council architecture deployed across multiple projects without code duplication
- **Autonomous Operations:** Self-escalating system that detects when single-agent capacity is insufficient and assembles appropriate council
