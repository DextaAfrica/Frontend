"use client";

import * as React from "react";
import Image from "next/image";
import { Section } from "@/components/layout";
import { EditorialSectionHeading, Reveal } from "@/components/marketing";
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
  const canCarousel = count > 1;

  const [active, setActive] = React.useState(0);
  const [motionOn, setMotionOn] = React.useState(false);

  const rootRef = React.useRef<HTMLDivElement>(null);
  const stageRef = React.useRef<HTMLDivElement>(null);
  const dotsRef = React.useRef<HTMLDivElement>(null);

  const timerRef = React.useRef<gsap.core.Timeline | null>(null);
  const transitionRef = React.useRef<gsap.core.Timeline | null>(null);
  const progressRef = React.useRef(0);
  const prevActiveRef = React.useRef(0);
  const suppressRef = React.useRef({
    interact: false,
    hidden: false,
    offscreen: false,
  });

  const setProgressVar = React.useCallback((value: number) => {
    progressRef.current = value;
    dotsRef.current?.style.setProperty("--testimonial-progress", String(value));
  }, []);

  const syncTimer = React.useCallback(() => {
    const timer = timerRef.current;
    if (!timer) return;
    const s = suppressRef.current;
    const run = !s.interact && !s.hidden && !s.offscreen;
    if (run) timer.resume();
    else timer.pause();
  }, []);

  const goTo = React.useCallback(
    (index: number) => setActive(((index % count) + count) % count),
    [count],
  );

  // Motion gate. Runs once (per `canCarousel`): opts in to animation, hands
  // slide visibility to GSAP, and pins every non-active slide hidden so the
  // stack collapses to one. `useGSAP` reverts all of this if motion is turned
  // off or the component unmounts.
  useGSAP(
    () => {
      if (!canCarousel) return;
      const stage = stageRef.current;
      if (!stage) return;

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const slides = gsap.utils.toArray<HTMLElement>(
          stage.querySelectorAll("[data-slide]"),
        );
        gsap.set(slides, { autoAlpha: 0 });
        gsap.set(slides[active] ?? [], { autoAlpha: 1, y: 0 });
        stage.dataset.animated = "true";
        setMotionOn(true);

        return () => {
          setMotionOn(false);
          delete stage.dataset.animated;
        };
      });

      return () => mm.revert();
    },
    { scope: rootRef, dependencies: [canCarousel] },
  );

  // Quote crossfade on every `active` change. Imperative (not in a matchMedia
  // scope) so a rapid change never reverts the transition mid-flight — the
  // previous timeline is simply killed and replaced.
  React.useEffect(() => {
    const from = prevActiveRef.current;
    prevActiveRef.current = active;
    if (!motionOn || from === active) return;

    const stage = stageRef.current;
    if (!stage) return;
    const slides = stage.querySelectorAll<HTMLElement>("[data-slide]");
    const outgoing = slides[from];
    const incoming = slides[active];
    if (!incoming) return;

    transitionRef.current?.kill();
    const tl = gsap.timeline();
    transitionRef.current = tl;

    if (outgoing) {
      tl.to(
        outgoing,
        {
          autoAlpha: 0,
          y: motion.out.y,
          filter: `blur(${motion.out.blur}px)`,
          duration: motion.out.duration,
          ease: "power2.in",
        },
        0,
      );
    }

    tl.fromTo(
      incoming,
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

    const avatar = incoming.querySelector<HTMLElement>(".testimonial-avatar");
    if (avatar) {
      tl.fromTo(
        avatar,
        { scale: motion.avatarScaleFrom },
        { scale: 1, duration: motion.in.duration, ease: "power2.out" },
        "<",
      );
    }
    const caption = incoming.querySelector<HTMLElement>("[data-slide-caption]");
    if (caption) {
      tl.fromTo(
        caption,
        { autoAlpha: 0, y: 8 },
        { autoAlpha: 1, y: 0, duration: 0.4, ease: "power2.out" },
        `>-${motion.in.captionOffset}`,
      );
    }
  }, [active, motionOn]);

  // Segment timer: eases the fill to this segment's start (covers the loop
  // wrap and dot clicks), then travels to the next dot over `dwell` seconds
  // and advances. Rebuilt per segment; pause/resume handled by `syncTimer`.
  React.useEffect(() => {
    if (!motionOn || !canCarousel) return;

    const start = active / (count - 1);
    const end = active === count - 1 ? 1 : (active + 1) / (count - 1);
    const proxy = { p: progressRef.current };

    const tl = gsap.timeline({
      paused: true,
      onComplete: () => setActive((current) => (current + 1) % count),
    });

    if (Math.abs(proxy.p - start) > 0.001) {
      tl.to(proxy, {
        p: start,
        duration: motion.wrapRewind,
        ease: "power2.inOut",
        onUpdate: () => setProgressVar(proxy.p),
      });
    } else {
      setProgressVar(start);
    }

    // Last testimonial: `end === start === 1`; the fill holds full while the
    // timer runs, then `onComplete` wraps back to the first.
    tl.to(proxy, {
      p: end,
      duration: motion.dwell,
      ease: "none",
      onUpdate: () => setProgressVar(proxy.p),
    });

    timerRef.current = tl;
    syncTimer();

    return () => {
      tl.kill();
      timerRef.current = null;
    };
  }, [active, motionOn, canCarousel, count, setProgressVar, syncTimer]);

  // Pause on hidden tab / off-screen section.
  React.useEffect(() => {
    if (!canCarousel) return;
    const onVisibility = () => {
      suppressRef.current.hidden = document.hidden;
      syncTimer();
    };
    document.addEventListener("visibilitychange", onVisibility);

    const root = rootRef.current;
    const observer = root
      ? new IntersectionObserver(
          ([entry]) => {
            suppressRef.current.offscreen = !entry?.isIntersecting;
            syncTimer();
          },
          { threshold: 0.25 },
        )
      : undefined;
    observer?.observe(root as Element);

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      observer?.disconnect();
    };
  }, [canCarousel, syncTimer]);

  // Reduced motion / no JS: keep the fill line meaningful without a timer.
  React.useEffect(() => {
    if (motionOn || !canCarousel) return;
    setProgressVar(active / (count - 1));
  }, [active, motionOn, canCarousel, count, setProgressVar]);

  const pauseForInteraction = (value: boolean) => {
    suppressRef.current.interact = value;
    syncTimer();
  };

  const activeItem = testimonials[active];

  return (
    <Section
      spacing="editorial"
      tone="default"
      aria-labelledby="testimonials-heading"
    >
      <EditorialSectionHeading
        eyebrow={heading.eyebrow}
        title={heading.title}
        align="center"
        className="max-w-testimonial-heading"
        headingId="testimonials-heading"
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
            {activeItem
              ? `Testimonial ${active + 1} of ${count}: ${activeItem.author}, ${activeItem.role}`
              : ""}
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
                  className="text-testimonial-author leading-none font-light tracking-testimonial-author uppercase"
                >
                  <p>{testimonial.author}</p>
                  <p className="mt-2 text-text-subtle">{testimonial.role}</p>
                </figcaption>
              </figure>
            ))}

            {canCarousel && (
              <div
                ref={dotsRef}
                className="testimonial-dots"
                role="group"
                aria-label="Select a testimonial"
                onKeyDown={(event) => {
                  const delta =
                    event.key === "ArrowRight"
                      ? 1
                      : event.key === "ArrowLeft"
                        ? -1
                        : 0;
                  if (!delta) return;
                  event.preventDefault();
                  const next = (((active + delta) % count) + count) % count;
                  goTo(next);
                  event.currentTarget
                    .querySelectorAll<HTMLButtonElement>("[data-dot]")
                    [next]?.focus();
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
            )}
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
