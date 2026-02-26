# Project Research Summary

**Project:** Prashant Khanchandani Portfolio
**Domain:** Static personal portfolio site — Staff Product Designer, developer tools / AI products
**Researched:** 2026-02-26
**Confidence:** MEDIUM-HIGH

## Executive Summary

This is a static portfolio site for a Staff Product Designer targeting tech companies in the developer tools and AI space. The research is clear: Astro 5 with static site generation (SSG), plain CSS custom properties, Astro Content Collections for markdown-driven case studies, and GitHub Pages for hosting is the correct stack. This combination gives zero-JS pages by default, build-time image optimization, type-safe frontmatter validation, and free reliable hosting — all with zero ongoing infrastructure cost or complexity. No UI framework (React/Vue), no CMS, no Tailwind — every one of these would add complexity with no payoff for a bespoke, fixed-design, one-person portfolio.

The recommended approach is to build in dependency order: deploy pipeline first, shared layout second, content schema third, then case study template, then the work index, then static pages (Info, CV), and finally content migration and polish. This order ensures the CI/CD pipeline is validated before any content work begins, which eliminates the most expensive class of late-stage bug: GitHub Pages sub-path misconfiguration breaking all assets and links silently. The critical pitfall cluster — missing `base` config, wrong Pages source setting, hardcoded `href` paths — must all be resolved in Phase 1, before a single case study is written.

The key risk is not technical; it is content quality. For a Staff-level portfolio targeting companies like Docker, the site structure and code are table stakes. What differentiates the portfolio is case study depth: process rationale, decision transparency, constraint acknowledgment, and impact framing with actual numbers. The site architecture should make it easy to write rich, structured case studies (TL;DR blocks, outcome statements, metadata tags), but the content itself is the work that matters.

---

## Key Findings

### Recommended Stack

Astro 5 is the unambiguous choice for this project. It produces static HTML by default, has zero client-side JS unless explicitly opted in, includes first-class Content Collections for markdown with Zod schema validation, and has an official GitHub Actions deploy action. The project should use the Astro 5 `loader`-based Content Collections API (not the legacy Astro 4 API — the two are incompatible). Plain CSS with CSS custom properties handles styling; the dark bespoke design does not benefit from Tailwind, and `@astrojs/tailwind` was deprecated as of Astro 5 anyway.

**Core technologies:**
- Astro 5.x: Site framework — zero-JS static output, Content Collections, built-in image optimization, GitHub Pages support
- Node.js 20 LTS: Runtime — required by Astro 5 (needs 18+); 20 LTS for GH Actions stability
- Plain CSS + CSS Custom Properties: Styling — bespoke dark design; Tailwind adds complexity with no benefit here
- Astro Content Collections (built-in): Content management — schema-validated markdown, typed frontmatter, build-time validation
- GitHub Pages + `withastro/action` v3: Hosting and CI/CD — free, repo-integrated, official Astro deploy pattern
- `sharp` (dev dep): Image optimization — required for `astro:assets` build-time image processing
- `@astrojs/sitemap`: SEO — trivial to add, generates `sitemap.xml` from all static pages

**Explicitly do not install:** `@astrojs/react`, `@astrojs/vue`, `@astrojs/tailwind`, `@astrojs/mdx` (unless a case study genuinely needs embedded JSX), `contentlayer`, any server adapter.

### Expected Features

The feature landscape is well-understood for this domain. The MVP is a focused set: work index, 7 case study pages, Info page, CV page, shared navigation, mobile responsiveness, image optimization, and OpenGraph meta tags. Adding TL;DR summary blocks and outcome/impact statement structure to the case study template is low-complexity but high-signal at the Staff hiring bar — these should be built into the template from the start, not retrofitted.

**Must have (table stakes):**
- Work index with card grid (two-column, image-driven) — hiring managers land here first
- Individual case study pages for all 7 projects — the actual portfolio artifact
- Info / About page — humanizes the work
- CV / Resume page — completes the recruiter journey
- Navigation (shared layout) — site name left, Work / Info / CV right
- Mobile-responsive layout — 30-50% of portfolio visitors are on mobile; broken mobile is a bad signal from a designer
- Fast initial load (<2s LCP) — Astro static output handles this; image optimization is the main implementation work
- Case study hero image, role/company/year metadata, and outcome/impact statement on every case study
- Contact link (email or LinkedIn) on Info page

**Should have (differentiators for staff-level targeting):**
- Case study TL;DR / summary block at top of each case study — respects time-poor reviewers
- Process narrative with decision rationale inside case studies — what staff+ hiring bars actually evaluate
- Constraint transparency ("what we didn't build and why") — builds credibility with senior reviewers
- Developer-tools visual language (dark theme, terminal aesthetics, code-adjacent imagery) — already in design direction
- OpenGraph / social share images per case study — controls appearance when links are shared in Slack/LinkedIn
- Keyboard navigation and visible focus states — signals accessibility awareness; easy to do right from day one
- "What I'm thinking about" line on Info page — signals intellectual activity beyond past work
- Custom 404 page — avoids jarring GitHub generic error page on a design portfolio
- Print-friendly CV CSS — hiring coordinators print or PDF resumes

**Defer to post-MVP:**
- Password-protected case studies — assess NDA need for Docker work first; GitHub Pages has no built-in auth (requires Cloudflare/Netlify or a JS hash gate)
- Subtle scroll/image reveal animations — polish pass after all content is in place
- Keyboard/accessibility audit — dedicated pass, not ad-hoc
- `prefers-color-scheme` CSS — nice-to-have, not blocking
- Blog / writing section — not in scope; adds maintenance obligation

**Explicit anti-features (do not build):**
Contact form (no backend), search, CMS UI, dark mode toggle, scroll-jacking, splash/loading screen, video backgrounds, cookie consent banner, photography section.

### Architecture Approach

The architecture is a fully static Astro site with file-system routing and Content Collections. Every page is pre-rendered to HTML at build time in GitHub Actions and deployed to GitHub Pages as static files. The browser receives complete HTML with zero runtime data fetching. Data flow is entirely build-time: markdown files in `src/content/work/` are validated against a Zod schema, queried via `getCollection()`, and passed to `.astro` page templates that render to HTML with `astro:assets`-optimized images. The GitHub Actions workflow (`withastro/action` or manual `npm ci && astro build`) produces `dist/` which is uploaded as a Pages artifact and deployed via the Pages API.

**Major components:**
1. `src/content/work/*.md` + `src/content/config.ts` — markdown source of truth with Zod schema validation; one file per case study
2. `src/layouts/BaseLayout.astro` + `src/layouts/CaseStudyLayout.astro` — HTML shell, global styles, Nav; every page wraps BaseLayout
3. `src/pages/index.astro` — work index; queries collection, renders `CaseStudyCard` grid
4. `src/pages/work/[slug].astro` — dynamic static route; generates one page per collection entry via `getStaticPaths`
5. `src/pages/info.astro` + `src/pages/cv.astro` — static pages; depend only on BaseLayout
6. `src/components/Nav.astro` + `src/components/CaseStudyCard.astro` — shared UI components
7. `src/assets/work/<slug>/` — case study images processed by `astro:assets` at build time
8. `.github/workflows/deploy.yml` — CI/CD pipeline; builds and deploys to GitHub Pages on push to `main`

**Key patterns to follow:**
- Schema-first: define `config.ts` Zod schema before writing any markdown; it is the contract between content and templates
- Co-locate images with source (`src/assets/work/<slug>/`), not `public/`; only `astro:assets`-processed images get optimization and correct path handling
- Generate all URLs from collection entry slugs (`entry.slug`); never hardcode `/work/docker-onboarding` as a literal string
- Sort and filter collection entries at build time in `index.astro`; use `order` frontmatter field for manual control

### Critical Pitfalls

1. **Missing `base` config for GitHub Pages sub-path deploy** — If the repo is not the user root repo (`username.github.io`), set `site` AND `base: '/repo-name'` in `astro.config.mjs` before writing any links. All CSS, JS, and image paths will 404 in production if this is omitted. Use `import.meta.env.BASE_URL` for all internal `<a href>` values — never hardcode `/work` etc. Address in Phase 1.

2. **GitHub Actions deploy misconfiguration** — The workflow requires `id-token: write` permission and the repo Settings > Pages source must be set to "GitHub Actions" (not "Deploy from a branch"). Use Astro's official workflow pattern with `actions/upload-pages-artifact@v3` + `actions/deploy-pages@v4`. Address in Phase 1.

3. **Images in `public/` not optimized and path-broken on sub-path deploys** — Place all case study images in `src/assets/work/<slug>/`, not `public/`. Images in `public/` get no WebP conversion, no resize, and absolute paths in markdown (`![alt](/images/foo.png)`) will 404 on sub-path deploys. Use relative paths or the `image()` schema helper for all content images. Address in Phase 1 (conventions) and Phase 2 (content authoring).

4. **Content Collections schema mismatch breaks CI** — Adding a required field to the Zod schema after case studies are already written causes all existing markdown files to fail build validation. Use `.optional()` for non-critical fields; lock the schema before authoring case study content; run `npm run build` locally after every schema change. Address in Phase 2.

5. **Flash of unstyled content (FOUC) on dark theme** — Set `background-color: #1e2030` on both `html` and `body` in the global stylesheet (not just `body`). No JavaScript needed for a single fixed dark theme. Also add `<meta name="theme-color">` for mobile browser chrome. Address in Phase 1 (base layout).

---

## Implications for Roadmap

Based on research findings and the build order dependency chain from ARCHITECTURE.md, the roadmap should follow 5 phases:

### Phase 1: Foundation and Deploy Pipeline
**Rationale:** The most expensive bugs in this project are GitHub Pages configuration issues (wrong `base`, wrong Pages source setting, missing `id-token` permission) that cause all assets to 404 in production. These must be caught before any content work begins. Setting up the deploy pipeline first means every subsequent push validates that production works.
**Delivers:** Working deploy pipeline (push-to-deploy to GitHub Pages), correct `astro.config.mjs` with `site` + `base`, BaseLayout with global CSS and dark theme, Nav component with `BASE_URL` link pattern, empty work index placeholder, `output: 'static'` verified.
**Addresses:** Navigation (table stakes), consistent visual identity, fast initial load
**Avoids:** Pitfalls 1, 2, 3, 4 (base config, CI/CD, output mode), 7 (hardcoded links), 10 (trailing slash), 11 (dark theme FOUC), 13 (npm ci in CI)

### Phase 2: Content Schema and Case Study Template
**Rationale:** Schema must be locked before case study content is authored. Once the Zod schema is defined and validated against a single sample case study, the template is proven and all 7 case studies can be ported without code changes. Reversing this order (write content first, define schema later) causes a rewrite of all markdown frontmatter.
**Delivers:** `src/content/config.ts` with complete Zod schema, `[slug].astro` + `CaseStudyLayout.astro` rendering a working case study end-to-end, `astro:assets` image pipeline validated, TL;DR block and outcome/impact statement baked into template structure.
**Uses:** Astro Content Collections (loader API), `image()` Zod helper, `astro:assets` `<Image>` component
**Implements:** Content Collections component, CaseStudyLayout, HeroImage component
**Avoids:** Pitfalls 5 (schema mismatch), 6 (markdown image paths)

### Phase 3: Work Index and Static Pages
**Rationale:** The work index depends on collection entries existing (at least one valid case study from Phase 2). Info and CV pages are independent of collections but require BaseLayout from Phase 1. Grouping these together completes all routes and makes the full site navigable.
**Delivers:** Complete work index with `CaseStudyCard` grid, Info page, CV page with print CSS, `404.astro` custom error page, sitemap integration, OpenGraph meta tags in BaseLayout.
**Addresses:** Work index (table stakes), Info page (table stakes), CV page (table stakes), OpenGraph (differentiator), custom 404 (differentiator), print CV (differentiator)

### Phase 4: Content Migration
**Rationale:** Once the template is validated and the schema is locked, all 7 case studies can be ported from the existing Squarespace site into markdown. This is a content authoring phase, not a code phase. The separation ensures no more code changes are needed during content work — the template is stable.
**Delivers:** All 7 case studies fully ported: Docker Desktop Extensions onboarding, Docker notifications, Docker CLI, Booking.com checkout, Booking.com chatbot, Kitchen Notebook, Cleartrip Local — each with frontmatter, process narrative, decision rationale, constraint notes, and outcome/impact statement.
**Addresses:** All 7 individual case study pages (table stakes), process narrative (differentiator), constraint transparency (differentiator), impact framing (differentiator)

### Phase 5: Polish and Accessibility
**Rationale:** Polish is deliberately deferred until content is complete. Optimizing images before all case studies are in wastes effort (images will change). Accessibility auditing after all interactive elements exist is more thorough than ad-hoc checking.
**Delivers:** Image optimization audit (correct dimensions, alt text, WebP serving), keyboard navigation and visible focus states across all interactive elements, mobile responsiveness verification on all pages and case studies, `prefers-color-scheme` CSS for overscroll color, subtle image reveal animations (optional, if desired), performance audit (LCP < 2s).
**Addresses:** Mobile responsiveness (table stakes), keyboard/accessibility (differentiator), animation/transitions (differentiator)

### Phase Ordering Rationale

- **Deploy pipeline before content** is the single most important ordering decision. The entire class of GitHub Pages sub-path pitfalls (Pitfalls 1, 2, 3, 7) is caught in Phase 1 before any content investment is made.
- **Schema before content** (Phase 2 before Phase 4) prevents the costly anti-pattern of writing 7 case studies and then discovering a required frontmatter field was missing from all of them.
- **Template before index** (Phase 2 before Phase 3) ensures the dynamic route is proven with a real entry before the index page renders a grid of them.
- **Content before polish** (Phase 4 before Phase 5) avoids optimizing images that will later be replaced or resized, and ensures the accessibility audit covers the final set of interactive elements.

### Research Flags

Phases with standard, well-documented patterns (skip `/gsd:research-phase`):
- **Phase 1:** Astro + GitHub Pages deploy is thoroughly documented by official sources. Follow the workflow from PITFALLS.md and ARCHITECTURE.md verbatim.
- **Phase 2:** Astro Content Collections schema and `astro:assets` are stable, well-documented Astro core APIs. ARCHITECTURE.md includes working code samples.
- **Phase 3:** Static Astro pages, sitemap integration, and OG meta tags are standard patterns.
- **Phase 5:** Image optimization with `astro:assets` and CSS accessibility patterns are standard.

Phases that may benefit from targeted research during planning:
- **Phase 4 (if NDA content is needed):** Password-protecting specific case studies on GitHub Pages (static host, no built-in auth) has multiple implementation approaches (Cloudflare Workers, Netlify edge functions, JS hash gate). If Docker work requires NDA protection, research the simplest viable approach before Phase 4.
- **Phase 5 (animations):** If scroll-triggered image reveals or View Transitions are added, verify current Astro View Transitions API behavior and browser support before investing implementation time.

---

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | MEDIUM | Astro 5 stable release confirmed (Nov 2024); patch version numbers should be verified at `npm create astro@latest` time; GH Actions action versions may have newer releases |
| Features | MEDIUM-HIGH | Table stakes are stable portfolio conventions with HIGH confidence; differentiators are trend-sensitive (motion, animation taste) and should be cross-validated against current portfolio critique communities |
| Architecture | HIGH | Core Astro APIs (Content Collections, `astro:assets`, file-system routing, `getStaticPaths`) have been stable since Astro 2.x; GitHub Actions Pages deployment pattern is from official docs |
| Pitfalls | HIGH | Pitfall sources are official Astro and GitHub Pages documentation; `base` config behavior and `id-token` permission requirement are confirmed from official action README |

**Overall confidence:** MEDIUM-HIGH

### Gaps to Address

- **Astro 5 Content Collections API:** ARCHITECTURE.md notes the API was redesigned in Astro 5 (new `loader`-based API vs. legacy type-based API). Verify the exact API shape against `npm info astro version` output and current Astro 5 docs before writing `config.ts`. STACK.md recommends the `glob()` loader approach; ARCHITECTURE.md uses the legacy `type: 'content'` approach — reconcile these at implementation time.
- **Repo type (user root vs. project page):** Whether `base` is needed depends on whether the repo is `prashantkhanchandani.github.io` (user root, no base needed) or a project repo (e.g., `portfolio`, requires `base: '/portfolio'`). This is a one-line config decision with large downstream consequences — confirm repo name and type in Phase 1 before writing any links.
- **NDA constraints on Docker work:** Some case studies may require password protection. Assess this before Phase 4; if NDA protection is needed, plan the implementation approach before content migration begins.
- **Custom domain:** `prashant-khanchandani.info` may or may not be the target domain. If deploying to a custom domain (not a GitHub Pages sub-path), the `base` config issue disappears entirely. Clarify early in Phase 1.
- **Action version numbers:** `actions/configure-pages`, `actions/deploy-pages`, `actions/upload-pages-artifact` version numbers in STACK.md and ARCHITECTURE.md may have newer releases — verify at implementation time.

---

## Sources

### Primary (HIGH confidence)
- Astro official GitHub Pages deploy guide: https://docs.astro.build/en/guides/deploy/github/
- Astro Content Collections (v5 loader API): https://docs.astro.build/en/guides/content-collections/
- Astro configuration reference: https://docs.astro.build/en/reference/configuration-reference/
- Astro `astro:assets` image docs: https://docs.astro.build/en/guides/images/
- Astro project structure: https://docs.astro.build/en/basics/project-structure/
- `withastro/action` official README: https://github.com/withastro/action
- `actions/deploy-pages` official README (id-token requirement): https://github.com/actions/deploy-pages
- GitHub Pages custom 404: https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-custom-404-page-for-your-github-pages-site

### Secondary (MEDIUM confidence)
- Training knowledge of Astro 4.x/5.x behavior (cutoff August 2025) — used for pitfall patterns, anti-pattern identification
- Training knowledge of designer portfolio conventions (2024-2025) — used for feature landscape, differentiators, staff-level hiring bar expectations
- Astro 5 release announcement: https://astro.build/blog/astro-5/ (confirmed Nov 2024)
- Tailwind v3 `@astrojs/tailwind` deprecation notice: https://docs.astro.build/en/guides/integrations-guide/tailwind/

### Tertiary (LOW confidence — validate before relying on)
- Differentiator features (motion design taste, animation conventions): trend-sensitive; cross-validate against current portfolio critique communities (ADPList, Layers.to) before investing implementation time
- NDA/password-protection implementation approaches on GitHub Pages: multiple community patterns exist; needs targeted research if required

---
*Research completed: 2026-02-26*
*Ready for roadmap: yes*
