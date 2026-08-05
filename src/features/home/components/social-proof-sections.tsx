import Image from "next/image";
import { Section } from "@/components/layout";
import {
  EditorialSectionHeading,
  Reveal,
  RevealGroup,
  RevealItem,
} from "@/components/marketing";
import { isRemoteAsset } from "@/lib/media";
import type {
  HomePageContent,
  StatisticContent,
  TestimonialContent,
} from "../types/home-page";
import { StatCard } from "./stat-card";

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
