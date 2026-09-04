import { ScrollRevealCopy } from "@/components/marketing";
import type { AboutStatementContent } from "../types/about-page";

/**
 * The "About Us" section. The body runs through the same word-by-word scroll
 * reveal the homepage intro uses (`ScrollRevealCopy`) — no closing kicker
 * line here; "We're not done yet. We're just getting started." is reserved
 * for the CEO letter's own closing line further down the page, not repeated
 * this early.
 */
export function AboutStatement({
  content,
}: {
  content: AboutStatementContent;
}) {
  return (
    <div className="about-statement">
      <ScrollRevealCopy
        heading={content.heading}
        paragraphs={content.paragraphs}
        className="bg-background text-foreground"
      />
    </div>
  );
}
