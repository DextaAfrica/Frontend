"use client";

import Image from "next/image";
import * as React from "react";
import { cn } from "@/lib/utils";

export interface YouTubeBackgroundProps {
  /** The 11-character YouTube video id. */
  id: string;
  /** Local poster image (any aspect — the container crops it). Shown until
   * (and, on a stalled/blocked embed, forever instead of) the video loads. */
  poster: string;
  className?: string;
}

/**
 * A muted, looping YouTube video used as a section's ambient backdrop — the
 * opposite of `LiteYouTube`: that component is deliberately click-to-play
 * and inert until a visitor asks for it (privacy-first, nothing from
 * youtube.com until then); this is decorative motion with no interaction
 * surface at all (`aria-hidden`, unfocusable).
 *
 * The poster is the base layer exactly like `HeroVideo`, so a stalled
 * network request or a blocked embed simply leaves the static photo
 * showing — the iframe is a fade-in enhancement on top of it, never the
 * only thing painting. Two safety gates before it loads at all:
 *   - Lazy: only mounts once the section is within a viewport-height of
 *     scrolling into view (IntersectionObserver), so a visitor who never
 *     reaches it never triggers the request.
 *   - `prefers-reduced-motion`: never mounts; the poster stands in for it.
 */
export function YouTubeBackground({
  id,
  poster,
  className,
}: YouTubeBackgroundProps) {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = React.useState(false);
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setShouldLoad(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "100% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const params = new URLSearchParams({
    autoplay: "1",
    mute: "1",
    loop: "1",
    playlist: id,
    controls: "0",
    modestbranding: "1",
    rel: "0",
    playsinline: "1",
    disablekb: "1",
    iv_load_policy: "3",
  });

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className={cn(
        "youtube-bg absolute inset-0 size-full overflow-hidden",
        className,
      )}
    >
      <Image
        src={poster}
        alt=""
        fill
        sizes="100vw"
        className="youtube-bg__poster object-cover"
      />
      {shouldLoad && (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?${params.toString()}`}
          title=""
          tabIndex={-1}
          allow="autoplay; encrypted-media"
          onLoad={() => setReady(true)}
          className={cn(
            "youtube-bg__frame absolute opacity-0 transition-opacity duration-700 ease-out",
            ready && "opacity-100",
          )}
        />
      )}
    </div>
  );
}
