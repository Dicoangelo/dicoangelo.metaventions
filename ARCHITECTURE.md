# dicoangelo.com - Architecture Documentation

**Version:** 2.0
**Last Updated:** February 1, 2026
**Status:** Production

---

## Executive Summary

A Next.js 16 portfolio site showcasing full-stack engineering expertise with enterprise-grade standards. Built for **recruiters and investors** with focus on verifiable metrics, business impact, and technical credibility.

**Target Audience:** Technical recruiters, hiring managers, VCs, founding partners
**Key Metric:** Convert visitors into interview opportunities

---

## System Architecture

### High-Level Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT (Browser)                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Hero       │  │  Voice UI    │  │  Chat UI     │      │
│  │  (3D Anim)   │  │  (Deepgram)  │  │  (Claude)    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                         │
                         │ HTTPS
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  VERCEL EDGE NETWORK                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Middleware  │  │  Rate Limit  │  │   Headers    │      │
│  │  (Security)  │  │  (Upstash)   │  │    (CSP)     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    NEXT.JS APP ROUTER                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  API Routes  │  │  SSR Pages   │  │  Static Gen  │      │
│  │  (Edge)      │  │  (Sections)  │  │  (Metadata)  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                         │
          ┌──────────────┼──────────────┐
          ▼              ▼              ▼
    ┌─────────┐    ┌─────────┐    ┌─────────┐
    │ Anthropic│    │ Supabase│    │  Sentry │
    │  Claude  │    │   DB    │    │  Error  │
    └─────────┘    └─────────┘    └─────────┘
```

---

## Tech Stack

### Frontend Layer
- **Framework:** Next.js 16.1.6 (App Router, Turbopack)
- **UI Library:** React 19 (latest features, concurrent rendering)
- **Language:** TypeScript 5 (strict mode)
- **Styling:** Tailwind CSS 4
- **3D Graphics:** React Three Fiber + Three.js
- **Animations:** GSAP 3.12.5 (scroll-triggered)

### Backend Layer
- **Runtime:** Node.js 20+ / Vercel Edge Runtime
- **API:** Next.js API Routes (Edge Functions)
- **Database:** Supabase (PostgreSQL)
- **Cache:** Upstash Redis (rate limiting)
- **AI:** Anthropic Claude (streaming)
- **Voice:** Deepgram STT, ElevenLabs TTS

### Infrastructure
- **Hosting:** Vercel (Edge Network, CDN)
- **Monitoring:** Sentry (error tracking)
- **Analytics:** Custom implementation
- **Security:** CSP, HSTS, rate limiting

### Testing
- **Unit:** Vitest 4.0.18 (22 tests)
- **E2E:** Playwright 1.49.1 (31+ tests)
- **Accessibility:** axe-core (WCAG 2.1 AA)

---

## Directory Structure

```
dicoangelo.com/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/                # API Routes (Edge)
│   │   │   ├── chat/           # Claude AI streaming
│   │   │   ├── analyze-jd/     # Resume fit analyzer
│   │   │   ├── tts/            # Text-to-speech
│   │   │   ├── deepgram-token/ # Voice auth
│   │   │   ├── admin/          # Analytics dashboard
│   │   │   └── metacognitive/  # Phase 7: /mode, /alerts endpoints
│   │   ├── page.tsx            # Homepage (373 LOC)
│   │   ├── layout.tsx          # Root layout
│   │   └── analyze/            # JD analyzer page
│   │
│   ├── components/
│   │   ├── sections/           # Page sections (modular)
│   │   │   ├── AskSection.tsx  # Voice + Chat UI
│   │   │   ├── ProofSection.tsx # Verifiable metrics
│   │   │   ├── SystemsSection.tsx # AI systems showcase
│   │   │   ├── ProjectsSection.tsx # Project cards
│   │   │   ├── ArenaSection.tsx # Event attendance
│   │   │   └── ContactSection.tsx # CTA + Calendly
│   │   ├── errors/             # Error boundaries
│   │   ├── metacognitive/      # Phase 7: Dashboard visualizations
│   │   ├── __tests__/          # Unit tests (Vitest)
│   │   ├── Chat.tsx            # AI chat interface
│   │   ├── VoiceOrb.tsx        # Voice UI (3D)
│   │   ├── ThreeSystemsNetwork.tsx # 3D systems viz
│   │   ├── ThreeHeroBackground.tsx # Particle animation
│   │   ├── Toast.tsx           # Phase 6: Notifications
│   │   ├── Spinner.tsx         # Phase 6: Loading states
│   │   ├── PageTransition.tsx  # Phase 6: Route animations
│   │   ├── RevealOnScroll.tsx  # Phase 6: Scroll animations
│   │   └── [40+ components]
│   │
│   ├── hooks/                  # Custom React hooks
│   │   ├── useVoice.ts         # Voice state management
│   │   ├── useDeepgramSTT.ts   # Deepgram integration
│   │   ├── useKeyboardShortcuts.ts # Keyboard nav
│   │   ├── useGSAP.ts          # Animation helpers
│   │   ├── useScrollReveal.ts  # Phase 6: Intersection observer
│   │   ├── useParallax.ts      # Phase 6: GPU-accelerated parallax
│   │   ├── useFocusTrap.ts     # Phase 6: Modal accessibility
│   │   └── useReducedMotion.ts # Phase 6: Motion preferences
│   │
│   ├── lib/                    # Utilities & configs
│   │   ├── ratelimit.ts        # Upstash rate limiting
│   │   ├── schemas.ts          # Zod validation
│   │   ├── sentry-utils.ts     # Error tracking
│   │   ├── supabase.ts         # DB client
│   │   ├── metacognitive/      # Phase 7: Confidence & model routing
│   │   │   ├── confidence.ts   # Confidence tracking
│   │   │   ├── escalation.ts   # Model escalation logic
│   │   │   └── alerts.ts       # Mode switch alerts
│   │   └── memory/             # Phase 8: Adaptive memory lifecycle
│   │       ├── types.ts        # FACTUAL, EXPERIENTIAL, WORKING
│   │       ├── decay.ts        # Exponential decay
│   │       ├── consolidation.ts # Phase transitions
│   │       ├── forgetting.ts   # Soft/hard delete
│   │       ├── replay.ts       # Spaced repetition
│   │       └── health.ts       # Health monitoring
│   │
│   └── middleware.ts           # Security headers (CSP, HSTS)
│
├── tests/e2e/                  # Playwright E2E tests
│   ├── navigation.spec.ts      # Navigation flows
│   ├── theme-toggle.spec.ts    # Dark/light mode
│   ├── keyboard-shortcuts.spec.ts # Keyboard nav
│   ├── accessibility.spec.ts   # WCAG compliance
│   └── responsive.spec.ts      # Mobile/tablet/desktop
│
├── public/                     # Static assets
│   ├── headshot.jpg            # Profile image
│   ├── TECHNICAL_DOSSIER.md    # Career context
│   └── RECRUITER_QUICK_FACTS.md # Quick reference
│
└── docs/                       # Documentation
    ├── DEPLOYMENT_CHECKLIST.md
    ├── SENTRY_SETUP.md
    └── ARCHITECTURE.md         # This file
```

---

## Component Architecture

### Core Sections (Homepage)

1. **Hero Section** (`src/components/Hero.tsx`)
   - Animated particle background (Three.js)
   - Glassmorphism effect (light + dark mode)
   - Typing animation for roles
   - CTA buttons (Live Demo, GitHub, Resume)

2. **Ask Section** (`src/components/sections/AskSection.tsx`)
   - Voice UI (3D orb with Deepgram STT + TTS)
   - Text chat (Claude AI streaming)
   - Shared conversation context
   - Suggested questions

3. **Proof Section** (`src/components/sections/ProofSection.tsx`)
   - Verifiable metrics grid
   - Documentation links
   - Evidence-based claims
   - Skeptical CTA

4. **Testimonials** (`src/components/Testimonials.tsx`)
   - 4 third-party sources
   - Partner Insight Newsletter (NEW)
   - Suger.io Case Study
   - Catalyst 2026, 1159.ai

5. **Systems Section** (`src/components/sections/SystemsSection.tsx`)
   - Business-focused messaging
   - 3D interactive network
   - Key metrics (94% auto-fix, 24/7 uptime)
   - "Why This Matters" section

6. **Projects Section** (`src/components/sections/ProjectsSection.tsx`)
   - ACE (Adaptive Consensus Engine)
   - ARCHON (Meta-Orchestrator)
   - META-VENGINE (Self-improving AI)
   - Research paper references

7. **Resume Download** (`src/components/ResumeDownload.tsx`)
   - PDF/DOCX download
   - Key metrics preview
   - Social proof links

8. **Timeline** (`src/components/CareerTimeline.tsx`)
   - Career journey visualization
   - Expandable role details
   - Metrics per role

9. **Arena** (`src/components/sections/ArenaSection.tsx`)
   - 150+ events across 8 cities
   - Network visualization
   - Access circles

10. **Contact** (`src/components/sections/ContactSection.tsx`)
    - Calendly scheduling
    - Contact info
    - Social links

---

## Data Flow

### Voice Interaction Flow

```
User taps orb
    │
    ▼
Request microphone permission
    │
    ▼
Start Deepgram WebSocket
    │
    ▼
Stream audio → Deepgram STT
    │
    ▼
Live transcript updates
    │
    ▼
Detect silence (1.2s)
    │
    ▼
Send transcript to /api/chat
    │
    ▼
Claude AI processes (streaming)
    │
    ▼
Response → /api/tts (ElevenLabs)
    │
    ▼
Audio buffer → Web Audio API
    │
    ▼
Play response + animate orb
```

### Chat Interaction Flow

```
User types message
    │
    ▼
Zod validation
    │
    ▼
Rate limit check (Upstash)
    │
    ▼
POST /api/chat
    │
    ▼
Load career dossier context (Supabase)
    │
    ▼
Claude AI streaming response
    │
    ▼
Display message in chat
```

### JD Analysis Flow

```
User pastes job description
    │
    ▼
Zod validation (max 10K chars)
    │
    ▼
Rate limit check (5 req/min)
    │
    ▼
POST /api/analyze-jd
    │
    ▼
Load career dossier (700+ chunks)
    │
    ▼
Semantic search (pgvector)
    │
    ▼
Claude AI analysis
    │
    ▼
Structured response (fit score, strengths, gaps)
```

---

## Security Architecture

### Defense in Depth

1. **Edge Layer** (Vercel)
   - DDoS protection
   - CDN caching
   - SSL/TLS encryption

2. **Middleware** (`src/middleware.ts`)
   - CSP headers (strict)
   - HSTS (max-age 1 year)
   - X-Frame-Options: DENY
   - X-Content-Type-Options: nosniff

3. **API Layer**
   - Rate limiting (Upstash Redis)
   - Input validation (Zod schemas)
   - Authentication (admin routes)
   - Error sanitization

4. **Application Layer**
   - No sensitive data in client
   - Environment variable isolation
   - Sentry PII filtering

### Rate Limiting Strategy

```typescript
// Chat: 10 requests/minute per IP
ratelimit.sliding(10, "1 m")

// Analyzer: 5 requests/minute per IP
ratelimit.sliding(5, "1 m")

// Voice: 10 requests/minute per IP
ratelimit.sliding(10, "1 m")
```

---

## Performance Optimizations

### Bundle Optimization
- Dynamic imports for heavy components
- Three.js lazy-loaded
- GSAP code-split
- Image optimization (Next.js Image)

### Rendering Strategy
- **SSR**: Critical sections (Hero, Proof)
- **CSR**: Interactive components (Chat, Voice)
- **SSG**: Static pages (metadata, OG images)

### Caching
- API routes: No caching (dynamic)
- Static assets: CDN cached (1 year)
- Images: Next.js optimized

### Animation Performance
- GPU-accelerated (transform, opacity only)
- Scroll-triggered (GSAP ScrollTrigger)
- RequestAnimationFrame for smooth 60fps

---

## Recent Updates (Feb 1, 2026)

### ✅ Completed

1. **Glassmorphism Background Fix**
   - Changed `mix-blend-screen` → `mix-blend-multiply` (light mode)
   - Particles now visible in both themes
   - Maintained aesthetic consistency

2. **3D Canvas Overflow Fix**
   - Added `max-w-full` container constraint
   - Explicit canvas dimensions (100%)
   - No horizontal scroll on mobile

3. **Voice UI Responsiveness**
   - Changed fixed `w-[300px]` → `max-w-[300px] aspect-square`
   - Added glassmorphism (`backdrop-blur-sm`)
   - Proper centering with `mx-auto`

4. **Systems Section Upgrade**
   - Business-focused messaging for recruiters/investors
   - Renamed technical terms (e.g., "Quality Engine" vs "DQ Routing")
   - Added value proposition cards
   - "Why This Matters" section linking to Contentsquare success

5. **Testimonials Update**
   - Added Partner Insight Newsletter feature (4th testimonial)
   - Emphasizes operations transformation impact
   - Links to "0 to $30M in 30 Months" case study

6. **Phase 5: UI/UX Polish & Design System**
   - Consistent spacing and typography
   - Enhanced visual hierarchy
   - Design tokens implementation

7. **Phase 6: Advanced UI/UX Enhancements**
   - Page transition animations (400ms fade)
   - Scroll-triggered reveal animations (IntersectionObserver)
   - Hero parallax effects (GPU-accelerated)
   - Toast notification system (4 variants)
   - Metric count-up animations (easeOutExpo)
   - Loading spinner variants (3 sizes, 3 styles)
   - Focus trap for modals (a11y)
   - Reduced motion mode toggle (localStorage)

8. **Phase 7: Metacognitive State Vector**
   - Confidence tracking (0.0-1.0) from text uncertainty signals
   - System 1/System 2 mode switching based on confidence
   - Model escalation: Haiku → Sonnet → Opus on low confidence
   - Metacognitive dashboard with gauge, trend chart, escalation list
   - Mode switch alerts (configurable)

9. **Phase 8: Adaptive Memory Lifecycle**
   - Memory types: FACTUAL (90d), EXPERIENTIAL (30d), WORKING (7d)
   - Memory phases: FORMATION → EVOLUTION → RETRIEVAL
   - Exponential decay with configurable half-lives
   - Relevance scoring (access frequency, recency, context)
   - Consolidation pipeline for phase transitions
   - Forgetting mechanism with soft/hard delete
   - Spaced repetition replay (Leitner boxes)
   - Lifecycle dashboard with CLI output
   - Health monitoring (pass/warn/fail alerts)

---

## Cognitive AI Architecture (Phase 7-8)

### Metacognitive State Vector

```
User Query
    │
    ▼
Confidence Extraction
    │ (uncertainty words, hedging phrases)
    ▼
Calculate Confidence Score (0.0-1.0)
    │
    ├── High (≥0.7) → System 1 (Fast/Haiku)
    ├── Medium (0.3-0.7) → System 2 (Analytical/Sonnet)
    └── Low (<0.3) → Deep Analysis (Opus)
```

### Memory Lifecycle

```
New Memory
    │
    ▼
FORMATION Phase
    │ (accessCount < 3)
    ▼
EVOLUTION Phase
    │ (3 ≤ accessCount < 10)
    │ Consolidation with related memories
    ▼
RETRIEVAL Phase
    │ (accessCount ≥ 10, relevance ≥ 0.8)
    │ Optimized for fast recall
    ▼
Decay / Forgetting
    │ (decay < 0.1 AND relevance < 0.2)
    ▼
Archive (30-day recovery) → Hard Delete
```

### Memory Types & Half-Lives

| Type | Half-Life | Use Case |
|------|-----------|----------|
| FACTUAL | 90 days | Facts, definitions, concepts |
| EXPERIENTIAL | 30 days | Events, episodes, experiences |
| WORKING | 7 days | Temporary, task-specific |

---

## Deployment

### Environment Variables

**Required:**
```bash
ANTHROPIC_API_KEY=sk-ant-...
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...
```

**Optional:**
```bash
NEXT_PUBLIC_SENTRY_DSN=https://...
SENTRY_AUTH_TOKEN=...
DEEPGRAM_API_KEY=...
ELEVENLABS_API_KEY=...
```

### Build & Deploy

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Deploy to Vercel
vercel --prod
```

---

## Testing Strategy

### Unit Tests (Vitest)
- **Coverage:** 22 tests across 3 components
- **Focus:** User interactions, error boundaries, keyboard shortcuts
- **CI:** Runs on every commit

### E2E Tests (Playwright)
- **Coverage:** 31+ tests across 5 suites
- **Browsers:** Chromium (desktop, mobile, tablet)
- **Scenarios:** Navigation, theme toggle, keyboard shortcuts, accessibility

### Accessibility Tests
- **Framework:** axe-core
- **Standard:** WCAG 2.1 AA
- **Coverage:** All major sections

---

## Monitoring & Observability

### Error Tracking (Sentry)
- Source maps uploaded
- PII filtering enabled
- Custom error boundaries
- Performance monitoring

### Analytics
- Custom admin dashboard
- API usage tracking
- User flow analysis
- Conversion metrics

---

## Known Limitations

1. **Voice UI:** Deepgram fallback to Web Speech API (browser compatibility)
2. **3D Rendering:** Performance varies on low-end devices
3. **Rate Limiting:** Shared IP (VPN, corporate) may hit limits faster
4. **Animations:** Reduced motion not fully implemented

---

## Future Enhancements

### Short-term
- [ ] Reduced motion support (prefers-reduced-motion)
- [ ] Progressive Web App (PWA) support
- [ ] Cross-browser E2E tests (Firefox, Safari)

### Long-term
- [ ] Visual regression testing
- [ ] Performance monitoring (RUM)
- [ ] A/B testing framework
- [ ] Blog/content system

---

## Maintenance

### Dependencies
- Update monthly (security patches)
- Test before deploying
- Monitor bundle size

### Monitoring
- Daily: Sentry error rate
- Weekly: Performance metrics
- Monthly: Lighthouse audits

### Backups
- Database: Supabase automated backups
- Code: GitHub repository
- Assets: Vercel static storage

---

## Contact & Support

**Developer:** Dico Angelo
**Email:** dico.angelo97@gmail.com
**GitHub:** [@Dicoangelo](https://github.com/Dicoangelo)

---

**Last Updated:** February 1, 2026
**Version:** 2.0
**Status:** ✅ Production
