import { describe, expect, it } from "vitest";
import { fallbackHomePageContent } from "../data/fallback-home-page";
import { homePageContentSchema } from "./home-page";

describe("homePageContentSchema", () => {
  it("accepts the local fallback content", () => {
    expect(
      homePageContentSchema.safeParse(fallbackHomePageContent).success,
    ).toBe(true);
  });

  it("rejects incomplete upstream content", () => {
    expect(homePageContentSchema.safeParse({ hero: {} }).success).toBe(false);
  });

  it("rejects empty collections required by the homepage", () => {
    expect(
      homePageContentSchema.safeParse({
        ...fallbackHomePageContent,
        projects: [],
      }).success,
    ).toBe(false);
  });
});
