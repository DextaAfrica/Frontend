import Image from "next/image";
import { Container } from "@/components/layout";
import { RevealGroup } from "@/components/marketing";
import { EditorialEyebrow, renderWithAccents } from "@/components/ui";
import { isRemoteAsset } from "@/lib/media";
import type { CeoLetterContent } from "../types/about-page";

/**
 * The CEO's letter — the page's centrepiece. A fixed-width portrait column
 * (sticky beside the letter on desktop, so it never drifts out of
 * alignment) and the letter itself: label, paragraphs, then the closing
 * line as an oversized serif pull-line, then the signature + attribution.
 *
 * Entrance is the site-wide {@link RevealGroup} scroll-reveal — the portrait
 * and each block of the letter blur-rise in as the section enters the
 * viewport and ease back to a dim resting state when it leaves, from either
 * scroll direction, exactly like every other section on the page. Inert
 * under `prefers-reduced-motion`.
 */
export function CeoLetter({ content }: { content: CeoLetterContent }) {
  return (
    <section className="ceo-letter py-about" aria-labelledby="ceo-heading">
      {content.background && (
        <Image
          src={content.background}
          alt=""
          fill
          sizes="100vw"
          className="ceo-letter__texture"
          unoptimized={isRemoteAsset(content.background)}
        />
      )}

      <Container className="relative">
        <RevealGroup as="div" className="ceo-letter__grid">
          <figure data-reveal-item className="ceo-letter__portrait">
            {content.portrait ? (
              <Image
                src={content.portrait}
                alt={`Portrait of ${content.name}`}
                fill
                sizes="(min-width: 64rem) 22rem, (min-width: 40rem) 55vw, 90vw"
                unoptimized={isRemoteAsset(content.portrait)}
              />
            ) : (
              <span className="ceo-letter__portrait-fallback">
                {content.name}
              </span>
            )}
          </figure>

          <div className="ceo-letter__body">
            <EditorialEyebrow
              data-reveal-item
              id="ceo-heading"
              className="text-primary"
            >
              {content.eyebrow}
            </EditorialEyebrow>

            <div data-reveal-item className="ceo-letter__prose">
              {content.paragraphs.map((paragraph, index) => (
                <p key={index} className="ceo-letter__para">
                  {renderWithAccents(paragraph)}
                </p>
              ))}
            </div>

            <p data-reveal-item className="ceo-letter__kicker">
              {renderWithAccents(content.kicker)}
            </p>

            <div data-reveal-item className="ceo-letter__sign">
              <Image
                src={content.signature}
                alt=""
                width={1124}
                height={1399}
                className="ceo-letter__signature"
                unoptimized={isRemoteAsset(content.signature)}
              />
              <div>
                <p className="ceo-letter__sign-name">{content.name}</p>
                <p className="ceo-letter__sign-title">{content.title}</p>
              </div>
            </div>
          </div>
        </RevealGroup>
      </Container>
    </section>
  );
}
