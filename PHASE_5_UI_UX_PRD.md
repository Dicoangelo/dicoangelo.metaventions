# Phase 5: UI/UX Polish & Design System PRD

**Version:** 1.0.0
**Created:** February 1, 2026
**Status:** DRAFT - Pending Approval
**Estimated Effort:** 3-4 hours across 4 batches

---

## Executive Summary

Phase 5 establishes a unified design system and polishes the visual experience of dicoangelo.com. Based on comprehensive codebase analysis, we identified **10 critical inconsistencies** and **15+ improvement opportunities** across animations, buttons, cards, shadows, and interactive feedback.

### Goals
1. Create consistent, predictable UI patterns
2. Add micro-interaction polish for professional feel
3. Establish reusable design tokens
4. Improve perceived performance with loading states
5. Ensure accessibility compliance remains 100%

### Success Metrics
- Visual consistency score: 100% (currently ~70%)
- All buttons have hover/active/focus/disabled states
- Unified shadow depth scale (5 levels)
- Loading states on all async operations
- Zero layout shifts during interactions

---

## Problem Statement

### Current State Analysis

The codebase has **strong animation fundamentals** but lacks a **unified design system**:

| Category | Current State | Issue |
|----------|---------------|-------|
| Buttons | 5-6 variants, inconsistent sizing | px-8 py-4 vs px-4 py-2 |
| Shadows | 6+ hardcoded variations | No consistent scale |
| Cards | 3 border-radius values (8px, 12px, 50%) | Visual inconsistency |
| Gradients | Hardcoded hex values | Not in CSS variables |
| Loading | Only Chat has skeleton | Other components bare |
| Disabled | Only Chat button styled | Others unstyled |

### Key Inconsistencies Found

1. **Button Sizing** - Hero CTAs (px-8 py-4) differ from secondary (px-4/6 py-2/3)
2. **Shadow System** - No depth scale, mixed Tailwind + custom box-shadows
3. **Card Border Radius** - 8px, 12px, and others mixed
4. **Card Padding** - p-4, p-5, p-6 used inconsistently
5. **Navigation Hover** - Desktop/mobile have different feedback patterns
6. **Gradient Colors** - Hardcoded, not centralized
7. **Mobile Menu** - No open/close animation
8. **Focus States** - Cards aren't keyboard-focusable
9. **Disabled States** - Missing on most buttons
10. **Link Underlines** - Inconsistent focus indicators

---

## Solution Overview

### Phase 5 Structure

| Batch | Focus | Files | Time |
|-------|-------|-------|------|
| 1 | Design Tokens & Shadow System | globals.css, tailwind.config.ts | 45 min |
| 2 | Button System Unification | 8 components | 45 min |
| 3 | Card System & Loading States | 6 components | 45 min |
| 4 | Micro-interactions & Polish | 10 components | 45 min |

---

## Batch 1: Design Tokens & Shadow System

### Objective
Establish centralized design tokens for shadows, spacing, and gradients.

### Changes

#### 1.1 Shadow Depth Scale (globals.css)

**Add to `:root`:**
```css
/* Shadow System - 5 levels */
--shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.05);
--shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.1);
--shadow-md: 0 4px 8px rgba(0, 0, 0, 0.12);
--shadow-lg: 0 8px 16px rgba(0, 0, 0, 0.15);
--shadow-xl: 0 12px 24px rgba(0, 0, 0, 0.18);

/* Glow variants for accent */
--shadow-glow-sm: 0 0 10px rgba(99, 102, 241, 0.2);
--shadow-glow-md: 0 0 20px rgba(99, 102, 241, 0.25);
--shadow-glow-lg: 0 0 40px rgba(99, 102, 241, 0.3);
```

#### 1.2 Gradient Tokens (globals.css)

**Add to `:root`:**
```css
/* Gradient System */
--gradient-primary: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%);
--gradient-primary-hover: linear-gradient(135deg, #5558e3 0%, #7c4fe8 50%, #9945e8 100%);
--gradient-button: linear-gradient(90deg, #6366f1, #8b5cf6, #a855f7, #8b5cf6, #6366f1);
--gradient-text: linear-gradient(135deg, #6366f1, #8b5cf6, #a855f7);
```

#### 1.3 Transition Timing Tokens

**Add to `:root`:**
```css
/* Transition System */
--transition-fast: 150ms ease;
--transition-normal: 250ms ease;
--transition-slow: 400ms ease;
--transition-bounce: 400ms cubic-bezier(0.34, 1.56, 0.64, 1);
```

#### 1.4 Spacing Scale Validation

Current Tailwind spacing is sufficient. Document usage:
- **Tight**: gap-2, p-2 (8px)
- **Normal**: gap-4, p-4 (16px)
- **Comfortable**: gap-6, p-6 (24px)
- **Spacious**: gap-8, p-8 (32px)

### Verification
- [ ] All shadow variables defined
- [ ] All gradient variables defined
- [ ] Transition tokens defined
- [ ] Build passes

---

## Batch 2: Button System Unification

### Objective
Create consistent button variants with proper states.

### Button Variant Definitions

#### Primary Button
```css
.btn-primary {
  @apply px-6 py-3 rounded-xl font-semibold;
  background: var(--gradient-primary);
  box-shadow: var(--shadow-md);
  transition: var(--transition-normal);
}
.btn-primary:hover {
  transform: scale(1.03);
  box-shadow: var(--shadow-lg);
}
.btn-primary:active {
  transform: scale(0.97);
}
.btn-primary:disabled {
  @apply opacity-50 cursor-not-allowed;
  transform: none;
}
```

#### Secondary Button
```css
.btn-secondary {
  @apply px-6 py-3 rounded-xl font-semibold;
  @apply border-2 border-[var(--border)];
  @apply bg-[var(--card)] hover:bg-[var(--card-hover)];
  box-shadow: var(--shadow-sm);
  transition: var(--transition-normal);
}
.btn-secondary:hover {
  transform: scale(1.02);
  box-shadow: var(--shadow-md);
}
.btn-secondary:active {
  transform: scale(0.98);
}
```

#### Ghost Button
```css
.btn-ghost {
  @apply px-4 py-2 rounded-lg font-medium;
  @apply bg-transparent hover:bg-[var(--card)];
  transition: var(--transition-fast);
}
.btn-ghost:hover {
  transform: translateY(-1px);
}
```

### Files to Update

| File | Current | Change |
|------|---------|--------|
| Hero.tsx | Custom inline styles | Use `.btn-primary`, `.btn-secondary` |
| FloatingCTA.tsx | Custom styles | Use `.btn-primary` for main, `.btn-ghost` for menu |
| Chat.tsx | Custom send button | Use `.btn-primary` |
| ContactSection.tsx | Custom buttons | Use `.btn-secondary` |
| ProofSection.tsx | Verify buttons | Use `.btn-ghost` |
| ProjectCard.tsx | Demo/GitHub buttons | Use `.btn-ghost` |
| ResumeDownload.tsx | Download buttons | Use `.btn-primary` |
| BackToTop.tsx | Scroll button | Use new `.btn-circle` variant |

### Verification
- [ ] All buttons use variant classes
- [ ] All buttons have :hover, :active, :disabled states
- [ ] Focus rings visible on keyboard navigation
- [ ] Build passes

---

## Batch 3: Card System & Loading States

### Objective
Unify card styles and add loading skeletons.

### Card Variant Definitions

#### Base Card (update existing)
```css
.card {
  @apply rounded-xl; /* Standardize to 12px */
  background: var(--card);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-sm);
  transition: var(--transition-normal);
}
.card:hover {
  box-shadow: var(--shadow-md);
  border-color: var(--accent);
}
```

#### Card Interactive
```css
.card-interactive {
  @apply card cursor-pointer;
}
.card-interactive:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}
.card-interactive:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}
```

#### Card Glow
```css
.card-glow {
  @apply card;
}
.card-glow:hover {
  box-shadow: var(--shadow-glow-md);
}
```

### Loading Skeleton Component

**Create: `src/components/Skeleton.tsx`**
```tsx
interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
}

export function Skeleton({
  className = '',
  variant = 'text',
  width,
  height
}: SkeletonProps) {
  const baseClasses = 'animate-shimmer bg-gradient-to-r from-[var(--card)] via-[var(--card-hover)] to-[var(--card)]';

  const variantClasses = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg'
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={{ width, height }}
      aria-hidden="true"
    />
  );
}
```

### Files to Update

| File | Change |
|------|--------|
| globals.css | Update `.card` base class |
| MetricCard.tsx | Add loading skeleton state |
| ProjectCard.tsx | Use `.card-interactive` |
| SystemCard.tsx | Use `.card` with consistent padding |
| StrengthCard.tsx | Standardize border-radius to xl |
| GapCard.tsx | Standardize border-radius to xl |

### Verification
- [ ] All cards use 12px border-radius
- [ ] All cards have hover shadow
- [ ] Skeleton component created
- [ ] MetricCard shows skeleton while loading
- [ ] Build passes

---

## Batch 4: Micro-interactions & Polish

### Objective
Add subtle polish animations and improve feedback.

### 4.1 Navigation Enhancements

**Nav.tsx - Desktop link hover underline:**
```tsx
// Add underline indicator class
<a className="relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-[var(--accent)] after:transition-all hover:after:w-full">
```

**Nav.tsx - Mobile menu animation:**
```tsx
// Wrap mobile menu in AnimatePresence
<div className={`
  overflow-hidden transition-all duration-300 ease-out
  ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
`}>
```

### 4.2 FloatingCTA Stagger Animation

**FloatingCTA.tsx - Stagger menu items:**
```tsx
{menuItems.map((item, index) => (
  <button
    key={item.id}
    style={{
      transitionDelay: `${index * 50}ms`,
      transform: isExpanded ? 'translateY(0) scale(1)' : 'translateY(10px) scale(0.9)',
      opacity: isExpanded ? 1 : 0
    }}
    className="transition-all duration-200"
  >
    {item.label}
  </button>
))}
```

### 4.3 Button Press Feedback

**Add to all interactive buttons:**
```css
.btn-press {
  transition: transform 100ms ease;
}
.btn-press:active {
  transform: scale(0.95);
}
```

### 4.4 Input Focus Enhancement

**Update focus styles in globals.css:**
```css
input:focus, textarea:focus, select:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
}
```

### 4.5 Card Hover Lift

**Add subtle lift to interactive cards:**
```css
.card-interactive:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}
```

### 4.6 Smooth Scroll Enhancement

**Update smooth scroll behavior:**
```css
html {
  scroll-behavior: smooth;
  scroll-padding-top: 80px; /* Account for fixed nav */
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
}
```

### 4.7 Theme Toggle Animation Polish

**ThemeProvider.tsx - Enhanced toggle:**
```tsx
// Add spring animation to icon rotation
<motion.div
  animate={{ rotate: theme === 'dark' ? 0 : 180 }}
  transition={{ type: 'spring', stiffness: 200, damping: 10 }}
>
```

### Files to Update

| File | Change |
|------|--------|
| globals.css | Add .btn-press, update focus styles, smooth scroll |
| Nav.tsx | Add underline hover, mobile menu animation |
| FloatingCTA.tsx | Stagger menu animation |
| ThemeProvider.tsx | Spring toggle animation |
| Hero.tsx | Add .btn-press to CTAs |
| Chat.tsx | Add .btn-press to send button |

### Verification
- [ ] Nav links have underline animation
- [ ] Mobile menu slides open/closed
- [ ] FloatingCTA menu staggers
- [ ] All buttons have press feedback
- [ ] Input focus has glow ring
- [ ] Cards lift on hover
- [ ] Smooth scroll works
- [ ] Reduced motion respected
- [ ] Build passes

---

## Implementation Order

### Recommended Sequence

```
Batch 1: Design Tokens (45 min)
    ↓
Batch 2: Button System (45 min)
    ↓
Batch 3: Card System (45 min)
    ↓
Batch 4: Micro-interactions (45 min)
    ↓
Final Testing & Deploy
```

### Dependencies

- Batch 2 depends on Batch 1 (uses shadow tokens)
- Batch 3 depends on Batch 1 (uses shadow tokens)
- Batch 4 depends on Batches 2 & 3 (applies to components)

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Animation causes jank | Low | Medium | Test on low-end devices |
| Breaking existing styles | Medium | High | Incremental changes, test each batch |
| Accessibility regression | Low | High | Keep all ARIA attributes |
| Build failure | Low | Medium | Test after each file change |

### Rollback Plan

```bash
# If any batch fails:
git checkout -- src/
git checkout -- globals.css

# If already committed:
git revert HEAD
```

---

## Testing Checklist

### Visual Testing
- [ ] All buttons visually consistent
- [ ] All cards have same border-radius
- [ ] Shadows appear at correct depths
- [ ] Gradients render correctly
- [ ] Dark mode looks correct
- [ ] Light mode looks correct

### Interaction Testing
- [ ] Button hover states work
- [ ] Button press feedback visible
- [ ] Card hover lift works
- [ ] Nav underline animates
- [ ] Mobile menu animates
- [ ] FloatingCTA staggers
- [ ] Theme toggle animates

### Accessibility Testing
- [ ] Focus visible on all interactive elements
- [ ] Reduced motion disables animations
- [ ] High contrast mode works
- [ ] Screen reader announces correctly

### Performance Testing
- [ ] No layout shifts during animations
- [ ] Animations run at 60fps
- [ ] No jank on mobile

---

## Success Criteria

### Before Phase 5
- Shadow variations: 6+ inconsistent
- Button variants: 5-6 unorganized
- Card border-radius: 3 values
- Loading states: 1 component
- Focus consistency: ~70%

### After Phase 5
- Shadow scale: 5 consistent levels
- Button variants: 3 organized (primary, secondary, ghost)
- Card border-radius: 1 value (12px)
- Loading states: All async components
- Focus consistency: 100%

---

## Appendix A: Files Modified

### Batch 1 (2 files)
- `src/app/globals.css`
- `tailwind.config.ts`

### Batch 2 (9 files)
- `src/app/globals.css`
- `src/components/Hero.tsx`
- `src/components/FloatingCTA.tsx`
- `src/components/Chat.tsx`
- `src/components/sections/ContactSection.tsx`
- `src/components/sections/ProofSection.tsx`
- `src/components/ProjectCard.tsx`
- `src/components/ResumeDownload.tsx`
- `src/components/BackToTop.tsx`

### Batch 3 (7 files)
- `src/app/globals.css`
- `src/components/Skeleton.tsx` (new)
- `src/components/MetricCard.tsx`
- `src/components/ProjectCard.tsx`
- `src/components/SystemCard.tsx`
- `src/components/StrengthCard.tsx`
- `src/components/GapCard.tsx`

### Batch 4 (7 files)
- `src/app/globals.css`
- `src/components/Nav.tsx`
- `src/components/FloatingCTA.tsx`
- `src/components/ThemeProvider.tsx`
- `src/components/Hero.tsx`
- `src/components/Chat.tsx`
- `src/components/sections/ContactSection.tsx`

**Total: 16 unique files**

---

## Appendix B: CSS Variable Summary

```css
:root {
  /* Existing */
  --background: #0a0a0a;
  --foreground: #ededed;
  --accent: #6366f1;
  --accent-light: #818cf8;
  --card: #141414;
  --card-hover: #1f1f1f;
  --border: #262626;

  /* NEW: Shadows */
  --shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4px 8px rgba(0, 0, 0, 0.12);
  --shadow-lg: 0 8px 16px rgba(0, 0, 0, 0.15);
  --shadow-xl: 0 12px 24px rgba(0, 0, 0, 0.18);
  --shadow-glow-sm: 0 0 10px rgba(99, 102, 241, 0.2);
  --shadow-glow-md: 0 0 20px rgba(99, 102, 241, 0.25);
  --shadow-glow-lg: 0 0 40px rgba(99, 102, 241, 0.3);

  /* NEW: Gradients */
  --gradient-primary: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%);
  --gradient-primary-hover: linear-gradient(135deg, #5558e3 0%, #7c4fe8 50%, #9945e8 100%);
  --gradient-button: linear-gradient(90deg, #6366f1, #8b5cf6, #a855f7, #8b5cf6, #6366f1);
  --gradient-text: linear-gradient(135deg, #6366f1, #8b5cf6, #a855f7);

  /* NEW: Transitions */
  --transition-fast: 150ms ease;
  --transition-normal: 250ms ease;
  --transition-slow: 400ms ease;
  --transition-bounce: 400ms cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

---

**Document Status:** Ready for Review
**Next Step:** User approval, then execute Batch 1
