"use client";

import { useRef } from "react";
import Image from "next/image";
import { MetricValue } from "@/components/ui";
import { gsap, useGSAP } from "@/lib/gsap";
import { IMAGE_PLACEHOLDER, isRemoteAsset } from "@/lib/media";
import type { StatisticContent } from "../types/home-page";

const COUNT_UP_DURATION = 2.6;

/**
 * "150+" / "03+" → { digits: "150", target: 150, width: 3, suffix: "+" }.
 * `width` preserves whatever zero-padding the source value had (e.g. "03")
 * so the counting animation pads the same way on every frame, not just the
 * final one.
 */
function parseStatValue(value: string) {
  const match = /^(\d+)(.*)$/.exec(value);
  const digits = match?.[1];
  if (!digits) return null;
  return {
    target: parseInt(digits, 10),
    width: digits.length,
    suffix: match[2] ?? "",
  };
}

function StatCopy({ copy, highlight }: { copy: string; highlight: string }) {
  const index = copy.indexOf(highlight);
  if (index === -1) return <>{copy}</>;

  return (
    <>
      {copy.slice(0, index)}
      <strong className="font-bold text-brand-light">{highlight}</strong>
      {copy.slice(index + highlight.length)}
    </>
  );
}

export function StatCard({
  stat,
  priority,
}: {
  stat: StatisticContent;
  priority: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const valueRef = useRef<HTMLParagraphElement>(null);
  const runCountRef = useRef<() => void>(() => {});

  useGSAP(
    () => {
      const card = cardRef.current;
      const el = valueRef.current;
      const parsed = parseStatValue(stat.value);
      if (!card || !el || !parsed) return;
      const { target, width, suffix } = parsed;

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // --- Counter: a heavy, deliberate climb (never a quick tick-up),
        // landing with a small "solid" settle-pop rather than just stopping
        // dead — reads as the number actually arriving, not merely updating.
        const counter = { value: 0 };
        const runCount = () => {
          gsap.killTweensOf(counter);
          gsap.killTweensOf(el);
          counter.value = 0;
          el.textContent = "0".padStart(width, "0") + suffix;
          gsap.to(counter, {
            value: target,
            duration: COUNT_UP_DURATION,
            ease: "power3.out",
            onUpdate: () => {
              el.textContent =
                String(Math.round(counter.value)).padStart(width, "0") + suffix;
            },
            onComplete: () => {
              gsap.fromTo(
                el,
                { scale: 1 },
                {
                  scale: 1.1,
                  duration: 0.18,
                  ease: "power1.out",
                  yoyo: true,
                  repeat: 1,
                },
              );
            },
          });
        };
        runCountRef.current = runCount;

        // --- Card entrance: a spring/bounce pop as it crosses into view —
        // scale only (Reveal, on the <article> ancestor, already owns the
        // fade/rise), fires the counter the moment it lands.
        gsap.set(card, { scale: 0.82, transformOrigin: "50% 65%" });
        gsap.to(card, {
          scale: 1,
          duration: 1.1,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: card,
            start: "top 88%",
            once: true,
            onEnter: runCount,
          },
        });
      });

      return () => mm.revert();
    },
    { scope: cardRef, dependencies: [stat.value] },
  );

  // Replays the climb from zero on every hover, not just the first
  // scroll-into-view. The drifting fog and its hover intensity are pure CSS
  // (see `.stat-card__fog` in globals.css).
  const replayCounter = () => runCountRef.current();

  return (
    <div
      ref={cardRef}
      onMouseEnter={replayCounter}
      className="stat-card relative flex h-full min-h-56 flex-col justify-between gap-10 overflow-hidden px-6 py-7 sm:px-8 md:min-h-stat-card"
    >
      <Image
        src={stat.image}
        alt=""
        fill
        priority={priority}
        sizes="(min-width: 768px) 34vw, 100vw"
        placeholder="blur"
        blurDataURL={IMAGE_PLACEHOLDER}
        unoptimized={isRemoteAsset(stat.image)}
        className="stat-card__image object-cover"
      />
      <span aria-hidden className="stat-card__scrim absolute inset-0" />
      <div
        aria-hidden
        className="stat-card__fog pointer-events-none absolute inset-0"
      >
        <span className="stat-fog stat-fog--a" />
        <span className="stat-fog stat-fog--b" />
      </div>

      <MetricValue
        ref={valueRef}
        className="relative text-brand-light [text-shadow:var(--stat-value-glow)]"
      >
        {stat.value}
      </MetricValue>
      <p className="relative max-w-stat-copy text-base leading-[1.4] font-normal text-brand-light/85">
        <StatCopy copy={stat.copy} highlight={stat.highlight} />
      </p>
    </div>
  );
}
