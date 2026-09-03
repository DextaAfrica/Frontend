/** Responsive homepage motion values shared by marketing primitives and features. */
export const homeMotion = {
  intro: {
    enabledMedia: "(prefers-reduced-motion: no-preference)",
    desktopMedia: "(min-width: 64rem)",
    /** Resting opacity of a not-yet-revealed word. */
    mutedOpacity: 0.2,
    /** How far each word rises into place, in em. */
    wordOffsetEm: 0.5,
    /**
     * Fraction of the whole scrubbed range one word's transition occupies —
     * lower means a cleaner cascade with fewer words mid-move at once (0.24
     * had ~8 overlapping and read as mush).
     */
    wordTransitionSpan: 0.14,
    /* The stage stays compact (~28–32vh). The reveal range deliberately
       spans more than the section itself — it starts as the copy enters
       (top 82%) and finishes as the section clears the middle of the
       viewport (bottom 55%), so the cascade has room to breathe without the
       section ever needing to be tall. */
    desktop: { start: "top 82%", end: "bottom 52%", scrub: 0.7 },
    compact: { start: "top 85%", end: "bottom 60%", scrub: 0.5 },
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
