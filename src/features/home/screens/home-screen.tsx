import { Page } from "@/components/layout";
import { CinematicHero } from "@/components/marketing";
import {
  BlogSection,
  FeaturedProjectsSection,
  LandingFooter,
  NewsletterSection,
  ServicesSection,
  StatisticsSection,
  TestimonialSection,
  WhoWeAreSection,
} from "../components";

export function HomeScreen() {
  return (
    <Page>
      <CinematicHero />
      <WhoWeAreSection />
      <ServicesSection />
      <FeaturedProjectsSection />
      <TestimonialSection />
      <StatisticsSection />
      <BlogSection />
      <NewsletterSection />
      <LandingFooter />
    </Page>
  );
}
