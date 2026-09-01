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
 * background (autoplay, muted, looped — never a click-to-play panel), with
 * the badge/headline/CTAs overlaid and centered on top of it. A bright
 * divider line marks the exact seam with whatever section follows, so the
 * hero reads as its own deliberate moment rather than bleeding into it.
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
        className="absolute inset-0 bg-gradient-to-b from-brand-dark/75 via-brand-dark/35 to-brand-dark/80"
      />
      <span
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgb(6_6_6/0.55)_100%)]"
      />

      <Container size="editorial" className="relative">
        <Reveal className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-on-media-border bg-on-media-surface px-3 py-1.5 text-xs font-medium tracking-wide text-on-media backdrop-blur-md">
            <Icon name="badge-check" size={14} />
            {badge}
          </span>
          <HeroHeading>
            {titleLines.map((line, index) => (
              <span key={index} className="block">
                {renderWithAccents(line)}
              </span>
            ))}
          </HeroHeading>
          <Text className="max-w-2xl text-base text-pretty text-on-media-muted sm:text-lg">
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
        className="absolute inset-x-0 bottom-0 z-10 h-px bg-gradient-to-r from-transparent via-on-media/35 to-transparent"
      />
      <span
        aria-hidden
        className="absolute inset-x-0 bottom-0 z-10 h-24 bg-gradient-to-t from-brand-dark to-transparent"
      />
    </section>
  );
}
