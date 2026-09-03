import Image from "next/image";
import * as React from "react";
import { Container } from "@/components/layout";
import { isRemoteAsset } from "@/lib/media";
import { ScrollFade } from "./reveal";

export interface PressLogo {
  name: string;
  /** Path under /public. */
  src: string;
  /** Intrinsic pixel size of the source file — used only for aspect ratio;
   *  the logo renders at a fixed display height (see `.press-marquee__logo`). */
  width: number;
  height: number;
}

// The files in public/images/press/. Drop a new PNG/SVG here and add a line —
// no other change needed.
const DEFAULT_PRESS_LOGOS: readonly PressLogo[] = [
  {
    name: "Medium",
    src: "/images/press/logo-medium-removebg-preview.png",
    width: 165,
    height: 61,
  },
  {
    name: "Punch",
    src: "/images/press/logo-punch-removebg-preview.png",
    width: 106,
    height: 61,
  },
  {
    name: "Reuters",
    src: "/images/press/logo-reuters-removebg-preview.png",
    width: 133,
    height: 61,
  },
  {
    name: "The Guardian",
    src: "/images/press/logo-the-guardian-removebg-preview.png",
    width: 125,
    height: 61,
  },
  {
    name: "Yahoo",
    src: "/images/press/logo-yahoo-removebg-preview.png",
    width: 116,
    height: 61,
  },
];

export interface PressLogosProps {
  eyebrow?: string;
  items?: readonly PressLogo[];
}

/**
 * "As featured in" — a slim, continuously-scrolling strip of press marks, the
 * same mechanism as the expertise marquee: one accessible list followed by
 * `aria-hidden` copies, the whole track translated exactly -50% so the loop
 * has no seam. Pure CSS scroll (no JS, no hydration cost); only the once-per
 * -visit entrance goes through `<Reveal>`. Edges dissolve via `mask-image`.
 *
 * Logos sit monochrome and dimmed at rest and resolve to full strength on
 * hover (which also pauses the scroll). The mark colour is inverted under the
 * dark theme so the black source files stay legible either way.
 */
export function PressLogos({
  eyebrow = "As featured in",
  items = DEFAULT_PRESS_LOGOS,
}: PressLogosProps) {
  const headingId = React.useId();
  // Four copies: two make one seamless set wider than any viewport, the other
  // two are what -50% scrolls into. Copies past the first are inert to AT.
  const loop = [...items, ...items, ...items, ...items];

  return (
    <section aria-labelledby={headingId} className="press-marquee">
      <Container className="press-marquee__inner">
        <ScrollFade as="div" className="press-marquee__signal">
          <span aria-hidden className="press-marquee__dot" />
          <span id={headingId} className="press-marquee__label">
            {eyebrow}
          </span>
        </ScrollFade>

        <ScrollFade as="div" delay={0.1} className="press-marquee__viewport">
          <ul className="press-marquee__track">
            {loop.map((logo, index) => {
              const duplicate = index >= items.length;
              return (
                <li
                  key={`${logo.name}-${index}`}
                  aria-hidden={duplicate || undefined}
                  data-duplicate={duplicate || undefined}
                  className="press-marquee__item"
                >
                  <Image
                    src={logo.src}
                    alt={duplicate ? "" : `${logo.name} logo`}
                    width={logo.width}
                    height={logo.height}
                    unoptimized={isRemoteAsset(logo.src)}
                    className="press-marquee__logo"
                  />
                </li>
              );
            })}
          </ul>
        </ScrollFade>
      </Container>
    </section>
  );
}
