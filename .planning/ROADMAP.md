# Roadmap: Prashant Khanchandani Portfolio

## Overview

Three phases from blank repo to published portfolio. Phase 1 validates the deploy pipeline before any content work begins — this eliminates the entire class of GitHub Pages misconfiguration bugs. Phase 2 locks all code and templates so no further code changes are needed during content work. Phase 3 ports all case study content into the stable template.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Foundation** - Astro project scaffolded, dark theme applied, nav in place, and live on GitHub Pages before any content work begins
- [x] **Phase 2: Templates** - Content Collections schema locked, all page templates built (case study, work index, CV, 404) — no code changes needed after this phase
- [ ] **Phase 3: Content** - All case studies ported from Squarespace and Docker stubs created — site is fully populated and publishable

## Phase Details

### Phase 1: Foundation
**Goal**: A deployed, navigable Astro site with correct dark theme and shared navigation — proving the full pipeline before content investment
**Depends on**: Nothing (first phase)
**Requirements**: FOUND-01, FOUND-02, FOUND-03, FOUND-04
**Success Criteria** (what must be TRUE):
  1. Pushing to main automatically deploys to `prashantkhanchandani.github.io` with no manual steps
  2. All pages show the dark background (~#1e2030) with white text and no flash of unstyled content
  3. Navigation shows "Prashant Khanchandani" on the left and Work / CV links on the right on every page
  4. The site is readable and functional on a phone without horizontal scrolling or broken layout
**Plans**: 3 plans

Plans:
- [x] 01-01-PLAN.md — Scaffold Astro 5 project and establish GitHub Pages deploy pipeline
- [x] 01-02-PLAN.md — Dark theme CSS, BaseLayout, Nav component, and placeholder pages
- [x] 01-03-PLAN.md — Human visual verification of live site against all Phase 1 success criteria

### Phase 2: Templates
**Goal**: Every page type is built and working — case study detail, work index, CV, and 404 — using schema-validated markdown so adding content requires zero code changes
**Depends on**: Phase 1
**Requirements**: CASE-01, CASE-02, CASE-03, WORK-01, WORK-02, PAGE-01, PAGE-02
**Success Criteria** (what must be TRUE):
  1. A new `.md` file in `src/content/work/` with correct frontmatter automatically appears on the work index and gets its own `/work/[slug]` page — no code changes required
  2. The work index shows case study cards with a bold headline above the list, company label, and two-column image layout matching the design reference
  3. A case study page shows the hero image, centered title / company / year, About section, and freeform markdown content below
  4. The CV page at `/cv` renders from a markdown file and is editable without touching code
  5. Navigating to a non-existent URL shows a custom 404 page matching the site's dark design
**Plans**: 4 plans

Plans:
- [x] 02-01-PLAN.md — Content Collections schema, image directories, case study stub, and prose CSS
- [x] 02-02-PLAN.md — Work index page with real case study cards from getCollection
- [x] 02-03-PLAN.md — Dynamic case study detail page at /work/[id]
- [x] 02-04-PLAN.md — CV layout and markdown page, custom 404 page, human verification

### Phase 3: Content
**Goal**: All seven case studies are in markdown files and the work index is fully populated — the site is ready to share with hiring managers
**Depends on**: Phase 2
**Requirements**: CONT-01, CONT-02
**Success Criteria** (what must be TRUE):
  1. The work index shows all seven case studies in the correct order with images and company labels
  2. Four ported case studies (Booking.com checkout, Kitchen Notebook, Booking.com chatbot, Cleartrip Local) have full content including hero image, about section, and process narrative
  3. Three Docker case study stubs (onboarding, notifications, CLI) are present with title, company, year, and placeholder images — ready for Prashant to fill in content
**Plans**: 3 plans

Plans:
- [ ] 03-01-PLAN.md — Docker stub placeholder images and three Docker markdown stubs (CONT-02)
- [ ] 03-02-PLAN.md — Port booking-checkout and kitchen-notebook with real content; create chatbot and cleartrip-local with placeholder sections (CONT-01)
- [ ] 03-03-PLAN.md — Image checkpoint (Prashant provides real images for ported case studies) and final build verification

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation | 3/3 | Complete | 2026-02-27 |
| 2. Templates | 4/4 | Complete | 2026-02-28 |
| 3. Content | 2/3 | In Progress|  |
