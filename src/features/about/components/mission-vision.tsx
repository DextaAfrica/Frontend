import Image from "next/image";
import { Section } from "@/components/layout";
import { RevealGroup, RevealItem } from "@/components/marketing";
import { Eyebrow, renderWithAccents } from "@/components/ui";
import { isRemoteAsset } from "@/lib/media";
import type { MissionVisionContent } from "../types/about-page";

const order = ["mission", "vision"] as const;

export function MissionVision({ content }: { content: MissionVisionContent }) {
  return (
    <Section spacing="editorial" tone="surface">
      <RevealGroup className="grid gap-6 md:grid-cols-2 lg:gap-8">
        {order.map((key) => {
          const item = content[key];
          return (
            <RevealItem
              as="article"
              key={key}
              className="mission-vision__panel"
            >
              <div className="mission-vision__media">
                <Image
                  src={item.image}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 45vw, 100vw"
                  unoptimized={isRemoteAsset(item.image)}
                />
              </div>
              <div className="flex flex-1 flex-col gap-4 p-7 sm:p-9">
                <Eyebrow>{item.label}</Eyebrow>
                <p className="font-display text-editorial leading-[1.2] font-semibold tracking-tight text-balance">
                  {renderWithAccents(item.text)}
                </p>
              </div>
            </RevealItem>
          );
        })}
      </RevealGroup>
    </Section>
  );
}
