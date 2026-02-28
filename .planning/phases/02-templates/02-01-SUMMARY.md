---
phase: 02-templates
plan: 01
subsystem: ui
tags: [astro, content-collections, zod, glob-loader, markdown, css]

# Dependency graph
requires:
  - phase: 01-foundation
    provides: BaseLayout.astro, global.css with design tokens, src/content.config.ts stub
provides:
  - Zod schema for work collection using Astro 5 glob loader and image() helper
  - One validated case study stub (booking-checkout) with placeholder images
  - .prose CSS utility class for markdown body content in case study and CV pages
affects:
  - 02-02 (work index page — depends on getCollection('work') returning valid entries)
  - 02-03 (case study template — depends on schema fields and .prose styles)
  - 03-content (full case study content — depends on schema frontmatter contract)

# Tech tracking
tech-stack:
  added: [astro/loaders glob, astro/zod, astro image() helper]
  patterns:
    - Astro 5 glob loader (not Astro 4 type:'content') for content collections
    - schema as function receiving { image } to enable image() helper
    - Relative image paths from content/ to assets/ using ../../assets/work/

key-files:
  created:
    - src/content/work/booking-checkout.md
    - src/assets/work/booking-checkout/hero.jpg
    - src/assets/work/booking-checkout/card-main.jpg
    - src/assets/work/booking-checkout/card-secondary.jpg
  modified:
    - src/content.config.ts
    - src/styles/global.css

key-decisions:
  - "Glob loader pattern **/*.md with base ./src/content/work — Astro 5 API (not type:'content' which is Astro 4)"
  - "Schema as function ({ image }) => z.object({}) — required when any field uses image() helper; plain z.object() makes image() unavailable"
  - "year field uses z.number() (not z.coerce.date()) — year is a 4-digit integer, not an ISO date string"
  - ".prose class is global and shared by both case study pages and CV layout — DRY pattern"
  - "Placeholder images as minimal valid JPEGs via Node.js Buffer — real JPEG bytes so Astro image optimizer does not error"

patterns-established:
  - "Content image paths: relative from src/content/work/ using ../../assets/work/{slug}/ pattern"
  - "Work entry flat structure: src/content/work/{slug}.md — entry.id becomes slug, giving clean /work/{slug} URL"
  - "draft field: z.boolean().optional().default(false) — allows hiding entries without deletion"

requirements-completed: [CASE-01, CASE-03]

# Metrics
duration: 2min
completed: 2026-02-28
---

# Phase 2 Plan 01: Content Collections Schema and Foundation Summary

**Astro 5 work collection schema with glob loader, Zod image() helper, one validated booking-checkout stub with JPEG placeholders, and shared .prose CSS for markdown body content**

## Performance

- **Duration:** ~2 min
- **Started:** 2026-02-28T09:28:28Z
- **Completed:** 2026-02-28T09:29:49Z
- **Tasks:** 3
- **Files modified:** 6

## Accomplishments

- Replaced content.config.ts stub with full Astro 5 work collection schema using glob loader and image() helper
- Created booking-checkout.md with all required frontmatter fields validated against the Zod schema
- Added .prose utility block to global.css with 10 rules covering h2, h3, p, lists, img, a, blockquote, and code
- All three tasks verified by passing npm run build with zero errors

## Task Commits

Each task was committed atomically:

1. **Task 1: Define Content Collections schema for work entries** - `a287e0e` (feat)
2. **Task 2: Create placeholder images and one case study stub markdown file** - `6d5eae3` (feat)
3. **Task 3: Add prose styles to global.css** - `ef7051b` (feat)

## Files Created/Modified

- `src/content.config.ts` - Full work collection schema with glob loader, Zod, and image() helper
- `src/content/work/booking-checkout.md` - Case study stub with complete valid frontmatter
- `src/assets/work/booking-checkout/hero.jpg` - Minimal valid JPEG placeholder (1x1 gray)
- `src/assets/work/booking-checkout/card-main.jpg` - Minimal valid JPEG placeholder (1x1 gray)
- `src/assets/work/booking-checkout/card-secondary.jpg` - Minimal valid JPEG placeholder (1x1 gray)
- `src/styles/global.css` - .prose block appended (60 lines added, no existing rules modified)

## Decisions Made

- **Glob loader vs type:'content'**: Used `glob` from `astro/loaders` — this is the Astro 5 API. Using `type: 'content'` would be the Astro 4 approach and incompatible.
- **Schema function form**: `schema: ({ image }) => z.object({...})` is required (not `schema: z.object({})`). The function receives `image` as an argument; without this form `image()` is unavailable and TypeScript errors.
- **year as z.number()**: Year is a 4-digit integer (2022), not an ISO date string. Using `z.coerce.date()` would require ISO format and fail.
- **Real JPEG bytes**: Placeholder images created as minimal valid JPEG binary (not renamed text files) so Astro's image optimizer processes them without errors.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None - build passed on first attempt for all three tasks.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Schema contract is locked: title, company, year, description, heroImage, cardImage, cardImageSecondary, order, draft
- getCollection('work') will return the booking-checkout entry — ready for work index page (02-02)
- .prose styles available globally — ready for case study template (02-03)
- Image paths pattern established: ../../assets/work/{slug}/ relative from src/content/work/

---
*Phase: 02-templates*
*Completed: 2026-02-28*
