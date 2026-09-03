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
  // A glyph name from the shared `Icon` registry (`components/ui/icon.tsx`) —
  // e.g. "target", "telescope". Validated as a non-empty string here; the
  // component narrows it to `IconName` at the call site.
  icon: nonEmptyString,
});

/**
 * The `/about` page content contract. Same shape/validation discipline as
 * `homePageContentSchema` — the page never reads a raw string that hasn't
 * passed through here, whether it came from the shipped data file or a CMS
 * override (see `server/get-about-page-content.ts`).
 */
export const aboutPageContentSchema = z.object({
  hero: z.object({
    // Rendered as the pill badge, same as the homepage hero.
    eyebrow: nonEmptyString,
    // One line per array entry; `*word*` marks the italic accent.
    titleLines: nonEmptyStringArray,
    lede: nonEmptyString,
    // Full-bleed background. `image` (the poster) is required and always
    // painted; `video` / `mobileVideo` are an optional ambient loop layered
    // over it once it has a frame ready.
    image: nonEmptyString,
    video: nonEmptyString.optional(),
    mobileVideo: nonEmptyString.optional(),
    primary: ctaSchema.optional(),
    secondary: ctaSchema.optional(),
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
    // Ambient YouTube backdrop filling the whole dark band (muted, looping,
    // lazy-loaded) — the same treatment as the Dexta Clan band's video
    // variant. `poster` is the local still shown until (or instead of) it.
    video: z.object({ id: nonEmptyString, poster: nonEmptyString }),
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
