import "server-only";

import { aboutPageContent } from "../data/about-page-content";
import { aboutPageContentSchema } from "../schemas/about-page";
import type { AboutPageContent } from "../types/about-page";

const REVALIDATE_SECONDS = 300;

/**
 * Resolves the `/about` page content. Mirrors `getHomePageContent`: when
 * `CONTENT_API_URL` is configured the CMS is treated as an override and takes
 * precedence; otherwise — or if the CMS is unreachable or returns a payload
 * that fails validation — the site serves its own shipped content.
 */
export async function getAboutPageContent(): Promise<AboutPageContent> {
  const endpoint = process.env.CONTENT_API_URL;
  if (!endpoint) return aboutPageContent;

  try {
    const response = await fetch(`${endpoint.replace(/\/$/, "")}/about`, {
      headers: process.env.CONTENT_API_TOKEN
        ? { Authorization: `Bearer ${process.env.CONTENT_API_TOKEN}` }
        : undefined,
      next: { revalidate: REVALIDATE_SECONDS, tags: ["about-page"] },
    });

    if (!response.ok) {
      throw new Error(`Content API returned ${response.status}`);
    }
    const content = aboutPageContentSchema.safeParse(await response.json());
    if (!content.success) {
      throw new Error("Content API returned an invalid about-page payload");
    }
    return content.data;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(
      JSON.stringify({
        event: "about_page_content_cms_unavailable",
        message,
        timestamp: new Date().toISOString(),
      }),
    );
    return aboutPageContent;
  }
}
