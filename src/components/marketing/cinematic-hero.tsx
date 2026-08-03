import Image from "next/image";
import { Container } from "@/components/layout";
import { ButtonLink, HeroHeading } from "@/components/ui";

export function CinematicHero() {
  return (
    <section className="dexta-hero relative isolate flex items-end overflow-hidden bg-black text-white">
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
        className="absolute inset-0 size-full object-cover"
      >
        <source src="/media/91744-636709154_medium.webm" type="video/webm" />
      </video>
      <span aria-hidden className="dexta-hero-overlay absolute inset-0" />
      <Container className="relative pb-[var(--space-hero-bottom)]">
        <div className="flex max-w-3xl flex-col items-start gap-8" data-reveal>
          <HeroHeading>
            Your partner in
            <br /> building wealth
          </HeroHeading>
          <ButtonLink
            href="/contact"
            size="lg"
            variant="onMedia"
            className="w-hero-cta shadow-none"
          >
            <Image
              src="/images/dexta-arrow.svg"
              alt=""
              aria-hidden
              width={20}
              height={20}
            />
            Contact Sales
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
