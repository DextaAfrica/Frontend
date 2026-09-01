"use client";

import * as React from "react";
import { Container } from "@/components/layout";
import { EditorialHeading } from "@/components/ui";
import { homeMotion } from "@/config/home-motion";
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
 * a deliberate reveal instead of a fade wearing one as a label. Progress is
 * tied to scroll position and smoothed via lerp so it never feels stepped.
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

  React.useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const motion = homeMotion.intro;
    let frame = 0;
    let currentProgress = 0;
    let targetProgress = 0;
    const wordElements = Array.from(
      stage.querySelectorAll<HTMLElement>("[data-reveal-word]"),
    );

    const paint = (progress: number) => {
      const animatedWords = Math.max(1, wordElements.length - initialWordCount);

      wordElements.forEach((word, index) => {
        if (index < initialWordCount || reducedMotion.matches) {
          word.style.opacity = "1";
          word.style.transform = "none";
          word.style.filter = "none";
          return;
        }

        const animatedIndex = index - initialWordCount;
        const start = (animatedIndex / animatedWords) * motion.revealSpan;
        const linearProgress = Math.min(
          1,
          Math.max(0, (progress - start) / motion.wordTransitionSpan),
        );
        const easedProgress =
          linearProgress * linearProgress * (3 - 2 * linearProgress);

        word.style.opacity = String(
          motion.mutedOpacity + easedProgress * (1 - motion.mutedOpacity),
        );
        word.style.transform = `translateY(${(1 - easedProgress) * motion.wordOffsetEm}em)`;
        word.style.filter = `blur(${(1 - easedProgress) * motion.wordBlurPx}px)`;
      });
    };

    const measure = () => {
      if (reducedMotion.matches) {
        currentProgress = 1;
        targetProgress = 1;
        paint(1);
        return;
      }

      const bounds = stage.getBoundingClientRect();
      const revealStart = window.innerHeight * motion.viewportStart;
      const revealEnd = -bounds.height * motion.sectionEnd;
      const distance = revealStart - revealEnd;
      targetProgress = Math.min(
        1,
        Math.max(0, (revealStart - bounds.top) / distance),
      );
    };

    const render = () => {
      const difference = targetProgress - currentProgress;
      currentProgress += difference * motion.smoothing;

      paint(currentProgress);

      if (Math.abs(difference) > motion.settleThreshold) {
        frame = window.requestAnimationFrame(render);
      } else {
        currentProgress = targetProgress;
        paint(currentProgress);
        frame = 0;
      }
    };

    const update = () => {
      measure();
      if (!frame && !reducedMotion.matches) {
        frame = window.requestAnimationFrame(render);
      }
    };

    measure();
    currentProgress = targetProgress;
    paint(currentProgress);
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    reducedMotion.addEventListener("change", update);

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      reducedMotion.removeEventListener("change", update);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [initialWordCount]);

  let wordIndex = 0;

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
            {paragraphs.map((paragraph) => (
              <p key={paragraph}>
                {paragraph.split(" ").map((word) => {
                  const currentIndex = wordIndex++;

                  return (
                    <span
                      key={`${word}-${currentIndex}`}
                      data-initial-word={
                        currentIndex < initialWordCount ? "true" : undefined
                      }
                      data-reveal-word
                      className="scroll-reveal-word"
                    >
                      {word}
                    </span>
                  );
                })}
              </p>
            ))}
          </div>
        </Container>
      </div>
    </section>
  );
}
