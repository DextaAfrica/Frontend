import type { z } from "zod";
import type { homePageContentSchema } from "../schemas/home-page";

export type HomePageContent = z.infer<typeof homePageContentSchema>;
export type HomeHeroContent = HomePageContent["hero"];
export type HomeIntroContent = HomePageContent["intro"];
export type ServiceContent = HomePageContent["services"][number];
export type ProjectContent = HomePageContent["projects"][number];
export type ProjectLayout = ProjectContent["layout"];
export type TestimonialContent = HomePageContent["testimonials"][number];
export type StatisticContent = HomePageContent["statistics"][number];
export type BlogPostContent = HomePageContent["blog"][number];
export type SectionHeadingContent = HomePageContent["blogSection"];
export type AboutTeaserContent = HomePageContent["aboutTeaser"];
export type HomeDextaClanContent = HomePageContent["dextaClan"];
