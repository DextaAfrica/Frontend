import { Section } from "@/components/layout";
import {
  EditorialSectionHeading,
  RevealItem,
  ScrollFadeGroup,
} from "@/components/marketing";
import type { HomePageContent, StatisticContent } from "../types/home-page";
import { StatCard } from "./stat-card";

export function StatisticsSection({
  statistics,
  heading,
}: {
  statistics: readonly StatisticContent[];
  heading: HomePageContent["statisticsSection"];
}) {
  return (
    <Section spacing="lg" tone="default" aria-labelledby="statistics-heading">
      <EditorialSectionHeading
        eyebrow={heading.eyebrow}
        title={heading.title}
        align="center"
        headingId="statistics-heading"
        className="mb-14"
      />
      <ScrollFadeGroup className="grid border-y border-border md:grid-cols-3">
        {statistics.map((stat, index) => (
          <RevealItem
            as="article"
            key={stat.id}
            className="border-b border-border last:border-b-0 md:border-r md:border-b-0 md:last:border-r-0"
          >
            <StatCard stat={stat} priority={index === 0} />
          </RevealItem>
        ))}
      </ScrollFadeGroup>
    </Section>
  );
}
