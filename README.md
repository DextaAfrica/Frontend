# Dexta Africa Web Platform

A production-grade, responsive real-estate platform built with Next.js, React, strict TypeScript,
Tailwind CSS, and a feature-first architecture.

## Included

- Next.js App Router, React, strict TypeScript, and Tailwind CSS
- Semantic Dexta design tokens with complete light and dark themes
- Persistent native light and dark themes with flash-free initialization
- Typed, accessible button and typography primitives
- Focused layout vocabulary: Stack, Cluster, Grid, Container, Section, Page, and Center
- Feature-first boundaries with thin route files and explicit public APIs
- Responsive routes, metadata defaults, loading UI, 404, segment and global error boundaries
- Native accessible dialog, SVG icon system, mobile navigation, and route/reveal motion
- Server-side managed-content boundary with validation, caching, revalidation, and a shipped content default
- Responsive image delivery and dedicated desktop/mobile hero media
- Functional enquiry, newsletter, consent, health-check, and content-revalidation boundaries
- Centralized site and navigation configuration
- Runtime schemas, colocated unit tests, ESLint, Prettier, and one-command quality checks

## Start developing

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

`npm install` also enables the repository's git hooks (`.githooks/`): a fast
`pre-commit` (formatting + lint) and a full `pre-push` (typecheck, tests, and a
production build of every route). Run `make hooks` to enable them by hand, or set
`SKIP_HOOKS=1` for a one-off emergency bypass.

## Commands

```bash
npm run dev          # development server
npm run build        # production build
npm run typecheck    # TypeScript validation
npm run lint         # ESLint validation
npm run test         # automated tests
npm run test:watch   # tests in watch mode
npm run format       # format the project
npm run check        # types, lint, tests, and formatting
```

## Make workflows

The project includes a single task runner for both local and containerized
workflows. Run `make help` to see every command.

```bash
make install         # deterministic local dependency install
make dev             # local development at http://localhost:3000
make verify          # types, lint, tests, formatting, and production build

make dev-up          # Docker development with hot reload
make prod            # build and start the hardened production container
make prod-status     # inspect production status and health
make prod-logs       # follow production logs
make health          # call the running app's health endpoint
```

Settings can be overridden per command, for example:

```bash
make dev APP_PORT=3001
make prod APP_PORT=8080 IMAGE_TAG=v1.0.0
```

## Structure

```text
src/
├── app/            # routes, global styles, metadata, errors
├── components/
│   ├── layout/     # reusable geometry and application shells
│   ├── theme/      # theme controls
│   └── ui/         # reusable interface primitives
├── config/         # product, navigation, storage, and motion configuration
├── features/       # domain-focused screens and feature components
├── hooks/          # reusable React hooks
├── lib/            # framework-agnostic helpers (including cn)
└── providers/      # application-wide React providers
```

Homepage content follows this dependency flow:

```text
app/page.tsx
  → features/home/server/get-home-page-content.ts
  → validated CMS content, when configured, else the site's own typed content
  → HomeScreen
  → prop-driven feature sections
```

UI components never fetch content and feature components never import CMS clients. Configure
`CONTENT_API_URL` to serve `GET /home` using the contract in
`src/features/home/types/home-page.ts`. Responses are cached for five minutes. A CMS can trigger
immediate publication by sending an authorized `POST /api/revalidate` request.

```http
Authorization: Bearer <CONTENT_REVALIDATION_SECRET>
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
- `/projects` — development collection
- `/projects/seren-redwood` — flagship development detail
- `/lifestyle` — services, amenities, and living experience
- `/blog` — editorial insights
- `/contact` — enquiry form and native confirmation modal
- `/careers` — disciplines and studio opportunities
- `/privacy`, `/terms`, `/cookies`, `/accessibility` — complete policy destinations
- `/projects/[slug]` — statically generated development details
- `/blog/[slug]` — statically generated editorial articles
- `/portfolio`, `/portfolio/[slug]`, `/journal`, `/journal/[slug]` — permanently redirect to the routes above

The native consent manager provides a first-visit cookie banner, optional-category preferences,
persistent local choices, cross-tab synchronization, and a footer control for reopening settings.

The newsletter lifecycle waits until cookie consent is resolved, opens after meaningful engagement,
persists dismissal/subscription state, and posts through the internal `/api/newsletter` integration boundary.
Configure `NEWSLETTER_WEBHOOK_URL` (and, when required, `NEWSLETTER_WEBHOOK_TOKEN`) to deliver
validated subscriptions to the production email or CRM service. The server does not expose those credentials
to the browser.

Contact enquiries use the same server-only boundary. Configure `CONTACT_WEBHOOK_URL` and optionally
`CONTACT_WEBHOOK_TOKEN`; without a delivery integration, the form reports that the service is unavailable
instead of displaying a false success state.
