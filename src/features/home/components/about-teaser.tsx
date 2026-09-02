import { Section } from "@/components/layout";
import { Reveal } from "@/components/marketing";
import {
  ButtonLink,
  EditorialEyebrow,
  EditorialHeading,
  Icon,
} from "@/components/ui";
import type { AboutTeaserContent } from "../types/home-page";

/**
 * A quiet strip between the statistics and the rest of the page — the numbers
 * above have a story behind them, and this points at it. Deliberately minimal:
 * an editorial line and a single link through to the full About page.
 */
export function AboutTeaser({ content }: { content: AboutTeaserContent }) {
  return (
    <Section
      spacing="editorial"
      tone="surface"
      aria-labelledby="about-teaser-heading"
    >
      <Reveal className="flex flex-col gap-8 border-t border-border pt-12 md:flex-row md:items-end md:justify-between md:gap-16">
        <div className="flex max-w-2xl flex-col gap-5">
          <EditorialEyebrow>{content.eyebrow}</EditorialEyebrow>
          <EditorialHeading id="about-teaser-heading">
            {content.title}
          </EditorialHeading>
        </div>
        <ButtonLink
          href={content.cta.href}
          variant="secondary"
          size="lg"
          className="shrink-0"
        >
          {content.cta.label}
          <Icon name="arrow-right" />
        </ButtonLink>
      </Reveal>
    </Section>
  );
}
