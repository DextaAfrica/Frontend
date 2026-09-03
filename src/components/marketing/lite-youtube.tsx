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
 * While playing, a close control (also Escape) returns to the poster and
 * unmounts the iframe, which stops playback outright — the visitor is never
 * trapped in the embed. Closing returns focus to the play button.
 *
 * The poster stays mounted underneath the iframe, so there's no white flash
 * while the YouTube player paints its first frame. Frame styling (border,
 * radius) lives in `.lite-youtube` in globals.css so a host surface — e.g. the
 * always-dark Dexta Clan band — can retune the hairline for its background.
 */
export function LiteYouTube({
  id,
  title,
  poster,
  className,
}: LiteYouTubeProps) {
  const [playing, setPlaying] = React.useState(false);
  const [ready, setReady] = React.useState(false);
  const playRef = React.useRef<HTMLButtonElement>(null);
  const closeRef = React.useRef<HTMLButtonElement>(null);

  const open = () => setPlaying(true);
  const close = React.useCallback(() => {
    setPlaying(false);
    setReady(false);
    // Return focus to where the interaction started.
    requestAnimationFrame(() => playRef.current?.focus());
  }, []);

  React.useEffect(() => {
    if (!playing) return;
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [playing, close]);

  return (
    <Reveal
      as="figure"
      className={cn(
        "lite-youtube group/video relative aspect-video overflow-hidden rounded-panel bg-brand-dark",
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
        <>
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`}
            title={title}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            loading="lazy"
            onLoad={() => setReady(true)}
            className={cn(
              "absolute inset-0 size-full transition-opacity duration-500 ease-premium",
              ready ? "opacity-100" : "opacity-0",
            )}
          />
          {!ready && (
            <span
              aria-hidden
              className="absolute top-1/2 left-1/2 size-8 -translate-x-1/2 -translate-y-1/2 animate-spin rounded-full border-2 border-white/30 border-t-white"
            />
          )}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 z-10 h-16 bg-gradient-to-b from-black/55 to-transparent"
          />
          <button
            ref={closeRef}
            type="button"
            onClick={close}
            aria-label="Close video"
            title="Close video"
            className="lite-youtube__close absolute top-3 right-3 z-10 grid size-9 place-items-center rounded-full border border-white/25 bg-black/55 text-white backdrop-blur-md transition-colors duration-[180ms] hover:border-white/50 hover:bg-black/80 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
          >
            <Icon name="close" size={16} />
          </button>
        </>
      ) : (
        <button
          ref={playRef}
          type="button"
          onClick={open}
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
