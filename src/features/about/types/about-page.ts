import type { z } from "zod";
import type { aboutPageContentSchema } from "../schemas/about-page";

export type AboutPageContent = z.infer<typeof aboutPageContentSchema>;
export type AboutHeroContent = AboutPageContent["hero"];
export type AboutStatementContent = AboutPageContent["statement"];
export type MissionVisionContent = AboutPageContent["missionVision"];
export type FramedStatement = MissionVisionContent["mission"];
export type AboutJourneyContent = AboutPageContent["journey"];
export type JourneyMilestone = AboutJourneyContent["milestones"][number];
export type CeoLetterContent = AboutPageContent["ceo"];
export type DextaClanContent = AboutPageContent["dextaClan"];
export type AboutTeamContent = AboutPageContent["team"];
export type TeamMember = AboutTeamContent["members"][number];
