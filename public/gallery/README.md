# Gallery photos

Drop photos here. Filenames are referenced by `src/content/in-the-field.ts`.

## Convention

- Format: `.jpg` or `.webp` (Next/Image will serve AVIF/WebP automatically)
- Naming: `kebab-case-event-year.jpg` (e.g. `bit-houston-2026.jpg`, `mfth-bootcamp-2026.jpg`)
- Aspect ratio:
  - Feature image: 16:9 (e.g. 1920x1080)
  - Grid images: 4:3 (e.g. 1600x1200)
- Size: target under 400KB per file. Run through https://squoosh.app/ if needed.
- Orientation: landscape preferred. Portrait works in grid slots if you set `aspect: 'portrait'` in the manifest.

## Adding a new photo

1. Drop the file in this directory.
2. Add an entry to `src/content/in-the-field.ts`.
3. Done. The section auto-renders from the manifest.

## Removing a photo

Remove the entry from the manifest. The file can stay; it just won't render.
