"use client";

import * as React from "react";
import Image from "next/image";
import { Container } from "@/components/layout";
import { Reveal } from "@/components/marketing";
import { EditorialEyebrow, EditorialHeading, Icon } from "@/components/ui";
import { aboutMotion } from "@/config/about-motion";
import { gsap, useGSAP } from "@/lib/gsap";
import { isRemoteAsset } from "@/lib/media";
import type { AboutJourneyContent } from "../types/about-page";

/**
 * The "Our journey" band. A dark, full-bleed section over a faint texture; a
 * vertical rule beside the milestone list fills from 0 → 1 as the section
 * scrolls through (GSAP scrub on the `--journey-progress` custom property).
 * With no JS / reduced motion the rule simply renders full (see globals.css).
 */
export function AboutJourney({ content }: { content: AboutJourneyContent }) {
  const rootRef = React.useRef<HTMLElement>(null);
  const railRef = React.useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(aboutMotion.enabledMedia, () => {
        const rail = railRef.current;
        if (!rail) return;
        const { line } = aboutMotion.journey;
        gsap.fromTo(
          rail,
          { "--journey-progress": 0 },
          {
            "--journey-progress": 1,
            ease: "none",
            scrollTrigger: {
              trigger: rail,
              start: line.start,
              end: line.end,
              scrub: line.scrub,
            },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: rootRef },
  );

  return (
    <section
      ref={rootRef}
      className="about-journey relative isolate overflow-hidden bg-brand-dark py-about text-brand-light"
      aria-labelledby="journey-heading"
    >
      <Image
        src={content.background}
        alt=""
        fill
        sizes="100vw"
        className="-z-10 object-cover opacity-[0.09]"
        unoptimized={isRemoteAsset(content.background)}
      />

      <Container className="relative grid gap-14 lg:grid-cols-[1fr_0.9fr] lg:items-start lg:gap-20">
        <div className="flex flex-col gap-10">
          <Reveal className="flex flex-col gap-5">
            <EditorialEyebrow className="text-brand-light/60">
              {content.eyebrow}
            </EditorialEyebrow>
            <EditorialHeading className="max-w-lg">
              {content.title}
            </EditorialHeading>
          </Reveal>

          <div className="flex gap-6 sm:gap-8">
            <div ref={railRef} className="about-journey__rail" aria-hidden />
            <ol className="flex flex-1 flex-col gap-10">
              {content.milestones.map((milestone) => (
                <Reveal as="li" key={milestone.year} className="flex gap-5">
                  <span className="about-journey__marker" aria-hidden />
                  <div className="flex flex-col gap-2">
                    <span className="font-mono text-sm tracking-[0.06em] text-primary">
                      {milestone.year}
                    </span>
                    <p className="max-w-md text-sm text-pretty text-brand-light/80">
                      {milestone.text}
                    </p>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>

        {content.video && (
          <Reveal
            as="figure"
            className="relative aspect-[4/3] w-full overflow-hidden rounded-panel bg-brand-dark-elevated lg:sticky lg:top-28"
          >
            <Image
              src={content.video.poster}
              alt=""
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover"
              unoptimized={isRemoteAsset(content.video.poster)}
            />
            <a
              href={content.video.href}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute inset-0 grid place-items-center bg-brand-dark/25 transition-colors hover:bg-brand-dark/10 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              <span className="grid size-16 place-items-center rounded-full border border-on-media-border bg-on-media-surface text-on-media backdrop-blur-md">
                <Icon name="play" size={22} />
              </span>
              <span className="sr-only">Watch the Dexta Africa story</span>
            </a>
          </Reveal>
        )}
      </Container>
    </section>
  );
}
