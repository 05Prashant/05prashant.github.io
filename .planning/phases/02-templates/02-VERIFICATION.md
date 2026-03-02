---
phase: 02-templates
verified: 2026-03-02T00:00:00Z
status: human_needed
score: 5/5 must-haves verified
re_verification: false
human_verification:
  - test: "Visit /work on the work index and confirm company label position matches design reference"
    expected: "WORK-01 requires 'company label on right' — the implementation places it below the title in the left text column (flex column), not literally to the right of the title. Visually confirm this matches the intended design reference for card layout."
    why_human: "The plan spec and the requirement wording differ on where 'company label' appears. The plan explicitly uses flex-column stacking (title then company below it) while WORK-01 says 'company label on right'. The implementation matches the plan but the requirement phrasing may describe a different layout. A human must confirm the visual result is acceptable."
  - test: "Visit /cv in browser and confirm Education section placeholder text is acceptable for current phase"
    expected: "src/pages/cv.md contains '[Your institution]' and '[Year]' in the Education section. These are intentional stubs for Phase 3 content but are visible in the built /cv page."
    why_human: "Whether this placeholder text is acceptable or should be removed/replaced before the phase closes requires human judgment on content readiness."
  - test: "Visit /work/booking-checkout in browser and confirm 'Placeholder content — full case study content arrives in Phase 3' is acceptable"
    expected: "The booking-checkout.md body contains explicit placeholder prose. Phase 2's goal is templates and schema validation, not real content — but a human should confirm this is acceptable for current site state."
    why_human: "Intentional Phase 3 stub — acceptable per phase scope but visible at the live URL. Human confirms this is not blocking for phase completion."
---

# Phase 2: Templates Verification Report

**Phase Goal:** Every page type is built and working — case study detail, work index, CV, and 404 — using schema-validated markdown so adding content requires zero code changes
**Verified:** 2026-03-02
**Status:** human_needed
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths (from ROADMAP Success Criteria)

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | A new `.md` file in `src/content/work/` with correct frontmatter automatically appears on the work index and gets its own `/work/[slug]` page — no code changes required | VERIFIED | `src/content.config.ts` uses `glob({ pattern: '**/*.md', base: './src/content/work' })`; `index.astro` calls `getCollection('work', ...)` dynamically; `[id].astro` generates paths via `getStaticPaths` + `getCollection`. Both filter drafts. Adding a new `.md` is sufficient. |
| 2 | The work index shows case study cards with a bold headline above the list, company label, and two-column image layout matching the design reference | VERIFIED (with human check) | `index.astro` renders `.index-headline` ("I've spent the last decade..."), `.work-card-company` per entry, and `.work-card-images` with `grid-template-columns: 2fr 1fr`. `dist/index.html` contains the headline and booking-checkout link. Company label position vs design reference needs human confirmation (see Human Verification). |
| 3 | A case study page shows the hero image, centered title / company / year, About section, and freeform markdown content below | VERIFIED | `[id].astro` renders `.case-hero` (hero image), `.case-header` (centered h1 + company — year meta), `.case-body.prose` containing `<Content />`. `dist/work/booking-checkout/index.html` contains "Booking.com", "Overhauling", and prose content. |
| 4 | The CV page at `/cv` renders from a markdown file and is editable without touching code | VERIFIED | `src/pages/cv.md` uses `layout: ../layouts/CvLayout.astro` frontmatter. Editing `cv.md` updates CV content with zero code changes. `dist/cv/index.html` contains "Prashant Khanchandani" and "Experience". |
| 5 | Navigating to a non-existent URL shows a custom 404 page matching the site's dark design | VERIFIED | `src/pages/404.astro` uses `BaseLayout` with dark theme tokens. `dist/404.html` contains "Page not found" and back-link to `/`. GitHub Pages auto-serves `dist/404.html` for unmatched routes. |

**Score:** 5/5 truths verified (1 flagged for human layout confirmation)

---

### Required Artifacts

#### Plan 02-01 Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `src/content.config.ts` | Zod schema for work collection with image() helper | VERIFIED | defineCollection, glob loader, `schema: ({ image }) => z.object({...})`, all 9 fields (title, company, year, description, heroImage, cardImage, cardImageSecondary, order, draft), `export const collections = { work }` |
| `src/content/work/booking-checkout.md` | One valid case study stub with correct frontmatter | VERIFIED | All required fields present: title, company, year (2022), description, heroImage, cardImage, cardImageSecondary, order (1), draft (false). Body has stub prose (intentional — Phase 3 fills real content). |
| `src/assets/work/booking-checkout/hero.jpg` | Placeholder image satisfying heroImage schema field | VERIFIED | File exists, 5,894 bytes (real JPEG — regenerated with sharp in fix commit 31dc918) |
| `src/assets/work/booking-checkout/card-main.jpg` | Placeholder image satisfying cardImage schema | VERIFIED | File exists, 3,119 bytes |
| `src/assets/work/booking-checkout/card-secondary.jpg` | Placeholder image satisfying cardImageSecondary schema | VERIFIED | File exists, 981 bytes |
| `src/styles/global.css` | .prose styles for markdown body content | VERIFIED | `.prose h2`, `.prose h3`, `.prose p`, `.prose ul`, `.prose ol`, `.prose li`, `.prose img`, `.prose a`, `.prose a:hover`, `.prose blockquote`, `.prose code` — all present starting at line 99 |

#### Plan 02-02 Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `src/pages/index.astro` | Work index page with real case study cards from getCollection | VERIFIED | Contains getCollection, sortedWork, `.work-list`, `.work-card`, `.index-headline`, `.work-card-company`, `<Image>` with cardImage and optional cardImageSecondary, href `/work/${entry.id}` |

#### Plan 02-03 Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `src/pages/work/[id].astro` | Dynamic case study detail page | VERIFIED | getStaticPaths, getCollection with draft filter, render(entry), Content component, `.case-hero`, `.case-header`, `.case-body.prose` |

#### Plan 02-04 Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `src/layouts/CvLayout.astro` | Layout for cv.md wrapping BaseLayout with .prose container | VERIFIED | `const { frontmatter } = Astro.props` (correct Astro markdown pattern), BaseLayout import, `<div class="container cv-content prose"><slot /></div>` |
| `src/pages/cv.md` | CV content as markdown with layout frontmatter property | VERIFIED | `layout: ../layouts/CvLayout.astro`, title, description, Experience/Skills/Education sections |
| `src/pages/404.astro` | Custom 404 page builds to dist/404.html | VERIFIED | BaseLayout import, "Page not found" h1, `<a href="/">` back-link |
| `src/pages/cv.astro` | DELETED — must not exist | VERIFIED | File absent; no route conflict with cv.md |

---

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `src/content/work/booking-checkout.md` frontmatter | `src/assets/work/booking-checkout/` | relative path `../../assets/work/booking-checkout/` | VERIFIED | heroImage, cardImage, cardImageSecondary all use this pattern; images exist on disk and built successfully |
| `src/content.config.ts` | `src/content/work/*.md` | `glob({ pattern: '**/*.md', base: './src/content/work' })` | VERIFIED | Pattern confirmed in file at line 9 |
| `src/pages/index.astro` | `src/content/work/*.md` | `getCollection('work', ({ data }) => !data.draft)` | VERIFIED | Draft filter applied; sortedWork mapped to cards; `href={'/work/${entry.id}'}` wires to detail pages |
| `src/pages/work/[id].astro` | `src/content/work/*.md` | `getStaticPaths` using `getCollection('work')` | VERIFIED | `params: { id: entry.id }` matches `[id].astro` bracket param |
| `src/pages/work/[id].astro` | entry markdown body | `render(entry)` → `<Content />` | VERIFIED | `const { Content } = await render(entry)` at line 15; `<Content />` rendered inside `.case-body.prose` |
| `src/pages/cv.md` frontmatter | `src/layouts/CvLayout.astro` | `layout: ../layouts/CvLayout.astro` | VERIFIED | Path resolves correctly from `src/pages/cv.md` to `src/layouts/CvLayout.astro` |
| `src/layouts/CvLayout.astro` | `src/layouts/BaseLayout.astro` | `import BaseLayout` + `Astro.props.frontmatter` | VERIFIED | `const { frontmatter } = Astro.props` correctly receives markdown page frontmatter; passes `frontmatter.title` and `frontmatter.description` to BaseLayout |

---

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|-------------|-------------|--------|----------|
| CASE-01 | 02-01 | Content Collections schema defined — frontmatter fields: title, company, year, description, heroImage, cardImage, cardImageSecondary (optional), order | SATISFIED | `src/content.config.ts` — all fields present with correct Zod types and image() helper |
| CASE-02 | 02-03 | Individual case study pages `/work/[slug]` generated from markdown files — shows hero image, centered title / company / year, About section, then freeform markdown | SATISFIED | `src/pages/work/[id].astro` generates `/work/booking-checkout`; `dist/work/booking-checkout/index.html` contains hero, centered header, and prose body |
| CASE-03 | 02-01, 02-02, 02-03 | Adding a new case study requires only creating a new `.md` file — no code changes needed | SATISFIED | glob loader, getCollection with dynamic filter, getStaticPaths — all three use filename-based discovery |
| WORK-01 | 02-02 | Work index page lists all case studies — each card shows title with arrow link, company label, two-column image layout matching design screenshots | SATISFIED (visual check needed) | `index.astro` — title link with arrow, `.work-card-company`, 2fr/1fr image grid. Company label placement vs "on right" design reference needs human confirmation. |
| WORK-02 | 02-02 | Bold headline above the case study list | SATISFIED | `.index-headline` with "I've spent the last decade..." — present in `index.astro` and in `dist/index.html` |
| PAGE-01 | 02-04 | CV page at `/cv` built from a markdown file — career history, skills, editable without touching code | SATISFIED | `src/pages/cv.md` with layout frontmatter; user visually approved per 02-04-SUMMARY.md checkpoint |
| PAGE-02 | 02-04 | Custom 404 page matching the site's dark design | SATISFIED | `src/pages/404.astro` using BaseLayout and dark theme tokens; `dist/404.html` exists; user visually approved per checkpoint |

**Requirement ID cross-check:** All 7 requirement IDs from the phase (CASE-01, CASE-02, CASE-03, WORK-01, WORK-02, PAGE-01, PAGE-02) are claimed by at least one plan and have implementation evidence.

**Orphaned requirements check:** REQUIREMENTS.md traceability table maps WORK-01, WORK-02, CASE-01, CASE-02, CASE-03, PAGE-01, PAGE-02 to Phase 2. All are covered by plans. No orphaned requirements found.

**Administrative note:** REQUIREMENTS.md checkboxes still show `[ ]` for WORK-01 and CASE-02 and the traceability table shows "Pending" for WORK-01, WORK-02, CASE-02. These statuses are stale — the actual code is implemented and dist output confirms the pages build. The REQUIREMENTS.md document was not updated after 02-02 and 02-03 completed. This is a documentation gap only; it does not reflect a code gap.

---

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| `src/content/work/booking-checkout.md` | 19 | "Placeholder content — full case study content arrives in Phase 3." | Info | Intentional — Phase 3 fills real content. Visible at `/work/booking-checkout` but does not block Phase 2 goal (templates, not content). |
| `src/pages/cv.md` | 38–39 | `[Your institution]` and `[Year]` in Education section | Info | Intentional placeholder for real content. Visible at `/cv`. Does not block Phase 2 goal. |

No blocker or warning anti-patterns found. Both flagged items are intentional Phase 3 content placeholders — Phase 2's goal is working templates, not populated content.

---

### Commit Verification

All commits documented in summaries confirmed present in git history:

| Commit | Plan | Description |
|--------|------|-------------|
| `a287e0e` | 02-01 | Define work collection schema with glob loader |
| `6d5eae3` | 02-01 | Add case study stub and placeholder images for booking-checkout |
| `ef7051b` | 02-01 | Add .prose styles to global.css |
| `31dc918` | 02-01 (fix) | Replace corrupt placeholder JPEGs with valid sharp-generated images |
| `c1737a2` | 02-02 | Work index with getCollection cards and two-column image layout |
| `63e3906` | 02-03 | Dynamic case study page /work/[id] with render() and hero layout |
| `c9f58af` | 02-04 | Create CvLayout.astro and cv.md, delete cv.astro placeholder |
| `55b876c` | 02-04 | Create custom 404 page |

---

### Human Verification Required

#### 1. Work Index Company Label Position

**Test:** Open `/` (work index) in a browser. Look at the case study card layout.
**Expected:** The company label ("BOOKING.COM") appears somewhere clearly distinguishable from the title link. WORK-01 says "company label on right" but the plan implementation stacks it below the title in the left text column using flex-direction: column.
**Why human:** The plan spec explicitly uses `.work-card-text { flex-direction: column }` placing company below the title — but WORK-01's wording says "company label on right." A human must confirm whether the visual result matches design intent, or whether the company label needs repositioning.

#### 2. CV Education Placeholder Text Visibility

**Test:** Open `/cv` in a browser. Scroll to the Education section.
**Expected:** "[Your institution]" and "[Year]" are placeholder brackets — decide whether these should be removed or replaced with something less obviously placeholder (e.g., "Details to be added") before considering this phase done.
**Why human:** Whether stub text in a live page is acceptable for phase completion is a content/editorial judgment, not a code issue.

#### 3. Case Study Body Placeholder Text

**Test:** Open `/work/booking-checkout` in a browser. Read "The Challenge" section.
**Expected:** "Placeholder content — full case study content arrives in Phase 3." is visible. This is intentional per plan but is visible to anyone visiting the URL.
**Why human:** Confirm this is acceptable for the current state of the site while Phase 3 is pending.

---

### Summary

Phase 2's technical goal is fully achieved. Every page type exists and works:

- **Work index (`/`):** `getCollection`-driven cards with draft filtering, headline, two-column image grid, and zero-code content registration via glob loader — VERIFIED
- **Case study detail (`/work/[id]`):** `getStaticPaths` + `render()` generating one page per markdown file, hero image, centered header, prose body — VERIFIED
- **CV (`/cv`):** Markdown-driven via `CvLayout.astro` with correct `Astro.props.frontmatter` pattern — VERIFIED
- **404:** Custom page using BaseLayout and dark theme, builds to `dist/404.html` — VERIFIED
- **Schema:** Zod schema with image() helper and glob loader locks the frontmatter contract — VERIFIED

All 8 commits confirmed in git. All 7 requirement IDs covered by plans and implemented in code. No blocker or warning anti-patterns in delivered code. Three items require human confirmation related to visual layout and intentional placeholder content.

One administrative follow-up: update REQUIREMENTS.md to mark WORK-01 and CASE-02 as complete (`[x]`) and update the traceability table statuses from "Pending" to "Complete" for WORK-01, WORK-02, and CASE-02.

---

_Verified: 2026-03-02_
_Verifier: Claude (gsd-verifier)_
