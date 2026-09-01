import { describe, expect, it } from "vitest";
import { homePageContent } from "../data/home-page-content";
import { homePageContentSchema } from "./home-page";

describe("homePageContentSchema", () => {
  it("accepts the site's home page content", () => {
    expect(homePageContentSchema.safeParse(homePageContent).success).toBe(true);
  });

  it("rejects incomplete upstream content", () => {
    expect(homePageContentSchema.safeParse({ hero: {} }).success).toBe(false);
  });

  it("rejects empty collections required by the homepage", () => {
    expect(
      homePageContentSchema.safeParse({
        ...homePageContent,
        projects: [],
      }).success,
    ).toBe(false);
  });
});
