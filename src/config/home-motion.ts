/** Responsive homepage motion values shared by marketing primitives and features. */
export const homeMotion = {
  intro: {
    revealSpan: 0.76,
    wordTransitionSpan: 0.24,
    mutedOpacity: 0.32,
    smoothing: 0.14,
    wordOffsetEm: 0.4,
    wordBlurPx: 7,
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
    // mediaScale/mediaOffsetPercent prime an incoming image slightly zoomed
    // and shifted before it becomes active; mediaExitScale/mediaExitPercent
    // carry it further as it exits. The gap between those two states *is*
    // the parallax — too small (this used to top out around 1.075/6%) and
    // it reads as a jitter rather than depth, however smooth the easing is.
    compact: {
      scrub: 0.72,
      mediaScale: 1.12,
      mediaOffsetPercent: 9,
      mediaExitScale: 1.05,
      mediaExitPercent: -5,
    },
    wide: {
      scrub: 1,
      mediaScale: 1.16,
      mediaOffsetPercent: 11,
      mediaExitScale: 1.07,
      mediaExitPercent: -6.5,
    },
  },
  testimonials: {
    enabledMedia: "(prefers-reduced-motion: no-preference)",
    /** Seconds the fill line takes to travel from one dot to the next. */
    dwell: 7,
    /** Seconds to ease the fill line back to the start on the loop wrap. */
    wrapRewind: 0.45,
    out: { duration: 0.34, y: -8, blur: 4 },
    in: {
      duration: 0.56,
      y: 14,
      blur: 6,
      ease: "expo.out",
      captionOffset: 0.06,
    },
    avatarScaleFrom: 1.05,
  },
} as const;
