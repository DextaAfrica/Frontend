import { Container, Stack } from "@/components/layout";

export default function Loading() {
  return (
    <Container className="py-24" aria-label="Loading page" aria-live="polite">
      <Stack gap="lg">
        <span className="h-3 w-28 animate-pulse rounded-full bg-muted" />
        <span className="h-16 max-w-3xl animate-pulse rounded-xl bg-muted" />
        <span className="h-5 max-w-xl animate-pulse rounded bg-muted" />
        <span className="mt-8 h-80 animate-pulse rounded-3xl bg-muted" />
      </Stack>
    </Container>
  );
}
