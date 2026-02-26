# Prashant Khanchandani Portfolio

## What This Is

A personal portfolio website for Prashant Khanchandani, Staff Product Designer at Docker. The site showcases design case studies — primarily developer tooling and AI products — through a dark, minimal aesthetic. Built with Astro, hosted on GitHub Pages, with all content authored as markdown files for easy direct editing.

## Core Value

A designer who deeply understands developer tools and AI products — the work speaks for itself through well-crafted case studies, without the site getting in the way.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Dark minimal site with clean typography matching the design screenshots provided
- [ ] Work index page listing case studies with two-column image layout and company label
- [ ] Individual case study pages built from markdown files (hero image, title, company, year, about section + freeform content)
- [ ] Info page (about Prashant)
- [ ] CV page built from markdown
- [ ] Navigation: name on left, Work / Info / CV on right
- [ ] Hosted on GitHub Pages via GitHub Actions
- [ ] Content authored as markdown files — editable directly without touching code
- [ ] Port existing case studies from current Squarespace site

### Out of Scope

- Blog / essay section — not requested, keep it focused on case studies
- Photography section — existed on old site, not carried over
- Comments or contact form — static site, no backend
- Search — not needed at this scale
- CMS UI — direct markdown editing is the intended workflow

## Context

Current site is on Squarespace (https://www.prashant-khanchandani.info/) with case studies from Booking.com, Cleartrip, and a Kitchen Notes side project. The new site needs to prominently feature Docker work (3 case studies) alongside the best of the existing work.

Case studies to include (from screenshots + existing site):
- Introducing developers to a new tool — Docker
- A notification system for Docker Desktop — Docker
- Command line tool to get started — Docker
- Overhauling a checkout experience — Booking.com
- Redesigning the Kitchen Notebook — Self
- Chatbot and conversational interface research — Booking.com
- Cleartrip Local events discovery — Cleartrip

Design reference: dark background (~#1e2030), white text, minimal sans-serif typography, case study cards with two-column image grid (main screenshot left, secondary/tinted panel right).

## Constraints

- **Hosting**: GitHub Pages — must be free, static output only
- **Updates**: All content changes must be doable by editing markdown files and pushing to GitHub — no build tooling knowledge required for content updates
- **Cost**: Zero ongoing cost (GitHub Pages is free)
- **Tech stack**: Astro — chosen for active ecosystem, portfolio starter themes, clean `.astro` template syntax

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Astro over Jekyll/11ty | Active ecosystem, portfolio starters, readable template syntax, GitHub Pages via Action | — Pending |
| Markdown for all content | Easy direct editing, no CMS dependency, version-controlled content | — Pending |
| Dark theme | Matches design screenshots provided, suits developer/tools audience | — Pending |
| GitHub Pages | Free hosting, integrated with repo, no separate deployment service needed | — Pending |

---
*Last updated: 2026-02-26 after initialization*
