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

  // The CEO letter uses the shared <RevealGroup> scroll-reveal (see
  // ceo-letter.tsx) — nothing section-specific to tune here.
} as const;
