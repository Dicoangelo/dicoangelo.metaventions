# Graveyard

Disconnected components archived here per `~/.claude/rules/dead-code-policy.md`.

## FilmStripGallery.tsx

- **Original path:** `src/components/FilmStripGallery.tsx`
- **Archived:** 2026-04-29
- **Capability:** Horizontal-scroll photo strip with 35mm film perforations, snap scrolling, left/right nav arrows, hover scale, light/dark theming.
- **Why disconnected:** Was never imported into any page (5 placeholder image paths, corporate captions). Replaced by `src/components/sections/InTheFieldSection.tsx` for the "in the field" gallery use case, which uses a cleaner editorial grid layout matching the bxl reference.
- **How to recover:** Restore `git mv .graveyard/FilmStripGallery.tsx src/components/FilmStripGallery.tsx`. Reusable as-is for any horizontal-scroll image strip; just supply real `frames[]` and import into a page.
