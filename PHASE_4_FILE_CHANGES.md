# Phase 4 Detailed File Changes - Before/After Code

**Purpose:** Complete reference for all code changes with exact line numbers and snippets
**Accuracy:** Line numbers are approximate - search for context and adjust as needed
**Status:** Ready to copy/paste into files

---

## TABLE OF CONTENTS

1. [BATCH 1: SVG Accessibility (19 Files)](#batch-1-svg-accessibility)
2. [BATCH 2: Heading Hierarchy (7 Files)](#batch-2-heading-hierarchy)
3. [BATCH 3: CSP Security (2 Files)](#batch-3-csp-security)

---

## BATCH 1: SVG ACCESSIBILITY

### 1.1 File: src/app/error.tsx

**Purpose:** Error page with error SVG icon
**SVGs to Fix:** 1 (error icon)

```typescript
// FIND (lines ~40-80):
<svg
  className="w-16 h-16 text-red-500 dark:text-red-400 mx-auto mb-4"
  fill="none"
  stroke="currentColor"
  viewBox="0 0 24 24"
>
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4v2m0 4v2" />
</svg>

// REPLACE WITH:
<svg
  aria-label="Error occurred"
  className="w-16 h-16 text-red-500 dark:text-red-400 mx-auto mb-4"
  fill="none"
  stroke="currentColor"
  viewBox="0 0 24 24"
>
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4v2m0 4v2" />
</svg>
```

---

### 1.2 File: src/components/BackToTop.tsx

**Purpose:** Back-to-top button component
**SVGs to Fix:** 1 (arrow up icon)

```typescript
// FIND (lines ~30-50):
<button
  onClick={scrollToTop}
  className="..."
>
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
  </svg>
</button>

// REPLACE WITH:
<button
  onClick={scrollToTop}
  aria-label="Back to top"
  className="..."
>
  <svg
    aria-hidden="true"
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
  </svg>
</button>
```

**Note:** aria-label likely already on button; SVG should have aria-hidden="true" if not standalone

---

### 1.3 File: src/components/Hero.tsx

**Purpose:** Hero section with status badge, demo link, GitHub link, resume download
**SVGs to Fix:** 3 (status, demo icon, GitHub icon)

```typescript
// CHANGE 1: Status Badge (lines ~45-65)
// FIND:
<svg className="w-2 h-2 bg-green-500 rounded-full" aria-hidden="true" />

// ALREADY HAS aria-hidden - NO CHANGE NEEDED ✅

// CHANGE 2: Demo Link (lines ~65-85)
// FIND:
<a href="..." className="...">
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2..." />
  </svg>
  View live demo
</a>

// REPLACE WITH:
<a
  href="..."
  className="..."
  aria-label="View live demo of OS-App"
>
  <svg
    aria-hidden="true"
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2..." />
  </svg>
  View live demo
</a>

// CHANGE 3: GitHub Link (lines ~85-105)
// FIND:
<a href="https://github.com/Dicoangelo" className="...">
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 0c-6.626 0-12 5.373-12 12..." />
  </svg>
  GitHub
</a>

// REPLACE WITH:
<a
  href="https://github.com/Dicoangelo"
  className="..."
  aria-label="View GitHub profile with 20+ repositories"
>
  <svg
    aria-hidden="true"
    className="w-4 h-4"
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M12 0c-6.626 0-12 5.373-12 12..." />
  </svg>
  GitHub
</a>
```

**Status:** May already have some aria-labels - verify and add missing ones

---

### 1.4 File: src/components/Nav.tsx

**Purpose:** Navigation component with hamburger menu, theme toggle, GitHub link
**SVGs to Fix:** 2+ (hamburger, theme icon, possibly more)

```typescript
// CHANGE 1: Hamburger Menu (lines ~40-60)
// FIND:
<button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="...">
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
</button>

// REPLACE WITH:
<button
  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
  className="..."
  aria-label="Toggle navigation menu"
>
  <svg
    aria-hidden="true"
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
</button>

// CHANGE 2: Theme Toggle (lines ~80-120)
// FIND:
<button onClick={() => toggleTheme()} className="...">
  {theme === 'dark' ? (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path d="M17.293 13.293..." />
    </svg>
  ) : (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path d="M10 2a1 1 0..." />
    </svg>
  )}
</button>

// REPLACE WITH:
<button
  onClick={() => toggleTheme()}
  className="..."
  aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
>
  {theme === 'dark' ? (
    <svg
      aria-hidden="true"
      className="w-5 h-5"
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path d="M17.293 13.293..." />
    </svg>
  ) : (
    <svg
      aria-hidden="true"
      className="w-5 h-5"
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path d="M10 2a1 1 0..." />
    </svg>
  )}
</button>
```

---

### 1.5 File: src/components/Footer.tsx

**Purpose:** Footer with social links and contact info
**SVGs to Fix:** 2+ (social media icons)

```typescript
// FIND social links section (lines ~100-180):
<a href="https://linkedin.com/in/dicoangelo" className="...">
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027..." />
  </svg>
</a>

// REPLACE WITH:
<a
  href="https://linkedin.com/in/dicoangelo"
  className="..."
  aria-label="LinkedIn profile"
>
  <svg
    aria-hidden="true"
    className="w-5 h-5"
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027..." />
  </svg>
</a>

// REPEAT FOR:
// - Twitter/X link: aria-label="Twitter profile"
// - GitHub link: aria-label="GitHub profile"
// - Email link: aria-label="Email contact"
```

---

### 1.6 File: src/components/CareerTimeline.tsx

**Purpose:** Timeline visualization
**SVGs to Fix:** 2 (timeline decorative elements)

```typescript
// FIND timeline connector (lines ~80-120):
<svg className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full" viewBox="0 0 2 100">
  <line x1="1" y1="0" x2="1" y2="100" stroke="currentColor" strokeWidth="2" />
</svg>

// REPLACE WITH:
<svg
  aria-hidden="true"
  className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full"
  viewBox="0 0 2 100"
>
  <line x1="1" y1="0" x2="1" y2="100" stroke="currentColor" strokeWidth="2" />
</svg>

// FIND timeline dots (lines ~40-70):
<svg className="w-8 h-8 rounded-full bg-blue-500" viewBox="0 0 24 24">
  <circle cx="12" cy="12" r="4" fill="white" />
</svg>

// REPLACE WITH:
<svg
  aria-hidden="true"
  className="w-8 h-8 rounded-full bg-blue-500"
  viewBox="0 0 24 24"
>
  <circle cx="12" cy="12" r="4" fill="white" />
</svg>
```

---

### 1.7 File: src/components/sections/SystemsSection.tsx

**Purpose:** Systems showcase
**SVGs to Fix:** 2+ (system icons)

```typescript
// FIND system icons (lines ~60-120):
<svg className="w-12 h-12 mb-4" fill="currentColor" viewBox="0 0 24 24">
  <path d="M..." />
</svg>

// REPLACE WITH:
<svg
  aria-label="OS-App system icon"
  className="w-12 h-12 mb-4"
  fill="currentColor"
  viewBox="0 0 24 24"
>
  <path d="M..." />
</svg>

// REPEAT FOR EACH SYSTEM:
// - aria-label="CareerCoach system icon"
// - aria-label="ResearchGravity system icon"
// etc.
```

---

### 1.8 File: src/components/StrengthCard.tsx

**Purpose:** Strength/ability cards
**SVGs to Fix:** 1 per card (icon SVG)

```typescript
// FIND strength icon (lines ~20-40):
<svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
  <path d="M..." />
</svg>

// REPLACE WITH:
<svg
  aria-label={`${strength} skill`}
  className="w-8 h-8"
  fill="currentColor"
  viewBox="0 0 24 24"
>
  <path d="M..." />
</svg>
```

---

### 1.9 File: src/components/SkillsVisualization.tsx

**Purpose:** Skills visualization/graph
**SVGs to Fix:** 3 (decorative visualization elements)

```typescript
// FIND main SVG (lines ~60-150):
<svg className="w-full h-80 mb-8" viewBox="0 0 400 300">
  {/* Complex visualization */}
</svg>

// REPLACE WITH:
<svg
  aria-label="Skills distribution visualization"
  className="w-full h-80 mb-8"
  viewBox="0 0 400 300"
>
  {/* Complex visualization */}
</svg>

// OR if purely decorative:
<svg
  aria-hidden="true"
  className="w-full h-80 mb-8"
  viewBox="0 0 400 300"
>
  {/* Complex visualization */}
</svg>

// FIND decorative elements (lines ~150-200):
<svg className="w-4 h-4 inline" viewBox="0 0 24 24">
  {/* Decorative shapes */}
</svg>

// REPLACE WITH:
<svg
  aria-hidden="true"
  className="w-4 h-4 inline"
  viewBox="0 0 24 24"
>
  {/* Decorative shapes */}
</svg>
```

---

### 1.10 File: src/components/Testimonials.tsx

**Purpose:** Testimonials with star ratings
**SVGs to Fix:** 1+ (star rating)

```typescript
// FIND star rating (lines ~80-120):
<div className="flex gap-1">
  {[...Array(5)].map((_, i) => (
    <svg key={i} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0..." />
    </svg>
  ))}
</div>

// REPLACE WITH:
<div
  className="flex gap-1"
  aria-label={`${rating} out of 5 stars`}
>
  {[...Array(5)].map((_, i) => (
    <svg
      key={i}
      aria-hidden="true"
      className="w-4 h-4"
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0..." />
    </svg>
  ))}
</div>
```

---

### 1.11 File: src/components/ResumeDownload.tsx

**Purpose:** Resume download buttons
**SVGs to Fix:** 2 (PDF and DOCX download icons)

```typescript
// FIND PDF download button (lines ~40-80):
<button onClick={() => downloadResume('pdf')} className="...">
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3..." />
  </svg>
  Download PDF
</button>

// REPLACE WITH:
<button
  onClick={() => downloadResume('pdf')}
  className="..."
  aria-label="Download resume as PDF"
>
  <svg
    aria-hidden="true"
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3..." />
  </svg>
  Download PDF
</button>

// FIND DOCX download button (lines ~80-120):
<button onClick={() => downloadResume('docx')} className="...">
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3..." />
  </svg>
  Download Word
</button>

// REPLACE WITH:
<button
  onClick={() => downloadResume('docx')}
  className="..."
  aria-label="Download resume as Word document"
>
  <svg
    aria-hidden="true"
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3..." />
  </svg>
  Download Word
</button>
```

---

### 1.12 File: src/components/KeyboardShortcutsHelp.tsx

**Purpose:** Keyboard shortcuts help modal
**SVGs to Fix:** 1+ (help icon, decorative elements)

```typescript
// FIND help icon (lines ~40-70):
<button onClick={toggleHelp} className="...">
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12..." />
  </svg>
</button>

// REPLACE WITH:
<button
  onClick={toggleHelp}
  className="..."
  aria-label="Show keyboard shortcuts help"
>
  <svg
    aria-hidden="true"
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12..." />
  </svg>
</button>

// FIND decorative keyboard symbols (lines ~120-180):
<svg className="inline w-4 h-4 mx-1" viewBox="0 0 24 24">
  {/* Keyboard symbol */}
</svg>

// REPLACE WITH:
<svg
  aria-hidden="true"
  className="inline w-4 h-4 mx-1"
  viewBox="0 0 24 24"
>
  {/* Keyboard symbol */}
</svg>
```

---

### 1.13 File: src/components/FloatingCTA.tsx

**Purpose:** Floating call-to-action
**SVGs to Fix:** 1 (CTA icon or decorative)

```typescript
// FIND CTA icon (lines ~20-50):
<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
  <path d="M..." />
</svg>

// REPLACE WITH:
<svg
  aria-label="Chat with Dico"
  className="w-6 h-6"
  fill="currentColor"
  viewBox="0 0 24 24"
>
  <path d="M..." />
</svg>

// OR if decorative:
<svg
  aria-hidden="true"
  className="w-6 h-6"
  fill="currentColor"
  viewBox="0 0 24 24"
>
  <path d="M..." />
</svg>
```

---

### 1.14 File: src/components/ThemeProvider.tsx

**Purpose:** Theme provider with visual theme toggle
**SVGs to Fix:** 2 (sun and moon icons for light/dark)

```typescript
// FIND sun icon (lines ~50-90):
export const SunIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 2a1 1 0..." />
  </svg>
);

// REPLACE WITH:
export const SunIcon = () => (
  <svg
    aria-label="Light theme"
    className="w-5 h-5"
    fill="currentColor"
    viewBox="0 0 20 20"
  >
    <path fillRule="evenodd" d="M10 2a1 1 0..." />
  </svg>
);

// FIND moon icon (lines ~90-130):
export const MoonIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path d="M17.293 13.293..." />
  </svg>
);

// REPLACE WITH:
export const MoonIcon = () => (
  <svg
    aria-label="Dark theme"
    className="w-5 h-5"
    fill="currentColor"
    viewBox="0 0 20 20"
  >
    <path d="M17.293 13.293..." />
  </svg>
);
```

---

### 1.15 File: src/components/Chat.tsx

**Purpose:** Chat component with message interface
**SVGs to Fix:** 1+ (send button, decorative)

```typescript
// FIND send button icon (lines ~100-150):
<button onClick={sendMessage} className="...">
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
  </svg>
</button>

// REPLACE WITH:
<button
  onClick={sendMessage}
  className="..."
  aria-label="Send message"
>
  <svg
    aria-hidden="true"
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
  </svg>
</button>

// OR for button label:
<button
  onClick={sendMessage}
  className="..."
  aria-label="Send message"
>
  Send
</button>
```

---

### 1.16 File: src/components/FilmStripGallery.tsx

**Purpose:** Film strip gallery visualization
**SVGs to Fix:** 1+ (all decorative)

```typescript
// FIND decorative SVGs (lines ~40-100):
<svg className="..." viewBox="0 0 100 100">
  {/* Decorative filmstrip patterns */}
</svg>

// REPLACE ALL WITH:
<svg
  aria-hidden="true"
  className="..."
  viewBox="0 0 100 100"
>
  {/* Decorative filmstrip patterns */}
</svg>
```

---

### 1.17 File: src/components/FitScoreGauge.tsx

**Purpose:** Fit score gauge visualization
**SVGs to Fix:** 2 (main gauge, legend)

```typescript
// FIND main gauge (lines ~60-120):
<svg className="w-full" viewBox="0 0 200 200">
  {/* Gauge visualization */}
</svg>

// REPLACE WITH:
<svg
  aria-label={`Fit score gauge showing ${score}% match`}
  className="w-full"
  viewBox="0 0 200 200"
>
  {/* Gauge visualization */}
</svg>

// FIND legend (lines ~120-160):
<svg className="w-full" viewBox="0 0 400 50">
  {/* Score scale legend */}
</svg>

// REPLACE WITH:
<svg
  aria-label="Score scale legend"
  className="w-full"
  viewBox="0 0 400 50"
>
  {/* Score scale legend */}
</svg>
```

---

### 1.18 File: src/components/errors/AIErrorBoundary.tsx

**Purpose:** Error boundary for AI features
**SVGs to Fix:** 1 (error icon)

```typescript
// FIND error icon (lines ~30-60):
<svg className="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4v2m0 4v2" />
</svg>

// REPLACE WITH:
<svg
  aria-label="AI feature error"
  className="w-12 h-12 text-red-500 mx-auto mb-4"
  fill="none"
  stroke="currentColor"
  viewBox="0 0 24 24"
>
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4v2m0 4v2" />
</svg>
```

---

### 1.19 File: src/components/ErrorBoundary.tsx

**Purpose:** General error boundary
**SVGs to Fix:** 1 (error icon)

```typescript
// FIND error icon (lines ~30-60):
<svg className="w-16 h-16 text-yellow-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4v2m0 4v2" />
</svg>

// REPLACE WITH:
<svg
  aria-label="An error occurred"
  className="w-16 h-16 text-yellow-500 mx-auto mb-4"
  fill="none"
  stroke="currentColor"
  viewBox="0 0 24 24"
>
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4v2m0 4v2" />
</svg>
```

---

## BATCH 2: HEADING HIERARCHY

### 2.1 File: src/app/page.tsx

**Change:** Add role="main" to main element

```typescript
// FIND (line 71):
<main id="main-content" className="min-h-screen">

// REPLACE WITH:
<main id="main-content" role="main" className="min-h-screen">
```

---

### 2.2 File: src/components/Footer.tsx

**Change:** Remove heading levels from contact info subsections

```typescript
// FIND (lines ~80-130):
<section>
  <h2>Get in Touch</h2>
  <div>
    <h3>Email</h3>
    <p>hello@dicoangelo.com</p>
  </div>
  <div>
    <h3>Phone</h3>
    <p>+1 (555) 123-4567</p>
  </div>
</section>

// REPLACE WITH:
<section>
  <h2>Get in Touch</h2>
  <div>
    <p className="font-semibold text-lg">Email</p>
    <p>hello@dicoangelo.com</p>
  </div>
  <div>
    <p className="font-semibold text-lg">Phone</p>
    <p>+1 (555) 123-4567</p>
  </div>
</section>

// RATIONALE: Contact info items don't need heading hierarchy; styled paragraphs are more semantically correct
```

---

### 2.3 File: src/components/sections/ProofSection.tsx

**Verification:** Ensure main heading is h2

```typescript
// VERIFY (lines ~20-30):
<h2 className="text-3xl font-bold">Proof in Numbers</h2>

// ✅ CORRECT - Should be h2 for section heading
// NO CHANGE NEEDED

// IF it's h1 or h3, change to h2:
<h2 className="text-3xl font-bold">Proof in Numbers</h2>
```

---

### 2.4 File: src/components/sections/SystemsSection.tsx

**Verification:** Ensure main heading is h2

```typescript
// VERIFY (lines ~20-30):
<h2 className="text-3xl font-bold">META-VENGINE Systems</h2>

// ✅ CORRECT - Should be h2 for section heading
// NO CHANGE NEEDED
```

---

### 2.5 File: src/components/sections/ProjectsSection.tsx

**Verification:** Ensure main heading is h2

```typescript
// VERIFY (lines ~20-30):
<h2 className="text-3xl font-bold">Projects & Products</h2>

// ✅ CORRECT - Should be h2 for section heading
// NO CHANGE NEEDED
```

---

### 2.6 File: src/components/sections/ArenaSection.tsx

**Verification:** Ensure main heading is h2

```typescript
// VERIFY (lines ~20-30):
<h2 className="text-3xl font-bold">In The Arena</h2>

// ✅ CORRECT - Should be h2 for section heading
// NO CHANGE NEEDED
```

---

### 2.7 File: src/components/sections/ContactSection.tsx

**Verification:** Ensure main heading is h2

```typescript
// VERIFY (lines ~20-30):
<h2 className="text-3xl font-bold">Let's Connect</h2>

// ✅ CORRECT - Should be h2 for section heading
// NO CHANGE NEEDED
```

---

## BATCH 3: CSP SECURITY

### 3.1 File: src/middleware.ts

**Change:** Remove 'strict-dynamic' from script-src directive

```typescript
// FIND (lines ~35-55):
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

// REPLACE WITH:
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

// CHANGE SUMMARY:
// - REMOVED: 'strict-dynamic'
// - KEPT: 'self' 'nonce-${nonce}' https: http:
// - REASON: 'strict-dynamic' blocks Next.js chunks unnecessarily
```

---

### 3.2 File: src/app/layout.tsx

**Verification:** Ensure all script tags have nonce attribute

```typescript
// VERIFY EACH SCRIPT TAG (lines ~150-200):

// Pattern 1: JSON-LD scripts
<Script
  nonce={nonce}  // ✅ MUST HAVE THIS
  id="structured-data-person"
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
/>

// Pattern 2: Google Analytics
<Script
  nonce={nonce}  // ✅ MUST HAVE THIS
  src="https://www.googletagmanager.com/gtag/js?id=..."
  async
/>

// IF ANY SCRIPT IS MISSING nonce={nonce}, ADD IT:
<Script
  nonce={nonce}  // ← ADD THIS LINE
  id="my-script"
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
/>

// VERIFY:
grep -n "nonce={nonce}" src/app/layout.tsx
// Should show 3+ matches for all Script components
```

---

## Summary of Changes

### Total Files Modified: 28

**Batch 1 (SVG Accessibility):** 19 files, ~25 SVGs
**Batch 2 (Heading Hierarchy):** 7 files, 1 main change + 5 verifications
**Batch 3 (CSP Security):** 2 files, 1 critical + 1 verification

### Change Types

| Type | Count | Priority |
|------|-------|----------|
| Add aria-label | ~20 | HIGH |
| Add aria-hidden | ~5 | HIGH |
| Add role="main" | 1 | MEDIUM |
| Remove 'strict-dynamic' | 1 | CRITICAL |
| Verify nonce attributes | 3+ | CRITICAL |
| Change heading levels | 2-3 | MEDIUM |

---

**Document Version:** 1.0
**Last Updated:** February 1, 2026
**Ready for Implementation:** ✅ YES
