"use client";

import Image from "next/image";
import * as React from "react";
import { Icon } from "@/components/ui";
import { cn } from "@/lib/utils";
import { Reveal } from "./reveal";

export interface LiteYouTubeProps {
  /** The 11-character YouTube video id. */
  id: string;
  /** Used as the iframe title and the play button's accessible label. */
  title: string;
  /** Local poster image (16:9). Shown until the visitor clicks play. */
  poster: string;
  className?: string;
}

/**
 * A click-to-load YouTube embed. At rest it is just a local poster image and a
 * play button — no YouTube script, no iframe, no cookies, nothing from
 * youtube.com on the network. The first click swaps in the privacy-mode
 * (`youtube-nocookie.com`) iframe with `autoplay=1`; the click is the user
 * gesture that lets autoplay through.
 *
 * The poster stays mounted underneath the iframe, so there's no white flash
 * while the YouTube player paints its first frame.
 *
 * Framed to match the site's other rounded-panel media (`project-card`, the
 * about-teaser portrait): a hairline border, clipped corners, a slow poster
 * zoom on hover while it's still a facade.
 */
export function LiteYouTube({
  id,
  title,
  poster,
  className,
}: LiteYouTubeProps) {
  const [playing, setPlaying] = React.useState(false);

  return (
    <Reveal
      as="figure"
      className={cn(
        "group/video relative aspect-video overflow-hidden rounded-panel border border-border bg-brand-dark",
        className,
      )}
    >
      <Image
        src={poster}
        alt=""
        fill
        sizes="(min-width: 1024px) 45vw, 100vw"
        className="object-cover transition-transform duration-[1400ms] ease-premium group-hover/video:scale-[1.03]"
      />

      {playing ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`}
          title={title}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          loading="lazy"
          className="absolute inset-0 size-full"
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          aria-label={`Play video: ${title}`}
          className="absolute inset-0 size-full cursor-pointer focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-inset"
        >
          <span
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-black/25"
          />
          <span
            aria-hidden
            className="absolute top-1/2 left-1/2 grid size-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-primary text-primary-foreground shadow-[var(--control-shadow-glow)] transition-transform duration-[240ms] ease-premium group-hover/video:scale-110"
          >
            <Icon name="play" size={24} className="translate-x-0.5" />
          </span>
        </button>
      )}
    </Reveal>
  );
}
