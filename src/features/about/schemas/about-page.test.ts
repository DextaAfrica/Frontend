import { describe, expect, it } from "vitest";
import { aboutPageContent } from "../data/about-page-content";
import { aboutPageContentSchema } from "./about-page";

describe("aboutPageContentSchema", () => {
  it("accepts the site's about page content", () => {
    expect(aboutPageContentSchema.safeParse(aboutPageContent).success).toBe(
      true,
    );
  });

  it("rejects incomplete upstream content", () => {
    expect(aboutPageContentSchema.safeParse({ hero: {} }).success).toBe(false);
  });

  it("rejects empty collections required by the page", () => {
    expect(
      aboutPageContentSchema.safeParse({
        ...aboutPageContent,
        team: { ...aboutPageContent.team, members: [] },
      }).success,
    ).toBe(false);

    expect(
      aboutPageContentSchema.safeParse({
        ...aboutPageContent,
        journey: { ...aboutPageContent.journey, milestones: [] },
      }).success,
    ).toBe(false);
  });
});
