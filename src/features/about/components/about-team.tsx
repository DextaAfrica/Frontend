import type * as React from "react";
import Image from "next/image";
import { Section } from "@/components/layout";
import {
  EditorialSectionHeading,
  Reveal,
  RevealGroup,
  RevealItem,
} from "@/components/marketing";
import { Icon } from "@/components/ui";
import { isRemoteAsset } from "@/lib/media";
import type { AboutTeamContent, TeamMember } from "../types/about-page";

/** Order is deliberate — the panel reveals them left to right in this order. */
const TEAM_SOCIALS = [
  { key: "instagram", label: "Instagram" },
  { key: "linkedin", label: "LinkedIn" },
  { key: "facebook", label: "Facebook" },
] as const;

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
            className="about-team__photo"
          />
        ) : (
          <span aria-hidden className="about-team__monogram">
            {initials(member.name)}
          </span>
        )}

        <span aria-hidden className="about-team__tint" />

        <div className="about-team__panel">
          <div className="about-team__panel-inner">
            <h3 className="about-team__name">{member.name}</h3>
            <p className="about-team__role">{member.role}</p>
            <div className="about-team__socials">
              {TEAM_SOCIALS.map(({ key, label }, index) => {
                const href = member.socials?.[key];
                const style = { "--i": index } as React.CSSProperties;
                return href ? (
                  <a
                    key={key}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="about-team__social"
                    style={style}
                    aria-label={`${member.name} on ${label}`}
                  >
                    <Icon name={key} size={16} />
                  </a>
                ) : (
                  <span
                    key={key}
                    aria-hidden
                    className="about-team__social about-team__social--muted"
                    style={style}
                  >
                    <Icon name={key} size={16} />
                  </span>
                );
              })}
            </div>
          </div>
        </div>
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
      {content.lede ? (
        <Reveal>
          <p className="about-team__lede mt-5 max-w-2xl text-pretty text-muted-foreground">
            {content.lede}
          </p>
        </Reveal>
      ) : null}
      <RevealGroup className="about-team__grid mt-12">
        {content.members.map((member) => (
          <TeamCard key={member.name} member={member} />
        ))}
      </RevealGroup>
    </Section>
  );
}
