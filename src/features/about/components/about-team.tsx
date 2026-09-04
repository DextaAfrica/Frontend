import Image from "next/image";
import { Section } from "@/components/layout";
import {
  EditorialSectionHeading,
  RevealGroup,
  RevealItem,
} from "@/components/marketing";
import { isRemoteAsset } from "@/lib/media";
import type { AboutTeamContent, TeamMember } from "../types/about-page";

function initials(name: string) {
  return name
    .replace(/^(dr|prof|mr|mrs|ms|engr)\.?\s+/i, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");
}

function TeamCard({ member }: { member: TeamMember }) {
  return (
    <RevealItem as="article" className="about-team__card">
      <div className="about-team__media">
        {member.image ? (
          <Image
            src={member.image}
            alt={`Portrait of ${member.name}`}
            fill
            sizes="(min-width: 1024px) 22rem, (min-width: 640px) 45vw, 100vw"
            unoptimized={isRemoteAsset(member.image)}
          />
        ) : (
          <span aria-hidden className="about-team__monogram">
            {initials(member.name)}
          </span>
        )}
      </div>
      <div className="flex flex-col gap-1 p-5">
        <h3 className="font-display text-sm font-semibold tracking-tight">
          {member.name}
        </h3>
        <p className="text-sm text-muted-foreground">{member.role}</p>
      </div>
    </RevealItem>
  );
}

export function AboutTeam({ content }: { content: AboutTeamContent }) {
  return (
    <Section spacing="editorial">
      <EditorialSectionHeading
        eyebrow={content.eyebrow}
        title={content.title}
      />
      <RevealGroup className="about-team__grid mt-12">
        {content.members.map((member) => (
          <TeamCard key={member.name} member={member} />
        ))}
      </RevealGroup>
    </Section>
  );
}
