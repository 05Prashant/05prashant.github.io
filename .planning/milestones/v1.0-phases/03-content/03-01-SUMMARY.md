---
phase: 03-content
plan: 01
subsystem: ui
tags: [astro, content-collections, images, sharp]

# Dependency graph
requires:
  - phase: 02-templates
    provides: Work index and case study detail templates that consume content collection entries
provides:
  - Six placeholder JPEG images (hero 1600x900 + card-main 800x600) for Docker stub directories
  - Three stub markdown files in src/content/work/ for Docker case studies (orders 5, 6, 7)
affects: [03-02, 03-03, any phase rendering the work index]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Placeholder images generated via sharp with site background color #1e2030"
    - "Stub markdown with draft: false and 'Case study coming soon.' body text"

key-files:
  created:
    - src/assets/work/docker-onboarding/hero.jpg
    - src/assets/work/docker-onboarding/card-main.jpg
    - src/assets/work/docker-notifications/hero.jpg
    - src/assets/work/docker-notifications/card-main.jpg
    - src/assets/work/docker-cli/hero.jpg
    - src/assets/work/docker-cli/card-main.jpg
    - src/content/work/docker-onboarding.md
    - src/content/work/docker-notifications.md
    - src/content/work/docker-cli.md
  modified: []

key-decisions:
  - "Stub body text is '## About\n\nCase study coming soon.' — matches plan spec exactly"
  - "No cardImageSecondary in stub frontmatter — those asset files do not exist and would cause build failure"

patterns-established:
  - "Docker stubs: order integers 5, 6, 7 for docker-onboarding, docker-notifications, docker-cli"

requirements-completed: [CONT-02]

# Metrics
duration: 2min
completed: 2026-03-02
---

# Phase 3 Plan 01: Docker Stub Content Summary

**Six placeholder JPEGs (sharp-generated, #1e2030) and three stub markdown files populate the work index with Docker case studies at orders 5, 6, 7**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-02T22:20:50Z
- **Completed:** 2026-03-02T22:22:00Z
- **Tasks:** 2
- **Files modified:** 9

## Accomplishments
- Generated 6 placeholder JPEG files (hero + card-main) for docker-onboarding, docker-notifications, docker-cli directories using sharp
- Created 3 stub markdown files with correct Astro 5 Content Collections frontmatter (draft: false, order 5/6/7)
- All three Docker case studies will appear on the work index as clickable cards

## Task Commits

Each task was committed atomically:

1. **Task 1: Generate placeholder JPEG images** - `ae85b5f` (chore)
2. **Task 2: Create Docker stub markdown files** - `0482271` (feat)

**Plan metadata:** (docs commit follows)

## Files Created/Modified
- `src/assets/work/docker-onboarding/hero.jpg` - Placeholder hero (1600x900, #1e2030)
- `src/assets/work/docker-onboarding/card-main.jpg` - Placeholder card (800x600, #1e2030)
- `src/assets/work/docker-notifications/hero.jpg` - Placeholder hero (1600x900, #1e2030)
- `src/assets/work/docker-notifications/card-main.jpg` - Placeholder card (800x600, #1e2030)
- `src/assets/work/docker-cli/hero.jpg` - Placeholder hero (1600x900, #1e2030)
- `src/assets/work/docker-cli/card-main.jpg` - Placeholder card (800x600, #1e2030)
- `src/content/work/docker-onboarding.md` - Docker onboarding stub (order 5, draft false)
- `src/content/work/docker-notifications.md` - Docker notifications stub (order 6, draft false)
- `src/content/work/docker-cli.md` - Docker CLI stub (order 7, draft false)

## Decisions Made
- No `cardImageSecondary` in stub frontmatter — the optional field is omitted to avoid build failures since no secondary asset files exist
- Stub body follows the same "## About / Case study coming soon." pattern for consistency

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
- Build check shows `kitchen-notebook/card-main.jpg` not found — this is a pre-existing issue outside this plan's scope (kitchen-notebook.md already existed with no asset directory). Noted per plan verification notes: "Build may still fail if other case study image directories do not exist yet." No Docker-related errors present.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Docker stubs ready for work index display
- Real content can be added by replacing stub body text and swapping placeholder images
- kitchen-notebook assets are still missing and will block a clean build until addressed in a subsequent plan

---
*Phase: 03-content*
*Completed: 2026-03-02*
