# Feature content strategy

Each folder under `src/features/*` owns one product area and its route
compositions. Route files in `src/app/**/page.tsx` stay thin — metadata plus a
single import of the feature screen.

## Where content lives — one rule

**Static content for a feature lives under that feature's own `data/`
directory.** There is no shared top-level `src/data/`. A value used by exactly
one screen may stay inline in that screen; anything referenced from more than one
place (a list screen and a detail route, `sitemap.ts`, etc.) gets a `data/` file.

Current `data/` modules:

- `features/blog/data/articles.ts` — blog list + `/blog/[slug]` + `sitemap.ts`
- `features/projects/data/projects.ts` — projects list + `/projects/[slug]` + `sitemap.ts`
- `features/projects/data/residences.ts` — the `/projects/[slug]` residence table
- `features/careers/data/roles.ts` — the careers areas grid
- `features/home/data/home-page-content.ts` — the shipped home page content
- `features/home/data/faq.ts` — the home FAQ list (`FaqItem` type lives with the
  `FaqAccordion` component it feeds)
- `features/home/data/expertise.ts` — the expertise-marquee items (same
  pattern: `ExpertiseMarqueeItem` type lives with `ExpertiseMarquee`)

## CMS-overridable

**`home`** is the only feature wired to the managed content API, and it is the
pattern to copy if another feature ever needs the same:

- `server/get-home-page-content.ts` — the shipped content
  (`data/home-page-content.ts`) renders by default. When `CONTENT_API_URL` is
  configured, that CMS response is fetched and, once validated, takes precedence
  — tagged for on-demand revalidation (`POST /api/revalidate`). Any network
  failure or schema mismatch is logged and the site keeps serving its own
  content rather than breaking.
- `schemas/home-page.ts` — the zod schema a CMS payload is validated against.
- `types/home-page.ts` — the typed shape everything downstream renders.
- Which source served the last request is observable at `GET /api/health`
  (`homePageContent.source`).

## Static by design

**`about`, `blog`, `careers`, `contact`, `legal`, `lifestyle`, `projects`**
render copy that changes by shipping code, not by a content editor. They do not
carry a CMS round-trip or a schema. If one outgrows that — a non-engineer needs
to edit it, or it must change without a deploy — give it the same `server/` +
`schemas/` + `data/` pieces `home` has rather than inventing a new pattern.
