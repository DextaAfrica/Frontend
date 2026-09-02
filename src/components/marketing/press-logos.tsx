"use client";

import Image from "next/image";
import * as React from "react";
import { Container } from "@/components/layout";
import { Card } from "@/components/ui";
import { gsap, useGSAP } from "@/lib/gsap";
import { isRemoteAsset } from "@/lib/media";
import { Reveal } from "./reveal";

export interface PressLogo {
  name: string;
  /** Path under /public, e.g. "/images/press/the-guardian.png". */
  src: string;
}

// Drop the real files at these exact paths (public/images/press/) and this
// section picks them up with no code changes — PNG or SVG, transparent
// background, logo roughly 400-600px wide is plenty for the tile size here.
const DEFAULT_PRESS_LOGOS: readonly PressLogo[] = [
  { name: "BusinessDay", src: "/images/press/businessday.png" },
  { name: "Punch", src: "/images/press/punch.png" },
  { name: "The Guardian", src: "/images/press/the-guardian.png" },
  { name: "Yahoo", src: "/images/press/yahoo.png" },
  { name: "Medium", src: "/images/press/medium.png" },
];

export interface PressLogosProps {
  eyebrow?: string;
  items?: readonly PressLogo[];
}

/**
 * "As featured in" — rebuilt as a quiet row of premium logo tiles, not a
 * text ticker: one small label, then the marks themselves carry the
 * section. Each tile reuses the site's own `Card` (the same bordered,
 * hover-lift surface used everywhere else) so this reads as part of the
 * same design system, not a bespoke one-off.
 *
 * Every tile pops in with a spring (`back.out`) as the row scrolls into
 * view — layered on top of `Reveal`'s own fade/rise on the section itself,
 * never fighting it (different properties). Logos sit desaturated at rest
 * and resolve to full colour with a lift on hover, matching `Card`'s own
 * hover language.
 */
export function PressLogos({
  eyebrow = "As featured in",
  items = DEFAULT_PRESS_LOGOS,
}: PressLogosProps) {
  const headingId = React.useId();
  const gridRef = React.useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tiles = gsap.utils.toArray<HTMLElement>(
          gridRef.current?.querySelectorAll("[data-press-tile]") ?? [],
        );
        if (!tiles.length) return;

        gsap.set(tiles, { scale: 0.84, transformOrigin: "50% 50%" });
        gsap.to(tiles, {
          scale: 1,
          duration: 0.9,
          ease: "back.out(1.7)",
          stagger: 0.08,
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 85%",
            once: true,
          },
        });
      });
      return () => mm.revert();
    },
    { scope: gridRef, dependencies: [items] },
  );

  return (
    <section aria-labelledby={headingId} className="press-logos">
      <Container>
        <Reveal className="press-logos__signal">
          <span aria-hidden className="press-logos__dot" />
          <span id={headingId} className="press-logos__label">
            {eyebrow}
          </span>
        </Reveal>

        <div ref={gridRef} className="press-logos__grid">
          {items.map((logo) => (
            <div key={logo.name} data-press-tile className="press-logos__tile">
              <Card className="press-logos__card">
                <div className="press-logos__mark">
                  <Image
                    src={logo.src}
                    alt={logo.name}
                    fill
                    sizes="180px"
                    unoptimized={isRemoteAsset(logo.src)}
                    className="press-logos__image object-contain"
                  />
                </div>
              </Card>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
