"use client";

import * as React from "react";
import Image from "next/image";
import { Container } from "@/components/layout";
import { EditorialEyebrow, renderWithAccents } from "@/components/ui";
import { aboutMotion } from "@/config/about-motion";
import { gsap, useGSAP } from "@/lib/gsap";
import { isRemoteAsset } from "@/lib/media";
import type { CeoLetterContent } from "../types/about-page";

/**
 * The CEO's letter — the page's centrepiece. Portrait wipes open on first
 * view; the paragraphs stagger in; the closing line ("We're not done yet…")
 * lands last as an oversized serif pull-line. The signature sits on a
 * deliberately paper-toned plaque so a scanned ink signature reads the same
 * in light and dark, with the typed name/title as the real attribution.
 */
export function CeoLetter({ content }: { content: CeoLetterContent }) {
  const rootRef = React.useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(aboutMotion.enabledMedia, () => {
        const root = rootRef.current;
        if (!root) return;
        const { portrait, letter } = aboutMotion.ceo;

        const portraitEl = root.querySelector<HTMLElement>(
          "[data-ceo-portrait]",
        );
        if (portraitEl) {
          gsap.fromTo(
            portraitEl,
            {
              clipPath: `inset(${portrait.clipFrom}% 0% 0% 0%)`,
              scale: portrait.scaleFrom,
            },
            {
              clipPath: "inset(0% 0% 0% 0%)",
              scale: 1,
              duration: portrait.duration,
              ease: "power3.out",
              scrollTrigger: {
                trigger: portraitEl,
                start: portrait.start,
                once: true,
              },
            },
          );
        }

        const paragraphs = gsap.utils.toArray<HTMLElement>(
          root.querySelectorAll("[data-ceo-para]"),
        );
        const signature = root.querySelector<HTMLElement>("[data-ceo-sign]");
        const kicker = root.querySelector<HTMLElement>("[data-ceo-kicker]");

        const timeline = gsap.timeline({
          scrollTrigger: { trigger: root, start: letter.start, once: true },
        });
        if (paragraphs.length) {
          timeline.fromTo(
            paragraphs,
            { opacity: 0, y: letter.paragraph.y },
            {
              opacity: 1,
              y: 0,
              duration: letter.paragraph.duration,
              stagger: letter.paragraph.stagger,
              ease: "power3.out",
            },
          );
        }
        if (kicker) {
          timeline.fromTo(
            kicker,
            {
              opacity: 0,
              y: letter.kicker.y,
              filter: `blur(${letter.kicker.blur}px)`,
            },
            {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              duration: letter.kicker.duration,
              ease: "power3.out",
              clearProps: "filter",
            },
            letter.kicker.overlap,
          );
        }
        if (signature) {
          timeline.fromTo(
            signature,
            { opacity: 0, y: letter.signature.y },
            {
              opacity: 1,
              y: 0,
              duration: letter.signature.duration,
              ease: "power3.out",
            },
            letter.signature.overlap,
          );
        }
      });
      return () => mm.revert();
    },
    { scope: rootRef },
  );

  return (
    <section
      ref={rootRef}
      className="ceo-letter py-about"
      aria-labelledby="ceo-heading"
    >
      <Image
        src={content.background}
        alt=""
        fill
        sizes="100vw"
        className="ceo-letter__texture"
        unoptimized={isRemoteAsset(content.background)}
      />

      <Container className="relative grid gap-12 lg:grid-cols-[0.8fr_1fr] lg:items-start lg:gap-16">
        <div
          data-ceo-portrait
          className="ceo-letter__portrait aspect-[4/5] w-full max-w-ceo-portrait lg:sticky lg:top-28"
        >
          {content.portrait ? (
            <Image
              src={content.portrait}
              alt={`Portrait of ${content.name}`}
              fill
              sizes="(min-width: 1024px) 30vw, 80vw"
              unoptimized={isRemoteAsset(content.portrait)}
            />
          ) : (
            <span className="grid h-full place-items-center p-6 text-center text-sm text-muted-foreground">
              {content.name}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-6">
          <EditorialEyebrow id="ceo-heading" className="text-primary">
            {content.eyebrow}
          </EditorialEyebrow>

          <div className="flex flex-col gap-5">
            {content.paragraphs.map((paragraph, index) => (
              <p
                key={index}
                data-ceo-para
                className="font-sans text-[clamp(1rem,0.91rem_+_0.38vw,1.25rem)] leading-[1.5] text-pretty text-foreground/90"
              >
                {renderWithAccents(paragraph)}
              </p>
            ))}
          </div>

          <p
            data-ceo-kicker
            className="ceo-letter__kicker mt-2 text-foreground"
          >
            {renderWithAccents(content.kicker)}
          </p>

          <div data-ceo-sign className="ceo-letter__plaque mt-4">
            <Image
              src={content.signature}
              alt={`${content.name} signature`}
              width={220}
              height={64}
              className="ceo-letter__signature"
              unoptimized={isRemoteAsset(content.signature)}
            />
            <div>
              <p className="font-display font-semibold">{content.name}</p>
              <p className="text-sm text-brand-dark/70">{content.title}</p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
