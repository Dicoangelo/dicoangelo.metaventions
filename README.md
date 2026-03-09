<img src="https://capsule-render.vercel.app/api?type=waving&height=250&color=0:0d1117,50:1e1b4b,100:4f46e5&text=DICO%20ANGELO&fontSize=60&fontColor=ffffff&animation=fadeIn&fontAlignY=35&desc=Operations%20Leader%20%E2%80%A2%20AI%20Systems%20Builder%20%E2%80%A2%20Partner-Builder&descSize=16&descAlignY=55&descAlign=50" width="100%" alt="Dico Angelo"/>

<div align="center">

<img src="https://readme-typing-svg.demolab.com?font=Inter&weight=600&size=20&duration=3000&pause=1000&color=6366F1&center=true&vCenter=true&multiline=false&repeat=true&width=700&height=40&lines=%24800M%2B+TCV+%E2%80%A2+32K+Lines+TypeScript+%E2%80%A2+20+Production+Systems+%E2%80%A2+Zero+Manual+Code" alt="Typing SVG" />

<br/>

[![Live Site](https://img.shields.io/badge/Live-dicoangelo.metaventionsai.com-6366f1?style=for-the-badge&labelColor=0d1117)](https://dicoangelo.metaventionsai.com)
[![Showcase](https://img.shields.io/badge/Showcase-20_Screenshots-6366f1?style=for-the-badge&labelColor=0d1117)](https://dicoangelo.metaventionsai.com/showcase)
[![GitHub](https://img.shields.io/badge/GitHub-30_Repos-6366f1?style=for-the-badge&logo=github&labelColor=0d1117)](https://github.com/Dicoangelo)

<br/>

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind](https://img.shields.io/badge/Tailwind-4-38bdf8?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-black?style=flat-square&logo=vercel)](https://vercel.com)

</div>

<img src="https://user-images.githubusercontent.com/74038190/212284100-561aa473-3905-4a80-b561-0d28506553ee.gif" width="100%"/>

## The Proof

This isn't a portfolio template. Every line of the **32,129 lines of TypeScript** was written by AI agents orchestrated through [meta-vengine](https://github.com/Dicoangelo/meta-vengine) — a self-improving routing engine that scores decisions, learns from sessions, and evolves its own configuration.

The site itself is evidence of the systems it describes.

<div align="center">

| Metric | Value |
|:-------|------:|
| **Lines of Code** | 32,129 |
| **Components** | 59 |
| **Custom Hooks** | 14 |
| **API Routes** | 8 |
| **Commits** | 188 |
| **Dependencies** | 19 |
| **Manual Lines Written** | 0 |

</div>

<img src="https://user-images.githubusercontent.com/74038190/212284115-f47cd8ff-2ffb-4b04-b5bf-4d1c14c0247f.gif" width="100%"/>

## Architecture

<div align="center">

```mermaid
%%{init: {'theme': 'dark', 'themeVariables': { 'primaryColor': '#6366f1', 'primaryTextColor': '#fff', 'primaryBorderColor': '#6366f1', 'lineColor': '#6366f1', 'secondaryColor': '#1e1b4b', 'tertiaryColor': '#0d1117'}}}%%
flowchart TB
    subgraph PAGES["Pages"]
        HOME["/ Portfolio\n━━━━━━━━━━\nHero • AI Chat • Resume\nTimeline • Skills • Projects\nFrontier Ops • Contact"]
        SHOWCASE["/showcase\n━━━━━━━━━━\n20 Screenshots\nPresentation Mode\nEvidence Grid"]
        ANALYZE["/analyze\n━━━━━━━━━━\nJD Fit Analyzer\nAI Scoring"]
    end

    subgraph INFRA["Infrastructure"]
        direction LR
        API["8 API Routes\n━━━━━━━━━━\nchat • analyze-jd\ncontact • tts\nadmin • artifacts"]
        AI["Claude API\n━━━━━━━━━━\nStreaming\nRAG Context"]
        DB["Supabase\n━━━━━━━━━━\nPostgreSQL\nVector Search"]
    end

    subgraph QUALITY["Quality"]
        direction LR
        SEC["Security\n━━━━━━━━━━\nRate Limiting\nCSP • HSTS\nZod Validation"]
        MONITOR["Monitoring\n━━━━━━━━━━\nSentry\nWeb Vitals\nOG Images"]
    end

    HOME --> API
    SHOWCASE --> API
    ANALYZE --> API
    API --> AI
    API --> DB
    API --> SEC
    API --> MONITOR
```

</div>

<img src="https://user-images.githubusercontent.com/74038190/212284100-561aa473-3905-4a80-b561-0d28506553ee.gif" width="100%"/>

## Pages

### `/` — Portfolio

The main page is a single-page application with 10 sections, adaptive scroll-aware navigation, and a command palette (`Cmd+K`).

| Feature | What It Does |
|---------|-------------|
| **AI Chat** | Claude-powered Q&A about my background — streaming responses, RAG context from 700+ indexed chunks |
| **JD Fit Analyzer** | Paste a job description, get AI-scored fit analysis with gap identification |
| **Frontier Ops Score** | 5-dimension radar chart — Agentic Fluency, Failure Modeling, Seam Design, Attention Calibration, Evolution Rate |
| **Command Palette** | `Cmd+K` navigation with search, theme toggle, section jumps |
| **Career Timeline** | Interactive professional journey with expandable details |
| **Keyboard Shortcuts** | Press `?` for full shortcut reference |
| **Theme Toggle** | Light/dark with persistent preference and smooth transitions |
| **GSAP Animations** | Scroll reveals, stagger grids, parallax — respects `prefers-reduced-motion` |

### `/showcase` — Production AI Showcase

A visual gallery proving that the AI systems described on the portfolio actually exist and work.

| Feature | What It Does |
|---------|-------------|
| **20 Screenshots** | Across 5 systems — Antigravity OS (13), ResearchGravity (2), UCW Dashboard (3), Command Center (1), Metaventions AI (1) |
| **Presentation Mode** | Full walkthrough with talking points sidebar, keyboard nav (←→), auto-advance timer, ALL/HIGHLIGHTS playlist |
| **Search & Filter** | Real-time search with category filters (Monitoring, Orchestration, AI/ML, RAG, Cloud) |
| **Lightbox** | Full-screen viewer with crossfade transitions and body scroll lock |
| **Evidence Grid** | 16 Anomaly Stats, 4 Live Sites, 20 GitHub Repos, 13 Certifications, 4 Docker projects |

<img src="https://user-images.githubusercontent.com/74038190/212284115-f47cd8ff-2ffb-4b04-b5bf-4d1c14c0247f.gif" width="100%"/>

## Tech Stack

<div align="center">

| Layer | Technology | Why |
|:------|:-----------|:----|
| **Framework** | Next.js 16 (App Router) | Server components, streaming, edge runtime |
| **UI** | React 19 | Concurrent features, use() hook |
| **Language** | TypeScript 5 (strict) | Zero `any` tolerance |
| **Styling** | Tailwind CSS 4 | CSS variables, `data-theme` attribute |
| **Animations** | GSAP + ScrollTrigger | GPU-accelerated, scroll-driven |
| **3D** | Three.js + React Three Fiber | Systems network visualization |
| **AI** | Anthropic Claude API | Streaming chat, JD analysis |
| **Database** | Supabase (PostgreSQL) | Vector search, real-time |
| **Rate Limiting** | Upstash Redis | Sliding window per IP |
| **Voice** | Deepgram | Speech-to-text |
| **Validation** | Zod | Schema-first API contracts |
| **Error Tracking** | Sentry | Source maps, PII filtering |
| **Hosting** | Vercel | Edge network, auto-deploy |

</div>

## Project Structure

```
dicoangelo.metaventions/
├── src/
│   ├── app/
│   │   ├── page.tsx                # Main portfolio (10 sections)
│   │   ├── layout.tsx              # Root layout + metadata
│   │   ├── showcase/               # Production AI Showcase
│   │   │   ├── page.tsx            # Page scaffold + state management
│   │   │   ├── data.ts             # 20 items, 16 stats, 20 repos, 13 certs
│   │   │   ├── ShowcaseGallery.tsx # Search, filter, system-grouped cards
│   │   │   ├── PresentationMode.tsx# Keyboard nav, auto-advance, playlists
│   │   │   ├── Lightbox.tsx        # Full-screen crossfade viewer
│   │   │   ├── AnomalyStats.tsx    # Animated count-up grid
│   │   │   ├── GitHubRepos.tsx     # Public (11) + Private (9) tables
│   │   │   ├── LiveSites.tsx       # 4 production URLs
│   │   │   ├── Certifications.tsx  # AWS (5) + Microsoft (6) + Other (2)
│   │   │   ├── DockerEvidence.tsx  # 4 containerized projects
│   │   │   └── TechStackRibbon.tsx # 15 technology chips
│   │   ├── analyze/                # JD Fit Analyzer
│   │   ├── frontier-ops/           # Interactive Frontier Ops
│   │   ├── see-more/               # Extended projects
│   │   └── api/                    # 8 API routes
│   │       ├── chat/               # Claude streaming + RAG
│   │       ├── analyze-jd/         # JD analysis pipeline
│   │       ├── contact/            # Form submission
│   │       ├── tts/                # Text-to-speech
│   │       ├── deepgram-token/     # Voice auth
│   │       ├── artifacts/          # Dynamic OG images
│   │       ├── metacognitive/      # Confidence routing
│   │       └── admin/              # Admin endpoints
│   ├── components/                 # 59 components
│   │   ├── sections/               # 10 page sections
│   │   ├── Nav.tsx                 # Scroll-aware, Next.js Link routing
│   │   ├── CommandPalette.tsx      # Cmd+K fuzzy search
│   │   ├── SectionNav.tsx          # Dot-style scroll indicator
│   │   ├── ThemeProvider.tsx       # Light/dark via data-theme
│   │   └── Footer.tsx             # Quick links, social, stats
│   ├── hooks/                      # 14 custom hooks
│   │   ├── useScrollReveal.ts      # IntersectionObserver animations
│   │   ├── useCountAnimation.ts    # Animated number count-up
│   │   ├── useParallax.ts          # GPU-accelerated parallax
│   │   ├── useFocusTrap.ts         # Modal accessibility
│   │   └── useReducedMotion.ts     # Motion preference detection
│   └── lib/                        # AI config, schemas, utilities
├── public/
│   └── showcase/                   # 20 screenshot assets (PNG + GIF)
├── tests/e2e/                      # Playwright E2E tests
└── next.config.ts                  # Sentry + Next.js config
```

<img src="https://user-images.githubusercontent.com/74038190/212284100-561aa473-3905-4a80-b561-0d28506553ee.gif" width="100%"/>

## Security

| Layer | Implementation |
|:------|:--------------|
| **Rate Limiting** | Upstash Redis — 10 req/min chat, 5 req/min analyzer |
| **Input Validation** | Zod schemas on every API endpoint |
| **Headers** | CSP, HSTS (1yr), X-Frame-Options DENY, X-Content-Type-Options |
| **Error Tracking** | Sentry with automatic PII scrubbing |
| **Type Safety** | TypeScript strict — no implicit any, no unchecked index |

## Development

```bash
git clone https://github.com/Dicoangelo/dicoangelo.metaventions.git
cd dicoangelo.metaventions
npm install

# Required env vars
cp .env.example .env.local
# ANTHROPIC_API_KEY, NEXT_PUBLIC_SUPABASE_URL, UPSTASH_REDIS_REST_*

npm run dev          # localhost:3000
npm run build        # Production build
npm run lint         # ESLint
npm test             # Vitest
npm run test:e2e     # Playwright
```

<img src="https://user-images.githubusercontent.com/74038190/212284115-f47cd8ff-2ffb-4b04-b5bf-4d1c14c0247f.gif" width="100%"/>

## The Ecosystem

This portfolio is one node in a larger sovereign AI infrastructure:

<div align="center">

| Project | What It Is | Link |
|:--------|:-----------|:-----|
| **Antigravity OS** | Sovereign AI OS — 33K LOC, multi-agent orchestration | [app.metaventionsai.com](https://app.metaventionsai.com) |
| **meta-vengine** | Self-improving routing engine — DQ scoring, co-evolution | [GitHub](https://github.com/Dicoangelo/meta-vengine) |
| **ResearchGravity** | 21 MCP tools, knowledge graph, hybrid search | [GitHub](https://github.com/Dicoangelo/ResearchGravity) |
| **antigravity-coordinator** | Multi-agent orchestration — 212 tests, 93.1% routing | [GitHub](https://github.com/Dicoangelo/antigravity-coordinator) |
| **UCW** | Universal Cognitive Wallet — 174K events across 6 platforms | [GitHub](https://github.com/Dicoangelo/ucw) |
| **Command Center** | 17-tab real-time dashboard — SSE streaming, 131K events | [GitHub](https://github.com/Dicoangelo/claude-command-center) |
| **Metaventions AI** | Company landing page | [metaventionsai.com](https://metaventionsai.com) |
| **Jordan Signature Event** | Client delivery — production website | [thesignatureevent.metaventionsai.com](https://thesignatureevent.metaventionsai.com) |

</div>

---

<div align="center">

<img src="https://readme-typing-svg.demolab.com?font=Inter&weight=500&size=16&duration=4000&pause=2000&color=6366F1&center=true&vCenter=true&repeat=true&width=500&height=30&lines=Built+with+AI+orchestration+%E2%80%A2+Zero+lines+manually+written" alt="Footer" />

<br/><br/>

[![Portfolio](https://img.shields.io/badge/Portfolio-dicoangelo.metaventionsai.com-6366f1?style=for-the-badge&labelColor=0d1117)](https://dicoangelo.metaventionsai.com)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-dico--angelo-0077B5?style=for-the-badge&logo=linkedin&labelColor=0d1117)](https://www.linkedin.com/in/dico-angelo/)
[![npm](https://img.shields.io/badge/npm-@metaventionsai-cb3837?style=for-the-badge&logo=npm&labelColor=0d1117)](https://www.npmjs.com/org/metaventionsai)
[![GitHub](https://img.shields.io/badge/GitHub-30_Repos-6366f1?style=for-the-badge&logo=github&labelColor=0d1117)](https://github.com/Dicoangelo)

</div>

<img src="https://capsule-render.vercel.app/api?type=waving&height=120&color=0:4f46e5,50:1e1b4b,100:0d1117&section=footer" width="100%" alt="Footer"/>
