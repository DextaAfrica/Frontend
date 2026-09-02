import { Page } from "@/components/layout";
import { CtaBand, DextaClanBand } from "@/components/marketing";
import {
  AboutHero,
  AboutJourney,
  AboutStatement,
  AboutTeam,
  CeoLetter,
  MissionVision,
} from "../components";
import type { AboutPageContent } from "../types/about-page";

export function AboutScreen({ content }: { content: AboutPageContent }) {
  return (
    <Page>
      <AboutHero content={content.hero} />
      <AboutStatement content={content.statement} />
      <MissionVision content={content.missionVision} />
      <AboutJourney content={content.journey} />
      <CeoLetter content={content.ceo} />
      <DextaClanBand {...content.dextaClan} />
      <AboutTeam content={content.team} />
      <CtaBand />
    </Page>
  );
}
