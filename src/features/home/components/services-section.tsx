"use client";

import Image from "next/image";
import { useId, useRef, useState } from "react";
import type { CSSProperties } from "react";
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
          const images = gsap.utils.toArray<HTMLElement>(
            section.querySelectorAll("[data-service-media]"),
          );
          const overlays = gsap.utils.toArray<HTMLElement>(
            section.querySelectorAll("[data-service-overlay]"),
          );

          gsap.set(cards, {
            zIndex: (index) => index + 1,
            yPercent: (index) => (index === 0 ? 0 : 105),
            scale: 1,
            opacity: 1,
            transformOrigin: "50% 0%",
          });
          gsap.set(images, {
            scale: (index) => (index === 0 ? 1 : 1.055),
            yPercent: (index) => (index === 0 ? 0 : 5),
          });
          gsap.set(overlays, {
            opacity: (index) => (index === 0 ? 1 : 0.82),
          });

          const timeline = gsap.timeline({ paused: true });

          for (let index = 1; index < cards.length; index += 1) {
            const position = index - 1;
            const previousCard = cards[index - 1];
            const currentCard = cards[index];
            const previousImage = images[index - 1];
            const currentImage = images[index];
            const previousOverlay = overlays[index - 1];
            const currentOverlay = overlays[index];

            if (
              !previousCard ||
              !currentCard ||
              !previousImage ||
              !currentImage ||
              !previousOverlay ||
              !currentOverlay
            ) {
              continue;
            }

            timeline
              .to(
                previousCard,
                {
                  scale: 0.985,
                  opacity: 0.72,
                  duration: 1,
                  ease: "none",
                },
                position,
              )
              .to(
                previousImage,
                {
                  scale: 1.04,
                  yPercent: -2,
                  duration: 1,
                  ease: "none",
                },
                position,
              )
              .to(
                previousOverlay,
                { opacity: 1.15, duration: 1, ease: "none" },
                position,
              )
              .to(
                currentCard,
                {
                  yPercent: 0,
                  scale: 1,
                  opacity: 1,
                  duration: 1,
                  ease: "none",
                },
                position,
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
              )
              .to(
                currentOverlay,
                { opacity: 1, duration: 1, ease: "none" },
                position,
              );
          }

          const trigger = ScrollTrigger.create({
            trigger: section,
            start: "top top",
            end: "bottom bottom",
            animation: timeline,
            scrub: 1,
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

          return () => {
            trigger.kill();
            timeline.kill();
          };
        },
      );

      return () => media.revert();
    },
    { scope: sectionRef, dependencies: [services] },
  );

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
                  className="service-card relative isolate min-h-service-mobile overflow-hidden rounded-service-panel border border-service-border bg-brand-dark-elevated shadow-service-panel sm:min-h-service-tablet lg:min-h-0"
                  style={{ position: "relative" }}
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
                  <span
                    data-service-overlay
                    className="service-media-overlay absolute inset-0"
                  />

                  <div className="absolute inset-0 grid grid-cols-[1fr_auto] content-between gap-6 p-service">
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
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
