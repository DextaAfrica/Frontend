import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { articles } from "@/data/articles";
import { projects } from "@/data/projects";

const staticRoutes = [
  { path: "", changeFrequency: "weekly", priority: 1 },
  { path: "/about", changeFrequency: "monthly", priority: 0.7 },
  { path: "/portfolio", changeFrequency: "weekly", priority: 0.9 },
  { path: "/lifestyle", changeFrequency: "monthly", priority: 0.6 },
  { path: "/journal", changeFrequency: "weekly", priority: 0.7 },
  { path: "/careers", changeFrequency: "monthly", priority: 0.4 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.6 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.2 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.2 },
  { path: "/cookies", changeFrequency: "yearly", priority: 0.2 },
  { path: "/accessibility", changeFrequency: "yearly", priority: 0.2 },
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    ...staticRoutes.map(({ path, changeFrequency, priority }) => ({
      url: `${siteConfig.url}${path}`,
      lastModified: now,
      changeFrequency,
      priority,
    })),
    ...projects.map(({ slug }) => ({
      url: `${siteConfig.url}/portfolio/${slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...articles.map(({ slug, date }) => ({
      url: `${siteConfig.url}/journal/${slug}`,
      lastModified: new Date(date),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
