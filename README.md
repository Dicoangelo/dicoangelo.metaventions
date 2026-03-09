# dicoangelo.metaventions

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge)](https://www.typescriptlang.org/)
[![Tailwind](https://img.shields.io/badge/Tailwind-4-38bdf8?style=for-the-badge)](https://tailwindcss.com/)

> **Personal portfolio and production AI showcase — built with AI orchestration, zero lines manually written.**

**Live**: [dicoangelo.metaventionsai.com](https://dicoangelo.metaventionsai.com) | **GitHub**: [@Dicoangelo](https://github.com/Dicoangelo)

---

## What This Is

A portfolio site that doubles as a technical proof: every line was written by AI agents (Claude Code), orchestrated via the [meta-vengine](https://github.com/Dicoangelo/meta-vengine) routing engine. It showcases enterprise operations experience ($800M+ TCV) alongside production AI systems built from scratch.

### Key Pages

| Route | What It Does |
|-------|-------------|
| `/` | Main portfolio — hero, AI chat, resume, timeline, skills, projects, Frontier Ops score, contact |
| `/showcase` | Production AI Showcase — 20 architecture screenshots across 5 systems with presentation mode |
| `/analyze` | JD Fit Analyzer — AI-powered resume-to-job-description scoring |
| `/see-more` | Extended project details |

---

## Features

### Portfolio (`/`)
- **AI Chat** — Claude-powered conversational interface about my background
- **JD Fit Analyzer** — paste a job description, get AI-scored fit analysis
- **Frontier Ops Score** — 5-dimension radar chart scoring operational AI capability
- **Command Palette** — `Cmd+K` for power-user navigation
- **Section Side Nav** — dot-style scroll position indicator
- **Career Timeline** — interactive professional journey
- **Theme Toggle** — light/dark with persistent preference
- **Keyboard Shortcuts** — press `?` for help
- **GSAP Animations** — scroll reveals, stagger grids, parallax

### Production AI Showcase (`/showcase`)
- **20 screenshots** across Antigravity OS, ResearchGravity, UCW Dashboard, Command Center, Metaventions AI
- **Search & filter** — by category (Monitoring, Orchestration, AI/ML, etc.) and system
- **Presentation Mode** — full walkthrough with talking points sidebar, keyboard nav, auto-advance
- **Lightbox** — full-screen viewer with crossfade transitions
- **Evidence sections** — Anomaly Stats (16 metrics), Live Sites (4), GitHub Repos (20), Certifications (13), Docker projects (4)
- **Tech Stack Ribbon** — 15 technology chips

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| UI | React 19 |
| Language | TypeScript 5 (strict) |
| Styling | Tailwind CSS 4 |
| Animations | GSAP + ScrollTrigger |
| AI | Anthropic Claude API |
| Database | Supabase (PostgreSQL) |
| Rate Limiting | Upstash Redis |
| Error Tracking | Sentry |
| Hosting | Vercel |
| Domain | dicoangelo.metaventionsai.com |

---

## Project Structure

```
dicoangelo.metaventions/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Main portfolio page
│   │   ├── showcase/             # Production AI Showcase (11 files, 2,292 lines)
│   │   │   ├── page.tsx          # Showcase page scaffold
│   │   │   ├── data.ts           # 20 items, stats, repos, certs, Docker
│   │   │   ├── ShowcaseGallery.tsx
│   │   │   ├── PresentationMode.tsx
│   │   │   ├── Lightbox.tsx
│   │   │   ├── AnomalyStats.tsx
│   │   │   ├── GitHubRepos.tsx
│   │   │   ├── LiveSites.tsx
│   │   │   ├── Certifications.tsx
│   │   │   ├── DockerEvidence.tsx
│   │   │   └── TechStackRibbon.tsx
│   │   ├── analyze/              # JD Fit Analyzer
│   │   ├── frontier-ops/         # Frontier Ops interactive
│   │   ├── see-more/             # Extended projects
│   │   └── api/                  # API routes (chat, analyze-jd, contact, tts)
│   ├── components/               # 59 UI components
│   │   ├── sections/             # 10 page sections
│   │   ├── Nav.tsx               # Adaptive nav (scroll-aware, Next.js Link)
│   │   ├── Footer.tsx            # Footer with quick links
│   │   ├── CommandPalette.tsx    # Cmd+K navigation
│   │   ├── SectionNav.tsx        # Dot-style side navigation
│   │   └── ThemeProvider.tsx     # Light/dark theme
│   ├── hooks/                    # 14 custom hooks
│   └── lib/                      # Utilities, schemas, AI config
├── public/
│   └── showcase/                 # 20 screenshot assets
├── tests/
│   └── e2e/                      # Playwright E2E tests
├── scripts/                      # Repo data generation
└── next.config.ts
```

---

## Development

```bash
# Install
git clone https://github.com/Dicoangelo/dicoangelo.metaventions.git
cd dicoangelo.metaventions
npm install

# Environment
cp .env.example .env.local
# Configure: ANTHROPIC_API_KEY, SUPABASE_URL, UPSTASH_REDIS_*

# Run
npm run dev          # Dev server (localhost:3000)
npm run build        # Production build
npm run lint         # ESLint
npm test             # Vitest
npm run test:e2e     # Playwright
```

---

## Security

- **Rate Limiting** — Upstash Redis (10 req/min chat, 5 req/min analyzer)
- **Input Validation** — Zod schemas on all API inputs
- **Security Headers** — CSP, HSTS, X-Frame-Options, X-Content-Type-Options
- **Error Tracking** — Sentry with PII filtering
- **Type Safety** — TypeScript strict mode

---

## Live Sites (by the same author)

| Site | Stack | What It Is |
|------|-------|-----------|
| [dicoangelo.metaventionsai.com](https://dicoangelo.metaventionsai.com) | Next.js 16 / React 19 | This portfolio |
| [app.metaventionsai.com](https://app.metaventionsai.com) | React 19 / Gemini 2.0 | Sovereign AI OS (33K LOC) |
| [metaventionsai.com](https://metaventionsai.com) | Web | Metaventions AI landing |
| [thesignatureevent.metaventionsai.com](https://thesignatureevent.metaventionsai.com) | Next.js 16 | Client project delivery |

---

## Contact

**Dico Angelo** — Operations Leader & AI Systems Builder

- [LinkedIn](https://www.linkedin.com/in/dico-angelo/)
- [GitHub](https://github.com/Dicoangelo)
- [npm](https://www.npmjs.com/org/metaventionsai)

---

<div align="center">

**0 lines manually written — built with AI orchestration**

[![Portfolio](https://img.shields.io/badge/Portfolio-dicoangelo.metaventionsai.com-6366f1?style=for-the-badge)](https://dicoangelo.metaventionsai.com)
[![GitHub](https://img.shields.io/badge/GitHub-Dicoangelo-black?style=for-the-badge)](https://github.com/Dicoangelo)

</div>
