import Link from "next/link";
import type { Route } from "next";
import { Container, Flex, Grid, Stack } from "@/components/layout";
import { ButtonLink, Eyebrow, Icon, Text } from "@/components/ui";
import { siteConfig } from "@/config/site";
import { CookieSettingsButton } from "@/components/consent/consent-manager";
import { NewsletterButton } from "@/features/newsletter/components/newsletter-manager";

const groups = [
  { title: "Explore", links: siteConfig.navItems },
  {
    title: "Portfolio",
    links: [
      { label: "Now selling", href: "/portfolio/seren-redwood" },
      { label: "Launching soon", href: "/portfolio/the-atelier" },
      { label: "Completed", href: "/portfolio/redwood-place" },
      { label: "Flagship residence", href: "/portfolio/seren-redwood" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Our philosophy", href: "/about" },
      { label: "Journal", href: "/journal" },
      { label: "Careers", href: "/careers" },
      { label: "Contact", href: "/contact" },
    ],
  },
] as const;

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-foreground text-background">
      <Container className="py-16 sm:py-20">
        <Stack gap="2xl">
          <Flex direction="responsive" justify="between" align="start" gap="xl">
            <Stack gap="md" className="max-w-xl">
              <Eyebrow className="text-red-400">Private appointments</Eyebrow>
              <h2 className="text-3xl font-semibold tracking-tight sm:text-5xl">
                Begin a more considered way of living.
              </h2>
              <Text className="text-background/60">
                Speak with our team about residences, investment opportunities,
                and private previews.
              </Text>
              <ButtonLink href="/contact" size="lg" className="w-fit">
                Start a conversation <Icon name="arrow-right" />
              </ButtonLink>
            </Stack>
            <Stack gap="sm" className="text-sm text-background/65">
              <span className="flex items-center gap-2">
                <Icon name="phone" />
                {siteConfig.contact.phone}
              </span>
              <span className="flex items-center gap-2">
                <Icon name="mail" />
                {siteConfig.contact.email}
              </span>
              <span className="flex max-w-xs items-start gap-2">
                <Icon name="pin" className="mt-0.5 shrink-0" />
                {siteConfig.contact.address}
              </span>
            </Stack>
          </Flex>
          <span className="h-px bg-background/15" />
          <Grid columns="four" gap="lg">
            <Stack gap="sm">
              <Link
                href="/"
                className="text-xl font-bold tracking-[0.1em] uppercase"
              >
                {siteConfig.name}
              </Link>
              <Text className="text-sm text-background/55">
                Architecture with purpose. Residences with presence. Places made
                to endure.
              </Text>
            </Stack>
            {groups.map((group) => (
              <Stack key={group.title} gap="sm">
                <p className="text-xs font-bold tracking-[0.14em] uppercase">
                  {group.title}
                </p>
                {group.links.map((link) => (
                  <Link
                    key={`${group.title}-${link.label}`}
                    href={link.href as Route}
                    className="w-fit text-sm text-background/55 transition-colors hover:text-background"
                  >
                    {link.label}
                  </Link>
                ))}
              </Stack>
            ))}
          </Grid>
          <Flex
            direction="responsive"
            justify="between"
            gap="sm"
            className="border-t border-background/15 pt-6 text-xs text-background/45"
          >
            <p>
              © {new Date().getFullYear()} {siteConfig.name}. All rights
              reserved.
            </p>
            <nav className="flex gap-5" aria-label="Legal">
              <Link href={"/privacy" as Route}>Privacy</Link>
              <Link href={"/terms" as Route}>Terms</Link>
              <Link href={"/cookies" as Route}>Cookies</Link>
              <Link href={"/accessibility" as Route}>Accessibility</Link>
              <CookieSettingsButton className="hover:text-background" />
              <NewsletterButton className="hover:text-background" />
            </nav>
          </Flex>
        </Stack>
      </Container>
    </footer>
  );
}
