import "server-only";

import { fallbackHomePageContent } from "../data/fallback-home-page";
import { homePageContentSchema } from "../schemas/home-page";
import type { HomePageContent } from "../types/home-page";

const REVALIDATE_SECONDS = 300;

export async function getHomePageContent(): Promise<HomePageContent> {
  const endpoint = process.env.CONTENT_API_URL;
  if (!endpoint) return fallbackHomePageContent;

  try {
    const response = await fetch(`${endpoint.replace(/\/$/, "")}/home`, {
      headers: process.env.CONTENT_API_TOKEN
        ? { Authorization: `Bearer ${process.env.CONTENT_API_TOKEN}` }
        : undefined,
      next: { revalidate: REVALIDATE_SECONDS, tags: ["home-page"] },
    });

    if (!response.ok)
      throw new Error(`Content API returned ${response.status}`);
    const content = homePageContentSchema.safeParse(await response.json());
    if (!content.success) {
      throw new Error("Content API returned an invalid homepage payload");
    }
    return content.data;
  } catch (error) {
    console.error("Unable to load managed homepage content", error);
    return fallbackHomePageContent;
  }
}
