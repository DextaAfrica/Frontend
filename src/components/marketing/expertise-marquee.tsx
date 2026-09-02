import * as React from "react";
import { Icon, type IconName } from "@/components/ui";
import { Reveal } from "./reveal";

export interface ExpertiseMarqueeItem {
  label: string;
  icon: IconName;
}

export interface ExpertiseMarqueeProps {
  eyebrow: string;
  items: readonly ExpertiseMarqueeItem[];
}

/**
 * A dark, full-bleed ticker band — a broadcast lower-third, not a hero: a
 * pulsing "on air" dot over a signal label, then a continuous strip of
 * capabilities scrolling underneath. The scroll itself is pure CSS
 * (`@keyframes`, no scroll-listener); only the once-per-visit entrance
 * (the signal row, then the ticker a beat behind it) goes through
 * <Reveal>, the same scroll-triggered fade/rise every other section on
 * this page already uses — so arriving at this band feels like the
 * considered entrance every other section gets, not a static strip that
 * happens to already be scrolling when it comes into view.
 *
 * The strip is one real, accessible <ul> of `items` immediately followed by
 * an `aria-hidden` duplicate of the same list — the two placed edge to edge
 * and the whole track animated exactly -50% is what makes the loop seamless
 * (there's no visible seam because the duplicate is a pixel-perfect
 * continuation of the original). Under `prefers-reduced-motion`, the
 * duplicate is dropped entirely and the track becomes a static, wrapped row
 * of the real list — never two copies sitting stacked and motionless.
 *
 * The edges fade via `mask-image`, not `overflow: hidden` alone — items
 * dissolve into the band rather than getting a hard, guillotined edge.
 */
export function ExpertiseMarquee({ eyebrow, items }: ExpertiseMarqueeProps) {
  const headingId = React.useId();

  return (
    <section aria-labelledby={headingId} className="expertise-marquee">
      <h2 id={headingId} className="sr-only">
        {eyebrow}
      </h2>

      <Reveal as="div" className="expertise-marquee__signal">
        <span aria-hidden className="expertise-marquee__dot" />
        <span className="expertise-marquee__label">{eyebrow}</span>
      </Reveal>

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
