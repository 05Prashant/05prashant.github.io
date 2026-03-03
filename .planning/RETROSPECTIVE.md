# Retrospective: Prashant Khanchandani Portfolio

---

## Milestone: v1.0 — MVP

**Shipped:** 2026-03-03
**Phases:** 3 | **Plans:** 10 | **Tasks:** 19
**Timeline:** 5 days (2026-02-26 → 2026-03-03)

### What Was Built

- **Phase 1 (Foundation):** Astro 5 scaffold → GitHub Actions CI/CD → dark theme + nav → live on GitHub Pages. Verified on real deployed URL before any content work.
- **Phase 2 (Templates):** Content Collections schema with Zod + `image()` validation; work index with two-column image cards; dynamic `/work/[id]` case study pages; CV markdown layout; custom 404. Zero-code content pipeline locked in.
- **Phase 3 (Content):** 7 case studies in place — booking-checkout and kitchen-notebook with full content (scraped from Squarespace), chatbot + cleartrip-local as structured stubs, 3 Docker stubs with placeholder images. Build passes, site is live.

### What Worked

- **Deploy-first sequencing** — validating the GitHub Pages pipeline in Phase 1 before writing any content or templates was the right call. Found and fixed OIDC permission issues with zero content at stake.
- **Schema-before-content discipline** — locking Content Collections schema in Phase 2 meant Phase 3 was pure content work with zero debugging of template code. Clean separation.
- **Placeholder images via sharp** — using `sharp` to generate `#1e2030` placeholder JPEGs was fast and unblocking. The pattern is reusable for any future case study where real images aren't immediately available.
- **`draft: false` for all stubs** — all 7 case studies appear on the work index from day one. The site looks complete even with placeholder content, which matters for sharing with hiring managers.
- **Parallel Wave 1 execution** — running plans 03-01 (Docker images) and 03-02 (case study content) in parallel shaved real time since the file sets were completely independent.

### What Was Inefficient

- **Verification skipped for Phase 3** — the verifier hit an API rate limit and was not retried successfully. Phase 3 proceeded without a formal VERIFICATION.md. The build passes and all success criteria are met, but the gap should be closed before the next milestone.
- **Chatbot and Cleartrip content** — both case studies are behind Medium's login wall and couldn't be retrieved programmatically. This was discoverable earlier (during research) but wasn't surfaced as a blocker until execution. Next milestone should treat these as "Prashant-authored" tasks with explicit handoff.
- **booking-checkout year uncertainty** — the stub had 2022, Squarespace showed ~2020. Small thing, but worth confirming with Prashant to avoid publishing incorrect metadata.

### Patterns Established

- **Content Collections pattern:** `schema: ({ image }) => z.object({...})` for `image()` helper; relative paths `../../assets/work/{slug}/`; `entry.id` (not `entry.slug`) for Astro 5 URL generation
- **Placeholder image generation:** `sharp` CommonJS require (not ESM import) in temporary scripts; `{ r, g, b }` from CSS hex for background color
- **FOUC prevention:** `html, body { background-color: var(--color-bg); }` — not just `body`
- **GitHub Pages OIDC:** `id-token: write`, `pages: write`, `contents: read` in workflow permissions

### Key Lessons

1. **Validate the deploy pipeline first, always** — catching infra issues before content investment saves rework
2. **Scrapeability is a content dependency** — check source URL accessibility during research, not during execution
3. **Placeholder images should match site background** — `#1e2030` placeholders look intentional, not broken
4. **Astro 5 has breaking API differences from Astro 4** — `render()` is now a standalone import, `entry.id` not `entry.slug`, schema must be a function for `image()`. Document these in RESEARCH.md for future phases.

### Cost Observations

- Model mix: 100% sonnet (all agents)
- Sessions: ~3 sessions (plan-phase, execute-phase, complete-milestone)
- Notable: Parallel Wave 1 execution reduced wall-clock time significantly; verifier rate-limited on first attempt

---

## Cross-Milestone Trends

| Metric | v1.0 |
|--------|------|
| Phases | 3 |
| Plans | 10 |
| Tasks | 19 |
| Timeline (days) | 5 |
| Files changed | 74 |
| Lines added | 13,842 |
| Verifications passed | Phase 1 ✓, Phase 2 ✓, Phase 3 (skipped — rate limit) |
