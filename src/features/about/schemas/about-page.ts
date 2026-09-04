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
    // Optional: a faint full-bleed texture behind the letter. Renders at
    // 5% opacity, so its absence is never visually obvious either way.
    background: nonEmptyString.optional(),
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
    // Optional standfirst under the heading.
    lede: nonEmptyString.optional(),
    members: z
      .array(
        z.object({
          name: nonEmptyString,
          role: nonEmptyString,
          // Optional: members without a photo yet render an initials
          // monogram until a real portrait is added.
          image: nonEmptyString.optional(),
          // Optional per-person profile links. The hover panel always shows
          // all three glyphs; each becomes a real link only once its URL is
          // set here.
          socials: z
            .object({
              instagram: nonEmptyString.optional(),
              linkedin: nonEmptyString.optional(),
              facebook: nonEmptyString.optional(),
            })
            .optional(),
        }),
      )
      .min(1),
  }),
});
