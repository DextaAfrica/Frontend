"use client";

import * as React from "react";
import Image from "next/image";
import { Container } from "@/components/layout";
import { EditorialEyebrow, Icon, renderWithAccents } from "@/components/ui";
import { aboutMotion } from "@/config/about-motion";
import { gsap, useGSAP } from "@/lib/gsap";
import { isRemoteAsset } from "@/lib/media";
import type { CeoLetterContent } from "../types/about-page";

/**
 * The CEO's letter — the page's centrepiece. A centred envelope mark opens
 * it (this *is* a letter, so the motif is literal, not decorative filler),
 * then a fixed-width portrait column (sits sticky beside the letter on
 * desktop, so it never drifts out of alignment) and the letter itself:
 * eyebrow, staggered paragraphs, then the closing line as an oversized serif
 * pull-line, then the signature + typed attribution.
 *
 * On first view: the envelope pops in, then the portrait and the letter
 * body slide in together from their own outer edge and converge toward the
 * centre — a bespoke effect for the letter, the page's one hand-tuned
 * centrepiece — before the paragraphs, closing line, and signature stagger
 * in on their own.
 */
export function CeoLetter({ content }: { content: CeoLetterContent }) {
  const rootRef = React.useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(aboutMotion.enabledMedia, () => {
        const root = rootRef.current;
        if (!root) return;
        const { slideIn, letter } = aboutMotion.ceo;

        const envelopeEl = root.querySelector<HTMLElement>(
          "[data-ceo-envelope]",
        );
        if (envelopeEl) {
          gsap.fromTo(
            envelopeEl,
            { opacity: 0, y: -16, scale: 0.7, rotate: -8 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              rotate: 0,
              duration: 0.7,
              ease: "back.out(1.8)",
              scrollTrigger: { trigger: root, start: letter.start, once: true },
            },
          );
        }

        // Portrait and letter body converge toward the centre from their
        // own outer edge: both start pushed past their column and hidden
        // (gsap.set, not fromTo — the resting DOM is already
        // fully visible, so a skipped/interrupted tween never strands
        // either half off-screen), then animate together on one timeline so
        // they visibly arrive from opposite sides at the same moment.
        const portraitEl = root.querySelector<HTMLElement>(
          "[data-ceo-portrait]",
        );
        const bodyEl = root.querySelector<HTMLElement>("[data-ceo-body]");
        if (portraitEl && bodyEl) {
          gsap.set(portraitEl, { x: -slideIn.offset, opacity: 0 });
          gsap.set(bodyEl, { x: slideIn.offset, opacity: 0 });

          gsap.to([portraitEl, bodyEl], {
            x: 0,
            opacity: 1,
            duration: slideIn.duration,
            ease: "back.out(1.6)",
            scrollTrigger: {
              trigger: root,
              start: slideIn.start,
              once: true,
            },
          });
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
      {content.background && (
        <Image
          src={content.background}
          alt=""
          fill
          sizes="100vw"
          className="ceo-letter__texture"
          unoptimized={isRemoteAsset(content.background)}
        />
      )}

      <Container className="relative">
        <div data-ceo-envelope aria-hidden className="ceo-letter__envelope">
          <Icon name="mail" size={28} strokeWidth={1.5} />
        </div>

        <div className="ceo-letter__grid">
          <figure
            data-ceo-portrait
            className="ceo-letter__portrait will-change-transform"
          >
            {content.portrait ? (
              <Image
                src={content.portrait}
                alt={`Portrait of ${content.name}`}
                fill
                sizes="(min-width: 64rem) 22rem, (min-width: 40rem) 55vw, 90vw"
                unoptimized={isRemoteAsset(content.portrait)}
              />
            ) : (
              <span className="ceo-letter__portrait-fallback">
                {content.name}
              </span>
            )}
          </figure>

          <div data-ceo-body className="ceo-letter__body will-change-transform">
            <EditorialEyebrow id="ceo-heading" className="text-primary">
              {content.eyebrow}
            </EditorialEyebrow>

            <div className="ceo-letter__prose">
              {content.paragraphs.map((paragraph, index) => (
                <p key={index} data-ceo-para className="ceo-letter__para">
                  {renderWithAccents(paragraph)}
                </p>
              ))}
            </div>

            <p data-ceo-kicker className="ceo-letter__kicker">
              {renderWithAccents(content.kicker)}
            </p>

            <div data-ceo-sign className="ceo-letter__sign">
              <Image
                src={content.signature}
                alt=""
                width={1124}
                height={1399}
                className="ceo-letter__signature"
                unoptimized={isRemoteAsset(content.signature)}
              />
              <div>
                <p className="ceo-letter__sign-name">{content.name}</p>
                <p className="ceo-letter__sign-title">{content.title}</p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
