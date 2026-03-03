# Prashant Khanchandani Portfolio

## What This Is

A personal portfolio website for Prashant Khanchandani, Staff Product Designer at Docker. The site showcases design case studies — developer tooling and AI products — through a dark, minimal aesthetic. Built with Astro 5, hosted on GitHub Pages, with all content authored as markdown files for direct editing. v1.0 is live at `prashantkhanchandani.github.io` with 7 case studies and a CV page.

## Core Value

A designer who deeply understands developer tools and AI products — the work speaks for itself through well-crafted case studies, without the site getting in the way.

## Requirements

### Validated

- ✓ Dark minimal site with clean typography — v1.0 (#1e2030 background, white text, minimal sans-serif)
- ✓ Individual case study pages built from markdown (hero image, title, company, year, about + freeform content) — v1.0
- ✓ CV page built from markdown — v1.0 (editable directly without touching code)
- ✓ Hosted on GitHub Pages via GitHub Actions — v1.0 (OIDC deploy, auto-deploys on push to main)
- ✓ Content authored as markdown files — v1.0 (drop `.md` in `src/content/work/`, appears everywhere)
- ✓ Port existing case studies from Squarespace — v1.0 (4 ported: 2 full, 2 stubs pending content)
- ✓ Docker case study stubs present — v1.0 (3 stubs with placeholder images, ready for content)

### Active

- [ ] Work index page: company label, arrow links, and two-column image layout (WORK-01) — layout built, secondary images missing for most entries
- [ ] Bold headline above case study list (WORK-02) — verify it renders correctly on live site
- [ ] booking-chatbot case study content — behind Medium paywall, Prashant to write
- [ ] cleartrip-local case study content — behind Medium paywall, Prashant to write
- [ ] Docker case study content (3 stubs) — Prashant to fill in
- [ ] Real portfolio images for kitchen-notebook, booking-chatbot, cleartrip-local (currently placeholders)
- [ ] Info/About page — was in original nav spec but not built in v1.0

### Out of Scope

- Blog / essay section — not requested, keep it focused on case studies
- Photography section — existed on old site, not carried over
- Comments or contact form — static site, no backend
- Search — not needed at this scale
- CMS UI — direct markdown editing is the intended workflow
- Mobile app / PWA — not applicable for a portfolio

## Context

**Current state (v1.0):**
- Live at `prashantkhanchandani.github.io`
- ~764 LOC across TypeScript + Astro + CSS source files
- 7 case studies in `src/content/work/` (4 Booking.com/Cleartrip/Kitchen, 3 Docker stubs)
- All content is markdown-editable; zero code changes needed to add or update case studies
- `booking-checkout.md` year may need correction (2022 stub vs ~2020 actual)

**Next milestone focus:**
- Real case study content (chatbot, cleartrip-local, Docker × 3)
- Real portfolio images to replace placeholder JPEGs
- Polish: About/Info page, nav refinements if needed

## Constraints

- **Hosting**: GitHub Pages — must be free, static output only
- **Updates**: All content changes must be doable by editing markdown files and pushing to GitHub — no build tooling knowledge required
- **Cost**: Zero ongoing cost
- **Tech stack**: Astro 5 — chosen for active ecosystem, clean `.astro` syntax, Content Collections

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Astro over Jekyll/11ty | Active ecosystem, glob loader, readable template syntax | ✓ Good — Content Collections + image() pipeline worked smoothly |
| Markdown for all content | Easy direct editing, no CMS, version-controlled | ✓ Good — drop a .md file, it appears on index + gets its own page |
| Deploy-first (Phase 1 before content) | Eliminate GitHub Pages config bugs before content investment | ✓ Good — caught OIDC permission issues early |
| Dark theme (#1e2030) | Matches design screenshots, suits developer/tools audience | ✓ Good — FOUC prevented via html+body selector |
| GitHub Pages | Free hosting, integrated with repo | ✓ Good — zero ongoing cost |
| sharp for placeholder images | Unblock build while real images are sourced | ✓ Good — used consistently across both phases |
| draft: false for Docker stubs | All 7 show on index immediately | ✓ Good — work index looks complete from day one |

---
*Last updated: 2026-03-03 after v1.0 milestone*
