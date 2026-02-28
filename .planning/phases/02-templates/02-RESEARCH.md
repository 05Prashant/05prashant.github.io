# Phase 2: Templates - Research

**Researched:** 2026-02-28
**Domain:** Astro 5 Content Collections (glob loader + Zod schema), dynamic routing, markdown pages, custom 404
**Confidence:** HIGH

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| CASE-01 | Content Collections schema for case studies — frontmatter: title, company, year, description, heroImage, cardImage, cardImageSecondary (optional), order | `defineCollection` with glob loader + Zod schema using `image()` helper for type-safe image fields; `z.number()` for year/order; `z.string().optional()` for cardImageSecondary |
| CASE-02 | Individual case study pages (`/work/[slug]`) from markdown — hero image, centered title/company/year, About section, freeform markdown content | `getStaticPaths` + `getCollection('work')` → params using `entry.id`; `render(entry)` returns `<Content />` component; layout wraps with hero + metadata section |
| CASE-03 | Adding a new `.md` file in `src/content/work/` with correct frontmatter auto-generates work index card and `/work/[slug]` page — no code changes needed | glob loader pattern `**/*.md` picks up any new file automatically; `getCollection` returns all entries including new ones at build time |
| WORK-01 | Work index page (`/`) lists all case studies — cards with title+arrow, company label, two-column image layout matching design | `getCollection('work')` in `index.astro`; sort by `order` field; `<Image>` component for card images; CSS Grid for two-column layout |
| WORK-02 | Bold headline above the case study list | Static text in `index.astro` above the case study list loop; no data dependency |
| PAGE-01 | CV page (`/cv`) built from a markdown file — editable without code changes | `.md` file in `src/pages/cv/` or `src/pages/` with `layout` frontmatter property pointing to a `CvLayout.astro`; OR content collection with single-entry pattern; markdown page approach is simpler |
| PAGE-02 | Custom 404 page matching the site's dark design | `src/pages/404.astro` using `BaseLayout` — GitHub Pages and all major static hosts auto-serve `404.html` for unmatched routes |
</phase_requirements>

---

## Summary

Phase 2 builds all page templates and the content collection schema that enables zero-code content additions. The phase has four distinct sub-systems: (1) the Content Collections schema in `src/content.config.ts`, (2) the work index page at `/` with case study cards, (3) dynamic case study pages at `/work/[slug]`, and (4) two static pages — CV and 404.

The most important architectural decision is image storage strategy. Images referenced in content collection frontmatter must live in `src/` (not `public/`) to get Astro's automatic WebP conversion, lazy loading, and size optimization via `astro:assets`. The `image()` schema helper from `defineCollection` validates that these image paths resolve correctly at build time, providing a type-safe bridge between frontmatter and the `<Image />` component. Images stored in `public/` are never optimized — they serve as static assets only and should be reserved for favicons and robots.txt.

The CV page has two viable approaches: (a) a `.md` file in `src/pages/` with a `layout` frontmatter property — the simplest option with zero collection overhead, or (b) a single-entry content collection. Approach (a) is recommended because the CV is a standalone page, not a set of related entries. The `layout` frontmatter property makes the markdown file completely self-contained — editing `src/pages/cv.md` is the only change needed to update CV content.

**Primary recommendation:** Implement content collections with the glob loader and Zod schema (using the `image()` helper for image fields), dynamic `/work/[id].astro` routes using `entry.id` as the URL param, a simple markdown page for CV, and a `404.astro` using `BaseLayout`.

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Astro Content Collections | built-in (Astro 5) | Schema-validated markdown with type-safe frontmatter | glob loader auto-discovers new files; Zod validates schema at build time; `getCollection` provides typed querying |
| `astro/zod` | built-in | Schema definition and validation | Re-exported from Astro — no separate `zod` install needed; `z.string()`, `z.number()`, `z.coerce.date()`, `.optional()` cover all portfolio fields |
| `astro:assets` `<Image>` | built-in (Astro 5) | Optimized image rendering | Automatic WebP, lazy loading, `width`/`height` inference (prevents CLS), cache-busted URLs — works with `image()` schema helper |
| `astro/loaders` `glob` | built-in (Astro 5) | File-system content discovery | Pattern-based — `**/*.md` picks up any new case study markdown without code changes |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `sharp` | `^0.33.x` (already installed) | Build-time image processing | Already installed in Phase 1 as dev dependency — required by `astro:assets` for format conversion |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `image()` schema helper + `src/` images | String paths + `public/` images | `public/` images are never optimized; no WebP, no lazy loading, larger file sizes — use only if optimization is explicitly unwanted |
| Markdown page (`src/pages/cv.md`) for CV | Content collection with single entry | Collection adds indirection (schema, `getCollection`, dynamic route) for a page that will never have multiple entries — markdown page is strictly simpler |
| `src/pages/work/[id].astro` (single param) | `src/pages/work/[...id].astro` (rest param) | Rest param handles multi-segment IDs (e.g., `booking-com/checkout`); single param only works for flat slugs. Use single param `[id]` since case study IDs will be flat filenames |

**No new npm installs required for Phase 2.** All needed packages (`astro`, `sharp`, `@astrojs/sitemap`) were installed in Phase 1.

---

## Architecture Patterns

### Recommended Project Structure (Phase 2 additions)

```
src/
├── assets/
│   └── work/                     # Case study images (processed by astro:assets)
│       ├── booking-checkout/
│       │   ├── hero.jpg
│       │   ├── card-main.jpg
│       │   └── card-secondary.jpg
│       └── kitchen-notebook/
│           └── hero.jpg
├── components/
│   └── Nav.astro                  # (existing — unchanged)
├── content/
│   └── work/                     # One .md file per case study
│       ├── booking-checkout.md
│       └── kitchen-notebook.md
├── content.config.ts              # (existing stub — add work collection here)
├── layouts/
│   ├── BaseLayout.astro           # (existing — unchanged)
│   └── CvLayout.astro            # New: wraps cv.md with BaseLayout
├── pages/
│   ├── 404.astro                 # New: custom 404 page
│   ├── cv.md                     # New: CV content — layout: ../layouts/CvLayout.astro
│   ├── index.astro               # Updated: real work index with case study cards
│   └── work/
│       └── [id].astro            # New: dynamic case study detail pages
└── styles/
    └── global.css                # (existing — may add prose styles)
```

### Pattern 1: Content Collections Schema with `image()` Helper

**What:** Define the `work` collection with Zod validation, including type-safe image fields using the `image()` helper.
**When to use:** Any collection entry that references local image files — enables `<Image>` component with full optimization.

```typescript
// src/content.config.ts
// Source: https://docs.astro.build/en/guides/content-collections/ (verified 2026-02-28)
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const work = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/work' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    company: z.string(),
    year: z.number(),
    description: z.string(),
    heroImage: image(),
    cardImage: image(),
    cardImageSecondary: image().optional(),
    order: z.number(),
    draft: z.boolean().optional().default(false),
  }),
});

export const collections = { work };
```

**Critical:** `schema` must be a function `({ image }) => z.object(...)` when using the `image()` helper — not a plain `z.object(...)`. The `image` helper is injected as an argument.

### Pattern 2: Case Study Frontmatter (Example .md file)

**What:** Template for a case study markdown file showing correct frontmatter fields.
**When to use:** Every file in `src/content/work/`. Image paths are relative to the markdown file's location.

```markdown
---
title: "Overhauling a checkout experience"
company: "Booking.com"
year: 2022
description: "End-to-end redesign of the Booking.com checkout flow, reducing abandonment by 12%."
heroImage: "../../assets/work/booking-checkout/hero.jpg"
cardImage: "../../assets/work/booking-checkout/card-main.jpg"
cardImageSecondary: "../../assets/work/booking-checkout/card-secondary.jpg"
order: 1
---

## About

Brief project overview paragraph goes here.

## The Challenge

Freeform markdown content continues below...
```

**Note on image paths:** Images referenced in frontmatter are resolved relative to the markdown file. From `src/content/work/booking-checkout.md`, the path `../../assets/work/...` correctly resolves to `src/assets/work/...`.

### Pattern 3: Work Index Page with `getCollection`

**What:** The root `index.astro` fetches all case studies, sorts by `order`, and renders a card for each.
**When to use:** This replaces the Phase 1 placeholder `index.astro`.

```astro
---
// src/pages/index.astro
// Source: https://docs.astro.build/en/guides/content-collections/ (verified 2026-02-28)
import { getCollection } from 'astro:content';
import { Image } from 'astro:assets';
import BaseLayout from '../layouts/BaseLayout.astro';

const allWork = await getCollection('work', ({ data }) => !data.draft);
const sortedWork = allWork.sort((a, b) => a.data.order - b.data.order);
---

<BaseLayout title="Work">
  <div class="container">
    <p class="index-headline">I've spent the last decade crafting, building, and shipping digital experiences.</p>
    <ul class="work-list" role="list">
      {sortedWork.map((entry) => (
        <li class="work-card">
          <div class="work-card-text">
            <a href={`/work/${entry.id}`} class="work-card-link">
              {entry.data.title} →
            </a>
            <span class="work-card-company">{entry.data.company}</span>
          </div>
          <div class="work-card-images">
            <Image src={entry.data.cardImage} alt={entry.data.title} class="card-image-main" />
            {entry.data.cardImageSecondary && (
              <Image src={entry.data.cardImageSecondary} alt="" class="card-image-secondary" />
            )}
          </div>
        </li>
      ))}
    </ul>
  </div>
</BaseLayout>
```

### Pattern 4: Dynamic Case Study Detail Page

**What:** `src/pages/work/[id].astro` generates one page per case study using `getStaticPaths`.
**When to use:** This is the pattern for all `/work/[slug]` pages.

```astro
---
// src/pages/work/[id].astro
// Source: https://docs.astro.build/en/guides/content-collections/ (verified 2026-02-28)
import { getCollection, render } from 'astro:content';
import { Image } from 'astro:assets';
import BaseLayout from '../../layouts/BaseLayout.astro';

export async function getStaticPaths() {
  const entries = await getCollection('work', ({ data }) => !data.draft);
  return entries.map((entry) => ({
    params: { id: entry.id },
    props: { entry },
  }));
}

const { entry } = Astro.props;
const { Content } = await render(entry);
---

<BaseLayout title={entry.data.title} description={entry.data.description}>
  <article>
    <div class="case-hero">
      <Image src={entry.data.heroImage} alt={entry.data.title} class="hero-image" />
    </div>
    <div class="case-header container">
      <h1>{entry.data.title}</h1>
      <p class="case-meta">{entry.data.company} — {entry.data.year}</p>
    </div>
    <div class="case-body container prose">
      <Content />
    </div>
  </article>
</BaseLayout>
```

**Key Astro 5 facts:**
- `render` is imported from `'astro:content'` as a standalone function — not `entry.render()`
- `params: { id: entry.id }` — the param name must match the filename bracket `[id]`
- `entry.id` is the slugified filename (e.g., `booking-checkout.md` → `id: 'booking-checkout'`)

### Pattern 5: CV Markdown Page with Layout

**What:** A `.md` file in `src/pages/` with a `layout` frontmatter property. Renders markdown content inside `CvLayout.astro`.
**When to use:** Single standalone pages where content is markdown but no collection abstraction is needed.

```markdown
---
# src/pages/cv.md
layout: ../layouts/CvLayout.astro
title: "CV"
description: "Career history and skills of Prashant Khanchandani, Staff Product Designer"
---

## Experience

### Staff Product Designer — Docker, Inc.
*2022–Present*

...career history in freeform markdown...
```

```astro
---
// src/layouts/CvLayout.astro
import BaseLayout from './BaseLayout.astro';

const { frontmatter } = Astro.props;
---
<BaseLayout title={frontmatter.title} description={frontmatter.description}>
  <div class="container cv-content prose">
    <slot />
  </div>
</BaseLayout>
```

**Note:** `Astro.props.frontmatter` (not `Astro.props`) contains the markdown file's frontmatter when a layout is applied to a markdown page in `src/pages/`. The `<slot />` renders the compiled markdown body.

### Pattern 6: Custom 404 Page

**What:** `src/pages/404.astro` — builds to `dist/404.html`. GitHub Pages automatically serves this for unmatched URLs.
**When to use:** Any static Astro site on GitHub Pages, Netlify, Vercel, or Cloudflare Pages.

```astro
---
// src/pages/404.astro
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout title="Page Not Found">
  <div class="container" style="padding-top: 8rem; text-align: center;">
    <h1>404</h1>
    <p style="margin-top: 1rem; color: var(--color-text-muted);">
      This page doesn't exist.
    </p>
    <a href="/" style="display: inline-block; margin-top: 2rem;">
      ← Back to work
    </a>
  </div>
</BaseLayout>
```

**GitHub Pages 404 behavior:** GitHub Pages automatically routes unmatched requests to `404.html` when present at the root. No configuration needed. This works for both the root domain and any path.

### Anti-Patterns to Avoid

- **`entry.slug` in Astro 5:** The `slug` property no longer exists on content collection entries. Use `entry.id`. Using `slug` causes a TypeScript error and runtime failure.
- **`await entry.render()`:** Removed in Astro 5. Import `render` from `'astro:content'` and call `await render(entry)`.
- **`schema: z.object(...)` without image helper:** Works for string fields but `image()` is unavailable. Always use `schema: ({ image }) => z.object(...)` when any field is an image.
- **Images in `public/` for content images:** `public/` images bypass optimization entirely. The `image()` schema helper will reject string paths to `public/` — use `src/assets/` or co-locate images with markdown.
- **File named `[slug].astro`:** Creates params named `slug` not `id`. Since `entry.id` is used in `getStaticPaths`, the file must be named `[id].astro` and `params: { id: entry.id }` to match.
- **`z.date()` for `year`:** Use `z.number()` for a 4-digit year integer. `z.coerce.date()` would require a full ISO date string in frontmatter.
- **`type: 'content'` in `defineCollection`:** This was the Astro 4 API. Astro 5 uses `loader: glob(...)`. The two are incompatible — do not mix.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Schema validation of frontmatter | Manual checks in page code | Zod schema in `defineCollection` | Build-time type errors; TypeScript autocomplete; missing field = build failure, not silent runtime bug |
| Image optimization pipeline | Shell scripts, custom WebP conversion | `astro:assets` `<Image>` + `image()` schema helper | Automatic WebP, responsive sizes, lazy loading, CLS prevention — hundreds of edge cases handled |
| Slug generation from filenames | Custom slugify function | `glob` loader `entry.id` | Astro slugifies filenames automatically; consistent, URL-safe, no custom logic needed |
| Sorting case studies | Database, external CMS | `order` field in frontmatter + `.sort()` | Simple JS array sort; `order: 1, 2, 3...` in markdown frontmatter is self-documenting |
| 404 routing | Server-side redirect rules, `.htaccess` | `src/pages/404.astro` | All major static hosts (GitHub Pages, Netlify, Vercel) serve `404.html` automatically |

**Key insight:** Content Collections' Zod validation is the most critical "don't hand-roll" item here. Without it, a typo in a `year` field (string instead of number) would silently pass through to the template and cause a confusing runtime display bug. With Zod, it's a build-time error with the file path and line number.

---

## Common Pitfalls

### Pitfall 1: `entry.id` Includes Subdirectory Prefix for Nested Content

**What goes wrong:** If case study markdown files are stored at `src/content/work/booking/checkout.md` (nested), `entry.id` becomes `booking/checkout`, making the URL `/work/booking/checkout`. Unexpected for flat slug URLs.
**Why it happens:** `entry.id` is derived from the relative path within the `base` directory, including subdirectories.
**How to avoid:** Store all case study files flat at `src/content/work/booking-checkout.md` (not nested). The `entry.id` will be `booking-checkout` — a clean, flat slug.
**Warning signs:** URLs look like `/work/company/project-name` instead of `/work/project-name`.

### Pitfall 2: `schema` as Plain `z.object()` Instead of Function

**What goes wrong:** TypeScript error: "Property 'image' does not exist on type '{}'" or the `image()` helper is undefined at runtime.
**Why it happens:** The `image()` helper is only available when `schema` is a function that receives it as an argument: `schema: ({ image }) => z.object({...})`.
**How to avoid:** Always use the function form when any field uses `image()`. Plain `z.object()` is fine only for collections with no image fields.
**Warning signs:** Build error mentioning `image is not a function` or `image is not defined`.

### Pitfall 3: CV Layout Receives `Astro.props.frontmatter` Not `Astro.props`

**What goes wrong:** `{title}` is undefined in the layout because the code destructures from `Astro.props` directly instead of `Astro.props.frontmatter`.
**Why it happens:** Markdown pages in `src/pages/` with a `layout` property pass frontmatter data under `Astro.props.frontmatter` — not as top-level props. This is different from standard `.astro` layouts.
**How to avoid:** In `CvLayout.astro`, always use `const { frontmatter } = Astro.props;` then reference `frontmatter.title`.
**Warning signs:** Page title shows "undefined" or is missing; TypeScript warns about missing properties.

### Pitfall 4: Image Path Resolution Relative to Markdown File

**What goes wrong:** Image not found at build time — Astro throws `Could not find asset` error.
**Why it happens:** Image paths in frontmatter are resolved relative to the markdown file's location, not the project root. `./hero.jpg` means the image is in the same directory as the `.md` file.
**How to avoid:** Use paths relative to the markdown file. From `src/content/work/booking.md`, to reference `src/assets/work/booking/hero.jpg`, use `../../assets/work/booking/hero.jpg`.
**Warning signs:** Build error: "Could not find asset" or "Image not found"; path works when tested as absolute but fails in frontmatter.

### Pitfall 5: Forgetting `draft` Filter in `getCollection`

**What goes wrong:** Draft case studies (stub entries with placeholder content) appear on the live work index and get their own accessible URL.
**Why it happens:** `getCollection('work')` returns ALL entries including those with `draft: true`.
**How to avoid:** Always filter: `getCollection('work', ({ data }) => !data.draft)`. Add `draft: z.boolean().optional().default(false)` to the schema.
**Warning signs:** Placeholder stub entries visible in the work index on the deployed site.

### Pitfall 6: `cv.md` Conflicts with `cv.astro` Placeholder

**What goes wrong:** Both `src/pages/cv.astro` and `src/pages/cv.md` exist. Astro may error or one silently shadows the other.
**Why it happens:** Phase 1 created `src/pages/cv.astro` as a placeholder. Phase 2 introduces `cv.md` as the content-driven replacement. Having both at the same path causes a conflict.
**How to avoid:** Delete `src/pages/cv.astro` when creating `src/pages/cv.md`. Only one file can resolve to `/cv`.
**Warning signs:** Astro build warning "Route /cv already defined"; unexpected page renders.

### Pitfall 7: Work Index Still at Placeholder State After Replacing index.astro

**What goes wrong:** The work index still shows "Work coming soon." because `index.astro` was not replaced, or `getCollection` returns an empty array because `src/content/work/` has no `.md` files yet.
**Why it happens:** The collection schema can be valid but return zero entries if no markdown files exist.
**How to avoid:** Create at least one case study stub `.md` file in `src/content/work/` with valid frontmatter before verifying the work index renders cards.
**Warning signs:** `getCollection('work')` returns empty array; work index renders with no cards (or an empty list).

---

## Code Examples

Verified patterns from official sources:

### Complete `src/content.config.ts` for Phase 2

```typescript
// src/content.config.ts
// Source: https://docs.astro.build/en/guides/content-collections/ (verified 2026-02-28)
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const work = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/work' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    company: z.string(),
    year: z.number(),
    description: z.string(),
    heroImage: image(),
    cardImage: image(),
    cardImageSecondary: image().optional(),
    order: z.number(),
    draft: z.boolean().optional().default(false),
  }),
});

export const collections = { work };
```

### Work Index Card Rendering

```astro
---
// src/pages/index.astro (excerpt — key data logic)
import { getCollection } from 'astro:content';
import { Image } from 'astro:assets';

const allWork = await getCollection('work', ({ data }) => !data.draft);
const sortedWork = allWork.sort((a, b) => a.data.order - b.data.order);
---

{sortedWork.map((entry) => (
  <li class="work-card">
    <a href={`/work/${entry.id}`}>{entry.data.title} →</a>
    <span>{entry.data.company}</span>
    <Image src={entry.data.cardImage} alt={entry.data.title} />
    {entry.data.cardImageSecondary && (
      <Image src={entry.data.cardImageSecondary} alt="" />
    )}
  </li>
))}
```

### Case Study Page with render()

```astro
---
// src/pages/work/[id].astro (key imports + render pattern)
// Source: https://docs.astro.build/en/reference/modules/astro-content/ (verified 2026-02-28)
import { getCollection, render } from 'astro:content';

export async function getStaticPaths() {
  const entries = await getCollection('work', ({ data }) => !data.draft);
  return entries.map((entry) => ({
    params: { id: entry.id },   // filename without extension becomes id
    props: { entry },
  }));
}

const { entry } = Astro.props;
const { Content } = await render(entry);   // render() is standalone import, NOT entry.render()
---
<Content />
```

### CV Layout Receiving Markdown Props

```astro
---
// src/layouts/CvLayout.astro
// Source: https://docs.astro.build/en/guides/markdown-content/ (verified 2026-02-28)
// Markdown pages in src/pages/ pass frontmatter under Astro.props.frontmatter
import BaseLayout from './BaseLayout.astro';
const { frontmatter } = Astro.props;
---
<BaseLayout title={frontmatter.title} description={frontmatter.description}>
  <div class="container prose">
    <slot />
  </div>
</BaseLayout>
```

### Prose CSS (markdown body styling)

```css
/* Add to global.css or scoped to case study / CV page */
.prose h2 {
  margin-top: 2.5rem;
  margin-bottom: 0.75rem;
}
.prose h3 {
  margin-top: 2rem;
  margin-bottom: 0.5rem;
}
.prose p {
  margin-bottom: 1.25rem;
}
.prose ul, .prose ol {
  margin-bottom: 1.25rem;
  padding-left: 1.5rem;
}
.prose li {
  margin-bottom: 0.35rem;
}
.prose img {
  max-width: 100%;
  border-radius: 4px;
  margin: 1.5rem 0;
}
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `type: 'content'` in `defineCollection` | `loader: glob({ pattern, base })` | Astro 5.0 (Nov 2024) | Incompatible APIs — must use `loader`, not `type` |
| `entry.slug` for URL routing | `entry.id` | Astro 5.0 | `slug` property removed from entries; `entry.id` is the slugified filename |
| `await entry.render()` | `import { render } from 'astro:content'; await render(entry)` | Astro 5.0 | Method removed; standalone function required |
| `src/content/config.ts` | `src/content.config.ts` (project root) | Astro 5.0 | Wrong location = silent failure (no error, collections ignored) |
| `z` imported from `zod` package | `z` imported from `astro/zod` | Astro 3+ | Use `astro/zod` — no separate `zod` dependency needed |
| Images in `public/` for case studies | Images in `src/assets/` with `image()` helper | Astro 3+ (stable in 5) | `public/` images are unoptimized static assets; `src/assets/` images get WebP, lazy loading, etc. |

**Deprecated / outdated patterns seen in tutorials:**
- `defineCollection({ type: 'content', schema: z.object({...}) })` — Astro 4 API, does not work in Astro 5
- `post.slug` — does not exist in Astro 5 content layer entries; causes TypeScript error
- `[...slug].astro` file naming when using `entry.id` as param — must match: `[id].astro` with `params: { id: entry.id }`

---

## Open Questions

1. **Case study image alt text strategy**
   - What we know: `cardImageSecondary` is described as a "tinted secondary panel" — it may be decorative
   - What's unclear: Should `cardImageSecondary` in the schema require an `alt` string or always use empty `alt=""`?
   - Recommendation: Add an optional `cardImageSecondaryAlt` string field in the schema; default to empty string for decorative images. This can be decided at content-authoring time (Phase 3).

2. **Two-column card image layout CSS**
   - What we know: Requirements specify "two-column image layout (main screenshot left, tinted secondary panel right)"
   - What's unclear: Exact proportions, aspect ratios, and "tinted" effect method (CSS filter? colored overlay? separate image?)
   - Recommendation: Use CSS Grid (e.g., `grid-template-columns: 2fr 1fr`) for the two-column layout. The "tinted" effect is likely a design detail — implement with `filter: brightness(0.7)` or `opacity: 0.8` on the secondary image; adjust to match design reference in Phase 2.

3. **Prose styles: global vs scoped**
   - What we know: Both case study body and CV content need markdown prose styling
   - What's unclear: Should `.prose` styles live in `global.css` or be scoped to each layout?
   - Recommendation: Add `.prose` block to `global.css` — both CvLayout and the case study page use the same `.prose` class, keeping it DRY.

---

## Sources

### Primary (HIGH confidence)

- [Astro Content Collections Guide](https://docs.astro.build/en/guides/content-collections/) — glob loader, defineCollection, schema with image() helper, getCollection, render(), entry.id (verified 2026-02-28)
- [Astro Content Collections API Reference](https://docs.astro.build/en/reference/modules/astro-content/) — render() function signature, CollectionEntry type, getCollection filter parameter (verified 2026-02-28)
- [Astro Routing Guide](https://docs.astro.build/en/guides/routing/) — dynamic routes, getStaticPaths, custom 404 page behavior (verified 2026-02-28)
- [Astro Images Guide](https://docs.astro.build/en/guides/images/) — image() schema helper, src/ vs public/ image storage, Image component usage (verified 2026-02-28)
- [Astro Markdown Guide](https://docs.astro.build/en/guides/markdown-content/) — layout frontmatter property, Astro.props.frontmatter in markdown layouts, slot behavior (verified 2026-02-28)
- [Astro Pages Guide](https://docs.astro.build/en/basics/astro-pages/) — 404.astro creates 404.html, markdown as pages (verified 2026-02-28)

### Secondary (MEDIUM confidence)

- [Astro Add Content Collections Tutorial](https://docs.astro.build/en/tutorials/add-content-collections/) — complete working code example with glob loader and getStaticPaths (verified 2026-02-28)
- Web search: Astro 5 entry.id vs slug pattern — confirmed `entry.id` replaces `entry.slug`, multiple independent sources agree

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all APIs verified from official Astro 5 docs (content collections, images, routing, markdown)
- Architecture: HIGH — file structure and patterns derived from official tutorials and docs, not training data
- Pitfalls: HIGH — Astro 4 → 5 breaking changes (`type` → `loader`, `entry.slug` → `entry.id`, `entry.render()` → standalone `render()`) confirmed from official upgrade guide and API reference
- Prose styling: MEDIUM — `.prose` CSS pattern is conventional but exact values are design-judgment calls

**Research date:** 2026-02-28
**Valid until:** 2026-03-28 (30 days; Astro 5 APIs are stable; Content Layer API is the current recommended approach)

**Key Astro 5 breaking changes confirmed (relevant to this phase):**
- `type: 'content'` → `loader: glob(...)` in `defineCollection`
- `entry.slug` → `entry.id` for URL routing
- `await entry.render()` → `import { render }; await render(entry)`
- `src/content/config.ts` → `src/content.config.ts` (already correctly placed in Phase 1)
