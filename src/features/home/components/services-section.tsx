"use client";

import Image from "next/image";
import { useId, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { Icon } from "@/components/ui";
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

          gsap.set(cards, {
            zIndex: (index) => index + 1,
            yPercent: (index) => (index === 0 ? 0 : 108),
            scale: (index) => (index === 0 ? 1 : 0.985),
            opacity: 1,
          });

          const timeline = gsap.timeline({ paused: true });

          for (let index = 1; index < cards.length; index += 1) {
            const previous = cards[index - 1];
            const current = cards[index];
            if (!previous || !current) continue;

            const position = index - 1;
            timeline
              .to(
                previous,
                {
                  y: "calc(var(--service-stack-offset) * -1)",
                  scale: 0.965,
                  opacity: 0.58,
                  duration: 1,
                  ease: "none",
                },
                position,
              )
              .to(
                current,
                {
                  yPercent: 0,
                  scale: 1,
                  duration: 1,
                  ease: "none",
                },
                position,
              );
          }

          const trigger = ScrollTrigger.create({
            trigger: section,
            start: "top top",
            end: "bottom bottom",
            animation: timeline,
            scrub: 0.65,
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
                  className="service-card relative isolate min-h-service-mobile overflow-hidden rounded-service-panel border border-service-border bg-brand-dark-elevated shadow-service-panel sm:min-h-service-tablet lg:min-h-0"
                  aria-current={isActive ? "step" : undefined}
                >
                  <Image
                    src={service.image}
                    alt=""
                    fill
                    priority={index === 0}
                    sizes="(min-width: 1440px) 1080px, (min-width: 1024px) 72vw, 100vw"
                    unoptimized={isRemoteAsset(service.image)}
                    className="duration-service-media object-cover transition-transform ease-premium"
                  />
                  <span className="service-media-overlay absolute inset-0" />
                  <div className="service-card-content absolute inset-0 grid grid-cols-[1fr_auto] content-between gap-6 p-service">
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

          <nav
            className="service-index hidden overflow-hidden rounded-b-service-group lg:block"
            aria-label="Choose a service"
          >
            {services.map((service, index) => {
              const isActive = index === activeIndex;
              if (isActive) return null;

              return (
                <button
                  key={service.id}
                  type="button"
                  onClick={() => goToService(index)}
                  className="group flex min-h-service-row w-full items-center gap-5 border border-t-0 border-service-border bg-brand-dark-elevated px-service text-left text-brand-light transition-colors duration-300 hover:bg-primary focus-visible:z-20 focus-visible:bg-primary focus-visible:ring-2 focus-visible:ring-brand-light focus-visible:outline-none"
                >
                  <span className="font-mono text-service-tab-number leading-none opacity-60">
                    {service.number}
                  </span>
                  <span className="font-serif text-service-tab leading-tight">
                    {service.title}
                  </span>
                  <Icon
                    name="arrow-right"
                    className="ml-auto opacity-50 transition-[opacity,transform] duration-300 group-hover:translate-x-1 group-hover:opacity-100 group-focus-visible:translate-x-1 group-focus-visible:opacity-100"
                  />
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </section>
  );
}
