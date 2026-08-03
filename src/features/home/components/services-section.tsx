"use client";

import Image from "next/image";
import { useId, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";
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

    if (!trigger) {
      document
        .getElementById(`${sectionId}-${services[index]?.id}`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
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
      className="service-scroll-section bg-brand-dark text-brand-light"
      style={{ "--service-count": services.length } as ServiceSectionStyle}
      aria-labelledby={`${sectionId}-heading`}
    >
      <h2 id={`${sectionId}-heading`} className="sr-only">
        Our services
      </h2>

      <div className="service-sticky-stage px-page-gutter py-services">
        <div className="service-shell mx-auto grid w-full max-w-service-shell gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,0.34fr)]">
          <div className="service-card-stage">
            {services.map((service, index) => {
              const isActive = index === activeIndex;

              return (
                <article
                  id={`${sectionId}-${service.id}`}
                  key={service.id}
                  data-service-card
                  data-active={isActive || undefined}
                  className="service-card isolate overflow-hidden rounded-service-panel border border-service-border bg-brand-dark-elevated shadow-service-panel"
                  aria-current={isActive ? "step" : undefined}
                >
                  <Image
                    src={service.image}
                    alt=""
                    fill
                    priority={index === 0}
                    sizes="(min-width: 1440px) 1080px, (min-width: 1024px) 72vw, 100vw"
                    unoptimized={isRemoteAsset(service.image)}
                    className="object-cover transition-transform duration-service-media ease-premium"
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
            className="service-index rounded-service-group border border-white/10 bg-brand-dark-elevated p-2"
            aria-label="Services"
          >
            <ol className="grid h-full gap-1 lg:grid-rows-[repeat(var(--service-count),minmax(0,1fr))]">
              {services.map((service, index) => {
                const isActive = index === activeIndex;

                return (
                  <li key={service.id}>
                    <button
                      type="button"
                      onClick={() => goToService(index)}
                      aria-current={isActive ? "step" : undefined}
                      className={cn(
                        "group flex min-h-16 w-full items-center gap-4 rounded-service-row border px-4 text-left transition-[color,background-color,border-color] duration-300 focus-visible:ring-2 focus-visible:ring-brand-light focus-visible:outline-none lg:h-full",
                        isActive
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-transparent text-brand-light/65 hover:border-white/15 hover:bg-white/[0.04] hover:text-brand-light",
                      )}
                    >
                      <span className="font-mono text-service-tab-number leading-none opacity-75">
                        {service.number}
                      </span>
                      <span className="font-serif text-service-tab leading-tight">
                        {service.title}
                      </span>
                      <span
                        aria-hidden
                        className={cn(
                          "ml-auto transition-transform duration-300",
                          isActive ? "translate-x-0" : "-translate-x-1 opacity-0",
                        )}
                      >
                        ↗
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </nav>
        </div>
      </div>
    </section>
  );
}
