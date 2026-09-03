"use client";

import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Button, ButtonLink } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Eyebrow } from "@/components/ui/typography";
import { routeHasOverlayHero } from "@/config/page-chrome";
import { siteConfig } from "@/config/site";
import { gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import { Container } from "./container";
import { Stack } from "./stack";

export function SiteHeader() {
  const [open, setOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const pathname = usePathname();

  // Does this route open with a full-bleed media hero the header sits over?
  // Single source of truth is `config/page-chrome.ts` — never a pathname
  // test in this component.
  const overlayHeroRoute = routeHasOverlayHero(pathname);

  // `overlaysHero`: the bar is currently transparent and riding over that
  //   hero in a light palette — only true on an overlay route, at the top,
  //   with the mobile menu closed.
  // `solid`: every other state — any scroll away from the top, the menu
  //   open, or any non-overlay route — shows the opaque bar. Non-overlay
  //   routes also get this pre-hydration via the CSS `[data-scrolled]`
  //   fallback, so their header never flashes transparent.
  const overlaysHero = overlayHeroRoute && !open && !scrolled;
  const solid = !overlaysHero;

  const headerRef = React.useRef<HTMLElement>(null);
  const menuButtonRef = React.useRef<HTMLButtonElement>(null);
  const panelRef = React.useRef<HTMLDivElement>(null);
  const barRef = React.useRef<HTMLDivElement>(null);

  // Header entrance: the bar drops in, then logo → nav links → the right
  // cluster follow in a stagger. Runs once on mount. Purely cosmetic — the
  // resting DOM is already full-opacity, so an interrupted tween can never
  // strand the header hidden; `clearProps` drops the inline styles after.
  useGSAP(
    () => {
      const bar = barRef.current;
      if (
        !bar ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        return;
      }
      const navLinks = gsap.utils.toArray<HTMLElement>(
        bar.querySelectorAll("[data-nav-link]"),
      );
      const sides = bar.querySelectorAll<HTMLElement>("[data-header-side]");

      const timeline = gsap.timeline({
        defaults: { ease: "power3.out" },
        delay: 0.1,
      });
      timeline
        .from(bar, {
          y: -14,
          autoAlpha: 0,
          duration: 0.5,
          clearProps: "opacity,visibility,transform",
        })
        .from(
          sides,
          {
            y: -8,
            autoAlpha: 0,
            duration: 0.5,
            stagger: 0.08,
            clearProps: "opacity,visibility,transform",
          },
          "-=0.3",
        )
        .from(
          navLinks,
          {
            y: -8,
            autoAlpha: 0,
            duration: 0.45,
            stagger: 0.05,
            clearProps: "opacity,visibility,transform",
          },
          "-=0.35",
        );
    },
    { scope: barRef },
  );

  // Mobile menu entrance: stagger the links in when the panel opens. This is
  // a cosmetic layer only — the panel's own visibility (see `.mobile-nav` in
  // globals.css) is plain CSS and never depends on this running, and every
  // link's resting DOM state is already full-opacity, so a tween that gets
  // interrupted (fast double-click, route change) can never strand a link
  // invisible; `clearProps` also drops the inline styles once it settles.
  useGSAP(
    () => {
      if (!open) return;
      const panel = panelRef.current;
      if (!panel) return;
      const links = gsap.utils.toArray<HTMLElement>(
        panel.querySelectorAll("[data-menu-link]"),
      );
      if (
        !links.length ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        return;
      }
      gsap.fromTo(
        links,
        { y: 20, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.5,
          stagger: 0.06,
          ease: "power3.out",
          clearProps: "opacity,visibility,transform",
        },
      );
    },
    { scope: panelRef, dependencies: [open] },
  );

  // Header stays fixed/sticky and always visible while scrolling — it's
  // the visitor's only way to navigate away from wherever they are on the
  // page, so it never hides on scroll-down. Nothing about the logo or nav
  // links ever moves or repositions, so there's nothing here that can
  // collide with itself.
  //
  // The background/height/blur respond to how *far* the page has scrolled,
  // not to crossing one fixed pixel: --header-progress is written directly
  // to the DOM every animation frame (skipping React entirely, so scrolling
  // never triggers a re-render), and the CSS `transition` already on it
  // (see globals.css) smooths each rAF step into the next — so scrolling
  // slowly reads as the header gradually committing, not snapping the
  // instant you nudge the page. `scrolled` (React state, used for the
  // coarser text-color/CTA-variant decisions elsewhere in this component)
  // only flips once that progress crosses its midpoint, so it re-renders
  // once per direction change rather than every scroll pixel.
  React.useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const COMMIT_DISTANCE = 96;
    let frame = 0;

    const apply = () => {
      frame = 0;
      const progress = Math.min(
        1,
        Math.max(0, window.scrollY / COMMIT_DISTANCE),
      );
      header.style.setProperty("--header-progress", String(progress));
      setScrolled(progress > 0.4);
    };

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(apply);
    };

    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [pathname]);

  React.useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current
      ?.querySelector<HTMLButtonElement>("[data-menu-close]")
      ?.focus();
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        menuButtonRef.current?.focus();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  function closeMenu() {
    setOpen(false);
  }

  return (
    <>
      <header
        ref={headerRef}
        data-sticky={!overlayHeroRoute}
        data-scrolled={solid}
        data-overlays-hero={overlaysHero}
        className="site-header"
      >
        <Container size="wide" className="h-full">
          {/* Below `lg`, the nav is hidden entirely — logo and the
              toggle+CTA+menu cluster are the only two things left, so a
              plain `justify-between` puts one at the true left edge and the
              other at the true right, with zero dead space assumed for a
              middle item that isn't there. From `lg` up, once the nav
              reappears: a 3-column grid, not flex justify-between — with
              justify-between, a middle child only gets equal *gaps* to its
              unequal-width neighbors (logo vs. the wider toggle+CTA
              cluster), which pushes its visual center off the header's true
              center. Two equal `1fr` side columns guarantee the nav's own
              column is centered regardless of how wide either side's
              content is. */}
          <div
            ref={barRef}
            className="flex h-full items-center justify-between gap-x-6 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:justify-normal xl:gap-x-12"
          >
            <Link
              href="/"
              onClick={closeMenu}
              aria-label={`${siteConfig.name} home`}
              data-header-side
              className="site-header__logo shrink-0 justify-self-start"
            >
              <Wordmark overlaysHero={overlaysHero} className="h-7 sm:h-8" />
            </Link>

            <nav
              aria-label="Primary"
              className="hidden min-w-0 items-center gap-x-5 justify-self-center lg:flex xl:gap-x-7"
            >
              {siteConfig.navItems.map((item) => (
                <HeaderLink key={item.href} item={item} pathname={pathname} />
              ))}
            </nav>

            <div
              data-header-side
              className="flex items-center gap-2 justify-self-end sm:gap-3 lg:gap-4"
            >
              {/* Compact icon toggle here (cycles); the full 3-segment
                  control lives in the mobile menu panel below. Shows from
                  tablet up now that it's small enough not to crowd. */}
              <ThemeToggle
                variant="compact"
                data-on-media={overlaysHero || undefined}
                className="hidden sm:flex"
              />

              {!open && (
                <ButtonLink
                  href={siteConfig.navigation.appointmentHref}
                  size="sm"
                  variant={overlaysHero ? "onMedia" : "primary"}
                  className="hidden lg:inline-flex"
                >
                  {siteConfig.navigation.appointmentCta}
                </ButtonLink>
              )}

              <Button
                ref={menuButtonRef}
                variant="secondary"
                size="sm"
                data-on-media={overlaysHero || undefined}
                className="header-menu-trigger lg:hidden"
                onClick={() => setOpen((current) => !current)}
                aria-expanded={open}
                aria-controls="site-navigation"
                aria-label={open ? "Close navigation" : "Open navigation"}
              >
                {open ? "Close" : "Menu"}
                <Icon name={open ? "close" : "menu"} size={16} />
              </Button>
            </div>
          </div>
        </Container>
      </header>

      <div
        ref={panelRef}
        id="site-navigation"
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        aria-hidden={!open}
        data-open={open}
        className="mobile-nav"
      >
        <Container size="wide" className="mobile-nav__bar">
          <Link
            href="/"
            onClick={closeMenu}
            aria-label={`${siteConfig.name} home`}
            tabIndex={open ? 0 : -1}
          >
            <Wordmark overlaysHero={false} className="h-7" />
          </Link>
          <Button
            data-menu-close
            variant="secondary"
            size="sm"
            tabIndex={open ? 0 : -1}
            onClick={closeMenu}
            aria-label="Close navigation"
          >
            Close
            <Icon name="close" size={16} />
          </Button>
        </Container>

        <div className="mobile-nav__scroll">
          <Container size="wide">
            <Stack gap="lg" className="py-6 sm:py-8">
              <nav aria-label="Site navigation links">
                <Stack gap="none">
                  {siteConfig.navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href as Route}
                      data-menu-link
                      tabIndex={open ? 0 : -1}
                      onClick={closeMenu}
                      aria-current={pathname === item.href ? "page" : undefined}
                      className={cn(
                        "group flex min-h-16 items-center justify-between border-b border-border py-3 text-navigation-display leading-none font-light tracking-navigation-display transition-colors active:bg-muted/60 sm:min-h-20 sm:py-4 lg:min-h-24",
                        pathname === item.href && "text-primary",
                      )}
                    >
                      <span>{item.label}</span>
                      <Icon
                        name="arrow-right"
                        className="shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary"
                      />
                    </Link>
                  ))}
                </Stack>
              </nav>

              <div className="flex items-center justify-between gap-4 border-t border-border pt-5">
                <Eyebrow as="span">Appearance</Eyebrow>
                <ThemeToggle />
              </div>

              <div className="grid gap-5 border-t border-border pt-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end sm:gap-8 sm:pt-6">
                <Stack gap="sm" className="max-w-md">
                  <Eyebrow>{siteConfig.navigation.appointmentEyebrow}</Eyebrow>
                  <p className="text-sm leading-5 text-muted-foreground">
                    {siteConfig.navigation.appointmentDescription}
                  </p>
                </Stack>
                <ButtonLink
                  href={siteConfig.navigation.appointmentHref}
                  size="lg"
                  fullWidth
                  tabIndex={open ? 0 : -1}
                  onClick={closeMenu}
                  className="justify-between sm:w-auto sm:min-w-52"
                >
                  {siteConfig.navigation.appointmentCta}
                  <Icon name="arrow-right" />
                </ButtonLink>
              </div>
            </Stack>
          </Container>
        </div>
      </div>
    </>
  );
}

/**
 * The Dexta wordmark. Two colour variants of the same asset: charcoal + red on
 * light surfaces, near-white + red on dark ones (over the hero video, or the
 * dark theme). CSS picks between them so there is no hydration flash.
 */
function Wordmark({
  overlaysHero,
  className,
}: {
  overlaysHero: boolean;
  className?: string;
}) {
  const base = cn("w-auto", className);
  return (
    <>
      <Image
        src="/images/dexta-logo-on-dark.svg"
        alt=""
        width={110}
        height={48}
        priority
        className={cn(base, overlaysHero ? "block" : "hidden dark:block")}
      />
      <Image
        src="/images/dexta-logo.svg"
        alt=""
        width={110}
        height={48}
        priority
        className={cn(base, overlaysHero ? "hidden" : "block dark:hidden")}
      />
    </>
  );
}

function HeaderLink({
  item,
  pathname,
}: {
  item: (typeof siteConfig.navItems)[number];
  pathname: string;
}) {
  const active = pathname === item.href;
  return (
    <Link
      href={item.href as Route}
      data-nav-link
      aria-current={active ? "page" : undefined}
      className="site-header__link"
    >
      {item.label}
      <span aria-hidden className="site-header__underline" />
    </Link>
  );
}
