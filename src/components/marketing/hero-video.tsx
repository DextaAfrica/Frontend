"use client";

import * as React from "react";
import Image from "next/image";

export interface HeroVideoProps {
  video: string;
  mobileVideo?: string;
  poster: string;
}

/**
 * The poster photo is the base layer and is always rendered via next/image,
 * so the hero never paints as an empty/black box — a stalled network
 * request, an unsupported codec, or a decode error on the video simply
 * leaves the static photo showing. The video is a fade-in enhancement
 * layered on top once it actually has a frame ready, and only plays at all
 * when the visitor hasn't asked for reduced motion.
 */
export function HeroVideo({ video, mobileVideo, poster }: HeroVideoProps) {
  const ref = React.useRef<HTMLVideoElement>(null);
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    element.play().catch(() => {});
  }, []);

  return (
    <div className="hero-video-media absolute inset-0 size-full overflow-hidden bg-brand-dark">
      <Image
        src={poster}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <video
        ref={ref}
        muted
        loop
        playsInline
        preload="metadata"
        poster={poster}
        aria-hidden="true"
        onCanPlay={() => setReady(true)}
        onError={() => setReady(false)}
        className="absolute inset-0 size-full object-cover opacity-0 transition-opacity duration-700 ease-out data-[ready=true]:opacity-100"
        data-ready={ready}
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
    </div>
  );
}
