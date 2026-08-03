"use client";

import Image from "next/image";
import { useId, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { Icon } from "@/components/ui";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { isRemoteAsset } from "@/lib/media";
import type { ServiceContent } from "../types/home-page";

type ServiceSectionStyle = CSSProperties & {
  "--service-count": number;
};

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

      media.add(
        "(min-width: 64rem) and (prefers-reduced-motion: no-preference)",
        () => {
          const cards = gsap.utils.toArray<HTMLElement>(
            section.querySelectorAll("[data-service-card]"),
          );
          const expandedContent = gsap.utils.toArray<HTMLElement>(
            section.querySelectorAll("[data-service-expanded]"),
          );
          const collapsedControls = gsap.utils.toArray<HTMLElement>(
            section.querySelectorAll("[data-service-collapsed]"),
          );
          const mediaElements = gsap.utils.toArray<HTMLElement>(
            section.querySelectorAll("[data-service-media]"),
          );

          const activeHeight = cards[0]?.getBoundingClientRect().height ?? 0;
          const rowHeight = cards[1]?.getBoundingClientRect().height ?? 0;
          const cardTop = (cardIndex: number, expandedIndex: number) => {
            if (cardIndex <= expandedIndex) return cardIndex * rowHeight;
            return (
              expandedIndex * rowHeight +
              activeHeight +
              (cardIndex - expandedIndex - 1) * rowHeight
            );
          };

          gsap.set(cards, {
            position: "absolute",
            insetInline: 0,
            top: 0,
            height: (index) => (index === 0 ? activeHeight : rowHeight),
            y: (index) => cardTop(index, 0),
            zIndex: (index) => index + 1,
          });
          gsap.set(expandedContent, {
            autoAlpha: (index) => (index === 0 ? 1 : 0),
            y: (index) => (index === 0 ? 0 : 18),
          });
          gsap.set(collapsedControls, {
            autoAlpha: (index) => (index === 0 ? 0 : 1),
            y: 0,
          });
          gsap.set(mediaElements, {
            scale: (index) => (index === 0 ? 1 : 1.035),
            yPercent: (index) => (index === 0 ? 0 : 3),
          });

          const timeline = gsap.timeline({ paused: true });

          for (let index = 1; index < cards.length; index += 1) {
            const previousIndex = index - 1;
            const position = previousIndex;
            const previousExpanded = expandedContent[previousIndex];
            const currentExpanded = expandedContent[index];
            const previousCollapsed = collapsedControls[previousIndex];
            const currentCollapsed = collapsedControls[index];
            const previousMedia = mediaElements[previousIndex];
            const currentMedia = mediaElements[index];

            if (
              !previousExpanded ||
              !currentExpanded ||
              !previousCollapsed ||
              !currentCollapsed ||
              !previousMedia ||
              !currentMedia
            ) {
              continue;
            }

            timeline
              .to(
                previousExpanded,
                {
                  autoAlpha: 0,
                  y: -18,
                  duration: 0.45,
                  ease: "none",
                },
                position,
              )
              .to(
                previousCollapsed,
                {
                  autoAlpha: 1,
                  y: 0,
                  duration: 0.45,
                  ease: "none",
                },
                position + 0.55,
              )
              .to(
                currentCollapsed,
                {
                  autoAlpha: 0,
                  y: -12,
                  duration: 0.35,
                  ease: "none",
                },
                position,
              )
              .to(
                currentExpanded,
                {
                  autoAlpha: 1,
                  y: 0,
                  duration: 0.55,
                  ease: "none",
                },
                position + 0.45,
              )
              .to(
                previousMedia,
                { scale: 1.035, yPercent: -3, duration: 1, ease: "none" },
                position,
              )
              .to(
                currentMedia,
                { scale: 1, yPercent: 0, duration: 1, ease: "none" },
                position,
              );

            cards.forEach((card, cardIndex) => {
              timeline.to(
                card,
                {
                  height: cardIndex === index ? activeHeight : rowHeight,
                  y: cardTop(cardIndex, index),
                  duration: 1,
                  ease: "none",
                },
                position,
              );
            });
          }

          const trigger = ScrollTrigger.create({
            trigger: section,
            start: "top top",
            end: "bottom bottom",
            animation: timeline,
            scrub: 0.9,
            invalidateOnRefresh: true,
            onUpdate: ({ progress }) => {
              const nextIndex = Math.min(
                services.length - 1,
                Math.round(progress * (services.length - 1)),
              );
              setActiveIndex((current) =>
                current === nextIndex ? current : nextIndex,
              );
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
    if (!trigger) return;

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
      className="service-scroll-section bg-brand-dark text-brand-light"
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
                  className="service-card relative isolate min-h-service-mobile overflow-hidden border border-service-border bg-brand-dark-elevated shadow-service-panel sm:min-h-service-tablet lg:min-h-0"
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
                    className="service-expanded-content absolute inset-0 grid grid-cols-[1fr_auto] content-between gap-6 p-service"
                    aria-hidden={!isActive}
                  >
                    <h3 className="max-w-[18ch] font-serif text-section-display leading-editorial tracking-editorial">
                      {service.title}
                    </h3>
                    <span className="font-mono text-service-number leading-none tracking-service-number">
                      {service.number}
                    </span>
                    <p className="col-span-2 max-w-service-copy justify-self-end text-service-copy leading-[1.35] font-normal">
                      {service.description}
                    </p>
                  </div>

                  <button
                    data-service-collapsed
                    type="button"
                    tabIndex={isActive ? -1 : 0}
                    aria-label={`Show ${service.title}`}
                    onClick={() => goToService(index)}
                    className="service-collapsed-control group absolute inset-0 hidden w-full items-center gap-5 bg-brand-dark-elevated px-service text-left text-brand-light transition-colors hover:bg-brand-light/[0.06] focus-visible:bg-brand-light/[0.08] focus-visible:ring-2 focus-visible:ring-brand-light focus-visible:outline-none focus-visible:ring-inset lg:flex"
                  >
                    <span className="font-mono text-service-tab-number leading-none opacity-60">
                      {service.number}
                    </span>
                    <span className="font-serif text-service-tab leading-tight">
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
