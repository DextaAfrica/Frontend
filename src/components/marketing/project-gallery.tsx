"use client";

import Image from "next/image";
import * as React from "react";
import { gsap } from "@/lib/gsap";
import { isRemoteAsset } from "@/lib/media";
import { cn } from "@/lib/utils";

export interface ProjectGalleryImage {
  src: string;
  alt: string;
}

const CROSSFADE_DURATION = 0.5;

/**
 * A product-listing-style gallery: one large primary photo with a thumbnail
 * rail beside it (below it on mobile) — clicking a thumbnail crossfades the
 * primary image rather than replacing it outright, the same "both layers
 * already mounted, opacity-swap between them" technique as the homepage
 * spotlight's own per-project photo carousel.
 *
 * Under `prefers-reduced-motion` the swap is instant — no crossfade — same
 * safety rule as everywhere else in this codebase: the resting CSS state is
 * always the visible one, GSAP only ever sets a momentary starting point
 * when it actually runs.
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

  return (
    <div className="grid gap-4 lg:grid-cols-[6.5rem_1fr]">
      <div
        ref={stageRef}
        className="project-gallery-stage relative aspect-[4/3] overflow-hidden rounded-panel bg-muted lg:order-2 lg:aspect-[16/10]"
      >
        {images.map((image, index) => (
          <div
            key={image.src}
            data-gallery-image
            className="absolute inset-0"
            style={{ opacity: index === 0 ? 1 : 0 }}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              priority={index === 0}
              sizes="(min-width: 1024px) 70vw, 100vw"
              unoptimized={isRemoteAsset(image.src)}
              className="object-cover"
            />
          </div>
        ))}
        {images.length > 1 && (
          <div className="absolute inset-x-0 bottom-0 z-10 flex items-center justify-between gap-4 bg-gradient-to-t from-black/65 to-transparent px-4 py-3 text-on-media">
            <p className="text-sm">{active?.alt}</p>
            <p className="font-mono text-xs tracking-project-index">
              {counterLabel}
            </p>
          </div>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1 lg:order-1 lg:flex-col lg:overflow-visible lg:pb-0">
          {images.map((image, index) => (
            <button
              key={image.src}
              type="button"
              onClick={() => goTo(index)}
              aria-current={index === activeIndex ? "true" : undefined}
              aria-label={`Show ${image.alt}`}
              data-active={index === activeIndex || undefined}
              className={cn(
                "project-gallery-thumb relative aspect-square w-20 shrink-0 overflow-hidden rounded-md lg:w-full",
              )}
            >
              <Image
                src={image.src}
                alt=""
                fill
                sizes="80px"
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
