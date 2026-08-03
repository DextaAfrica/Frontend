"use client";

import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Button, ButtonLink } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { useTheme } from "@/providers/theme-provider";
import { Cluster } from "./cluster";
import { Container } from "./container";
import { Stack } from "./stack";

export function SiteHeader() {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();
  const { theme } = useTheme();
  const overlaysHero = pathname === "/" && !open;
  const menuButtonRef = React.useRef<HTMLButtonElement>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    menuRef.current?.querySelector<HTMLAnchorElement>("a")?.focus();
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

  if (pathname === "/") {
    const landingLinks = siteConfig.navItems;

    return (
      <header className="absolute inset-x-0 top-0 z-[70] text-white">
        <Container>
          <div className="relative flex min-h-[6.3125rem] items-start justify-between pt-5">
            <nav
              className="hidden grid-cols-2 gap-x-11 gap-y-1 pt-5 text-base leading-6 md:grid"
              aria-label="Main navigation"
            >
              {landingLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href as Route}
                  className="transition-opacity hover:opacity-65"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <Link
              href="/"
              aria-label="Dexta Africa home"
              className="absolute top-[1.875rem] left-1/2 -translate-x-1/2"
            >
              <Image
                src="/images/dexta-logo.svg"
                alt="Dexta"
                width={110}
                height={48}
                priority
              />
            </Link>

            <div className="ml-auto flex items-center gap-2 pt-0.5">
              <span className="hidden text-base sm:inline">
                {theme === "dark" ? "Dark" : "Light"}
              </span>
              <ThemeToggle className="text-white hover:bg-white/10" />
              <Button
                ref={menuButtonRef}
                variant="ghost"
                size="icon"
                className="text-white md:hidden"
                onClick={() => setOpen((current) => !current)}
                aria-expanded={open}
                aria-controls="landing-mobile-navigation"
                aria-label={open ? "Close navigation" : "Open navigation"}
              >
                <Icon name={open ? "close" : "menu"} />
              </Button>
            </div>
          </div>

          <nav
            id="landing-mobile-navigation"
            aria-label="Mobile navigation"
            className={cn(
              "grid overflow-hidden border-t border-white/20 bg-black/80 px-5 text-lg backdrop-blur-xl transition-[grid-template-rows,opacity,padding] md:hidden",
              open
                ? "grid-rows-[1fr] py-5 opacity-100"
                : "pointer-events-none grid-rows-[0fr] py-0 opacity-0",
            )}
          >
            <div className="flex min-h-0 flex-col gap-3 overflow-hidden">
              {landingLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href as Route}
                  onClick={closeMenu}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>
        </Container>
      </header>
    );
  }

  return (
    <>
      <header
        className={cn(
          "top-0 z-[70] w-full border-b transition-[background-color,border-color,color] duration-300",
          overlaysHero
            ? "absolute border-white/15 bg-gradient-to-b from-black/45 to-transparent text-white [&_button]:text-white"
            : open
              ? "fixed inset-x-0 border-border bg-background text-foreground"
              : "sticky border-border/70 bg-background/95 text-foreground backdrop-blur-xl",
        )}
      >
        <Container size="wide">
          <div className="grid h-18 grid-cols-[minmax(0,1fr)_auto] items-center gap-3 sm:h-20 sm:grid-cols-[auto_1fr_auto] sm:gap-6">
            <Link
              href="/"
              onClick={closeMenu}
              className="flex min-w-0 items-center gap-3 text-xs font-medium tracking-[0.16em] uppercase"
              aria-label={`${siteConfig.name} home`}
            >
              <span
                className={cn(
                  "grid size-9 shrink-0 place-items-center border text-[0.6rem] tracking-[0.08em]",
                  overlaysHero
                    ? "border-white/60 text-white"
                    : "border-primary text-primary",
                )}
              >
                DA
              </span>
              <span className="truncate">{siteConfig.name}</span>
            </Link>

            <nav
              className="hidden items-center justify-center gap-6 xl:flex 2xl:gap-9"
              aria-label="Main navigation"
            >
              {siteConfig.navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href as Route}
                  aria-current={pathname === item.href ? "page" : undefined}
                  className={cn(
                    "border-b border-transparent py-2 text-[0.68rem] font-medium tracking-[0.16em] uppercase transition-colors",
                    overlaysHero
                      ? "text-white/70 hover:text-white"
                      : "text-muted-foreground hover:text-foreground",
                    pathname === item.href &&
                      (overlaysHero
                        ? "border-white text-white"
                        : "border-primary text-foreground"),
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <Cluster className="justify-end gap-0.5 sm:gap-1">
              <ThemeToggle />
              <ButtonLink
                href="/contact"
                size="sm"
                variant={overlaysHero ? "ghost" : "outline"}
                className={cn(
                  "hidden border px-4 text-[0.65rem] tracking-[0.12em] uppercase md:inline-flex",
                  overlaysHero &&
                    "border-white/35 text-white hover:bg-white/10",
                )}
              >
                Enquire
              </ButtonLink>
              <Button
                ref={menuButtonRef}
                variant="ghost"
                size="icon"
                className="xl:hidden"
                onClick={() => setOpen((current) => !current)}
                aria-expanded={open}
                aria-controls="mobile-navigation"
                aria-label={open ? "Close navigation" : "Open navigation"}
              >
                <Icon name={open ? "close" : "menu"} />
              </Button>
            </Cluster>
          </div>
        </Container>
      </header>

      <div
        ref={menuRef}
        id="mobile-navigation"
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        aria-hidden={!open}
        className={cn(
          "fixed inset-0 z-[60] bg-background text-foreground transition-[opacity,transform,visibility] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] xl:hidden",
          open
            ? "visible translate-y-0 opacity-100"
            : "pointer-events-none invisible -translate-y-2 opacity-0",
        )}
      >
        <Container
          size="wide"
          className="h-full overflow-y-auto pt-24 pb-8 sm:pt-28 sm:pb-10"
        >
          <Stack gap="lg" className="min-h-full justify-between">
            <nav aria-label="Mobile navigation">
              <Stack gap="none">
                {siteConfig.navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href as Route}
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
                <p className="text-[0.65rem] font-medium tracking-[0.18em] text-primary uppercase">
                  Private appointments
                </p>
                <p className="text-sm leading-6 text-muted-foreground">
                  Explore residences shaped by architecture, landscape, and a
                  more considered way of living.
                </p>
              </Stack>
              <ButtonLink
                href="/contact"
                size="lg"
                onClick={closeMenu}
                className="w-fit"
              >
                Arrange an appointment <Icon name="arrow-right" />
              </ButtonLink>
            </div>
          </Stack>
        </Container>
      </div>
    </>
  );
}
