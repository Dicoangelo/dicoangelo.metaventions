# Phase 5: Master Execution Checklist

**Status:** 📋 READY FOR EXECUTION
**Created:** February 1, 2026
**Estimated Time:** 3 hours

---

## Documents Created

| Document | Purpose | Size |
|----------|---------|------|
| PHASE_5_UI_UX_PRD.md | Product requirements & goals | ~15 KB |
| PHASE_5_EXECUTION_PLAN.md | Detailed step-by-step instructions | ~12 KB |
| PHASE_5_QUICK_REFERENCE.md | Fast lookup guide | ~4 KB |
| PHASE_5_MASTER_CHECKLIST.md | This tracking document | ~3 KB |

---

## Pre-Execution Checklist

- [ ] Read PHASE_5_UI_UX_PRD.md (10 min)
- [ ] Verify git status is clean: `git status`
- [ ] Verify build passes: `npm run build`
- [ ] Start dev server: `npm run dev`
- [ ] Open PHASE_5_QUICK_REFERENCE.md for reference

---

## Batch 1: Design Tokens (45 min)

### Files to Modify
- [ ] `src/app/globals.css` - Add shadow variables to dark theme (line ~20)
- [ ] `src/app/globals.css` - Add shadow variables to light theme (line ~38)
- [ ] `src/app/globals.css` - Add button system classes (after line ~117)
- [ ] `src/app/globals.css` - Update card base class (replace lines 112-117)

### Verification
- [ ] `npm run build` passes
- [ ] DevTools shows `var(--shadow-md)` works
- [ ] Both themes have shadows defined

---

## Batch 2: Button System (45 min)

### Files to Modify
- [ ] `src/components/Hero.tsx` - Update primary CTA to `btn-primary btn-lg`
- [ ] `src/components/Hero.tsx` - Update secondary CTA to `btn-secondary btn-lg`
- [ ] `src/components/FloatingCTA.tsx` - Update main button to `btn-icon`
- [ ] `src/components/FloatingCTA.tsx` - Add stagger animation to menu items
- [ ] `src/components/BackToTop.tsx` - Update to `btn-icon`
- [ ] `src/components/Chat.tsx` - Update send button to `btn-primary`
- [ ] `src/components/ResumeDownload.tsx` - Update buttons

### Verification
- [ ] `npm run build` passes
- [ ] Hero buttons have gradient effect
- [ ] FloatingCTA menu staggers
- [ ] All buttons have hover + active states

---

## Batch 3: Card System (45 min)

### Files to Create
- [ ] `src/components/Skeleton.tsx` - New loading skeleton component

### Files to Modify
- [ ] `src/components/MetricCard.tsx` - Add loading state
- [ ] `src/components/ProjectCard.tsx` - Use `card-interactive`
- [ ] `src/components/SystemCard.tsx` - Standardize padding to `p-6`
- [ ] `src/components/StrengthCard.tsx` - Change `rounded-lg` to `rounded-xl`
- [ ] `src/components/GapCard.tsx` - Change `rounded-lg` to `rounded-xl`

### Verification
- [ ] `npm run build` passes
- [ ] Skeleton component renders
- [ ] All cards have same border-radius (12px)
- [ ] Cards lift on hover

---

## Batch 4: Micro-interactions (45 min)

### Files to Modify
- [ ] `src/components/Nav.tsx` - Add `hover-underline` to desktop links
- [ ] `src/components/Nav.tsx` - Add mobile menu slide animation
- [ ] `src/app/globals.css` - Add enhanced input focus styles
- [ ] `src/app/globals.css` - Add loading spinner animation
- [ ] `src/app/globals.css` - Add page load fade animation

### Verification
- [ ] `npm run build` passes
- [ ] Nav links have underline animation
- [ ] Mobile menu slides open/closed
- [ ] Inputs have glow on focus
- [ ] Reduced motion preferences respected

---

## Final Testing

### Commands
```bash
npm run lint
npm run build
npm test -- --run
npm run dev  # Manual testing
```

### Manual Checklist
- [ ] Test all buttons (hover, click, disabled)
- [ ] Test all cards (hover lift)
- [ ] Test navigation (underline, mobile menu)
- [ ] Test input focus
- [ ] Test dark mode
- [ ] Test light mode
- [ ] Test mobile viewport
- [ ] Test keyboard navigation

---

## Deploy

```bash
git add .
git commit -m "feat: Phase 5 UI/UX polish and design system"
git push origin main
vercel --prod
```

---

## Success Criteria

After Phase 5:
- ✅ Shadow system: 5 consistent depth levels
- ✅ Button system: 3 organized variants (primary, secondary, ghost)
- ✅ Card system: Unified border-radius (12px) and padding (24px)
- ✅ Loading states: Skeleton component for async data
- ✅ Nav polish: Underline animation + mobile menu animation
- ✅ Input polish: Focus glow ring
- ✅ Accessibility: Reduced motion respected
- ✅ Build: Passes
- ✅ Tests: Pass

---

## Rollback

```bash
# Quick revert
git checkout -- src/

# If committed
git revert HEAD
```

---

## Timeline

| Time | Task |
|------|------|
| 0:00 | Pre-execution checklist |
| 0:10 | Batch 1: Design Tokens |
| 0:55 | Batch 2: Button System |
| 1:40 | Batch 3: Card System |
| 2:25 | Batch 4: Micro-interactions |
| 3:00 | Final testing + deploy |

---

**Phase 5 is ready for execution!**
