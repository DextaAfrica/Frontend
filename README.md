# Maison Rouge Next.js Template

A production-minded Next.js foundation for building a precise red-and-white product UI.

## Included

- Next.js App Router, React, strict TypeScript, and Tailwind CSS
- Semantic design tokens using perceptually consistent OKLCH colors
- Persistent native light and dark themes with flash-free initialization
- Typed, accessible button and typography primitives
- Layout vocabulary: Stack, Flex, Cluster, Grid, Container, Section, Page, Center, and Sidebar
- Feature-first boundaries with thin route files and explicit public APIs
- Seven responsive routes, metadata defaults, loading UI, 404, segment and global error boundaries
- Native accessible dialog, SVG icon system, mobile navigation, and route/reveal motion
- No third-party UI, icon, class-merging, animation, or theme dependencies
- Centralized site, font, and navigation configuration
- ESLint, Prettier, import aliases, and one-command quality checks

## Start developing

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Commands

```bash
npm run dev          # development server
npm run build        # production build
npm run typecheck    # TypeScript validation
npm run lint         # ESLint validation
npm run format       # format the project
npm run check        # all non-build quality checks
```

## Structure

```text
src/
├── app/            # routes, global styles, metadata, errors
├── components/
│   ├── layout/     # reusable geometry and application shells
│   ├── theme/      # theme controls
│   └── ui/         # reusable design-system primitives
├── config/         # product, navigation, and font configuration
├── design-system/  # typed token contracts
├── features/       # domain-focused screens and feature components
├── hooks/          # reusable React hooks
├── lib/            # framework-agnostic helpers (including cn)
├── providers/      # application-wide React providers
└── types/          # shared TypeScript contracts
```

Global semantic colors and typography are defined in `src/app/globals.css`. Product components
should consume names such as `bg-primary`, `text-muted-foreground`, and `border-border` rather than
hard-coded palette values. This keeps future Figma implementation consistent and inexpensive.

Read [the architecture guide](docs/ARCHITECTURE.md) before adding a feature or translating a Figma screen.
Container deployment and health-check instructions are in [the Docker guide](docs/DOCKER.md).
Pipeline, registry, security, and deployment setup are in [the CI/CD guide](docs/CI-CD.md).

## Routes

- `/` — editorial home
- `/about` — company story and principles
- `/portfolio` — development collection
- `/portfolio/seren-redwood` — flagship development detail
- `/lifestyle` — services, amenities, and living experience
- `/journal` — editorial insights
- `/contact` — enquiry form and native confirmation modal
- `/careers` — disciplines and studio opportunities
- `/privacy`, `/terms`, `/cookies`, `/accessibility` — complete policy destinations
- `/portfolio/[slug]` — statically generated development details
- `/journal/[slug]` — statically generated editorial articles

The native consent manager provides a first-visit cookie banner, optional-category preferences,
persistent local choices, cross-tab synchronization, and a footer control for reopening settings.

The newsletter lifecycle waits until cookie consent is resolved, opens after meaningful engagement,
persists dismissal/subscription state, and posts through the internal `/api/newsletter` integration boundary.
Configure `NEWSLETTER_WEBHOOK_URL` (and, when required, `NEWSLETTER_WEBHOOK_TOKEN`) to deliver
validated subscriptions to the production email or CRM service. The server does not expose those credentials
to the browser.
