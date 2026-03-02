# Phase 3: Content - Research

**Researched:** 2026-03-02
**Domain:** Markdown content authoring for Astro 5 Content Collections — case study text, image assets, frontmatter
**Confidence:** HIGH

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| CONT-01 | Port four case studies from Squarespace into markdown files: Booking.com checkout, Kitchen Notebook, Booking.com chatbot, Cleartrip Local | Two case studies have full Squarespace pages (`/attractions`, `/kitchen-notes`); two have Medium articles as source. All four become `.md` files in `src/content/work/` with real content replacing the placeholder stub. |
| CONT-02 | Create placeholder markdown stubs for three Docker case studies (onboarding, notifications, CLI) so the work index is populated — Prashant fills in content | Stub `.md` files follow the existing `booking-checkout.md` pattern with `draft: false` so they appear in the index, plus placeholder images in `src/assets/work/{slug}/`. The schema already accommodates stubs — no code changes needed. |
</phase_requirements>

---

## Summary

Phase 3 is a content-only phase — the Astro infrastructure is fully built and verified. The work index, case study detail pages, Content Collections schema, and image optimization pipeline are all complete from Phase 2. Phase 3's entire scope is creating `.md` files in `src/content/work/` and placing corresponding images in `src/assets/work/{slug}/`. No code changes to templates, layouts, or configuration are expected or needed.

The four case studies to port from Squarespace have different content availability levels. The Booking.com checkout (`/attractions`) and Kitchen Notebook (`/kitchen-notes`) have dedicated Squarespace pages with retrievable text content. The Booking.com chatbot case study and Cleartrip Local case study exist only as external Medium articles, which are behind Medium's login wall and cannot be retrieved programmatically. Prashant will need to manually supply content for those two, either from the Medium articles or from memory, since the articles' text is the only known source.

The three Docker case studies (onboarding, notifications, CLI) are being added as stubs — the `draft: false` pattern ensures they appear on the work index, while the `order` field controls their position. Images for stubs will be placeholder files matching the existing pattern established in Phase 2 Plan 02-01 (where `sharp` was used to generate minimal valid JPEG placeholders). Prashant's plan is to fill in Docker content later, making stub quality a low priority — the goal is index presence, not case study completeness.

**Primary recommendation:** Create each `.md` file by populating real frontmatter (title, company, year, description, order, heroImage, cardImage, cardImageSecondary) and writing content sections (About + process narrative). For the two Squarespace-sourced case studies, use the scraped text as a starting point. For chatbot and Cleartrip Local, provide structured section headers with placeholder text that Prashant can fill in — clearly marked as needing his input.

---

## Standard Stack

No new libraries are required. Phase 3 uses the same stack as Phase 2.

### Core (already installed)

| Component | Version | Purpose | Why Standard |
|-----------|---------|---------|--------------|
| Astro Content Collections | built-in (Astro 5) | Schema-validated markdown; `glob` loader auto-discovers new `.md` files | Already established in Phase 2; adding new files is the entire workflow |
| `astro:assets` `<Image>` | built-in (Astro 5) | Optimized rendering of `heroImage`, `cardImage`, `cardImageSecondary` from frontmatter | Already wired in `[id].astro` and `index.astro` — no changes needed |
| `sharp` | `^0.33.x` (installed) | Build-time image processing and format conversion | Required by `astro:assets`; already installed; used in Phase 2 to generate placeholder JPEGs |

### No New Installs Required

```bash
# No npm install needed for Phase 3
# All infrastructure exists from Phase 1 and Phase 2
```

---

## Architecture Patterns

### File Structure for Phase 3

```
src/
├── assets/
│   └── work/
│       ├── booking-checkout/          # ALREADY EXISTS (3 images: hero, card-main, card-secondary)
│       ├── kitchen-notebook/          # NEW — create with hero.jpg, card-main.jpg, card-secondary.jpg
│       ├── booking-chatbot/           # NEW — create with hero.jpg, card-main.jpg, card-secondary.jpg
│       ├── cleartrip-local/           # NEW — create with hero.jpg, card-main.jpg, card-secondary.jpg
│       ├── docker-onboarding/         # NEW stub — placeholder images only
│       ├── docker-notifications/      # NEW stub — placeholder images only
│       └── docker-cli/               # NEW stub — placeholder images only
└── content/
    └── work/
        ├── booking-checkout.md        # ALREADY EXISTS — replace placeholder body with real content
        ├── kitchen-notebook.md        # NEW — full content from Squarespace /kitchen-notes
        ├── booking-chatbot.md         # NEW — sections with placeholder text for Prashant to fill
        ├── cleartrip-local.md         # NEW — sections with placeholder text for Prashant to fill
        ├── docker-onboarding.md       # NEW stub — title, company, year, description only
        ├── docker-notifications.md    # NEW stub — title, company, year, description only
        └── docker-cli.md             # NEW stub — title, company, year, description only
```

### Pattern 1: Full Case Study Markdown File

**What:** A complete case study with real content — frontmatter + About section + process narrative.
**When to use:** Booking.com checkout, Kitchen Notebook (and eventually chatbot + Cleartrip Local once Prashant provides content).

```markdown
---
title: "Overhauling a checkout experience"
company: "Booking.com"
year: 2022
description: "End-to-end redesign of the Booking.com attractions checkout flow."
heroImage: "../../assets/work/booking-checkout/hero.jpg"
cardImage: "../../assets/work/booking-checkout/card-main.jpg"
cardImageSecondary: "../../assets/work/booking-checkout/card-secondary.jpg"
order: 1
draft: false
---

## About

[1-3 paragraph project overview: role, team, platform, goal]

## The Challenge

[What was wrong with the existing experience]

## Approach

[How the team tackled it — research, prototyping, testing]

## The Solution

[What shipped and why it worked]
```

**Key constraint:** `heroImage`, `cardImage`, `cardImageSecondary` paths are resolved **relative to the markdown file**. From `src/content/work/booking-checkout.md`, the path `../../assets/work/booking-checkout/hero.jpg` resolves to `src/assets/work/booking-checkout/hero.jpg`. This pattern is established and tested.

### Pattern 2: Stub Case Study (Docker)

**What:** Minimal markdown file with real frontmatter metadata but a short placeholder body — appears on the work index with a linked card.
**When to use:** Docker onboarding, Docker notifications, Docker CLI.

```markdown
---
title: "Introducing developers to a new tool"
company: "Docker"
year: 2024
description: "Onboarding experience redesign for Docker Desktop."
heroImage: "../../assets/work/docker-onboarding/hero.jpg"
cardImage: "../../assets/work/docker-onboarding/card-main.jpg"
order: 5
draft: false
---

## About

Case study coming soon.
```

**Note on `draft: false` for stubs:** The requirements explicitly state Docker stubs should "appear on the work index." Setting `draft: false` achieves this. Setting `draft: true` would hide them from both the work index and the generated `/work/[id]` page. Since the goal is index presence, keep `draft: false`.

### Pattern 3: Image Asset Requirements

**What:** Each case study directory in `src/assets/work/{slug}/` needs at minimum a `card-main.jpg` (required by schema) and `hero.jpg` (required by schema). `card-secondary.jpg` is optional in the schema.

**For full case studies (4 ported ones):** Prashant provides real screenshots from Squarespace or design files. Suggested dimensions: hero ~1600x900px, card-main ~800x600px, card-secondary ~400x600px.

**For stubs (3 Docker):** Placeholder JPEG files that satisfy the `image()` schema validation. The Phase 2 pattern used `sharp` to generate minimal valid JPEGs when real images were not available. This same approach applies.

```javascript
// Pattern used in Phase 2 (02-01) to generate placeholder images
// Run once per stub directory
const sharp = require('sharp');
await sharp({
  create: { width: 800, height: 600, channels: 3, background: { r: 30, g: 32, b: 48 } }
}).jpeg().toFile('src/assets/work/docker-onboarding/hero.jpg');
```

**Critical:** The `image()` schema helper validates image paths at build time. If any `heroImage` or `cardImage` path in frontmatter does not resolve to an actual file in `src/`, the build fails. Stubs MUST have placeholder image files.

### Pattern 4: Ordering Case Studies

The `order` field controls the sequence on the work index. Based on the requirements, the seven case studies appear in this order:

| Order | Slug | Title | Company | Status |
|-------|------|-------|---------|--------|
| 1 | `booking-checkout` | Overhauling a checkout experience | Booking.com | Stub exists — update content |
| 2 | `kitchen-notebook` | Redesigning the Kitchen Notebook | Self | New file |
| 3 | `booking-chatbot` | Chatbot and conversational interface research | Booking.com | New file |
| 4 | `cleartrip-local` | Cleartrip Local events discovery | Cleartrip | New file |
| 5 | `docker-onboarding` | Introducing developers to a new tool | Docker | New stub |
| 6 | `docker-notifications` | A notification system for Docker Desktop | Docker | New stub |
| 7 | `docker-cli` | Command line tool to get started | Docker | New stub |

### Anti-Patterns to Avoid

- **Omitting `heroImage` or `cardImage` for any entry (including stubs):** These fields are required in the Zod schema (`image()` not `.optional()`). Missing either causes a build failure with a cryptic Zod error. Either provide real images or placeholder files — the schema does not care which.
- **Using `public/` for case study images:** Images in `public/` are served as-is, not processed by `astro:assets`. The `image()` schema helper explicitly requires images in `src/` (or co-located). A path like `../../public/...` in frontmatter will cause a build error.
- **Setting `draft: true` for Docker stubs if you want them on the index:** The draft filter `getCollection('work', ({ data }) => !data.draft)` in `index.astro` excludes draft entries. Docker stubs must have `draft: false` to appear on the work index.
- **Adding `cardImageSecondary` to stub frontmatter without the file:** The field is `optional()` in the schema, so omitting it is valid. If you include it in frontmatter, the file must exist.
- **Nested image directories:** Do not create subdirectories like `src/assets/work/booking-checkout/process/hero.jpg`. Keep all images for a case study flat in `src/assets/work/{slug}/` to keep paths simple and consistent.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Image optimization for case study screenshots | Manual WebP conversion, shell scripts, custom sizing | `astro:assets` `<Image>` via the `image()` schema helper | Already wired in Phase 2; Astro handles WebP, lazy loading, `width`/`height` inference automatically at build time |
| Placeholder image generation for stubs | Empty files, corrupt JPEGs, HTML placeholders | `sharp` one-liner to create minimal valid JPEG | Phase 2 already solved this pattern — `sharp` is installed; a corrupt/empty file fails `astro:assets` validation |
| Markdown-to-HTML rendering for case study body | Custom renderer, Remark plugins, string manipulation | Astro's built-in markdown rendering via `render(entry)` in `[id].astro` | Already implemented in Phase 2; `<Content />` renders any valid markdown |
| Work index ordering | Database, alphabetical sort, manual HTML | `order: N` frontmatter field + `.sort((a, b) => a.data.order - b.data.order)` in `index.astro` | Already implemented in Phase 2; just set the correct `order` number in each new file |

**Key insight:** Phase 3 has zero new infrastructure problems. Every technical challenge was solved in Phase 2. The only work is content authoring and image placement.

---

## Common Pitfalls

### Pitfall 1: Missing Image Files Cause Build Failure

**What goes wrong:** The Astro build throws a cryptic error like "Could not find asset" or Zod validation fails on `image()` fields when no file exists at the frontmatter-specified path.
**Why it happens:** The `image()` schema helper verifies that the referenced file exists and is a valid image at build time. It is not lazy — there is no "image not found" fallback.
**How to avoid:** Before running `npm run build`, confirm every file path in every frontmatter `heroImage` and `cardImage` field resolves to an actual file. For stubs, create `sharp`-generated placeholder JPEGs before writing the frontmatter.
**Warning signs:** Build error mentioning `Could not find asset` or Zod error mentioning `heroImage` or `cardImage` being invalid.

### Pitfall 2: Chatbot and Cleartrip Local Source Content is Behind Medium's Login

**What goes wrong:** Expecting to scrape content from the Medium articles linked on the Squarespace portfolio page fails because Medium requires login for full article access.
**Why it happens:** `https://booking.design/...` redirects to Medium, and `https://medium.com/cleartrip/live-the-local-life-cded8076c898` returns 403. Neither article is publicly accessible without a Medium account.
**How to avoid:** For these two case studies, the planner should structure tasks so Prashant manually provides the content (or the implementer writes placeholder sections with clear `<!-- TODO: Prashant to fill in -->` markers). Do not block phase completion on scraping these articles.
**Warning signs:** 403 or redirect-to-login errors when fetching the chatbot or Cleartrip Medium articles.

### Pitfall 3: `booking-checkout.md` Body Content is a Placeholder — Must Be Replaced

**What goes wrong:** The existing `booking-checkout.md` has `draft: false` and appears in the work index, but its body says "Placeholder content — full case study content arrives in Phase 3." A hiring manager visiting `/work/booking-checkout` sees this stub text.
**Why it happens:** Phase 2 created the stub intentionally as a schema test, not as real content.
**How to avoid:** CONT-01 explicitly covers porting the Booking.com checkout case study. The body of `booking-checkout.md` must be replaced with real content in Phase 3. Do not skip this file just because it already exists.
**Warning signs:** Checking the Phase 3 work index shows "booking-checkout" as a card, but the detail page still shows placeholder text.

### Pitfall 4: Squarespace URL Slugs Differ from Expected

**What goes wrong:** Assuming case study URLs are at `/work/checkout` or `/work/chatbot` when navigating the Squarespace site — 404 errors.
**Why it happens:** The Squarespace site uses non-obvious slugs: `/attractions` (not `/checkout`), `/kitchen-notes` (not `/kitchen-notebook`). The chatbot and Cleartrip Local case studies have no dedicated Squarespace pages at all — only external Medium links.
**How to avoid:** The two accessible Squarespace case study pages are at exactly these URLs:
  - Booking.com checkout: `https://www.prashant-khanchandani.info/attractions`
  - Kitchen Notebook: `https://www.prashant-khanchandani.info/kitchen-notes`
  The chatbot and Cleartrip Local pages do not exist on Squarespace.
**Warning signs:** 404 when trying to fetch `/chatbot`, `/cleartrip-local`, `/local-events`, etc.

### Pitfall 5: Image `alt` Text for Card Images

**What goes wrong:** Decorative secondary card images (`cardImageSecondary`) need appropriate `alt` attributes. In `index.astro`, the secondary image currently uses `alt=""` — this is correct for decorative images per accessibility guidelines.
**Why it happens:** `cardImageSecondary` was designed as a tinted/decorative panel — not an informational image. Using `alt=""` signals to screen readers that the image is presentational.
**How to avoid:** Keep `alt=""` for `cardImageSecondary` in the work index. Use the case study title as `alt` text for `cardImage`. Use the case study title as `alt` text for `heroImage` in `[id].astro`.
**Warning signs:** Accessibility audit flagging missing or redundant alt text on card images.

---

## Code Examples

Verified patterns from Phase 2 research and existing codebase:

### Complete Frontmatter for a Full Case Study

```markdown
---
title: "Redesigning the Kitchen Notebook"
company: "Self"
year: 2019
description: "A personal project to create a better recipe recording and sharing app."
heroImage: "../../assets/work/kitchen-notebook/hero.jpg"
cardImage: "../../assets/work/kitchen-notebook/card-main.jpg"
cardImageSecondary: "../../assets/work/kitchen-notebook/card-secondary.jpg"
order: 2
draft: false
---
```

### Complete Frontmatter for a Docker Stub (no `cardImageSecondary`)

```markdown
---
title: "Introducing developers to a new tool"
company: "Docker"
year: 2024
description: "Redesigning the onboarding experience for Docker Desktop."
heroImage: "../../assets/work/docker-onboarding/hero.jpg"
cardImage: "../../assets/work/docker-onboarding/card-main.jpg"
order: 5
draft: false
---

## About

Case study coming soon.
```

### Generating Placeholder Images with sharp (for Docker stubs)

```javascript
// Run from project root: node scripts/gen-placeholder.js
// Or use npx with inline code
// sharp is already installed as a dev dependency
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const slugs = ['docker-onboarding', 'docker-notifications', 'docker-cli'];
const color = { r: 30, g: 32, b: 48 }; // matches --color-bg: #1e2030

for (const slug of slugs) {
  const dir = `src/assets/work/${slug}`;
  fs.mkdirSync(dir, { recursive: true });

  sharp({ create: { width: 1600, height: 900, channels: 3, background: color } })
    .jpeg({ quality: 80 })
    .toFile(path.join(dir, 'hero.jpg'));

  sharp({ create: { width: 800, height: 600, channels: 3, background: color } })
    .jpeg({ quality: 80 })
    .toFile(path.join(dir, 'card-main.jpg'));
}
```

### Checking the Build Produces 7 Work Pages

```bash
# After adding all 7 case study files, build and verify page count
npm run build
# Expected output should include lines like:
# /work/booking-checkout  [slug]
# /work/kitchen-notebook  [slug]
# /work/booking-chatbot   [slug]
# /work/cleartrip-local   [slug]
# /work/docker-onboarding [slug]
# /work/docker-notifications [slug]
# /work/docker-cli        [slug]
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Manually writing `<article>` HTML per case study | Markdown `.md` files with frontmatter | Phase 2 complete | Adding content = creating one file; no code changes ever needed |
| Images in `public/` (no optimization) | Images in `src/assets/work/` with `image()` schema helper | Phase 2 complete | WebP conversion, lazy loading, and CLS prevention automatic at build time |
| Individual Astro pages per case study | `getStaticPaths` + glob loader generating all pages | Phase 2 complete | Zero-code page registration; Phase 3 is purely file creation |

**No deprecated patterns apply to Phase 3.** All Astro 5 APIs (`entry.id`, standalone `render()`, glob loader) were established in Phase 2 and are stable for this phase.

---

## Content Availability Summary

This is the most important domain-specific finding for planning.

| Case Study | Source | Content Available | Images Available |
|------------|--------|-------------------|-----------------|
| Booking.com checkout | Squarespace `/attractions` | YES — scraped text available (About, Research, Solution, A/B Testing, Final Product) | Prashant must provide real screenshots |
| Kitchen Notebook | Squarespace `/kitchen-notes` | YES — scraped text available (About, Problems, Competitive Analysis, Explorations, Prototype) | Prashant must provide real screenshots |
| Booking.com chatbot | Medium article (login required) | PARTIAL — title and description only; full article text not retrievable without login | Prashant must provide both content and images |
| Cleartrip Local | Medium article (403 Forbidden) | PARTIAL — title and description only; full article text not retrievable | Prashant must provide both content and images |
| Docker onboarding | Not yet written | Stub only | Placeholder images generated by script |
| Docker notifications | Not yet written | Stub only | Placeholder images generated by script |
| Docker CLI | Not yet written | Stub only | Placeholder images generated by script |

**Implication for planning:** Tasks for the chatbot and Cleartrip Local case studies should be structured as "write structured section headers with placeholder text" rather than "port content from source." The task description should clearly indicate that Prashant needs to fill in the actual narrative content, either from the Medium articles (which he can access while logged in) or from memory.

---

## Scraped Content Reference

### Booking.com Checkout (`/attractions`)

Available for use directly in `booking-checkout.md`:

- **About:** Worked as sole UX designer on Booking.com's Attractions team (tours and activities). Redesigned checkout across desktop web, mobile web, and Booking.com app web views. Role included UX design, user research, prototyping, quantitative analysis, and A/B testing. Team: copywriter, four developers, a researcher, and a project manager.
- **Research:** Conducted usability studies and quantitative analysis with researcher Yaniv. Critical issues: complexity in date/time/ticket selection, confusing interface design, excessive validation errors during checkout.
- **Solution Exploration:** Restructuring date/time/ticket selection at top of checkout flow for maximum impact. Multiple interaction approaches explored via sketching and Figma. Bi-weekly design reviews.
- **User Research:** Testing on usertesting.com evaluated two approaches: (1) splitting flow into three distinct steps, (2) integrating ticket selection into the details page to show pricing upfront. Both tested against existing design as control.
- **A/B Testing:** Hypothesis: combining ticket selection with checkout created excessive validation errors. Test: split into separate steps. Results: fewer users reaching checkout, reduced validation errors among those who did, maintained conversion rates.
- **Final Product:** Simplified flow, decreased validation errors, elevated ticket pricing visibility earlier in funnel. Design provides scalability for distinguishing ticket differentiators and price/availability comparison.

### Kitchen Notebook (`/kitchen-notes`)

Available for use directly in `kitchen-notebook.md`:

- **About:** Personal project. Creator spends time learning and refining recipes, typically documented on paper. Vision: tool enabling recipe capture during cooking, easy reading and sharing with others.
- **Problems:** (1) Recording and updating recipes: cooking involves multitasking with busy hands; notes completed later often omit ingredients or steps; goal was to simplify capturing texture and color during the process. (2) Sharing recipes: requests are common, but sharing via links/images/messages was cumbersome.
- **Competitive Analysis:** Examined KitchenStories, CookPad, Jumprope (instructional video creation), and Instagram. Created recipes across platforms to document strengths and limitations.
- **Explorations:** Initial mockups focused on efficient recipe creation flow — straightforward, transparent, effective at capturing comprehensive details. Iterated based on feedback from friends and family.
- **Prototype:** Static mockups made it difficult to visualise the solution. Developed a functional prototype to test core functionality in real-world scenarios. Testing revealed previously overlooked challenges (e.g., typing with wet hands). Prototype-driven approach identified critical issues before final design refinement.

---

## Open Questions

1. **What year should booking-checkout.md use?**
   - What we know: The existing stub has `year: 2022`. The Squarespace site shows `year: 2020` for the checkout case study.
   - What's unclear: Which year is correct — when the project ran or when the case study was written?
   - Recommendation: Prashant should confirm; update the `year` field in the existing stub file accordingly.

2. **Should chatbot and Cleartrip Local case studies be `draft: true` until content is ready?**
   - What we know: CONT-01 requires four ported case studies with "full content including hero image, about section, and process narrative." CONT-02 requires Docker stubs. The chatbot and Cleartrip Local content requires Prashant's input.
   - What's unclear: Should they appear on the index with placeholder sections, or be hidden as drafts until Prashant fills them in?
   - Recommendation: Match what CONT-01 says — "full content including hero image, about section, and process narrative." Plan tasks so the implementer writes structured section headers with `<!-- TODO: fill in -->` markers, and Prashant fills them in as part of Phase 3 completion. Keep `draft: false` so they appear on the index.

3. **What images does Prashant have available for the four ported case studies?**
   - What we know: Real case study screenshots exist on the Squarespace site but cannot be scraped programmatically (Squarespace serves images via JavaScript). Prashant has access to his Figma files and previous design assets.
   - What's unclear: Whether Prashant has the images ready, or whether placeholder images should be used for now.
   - Recommendation: Tasks should explicitly call for Prashant to provide real images. If images are not available, fall back to the Phase 2 `sharp` placeholder pattern but note this in the task.

4. **Docker case study years?**
   - What we know: The requirements say "Docker" and "Docker Desktop" but don't specify years.
   - What's unclear: Exact year for each Docker project (onboarding, notifications, CLI).
   - Recommendation: Use Prashant's employment dates as a guide (Docker 2022–present per LinkedIn). Planner can stub with `year: 2023` or `year: 2024` — Prashant can update the frontmatter later with correct years.

---

## Sources

### Primary (HIGH confidence)

- Existing codebase: `src/content.config.ts` — schema definition, field names, field types, `image()` helper pattern
- Existing codebase: `src/content/work/booking-checkout.md` — confirmed frontmatter format and image path pattern
- Existing codebase: `src/pages/work/[id].astro` — confirmed how content is rendered; `<Content />` renders any valid markdown
- Existing codebase: `src/pages/index.astro` — confirmed `draft: false` required for work index visibility
- Phase 2 RESEARCH.md and VERIFICATION.md — confirmed all infrastructure patterns, decisions, and verified behavior

### Secondary (MEDIUM confidence)

- `https://www.prashant-khanchandani.info/attractions` — Booking.com checkout case study text (scraped 2026-03-02; Squarespace page publicly accessible)
- `https://www.prashant-khanchandani.info/kitchen-notes` — Kitchen Notebook case study text (scraped 2026-03-02; Squarespace page publicly accessible)
- `https://www.prashant-khanchandani.info/design` — Work index page on Squarespace; confirmed which case studies exist and their titles/years

### Tertiary (LOW confidence)

- `https://booking.design/prototyping-booking-coms-chatbot-for-better-conversations-4f080ad27d8d` — Chatbot article; redirects to Medium login. Content NOT accessible. Title confirmed: "Prototyping Booking.com's chatbot for better conversations."
- `https://medium.com/cleartrip/live-the-local-life-cded8076c898` — Cleartrip Local article; 403 Forbidden. Content NOT accessible. Title known from Squarespace link text: "Live the Local Life."

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — no new libraries; all infrastructure verified in Phase 2
- Architecture: HIGH — file patterns, image paths, frontmatter schema all confirmed from existing codebase
- Content availability: HIGH — source availability verified by direct URL fetching (2026-03-02)
- Pitfalls: HIGH — all pitfalls derived from Phase 2 decisions log and verified codebase behavior

**Research date:** 2026-03-02
**Valid until:** 2026-04-02 (30 days; Content Collections API is stable in Astro 5; Squarespace site may change)
