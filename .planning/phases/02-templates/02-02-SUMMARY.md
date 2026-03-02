---
phase: 02-templates
plan: 02
subsystem: ui
tags: [astro, content-collections, astro-assets, css-grid, getCollection]

# Dependency graph
requires:
  - phase: 02-01
    provides: Work collection schema, glob loader config, astro:assets Image helper, placeholder case study stub (booking-checkout)
provides:
  - Work index page at / driven by getCollection with draft filtering and order sorting
  - Two-column image card layout (2fr/1fr) per case study entry
  - Index headline paragraph above the card list
  - Zero-code card registration: new .md file in src/content/work/ automatically appears
affects: [02-03, 03-content]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "getCollection with inline filter: getCollection('work', ({ data }) => !data.draft)"
    - "entry.id (not entry.slug) for Astro 5 URL generation"
    - "astro:assets Image component with optional secondary image guard"
    - "CSS grid 2fr/1fr for main/secondary image split; single column below 640px"
    - "filter: brightness(0.75) tint on secondary decorative image"

key-files:
  created: []
  modified:
    - src/pages/index.astro

key-decisions:
  - "entry.id used (not entry.slug) — slug does not exist on Astro 5 collection entries"
  - "cardImageSecondary guarded with conditional render — field is optional in schema"
  - "alt='' on secondary image — decorative tinted panel, no semantic content"
  - "getCollection filter always applied — omitting filter would expose draft entries in production"

patterns-established:
  - "Draft filter pattern: getCollection('work', ({ data }) => !data.draft) — copy exactly for all work collection queries"
  - "Card link pattern: href={`/work/${entry.id}`} — entry.id is the canonical slug source"

requirements-completed: [WORK-01, WORK-02, CASE-03]

# Metrics
duration: ~5min
completed: 2026-02-28
---

# Phase 2 Plan 02: Work Index Summary

**Work index at / rewritten with getCollection cards, draft filtering, order sorting, and a 2fr/1fr two-column image grid per card**

## Performance

- **Duration:** ~5 min
- **Started:** 2026-02-28
- **Completed:** 2026-02-28
- **Tasks:** 1
- **Files modified:** 1

## Accomplishments
- Replaced placeholder "Work coming soon." page with a fully functional work index driven by Content Collections
- Index headline "I've spent the last decade..." renders above the card list at all viewports
- Each card shows the title as a bold link to `/work/${entry.id}`, uppercase company label, and a two-column image panel (main 2fr, secondary 1fr tinted)
- Draft filtering and order sorting applied — new .md files appear automatically with zero code changes

## Task Commits

Each task was committed atomically:

1. **Task 1: Rewrite index.astro with real work index** - `c1737a2` (feat)
   - Also included: `31dc918` (fix) — placeholder JPEGs regenerated with sharp before build passed

**Plan metadata:** (committed in combined docs commit)

## Files Created/Modified
- `src/pages/index.astro` — Fully rewritten: getCollection, sortedWork, index-headline, work-list/work-card markup, two-column image grid, scoped CSS

## Decisions Made
- Used `entry.id` (not `entry.slug`) — slug does not exist on Astro 5 collection entries; using it would cause a TypeScript error
- Secondary image rendered with `alt=""` — it is a decorative tinted panel with no unique semantic content
- Draft filter applied inline in `getCollection` — omitting filter would expose drafts in production

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Regenerated corrupt placeholder JPEGs with sharp**
- **Found during:** Task 1 (build verification)
- **Issue:** Placeholder JPEG files created in 02-01 were corrupt/empty, causing astro:assets Image component to fail at build time
- **Fix:** Regenerated valid JPEG placeholders using sharp before running the build
- **Files modified:** src/assets/work/booking-checkout/ (placeholder images)
- **Verification:** Build exited 0, dist/index.html generated with card content
- **Committed in:** `31dc918` (separate fix commit before task commit)

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** Fix was necessary to unblock the build — corrupt images prevented any output. No scope creep.

## Issues Encountered
- Corrupt placeholder JPEGs from 02-01 blocked the build — regenerated with sharp, then build succeeded

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Work index complete and building correctly; 4 pages in dist after 02-03 adds the case study detail route
- 02-03 (dynamic case study page) can proceed immediately — entry.id slugs and collection schema are stable
- Phase 3 content work can add new .md files without any code changes

---
*Phase: 02-templates*
*Completed: 2026-02-28*
