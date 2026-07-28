import { Section, Stack } from "@/components/layout";
import { Icon } from "@/components/ui";

export function QuoteBlock({
  quote,
  author,
  role,
}: {
  quote: string;
  author: string;
  role: string;
}) {
  return (
    <Section tone="inverse">
      <Stack gap="lg" align="center" className="mx-auto max-w-4xl text-center">
        <Icon name="quote" size={36} className="text-red-400" />
        <blockquote className="text-2xl leading-tight font-medium text-balance sm:text-4xl">
          “{quote}”
        </blockquote>
        <p className="text-xs tracking-[0.14em] text-background/55 uppercase">
          {author} · {role}
        </p>
      </Stack>
    </Section>
  );
}
