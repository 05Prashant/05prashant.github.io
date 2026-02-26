# Domain Pitfalls: Astro Portfolio on GitHub Pages

**Domain:** Static portfolio site — Astro + GitHub Pages
**Researched:** 2026-02-26
**Confidence:** MEDIUM (core Astro/GitHub Pages behavior is well-documented; some specifics verified from official Astro docs and community patterns through training cutoff Aug 2025)

---

## Critical Pitfalls

Mistakes that cause broken deploys, blank pages, or full rewrites.

---

### Pitfall 1: Missing or Wrong `base` Config for Project-Page Deploys

**What goes wrong:**
GitHub Pages serves project repos (not `username.github.io`) at `https://username.github.io/repo-name/`. If `base` is not set in `astro.config.mjs`, all internal links, asset paths, and the router assume the site lives at `/`. The deployed site renders a blank page or broken styles because every `<link>`, `<script>`, and `<a href>` points to `/styles/global.css` instead of `/portfolio/styles/global.css`.

**Why it happens:**
Astro's default `base` is `/`. Developers test locally (where `/` is correct), everything looks fine, then the deploy goes live under a sub-path and silently breaks. There is no build-time warning.

**Consequences:**
- All CSS and JS 404
- All `<a>` links navigate to wrong paths
- Images in `public/` load correctly locally but 404 in production
- The entire deployed site appears blank or unstyled

**Prevention:**
1. Set both `site` and `base` in `astro.config.mjs` before writing any links:
   ```js
   // astro.config.mjs
   export default defineConfig({
     site: 'https://username.github.io',
     base: '/repo-name',   // must match the GitHub repo name exactly
   });
   ```
2. Use Astro's `BASE_URL` import (`import.meta.env.BASE_URL`) or the built-in `<a href={`${import.meta.env.BASE_URL}work`}>` pattern for all internal links — never hardcode `/`.
3. If the repo is the user root repo (`username.github.io`), omit `base` entirely (or set `base: '/'`).

**Detection (warning signs):**
- Site works on `localhost:4321` but all links/styles break after deploy
- Browser devtools shows 404s for `/assets/*.css` (no repo-name prefix)
- GitHub Pages 404 on every route except the root

**Phase:** Address in Phase 1 (project scaffold) before any content is added.

---

### Pitfall 2: Image Paths Break on GitHub Pages Sub-Path

**What goes wrong:**
Images referenced in markdown content (case studies) or `.astro` templates with absolute paths like `/images/docker-hero.png` resolve correctly locally but 404 on GitHub Pages where the root is `/portfolio/images/docker-hero.png`.

**Why it happens:**
Two separate mechanisms are at play:
1. **Markdown images** — `![alt](/images/foo.png)` produces a literal `<img src="/images/foo.png">` with no base prefix applied.
2. **`public/` images in templates** — manually typed `src="/images/foo.png"` skips Astro's asset pipeline and never gets the base prefix.

Images imported via `import heroImg from '../assets/hero.png'` through Astro's asset pipeline ARE handled correctly (Astro resolves the path and applies the base). Only literal string paths break.

**Consequences:**
- Case study hero images and content images 404 in production
- Layout shifts or broken `<img>` placeholders throughout the site

**Prevention:**
1. For images in `.astro` templates, use `import.meta.env.BASE_URL` prefix: `src={`${import.meta.env.BASE_URL}images/docker-hero.png`}` — or import the image asset directly.
2. Prefer placing case study images in `src/assets/` and importing them (Astro optimizes and correctly paths them) over `public/`.
3. For markdown body images, use relative paths from the markdown file's location rather than absolute paths: `![alt](../images/docker-hero.png)` instead of `![alt](/images/docker-hero.png)`.
4. Alternatively, configure a custom `remarkPlugin` or use Astro's `image()` schema in Content Collections to handle images as typed assets.

**Detection:**
- Images display in `npm run dev` but show broken `<img>` icons on the live site
- Network tab shows 404 for image URLs missing the repo-name prefix

**Phase:** Address in Phase 1 (scaffold + config) and Phase 2 (content authoring conventions).

---

### Pitfall 3: GitHub Actions Deploy Fails Silently or Uses Wrong Branch

**What goes wrong:**
The GitHub Actions workflow either (a) deploys to `gh-pages` branch but GitHub Pages in repo settings is still pointing to `main`, (b) uses `actions/deploy-pages` without the required `id-token: write` permission, or (c) uses an outdated action version that doesn't support the new GitHub Pages API (`actions/upload-pages-artifact` + `actions/deploy-pages` vs. the older `peaceiris/actions-gh-pages`).

**Why it happens:**
GitHub changed the GitHub Pages deployment model. The current canonical approach uses the Pages API (no branch commit needed). Many tutorials use the legacy `peaceiris/actions-gh-pages` approach which commits a build artifact to a `gh-pages` branch. Mixing both (e.g., using Pages API in the workflow but having the repo set to deploy from branch) causes silent failures.

**Consequences:**
- Pushes to `main` appear to succeed in CI but the live site never updates
- Pages shows "your site was deployed from branch" while the workflow targets the Pages API

**Prevention:**
Use Astro's official workflow template exactly as documented:
```yaml
# .github/workflows/deploy.yml
permissions:
  contents: read
  pages: write
  id-token: write   # REQUIRED — without this, deploy-pages fails

jobs:
  build:
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    needs: build
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/deploy-pages@v4
        id: deployment
```
In repo Settings > Pages, set Source to "GitHub Actions" (not "Deploy from a branch").

**Detection:**
- Actions workflow shows green but site doesn't update
- Pages settings shows "Branch: gh-pages" when you expect API-based deploys
- 403 or permission error in the deploy step logs

**Phase:** Address in Phase 1 (CI/CD setup). Never change after content phases start.

---

### Pitfall 4: Flash of Unstyled / Flash of Light Theme (FOUC) on Dark Sites

**What goes wrong:**
The browser renders a white/light background for a brief moment before the dark theme CSS loads. On slow connections this is a jarring flash. Even on fast connections, users who have `prefers-color-scheme: dark` may see a white flash if the theme is applied via JavaScript after paint rather than via CSS.

**Why it happens:**
- CSS-in-JS or theme toggle scripts that run after the initial paint
- Inline `<style>` not present in `<head>` — stylesheet loaded async
- `document.documentElement.classList.add('dark')` run in a deferred script, not a `<script>` in `<head>` before `<body>`

**Consequences:**
- Jarring visual artifact on every page load
- Worse on slow connections, Lighthouse audit notes it

**Prevention:**
1. Set the dark background directly on `:root` or `html` in a `<style>` tag in `<head>` — no JavaScript needed for a single dark theme with no toggle:
   ```css
   /* global.css */
   :root {
     background-color: #1e2030;
     color: #e8e8e8;
   }
   ```
2. If a theme toggle is added later, use the "blocking script" pattern: place a tiny inline `<script>` in `<head>` (before any `<link rel="stylesheet">`) that reads `localStorage` and applies `class="dark"` to `<html>` synchronously. This runs before first paint.
3. Never set the background color only on `<body>` — set it on `html` too, so there is no flash behind the body.

**Detection:**
- Throttle network in devtools to "Slow 3G" and reload — a white flash is visible before content
- View page source: if background color is only in an external `.css` file and not in an inline `<style>` in `<head>`, a flash is likely

**Phase:** Address in Phase 1 (base layout) when setting up the global stylesheet.

---

## Moderate Pitfalls

---

### Pitfall 5: Content Collections Schema Mismatch Causes Silent Build Failures

**What goes wrong:**
Astro Content Collections validate frontmatter against a Zod schema at build time. If a case study markdown file is missing a required field (e.g., `company`, `year`) or has a wrong type (e.g., `year: "2023"` vs `year: 2023`), the build fails with a schema validation error. This is actually a feature, but it becomes a pitfall when the schema is changed mid-project without updating existing markdown files.

**Why it happens:**
Schema is defined in `src/content/config.ts`. When new required fields are added (e.g., adding `coverImage` to the schema), all existing markdown files without that field throw a build error. This breaks the CI pipeline unexpectedly.

**Consequences:**
- `npm run build` (and therefore the GitHub Actions workflow) fails
- Adding a new case study requires knowing the schema exactly

**Prevention:**
1. Make fields optional with `.optional()` in Zod unless truly required:
   ```ts
   const caseStudySchema = z.object({
     title: z.string(),
     company: z.string(),
     year: z.number(),
     coverImage: z.string().optional(),  // not required
   });
   ```
2. Keep the schema simple and stable for the first content phase; only add fields when all existing content can be updated simultaneously.
3. Run `npm run build` locally after every schema change before pushing.

**Detection:**
- Build error mentioning `ZodError` or "did not match schema" in CI
- Schema errors reference specific frontmatter keys and file names — easy to diagnose but costly if caught only in CI

**Phase:** Address in Phase 2 (content modeling). Lock the schema before authoring case study content.

---

### Pitfall 6: Markdown Images in Case Studies Break When Using Content Collections

**What goes wrong:**
Markdown files in `src/content/` can reference images with relative paths. But those images must be either (a) co-located with the markdown file (Astro resolves them), or (b) in `public/` and referenced with an absolute path. The pitfall is referencing images from `public/` with absolute paths in markdown — they work locally but break on the GitHub Pages sub-path deploy (same as Pitfall 2, but specifically in markdown).

Additionally, Astro's Content Collections `image()` schema helper (introduced in Astro 2.1) requires images to be imported through the schema, not just string paths. If you define `coverImage: image()` in the schema, you cannot pass a string path — you must pass an image that Astro can resolve at build time.

**Why it happens:**
Content authors edit markdown files directly (the design intent for this project). Without clear conventions documented, they naturally write `![Hero](/images/docker-hero.png)` which works in the GitHub markdown preview but breaks on the deployed site.

**Consequences:**
- Case study hero and body images 404 on production
- Confusing to debug because the same path works locally

**Prevention:**
1. Co-locate images with content: create `src/content/work/docker-tool/` directory containing both `index.md` and `hero.png`. Reference as `![Hero](./hero.png)`.
2. OR: document clearly in a `CONTRIBUTING.md` or frontmatter comment that all images must go in `public/images/` and be referenced as `![Hero](BASE_URL + /images/foo.png)` — but this is awkward in pure markdown. Co-location is cleaner.
3. For the cover image used in the work index (not in markdown body), use Astro's `image()` schema type so Astro can optimize and path it correctly.

**Detection:**
- Images render in GitHub's markdown preview (`.md` file view) but not on the live site
- Images render in `npm run dev` (because `public/` is served at `/` locally) but not in production

**Phase:** Address in Phase 2 (content authoring conventions). Set conventions before any case studies are authored.

---

### Pitfall 7: `astro.config.mjs` `base` Breaks Internal `<a>` Links Written as Relative Paths

**What goes wrong:**
When `base: '/portfolio'` is set, Astro's `<a>` elements in `.astro` files that use hardcoded paths like `href="/work"` will NOT automatically get the base prefix. Only `href={`${import.meta.env.BASE_URL}work`}` or Astro's `<a href={Astro.site + 'work'}>` pattern works correctly.

**Why it happens:**
Astro does not rewrite `href` attributes in `.astro` templates — it only applies the base to its own routing primitives and built-in components. Hardcoded strings bypass this.

**Consequences:**
- Navigation links (Work, Info, CV) work locally but 404 on GitHub Pages
- Easy to miss in testing because `npm run dev` serves from `/`

**Prevention:**
1. Write all internal links using `import.meta.env.BASE_URL`:
   ```astro
   <a href={`${import.meta.env.BASE_URL}work`}>Work</a>
   ```
2. Or create a helper function `url(path)` that prepends `import.meta.env.BASE_URL`.
3. Alternatively, if the repo is the user root repo (`username.github.io`), no base is needed — links can be written normally. This eliminates the entire pitfall class.

**Detection:**
- Navigation works on `localhost` but 404s on the live site
- Link `href` values in the page source don't include the repo name

**Phase:** Address in Phase 1 (layout scaffold). Establish the `BASE_URL` link pattern before any navigation is built.

---

### Pitfall 8: `output: 'static'` Not Set — Accidental SSR Mode

**What goes wrong:**
Astro defaults to `output: 'static'` in recent versions (4.x+), but some integrations or starters might include a server adapter that changes the output mode. GitHub Pages cannot serve SSR responses; it only serves static files. If an adapter (e.g., `@astrojs/node`) is accidentally installed or configured, the build output is not a static site and deployment silently produces an unusable site.

**Why it happens:**
Copying starter configs or following tutorials that include server rendering, then forgetting to remove the adapter.

**Consequences:**
- `dist/` output contains server entry points instead of `.html` files
- GitHub Pages serves a blank or 404 page because there are no `.html` files to serve

**Prevention:**
1. Explicitly set `output: 'static'` in `astro.config.mjs`:
   ```js
   export default defineConfig({
     output: 'static',
     site: '...',
     base: '...',
   });
   ```
2. Do not install any server adapter (`@astrojs/node`, `@astrojs/vercel`, etc.).
3. After build, verify `dist/index.html` exists.

**Detection:**
- `dist/` folder contains a `server/` directory instead of only `.html` + assets
- No `index.html` in `dist/` root after `npm run build`

**Phase:** Address in Phase 1 (project scaffold).

---

### Pitfall 9: GitHub Pages 404 for Client-Side Routing (SPA-style Navigation)

**What goes wrong:**
If any client-side routing is added (e.g., View Transitions with fallback, or a JavaScript router), navigating directly to a URL like `https://username.github.io/portfolio/work/docker-tool` returns GitHub's generic 404 because GitHub Pages does not know to serve `index.html` for unknown paths — it expects an actual `work/docker-tool/index.html` file.

**Why it happens:**
GitHub Pages is a dumb static file server. It doesn't support the "serve `index.html` for all routes" pattern that SPAs need.

**Consequences:**
- Sharing direct links to case studies returns a 404 page
- Refreshing on any non-root page gives a 404

**Prevention:**
1. Astro generates a real `work/docker-tool/index.html` file for every route in static mode — this is correct behavior. The pitfall is only triggered if client-side routing intercepts navigation and the initial server request doesn't hit an `.html` file.
2. If Astro's View Transitions are used (they are compatible with static output), they work fine because the initial page load hits the real `.html` file; only subsequent navigations are client-side.
3. If a true SPA is needed, the `404.html` trick can be used (copy `index.html` to `404.html`), but this is not needed for Astro static sites.

**Detection:**
- `dist/work/docker-tool/index.html` does NOT exist after build (would mean the route wasn't pre-rendered)
- Direct URL navigation returns GitHub's 404 page

**Phase:** Verify during Phase 1 build output check. Generally not an issue with pure Astro static output.

---

## Minor Pitfalls

---

### Pitfall 10: Trailing Slash Inconsistency

**What goes wrong:**
`/work` and `/work/` are treated as different URLs. GitHub Pages redirects `/work` → `/work/` but Astro may generate links without trailing slashes. This causes unnecessary redirects and can affect Lighthouse scores.

**Prevention:**
Set `trailingSlash: 'always'` or `'never'` in `astro.config.mjs` and be consistent. Astro's default is `'ignore'`.

**Phase:** Phase 1 (config). One-line fix, but must be set before content links are written.

---

### Pitfall 11: Dark Theme Color Not on `<html>` Causes Background Flicker on Scroll

**What goes wrong:**
Setting `background-color` only on `body` means the area outside the body (e.g., overscroll on iOS) flashes white. This is common on dark-themed portfolio sites.

**Prevention:**
```css
html, body {
  background-color: #1e2030;
}
```
Also set `<meta name="theme-color" content="#1e2030">` in `<head>` for mobile browser chrome.

**Phase:** Phase 1 (base layout), when writing the global stylesheet.

---

### Pitfall 12: Missing `404.html` for Custom Error Page

**What goes wrong:**
GitHub Pages supports a custom `404.html` file at the root of the deployed site. Without it, all 404s show GitHub's generic error page, which looks jarring on a design portfolio.

**Prevention:**
Create `src/pages/404.astro`. Astro's static build will output `dist/404.html` automatically. GitHub Pages will use this file.

**Phase:** Phase 2 or Phase 3 (polish). Low priority but easy to include.

---

### Pitfall 13: `npm ci` vs `npm install` in CI — Lockfile Drift

**What goes wrong:**
Using `npm install` in GitHub Actions regenerates `package-lock.json` based on current registry versions, potentially upgrading packages between CI runs. Astro minor versions occasionally introduce breaking changes in output (CSS scoping, asset hashing).

**Prevention:**
Always use `npm ci` in GitHub Actions. Commit `package-lock.json` to the repo.

**Phase:** Phase 1 (GitHub Actions workflow setup).

---

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|-------------|---------------|------------|
| Project scaffold + config | Missing `base` + `site` config | Set both before writing any links; verify with a deploy to a test branch |
| Global layout / dark theme | FOUC on first paint | Set `background-color` on `html` in inline `<style>` or early in CSS load; test on throttled connection |
| Content Collections schema | Schema too strict causes build failures when content is added | Use `.optional()` for non-critical fields; run build after every schema change |
| Case study content authoring | Absolute markdown image paths break on sub-path deploy | Use relative paths or co-locate images; document convention before authoring begins |
| Navigation components | Hardcoded `href="/work"` links 404 in production | Use `import.meta.env.BASE_URL` prefix pattern everywhere |
| GitHub Actions CI/CD | Wrong permissions, wrong source setting, outdated action versions | Follow Astro's official workflow template exactly; set Pages source to "GitHub Actions" |
| Static output mode | Accidental SSR output not deployable to GitHub Pages | Explicitly set `output: 'static'`; verify `dist/index.html` exists post-build |
| Mobile / iOS dark theme | White overscroll flicker | Set `background-color` on `html` element, not just `body`; add `theme-color` meta tag |

---

## Sources

- Astro official GitHub Pages deploy guide: https://docs.astro.build/en/guides/deploy/github/ (HIGH confidence — official docs)
- Astro configuration reference (`site`, `base`, `output`, `trailingSlash`): https://docs.astro.build/en/reference/configuration-reference/ (HIGH confidence — official docs)
- Astro Content Collections docs: https://docs.astro.build/en/guides/content-collections/ (HIGH confidence — official docs)
- Astro `import.meta.env.BASE_URL` behavior: documented in Astro environment variables reference (HIGH confidence)
- GitHub Pages custom domain and 404 behavior: https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-custom-404-page-for-your-github-pages-site (MEDIUM confidence — official docs)
- FOUC prevention pattern (inline script before paint): widely documented community pattern, consistent with browser rendering spec (MEDIUM confidence — training data, multiple sources agree)
- GitHub Actions `id-token: write` requirement for `actions/deploy-pages`: https://github.com/actions/deploy-pages (HIGH confidence — official action README)

**Note on confidence:** Core Astro + GitHub Pages integration behavior (Pitfalls 1, 2, 3, 4, 7, 8) is based on official documentation and is HIGH confidence. Content Collections schema behavior (Pitfall 5, 6) is based on Astro official docs and is HIGH confidence. The training knowledge cutoff is August 2025; Astro may have released updates since then. The `base` URL behavior in particular should be verified against the Astro version pinned in `package.json`.
