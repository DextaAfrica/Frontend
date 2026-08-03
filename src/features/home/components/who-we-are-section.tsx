import { ScrollRevealCopy } from "@/components/marketing";
import { homeContent } from "../data/home-content";

export function WhoWeAreSection() {
  const { heading, initialWordCount, paragraphs } = homeContent.whoWeAre;

  return (
    <ScrollRevealCopy
      heading={heading}
      initialWordCount={initialWordCount}
      paragraphs={paragraphs}
      className="bg-brand-dark text-brand-light"
    />
  );
}
