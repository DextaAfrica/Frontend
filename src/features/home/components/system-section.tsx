import { Section, Stack } from "@/components/layout";
import { Eyebrow, SectionHeading, Text } from "@/components/ui";

export function SystemSection() {
  return (
    <Section id="components">
      <Stack
        gap="sm"
        className="rounded-3xl bg-foreground px-6 py-12 text-background sm:px-12 sm:py-16"
      >
        <Eyebrow className="text-red-400">Component system</Eyebrow>
        <SectionHeading>Designed to scale cleanly.</SectionHeading>
        <Text className="max-w-2xl text-background/65">
          Each feature owns its screen composition and domain logic. Shared UI
          and layout primitives stay independent, reusable, and easy to map to
          Figma.
        </Text>
      </Stack>
    </Section>
  );
}
