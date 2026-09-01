import * as React from "react";
import { Icon, type IconName } from "@/components/ui";

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
 * capabilities scrolling underneath. Pure CSS (`@keyframes`, no JS, no
 * scroll-listener), so it costs nothing and never needs hydration.
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

      <div className="expertise-marquee__signal">
        <span aria-hidden className="expertise-marquee__dot" />
        <span className="expertise-marquee__label">{eyebrow}</span>
      </div>

      <div className="expertise-marquee__viewport">
        <ul className="expertise-marquee__track">
          {items.map((item) => (
            <MarqueeItem key={item.label} item={item} />
          ))}
          {items.map((item) => (
            <MarqueeItem key={`${item.label}-repeat`} item={item} duplicate />
          ))}
        </ul>
      </div>
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
