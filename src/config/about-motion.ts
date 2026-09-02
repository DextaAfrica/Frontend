/**
 * Motion values for the `/about` page. Same intent as `home-motion.ts`: every
 * duration, offset, and scrub lives here so the section components stay free
 * of magic numbers and the whole page can be retuned in one place.
 */
export const aboutMotion = {
  enabledMedia: "(prefers-reduced-motion: no-preference)",

  hero: {
    // Entrance timeline (mirrors editorial-hero.tsx cadence). `overlap` is a
    // relative GSAP position ("-=0.3" → start 0.3s before the previous tween
    // ends), never a bare number.
    enter: {
      eyebrow: { y: 8, duration: 0.5 },
      title: { y: 16, blur: 8, duration: 0.7, overlap: "-=0.3" },
      lede: { y: 10, duration: 0.5, overlap: "-=0.35" },
      collage: { y: 24, duration: 0.9, overlap: "-=0.5" },
    },
    // Scrubbed parallax on the two collage images once scrolling past.
    parallax: {
      scrub: 0.6,
      peopleFromPercent: -6,
      propertyFromPercent: 8,
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
