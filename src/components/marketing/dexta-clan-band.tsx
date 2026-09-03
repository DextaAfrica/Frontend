import { Container } from "@/components/layout";
import { ButtonLink, EditorialHeading, Icon } from "@/components/ui";
import { cn } from "@/lib/utils";
import type { LiteYouTubeProps } from "./lite-youtube";
import { Reveal, RevealItem, ScrollFade, ScrollFadeGroup } from "./reveal";
import { YouTubeBackground } from "./youtube-background";

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
 * With a `video`: it becomes a full-bleed backdrop for the whole band (see
 * `YouTubeBackground`) — muted, looping, decorative — with a scrim carrying
 * the legibility work, and the copy sits centred over it rather than beside
 * it. `LiteYouTube` itself (click-to-play, privacy-first) is reserved for
 * spots where the video is the actual content, not ambience — the About page
 * variant, without a `video`, keeps the original two-column layout instead.
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
      className={cn("dexta-clan py-about", video && "dexta-clan--video")}
      aria-labelledby="dexta-clan-heading"
    >
      {video ? (
        <>
          <YouTubeBackground
            id={video.id}
            poster={video.poster}
            className="dexta-clan__video"
          />
          <span aria-hidden className="dexta-clan__scrim" />
        </>
      ) : (
        <span aria-hidden className="dexta-clan__glow" />
      )}

      <Container
        className={cn(
          "relative",
          video
            ? "max-w-2xl"
            : "grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-16",
        )}
      >
        <ScrollFade className="flex flex-col items-start gap-6">
          <span className="inline-flex items-center gap-2.5 font-mono text-xs font-bold tracking-[0.24em] text-brand-light/70 uppercase">
            <span aria-hidden className="dexta-clan__dot" />
            {eyebrow}
          </span>
          <EditorialHeading id="dexta-clan-heading" className="max-w-xl">
            {title}
          </EditorialHeading>
          <p className="max-w-xl text-pretty text-brand-light/75">{copy}</p>

          {video && (
            <ScrollFadeGroup as="ul" className="dexta-clan__benefits">
              {benefits.map((benefit) => (
                <RevealItem as="li" key={benefit}>
                  <Icon name="badge-check" size={18} />
                  <span>{benefit}</span>
                </RevealItem>
              ))}
            </ScrollFadeGroup>
          )}

          <Reveal delay={video ? 0.35 : 0}>
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
        </ScrollFade>

        {!video && (
          <ScrollFadeGroup>
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
          </ScrollFadeGroup>
        )}
      </Container>
    </section>
  );
}
