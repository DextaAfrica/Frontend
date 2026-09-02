"use client";

import * as React from "react";
import { Cluster, Section, Stack } from "@/components/layout";
import { ButtonLink, Eyebrow, Heading, Icon, Text } from "@/components/ui";
import { gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

interface EditorialHeroProps {
  eyebrow: string;
  title: string;
  description: string;
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string };
  className?: string;
}

/**
 * The page-top banner used by every non-homepage screen (about, projects,
 * blog, careers, contact, lifestyle, legal). Shares its entrance cadence
 * with the homepage's <LandingHero> — eyebrow, then heading, then
 * description/CTAs — just lighter and faster, since this fires on every
 * in-app navigation rather than once on first paint. Same rule as the
 * homepage hero applies here too: the visible/resting state is the CSS
 * default, and fromTo sets the hidden starting point at animation time, so
 * a failed animation still leaves the content visible rather than stuck
 * hidden.
 */
export function EditorialHero({
  eyebrow,
  title,
  description,
  primary,
  secondary,
  className,
}: EditorialHeroProps) {
  const scopeRef = React.useRef<HTMLDivElement>(null);
  const eyebrowRef = React.useRef<HTMLDivElement>(null);
  const headingRef = React.useRef<HTMLHeadingElement>(null);
  const descriptionRef = React.useRef<HTMLParagraphElement>(null);
  const ctaRef = React.useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }

      const timeline = gsap.timeline({ delay: 0.05 });

      if (eyebrowRef.current) {
        timeline.fromTo(
          eyebrowRef.current,
          { opacity: 0, y: 8 },
          { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
        );
      }

      if (headingRef.current) {
        timeline.fromTo(
          headingRef.current,
          { opacity: 0, y: 16, filter: "blur(8px)" },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.7,
            ease: "power3.out",
            clearProps: "filter",
          },
          "-=0.3",
        );
      }

      if (descriptionRef.current) {
        timeline.fromTo(
          descriptionRef.current,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
          "-=0.35",
        );
      }

      if (ctaRef.current) {
        timeline.fromTo(
          ctaRef.current,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
          "-=0.3",
        );
      }
    },
    { scope: scopeRef },
  );

  return (
    <Section spacing="lg" className={cn("overflow-hidden", className)}>
      <span aria-hidden className="editorial-hero-glow absolute inset-0" />
      <Stack
        ref={scopeRef}
        gap="lg"
        align="start"
        className="relative max-w-4xl"
      >
        <Stack gap="sm" align="start">
          <div ref={eyebrowRef}>
            <Eyebrow>{eyebrow}</Eyebrow>
          </div>
          <Heading ref={headingRef}>{title}</Heading>
        </Stack>
        <Text ref={descriptionRef} className="max-w-2xl text-pretty">
          {description}
        </Text>
        {(primary || secondary) && (
          <Cluster ref={ctaRef}>
            {primary && (
              <ButtonLink href={primary.href} size="lg">
                {primary.label}
                <Icon name="arrow-right" />
              </ButtonLink>
            )}
            {secondary && (
              <ButtonLink href={secondary.href} size="lg" variant="secondary">
                {secondary.label}
              </ButtonLink>
            )}
          </Cluster>
        )}
      </Stack>
    </Section>
  );
}
