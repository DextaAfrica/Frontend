import Image from "next/image";
import { Container } from "@/components/layout";
import { ButtonLink, EditorialHeading, Icon } from "@/components/ui";
import { ScrollFade } from "./reveal";

export interface CtaBandProps {
  title?: string;
  ctaLabel?: string;
  ctaHref?: string;
  image?: string;
}

/** The "Start Your Property Journey Today" band repeated across every page. */
export function CtaBand({
  title = "Start Your *Property* Journey Today",
  ctaLabel = "Let's Talk",
  ctaHref = "/contact",
  image = "/images/residence-rooftop.png",
}: CtaBandProps) {
  return (
    <section className="relative isolate overflow-hidden bg-brand-dark py-24 text-brand-light sm:py-32">
      <Image
        src={image}
        alt=""
        fill
        sizes="100vw"
        className="object-cover opacity-60"
      />
      <span
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/60 to-brand-dark/20"
      />
      <Container className="relative flex flex-col items-center gap-8 text-center">
        <ScrollFade className="flex flex-col items-center gap-8">
          <EditorialHeading>{title}</EditorialHeading>
          <ButtonLink href={ctaHref} size="lg" variant="onMedia">
            {ctaLabel}
            <Icon name="arrow-right" />
          </ButtonLink>
        </ScrollFade>
      </Container>
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-[-0.12em] text-center font-display text-[18vw] leading-none font-black tracking-tighter text-brand-light/10 select-none sm:text-[15vw]"
      >
        DEXTA
      </span>
    </section>
  );
}
