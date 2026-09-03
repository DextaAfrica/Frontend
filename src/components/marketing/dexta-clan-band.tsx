import { Container } from "@/components/layout";
import { ButtonLink, EditorialHeading, Icon } from "@/components/ui";
import { LiteYouTube, type LiteYouTubeProps } from "./lite-youtube";
import { Reveal, RevealGroup, RevealItem } from "./reveal";

export interface DextaClanBandProps {
  eyebrow: string;
  title: string;
  copy: string;
  benefits: readonly string[];
  cta: { label: string; href: string };
  video?: LiteYouTubeProps;
}

/**
 * The Dexta Clan community band — a learning community for people figuring out
 * African real estate. A fixed near-black band (it never inverts) carrying the
 * same pulsing "on air" signal dot as the expertise marquee, a headline, the
 * pitch, and the list of what membership actually gets you. Reused on both the
 * About page and the home page.
 *
 * With a `video`: the benefits fold into a compact list under the copy and the
 * video takes the second column. Without one (the About page): the benefits
 * keep the full-width bordered-row treatment in the second column.
 */
export function DextaClanBand({
  eyebrow,
  title,
  copy,
  benefits,
  cta,
  video,
}: DextaClanBandProps) {
  return (
    <section
      className="dexta-clan py-about"
      aria-labelledby="dexta-clan-heading"
    >
      <span aria-hidden className="dexta-clan__glow" />
      <Container className="relative grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-16">
        <Reveal className="flex flex-col items-start gap-6">
          <span className="inline-flex items-center gap-2.5 font-mono text-xs font-bold tracking-[0.24em] text-brand-light/70 uppercase">
            <span aria-hidden className="dexta-clan__dot" />
            {eyebrow}
          </span>
          <EditorialHeading id="dexta-clan-heading" className="max-w-xl">
            {title}
          </EditorialHeading>
          <p className="max-w-xl text-pretty text-brand-light/75">{copy}</p>

          {video && (
            <ul className="dexta-clan__benefits">
              {benefits.map((benefit) => (
                <li key={benefit}>
                  <Icon name="badge-check" size={18} />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          )}

          <ButtonLink
            href={cta.href}
            size="lg"
            variant="onMedia"
            className="mt-2"
          >
            {cta.label}
            <Icon name="arrow-right" />
          </ButtonLink>
        </Reveal>

        {video ? (
          <LiteYouTube {...video} />
        ) : (
          <RevealGroup>
            <ul className="flex flex-col">
              {benefits.map((benefit) => (
                <RevealItem
                  as="li"
                  key={benefit}
                  className="dexta-clan__benefit"
                >
                  <Icon name="badge-check" size={20} />
                  <span className="text-brand-light/85">{benefit}</span>
                </RevealItem>
              ))}
            </ul>
          </RevealGroup>
        )}
      </Container>
    </section>
  );
}
