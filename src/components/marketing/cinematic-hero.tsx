import Image from "next/image";
import { Container } from "@/components/layout";
import { ButtonLink, HeroHeading } from "@/components/ui";
import { Reveal } from "./reveal";

export interface CinematicHeroProps {
  titleLines: readonly string[];
  ctaLabel: string;
  ctaHref: string;
  video: string;
  mobileVideo?: string;
  poster?: string;
}

export function CinematicHero({
  titleLines,
  ctaLabel,
  ctaHref,
  video,
  mobileVideo,
  poster,
}: CinematicHeroProps) {
  return (
    <section className="dexta-hero relative isolate flex items-end overflow-hidden bg-black text-white">
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster={poster}
        aria-hidden="true"
        className="absolute inset-0 size-full object-cover"
      >
        {mobileVideo && (
          <source
            media="(max-width: 767px)"
            src={mobileVideo}
            type="video/webm"
          />
        )}
        <source src={video} type="video/webm" />
      </video>
      <span aria-hidden className="dexta-hero-overlay absolute inset-0" />
      <Container className="relative pb-[var(--space-hero-bottom)]">
        <Reveal className="flex max-w-3xl flex-col items-start gap-8">
          <HeroHeading>
            {titleLines.map((line, index) => (
              <span key={line} className="block">
                {line}
                {index < titleLines.length - 1 && <br className="sr-only" />}
              </span>
            ))}
          </HeroHeading>
          <ButtonLink
            href={ctaHref}
            size="lg"
            variant="onMedia"
            className="w-hero-cta shadow-none"
          >
            <Image
              src="/images/dexta-arrow.svg"
              alt=""
              aria-hidden
              width={20}
              height={20}
            />
            {ctaLabel}
          </ButtonLink>
        </Reveal>
      </Container>
    </section>
  );
}
