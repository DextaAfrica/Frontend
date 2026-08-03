"use client";

import Image from "next/image";
import { useId, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { Icon } from "@/components/ui";
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

      media.add(
        "(min-width: 64rem) and (prefers-reduced-motion: no-preference)",
        () => {
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
          if (!firstCard || !secondCard) return;

          const activeHeight = firstCard.getBoundingClientRect().height;
          const rowHeight = secondCard.getBoundingClientRect().height;
          const layoutFor = (cardIndex: number, active: number) => ({
            height: cardIndex <= active ? activeHeight : rowHeight,
            y:
              cardIndex <= active
                ? 0
                : activeHeight + (cardIndex - active - 1) * rowHeight,
          });

          gsap.set(cards, {
            position: "absolute",
            insetInline: 0,
            top: 0,
            zIndex: (index) => index + 1,
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
            scale: (index) => (index === 0 ? 1 : 1.045),
            yPercent: (index) => (index === 0 ? 0 : 4),
          });

          const timeline = gsap.timeline({ paused: true });

          for (let nextIndex = 1; nextIndex < cards.length; nextIndex += 1) {
            const position = nextIndex - 1;
            const previousCard = cards[nextIndex - 1];
            const currentExpanded = expanded[nextIndex];
            const currentCollapsed = collapsed[nextIndex];
            const currentImage = images[nextIndex];
            if (
              !previousCard ||
              !currentExpanded ||
              !currentCollapsed ||
              !currentImage
            ) {
              continue;
            }

            timeline
              .to(
                previousCard,
                {
                  scale: 0.985,
                  opacity: 0.7,
                  duration: 1,
                  ease: "none",
                },
                position,
              )
              .to(
                currentCollapsed,
                {
                  autoAlpha: 0,
                  y: -10,
                  duration: 0.4,
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
                currentImage,
                {
                  scale: 1,
                  yPercent: 0,
                  duration: 1,
                  ease: "none",
                },
                position,
              );

            cards.forEach((card, cardIndex) => {
              const layout = layoutFor(cardIndex, nextIndex);
              timeline.to(
                card,
                {
                  height: layout.height,
                  y: layout.y,
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
            scrub: 1,
            invalidateOnRefresh: true,
            onUpdate: ({ progress }) => {
              const next = Math.min(
                services.length - 1,
                Math.round(progress * (services.length - 1)),
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
                  className="service-card relative isolate min-h-service-mobile overflow-hidden bg-brand-dark-elevated shadow-service-panel sm:min-h-service-tablet lg:min-h-0"
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
                    className="service-expanded-content absolute inset-0 grid grid-cols-[1fr_auto] content-between gap-6 p-service"
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
                    className="service-collapsed-control group absolute inset-0 hidden w-full items-center gap-5 bg-gradient-to-r from-black/45 via-black/15 to-transparent px-service text-left text-brand-light transition-colors [text-shadow:0_1px_12px_rgb(0_0_0/0.65)] hover:from-black/55 hover:via-black/20 focus-visible:ring-2 focus-visible:ring-brand-light focus-visible:outline-none focus-visible:ring-inset lg:flex"
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
