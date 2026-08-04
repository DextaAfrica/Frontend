import { ButtonLink } from "@/components/ui/button";
import { Container, Stack } from "@/components/layout";
import { Eyebrow, Heading, Text } from "@/components/ui";

export default function NotFound() {
  return (
    <Container className="grid min-h-[65vh] place-items-center py-20 text-center">
      <Stack gap="lg" align="center">
        <Stack gap="lg" align="center">
          <Eyebrow>404</Eyebrow>
          <Heading>Page not found</Heading>
        </Stack>
        <Text>The page you requested does not exist.</Text>
        <ButtonLink href="/">Return home</ButtonLink>
      </Stack>
    </Container>
  );
}
