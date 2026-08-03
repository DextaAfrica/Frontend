"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "motion/react";
import { cn } from "@/lib/utils";
import { isRemoteAsset } from "@/lib/media";
import type { ServiceContent } from "../types/home-page";

export function ServicesSection({
  services,
}: {
  services: readonly ServiceContent[];
}) {
  const sectionId = useId();
  const sectionRef = useRef<HTMLElement>(null);
  const [activeId, setActiveId] = useState(services[0]?.id);
  const activeService =
    services.find((service) => service.id === activeId) ?? services[0];

  const reducedMotion = useReducedMotion();
  const [pinningSupported, setPinningSupported] = useState(false);
  const isPinned = pinningSupported && !reducedMotion;

  useEffect(() => {
    const query = window.matchMedia("(min-width: 40rem)");
    const update = () => setPinningSupported(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    if (!isPinned) return;
    const index = Math.min(
      services.length - 1,
      Math.max(0, Math.floor(progress * services.length)),
    );
    const next = services[index];
    if (next) setActiveId(next.id);
  });

  const goToIndex = (index: number) => {
    const section = sectionRef.current;
    setActiveId(services[index]?.id);
    if (!section || !isPinned) return;

    const rect = section.getBoundingClientRect();
    const sectionTop = rect.top + window.scrollY;
    const scrollRange = Math.max(0, section.offsetHeight - window.innerHeight);
    const progress = (index + 0.5) / services.length;

    window.scrollTo({
      top: sectionTop + progress * scrollRange,
      behavior: reducedMotion ? "auto" : "smooth",
    });
  };

  if (!activeService) return null;

  return (
    <section
      ref={sectionRef}
      style={{ "--services-count": services.length } as React.CSSProperties}
      className="relative bg-brand-dark px-page-gutter py-services text-brand-light motion-safe:sm:h-[calc(var(--services-count)*85vh)]"
      aria-label="Our services"
    >
      <div className="relative mx-auto w-full max-w-service-shell overflow-hidden rounded-service-group bg-brand-dark-elevated motion-safe:sm:sticky motion-safe:sm:top-0">
        <div
          id={`${sectionId}-${activeService.id}`}
          className="relative min-h-service-mobile overflow-hidden rounded-service-panel border border-service-border shadow-service-panel sm:min-h-service-tablet lg:min-h-service-panel"
          aria-live="polite"
        >
          {services.map((service, index) => {
            const isActive = service.id === activeService.id;

            return (
              <article
                key={service.id}
                className={cn(
                  "duration-service absolute inset-0 transition-[opacity,transform] ease-premium",
                  isActive
                    ? "z-10 translate-y-0 opacity-100"
                    : "pointer-events-none translate-y-service opacity-0",
                )}
                aria-hidden={!isActive}
              >
                <Image
                  src={service.image}
                  alt=""
                  fill
                  priority={index === 0}
                  sizes="(min-width: 1440px) 1406px, 100vw"
                  unoptimized={isRemoteAsset(service.image)}
                  className="duration-service-media scale-service-media object-cover transition-transform ease-premium"
                />
                <span className="service-media-overlay absolute inset-0" />
                <h2 className="absolute top-7 right-service left-service font-serif text-section-display leading-editorial tracking-editorial sm:top-10 lg:top-12">
                  {service.title}
                </h2>
                <span className="absolute top-5 right-service font-mono text-service-number leading-none tracking-service-number sm:top-8">
                  {service.number}
                </span>
                <p className="absolute right-service bottom-8 left-service text-service-copy leading-editorial font-medium sm:left-auto sm:max-w-service-copy lg:bottom-12">
                  {service.description}
                </p>
              </article>
            );
          })}
        </div>

        <div aria-label="Choose a service">
          {services.map((service, index) => {
            const isActive = service.id === activeService.id;

            if (isActive) return null;

            return (
              <button
                key={service.id}
                type="button"
                aria-label={`View ${service.title}`}
                className="group gap-service-row flex min-h-service-row w-full items-center rounded-service-row border border-service-border px-service text-left shadow-service-row transition-colors duration-300 hover:bg-brand-light/[0.06] focus-visible:z-20 focus-visible:ring-2 focus-visible:ring-brand-light/80 focus-visible:outline-none"
                onClick={() => goToIndex(index)}
              >
                <span className="font-mono text-service-tab-number leading-none opacity-70">
                  {service.number}
                </span>
                <span className="font-serif text-service-tab leading-editorial tracking-editorial">
                  {service.title}
                </span>
                <span
                  aria-hidden
                  className="ml-auto text-service-indicator opacity-0 transition-[opacity,transform] duration-300 group-hover:translate-x-1 group-hover:opacity-100 group-focus-visible:opacity-100"
                >
                  ↗
                </span>
              </button>
            );
          })}
        </div>

        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-px origin-left bg-brand-light/40 motion-safe:sm:block"
          style={{ scaleX: isPinned ? scrollYProgress : 0 }}
        />
      </div>
    </section>
  );
}
