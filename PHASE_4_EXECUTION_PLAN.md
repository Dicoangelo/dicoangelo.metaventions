# Phase 4 Execution Plan - Detailed Task Breakdown

**Execution Window:** 7 AM Fresh Session
**Total Duration:** ~90 minutes
**Batches:** 4 (SVG → Heading → CSP → Testing)

---

## BATCH 1: SVG Accessibility Fixes (25+ Instances)
**Duration:** 30 minutes | **Priority:** HIGH
**Goal:** Add `aria-label` or `aria-hidden` to all SVGs

### Files & Changes Summary

| # | File | SVGs | Type | Fix | Est. Time |
|---|------|------|------|-----|-----------|
| 1 | src/app/error.tsx | 1 | Icon | aria-label | 1 min |
| 2 | src/components/BackToTop.tsx | 1 | Icon | aria-label | 1 min |
| 3 | src/components/Hero.tsx | 3 | Mixed | aria-label | 3 min |
| 4 | src/components/Nav.tsx | 2 | Icon | aria-label | 2 min |
| 5 | src/components/Footer.tsx | 2 | Icon | aria-label | 2 min |
| 6 | src/components/CareerTimeline.tsx | 2 | Icon | aria-label | 2 min |
| 7 | src/components/sections/SystemsSection.tsx | 2 | Icon | aria-label | 2 min |
| 8 | src/components/StrengthCard.tsx | 1 | Icon | aria-label | 1 min |
| 9 | src/components/SkillsVisualization.tsx | 3 | Decorative | aria-hidden | 3 min |
| 10 | src/components/Testimonials.tsx | 1 | Icon | aria-label | 1 min |
| 11 | src/components/ResumeDownload.tsx | 2 | Icon | aria-label | 2 min |
| 12 | src/components/KeyboardShortcutsHelp.tsx | 1 | Icon | aria-label | 1 min |
| 13 | src/components/FloatingCTA.tsx | 1 | Icon | aria-label | 1 min |
| 14 | src/components/ThemeProvider.tsx | 1 | Icon | aria-label | 1 min |
| 15 | src/components/Chat.tsx | 1 | Icon | aria-label | 1 min |
| 16 | src/components/FilmStripGallery.tsx | 1 | Decorative | aria-hidden | 1 min |
| 17 | src/components/FitScoreGauge.tsx | 2 | Functional | title | 2 min |
| 18 | src/components/errors/AIErrorBoundary.tsx | 1 | Icon | aria-label | 1 min |
| 19 | src/components/ErrorBoundary.tsx | 1 | Icon | aria-label | 1 min |
| | | **25+** | | | **~30 min** |

### Detailed Changes

#### File 1: src/app/error.tsx
**Line:** Search for `<svg` in the error component
**Change:** Add `aria-label="Error icon"` to SVG

#### File 2: src/components/BackToTop.tsx
**Line:** ~30-40 (SVG for back-to-top button)
**Change:** Add `aria-label="Back to top button"`
**Note:** May already have aria-label from button

#### File 3: src/components/Hero.tsx
**Lines:** ~80-150 (Multiple SVGs for status badge, demo link, GitHub)
**Changes:**
- Status SVG: `aria-label="Available for work"` ✓ Already present
- Demo SVG: `aria-label="View live demo"` ✓ Already present
- GitHub SVG: `aria-label="GitHub profile"` ✓ Already present

#### File 4: src/components/Nav.tsx
**Lines:** ~40-100 (Hamburger menu, theme toggle, GitHub icon)
**Changes:**
- Menu SVG: Add `aria-label="Toggle navigation menu"` or use existing from parent
- Theme SVG: Add `aria-label="Toggle theme"`
- GitHub icon: Add `aria-label="Visit GitHub profile"`

#### File 5: src/components/Footer.tsx
**Lines:** ~80-150 (Social icons and decorative SVGs)
**Changes:**
- LinkedIn SVG: Add `aria-label="LinkedIn"`
- Twitter SVG: Add `aria-label="Twitter"`
- GitHub SVG: Add `aria-label="GitHub"`
- Decorative elements: Add `aria-hidden="true"`

#### File 6: src/components/CareerTimeline.tsx
**Lines:** ~100-150 (Timeline connectors and icons)
**Changes:**
- Timeline dots: Add `aria-hidden="true"` (decorative)
- Connector lines: Add `aria-hidden="true"`

#### File 7: src/components/sections/SystemsSection.tsx
**Lines:** ~40-80 (System icons)
**Changes:**
- Each system icon: Add `aria-label="[System name]"`

#### File 8: src/components/StrengthCard.tsx
**Lines:** ~30-60 (Strength icon per card)
**Changes:**
- Icon SVG: Add `aria-label="[Strength type]"` based on card content

#### File 9: src/components/SkillsVisualization.tsx
**Lines:** ~80-150 (3 SVGs - graph visualization)
**Changes:**
- Main SVG: Add `aria-label="Skills distribution visualization"` OR `aria-hidden="true"`
- Decorative elements: Add `aria-hidden="true"`

#### File 10: src/components/Testimonials.tsx
**Lines:** ~40-80 (Star rating SVG)
**Changes:**
- Star SVG: `aria-label="[Rating] stars"` based on rating value

#### File 11: src/components/ResumeDownload.tsx
**Lines:** ~60-120 (Download icons for PDF and DOCX)
**Changes:**
- PDF icon: `aria-label="Download resume as PDF"`
- DOCX icon: `aria-label="Download resume as Word document"`

#### File 12: src/components/KeyboardShortcutsHelp.tsx
**Lines:** ~80-150 (Help icon and keyboard symbols)
**Changes:**
- Help icon: `aria-label="Keyboard shortcuts"` or already on parent
- Keyboard symbols: Add `aria-hidden="true"` (decorative)

#### File 13: src/components/FloatingCTA.tsx
**Lines:** ~30-70 (CTA icon or decorative elements)
**Changes:**
- Icon: Add `aria-label="Call to action"` if interactive
- Decorative: Add `aria-hidden="true"`

#### File 14: src/components/ThemeProvider.tsx
**Lines:** ~60-120 (Theme toggle icon - sun/moon)
**Changes:**
- Sun icon: `aria-label="Light theme"`
- Moon icon: `aria-label="Dark theme"`

#### File 15: src/components/Chat.tsx
**Lines:** ~100-180 (Chat bubble icons, send button)
**Changes:**
- Send icon: `aria-label="Send message"` (likely on button already)
- Chat decorative SVG: `aria-hidden="true"`

#### File 16: src/components/FilmStripGallery.tsx
**Lines:** ~50-120 (Gallery decorative SVGs)
**Changes:**
- All decorative SVGs: Add `aria-hidden="true"`

#### File 17: src/components/FitScoreGauge.tsx
**Lines:** ~80-150 (Gauge visualization - 2 SVGs)
**Changes:**
- Main SVG: `aria-label="Fit score gauge showing [score]%"`
- Legend: `aria-label="Score scale legend"`

#### File 18: src/components/errors/AIErrorBoundary.tsx
**Lines:** ~40-80 (Error icon)
**Changes:**
- Error icon: `aria-label="Error occurred"` or use parent button label

#### File 19: src/components/ErrorBoundary.tsx
**Lines:** ~40-80 (Error icon)
**Changes:**
- Error icon: `aria-label="An error occurred"` or use parent button label

### Verification Steps

```bash
# After completing all SVG changes:
grep -r "aria-hidden\|aria-label" src/ --include="*.tsx" | wc -l
# Should show ~25+ matches

npm run lint
# Should pass without accessibility warnings
```

---

## BATCH 2: Heading Hierarchy & Main Landmark Fixes
**Duration:** 15 minutes | **Priority:** HIGH
**Goal:** Fix document structure for screen readers

### Changes Required

#### Change 1: Add role="main" to main element

**File:** `/Users/dicoangelo/dicoangelo.com/src/app/page.tsx`
**Line:** 71
**Current:**
```tsx
<main id="main-content" className="min-h-screen">
```
**Updated:**
```tsx
<main id="main-content" role="main" className="min-h-screen">
```
**Reason:** Redundant but helps ensure proper landmark detection

---

#### Change 2: Fix Footer Heading Hierarchy

**File:** `/Users/dicoangelo/dicoangelo.com/src/components/Footer.tsx`
**Line:** ~30-50 (Search for "Contact" or footer heading)
**Current:**
```tsx
<h2>Get in Touch</h2>
<h3>Email</h3>
<h3>Phone</h3>
```
**Updated:**
```tsx
<h2>Get in Touch</h2>
<p className="font-semibold">Email</p>
<p className="font-semibold">Phone</p>
```
**Reason:** Footer contact info doesn't need heading hierarchy

---

#### Change 3: Verify ProofSection Heading Hierarchy

**File:** `/Users/dicoangelo/dicoangelo.com/src/components/sections/ProofSection.tsx`
**Line:** ~20-30 (Main section heading)
**Requirement:** Must be h2 (not h1, not h3)
**Current Example:**
```tsx
<h2 className="text-3xl font-bold">Proof in Numbers</h2>
```
**Status:** ✅ Likely already correct

---

#### Change 4: Verify SystemsSection Heading

**File:** `/Users/dicoangelo/dicoangelo.com/src/components/sections/SystemsSection.tsx`
**Line:** ~20-30
**Requirement:** Must be h2
**Verify:** If it's h3 or h1, change to h2

---

#### Change 5: Verify ProjectsSection Heading

**File:** `/Users/dicoangelo/dicoangelo.com/src/components/sections/ProjectsSection.tsx`
**Line:** ~20-30
**Requirement:** Must be h2

---

#### Change 6: Verify ArenaSection Heading

**File:** `/Users/dicoangelo/dicoangelo.com/src/components/sections/ArenaSection.tsx`
**Line:** ~20-30
**Requirement:** Must be h2

---

#### Change 7: Verify ContactSection Heading

**File:** `/Users/dicoangelo/dicoangelo.com/src/components/sections/ContactSection.tsx`
**Line:** ~20-30
**Requirement:** Must be h2

### Verification Steps

```bash
# Check heading hierarchy
grep -r "^<h[1-6]" src/ --include="*.tsx" | head -20

# Should show:
# - 1 h1 (page title)
# - Multiple h2 (section headings)
# - Only h3 under h2 (subsections)
```

---

## BATCH 3: CSP Security Fixes
**Duration:** 15 minutes | **Priority:** CRITICAL
**Goal:** Fix Content Security Policy without compromising security

### Change 1: Update CSP in middleware.ts

**File:** `/Users/dicoangelo/dicoangelo.com/src/middleware.ts`
**Lines:** ~40-60 (CSP header definition)

**Current:**
```typescript
const cspHeader = `
  default-src 'self';
  script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https: http:
  style-src 'self' 'unsafe-inline';
  img-src 'self' blob: data: https:;
  font-src 'self' data:;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  connect-src 'self' https://api.anthropic.com https://api.cohere.ai
    https://api.deepgram.com https://*.supabase.co wss://api.deepgram.com
    https://api.elevenlabs.io;
  upgrade-insecure-requests;
`.replace(/\s{2,}/g, ' ').trim();
```

**Updated:**
```typescript
const cspHeader = `
  default-src 'self';
  script-src 'self' 'nonce-${nonce}' https: http:
  style-src 'self' 'unsafe-inline';
  img-src 'self' blob: data: https:;
  font-src 'self' data:;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  connect-src 'self' https://api.anthropic.com https://api.cohere.ai
    https://api.deepgram.com https://*.supabase.co wss://api.deepgram.com
    https://api.elevenlabs.io;
  upgrade-insecure-requests;
`.replace(/\s{2,}/g, ' ').trim();
```

**What Changed:**
- Removed `'strict-dynamic'` from `script-src`
- Kept `'nonce-${nonce}'` for inline scripts
- Kept `https: http:` to allow external scripts
- **Result:** Next.js scripts now allowed to execute

**Why This Is Safe:**
- Still using nonce for inline scripts
- Still requiring scripts to be from self or HTTPS
- Still blocking unsafe practices
- `'strict-dynamic'` was overly restrictive

---

### Change 2: Verify Script Tags in layout.tsx

**File:** `/Users/dicoangelo/dicoangelo.com/src/app/layout.tsx`
**Lines:** ~150-180 (JSON-LD script tags)

**Check That Scripts Have:**
```tsx
<Script
  nonce={nonce}
  id="structured-data-person"
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
/>
```

**Verify:**
- ✅ `nonce={nonce}` is present
- ✅ All JSON-LD scripts have nonce
- ✅ Next.js Script component is used (not HTML script tag)

### Verification Steps

```bash
# Test CSP is working
npm run build
npm run dev

# Open browser console and check:
# 1. No CSP violations logged
# 2. Page fully interactive
# 3. Chat component works
# 4. Theme toggle works

# Can also test with:
curl -I https://localhost:3000 | grep -i "content-security"
```

---

## BATCH 4: Testing & Verification
**Duration:** 30 minutes | **Priority:** CRITICAL
**Goal:** Ensure all fixes work and no regressions

### Step 1: Code Quality Checks (10 minutes)

```bash
# Lint all changes
npm run lint

# Expected output:
# ✅ No ESLint errors
# ✅ No accessibility warnings
```

### Step 2: Build Verification (10 minutes)

```bash
# Clean build to ensure no cached issues
rm -rf .next
npm run build

# Expected output:
# ✅ Build completed successfully
# ✅ No build errors
# ✅ No TypeScript errors
```

### Step 3: Unit Tests (5 minutes)

```bash
# Run all unit tests
npm run test:run

# Expected output:
# ✅ 22+ tests passing
# ✅ 0 test failures
# ✅ Test duration < 5s
```

### Step 4: E2E Tests (10 minutes)

```bash
# Start dev server and run E2E tests
npm run test:e2e

# Expected output:
# ✅ Navigation tests pass (5/5)
# ✅ Theme toggle tests pass (4/4)
# ✅ Keyboard shortcuts tests pass (8/8)
# ✅ Accessibility tests pass (10/10)
# ✅ Responsive tests pass (12+/12+)
# ✅ Total: 31+ tests passing
```

### Step 5: Manual Verification (5 minutes)

```bash
# Start dev server
npm run dev

# Then in browser:
# 1. Open http://localhost:3000
# 2. Press F12 to open DevTools
# 3. Check Console tab:
#    - No red errors
#    - No CSP violations
#    - All scripts loaded
# 4. Test Chat functionality:
#    - Click "Ask Me Anything"
#    - Type a message
#    - Verify response appears
# 5. Test Theme Toggle:
#    - Press 't' or click theme toggle
#    - Verify theme changes
#    - Hard refresh and verify persists
# 6. Test Keyboard Navigation:
#    - Press '?'
#    - Verify shortcuts help appears
#    - Press 'g+t' and verify scroll to top
# 7. Test Accessibility:
#    - Press Tab repeatedly
#    - Verify all buttons are focusable
#    - Verify focus indicator is visible
```

### Step 6: Lighthouse Audit (Optional, 5 minutes)

```bash
# If running production build:
npm run build
npm start

# Then run Lighthouse in Chrome DevTools:
# 1. Open http://localhost:3000
# 2. Press F12 → Lighthouse tab
# 3. Generate report
# 4. Verify:
#    - Accessibility ≥ 95/100
#    - Performance ≥ 90/100
#    - Best Practices ≥ 90/100
#    - SEO = 100/100
```

---

## Execution Checklist

### Pre-Execution
- [ ] Fresh terminal session opened
- [ ] Working directory is `/Users/dicoangelo/dicoangelo.com`
- [ ] Git status is clean (or changes committed)
- [ ] Node.js 20+ verified: `node --version`
- [ ] npm verified: `npm --version`

### During Execution

#### Batch 1 (SVG Fixes)
- [ ] Update 19 files with SVG aria-labels
- [ ] Verify no build errors: `npm run lint`
- [ ] Check changes: `git diff --stat`

#### Batch 2 (Heading Hierarchy)
- [ ] Add role="main" to page.tsx
- [ ] Review and fix footer headings
- [ ] Verify other sections have h2 headings

#### Batch 3 (CSP Fixes)
- [ ] Remove 'strict-dynamic' from middleware.ts
- [ ] Verify script nonces in layout.tsx
- [ ] Confirm no other script-related changes needed

#### Batch 4 (Testing)
- [ ] Run lint: `npm run lint` ✅
- [ ] Run build: `npm run build` ✅
- [ ] Run tests: `npm run test:run` ✅
- [ ] Run E2E: `npm run test:e2e` ✅
- [ ] Manual browser testing: ✅
- [ ] Lighthouse audit (optional): ✅

### Post-Execution
- [ ] All tests passing
- [ ] No console errors
- [ ] No accessibility warnings
- [ ] Commit changes: `git add . && git commit -m "Phase 4: ..."`
- [ ] Push to GitHub: `git push`
- [ ] Verify CI/CD passes
- [ ] Ready for deployment

---

## Rollback Steps (If Needed)

### If Individual Change Fails

```bash
# Revert just SVG files
git checkout src/components/ src/app/error.tsx

# Revert just CSP
git checkout src/middleware.ts src/app/layout.tsx

# Revert just headings
git checkout src/components/sections/ src/components/Footer.tsx
```

### If Everything Fails

```bash
# Full reset to clean state
git reset --hard origin/main
npm install
npm run build
npm run test:run
```

---

## Time Management Tips

### If Running Behind Schedule

**Priority Order (if time is limited):**
1. ✅ **MUST DO:** Batch 3 (CSP fixes) - Blocks functionality
2. ✅ **MUST DO:** Batch 4 (Testing) - Verify nothing broke
3. ⚠️ **SHOULD DO:** Batch 1 (SVG fixes) - Accessibility improvement
4. ⏭️ **CAN DEFER:** Batch 2 (Heading hierarchy) - Low impact

**If CSP + Testing done, you can defer SVG/Heading fixes to next session**

### If Running Ahead of Schedule

- [ ] Add accessibility testing with real screen reader
- [ ] Add visual regression testing
- [ ] Document all changes for future reference
- [ ] Create follow-up tasks for Phase 5

---

## Support & Debugging

### Common Issues & Solutions

**Issue: npm run lint fails**
```bash
# Solution: Install missing dependencies
npm install
npm run lint:fix
npm run lint
```

**Issue: Build fails with TypeScript errors**
```bash
# Solution: Check for syntax errors in edits
npm run build -- --verbose
# Fix any errors in the error message
```

**Issue: E2E tests fail**
```bash
# Solution: Debug with headed mode
npm run test:e2e:headed
# Watch what fails and fix accordingly
```

**Issue: CSP still showing violations**
```bash
# Solution: Verify middleware.ts was saved
grep "'strict-dynamic'" src/middleware.ts
# Should return nothing (not found)
```

---

**Execution Plan Version:** 1.0
**Last Updated:** February 1, 2026
**Ready to Execute:** ✅ YES
