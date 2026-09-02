import * as React from "react";
import { Container } from "@/components/layout";
import {
  EditorialEyebrow,
  EditorialHeading,
  Icon,
  type IconName,
} from "@/components/ui";
import { Reveal } from "./reveal";

export interface ExpertiseMarqueeItem {
  label: string;
  icon: IconName;
}

export interface ExpertiseMarqueeHeading {
  eyebrow: string;
  title: string;
  description: string;
}

export interface ExpertiseMarqueeProps {
  heading: ExpertiseMarqueeHeading;
  items: readonly ExpertiseMarqueeItem[];
}

/**
 * A full-bleed inverse band that breaks the rhythm between the Services scroll
 * section and the Portfolio index. It opens like every other section on the
 * page — an editorial header (eyebrow → hairline rule → headline → one
 * supporting line, via the shared `EditorialEyebrow` / `EditorialHeading`
 * primitives) — then a continuous strip of capabilities scrolls underneath it.
 * The pulsing "on air" dot beside the eyebrow is this band's retained
 * signature.
 *
 * The header sits inside `Container` so it aligns to the page grid; the strip
 * stays full-bleed. Only the header goes through <Reveal> on a beat, then the
 * strip a beat behind it — the same scroll-triggered entrance every other
 * section uses, so arriving here feels considered rather than like a strip
 * that happens to already be scrolling.
 *
 * The strip is one real, accessible <ul> of `items` immediately followed by an
 * `aria-hidden` duplicate of the same list — the two placed edge to edge and
 * the whole track animated exactly -50% is what makes the loop seamless (the
 * duplicate is a pixel-perfect continuation of the original). Under
 * `prefers-reduced-motion` the duplicate is dropped and the track becomes a
 * static, wrapped, centred row of the real list. The edges dissolve via
 * `mask-image`, not a hard `overflow` clip.
 */
export function ExpertiseMarquee({ heading, items }: ExpertiseMarqueeProps) {
  const headingId = React.useId();

  return (
    <section aria-labelledby={headingId} className="expertise-marquee">
      <Container>
        <Reveal className="mx-auto flex max-w-editorial-heading flex-col items-center text-center">
          <EditorialEyebrow className="expertise-marquee__eyebrow text-primary uppercase">
            <span aria-hidden className="expertise-marquee__dot" />
            {heading.eyebrow}
          </EditorialEyebrow>
          <span
            aria-hidden
            className="mt-5 block h-px w-divider bg-background/25"
          />
          <EditorialHeading id={headingId} className="mt-5">
            {heading.title}
          </EditorialHeading>
          <p className="mt-4 text-[0.95rem] leading-relaxed text-background/70">
            {heading.description}
          </p>
        </Reveal>
      </Container>

      <Reveal as="div" delay={0.15} className="expertise-marquee__viewport">
        <ul className="expertise-marquee__track">
          {items.map((item) => (
            <MarqueeItem key={item.label} item={item} />
          ))}
          {items.map((item) => (
            <MarqueeItem key={`${item.label}-repeat`} item={item} duplicate />
          ))}
        </ul>
      </Reveal>
    </section>
  );
}

function MarqueeItem({
  item,
  duplicate,
}: {
  item: ExpertiseMarqueeItem;
  duplicate?: boolean;
}) {
  return (
    <li
      aria-hidden={duplicate || undefined}
      data-duplicate={duplicate || undefined}
      className="expertise-marquee__item"
    >
      <span className="expertise-marquee__icon">
        <Icon name={item.icon} size={18} />
      </span>
      <span>{item.label}</span>
    </li>
  );
}
