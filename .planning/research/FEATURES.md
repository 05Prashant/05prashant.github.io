# Feature Landscape

**Domain:** Personal product designer portfolio site
**Researched:** 2026-02-26
**Confidence note:** External search tools unavailable this session. Findings based on training knowledge of designer portfolio conventions (stable domain, well-documented patterns), calibrated to project context: Staff Product Designer, developer tools/AI products, targeting tech companies. Confidence: MEDIUM-HIGH for table stakes (stable conventions); MEDIUM for differentiators (trend-sensitive).

---

## Table Stakes

Features every good product designer portfolio has. Missing = visitors leave or lose confidence.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Work index / homepage listing case studies | Hiring managers land here first; they need to immediately see the work | Low | Two-column grid with images is the current standard; text-only lists feel dated |
| Individual case study pages | The actual interview-prep artifact; every recruiter clicks through | Medium | Must have: problem statement, your role, process, solution, outcome/impact |
| "About" / Info page | Establishes the person behind the work; humanizes the designer | Low | Brief bio, current role, what you care about — not a life story |
| CV / Resume page or PDF link | Recruiters need structured role history, especially at staff level | Low | Either inline HTML or a well-linked PDF; both is better |
| Navigation: site name + primary nav links | Orientation; lets visitors move freely between sections | Low | Standard: name/logo left, Work / About / CV right — matches PROJECT.md spec |
| Mobile responsive layout | 30–50% of portfolio visitors are on mobile; broken mobile = bad signal from a designer | Medium | Particularly important for the work index and case study image presentation |
| Fast initial load (< 2s LCP) | Slow sites signal poor craft awareness; Google PageSpeed score is visible to technical reviewers | Low-Med | Astro static output handles this well; image optimization is the main work |
| Case study hero image | Sets visual tone immediately; every strong portfolio has one | Low | Full-width or large-format; needs to be high quality |
| Your role + company + year on each case study | Context for the work; required for trust | Low | Usually subtitle or metadata line under the title |
| Outcome / impact statement in each case study | "What changed?" is the primary question from staff+ hiring bars | Low | Even one sentence: "Reduced onboarding drop-off by 30%" > beautiful mockups alone |
| Legible typography | Designer's typography IS a portfolio statement | Low | System font stack or one clean web font; dark background needs careful contrast |
| Social / contact link (email or LinkedIn) | Visitors who want to reach out need a path | Low | Footer or Info page; email preferred over a form |
| Consistent visual identity across pages | Signals craft; mismatched pages feel like a draft | Low-Med | Shared layout, color palette, type scale — Astro shared layouts handle this |

---

## Differentiators

Features that set a portfolio apart. Not universally expected, but valued — especially for senior/staff roles targeting tech companies.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Process narrative with decision rationale | Shows design thinking, not just outputs; what staff+ hiring bars actually evaluate | Med | "We considered X, chose Y because Z" sections inside case studies; differentiates from junior portfolios full of only final screens |
| Constraint transparency | Shows real-world problem-solving sophistication | Low | Calling out "what we didn't build and why" or "what I'd do differently" builds credibility with senior reviewers |
| Developer-tools-specific visual language | Signals domain fluency to Docker/dev-tools audiences | Med | Terminal aesthetics, code-adjacent imagery, dark theme — already in PROJECT.md design direction |
| Case study "TL;DR" / summary block | Respects time-poor reviewers; gets key info fast | Low | One-paragraph or 3-bullet summary at the top of each case study; hiring managers often skim first |
| Smooth scroll / page transitions | Demonstrates motion/interaction sensitivity | Med | Subtle, not showy; Astro View Transitions API is a clean fit |
| Keyboard navigation / focus states | Signals accessibility awareness; particularly valued at companies with design systems | Low-Med | Required for senior IC designers; easy to do right from the start |
| Metadata-rich case study headers | Scannable at-a-glance signal of breadth and recency | Low | Tags: discipline (UX Research / Visual Design / Systems), platform (Desktop / CLI / Web) |
| "What I'm thinking about" or current-focus signal | Shows intellectual activity beyond past work | Low | A short line on the Info page: "Currently thinking about AI-native interfaces for developer workflows" — low effort, high signal |
| Password-protected case studies (optional) | Enables sharing NDA work; critical at staff level with unreleased products | Med | Docker work may have NDA constraints; Astro has no built-in auth, but HTTP basic auth via Cloudflare/Netlify or a simple JS hash gate works on GitHub Pages |
| OpenGraph / social share images per case study | Controls how links look when shared in Slack, LinkedIn, or in a recruiter's ATS notes | Low | Static OG images per page; Astro handles meta tags easily |
| Print-friendly CV page | Hiring coordinators print or PDF resumes; CSS print stylesheet ensures fidelity | Low | Often overlooked; trivial to add |
| Subtle loading / image reveal animations | Adds perceived polish; a designer's site is implicitly a design artifact | Med | CSS fade-in on scroll with IntersectionObserver; avoid heavy JS animation libraries |

---

## Anti-Features

Features to explicitly NOT build for this project.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| Blog / writing section | Not requested; adds scope; dilutes focus on case studies; creates maintenance obligation | Keep focus on case studies; if writing matters later, add it as a future phase |
| Contact form | Static site, no backend; forms require a service (Formspree, Netlify Forms, etc.) which adds dependency; email link is sufficient at this scale | Link to email address or LinkedIn on Info page |
| Search | 7 case studies don't need search; adds complexity with no ROI | Good navigation and a short work index is enough |
| CMS UI / admin panel | Adds complexity, cost, auth; markdown-in-repo is the stated workflow | Keep content in markdown; Astro's content collections are designed for this |
| Dark mode toggle | One aesthetic is the brand; toggling undermines the intentional design; dark is correct for the developer tools audience | Commit to dark theme; `prefers-color-scheme` media query can be honored at CSS level without a toggle |
| Scroll-jacking / horizontal scroll | Feels clever, reads as obstruction; hiring managers on tight time budgets will leave | Use standard vertical scroll; let content breathe |
| Splash / loading screen | Adds time before content; signals prioritizing style over function — wrong message for a product designer | Render content immediately; optimize images instead |
| Video background / autoplay media | Performance cost; accessibility issues; wrong tone for a minimal dark site | Use static hero images; Lottie animations only if small and purposeful |
| Comments section | No backend; no audience at portfolio scale to justify it | N/A |
| Photography / personal projects section | Was on old Squarespace site, explicitly out of scope per PROJECT.md | Keep focus sharp |
| Cookie consent banner | Static site with no tracking cookies doesn't need one; adding analytics with cookies creates obligation | Use privacy-respecting analytics (Fathom, Plausible) if any — no cookie consent needed |

---

## Feature Dependencies

```
Navigation → All pages (nav is shared layout; must be built before pages)
Shared layout → Work index, Case study page, Info page, CV page
Image optimization pipeline → Work index (card images), Case study (hero + inline images)
Markdown content collections → Individual case study pages, CV page
Case study TL;DR block → Case study page template (design the template to accommodate)
OG meta tags → Shared layout (add once, inherits everywhere)
Password-protected case studies → Separate from main site flow; implement per-page if needed
Print CSS → CV page (add after base CV layout is done)
Keyboard/focus states → All interactive elements (design system concern; easiest to build right from day one)
```

---

## MVP Recommendation

Prioritize for initial ship:

1. **Work index** — the front door; must be correct
2. **Individual case study pages** (all 7 from PROJECT.md) — the core value
3. **Info page** — humanizes the work
4. **CV page** — complete the recruiter journey
5. **Navigation** (shared layout) — ties everything together
6. **Mobile responsiveness** — non-negotiable for a designer's site
7. **Fast image loading** — Astro's built-in `<Image>` component handles most of this
8. **OpenGraph meta tags** — low effort, high return when links get shared

**Quick wins to add during MVP (low complexity, high signal):**

- Case study TL;DR summary block (template-level change)
- Outcome/impact statement pattern in case study template
- Email link on Info page
- Print-friendly CV CSS

**Defer to post-MVP:**

- Password-protected case studies: Assess whether Docker work needs NDA protection first; add if so
- Subtle scroll animations: Polish pass after content is all in
- Keyboard/accessibility audit: Do as a dedicated pass, not ad-hoc
- `prefers-color-scheme` CSS: Nice-to-have, not blocking

---

## Designer Portfolio Specifics: Targeting Tech Companies

Notes specific to the audience (Docker, developer tools, AI products, senior/staff hiring bars):

**What tech-company hiring committees look for beyond the work itself:**

- Evidence of systems thinking (does the designer think about edge cases, states, platform constraints?)
- Process transparency (not just "here is the final design" — what decisions were made, why, what was cut)
- Collaboration signals (mentions of engineering constraints, PM tradeoffs, research findings)
- Impact framing (metric changes, qualitative improvements, adoption numbers — even rough ones)
- Taste alignment with the company's design culture (a dark minimal site already signals developer-tools taste)

**Common failure modes for staff-level portfolios:**

- Too much visual polish, too little rationale (junior-coded even if the work is senior)
- Case studies with no outcomes ("we shipped it" is not an outcome)
- Generic portfolio aesthetic that could be anyone's (dark minimal with developer imagery is a differentiator here)
- No evidence of leading or influencing (staff roles need team/org impact signals, not just individual contributor work)

---

## Sources

- Training knowledge of designer portfolio conventions (2024-2025): MEDIUM-HIGH confidence for table stakes
- Project context from `.planning/PROJECT.md`: HIGH confidence for project constraints
- External web research: unavailable this session (tool access blocked); findings should be cross-validated against current portfolio critique communities (ADPList, Layers.to, Design Buddies) before treating differentiators as definitive
- Key uncertainty: Animation/transition conventions move quickly; verify current taste in Astro + designer portfolio community before investing in motion design
