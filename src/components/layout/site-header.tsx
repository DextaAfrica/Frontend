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
  const pathname = usePathname();
  const overlaysHero = pathname === "/" && !open;
  const menuButtonRef = React.useRef<HTMLButtonElement>(null);
  const panelRef = React.useRef<HTMLDivElement>(null);

  // Panel open/close itself is driven purely by `open` + CSS below, so the
  // menu always shows even if this animation setup fails for any reason.
  // GSAP is only responsible for the nav-link stagger, as pure polish.
  useGSAP(
    () => {
      const panel = panelRef.current;
      if (!panel) return;
      const links = gsap.utils.toArray<HTMLElement>(
        panel.querySelectorAll("[data-menu-link]"),
      );
      if (!links.length) return;

      if (!open) {
        gsap.set(links, { y: 24, opacity: 0 });
        return;
      }

      const mm = gsap.matchMedia();
      mm.add(
        { reduceMotion: "(prefers-reduced-motion: reduce)" },
        (context) => {
          const { reduceMotion } = context.conditions as {
            reduceMotion: boolean;
          };

          if (reduceMotion) {
            gsap.set(links, { y: 0, opacity: 1 });
          } else {
            gsap.fromTo(
              links,
              { y: 24, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.5,
                stagger: 0.06,
                ease: "power3.out",
              },
            );
          }
        },
      );

      return () => mm.revert();
    },
    { scope: panelRef, dependencies: [open] },
  );

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
              : "sticky border-border/70 bg-background/95 text-foreground backdrop-blur-xl",
        )}
      >
        <Container size="wide">
          <div className="flex h-18 items-center justify-between gap-4 sm:h-20">
            <Link
              href="/"
              onClick={closeMenu}
              aria-label={`${siteConfig.name} home`}
              className="shrink-0"
            >
              <Image
                src="/images/dexta-logo.svg"
                alt={siteConfig.name}
                width={92}
                height={40}
                priority
                className={cn(!overlaysHero && "invert dark:invert-0")}
              />
            </Link>

            <Cluster className="gap-2 sm:gap-3">
              <ThemeToggle
                className={cn(
                  overlaysHero &&
                    "border-white/35 bg-black/25 text-white shadow-lg ring-1 ring-black/10 hover:border-white/60 hover:bg-black/40",
                )}
              />
              <ButtonLink
                href="/contact"
                size="sm"
                variant={overlaysHero ? "onMedia" : "primary"}
                className="text-[0.7rem] tracking-[0.08em] uppercase"
              >
                Book Inspection
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
          "invisible fixed inset-0 z-[60] bg-background text-foreground opacity-0",
          open ? "pointer-events-auto" : "pointer-events-none",
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
                      "group flex items-center justify-between border-b border-border py-4 text-3xl font-light tracking-[-0.035em] sm:py-5 sm:text-5xl",
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

            <div className="grid gap-6 border-t border-border pt-6 sm:grid-cols-[1fr_auto] sm:items-end">
              <Stack gap="sm" className="max-w-md">
                <Eyebrow>Private appointments</Eyebrow>
                <p className="text-sm leading-6 text-muted-foreground">
                  Explore residences shaped by architecture, landscape, and a
                  more considered way of living.
                </p>
              </Stack>
              <Cluster className="gap-3">
                <ThemeToggle />
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
