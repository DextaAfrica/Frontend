import { Section } from "@/components/layout";
import { RevealGroup, RevealItem } from "@/components/marketing";
import { Eyebrow, Icon, renderWithAccents } from "@/components/ui";
import type { IconName } from "@/components/ui";
import type { MissionVisionContent } from "../types/about-page";

const order = ["mission", "vision"] as const;

/**
 * Mission and vision, as a pair of editorial panels. Each carries a red icon
 * medallion, its label, a faint outline index, and the statement set in the
 * display face with an italic accent phrase. No photography — the weight is
 * all type and the brand red — so the section never depends on an art asset
 * that may not exist yet.
 */
export function MissionVision({ content }: { content: MissionVisionContent }) {
  return (
    <Section spacing="editorial" tone="surface">
      <RevealGroup className="grid gap-6 md:grid-cols-2 lg:gap-8">
        {order.map((key, index) => {
          const item = content[key];
          return (
            <RevealItem
              as="article"
              key={key}
              className="mission-vision__panel"
            >
              <span aria-hidden className="mission-vision__index">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span aria-hidden className="mission-vision__icon">
                <Icon name={item.icon as IconName} size={26} />
              </span>
              <Eyebrow>{item.label}</Eyebrow>
              <p className="mission-vision__statement">
                {renderWithAccents(item.text)}
              </p>
            </RevealItem>
          );
        })}
      </RevealGroup>
    </Section>
  );
}
