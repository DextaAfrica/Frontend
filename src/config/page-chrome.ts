/**
 * Per-route site-header chrome.
 *
 * Most routes get the solid header from the very first pixel: an opaque bar
 * carrying the wordmark and nav in the page's own foreground colour.
 *
 * A few routes open with a full-bleed, dark media hero — the `dexta-hero`
 * shell, shared by `<LandingHero>` and `<AboutHero>`. On those the header
 * must start transparent and ride *over* the hero in a light-on-media
 * palette (near-white wordmark, `onMedia` CTA, light nav links), then
 * commit to the solid treatment as the visitor scrolls the hero away. That
 * is the behaviour the homepage has always had; this list is what lets any
 * other page opt into exactly the same thing.
 *
 * This module is the ONLY place that decision lives. `<SiteHeader>` reads
 * `routeHasOverlayHero()` and never tests a pathname itself, so a new page
 * built on the `dexta-hero` shell is wired up by adding its route here and
 * nothing else.
 */
export const OVERLAY_HERO_ROUTES: readonly string[] = ["/", "/about"];

/**
 * Whether `pathname` opens with a full-bleed media hero that the site header
 * sits over (transparent bar + light-on-media palette until scrolled).
 *
 * Matches the route exactly — a nested path like `/about/team` is its own
 * page with its own (solid) header unless separately listed above.
 */
export function routeHasOverlayHero(pathname: string): boolean {
  return OVERLAY_HERO_ROUTES.includes(pathname);
}
