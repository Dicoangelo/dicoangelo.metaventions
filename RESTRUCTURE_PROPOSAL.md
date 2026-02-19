# Portfolio Site Restructure Proposal

**Date:** 2026-02-11
**Status:** Saved for later

## Current Problem
- 29 sections on one page — way too long (~43,000px)
- `ProjectShowcase` and `ProjectsSection` showed overlapping projects (fixed — removed ProjectsSection)
- `AnimatedMetrics` overlaps with `ProofSection`
- Side nav dots AND top nav = redundant

## Proposed Structure

### Homepage (`/`) — 7 sections max

| # | Section | Notes |
|---|---------|-------|
| 1 | Hero | As-is |
| 2 | TLDR Banner | Recruiter hook |
| 3 | AI-Augmented | Human x AI positioning |
| 4 | Ask Me Anything | Killer differentiator |
| 5 | Proof snapshot | Top 4-6 metrics only + "See all proof" link |
| 6 | Project previews | 3 featured cards with thumbnails → `/projects` |
| 7 | Contact + Footer | As-is |

### New Pages

| Route | Content (moved from homepage) |
|-------|------|
| `/projects` | `ProjectShowcase` + `ProjectsSection` merged — full grid with filters |
| `/resume` | `ResumeDownload` + `CareerTimeline` + `SkillsVisualization` |
| `/analyze` | Already exists — JD Analyzer |
| `/see-more` | Already exists — technical deep dive |

### Sections to consolidate
- `AnimatedMetrics` — merge into `ProofSection`
- `LogoWall` — fold into footer or proof section
- `ArenaSection` — move to `/resume` as "Beyond Work"
- `SectionNav` (side dots) — remove, top nav handles it
- `Testimonials` — move to `/resume` or keep 1-2 on homepage

### Nav Update

```
Current:  Ask AI | Resume | Timeline | Skills | Systems | Projects | Analyze | Contact
                    (all #hash links)

Proposed: Ask AI | Projects | Resume | Analyze | Contact
              ↓        ↓         ↓        ↓        ↓
           #section  /projects  /resume  /analyze  #section
```

### What this fixes
1. Page length: ~43,000px → ~8,000px
2. Better navigation: real pages instead of infinite scroll
3. Faster load: homepage only loads what's needed
4. SEO: separate pages = separate meta tags
5. Cleaner UX: focused content per page

### Implementation order
1. ✅ Fix repetition bug (removed `ProjectsSection` from homepage)
2. Create `/projects` page with merged content
3. Create `/resume` page with timeline + skills + download
4. Update Nav to use real routes
5. Slim down homepage to 7 sections
6. Deploy
