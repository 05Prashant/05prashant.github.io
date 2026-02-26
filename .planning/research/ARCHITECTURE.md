# Architecture Patterns

**Domain:** Astro portfolio / case study site
**Researched:** 2026-02-26
**Confidence note:** Based on training knowledge of Astro 4.x (cutoff August 2025). Core APIs (Content Collections, astro:assets, GitHub Pages Action) were stable. Verify against current Astro docs if major version has shipped since.

---

## Recommended Architecture

A fully static Astro site (SSG output) with file-system routing, Content Collections for case study markdown, and the official `@astrojs/sitemap` + `astro:assets` for images. GitHub Actions builds and deploys to the `gh-pages` branch.

```
GitHub repo (main)
      │
      ▼
GitHub Actions CI (on push to main)
      │  npm ci && astro build
      ▼
dist/ (static HTML/CSS/JS/images)
      │
      ▼
GitHub Pages (gh-pages branch or /docs folder — branch approach recommended)
      │
      ▼
Browser (zero JS unless opted-in per component)
```

### Component Boundaries

| Component | Responsibility | Communicates With |
|-----------|---------------|-------------------|
| `src/content/work/` | Markdown source of truth for all case studies | `src/pages/work/[slug].astro` (consumed via `getCollection`) |
| `src/content/config.ts` | Zod schema defining valid frontmatter for each collection | All pages that call `getCollection` — schema validation runs at build |
| `src/pages/index.astro` | Work index — renders case study card grid | Queries `work` collection; passes data to `<CaseStudyCard>` |
| `src/pages/work/[slug].astro` | Individual case study page | Consumes single collection entry; delegates rendering to `<CaseStudyLayout>` |
| `src/pages/info.astro` | About / bio page | Static or driven by a `pages` Content Collection if content-managed |
| `src/pages/cv.astro` | CV page | Consumes `cv.md` from a `pages` collection or a standalone markdown file |
| `src/layouts/BaseLayout.astro` | HTML shell, `<head>`, global CSS, nav | Wraps every page |
| `src/layouts/CaseStudyLayout.astro` | Case study chrome (hero image, title, meta, body prose) | Receives frontmatter props + rendered `<Content />` slot |
| `src/components/Nav.astro` | Navigation bar (name left, Work/Info/CV right) | Imported into `BaseLayout` |
| `src/components/CaseStudyCard.astro` | Card on index: two-column image layout + company label | Receives a single `work` collection entry as a prop |
| `src/components/HeroImage.astro` | Optimized hero image for case study pages | Uses `astro:assets` `<Image>` component |
| `public/` | Static assets not processed by Astro (favicon, OG images, fonts if self-hosted) | Copied verbatim to `dist/` |
| `src/assets/` | Images processed by `astro:assets` (case study images, logos) | Referenced in `.astro` files and markdown via `../assets/...` paths |
| `.github/workflows/deploy.yml` | CI/CD: build + deploy to GitHub Pages | Reads repo, writes to `gh-pages` branch |

### Data Flow

```
Content authoring (markdown edit + git push)
        │
        ▼
src/content/work/*.md   ←── frontmatter validated against Zod schema in config.ts
        │
        │  getCollection('work')   (called at build time only)
        ▼
Astro build (SSG)
        ├── index page → iterates all entries → renders CaseStudyCard × N
        └── [slug] pages → one per entry → renders CaseStudyLayout + Content
                                │
                                ▼
                        astro:assets processes images
                        (resize, WebP conversion, lazy loading attrs)
                                │
                                ▼
                        dist/ (static HTML files, hashed asset URLs)
                                │
                                ▼
                        GitHub Pages (served as static files)
```

**Key data flow rule:** All data movement is build-time only. No runtime API calls, no client-side fetching. The browser receives complete HTML.

---

## Directory Structure

HIGH confidence — this is Astro's canonical project layout.

```
portfolio/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions: build + deploy
├── public/
│   ├── favicon.svg
│   └── robots.txt
├── src/
│   ├── assets/                 # Images processed by astro:assets
│   │   └── work/
│   │       ├── docker-onboarding/
│   │       │   ├── hero.png
│   │       │   └── detail-1.png
│   │       └── booking-checkout/
│   │           └── hero.png
│   ├── components/
│   │   ├── Nav.astro
│   │   ├── CaseStudyCard.astro
│   │   ├── HeroImage.astro
│   │   └── Footer.astro        # Optional — minimal footer if needed
│   ├── content/
│   │   ├── config.ts           # Collection schemas (Zod)
│   │   └── work/               # One .md or .mdx file per case study
│   │       ├── docker-onboarding.md
│   │       ├── docker-notifications.md
│   │       ├── docker-cli.md
│   │       ├── booking-checkout.md
│   │       ├── booking-chatbot.md
│   │       ├── kitchen-notebook.md
│   │       └── cleartrip-local.md
│   ├── layouts/
│   │   ├── BaseLayout.astro    # HTML shell, global styles, Nav
│   │   └── CaseStudyLayout.astro
│   ├── pages/
│   │   ├── index.astro         # Work index (/)
│   │   ├── info.astro          # About page (/info)
│   │   ├── cv.astro            # CV page (/cv)
│   │   └── work/
│   │       └── [slug].astro    # Dynamic route for each case study
│   └── styles/
│       └── global.css          # CSS custom properties, reset, typography
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

---

## Content Collections: Case Study Schema

HIGH confidence — Astro Content Collections with Zod schema validation has been stable since Astro 2.0.

```typescript
// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const work = defineCollection({
  type: 'content',   // markdown/mdx with rendered body
  schema: ({ image }) => z.object({
    title: z.string(),
    company: z.string(),
    year: z.number(),
    summary: z.string(),         // Short description for index card
    heroImage: image(),          // astro:assets optimized image reference
    cardImagePrimary: image(),   // Left image on index card
    cardImageSecondary: image().optional(), // Right tinted image on index card
    tags: z.array(z.string()).optional(),
    order: z.number().optional(), // Manual ordering on index page
    draft: z.boolean().default(false), // Exclude from build when true
  }),
});

export const collections = { work };
```

**Note on `image()` helper:** The `image()` Zod helper (from `{ image }` in schema callback) enables `astro:assets` build-time optimization for images referenced in frontmatter. Pass a relative path from the markdown file's location. HIGH confidence — this pattern was added in Astro 2.1 and is the recommended approach.

Example markdown frontmatter:

```markdown
---
title: "Introducing developers to a new tool"
company: "Docker"
year: 2024
summary: "Designing the onboarding flow for Docker Desktop's new Extensions platform."
heroImage: "../../assets/work/docker-onboarding/hero.png"
cardImagePrimary: "../../assets/work/docker-onboarding/card-main.png"
cardImageSecondary: "../../assets/work/docker-onboarding/card-secondary.png"
order: 1
draft: false
tags: ["developer tools", "onboarding", "desktop app"]
---

## The problem

...freeform markdown content...
```

---

## Routing

HIGH confidence — Astro file-system routing, stable since v1.

| URL | File | Type |
|-----|------|------|
| `/` | `src/pages/index.astro` | Static |
| `/info` | `src/pages/info.astro` | Static |
| `/cv` | `src/pages/cv.astro` | Static |
| `/work/docker-onboarding` | `src/pages/work/[slug].astro` | Dynamic (SSG with `getStaticPaths`) |
| `/work/booking-checkout` | same file, different params | Dynamic (SSG) |

`[slug].astro` pattern:

```typescript
// src/pages/work/[slug].astro
---
import { getCollection } from 'astro:content';
import CaseStudyLayout from '../../layouts/CaseStudyLayout.astro';

export async function getStaticPaths() {
  const entries = await getCollection('work', ({ data }) => !data.draft);
  return entries.map(entry => ({
    params: { slug: entry.slug },
    props: { entry },
  }));
}

const { entry } = Astro.props;
const { Content } = await entry.render();
---

<CaseStudyLayout frontmatter={entry.data}>
  <Content />
</CaseStudyLayout>
```

The slug is derived automatically from the filename (e.g., `docker-onboarding.md` → slug `docker-onboarding`). No manual slug needed.

---

## Layout Components

### BaseLayout.astro

Wraps every page. Responsibilities:
- `<html lang="en">` shell with dark background color (`#1e2030` or CSS var)
- `<head>`: charset, viewport, title (accept as prop), meta description, favicon
- Import `global.css`
- Render `<Nav />` above the slot
- `<slot />` for page content

```astro
---
// src/layouts/BaseLayout.astro
interface Props {
  title: string;
  description?: string;
}
const { title, description = 'Portfolio of Prashant Khanchandani' } = Astro.props;
---
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
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
```

### CaseStudyLayout.astro

Extends BaseLayout. Responsibilities:
- Hero image (full-width, using `<Image>` from `astro:assets`)
- Case study header: title, company, year
- Prose body via `<slot />` (the rendered markdown `<Content />`)
- Consistent typographic spacing for markdown-generated HTML

```astro
---
// src/layouts/CaseStudyLayout.astro
import BaseLayout from './BaseLayout.astro';
import { Image } from 'astro:assets';
interface Props {
  frontmatter: {
    title: string;
    company: string;
    year: number;
    summary: string;
    heroImage: ImageMetadata;
  };
}
const { frontmatter } = Astro.props;
---
<BaseLayout title={frontmatter.title} description={frontmatter.summary}>
  <article class="case-study">
    <Image src={frontmatter.heroImage} alt={frontmatter.title} class="hero" />
    <header>
      <p class="company">{frontmatter.company} · {frontmatter.year}</p>
      <h1>{frontmatter.title}</h1>
      <p class="summary">{frontmatter.summary}</p>
    </header>
    <div class="prose">
      <slot />
    </div>
  </article>
</BaseLayout>
```

---

## Image Handling with astro:assets

HIGH confidence — `astro:assets` was introduced in Astro 3.0 and is the current recommended approach, replacing the older `@astrojs/image` integration.

**Key behaviors:**
- Images in `src/assets/` are processed at build time: resized, converted to WebP/AVIF, hashed for cache-busting
- Images in `public/` are copied verbatim — no optimization. Use `public/` only for images that must have stable URLs (OG images, favicons)
- The `<Image>` component requires explicit `width` and `height` or infers them from the source file (prevents CLS)
- Markdown image syntax (`![alt](./path.png)`) also goes through the optimizer when images are co-located in `src/`

**Pattern for case study images:**

```astro
---
import { Image } from 'astro:assets';
import heroImg from '../assets/work/docker-onboarding/hero.png';
---
<!-- Explicit import in .astro files -->
<Image src={heroImg} alt="Docker onboarding hero" width={1200} height={675} />
```

**Pattern for frontmatter images (Content Collections):**

Use the `image()` Zod helper in `config.ts` (shown above). Astro resolves the path relative to the markdown file and passes the `ImageMetadata` object to your layout — no manual import needed in the layout.

**Two-column card layout images:** For the `CaseStudyCard` component, pass both `cardImagePrimary` and `cardImageSecondary` from the collection entry's `data` field and render them side-by-side with CSS Grid/Flexbox.

---

## GitHub Actions Workflow for GitHub Pages

HIGH confidence — this is Astro's official recommended workflow pattern, using `withastro/action` which handles Node setup, dependency install, and build.

```yaml
# .github/workflows/deploy.yml
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

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: dist/

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

**Required `astro.config.mjs` settings for GitHub Pages:**

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://<username>.github.io',
  // If deploying to https://<username>.github.io/<repo-name>/ (project site):
  // base: '/<repo-name>/',
  // If deploying to a custom domain (recommended for portfolio):
  // site: 'https://prashant-khanchandani.info',
  // base: '/',
});
```

**GitHub repo settings required:**
- Settings > Pages > Source: "GitHub Actions" (not "Deploy from a branch")
- This uses the modern Pages API that the workflow above targets

**Custom domain:** If using `prashant-khanchandani.info`, add a `CNAME` file to `public/` containing the domain, and configure DNS to point to GitHub Pages IPs.

---

## Patterns to Follow

### Pattern 1: Collection-driven Static Paths
**What:** All case study pages generated from Content Collection entries via `getStaticPaths`. No hardcoded routes.
**When:** Any time content is markdown-driven and needs individual pages.
**Why:** Adding a new case study = adding one markdown file. Zero code changes required.

### Pattern 2: Schema-first Content Authoring
**What:** Define the Zod schema in `config.ts` before writing any markdown. The schema is the contract between content authors and page templates.
**When:** Before writing the first case study file.
**Why:** Build-time validation catches missing fields immediately. Prevents "works locally, broken on deploy" issues.

### Pattern 3: Co-locate Images with Source, Not Public
**What:** All case study images live in `src/assets/work/<case-study-slug>/`.
**When:** Any image used in case study content or layouts.
**Why:** `astro:assets` optimization only applies to images in `src/`. `public/` images get no optimization.

### Pattern 4: Sort and Filter at Build Time
**What:** Sort case studies by `order` or `year` in `index.astro`, filter out `draft: true` entries.
**When:** Querying collection in index page.

```typescript
const entries = (await getCollection('work', ({ data }) => !data.draft))
  .sort((a, b) => (a.data.order ?? 99) - (b.data.order ?? 99));
```

---

## Anti-Patterns to Avoid

### Anti-Pattern 1: Using `public/` for Case Study Images
**What:** Putting case study images in `public/` instead of `src/assets/`.
**Why bad:** No WebP conversion, no resize, no lazy-load width/height inference. Large PNG/JPEG files served raw. Portfolio sites are image-heavy — this will be slow.
**Instead:** Use `src/assets/work/<slug>/` and reference via `astro:assets`.

### Anti-Pattern 2: Storing Metadata in Separate JSON/YAML Files
**What:** Keeping title, company, year in a `data.json` alongside the markdown body.
**Why bad:** Two files to keep in sync per case study. Frontmatter in the `.md` file is the correct single source of truth.
**Instead:** All metadata in frontmatter, validated by Zod schema.

### Anti-Pattern 3: Deploying Without `site` Set in Config
**What:** Skipping `site: 'https://...'` in `astro.config.mjs`.
**Why bad:** Sitemap generation, canonical URLs, and OG tags all produce incorrect absolute URLs. GitHub Pages will serve the site but SEO metadata will be broken.
**Instead:** Set `site` before first deploy.

### Anti-Pattern 4: Using Client-Side JS Hydration for Static Content
**What:** Adding `client:load` to components that only render text/images.
**Why bad:** Increases JS bundle size with no benefit. Astro's zero-JS default is a feature.
**Instead:** Keep all portfolio components as server-rendered `.astro` files. Only add `client:*` directives if building genuinely interactive UI (e.g., a filterable grid — not needed here).

### Anti-Pattern 5: Hardcoding Case Study URLs
**What:** Writing `/work/docker-onboarding` as a literal string in the Nav or index.
**Why bad:** If a file is renamed, the link breaks silently.
**Instead:** Generate URLs from collection entry slugs: `entry.slug` gives you the path segment.

---

## Scalability Considerations

This is a personal portfolio — scale is not a concern. However, these structural choices keep it maintainable:

| Concern | At 7 case studies (now) | At 20 case studies | Notes |
|---------|------------------------|---------------------|-------|
| Build time | < 5 seconds | < 15 seconds | Astro SSG builds are fast; image optimization is the slow step |
| Adding content | Edit 1 markdown file + add images | Same | Schema validation catches errors immediately |
| Reordering index | Change `order:` in frontmatter | Same | No code changes |
| Adding a new page type | Add new file to `src/pages/` | Same | File-system routing |
| Image optimization | Handled at build | Handled at build | CI builds on every push — no local build needed for content changes |

---

## Suggested Build Order (Phase Dependencies)

This is the critical dependency chain. Each phase must complete before the next can be fully tested.

```
1. Project scaffold + astro.config.mjs + GitHub Actions workflow
        │  (proves deploy pipeline works before any content)
        ▼
2. BaseLayout + Nav + global.css (dark theme, typography)
        │  (all pages depend on BaseLayout)
        ▼
3. Content Collections schema (config.ts) + 1 sample case study .md
        │  (pages depend on schema being valid)
        ▼
4. [slug].astro + CaseStudyLayout
        │  (proves collection → page rendering works end-to-end)
        ▼
5. CaseStudyCard + index.astro (work index)
        │  (depends on collection entries existing)
        ▼
6. info.astro + cv.astro (static pages)
        │  (independent of collections, but need BaseLayout from step 2)
        ▼
7. Port remaining 6 case studies (content migration)
        │  (depends on template being validated in step 4)
        ▼
8. Image optimization polish (correct sizes, alt text, card images)
        │  (depends on all content being in place)
        ▼
9. Final: custom domain, sitemap, meta tags, QA
```

**Why this order:**
- Deploy pipeline first ensures you catch GitHub Pages config issues before content work
- Schema before content prevents rewriting markdown after discovering missing fields
- One case study before all seven avoids debugging seven broken pages at once
- Static pages (Info, CV) are independent and can be done in parallel with step 5+

---

## Sources

**Confidence statement:** All patterns above are drawn from training knowledge of Astro 4.x (stable as of August 2025). The following aspects are HIGH confidence as they represent core, stable Astro APIs that have not changed since Astro 2.x/3.x:

- Content Collections API and Zod schema validation
- `astro:assets` and `<Image>` component
- File-system routing and `getStaticPaths`
- GitHub Actions `actions/upload-pages-artifact` + `actions/deploy-pages` pattern

**Verify before building:**
- Confirm Astro version in use and check migration guide if >= 5.0 (breaking changes possible — Content Collections API was refactored in some 5.x proposals)
- Official docs: https://docs.astro.build/en/guides/content-collections/
- Official docs: https://docs.astro.build/en/guides/images/
- Official docs: https://docs.astro.build/en/guides/deploy/github/
- Official docs: https://docs.astro.build/en/basics/project-structure/
