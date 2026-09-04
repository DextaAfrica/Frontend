import { Container, Stack } from "@/components/layout";
import { ButtonLink, Eyebrow, Heading, Icon, Text } from "@/components/ui";

/**
 * A calm holding state for a route that exists in navigation but has no
 * finished content yet (Careers, Blog). Same centred, single-column shape
 * as `app/not-found.tsx` — an eyebrow, a heading, one line of copy, and a
 * single way forward: back to the home page.
 */
export function PageNotReady({
  eyebrow = "Coming soon",
  title = "This page isn't ready yet",
  description = "We're still putting this section together — check back shortly.",
}: {
  eyebrow?: string;
  title?: string;
  description?: string;
}) {
  return (
    <Container className="grid min-h-page-state place-items-center py-20 text-center">
      <Stack gap="lg" align="center" className="max-w-md">
        <Stack gap="md" align="center">
          <Eyebrow>{eyebrow}</Eyebrow>
          <Heading>{title}</Heading>
        </Stack>
        <Text className="text-pretty">{description}</Text>
        <ButtonLink href="/">
          <Icon name="arrow-right" className="rotate-180" />
          Return home
        </ButtonLink>
      </Stack>
    </Container>
  );
}
