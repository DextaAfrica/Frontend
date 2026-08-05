"use client";

import * as React from "react";

export interface HeroVideoProps {
  video: string;
  mobileVideo?: string;
  poster?: string;
}

/**
 * Plays only when the visitor hasn't asked for reduced motion — playback is
 * started imperatively rather than via the `autoPlay` attribute so a
 * reduced-motion visitor simply sees the poster image, never the clip.
 */
export function HeroVideo({ video, mobileVideo, poster }: HeroVideoProps) {
  const ref = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    element.play().catch(() => {});
  }, []);

  return (
    <video
      ref={ref}
      muted
      loop
      playsInline
      preload="metadata"
      poster={poster}
      aria-hidden="true"
      className="absolute inset-0 size-full object-cover"
    >
      {mobileVideo && (
        <source
          media="(max-width: 767px)"
          src={mobileVideo}
          type="video/webm"
        />
      )}
      <source src={video} type="video/webm" />
    </video>
  );
}
