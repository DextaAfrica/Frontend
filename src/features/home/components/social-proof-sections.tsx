import { Section } from "@/components/layout";
import { RevealGroup, RevealItem } from "@/components/marketing";
import type { StatisticContent } from "../types/home-page";
import { StatCard } from "./stat-card";

export function StatisticsSection({
  statistics,
}: {
  statistics: readonly StatisticContent[];
}) {
  return (
    <Section spacing="lg" tone="surface">
      <RevealGroup className="grid border-y border-border md:grid-cols-3">
        {statistics.map((stat, index) => (
          <RevealItem
            as="article"
            key={stat.id}
            className="border-b border-border last:border-b-0 md:border-r md:border-b-0 md:last:border-r-0"
          >
            <StatCard stat={stat} priority={index === 0} />
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}
