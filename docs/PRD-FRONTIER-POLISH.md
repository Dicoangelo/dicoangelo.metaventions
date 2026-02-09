# PRD: Frontier-Level Portfolio Polish

**Project:** dicoangelo.com
**Version:** 1.0.0
**Created:** 2026-02-05
**Status:** Ready for Implementation

---

## Vision

Transform dicoangelo.com into an undeniably impressive portfolio that communicates **AI-Augmented Operator + Systems Thinker** positioning. The site should feel like a product from 2028 — sophisticated, performant, and memorable.

**Core Message:** "I orchestrate sophisticated systems with vision and judgment."

**Quality Bar:** Linear.app smoothness × Stripe.com depth × Vercel.com performance × Raycast.com interactivity

---

## Target Audience

- Technical hiring managers / CTOs
- Enterprise buyers / partners
- Investors / VCs
- Anyone evaluating capability and judgment

---

## Quality Gates (All Stories)

```bash
npm run typecheck && npm run lint && npm run test
```

**UI Stories:** Verify with dev-browser skill before marking complete.

---

## Epic 1: Visual Foundation

### Story 1.1: Ambient Particle System

**As a** visitor
**I want** subtle, intelligent particle animations in the background
**So that** the site feels alive and premium without being distracting

**Acceptance Criteria:**
- [ ] Particles respond to scroll position (density/speed changes)
- [ ] Particles subtly attract toward cursor on hover
- [ ] Performance: < 5% GPU usage, requestAnimationFrame optimized
- [ ] Respects `prefers-reduced-motion`
- [ ] Graceful degradation on mobile (fewer particles)
- [ ] Colors adapt to dark/light mode

**Technical Notes:**
- Use canvas or WebGL (not DOM elements)
- Consider tsParticles or custom implementation
- Lazy load after LCP

---

### Story 1.2: 3D Hero Element

**As a** visitor
**I want** an interactive 3D element in the hero section
**So that** I immediately understand this person operates at a different level

**Acceptance Criteria:**
- [ ] 3D geometric form (abstract, not literal) using Three.js/React Three Fiber
- [ ] Responds to mouse movement (subtle rotation/distortion)
- [ ] Morphs on scroll (transforms as user scrolls down)
- [ ] Mobile: static or simplified animation (touch to interact)
- [ ] Loads progressively (placeholder → low-poly → full detail)
- [ ] < 200KB total asset size for 3D

**Design Direction:**
- Abstract crystalline/network structure representing "systems thinking"
- Not a face, not a logo — something that suggests complexity and orchestration
- Inspired by: generative art, data visualization aesthetics

---

### Story 1.3: Kinetic Typography

**As a** visitor
**I want** headline text that animates with purpose
**So that** the messaging lands with impact

**Acceptance Criteria:**
- [ ] Hero headline reveals with staggered character/word animation
- [ ] Scroll-triggered text animations for section headers
- [ ] At least one "signature" text effect (split, blur-in, or magnetic)
- [ ] Animations complete within 800ms (not sluggish)
- [ ] Text remains accessible (not hidden until animation)
- [ ] Works with variable fonts for weight transitions

**Technical Notes:**
- Framer Motion or GSAP for orchestration
- SplitType or custom splitting for character control

---

### Story 1.4: Premium Color System

**As a** visitor
**I want** a sophisticated color palette with dynamic gradients
**So that** the visual identity feels elevated and intentional

**Acceptance Criteria:**
- [ ] Define CSS custom properties for full palette
- [ ] Animated gradient backgrounds (subtle movement, not distracting)
- [ ] Accent color that shifts based on section/context
- [ ] Gradient text for key headlines (with solid fallback)
- [ ] Glow effects on interactive elements
- [ ] Consistent across dark and light modes

---

### Story 1.5: Scroll-Triggered Animations

**As a** visitor
**I want** content to reveal elegantly as I scroll
**So that** the experience feels crafted and intentional

**Acceptance Criteria:**
- [ ] Intersection Observer-based triggers (not scroll listeners)
- [ ] Staggered reveals for lists/grids
- [ ] Parallax effects on key visual elements (subtle, not nauseating)
- [ ] Progress indicator showing scroll position
- [ ] Animations only trigger once (not on every scroll pass)
- [ ] All animations respect `prefers-reduced-motion`

---

## Epic 2: Interaction Layer

### Story 2.1: Command Palette (⌘K)

**As a** power user
**I want** a command palette for quick navigation
**So that** I can explore the site efficiently and be impressed by the attention to detail

**Acceptance Criteria:**
- [ ] Opens with ⌘K (Mac) / Ctrl+K (Windows)
- [ ] Fuzzy search across all pages/sections
- [ ] Quick actions: toggle theme, contact, view resume, external links
- [ ] Recent searches remembered (localStorage)
- [ ] Keyboard navigation (arrows, enter, escape)
- [ ] Smooth open/close animation
- [ ] Mobile: accessible via floating button

**Commands to Include:**
- Navigation: Home, About, Projects, Contact
- Actions: Toggle Dark Mode, Download Resume, Copy Email
- External: GitHub, LinkedIn, Twitter
- Easter eggs: "terminal", "matrix", "hire me"

---

### Story 2.2: Intelligent Cursor

**As a** visitor
**I want** the cursor to respond intelligently to page elements
**So that** interactions feel premium and intentional

**Acceptance Criteria:**
- [ ] Custom cursor that follows mouse with slight delay (lerp)
- [ ] Cursor morphs on interactive elements (grows, changes shape)
- [ ] Magnetic effect on buttons (cursor + button attract)
- [ ] Text cursor mode over paragraphs
- [ ] Hide on mobile (touch devices)
- [ ] Respects system cursor preference
- [ ] Doesn't interfere with actual clicking

---

### Story 2.3: Cinematic Dark/Light Toggle

**As a** visitor
**I want** a beautiful theme transition
**So that** even utility actions feel premium

**Acceptance Criteria:**
- [ ] Toggle with cinematic transition (not instant swap)
- [ ] Options: radial wipe from toggle, full-screen fade, or clip-path reveal
- [ ] Respects system preference on first visit
- [ ] Persists choice in localStorage
- [ ] Smooth color interpolation (not jarring)
- [ ] All components properly themed

---

### Story 2.4: Terminal Easter Egg

**As a** curious visitor
**I want** to discover a hidden terminal mode
**So that** I'm delighted and see the technical depth

**Acceptance Criteria:**
- [ ] Activated via command palette ("terminal") or keyboard sequence
- [ ] Full-screen terminal aesthetic overlay
- [ ] Type commands to navigate: `cd projects`, `cat about.txt`, `ls skills`
- [ ] Fun responses to commands like `sudo hire-me`, `whoami`, `help`
- [ ] ASCII art welcome message
- [ ] Exit with `exit` or Escape key
- [ ] Mobile-friendly with on-screen keyboard consideration

---

### Story 2.5: Micro-interactions

**As a** visitor
**I want** subtle feedback on every interaction
**So that** the site feels responsive and alive

**Acceptance Criteria:**
- [ ] Button hover states with scale/glow
- [ ] Link underline animations
- [ ] Form input focus states with animation
- [ ] Copy-to-clipboard confirmations
- [ ] Loading states with skeleton screens
- [ ] Success/error states with motion
- [ ] Sound effects option (off by default, toggle in settings)

---

## Epic 3: Navigation Excellence

### Story 3.1: Adaptive Navigation

**As a** visitor
**I want** navigation that adapts to my scroll behavior
**So that** it's always accessible but never intrusive

**Acceptance Criteria:**
- [ ] Initially visible, hides on scroll down
- [ ] Reappears on scroll up or hover at top
- [ ] Becomes translucent/blur backdrop when over content
- [ ] Shrinks/simplifies after scrolling past hero
- [ ] Current section indicator
- [ ] Smooth transitions between states

---

### Story 3.2: Section Side Navigation

**As a** visitor
**I want** a side indicator showing my position
**So that** I can quickly jump between sections

**Acceptance Criteria:**
- [ ] Vertical dots/lines on right edge
- [ ] Active section highlighted
- [ ] Click to jump to section (smooth scroll)
- [ ] Tooltip on hover showing section name
- [ ] Only visible on long pages
- [ ] Fades out on mobile or becomes swipe indicator

---

### Story 3.3: Mobile Gesture Navigation

**As a** mobile visitor
**I want** intuitive gesture controls
**So that** navigation feels native

**Acceptance Criteria:**
- [ ] Swipe between major sections
- [ ] Pull-to-refresh style interaction for easter eggs
- [ ] Bottom sheet for navigation menu
- [ ] Haptic feedback on supported devices
- [ ] Thumb-zone optimized tap targets

---

## Epic 4: Social Proof & Content

### Story 4.1: Testimonial System

**As a** visitor
**I want** to see credible testimonials
**So that** I trust this person's capabilities

**Acceptance Criteria:**
- [ ] Carousel or staggered grid layout
- [ ] Photos with subtle parallax or hover effect
- [ ] Name, title, company for each
- [ ] Quote with highlight animation on key phrases
- [ ] Link to LinkedIn profile where possible
- [ ] Mobile: swipeable cards

---

### Story 4.2: Logo Wall

**As a** visitor
**I want** to see companies/projects associated
**So that** I understand the caliber of work

**Acceptance Criteria:**
- [ ] Grid of logos (grayscale default, color on hover)
- [ ] Infinite scroll animation option
- [ ] Click to filter projects by that company
- [ ] Tooltip with brief context
- [ ] Responsive grid (adapts to screen size)

---

### Story 4.3: Animated Metrics

**As a** visitor
**I want** to see impressive numbers
**So that** achievements feel tangible

**Acceptance Criteria:**
- [ ] Count-up animation when scrolled into view
- [ ] Key metrics: projects, years, technologies, impact numbers
- [ ] Subtle pulse/glow when animation completes
- [ ] Context labels (not just numbers)
- [ ] Only animate once per session

---

### Story 4.4: Case Study Presentation

**As a** visitor
**I want** deep-dive case studies
**So that** I understand the depth of work

**Acceptance Criteria:**
- [ ] Each case study as a mini-journey (scroll-driven)
- [ ] Before/after comparisons where applicable
- [ ] Tech stack badges
- [ ] Outcome metrics highlighted
- [ ] "View Live" and "View Code" CTAs where applicable
- [ ] Related projects suggestion

---

### Story 4.5: AI-Augmentation Narrative

**As a** visitor
**I want** to understand the AI-augmented approach
**So that** I see this as a differentiator, not a limitation

**Acceptance Criteria:**
- [ ] Dedicated section or woven into About
- [ ] Framing: "Orchestration mastery" not "AI does my work"
- [ ] Visual showing human judgment + AI capability
- [ ] Examples of complex systems orchestrated
- [ ] Badge/identifier: "AI-Augmented Operator" (subtle, premium)
- [ ] Links to methodology or philosophy

---

## Epic 5: Mobile Delight

### Story 5.1: Touch-Optimized Interactions

**As a** mobile visitor
**I want** interactions designed for touch
**So that** the experience feels native, not adapted

**Acceptance Criteria:**
- [ ] All tap targets minimum 44x44px
- [ ] Swipe gestures where appropriate
- [ ] No hover-dependent information
- [ ] Touch feedback (scale, ripple)
- [ ] Optimized for one-handed use

---

### Story 5.2: App-Like Transitions

**As a** mobile visitor
**I want** smooth page transitions
**So that** the site feels like a native app

**Acceptance Criteria:**
- [ ] Shared element transitions between pages
- [ ] Slide/fade transitions based on navigation direction
- [ ] Loading states that don't flash
- [ ] Back gesture support (swipe from edge)
- [ ] Bottom navigation option for key sections

---

### Story 5.3: Offline Capability

**As a** mobile visitor
**I want** basic offline access
**So that** I can view content without connection

**Acceptance Criteria:**
- [ ] Service worker caches critical assets
- [ ] Offline page with cached content
- [ ] Clear indication when offline
- [ ] Resume sync when back online
- [ ] PWA installable (manifest.json complete)

---

## Epic 6: Personalization & Intelligence

### Story 6.1: Visitor Context Detection

**As the** site owner
**I want** to understand visitor context
**So that** I can tailor the experience

**Acceptance Criteria:**
- [ ] Detect: time of day, referrer, device, return visitor
- [ ] Store preferences anonymously (no PII)
- [ ] Adjust greeting based on time ("Good evening")
- [ ] Highlight relevant content based on referrer (GitHub → projects)
- [ ] Privacy-first: all detection client-side

---

### Story 6.2: Return Visitor Experience

**As a** return visitor
**I want** the site to remember me
**So that** I feel recognized

**Acceptance Criteria:**
- [ ] "Welcome back" messaging
- [ ] Remember theme preference
- [ ] Show "New since your last visit" for updated content
- [ ] Skip intro animations on repeat visits
- [ ] Clear way to reset/clear data

---

### Story 6.3: Dynamic Content Adaptation

**As a** visitor
**I want** content that adapts to my interests
**So that** I see the most relevant information

**Acceptance Criteria:**
- [ ] Track section engagement (time spent, clicks)
- [ ] Surface related content based on behavior
- [ ] A/B test headlines/CTAs
- [ ] Smart project ordering based on interest signals
- [ ] All tracking anonymous and transparent

---

## Epic 7: Performance & Polish

### Story 7.1: Progressive Loading Strategy

**As a** visitor
**I want** fast initial load with progressive enhancement
**So that** I see content immediately and features enhance over time

**Acceptance Criteria:**
- [ ] Critical CSS inlined
- [ ] Above-fold content renders < 1s
- [ ] 3D/heavy animations lazy loaded
- [ ] Images: next/image with blur placeholder
- [ ] Fonts: display swap, preload critical
- [ ] Code splitting by route

---

### Story 7.2: Core Web Vitals Excellence

**As the** site owner
**I want** perfect CWV scores
**So that** the site ranks well and feels fast

**Acceptance Criteria:**
- [ ] LCP < 1.5s
- [ ] CLS < 0.1
- [ ] INP < 100ms
- [ ] Lighthouse score > 95 all categories
- [ ] Real User Monitoring setup (Vercel Analytics)
- [ ] Performance budget enforced in CI

---

### Story 7.3: Graceful Degradation

**As a** visitor on a low-end device
**I want** a functional experience
**So that** I can still access content

**Acceptance Criteria:**
- [ ] Detect device capability (GPU, memory)
- [ ] Disable heavy animations on low-end
- [ ] Serve lighter assets when appropriate
- [ ] Error boundaries prevent full crashes
- [ ] Fallback UI for unsupported features

---

### Story 7.4: Final Polish Pass

**As the** site owner
**I want** obsessive attention to detail
**So that** nothing feels unfinished

**Acceptance Criteria:**
- [ ] Consistent spacing system throughout
- [ ] All focus states visible and styled
- [ ] No layout shift on any interaction
- [ ] Favicon set (all sizes, dark/light)
- [ ] OG images generated for all pages
- [ ] 404 page with personality
- [ ] Print stylesheet
- [ ] RSS feed for blog/updates

---

## Implementation Order

**Phase 1: Foundation (Stories to ship first)**
1. 1.4 Premium Color System
2. 1.5 Scroll-Triggered Animations
3. 2.3 Cinematic Dark/Light Toggle
4. 3.1 Adaptive Navigation
5. 7.1 Progressive Loading Strategy

**Phase 2: Wow Factor**
1. 1.1 Ambient Particle System
2. 1.2 3D Hero Element
3. 1.3 Kinetic Typography
4. 2.2 Intelligent Cursor
5. 2.5 Micro-interactions

**Phase 3: Depth**
1. 2.1 Command Palette
2. 2.4 Terminal Easter Egg
3. 4.1-4.5 Social Proof suite
4. 3.2 Section Side Navigation

**Phase 4: Differentiation**
1. 6.1-6.3 Personalization suite
2. 5.1-5.3 Mobile Delight suite
3. 7.2-7.4 Performance excellence

---

## Success Metrics

- **Engagement:** Average session duration > 3 minutes
- **Impression:** Bounce rate < 30%
- **Technical:** Lighthouse > 95 all categories
- **Conversion:** Contact form submissions increase 50%
- **Viral:** Social shares of portfolio increase
- **Recognition:** Featured in design galleries (Awwwards, CSS Design Awards)

---

## References & Inspiration

- [Linear.app](https://linear.app) — Smooth animations, attention to detail
- [Stripe.com](https://stripe.com) — 3D elements, scroll storytelling
- [Vercel.com](https://vercel.com) — Dark mode excellence, performance
- [Raycast.com](https://raycast.com) — Command palette, keyboard-first
- [Apple.com](https://apple.com) — Cinematic transitions, premium feel
- [lusion.co](https://lusion.co) — WebGL mastery
- [dennissnellenberg.com](https://dennissnellenberg.com) — Portfolio excellence

---

## Notes

This PRD targets **frontier-level** quality. Not every story needs to ship for V1, but each story is designed to be independently deployable. Prioritize based on impact and effort.

The goal: When someone lands on this site, they should think "This person operates at a different level."
