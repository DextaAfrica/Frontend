import Image from "next/image";
import { Section } from "@/components/layout";
import { EditorialSectionHeading } from "@/components/marketing";
import { MetricValue } from "@/components/ui";
import { statistics, testimonial } from "../data/social-proof";

export function TestimonialSection() {
  return (
    <Section spacing="editorial" tone="surface">
      <EditorialSectionHeading
        eyebrow="Testimonials"
        title="Hear it from some of our clients"
        align="center"
        className="max-w-testimonial-heading"
      />

      <figure className="mx-auto mt-[clamp(5rem,8vw,7rem)] max-w-[56.1875rem]">
        <blockquote className="text-[clamp(1.5rem,2.222vw,2rem)] leading-[1.2] font-medium">
          <Image
            src={testimonial.portrait}
            alt=""
            width={70}
            height={70}
            className="mr-4 inline-block size-[4.375rem] rounded-sm object-cover align-middle"
          />
          “{testimonial.quote}”
        </blockquote>
        <figcaption className="mt-10 flex items-end justify-between gap-8">
          <div className="text-2xl leading-none font-light uppercase">
            <p>{testimonial.author}</p>
            <p className="mt-2 text-text-subtle">{testimonial.role}</p>
          </div>
          <div className="flex items-center gap-3 font-mono text-base">
            <span>01</span>
            <Image
              src="/images/testimonial-progress.svg"
              alt=""
              width={66}
              height={9}
            />
            <span className="text-text-subtle">02</span>
            <span className="text-text-subtle">03</span>
          </div>
        </figcaption>
      </figure>
    </Section>
  );
}

export function StatisticsSection() {
  return (
    <Section spacing="lg" tone="surface">
      <div className="grid border-y border-border md:grid-cols-3">
        {statistics.map((stat) => (
          <article
            key={stat.value}
            className="flex min-h-stat-card flex-col justify-between border-b border-border px-8 py-7 last:border-b-0 md:border-r md:border-b-0 md:last:border-r-0"
          >
            <MetricValue>{stat.value}</MetricValue>
            <p className="max-w-stat-copy text-2xl leading-[1.2] text-muted-foreground">
              {stat.copy}
            </p>
          </article>
        ))}
      </div>
    </Section>
  );
}
