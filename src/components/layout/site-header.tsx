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
import { Cluster } from "./cluster";
import { Container } from "./container";
import { Stack } from "./stack";

export function SiteHeader() {
  const [open, setOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const [retreated, setRetreated] = React.useState(false);
  const lastScrollY = React.useRef(0);
  const pathname = usePathname();
  const isLandingPage = pathname === "/";
  const overlaysHero = isLandingPage && !open && !scrolled;
  const menuButtonRef = React.useRef<HTMLButtonElement>(null);
  const panelRef = React.useRef<HTMLDivElement>(null);

  // Links are always at full opacity in their resting DOM/CSS state, so
  // there's no "stuck invisible" state possible: the whole panel is already
  // hidden via CSS when closed, and this only ever plays an entrance while
  // opening, never one that could leave links mid-fade if it's interrupted.
  useGSAP(
    () => {
      if (!open) return;
      const panel = panelRef.current;
      if (!panel) return;
      const links = gsap.utils.toArray<HTMLElement>(
        panel.querySelectorAll("[data-menu-link]"),
      );
      if (!links.length) return;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
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

  React.useEffect(() => {
    lastScrollY.current = window.scrollY;

    // Reveals on scroll-up, retreats on scroll-down past a threshold that
    // clears the header's own height — so the nav follows the visitor's
    // intent (heading back up to find something) rather than just tracking
    // raw scroll position.
    function update() {
      const currentY = window.scrollY;
      const delta = currentY - lastScrollY.current;
      setScrolled(currentY > 32);
      if (currentY < 120) {
        setRetreated(false);
      } else if (Math.abs(delta) > 4) {
        setRetreated(delta > 0);
      }
      lastScrollY.current = currentY;
    }
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
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

  function closeMenu() {
    setOpen(false);
  }

  return (
    <>
      <header
        className={cn(
          "top-0 z-[var(--layer-header)] w-full border-b transition-[background-color,border-color,color,transform] duration-300 ease-premium",
          retreated && !open ? "-translate-y-full" : "translate-y-0",
          overlaysHero
            ? "absolute border-brand-light/15 bg-brand-dark/70 text-brand-light shadow-lg backdrop-blur-md"
            : open
              ? "fixed inset-x-0 border-border bg-background text-foreground"
              : isLandingPage
                ? "fixed inset-x-0 border-border/70 bg-background/95 text-foreground shadow-sm backdrop-blur-xl"
                : "sticky border-border/70 bg-background/95 text-foreground backdrop-blur-xl",
        )}
      >
        <Container size="wide">
          <div className="flex h-16 flex-nowrap items-center justify-between gap-2 sm:h-20 sm:gap-4">
            <Link
              href="/"
              onClick={closeMenu}
              aria-label={`${siteConfig.name} home`}
              className="shrink-0"
            >
              <Image
                src="/images/dexta-logo.svg"
                alt={siteConfig.name}
                width={110}
                height={48}
                priority
                className={cn(
                  "h-7 w-auto sm:h-9",
                  !overlaysHero && "invert dark:invert-0",
                )}
              />
            </Link>

            <Cluster className="gap-1.5 sm:gap-3">
              <ThemeToggle
                className={cn(
                  overlaysHero &&
                    "border-brand-light/30 bg-brand-dark/70 text-brand-light shadow-lg [&_button:not([aria-checked='true'])]:text-brand-light/75 [&_button:not([aria-checked='true'])]:hover:bg-brand-light/10 [&_button:not([aria-checked='true'])]:hover:text-brand-light [&_button[aria-checked='true']]:border-brand-light [&_button[aria-checked='true']]:bg-brand-light [&_button[aria-checked='true']]:text-brand-dark",
                )}
              />
              {!open && (
                <ButtonLink
                  href={siteConfig.navigation.appointmentHref}
                  size="sm"
                  variant={overlaysHero ? "onMedia" : "primary"}
                  className="header-booking hidden text-control-compact tracking-control-compact uppercase md:inline-flex"
                >
                  {siteConfig.navigation.appointmentCta}
                </ButtonLink>
              )}
              <Button
                ref={menuButtonRef}
                variant="secondary"
                size="sm"
                data-on-media={overlaysHero || undefined}
                className="header-menu-trigger shrink-0 text-control-compact tracking-control-compact uppercase"
                onClick={() => setOpen((current) => !current)}
                aria-expanded={open}
                aria-controls="site-navigation"
                aria-label={open ? "Close navigation" : "Open navigation"}
              >
                {open ? "Close" : "Menu"}
                <Icon name={open ? "close" : "menu"} size={16} />
              </Button>
            </Cluster>
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
          "fixed inset-0 z-[var(--layer-navigation)] bg-background text-foreground transition-[background-color,color,opacity] duration-300 ease-out",
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
