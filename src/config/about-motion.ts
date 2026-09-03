/**
 * Motion values for the `/about` page. Same intent as `home-motion.ts`: every
 * duration, offset, and scrub lives here so the section components stay free
 * of magic numbers and the whole page can be retuned in one place.
 */
export const aboutMotion = {
  enabledMedia: "(prefers-reduced-motion: no-preference)",

  hero: {
    // Full-bleed media hero, entrance only — mirrors <LandingHero>'s mount
    // choreography (badge punches in, heading lines rise line-by-line from a
    // clipped baseline, description follows through a blur). `overlap` is a
    // relative GSAP position string, never a bare number.
    enter: {
      badge: { scaleFrom: 0.8, y: 10, blur: 6, duration: 0.8 },
      line: {
        yPercentFrom: 110,
        scaleFrom: 0.94,
        duration: 1.1,
        stagger: 0.14,
        overlap: "-=0.35",
      },
      lede: { y: 14, blur: 10, duration: 0.9, overlap: "-=0.55" },
    },
  },

  journey: {
    // The vertical rule fills from 0 → 100% across the milestone list.
    line: { scrub: 0.5, start: "top 75%", end: "bottom 65%" },
  },

  ceo: {
    // Portrait wipes open (and settles from a slight zoom) once on first view.
    portrait: {
      clipFrom: 16,
      scaleFrom: 1.06,
      duration: 1,
      start: "top 80%",
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
