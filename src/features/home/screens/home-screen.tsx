import { Page } from "@/components/layout";
import {
  CtaBand,
  ExpertiseMarquee,
  FaqAccordion,
  LandingHero,
} from "@/components/marketing";
import { expertiseItems } from "../data/expertise";
import { faqItems } from "../data/faq";
import {
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
      <WhoWeAreSection content={content.intro} />
      <ServicesSection services={content.services} />
      <ExpertiseMarquee eyebrow="Our expertise" items={expertiseItems} />
      <FeaturedProjectsSection
        projects={content.projects}
        heading={content.projectsSection}
      />
      <StatisticsSection statistics={content.statistics} />
      <TestimonialSection
        testimonials={content.testimonials}
        heading={content.testimonialSection}
      />
      <BlogSection posts={content.blog} heading={content.blogSection} />
      <FaqAccordion items={faqItems} />
      <CtaBand />
    </Page>
  );
}
