import { ScrollRevealCopy } from "@/components/marketing";
import type { HomeIntroContent } from "../types/home-page";

export function WhoWeAreSection({ content }: { content: HomeIntroContent }) {
  return (
    <ScrollRevealCopy
      heading={content.heading}
      paragraphs={content.paragraphs}
      className="bg-brand-dark text-brand-light"
    />
  );
}
