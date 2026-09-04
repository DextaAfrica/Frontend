import { MediaHero } from "@/components/marketing";
import type { AboutHeroContent } from "../types/about-page";

/**
 * The About page hero — the shared <MediaHero>, at the same "compact" height
 * every other interior page uses (only the homepage's own <LandingHero>
 * runs full-viewport). All the structure lives in <MediaHero>; this only
 * maps the page's content onto it.
 */
export function AboutHero({ content }: { content: AboutHeroContent }) {
  return (
    <MediaHero
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
