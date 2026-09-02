"use client";

import Image from "next/image";
import { useId, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { Icon } from "@/components/ui";
import { homeMotion } from "@/config/home-motion";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { isRemoteAsset } from "@/lib/media";
import type { ServiceContent } from "../types/home-page";

type ServiceSectionStyle = CSSProperties & { "--service-count": number };
type ServiceCardStyle = CSSProperties & { "--service-index": number };

export function ServicesSection({
  services,
}: {
  services: readonly ServiceContent[];
}) {
  const sectionId = useId();
  const sectionRef = useRef<HTMLElement>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section || services.length < 2) return;
      const media = gsap.matchMedia();
      const motion = homeMotion.services;

      media.add(
        {
          motion: motion.enabledMedia,
          compact: motion.compactMedia,
        },
        (context) => {
          const conditions = context.conditions as
            { motion?: boolean; compact?: boolean } | undefined;
          if (!conditions?.motion) return;
          const profile = conditions.compact ? motion.compact : motion.wide;
          const cards = gsap.utils.toArray<HTMLElement>(
            section.querySelectorAll("[data-service-card]"),
          );
          const expanded = gsap.utils.toArray<HTMLElement>(
            section.querySelectorAll("[data-service-expanded]"),
          );
          const collapsed = gsap.utils.toArray<HTMLElement>(
            section.querySelectorAll("[data-service-collapsed]"),
          );
          const images = gsap.utils.toArray<HTMLElement>(
            section.querySelectorAll("[data-service-media]"),
          );
          const firstCard = cards[0];
          const secondCard = cards[1];
          const stickyStage = section.querySelector<HTMLElement>(
            ".service-sticky-stage",
          );
          if (!firstCard || !secondCard || !stickyStage) return;

          let activeHeight = 0;
          let rowHeight = 0;
          const measureCards = () => {
            activeHeight = firstCard.getBoundingClientRect().height;
            rowHeight = secondCard.getBoundingClientRect().height;
          };
          measureCards();

          const layoutFor = (cardIndex: number, active: number) => {
            if (cardIndex < active) {
              return { height: rowHeight, y: cardIndex * rowHeight };
            }
            if (cardIndex === active) {
              return { height: activeHeight, y: active * rowHeight };
            }
            return {
              height: rowHeight,
              y:
                active * rowHeight +
                activeHeight +
                (cardIndex - active - 1) * rowHeight,
            };
          };

          // The active card must always render above every collapsed one —
          // guaranteed, not a side effect of array order. zIndex:index+1
          // alone means whichever card comes LAST in the list always sits
          // highest regardless of which one is actually active; if any
          // card's geometry is ever off by even a rounding pixel during a
          // scrubbed transition, a later, collapsed card can paint over the
          // active one. The active card explicitly outranks the rest here.
          gsap.set(cards, {
            position: "absolute",
            insetInline: 0,
            top: 0,
            zIndex: (index) => (index === 0 ? cards.length + 1 : index + 1),
            scale: 1,
            opacity: 1,
            transformOrigin: "50% 0%",
            height: (index) => layoutFor(index, 0).height,
            y: (index) => layoutFor(index, 0).y,
          });
          gsap.set(expanded, {
            autoAlpha: (index) => (index === 0 ? 1 : 0),
            y: (index) => (index === 0 ? 0 : 16),
          });
          gsap.set(collapsed, {
            autoAlpha: (index) => (index === 0 ? 0 : 1),
          });
          gsap.set(images, {
            force3D: true,
            scale: (index) => (index === 0 ? 1 : profile.mediaScale),
            yPercent: (index) => (index === 0 ? 0 : profile.mediaOffsetPercent),
          });

          const timeline = gsap.timeline({ paused: true });

          for (let nextIndex = 1; nextIndex < cards.length; nextIndex += 1) {
            const position = nextIndex - 1;
            const previousExpanded = expanded[nextIndex - 1];
            const previousCollapsed = collapsed[nextIndex - 1];
            const currentExpanded = expanded[nextIndex];
            const currentCollapsed = collapsed[nextIndex];
            const previousImage = images[nextIndex - 1];
            const currentImage = images[nextIndex];
            if (
              !previousExpanded ||
              !previousCollapsed ||
              !currentExpanded ||
              !currentCollapsed ||
              !previousImage ||
              !currentImage
            ) {
              continue;
            }

            timeline
              .to(
                previousExpanded,
                {
                  autoAlpha: 0,
                  y: -6,
                  duration: motion.contentTransition,
                  ease: "none",
                },
                position + motion.collapsedExitAt,
              )
              .to(
                previousCollapsed,
                {
                  autoAlpha: 1,
                  y: 0,
                  duration: motion.contentTransition,
                  ease: "none",
                },
                position + motion.collapsedExitAt,
              )
              .to(
                currentCollapsed,
                {
                  autoAlpha: 0,
                  y: -6,
                  duration: motion.contentTransition,
                  ease: "none",
                },
                position + motion.collapsedExitAt,
              )
              .to(
                currentExpanded,
                {
                  autoAlpha: 1,
                  y: 0,
                  duration: motion.contentTransition,
                  ease: "none",
                },
                position + motion.expandedEnterAt,
              )
              .to(
                previousImage,
                {
                  scale: profile.mediaExitScale,
                  yPercent: profile.mediaExitPercent,
                  duration: motion.cardTransition,
                  ease: "none",
                },
                position,
              )
              .to(
                currentImage,
                {
                  scale: 1,
                  yPercent: 0,
                  duration: motion.cardTransition,
                  ease: "none",
                },
                position,
              );

            cards.forEach((card, cardIndex) => {
              // Instant, not tweened: z-index isn't a property that means
              // anything "partway" between two values, so the about-to-be
              // active card should outrank every other one for this whole
              // transition, from its very first frame — not just once the
              // height/y tween below finishes.
              timeline.set(
                card,
                {
                  zIndex:
                    cardIndex === nextIndex ? cards.length + 1 : cardIndex + 1,
                },
                position,
              );
              timeline.to(
                card,
                {
                  height: () => layoutFor(cardIndex, nextIndex).height,
                  y: () => layoutFor(cardIndex, nextIndex).y,
                  duration: motion.cardTransition,
                  ease: "none",
                },
                position,
              );
            });
          }

          ScrollTrigger.addEventListener("refreshInit", measureCards);

          const trigger = ScrollTrigger.create({
            trigger: section,
            start: motion.start,
            // Not "bottom bottom": that ties the timeline's whole range to
            // the section's total height, which only matches the pin's
            // actual scroll room when the sticky stage happens to land
            // exactly viewport-tall — true some of the time (that's what
            // --service-active-height's clamp is aiming for), not
            // guaranteed on every real viewport height. Measuring the live
            // difference is what the browser's own `position: sticky` is
            // actually pinning for, so the timeline can never finish before
            // the section releases (the last card sitting fully revealed
            // with the scroll seemingly doing nothing) or the reverse.
            end: () => `+=${section.offsetHeight - stickyStage.offsetHeight}`,
            animation: timeline,
            scrub: profile.scrub,
            invalidateOnRefresh: true,
            onUpdate: ({ progress }) => {
              const completedTransitions = Math.floor(
                progress * (services.length - 1) + 0.0001,
              );
              const next = Math.min(services.length - 1, completedTransitions);
              setActiveIndex((current) => (current === next ? current : next));
            },
          });
          scrollTriggerRef.current = trigger;

          return () => {
            ScrollTrigger.removeEventListener("refreshInit", measureCards);
            scrollTriggerRef.current = null;
            trigger.kill();
            timeline.kill();
          };
        },
      );

      return () => media.revert();
    },
    { scope: sectionRef, dependencies: [services] },
  );

  const goToService = (index: number) => {
    const trigger = scrollTriggerRef.current;
    if (!trigger) {
      setActiveIndex(index);
      return;
    }
    const progress = services.length > 1 ? index / (services.length - 1) : 0;
    window.scrollTo({
      top: trigger.start + (trigger.end - trigger.start) * progress,
      behavior: "smooth",
    });
  };

  if (!services.length) return null;

  return (
    <section
      ref={sectionRef}
      className="service-scroll-section bg-background text-foreground"
      style={{ "--service-count": services.length } as ServiceSectionStyle}
      aria-labelledby={`${sectionId}-heading`}
    >
      <h2 id={`${sectionId}-heading`} className="sr-only">
        Our services
      </h2>

      <div className="service-sticky-stage px-page-gutter py-services">
        <div className="service-shell mx-auto w-full max-w-service-shell">
          <div className="service-card-stage">
            {services.map((service, index) => {
              const isActive = index === activeIndex;

              return (
                <article
                  id={`${sectionId}-${service.id}`}
                  key={service.id}
                  data-service-card
                  data-active={isActive || undefined}
                  // Sizing is fully owned by .service-card's own CSS rules
                  // (:first-child/:not(:first-child), driven by
                  // --service-active-height etc.) — a min-h-* utility here
                  // would only ever lose to that more specific rule, so it
                  // isn't one.
                  className="service-card relative isolate overflow-hidden bg-muted text-on-media"
                  style={
                    {
                      position: "relative",
                      "--service-index": index,
                    } as ServiceCardStyle
                  }
                  aria-current={isActive ? "step" : undefined}
                >
                  <Image
                    data-service-media
                    src={service.image}
                    alt=""
                    fill
                    priority={index === 0}
                    sizes="(min-width: 1440px) 1406px, (min-width: 1024px) 96vw, 100vw"
                    unoptimized={isRemoteAsset(service.image)}
                    className="object-cover"
                  />
                  <span className="service-media-overlay absolute inset-0" />

                  <div
                    data-service-expanded
                    className="service-expanded-content absolute inset-0 flex flex-col justify-between gap-6 p-service"
                  >
                    <div>
                      <p className="mb-4 font-mono text-service-label tracking-service-label uppercase [text-shadow:0_1px_12px_rgb(0_0_0/0.5)]">
                        {service.label}
                      </p>
                      <h3 className="max-w-[18ch] text-service-title leading-service-title font-semibold tracking-service-title [text-shadow:0_2px_20px_rgb(0_0_0/0.5)]">
                        {service.title}
                      </h3>
                    </div>
                    <p className="max-w-service-copy self-end text-service-copy leading-service-copy font-normal [text-shadow:0_1px_16px_rgb(0_0_0/0.45)]">
                      {service.description}
                    </p>
                  </div>

                  <button
                    data-service-collapsed
                    type="button"
                    tabIndex={isActive ? -1 : 0}
                    aria-label={`Show ${service.title}`}
                    onClick={() => goToService(index)}
                    className="service-collapsed-control group absolute inset-x-0 bottom-0 isolate flex h-service-row w-full items-center gap-5 px-service text-left text-foreground transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-inset"
                  >
                    <span className="font-mono text-xs tracking-service-label text-muted-foreground uppercase">
                      {service.label}
                    </span>
                    <span className="text-service-tab leading-tight">
                      {service.title}
                    </span>
                    <Icon
                      name="arrow-right"
                      className="ml-auto opacity-50 transition-[opacity,transform] duration-300 group-hover:translate-x-1 group-hover:opacity-100"
                    />
                  </button>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
