import { Stack } from "@/components/layout";
import { Eyebrow, SectionHeading, Text } from "@/components/ui";

export function MarketingHeading({
  eyebrow,
  title,
  description,
  centered = false,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  centered?: boolean;
}) {
  return (
    <Stack
      gap="sm"
      align={centered ? "center" : "start"}
      className={centered ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}
    >
      <Eyebrow>{eyebrow}</Eyebrow>
      <SectionHeading>{title}</SectionHeading>
      {description && <Text>{description}</Text>}
    </Stack>
  );
}
