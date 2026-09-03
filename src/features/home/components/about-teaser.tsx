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
 * Behind it, edge to edge across the whole section (the background field is
 * section-level, outside the Container): a radial-masked architect's grid
 * for structure, one soft shaft of warm light, and two oversized aurora
 * fields of brand red that drift on their own slow cycles. Transform/opacity
 * only, so it's effectively free at rest and fully inert under
 * `prefers-reduced-motion` — the field then simply holds still, still
 * commanding through scale rather than motion.
 */
export function AboutTeaser({ content }: { content: AboutTeaserContent }) {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const copyRef = React.useRef<HTMLDivElement>(null);
  const mediaRef = React.useRef<HTMLDivElement>(null);
  const auroraRef = React.useRef<HTMLDivElement>(null);
  const beamRef = React.useRef<HTMLSpanElement>(null);

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

        // Aurora fields: slow, independent, endless drift + swell — never in
        // lockstep, so the glow never reads as a single repeating loop.
        const blobs = gsap.utils.toArray<HTMLElement>(
          auroraRef.current?.children ?? [],
        );
        blobs.forEach((blob, index) => {
          gsap.to(blob, {
            xPercent: index % 2 === 0 ? 9 : -11,
            yPercent: index % 2 === 0 ? -12 : 9,
            scale: 1.16,
            duration: 13 + index * 4,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
            delay: index * 1.5,
          });
        });

        // The light shaft: a longer, even quieter breath — a slow lean and
        // a gentle rise in intensity, nothing more.
        if (beamRef.current) {
          gsap.to(beamRef.current, {
            xPercent: 7,
            opacity: 0.95,
            duration: 10,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
          });
        }
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
      <div aria-hidden className="about-teaser__bg">
        <span className="about-teaser__grid" />
        <span ref={beamRef} className="about-teaser__beam" />
        <div ref={auroraRef} className="about-teaser__aurora">
          <span className="about-teaser__blob about-teaser__blob--1" />
          <span className="about-teaser__blob about-teaser__blob--2" />
        </div>
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
