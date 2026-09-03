import { Grid, Section, Stack } from "@/components/layout";
import { Badge, ButtonLink, Icon, SectionHeading, Text } from "@/components/ui";
import { Reveal, RevealGroup, RevealItem } from "./reveal";

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqAccordionProps {
  items: readonly FaqItem[];
  title?: string;
  description?: string;
}

/**
 * The FAQ section. Built on native <details>/<summary> so it's keyboard- and
 * screen-reader-accessible and works before hydration. The heading is the sans
 * `SectionHeading` (the whole thing was Playfair before and read poorly); the
 * `*word*` accent still renders in the shared red Playfair-italic treatment,
 * the same as every other section heading on the page.
 */
export function FaqAccordion({
  items,
  title = "Your questions, *answered*.",
  description = "Everything you need to know about buying land and property with Dexta. Can't find your answer here?",
}: FaqAccordionProps) {
  return (
    <Section tone="surface" aria-labelledby="faq-heading">
      <Grid columns="two" gap="xl" className="items-start">
        <Reveal>
          <Stack gap="lg" className="lg:sticky lg:top-28">
            <Badge variant="outline" className="w-fit gap-1.5">
              <Icon name="quote" size={12} />
              FAQ
            </Badge>
            <SectionHeading id="faq-heading">{title}</SectionHeading>
            <Text className="max-w-sm">{description}</Text>
            <ButtonLink
              href="/contact"
              variant="secondary"
              size="md"
              className="w-fit"
            >
              Talk to our team
              <Icon name="arrow-right" />
            </ButtonLink>
          </Stack>
        </Reveal>

        <RevealGroup as="div" className="border-t border-border">
          {items.map((item, index) => (
            <RevealItem as="div" key={item.question}>
              <details
                className="group border-b border-border py-5 [&_summary::-webkit-details-marker]:hidden"
                open={index === 0}
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-display text-base font-medium text-foreground marker:content-none sm:text-lg">
                  {item.question}
                  <Icon
                    name="chevron-down"
                    className="shrink-0 text-muted-foreground transition-transform duration-300 group-open:rotate-180"
                  />
                </summary>
                <Text className="mt-4 max-w-2xl text-sm sm:text-base">
                  {item.answer}
                </Text>
              </details>
            </RevealItem>
          ))}
        </RevealGroup>
      </Grid>
    </Section>
  );
}
