import { Stack } from "@/components/layout";
import { cn } from "@/lib/utils";
import {
  EditorialEyebrow,
  EditorialHeading,
  Eyebrow,
  SectionHeading,
  Text,
} from "@/components/ui";

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
      data-reveal
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

export function EditorialSectionHeading({
  eyebrow,
  title,
  align = "start",
  className,
}: {
  eyebrow: string;
  title: string;
  align?: "start" | "center";
  className?: string;
}) {
  return (
    <header
      className={cn(
        "flex max-w-editorial-heading flex-col gap-6",
        align === "center" && "mx-auto items-center text-center",
        className,
      )}
    >
      <EditorialEyebrow>{eyebrow}</EditorialEyebrow>
      <span className="block h-px w-divider bg-current" aria-hidden />
      <EditorialHeading>{title}</EditorialHeading>
    </header>
  );
}
