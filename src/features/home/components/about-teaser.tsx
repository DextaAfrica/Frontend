"use client";

import Image from "next/image";
import * as React from "react";
import { Container, Section } from "@/components/layout";
import {
  ButtonLink,
  EditorialEyebrow,
  EditorialHeading,
  Icon,
} from "@/components/ui";
import { gsap, useGSAP } from "@/lib/gsap";
import { isRemoteAsset } from "@/lib/media";
import type { AboutTeaserContent } from "../types/home-page";

/**
 * A quiet strip between the statistics and the rest of the page — the
 * numbers above have a story behind them, and this points at it.
 *
 * The copy slides in from the left, the portrait from the right, both
 * converging toward the centre on one timeline — `back.out` easing means
 * each overshoots its resting spot by a few pixels before settling, which
 * reads as the two halves arriving and gently bouncing into place rather
 * than sliding to a dead stop.
 *
 * Behind it, edge to edge across the whole section (the wave/droplet layers
 * are section-level, outside the Container), a slow looping SVG wave plus a
 * few drifting red "droplet" glows — pure CSS/SVG (an animated `transform`,
 * nothing else), so it's effectively free at rest and fully inert under
 * `prefers-reduced-motion`. No video file, but the same "always gently
 * moving" quality one would carry, without the weight.
 */
export function AboutTeaser({ content }: { content: AboutTeaserContent }) {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const copyRef = React.useRef<HTMLDivElement>(null);
  const mediaRef = React.useRef<HTMLDivElement>(null);
  const dropletsRef = React.useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const copy = copyRef.current;
        const media = mediaRef.current;
        if (copy && media) {
          gsap.set(copy, { x: -72, opacity: 0 });
          gsap.set(media, { x: 72, opacity: 0 });

          gsap.to([copy, media], {
            x: 0,
            opacity: 1,
            duration: 1.3,
            ease: "back.out(1.6)",
            scrollTrigger: {
              trigger: rootRef.current,
              start: "top 78%",
              once: true,
            },
          });
        }

        // Droplets: slow, independent, endless drift + pulse — never in
        // lockstep, so the glow never reads as a single repeating loop.
        const drops = gsap.utils.toArray<HTMLElement>(
          dropletsRef.current?.children ?? [],
        );
        drops.forEach((drop, index) => {
          gsap.to(drop, {
            x: index % 2 === 0 ? 16 : -14,
            y: index % 2 === 0 ? -20 : 18,
            scale: 1.18,
            duration: 6.5 + index * 1.4,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
            delay: index * 0.5,
          });
        });
      });
      return () => mm.revert();
    },
    { scope: rootRef, dependencies: [content] },
  );

  return (
    <Section
      spacing="editorial"
      tone="surface"
      contained={false}
      aria-labelledby="about-teaser-heading"
      className="about-teaser"
    >
      <div aria-hidden className="about-teaser__waves">
        <svg
          className="about-teaser__wave about-teaser__wave--back"
          viewBox="0 0 2400 300"
          preserveAspectRatio="none"
        >
          <path d="M0,170 C300,50 900,50 1200,170 C1500,50 2100,50 2400,170 L2400,300 L0,300 Z" />
        </svg>
        <svg
          className="about-teaser__wave about-teaser__wave--front"
          viewBox="0 0 2400 300"
          preserveAspectRatio="none"
        >
          <path d="M0,230 C300,130 900,130 1200,230 C1500,130 2100,130 2400,230 L2400,300 L0,300 Z" />
        </svg>
      </div>
      <div ref={dropletsRef} aria-hidden className="about-teaser__droplets">
        <span className="about-teaser__droplet about-teaser__droplet--a" />
        <span className="about-teaser__droplet about-teaser__droplet--b" />
        <span className="about-teaser__droplet about-teaser__droplet--c" />
        <span className="about-teaser__droplet about-teaser__droplet--d" />
      </div>

      <Container>
        <div
          ref={rootRef}
          className="relative grid gap-10 md:grid-cols-[1fr_0.8fr] md:items-center md:gap-16"
        >
          <div
            ref={copyRef}
            className="flex flex-col items-start gap-6 will-change-transform"
          >
            <EditorialEyebrow>{content.eyebrow}</EditorialEyebrow>
            <EditorialHeading id="about-teaser-heading">
              {content.title}
            </EditorialHeading>
            <ButtonLink href={content.cta.href} variant="secondary" size="lg">
              {content.cta.label}
              <Icon name="arrow-right" />
            </ButtonLink>
          </div>

          <div
            ref={mediaRef}
            className="relative aspect-[5/4] overflow-hidden rounded-panel border border-border bg-muted will-change-transform"
          >
            <Image
              src={content.image}
              alt=""
              fill
              sizes="(min-width: 768px) 45vw, 100vw"
              unoptimized={isRemoteAsset(content.image)}
              className="object-cover"
            />
            <span
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"
            />
          </div>
        </div>
      </Container>
    </Section>
  );
}
