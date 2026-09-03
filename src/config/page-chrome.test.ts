import { describe, expect, it } from "vitest";
import { OVERLAY_HERO_ROUTES, routeHasOverlayHero } from "./page-chrome";
import { siteConfig } from "./site";

describe("routeHasOverlayHero", () => {
  it("marks the homepage and the about page as overlay-hero routes", () => {
    expect(routeHasOverlayHero("/")).toBe(true);
    expect(routeHasOverlayHero("/about")).toBe(true);
  });

  it("treats every other primary-nav route as a solid-header route", () => {
    const solidNavRoutes = siteConfig.navItems
      .map((item) => item.href)
      .filter((href) => !OVERLAY_HERO_ROUTES.includes(href));

    // Guard against the filter silently matching nothing.
    expect(solidNavRoutes.length).toBeGreaterThan(0);
    for (const href of solidNavRoutes) {
      expect(routeHasOverlayHero(href)).toBe(false);
    }
  });

  it("matches routes exactly — a nested path is not an overlay route", () => {
    expect(routeHasOverlayHero("/about/team")).toBe(false);
    expect(routeHasOverlayHero("/about-us")).toBe(false);
    expect(routeHasOverlayHero("")).toBe(false);
  });
});
