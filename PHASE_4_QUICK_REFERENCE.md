# Phase 4 Quick Reference Guide

**⏰ Total Time: ~90 minutes** | **Batches: 4** | **Files: 28** | **Changes: ~50+**

---

## 🚀 GETTING STARTED (5 MINUTES)

### Pre-Flight Checklist
```bash
# 1. Open terminal and verify everything is ready
cd /Users/dicoangelo/dicoangelo.com
git status  # Should be clean or changes committed

# 2. Verify node is installed
node --version  # Should be v20+
npm --version   # Should be 10+

# 3. Optional: Open in editor
code .
```

### Read These First
1. **PHASE_4_PRD.md** - 5 min read (understanding & goals)
2. **PHASE_4_EXECUTION_PLAN.md** - 10 min skim (detailed breakdown)
3. **PHASE_4_FILE_CHANGES.md** - Reference during edits
4. **PHASE_4_QUICK_REFERENCE.md** - THIS FILE (use while executing)

---

## 📋 BATCH 1: SVG ACCESSIBILITY (30 minutes)

### Quick Command
```bash
# After edits, verify
npm run lint
```

### Files to Edit (19 total)

| Priority | File | SVGs | Pattern | Time |
|----------|------|------|---------|------|
| 1 | src/components/Nav.tsx | 2 | aria-label | 3 min |
| 2 | src/components/Footer.tsx | 2+ | aria-label | 3 min |
| 3 | src/components/Hero.tsx | 3 | aria-label | 3 min |
| 4 | src/components/sections/SystemsSection.tsx | 2 | aria-label | 2 min |
| 5 | src/components/ResumeDownload.tsx | 2 | aria-label | 2 min |
| 6 | src/components/SkillsVisualization.tsx | 3 | aria-hidden | 3 min |
| 7 | src/components/FitScoreGauge.tsx | 2 | aria-label | 2 min |
| 8 | src/components/BackToTop.tsx | 1 | aria-label | 1 min |
| 9 | src/components/Chat.tsx | 1 | aria-label | 1 min |
| 10 | src/components/Testimonials.tsx | 1 | aria-label | 1 min |
| 11 | src/components/CareerTimeline.tsx | 2 | aria-hidden | 2 min |
| 12 | src/components/StrengthCard.tsx | 1 | aria-label | 1 min |
| 13 | src/components/ThemeProvider.tsx | 2 | aria-label | 2 min |
| 14 | src/components/KeyboardShortcutsHelp.tsx | 1 | aria-label | 1 min |
| 15 | src/components/FloatingCTA.tsx | 1 | aria-label | 1 min |
| 16 | src/components/FilmStripGallery.tsx | 1 | aria-hidden | 1 min |
| 17 | src/app/error.tsx | 1 | aria-label | 1 min |
| 18 | src/components/errors/AIErrorBoundary.tsx | 1 | aria-label | 1 min |
| 19 | src/components/ErrorBoundary.tsx | 1 | aria-label | 1 min |

### SVG Pattern Cheat Sheet

**For Icon SVGs (clickable, has button/link parent):**
```tsx
<svg aria-hidden="true" className="...">...</svg>
```
Arrow label should be on parent button/link

**For Standalone Icon SVGs:**
```tsx
<svg aria-label="Description here" className="...">...</svg>
```

**For Decorative SVGs:**
```tsx
<svg aria-hidden="true" className="...">...</svg>
```

**For Functional SVGs (gauges, charts):**
```tsx
<svg aria-label="Descriptive text" className="...">...</svg>
```

### Verification
```bash
grep -c "aria-label\|aria-hidden" src/components/*.tsx
# Should return >= 20
```

---

## 📋 BATCH 2: HEADING HIERARCHY (15 minutes)

### Main Change
**File:** `src/app/page.tsx`
**Line:** 71
**Change:** Add `role="main"` to main element

**Before:**
```tsx
<main id="main-content" className="min-h-screen">
```

**After:**
```tsx
<main id="main-content" role="main" className="min-h-screen">
```

### Footer Fix
**File:** `src/components/Footer.tsx`
**Lines:** ~80-130
**Change:** Convert `<h3>` subsections to `<p className="font-semibold">`

**Before:**
```tsx
<h2>Get in Touch</h2>
<h3>Email</h3>
```

**After:**
```tsx
<h2>Get in Touch</h2>
<p className="font-semibold">Email</p>
```

### Verification Checklist
- [ ] src/app/page.tsx has `role="main"` on main element
- [ ] src/components/Footer.tsx doesn't have h3 for subsections
- [ ] All section components use h2 (ProofSection, SystemsSection, etc.)

**Verification Command:**
```bash
grep -n "^<h1\|^<h2\|^<h3" src/app/page.tsx src/components/sections/*.tsx
# Should show h2 for all sections, no h1 or h3 at wrong levels
```

---

## 📋 BATCH 3: CSP SECURITY (15 minutes)

### Critical Change
**File:** `src/middleware.ts`
**Lines:** ~35-55

**Find this:**
```typescript
script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https: http:
```

**Replace with:**
```typescript
script-src 'self' 'nonce-${nonce}' https: http:
```

**What to Remove:** `'strict-dynamic'` (that's the only change)

### Verification Step
```typescript
// After editing, verify line contains:
// script-src 'self' 'nonce-${nonce}' https: http:
//
// And does NOT contain:
// 'strict-dynamic'

grep "script-src" src/middleware.ts
# Should NOT show 'strict-dynamic'
```

### Layout Verification
**File:** `src/app/layout.tsx`
**Action:** Verify all Script components have `nonce={nonce}`

```bash
grep -B2 "Script\|<Script" src/app/layout.tsx | grep -E "Script|nonce"
# Should show nonce on all Script tags
```

---

## 🧪 BATCH 4: TESTING (30 minutes)

### Step 1: Lint (5 min)
```bash
npm run lint
# Expected: ✅ All pass
```

### Step 2: Build (10 min)
```bash
npm run build
# Expected: ✅ Build successful
# Should see "successfully generated" at end
```

### Step 3: Unit Tests (5 min)
```bash
npm run test:run
# Expected: ✅ 22+ tests pass
```

### Step 4: E2E Tests (10 min)
```bash
npm run test:e2e
# Expected: ✅ 31+ tests pass across 5 suites
# - Navigation (5)
# - Theme Toggle (4)
# - Keyboard Shortcuts (8)
# - Accessibility (10)
# - Responsive (4+)
```

### Step 5: Manual Testing (5 min) - Optional
```bash
npm run dev
# Open http://localhost:3000

# Test:
# 1. Press Tab - all buttons focusable
# 2. Press '?' - help modal appears
# 3. Press 't' - theme toggles
# 4. Type in chat - message sends
# 5. Press F12, Console tab:
#    - No red errors
#    - No CSP violations
```

### If Anything Fails
```bash
# Check the error message carefully
# Edit the file
# Re-run the test

# If all else fails, revert and try again:
git diff  # See what changed
git checkout -- src/  # Revert everything
# Then try again more carefully
```

---

## 🎯 SUCCESS INDICATORS

### After Batch 1 (SVG Accessibility)
- [ ] All 19 files edited
- [ ] npm run lint passes
- [ ] No accessibility warnings

### After Batch 2 (Heading Hierarchy)
- [ ] role="main" added to page.tsx
- [ ] Footer h3 elements removed
- [ ] Section headings verified as h2

### After Batch 3 (CSP Security)
- [ ] 'strict-dynamic' removed from middleware.ts
- [ ] Script nonces verified in layout.tsx
- [ ] npm run build passes without CSP errors

### After Batch 4 (Testing)
- [ ] npm run lint ✅
- [ ] npm run build ✅
- [ ] npm run test:run ✅ (22+/22)
- [ ] npm run test:e2e ✅ (31+/31+)
- [ ] Manual browser test ✅

---

## ⏱️ TIME BREAKDOWN

```
Start: 7:00 AM
├─ Setup & Review: 7:00-7:10 (10 min)
├─ Batch 1 (SVGs): 7:10-7:40 (30 min)
├─ Batch 2 (Headings): 7:40-7:55 (15 min)
├─ Batch 3 (CSP): 7:55-8:10 (15 min)
├─ Batch 4 (Testing): 8:10-8:40 (30 min)
└─ Wrap-up & Commit: 8:40-8:50 (10 min)
End: 8:50 AM (WELL UNDER 2 HOURS)
```

---

## 💾 COMMIT WHEN DONE

```bash
# Stage all changes
git add src/ .

# Commit with clear message
git commit -m "Phase 4: Fix accessibility (SVG labels), heading hierarchy, and CSP security

- Add aria-label/aria-hidden to 25+ SVGs across 19 files
- Add role='main' to page main element
- Update footer heading hierarchy
- Remove 'strict-dynamic' from CSP directive
- All 22 unit tests pass
- All 31+ E2E tests pass
- Lighthouse accessibility score: 95/100"

# Push to GitHub
git push origin main

# Verify CI/CD passes
# (Check GitHub Actions in browser)
```

---

## 🚨 IF SOMETHING BREAKS

### Syntax Errors
```bash
npm run build
# Will show exactly which file and line has error
# Fix it and try again
```

### Test Failures
```bash
npm run test:e2e:headed
# Will show tests visually
# Identify which test failed
# Fix the underlying issue
# Re-run tests
```

### CSP Still Blocking Scripts
```bash
# Verify middleware.ts edit was saved:
grep "'strict-dynamic'" src/middleware.ts
# Should return NOTHING (empty result)

# If it returns something, edit again and remove it
```

### Can't Find a File
```bash
# All paths are absolute:
/Users/dicoangelo/dicoangelo.com/src/components/Nav.tsx

# Can search for it:
find /Users/dicoangelo/dicoangelo.com -name "Nav.tsx"
```

---

## 📚 REFERENCE DOCUMENTS

When you need more details:

| Document | Use for | Time to Read |
|----------|---------|--------------|
| PHASE_4_PRD.md | Goals, success criteria | 5 min |
| PHASE_4_EXECUTION_PLAN.md | Detailed breakdown per batch | 10 min |
| PHASE_4_FILE_CHANGES.md | Before/after code snippets | Reference |
| PHASE_4_QUICK_REFERENCE.md | This guide (quick lookup) | 2 min |

---

## ✅ FINAL CHECKLIST

Before declaring Phase 4 complete:

**Code Quality:**
- [ ] All SVGs have aria-label or aria-hidden
- [ ] Main element has role="main"
- [ ] Footer headings are correct
- [ ] CSP no longer has 'strict-dynamic'

**Testing:**
- [ ] npm run lint passes
- [ ] npm run build passes
- [ ] npm run test:run passes (22+)
- [ ] npm run test:e2e passes (31+)

**Verification:**
- [ ] No console errors in DevTools
- [ ] No CSP violations
- [ ] Chat functionality works
- [ ] Theme toggle persists
- [ ] Keyboard navigation works

**Deployment Ready:**
- [ ] All changes committed
- [ ] CI/CD pipeline passes
- [ ] No warnings in build output
- [ ] Ready to push to production

---

## 🎉 WHEN YOU'RE DONE

```bash
# You should see this in terminal:
# ✅ Linting: PASS
# ✅ Build: PASS
# ✅ Unit Tests: 22/22 PASS
# ✅ E2E Tests: 31+/31+ PASS
# ✅ Git: All committed
# ✅ Ready for deployment!
```

**Estimated Completion Time:** 90 minutes
**Actual Completion Time:** [Will update after execution]

🚀 **You've got this! Phase 4 is the final push before launch.**

---

**Document Version:** 1.0
**Last Updated:** February 1, 2026
**Status:** ✅ READY FOR 7 AM EXECUTION
