"use client";

import Image from "next/image";
import * as React from "react";
import { gsap } from "@/lib/gsap";
import { isRemoteAsset } from "@/lib/media";

export interface ProjectGalleryImage {
  src: string;
  alt: string;
}

const CROSSFADE_DURATION = 0.5;
/** The frame's own width — deliberately bounded, not "however wide the
 *  layout column happens to be". A portrait aspect ratio stretched across
 *  a wide column turns into an enormous frame; capping the width first is
 *  what keeps a *portrait* photo looking like a portrait-sized frame
 *  instead of a wall panel. */
const FRAME_WIDTH = "26rem";

/**
 * A product-listing-style gallery, presented as a single bounded portrait
 * frame with a filmstrip of thumbnails beneath it — not a wide panel the
 * width of the page. The source photography here is portrait (roughly
 * 3:4), so the frame's aspect ratio matches it, but that ratio is only ever
 * applied to a *capped* width ({@link FRAME_WIDTH}); the same ratio on an
 * uncapped wide column is what made the frame balloon to an enormous
 * height in the first place.
 *
 * The photo itself never crops (`object-contain`) and never stretches
 * (`fill` + `contain` always preserves the source's own proportions) — full
 * resolution, full frame, exactly as supplied. A photo whose shape doesn't
 * exactly match the frame (a landscape exterior shot, say) still shows in
 * full, with a softly blurred, dimmed copy of the same photo filling
 * whatever space that leaves — an ambient backdrop, never flat dead space.
 *
 * Thumbnails sit in a horizontal filmstrip below the frame (never beside
 * it — a narrow frame has no room for a side rail) and stay a uniform
 * small square via `object-cover`; a tidy, even rail is the right call at
 * that size, and the full photo is only ever a click away in the frame.
 *
 * Clicking a thumbnail crossfades the frame's photo rather than replacing
 * it outright — both layers already mounted, opacity-swapped between them,
 * the same technique the homepage's own project spotlight uses. Instant
 * under `prefers-reduced-motion`, same rule as everywhere else in this
 * codebase: no motion is ever load-bearing for the content to appear.
 */
export function ProjectGallery({
  images,
}: {
  images: readonly ProjectGalleryImage[];
}) {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const activeIndexRef = React.useRef(0);
  const isAnimatingRef = React.useRef(false);
  const stageRef = React.useRef<HTMLDivElement>(null);

  React.useLayoutEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  const goTo = React.useCallback((nextIndex: number) => {
    if (nextIndex === activeIndexRef.current || isAnimatingRef.current) {
      return;
    }
    const layers = gsap.utils.toArray<HTMLElement>(
      stageRef.current?.querySelectorAll("[data-gallery-image]") ?? [],
    );
    const outgoing = layers[activeIndexRef.current];
    const incoming = layers[nextIndex];
    if (
      !outgoing ||
      !incoming ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setActiveIndex(nextIndex);
      return;
    }

    isAnimatingRef.current = true;
    gsap.killTweensOf(layers);
    gsap.set(incoming, { zIndex: 2 });
    gsap.set(outgoing, { zIndex: 1 });
    gsap.fromTo(
      incoming,
      { autoAlpha: 0 },
      {
        autoAlpha: 1,
        duration: CROSSFADE_DURATION,
        ease: "power2.out",
        onComplete: () => {
          isAnimatingRef.current = false;
        },
      },
    );
    gsap.to(outgoing, {
      autoAlpha: 0,
      duration: CROSSFADE_DURATION,
      ease: "power2.out",
    });
    setActiveIndex(nextIndex);
  }, []);

  if (!images.length) return null;

  const active = images[activeIndex] ?? images[0];
  const counterLabel = `${String(activeIndex + 1).padStart(2, "0")} / ${String(images.length).padStart(2, "0")}`;
  const showThumbs = images.length > 1;

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        ref={stageRef}
        style={{ maxWidth: FRAME_WIDTH }}
        className="project-gallery-stage relative aspect-[3/4] w-full overflow-hidden rounded-panel border border-border bg-muted shadow-[var(--card-shadow)]"
      >
        {images.map((image, index) => (
          <div
            key={image.src}
            data-gallery-image
            className="absolute inset-0"
            style={{ opacity: index === 0 ? 1 : 0 }}
          >
            {/* Ambient backdrop: a blurred, dimmed cover-fit of the same
                photo, so a shape that doesn't exactly match the frame
                never leaves flat, empty letterboxing. */}
            <Image
              src={image.src}
              alt=""
              aria-hidden
              fill
              sizes={FRAME_WIDTH}
              unoptimized={isRemoteAsset(image.src)}
              className="project-gallery-backdrop object-cover"
            />
            {/* The photo itself, at full quality, full frame — never
                cropped, never stretched. */}
            <Image
              src={image.src}
              alt={image.alt}
              fill
              quality={90}
              priority={index === 0}
              sizes={FRAME_WIDTH}
              unoptimized={isRemoteAsset(image.src)}
              className="relative object-contain"
            />
          </div>
        ))}
        {images.length > 1 && (
          <div className="absolute inset-x-0 bottom-0 z-10 flex items-center justify-between gap-4 bg-gradient-to-t from-black/65 to-transparent px-4 py-3 text-on-media">
            <p className="truncate text-sm">{active?.alt}</p>
            <p className="shrink-0 font-mono text-xs tracking-project-index">
              {counterLabel}
            </p>
          </div>
        )}
      </div>

      {showThumbs && (
        <div
          style={{ maxWidth: FRAME_WIDTH }}
          className="flex w-full snap-x snap-mandatory gap-3 overflow-x-auto pb-1"
        >
          {images.map((image, index) => (
            <button
              key={image.src}
              type="button"
              onClick={() => goTo(index)}
              aria-current={index === activeIndex ? "true" : undefined}
              aria-label={`Show ${image.alt}`}
              data-active={index === activeIndex || undefined}
              className="project-gallery-thumb relative aspect-square w-16 shrink-0 snap-start overflow-hidden rounded-md"
            >
              <Image
                src={image.src}
                alt=""
                fill
                sizes="64px"
                unoptimized={isRemoteAsset(image.src)}
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
