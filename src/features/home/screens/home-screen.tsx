import { Page } from "@/components/layout";
import { CinematicHero } from "@/components/marketing";
import {
  BlogSection,
  FeaturedProjectsSection,
  NewsletterSection,
  ServicesSection,
  StatisticsSection,
  TestimonialSection,
  WhoWeAreSection,
} from "../components";
import type { HomePageContent } from "../types/home-page";

export function HomeScreen({ content }: { content: HomePageContent }) {
  return (
    <Page>
      <CinematicHero {...content.hero} />
      <WhoWeAreSection content={content.intro} />
      <ServicesSection services={content.services} />
      <FeaturedProjectsSection
        projects={content.projects}
        heading={content.projectsSection}
      />
      <TestimonialSection
        testimonial={content.testimonial}
        heading={content.testimonialSection}
      />
      <StatisticsSection statistics={content.statistics} />
      <BlogSection posts={content.blog} heading={content.blogSection} />
      <NewsletterSection {...content.newsletter} />
    </Page>
  );
}
