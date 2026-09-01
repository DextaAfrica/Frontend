"use client";

import * as React from "react";
import Image from "next/image";
import { Section } from "@/components/layout";
import { EditorialSectionHeading, Reveal } from "@/components/marketing";
import { Icon } from "@/components/ui";
import { homeMotion } from "@/config/home-motion";
import { gsap, useGSAP } from "@/lib/gsap";
import { isRemoteAsset } from "@/lib/media";
import { cn } from "@/lib/utils";
import type { HomePageContent, TestimonialContent } from "../types/home-page";

const motion = homeMotion.testimonials;

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");
}

function Avatar({ testimonial }: { testimonial: TestimonialContent }) {
  const shared =
    "testimonial-avatar mr-testimonial-quote mb-1 inline-block size-testimonial-avatar rounded-testimonial-avatar align-middle";

  if (testimonial.portrait) {
    return (
      <Image
        src={testimonial.portrait}
        alt={`Portrait of ${testimonial.author}`}
        width={70}
        height={70}
        unoptimized={isRemoteAsset(testimonial.portrait)}
        className={cn(shared, "object-cover")}
      />
    );
  }

  return (
    <span
      aria-hidden
      className={cn(shared, "testimonial-avatar--monogram place-items-center")}
    >
      {initials(testimonial.author)}
    </span>
  );
}

export function TestimonialSection({
  testimonials,
  heading,
}: {
  testimonials: readonly TestimonialContent[];
  heading: HomePageContent["testimonialSection"];
}) {
  const count = testimonials.length;
  const [active, setActive] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const [motionOn, setMotionOn] = React.useState(false);

  const rootRef = React.useRef<HTMLDivElement>(null);
  const stageRef = React.useRef<HTMLDivElement>(null);
  const dotsRef = React.useRef<HTMLDivElement>(null);
  const timelineRef = React.useRef<gsap.core.Timeline | null>(null);
  const progressRef = React.useRef(0);
  const prevActiveRef = React.useRef(0);
  const suppressRef = React.useRef({
    interact: false,
    hidden: false,
    offscreen: false,
  });
  const pausedRef = React.useRef(paused);

  const canCarousel = count > 1;

  const syncTimeline = React.useCallback(() => {
    const timeline = timelineRef.current;
    if (!timeline) return;
    const s = suppressRef.current;
    const running =
      !pausedRef.current && !s.interact && !s.hidden && !s.offscreen;
    if (running) timeline.resume();
    else timeline.pause();
  }, []);

  const setProgressVar = React.useCallback((value: number) => {
    progressRef.current = value;
    dotsRef.current?.style.setProperty("--testimonial-progress", String(value));
  }, []);

  const goTo = React.useCallback(
    (index: number) => {
      setActive(((index % count) + count) % count);
    },
    [count],
  );

  // Crossfade between quotes whenever `active` changes (motion allowed only).
  useGSAP(
    () => {
      if (!canCarousel) return;
      const stage = stageRef.current;
      if (!stage) return;

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        setMotionOn(true);
        stage.dataset.animated = "true";

        const slides = gsap.utils.toArray<HTMLElement>(
          stage.querySelectorAll("[data-slide]"),
        );
        const current = slides[active];
        const previous = slides[prevActiveRef.current];
        if (!current) return;

        // First run: GSAP now owns visibility, so pin every other slide hidden.
        if (!previous || previous === current) {
          gsap.set(current, { autoAlpha: 1, y: 0, filter: "none" });
          gsap.set(
            slides.filter((slide) => slide !== current),
            { autoAlpha: 0 },
          );
          prevActiveRef.current = active;
          return () => {
            setMotionOn(false);
            delete stage.dataset.animated;
          };
        }

        const caption = current.querySelector<HTMLElement>(
          "[data-slide-caption]",
        );
        const avatar = current.querySelector<HTMLElement>(
          ".testimonial-avatar",
        );

        const timeline = gsap.timeline();

        timeline.to(
          previous,
          {
            autoAlpha: 0,
            y: motion.out.y,
            filter: `blur(${motion.out.blur}px)`,
            duration: motion.out.duration,
            ease: "power2.in",
          },
          0,
        );

        timeline.fromTo(
          current,
          { autoAlpha: 0, y: motion.in.y, filter: `blur(${motion.in.blur}px)` },
          {
            autoAlpha: 1,
            y: 0,
            filter: "blur(0px)",
            duration: motion.in.duration,
            ease: motion.in.ease,
            clearProps: "filter",
          },
          motion.out.duration * 0.6,
        );

        if (avatar) {
          timeline.fromTo(
            avatar,
            { scale: motion.avatarScaleFrom },
            { scale: 1, duration: motion.in.duration, ease: "power2.out" },
            "<",
          );
        }
        if (caption) {
          timeline.fromTo(
            caption,
            { autoAlpha: 0, y: 8 },
            { autoAlpha: 1, y: 0, duration: 0.4, ease: "power2.out" },
            `>-${motion.in.captionOffset}`,
          );
        }

        prevActiveRef.current = active;

        return () => {
          setMotionOn(false);
          delete stage.dataset.animated;
        };
      });

      return () => mm.revert();
    },
    { scope: rootRef, dependencies: [active, canCarousel] },
  );

  // Segment timer: eases the fill to this segment's start, then travels to the
  // next dot over `dwell` seconds and advances. Rebuilt on every `active`
  // change so a click seeks smoothly; pause/resume is handled separately.
  useGSAP(
    () => {
      if (!canCarousel) return;
      const dots = dotsRef.current;
      if (!dots) return;

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const isLast = active === count - 1;
        const segmentStart = active / (count - 1);
        const segmentEnd = isLast ? 1 : (active + 1) / (count - 1);
        const proxy = { p: progressRef.current };

        const timeline = gsap.timeline({
          paused: true,
          onComplete: () => setActive((current) => (current + 1) % count),
        });

        if (Math.abs(proxy.p - segmentStart) > 0.001) {
          timeline.to(proxy, {
            p: segmentStart,
            duration: motion.wrapRewind,
            ease: "power2.inOut",
            onUpdate: () => setProgressVar(proxy.p),
          });
        } else {
          setProgressVar(segmentStart);
        }

        // For the last testimonial `segmentEnd === segmentStart === 1`: the fill
        // holds full while the timer runs, then `onComplete` wraps to 0.
        timeline.to(proxy, {
          p: segmentEnd,
          duration: motion.dwell,
          ease: "none",
          onUpdate: () => setProgressVar(proxy.p),
        });

        timelineRef.current = timeline;
        syncTimeline();

        return () => {
          timeline.kill();
          timelineRef.current = null;
        };
      });

      return () => mm.revert();
    },
    { scope: rootRef, dependencies: [active, count, canCarousel] },
  );

  // Pause when the tab is hidden or the section scrolls out of view.
  React.useEffect(() => {
    if (!canCarousel) return;
    const onVisibility = () => {
      suppressRef.current.hidden = document.hidden;
      syncTimeline();
    };
    document.addEventListener("visibilitychange", onVisibility);

    const root = rootRef.current;
    let observer: IntersectionObserver | undefined;
    if (root) {
      observer = new IntersectionObserver(
        ([entry]) => {
          suppressRef.current.offscreen = !entry?.isIntersecting;
          syncTimeline();
        },
        { threshold: 0.25 },
      );
      observer.observe(root);
    }

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      observer?.disconnect();
    };
  }, [canCarousel, syncTimeline]);

  // React to the play/pause control.
  React.useEffect(() => {
    pausedRef.current = paused;
    syncTimeline();
  }, [paused, syncTimeline]);

  // Reduced motion / no carousel: keep the fill line in sync without animation.
  React.useEffect(() => {
    if (motionOn || !canCarousel) return;
    setProgressVar(count > 1 ? active / (count - 1) : 0);
  }, [active, motionOn, canCarousel, count, setProgressVar]);

  const pauseForInteraction = (value: boolean) => {
    suppressRef.current.interact = value;
    syncTimeline();
  };

  return (
    <Section spacing="editorial" tone="default">
      <EditorialSectionHeading
        eyebrow={heading.eyebrow}
        title={heading.title}
        align="center"
        className="max-w-testimonial-heading"
      />

      <Reveal className="mx-auto mt-testimonial w-full max-w-testimonial-body">
        <div
          ref={rootRef}
          className="testimonial-carousel"
          role="group"
          aria-roledescription="carousel"
          aria-label={heading.title}
          onPointerEnter={() => pauseForInteraction(true)}
          onPointerLeave={() => pauseForInteraction(false)}
          onFocusCapture={() => pauseForInteraction(true)}
          onBlurCapture={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node)) {
              pauseForInteraction(false);
            }
          }}
        >
          <p className="sr-only" aria-live="polite">
            {`Testimonial ${active + 1} of ${count}: ${
              testimonials[active]?.author
            }, ${testimonials[active]?.role}`}
          </p>

          <div ref={stageRef} className="testimonial-stage">
            {testimonials.map((testimonial, index) => (
              <figure
                key={testimonial.id}
                data-slide
                data-active={index === active}
                aria-roledescription="slide"
                aria-label={`${index + 1} of ${count}`}
                aria-hidden={index !== active}
              >
                <blockquote className="text-testimonial leading-testimonial font-medium tracking-testimonial">
                  <Avatar testimonial={testimonial} />“{testimonial.quote}”
                </blockquote>
                <figcaption
                  data-slide-caption
                  className="mt-testimonial-meta text-testimonial-author leading-none font-light tracking-testimonial-author uppercase"
                >
                  <p>{testimonial.author}</p>
                  <p className="mt-2 text-text-subtle">{testimonial.role}</p>
                </figcaption>
              </figure>
            ))}
          </div>

          {canCarousel && (
            <div className="testimonial-controls">
              {motionOn && (
                <button
                  type="button"
                  className="testimonial-playpause"
                  aria-label={
                    paused ? "Play testimonials" : "Pause testimonials"
                  }
                  aria-pressed={paused}
                  onClick={() => setPaused((value) => !value)}
                >
                  <Icon name={paused ? "play" : "pause"} size={14} />
                </button>
              )}

              <div
                ref={dotsRef}
                className="testimonial-dots"
                role="group"
                aria-label="Select a testimonial"
                onKeyDown={(event) => {
                  if (event.key === "ArrowRight") {
                    event.preventDefault();
                    goTo(active + 1);
                  } else if (event.key === "ArrowLeft") {
                    event.preventDefault();
                    goTo(active - 1);
                  }
                }}
              >
                <span className="testimonial-track" aria-hidden />
                <span className="testimonial-track-fill" aria-hidden />
                {testimonials.map((testimonial, index) => (
                  <button
                    key={testimonial.id}
                    type="button"
                    data-dot
                    data-state={
                      index < active
                        ? "past"
                        : index === active
                          ? "active"
                          : "upcoming"
                    }
                    aria-label={`Show the testimonial from ${testimonial.author}`}
                    aria-current={index === active || undefined}
                    onClick={() => goTo(index)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </Reveal>
    </Section>
  );
}
