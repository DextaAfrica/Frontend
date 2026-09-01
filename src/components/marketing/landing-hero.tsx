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
 * The entrance is one coordinated sequence, not independent fades: the badge
 * scales and sharpens into place with a slight overshoot first, the headline
 * lines reveal from behind their masks right after, and the description/CTAs
 * fade up last (via <Reveal>) so the eye lands on the headline. The badge
 * also carries its own recurring diagonal light sweep (pure CSS, see
 * `.hero-badge` in globals.css) — a quiet, continuous "alive" detail once
 * the entrance settles, not just a one-time animation.
 *
 * Both the badge and the headline use GSAP's `fromTo` rather than a
 * CSS-hidden-by-default state: the visible/resting state is the CSS default,
 * and `fromTo` sets the hidden starting point itself at animation time — so
 * if the animation never fires for any reason, the content is simply visible
 * immediately rather than stuck invisible. Neither can fail silently.
 *
 * The scrim is left-to-right, not a flat wash over the whole frame: it darkens
 * only the left portion where the copy sits, fading to fully transparent by
 * roughly mid-frame — so the right side of the video stays genuinely vivid
 * instead of the whole shot reading as muted. A soft band at the top keeps
 * the header legible regardless of what's playing underneath it, and a
 * bright hairline marks the exact seam with the next section.
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
  const introRef = React.useRef<HTMLDivElement>(null);
  const badgeRef = React.useRef<HTMLSpanElement>(null);
  const headingRef = React.useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }
      const lines = gsap.utils.toArray<HTMLElement>(
        headingRef.current?.querySelectorAll("[data-hero-line-inner]") ?? [],
      );

      const timeline = gsap.timeline({ delay: 0.1 });

      if (badgeRef.current) {
        timeline.fromTo(
          badgeRef.current,
          { opacity: 0, scale: 0.8, y: 10, filter: "blur(6px)" },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.8,
            ease: "back.out(1.7)",
            clearProps: "filter",
          },
        );
      }

      if (lines.length) {
        timeline.fromTo(
          lines,
          { yPercent: 110 },
          {
            yPercent: 0,
            duration: 1.2,
            stagger: 0.14,
            ease: "power4.out",
            clearProps: "transform",
          },
          "-=0.35",
        );
      }
    },
    { scope: introRef },
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
        className="absolute inset-0 bg-gradient-to-r from-brand-dark/80 via-brand-dark/30 to-transparent"
      />

      <Container size="editorial" className="relative">
        <span
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-[10%] -z-10 h-[120%] w-[55%] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(ellipse_60%_60%_at_50%_50%,rgb(6_6_6/0.3),transparent_72%)]"
        />

        <div
          ref={introRef}
          className="relative flex max-w-2xl flex-col items-start gap-6 text-left"
        >
          <span
            ref={badgeRef}
            className="hero-badge inline-flex w-fit items-center gap-1.5 rounded-full border border-on-media-border bg-on-media-surface px-3 py-1.5 text-xs font-medium tracking-wide text-on-media backdrop-blur-md"
          >
            <Icon name="badge-check" size={14} />
            {badge}
          </span>

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
