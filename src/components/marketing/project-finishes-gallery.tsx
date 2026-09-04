"use client";

import * as React from "react";
import { gsap } from "@/lib/gsap";
import { ProjectGallery, type ProjectGalleryImage } from "./project-gallery";

export interface ProjectFinishesGalleryProps {
  interior: readonly ProjectGalleryImage[];
  exterior: readonly ProjectGalleryImage[];
  interiorLabel?: string;
  exteriorLabel?: string;
}

const SWAP_DURATION = 0.28;

/**
 * Two labeled photo sets under one gallery, the way a real listing actually
 * separates finishes — interior and exterior, switched with a segmented
 * pill toggle (the same sliding-thumb recipe as the site's own theme
 * toggle) rather than dumping every photo into one undifferentiated pile.
 *
 * Switching sets crossfades the whole stage (not just swaps it outright)
 * before handing off to a fresh {@link ProjectGallery} — `key={tab}` forces
 * a clean remount so the new set always opens on its own first photo,
 * never mid-way through wherever the previous set's selection happened to
 * land. Instant under `prefers-reduced-motion`, same rule as everywhere
 * else in this codebase: no motion is ever load-bearing for the content to
 * actually appear.
 *
 * The two tabs get different frame shapes on purpose: interior finish
 * photography is portrait, exterior/elevation photography is landscape —
 * one fixed ratio for both would letterbox whichever set doesn't match it
 * down to a sliver in the middle of a mostly-empty frame.
 */
export function ProjectFinishesGallery({
  interior,
  exterior,
  interiorLabel = "Interior Finishes",
  exteriorLabel = "Exterior Finishes",
}: ProjectFinishesGalleryProps) {
  const hasInterior = interior.length > 0;
  const hasExterior = exterior.length > 0;
  const [tab, setTab] = React.useState<"interior" | "exterior">(
    hasInterior ? "interior" : "exterior",
  );
  const stageRef = React.useRef<HTMLDivElement>(null);

  const goToTab = React.useCallback(
    (next: "interior" | "exterior") => {
      if (next === tab) return;
      const stage = stageRef.current;
      if (
        !stage ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        setTab(next);
        return;
      }
      gsap.killTweensOf(stage);
      gsap.to(stage, {
        opacity: 0,
        y: 8,
        duration: SWAP_DURATION,
        ease: "power2.in",
        onComplete: () => {
          setTab(next);
          gsap.fromTo(
            stage,
            { opacity: 0, y: 8 },
            { opacity: 1, y: 0, duration: SWAP_DURATION, ease: "power2.out" },
          );
        },
      });
    },
    [tab],
  );

  if (!hasInterior && !hasExterior) return null;

  const images = tab === "interior" ? interior : exterior;

  return (
    <div>
      {hasInterior && hasExterior && (
        <div
          role="tablist"
          aria-label="Finishes"
          data-active={tab}
          className="project-finishes-toggle"
        >
          <span aria-hidden className="project-finishes-toggle__thumb" />
          <button
            type="button"
            role="tab"
            aria-selected={tab === "interior"}
            onClick={() => goToTab("interior")}
            className="project-finishes-toggle__option"
          >
            {interiorLabel}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === "exterior"}
            onClick={() => goToTab("exterior")}
            className="project-finishes-toggle__option"
          >
            {exteriorLabel}
          </button>
        </div>
      )}

      <div ref={stageRef} className="mt-8">
        <ProjectGallery
          key={tab}
          images={images}
          aspectClassName={tab === "interior" ? "aspect-[3/4]" : "aspect-video"}
        />
      </div>
    </div>
  );
}
