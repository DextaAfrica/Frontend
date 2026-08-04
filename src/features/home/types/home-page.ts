export interface HomeHeroContent {
  titleLines: readonly string[];
  ctaLabel: string;
  ctaHref: string;
  video: string;
  mobileVideo?: string;
  poster?: string;
}

export interface HomeIntroContent {
  heading: string;
  paragraphs: readonly string[];
}

export interface ServiceContent {
  id: string;
  number: string;
  title: string;
  description: string;
  image: string;
}

export interface ProjectContent {
  id: string;
  number: string;
  name: string;
  location: string;
  status: string;
  image: string;
  href: string;
  layout: ProjectLayout;
}

export type ProjectLayout = "feature" | "compact";

export interface TestimonialContent {
  id: string;
  quote: string;
  author: string;
  role: string;
  portrait: string;
}

export interface StatisticContent {
  id: string;
  value: string;
  copy: string;
}

export interface BlogPostContent {
  id: string;
  title: string;
  image: string;
  href: string;
  publishedAt: string;
  readingTime: string;
}

export interface HomePageContent {
  hero: HomeHeroContent;
  intro: HomeIntroContent;
  services: readonly ServiceContent[];
  projectsSection: SectionHeadingContent & {
    ctaLabel: string;
    ctaHref: string;
    cardCtaLabel: string;
  };
  projects: readonly ProjectContent[];
  testimonialSection: SectionHeadingContent;
  testimonial: TestimonialContent;
  statistics: readonly StatisticContent[];
  blogSection: SectionHeadingContent;
  blog: readonly BlogPostContent[];
  newsletter: {
    eyebrow: string;
    title: string;
  };
}

export interface SectionHeadingContent {
  eyebrow: string;
  title: string;
}
