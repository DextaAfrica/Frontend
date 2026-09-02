import Image from "next/image";
import { Section } from "@/components/layout";
import {
  EditorialSectionHeading,
  RevealGroup,
  RevealItem,
} from "@/components/marketing";
import { isRemoteAsset } from "@/lib/media";
import type { AboutTeamContent } from "../types/about-page";

export function AboutTeam({ content }: { content: AboutTeamContent }) {
  return (
    <Section spacing="editorial">
      <EditorialSectionHeading
        eyebrow={content.eyebrow}
        title={content.title}
      />
      <RevealGroup className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {content.members.map((member) => (
          <RevealItem
            as="article"
            key={member.name}
            className="about-team__card"
          >
            <div className="about-team__media">
              <Image
                src={member.image}
                alt={`Portrait of ${member.name}`}
                fill
                sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
                unoptimized={isRemoteAsset(member.image)}
              />
            </div>
            <div className="flex flex-col gap-1 p-5">
              <h3 className="font-display text-sm font-semibold tracking-tight">
                {member.name}
              </h3>
              <p className="text-sm text-muted-foreground">{member.role}</p>
            </div>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}
