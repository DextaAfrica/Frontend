import { Container } from "@/components/layout";
import { Reveal, ScrollRevealCopy } from "@/components/marketing";
import { renderWithAccents } from "@/components/ui";
import type { AboutStatementContent } from "../types/about-page";

/**
 * The "About Us" section. The body runs through the same word-by-word scroll
 * reveal the homepage intro uses (`ScrollRevealCopy`), then the closing line
 * lands on its own beneath it — larger, in the editorial serif, carrying the
 * italic accent on "getting started".
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
      <Container size="editorial" className="pb-about text-center">
        <Reveal>
          <p className="about-statement__kicker mx-auto max-w-2xl text-foreground">
            {renderWithAccents(content.kicker)}
          </p>
        </Reveal>
      </Container>
    </div>
  );
}
