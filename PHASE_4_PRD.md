# Phase 4 PRD: Final Accessibility & Performance Optimization

**Status:** Execution Plan Ready
**Target Deploy Window:** 7 AM Session (Fresh)
**Session Capacity Required:** 2 hours (6% remaining → New session)
**Expected Completion:** ~90 minutes of focused work

---

## Executive Summary

Phase 4 is the final optimization phase before production launch. It addresses three critical categories of issues identified in the Lighthouse audit and axe-core accessibility checks:

1. **SVG Accessibility** - 25+ inline SVGs missing accessible names and descriptions
2. **Heading Hierarchy & Main Landmark** - Verification and fixes for proper document structure
3. **GSAP Performance** - Ensure animation system doesn't impact Core Web Vitals
4. **CSP Security** - Fix critical blocking issue preventing script execution

**Success Criteria:**
- ✅ All SVGs have proper `aria-label` or `<title>` elements
- ✅ Main landmark properly detected by assistive technologies
- ✅ Heading hierarchy is correct throughout page
- ✅ CSP allows Next.js scripts without violations
- ✅ Lighthouse Accessibility score remains ≥95/100
- ✅ No performance regression (CLS = 0, LCP < 2.5s)
- ✅ E2E tests pass (31+ tests)
- ✅ Unit tests pass (22+ tests)

---

## Problem Statement

### Current State
- **Lighthouse Accessibility Score:** 95/100 (Good, but can be better)
- **CSP Violations:** 38+ blocking Next.js scripts and JSON-LD
- **SVG Accessibility:** 25+ SVGs missing `aria-label` or descriptions
- **Main Landmark:** False positive report (likely due to CSP blocking JS)
- **Heading Hierarchy:** Needs verification across refactored sections

### Issues Found
1. **SVG Elements** - Decorative SVGs lack accessible names
2. **Content Security Policy** - `'strict-dynamic'` blocking all scripts
3. **Page Structure** - Main landmark not properly announced
4. **Heading Flow** - Footer section may have improper hierarchy

### Impact
- Screen reader users cannot understand decorative SVGs
- Application functionality blocked by CSP violations
- Cannot verify page structure without proper landmarks
- Potential WCAG 2.1 AA violations

---

## Solution Overview

### Batch 1: SVG Accessibility Fixes (25+ instances)
**Goal:** Make all SVGs accessible to screen readers

**Files to Update:**
```
19 files with 25+ SVG instances:
- src/app/error.tsx (1 SVG)
- src/components/BackToTop.tsx (1 SVG)
- src/components/Hero.tsx (3 SVGs)
- src/components/Nav.tsx (2 SVGs)
- src/components/Footer.tsx (2 SVGs)
- src/components/CareerTimeline.tsx (2 SVGs)
- src/components/sections/SystemsSection.tsx (2 SVGs)
- src/components/StrengthCard.tsx (1 SVG)
- src/components/SkillsVisualization.tsx (3 SVGs)
- src/components/Testimonials.tsx (1 SVG)
- src/components/ResumeDownload.tsx (2 SVGs)
- src/components/KeyboardShortcutsHelp.tsx (1 SVG)
- src/components/FloatingCTA.tsx (1 SVG)
- src/components/ThemeProvider.tsx (1 SVG)
- src/components/Chat.tsx (1 SVG)
- src/components/FilmStripGallery.tsx (1 SVG)
- src/components/FitScoreGauge.tsx (2 SVGs)
- src/components/errors/AIErrorBoundary.tsx (1 SVG)
- src/components/ErrorBoundary.tsx (1 SVG)
```

**Fix Pattern:**
- Decorative SVGs → Add `aria-hidden="true"`
- Icon SVGs → Add `aria-label="..."` with meaningful description
- Functional SVGs → Add `<title>` element inside SVG

### Batch 2: Heading Hierarchy & Landmark Fixes
**Goal:** Ensure proper document structure for assistive technologies

**Key Changes:**
1. Add `role="main"` to main element
2. Verify heading hierarchy (h1 → h2 → h3)
3. Update Footer heading levels
4. Ensure nav landmarks properly marked

**Files to Update:**
```
- src/app/page.tsx (main element)
- src/components/Footer.tsx (heading levels)
- src/components/sections/ProofSection.tsx (heading hierarchy)
- src/components/sections/SystemsSection.tsx (heading hierarchy)
- src/components/sections/ProjectsSection.tsx (heading hierarchy)
- src/components/sections/ArenaSection.tsx (heading hierarchy)
- src/components/sections/ContactSection.tsx (heading hierarchy)
```

### Batch 3: CSP Security Fixes
**Goal:** Allow Next.js scripts while maintaining security

**Critical Fix:**
- Update `script-src` CSP directive to not block Next.js chunks
- Add nonce to inline scripts (JSON-LD)
- Ensure Anthropic API calls still work

**Files to Update:**
```
- src/middleware.ts (CSP configuration)
- src/app/layout.tsx (add nonce to scripts)
```

### Batch 4: Verification & Testing
**Goal:** Ensure all fixes work and no regressions

**Tests to Run:**
```bash
npm run lint
npm run build
npm run test
npm run test:e2e
npm run test:e2e:ui (if needed for debugging)
```

**Verification Checklist:**
- ✅ Build passes without errors
- ✅ All tests pass (22 unit + 31 E2E)
- ✅ Lighthouse audit shows accessibility ≥95/100
- ✅ No CSP violations in console
- ✅ All pages load and function correctly

---

## Scope & Exclusions

### In Scope
✅ SVG accessibility fixes (25+ instances)
✅ Heading hierarchy verification
✅ Main landmark role attribute
✅ CSP directive updates
✅ Testing and verification

### Out of Scope (Phase 5+)
❌ Visual regression testing
❌ Extended browser testing (Firefox, Safari)
❌ Mobile device testing
❌ Additional animation enhancements
❌ Database schema changes

---

## Technical Details

### SVG Accessibility Pattern

**For Decorative SVGs:**
```tsx
<svg aria-hidden="true" className="...">
  {/* No interactive elements */}
</svg>
```

**For Icon SVGs:**
```tsx
<svg aria-label="Description of icon" className="...">
  {/* Path and shapes */}
</svg>
```

**For Functional SVGs:**
```tsx
<svg className="...">
  <title>Meaningful description</title>
  {/* Paths and interactive elements */}
</svg>
```

### CSP Fix Pattern

**Current (Broken):**
```typescript
script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https: http:
```

**Fixed (Works with Next.js):**
```typescript
script-src 'self' 'nonce-${nonce}' https: http:
// Remove 'strict-dynamic' to allow Next.js chunks
```

### Heading Hierarchy

**Correct Structure:**
```
<h1>Page Title (only 1 per page)</h1>
  <h2>Major Section</h2>
    <h3>Subsection</h3>
    <h3>Subsection</h3>
  <h2>Another Major Section</h2>
    <h3>Subsection</h3>
```

---

## Success Metrics

| Metric | Current | Target | Pass/Fail |
|--------|---------|--------|-----------|
| Accessibility Score | 95/100 | ≥95/100 | ✅ |
| CSP Violations | 38+ | 0 | ✅ |
| SVGs with aria-label/title | 0% | 100% | ✅ |
| Main landmark detected | ❌ | ✅ | ✅ |
| Heading hierarchy valid | ⚠️ | ✅ | ✅ |
| LCP | 1.1s | <2.5s | ✅ |
| CLS | 0.0 | <0.1 | ✅ |
| Unit Tests | 22/22 | 22/22 | ✅ |
| E2E Tests | 31+ | 31+ | ✅ |

---

## Timeline & Effort

### Batch 1: SVG Accessibility (25 minutes)
- 25+ SVGs × 1 minute each = 25 min
- Verification = 5 min
- **Total: 30 minutes**

### Batch 2: Heading Hierarchy (15 minutes)
- Update 7 files with heading fixes = 10 min
- Verification = 5 min
- **Total: 15 minutes**

### Batch 3: CSP Security (15 minutes)
- Update middleware.ts = 5 min
- Update layout.tsx = 5 min
- Testing = 5 min
- **Total: 15 minutes**

### Batch 4: Testing & Verification (25 minutes)
- Lint and build = 10 min
- Unit tests = 5 min
- E2E tests = 10 min
- Final verification = 5 min
- **Total: 30 minutes**

**Grand Total: 90 minutes** (with 30 min buffer = 2 hours ideal session)

---

## Dependencies & Prerequisites

### Before Starting
- ✅ Fresh session with full capacity
- ✅ Git repository clean (commit any pending changes)
- ✅ Node.js 20+ installed
- ✅ npm dependencies up to date
- ✅ Dev server can run without errors

### External Dependencies
- None (all changes are internal)

### Blocking Issues
- ⚠️ CSP fix must complete before testing can verify functionality

---

## Risk Assessment

### Low Risk (SVG Updates)
- Simple attribute additions
- No logic changes
- Easy to revert if needed

### Medium Risk (Heading Hierarchy)
- May affect styling if CSS relies on heading types
- But changes are semantic, not structural
- All tests should catch regressions

### High Risk (CSP Changes)
- If CSP is too permissive, security regresses
- If CSP is too restrictive, app breaks
- **Mitigation:** Test immediately after each change

---

## Rollback Plan

### If Issues Occur

**SVG Fixes:**
```bash
git checkout src/components/ src/app/
npm install
```

**CSP Fixes:**
```bash
git checkout src/middleware.ts src/app/layout.tsx
npm run build
npm run dev
```

**Full Rollback:**
```bash
git reset --hard origin/main
npm install
```

---

## Sign-Off & Approval

**PRD Status:** ✅ READY FOR EXECUTION
**Prepared by:** Claude Code
**Date Prepared:** February 1, 2026
**Target Start:** February 1, 2026 at 7:00 AM
**Expected Completion:** February 1, 2026 at ~9:00 AM

---

## Next Steps After Phase 4

### Phase 5 (Future)
- Browser compatibility testing (Firefox, Safari, Edge)
- Mobile device testing (BrowserStack)
- Visual regression testing (Percy, VRT)
- Performance optimization (code splitting, tree shaking)

### Post-Launch Monitoring
- Daily performance monitoring
- Weekly accessibility audits
- Monthly security reviews
- Quarterly user feedback collection

---

**Document Version:** 1.0
**Last Updated:** February 1, 2026
**Next Review:** After execution complete
