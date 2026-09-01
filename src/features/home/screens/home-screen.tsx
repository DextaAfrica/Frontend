import { Page } from "@/components/layout";
import { CtaBand, FaqAccordion, LandingHero } from "@/components/marketing";
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
      <StatisticsSection statistics={content.statistics} />
      <FeaturedProjectsSection
        projects={content.projects}
        heading={content.projectsSection}
      />
      <TestimonialSection
        testimonial={content.testimonial}
        heading={content.testimonialSection}
      />
      <BlogSection posts={content.blog} heading={content.blogSection} />
      <FaqAccordion items={faqItems} />
      <CtaBand />
    </Page>
  );
}
