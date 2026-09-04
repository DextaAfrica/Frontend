"use client";

import Image from "next/image";
import * as React from "react";
import { Container } from "@/components/layout";
import {
  ButtonLink,
  EditorialEyebrow,
  EditorialHeading,
  Icon,
} from "@/components/ui";
import { gsap, useGSAP } from "@/lib/gsap";
import { IMAGE_PLACEHOLDER, isRemoteAsset } from "@/lib/media";
import { cn } from "@/lib/utils";

export interface ServiceLineBandProps {
  eyebrow: string;
  title: string;
  description: string;
  scope: readonly string[];
  image: string;
  /** Puts the photo on the left instead of the right — alternate this per
   *  item in a list so a run of these bands doesn't read as one column
   *  repeated three times. */
  reverse?: boolean;
  ctaLabel?: string;
  ctaHref?: string;
}

const SLIDE_OFFSET = 72;
const SLIDE_DURATION = 1.3;

/**
 * One line-of-business band: copy on one side, a photo on the other,
 * alternating per instance via `reverse` — the exact slide-in-from-
 * opposite-edges mechanism the homepage's about-teaser uses for its own
 * copy/media pair (`gsap.set` for the hidden starting point, never
 * `fromTo` — the resting DOM is already fully visible, so a skipped or
 * interrupted animation can never strand either half off-screen), reused
 * deliberately rather than re-invented, so a page built from several of
 * these still reads as the same considered motion language throughout.
 *
 * The scope list is what makes this a *fuller* treatment than the
 * homepage's own compact services cards — three lines of what a visitor
 * gets, not just a headline and a sentence.
 */
export function ServiceLineBand({
  eyebrow,
  title,
  description,
  scope,
  image,
  reverse = false,
  ctaLabel = "Discuss a project",
  ctaHref = "/contact",
}: ServiceLineBandProps) {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const copyRef = React.useRef<HTMLDivElement>(null);
  const mediaRef = React.useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const copy = copyRef.current;
        const media = mediaRef.current;
        if (!copy || !media) return;

        const copyFrom = reverse ? SLIDE_OFFSET : -SLIDE_OFFSET;
        gsap.set(copy, { x: copyFrom, opacity: 0 });
        gsap.set(media, { x: -copyFrom, opacity: 0 });

        gsap.to([copy, media], {
          x: 0,
          opacity: 1,
          duration: SLIDE_DURATION,
          ease: "back.out(1.6)",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top 78%",
            once: true,
          },
        });
      });
      return () => mm.revert();
    },
    { scope: rootRef, dependencies: [reverse] },
  );

  return (
    <Container>
      <div
        ref={rootRef}
        className="grid gap-10 md:grid-cols-2 md:items-center md:gap-16"
      >
        <div
          ref={copyRef}
          className={cn(
            "flex flex-col items-start gap-6 will-change-transform",
            reverse && "md:order-2",
          )}
        >
          <EditorialEyebrow>{eyebrow}</EditorialEyebrow>
          <EditorialHeading>{title}</EditorialHeading>
          <p className="max-w-lg text-pretty text-muted-foreground">
            {description}
          </p>
          <ul className="flex flex-col gap-3">
            {scope.map((item) => (
              <li key={item} className="flex items-center gap-3 text-sm">
                <Icon
                  name="badge-check"
                  size={18}
                  className="shrink-0 text-primary"
                />
                <span className="text-foreground">{item}</span>
              </li>
            ))}
          </ul>
          <ButtonLink
            href={ctaHref}
            variant="secondary"
            size="lg"
            className="mt-2"
          >
            {ctaLabel}
            <Icon name="arrow-right" />
          </ButtonLink>
        </div>

        <div
          ref={mediaRef}
          className={cn(
            "relative aspect-[5/4] overflow-hidden rounded-panel border border-border bg-muted will-change-transform",
            reverse && "md:order-1",
          )}
        >
          <Image
            src={image}
            alt=""
            fill
            loading="lazy"
            sizes="(min-width: 768px) 45vw, 100vw"
            placeholder="blur"
            blurDataURL={IMAGE_PLACEHOLDER}
            unoptimized={isRemoteAsset(image)}
            className="object-cover"
          />
          <span
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"
          />
        </div>
      </div>
    </Container>
  );
}
