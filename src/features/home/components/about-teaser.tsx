import { Section } from "@/components/layout";
import { MediaFrame, Reveal } from "@/components/marketing";
import {
  ButtonLink,
  EditorialEyebrow,
  EditorialHeading,
  Icon,
} from "@/components/ui";
import type { AboutTeaserContent } from "../types/home-page";

/**
 * A quiet strip between the statistics and the rest of the page — the numbers
 * above have a story behind them, and this points at it. An editorial line and
 * a single link through to the full About page on one side, a framed image of
 * the team on the other.
 */
export function AboutTeaser({ content }: { content: AboutTeaserContent }) {
  return (
    <Section
      spacing="editorial"
      tone="surface"
      aria-labelledby="about-teaser-heading"
    >
      <div className="grid gap-10 border-t border-border pt-12 md:grid-cols-[1fr_0.8fr] md:items-center md:gap-16">
        <Reveal className="flex flex-col items-start gap-6">
          <EditorialEyebrow>{content.eyebrow}</EditorialEyebrow>
          <EditorialHeading id="about-teaser-heading">
            {content.title}
          </EditorialHeading>
          <ButtonLink href={content.cta.href} variant="secondary" size="lg">
            {content.cta.label}
            <Icon name="arrow-right" />
          </ButtonLink>
        </Reveal>
        <MediaFrame src={content.image} alt="" aspect="5/4" />
      </div>
    </Section>
  );
}
