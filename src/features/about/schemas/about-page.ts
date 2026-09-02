import { z } from "zod";

const nonEmptyString = z.string().trim().min(1);
const nonEmptyStringArray = z.array(nonEmptyString).min(1);

const ctaSchema = z.object({
  label: nonEmptyString,
  href: nonEmptyString,
});

const framedStatementSchema = z.object({
  label: nonEmptyString,
  text: nonEmptyString,
  image: nonEmptyString,
});

/**
 * The `/about` page content contract. Same shape/validation discipline as
 * `homePageContentSchema` — the page never reads a raw string that hasn't
 * passed through here, whether it came from the shipped data file or a CMS
 * override (see `server/get-about-page-content.ts`).
 */
export const aboutPageContentSchema = z.object({
  hero: z.object({
    eyebrow: nonEmptyString,
    title: nonEmptyString,
    lede: nonEmptyString,
    images: z.object({
      people: nonEmptyString,
      property: nonEmptyString,
    }),
  }),
  statement: z.object({
    heading: nonEmptyString,
    paragraphs: nonEmptyStringArray,
    // The closing line, held apart from the body so it can be set as its own
    // oversized pull-line ("We're not done yet. We're just getting started.").
    kicker: nonEmptyString,
  }),
  missionVision: z.object({
    mission: framedStatementSchema,
    vision: framedStatementSchema,
  }),
  journey: z.object({
    eyebrow: nonEmptyString,
    title: nonEmptyString,
    // Faint full-bleed texture behind the dark journey band.
    background: nonEmptyString,
    // Optional framed still that links out to a film; the section drops the
    // media column entirely when it isn't supplied.
    video: z
      .object({ poster: nonEmptyString, href: nonEmptyString })
      .optional(),
    milestones: z
      .array(z.object({ year: nonEmptyString, text: nonEmptyString }))
      .min(1),
  }),
  ceo: z.object({
    eyebrow: nonEmptyString,
    paragraphs: nonEmptyStringArray,
    kicker: nonEmptyString,
    name: nonEmptyString,
    title: nonEmptyString,
    // Optional: the portrait frame renders a styled placeholder until the
    // photo file exists at this path.
    portrait: nonEmptyString.optional(),
    signature: nonEmptyString,
    background: nonEmptyString,
  }),
  dextaClan: z.object({
    eyebrow: nonEmptyString,
    title: nonEmptyString,
    copy: nonEmptyString,
    benefits: nonEmptyStringArray,
    cta: ctaSchema,
  }),
  team: z.object({
    eyebrow: nonEmptyString,
    title: nonEmptyString,
    members: z
      .array(
        z.object({
          name: nonEmptyString,
          role: nonEmptyString,
          image: nonEmptyString,
        }),
      )
      .min(1),
  }),
});
