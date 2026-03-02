# Requirements: Prashant Khanchandani Portfolio

**Defined:** 2026-02-26
**Core Value:** A designer who deeply understands developer tools and AI products — the work speaks for itself through well-crafted case studies

## v1 Requirements

### Foundation

- [x] **FOUND-01**: Astro 5 project scaffolded and successfully deployed to `prashantkhanchandani.github.io` via GitHub Actions on push to main
- [x] **FOUND-02**: Dark theme global CSS with CSS custom properties — dark background (~#1e2030), white text, minimal sans-serif typography scale
- [x] **FOUND-03**: Shared navigation component — "Prashant Khanchandani" on left, Work / CV on right, consistent across all pages
- [x] **FOUND-04**: Layout is mobile responsive — readable and functional on phone and tablet

### Work Index

- [ ] **WORK-01**: Work index page (`/`) lists all case studies — each card shows title with arrow link, company label on right, two-column image layout (main screenshot left, tinted secondary panel right) matching design screenshots
- [ ] **WORK-02**: Bold headline above the case study list (e.g. "I've spent the last decade crafting, building, and shipping digital experiences.")

### Case Studies

- [x] **CASE-01**: Content Collections schema defined for case studies — frontmatter fields: title, company, year, description, heroImage, cardImage, cardImageSecondary (optional), order
- [ ] **CASE-02**: Individual case study pages (`/work/[slug]`) generated from markdown files — shows hero image, centered title / company / year, About section, then freeform markdown content below
- [x] **CASE-03**: Adding a new case study requires only creating a new `.md` file — no code changes needed

### Static Pages

- [x] **PAGE-01**: CV page (`/cv`) built from a markdown file — career history, skills, editable without touching code
- [x] **PAGE-02**: Custom 404 page matching the site's dark design

### Content Migration

- [ ] **CONT-01**: Port case studies from current Squarespace site into markdown files:
  - Overhauling a checkout experience — Booking.com
  - Redesigning the Kitchen Notebook — Self
  - Chatbot and conversational interface research — Booking.com
  - Cleartrip Local events discovery — Cleartrip
- [x] **CONT-02**: Create placeholder markdown stubs for Docker case studies (title, company, year, images) so the work index is populated — Prashant fills in content
  - Introducing developers to a new tool — Docker
  - A notification system for Docker Desktop — Docker
  - Command line tool to get started — Docker

## v2 Requirements

### About / Info

- **INFO-01**: Info/About page (`/info`) — bio, background, what I do, markdown-driven (deferred until content is ready)

### SEO & Discoverability

- **SEO-01**: Sitemap.xml generated at build time
- **SEO-02**: Open Graph tags per page (og:title, og:description, og:image)
- **SEO-03**: Custom domain configuration (`prashant-khanchandani.info` CNAME)

### Enhancements

- **ENH-01**: TL;DR summary block at top of each case study (3-bullet quick scan)
- **ENH-02**: Password-protected case studies for NDA work (client-side hash gate)

## Out of Scope

| Feature | Reason |
|---------|--------|
| Photography section | Existed on old site; not carried over — keep focus on design work |
| Blog / essay section | Not requested; case studies are the primary content format |
| Contact form | Static site, no backend; LinkedIn serves this purpose |
| CMS / admin UI | Direct markdown editing is the intended workflow |
| Dark mode toggle | Single fixed dark theme by design — no toggle needed |
| Analytics | Not requested; can be added trivially later if needed |
| Comments | Not needed for a portfolio |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| FOUND-01 | Phase 1 | Complete |
| FOUND-02 | Phase 1 | Complete |
| FOUND-03 | Phase 1 | Complete |
| FOUND-04 | Phase 1 | Complete |
| WORK-01 | Phase 2 | Pending |
| WORK-02 | Phase 2 | Pending |
| CASE-01 | Phase 2 | Complete |
| CASE-02 | Phase 2 | Pending |
| CASE-03 | Phase 2 | Complete |
| PAGE-01 | Phase 2 | Complete |
| PAGE-02 | Phase 2 | Complete |
| CONT-01 | Phase 3 | Pending |
| CONT-02 | Phase 3 | Complete |

**Coverage:**
- v1 requirements: 13 total
- Mapped to phases: 13
- Unmapped: 0

---
*Requirements defined: 2026-02-26*
*Last updated: 2026-02-28 — PAGE-01 and PAGE-02 complete: CvLayout.astro + cv.md + 404.astro built and visually verified*
