"use client";

import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";
import * as React from "react";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Button } from "@/components/ui/button";
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
  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-xl">
      <Container>
        <Flex align="center" justify="between" className="h-18">
          <Link
            href="/"
            className="flex items-center gap-3 font-bold tracking-[0.08em] uppercase"
            aria-label={`${siteConfig.name} home`}
          >
            <span className="grid size-9 place-items-center rounded-full border border-primary text-sm text-primary">
              MR
            </span>
            <span className="xs:inline hidden">{siteConfig.name}</span>
          </Link>
          <nav
            className="hidden items-center gap-7 lg:flex"
            aria-label="Main navigation"
          >
            {siteConfig.navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href as Route}
                onClick={() => setOpen(false)}
                aria-current={pathname === item.href ? "page" : undefined}
                className={cn(
                  "border-b border-transparent py-2 text-xs font-semibold tracking-[0.12em] text-muted-foreground uppercase transition-colors hover:text-foreground",
                  pathname === item.href && "border-primary text-foreground",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <Cluster className="gap-1">
            <ThemeToggle />
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
          "absolute inset-x-0 top-full overflow-hidden border-b border-border bg-background transition-[max-height,opacity] duration-300 lg:hidden",
          open
            ? "max-h-96 opacity-100"
            : "pointer-events-none max-h-0 opacity-0",
        )}
      >
        <Container className="py-6">
          <Stack gap="none">
            {siteConfig.navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href as Route}
                onClick={() => setOpen(false)}
                className="border-b border-border py-4 text-lg font-semibold"
              >
                {item.label}
              </Link>
            ))}
          </Stack>
        </Container>
      </nav>
    </header>
  );
}
