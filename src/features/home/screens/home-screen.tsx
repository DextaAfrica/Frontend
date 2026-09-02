import { Page } from "@/components/layout";
import {
  CtaBand,
  DextaClanBand,
  ExpertiseMarquee,
  FaqAccordion,
  LandingHero,
  NewsletterSection,
  PressMarquee,
} from "@/components/marketing";
import { expertiseItems } from "../data/expertise";
import { faqItems } from "../data/faq";
import {
  AboutTeaser,
  BlogSection,
  FeaturedProjectsSection,
  ServicesSection,
  StatisticsSection,
  TestimonialSection,
  WhoWeAreSection,
} from "../components";
import type { HomePageContent } from "../types/home-page";

export function HomeScreen({ content }: { content: HomePageContent }) {
  return (
    <Page>
      <LandingHero {...content.hero} />
      <PressMarquee />
      <WhoWeAreSection content={content.intro} />
      <ServicesSection services={content.services} />
      <ExpertiseMarquee
        heading={content.expertiseSection}
        items={expertiseItems}
      />
      <FeaturedProjectsSection
        projects={content.projects}
        heading={content.projectsSection}
      />
      <StatisticsSection
        statistics={content.statistics}
        heading={content.statisticsSection}
      />
      <AboutTeaser content={content.aboutTeaser} />
      <TestimonialSection
        testimonials={content.testimonials}
        heading={content.testimonialSection}
      />
      <DextaClanBand {...content.dextaClan} />
      <NewsletterSection {...content.newsletter} />
      <FaqAccordion items={faqItems} />
      <CtaBand />
      <BlogSection posts={content.blog} heading={content.blogSection} />
    </Page>
  );
}
