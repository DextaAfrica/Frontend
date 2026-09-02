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
          <Icon name="quote" size={32} className="text-primary" />
          <blockquote className="text-[clamp(1.125rem,1.8vw,1.5rem)] leading-tight font-medium text-balance">
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
