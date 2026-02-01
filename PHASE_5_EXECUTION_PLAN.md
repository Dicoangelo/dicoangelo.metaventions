# Phase 5: UI/UX Polish - Detailed Execution Plan

**Version:** 1.0.0
**Created:** February 1, 2026
**Estimated Time:** 3 hours total

---

## Quick Start

```bash
cd /Users/dicoangelo/dicoangelo.com
git status  # Verify clean
npm run dev # Start dev server for live testing
```

---

## Batch 1: Design Tokens (45 min)

### 1.1 Add Shadow System to globals.css

**File:** `src/app/globals.css`
**Location:** After line 19 (after `--input-bg: #1f1f1f;`)

**Add this block:**
```css
  /* Shadow System - 5 Depth Levels */
  --shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.08);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.12);
  --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.16);
  --shadow-xl: 0 16px 48px rgba(0, 0, 0, 0.20);

  /* Accent Glow Shadows */
  --shadow-glow-sm: 0 0 12px rgba(99, 102, 241, 0.15);
  --shadow-glow-md: 0 0 24px rgba(99, 102, 241, 0.25);
  --shadow-glow-lg: 0 0 48px rgba(99, 102, 241, 0.35);

  /* Transition Tokens */
  --transition-fast: 150ms ease;
  --transition-normal: 250ms ease-out;
  --transition-slow: 400ms ease-out;
  --transition-spring: 400ms cubic-bezier(0.34, 1.56, 0.64, 1);

  /* Gradient Tokens */
  --gradient-primary: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%);
  --gradient-primary-hover: linear-gradient(135deg, #5558e3 0%, #7c4fe8 50%, #9945e8 100%);
  --gradient-accent: linear-gradient(90deg, #6366f1, #8b5cf6, #a855f7);
```

### 1.2 Add Light Theme Shadow Overrides

**File:** `src/app/globals.css`
**Location:** After line 37 (after `--input-bg: #f3f4f6;` in light theme)

**Add this block:**
```css
  /* Light Theme Shadow Adjustments */
  --shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.03);
  --shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.08);
  --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.10);
  --shadow-xl: 0 16px 48px rgba(0, 0, 0, 0.12);
  --shadow-glow-sm: 0 0 12px rgba(79, 70, 229, 0.10);
  --shadow-glow-md: 0 0 24px rgba(79, 70, 229, 0.18);
  --shadow-glow-lg: 0 0 48px rgba(79, 70, 229, 0.25);
```

### 1.3 Add Button Variant Classes

**File:** `src/app/globals.css`
**Location:** After line 117 (after `.card` block)

**Add this block:**
```css
/* ===== BUTTON SYSTEM ===== */

/* Primary Button - Gradient with glow */
.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.875rem 1.75rem;
  border-radius: 0.75rem;
  font-weight: 600;
  font-size: 1rem;
  background: var(--gradient-primary);
  color: white;
  box-shadow: var(--shadow-md);
  transition: transform var(--transition-normal), box-shadow var(--transition-normal);
  cursor: pointer;
  border: none;
}

.btn-primary:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: var(--shadow-lg), var(--shadow-glow-sm);
}

.btn-primary:active {
  transform: translateY(0) scale(0.98);
  box-shadow: var(--shadow-sm);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
  box-shadow: var(--shadow-sm);
}

.btn-primary:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

/* Secondary Button - Outlined */
.btn-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.875rem 1.75rem;
  border-radius: 0.75rem;
  font-weight: 600;
  font-size: 1rem;
  background: var(--card);
  color: var(--foreground);
  border: 2px solid var(--border);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-normal);
  cursor: pointer;
}

.btn-secondary:hover {
  background: var(--card-hover);
  border-color: var(--accent);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.btn-secondary:active {
  transform: translateY(0) scale(0.98);
}

.btn-secondary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

/* Ghost Button - Minimal */
.btn-ghost {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 500;
  font-size: 0.875rem;
  background: transparent;
  color: var(--foreground);
  border: none;
  transition: all var(--transition-fast);
  cursor: pointer;
}

.btn-ghost:hover {
  background: var(--card);
  color: var(--accent);
}

.btn-ghost:active {
  transform: scale(0.97);
}

/* Icon Button - Circle */
.btn-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 50%;
  background: var(--gradient-primary);
  color: white;
  border: none;
  box-shadow: var(--shadow-md);
  transition: all var(--transition-normal);
  cursor: pointer;
}

.btn-icon:hover {
  transform: scale(1.1);
  box-shadow: var(--shadow-lg), var(--shadow-glow-md);
}

.btn-icon:active {
  transform: scale(0.95);
}

/* Small button variant */
.btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  border-radius: 0.5rem;
}

/* Large button variant */
.btn-lg {
  padding: 1rem 2rem;
  font-size: 1.125rem;
  border-radius: 1rem;
}
```

### 1.4 Update Card Base Class

**File:** `src/app/globals.css`
**Location:** Replace existing `.card` block (lines 112-117)

**Replace with:**
```css
/* Cards */
.card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 0.75rem;
  box-shadow: var(--shadow-sm);
  transition:
    background-color var(--transition-normal),
    border-color var(--transition-normal),
    box-shadow var(--transition-normal),
    transform var(--transition-normal);
}

.card:hover {
  box-shadow: var(--shadow-md);
}

/* Interactive card (clickable) */
.card-interactive {
  cursor: pointer;
}

.card-interactive:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
  border-color: var(--accent);
}

.card-interactive:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

/* Glow card variant */
.card-glow:hover {
  box-shadow: var(--shadow-glow-md);
}
```

### Batch 1 Verification

```bash
npm run build  # Should pass
npm run dev    # Visual check
```

**Checklist:**
- [ ] Shadow variables in dark theme
- [ ] Shadow variables in light theme
- [ ] Button classes defined
- [ ] Card classes updated
- [ ] Build passes

---

## Batch 2: Button System Implementation (45 min)

### 2.1 Update Hero.tsx Buttons

**File:** `src/components/Hero.tsx`

**Find Primary CTA (around line 99-110):**
```tsx
// FIND (approximately):
<a
  href="#chat"
  className="group relative px-8 py-4 bg-[#6366f1] hover:bg-[#5558e3] text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center gap-3"
>
```

**Replace with:**
```tsx
<a
  href="#chat"
  className="btn-primary btn-lg group"
>
```

**Find Secondary CTA:**
```tsx
// FIND (approximately):
<a
  href="#proof"
  className={`px-8 py-4 ${
    isLight
      ? 'bg-white hover:bg-gray-50 border-2 border-gray-300'
      : 'bg-[#141414] hover:bg-[#1f1f1f] border-2 border-[#262626]'
  } rounded-xl font-semibold text-lg shadow-lg hover:scale-105 transition-all flex items-center gap-3`}
>
```

**Replace with:**
```tsx
<a
  href="#proof"
  className="btn-secondary btn-lg group"
>
```

### 2.2 Update FloatingCTA.tsx

**File:** `src/components/FloatingCTA.tsx`

**Find main button (around line 88-100):**
```tsx
// FIND:
<button
  onClick={() => setIsExpanded(!isExpanded)}
  className="w-14 h-14 rounded-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white shadow-2xl hover:scale-110 active:scale-95 transition-all flex items-center justify-center"
  aria-label={isExpanded ? 'Close menu' : 'Open quick actions menu'}
  aria-expanded={isExpanded}
>
```

**Replace with:**
```tsx
<button
  onClick={() => setIsExpanded(!isExpanded)}
  className={`btn-icon w-14 h-14 ${isExpanded ? 'rotate-45' : ''}`}
  aria-label={isExpanded ? 'Close menu' : 'Open quick actions menu'}
  aria-expanded={isExpanded}
>
```

**Find menu item buttons and add stagger:**
```tsx
// FIND menu items (around lines 105-125):
{menuItems.map((item, index) => (

// UPDATE each menu button to include stagger delay:
<button
  key={item.id}
  onClick={() => handleMenuItemClick(item.action)}
  className="btn-ghost"
  style={{
    transitionDelay: `${index * 50}ms`,
    opacity: isExpanded ? 1 : 0,
    transform: isExpanded ? 'translateY(0)' : 'translateY(10px)'
  }}
>
```

### 2.3 Update BackToTop.tsx

**File:** `src/components/BackToTop.tsx`

**Find button (around line 48):**
```tsx
// FIND:
<button
  onClick={scrollToTop}
  className="p-3 rounded-full bg-[#6366f1] text-white shadow-lg hover:shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:scale-110 active:scale-95 transition-all"
  aria-label="Scroll back to top"
>
```

**Replace with:**
```tsx
<button
  onClick={scrollToTop}
  className="btn-icon"
  aria-label="Scroll back to top"
>
```

### 2.4 Update Chat.tsx Send Button

**File:** `src/components/Chat.tsx`

**Find send button (around line 170-180):**
```tsx
// FIND (approximately):
<button
  type="submit"
  disabled={!inputValue.trim() || isLoading}
  className={`px-6 py-3 min-h-[44px] min-w-[44px] rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
    !inputValue.trim() || isLoading
      ? 'bg-[#262626] text-[#737373] cursor-not-allowed'
      : 'bg-[#6366f1] hover:bg-[#5558e3] text-white hover:scale-105'
  }`}
>
```

**Replace with:**
```tsx
<button
  type="submit"
  disabled={!inputValue.trim() || isLoading}
  className="btn-primary"
>
```

### 2.5 Update ResumeDownload.tsx

**File:** `src/components/ResumeDownload.tsx`

**Find download buttons and update to use button classes:**
```tsx
// Primary download button - use btn-primary
// Preview button - use btn-secondary
// LinkedIn button - use btn-ghost
```

### Batch 2 Verification

```bash
npm run build
npm run dev  # Test all buttons visually
```

**Checklist:**
- [ ] Hero primary CTA uses btn-primary
- [ ] Hero secondary CTA uses btn-secondary
- [ ] FloatingCTA main button uses btn-icon
- [ ] FloatingCTA menu items stagger
- [ ] BackToTop uses btn-icon
- [ ] Chat send button uses btn-primary
- [ ] All buttons have hover/active states
- [ ] Build passes

---

## Batch 3: Card System & Loading States (45 min)

### 3.1 Create Skeleton Component

**Create new file:** `src/components/Skeleton.tsx`

```tsx
'use client';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'card';
  width?: string | number;
  height?: string | number;
  lines?: number;
}

export function Skeleton({
  className = '',
  variant = 'text',
  width,
  height,
  lines = 1
}: SkeletonProps) {
  const baseClasses = 'animate-shimmer bg-[var(--card-hover)]';

  const variantClasses: Record<string, string> = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
    card: 'rounded-xl'
  };

  const style = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height
  };

  if (variant === 'text' && lines > 1) {
    return (
      <div className={`space-y-2 ${className}`}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={`${baseClasses} ${variantClasses.text}`}
            style={{
              ...style,
              width: i === lines - 1 ? '75%' : '100%'
            }}
            aria-hidden="true"
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={style}
      aria-hidden="true"
    />
  );
}

// Card skeleton for loading states
export function CardSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`card p-6 ${className}`}>
      <Skeleton variant="text" width="40%" className="mb-4" />
      <Skeleton variant="text" lines={3} className="mb-4" />
      <div className="flex gap-2">
        <Skeleton variant="rectangular" width={80} height={32} />
        <Skeleton variant="rectangular" width={80} height={32} />
      </div>
    </div>
  );
}

// Metric skeleton for number loading
export function MetricSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`metric-card p-6 rounded-xl ${className}`}>
      <Skeleton variant="text" width="60%" height={24} className="mb-2" />
      <Skeleton variant="text" width="40%" height={40} />
    </div>
  );
}

export default Skeleton;
```

### 3.2 Update MetricCard.tsx with Loading State

**File:** `src/components/MetricCard.tsx`

**Add loading prop and skeleton:**
```tsx
// Add to props interface:
interface MetricCardProps {
  // ... existing props
  isLoading?: boolean;
}

// Add early return for loading:
if (isLoading) {
  return <MetricSkeleton />;
}
```

### 3.3 Update ProjectCard.tsx

**File:** `src/components/ProjectCard.tsx`

**Find card div and update:**
```tsx
// FIND:
<div className="card p-6 glow">

// REPLACE WITH:
<div className="card card-interactive p-6">
```

### 3.4 Update SystemCard.tsx

**File:** `src/components/SystemCard.tsx` (in sections folder)

**Standardize padding:**
```tsx
// FIND:
className="card p-5

// REPLACE WITH:
className="card p-6
```

### 3.5 Update StrengthCard.tsx

**File:** `src/components/StrengthCard.tsx`

**Standardize border-radius:**
```tsx
// FIND:
rounded-lg

// REPLACE WITH:
rounded-xl
```

### 3.6 Update GapCard.tsx

**File:** `src/components/GapCard.tsx`

**Standardize border-radius:**
```tsx
// FIND:
rounded-lg

// REPLACE WITH:
rounded-xl
```

### Batch 3 Verification

```bash
npm run build
npm run dev  # Check cards have consistent styling
```

**Checklist:**
- [ ] Skeleton.tsx created
- [ ] MetricCard has loading state
- [ ] ProjectCard uses card-interactive
- [ ] All cards use rounded-xl
- [ ] All cards use p-6 padding
- [ ] Build passes

---

## Batch 4: Micro-interactions & Polish (45 min)

### 4.1 Add Navigation Underline Animation

**File:** `src/components/Nav.tsx`

**Find desktop nav links:**
```tsx
// FIND desktop links (around line 60-80):
<a href="#..." className="... transition-colors">

// ADD hover-underline class:
<a href="#..." className="hover-underline transition-colors">
```

### 4.2 Add Mobile Menu Animation

**File:** `src/components/Nav.tsx`

**Find mobile menu container:**
```tsx
// FIND:
{isMenuOpen && (
  <div className="md:hidden">

// REPLACE WITH animated version:
<div
  className={`md:hidden overflow-hidden transition-all duration-300 ease-out ${
    isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
  }`}
>
```

**Remove the conditional render wrapping:**
```tsx
// Change from:
{isMenuOpen && (<div ...>)}

// To always render but animate:
<div className={`... ${isMenuOpen ? 'max-h-96' : 'max-h-0'}`}>
```

### 4.3 Enhanced Input Focus States

**File:** `src/app/globals.css`

**Add after existing focus styles (around line 680):**
```css
/* Enhanced input focus with glow */
input:focus,
textarea:focus,
select:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
}

[data-theme="light"] input:focus,
[data-theme="light"] textarea:focus,
[data-theme="light"] select:focus {
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.12);
}
```

### 4.4 Add Loading Spinner Animation

**File:** `src/app/globals.css`

**Add after animations section:**
```css
/* Loading spinner */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin-slow {
  animation: spin 1.5s linear infinite;
}

/* Dots loading animation */
@keyframes dots {
  0%, 20% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

.loading-dots span {
  animation: dots 1.4s infinite;
}

.loading-dots span:nth-child(2) {
  animation-delay: 0.2s;
}

.loading-dots span:nth-child(3) {
  animation-delay: 0.4s;
}
```

### 4.5 Smooth Page Load Animation

**File:** `src/app/globals.css`

**Add at the end:**
```css
/* Page load animation */
@keyframes page-fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

body {
  animation: page-fade-in 0.3s ease-out;
}

@media (prefers-reduced-motion: reduce) {
  body {
    animation: none;
  }
}
```

### Batch 4 Verification

```bash
npm run build
npm run dev  # Test all interactions
```

**Checklist:**
- [ ] Nav links have underline animation
- [ ] Mobile menu slides open/closed
- [ ] Input focus has glow
- [ ] Loading animations work
- [ ] Page fade-in on load
- [ ] Reduced motion respected
- [ ] Build passes

---

## Final Verification

### Run Full Test Suite

```bash
npm run lint
npm run build
npm test -- --run
```

### Manual Testing Checklist

**Buttons:**
- [ ] Primary buttons have gradient + shadow
- [ ] Secondary buttons have border + hover
- [ ] Ghost buttons are subtle
- [ ] All buttons have press feedback (scale down)
- [ ] Disabled buttons are grayed out

**Cards:**
- [ ] All cards have consistent border-radius
- [ ] Cards have subtle shadow
- [ ] Interactive cards lift on hover
- [ ] Cards work in dark and light mode

**Navigation:**
- [ ] Links have underline on hover
- [ ] Mobile menu animates
- [ ] Active link is highlighted

**Inputs:**
- [ ] Focus states have glow ring
- [ ] Works in both themes

**Performance:**
- [ ] No layout shifts
- [ ] Animations are smooth (60fps)
- [ ] No jank on mobile

---

## Commit Message

```bash
git add .
git commit -m "$(cat <<'EOF'
feat: Phase 5 UI/UX polish and design system

- Add unified shadow depth scale (5 levels + glow variants)
- Add gradient and transition CSS variables
- Create button system (primary, secondary, ghost, icon)
- Standardize card styling (rounded-xl, p-6, hover lift)
- Add Skeleton loading component
- Add nav link underline animation
- Add mobile menu slide animation
- Enhance input focus states with glow
- Add page load fade animation
- Maintain reduced motion preferences
EOF
)"
```

---

## Rollback Instructions

If any batch causes issues:

```bash
# Revert current changes
git checkout -- src/

# If already committed
git revert HEAD

# Nuclear option - reset to before Phase 5
git log --oneline -5  # Find commit before Phase 5
git reset --hard <commit-hash>
```

---

## Files Modified Summary

| Batch | File | Change |
|-------|------|--------|
| 1 | globals.css | Design tokens |
| 2 | Hero.tsx | Button classes |
| 2 | FloatingCTA.tsx | Button + stagger |
| 2 | BackToTop.tsx | Icon button |
| 2 | Chat.tsx | Send button |
| 2 | ResumeDownload.tsx | Button classes |
| 3 | Skeleton.tsx | New file |
| 3 | MetricCard.tsx | Loading state |
| 3 | ProjectCard.tsx | Card classes |
| 3 | SystemCard.tsx | Padding |
| 3 | StrengthCard.tsx | Border-radius |
| 3 | GapCard.tsx | Border-radius |
| 4 | Nav.tsx | Underline + menu animation |
| 4 | globals.css | Focus + loading animations |

**Total: 13 files, ~200 lines changed**
