"use client";

import * as React from "react";
import Image from "next/image";
import { Container } from "@/components/layout";
import {
  Badge,
  ButtonLink,
  HeroHeading,
  Icon,
  Modal,
  Text,
} from "@/components/ui";
import { renderWithAccents } from "@/components/ui/typography";
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
 * The site's top hero: a centered light-theme headline block followed by a
 * large rounded video-preview panel with a play button that opens the real
 * showreel in a modal. Distinct from CinematicHero, which is the full-bleed
 * treatment used further down the homepage.
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
  const [playing, setPlaying] = React.useState(false);

  return (
    <section className="relative overflow-hidden pt-28 pb-16 sm:pt-36 sm:pb-24">
      <span aria-hidden className="editorial-hero-glow absolute inset-0" />
      <Container size="editorial" className="relative">
        <Reveal className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
          <Badge variant="brand" className="gap-1.5">
            <Icon name="badge-check" size={14} />
            {badge}
          </Badge>
          <HeroHeading>
            {titleLines.map((line, index) => (
              <span key={index} className="block">
                {renderWithAccents(line)}
              </span>
            ))}
          </HeroHeading>
          <Text className="max-w-2xl text-base text-pretty sm:text-lg">
            {description}
          </Text>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <ButtonLink href={primary.href} size="lg">
              {primary.label}
              <Icon name="arrow-right" />
            </ButtonLink>
            <ButtonLink href={secondary.href} size="lg" variant="secondary">
              {secondary.label}
            </ButtonLink>
          </div>
        </Reveal>

        <Reveal delay={0.15} className="relative mt-14 sm:mt-16">
          <button
            type="button"
            onClick={() => setPlaying(true)}
            className="group relative block aspect-[16/10] w-full overflow-hidden rounded-3xl sm:aspect-[21/9]"
            aria-label="Play the Dexta Africa showreel"
          >
            <Image
              src={poster}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover transition-transform duration-700 ease-premium group-hover:scale-[1.02]"
            />
            <span
              aria-hidden
              className="absolute inset-0 bg-black/15 transition-colors group-hover:bg-black/25"
            />
            <span
              aria-hidden
              className="absolute top-1/2 left-1/2 grid size-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-brand-light/95 text-brand-dark shadow-xl transition-transform duration-300 group-hover:scale-110 sm:size-20"
            >
              <Icon
                name="play"
                size={26}
                className="translate-x-0.5"
                fill="currentColor"
              />
            </span>
          </button>
        </Reveal>
      </Container>

      <Modal
        open={playing}
        onClose={() => setPlaying(false)}
        title="Dexta Africa"
        className="w-[min(var(--layout-dialog-wide-viewport-width),var(--container-dialog-wide))]"
      >
        <video
          controls
          autoPlay
          playsInline
          poster={poster}
          className="aspect-video w-full rounded-panel bg-black"
        >
          {mobileVideo && (
            <source
              media="(max-width: 767px)"
              src={mobileVideo}
              type="video/webm"
            />
          )}
          <source src={video} type="video/webm" />
        </video>
      </Modal>
    </section>
  );
}
