---
phase: 01-foundation
plan: 01
subsystem: infra
tags: [astro, github-pages, github-actions, sitemap, static-site]

# Dependency graph
requires: []
provides:
  - "Astro 5 project scaffolded with static output configuration"
  - "GitHub Actions CI/CD pipeline deploying to GitHub Pages on push to main"
  - "Placeholder index page with dark background at prashantkhanchandani.github.io"
  - "Sitemap integration generating sitemap-index.xml at build time"
affects: [02-design-system, 03-content]

# Tech tracking
tech-stack:
  added: [astro@5, "@astrojs/sitemap", sharp]
  patterns: [static-site-generation, github-pages-oidc-deploy, no-adapter-static-output]

key-files:
  created:
    - astro.config.mjs
    - package.json
    - tsconfig.json
    - src/env.d.ts
    - src/pages/index.astro
    - public/favicon.svg
    - public/robots.txt
    - .github/workflows/deploy.yml
    - .gitignore
  modified: []

key-decisions:
  - "No base path configured — repo is prashantkhanchandani.github.io (user root), serves at /"
  - "withastro/action@v5 used for build — handles Node setup, dependency install, and artifact upload"
  - "id-token: write at top-level permissions for OIDC-based GitHub Pages deploy (no personal access token needed)"
  - "output: static — no server adapter, pure static generation"
  - "Scaffolded manually (npm install + file creation) because create-astro interactive CLI cannot run in non-empty directories non-interactively"

patterns-established:
  - "Astro pages use frontmatter section with --- delimiters"
  - "No framework integrations (React, Vue, Tailwind) — plain Astro + CSS only"
  - "All styles inline or in <style> tags until global CSS arrives in Plan 02"

requirements-completed: [FOUND-01]

# Metrics
duration: 7min
completed: 2026-02-27
---

# Phase 1 Plan 01: Foundation — Astro 5 Scaffold and GitHub Pages Pipeline Summary

**Astro 5 static site scaffolded with sitemap, dark placeholder page, and OIDC-based GitHub Actions pipeline targeting GitHub Pages — ready to push live on first commit to main.**

## Performance

- **Duration:** 7 min
- **Started:** 2026-02-27T08:17:55Z
- **Completed:** 2026-02-27T08:25:05Z
- **Tasks:** 2
- **Files modified:** 9 created

## Accomplishments

- Astro 5 project with strict TypeScript, @astrojs/sitemap, and sharp installed into existing git repo
- astro.config.mjs configured with site URL, static output, no base path — confirmed correct for user root GitHub Pages repo
- GitHub Actions workflow using withastro/action@v5 with OIDC authentication (id-token: write) — no PAT required
- Placeholder index.astro with dark background (#1e2030) and "Coming soon." text to prevent white flash before Phase 2 styles
- Build exits 0 locally, dist/index.html and sitemap confirmed present

## Task Commits

Each task was committed atomically:

1. **Task 1: Scaffold Astro 5 project** - `45645d2` (feat)
2. **Task 2: Create GitHub Actions deploy workflow** - `e050731` (feat)

**Plan metadata:** (see final commit below)

## Files Created/Modified

- `astro.config.mjs` - Astro configuration: site URL, static output, sitemap integration, no base path
- `package.json` - Project manifest with Astro 5, @astrojs/sitemap, sharp
- `tsconfig.json` - Extends astro/tsconfigs/strict for strict TypeScript
- `src/env.d.ts` - Astro generated types reference
- `src/pages/index.astro` - Dark placeholder page, will be replaced in Phase 2
- `public/favicon.svg` - Minimal SVG favicon with dark background and "P" initial
- `public/robots.txt` - Allows all crawlers, references sitemap URL
- `.github/workflows/deploy.yml` - CI/CD: build with withastro/action@v5, deploy via actions/deploy-pages@v4
- `.gitignore` - Ignores dist/, .astro/, node_modules/

## Decisions Made

- **No base path:** Confirmed the repo is `prashantkhanchandani.github.io` (user root), not a project page. No `base:` config needed — site serves at `/`.
- **withastro/action@v5:** Handles Node.js version setup, dependency install, Astro build, and Pages artifact upload in a single action step.
- **OIDC auth (id-token: write):** Avoids need for a personal access token in repo secrets. GitHub Actions generates a short-lived token per workflow run.
- **Manual scaffold:** `npm create astro` cannot scaffold into non-empty directories non-interactively. Resolved by manually installing packages and creating all project files from scratch.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Scaffolded manually instead of via create-astro CLI**
- **Found during:** Task 1 (Scaffold Astro 5 project)
- **Issue:** `npm create astro@latest . -- --template empty` fails with "Template empty could not be found". Subsequent attempt with `--template minimal` launched interactive CLI that cannot handle non-empty directories non-interactively.
- **Fix:** Manually installed `astro`, `@astrojs/sitemap`, and `sharp` via npm, then created all required files (package.json, astro.config.mjs, tsconfig.json, src/env.d.ts, src/pages/index.astro, public/) by hand. End result is identical to scaffold output.
- **Files modified:** All project files created manually
- **Verification:** `npm run build` exits 0, `dist/index.html` present
- **Committed in:** 45645d2 (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** Auto-fix necessary due to CLI limitation. End result matches plan specification exactly.

## Issues Encountered

- `create-astro` interactive CLI blocked on non-empty directory. Resolved by manual scaffold — no impact on outcome.
- GitHub repository `prashantkhanchandani.github.io` not found when attempting push. This requires the user to create the repository on GitHub and configure Pages source before the first push triggers deployment.

## User Setup Required

Before the deploy workflow can run, complete these one-time steps:

1. **Create the GitHub repository** at https://github.com/new
   - Repository name: `prashantkhanchandani.github.io`
   - Visibility: Public (required for free GitHub Pages)

2. **Configure GitHub Pages source:**
   - Go to: Repository Settings > Pages > Build and deployment > Source
   - Select: **GitHub Actions** (NOT "Deploy from a branch")
   - This MUST be set before the first push or the deploy step fails

3. **Add remote and push:**
   ```bash
   git remote add origin https://github.com/prashantkhanchandani/prashantkhanchandani.github.io.git
   git push -u origin main
   ```
   (Remote was added locally but push failed — repo needs to be created first)

4. **Verify:** GitHub Actions tab should show a green "Deploy to GitHub Pages" workflow run. Site will be live at https://prashantkhanchandani.github.io within ~2 minutes.

## Next Phase Readiness

- All code is committed and ready — only GitHub repo creation and Pages configuration blocks the live deploy
- Once pushed, Phase 2 (Design System) can begin immediately
- Placeholder dark page prevents white flash between Phase 1 deploy and Phase 2 styles

## Self-Check: PASSED

All created files verified to exist on disk:
- astro.config.mjs: FOUND
- package.json: FOUND
- tsconfig.json: FOUND
- src/env.d.ts: FOUND
- src/pages/index.astro: FOUND
- public/favicon.svg: FOUND
- public/robots.txt: FOUND
- .github/workflows/deploy.yml: FOUND
- .gitignore: FOUND
- dist/index.html: FOUND (build output confirmed)

Commits verified:
- 45645d2 (Task 1: scaffold Astro 5): FOUND
- e050731 (Task 2: GitHub Actions workflow): FOUND

---
*Phase: 01-foundation*
*Completed: 2026-02-27*
