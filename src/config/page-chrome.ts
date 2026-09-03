/**
 * Per-route site-header chrome.
 *
 * Most routes get the solid header from the very first pixel: an opaque bar
 * carrying the wordmark and nav in the page's own foreground colour.
 *
 * Every page now actually opens on a full-bleed <MediaHero> (or the
 * homepage's own <LandingHero>) — the same dark, `dexta-hero` shell either
 * way. The header must start transparent and ride *over* that hero in a
 * light-on-media palette (near-white wordmark, `onMedia` CTA, light nav
 * links), then commit to the solid treatment as the visitor scrolls the
 * hero away. `<MediaHero>`'s own doc comment has said as much since it was
 * built; this is what actually keeps that promise for every page rendering
 * one, not just "/" and "/about".
 *
 * This module is the ONLY place that decision lives. `<SiteHeader>` reads
 * `routeHasOverlayHero()` and never tests a pathname itself, so a new page
 * built on `<MediaHero>` is wired up by adding its route below and nothing
 * else — miss this step and the page still renders correctly, it just gets
 * a flat solid header sitting above a cinematic hero instead of riding over
 * it, which is exactly the inconsistency this file exists to prevent.
 */
export const OVERLAY_HERO_ROUTES: readonly string[] = [
  "/",
  "/about",
  "/contact",
  "/projects",
  "/blog",
  "/careers",
  "/lifestyle",
  "/terms",
  "/privacy",
  "/cookies",
  "/accessibility",
];

/**
 * Route prefixes whose dynamic child pages *also* open on a <MediaHero> —
 * every /blog/[slug] article and /projects/[slug] detail page, not just
 * their listing pages. Exact-match alone can never catch these: the actual
 * pathname (e.g. "/blog/ai-land-acquisition") isn't known until content is
 * generated, so it can't be listed above.
 */
const OVERLAY_HERO_PREFIXES: readonly string[] = ["/blog/", "/projects/"];

/**
 * Whether `pathname` opens with a full-bleed media hero that the site header
 * sits over (transparent bar + light-on-media palette until scrolled).
 *
 * Matches a listed route exactly, or falls under a listed prefix — a nested
 * path not covered by either (e.g. a future `/about/team`) is its own page
 * with its own (solid) header unless separately wired up above.
 */
export function routeHasOverlayHero(pathname: string): boolean {
  return (
    OVERLAY_HERO_ROUTES.includes(pathname) ||
    OVERLAY_HERO_PREFIXES.some((prefix) => pathname.startsWith(prefix))
  );
}
