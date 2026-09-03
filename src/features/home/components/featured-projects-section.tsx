"use client";

import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import { Section } from "@/components/layout";
import { EditorialSectionHeading, Reveal } from "@/components/marketing";
import { ButtonLink, Icon } from "@/components/ui";
import { gsap, useGSAP } from "@/lib/gsap";
import { IMAGE_PLACEHOLDER, isRemoteAsset } from "@/lib/media";
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
 * trailing off into whatever comes next. Everything animates transform +
 * opacity only (no blur on the photo container), and every interaction has a
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

  // Entrance: the stage lifts + fades in, the index rows follow in a stagger
  // a beat behind. Every start value is set only once this runs, under a
  // matchMedia gate — the resting DOM is already fully visible, so a skipped
  // or interrupted animation can never strand the section hidden.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const stage = stageRef.current;
        const rows = gsap.utils.toArray<HTMLElement>(
          rootRef.current?.querySelectorAll("[data-index-row]") ?? [],
        );
        if (!rows.length || !stage) return;

        // Hand each crossfade layer to GSAP. `data-armed` on the stage flips
        // the CSS that held the first layer visible pre-JS off, so a React
        // re-render can never fight a running opacity tween.
        const layers = gsap.utils.toArray<HTMLElement>(
          stage.querySelectorAll("[data-stage-image]"),
        );
        gsap.set(layers, {
          autoAlpha: (index) => (index === activeIndexRef.current ? 1 : 0),
        });
        stage.dataset.armed = "true";

        // Entrance: opacity + a small lift only — no blur/heavy zoom on the
        // photo container (a filter animation on an image box is a paint
        // every frame and can render oddly mid-tween).
        gsap.set(stage, { opacity: 0, y: 24 });
        gsap.set(rows, { opacity: 0, y: 40 });

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top 80%",
            once: true,
          },
        });
        timeline
          .to(stage, {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            clearProps: "transform",
          })
          .to(
            rows,
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              stagger: 0.1,
              ease: "power3.out",
              clearProps: "transform",
            },
            "-=0.7",
          );

        return () => {
          delete stage.dataset.armed;
        };
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
            className="project-stage relative h-[clamp(20rem,26vw,26rem)] overflow-hidden rounded-panel bg-muted lg:sticky lg:top-28"
          >
            {projects.map((project, index) => (
              <div
                key={project.id}
                data-stage-image
                className="absolute inset-0"
              >
                <Image
                  src={project.image}
                  alt={project.name}
                  fill
                  priority={index === 0}
                  sizes="(min-width: 1024px) 55vw, 100vw"
                  placeholder="blur"
                  blurDataURL={IMAGE_PLACEHOLDER}
                  unoptimized={isRemoteAsset(project.image)}
                  className="project-stage-media object-cover object-center"
                />
                <span
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-black/15"
                />
                <span className="project-badge absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full border border-on-media-border bg-on-media-surface px-2.5 py-1 text-status tracking-project-status text-on-media uppercase backdrop-blur-md">
                  <Icon name="badge-check" size={12} />
                  {project.status}
                </span>
                <div className="absolute inset-x-0 bottom-0 p-project-card text-on-media">
                  <p className="max-w-md text-sm leading-snug text-on-media/85">
                    {project.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile / no fine pointer: a horizontal snap carousel — one project
            at a time with the next peeking, the touch equivalent of the
            desktop "one preview at a time" idea. The hover crossfade + follow
            pill are mouse-only and simply don't apply here. */}
        <ProjectsCarousel projects={projects} heading={heading} />
      </div>
    </Section>
  );
}

function ProjectsCarousel({
  projects,
  heading,
}: {
  projects: readonly ProjectContent[];
  heading: HomePageContent["projectsSection"];
}) {
  const scrollerRef = React.useRef<HTMLDivElement>(null);
  const [active, setActive] = React.useState(0);

  React.useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const card = el.querySelector<HTMLElement>("[data-carousel-card]");
        if (!card) return;
        const step =
          card.offsetWidth + parseFloat(getComputedStyle(el).gap || "0");
        setActive(
          Math.max(
            0,
            Math.min(projects.length - 1, Math.round(el.scrollLeft / step)),
          ),
        );
      });
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [projects.length]);

  const goTo = (index: number) => {
    scrollerRef.current
      ?.querySelectorAll<HTMLElement>("[data-carousel-card]")
      [index]?.scrollIntoView({
        behavior: "smooth",
        inline: "start",
        block: "nearest",
      });
  };

  return (
    <Reveal className="mt-10 lg:hidden">
      <div
        ref={scrollerRef}
        className="project-carousel flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain pb-1"
      >
        {projects.map((project, index) => (
          <Link
            key={project.id}
            href={project.href}
            data-carousel-card
            className="group flex w-[82vw] max-w-[22rem] shrink-0 snap-start flex-col focus-visible:outline-none"
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-panel bg-muted group-focus-visible:ring-2 group-focus-visible:ring-ring">
              <Image
                src={project.image}
                alt={project.name}
                fill
                loading="lazy"
                sizes="82vw"
                placeholder="blur"
                blurDataURL={IMAGE_PLACEHOLDER}
                unoptimized={isRemoteAsset(project.image)}
                className="object-cover"
              />
              <span
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/10"
              />
              <span className="project-badge absolute top-3 right-3 inline-flex items-center gap-1.5 rounded-full border border-on-media-border bg-on-media-surface px-2.5 py-1 text-status tracking-project-status text-on-media uppercase backdrop-blur-md">
                <Icon name="badge-check" size={11} />
                {project.status}
              </span>
              <span className="absolute top-3 left-3 font-mono text-xs tracking-project-index text-on-media/70">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>
            <h3 className="mt-4 font-display text-lg font-semibold tracking-tight">
              {project.name}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {project.location}
            </p>
            <p className="mt-2 line-clamp-3 text-sm text-pretty text-muted-foreground">
              {project.description}
            </p>
            <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
              {heading.cardCtaLabel}
              <Icon name="arrow-right" size={16} />
            </span>
          </Link>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between gap-4">
        <div
          className="flex items-center gap-1.5"
          role="tablist"
          aria-label="Projects"
        >
          {projects.map((project, index) => (
            <button
              key={project.id}
              type="button"
              role="tab"
              aria-selected={index === active}
              aria-label={`Show ${project.name}`}
              onClick={() => goTo(index)}
              className={cn(
                "h-1.5 rounded-full transition-[width,background-color] duration-300 ease-premium",
                index === active ? "w-5 bg-primary" : "w-1.5 bg-border",
              )}
            />
          ))}
        </div>
        <ButtonLink href={heading.ctaHref} variant="link">
          {heading.ctaLabel}
          <Icon name="arrow-right" size={16} />
        </ButtonLink>
      </div>
    </Reveal>
  );
}
