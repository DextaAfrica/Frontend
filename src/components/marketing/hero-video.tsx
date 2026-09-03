"use client";

import * as React from "react";
import Image from "next/image";
import { isRemoteAsset } from "@/lib/media";

export interface HeroVideoProps {
  /** Full-bleed ambient loop. Omit for an image-only hero — the poster then
   *  carries the frame on its own (with a slow push-in so it still feels
   *  alive). */
  video?: string;
  mobileVideo?: string;
  poster: string;
  /** `object-position` for the poster (and the video, once it loads) — the
   *  hero frame is almost always wider than the source photo, so `cover`
   *  crops top/bottom by default around the vertical centre. That's fine
   *  for a photo with room to spare on both sides, but wrong for one where
   *  the subject sits close to the top edge (a building's roofline) or the
   *  bottom — default is the CSS default (`50% 50%`, i.e. centred). */
  position?: string;
}

/**
 * The poster photo is the base layer and is always rendered via next/image,
 * so the hero never paints as an empty/black box — a stalled network
 * request, an unsupported codec, or a decode error on the video simply
 * leaves the static photo showing. The video is a fade-in enhancement
 * layered on top once it actually has a frame ready, and only plays at all
 * when the visitor hasn't asked for reduced motion.
 *
 * With no `video` the component is an image background: same full-bleed
 * frame, same colour grade and Ken Burns push-in applied to the poster
 * instead (see `.hero-video-media[data-video="false"]` in globals.css).
 */
export function HeroVideo({
  video,
  mobileVideo,
  poster,
  position,
}: HeroVideoProps) {
  const ref = React.useRef<HTMLVideoElement>(null);
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    element.play().catch(() => {});
  }, []);

  return (
    <div
      className="hero-video-media absolute inset-0 size-full overflow-hidden bg-brand-dark"
      data-video={video ? "true" : "false"}
    >
      <Image
        src={poster}
        alt=""
        fill
        priority
        sizes="100vw"
        style={position ? { objectPosition: position } : undefined}
        className="hero-video-media__poster object-cover"
        unoptimized={isRemoteAsset(poster)}
      />
      {video && (
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
          style={position ? { objectPosition: position } : undefined}
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
      )}
    </div>
  );
}
