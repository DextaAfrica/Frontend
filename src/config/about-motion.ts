/**
 * Motion values for the `/about` page. Same intent as `home-motion.ts`: every
 * duration, offset, and scrub lives here so the section components stay free
 * of magic numbers and the whole page can be retuned in one place.
 */
export const aboutMotion = {
  enabledMedia: "(prefers-reduced-motion: no-preference)",

  // The page hero is the shared <MediaHero>, which carries its own entrance
  // choreography — nothing to tune here.

  journey: {
    // The vertical rule fills from 0 → 100% across the milestone list.
    line: { scrub: 0.5, start: "top 75%", end: "bottom 65%" },
  },

  ceo: {
    // Portrait and letter body converge toward the centre from their own
    // outer edge, each starting off past its column — the same mechanism as
    // the homepage's about-teaser (see about-teaser.tsx): opposite starting
    // sides, one shared timeline, a `back.out` ease so both overshoot their
    // resting spot by a few pixels before settling rather than sliding to a
    // dead stop.
    slideIn: {
      offset: 72,
      duration: 1.3,
      start: "top 78%",
    },
    // Letter paragraphs, closing line, then signature — staggered on first view.
    letter: {
      start: "top 78%",
      paragraph: { y: 18, duration: 0.7, stagger: 0.12 },
      kicker: { y: 14, blur: 6, duration: 0.8, overlap: "-=0.4" },
      signature: { y: 12, duration: 0.8, overlap: "-=0.3" },
    },
  },
} as const;
