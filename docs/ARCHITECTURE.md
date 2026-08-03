# Frontend Architecture

This codebase uses a **feature-first, design-system-led** architecture. Routes stay thin; features own
product composition; shared layers own repeatable behavior.

## Dependency direction

```text
app/routes → features → components → hooks/lib/design-system
```

- `app/`: route entrypoints, metadata, global CSS, route-level loading/error boundaries.
- `features/<feature>/`: feature screens, feature components, data, hooks, schemas, actions, and types.
- `components/layout/`: geometry and page composition only—no business meaning.
- `components/ui/`: reusable visual primitives and interaction states.
- `design-system/`: framework-independent token names and design contracts.
- `config/`: environment-aware product configuration.
- `lib/`: small framework-agnostic helpers and infrastructure clients.
- `providers/`: app-wide client contexts, composed once.

## Layout rule

Product screens do not hand-author generic layout `<div>` elements. Use the smallest suitable primitive:

- `Stack`: vertical rhythm
- `Flex`: controlled one-dimensional alignment
- `Cluster`: wrapping actions, filters, or tags
- `Grid`: responsive card and content grids
- `Container`: bounded horizontal page width and gutters
- `Section`: vertical page bands with semantic tones
- `Center`: two-axis centering
- `Page`, `PageHeader`, `PageContent`: application page composition
- `SidebarLayout`, `Sidebar`, `SidebarContent`: dashboard shells
- `Box`: an exceptional neutral boundary when no more semantic primitive applies

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

## Import boundaries

- Prefer `@/` absolute imports.
- Consume a feature through its public `index.ts` from outside that feature.
- Shared components never import from features.
- Server-only code must not be re-exported through a client component barrel.
- Avoid broad `utils` dumping grounds; helpers should have one clear responsibility.

## Managed content boundary

Dynamic page content is loaded in server-only repositories under `features/*/server`. Route files call
the repository and pass a validated domain model into the screen. View components remain prop-driven
and must not import local fixtures, environment variables, CMS SDKs, or request clients.

The homepage repository provides:

- a typed `HomePageContent` domain contract;
- runtime validation for untrusted API responses;
- a deterministic local fallback for development and upstream outages;
- five-minute server revalidation and a `home-page` cache tag;
- a protected `/api/revalidate` endpoint for CMS publish webhooks.

When adding a CMS, adapt its response inside the repository. Do not reshape CMS records inside React
components. Remote media URLs are rendered without Next's host-bound loader; local assets continue to
use Next Image optimization.

## Responsive rule

Figma dimensions are desktop reference measurements, never component layout instructions. Components
must use intrinsic flow first, introduce grids at content-driven breakpoints, and reserve absolute
positioning for media overlays where mobile alternatives are explicitly defined. Every feature must be
checked at narrow mobile, wide mobile, tablet, laptop, and desktop widths before completion.
