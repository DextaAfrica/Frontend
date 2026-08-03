"use client";

import * as React from "react";
import { Container } from "@/components/layout";
import { cn } from "@/lib/utils";

export interface ScrollRevealCopyProps extends Omit<
  React.ComponentProps<"section">,
  "children"
> {
  heading: string;
  paragraphs: readonly string[];
  initialWordCount?: number;
}

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
          return;
        }

        const animatedIndex = index - initialWordCount;
        const start = (animatedIndex / animatedWords) * 0.72;
        const linearProgress = Math.min(
          1,
          Math.max(0, (progress - start) / 0.28),
        );
        const easedProgress =
          linearProgress * linearProgress * (3 - 2 * linearProgress);

        word.style.opacity = String(0.2 + easedProgress * 0.8);
        word.style.transform = `translateY(${(1 - easedProgress) * 0.045}em)`;
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
      const revealStart = window.innerHeight * 0.82;
      const revealEnd = -bounds.height * 0.12;
      const distance = revealStart - revealEnd;
      targetProgress = Math.min(
        1,
        Math.max(0, (revealStart - bounds.top) / distance),
      );
    };

    const render = () => {
      const difference = targetProgress - currentProgress;
      currentProgress += difference * 0.2;

      paint(currentProgress);

      if (Math.abs(difference) > 0.0005) {
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
          <h2 id={headingId} className="sr-only">
            {heading}
          </h2>
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
