---
phase: 02-templates
plan: 03
subsystem: ui
tags: [astro, content-collections, getStaticPaths, render, astro-assets, prose]

# Dependency graph
requires:
  - phase: 02-01
    provides: Work collection schema, glob loader config, astro:assets Image helper, .prose CSS class, booking-checkout stub
  - phase: 02-02
    provides: Confirmed entry.id slug pattern, draft filter convention
provides:
  - Dynamic case study detail page at /work/[id] generating one page per .md file
  - Hero image full-width with 520px max-height and object-fit cover
  - Centered case-header (h1 title + company — year meta line) below hero
  - .prose-wrapped Content component rendering full markdown body
  - Zero-code page registration: new .md file in src/content/work/ gets its own /work/[id] page
affects: [03-content]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Astro 5 standalone render(): import { render } from 'astro:content' — NOT entry.render() (Astro 4 removed)"
    - "getStaticPaths with getCollection draft filter and params: { id: entry.id }"
    - "entry.id as URL param — bracket filename [id].astro matches params key"
    - "Content component from render(entry) for compiled markdown body"
    - "Hero image: full-width div wrapper, max-height 520px overflow hidden, object-fit cover"

key-files:
  created:
    - src/pages/work/[id].astro
  modified: []

key-decisions:
  - "render() imported as standalone from 'astro:content' — entry.render() was Astro 4 API, removed in Astro 5"
  - "[id].astro filename matches params: { id: entry.id } — bracket key must match filename exactly"
  - "entry.id (not entry.slug) — consistent with 02-02 pattern; slug no longer exists in Astro 5"
  - "Draft filtering in getStaticPaths — draft entries produce no page; consistent with index filtering"
  - "case-body max-width: 720px — prose readability constraint independent of .container max-width"

patterns-established:
  - "Astro 5 render pattern: const { Content } = await render(entry) — use for all content collection markdown rendering"
  - "getStaticPaths pattern: getCollection filter + entries.map({ params: { id: entry.id }, props: { entry } })"
  - "Hero image wrapper: div.case-hero max-height + overflow:hidden + img object-fit:cover"

requirements-completed: [CASE-02, CASE-03]

# Metrics
duration: ~5min
completed: 2026-02-28
---

# Phase 2 Plan 03: Case Study Detail Summary

**Dynamic /work/[id] case study page with getStaticPaths, standalone render(), full-width hero image, centered metadata header, and .prose markdown body**

## Performance

- **Duration:** ~5 min
- **Started:** 2026-02-28
- **Completed:** 2026-02-28
- **Tasks:** 1
- **Files modified:** 1

## Accomplishments
- Created `src/pages/work/[id].astro` generating one static page per non-draft work collection entry
- `/work/booking-checkout` builds and renders: hero image, centered title h1, "Booking.com — 2023" meta line, and prose markdown body
- Used Astro 5's standalone `render()` function (not the removed `entry.render()` Astro 4 pattern)
- Build verified at 4 pages: /, /work/booking-checkout, /cv, /404

## Task Commits

Each task was committed atomically:

1. **Task 1: Create dynamic case study page src/pages/work/[id].astro** - `63e3906` (feat)

**Plan metadata:** (committed in combined docs commit)

## Files Created/Modified
- `src/pages/work/[id].astro` — New file: getStaticPaths with getCollection, render(entry), BaseLayout, case-hero/case-header/case-body structure, scoped CSS

## Decisions Made
- `render` imported as a standalone named import from `'astro:content'` alongside `getCollection` — the Astro 4 `entry.render()` method was removed in Astro 5 and would cause a runtime error
- Filename is `[id].astro` (not `[slug].astro`) and params key is `id` — must match exactly for Astro routing to resolve the dynamic segment
- `case-body max-width: 720px` applied as a separate constraint inside `.container` — keeps prose line length readable independent of the 1100px container max-width

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None — build passed on first attempt. 4 pages generated as expected.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- All Phase 2 page templates are complete: work index (/), case study detail (/work/[id]), CV (/cv), 404
- Phase 3 content work can add new .md files to src/content/work/ to populate both the index and get auto-generated detail pages
- NDA status of Docker case studies should be assessed before Phase 3 begins (existing blocker in STATE.md)

---
*Phase: 02-templates*
*Completed: 2026-02-28*
