"use client";

import * as React from "react";
import { gsap, useGSAP } from "@/lib/gsap";

// A heavier entrance than a plain fade+rise — more travel, a soft blur
// sharpening into focus — so arriving at a section reads as a deliberate,
// premium reveal rather than a barely-there fade. Every consumer of
// Reveal/RevealGroup site-wide gets this from one place.
const REVEAL_FROM = { opacity: 0, y: 40, filter: "blur(8px)" };
const REVEAL_DURATION = 0.95;
const REVEAL_EASE = "power3.out";

type RevealTag = "div" | "figure" | "article" | "span" | "li";

export interface RevealProps extends React.HTMLAttributes<HTMLElement> {
  as?: RevealTag;
  delay?: number;
}

/** Fades and slides an element in the first time it enters the viewport. */
export function Reveal({ as: Tag = "div", delay = 0, ...props }: RevealProps) {
  const ref = React.useRef<HTMLElement>(null);
  const setRef = React.useCallback((node: HTMLElement | null) => {
    ref.current = node;
  }, []);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(ref.current, REVEAL_FROM, {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: REVEAL_DURATION,
        delay,
        ease: REVEAL_EASE,
        force3D: true,
        clearProps: "transform,filter,willChange",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 88%",
          once: true,
        },
      });
    });
    return () => mm.revert();
  }, [delay]);

  return <Tag ref={setRef} {...props} />;
}

export interface RevealGroupProps extends React.HTMLAttributes<HTMLElement> {
  as?: RevealTag;
  /** Seconds between each child's reveal. */
  stagger?: number;
}

/** Reveals its [data-reveal-item] children in sequence as the group enters the viewport. */
export function RevealGroup({
  as: Tag = "div",
  stagger = 0.14,
  ...props
}: RevealGroupProps) {
  const ref = React.useRef<HTMLElement>(null);
  const setRef = React.useCallback((node: HTMLElement | null) => {
    ref.current = node;
  }, []);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const items = ref.current?.querySelectorAll("[data-reveal-item]");
      if (!items?.length) return;

      gsap.fromTo(items, REVEAL_FROM, {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: REVEAL_DURATION,
        ease: REVEAL_EASE,
        force3D: true,
        clearProps: "transform,filter,willChange",
        stagger,
        scrollTrigger: {
          trigger: ref.current,
          start: "top 88%",
          once: true,
        },
      });
    });
    return () => mm.revert();
  }, [stagger]);

  return <Tag ref={setRef} {...props} />;
}

export type RevealItemProps = React.HTMLAttributes<HTMLElement> & {
  as?: RevealTag;
};

/** A single staggered child of RevealGroup. Must be a direct or nested descendant. */
export function RevealItem({ as: Tag = "div", ...props }: RevealItemProps) {
  return <Tag data-reveal-item {...props} />;
}
