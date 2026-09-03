import { MediaHero } from "@/components/marketing";
import type { AboutHeroContent } from "../types/about-page";

/**
 * The About page hero — the shared full-bleed <MediaHero> at its full-height
 * setting, matching the homepage. All the structure lives in <MediaHero>;
 * this only maps the page's content onto it.
 */
export function AboutHero({ content }: { content: AboutHeroContent }) {
  return (
    <MediaHero
      size="full"
      eyebrow={content.eyebrow}
      title={content.titleLines}
      description={content.lede}
      image={content.image}
      video={content.video}
      mobileVideo={content.mobileVideo}
      primary={content.primary}
      secondary={content.secondary}
    />
  );
}
