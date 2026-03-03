# Phase 1: Foundation - Research

**Researched:** 2026-02-27
**Domain:** Astro 5 project scaffold, GitHub Pages CI/CD, dark theme CSS, responsive navigation
**Confidence:** HIGH

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| FOUND-01 | Astro 5 project scaffolded and successfully deployed to `prashantkhanchandani.github.io` via GitHub Actions on push to main | GitHub Actions workflow with `withastro/action@v5`, repo Settings > Pages > Source: "GitHub Actions", `site` set in `astro.config.mjs`, no `base` needed (user root repo) |
| FOUND-02 | Dark theme global CSS with CSS custom properties — dark background (~#1e2030), white text, minimal sans-serif typography scale | Set `background-color` on both `html` and `body` in `global.css` via `:root` custom properties; import in `BaseLayout.astro`; no JS needed for single fixed dark theme |
| FOUND-03 | Shared navigation component — "Prashant Khanchandani" on left, Work / CV links on right, consistent across all pages | `Nav.astro` component imported in `BaseLayout.astro`; use plain `href="/work"` and `href="/cv"` (no `BASE_URL` needed — user root repo has no sub-path) |
| FOUND-04 | Layout is mobile responsive — readable and functional on phone and tablet without horizontal scrolling or broken layout | CSS Flexbox for nav (flex-wrap, space-between), `max-width` container with horizontal padding, `meta name="viewport"` in `<head>`, media query for mobile nav stacking |
</phase_requirements>

---

## Summary

Phase 1 establishes the entire delivery infrastructure before any content investment is made. The three technical risks that can break an Astro + GitHub Pages project — wrong CI/CD configuration, wrong `base` config, and dark theme flash of unstyled content — are all caught and resolved in this phase. Because the repo is `prashantkhanchandani.github.io` (a GitHub user root repo, not a project repo), the `base` config pitfall is eliminated entirely: all internal `href` values can be written as plain paths like `/work` and `/cv` without `import.meta.env.BASE_URL` gymnastics.

The most important version update from the prior research documents: `withastro/action` is now at **v5** (research docs referenced v3, which is outdated). The Content Collections config file location also changed in Astro 5: it is now `src/content.config.ts` at the project root (not `src/content/config.ts` inside the content directory). Additionally, `render()` is now a standalone function imported from `astro:content`, not a method on the collection entry. These three differences between Astro 4 patterns and Astro 5 patterns are the primary implementation traps for this phase.

Phase 1 delivers a thin but complete vertical slice: the CI/CD pipeline runs, the deployed site is dark and navigable, and every page shares a consistent layout shell. No content collections, no case study pages — just the structural foundation that all subsequent phases build on.

**Primary recommendation:** Scaffold with `npm create astro@latest`, immediately set up the GitHub Actions workflow and Pages settings, do a smoke deploy with a placeholder index page, then layer in BaseLayout + Nav + global CSS. Verify the dark theme on mobile before calling Phase 1 done.

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Astro | `^5.x` (latest) | Site framework | Zero-JS static output by default; file-system routing; `.astro` component syntax; official GitHub Pages support |
| Node.js | `>=20.x` (22 LTS preferred) | Runtime | Astro 5 requires Node 18+; `withastro/action@v5` defaults to Node 22; use 20+ for local dev |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `@astrojs/sitemap` | `^3.x` | Sitemap generation | Add as Astro integration in `astro.config.mjs` — generates `sitemap.xml` at build time; trivial to add in Phase 1 before content exists |
| `sharp` | `^0.33.x` | Build-time image optimization | Required by `astro:assets` for WebP conversion and resizing; install as dev dependency |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Plain CSS custom properties | Tailwind CSS v4 | Tailwind v4 is viable but adds complexity; `@astrojs/tailwind` was deprecated in Astro 5; this project has a fixed bespoke design — custom properties give full control with no overhead |
| Plain CSS custom properties | Sass/SCSS | No meaningful benefit at this project size; plain CSS covers all needs |
| GitHub Pages | Vercel | Vercel is excellent but adds a third-party dependency; GitHub Pages keeps everything in one place, truly free, no bandwidth limits for static |

**Do NOT install:**
- `@astrojs/react`, `@astrojs/vue` — no UI framework needed
- `@astrojs/tailwind` — deprecated in Astro 5
- `@astrojs/node` or any server adapter — GitHub Pages requires static output only
- `@astrojs/mdx` — plain `.md` files are sufficient; add only if a case study genuinely needs embedded JSX

**Installation:**
```bash
# Scaffold the project
npm create astro@latest

# When prompted:
# - Template: Empty
# - TypeScript: Yes (Strict)
# - Install dependencies: Yes
# - Initialize git: No (repo already created on GitHub)

# Add sitemap integration
npx astro add sitemap

# Sharp for image optimization (dev dependency)
npm install -D sharp
```

---

## Architecture Patterns

### Recommended Project Structure

```
portfolio/                          # repo root: prashantkhanchandani.github.io
├── .github/
│   └── workflows/
│       └── deploy.yml              # CI/CD: build + deploy to GitHub Pages
├── public/
│   ├── favicon.svg
│   └── robots.txt
├── src/
│   ├── assets/                     # Images processed by astro:assets (Phase 2+)
│   │   └── work/                   # One subdir per case study
│   ├── components/
│   │   └── Nav.astro               # Navigation bar
│   ├── content/                    # Case study markdown files (Phase 2+)
│   ├── layouts/
│   │   └── BaseLayout.astro        # HTML shell, global styles, Nav — EVERY page uses this
│   ├── pages/
│   │   ├── index.astro             # Work index (placeholder for Phase 1)
│   │   └── cv.astro                # CV page placeholder (links must exist for Nav)
│   └── styles/
│       └── global.css              # CSS custom properties, reset, typography
├── src/content.config.ts           # Content Collections schema (Phase 2 — create stub now)
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

**Phase 1 creates:** `.github/workflows/deploy.yml`, `src/layouts/BaseLayout.astro`, `src/components/Nav.astro`, `src/styles/global.css`, `src/pages/index.astro` (placeholder), `src/pages/cv.astro` (placeholder), `astro.config.mjs`.

### Pattern 1: GitHub Actions Deploy Workflow

**What:** Push to `main` triggers a GitHub Actions build that produces `dist/` and deploys it to GitHub Pages via the Pages API.
**When to use:** Phase 1 setup — create this before writing any other code.

```yaml
# .github/workflows/deploy.yml
# Source: https://docs.astro.build/en/guides/deploy/github/ (verified 2026-02-27)
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write    # REQUIRED — deploy-pages fails without this

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
        uses: withastro/action@v5
        # withastro/action@v5 auto-detects package manager and Node version
        # Defaults to Node 22. Override with:
        # with:
        #   node-version: 20

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

**GitHub repo Settings required:**
- Settings > Pages > Source: set to **"GitHub Actions"** (not "Deploy from a branch")
- This uses the modern Pages API — do not mix with legacy `gh-pages` branch approach

### Pattern 2: astro.config.mjs for User Root Repo

**What:** Minimal config for a GitHub user root repo (no `base` needed).
**When to use:** This specific repo is `prashantkhanchandani.github.io` — user root repo deploys to `https://prashantkhanchandani.github.io/` with no sub-path.

```javascript
// astro.config.mjs
// Source: https://docs.astro.build/en/reference/configuration-reference/ (verified 2026-02-27)
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://prashantkhanchandani.github.io',
  // NO base: needed — user root repo serves from /
  output: 'static',        // explicit for clarity; this is the default
  trailingSlash: 'never',  // consistent URLs: /work not /work/
  integrations: [sitemap()],
});
```

**Critical:** Do not set `base: '/portfolio'` or any sub-path. The user root repo serves from `/`. Setting a wrong `base` would break all asset and link paths.

### Pattern 3: BaseLayout with FOUC-proof Dark Theme

**What:** Global HTML shell that every page wraps. Sets dark background on `html` element (not just `body`) to prevent flash of unstyled content on load and overscroll.
**When to use:** Every page in the site uses `<BaseLayout>`.

```astro
---
// src/layouts/BaseLayout.astro
// FOUC prevention: background-color set on html element in global.css
interface Props {
  title: string;
  description?: string;
}
const { title, description = 'Portfolio of Prashant Khanchandani, Staff Product Designer' } = Astro.props;
---
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#1e2030" />
    <title>{title} — Prashant Khanchandani</title>
    {description && <meta name="description" content={description} />}
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  </head>
  <body>
    <Nav />
    <main>
      <slot />
    </main>
  </body>
</html>

<style is:global>
  /* Import global.css via Astro's scoped import pattern */
</style>
```

**Note:** Import `global.css` in BaseLayout using Astro's style import: add `import '../styles/global.css';` in the frontmatter block, or use `<style is:global>@import '../styles/global.css';</style>`. The `import` in the frontmatter is simpler.

### Pattern 4: Global CSS with Dark Theme Custom Properties

**What:** Single source of truth for all design tokens. FOUC prevented by setting `background-color` on `html` and `body` both — the `html` element covers overscroll areas on iOS/mobile.

```css
/* src/styles/global.css */

/* Design tokens */
:root {
  --color-bg: #1e2030;
  --color-text: #e8e8e8;
  --color-text-muted: #a0a0b0;
  --color-accent: #82aaff;    /* adjust to match design intent */
  --font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', ui-monospace, monospace;
  --max-width: 1100px;
  --spacing-page: 1.5rem;
}

/* FOUC prevention: set on html AND body so overscroll is also dark */
html,
body {
  background-color: var(--color-bg);
  color: var(--color-text);
}

/* Reset */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: var(--font-sans);
  font-size: 1rem;
  line-height: 1.6;
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
}

/* Typography scale */
h1 { font-size: clamp(1.75rem, 4vw, 3rem); font-weight: 600; line-height: 1.1; }
h2 { font-size: clamp(1.25rem, 3vw, 2rem); font-weight: 600; }
h3 { font-size: 1.25rem; font-weight: 600; }

/* Layout */
.container {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 var(--spacing-page);
}

a {
  color: inherit;
  text-decoration: none;
}
```

### Pattern 5: Navigation Component

**What:** Shared nav bar — site name left, Work / CV right. Mobile responsive using Flexbox.
**When to use:** Imported into BaseLayout; appears on every page automatically.

```astro
---
// src/components/Nav.astro
// User root repo: plain href="/work" works — no BASE_URL needed
---
<header>
  <nav class="nav">
    <a href="/" class="nav-brand">Prashant Khanchandani</a>
    <ul class="nav-links" role="list">
      <li><a href="/work">Work</a></li>
      <li><a href="/cv">CV</a></li>
    </ul>
  </nav>
</header>

<style>
  header {
    position: sticky;
    top: 0;
    z-index: 100;
    background-color: var(--color-bg);
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  }

  .nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    max-width: var(--max-width);
    margin: 0 auto;
    padding: 1rem var(--spacing-page);
  }

  .nav-brand {
    font-weight: 600;
    white-space: nowrap;
  }

  .nav-links {
    display: flex;
    gap: 2rem;
    list-style: none;
  }

  .nav-links a {
    color: var(--color-text-muted);
    transition: color 0.15s;
  }

  .nav-links a:hover {
    color: var(--color-text);
  }

  /* Mobile: wrap if needed, reduce gap */
  @media (max-width: 480px) {
    .nav {
      flex-wrap: wrap;
    }
    .nav-links {
      gap: 1.25rem;
    }
  }
</style>
```

**Note on Nav links:** The work index is at `/` (root), not `/work`. The Nav links to `/work` would be a 404 unless a `/work` page is created. Decide in Phase 1 whether the work index lives at `/` (recommended per requirements) or `/work`. If at `/`, the Nav "Work" link should point to `/`. Alternatively redirect `/work` → `/`. This decision affects all subsequent phase links.

**Recommendation:** Work index at `/` (root). Nav "Work" link: `href="/"`. A `/work` redirect is not needed for Phase 1 but can be added in Phase 2.

### Anti-Patterns to Avoid

- **Setting `base: '/repo-name'` on a user root repo:** The `prashantkhanchandani.github.io` repo is a user root repo — it serves at `/`. Setting `base` would break all asset paths. Do not add `base` to `astro.config.mjs`.
- **Using `npm install` in GitHub Actions:** Always `npm ci` — it respects `package-lock.json` and prevents accidental upgrades between CI runs.
- **Setting background only on `body`:** iOS overscroll shows white flash. Always set `background-color` on `html` element too.
- **Using `withastro/action@v3` or `@v2`:** These are outdated. Use `withastro/action@v5` (confirmed current as of 2026-02-27).
- **Creating `src/content/config.ts`:** This was the Astro 4 location. Astro 5 uses `src/content.config.ts` at the project root. Wrong location = content collections silently ignored.
- **Hardcoding absolute paths in Nav as `/work` when work index is at `/`:** Nav "Work" link should match where the work index actually lives.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| GitHub Pages deploy | Custom deploy scripts, manual `git push gh-pages` | `withastro/action@v5` + `actions/deploy-pages@v4` | Official action handles Node setup, caching, build, and artifact upload; manual approach breaks silently when Pages API changes |
| Image optimization | Manual WebP conversion scripts, `<img>` with raw PNG | `astro:assets` `<Image>` component + `sharp` dev dep | Automatic WebP, lazy loading attributes, width/height inference (prevents CLS), cache-busted URLs |
| Sitemap | `sitemap.xml` hand-written or a custom build script | `@astrojs/sitemap` integration | Automatically includes all static pages; updates on every build; one-line integration |
| CSS reset | Copy-pasted Normalize.css, Eric Meyer reset | A short custom `*` reset in `global.css` | Minimal reset for a site this small; full reset libraries add noise |

**Key insight:** The CI/CD pipeline and image optimization are both problems where the "build it yourself" path has many silent failure modes that the official tooling handles correctly. The cost of custom solutions in these areas is debugging time, not lines of code.

---

## Common Pitfalls

### Pitfall 1: Using `withastro/action@v3` (Outdated)

**What goes wrong:** Referencing outdated action version from tutorials or prior research. v3 may still run but is not the current documented version and may lack features or have known issues.
**Why it happens:** Tutorial rot; research docs prepared before v5 release.
**How to avoid:** Always use `withastro/action@v5` — verified current as of 2026-02-27 from official docs and GitHub Marketplace.
**Warning signs:** GitHub Actions log shows older action version; Astro's official docs show a different version than your workflow.

### Pitfall 2: Wrong Content Collections Config Location

**What goes wrong:** Creating `src/content/config.ts` (Astro 4 location) instead of `src/content.config.ts` (Astro 5 location). Content collections are silently ignored — no error, just no content.
**Why it happens:** Astro 5 moved the config file location as part of the Content Layer API redesign. Most tutorials and AI training data reflect the old location.
**How to avoid:** Config file is `src/content.config.ts` at the project root (NOT inside `src/content/`). Phase 1 should create this file as a stub even before content is added.
**Warning signs:** `getCollection()` returns empty array; no build errors (the file is simply not found).

### Pitfall 3: Flash of Unstyled Content (FOUC) on Dark Theme

**What goes wrong:** Browser renders white background momentarily before dark CSS loads. Jarring on a dark portfolio site.
**Why it happens:** `background-color` set only on `body`, or set via JavaScript after paint.
**How to avoid:** Set `background-color: var(--color-bg)` on both `html` and `body` in `global.css`. This is pure CSS — no JavaScript needed for a single fixed dark theme.
**Warning signs:** White flash visible when throttling to "Slow 3G" in DevTools. Also check: does the overscroll area (pull down past top of page on iOS) show white?

### Pitfall 4: GitHub Pages Source Set to Branch Instead of GitHub Actions

**What goes wrong:** GitHub Actions workflow completes successfully (green check) but the live site never updates.
**Why it happens:** GitHub Pages defaults to "Deploy from a branch" mode. The `actions/deploy-pages` action uses the newer Pages API mode. Both can coexist in Settings — the wrong one silently wins.
**How to avoid:** In repo Settings > Pages > Source, select **"GitHub Actions"**. This must be done before the first deploy.
**Warning signs:** CI is green but `https://prashantkhanchandani.github.io` doesn't update; the Pages settings panel shows "Branch: main" or "Branch: gh-pages".

### Pitfall 5: Missing `id-token: write` Permission

**What goes wrong:** The deploy step fails with a 403 or permission error, even though the workflow file looks correct.
**Why it happens:** `actions/deploy-pages` requires OIDC token to authenticate with GitHub's Pages API. This requires `id-token: write` at the `permissions` level.
**How to avoid:** Always include `id-token: write` in the workflow's top-level `permissions` block (not per-job — or per-job if you prefer, but be consistent).
**Warning signs:** GitHub Actions deploy step shows 403 or "Resource not accessible by integration" error.

### Pitfall 6: Work Index URL Conflict (/work vs /)

**What goes wrong:** Nav links to `/work` but the work index is at `/`. Clicking "Work" in the nav returns the root redirect or a 404.
**Why it happens:** Requirements say Nav should have a "Work" link, but requirements also say the work index is at `/` (the homepage).
**How to avoid:** Either (a) point the Nav "Work" link to `href="/"`, or (b) create a `/work` page that contains the index and make `/` redirect there. Option (a) is simpler for Phase 1.
**Warning signs:** Clicking "Work" in the nav takes you to the root but `<title>` is "Home" not the work index.

### Pitfall 7: iOS Overscroll Shows White Background

**What goes wrong:** On iOS, pulling down past the top of the page reveals white space above the `<body>`, which is jarring on a dark site.
**Why it happens:** The overscroll area is the browser chrome background, controlled by the `html` element's `background-color` and the `<meta name="theme-color">` tag.
**How to avoid:** Set `background-color` on `html` element (not just `body`). Add `<meta name="theme-color" content="#1e2030">` in `<head>`.
**Warning signs:** Visible when testing on a real iOS device or in Safari responsive design mode with dark body color.

---

## Code Examples

Verified patterns from official sources:

### Complete Deploy Workflow

```yaml
# .github/workflows/deploy.yml
# Source: https://docs.astro.build/en/guides/deploy/github/ (verified 2026-02-27)
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
        uses: withastro/action@v5

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

### astro.config.mjs for User Root Repo

```javascript
// astro.config.mjs
// Source: https://docs.astro.build/en/reference/configuration-reference/
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://prashantkhanchandani.github.io',
  // base: NOT SET — user root repo, no sub-path
  output: 'static',
  trailingSlash: 'never',
  integrations: [sitemap()],
});
```

### Content Collections Stub (Astro 5 Location)

```typescript
// src/content.config.ts  ← NOTE: project root, NOT src/content/config.ts
// Source: https://docs.astro.build/en/guides/content-collections/ (verified 2026-02-27)
// Phase 1 creates this as a stub; Phase 2 adds the work collection schema
import { defineCollection } from 'astro:content';

// Stub — populated in Phase 2
export const collections = {};
```

### Dynamic Route Pattern (for Phase 2 reference)

```astro
---
// src/pages/work/[id].astro
// Source: https://docs.astro.build/en/guides/content-collections/ (verified 2026-02-27)
// NOTE: Astro 5 uses entry.id (not entry.slug) and standalone render() function
import { getCollection, render } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';

export async function getStaticPaths() {
  const entries = await getCollection('work', ({ data }) => !data.draft);
  return entries.map(entry => ({
    params: { id: entry.id },
    props: { entry },
  }));
}

const { entry } = Astro.props;
const { Content } = await render(entry);
---
<BaseLayout title={entry.data.title}>
  <Content />
</BaseLayout>
```

### Placeholder Index Page for Phase 1

```astro
---
// src/pages/index.astro
// Phase 1 placeholder — replaced with real work index in Phase 2
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout title="Work">
  <div class="container" style="padding-top: 4rem;">
    <h1>Work coming soon.</h1>
  </div>
</BaseLayout>
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `withastro/action@v2`/`@v3` | `withastro/action@v5` | 2025 | Use v5; older versions may still function but are not the documented recommendation |
| `src/content/config.ts` | `src/content.config.ts` (project root) | Astro 5.0 (Nov 2024) | Wrong location silently ignores content collections with no error |
| `entry.slug` | `entry.id` | Astro 5.0 Content Layer API | `entry.slug` no longer exists in Astro 5; use `entry.id` for routing params |
| `await entry.render()` | `import { render } from 'astro:content'; await render(entry)` | Astro 5.0 | `entry.render()` was removed; `render` is now a standalone import |
| `type: 'content'` in defineCollection | `loader: glob(...)` in defineCollection | Astro 5.0 | The `type` property was replaced by the `loader` property; the two APIs are incompatible |
| `@astrojs/tailwind` | Tailwind v4 Vite plugin (if needed) | Astro 5.0 | `@astrojs/tailwind` deprecated; don't install it for this project |

**Deprecated / outdated:**
- `type: 'content'` in `defineCollection`: replaced by `loader: glob({...})` in Astro 5
- `actions/configure-pages@v4` and `actions/deploy-pages@v3`: current versions are v5 and v4 respectively

---

## Open Questions

1. **Work index URL: `/` or `/work`?**
   - What we know: Requirements say Nav has a "Work" link and the work index is the main page
   - What's unclear: Should `href="/"` or `href="/work"` be the Nav link? Should the index.astro be the work index, or should there be both a root redirect and a `/work` page?
   - Recommendation: Make the work index live at `/` (root `index.astro`). Nav "Work" link points to `href="/"`. This is simpler and conventional for a portfolio homepage.

2. **Sticky nav: opaque or blur backdrop?**
   - What we know: Nav should be consistent across all pages; dark background is ~#1e2030
   - What's unclear: Should the sticky nav have `backdrop-filter: blur()` for a glass effect, or solid `background-color: var(--color-bg)`?
   - Recommendation: Solid background for Phase 1 (simpler, FOUC-safe, no browser compat concerns). Add blur effect in Phase 5 polish if desired.

3. **Exact typography scale and font choice**
   - What we know: "minimal sans-serif" is the direction; system font stack works
   - What's unclear: Is a web font (e.g., Inter, DM Sans) needed to match the designer's vision, or is system-ui sufficient?
   - Recommendation: Start with system font stack (`-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif`) in Phase 1. Add a specific web font in Phase 2 if the design requires it.

---

## Sources

### Primary (HIGH confidence)

- [Astro GitHub Pages Deploy Guide](https://docs.astro.build/en/guides/deploy/github/) — workflow pattern, action versions, permissions, repo Settings (verified 2026-02-27)
- [Astro Content Collections Guide](https://docs.astro.build/en/guides/content-collections/) — config file location (`src/content.config.ts`), `glob()` loader, `entry.id`, standalone `render()` import (verified 2026-02-27)
- [Astro Content Collections API Reference](https://docs.astro.build/en/reference/modules/astro-content/) — `CollectionEntry` type, `render()` function signature (verified 2026-02-27)
- [withastro/action GitHub Marketplace](https://github.com/marketplace/actions/astro-deploy) — confirmed `@v5` is current (verified 2026-02-27)

### Secondary (MEDIUM confidence)

- [Astro Configuration Reference](https://docs.astro.build/en/reference/configuration-reference/) — `site`, `output`, `trailingSlash` options; `base` behavior for user root repos
- Project research files (`STACK.md`, `ARCHITECTURE.md`, `PITFALLS.md`) — pre-existing research from 2026-02-26; valid for patterns but action version numbers were outdated

### Tertiary (LOW confidence — validate at implementation)

- Typography scale specifics: system font stack recommendation is based on design intent; actual font choice may change based on visual review
- Exact nav styling (sticky behavior, blur, border): implementation details not locked; adjust to visual taste in Phase 1 or defer to Phase 5

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — Astro 5 confirmed stable; `withastro/action@v5` verified from official docs; Node.js requirements confirmed
- Architecture: HIGH — Astro file-system routing, BaseLayout pattern, CSS custom properties are stable and well-documented; all code examples verified against current Astro 5 docs
- Pitfalls: HIGH — All critical pitfalls verified from official Astro and GitHub Actions documentation; version discrepancies (v3 vs v5) confirmed via web search against official sources
- Astro 5 API changes: HIGH — `entry.id`, standalone `render()`, `src/content.config.ts` location all confirmed from official docs

**Research date:** 2026-02-27
**Valid until:** 2026-03-27 (30 days; Astro releases frequently but core APIs are stable)

**Key correction from prior research documents:**
- `withastro/action` version: prior docs said `@v3` — correct version is `@v5`
- Content collections config location: prior docs showed `src/content/config.ts` — correct Astro 5 location is `src/content.config.ts`
- Entry identifier: prior docs used `entry.slug` — Astro 5 uses `entry.id`
- Render pattern: prior docs used `entry.render()` — Astro 5 uses standalone `render(entry)` imported from `astro:content`
