import { Container } from "@/components/layout";
import { ButtonLink, HeroHeading, Icon, Text } from "@/components/ui";
import { renderWithAccents } from "@/components/ui/typography";
import { HeroVideo } from "./hero-video";
import { Reveal } from "./reveal";

export interface LandingHeroProps {
  badge: string;
  titleLines: readonly string[];
  description: string;
  primary: { label: string; href: string };
  secondary: { label: string; href: string };
  video: string;
  mobileVideo?: string;
  poster: string;
}

/**
 * The site's top hero: the showreel plays as a full-bleed ambient
 * background (autoplay, muted, looped — never a click-to-play panel), lightly
 * graded and slowly zooming so it feels alive. Scrims are deliberate rather
 * than a flat wash: a soft band at the top for header legibility, a taller
 * gradient at the bottom for the copy and the seam with the next section, and
 * a focused radial only behind the headline itself. A bright hairline marks
 * the exact seam so the hero reads as its own moment.
 */
export function LandingHero({
  badge,
  titleLines,
  description,
  primary,
  secondary,
  video,
  mobileVideo,
  poster,
}: LandingHeroProps) {
  return (
    <section className="dexta-hero relative isolate flex items-center overflow-hidden bg-brand-dark text-on-media">
      <HeroVideo video={video} mobileVideo={mobileVideo} poster={poster} />
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-black/45 via-black/10 to-transparent"
      />
      <span
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-brand-dark via-brand-dark/55 to-transparent"
      />

      <Container size="editorial" className="relative">
        <span
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-1/2 -z-10 h-[135%] w-[130%] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(ellipse_54%_58%_at_50%_50%,rgb(6_6_6/0.52),transparent_72%)]"
        />
        <Reveal className="relative mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-on-media-border bg-on-media-surface px-3 py-1.5 text-xs font-medium tracking-wide text-on-media backdrop-blur-md">
            <Icon name="badge-check" size={14} />
            {badge}
          </span>
          <HeroHeading className="[text-shadow:0_2px_28px_rgb(0_0_0/0.45)]">
            {titleLines.map((line, index) => (
              <span key={index} className="block">
                {renderWithAccents(line)}
              </span>
            ))}
          </HeroHeading>
          <Text className="max-w-2xl text-base text-pretty text-on-media-muted [text-shadow:0_1px_16px_rgb(0_0_0/0.4)] sm:text-lg">
            {description}
          </Text>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <ButtonLink href={primary.href} size="lg">
              {primary.label}
              <Icon name="arrow-right" />
            </ButtonLink>
            <ButtonLink href={secondary.href} size="lg" variant="onMedia">
              {secondary.label}
            </ButtonLink>
          </div>
        </Reveal>
      </Container>

      <span
        aria-hidden
        className="absolute inset-x-0 bottom-0 z-10 h-px bg-gradient-to-r from-transparent via-on-media/40 to-transparent"
      />
    </section>
  );
}
