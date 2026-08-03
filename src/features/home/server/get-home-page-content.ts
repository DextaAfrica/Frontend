import "server-only";

import { fallbackHomePageContent } from "../data/fallback-home-page";
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
    const content: unknown = await response.json();
    if (!isHomePageContent(content)) {
      throw new Error("Content API returned an invalid homepage payload");
    }
    return content;
  } catch (error) {
    console.error("Unable to load managed homepage content", error);
    return fallbackHomePageContent;
  }
}

function isHomePageContent(value: unknown): value is HomePageContent {
  if (!isRecord(value)) return false;
  return (
    isRecord(value.hero) &&
    isStringArray(value.hero.titleLines) &&
    isString(value.hero.ctaLabel) &&
    isString(value.hero.ctaHref) &&
    isString(value.hero.video) &&
    isOptionalString(value.hero.mobileVideo) &&
    isOptionalString(value.hero.poster) &&
    isRecord(value.intro) &&
    isString(value.intro.heading) &&
    typeof value.intro.initialWordCount === "number" &&
    isStringArray(value.intro.paragraphs) &&
    isObjectArray(value.services, isService) &&
    hasStrings(value.projectsSection, [
      "eyebrow",
      "title",
      "ctaLabel",
      "ctaHref",
    ]) &&
    isObjectArray(value.projects, isProject) &&
    hasStrings(value.testimonialSection, ["eyebrow", "title"]) &&
    isTestimonial(value.testimonial) &&
    isObjectArray(value.statistics, isStatistic) &&
    hasStrings(value.blogSection, ["eyebrow", "title"]) &&
    isObjectArray(value.blog, isBlogPost) &&
    isRecord(value.newsletter) &&
    isString(value.newsletter.eyebrow) &&
    isString(value.newsletter.title)
  );
}

function isService(value: unknown) {
  return hasStrings(value, ["id", "number", "title", "description", "image"]);
}

function isProject(value: unknown) {
  return hasStrings(value, ["id", "name", "location", "image", "href"]);
}

function isTestimonial(value: unknown) {
  return hasStrings(value, ["id", "quote", "author", "role", "portrait"]);
}

function isStatistic(value: unknown) {
  return hasStrings(value, ["id", "value", "copy"]);
}

function isBlogPost(value: unknown) {
  return hasStrings(value, [
    "id",
    "title",
    "image",
    "href",
    "publishedAt",
    "readingTime",
  ]);
}

function hasStrings(value: unknown, keys: readonly string[]) {
  return isRecord(value) && keys.every((key) => isString(value[key]));
}

function isObjectArray(value: unknown, validate: (entry: unknown) => boolean) {
  return Array.isArray(value) && value.length > 0 && value.every(validate);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isString(value: unknown): value is string {
  return typeof value === "string" && value.length > 0;
}

function isOptionalString(value: unknown) {
  return value === undefined || isString(value);
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.length > 0 && value.every(isString);
}
