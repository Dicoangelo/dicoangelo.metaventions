# Phase 4: Master Execution Checklist ✅

**Status:** Ready for 7 AM Execution
**Total Time:** 90 minutes (7:00 AM - 8:50 AM)
**Session:** Fresh start with full token budget
**Goal:** Complete Phase 4 and launch site to users

---

## 📦 What You Have (6 Documents - 78 KB)

### 1. **START HERE** 👈 Open This First
📄 **PHASE_4_START_HERE.md** (9.2 KB)
- Your navigation hub
- Quick timeline overview
- How to use all other documents
- Progress tracker

### 2. **EXECUTIVE SUMMARY** - High Level View
📄 **PHASE_4_EXECUTIVE_SUMMARY.md** (12 KB)
- What Phase 4 accomplishes
- Deployment readiness checklist
- Why it matters before launch
- Risk assessment and rollback plan

### 3. **PRD** - The Requirements
📄 **PHASE_4_PRD.md** (9.1 KB)
- Product Requirements Document
- Goals and success criteria
- Technical specifications
- Scope and dependencies

### 4. **EXECUTION PLAN** - Detailed Steps
📄 **PHASE_4_EXECUTION_PLAN.md** (16 KB)
- 4 batches with step-by-step instructions
- Exact file paths and line numbers
- Time estimates per batch
- Verification steps after each batch

### 5. **FILE CHANGES** - The Code
📄 **PHASE_4_FILE_CHANGES.md** (23 KB)
- 28 files mapped with exact changes
- Before/after code snippets
- Copy-paste ready
- 50+ individual changes documented

### 6. **QUICK REFERENCE** - During Execution
📄 **PHASE_4_QUICK_REFERENCE.md** (9.5 KB)
- Fast lookup guide
- Commands to run
- Troubleshooting tips
- Success indicators

---

## 🎯 Phase 4 Breakdown

### **Batch 1: SVG Accessibility (30 min)**
**Files:** 19 components
**Changes:** 25+ SVG elements
**Task:** Add aria-hidden="true" to decorative SVGs

**Files to modify:**
- src/components/Nav.tsx
- src/components/Footer.tsx
- src/components/Hero.tsx
- src/components/FloatingCTA.tsx
- src/components/KeyboardShortcutsHelp.tsx
- src/components/SkillsVisualization.tsx
- src/components/sections/SystemsSection.tsx
- src/components/Testimonials.tsx
- src/components/BackToTop.tsx
- src/components/errors/AIErrorBoundary.tsx
- src/components/FilmStripGallery.tsx
- src/components/CareerTimeline.tsx
- src/components/ResumeDownload.tsx
- src/components/StrengthCard.tsx
- src/components/ThemeProvider.tsx
- src/components/Chat.tsx
- src/components/FitScoreGauge.tsx
- + 2 more

---

### **Batch 2: Heading Hierarchy & Landmarks (15 min)**
**Files:** 7 components
**Changes:** Main element + heading structure
**Task:** Fix h1/h2/h3 hierarchy, add role="main"

**Files to modify:**
- src/app/page.tsx (add role="main")
- src/components/Footer.tsx (h3→p, h4→h2/h3)
- src/components/sections/SkillsVisualization.tsx (verify hierarchy)
- src/components/sections/SystemsSection.tsx (verify hierarchy)
- src/components/sections/ProjectsSection.tsx (verify hierarchy)
- src/components/CareerTimeline.tsx (verify hierarchy)
- src/components/sections/ArenaSection.tsx (verify hierarchy)

---

### **Batch 3: CSP Security (15 min)**
**Files:** 2 files
**Changes:** Remove 'strict-dynamic' directive
**Task:** Fix CSP blocking JavaScript execution

**Files to modify:**
- src/middleware.ts (ALREADY FIXED - verify)
- Verify no other CSP issues

---

### **Batch 4: Testing & Verification (30 min)**
**Task:** Run full test suite and verify all changes
**Steps:**
1. Build: `npm run build`
2. Test: `npm test`
3. Local test: `npm run dev`
4. Deploy: `vercel --prod`
5. Final audit: Visit https://dicoangelo.vercel.app

---

## ✅ Pre-Execution Checklist (Do These First)

- [ ] Read PHASE_4_START_HERE.md (5 min)
- [ ] Check git status: `git status`
- [ ] Verify no uncommitted changes
- [ ] Verify npm is installed: `npm --version`
- [ ] Verify node: `node --version` (should be 18+)
- [ ] Run build test: `npm run build` (should pass)
- [ ] Open terminal in /Users/dicoangelo/dicoangelo.com/

---

## 📋 Batch 1: SVG Accessibility Checklist

**Total Changes:** 25+ SVG elements across 19 files

**Quick Reference for Batch 1:**

| File | Line(s) | Change | Status |
|------|---------|--------|--------|
| Nav.tsx | 79-91 | Add aria-hidden to menu SVG | ⏳ |
| Footer.tsx | 23-45 | Add aria-hidden to social SVGs | ⏳ |
| Hero.tsx | 106-137 | Add aria-hidden to button SVGs | ⏳ |
| FloatingCTA.tsx | 100-127 | Add aria-hidden to close/bolt icons | ⏳ |
| KeyboardShortcutsHelp.tsx | 86 | Add aria-hidden to close icon | ⏳ |
| SkillsVisualization.tsx | 103-105 | Add aria-hidden to badge icon | ⏳ |
| SystemsSection.tsx | 52-55, 133-135, 153-155 | Add aria-hidden to 3 info icons | ⏳ |
| Testimonials.tsx | 74-80, 109-111, 122-124 | Add aria-hidden to quote/link/star | ⏳ |
| BackToTop.tsx | 48-60 | Add aria-hidden to chevron | ⏳ |
| AIErrorBoundary.tsx | 32-43 | Add aria-hidden to warning icon | ⏳ |
| FilmStripGallery.tsx | 197-209, 223-235 | Add aria-hidden to arrow icons | ⏳ |
| CareerTimeline.tsx | 145-147 | Add aria-hidden to clock icon | ⏳ |
| ResumeDownload.tsx | 51-53, 107-110, 115-117, 133-135 | Add aria-hidden to 4 icons | ⏳ |
| StrengthCard.tsx | 46-58 | Add aria-hidden to checkmark | ⏳ |
| ThemeProvider.tsx | 83-104, 106-120 | Add aria-hidden to sun/moon | ⏳ |
| Chat.tsx | 175 | Add aria-hidden to bubble icon | ⏳ |
| + 3 more | Various | Various SVGs | ⏳ |

---

## 📋 Batch 2: Heading Hierarchy Checklist

**Total Changes:** 7+ files

| File | Line | Change | Status |
|------|------|--------|--------|
| page.tsx | 71 | Add role="main" to main element | ⏳ |
| Footer.tsx | 64 | Change h3 to p (brand) | ⏳ |
| Footer.tsx | 92, 115 | Change h4 to h2 (sections) | ⏳ |
| SkillsViz.tsx | 165 | Verify h3 "Certifications" hierarchy | ✓ |
| SystemsSection.tsx | All | Verify h2→h3→h4 structure | ✓ |
| ProjectsSection.tsx | All | Verify h2→h3→h4 structure | ✓ |
| CareerTimeline.tsx | All | Verify h2→h3→h4 structure | ✓ |

---

## 📋 Batch 3: CSP Security Checklist

| Task | Status | Notes |
|------|--------|-------|
| Remove 'strict-dynamic' from middleware.ts | ✅ DONE | Already fixed on 2/1 |
| Verify CSP header in production | ⏳ | Check with curl |
| Test Chat feature works | ⏳ | Test on deployed site |
| Test JD Analyzer works | ⏳ | Test on deployed site |
| Verify no CSP errors in console | ⏳ | Open DevTools |

---

## 📋 Batch 4: Testing & Verification Checklist

### Build & Test
- [ ] Run: `npm run build` → Should pass ✓
- [ ] Run: `npm test` → All tests pass ✓
- [ ] Check no TypeScript errors
- [ ] Check no ESLint errors

### Local Verification
- [ ] Run: `npm run dev` → Server starts
- [ ] Visit: http://localhost:3000
- [ ] Test Chat feature (send message)
- [ ] Test JD Analyzer (paste job description)
- [ ] Test keyboard navigation (Tab through page)
- [ ] Test on mobile viewport (DevTools)

### Deployment
- [ ] Run: `vercel --prod` → Deploy succeeds
- [ ] Wait for build to complete (~1-2 min)
- [ ] Visit: https://dicoangelo.vercel.app
- [ ] Verify no console errors
- [ ] Verify interactive features work

### Final Audit
- [ ] All SVGs have aria-hidden/aria-label
- [ ] All headings proper hierarchy
- [ ] Main element has role="main"
- [ ] CSP not blocking scripts
- [ ] No console errors

---

## 🛠️ Commands You'll Need

```bash
# Build
npm run build

# Test
npm test

# Run locally
npm run dev

# Deploy to production
vercel --prod

# Check git status
git status

# Commit changes
git add .
git commit -m "Phase 4: SVG accessibility, heading hierarchy, CSP fixes"

# Push to GitHub
git push origin main
```

---

## ⏰ Timeline

| Time | Task | Duration |
|------|------|----------|
| 7:00 | Pre-execution checklist | 5 min |
| 7:05 | Read PHASE_4_START_HERE.md | 5 min |
| 7:10 | **Batch 1: SVG Accessibility** | 30 min |
| 7:40 | **Batch 2: Heading Hierarchy** | 15 min |
| 7:55 | **Batch 3: CSP Security** | 15 min |
| 8:10 | **Batch 4: Testing & Verification** | 30 min |
| 8:40 | Final deployment | 10 min |
| 8:50 | ✅ Phase 4 Complete | |

---

## 🎯 Success Criteria

When you're done, you should have:

✅ All 25+ SVGs with proper accessibility attributes
✅ Main element landmark properly detected
✅ Heading hierarchy correct throughout
✅ CSP not blocking any scripts
✅ All tests passing (22 unit + 31 E2E)
✅ Zero console errors
✅ Site fully interactive and accessible
✅ Production deployment successful

---

## 🚀 After Phase 4 Complete

1. **Rotate API Keys** (as planned)
2. **Deploy with new keys** via `vercel --prod`
3. **Launch to users** - site is production-ready!

---

## 📚 Document Navigation

**If you need...**
- Quick overview → Read PHASE_4_START_HERE.md
- High-level summary → Read PHASE_4_EXECUTIVE_SUMMARY.md
- Requirements document → Read PHASE_4_PRD.md
- Step-by-step instructions → Read PHASE_4_EXECUTION_PLAN.md
- Exact code changes → Read PHASE_4_FILE_CHANGES.md
- Quick lookup during execution → Use PHASE_4_QUICK_REFERENCE.md
- Task tracking → Use this PHASE_4_MASTER_CHECKLIST.md

---

## 🔄 If Something Goes Wrong

1. **Build fails?** → Check PHASE_4_QUICK_REFERENCE.md "Troubleshooting"
2. **Test fails?** → Revert changes: `git checkout src/`
3. **Deployment fails?** → Check Vercel logs: `vercel logs`
4. **Need to rollback?** → `git reset --hard HEAD~1` then `vercel --prod`

---

**You have everything you need. See you at 7 AM!** 🚀

