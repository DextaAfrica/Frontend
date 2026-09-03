"use client";

import * as React from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

// A heavier entrance than a plain fade+rise — more travel, a soft blur
// sharpening into focus — so arriving at a section reads as a deliberate,
// premium reveal. Every Reveal / RevealGroup site-wide gets this from here.
const REVEAL_FROM = { opacity: 0, y: 40, filter: "blur(8px)" };
const REVEAL_DURATION = 0.95;
const REVEAL_EASE = "power3.out";

// The resting state once the element has scrolled back out of view — dimmed,
// never gone. Deliberately not opacity 0 (would read as broken), and never
// visibility / display / autoAlpha: only opacity / y / blur ever move, so the
// content stays in the a11y tree and keyboard-reachable at all times. The
// `.reveal-fade:focus-within` rule in globals.css forces it back to full the
// instant focus lands inside, whatever the scroll state.
const REVEAL_REST = { opacity: 0.14, y: 16, filter: "blur(4px)" };
const REVEAL_OUT_DURATION = 0.55;
const REVEAL_OUT_EASE = "power2.inOut";

type RevealTag = "div" | "figure" | "article" | "span" | "li" | "ul";

export interface RevealProps extends React.HTMLAttributes<HTMLElement> {
  as?: RevealTag;
  delay?: number;
}

/**
 * Bidirectional scroll reveal. The element animates in whenever it enters the
 * viewport — from *either* scroll direction (`onEnter` / `onEnterBack`) — and
 * eases back down to a dim resting state whenever it leaves, either way
 * (`onLeave` / `onLeaveBack`). It's a live "you are here" cue that tracks the
 * scroll in both directions, every time — not a one-shot entrance.
 *
 * Fully inert under `prefers-reduced-motion`: the GSAP never runs, so the
 * content simply stays fully visible throughout.
 */
export function Reveal({
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
          force3D: true,
          overwrite: "auto",
        });
      const dim = () =>
        gsap.to(el, {
          ...REVEAL_REST,
          duration: REVEAL_OUT_DURATION,
          ease: REVEAL_OUT_EASE,
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
    <Tag ref={setRef} className={cn("reveal-fade", className)} {...props} />
  );
}

export interface RevealGroupProps extends React.HTMLAttributes<HTMLElement> {
  as?: RevealTag;
  /** Seconds between each child's reveal. */
  stagger?: number;
}

/**
 * `Reveal` for a set of children: staggers its `[data-reveal-item]`
 * descendants in on entrance (either scroll direction) and staggers them back
 * to the dim resting state on leaving (either direction). Same bidirectional,
 * scroll-tracking behaviour as {@link Reveal}.
 */
export function RevealGroup({
  as: Tag = "div",
  stagger = 0.14,
  className,
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
      gsap.set(items, REVEAL_FROM);

      const show = () =>
        gsap.to(items, {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: REVEAL_DURATION,
          ease: REVEAL_EASE,
          force3D: true,
          stagger,
          overwrite: "auto",
        });
      const dim = () =>
        gsap.to(items, {
          ...REVEAL_REST,
          duration: REVEAL_OUT_DURATION,
          ease: REVEAL_OUT_EASE,
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
    <Tag ref={setRef} className={cn("reveal-fade", className)} {...props} />
  );
}

export type RevealItemProps = React.HTMLAttributes<HTMLElement> & {
  as?: RevealTag;
};

/** A single staggered child of {@link RevealGroup}. Carries `reveal-fade` too
 * so the `:focus-within` safety net un-dims the individual item that gains
 * focus, not just the group. Must be a direct or nested descendant. */
export function RevealItem({
  as: Tag = "div",
  className,
  ...props
}: RevealItemProps) {
  return (
    <Tag data-reveal-item className={cn("reveal-fade", className)} {...props} />
  );
}

/**
 * `ScrollFade` / `ScrollFadeGroup` are aliases of `Reveal` / `RevealGroup` —
 * both are now the bidirectional reveal. Kept so existing call sites don't
 * churn; prefer `Reveal` / `RevealGroup` in new code.
 */
export const ScrollFade = Reveal;
export const ScrollFadeGroup = RevealGroup;
export type ScrollFadeGroupProps = RevealGroupProps;
