---
phase: 01-foundation
plan: "02"
subsystem: ui
tags: [astro, css, dark-theme, navigation, layout, components]

# Dependency graph
requires:
  - phase: 01-foundation plan 01
    provides: Astro 5 scaffold, GitHub Pages CI/CD, src/pages/index.astro placeholder

provides:
  - Global CSS dark theme with CSS custom properties (#1e2030 background)
  - FOUC-free dark background via html+body selector
  - BaseLayout.astro HTML shell (title, description props, Nav, slot)
  - Nav.astro sticky nav bar (brand left, Work/CV links right, mobile-responsive)
  - src/pages/index.astro work index placeholder using BaseLayout
  - src/pages/cv.astro CV page placeholder using BaseLayout
  - src/content.config.ts Astro 5 content collections stub

affects: [02-content, 03-polish, all future pages using BaseLayout]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Global CSS with custom properties for design tokens (no CSS-in-JS, no preprocessors)
    - BaseLayout as the single HTML shell imported by all pages
    - Scoped styles in .astro components via <style> block
    - FOUC prevention via html+body background-color (not just body)

key-files:
  created:
    - src/styles/global.css
    - src/layouts/BaseLayout.astro
    - src/components/Nav.astro
    - src/pages/cv.astro
    - src/content.config.ts
  modified:
    - src/pages/index.astro

key-decisions:
  - "Nav Work link points to href='/' (root) not href='/work' — work index lives at root index.astro per project requirements"
  - "content.config.ts at src/content.config.ts not src/content/config.ts — Astro 5 requires root-level placement inside src/"
  - "global.css imported in BaseLayout frontmatter (import statement), not via <style is:global> — simpler Astro 5 pattern"
  - "background-color on html,body selector (not just body) — prevents white flash on iOS overscroll and initial page load"
  - "meta name=theme-color set to #1e2030 — controls iOS status bar and Chrome overscroll chrome color"

patterns-established:
  - "BaseLayout pattern: all pages import and wrap content in <BaseLayout title='...'>"
  - "Design tokens via CSS custom properties in :root — single source of truth"
  - "Fluid typography via clamp() — no media query breakpoints for font sizes"
  - "Nav mobile responsiveness via flex-wrap — no JavaScript, no hamburger menu needed at this scale"

requirements-completed: [FOUND-02, FOUND-03, FOUND-04]

# Metrics
duration: 5min
completed: 2026-02-27
---

# Phase 1 Plan 02: Dark Theme, BaseLayout, Nav Component Summary

**Dark-themed Astro site with CSS custom properties, FOUC-free html+body background, sticky Nav component, and two live pages (index, CV) sharing a consistent BaseLayout**

## Performance

- **Duration:** ~5 min
- **Started:** 2026-02-27T08:27:57Z
- **Completed:** 2026-02-27T08:32:00Z
- **Tasks:** 2
- **Files modified:** 6

## Accomplishments
- Global CSS with all design tokens (`--color-bg: #1e2030`, typography scale, `.container` utility)
- FOUC prevention via `background-color` on `html, body` (not just `body`) — no JavaScript required
- `BaseLayout.astro` as single HTML shell: imports global.css, renders Nav, provides `<slot />`
- `Nav.astro` sticky navigation: brand name left, Work/CV links right, mobile flex-wrap on 480px
- Both `index.astro` and `cv.astro` use BaseLayout — consistent layout across all pages
- `src/content.config.ts` stub at correct Astro 5 path (not Astro 4's `src/content/config.ts`)
- `npm run build` exits 0 with no errors or warnings

## Task Commits

Each task was committed atomically:

1. **Task 1: Create global CSS dark theme and design tokens** - `c949fbb` (feat)
2. **Task 2: Build BaseLayout, Nav component, and placeholder pages** - `864f008` (feat)

**Plan metadata:** (docs commit follows)

## Files Created/Modified
- `src/styles/global.css` - CSS custom properties, FOUC prevention, reset, typography scale, .container
- `src/layouts/BaseLayout.astro` - HTML shell with title/description Props, Nav import, slot
- `src/components/Nav.astro` - Sticky nav, flex layout, scoped styles, mobile flex-wrap
- `src/pages/index.astro` - Work index placeholder wrapping BaseLayout (replaced raw placeholder)
- `src/pages/cv.astro` - CV page placeholder wrapping BaseLayout (new file)
- `src/content.config.ts` - Astro 5 content collections stub with empty `collections` export

## Decisions Made

1. **Nav Work link to `/` not `/work`** — the work index lives at root `index.astro`. A `/work` route can be added in Phase 2 if needed.

2. **`content.config.ts` at `src/content.config.ts`** — Astro 5 changed the location from `src/content/config.ts`. Placing it at the wrong path would cause Astro to silently ignore it.

3. **`global.css` via frontmatter import** — `import '../styles/global.css'` in BaseLayout.astro frontmatter is cleaner than `<style is:global>` and is the idiomatic Astro 5 pattern.

4. **FOUC prevention on `html, body`** — Setting `background-color` only on `body` causes a white flash during initial render and on iOS pull-to-refresh because browsers render the `html` background first. Setting it on both elements is a pure CSS solution with no JavaScript required.

5. **`meta name="theme-color"` set to `#1e2030`** — Controls iOS Safari status bar color and Chrome browser chrome color during overscroll, preventing white gaps at edges.

## Deviations from Plan

None — plan executed exactly as written.

## Issues Encountered

- **GitHub push failed (expected)**: `git push origin main` failed because the GitHub repo `prashantkhanchandani.github.io` has not yet been created. This is the existing documented blocker in STATE.md — code and build are correct, deploy awaits one-time user setup.

## User Setup Required

The GitHub repository `prashantkhanchandani.github.io` must be created and GitHub Pages source set to "GitHub Actions" before the deploy pipeline can run. This was already the documented blocker from Plan 01 — no new setup steps added.

Once the repo exists, running `git push origin main` will trigger the deploy workflow and the live site will show the dark theme and nav.

## Next Phase Readiness

- Visual foundation complete — dark theme, nav, BaseLayout all in place
- Both pages build and render correctly
- Content collections stub ready for Phase 2 schema additions
- Awaiting: GitHub repo creation (user action) to make the live site visible
- Phase 2 can begin immediately with content schema and work case study pages

---
*Phase: 01-foundation*
*Completed: 2026-02-27*
