import "server-only";

import { projects as fallbackProjects } from "@/features/projects/data/projects";
import { articles as fallbackArticles } from "@/features/blog/data/articles";
import { careerAreas } from "@/features/careers/data/roles";
import type { Project } from "@/components/marketing";
import type { Article } from "@/features/blog/data/articles";

export const BACKEND_API_URL =
  process.env.BACKEND_API_URL ||
  process.env.NEXT_PUBLIC_BACKEND_API_URL ||
  "http://localhost:8080";

const REVALIDATE_INTERVAL = 300; // 5 minutes ISR cache

export interface BackendDevelopment {
  id: string;
  slug: string;
  name: string;
  summary: string;
  body: Record<string, unknown>;
  heroImageUrl: string;
  gallery: Array<{ url: string; alt: string }>;
  location: string;
  status: string;
  featured: boolean;
  seoTitle: string;
  seoDescription: string;
  published: boolean;
  publishedAt?: string;
  displayOrder: number;
  updatedAt: string;
}

export interface BackendArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: Record<string, unknown>;
  coverImageUrl: string;
  author: string;
  category: string;
  seoTitle: string;
  seoDescription: string;
  published: boolean;
  publishedAt?: string;
  updatedAt: string;
}

export interface BackendCareerListing {
  id: string;
  slug: string;
  title: string;
  department: string;
  location: string;
  type: string;
  summary: string;
  description: Record<string, unknown>;
  requirements: string[];
  benefits: string[];
  status: "open" | "closed";
  published: boolean;
  updatedAt: string;
}

export interface PaginatedMeta {
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginatedMeta;
}

/**
 * Maps a Go backend development to the rich Frontend Project interface.
 */
export function mapDevelopmentToProject(dev: BackendDevelopment): Project {
  const toneMap: Record<string, "ruby" | "stone" | "dusk" | "light"> = {
    planning: "stone",
    under_construction: "ruby",
    completed: "dusk",
  };

  const statusLabelMap: Record<string, string> = {
    planning: "Coming soon",
    under_construction: "Now selling",
    completed: "Completed",
  };

  const interiorGallery = dev.gallery
    ?.filter((g) => g.alt.toLowerCase().includes("interior"))
    .map((g) => ({ src: g.url, alt: g.alt }));

  const exteriorGallery = dev.gallery
    ?.filter((g) => !g.alt.toLowerCase().includes("interior"))
    .map((g) => ({ src: g.url, alt: g.alt }));

  return {
    slug: dev.slug,
    name: dev.name,
    location: dev.location,
    status: statusLabelMap[dev.status] ?? dev.status,
    description: dev.summary || dev.seoDescription,
    tone: toneMap[dev.status] ?? "stone",
    image: dev.heroImageUrl || "/images/project-kingsway.jpg",
    heroImage: dev.heroImageUrl,
    tagline: dev.body?.tagline as string | undefined,
    priceFrom: dev.body?.priceFrom as string | undefined,
    features: Array.isArray(dev.body?.features)
      ? (dev.body.features as string[])
      : undefined,
    interiorGallery:
      interiorGallery && interiorGallery.length > 0
        ? interiorGallery
        : undefined,
    exteriorGallery:
      exteriorGallery && exteriorGallery.length > 0
        ? exteriorGallery
        : undefined,
  };
}

/**
 * Maps a Go backend article to the Frontend Article interface.
 */
export function mapBackendArticleToArticle(item: BackendArticle): Article {
  const toneMap: Record<string, "ruby" | "stone" | "dusk" | "light"> = {
    Design: "ruby",
    Architecture: "stone",
    Living: "dusk",
    Studio: "light",
  };

  const formattedDate = item.publishedAt
    ? new Date(item.publishedAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : new Date(item.updatedAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });

  const sections = Array.isArray(item.body?.sections)
    ? (item.body.sections as Array<{ title: string; body: string }>)
    : [
        {
          title: "Overview",
          body:
            (typeof item.body?.text === "string" ? item.body.text : "") ||
            item.excerpt,
        },
      ];

  return {
    slug: item.slug,
    title: item.title,
    category: item.category || "Architecture",
    date: formattedDate,
    tone: toneMap[item.category] ?? "stone",
    image: item.coverImageUrl || "/images/residence-interior.png",
    introduction: item.excerpt,
    sections,
  };
}

async function safeFetch<T>(
  path: string,
  options: { tags: string[]; fallback: T },
): Promise<T> {
  const url = `${BACKEND_API_URL.replace(/\/$/, "")}${
    path.startsWith("/") ? path : `/${path}`
  }`;

  try {
    const res = await fetch(url, {
      next: { revalidate: REVALIDATE_INTERVAL, tags: options.tags },
      signal: AbortSignal.timeout(6000),
      headers: { Accept: "application/json" },
    });

    if (!res.ok) {
      throw new Error(`Backend API returned HTTP ${res.status} for ${path}`);
    }

    const payload = await res.json();
    return payload as T;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(
      JSON.stringify({
        event: "backend_fetch_fallback",
        path,
        message,
        timestamp: new Date().toISOString(),
      }),
    );
    return options.fallback;
  }
}

export const backendClient = {
  portfolio: {
    list: async (): Promise<Project[]> => {
      const response = await safeFetch<PaginatedResponse<BackendDevelopment>>(
        "/portfolio",
        {
          tags: ["portfolio"],
          fallback: {
            data: [],
            meta: { page: 1, perPage: 20, totalItems: 0, totalPages: 0 },
          },
        },
      );

      if (response.data && response.data.length > 0) {
        return response.data.map(mapDevelopmentToProject);
      }
      return fallbackProjects;
    },

    getBySlug: async (slug: string): Promise<Project | null> => {
      const response = await safeFetch<{ data: BackendDevelopment } | null>(
        `/portfolio/${slug}`,
        {
          tags: ["portfolio", `portfolio-${slug}`],
          fallback: null,
        },
      );

      if (response?.data) {
        return mapDevelopmentToProject(response.data);
      }

      const local = fallbackProjects.find((p) => p.slug === slug);
      return local ?? null;
    },
  },

  journal: {
    list: async (): Promise<Article[]> => {
      const response = await safeFetch<PaginatedResponse<BackendArticle>>(
        "/journal",
        {
          tags: ["journal"],
          fallback: {
            data: [],
            meta: { page: 1, perPage: 20, totalItems: 0, totalPages: 0 },
          },
        },
      );

      if (response.data && response.data.length > 0) {
        return response.data.map(mapBackendArticleToArticle);
      }
      return fallbackArticles;
    },

    getBySlug: async (slug: string): Promise<Article | null> => {
      const response = await safeFetch<{ data: BackendArticle } | null>(
        `/journal/${slug}`,
        {
          tags: ["journal", `journal-${slug}`],
          fallback: null,
        },
      );

      if (response?.data) {
        return mapBackendArticleToArticle(response.data);
      }

      const local = fallbackArticles.find((a) => a.slug === slug);
      return local ?? null;
    },
  },

  careers: {
    list: async (): Promise<BackendCareerListing[]> => {
      const response = await safeFetch<PaginatedResponse<BackendCareerListing>>(
        "/careers/listings",
        {
          tags: ["careers"],
          fallback: {
            data: [],
            meta: { page: 1, perPage: 20, totalItems: 0, totalPages: 0 },
          },
        },
      );

      if (response.data && response.data.length > 0) {
        return response.data;
      }

      // Return synthetic listings generated from verified career areas if backend is unavailable
      return careerAreas.map((area, idx) => ({
        id: `career-${idx + 1}`,
        slug: area.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        title: `${area.title} Specialist`,
        department: area.title,
        location: "Lagos, Nigeria",
        type: "Full-time",
        summary: area.text,
        description: { text: area.text },
        requirements: [
          "Minimum 4+ years of relevant industry track record",
          "Deep commitment to craft, precision, and architectural discipline",
          "Strong communication and cross-functional leadership skills",
        ],
        benefits: [
          "Competitive executive compensation & performance bonuses",
          "Private comprehensive health & wellness coverage",
          "World-class multidisciplinary design & construction portfolio",
        ],
        status: "open",
        published: true,
        updatedAt: new Date().toISOString(),
      }));
    },

    getBySlug: async (slug: string): Promise<BackendCareerListing | null> => {
      const listings = await backendClient.careers.list();
      return listings.find((l) => l.slug === slug) ?? null;
    },
  },
};
