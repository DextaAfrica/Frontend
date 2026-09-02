import { Stack } from "@/components/layout";
import { cn } from "@/lib/utils";
import {
  EditorialEyebrow,
  EditorialHeading,
  Eyebrow,
  SectionHeading,
  Text,
} from "@/components/ui";
import { Reveal } from "./reveal";

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
    <Reveal>
      <Stack
        gap="md"
        align={centered ? "center" : "start"}
        className={centered ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}
      >
        <Eyebrow>{eyebrow}</Eyebrow>
        <SectionHeading>{title}</SectionHeading>
        {description && <Text>{description}</Text>}
      </Stack>
    </Reveal>
  );
}

export function EditorialSectionHeading({
  eyebrow,
  title,
  align = "start",
  className,
  headingId,
}: {
  eyebrow: string;
  title: string;
  align?: "start" | "center";
  className?: string;
  /** Applied to the underlying <h2> so an ancestor <section> can point its
   * `aria-labelledby` at it, giving the section an accessible name. */
  headingId?: string;
}) {
  return (
    <header
      className={cn(
        "flex max-w-editorial-heading flex-col gap-4",
        align === "center" && "mx-auto items-center text-center",
        className,
      )}
    >
      <EditorialEyebrow>{eyebrow}</EditorialEyebrow>
      <span className="block h-px w-divider bg-current" aria-hidden />
      <EditorialHeading id={headingId}>{title}</EditorialHeading>
    </header>
  );
}
