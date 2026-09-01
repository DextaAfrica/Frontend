# Feature content strategy

Each folder under `src/features/*` is a screen. Not every screen sources its
content the same way, and that split is intentional:

## CMS-overridable

**`home`** is the only feature wired to the managed content API. It follows
one pattern, and it's the pattern to copy if another feature needs the same:

- `server/get-home-page-content.ts` — the site's own content
  (`data/home-page-content.ts`) is what ships and renders by default. When
  `CONTENT_API_URL` is configured, that CMS response is fetched and, once
  validated, takes precedence — tagged for on-demand revalidation
  (`POST /api/revalidate`). Any network failure or schema mismatch is
  logged and the site keeps serving its own content rather than breaking.
- `schemas/home-page.ts` — the zod schema a CMS payload is validated
  against before it's trusted.
- `types/home-page.ts` — the typed shape everything downstream renders.
- Which source served the last request is observable at `GET /api/health`
  (`homePageContent.source`), not just in server logs.

## Static by design

**`about`, `careers`, `contact`, `development`, `journal`, `legal`,
`lifestyle`, `portfolio`** render copy that lives directly in their
`screens/` components (or in `src/data/projects.ts` /
`src/data/articles.ts` for the two with detail routes). This is a choice,
not a gap: this content changes by shipping code, not by a content editor,
and doesn't currently warrant a CMS round-trip or a schema to maintain.

If a feature outgrows static copy — a non-engineer needs to edit it, or it
needs to change without a deploy — give it the same three pieces `home`
has (`server/`, `schemas/`, `data/`) rather than inventing a new pattern.
