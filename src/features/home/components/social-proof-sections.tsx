import * as React from "react";
import Image from "next/image";
import { Section } from "@/components/layout";
import {
  EditorialSectionHeading,
  Reveal,
  RevealGroup,
  RevealItem,
} from "@/components/marketing";
import { MetricValue } from "@/components/ui";
import { gsap } from "@/lib/gsap";
import { isRemoteAsset } from "@/lib/media";
import type {
  HomePageContent,
  StatisticContent,
  TestimonialContent,
} from "../types/home-page";

export function TestimonialSection({
  testimonial,
  heading,
}: {
  testimonial: TestimonialContent;
  heading: HomePageContent["testimonialSection"];
}) {
  return (
    <Section spacing="editorial" tone="default">
      <EditorialSectionHeading
        eyebrow={heading.eyebrow}
        title={heading.title}
        align="center"
        className="max-w-testimonial-heading"
      />

      <Reveal
        as="figure"
        className="mx-auto mt-testimonial w-full max-w-testimonial-body"
      >
        <blockquote className="text-testimonial leading-testimonial font-medium tracking-testimonial">
          <Image
            src={testimonial.portrait}
            alt={`Portrait of ${testimonial.author}`}
            width={70}
            height={70}
            unoptimized={isRemoteAsset(testimonial.portrait)}
            className="mr-testimonial-quote mb-1 inline-block size-testimonial-avatar rounded-testimonial-avatar object-cover align-middle"
          />
          “{testimonial.quote}”
        </blockquote>
        <figcaption className="mt-testimonial-meta flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-end">
          <div className="text-testimonial-author leading-none font-light tracking-testimonial-author uppercase">
            <p>{testimonial.author}</p>
            <p className="mt-2 text-text-subtle">{testimonial.role}</p>
          </div>
          <div
            className="flex items-center gap-testimonial-progress font-mono text-sm"
            aria-label="Testimonial 1 of 1"
          >
            <span>01</span>
            <span
              aria-hidden
              className="h-px w-testimonial-progress bg-current"
            />
            <span className="text-text-subtle">01</span>
          </div>
        </figcaption>
      </Reveal>
    </Section>
  );
}

function StatCopy({ copy, highlight }: { copy: string; highlight: string }) {
  const index = copy.indexOf(highlight);
  if (index === -1) return <>{copy}</>;

  return (
    <>
      {copy.slice(0, index)}
      <strong className="font-bold text-brand-light">{highlight}</strong>
      {copy.slice(index + highlight.length)}
    </>
  );
}

function StatCard({
  stat,
  priority,
}: {
  stat: StatisticContent;
  priority: boolean;
}) {
  const mistRef = React.useRef<HTMLDivElement>(null);

  const animateMist = (entering: boolean) => {
    const mist = mistRef.current;
    if (!mist) return;

    const allowMotion = window.matchMedia(
      "(prefers-reduced-motion: no-preference)",
    ).matches;

    if (!allowMotion) {
      gsap.set(mist.children, { opacity: entering ? 0.5 : 0 });
      return;
    }

    gsap.to(mist.children, {
      opacity: entering ? 1 : 0,
      scale: entering ? 1.15 : 1,
      duration: entering ? 1.4 : 0.9,
      stagger: entering ? 0.08 : 0,
      ease: entering ? "power2.out" : "power2.in",
    });
  };

  return (
    <div
      onMouseEnter={() => animateMist(true)}
      onMouseLeave={() => animateMist(false)}
      className="relative flex h-full min-h-56 flex-col justify-between gap-10 overflow-hidden px-6 py-7 sm:px-8 md:min-h-stat-card"
    >
      <Image
        src={stat.image}
        alt=""
        fill
        priority={priority}
        sizes="(min-width: 768px) 34vw, 100vw"
        unoptimized={isRemoteAsset(stat.image)}
        className="object-cover"
      />
      <span
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/5"
      />
      <div
        ref={mistRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 mix-blend-screen"
      >
        <span className="absolute top-[-20%] left-[10%] size-40 rounded-full bg-white/70 opacity-0 blur-3xl" />
        <span className="absolute top-[30%] -right-[10%] size-48 rounded-full bg-white/60 opacity-0 blur-3xl" />
        <span className="absolute -bottom-[15%] left-[35%] size-56 rounded-full bg-white/50 opacity-0 blur-3xl" />
      </div>

      <MetricValue className="relative text-brand-light [text-shadow:var(--stat-value-glow)]">
        {stat.value}
      </MetricValue>
      <p className="relative max-w-stat-copy text-2xl leading-[1.2] font-light text-brand-light/80">
        <StatCopy copy={stat.copy} highlight={stat.highlight} />
      </p>
    </div>
  );
}

export function StatisticsSection({
  statistics,
}: {
  statistics: readonly StatisticContent[];
}) {
  return (
    <Section spacing="lg" tone="surface">
      <RevealGroup className="grid border-y border-border md:grid-cols-3">
        {statistics.map((stat, index) => (
          <RevealItem
            as="article"
            key={stat.id}
            className="border-b border-border last:border-b-0 md:border-r md:border-b-0 md:last:border-r-0"
          >
            <StatCard stat={stat} priority={index === 0} />
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}
