import { Section, Stack } from "@/components/layout";
import { Eyebrow, Icon } from "@/components/ui";
import { Reveal } from "./reveal";

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
      <Reveal>
        <Stack
          gap="lg"
          align="center"
          className="mx-auto max-w-4xl text-center"
        >
          <Icon name="quote" size={36} className="text-red-400" />
          <blockquote className="text-2xl leading-tight font-medium text-balance sm:text-4xl">
            “{quote}”
          </blockquote>
          <Eyebrow className="text-background/55">
            {author} · {role}
          </Eyebrow>
        </Stack>
      </Reveal>
    </Section>
  );
}
