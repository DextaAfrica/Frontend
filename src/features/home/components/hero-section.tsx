import { Box, Cluster, Section, Stack } from "@/components/layout";
import { ButtonLink, Eyebrow, Heading, Icon, Text } from "@/components/ui";

export function HeroSection() {
  return (
    <Section spacing="lg" className="overflow-hidden">
      <Box
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,var(--color-primary-subtle),transparent_35%)]"
      />
      <Stack gap="lg" align="start" className="relative max-w-4xl">
        <Stack gap="sm" align="start">
          <Eyebrow>Product foundation · v2.0</Eyebrow>
          <Heading>
            Architecture first.
            <span className="block text-primary">Figma ready.</span>
          </Heading>
        </Stack>
        <Text className="max-w-2xl text-pretty">
          A layout-first Next.js system where product screens are composed from
          stable primitives instead of scattered markup and duplicated utility
          classes.
        </Text>
        <Cluster>
          <ButtonLink href="/portfolio" size="lg">
            Explore portfolio <Icon name="arrow-right" />
          </ButtonLink>
          <ButtonLink href="/about" size="lg" variant="secondary">
            Our story
          </ButtonLink>
        </Cluster>
      </Stack>
    </Section>
  );
}
