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
    compactMedia: "(max-width: 63.999rem)",
    cardTransition: 1,
    collapsedExitAt: 0.78,
    expandedEnterAt: 0.8,
    contentTransition: 0.2,
    start: "top top",
    end: "bottom bottom",
    compact: {
      scrub: 0.72,
      mediaScale: 1.075,
      mediaOffsetPercent: 6,
      mediaExitScale: 1.025,
      mediaExitPercent: -2.5,
    },
    wide: {
      scrub: 1,
      mediaScale: 1.055,
      mediaOffsetPercent: 4.5,
      mediaExitScale: 1.02,
      mediaExitPercent: -2,
    },
  },
} as const;
