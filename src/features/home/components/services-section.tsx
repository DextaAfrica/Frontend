"use client";

import Image from "next/image";
import { useState } from "react";
import { services } from "../data/services";

export function ServicesSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeService = services[activeIndex] ?? services[0];

  return (
    <section className="bg-brand-dark px-page-gutter py-services text-brand-light">
      <div className="mx-auto max-w-services overflow-hidden rounded-2xl bg-brand-dark-elevated">
        <article className="relative min-h-service-panel overflow-hidden rounded-lg border border-black shadow-service-panel">
          <Image
            key={activeService.image}
            src={activeService.image}
            alt=""
            fill
            priority={activeIndex === 0}
            sizes="(min-width: 1440px) 1406px, 100vw"
            className="object-cover"
          />
          <span className="absolute inset-0 bg-black/20" />
          <h2 className="absolute top-12 left-[var(--space-service-inline)] font-serif tracking-[-0.0625rem] text-[var(--type-section-display)]">
            {activeService.title}
          </h2>
          <span className="absolute top-8 right-[7.5%] font-mono text-[clamp(5rem,8.333vw,7.5rem)] leading-none tracking-[-0.293rem]">
            {activeIndex + 1}
          </span>
          <p className="absolute right-[6%] bottom-12 max-w-[22rem] text-[clamp(1.125rem,1.667vw,1.5rem)] leading-[1.1] font-medium">
            {activeService.description}
          </p>
        </article>

        {services.map((service, index) =>
          index === activeIndex ? null : (
            <button
              key={service.title}
              type="button"
              className="flex min-h-24 w-full items-center gap-12 rounded-2xl border border-black px-service text-left font-serif text-2xl shadow-service-row transition-colors hover:bg-white/[0.04]"
              onClick={() => setActiveIndex(index)}
            >
              <span className="font-mono">{service.number}</span>
              <span>{service.title}</span>
            </button>
          ),
        )}
      </div>
    </section>
  );
}
