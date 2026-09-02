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
          const stage = section.querySelector<HTMLElement>(
            ".service-card-stage",
          );
          const stickyStage = section.querySelector<HTMLElement>(
            ".service-sticky-stage",
          );
          const rowProbe =
            section.querySelector<HTMLElement>("[data-service-row]");
          if (cards.length < 2 || !stage || !stickyStage || !rowProbe) return;

          const lastIndex = cards.length - 1;

          // rowHeight comes off the probe span (CSS-sized, never animated);
          // activeHeight is whatever's left of the card stage once the
          // collapsed rows are subtracted — i.e. the resolved value of
          // --service-active-height, without trusting a card GSAP may be
          // mid-tween on.
          let activeHeight = 0;
          let rowHeight = 0;
          const measure = () => {
            rowHeight = rowProbe.getBoundingClientRect().height;
            activeHeight =
              stage.getBoundingClientRect().height - lastIndex * rowHeight;
          };
          measure();

          // Only the top edge (`y`) moves now — never `height`. Cards already
          // seen collapse to a row at the top, the active card sits at full
          // height right below them, the rest stack as rows underneath it.
          const yFor = (index: number, active: number) => {
            if (index <= active) return index * rowHeight;
            return (
              active * rowHeight +
              activeHeight +
              (index - active - 1) * rowHeight
            );
          };

          // The active card is fully open; every other card is clipped down
          // to just its top row. clip-path is a compositor property, so this
          // is the whole reveal with no per-frame layout.
          const clipFor = (index: number, active: number) =>
            index === active
              ? "inset(0px 0px 0px 0px)"
              : `inset(0px 0px ${Math.max(0, activeHeight - rowHeight)}px 0px)`;

          // The active card always outranks the rest outright, rather than
          // relying on paint order — a collapsed neighbour can never bleed
          // over it even if a scrubbed frame lands a rounding pixel off.
          const zFor = (index: number, active: number) =>
            index === active ? cards.length + 1 : index + 1;

          gsap.set(cards, {
            position: "absolute",
            insetInline: 0,
            top: 0,
            height: activeHeight,
            force3D: true,
            transformOrigin: "50% 0%",
            y: (index) => yFor(index, 0),
            clipPath: (index) => clipFor(index, 0),
            zIndex: (index) => zFor(index, 0),
          });
          gsap.set(expanded, {
            autoAlpha: (index) => (index === 0 ? 1 : 0),
            y: (index) => (index === 0 ? 0 : 12),
          });
          gsap.set(collapsed, {
            autoAlpha: (index) => (index === 0 ? 0 : 1),
            y: 0,
          });
          gsap.set(images, {
            force3D: true,
            yPercent: (index) => (index === 0 ? 0 : profile.mediaFromPercent),
          });

          const timeline = gsap.timeline({
            paused: true,
            defaults: { ease: "none" },
          });

          for (let next = 1; next < cards.length; next += 1) {
            const at = next - 1;
            const prevExpanded = expanded[next - 1];
            const prevCollapsed = collapsed[next - 1];
            const currentExpanded = expanded[next];
            const currentCollapsed = collapsed[next];
            const prevImage = images[next - 1];
            const currentImage = images[next];

            cards.forEach((card, index) => {
              timeline.set(card, { zIndex: zFor(index, next) }, at);
              timeline.to(
                card,
                {
                  y: () => yFor(index, next),
                  clipPath: () => clipFor(index, next),
                  duration: motion.cardTransition,
                },
                at,
              );
            });

            if (
              prevExpanded &&
              prevCollapsed &&
              currentExpanded &&
              currentCollapsed
            ) {
              timeline
                .to(
                  prevExpanded,
                  { autoAlpha: 0, y: -6, duration: motion.contentTransition },
                  at + motion.collapsedExitAt,
                )
                .to(
                  prevCollapsed,
                  { autoAlpha: 1, y: 0, duration: motion.contentTransition },
                  at + motion.collapsedExitAt,
                )
                .to(
                  currentCollapsed,
                  { autoAlpha: 0, y: -6, duration: motion.contentTransition },
                  at + motion.collapsedExitAt,
                )
                .to(
                  currentExpanded,
                  { autoAlpha: 1, y: 0, duration: motion.contentTransition },
                  at + motion.expandedEnterAt,
                );
            }

            if (prevImage && currentImage) {
              timeline
                .to(
                  prevImage,
                  {
                    yPercent: profile.mediaToPercent,
                    duration: motion.cardTransition,
                  },
                  at,
                )
                .to(
                  currentImage,
                  { yPercent: 0, duration: motion.cardTransition },
                  at,
                );
            }
          }

          const trigger = ScrollTrigger.create({
            trigger: section,
            start: motion.start,
            // Exactly the pin's own scroll room: the section is
            // `100svh + (count - 1) * step` tall and the sticky stage is
            // `100svh`, so this gap is `(count - 1) * step` — measured live so
            // it stays correct through a resize or a late font swap.
            end: () => `+=${section.offsetHeight - stickyStage.offsetHeight}`,
            animation: timeline,
            scrub: profile.scrub,
            invalidateOnRefresh: true,
            onRefreshInit: measure,
            snap: {
              snapTo: lastIndex > 0 ? 1 / lastIndex : 1,
              duration: motion.snap.duration,
              ease: motion.snap.ease,
            },
            onUpdate: ({ progress }) => {
              const next = Math.min(
                lastIndex,
                Math.floor(progress * lastIndex + 0.0001),
              );
              setActiveIndex((current) => (current === next ? current : next));
            },
          });
          scrollTriggerRef.current = trigger;

          return () => {
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
                  // Resting size comes from .service-card's own CSS
                  // (:first-child / :not(:first-child)); once the scroll
                  // timeline mounts, GSAP owns height / y / clip-path. A
                  // min-h-* utility here would only fight both.
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
                    // top-0, not bottom-0: every card is full height now and
                    // clipped down to its top row when collapsed, so the
                    // control has to live in that visible top band.
                    className="service-collapsed-control group absolute inset-x-0 top-0 isolate flex h-service-row w-full items-center gap-5 px-service text-left text-foreground transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-inset"
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

            {/* CSS-sized to --layout-service-row-height; the scroll script
                measures this instead of a card it may be animating. */}
            <span aria-hidden data-service-row className="service-row-metric" />
          </div>
        </div>
      </div>
    </section>
  );
}
