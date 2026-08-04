/** Responsive homepage motion values shared by marketing primitives and features. */
export const homeMotion = {
  intro: {
    revealSpan: 0.76,
    wordTransitionSpan: 0.24,
    mutedOpacity: 0.48,
    smoothing: 0.14,
    wordOffsetEm: 0.045,
    viewportStart: 0.7,
    sectionEnd: 0.02,
    settleThreshold: 0.0005,
  },
  services: {
    enabledMedia: "(prefers-reduced-motion: no-preference)",
    cardTransition: 1,
    collapsedExitAt: 0.78,
    contentTransition: 0.2,
    scrub: 1,
    start: "top top",
    end: "bottom bottom",
    mediaScale: 1.045,
    mediaOffsetPercent: 4,
  },
} as const;
