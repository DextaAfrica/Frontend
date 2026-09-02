"use client";

import { useRef } from "react";
import Image from "next/image";
import { MetricValue } from "@/components/ui";
import { gsap, useGSAP } from "@/lib/gsap";
import { isRemoteAsset } from "@/lib/media";
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
  const mistRef = useRef<HTMLDivElement>(null);
  const valueRef = useRef<HTMLParagraphElement>(null);
  const runCountRef = useRef<() => void>(() => {});
  const mistHoverRef = useRef<(entering: boolean) => void>(() => {});

  useGSAP(
    () => {
      const card = cardRef.current;
      const el = valueRef.current;
      const mist = mistRef.current;
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

        // --- Smoke: slow, continuous, independent drift per layer — a
        // living cloud at rest, not a static blob that only reacts to
        // hover. Long, staggered, yoyo'd tweens so no two layers ever move
        // in lockstep.
        if (mist) {
          const layers = gsap.utils.toArray<HTMLElement>(mist.children);
          layers.forEach((layer, index) => {
            gsap.to(layer, {
              x: index % 2 === 0 ? 22 : -18,
              y: index % 2 === 0 ? -16 : 20,
              scale: 1.12,
              duration: 7 + index * 1.6,
              ease: "sine.inOut",
              yoyo: true,
              repeat: -1,
              delay: index * 0.4,
            });
          });
        }
      });

      // --- Smoke hover intensity: ambient at rest (CSS opacity-15), thick
      // and clouded the moment the pointer's on the card.
      mistHoverRef.current = (entering) => {
        if (!mist) return;
        const allowMotion = window.matchMedia(
          "(prefers-reduced-motion: no-preference)",
        ).matches;

        if (!allowMotion) {
          gsap.set(mist.children, { opacity: entering ? 0.75 : 0.15 });
          return;
        }

        gsap.to(mist.children, {
          opacity: entering ? 0.85 : 0.15,
          scale: entering ? 1.2 : 1,
          duration: entering ? 1.6 : 1.1,
          stagger: entering ? 0.1 : 0,
          ease: entering ? "power2.out" : "power2.inOut",
          overwrite: "auto",
        });
      };

      return () => mm.revert();
    },
    { scope: cardRef, dependencies: [stat.value] },
  );

  const handleHover = (entering: boolean) => {
    mistHoverRef.current(entering);
    // "Anytime the mouse enters, the counter starts" — replays the climb
    // from zero on every hover, not just the first scroll-into-view.
    if (entering) runCountRef.current();
  };

  return (
    <div
      ref={cardRef}
      onMouseEnter={() => handleHover(true)}
      onMouseLeave={() => handleHover(false)}
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
        <span className="stat-mist-primary absolute size-64 rounded-full opacity-15 blur-[70px]" />
        <span className="stat-mist-secondary absolute size-72 rounded-full opacity-15 blur-[80px]" />
        <span className="stat-mist-tertiary absolute size-80 rounded-full opacity-15 blur-[90px]" />
        <span className="stat-mist-quaternary absolute size-56 rounded-full opacity-15 blur-[60px]" />
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
