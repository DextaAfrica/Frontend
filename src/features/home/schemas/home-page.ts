import { z } from "zod";

const nonEmptyString = z.string().trim().min(1);
const nonEmptyStringArray = z.array(nonEmptyString).min(1);

const sectionHeadingSchema = z.object({
  eyebrow: nonEmptyString,
  title: nonEmptyString,
});

export const homePageContentSchema = z.object({
  hero: z.object({
    titleLines: nonEmptyStringArray,
    ctaLabel: nonEmptyString,
    ctaHref: nonEmptyString,
    video: nonEmptyString,
    mobileVideo: nonEmptyString.optional(),
    poster: nonEmptyString.optional(),
  }),
  intro: z.object({
    heading: nonEmptyString,
    paragraphs: nonEmptyStringArray,
  }),
  services: z
    .array(
      z.object({
        id: nonEmptyString,
        number: nonEmptyString,
        label: nonEmptyString,
        title: nonEmptyString,
        description: nonEmptyString,
        image: nonEmptyString,
      }),
    )
    .min(1),
  projectsSection: sectionHeadingSchema.extend({
    ctaLabel: nonEmptyString,
    ctaHref: nonEmptyString,
    cardCtaLabel: nonEmptyString,
  }),
  projects: z
    .array(
      z.object({
        id: nonEmptyString,
        number: nonEmptyString,
        name: nonEmptyString,
        location: nonEmptyString,
        status: nonEmptyString,
        image: nonEmptyString,
        href: nonEmptyString,
        layout: z.enum(["feature", "compact"]),
      }),
    )
    .min(1),
  testimonialSection: sectionHeadingSchema,
  testimonial: z.object({
    id: nonEmptyString,
    quote: nonEmptyString,
    author: nonEmptyString,
    role: nonEmptyString,
    portrait: nonEmptyString,
  }),
  statistics: z
    .array(
      z.object({
        id: nonEmptyString,
        value: nonEmptyString,
        copy: nonEmptyString,
        highlight: nonEmptyString,
        image: nonEmptyString,
      }),
    )
    .min(1),
  blogSection: sectionHeadingSchema,
  blog: z
    .array(
      z.object({
        id: nonEmptyString,
        title: nonEmptyString,
        image: nonEmptyString,
        href: nonEmptyString,
        publishedAt: nonEmptyString,
        readingTime: nonEmptyString,
      }),
    )
    .min(1),
  newsletter: z.object({
    eyebrow: nonEmptyString,
    title: nonEmptyString,
  }),
});
