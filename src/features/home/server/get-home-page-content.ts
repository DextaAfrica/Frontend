import "server-only";

import { homePageContent } from "../data/home-page-content";
import { homePageContentSchema } from "../schemas/home-page";
import type { HomePageContent } from "../types/home-page";
import { recordContentSourceResult } from "./content-source-state";

const REVALIDATE_SECONDS = 300;

/**
 * Resolves the home page's content. When `CONTENT_API_URL` is configured,
 * the CMS is treated as an override and takes precedence; otherwise — or if
 * the CMS is unreachable or returns a payload that fails validation — the
 * site serves its own shipped content.
 */
export async function getHomePageContent(): Promise<HomePageContent> {
  const endpoint = process.env.CONTENT_API_URL;
  if (!endpoint) {
    recordContentSourceResult("static");
    return homePageContent;
  }

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
    recordContentSourceResult("cms");
    return content.data;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(
      JSON.stringify({
        event: "home_page_content_cms_unavailable",
        message,
        timestamp: new Date().toISOString(),
      }),
    );
    recordContentSourceResult("static", message);
    return homePageContent;
  }
}
