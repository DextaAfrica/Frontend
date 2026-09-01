"use client";

import * as React from "react";
import { Container } from "@/components/layout";
import { ButtonLink, HeroHeading, Icon, Text } from "@/components/ui";
import { renderWithAccents } from "@/components/ui/typography";
import { gsap, useGSAP } from "@/lib/gsap";
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
 * graded and slowly zooming so it feels alive. Copy is left-anchored within
 * the editorial reading column (not flush to the browser edge, and not
 * centered) so it lines up with every other section's content edge below it.
 *
 * The headline plays a line-mask reveal on mount: each line rests translated
 * behind its own overflow-hidden mask (set in CSS, so there's no flash of
 * unstyled/unmasked text before JS runs) and slides up into place,
 * staggered — the badge, description, and CTAs each fade up afterward so the
 * headline reads first. Scrims are deliberate rather than a flat wash: a
 * soft band at the top for header legibility, a taller gradient at the
 * bottom for the copy and the seam with the next section, and a focused
 * glow behind the headline itself. A bright hairline marks the exact seam
 * so the hero reads as its own moment.
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
  const headingRef = React.useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }
      const lines = gsap.utils.toArray<HTMLElement>(
        headingRef.current?.querySelectorAll("[data-hero-line-inner]") ?? [],
      );
      if (!lines.length) return;

      gsap.to(lines, {
        yPercent: 0,
        duration: 1.2,
        stagger: 0.14,
        ease: "power4.out",
        delay: 0.15,
        clearProps: "transform",
      });
    },
    { scope: headingRef },
  );

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
          className="pointer-events-none absolute top-1/2 left-[18%] -z-10 h-[135%] w-[70%] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(ellipse_60%_60%_at_50%_50%,rgb(6_6_6/0.52),transparent_72%)]"
        />

        <div className="relative flex max-w-2xl flex-col items-start gap-6 text-left">
          <Reveal>
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-on-media-border bg-on-media-surface px-3 py-1.5 text-xs font-medium tracking-wide text-on-media backdrop-blur-md">
              <Icon name="badge-check" size={14} />
              {badge}
            </span>
          </Reveal>

          <div ref={headingRef}>
            <HeroHeading className="[text-shadow:0_2px_28px_rgb(0_0_0/0.45)]">
              {titleLines.map((line, index) => (
                <span key={index} className="block overflow-hidden py-1">
                  <span data-hero-line-inner className="block">
                    {renderWithAccents(line)}
                  </span>
                </span>
              ))}
            </HeroHeading>
          </div>

          <Reveal delay={0.7}>
            <Text className="max-w-xl text-base text-pretty text-on-media-muted [text-shadow:0_1px_16px_rgb(0_0_0/0.4)] sm:text-lg">
              {description}
            </Text>
          </Reveal>

          <Reveal
            delay={0.85}
            className="flex flex-wrap items-center gap-3 pt-2"
          >
            <ButtonLink href={primary.href} size="lg">
              {primary.label}
              <Icon name="arrow-right" />
            </ButtonLink>
            <ButtonLink href={secondary.href} size="lg" variant="onMedia">
              {secondary.label}
            </ButtonLink>
          </Reveal>
        </div>
      </Container>

      <span
        aria-hidden
        className="absolute inset-x-0 bottom-0 z-10 h-px bg-gradient-to-r from-transparent via-on-media/40 to-transparent"
      />
    </section>
  );
}
