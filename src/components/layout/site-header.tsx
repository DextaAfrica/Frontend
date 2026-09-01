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
import { siteConfig } from "@/config/site";
import { gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import { Container } from "./container";
import { Stack } from "./stack";

export function SiteHeader() {
  const [open, setOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const pathname = usePathname();

  const isLandingPage = pathname === "/";
  const solid = !isLandingPage || scrolled || open;
  const overlaysHero = isLandingPage && !open && !scrolled;

  const menuButtonRef = React.useRef<HTMLButtonElement>(null);
  const panelRef = React.useRef<HTMLDivElement>(null);

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
  // page, so it never hides on scroll-down. The only thing that changes on
  // scroll is the background/height fading in over `--header-progress`
  // (a plain CSS transition, see globals.css) — nothing about the logo or
  // nav links ever moves or repositions, so there's nothing here that can
  // collide with itself.
  React.useEffect(() => {
    const updateScrolledState = () => setScrolled(window.scrollY > 24);
    updateScrolledState();
    window.addEventListener("scroll", updateScrolledState, { passive: true });
    return () => window.removeEventListener("scroll", updateScrolledState);
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
        data-sticky={!isLandingPage}
        data-scrolled={solid}
        data-overlays-hero={overlaysHero}
        className="site-header"
      >
        <Container size="wide" className="h-full">
          <div className="flex h-full items-center justify-between gap-4">
            <Link
              href="/"
              onClick={closeMenu}
              aria-label={`${siteConfig.name} home`}
              className="site-header__logo shrink-0"
            >
              <Wordmark overlaysHero={overlaysHero} className="h-7 sm:h-8" />
            </Link>

            <nav
              aria-label="Primary"
              className="hidden items-center gap-7 lg:flex"
            >
              {siteConfig.navItems.map((item) => (
                <HeaderLink key={item.href} item={item} pathname={pathname} />
              ))}
            </nav>

            <div className="flex items-center gap-2.5 sm:gap-4">
              {/* The toggle is a wide 3-segment control — on anything
                  narrower than the full nav, it has nowhere to sit without
                  crowding the CTA/menu button, so it moves into the mobile
                  menu panel instead (below) rather than squeezing in here. */}
              <div className="hidden lg:block">
                <ThemeToggle data-on-media={overlaysHero || undefined} />
              </div>

              {!open && (
                <ButtonLink
                  href={siteConfig.navigation.appointmentHref}
                  size="sm"
                  variant={overlaysHero ? "onMedia" : "primary"}
                  className="hidden text-control-compact tracking-control-compact uppercase md:inline-flex"
                >
                  {siteConfig.navigation.appointmentCta}
                </ButtonLink>
              )}

              <Button
                ref={menuButtonRef}
                variant="secondary"
                size="sm"
                data-on-media={overlaysHero || undefined}
                className="header-menu-trigger shrink-0 text-control-compact tracking-control-compact uppercase lg:hidden"
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
            className="text-control-compact tracking-control-compact uppercase"
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
                  <p className="text-sm leading-6 text-muted-foreground">
                    {siteConfig.navigation.appointmentDescription}
                  </p>
                </Stack>
                <ButtonLink
                  href={siteConfig.navigation.appointmentHref}
                  size="lg"
                  tabIndex={open ? 0 : -1}
                  onClick={closeMenu}
                  className="w-full justify-between sm:w-auto sm:min-w-52"
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
      aria-current={active ? "page" : undefined}
      className={cn(
        "text-control-compact font-medium tracking-control-compact whitespace-nowrap uppercase transition-colors hover:text-primary",
        active && "text-primary",
      )}
    >
      {item.label}
    </Link>
  );
}
