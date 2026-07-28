"use client";

import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";
import * as React from "react";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Button, ButtonLink } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { Cluster } from "./cluster";
import { Container } from "./container";
import { Flex } from "./flex";
import { Stack } from "./stack";

export function SiteHeader() {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();
  const overlaysHero = pathname === "/";
  const usesLightChrome = overlaysHero && !open;
  React.useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = open ? "hidden" : previous;
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);
  return (
    <header
      className={cn(
        "top-0 z-50 border-b backdrop-blur-xl",
        usesLightChrome
          ? "absolute inset-x-0 border-white/15 bg-black/10 text-white [&_button]:text-white"
          : "sticky border-border/70 bg-background/85",
      )}
    >
      <Container size="wide">
        <Flex align="center" justify="between" className="h-20">
          <Link
            href="/"
            className="flex items-center gap-3 text-xs font-medium tracking-[0.18em] uppercase"
            aria-label={`${siteConfig.name} home`}
          >
            <span
              className={cn(
                "grid size-9 place-items-center border text-[0.62rem] tracking-[0.08em]",
                usesLightChrome
                  ? "border-white/60 text-white"
                  : "border-primary text-primary",
              )}
            >
              MR
            </span>
            <span className="xs:inline hidden">{siteConfig.name}</span>
          </Link>
          <nav
            className="absolute top-1/2 left-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-8 lg:flex"
            aria-label="Main navigation"
          >
            {siteConfig.navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href as Route}
                onClick={() => setOpen(false)}
                aria-current={pathname === item.href ? "page" : undefined}
                className={cn(
                  "border-b border-transparent py-2 text-[0.68rem] font-medium tracking-[0.16em] uppercase transition-colors",
                  usesLightChrome
                    ? "text-white/70 hover:text-white"
                    : "text-muted-foreground hover:text-foreground",
                  pathname === item.href &&
                    (usesLightChrome
                      ? "border-white text-white"
                      : "border-primary text-foreground"),
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <Cluster className="gap-1">
            <ThemeToggle />
            <ButtonLink
              href="/contact"
              size="sm"
              variant={usesLightChrome ? "ghost" : "outline"}
              className={cn(
                "hidden border px-4 text-[0.65rem] tracking-[0.12em] uppercase sm:inline-flex",
                usesLightChrome &&
                  "border-white/35 text-white hover:bg-white/10",
              )}
            >
              Enquire
            </ButtonLink>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-controls="mobile-navigation"
              aria-label={open ? "Close navigation" : "Open navigation"}
            >
              <Icon name={open ? "close" : "menu"} />
            </Button>
          </Cluster>
        </Flex>
      </Container>
      <nav
        id="mobile-navigation"
        aria-label="Mobile navigation"
        className={cn(
          "fixed inset-x-0 top-20 bottom-0 overflow-hidden border-t border-border bg-background text-foreground shadow-2xl transition-[opacity,transform,visibility] duration-500 lg:hidden",
          open
            ? "visible translate-y-0 opacity-100"
            : "pointer-events-none invisible translate-y-3 opacity-0",
        )}
      >
        <Container className="h-full py-8 sm:py-10">
          <Stack gap="lg" className="h-full justify-between">
            <Stack gap="none">
              {siteConfig.navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href as Route}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "border-b border-border py-4 text-2xl font-light tracking-[-0.02em] sm:text-3xl",
                    pathname === item.href && "text-primary",
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </Stack>
            <Stack
              gap="md"
              align="start"
              className="border-t border-border pt-6"
            >
              <p className="max-w-sm text-sm leading-6 text-muted-foreground">
                Private residences shaped by architecture, landscape, and a more
                considered way of living.
              </p>
              <ButtonLink
                href="/contact"
                size="lg"
                onClick={() => setOpen(false)}
              >
                Arrange a private appointment <Icon name="arrow-right" />
              </ButtonLink>
            </Stack>
          </Stack>
        </Container>
      </nav>
    </header>
  );
}
