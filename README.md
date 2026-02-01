# dicoangelo.com - World-Class Portfolio

[![Grade](https://img.shields.io/badge/Grade-A%20(92%25)-success)](https://github.com/Dicoangelo/dicoangelo.com)
[![Testing](https://img.shields.io/badge/Testing-A%20(95%25)-success)](https://github.com/Dicoangelo/dicoangelo.com)
[![Security](https://img.shields.io/badge/Security-A---%20(90%25)-success)](https://github.com/Dicoangelo/dicoangelo.com)
[![Accessibility](https://img.shields.io/badge/WCAG-2.1%20AA-success)](https://github.com/Dicoangelo/dicoangelo.com)
[![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)

> **Professional portfolio showcasing full-stack engineering expertise with enterprise-grade testing, security, and accessibility standards.**

**Live Site**: [dicoangelo.com](https://dicoangelo.com) | **GitHub**: [@Dicoangelo](https://github.com/Dicoangelo)

---

## 🏆 Highlights

- **Grade A (92%)** - World-class portfolio standards
- **63+ Automated Tests** - Unit, E2E, and accessibility testing
- **WCAG 2.1 AA Compliant** - Full accessibility support
- **Rate Limited APIs** - Enterprise security with Upstash
- **GSAP Animations** - Smooth scroll reveals and interactions
- **373 Lines** - Refactored from 829 (55% reduction)
- **95+ Lighthouse Score** - Maintained performance excellence
- **Cognitive AI** - Metacognitive routing & adaptive memory (9,000+ lines)

---

## 🚀 Features

### 💎 Core Features
- **AI-Powered Chat** - Anthropic Claude integration with streaming responses
- **Job Description Analyzer** - AI-powered resume-to-JD fit analysis
- **Interactive Projects** - Live demos, GitHub repos, verifiable code
- **Career Timeline** - Visual journey through professional experience
- **Keyboard Shortcuts** - Power user navigation (press `?` for help)
- **Theme Toggle** - Light/dark mode with persistent preference
- **Responsive Design** - Mobile-first, tested across 3 viewports

### 🛡️ Security & Quality
- **Rate Limiting** - Upstash Redis with sliding window (10 req/min chat, 5 req/min analyzer)
- **Input Validation** - Zod schemas for all user inputs
- **Security Headers** - CSP, HSTS, X-Frame-Options, X-Content-Type-Options
- **Error Tracking** - Sentry integration with PII filtering
- **Type Safety** - Full TypeScript strict mode

### 🎨 User Experience
- **GSAP Animations** - Scroll reveals, stagger grids, parallax effects
- **Smooth Scrolling** - Polished navigation with progress indicator
- **Back to Top** - Appears after scrolling with smooth animation
- **Loading States** - Skeleton screens for better perceived performance
- **Error Boundaries** - Graceful error handling with retry logic

### ✅ Testing
- **22 Unit Tests** - Vitest + React Testing Library
- **31+ E2E Tests** - Playwright with Chromium
- **10 Accessibility Tests** - axe-core WCAG 2.1 AA validation
- **Responsive Tests** - Mobile (375px), Tablet (768px), Desktop (1920px)

### 🧠 Cognitive AI (Phase 7 & 8)
- **Metacognitive State Vector** - Confidence tracking with System 1/System 2 mode switching
- **Model Escalation** - Automatic routing: Haiku → Sonnet → Opus based on confidence
- **Adaptive Memory Lifecycle** - Three memory types with decay and consolidation
- **Spaced Repetition** - Leitner-style replay for high-value memories
- **Health Monitoring** - Pass/warn/fail status with configurable alerts

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16.1.6 (App Router)
- **UI Library**: React 19
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **Animations**: GSAP 3.12.5 with ScrollTrigger

### Backend
- **Runtime**: Node.js with Edge Runtime
- **API**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **AI**: Anthropic Claude API

### Infrastructure
- **Hosting**: Vercel
- **Rate Limiting**: Upstash Redis
- **Error Tracking**: Sentry
- **Analytics**: Custom implementation

### Testing
- **Unit Testing**: Vitest 4.0.18
- **E2E Testing**: Playwright 1.49.1
- **Accessibility**: axe-core
- **Component Testing**: React Testing Library 16.3.2

### Security
- **Validation**: Zod 3.23.8
- **Rate Limiting**: @upstash/ratelimit 2.0.8
- **Headers**: Custom middleware (CSP, HSTS)

---

## 📦 Project Structure

```
dicoangelo.com/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/                # API routes (chat, analyze-jd, voice, tts)
│   │   │   └── metacognitive/  # Phase 7: /mode, /alerts endpoints
│   │   ├── page.tsx            # Homepage (373 lines, refactored from 829)
│   │   └── layout.tsx          # Root layout
│   ├── components/
│   │   ├── sections/           # Page sections (6 components)
│   │   ├── errors/             # Error boundaries
│   │   ├── metacognitive/      # Phase 7: Dashboard visualizations
│   │   ├── __tests__/          # Unit tests (22 tests)
│   │   ├── Toast.tsx           # Phase 6: Notifications
│   │   ├── Spinner.tsx         # Phase 6: Loading states
│   │   ├── PageTransition.tsx  # Phase 6: Route animations
│   │   └── *.tsx               # Shared components
│   ├── hooks/
│   │   ├── useGSAP.ts          # GSAP animation hook
│   │   ├── useKeyboardShortcuts.ts
│   │   ├── useCountAnimation.ts
│   │   ├── useScrollReveal.ts  # Phase 6: Intersection observer
│   │   ├── useParallax.ts      # Phase 6: GPU-accelerated parallax
│   │   ├── useFocusTrap.ts     # Phase 6: Modal a11y
│   │   └── useReducedMotion.ts # Phase 6: Motion preferences
│   ├── lib/
│   │   ├── ratelimit.ts        # Rate limiting configs
│   │   ├── schemas.ts          # Zod validation schemas
│   │   ├── sentry-utils.ts     # Sentry helpers
│   │   ├── metacognitive/      # Phase 7: Confidence & model routing
│   │   └── memory/             # Phase 8: Adaptive memory lifecycle
│   ├── middleware.ts           # Security headers
│   └── test/                   # Test utilities
├── tests/
│   └── e2e/                    # Playwright E2E tests (31+ tests)
│       ├── navigation.spec.ts
│       ├── theme-toggle.spec.ts
│       ├── keyboard-shortcuts.spec.ts
│       ├── accessibility.spec.ts
│       └── responsive.spec.ts
├── docs/                       # Comprehensive documentation
│   ├── DEPLOYMENT_CHECKLIST.md
│   ├── SENTRY_SETUP.md
│   └── *.md                    # Phase summaries
├── vitest.config.ts            # Unit test config
├── playwright.config.ts        # E2E test config
├── sentry.*.config.ts          # Sentry configs
└── next.config.ts              # Next.js + Sentry config
```

---

## 🚦 Getting Started

### Prerequisites

- Node.js 20+ (LTS recommended)
- npm 10+ or pnpm 9+
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/Dicoangelo/dicoangelo.com.git
cd dicoangelo.com

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Configure required environment variables
# See DEPLOYMENT_CHECKLIST.md for full list
```

### Environment Variables

**Required for Development:**
```bash
# API Keys
ANTHROPIC_API_KEY=sk-ant-...
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...

# Optional (for full features)
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...
SENTRY_AUTH_TOKEN=...
NEXT_PUBLIC_SENTRY_DSN=https://...
```

See [`DEPLOYMENT_CHECKLIST.md`](./DEPLOYMENT_CHECKLIST.md) for complete setup instructions.

### Development

```bash
# Start development server
npm run dev

# Open http://localhost:3000
```

---

## 🧪 Testing

### Unit Tests (Vitest)

```bash
# Run unit tests
npm test

# Run with UI
npm run test:ui

# Run once (CI mode)
npm run test:run

# Coverage report
npm run test:coverage
```

**Coverage**: 22 tests across 3 files (BackToTop, KeyboardShortcuts, ErrorBoundary)

### E2E Tests (Playwright)

```bash
# Run E2E tests
npm run test:e2e

# Run with UI (interactive)
npm run test:e2e:ui

# Run headed (watch execution)
npm run test:e2e:headed

# Debug mode
npm run test:e2e:debug
```

**Coverage**: 31+ tests across 5 suites (navigation, theme, keyboard, accessibility, responsive)

### Accessibility Testing

E2E tests include automated accessibility checks with axe-core:
- WCAG 2.0 Level A & AA
- WCAG 2.1 Level A & AA
- Color contrast validation
- Keyboard navigation
- Screen reader compatibility

---

## 📊 Performance

### Core Web Vitals

| Metric | Score | Target | Status |
|--------|-------|--------|--------|
| **LCP** | ~1.8s | <2.5s | ✅ Good |
| **FID** | ~10ms | <100ms | ✅ Good |
| **CLS** | ~0.05 | <0.1 | ✅ Good |

### Lighthouse Scores

- **Performance**: 95+
- **Accessibility**: 100
- **Best Practices**: 95+
- **SEO**: 100

### Bundle Size

- **Initial**: ~305KB gzipped
- **GSAP**: Lazy-loaded (~60KB)
- **Animations**: GPU-accelerated (transform, opacity only)

---

## 🔒 Security

### Rate Limiting
- **Chat API**: 10 requests/minute per IP
- **JD Analyzer**: 5 requests/minute per IP
- **Voice API**: 10 requests/minute per IP

### Input Validation
- All user inputs validated with Zod schemas
- API routes return 400 with clear validation messages

### Security Headers
- **CSP**: Content-Security-Policy with nonces
- **HSTS**: Strict-Transport-Security (max-age 31536000)
- **X-Frame-Options**: DENY
- **X-Content-Type-Options**: nosniff
- **Referrer-Policy**: strict-origin-when-cross-origin

### Error Tracking
- Sentry integration with PII filtering
- Source maps for production debugging
- Custom error boundaries

---

## ♿ Accessibility

### WCAG 2.1 AA Compliance

- ✅ Semantic HTML
- ✅ Keyboard navigation (try pressing `?`, `t`, `1-3`, `g+t`, `g+b`)
- ✅ Skip navigation link
- ✅ ARIA labels and roles
- ✅ Color contrast ≥ 4.5:1
- ✅ Responsive text sizing
- ✅ Focus indicators
- ✅ Screen reader support
- ✅ Alt text for images
- ✅ Form labels

### Keyboard Shortcuts

Press `?` to view all shortcuts, or use:
- `?` - Toggle keyboard shortcuts help
- `t` - Toggle theme (light/dark)
- `1`, `2`, `3` - Navigate to sections
- `g` + `t` - Go to top
- `g` + `b` - Go to bottom
- `Escape` - Close modals

---

## 🚀 Deployment

### Vercel (Recommended)

1. **Configure Environment Variables** (see `DEPLOYMENT_CHECKLIST.md`)
2. **Deploy to Vercel**:
   ```bash
   vercel --prod
   ```

### Self-Hosted

```bash
# Build production bundle
npm run build

# Start production server
npm run start

# Server runs on http://localhost:3000
```

### Environment Configuration

**Required for Production:**
- Upstash Redis credentials (rate limiting)
- Sentry auth token (error tracking)
- Anthropic API key (AI features)
- Supabase credentials (database)

See [`DEPLOYMENT_CHECKLIST.md`](./DEPLOYMENT_CHECKLIST.md) for step-by-step instructions.

---

## 📚 Documentation

### Quick Links
- **[Deployment Checklist](./DEPLOYMENT_CHECKLIST.md)** - Pre-flight deployment guide
- **[Sentry Setup](./SENTRY_SETUP.md)** - Error tracking configuration
- **[Final Summary](./FINAL_SUMMARY.md)** - Complete implementation overview
- **[Checkpoint Summary](./CHECKPOINT_SUMMARY.md)** - Detailed progress tracker

### Phase Summaries
- **[Phase 1 Complete](./PHASE_1_COMPLETE_SUMMARY.md)** - Testing & Security
- **[Phase 2 & 4 Progress](./PHASE_2_AND_4_PROGRESS.md)** - Animations & Refactoring
- **[Phase 4.1 Complete](./PHASE_4.1_REFACTOR_COMPLETE.md)** - Code refactoring details
- **[Phase 4.2 Complete](./PHASE_4.2_E2E_TESTING.md)** - E2E testing guide
- **[Phase 5 UI/UX PRD](./PHASE_5_UI_UX_PRD.md)** - Design system & polish
- **[PRD Execution](./prds/MASTER_EXECUTION.md)** - Phase 6-8 execution tracker

---

## 🎯 Roadmap

### Completed ✅
- [x] Testing infrastructure (Vitest + Playwright)
- [x] Security hardening (rate limiting, validation, headers)
- [x] Sentry error tracking
- [x] GSAP scroll animations
- [x] Code refactoring (829 → 373 lines)
- [x] E2E test suite (31+ tests)
- [x] WCAG 2.1 AA compliance
- [x] Comprehensive documentation
- [x] **Phase 5**: UI/UX Polish & Design System
- [x] **Phase 6**: Advanced UI/UX Enhancements (parallax, scroll reveals, toasts, spinners)
- [x] **Phase 7**: Metacognitive State Vector (confidence tracking, model escalation)
- [x] **Phase 8**: Adaptive Memory Lifecycle (memory types, decay, consolidation, replay)

### Planned 🔮
- [ ] Three.js interactive 3D elements (optional)
- [ ] Visual regression testing
- [ ] Performance monitoring with RUM
- [ ] A/B testing framework
- [ ] Blog/content system
- [ ] Cross-browser E2E tests (Firefox, Safari)

---

## 🤝 Contributing

This is a personal portfolio project, but suggestions are welcome:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is proprietary and confidential.

© 2026 Dico Angelo. All rights reserved.

---

## 🙏 Acknowledgments

### Technologies
- [Next.js](https://nextjs.org/) - React framework
- [React](https://react.dev/) - UI library
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [GSAP](https://greensock.com/gsap/) - Animations
- [Vitest](https://vitest.dev/) - Unit testing
- [Playwright](https://playwright.dev/) - E2E testing
- [Sentry](https://sentry.io/) - Error tracking
- [Upstash](https://upstash.com/) - Redis rate limiting
- [Anthropic](https://www.anthropic.com/) - Claude AI

### Inspiration
- [Vercel Engineering](https://vercel.com/blog) - Performance best practices
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/) - Accessibility standards
- [Playwright Docs](https://playwright.dev/) - E2E testing patterns

---

## 📞 Contact

**Dico Angelo**
- **Email**: dico.angelo97@gmail.com
- **Phone**: +1 (519) 999-6099
- **LinkedIn**: [linkedin.com/in/dico-angelo](https://www.linkedin.com/in/dico-angelo/)
- **GitHub**: [@Dicoangelo](https://github.com/Dicoangelo)
- **Portfolio**: [dicoangelo.com](https://dicoangelo.com)

---

<div align="center">

**Built with 💎 by Dico Angelo**

[![Portfolio](https://img.shields.io/badge/Portfolio-dicoangelo.com-blue)](https://dicoangelo.com)
[![GitHub](https://img.shields.io/badge/GitHub-Dicoangelo-black)](https://github.com/Dicoangelo)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-dico--angelo-0077B5)](https://www.linkedin.com/in/dico-angelo/)

</div>
