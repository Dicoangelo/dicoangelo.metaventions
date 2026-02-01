[PRD]
# PRD: dicoangelo.com - Comprehensive Site Optimization & Analysis

**Version:** 1.0
**Created:** February 1, 2026
**Status:** Ready for Implementation
**Priority:** P0 (Critical Path)

---

## Overview

Optimize dicoangelo.com for maximum conversion (visitors → interview requests) by implementing quick wins, major UX improvements, and deep technical optimizations. Work incrementally while site remains live - ship improvements daily.

**Target Audience:** Technical recruiters, hiring managers, VCs, founding partners
**Success Metric:** Increase engagement time and CTA clicks by 40%

---

## Goals

1. **Immediate Impact:** Ship 5 quick wins within 24 hours
2. **Conversion Optimization:** Reduce friction to scheduling calls
3. **Mobile Experience:** Make mobile-first with smooth performance
4. **Technical Credibility:** Surface proof points earlier
5. **Deep Analysis:** Identify and fix performance/security/accessibility issues

---

## Quality Gates

These commands must pass for every user story:

```bash
npm run lint          # ESLint checks
npm run build         # Production build succeeds
npm test              # Unit tests pass (Vitest)
npm run test:e2e      # E2E tests pass (Playwright)
```

For UI stories, also include:
- Manual verification in Chrome (desktop + mobile viewport)
- Deploy to Vercel preview URL for review

---

## User Stories

### Phase 1: Quick Wins (Ship Today) 🚀

#### US-001: Add TLDR Hero Banner
**Description:** As a recruiter with 30 seconds, I want a concise summary at the top so I immediately understand value proposition.

**Acceptance Criteria:**
- [ ] Add prominent banner above Hero section with light background
- [ ] Text: "TLDR: Built $800M+ cloud marketplace infrastructure → Now building autonomous AI systems. Open to founding technical roles."
- [ ] Include primary CTA button: "Schedule Call →" (links to #contact)
- [ ] Mobile responsive (stacks on small screens)
- [ ] Dismissible with localStorage (don't show again)

**Files to Modify:**
- `src/components/Hero.tsx` - Add TLDRBanner component
- `src/app/globals.css` - Add TLDR styles

---

#### US-002: Sticky Floating CTA
**Description:** As a user scrolling the page, I want easy access to contact CTA so I don't have to scroll to bottom.

**Acceptance Criteria:**
- [ ] Floating button appears after scrolling past Hero (500px)
- [ ] Fixed position bottom-right corner
- [ ] Text: "Let's Talk" with calendar icon
- [ ] Smooth fade-in animation (GSAP)
- [ ] Clicks scroll to #contact section
- [ ] Z-index higher than other elements
- [ ] Mobile: smaller size, bottom-center position

**Files to Modify:**
- Create `src/components/FloatingCTA.tsx` (new component)
- Update `src/app/page.tsx` - Add FloatingCTA
- `src/hooks/useScrollPosition.ts` - Track scroll position

---

#### US-003: Reorder Sections - Surface Testimonials Earlier
**Description:** As a visitor, I want to see third-party validation early so I trust the claims.

**Acceptance Criteria:**
- [ ] Move Testimonials section after Proof section (before Projects)
- [ ] Update section heading: "What Others Say" → "Industry Recognition"
- [ ] Highlight Partner Insight Newsletter testimonial (make it first)
- [ ] Add subheading: "Featured in industry publications and case studies"
- [ ] Update nav links to reflect new order

**Files to Modify:**
- `src/app/page.tsx` - Reorder section components
- `src/components/Nav.tsx` - Update nav link order
- `src/components/Testimonials.tsx` - Reorder testimonials array

---

#### US-004: Mobile Navigation Improvements
**Description:** As a mobile user, I want larger tap targets and better navigation so I can easily browse sections.

**Acceptance Criteria:**
- [ ] Increase nav link touch targets to 48px minimum (WCAG AAA)
- [ ] Add hamburger menu for mobile (<768px)
- [ ] Smooth slide-in animation for mobile menu
- [ ] Close menu on section click
- [ ] Add visual indicator for current section
- [ ] Keyboard accessible (Tab, Enter, Escape)

**Files to Modify:**
- `src/components/Nav.tsx` - Add mobile menu state
- Create `src/components/MobileMenu.tsx` (new component)
- `src/app/globals.css` - Mobile menu styles

---

#### US-005: Loading Skeletons for 3D Components
**Description:** As a user on slow connection, I want visual feedback while 3D components load so I know content is coming.

**Acceptance Criteria:**
- [ ] Add skeleton for ThreeSystemsNetwork (pulsing gray box)
- [ ] Add skeleton for ThreeHeroBackground (gradient placeholder)
- [ ] Add skeleton for VoiceOrb (circular placeholder)
- [ ] Smooth fade transition when real component loads
- [ ] Match approximate dimensions of loaded component

**Files to Modify:**
- `src/components/LoadingSkeletons.tsx` - Add 3D skeletons
- `src/components/sections/SystemsSection.tsx` - Use skeleton
- `src/components/sections/AskSection.tsx` - Use skeleton
- `src/components/Hero.tsx` - Use skeleton

---

### Phase 2: Major Improvements (Ship This Week) 📈

#### US-006: Voice UI Discoverability Enhancement
**Description:** As a first-time visitor, I want to know the orb is interactive so I actually use the voice feature.

**Acceptance Criteria:**
- [ ] Add subtle pulsing animation when orb is idle (GSAP)
- [ ] Show tooltip on first visit: "Tap to chat with AI about my work"
- [ ] Store "tooltip_seen" in localStorage (don't show again)
- [ ] Add microphone icon overlay on orb when idle
- [ ] Increase orb size by 10% on hover (desktop)

**Files to Modify:**
- `src/components/VoiceOrb.tsx` - Add pulsing animation
- `src/components/VoiceOrb.tsx` - Add tooltip logic
- `src/app/globals.css` - Pulse animation keyframes

---

#### US-007: Systems Section Simplification
**Description:** As a non-technical recruiter, I want simple explanations of technical systems so I understand their business value.

**Acceptance Criteria:**
- [ ] Add ELI5 subtitle under each system name
  - Cognitive OS → "Schedules tasks when you're most productive"
  - Quality Engine → "Auto-validates decisions before execution"
  - Recovery System → "Fixes errors without human intervention"
  - Memory Layer → "Remembers patterns across 700+ scenarios"
  - Multi-Agent → "3 AI workers better than 1"
  - Consensus Engine → "Democratic decision-making for AI"
  - Analytics Hub → "Real-time performance dashboards"
  - Smart Context → "Loads only what you need, when you need it"
  - Learning Core → "Gets smarter with every use"
- [ ] Add before/after comparison card
- [ ] Use analogy: "Like having a DevOps engineer that never sleeps"

**Files to Modify:**
- `src/components/ThreeSystemsNetwork.tsx` - Update system descriptions
- `src/components/sections/SystemsSection.tsx` - Add analogy card

---

#### US-008: Multiple CTA Placements
**Description:** As a visitor convinced early, I want immediate access to scheduling so I don't have to scroll.

**Acceptance Criteria:**
- [ ] Add inline CTA after Proof section: "Impressed? Let's talk →"
- [ ] Add CTA after Testimonials: "Ready to discuss your role?"
- [ ] Add CTA after Systems section: "Want to build something similar?"
- [ ] Each CTA links to #contact with smooth scroll
- [ ] Track CTA clicks separately in analytics (data-cta attribute)

**Files to Modify:**
- `src/components/sections/ProofSection.tsx` - Add inline CTA
- `src/components/sections/SystemsSection.tsx` - Add inline CTA
- `src/components/Testimonials.tsx` - Add inline CTA
- Create `src/components/InlineCTA.tsx` - Reusable component

---

#### US-009: Mobile Performance Optimization
**Description:** As a mobile user on older device, I want smooth experience without laggy animations.

**Acceptance Criteria:**
- [ ] Detect device performance using `navigator.deviceMemory`
- [ ] Disable 3D animations if memory < 4GB
- [ ] Show static image fallback for ThreeHeroBackground
- [ ] Show static image fallback for ThreeSystemsNetwork
- [ ] Reduce GSAP animation complexity on mobile
- [ ] Add "prefers-reduced-motion" support
- [ ] Test on iPhone SE (2020) and Samsung Galaxy A52

**Files to Modify:**
- Create `src/lib/deviceDetection.ts` - Performance detection
- `src/components/ThreeHeroBackground.tsx` - Conditional rendering
- `src/components/ThreeSystemsNetwork.tsx` - Conditional rendering
- `src/hooks/useGSAP.ts` - Reduce motion support

---

#### US-010: Page Length Reduction - Add Progress Indicator
**Description:** As a user scrolling long page, I want to know my progress so I understand how much content remains.

**Acceptance Criteria:**
- [ ] Add progress bar at top of page (fixed position)
- [ ] Shows percentage scrolled (0-100%)
- [ ] Smooth animation as user scrolls
- [ ] Color: indigo-500
- [ ] Height: 3px
- [ ] Add section markers (Hero, Proof, Projects, etc.)
- [ ] Click marker to jump to section

**Files to Modify:**
- Update `src/components/ScrollProgress.tsx` - Add section markers
- `src/app/globals.css` - Progress bar styles

---

### Phase 3: Deep Investigation (Run in Parallel) 🔍

#### US-011: Performance Bottleneck Analysis
**Description:** As a developer, I want detailed performance report so I know what to optimize.

**Acceptance Criteria:**
- [ ] Analyze bundle size with `@next/bundle-analyzer`
- [ ] Identify largest components (>50KB)
- [ ] Check for duplicate dependencies
- [ ] Measure Time to Interactive (TTI) on 3G
- [ ] Identify slow components with React DevTools Profiler
- [ ] Check for unnecessary re-renders
- [ ] Generate report: `docs/performance-analysis.md`

**Investigation Agent:**
- Use Explore agent (thorough mode)
- Run `npm run build` with bundle analyzer
- Check `lighthouse --throttling.cpuSlowdownMultiplier=4`

---

#### US-012: Mobile UX Deep Dive
**Description:** As a developer, I want specific mobile issues identified so I can fix them.

**Acceptance Criteria:**
- [ ] Test touch targets (<48px)
- [ ] Check horizontal scroll issues
- [ ] Test form inputs on iOS Safari
- [ ] Verify viewport meta tag
- [ ] Check for 300ms click delay
- [ ] Test sticky elements behavior
- [ ] Test on real devices: iPhone 13, Pixel 6
- [ ] Generate report: `docs/mobile-ux-issues.md`

**Investigation Agent:**
- Use Explore agent with mobile focus
- Use Chrome DevTools mobile emulation
- Run Lighthouse mobile audit

---

#### US-013: Security Hardening Audit
**Description:** As a developer, I want security vulnerabilities identified so I can fix them.

**Acceptance Criteria:**
- [ ] Check for API key exposure in client code
- [ ] Verify rate limiting effectiveness (load test)
- [ ] Check CSP headers implementation
- [ ] Test for XSS vulnerabilities in user inputs
- [ ] Verify CORS configuration
- [ ] Check for dependency vulnerabilities (`npm audit`)
- [ ] Test environment variable leakage
- [ ] Generate report: `docs/security-audit.md`

**Investigation Agent:**
- Use general-purpose agent
- Run `npm audit`
- Use OWASP ZAP or similar

---

#### US-014: Accessibility WCAG Deep Dive
**Description:** As a developer, I want WCAG 2.1 AA gaps identified so I can achieve full compliance.

**Acceptance Criteria:**
- [ ] Run axe-core on all sections
- [ ] Check color contrast ratios (all text)
- [ ] Verify keyboard navigation (Tab order)
- [ ] Test with screen reader (NVDA/VoiceOver)
- [ ] Check ARIA labels completeness
- [ ] Verify focus indicators visibility
- [ ] Test form error announcements
- [ ] Generate report: `docs/accessibility-gaps.md`

**Investigation Agent:**
- Use Explore agent with accessibility focus
- Run Playwright accessibility tests
- Manual screen reader testing

---

## Functional Requirements

### Quick Wins (FR-QW)
- FR-QW-1: TLDR banner must be visible on all viewport sizes (320px+)
- FR-QW-2: Floating CTA must not overlap content on mobile
- FR-QW-3: Testimonials section must load <100ms after DOM ready
- FR-QW-4: Mobile menu must close on Escape key
- FR-QW-5: Loading skeletons must match final component dimensions

### Major Improvements (FR-MI)
- FR-MI-1: Voice orb tooltip must show only once per user
- FR-MI-2: Systems descriptions must be <15 words each
- FR-MI-3: Inline CTAs must track separately in analytics
- FR-MI-4: Performance detection must work on all modern browsers
- FR-MI-5: Progress indicator must update at 60fps

### Deep Investigation (FR-DI)
- FR-DI-1: Bundle analysis must include tree-shaking recommendations
- FR-DI-2: Mobile testing must cover iOS Safari and Chrome Android
- FR-DI-3: Security audit must test actual API endpoints
- FR-DI-4: Accessibility testing must include keyboard-only navigation

---

## Non-Goals (Out of Scope)

❌ **NOT** creating separate pages (keeping single-page design)
❌ **NOT** rewriting in different framework
❌ **NOT** removing 3D animations entirely (only conditionally disabling)
❌ **NOT** adding blog/CMS system
❌ **NOT** implementing A/B testing framework (future)
❌ **NOT** visual regression testing (future)
❌ **NOT** cross-browser E2E (only Chromium for now)

---

## Technical Considerations

### Performance Budget
- **Total Bundle:** <300KB gzipped (currently ~305KB)
- **Largest Component:** <60KB (GSAP)
- **TTI:** <3s on Slow 4G
- **Lighthouse Score:** 95+ on mobile

### Mobile Strategy
- Mobile-first responsive design
- Conditional 3D rendering based on device capability
- Touch-optimized interactions (48px minimum)
- Reduced motion support

### Deployment Strategy
- Ship incrementally (1-2 stories per day)
- Deploy to Vercel preview URLs
- Manual QA on preview before production
- Keep production stable (rollback if issues)

### Browser Support
- Chrome 90+ (primary target)
- Safari 14+ (iOS users)
- Firefox 88+ (nice-to-have)
- Edge 90+ (nice-to-have)

---

## Success Metrics

### Primary Metrics
- **Engagement Time:** +40% (currently ~2min → target 2.8min)
- **CTA Click Rate:** +50% (more CTAs, better placement)
- **Mobile Bounce Rate:** -30% (better mobile UX)
- **Lighthouse Mobile:** 95+ (currently ~92)

### Secondary Metrics
- **Bundle Size:** -10% (optimize heavy components)
- **Page Load Time:** -20% (faster TTI)
- **Accessibility Score:** 100 (WCAG 2.1 AAA where possible)
- **Security Audit:** Zero high/critical vulnerabilities

### Validation
- Track with Google Analytics
- Monitor Vercel Analytics (Core Web Vitals)
- Manual user testing (5 recruiters)
- A/B test TLDR banner (with/without)

---

## Implementation Plan

### Week 1: Quick Wins + Investigation
**Day 1-2:** Ship US-001 → US-005 (quick wins)
**Day 3-5:** Ship US-006 → US-010 (major improvements)
**Background:** Run US-011 → US-014 (parallel investigation agents)

### Week 2: Deep Fixes
**Day 6-7:** Address performance issues from US-011
**Day 8-9:** Fix mobile UX issues from US-012
**Day 10:** Address security findings from US-013

### Week 3: Polish & Testing
**Day 11-12:** Address accessibility gaps from US-014
**Day 13-14:** Final QA, user testing, analytics validation

---

## Parallel Agent Execution

Run these agents in parallel (background):

```bash
# Agent 1: Performance Analysis (Explore, thorough)
Task: Analyze bundle, identify slow components, measure TTI

# Agent 2: Mobile UX Investigation (Explore, medium)
Task: Test touch targets, scroll issues, form inputs

# Agent 3: Security Audit (General-purpose)
Task: Check vulnerabilities, API exposure, rate limiting

# Agent 4: Accessibility Deep Dive (Explore, thorough)
Task: Run axe-core, test keyboard nav, screen reader
```

**Output:** 4 markdown reports in `docs/` directory

---

## Open Questions

1. Should we add analytics events for each CTA click? (Recommendation: Yes)
2. Should TLDR banner be dismissible permanently or per-session? (Recommendation: Permanent)
3. Should we A/B test testimonials order? (Recommendation: Track manually first)
4. Should mobile menu be always visible or only <768px? (Recommendation: <768px only)
5. Should we add email capture in floating CTA? (Recommendation: No, keep it simple)

---

## Dependencies

### External Services
- Vercel (hosting, analytics)
- Anthropic Claude API (chat feature)
- Supabase (database, dossier storage)
- Upstash Redis (rate limiting)
- Deepgram (voice STT)

### Build Tools
- Next.js 16.1.6
- React 19
- TypeScript 5
- Tailwind CSS 4
- GSAP 3.12.5

### Testing Tools
- Vitest (unit tests)
- Playwright (E2E tests)
- axe-core (accessibility)
- Lighthouse (performance)

---

## Rollout Plan

### Phase 1: Quick Wins (Ship Daily)
1. Deploy US-001 (TLDR) → Verify → Production
2. Deploy US-002 (Floating CTA) → Verify → Production
3. Deploy US-003 (Reorder) → Verify → Production
4. Deploy US-004 (Mobile Nav) → Verify → Production
5. Deploy US-005 (Skeletons) → Verify → Production

### Phase 2: Major Improvements (Ship Every 2 Days)
1. Deploy US-006 + US-007 together → Verify → Production
2. Deploy US-008 → Verify → Production
3. Deploy US-009 + US-010 together → Verify → Production

### Phase 3: Deep Fixes (Based on Reports)
1. Review investigation reports
2. Create new user stories for critical issues
3. Prioritize and implement fixes
4. Deploy in batches

---

## Approval & Sign-off

**Product Owner:** Dico Angelo
**Target Audience:** Technical recruiters, VCs, founding partners
**Success Criteria:** 40% increase in engagement, 50% increase in CTA clicks

**Ready to Start:** ✅ Yes - Begin with US-001

[/PRD]
