---
phase: 02-templates
plan: 04
subsystem: ui
tags: [astro, markdown, layout, 404, cv, dark-theme]

# Dependency graph
requires:
  - phase: 01-foundation
    provides: BaseLayout.astro, global.css with .prose styles, dark theme tokens
  - phase: 02-templates/02-01
    provides: .prose class in global.css (shared by CvLayout)
provides:
  - CvLayout.astro — markdown-based CV layout wrapping BaseLayout via Astro.props.frontmatter
  - src/pages/cv.md — editable CV content as pure markdown (no code changes needed)
  - src/pages/404.astro — custom 404 page matching dark theme, served by GitHub Pages for unmatched routes
affects: [03-content, phase-3-content-population]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Markdown page layout pattern: layout frontmatter property linking .md to .astro layout"
    - "Astro.props.frontmatter for markdown pages — frontmatter passed nested, not as top-level props"
    - "GitHub Pages 404 handling via dist/404.html — Astro builds 404.astro to 404.html automatically"

key-files:
  created:
    - src/layouts/CvLayout.astro
    - src/pages/cv.md
    - src/pages/404.astro
  modified: []
  deleted:
    - src/pages/cv.astro (Phase 1 placeholder — route conflict with cv.md)

key-decisions:
  - "Astro.props.frontmatter (not Astro.props) — markdown pages pass frontmatter nested under .frontmatter; using top-level props would make title undefined"
  - "cv.astro placeholder deleted on cv.md creation — having both causes Astro 'Route /cv already defined' error"
  - "GitHub Pages 404: no server config needed — 404.html in dist/ is auto-served by GitHub Pages for unmatched URLs"

patterns-established:
  - "Markdown layout pattern: src/pages/[name].md with layout frontmatter pointing to src/layouts/[Name]Layout.astro"
  - "Layout receives frontmatter via const { frontmatter } = Astro.props then passes to BaseLayout"

requirements-completed: [PAGE-01, PAGE-02]

# Metrics
duration: ~10min (including human-verify checkpoint)
completed: 2026-02-28
---

# Phase 2 Plan 04: CV Page and Custom 404 Summary

**Markdown-driven CV page via CvLayout.astro + Astro.props.frontmatter pattern, and dark-themed 404 page auto-served by GitHub Pages via dist/404.html**

## Performance

- **Duration:** ~10 min (including human-verify checkpoint wait)
- **Started:** ~2026-02-28T09:20:00Z
- **Completed:** 2026-02-28T09:36:26Z
- **Tasks:** 3 (2 auto + 1 checkpoint resolved via user approval)
- **Files modified:** 3 created, 1 deleted

## Accomplishments
- CV page at /cv renders markdown content through CvLayout.astro wrapping BaseLayout — dark theme, .prose styling, no raw markdown visible
- CV content fully editable via src/pages/cv.md with zero code changes required (layout frontmatter pattern)
- Custom 404 page matching dark theme with large "404" number, "Page not found" heading, and "Back to work" link
- Both pages visually verified by user: correct dark background, readable typography, mobile-clean layout

## Task Commits

Each task was committed atomically:

1. **Task 1: Create CvLayout.astro and cv.md, delete cv.astro placeholder** - `c9f58af` (feat)
2. **Task 2: Create custom 404 page** - `55b876c` (feat)
3. **Task 3: Human visual verification checkpoint** - approved by user (no code commit — checkpoint resolved)

**Plan metadata:** (this commit — docs: complete plan)

## Files Created/Modified
- `src/layouts/CvLayout.astro` - Markdown page layout wrapping BaseLayout; receives frontmatter via Astro.props.frontmatter
- `src/pages/cv.md` - CV content as markdown with layout, title, description frontmatter; Experience, Skills, Education sections
- `src/pages/404.astro` - Custom 404 page using BaseLayout; large "404" code, "Page not found" h1, "Back to work" link
- `src/pages/cv.astro` - DELETED (Phase 1 placeholder removed to avoid "Route /cv already defined" Astro error)

## Decisions Made
- Used `const { frontmatter } = Astro.props` in CvLayout — markdown pages in Astro pass frontmatter data nested under `.frontmatter`, not as top-level props. Using `Astro.props.title` directly would render as "undefined — Prashant Khanchandani" in the page title.
- Deleted `cv.astro` immediately when creating `cv.md` — Astro errors with "Route /cv already defined" if both exist at the same path.
- No server config for 404: GitHub Pages automatically serves `dist/404.html` (built from `404.astro`) for any unmatched URL.

## Deviations from Plan

None — plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None — no external service configuration required.

## Verification Outcome

User visually approved both pages after local preview (`npm run build && npx astro preview`):

- `/cv` — dark background confirmed, "Prashant Khanchandani" heading and Experience section visible, nav correct, text readable and styled (not raw markdown)
- `/404` — large "404" number, "Page not found" heading, "Back to work" link present, dark background matching site
- Both pages mobile-readable with no horizontal overflow

## Next Phase Readiness

- CV page ready for Phase 3 real content population — just edit src/pages/cv.md
- 404 page complete, no further work needed
- Both PAGE-01 and PAGE-02 requirements fulfilled
- Ready to proceed to Plan 02-02 (work index) or Plan 02-03 (case study template)

## Self-Check: PASSED

- FOUND: src/layouts/CvLayout.astro
- FOUND: src/pages/cv.md
- FOUND: src/pages/404.astro
- FOUND: .planning/phases/02-templates/02-04-SUMMARY.md
- FOUND commit: c9f58af (Task 1 — CvLayout + cv.md)
- FOUND commit: 55b876c (Task 2 — 404.astro)

---
*Phase: 02-templates*
*Completed: 2026-02-28*
