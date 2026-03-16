# Project: CareerCoachAntigravity

## Overview

CareerCoachAntigravity is a sovereign career intelligence system built on Next.js 16. It goes beyond job boards by providing multi-agent hiring panel simulation, AI-powered resume optimization with narrative switching, skill graph analysis with demand gravity and growth velocity, and interview preparation with scoring and feedback. The system integrates ResearchGravity for career research signals and uses a SUPERMAX council for code and strategy review.

## GitHub

https://github.com/Dicoangelo/CareerCoachAntigravity

## Live URL

https://careers.metaventionsai.com

## Technical Architecture

- **Framework:** Next.js 16, React 19, TypeScript 5.0 (strict mode, zero `any` types)
- **AI Models:** Claude (core), Grok (tech analysis), Gemini (synthesis), GPT-4o (HR persona)
- **Database:** Supabase PostgreSQL with Row Level Security migrations
- **Authentication:** NextAuth.js v5 with GitHub, Google, and credentials providers
- **Caching:** Upstash Redis (production), in-memory with TTL/LRU (development)
- **Rate Limiting:** Redis-backed with per-endpoint limits
- **Validation:** Zod schemas across all API routes
- **Logging:** Pino structured logging + Sentry error tracking
- **Testing:** Vitest with 1,801 tests across 47 files
- **Linting:** ESLint 9 flat config, 0 errors/warnings

## Core Engines

| Engine | Description |
|--------|-------------|
| **Multi-Agent Hiring Committee** | 3-agent panel (Hiring Manager, Tech Lead via Grok, HR Partner) with weighted consensus scoring |
| **Chameleon Engine v2** | Context-aware narrative switching across 4 archetypes: Speed, Safety, Creative, Ecosystem |
| **Skill Graph Navigator** | GNN-style skill mapping with gravity (demand) and velocity (growth) metrics |
| **Nexus Engine** | Background data weaving — crystallizes profile, skills, and market gaps into strategic assets |
| **Interview Prep** | Question generation, answer scoring, and multi-model AI feedback system |
| **Coherence Engine** | Pattern detection for skill-demand shifts, tech convergence, and gap clusters |
| **SUPERMAX Council** | 3-agent review council (Principal Engineer, Product Strategist, QA Lead) |
| **Autonomous Pipeline** | Loop controller with dependency resolution and human pause detection |
| **Research Signals** | Career intelligence with freshness indicators and citations from ResearchGravity |

## API Endpoints (v1)

Versioned at `/api/v1/` with backwards-compatible legacy routes. Key endpoints include chat, resume builder, nexus scoring, skill graph, interview prep evaluation, hiring committee review, research search, coherence detection, HSRGS routing visualization, pipeline control, and council review.

## Key Metrics

| Metric | Value |
|--------|-------|
| **Tests** | 1,801 passing |
| **Test Files** | 47 |
| **Type Errors** | 0 (strict mode) |
| **Lint Issues** | 0 |
| **Version** | 2.3.0 |
| **AI Models Used** | 4 (Claude, Grok, Gemini, GPT-4o) |
| **Agent Archetypes** | 4 (Speed, Safety, Creative, Ecosystem) |

## Transferable Skills Demonstrated

- **Multi-Agent System Design:** Hiring committee simulation with model-specific personas (Claude for strategy, Grok for technical depth, GPT-4o for culture) and weighted consensus
- **Career Domain Engineering:** Skill graph with demand gravity and growth velocity, resume narrative switching across 4 archetypes, and market gap detection
- **Production Next.js:** Next.js 16 with App Router, API versioning, Supabase RLS, Redis rate limiting, and Sentry error tracking
- **Test-Driven Development:** 1,801 tests across unit, integration, and E2E suites with 60%+ code coverage
- **Type Safety at Scale:** Zero `any` types, full TypeScript strict mode, Zod validation on all API routes
- **Cross-System Integration:** ResearchGravity MCP client for career research signals, META-VENGINE DQ score visualization, and SUPERMAX council for automated review
