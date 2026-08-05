import { Container } from "@/components/layout";
import { ButtonLink, HeroHeading, Icon } from "@/components/ui";
import { HeroVideo } from "./hero-video";
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
    <section className="dexta-hero relative isolate flex items-end overflow-hidden bg-brand-dark text-on-media">
      <HeroVideo video={video} mobileVideo={mobileVideo} poster={poster} />
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
            {ctaLabel}
            <Icon name="arrow-right" />
          </ButtonLink>
        </Reveal>
      </Container>
    </section>
  );
}
