# Gallery photos

The photo manifest is `src/content/in-the-field.ts`. Photos appear in its order across two opposing marquees, with `feature.webp` first. New additions are interspersed among the existing photos.

## Assets and image handling

- Existing assets (`feature.webp` and `photo-01.webp` through `photo-19.webp`) retain their existing files and Next/Image optimization behavior.
- The October additions are `photo-20.webp`, `photo-22.webp`, `photo-23.webp`, `photo-24.webp`, `photo-25.webp`, `photo-27.webp`, `photo-28.webp` and `photo-29.webp`.
- These additions use web-sized, losslessly encoded WebP files prepared for up to 3× gallery-card pixel density. Lossless encoding preserves the resized pixels; resizing itself changes pixel dimensions.
- Their manifest entries set `unoptimized: true`, which is passed to Next/Image. This serves the prepared files directly and avoids another potentially lossy optimization pass.
- Embedded ICC color profiles are preserved; EXIF metadata is removed from the prepared assets.
- Supplied originals and pixel-verified, full-resolution lossless masters are retained locally outside `public/`. Only the web-sized gallery assets are published.

## Display dimensions

Cards are 288 CSS pixels tall. The manifest's `aspect` selects a width:

- `portrait`: 224 CSS pixels
- `square`: 288 CSS pixels
- `landscape` (default): 448 CSS pixels

The gallery keeps its existing `object-cover` presentation. Image size hints match these card widths.

## Adding a photo

1. Prepare the web asset and retain its original outside `public/`.
2. Add an entry to `src/content/in-the-field.ts` with a unique ID, file path, descriptive alt text and aspect.
3. For a prepared lossless asset that must bypass further optimization, set `unoptimized: true`.
4. Add captions, locations or dates only when confirmed. Do not infer attendees' names or affiliations.
5. Place the entry among existing images while retaining the feature image first.

## Removing a photo

Remove its manifest entry. An unreferenced file will not appear in the gallery.
