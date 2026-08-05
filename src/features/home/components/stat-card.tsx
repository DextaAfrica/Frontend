"use client";

import { useRef } from "react";
import Image from "next/image";
import { MetricValue } from "@/components/ui";
import { gsap } from "@/lib/gsap";
import { isRemoteAsset } from "@/lib/media";
import type { StatisticContent } from "../types/home-page";

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

      <MetricValue className="relative text-brand-light [text-shadow:var(--stat-value-glow)]">
        {stat.value}
      </MetricValue>
      <p className="relative max-w-stat-copy text-2xl leading-[1.2] font-light text-brand-light/80">
        <StatCopy copy={stat.copy} highlight={stat.highlight} />
      </p>
    </div>
  );
}
