"use client";

import { useRef } from "react";
import Image from "next/image";
import { MetricValue } from "@/components/ui";
import { gsap, useGSAP } from "@/lib/gsap";
import { isRemoteAsset } from "@/lib/media";
import type { StatisticContent } from "../types/home-page";

const COUNT_UP_DURATION = 1.8;

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
  const mistRef = useRef<HTMLDivElement>(null);
  const valueRef = useRef<HTMLParagraphElement>(null);

  // Counts up from 0 the first time the number scrolls into view, rather
  // than just fading in — the same "arriving" moment other sections get
  // from Reveal, but for a stat the number itself is the payoff. The
  // resting/no-JS/reduced-motion state is always the real final value
  // (rendered below by React); this only ever overwrites it once motion is
  // both allowed and actually running.
  useGSAP(
    () => {
      const el = valueRef.current;
      const parsed = parseStatValue(stat.value);
      if (!el || !parsed) return;
      const { target, width, suffix } = parsed;

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const counter = { value: 0 };
        el.textContent = "0".padStart(width, "0") + suffix;
        gsap.to(counter, {
          value: target,
          duration: COUNT_UP_DURATION,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
          onUpdate: () => {
            el.textContent =
              String(Math.round(counter.value)).padStart(width, "0") + suffix;
          },
        });
      });
      return () => mm.revert();
    },
    { scope: valueRef, dependencies: [stat.value] },
  );

  const animateMist = (entering: boolean) => {
    const mist = mistRef.current;
    if (!mist) return;

    const allowMotion = window.matchMedia(
      "(prefers-reduced-motion: no-preference)",
    ).matches;

    if (!allowMotion) {
      gsap.set(mist.children, { opacity: entering ? 0.5 : 0 });
      return;
    }

    gsap.to(mist.children, {
      opacity: entering ? 1 : 0,
      scale: entering ? 1.15 : 1,
      duration: entering ? 1.4 : 0.9,
      stagger: entering ? 0.08 : 0,
      ease: entering ? "power2.out" : "power2.in",
      overwrite: "auto",
    });
  };

  return (
    <div
      onMouseEnter={() => animateMist(true)}
      onMouseLeave={() => animateMist(false)}
      className="relative flex h-full min-h-56 flex-col justify-between gap-10 overflow-hidden px-6 py-7 sm:px-8 md:min-h-stat-card"
    >
      <Image
        src={stat.image}
        alt=""
        fill
        priority={priority}
        sizes="(min-width: 768px) 34vw, 100vw"
        unoptimized={isRemoteAsset(stat.image)}
        className="object-cover"
      />
      <span
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/5"
      />
      <div
        ref={mistRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 mix-blend-screen"
      >
        <span className="stat-mist-primary absolute size-40 rounded-full opacity-0 blur-3xl" />
        <span className="stat-mist-secondary absolute size-48 rounded-full opacity-0 blur-3xl" />
        <span className="stat-mist-tertiary absolute size-56 rounded-full opacity-0 blur-3xl" />
      </div>

      <MetricValue
        ref={valueRef}
        className="relative text-brand-light [text-shadow:var(--stat-value-glow)]"
      >
        {stat.value}
      </MetricValue>
      <p className="relative max-w-stat-copy text-base leading-[1.4] font-normal text-brand-light/80">
        <StatCopy copy={stat.copy} highlight={stat.highlight} />
      </p>
    </div>
  );
}
