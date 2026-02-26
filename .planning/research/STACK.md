# Technology Stack

**Project:** Prashant Khanchandani Portfolio
**Researched:** 2026-02-26
**Confidence:** MEDIUM — Based on training data through August 2025. Versions flagged below. Verify specific version numbers against npm registry before pinning.

---

## Recommended Stack

### Core Framework

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Astro | ^5.x (latest 5.x) | Site framework | Static output by default, zero JS by default, `.astro` component syntax, built-in Content Collections for markdown, first-class GitHub Pages support. Astro 5 is the current stable major (released Nov 2024). Do NOT use Astro 4.x — it uses the older Content Collections API that was redesigned in v5. |
| Node.js | >=20.x LTS | Runtime | Astro 5 requires Node 18+; use 20 LTS for GH Actions stability. |

**Confidence:** MEDIUM — Astro 5 release is confirmed from training data (Nov 2024); patch version (5.x) should be verified at install time with `npm create astro@latest`.

---

### CSS Approach

**Recommendation: Plain CSS with CSS Custom Properties (no Tailwind)**

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Plain CSS / CSS Custom Properties | native | Styling | For a dark minimal portfolio with a specific design system (fixed color palette, specific typography), plain CSS with custom properties is the right choice. The design is bespoke — not utility-first. Tailwind adds build complexity and class verbosity for a site this small. |
| CSS Modules | native (Astro built-in) | Component-scoped styles | Astro's `<style>` blocks are scoped by default — this is effectively CSS Modules without configuration. Use this for component-level styles. |

**What NOT to use:**

- **Tailwind CSS v3 + `@astrojs/tailwind`**: `@astrojs/tailwind` was deprecated as of Astro 5 / Tailwind v4. If you want Tailwind, you'd use the new Tailwind v4 Vite plugin directly — but this site doesn't need it.
- **Tailwind CSS v4**: Viable but adds complexity. The design is highly specific (dark theme, exact colors, specific card layout). Custom properties + plain CSS gives more control with less overhead.
- **styled-components / CSS-in-JS**: No React/Vue in this project. Irrelevant.
- **Sass/SCSS**: No meaningful benefit for this project size. Plain CSS custom properties cover all needs.

**Confidence:** HIGH — This is an architectural judgment call based on project size, design specificity, and the deprecation of `@astrojs/tailwind`. The plain CSS recommendation is grounded in the project's fixed design system.

---

### Content Management

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Astro Content Collections (built-in) | Astro 5 API | Markdown content management | First-class Astro feature. Defines schema for case studies, validates frontmatter, generates typed entries. No external dependency. In Astro 5, use the new `loader`-based API (`defineCollection` with `glob()` loader), not the Astro 4 legacy API. |
| MDX (`@astrojs/mdx`) | ^3.x | Extended markdown | Only needed if case study content uses JSX components inline. For this project, standard markdown + frontmatter is sufficient — SKIP MDX unless a case study requires embedded interactive components. |

**Content Collections Schema for Case Studies (recommended frontmatter):**
```typescript
// src/content/config.ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const caseStudies = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/case-studies' }),
  schema: z.object({
    title: z.string(),
    company: z.string(),
    year: z.number(),
    heroImage: z.string(),
    secondaryImage: z.string().optional(),
    excerpt: z.string(),
    order: z.number().optional(), // for controlling index page sort
    draft: z.boolean().default(false),
  }),
});

export const collections = { caseStudies };
```

**Confidence:** HIGH — Content Collections are a core Astro feature. The Astro 5 `loader` API is confirmed from training data. The schema design above is recommended practice.

---

### Deployment

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| GitHub Pages | — | Hosting | Free, integrated with repo, zero ongoing cost. Static output only — matches Astro's default static build. |
| `withastro/action` | v3 | GitHub Actions deploy | Official Astro action for building and deploying to GitHub Pages. Handles Node setup, caching, and artifact upload in one step. |

**GitHub Actions Workflow (`/.github/workflows/deploy.yml`):**
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Pages
        uses: actions/configure-pages@v5
      - name: Install, build, and upload
        uses: withastro/action@v3
        # Optional: customize node-version or package-manager
        # with:
        #   node-version: 20
        #   package-manager: npm

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

**GitHub Pages Configuration Required:**
- In repo Settings > Pages: set Source to "GitHub Actions" (not "Deploy from branch")
- In `astro.config.mjs`: set `site: 'https://[username].github.io'` and if deploying to a sub-path (not root domain), set `base: '/[repo-name]'`

**Confidence:** MEDIUM — `withastro/action@v3` is confirmed from training data (released 2024). The `actions/configure-pages@v5` and `actions/deploy-pages@v4` version numbers may have newer releases — verify at implementation time. The workflow pattern is the official recommended approach.

---

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `sharp` | ^0.33.x | Image optimization | Astro's built-in `<Image>` component uses Sharp for build-time image optimization. Install as a dev dependency. Required for `astro:assets` image optimization to work in the build. |
| `@astrojs/sitemap` | ^3.x | Sitemap generation | Generates `sitemap.xml` automatically from all static pages. Add as integration in `astro.config.mjs`. Useful for SEO; trivial to add. |

**Libraries to explicitly NOT install:**

| Library | Why Not |
|---------|---------|
| `@astrojs/react` / `@astrojs/vue` | No UI framework needed. Astro components are sufficient for this static portfolio. Adding a framework adds hydration complexity and bundle weight. |
| `@astrojs/tailwind` | Deprecated as of Astro 5. Do not use. |
| `@astrojs/mdx` | Skip unless a case study genuinely needs JSX components in markdown. Plain `.md` files with Content Collections are sufficient. |
| `contentlayer` | External CMS tooling that competed with Astro's Content Collections. Unmaintained. Do not use. |
| `remark-*` / `rehype-*` plugins | Only add if a specific need arises (e.g., syntax highlighting for code blocks). For prose-only case studies, default Astro markdown processing is sufficient. |

**Confidence:** HIGH — These exclusions are grounded in the project scope (no interactivity, no code blocks, prose + images only).

---

## Installation

```bash
# Create new Astro project (choose "Empty" or "Blog" template as starting point)
npm create astro@latest

# When prompted:
# - Template: Empty (then build from scratch) OR Blog (then adapt)
# - TypeScript: Yes (Strict)
# - Install dependencies: Yes
# - Initialize git: No (already initialized)

# Add sitemap integration
npx astro add sitemap

# Sharp for image optimization (install separately as dev dep)
npm install -D sharp
```

**`astro.config.mjs` baseline:**
```javascript
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://prashant-khanchandani.github.io', // update to actual domain
  // base: '/portfolio', // uncomment if deploying to sub-path
  integrations: [sitemap()],
  output: 'static', // default; explicit for clarity
});
```

---

## Alternatives Considered

| Category | Recommended | Alternative | Why Not |
|----------|-------------|-------------|---------|
| Framework | Astro | Next.js | Next requires a server or Vercel. Overkill for static portfolio. No SSR needs. |
| Framework | Astro | 11ty (Eleventy) | Smaller ecosystem, fewer portfolio starters, less active development as of 2025. |
| Framework | Astro | Jekyll | GitHub Pages has Jekyll built-in, but the ecosystem is Ruby-based and dated. Astro is far more capable. |
| CSS | Plain CSS | Tailwind CSS v4 | Tailwind is excellent for design systems, but this site has a fixed, bespoke design. Custom properties are simpler and more maintainable for a one-person project. |
| CSS | Plain CSS | CSS Modules (explicit) | Astro's scoped `<style>` blocks provide the same isolation automatically. No extra tooling needed. |
| Content | Astro Content Collections | Netlify CMS / Decap | The requirement is direct markdown editing by the owner — no GUI CMS needed. Collections + frontmatter is simpler. |
| Hosting | GitHub Pages | Vercel (free tier) | Vercel is excellent but adds a third-party dependency. GitHub Pages keeps everything in one place and is truly free with no bandwidth limits for static sites. |

---

## Key Version Pins (verify at install time)

| Package | Expected Version Range | Where to Verify |
|---------|----------------------|-----------------|
| `astro` | ^5.x | `npm info astro version` |
| `@astrojs/sitemap` | ^3.x | `npm info @astrojs/sitemap version` |
| `sharp` | ^0.33.x | `npm info sharp version` |
| `withastro/action` (GH Action) | v3 | github.com/withastro/action/releases |
| `actions/checkout` | v4 | github.com/actions/checkout/releases |
| `actions/configure-pages` | v5 | github.com/actions/configure-pages/releases |
| `actions/deploy-pages` | v4 | github.com/actions/deploy-pages/releases |

---

## Sources

- Training knowledge (cutoff August 2025) — MEDIUM confidence for versions
- Astro 5 release: https://astro.build/blog/astro-5/ (confirmed Nov 2024)
- Official Astro GitHub Pages guide: https://docs.astro.build/en/guides/deploy/github/
- `withastro/action`: https://github.com/withastro/action
- Astro Content Collections (v5 loader API): https://docs.astro.build/en/guides/content-collections/
- Tailwind v3 `@astrojs/tailwind` deprecation: https://docs.astro.build/en/guides/integrations-guide/tailwind/
