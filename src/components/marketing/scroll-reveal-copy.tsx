"use client";

import * as React from "react";
import { Container } from "@/components/layout";
import { EditorialHeading } from "@/components/ui";
import { splitAccentWords } from "@/components/ui/typography";
import { homeMotion } from "@/config/home-motion";
import { gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import { Reveal } from "./reveal";

export interface ScrollRevealCopyProps extends Omit<
  React.ComponentProps<"section">,
  "children"
> {
  heading: string;
  paragraphs: readonly string[];
  initialWordCount?: number;
}

/**
 * Word-by-word scroll reveal: each word rises into place, sharpens out of a
 * blur, and brightens from a dim resting opacity — three properties moving
 * together rather than a flat opacity fade, which is what actually reads as
 * a deliberate reveal instead of a fade wearing one as a label. A `*word*`
 * (or `*multi word phrase*`) inside a paragraph gets the site's red accent
 * treatment, same convention as every heading — see <Accent>.
 *
 * Driven by GSAP ScrollTrigger's own scrub + stagger rather than a bespoke
 * scroll-listener/rAF/lerp loop, so this section finally shares the same
 * animation engine as the hero, the services stack, and every other
 * scroll-tied piece of this site instead of hand-rolling its own.
 *
 * The resting/no-JS state is fully visible (see .scroll-reveal-word in
 * globals.css) — GSAP's `gsap.set` establishes the dim, blurred starting
 * point only once it actually runs, inside the reduced-motion check below.
 * Same rule as the hero and editorial banner: a failed or skipped animation
 * leaves the copy simply visible, never stuck dim.
 */
export function ScrollRevealCopy({
  heading,
  paragraphs,
  initialWordCount = 0,
  className,
  ...props
}: ScrollRevealCopyProps) {
  const stageRef = React.useRef<HTMLElement>(null);
  const headingId = React.useId();

  useGSAP(
    () => {
      const stage = stageRef.current;
      if (!stage) return;

      const words = gsap.utils.toArray<HTMLElement>(
        stage.querySelectorAll("[data-reveal-word]"),
      );
      const animated = words.slice(initialWordCount);
      if (!animated.length) return;

      const motion = homeMotion.intro;
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set(animated, {
          opacity: motion.mutedOpacity,
          y: `${motion.wordOffsetEm}em`,
          filter: `blur(${motion.wordBlurPx}px)`,
        });

        // A single word's own transition should span wordTransitionSpan of
        // the total scrubbed range, however many words there are — so the
        // per-word stagger step is derived from the word count rather than
        // fixed, keeping that proportion true for any paragraph length.
        const wordDuration = 1;
        const totalSpan = wordDuration / motion.wordTransitionSpan;
        const stagger =
          animated.length > 1
            ? (totalSpan - wordDuration) / (animated.length - 1)
            : 0;

        gsap.to(animated, {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          ease: "none",
          duration: wordDuration,
          stagger: { each: stagger, from: "start" },
          scrollTrigger: {
            trigger: stage,
            start: "top 80%",
            end: "top 20%",
            scrub: 0.6,
          },
        });
      });

      return () => mm.revert();
    },
    { scope: stageRef, dependencies: [paragraphs, initialWordCount] },
  );

  return (
    <section
      ref={stageRef}
      aria-labelledby={headingId}
      className={cn("scroll-reveal-stage", className)}
      {...props}
    >
      <div className="scroll-reveal-frame">
        <Container size="editorial">
          <Reveal as="div">
            {/* !font-bold: EditorialHeading's own font-medium is a plain
                utility class too, and cn() is a plain join, not a
                Tailwind-aware merge — so an unforced override here isn't
                guaranteed to win the cascade. !important makes it certain. */}
            <EditorialHeading
              id={headingId}
              className="mx-auto mb-8 max-w-3xl text-center !font-bold sm:mb-10"
            >
              {heading}
            </EditorialHeading>
          </Reveal>
          <div className="scroll-reveal-copy">
            {paragraphs.map((paragraph, paragraphIndex) => {
              const tokens = splitAccentWords(paragraph);

              return (
                <p key={paragraphIndex}>
                  {tokens.map((token, tokenIndex) => {
                    return (
                      <React.Fragment key={tokenIndex}>
                        <span
                          data-reveal-word
                          className={cn(
                            "scroll-reveal-word",
                            token.accented &&
                              "accent-highlight font-serif font-normal italic",
                          )}
                        >
                          {token.word}
                        </span>
                        {tokenIndex < tokens.length - 1 ? " " : null}
                      </React.Fragment>
                    );
                  })}
                </p>
              );
            })}
          </div>
        </Container>
      </div>
    </section>
  );
}
