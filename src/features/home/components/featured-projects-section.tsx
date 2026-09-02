"use client";

import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import { Section } from "@/components/layout";
import {
  EditorialSectionHeading,
  RevealGroup,
  RevealItem,
} from "@/components/marketing";
import { ButtonLink, Icon } from "@/components/ui";
import { gsap, useGSAP } from "@/lib/gsap";
import { isRemoteAsset } from "@/lib/media";
import { cn } from "@/lib/utils";
import type { HomePageContent, ProjectContent } from "../types/home-page";

const CROSSFADE_DURATION = 0.6;

function reducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * The homepage portfolio, rebuilt as an editorial index rather than a static
 * mosaic: a numbered list of developments on one side, a single sticky
 * preview stage on the other. Hovering (or focusing) a row crossfades the
 * stage photo and slides a red indicator bar to match — the same
 * stacked-layer crossfade `ProjectGallery` uses on the detail pages — while a
 * small "View project" pill trails the pointer, agency-portfolio style.
 *
 * The numbered rows and the closing rule + "view all" link at the bottom of
 * the list give the section an obvious start and end, rather than just
 * trailing off into whatever comes next. Every animated property here is
 * transform/opacity/filter — compositor-only — and every interaction has a
 * static, fully visible resting state so a failed or skipped animation never
 * leaves the section stuck hidden.
 */
export function FeaturedProjectsSection({
  projects,
  heading,
}: {
  projects: readonly ProjectContent[];
  heading: HomePageContent["projectsSection"];
}) {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const listRef = React.useRef<HTMLDivElement>(null);
  const stageRef = React.useRef<HTMLDivElement>(null);
  const indicatorRef = React.useRef<HTMLSpanElement>(null);
  const pillRef = React.useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const activeIndexRef = React.useRef(0);
  const isCrossfadingRef = React.useRef(false);

  const moveIndicator = React.useCallback((index: number, animate: boolean) => {
    const row =
      listRef.current?.querySelectorAll<HTMLElement>("[data-index-row]")[index];
    const indicator = indicatorRef.current;
    if (!row || !indicator) return;
    const target = { y: row.offsetTop, height: row.offsetHeight };
    if (animate && !reducedMotion()) {
      gsap.to(indicator, { ...target, duration: 0.5, ease: "power3.out" });
    } else {
      gsap.set(indicator, target);
    }
  }, []);

  const setActive = React.useCallback(
    (index: number) => {
      if (index === activeIndexRef.current || isCrossfadingRef.current) return;
      const layers = gsap.utils.toArray<HTMLElement>(
        stageRef.current?.querySelectorAll("[data-stage-image]") ?? [],
      );
      const outgoing = layers[activeIndexRef.current];
      const incoming = layers[index];

      if (outgoing && incoming && !reducedMotion()) {
        isCrossfadingRef.current = true;
        gsap.killTweensOf([outgoing, incoming]);
        gsap.set(incoming, { zIndex: 2 });
        gsap.set(outgoing, { zIndex: 1 });
        gsap.fromTo(
          incoming,
          { autoAlpha: 0, scale: 1.04 },
          {
            autoAlpha: 1,
            scale: 1,
            duration: CROSSFADE_DURATION,
            ease: "power2.out",
            onComplete: () => {
              isCrossfadingRef.current = false;
            },
          },
        );
        gsap.to(outgoing, {
          autoAlpha: 0,
          duration: CROSSFADE_DURATION,
          ease: "power2.out",
        });
      }

      activeIndexRef.current = index;
      setActiveIndex(index);
      moveIndicator(index, true);
    },
    [moveIndicator],
  );

  // Position the indicator once rows exist, and keep it aligned through any
  // layout shift (a font swap, a resize) without re-triggering the slide.
  useGSAP(
    () => {
      moveIndicator(activeIndexRef.current, false);
      const list = listRef.current;
      if (!list || typeof ResizeObserver === "undefined") return;
      const observer = new ResizeObserver(() =>
        moveIndicator(activeIndexRef.current, false),
      );
      observer.observe(list);
      return () => observer.disconnect();
    },
    { scope: listRef, dependencies: [projects, moveIndicator] },
  );

  // A small pill that trails the pointer while it's over the index list —
  // the exact rAF + lerp technique the site's own custom cursor uses, scoped
  // to this panel instead of the whole viewport, and skipped entirely on
  // touch/coarse pointers where there's no hover to react to.
  React.useEffect(() => {
    const panel = listRef.current;
    const pill = pillRef.current;
    if (!panel || !pill) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      return;
    }

    const smoothing = reducedMotion() ? 1 : 0.2;
    let targetX = 0;
    let targetY = 0;
    let x = 0;
    let y = 0;
    let frame = 0;

    const render = () => {
      x += (targetX - x) * smoothing;
      y += (targetY - y) * smoothing;
      pill.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -75%)`;
      frame = window.requestAnimationFrame(render);
    };

    const onMove = (event: PointerEvent) => {
      const rect = panel.getBoundingClientRect();
      targetX = event.clientX - rect.left;
      targetY = event.clientY - rect.top;
    };
    const onEnter = () => {
      pill.dataset.visible = "true";
    };
    const onLeave = () => {
      pill.dataset.visible = "false";
    };

    panel.addEventListener("pointermove", onMove, { passive: true });
    panel.addEventListener("pointerenter", onEnter, { passive: true });
    panel.addEventListener("pointerleave", onLeave, { passive: true });
    frame = window.requestAnimationFrame(render);

    return () => {
      panel.removeEventListener("pointermove", onMove);
      panel.removeEventListener("pointerenter", onEnter);
      panel.removeEventListener("pointerleave", onLeave);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  // Heavy entrance: the stage settles out of a soft blur/zoom, the index
  // rows rise and sharpen in a stagger a beat behind it. Every start value
  // is set only once this actually runs, under a matchMedia gate — the
  // resting DOM (see the mobile stack below, and the plain CSS classes here)
  // is already fully visible, so a skipped or interrupted animation can
  // never strand the section hidden.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const rows = gsap.utils.toArray<HTMLElement>(
          rootRef.current?.querySelectorAll("[data-index-row]") ?? [],
        );
        if (!rows.length || !stageRef.current) return;

        gsap.set(stageRef.current, {
          opacity: 0,
          scale: 1.08,
          filter: "blur(18px)",
        });
        gsap.set(rows, { opacity: 0, y: 56, filter: "blur(10px)" });

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top 78%",
            once: true,
          },
        });
        timeline
          .to(stageRef.current, {
            opacity: 1,
            scale: 1,
            filter: "blur(0px)",
            duration: 1.2,
            ease: "power3.out",
          })
          .to(
            rows,
            {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              duration: 0.9,
              stagger: 0.12,
              ease: "power3.out",
              clearProps: "filter,transform",
            },
            "-=0.9",
          );
      });
      return () => mm.revert();
    },
    { scope: rootRef, dependencies: [projects] },
  );

  if (!projects.length) return null;

  return (
    <Section
      spacing="editorial"
      tone="surface"
      aria-labelledby="projects-heading"
    >
      <div ref={rootRef}>
        <EditorialSectionHeading
          eyebrow={heading.eyebrow}
          title={heading.title}
          headingId="projects-heading"
        />

        {/* Desktop: index list + sticky crossfading stage. */}
        <div className="mt-10 hidden gap-12 lg:grid lg:grid-cols-[1fr_1.1fr] lg:items-start">
          <div ref={listRef} className="relative">
            <span
              ref={indicatorRef}
              aria-hidden
              className="project-index-indicator"
            />
            {projects.map((project, index) => (
              <Link
                key={project.id}
                href={project.href}
                data-index-row
                data-active={index === activeIndex || undefined}
                className="project-index-row group"
                aria-label={`${heading.cardCtaLabel}: ${project.name}`}
                onMouseEnter={() => setActive(index)}
                onFocus={() => setActive(index)}
              >
                <span className="project-index-number">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="project-index-copy">
                  <span className="project-index-name">{project.name}</span>
                  <span className="project-index-location">
                    {project.location}
                  </span>
                </span>
                <Icon name="arrow-right" className="project-index-arrow" />
              </Link>
            ))}

            <div
              ref={pillRef}
              aria-hidden
              data-visible="false"
              className="project-follow-pill"
            >
              {heading.cardCtaLabel}
            </div>

            <div className="mt-8 flex items-center justify-between gap-6 border-t border-border pt-6">
              <span className="font-mono text-xs tracking-project-index text-muted-foreground uppercase">
                {String(projects.length).padStart(2, "0")} developments and
                counting
              </span>
              <ButtonLink href={heading.ctaHref} variant="link">
                {heading.ctaLabel}
                <Icon name="arrow-right" />
              </ButtonLink>
            </div>
          </div>

          <div
            ref={stageRef}
            className="project-stage relative aspect-[3/2] max-h-[30rem] overflow-hidden rounded-panel bg-muted lg:sticky lg:top-28"
          >
            {projects.map((project, index) => (
              <div
                key={project.id}
                data-stage-image
                className="absolute inset-0"
                style={{ opacity: index === 0 ? 1 : 0 }}
              >
                <Image
                  src={project.image}
                  alt={project.name}
                  fill
                  priority={index === 0}
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  unoptimized={isRemoteAsset(project.image)}
                  className="project-stage-media object-cover"
                />
                <span
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent"
                />
                <span className="project-badge absolute top-5 right-5 inline-flex items-center gap-1.5 rounded-full border border-on-media-border bg-on-media-surface px-3 py-1.5 text-status tracking-project-status text-on-media uppercase backdrop-blur-md">
                  <Icon name="badge-check" size={12} />
                  {project.status}
                </span>
                <div className="absolute inset-x-0 bottom-0 p-project-card text-on-media">
                  <p className="max-w-md text-sm text-on-media/85">
                    {project.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile / no fine pointer: a plain stacked list, each with its own
            strong scroll-reveal entrance — no hover to drive here, so the
            crossfade stage and follow pill simply don't apply. */}
        <RevealGroup className="mt-10 flex flex-col gap-10 lg:hidden">
          {projects.map((project, index) => (
            <RevealItem as="article" key={project.id}>
              <Link href={project.href} className="group block">
                <div className="relative aspect-[3/2] overflow-hidden rounded-panel bg-muted">
                  <Image
                    src={project.image}
                    alt={project.name}
                    fill
                    sizes="100vw"
                    unoptimized={isRemoteAsset(project.image)}
                    className={cn(
                      "object-cover transition-transform duration-700 ease-premium",
                      "group-hover:scale-105",
                    )}
                  />
                  <span
                    aria-hidden
                    className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10"
                  />
                  <span className="project-badge absolute top-4 right-4 inline-flex items-center gap-1.5 rounded-full border border-on-media-border bg-on-media-surface px-3 py-1.5 text-status tracking-project-status text-on-media uppercase backdrop-blur-md">
                    <Icon name="badge-check" size={12} />
                    {project.status}
                  </span>
                  <span className="absolute top-4 left-4 font-mono text-xs tracking-project-index text-on-media/70">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-5 font-display text-xl font-semibold tracking-tight">
                  {project.name}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {project.location}
                </p>
                <p className="mt-3 text-sm text-muted-foreground">
                  {project.description}
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                  {heading.cardCtaLabel}
                  <Icon name="arrow-right" size={16} />
                </span>
              </Link>
            </RevealItem>
          ))}

          <div className="flex justify-center border-t border-border pt-8">
            <ButtonLink href={heading.ctaHref} variant="neutral" size="lg">
              {heading.ctaLabel}
              <Icon name="arrow-right" />
            </ButtonLink>
          </div>
        </RevealGroup>
      </div>
    </Section>
  );
}
