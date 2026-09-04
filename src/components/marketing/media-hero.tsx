"use client";

import * as React from "react";
import { Container } from "@/components/layout";
import { ButtonLink, HeroHeading, Icon } from "@/components/ui";
import { renderWithAccents } from "@/components/ui/typography";
import { gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import { HeroVideo } from "./hero-video";
import { Reveal } from "./reveal";

type CtaLink = { label: string; href: string };

export interface MediaHeroProps {
  /** Rendered as the pill badge above the heading. */
  eyebrow: string;
  /** One entry per visual line; a plain string is a single line. `*word*`
   *  marks the italic accent inside a line. */
  title: string | readonly string[];
  description?: string;
  /** Full-bleed background poster — required, and always painted so the hero
   *  is never an empty box. */
  image: string;
  /** Optional ambient loop layered over the poster once it has a frame. */
  video?: string;
  mobileVideo?: string;
  primary?: CtaLink;
  secondary?: CtaLink;
  /** `"compact"` (the default) is the height every page uses today — a
   *  shorter interior-page banner that still lets the page's content show
   *  just below the fold. `"full"` fills the viewport instead, for a page
   *  that wants the homepage's own scale. */
  size?: "full" | "compact";
  /** See `HeroVideoProps.position` — an `object-position` override for the
   *  rare photo whose subject sits too close to an edge for a centred crop
   *  (e.g. a building whose roofline is only a few percent from the top of
   *  the frame). Leave unset for anything with room to spare on both axes. */
  imagePosition?: string;
}

/**
 * The one hero every page opens with. A full-bleed media background (poster
 * image, optional ambient video), a left-to-right reading scrim, a soft top
 * band for header legibility, and a bright hairline marking the seam with the
 * next section. Copy is left-anchored within the editorial reading column so
 * it lines up with every section below.
 *
 * Mount entrance mirrors <LandingHero>'s choreography — badge punches in, the
 * heading lines rise line-by-line from a clipped baseline, the description
 * follows through a blur. The resting DOM is already the visible state, so a
 * skipped or interrupted animation still shows everything; the whole thing is
 * inert under `prefers-reduced-motion`.
 *
 * The site header rides transparently over this hero (see
 * `config/page-chrome.ts`), so the section stays `bg-brand-dark` with a dark
 * scrim regardless of the poster.
 */
export function MediaHero({
  eyebrow,
  title,
  description,
  image,
  video,
  mobileVideo,
  primary,
  secondary,
  size = "compact",
  imagePosition,
}: MediaHeroProps) {
  const introRef = React.useRef<HTMLDivElement>(null);
  const badgeRef = React.useRef<HTMLSpanElement>(null);
  const headingRef = React.useRef<HTMLDivElement>(null);
  const descriptionRef = React.useRef<HTMLParagraphElement>(null);

  const lines = Array.isArray(title) ? title : [title as string];

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }

      const headingLines = gsap.utils.toArray<HTMLElement>(
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

      if (headingLines.length) {
        timeline.fromTo(
          headingLines,
          { yPercent: 110, scale: 0.94, transformOrigin: "50% 100%" },
          {
            yPercent: 0,
            scale: 1,
            duration: 1.1,
            stagger: 0.14,
            ease: "back.out(1.6)",
            clearProps: "transform",
          },
          "-=0.35",
        );
      }

      if (descriptionRef.current) {
        timeline.fromTo(
          descriptionRef.current,
          { opacity: 0, y: 14, filter: "blur(10px)" },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.9,
            ease: "power3.out",
            clearProps: "filter",
          },
          "-=0.55",
        );
      }
    },
    { scope: introRef },
  );

  return (
    <section
      className={cn(
        "dexta-hero relative isolate flex items-center overflow-hidden bg-brand-dark text-on-media",
        size === "compact" && "dexta-hero--compact",
      )}
    >
      <HeroVideo
        video={video}
        mobileVideo={mobileVideo}
        poster={image}
        position={imagePosition}
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
            {eyebrow}
          </span>

          <div ref={headingRef}>
            <HeroHeading
              data-commanding
              className="[text-shadow:0_2px_28px_rgb(0_0_0/0.45)]"
            >
              {lines.map((heroLine, index) => (
                <span key={index} className="block overflow-hidden py-1">
                  <span data-hero-line-inner className="block">
                    {renderWithAccents(heroLine)}
                  </span>
                </span>
              ))}
            </HeroHeading>
          </div>

          {description && (
            <p
              ref={descriptionRef}
              className="max-w-xl font-sans text-base leading-6 text-pretty text-hero-copy [text-shadow:0_1px_16px_rgb(0_0_0/0.4)] sm:text-lg"
            >
              {description}
            </p>
          )}

          {(primary || secondary) && (
            <Reveal
              delay={0.85}
              className="flex flex-wrap items-center gap-3 pt-2"
            >
              {primary && (
                <ButtonLink href={primary.href} size="lg">
                  {primary.label}
                  <Icon name="arrow-right" />
                </ButtonLink>
              )}
              {secondary && (
                <ButtonLink href={secondary.href} size="lg" variant="onMedia">
                  {secondary.label}
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
