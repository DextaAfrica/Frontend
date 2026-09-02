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
    // `end` isn't set here: the section pins a viewport-tall stage via
    // `position: sticky` and adds exactly `(count - 1) * scroll-step` of
    // scroll room below it (see the `.service-*` block in globals.css). The
    // component derives the ScrollTrigger range from that same measured gap
    // (section height minus the sticky stage height), so the scrubbed
    // timeline and the pin can never disagree about where the scene ends.
    start: "top top",
    // The image parallax is a single axis: the active service image rests at
    // yPercent 0, an incoming one is pre-shifted to `mediaFromPercent` and an
    // outgoing one travels to `mediaToPercent`. One property in motion reads
    // as depth; pairing it with a simultaneous scale drift (as this used to)
    // reads as a wobble under a scrubbed, slightly-lagged playhead.
    compact: {
      scrub: 0.5,
      mediaFromPercent: 9,
      mediaToPercent: -9,
    },
    wide: {
      scrub: 0.8,
      mediaFromPercent: 12,
      mediaToPercent: -12,
    },
    // Releasing mid-transition settles onto the nearest card rather than
    // stranding one half-revealed. Snap only fires once scrolling actually
    // stops, so it never fights an in-progress drag.
    snap: {
      duration: { min: 0.15, max: 0.4 },
      ease: "power2.inOut",
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
