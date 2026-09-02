"use client";

import * as React from "react";
import Image from "next/image";
import { Section } from "@/components/layout";
import { Eyebrow, Heading, Text } from "@/components/ui";
import { aboutMotion } from "@/config/about-motion";
import { gsap, useGSAP } from "@/lib/gsap";
import { isRemoteAsset } from "@/lib/media";
import type { AboutHeroContent } from "../types/about-page";

/**
 * The About page banner: eyebrow → heading → lede on the left, a two-photo
 * collage on the right. Entrance cadence matches <EditorialHero>; the collage
 * plates then drift on a single scrubbed axis as the section scrolls past —
 * the same restraint the services media uses (one property in motion, no
 * scale). Resting state is the CSS default, so a skipped animation still
 * shows everything.
 */
export function AboutHero({ content }: { content: AboutHeroContent }) {
  const scopeRef = React.useRef<HTMLDivElement>(null);
  const eyebrowRef = React.useRef<HTMLDivElement>(null);
  const headingRef = React.useRef<HTMLHeadingElement>(null);
  const ledeRef = React.useRef<HTMLParagraphElement>(null);
  const collageRef = React.useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(aboutMotion.enabledMedia, () => {
        const { enter, parallax } = aboutMotion.hero;
        const timeline = gsap.timeline({ delay: 0.05 });

        if (eyebrowRef.current) {
          timeline.fromTo(
            eyebrowRef.current,
            { opacity: 0, y: enter.eyebrow.y },
            {
              opacity: 1,
              y: 0,
              duration: enter.eyebrow.duration,
              ease: "power2.out",
            },
          );
        }
        if (headingRef.current) {
          timeline.fromTo(
            headingRef.current,
            {
              opacity: 0,
              y: enter.title.y,
              filter: `blur(${enter.title.blur}px)`,
            },
            {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              duration: enter.title.duration,
              ease: "power3.out",
              clearProps: "filter",
            },
            enter.title.overlap,
          );
        }
        if (ledeRef.current) {
          timeline.fromTo(
            ledeRef.current,
            { opacity: 0, y: enter.lede.y },
            {
              opacity: 1,
              y: 0,
              duration: enter.lede.duration,
              ease: "power2.out",
            },
            enter.lede.overlap,
          );
        }
        if (collageRef.current) {
          timeline.fromTo(
            collageRef.current,
            { opacity: 0, y: enter.collage.y },
            {
              opacity: 1,
              y: 0,
              duration: enter.collage.duration,
              ease: "power3.out",
            },
            enter.collage.overlap,
          );
        }

        const plates = gsap.utils.toArray<HTMLElement>(
          collageRef.current?.querySelectorAll("[data-parallax]") ?? [],
        );
        plates.forEach((plate) => {
          const from = Number(plate.dataset.parallax) || 0;
          gsap.fromTo(
            plate,
            { yPercent: from },
            {
              yPercent: -from,
              ease: "none",
              scrollTrigger: {
                trigger: collageRef.current,
                start: "top bottom",
                end: "bottom top",
                scrub: parallax.scrub,
              },
            },
          );
        });
      });

      return () => mm.revert();
    },
    { scope: scopeRef },
  );

  return (
    <Section spacing="lg" className="overflow-hidden">
      <span aria-hidden className="about-hero__glow absolute inset-0" />
      <div
        ref={scopeRef}
        className="relative grid gap-12 lg:grid-cols-[1fr_0.85fr] lg:items-center lg:gap-16"
      >
        <div className="flex max-w-xl flex-col items-start gap-6">
          <div ref={eyebrowRef}>
            <Eyebrow>{content.eyebrow}</Eyebrow>
          </div>
          <Heading ref={headingRef}>{content.title}</Heading>
          <Text ref={ledeRef} className="max-w-lg text-pretty">
            {content.lede}
          </Text>
        </div>

        <div ref={collageRef} className="about-hero__collage">
          <div
            data-parallax={aboutMotion.hero.parallax.peopleFromPercent}
            className="about-hero__plate h-about-hero-media"
          >
            <Image
              src={content.images.people}
              alt=""
              fill
              priority
              sizes="(min-width: 1024px) 40vw, 100vw"
              unoptimized={isRemoteAsset(content.images.people)}
            />
          </div>
          <div
            data-parallax={aboutMotion.hero.parallax.propertyFromPercent}
            className="about-hero__plate about-hero__plate--rear aspect-[4/3]"
          >
            <Image
              src={content.images.property}
              alt=""
              fill
              sizes="(min-width: 1024px) 22vw, 50vw"
              unoptimized={isRemoteAsset(content.images.property)}
            />
          </div>
        </div>
      </div>
    </Section>
  );
}
