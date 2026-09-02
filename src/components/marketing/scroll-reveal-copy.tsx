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
 * Word-by-word scroll reveal: each word rises into place and brightens from a
 * dim resting opacity as the copy scrolls through its reading zone — two
 * compositor-cheap properties (opacity + translate), staggered into a clean
 * cascade rather than a flat block fade. A `*word*` (or `*multi word phrase*`)
 * inside a paragraph gets the site's red accent treatment — see <Accent>.
 *
 * Driven by GSAP ScrollTrigger's scrub + stagger. On desktop the stage is a
 * full viewport tall so the reveal has real scroll room and finishes while
 * the paragraph sits centred; on compact viewports the range is tighter,
 * keyed to the shorter section (see homeMotion.intro).
 *
 * The resting / no-JS / reduced-motion state is fully visible (see
 * .scroll-reveal-word in globals.css) — `gsap.set` establishes the dim
 * starting point only once the animation actually runs. A failed or skipped
 * animation leaves the copy simply visible, never stuck dim.
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

      mm.add(
        {
          motion: motion.enabledMedia,
          desktop: motion.desktopMedia,
        },
        (context) => {
          const conditions = context.conditions as
            { motion?: boolean; desktop?: boolean } | undefined;
          if (!conditions?.motion) return;
          const profile = conditions.desktop ? motion.desktop : motion.compact;

          // Only opacity + transform per word — no `filter: blur`. Several
          // words are always mid-transition under a scrub, and animating
          // `filter` on each one is a paint every frame; opacity/translate
          // stay on the compositor and read just as clearly as a reveal.
          gsap.set(animated, {
            opacity: motion.mutedOpacity,
            y: `${motion.wordOffsetEm}em`,
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
            ease: "none",
            duration: wordDuration,
            stagger: { each: stagger, from: "start" },
            scrollTrigger: {
              trigger: stage,
              start: profile.start,
              end: profile.end,
              scrub: profile.scrub,
            },
          });
        },
      );

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
            <EditorialHeading
              id={headingId}
              className="mx-auto mb-8 max-w-3xl text-center sm:mb-10"
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
