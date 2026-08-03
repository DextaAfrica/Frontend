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
    const updateScrolledState = () => setScrolled(window.scrollY > 32);
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

  function closeMenu() {
    setOpen(false);
  }

  return (
    <>
      <header
        className={cn(
          "top-0 z-[70] w-full border-b transition-[background-color,border-color,color] duration-300",
          overlaysHero
            ? "absolute border-white/15 bg-gradient-to-b from-black/45 to-transparent text-white"
            : open
              ? "fixed inset-x-0 border-border bg-background text-foreground"
              : isLandingPage
                ? "fixed inset-x-0 border-border/70 bg-background/95 text-foreground shadow-sm backdrop-blur-xl"
                : "sticky border-border/70 bg-background/95 text-foreground backdrop-blur-xl",
        )}
      >
        <Container size="wide">
          <div className="flex h-16 items-center justify-between gap-3 sm:h-20 sm:gap-4">
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
                    "border-white/25 bg-black/30 text-white shadow-lg [&_button:not([aria-checked='true'])]:text-white/65 [&_button:not([aria-checked='true'])]:hover:bg-white/10 [&_button:not([aria-checked='true'])]:hover:text-white",
                )}
              />
              <ButtonLink
                href="/contact"
                size="sm"
                variant={overlaysHero ? "onMedia" : "primary"}
                className="hidden text-[0.7rem] tracking-[0.08em] uppercase sm:inline-flex"
              >
                <span className="sm:hidden">Book</span>
                <span className="hidden sm:inline">Book Inspection</span>
              </ButtonLink>
              <Button
                ref={menuButtonRef}
                variant={overlaysHero ? "ghost" : "secondary"}
                size="sm"
                className={cn(
                  "text-[0.7rem] tracking-[0.08em] uppercase",
                  overlaysHero &&
                    "border-white/35 text-white hover:bg-white/10",
                )}
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
          "fixed inset-0 z-[60] bg-brand-dark text-brand-light transition-opacity duration-300 ease-out",
          open
            ? "pointer-events-auto visible opacity-100"
            : "pointer-events-none invisible opacity-0",
        )}
      >
        <Container
          size="wide"
          className="h-full overflow-y-auto pt-24 pb-8 sm:pt-28 sm:pb-10"
        >
          <Stack gap="lg" className="min-h-full justify-between">
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
                      "group flex items-center justify-between border-b border-white/15 py-4 text-3xl font-light tracking-[-0.035em] text-brand-light sm:py-5 sm:text-5xl",
                      pathname === item.href && "text-primary",
                    )}
                  >
                    <span>{item.label}</span>
                    <Icon
                      name="arrow-right"
                      className="text-brand-light/50 transition-transform group-hover:translate-x-1 group-hover:text-primary"
                    />
                  </Link>
                ))}
              </Stack>
            </nav>

            <div className="grid gap-6 border-t border-white/15 pt-6 sm:grid-cols-[1fr_auto] sm:items-end">
              <Stack gap="sm" className="max-w-md">
                <Eyebrow>Private appointments</Eyebrow>
                <p className="text-sm leading-6 text-brand-light/60">
                  Explore residences shaped by architecture, landscape, and a
                  more considered way of living.
                </p>
              </Stack>
              <Cluster className="gap-3">
                <ThemeToggle className="text-brand-light hover:bg-white/10" />
                <ButtonLink
                  href="/contact"
                  size="lg"
                  onClick={closeMenu}
                  className="w-fit"
                >
                  Book Inspection <Icon name="arrow-right" />
                </ButtonLink>
              </Cluster>
            </div>
          </Stack>
        </Container>
      </div>
    </>
  );
}
