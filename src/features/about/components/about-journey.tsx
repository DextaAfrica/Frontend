"use client";

import * as React from "react";
import { Container } from "@/components/layout";
import { Reveal, YouTubeBackground } from "@/components/marketing";
import {
  EditorialEyebrow,
  EditorialHeading,
  renderWithAccents,
} from "@/components/ui";
import { aboutMotion } from "@/config/about-motion";
import { gsap, useGSAP } from "@/lib/gsap";
import type { AboutJourneyContent } from "../types/about-page";

/**
 * The "Our journey" band. A dark, full-bleed section over an ambient YouTube
 * backdrop (muted, looping, lazy — same treatment as the Dexta Clan band's
 * video variant), with a scrim carrying the legibility work. A vertical rule
 * beside the milestone list fills from 0 → 1 as the section scrolls through
 * (GSAP scrub on the `--journey-progress` custom property). With no JS /
 * reduced motion the rule renders full and the poster stands in for the
 * video (see globals.css).
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
      <YouTubeBackground
        id={content.video.id}
        poster={content.video.poster}
        className="about-journey__video"
      />
      <span aria-hidden className="about-journey__scrim" />

      <Container className="relative max-w-3xl">
        <Reveal className="flex flex-col gap-5">
          <EditorialEyebrow className="text-brand-light/60">
            {content.eyebrow}
          </EditorialEyebrow>
          <EditorialHeading id="journey-heading" className="max-w-lg">
            {content.title}
          </EditorialHeading>
        </Reveal>

        <div className="mt-12 flex gap-6 sm:gap-8">
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
                    {renderWithAccents(milestone.text)}
                  </p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
