import * as React from "react";
import { Container } from "@/components/layout";
import { Reveal } from "./reveal";

export interface PressMention {
  name: string;
}

const DEFAULT_PRESS_MENTIONS: readonly PressMention[] = [
  { name: "Medium" },
  { name: "Yahoo!" },
  { name: "The Guardian" },
  { name: "BusinessDay" },
  { name: "Punch" },
  { name: "Reuters" },
];

export interface PressMarqueeProps {
  eyebrow?: string;
  items?: readonly PressMention[];
}

/**
 * "As featured in" — the same continuous-scroll ticker mechanism as
 * `ExpertiseMarquee` (one real list immediately followed by an aria-hidden
 * duplicate, the pair translated exactly -50% so the loop has no seam;
 * pauses on hover; collapses to a static wrapped row under
 * `prefers-reduced-motion`), but a light, quiet band rather than a dark
 * inverse one — a credibility strip near the top of the page, not another
 * "signal" moment.
 *
 * These are text wordmarks, not the outlets' real marks — no licensed logo
 * assets exist in this project yet. `.press-marquee__item` still carries a
 * grayscale→colour hover treatment, so dropping in real logo images later
 * (swap the `<li>` content for an `<Image>`) gets the same hover reveal for
 * free.
 */
export function PressMarquee({
  eyebrow = "As featured in",
  items = DEFAULT_PRESS_MENTIONS,
}: PressMarqueeProps) {
  const headingId = React.useId();

  return (
    <section aria-labelledby={headingId} className="press-marquee">
      <Container>
        <Reveal as="div" className="press-marquee__signal">
          <span aria-hidden className="press-marquee__dot" />
          <span id={headingId} className="press-marquee__label">
            {eyebrow}
          </span>
        </Reveal>
      </Container>

      <Reveal as="div" delay={0.12} className="press-marquee__viewport">
        <ul className="press-marquee__track">
          {items.map((item) => (
            <PressItem key={item.name} item={item} />
          ))}
          {items.map((item) => (
            <PressItem key={`${item.name}-repeat`} item={item} duplicate />
          ))}
        </ul>
      </Reveal>
    </section>
  );
}

function PressItem({
  item,
  duplicate,
}: {
  item: PressMention;
  duplicate?: boolean;
}) {
  return (
    <li
      aria-hidden={duplicate || undefined}
      data-duplicate={duplicate || undefined}
      className="press-marquee__item"
    >
      {item.name}
    </li>
  );
}
