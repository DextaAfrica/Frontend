# Feature content strategy

Each folder under `src/features/*` is a screen. Not every screen sources its
content the same way, and that split is intentional:

## CMS-backed

**`home`** is the only feature wired to the managed content API. It follows
one pattern, and it's the pattern to copy if another feature needs to move
off static copy:

- `server/get-home-page-content.ts` — fetches from `CONTENT_API_URL`, tagged
  for on-demand revalidation (`POST /api/revalidate`), falling back to
  `data/fallback-home-page.ts` on any network/schema failure.
- `schemas/home-page.ts` — zod schema the fetched payload is validated
  against before it's trusted. A payload that fails validation is treated
  the same as a network failure: log, fall back, keep serving.
- `types/home-page.ts` — the typed shape everything downstream renders.
- Whether the fallback is currently in use is observable at
  `GET /api/health` (`homePageContent.source`), not just in server logs.

## Static by design

**`about`, `careers`, `contact`, `development`, `journal`, `legal`,
`lifestyle`, `portfolio`** render copy that lives directly in their
`screens/` components (or in `src/data/projects.ts` /
`src/data/articles.ts` for the two with detail routes). This is a choice,
not a gap: this content changes by shipping code, not by a content editor,
and doesn't currently warrant a CMS round-trip, a schema, or a fallback
path to maintain.

If a feature outgrows static copy — a non-engineer needs to edit it, or it
needs to change without a deploy — give it the same three pieces `home`
has (`server/`, `schemas/`, `data/` fallback) rather than inventing a new
pattern.
