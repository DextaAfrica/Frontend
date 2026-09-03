"use client";

import * as React from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

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

/** A single staggered child of RevealGroup (or ScrollFadeGroup below — both
 * key off the same [data-reveal-item] marker, so this is shared). Must be a
 * direct or nested descendant. */
export function RevealItem({ as: Tag = "div", ...props }: RevealItemProps) {
  return <Tag data-reveal-item {...props} />;
}

// The "left the viewport" resting state for ScrollFade/ScrollFadeGroup below
// — dimmed, never gone. Deliberately not opacity 0 (would read as broken,
// not "hidden"), and never `visibility`/`display`/`autoAlpha`: only
// opacity/y/blur ever move, so dimmed content stays in the a11y tree and
// reachable by keyboard/AT at all times — the `:focus-within` rule in
// globals.css (`.scroll-fade`) forces it back to full opacity the instant
// focus lands inside it, regardless of scroll state.
const FADE_REST = { opacity: 0.12, y: 16, filter: "blur(4px)" };
const FADE_OUT_DURATION = 0.6;
const FADE_OUT_EASE = "power2.inOut";

/**
 * `Reveal`'s bidirectional sibling: shows on entering the viewport from
 * *either* scroll direction (`onEnter`/`onEnterBack`) and dims back down on
 * leaving it either way (`onLeave`/`onLeaveBack`) — a live "where am I on
 * the page" cue rather than a one-time entrance. `Reveal`/`RevealGroup`
 * themselves are untouched: their one-shot guarantee is load-bearing for
 * several bespoke animations elsewhere, so this is a separate opt-in rather
 * than a change to their behaviour.
 *
 * Fully inert under `prefers-reduced-motion` — content simply stays fully
 * visible throughout, exactly like `Reveal` does.
 */
export function ScrollFade({
  as: Tag = "div",
  delay = 0,
  className,
  ...props
}: RevealProps) {
  const ref = React.useRef<HTMLElement>(null);
  const setRef = React.useCallback((node: HTMLElement | null) => {
    ref.current = node;
  }, []);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const el = ref.current;
      if (!el) return;
      gsap.set(el, REVEAL_FROM);

      const show = () =>
        gsap.to(el, {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: REVEAL_DURATION,
          delay,
          ease: REVEAL_EASE,
          overwrite: "auto",
        });
      const dim = () =>
        gsap.to(el, {
          ...FADE_REST,
          duration: FADE_OUT_DURATION,
          ease: FADE_OUT_EASE,
          overwrite: "auto",
        });

      const trigger = ScrollTrigger.create({
        trigger: el,
        start: "top 88%",
        end: "bottom 12%",
        onEnter: show,
        onEnterBack: show,
        onLeave: dim,
        onLeaveBack: dim,
      });
      return () => trigger.kill();
    });
    return () => mm.revert();
  }, [delay]);

  return (
    <Tag ref={setRef} className={cn("scroll-fade", className)} {...props} />
  );
}

export interface ScrollFadeGroupProps extends React.HTMLAttributes<HTMLElement> {
  as?: RevealTag;
  /** Seconds between each child's reveal. */
  stagger?: number;
}

/** `RevealGroup`'s bidirectional sibling — same [data-reveal-item] children
 * (via the shared `RevealItem`), staggered on entrance either direction,
 * dimmed (not hidden — see `FADE_REST` above) on leaving either direction. */
export function ScrollFadeGroup({
  as: Tag = "div",
  stagger = 0.14,
  className,
  ...props
}: ScrollFadeGroupProps) {
  const ref = React.useRef<HTMLElement>(null);
  const setRef = React.useCallback((node: HTMLElement | null) => {
    ref.current = node;
  }, []);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const items = ref.current?.querySelectorAll("[data-reveal-item]");
      if (!items?.length) return;
      gsap.set(items, REVEAL_FROM);

      const show = () =>
        gsap.to(items, {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: REVEAL_DURATION,
          ease: REVEAL_EASE,
          stagger,
          overwrite: "auto",
        });
      const dim = () =>
        gsap.to(items, {
          ...FADE_REST,
          duration: FADE_OUT_DURATION,
          ease: FADE_OUT_EASE,
          stagger: stagger / 2,
          overwrite: "auto",
        });

      const trigger = ScrollTrigger.create({
        trigger: ref.current,
        start: "top 88%",
        end: "bottom 12%",
        onEnter: show,
        onEnterBack: show,
        onLeave: dim,
        onLeaveBack: dim,
      });
      return () => trigger.kill();
    });
    return () => mm.revert();
  }, [stagger]);

  return (
    <Tag ref={setRef} className={cn("scroll-fade", className)} {...props} />
  );
}
