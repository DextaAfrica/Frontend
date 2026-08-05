"use client";

import { Button, ButtonLink, Eyebrow, Heading, Text } from "@/components/ui";
import { Center, Stack } from "@/components/layout";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <Center className="min-h-page-state px-5 text-center">
      <Stack align="center" gap="md" className="max-w-xl">
        <Stack gap="lg" align="center">
          <Eyebrow>Something went wrong</Eyebrow>
          <Heading>This page could not be displayed.</Heading>
        </Stack>
        <Text>
          The issue has been contained. You can retry this page or return safely
          to the homepage.
        </Text>
        {error.digest && (
          <code className="rounded bg-muted px-2 py-1 text-xs">
            Reference: {error.digest}
          </code>
        )}
        <span className="flex flex-wrap justify-center gap-3">
          <Button onClick={reset}>Try again</Button>
          <ButtonLink href="/" variant="secondary">
            Return home
          </ButtonLink>
        </span>
      </Stack>
    </Center>
  );
}
