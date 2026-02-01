# Phase 5: Quick Reference Card

**Total Time:** 3 hours | **4 Batches** | **13 files**

---

## At-a-Glance

| Batch | Focus | Time | Key Changes |
|-------|-------|------|-------------|
| 1 | Design Tokens | 45m | Shadow scale, gradients, transitions |
| 2 | Button System | 45m | btn-primary, btn-secondary, btn-ghost |
| 3 | Card System | 45m | Skeleton, card-interactive, unified styling |
| 4 | Micro-interactions | 45m | Nav underline, menu animation, focus glow |

---

## New CSS Classes

### Buttons
```css
.btn-primary     /* Gradient + shadow, main CTAs */
.btn-secondary   /* Outlined, secondary actions */
.btn-ghost       /* Minimal, tertiary actions */
.btn-icon        /* Circular icon buttons */
.btn-sm          /* Smaller size */
.btn-lg          /* Larger size */
```

### Cards
```css
.card            /* Base card with shadow */
.card-interactive /* Clickable card with lift */
.card-glow       /* Card with accent glow on hover */
```

### Utilities
```css
.hover-underline  /* Animated underline on hover */
.hover-lift       /* Lift + shadow on hover */
.animate-shimmer  /* Loading skeleton animation */
```

---

## CSS Variables Added

```css
/* Shadows */
--shadow-xs, --shadow-sm, --shadow-md, --shadow-lg, --shadow-xl
--shadow-glow-sm, --shadow-glow-md, --shadow-glow-lg

/* Transitions */
--transition-fast (150ms)
--transition-normal (250ms)
--transition-slow (400ms)
--transition-spring (bouncy)

/* Gradients */
--gradient-primary
--gradient-primary-hover
--gradient-accent
```

---

## Component Updates

| Component | Before | After |
|-----------|--------|-------|
| Hero CTAs | Custom inline | `btn-primary btn-lg`, `btn-secondary btn-lg` |
| FloatingCTA | Custom styles | `btn-icon`, stagger animation |
| BackToTop | Custom | `btn-icon` |
| Chat Send | Custom | `btn-primary` |
| ProjectCard | `card p-6 glow` | `card card-interactive p-6` |
| SystemCard | `p-5` | `p-6` |
| StrengthCard | `rounded-lg` | `rounded-xl` |
| GapCard | `rounded-lg` | `rounded-xl` |
| Nav links | Basic | `hover-underline` |

---

## Quick Commands

```bash
# Start dev server
npm run dev

# Check build
npm run build

# Run tests
npm test -- --run

# Check linting
npm run lint

# Deploy
vercel --prod
```

---

## Verification Checklist

### After Batch 1
- [ ] `var(--shadow-md)` works in DevTools
- [ ] Light theme has lighter shadows
- [ ] No build errors

### After Batch 2
- [ ] Hero buttons have gradient
- [ ] FloatingCTA menu staggers
- [ ] Buttons scale on press

### After Batch 3
- [ ] Skeleton component exists
- [ ] Cards have same border-radius
- [ ] Cards lift on hover

### After Batch 4
- [ ] Nav links have underline animation
- [ ] Mobile menu slides
- [ ] Inputs have focus glow

---

## Troubleshooting

**Button not styling correctly?**
- Ensure class is `btn-primary` not `btn primary`
- Check no conflicting inline styles

**Shadow not appearing?**
- Check variable defined in correct theme section
- Use DevTools to inspect computed styles

**Animation not working?**
- Check `prefers-reduced-motion` isn't active
- Ensure class is applied correctly

**Build fails?**
- Check for syntax errors in globals.css
- Verify all imports are correct

---

## Rollback

```bash
# Quick revert
git checkout -- src/

# If committed
git revert HEAD
```

---

## Success Criteria

✅ All buttons have consistent hover/active states
✅ All cards use rounded-xl border-radius
✅ Shadow system has 5 depth levels
✅ Loading states on async components
✅ Nav has underline animation
✅ Mobile menu animates
✅ Input focus has glow ring
✅ Reduced motion respected
✅ Build passes
✅ Tests pass
