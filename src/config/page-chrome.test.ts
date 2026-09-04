import { describe, expect, it } from "vitest";
import { OVERLAY_HERO_ROUTES, routeHasOverlayHero } from "./page-chrome";
import { siteConfig } from "./site";

describe("routeHasOverlayHero", () => {
  it("marks the homepage and the about page as overlay-hero routes", () => {
    expect(routeHasOverlayHero("/")).toBe(true);
    expect(routeHasOverlayHero("/about")).toBe(true);
  });

  it("treats every primary-nav route as an overlay-hero route", () => {
    // Every page in the primary nav opens on a full-bleed <MediaHero> (or
    // the homepage's own <LandingHero>) today — the header must ride
    // transparently over all of them, not just "/" and "/about". Regressing
    // this list without updating the header (or vice-versa) is exactly the
    // "header doesn't match the hero" bug this module exists to prevent.
    const navRoutes = siteConfig.navItems.map((item) => item.href);
    expect(navRoutes.length).toBeGreaterThan(0);
    for (const href of navRoutes) {
      expect(routeHasOverlayHero(href)).toBe(true);
    }
  });

  it("covers every listed route via the exported route list", () => {
    for (const route of OVERLAY_HERO_ROUTES) {
      expect(routeHasOverlayHero(route)).toBe(true);
    }
  });

  it("also treats dynamic blog articles and project detail pages as overlay-hero routes", () => {
    expect(routeHasOverlayHero("/blog/ai-land-acquisition")).toBe(true);
    expect(routeHasOverlayHero("/projects/dlodge-apartment")).toBe(true);
  });

  it("matches an unlisted route exactly — a nested path is not implicitly covered", () => {
    expect(routeHasOverlayHero("/about/team")).toBe(false);
    expect(routeHasOverlayHero("/about-us")).toBe(false);
    expect(routeHasOverlayHero("")).toBe(false);
    // "/blog" and "/projects" are covered by exact match; a lookalike
    // sibling route that only shares the prefix textually should not be.
    expect(routeHasOverlayHero("/blogger")).toBe(false);
  });
});
