"use client";

import * as React from "react";
import { Container } from "@/components/layout";
import { ButtonLink, HeroHeading, Icon } from "@/components/ui";
import { renderWithAccents } from "@/components/ui/typography";
import { gsap, useGSAP } from "@/lib/gsap";
import { HeroVideo } from "./hero-video";
import { Reveal } from "./reveal";

export interface LandingHeroSlide {
  titleLines: readonly string[];
  description: string;
}

export interface LandingHeroProps {
  badge: string;
  slides: readonly LandingHeroSlide[];
  primary: { label: string; href: string };
  secondary: { label: string; href: string };
  video: string;
  mobileVideo?: string;
  poster: string;
}

const AUTO_ADVANCE_MS = 7000;
const EXIT_DURATION = 0.5;

/**
 * The site's top hero: the showreel plays as a full-bleed ambient
 * background (autoplay, muted, looped — never a click-to-play panel), lightly
 * graded and slowly zooming so it feels alive. Copy is left-anchored within
 * the editorial reading column (not flush to the browser edge, and not
 * centered) so it lines up with every other section's content edge below it.
 *
 * The title/description rotate through `slides` on a timer, one video
 * serving all of them — same badge and CTAs throughout, only the message
 * changes. Each transition reuses the mount entrance's own choreography
 * (see the `enter` effect below) rather than a separate one-off animation,
 * so cycling through slides feels like the same considered reveal each
 * time, not a generic crossfade bolted on afterward.
 *
 * The exit is GSAP-driven and finishes via a genuine `onComplete` callback
 * before the slide index changes — not a `setTimeout` racing a CSS
 * transition — so the text is never swapped mid-animation and the two
 * phases (outgoing lines sliding up, incoming lines sliding in) never
 * overlap or fight over the same DOM nodes.
 *
 * Auto-advance pauses on hover/focus, is driven by a ref (not the `slides`
 * closure) so the interval never goes stale, and never starts at all under
 * `prefers-reduced-motion` — the `aria-live="polite"` region on the
 * description still announces each new slide as it lands for anyone using
 * a screen reader, even with no visible pagination UI.
 *
 * The scrim is left-to-right, not a flat wash over the whole frame: it darkens
 * only the left portion where the copy sits, fading to fully transparent by
 * roughly mid-frame — so the right side of the video stays genuinely vivid
 * instead of the whole shot reading as muted. A soft band at the top keeps
 * the header legible regardless of what's playing underneath it, and a
 * bright hairline marks the exact seam with the next section.
 */
export function LandingHero({
  badge,
  slides,
  primary,
  secondary,
  video,
  mobileVideo,
  poster,
}: LandingHeroProps) {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const introRef = React.useRef<HTMLDivElement>(null);
  const badgeRef = React.useRef<HTMLSpanElement>(null);
  const headingRef = React.useRef<HTMLDivElement>(null);
  const descriptionRef = React.useRef<HTMLParagraphElement>(null);
  const activeIndexRef = React.useRef(activeIndex);
  const isAnimatingRef = React.useRef(false);
  const pausedRef = React.useRef(false);

  React.useLayoutEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  const goToSlide = React.useCallback((nextIndex: number) => {
    if (nextIndex === activeIndexRef.current || isAnimatingRef.current) {
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setActiveIndex(nextIndex);
      return;
    }

    // The slide currently on screen, not the one we're going to — decides
    // whether this exit gets the commanding slide's extra punch.
    const leavingCommanding = activeIndexRef.current === 0;

    isAnimatingRef.current = true;
    const lines = gsap.utils.toArray<HTMLElement>(
      headingRef.current?.querySelectorAll("[data-hero-line-inner]") ?? [],
    );

    const exit = gsap.timeline({
      onComplete: () => {
        setActiveIndex(nextIndex);
        isAnimatingRef.current = false;
      },
    });

    if (lines.length) {
      exit.to(lines, {
        yPercent: -110,
        scale: leavingCommanding ? 1.05 : 1,
        transformOrigin: "50% 0%",
        duration: EXIT_DURATION,
        stagger: 0.06,
        ease: "power3.in",
      });
    }
    if (descriptionRef.current) {
      // Starts a beat after the heading begins leaving, not on the same
      // frame — two elements exiting in step read as a single flat block;
      // staggered by even a tenth of a second, it reads as layered.
      exit.to(
        descriptionRef.current,
        {
          opacity: 0,
          y: -10,
          filter: "blur(8px)",
          duration: EXIT_DURATION * 0.8,
          ease: "power2.in",
        },
        "<+0.1",
      );
    }
  }, []);

  // Entrance: replays on mount for slide 0, then again on every subsequent
  // slide change (the badge only ever plays once — its content never
  // changes, so re-animating it on every slide would just be noise).
  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }
      const lines = gsap.utils.toArray<HTMLElement>(
        headingRef.current?.querySelectorAll("[data-hero-line-inner]") ?? [],
      );

      const timeline = gsap.timeline({ delay: activeIndex === 0 ? 0.1 : 0 });

      if (activeIndex === 0 && badgeRef.current) {
        timeline.fromTo(
          badgeRef.current,
          { opacity: 0, scale: 0.8, y: 10, filter: "blur(6px)" },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.8,
            ease: "back.out(1.7)",
            clearProps: "filter",
          },
        );
      }

      if (lines.length) {
        // Slide 0 ("Welcome to Dexta Africa") gets a more forceful punch-in
        // — a slight overshoot on scale, not just a rise — to read as
        // commanding rather than the calmer, purely-vertical reveal every
        // other slide uses.
        timeline.fromTo(
          lines,
          activeIndex === 0
            ? { yPercent: 110, scale: 0.94, transformOrigin: "50% 100%" }
            : { yPercent: 110 },
          {
            yPercent: 0,
            scale: 1,
            duration: activeIndex === 0 ? 1.1 : 1.2,
            stagger: 0.14,
            ease: activeIndex === 0 ? "back.out(1.6)" : "power4.out",
            clearProps: "transform",
          },
          activeIndex === 0 ? "-=0.35" : 0,
        );
      }

      if (descriptionRef.current) {
        timeline.fromTo(
          descriptionRef.current,
          { opacity: 0, y: 14, filter: "blur(10px)" },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.9,
            ease: "power3.out",
            clearProps: "filter",
          },
          "-=0.55",
        );
      }
    },
    { scope: introRef, dependencies: [activeIndex] },
  );

  // Auto-advance — paused on hover/focus, off entirely under reduced motion.
  React.useEffect(() => {
    if (slides.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const id = window.setInterval(() => {
      if (pausedRef.current) return;
      goToSlide((activeIndexRef.current + 1) % slides.length);
    }, AUTO_ADVANCE_MS);

    return () => window.clearInterval(id);
  }, [slides.length, goToSlide]);

  const slide = slides[activeIndex] ?? slides[0];

  return (
    <section
      className="dexta-hero relative isolate flex items-center overflow-hidden bg-brand-dark text-on-media"
      onPointerEnter={() => {
        pausedRef.current = true;
      }}
      onPointerLeave={() => {
        pausedRef.current = false;
      }}
      onFocus={() => {
        pausedRef.current = true;
      }}
      onBlur={() => {
        pausedRef.current = false;
      }}
    >
      <HeroVideo video={video} mobileVideo={mobileVideo} poster={poster} />
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-black/45 via-black/10 to-transparent"
      />
      {/* Reading scrim: solid enough behind the copy column to stay legible
          against any frame of the video (a bright sky is as likely as a dark
          facade), tapering off well before the right edge so that side of
          the shot stays vivid rather than the whole frame reading muted. */}
      <span
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(to_right,rgb(6_6_6/0.88)_0%,rgb(6_6_6/0.74)_34%,rgb(6_6_6/0.38)_56%,transparent_78%)]"
      />

      <Container size="editorial" className="relative">
        <span
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-[10%] -z-10 h-[120%] w-[60%] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(ellipse_60%_60%_at_50%_50%,rgb(6_6_6/0.48),transparent_72%)]"
        />

        <div
          ref={introRef}
          className="relative flex max-w-2xl flex-col items-start gap-6 text-left"
        >
          <span
            ref={badgeRef}
            className="hero-badge inline-flex w-fit items-center gap-1.5 rounded-full border border-on-media-border bg-on-media-surface px-3 py-1.5 text-xs font-medium tracking-wide text-on-media backdrop-blur-md"
          >
            <Icon name="badge-check" size={14} />
            {badge}
          </span>

          <div ref={headingRef}>
            <HeroHeading
              data-commanding={activeIndex === 0 || undefined}
              className="[text-shadow:0_2px_28px_rgb(0_0_0/0.45)]"
            >
              {slide?.titleLines.map((line, index) => (
                <span key={index} className="block overflow-hidden py-1">
                  <span data-hero-line-inner className="block">
                    {renderWithAccents(line)}
                  </span>
                </span>
              ))}
            </HeroHeading>
          </div>

          {/* A plain <p>, not <Text>: <Text> bakes in text-muted-foreground,
              which — since cn() is a plain class-join, not a Tailwind-aware
              merge — can outrank a color passed in via className depending
              on which rule the stylesheet happens to declare later. Full
              control here avoids that fight entirely. */}
          <p
            ref={descriptionRef}
            aria-live="polite"
            className="max-w-xl font-sans text-base leading-6 text-pretty text-hero-copy transition-colors duration-500 ease-premium [text-shadow:0_1px_16px_rgb(0_0_0/0.4)] sm:text-lg"
          >
            {slide?.description}
          </p>

          <Reveal
            delay={0.85}
            className="flex flex-wrap items-center gap-3 pt-2"
          >
            <ButtonLink href={primary.href} size="lg">
              {primary.label}
              <Icon name="arrow-right" />
            </ButtonLink>
            <ButtonLink href={secondary.href} size="lg" variant="onMedia">
              {secondary.label}
            </ButtonLink>
          </Reveal>
        </div>
      </Container>

      <span
        aria-hidden
        className="absolute inset-x-0 bottom-0 z-10 h-px bg-gradient-to-r from-transparent via-on-media/40 to-transparent"
      />
    </section>
  );
}
