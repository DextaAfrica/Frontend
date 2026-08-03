"use client";

import { Button, ButtonLink } from "@/components/ui";
import { Center, Stack } from "@/components/layout";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <Center className="min-h-[65vh] px-5 text-center">
      <Stack align="center" gap="md" className="max-w-xl">
        <p className="text-xs font-bold tracking-[0.16em] text-primary uppercase">
          Something went wrong
        </p>
        <h1 className="text-4xl font-semibold tracking-tight">
          This page could not be displayed.
        </h1>
        <p className="text-muted-foreground">
          The issue has been contained. You can retry this page or return safely
          to the homepage.
        </p>
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
