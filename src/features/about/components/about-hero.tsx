"use client";

import * as React from "react";
import { Container } from "@/components/layout";
import { HeroVideo, Reveal } from "@/components/marketing";
import { ButtonLink, HeroHeading, Icon } from "@/components/ui";
import { renderWithAccents } from "@/components/ui/typography";
import { aboutMotion } from "@/config/about-motion";
import { gsap, useGSAP } from "@/lib/gsap";
import type { AboutHeroContent } from "../types/about-page";

/**
 * The About page hero, built on the same architecture as the homepage
 * <LandingHero>: a full-bleed media background (poster image, with an
 * optional ambient video loop over it), a left-to-right reading scrim, a
 * soft top band for header legibility, and a bright hairline marking the
 * seam with the next section. Copy is left-anchored within the editorial
 * reading column so it lines up with every section below.
 *
 * No slide carousel — the About page has one statement to make — so this is
 * just the mount entrance: badge punches in, the heading lines rise from a
 * clipped baseline, the description follows through a blur. The resting
 * state is the CSS default, so a skipped animation still shows everything.
 */
export function AboutHero({ content }: { content: AboutHeroContent }) {
  const introRef = React.useRef<HTMLDivElement>(null);
  const badgeRef = React.useRef<HTMLSpanElement>(null);
  const headingRef = React.useRef<HTMLDivElement>(null);
  const descriptionRef = React.useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }

      const { badge, line, lede } = aboutMotion.hero.enter;
      const lines = gsap.utils.toArray<HTMLElement>(
        headingRef.current?.querySelectorAll("[data-hero-line-inner]") ?? [],
      );
      const timeline = gsap.timeline({ delay: 0.1 });

      if (badgeRef.current) {
        timeline.fromTo(
          badgeRef.current,
          {
            opacity: 0,
            scale: badge.scaleFrom,
            y: badge.y,
            filter: `blur(${badge.blur}px)`,
          },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            filter: "blur(0px)",
            duration: badge.duration,
            ease: "back.out(1.7)",
            clearProps: "filter",
          },
        );
      }

      if (lines.length) {
        timeline.fromTo(
          lines,
          {
            yPercent: line.yPercentFrom,
            scale: line.scaleFrom,
            transformOrigin: "50% 100%",
          },
          {
            yPercent: 0,
            scale: 1,
            duration: line.duration,
            stagger: line.stagger,
            ease: "back.out(1.6)",
            clearProps: "transform",
          },
          line.overlap,
        );
      }

      if (descriptionRef.current) {
        timeline.fromTo(
          descriptionRef.current,
          { opacity: 0, y: lede.y, filter: `blur(${lede.blur}px)` },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: lede.duration,
            ease: "power3.out",
            clearProps: "filter",
          },
          lede.overlap,
        );
      }
    },
    { scope: introRef },
  );

  return (
    <section className="dexta-hero relative isolate flex items-center overflow-hidden bg-brand-dark text-on-media">
      <HeroVideo
        video={content.video}
        mobileVideo={content.mobileVideo}
        poster={content.image}
      />
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-black/45 via-black/10 to-transparent"
      />
      {/* Reading scrim: solid behind the copy column, tapering off well
          before the right edge so that side of the shot stays vivid. */}
      <span
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(to_right,rgb(6_6_6/0.88)_0%,rgb(6_6_6/0.74)_34%,rgb(6_6_6/0.38)_56%,transparent_78%)]"
      />

      <Container size="editorial" className="relative">
        <span
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-[10%] -z-10 h-[120%] w-[60%] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(ellipse_60%_60%_at_50%_50%,rgb(6_6_6/0.48),transparent_72%)]"
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
            {content.eyebrow}
          </span>

          <div ref={headingRef}>
            <HeroHeading
              data-commanding
              className="[text-shadow:0_2px_28px_rgb(0_0_0/0.45)]"
            >
              {content.titleLines.map((heroLine, index) => (
                <span key={index} className="block overflow-hidden py-1">
                  <span data-hero-line-inner className="block">
                    {renderWithAccents(heroLine)}
                  </span>
                </span>
              ))}
            </HeroHeading>
          </div>

          <p
            ref={descriptionRef}
            className="max-w-xl font-sans text-base leading-6 text-pretty text-hero-copy [text-shadow:0_1px_16px_rgb(0_0_0/0.4)] sm:text-lg"
          >
            {content.lede}
          </p>

          {(content.primary || content.secondary) && (
            <Reveal
              delay={0.85}
              className="flex flex-wrap items-center gap-3 pt-2"
            >
              {content.primary && (
                <ButtonLink href={content.primary.href} size="lg">
                  {content.primary.label}
                  <Icon name="arrow-right" />
                </ButtonLink>
              )}
              {content.secondary && (
                <ButtonLink
                  href={content.secondary.href}
                  size="lg"
                  variant="onMedia"
                >
                  {content.secondary.label}
                </ButtonLink>
              )}
            </Reveal>
          )}
        </div>
      </Container>

      <span
        aria-hidden
        className="absolute inset-x-0 bottom-0 z-10 h-px bg-gradient-to-r from-transparent via-on-media/40 to-transparent"
      />
    </section>
  );
}
