"use client";

import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import { Section } from "@/components/layout";
import {
  EditorialSectionHeading,
  Reveal,
  RevealGroup,
} from "@/components/marketing";
import { ButtonLink, Icon } from "@/components/ui";
import { gsap, useGSAP } from "@/lib/gsap";
import { IMAGE_PLACEHOLDER, isRemoteAsset } from "@/lib/media";
import type { HomePageContent, ProjectContent } from "../types/home-page";

const CROSSFADE_DURATION = 0.6;

function reducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * The homepage portfolio, built as an editorial index rather than a static
 * mosaic: a numbered list of developments on one side, a sticky preview
 * stage on the other. Hovering (or focusing) a row crossfades the stage —
 * now a four-tile mosaic of that project's photography — and slides a red
 * indicator bar to match, while a small "View project" pill trails the
 * pointer, agency-portfolio style.
 *
 * The section's entrance is the site-wide {@link Reveal} / {@link RevealGroup}
 * scroll-reveal, same as every other section: heading, index rows and stage
 * blur-rise in on entry and ease back to a dim resting state on leaving,
 * from either scroll direction. The per-project mosaic swap is a separate
 * GSAP crossfade layered on top, and every interaction has a static, fully
 * visible resting state so a skipped animation never strands the section.
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
        stageRef.current?.querySelectorAll("[data-stage-collage]") ?? [],
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

        // The incoming set assembles tile by tile rather than hard-cutting.
        const tiles =
          incoming.querySelectorAll<HTMLElement>("[data-mosaic-tile]");
        gsap.fromTo(
          tiles,
          { autoAlpha: 0, y: 14 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.06,
            ease: "power2.out",
            clearProps: "opacity,visibility,transform",
          },
        );
      }

      activeIndexRef.current = index;
      setActiveIndex(index);
      moveIndicator(index, true);
    },
    [moveIndicator],
  );

  // Position the indicator once rows exist, keep it aligned through any
  // layout shift (a font swap, a resize), and hand the mosaic layers to GSAP
  // so the crossfade owns their opacity. The resting DOM (and reduced motion)
  // is covered by the `.project-stage:not([data-armed])` CSS below.
  useGSAP(
    () => {
      moveIndicator(activeIndexRef.current, false);

      const stage = stageRef.current;
      if (stage && !reducedMotion()) {
        const collages = gsap.utils.toArray<HTMLElement>(
          stage.querySelectorAll("[data-stage-collage]"),
        );
        if (collages.length) {
          gsap.set(collages, {
            autoAlpha: (i) => (i === activeIndexRef.current ? 1 : 0),
          });
          stage.dataset.armed = "true";
        }
      }

      const list = listRef.current;
      if (!list || typeof ResizeObserver === "undefined") {
        return () => {
          if (stage) delete stage.dataset.armed;
        };
      }
      const observer = new ResizeObserver(() =>
        moveIndicator(activeIndexRef.current, false),
      );
      observer.observe(list);
      return () => {
        observer.disconnect();
        if (stage) delete stage.dataset.armed;
      };
    },
    { scope: rootRef, dependencies: [projects, moveIndicator] },
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

  if (!projects.length) return null;

  return (
    <Section
      spacing="editorial"
      tone="surface"
      aria-labelledby="projects-heading"
    >
      <div ref={rootRef}>
        <Reveal>
          <EditorialSectionHeading
            eyebrow={heading.eyebrow}
            title={heading.title}
            headingId="projects-heading"
          />
        </Reveal>

        {/* Desktop: index list + sticky crossfading mosaic. */}
        <div className="mt-10 hidden gap-12 lg:grid lg:grid-cols-[1fr_1.1fr] lg:items-start">
          <RevealGroup as="div">
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
                  data-reveal-item
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

              <div
                data-reveal-item
                className="mt-8 flex items-center justify-between gap-6 border-t border-border pt-6"
              >
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
          </RevealGroup>

          <Reveal className="lg:sticky lg:top-28">
            <div
              ref={stageRef}
              className="project-stage relative overflow-hidden rounded-panel bg-muted"
            >
              {projects.map((project) => (
                <div
                  key={project.id}
                  data-stage-collage
                  className="absolute inset-0"
                >
                  <div className="project-mosaic">
                    {project.images.slice(0, 4).map((src, tileIndex) => (
                      <figure
                        key={`${project.id}-${src}`}
                        data-mosaic-tile
                        className="project-mosaic__tile"
                      >
                        <Image
                          src={src}
                          alt={tileIndex === 0 ? project.name : ""}
                          fill
                          sizes="(min-width: 1024px) 28vw, 0px"
                          placeholder="blur"
                          blurDataURL={IMAGE_PLACEHOLDER}
                          unoptimized={isRemoteAsset(src)}
                          className="object-cover"
                        />
                        {tileIndex === 0 && (
                          <>
                            <span
                              aria-hidden
                              className="project-mosaic__scrim"
                            />
                            <span className="project-badge absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full border border-on-media-border bg-on-media-surface px-2.5 py-1 text-status tracking-project-status text-on-media uppercase backdrop-blur-md">
                              <Icon name="badge-check" size={12} />
                              {project.status}
                            </span>
                            <p className="project-mosaic__caption">
                              {project.description}
                            </p>
                          </>
                        )}
                      </figure>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
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
        className="project-carousel flex snap-x snap-mandatory gap-5 overflow-x-auto overscroll-x-contain pb-1"
      >
        {projects.map((project, index) => {
          const [lead, ...rest] = project.images;
          return (
            <Link
              key={project.id}
              href={project.href}
              data-carousel-card
              data-active={index === active || undefined}
              className="project-m-card group"
            >
              <figure className="project-m-card__frame">
                <Image
                  src={lead ?? project.image}
                  alt={project.name}
                  fill
                  loading="lazy"
                  sizes="86vw"
                  placeholder="blur"
                  blurDataURL={IMAGE_PLACEHOLDER}
                  unoptimized={isRemoteAsset(lead ?? project.image)}
                  className="project-m-card__img"
                />
                <span aria-hidden className="project-m-card__scrim" />
                <span className="project-badge project-m-card__badge">
                  <Icon name="badge-check" size={11} />
                  {project.status}
                </span>
                <figcaption className="project-m-card__body">
                  <h3 className="project-m-card__name">{project.name}</h3>
                  <p className="project-m-card__location">{project.location}</p>
                  <p className="project-m-card__desc">{project.description}</p>
                  <span className="project-m-card__cta">
                    {heading.cardCtaLabel}
                    <Icon name="arrow-right" size={15} />
                  </span>
                </figcaption>
              </figure>

              {rest.length > 0 && (
                <span aria-hidden className="project-m-card__strip">
                  {rest.slice(0, 3).map((src) => (
                    <span key={src} className="project-m-card__thumb">
                      <Image
                        src={src}
                        alt=""
                        fill
                        loading="lazy"
                        sizes="30vw"
                        placeholder="blur"
                        blurDataURL={IMAGE_PLACEHOLDER}
                        unoptimized={isRemoteAsset(src)}
                        className="object-cover"
                      />
                    </span>
                  ))}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      <div className="project-m-controls">
        <div
          className="project-m-controls__dots"
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
              data-active={index === active || undefined}
              className="project-m-controls__dot"
            />
          ))}
        </div>
        <ButtonLink
          href={heading.ctaHref}
          variant="secondary"
          size="lg"
          fullWidth
        >
          {heading.ctaLabel}
          <Icon name="arrow-right" size={16} />
        </ButtonLink>
      </div>
    </Reveal>
  );
}
