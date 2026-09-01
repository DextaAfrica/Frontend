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

const PRIMARY_NAV_COUNT = 3;
const leftNavItems = siteConfig.navItems.slice(0, PRIMARY_NAV_COUNT);
const rightNavItems = siteConfig.navItems.slice(PRIMARY_NAV_COUNT);

export function SiteHeader() {
  const [open, setOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const [morphActive, setMorphActive] = React.useState(false);
  const pathname = usePathname();

  const isLandingPage = pathname === "/";
  const solid = !isLandingPage || scrolled || open;
  const overlaysHero = isLandingPage && !open && !scrolled;

  const menuButtonRef = React.useRef<HTMLButtonElement>(null);
  const panelRef = React.useRef<HTMLDivElement>(null);
  const headerRef = React.useRef<HTMLElement>(null);
  const logoRef = React.useRef<HTMLAnchorElement>(null);
  const leftNavRef = React.useRef<HTMLElement>(null);

  // Mobile menu entrance: stagger the links in when the panel opens. The
  // resting DOM state is already full-opacity, so an interrupted tween can
  // never leave a link stuck invisible.
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
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.06, ease: "power3.out" },
      );
    },
    { scope: panelRef, dependencies: [open] },
  );

  // Header stays fixed/sticky and always visible while scrolling — it's
  // the visitor's only way to navigate away from wherever they are on the
  // page, so it never hides on scroll-down.
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
    panelRef.current?.querySelector<HTMLAnchorElement>("a")?.focus();
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

  // Desktop scroll-morph: the logo glides from the left gutter to dead centre
  // and the bar picks up a glass background — scrubbed to the first ~170px
  // of scroll. Wide screens with motion allowed only; every other case is
  // handled by CSS off `data-scrolled`. The nav links themselves are never
  // part of this animation — they're visible from first paint, full stop,
  // since they're the visitor's only way to navigate the site.
  useGSAP(
    () => {
      if (!isLandingPage) return;
      const header = headerRef.current;
      const logo = logoRef.current;
      const anchor = leftNavRef.current;
      if (!header || !logo || !anchor) return;

      const mm = gsap.matchMedia();
      mm.add(
        "(min-width: 64rem) and (prefers-reduced-motion: no-preference)",
        () => {
          setMorphActive(true);

          const measureTravel = () => {
            const current = Number(gsap.getProperty(logo, "x")) || 0;
            gsap.set(logo, { x: 0 });
            const travel =
              logo.getBoundingClientRect().left -
              anchor.getBoundingClientRect().left;
            gsap.set(logo, { x: current });
            return Math.max(0, travel);
          };

          let travel = measureTravel();
          const progress = { value: 0 };

          const timeline = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: document.documentElement,
              start: "top top",
              end: "+=170",
              scrub: 0.4,
              invalidateOnRefresh: true,
              onRefresh: () => {
                travel = measureTravel();
              },
            },
          });

          timeline
            .to(
              progress,
              {
                value: 1,
                onUpdate: () =>
                  header.style.setProperty(
                    "--header-progress",
                    String(progress.value),
                  ),
              },
              0,
            )
            .fromTo(
              logo,
              { x: () => -travel, scale: 1 },
              { x: 0, scale: 0.9 },
              0,
            );

          return () => {
            setMorphActive(false);
            header.style.removeProperty("--header-progress");
          };
        },
      );

      return () => mm.revert();
    },
    { scope: headerRef, dependencies: [isLandingPage] },
  );

  function closeMenu() {
    setOpen(false);
  }

  return (
    <>
      <header
        ref={headerRef}
        data-sticky={!isLandingPage}
        data-scrolled={solid}
        data-overlays-hero={overlaysHero}
        data-gsap={morphActive}
        className="site-header"
      >
        <Container size="wide" className="h-full">
          <div className="flex h-full items-center justify-between gap-3">
            <div className="flex items-center gap-6 xl:gap-10">
              <Link
                href="/"
                onClick={closeMenu}
                aria-label={`${siteConfig.name} home`}
                className="site-header__logo shrink-0 lg:hidden"
              >
                <Wordmark overlaysHero={overlaysHero} className="h-7 sm:h-8" />
              </Link>

              <nav
                ref={leftNavRef}
                data-nav-group
                aria-label="Primary"
                className="site-header__nav-group hidden items-center gap-7 lg:flex"
              >
                {leftNavItems.map((item) => (
                  <HeaderLink key={item.href} item={item} pathname={pathname} />
                ))}
              </nav>
            </div>

            <Link
              ref={logoRef}
              href="/"
              onClick={closeMenu}
              aria-label={`${siteConfig.name} home`}
              className="site-header__logo absolute top-1/2 left-1/2 z-[1] hidden -translate-y-1/2 lg:block"
            >
              <span className="block -translate-x-1/2">
                <Wordmark overlaysHero={overlaysHero} className="h-8" />
              </span>
            </Link>

            <div className="flex items-center gap-2.5 sm:gap-4">
              <nav
                data-nav-group
                aria-label="Secondary"
                className="site-header__nav-group hidden items-center gap-7 lg:flex"
              >
                {rightNavItems.map((item) => (
                  <HeaderLink key={item.href} item={item} pathname={pathname} />
                ))}
              </nav>

              <ThemeToggle data-on-media={overlaysHero || undefined} />

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
        className={cn(
          "fixed inset-0 z-[var(--layer-navigation)] bg-background text-foreground transition-[opacity] duration-300 ease-out",
          open
            ? "pointer-events-auto visible opacity-100"
            : "pointer-events-none invisible opacity-0",
        )}
      >
        <Container
          size="wide"
          className="site-navigation-scroll h-full overflow-y-auto pt-20 sm:pt-24"
        >
          <Stack gap="lg" className="min-h-full justify-between py-4 sm:py-6">
            <nav aria-label="Site navigation links">
              <Stack gap="none">
                {siteConfig.navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href as Route}
                    data-menu-link
                    onClick={closeMenu}
                    aria-current={pathname === item.href ? "page" : undefined}
                    className={cn(
                      "group flex min-h-16 items-center justify-between border-b border-border py-3 text-navigation-display leading-none font-light tracking-navigation-display sm:min-h-20 sm:py-4 sm:text-5xl lg:min-h-24 lg:text-6xl",
                      pathname === item.href && "text-primary",
                    )}
                  >
                    <span>{item.label}</span>
                    <Icon
                      name="arrow-right"
                      className="text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary"
                    />
                  </Link>
                ))}
              </Stack>
            </nav>

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
                onClick={closeMenu}
                className="w-full justify-between sm:w-auto sm:min-w-52"
              >
                {siteConfig.navigation.appointmentCta}{" "}
                <Icon name="arrow-right" />
              </ButtonLink>
            </div>
          </Stack>
        </Container>
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
