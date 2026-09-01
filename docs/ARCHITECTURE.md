# Frontend Architecture

This codebase uses a **feature-first, token-led** architecture. Routes stay thin; features own
product composition; shared layers own repeatable behavior.

## Dependency direction

```text
app/routes → features → components → hooks/lib/config
```

- `app/`: route entrypoints, metadata, global CSS, route-level loading/error boundaries.
- `features/<feature>/`: feature screens, feature components, data, hooks, schemas, actions, and types.
- `components/layout/`: geometry and page composition only—no business meaning.
- `components/ui/`: reusable visual primitives and interaction states.
- `globals.css`: design tokens, themes, typography, and responsive foundations.
- `config/`: environment-aware product configuration.
- `lib/`: small framework-agnostic helpers and infrastructure clients.
- `providers/`: app-wide client contexts, composed once.

Runtime schemas live beside the feature boundary they protect. Data from HTTP,
browser storage, forms, and content systems remains `unknown` until a schema
validates and normalizes it. TypeScript types alone are not runtime validation.

## Design tokens (`src/app/globals.css`)

The file is ordered: `:root` (light tokens, the source of truth) → `.dark`
(only the tokens that change) → `@theme inline` (maps tokens to Tailwind
utilities) → `@layer base` and component classes. Section banners mark each part.

- **One brand red.** The `--primary` oklch scale is the only brand red. Raw CSS
  references `var(--primary)` (or `oklch(from var(--primary) …)` for tints); there
  is no separate `--brand-accent`.
- **`--brand-dark` / `--brand-dark-elevated` / `--brand-light`** are the fixed
  near-black / near-white neutrals for surfaces that never invert (footer,
  cinematic sections).
- **Three font roles only:** `--font-display` (Bricolage Grotesque),
  `--font-sans` (DM Sans), `--font-serif` (Playfair Display, used only by the
  word-level `<Accent>` primitive). Each has a real fallback stack.
- **`src/config/theme.ts`** holds a small flat mirror of a few colours for the
  `<meta name="theme-color">` tags and the `global-error.tsx` crash screen, which
  render with no access to `globals.css`. Keep its `light`/`dark` tracking
  `--background`.
- Components consume semantic utilities (`bg-primary`, `text-muted-foreground`,
  `border-border`), never raw hex/oklch. Add a line to `@theme inline` only when
  a component needs a token as a utility.

## Layout rule

Product screens do not hand-author generic layout `<div>` elements. Use the smallest suitable primitive:

- `Stack`: vertical rhythm
- `Cluster`: wrapping actions, filters, or tags
- `Grid`: responsive card and content grids
- `Container`: bounded horizontal page width and gutters
- `Section`: vertical page bands with semantic tones
- `Center`: two-axis centering
- `Page`: route-level application composition

Raw elements remain correct inside primitive implementations and when the HTML element itself communicates
meaning (`article`, `header`, `nav`, `aside`, `section`). This avoids replacing semantic HTML with abstractions.

## Translating a Figma screen

1. Identify repeated visual values and map them to semantic tokens in `globals.css`.
2. Divide the screen into page sections and choose layout primitives.
3. Reuse or extend a UI primitive for repeated controls and surfaces.
4. Keep feature-specific composition under `features/<feature>`.
5. Keep `app/**/page.tsx` as a thin import of the feature screen.
6. Add variants centrally; do not duplicate long class strings across screens.

## Feature template

```text
features/example/
├── actions/       # server actions
├── api/           # feature request functions
├── components/    # feature-only view components
├── data/          # static content and fixtures
├── hooks/         # feature state and queries
├── schemas/       # validation schemas
├── screens/       # route-level compositions
├── types/         # feature contracts
└── index.ts        # public feature API
```

Create only folders a feature actually needs. Do not introduce empty abstraction layers.

Feature folders are named for their route (`features/blog` → `/blog`,
`features/projects` → `/projects` and `/projects/[slug]`). Screens are named for
what they render (`BlogScreen`, `ArticleScreen`, `ProjectsScreen`,
`ProjectScreen`).

## Where static content lives

There is no shared top-level `src/data/`. Static content for a feature lives in
that feature's own `data/` directory and is re-exported from its `index.ts`. A
value used by exactly one screen may stay inline in that screen; anything read
from more than one place (a list screen and a detail route, `sitemap.ts`) gets a
`data/` file. Types that describe a shared component's props live with that
component, not with the data (for example `FaqItem` lives in
`components/marketing/faq-accordion.tsx`). See `src/features/README.md`.

## Import boundaries

- Prefer `@/` absolute imports.
- Consume a feature through its public `index.ts` from outside that feature.
- Shared components never import from features.
- Server-only code must not be re-exported through a client component barrel.
- Avoid broad `utils` dumping grounds; helpers should have one clear responsibility.

## Server and client rendering

- Components are server components unless they require browser state, effects, or event handlers.
- A client component must produce the same markup during SSR and its first browser render. Browser
  storage, media queries, viewport measurements, dates, and random values are read only after hydration.
- Browser-only infrastructure is marked with `"use client"`; secret-bearing repositories are marked
  with `server-only`. Client modules never import server repositories or environment secrets.
- Theme paint happens in the pre-hydration initializer, while React theme state starts from a stable
  server snapshot and synchronizes after hydration.
- `useId` supplies stable accessible IDs for reusable interactive primitives; hard-coded document IDs
  are reserved for true singletons.

## Managed content boundary

Dynamic page content is loaded in server-only repositories under `features/*/server`. Route files call
the repository and pass a validated domain model into the screen. View components remain prop-driven
and must not import local fixtures, environment variables, CMS SDKs, or request clients.

The homepage repository provides:

- a typed `HomePageContent` domain contract;
- runtime validation for untrusted API responses;
- the site's own shipped content, served by default and kept serving through any CMS outage;
- five-minute server revalidation and a `home-page` cache tag;
- a protected `/api/revalidate` endpoint for CMS publish webhooks.

When adding a CMS, adapt its response inside the repository. Do not reshape CMS records inside React
components. Remote media URLs are rendered without Next's host-bound loader; local assets continue to
use Next Image optimization.

## Quality gates

`npm run check` is the minimum change gate: strict TypeScript, ESLint with zero
warnings, unit tests, and formatting. `make verify` adds the optimized production
build. Tests are colocated with the schema, helper, or component they exercise so
ownership stays clear; avoid a detached top-level test hierarchy.

## Responsive rule

Figma dimensions are desktop reference measurements, never component layout instructions. Components
must use intrinsic flow first, introduce grids at content-driven breakpoints, and reserve absolute
positioning for media overlays where mobile alternatives are explicitly defined. Every feature must be
checked at narrow mobile, wide mobile, tablet, laptop, and desktop widths before completion.
