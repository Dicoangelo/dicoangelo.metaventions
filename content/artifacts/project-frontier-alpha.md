# Project: Frontier Alpha

## Overview

Frontier Alpha is a cognitive factor intelligence platform that provides institutional-grade portfolio optimization with explainable AI recommendations. The system analyzes 80+ quantitative factors across 6 categories, learns from every investment episode through a self-improving CVRF (Cognitive Value-Relevance Framework) belief system, and explains every decision in plain language using GPT-4o and template-based dual-mode explanation.

## GitHub

https://github.com/Dicoangelo/frontier-alpha

## Live URL

https://frontier-alpha.metaventionsai.com

## Technical Architecture

- **Frontend:** React 19, TypeScript 5.3, Vite 7, Zustand + React Query state management, Recharts + D3 visualizations
- **Backend:** Fastify 4, Node.js 20, 29+ API endpoints, 67 API routes
- **Database:** Supabase PostgreSQL with Row Level Security, 6+ migrations
- **Market Data:** Polygon.io (WebSocket streaming for real-time quotes), Alpha Vantage (fundamentals + Ken French Library)
- **AI:** GPT-4o cognitive explainer with confidence scores and source attribution
- **Trading:** Alpaca broker adapter (paper + live), order management, position tracking
- **Deployment:** Vercel (production), Docker, Railway, Render

## Core Subsystems (22)

| Subsystem | Description |
|-----------|-------------|
| **Factor Engine** | 80+ factors across 6 categories (momentum, value, quality, volatility, size, sentiment) |
| **CVRF Intelligence** | Self-improving belief system with conviction tracking and episode learning |
| **Cognitive Explainer** | GPT-4o + template dual-mode with confidence scores |
| **Portfolio Optimizer** | Monte Carlo simulation — max Sharpe, min variance, risk parity, CVRF-weighted |
| **Walk-Forward Backtest** | CVRF integration, historical data loading, episode replay |
| **Earnings Oracle** | Calendar, consensus estimates, beat rates, expected moves |
| **Risk Alert System** | 11 alert types with real-time monitoring |
| **Options Engine** | Implied volatility surface, Greeks calculation, strategy builder |
| **ML Engine** | Regime detection, factor attribution, neural models |
| **Tax Optimization** | Lot tracking, loss harvesting, wash sale detection |
| **SEC Monitoring** | Edgar filings, real-time filing alerts |

## Key Metrics

| Metric | Value |
|--------|-------|
| **Quantitative Factors** | 80+ |
| **API Endpoints** | 29+ |
| **Tests** | 205 |
| **Lines of Code** | 62,000+ |
| **Files** | 242+ |
| **Modules** | 75+ |
| **Alert Types** | 11 |
| **Subsystems** | 22 |

## Transferable Skills Demonstrated

- **Quantitative Finance:** 80+ factor analysis beyond Fama-French 5, Monte Carlo optimization, walk-forward backtesting with regime detection
- **Real-Time Systems:** WebSocket streaming from Polygon.io, server-sent events for push alerts, real-time portfolio monitoring
- **Explainable AI:** Dual-mode explanation system (LLM + template) with confidence scoring and source attribution
- **Self-Improving ML:** CVRF belief system that learns from investment episodes, reinforces correct beliefs, and weakens incorrect ones
- **Full-Stack Platform Engineering:** 22 modular subsystems with pluggable implementations, 6 database migrations, and multi-platform deployment
- **Financial Compliance:** Tax lot tracking, wash sale detection, SEC filing monitoring, and row-level security for multi-tenant data isolation
