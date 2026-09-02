import { Grid, Section, Stack } from "@/components/layout";
import { Badge, EditorialHeading, Icon, Text } from "@/components/ui";
import { Reveal, RevealGroup, RevealItem } from "./reveal";

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqAccordionProps {
  items: readonly FaqItem[];
  title?: string;
}

/**
 * The "Got Questions?" section repeated across every page. Built on native
 * <details>/<summary> so it's keyboard- and screen-reader-accessible, and
 * works even before hydration.
 */
export function FaqAccordion({
  items,
  title = "Got *Questions*?",
}: FaqAccordionProps) {
  return (
    <Section tone="surface" aria-labelledby="faq-heading">
      <Grid columns="two" gap="xl" className="items-start">
        <Reveal>
          <Stack gap="md" className="lg:sticky lg:top-28">
            <Badge variant="outline" className="w-fit gap-1.5">
              <Icon name="quote" size={12} />
              FAQ
            </Badge>
            <EditorialHeading id="faq-heading">{title}</EditorialHeading>
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
