import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Accent — the italic Playfair Display treatment reserved for a handful of
 * words inside an otherwise sans headline (e.g. "Building the future of
 * *real estate*"). Never wraps a whole heading: it's a word-level accent,
 * matching the pattern used throughout the approved designs.
 *
 * Carries the theme's red (`--color-primary`) as a slow, continuous gradient
 * shimmer — quiet and always-on rather than a one-shot animation, same spirit
 * as the hero badge's light sweep (see `.hero-badge` in globals.css). Pure
 * CSS, so it costs nothing at rest and simply becomes a flat accent color
 * under `prefers-reduced-motion` (see `.accent-highlight` in globals.css).
 */
export function Accent({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "accent-highlight font-serif font-normal italic",
        className,
      )}
      {...props}
    />
  );
}

const ACCENT_PATTERN = /\*([^*]+)\*/g;

/**
 * Renders a string, converting `*word*` spans into <Accent>. Content authors
 * write plain copy with the accented phrase wrapped in asterisks; every
 * heading primitive below applies this automatically so the italic accent
 * is consistent everywhere without touching call sites individually.
 */
export function renderWithAccents(text: string): React.ReactNode {
  if (!text.includes("*")) return text;

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let key = 0;
  const pattern = new RegExp(ACCENT_PATTERN);
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text))) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    parts.push(<Accent key={key++}>{match[1]}</Accent>);
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));

  return parts;
}

/** Applies accent parsing only when children is a plain string. */
function withAccents(children: React.ReactNode): React.ReactNode {
  return typeof children === "string" ? renderWithAccents(children) : children;
}

export interface AccentWord {
  word: string;
  accented: boolean;
}

/**
 * Same `*word*` convention as {@link renderWithAccents}, but tokenized down
 * to individual words rather than rendered to JSX — for callers (like the
 * word-by-word scroll reveal) that need to wrap every word in their own
 * element and still know which ones fall inside an accent phrase.
 *
 * Strips the asterisks first, tracking which character ranges they wrapped,
 * then splits the *clean* text on whitespace — so a word touching an accent
 * boundary with no space (`*addresses*.`) still comes out as one token
 * ("addresses.") instead of splitting its trailing punctuation into a
 * floating word of its own.
 */
export function splitAccentWords(text: string): AccentWord[] {
  const accentRanges: Array<[number, number]> = [];
  const pattern = new RegExp(ACCENT_PATTERN);
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let clean = "";

  while ((match = pattern.exec(text))) {
    clean += text.slice(lastIndex, match.index);
    const start = clean.length;
    clean += match[1] ?? "";
    accentRanges.push([start, clean.length]);
    lastIndex = match.index + match[0].length;
  }
  clean += text.slice(lastIndex);

  const isAccented = (start: number, end: number) =>
    accentRanges.some(
      ([rangeStart, rangeEnd]) => start < rangeEnd && end > rangeStart,
    );

  const tokens: AccentWord[] = [];
  const wordPattern = /\S+/g;
  let wordMatch: RegExpExecArray | null;
  while ((wordMatch = wordPattern.exec(clean))) {
    const word = wordMatch[0];
    tokens.push({
      word,
      accented: isAccented(wordMatch.index, wordMatch.index + word.length),
    });
  }

  return tokens;
}

export function Heading({
  className,
  children,
  ...props
}: React.ComponentProps<"h1">) {
  return (
    <h1
      className={cn(
        "font-display text-editorial leading-editorial font-semibold tracking-editorial text-balance",
        className,
      )}
      {...props}
    >
      {withAccents(children)}
    </h1>
  );
}

// Fluid clamp()s, not a flat Tailwind breakpoint jump: a two-step class like
// "text-2xl sm:text-4xl" holds one fixed size below 640px and another fixed
// size at every viewport above it — a tablet and an ultra-wide monitor get
// the exact same pixel size. clamp() scales continuously across every
// screen size instead, which is what "responsive" actually means for type.
const sectionHeadingSizes = {
  default: "text-[clamp(1.125rem,1.8vw,1.5rem)]",
  compact: "text-[clamp(1rem,1.2vw,1.125rem)]",
} as const;

export function SectionHeading({
  className,
  size = "default",
  children,
  ...props
}: React.ComponentProps<"h2"> & { size?: keyof typeof sectionHeadingSizes }) {
  return (
    <h2
      className={cn(
        "font-display font-semibold tracking-section-heading text-balance",
        sectionHeadingSizes[size],
        className,
      )}
      {...props}
    >
      {withAccents(children)}
    </h2>
  );
}

const cardHeadingSizes = {
  sm: "text-[clamp(0.8125rem,0.9vw,0.9375rem)]",
  md: "text-[clamp(0.9375rem,1vw,1.0625rem)]",
  lg: "text-[clamp(1rem,1.2vw,1.1875rem)]",
} as const;

export function CardHeading({
  className,
  size = "sm",
  children,
  ...props
}: React.ComponentProps<"h3"> & { size?: keyof typeof cardHeadingSizes }) {
  return (
    <h3
      className={cn(
        "font-display font-medium tracking-tight",
        cardHeadingSizes[size],
        className,
      )}
      {...props}
    >
      {withAccents(children)}
    </h3>
  );
}

export function Text({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      className={cn(
        "font-sans text-body-small leading-5 text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

const eyebrowTags = { p: "p", figcaption: "figcaption", span: "span" } as const;

export function Eyebrow({
  className,
  as = "p",
  ...props
}: React.ComponentProps<"p"> & { as?: keyof typeof eyebrowTags }) {
  const Tag = eyebrowTags[as];
  return (
    <Tag
      className={cn(
        "font-sans text-xs font-semibold tracking-eyebrow text-primary",
        className,
      )}
      {...props}
    />
  );
}

/**
 * Section headlines, site-wide. Sans (the same grotesque as everything
 * else) rather than a serif display face — a serif at heading size reads
 * noticeably heavier than a sans headline of the same pixel size, which was
 * a real contributor to the site feeling "bulky." Playfair now survives only
 * as the quiet, restrained `*accent*` italic word inside a headline (see
 * `Accent`), never as the voice of a whole headline.
 */
export function EditorialHeading({
  className,
  children,
  ...props
}: React.ComponentProps<"h2">) {
  return (
    <h2
      className={cn(
        "font-display text-editorial leading-[1.2] font-semibold tracking-tight text-balance",
        className,
      )}
      {...props}
    >
      {withAccents(children)}
    </h2>
  );
}

export function EditorialEyebrow({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      className={cn(
        "font-sans text-sm font-semibold tracking-editorial-label",
        className,
      )}
      {...props}
    />
  );
}

export function HeroHeading({
  className,
  children,
  ...props
}: React.ComponentProps<"h1">) {
  return (
    <h1
      className={cn(
        "font-display text-hero leading-[1.05] font-semibold tracking-hero",
        className,
      )}
      {...props}
    >
      {withAccents(children)}
    </h1>
  );
}

export function MetricValue({
  className,
  children,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      className={cn(
        "font-display text-metric leading-none font-semibold",
        className,
      )}
      {...props}
    >
      {children}
    </p>
  );
}
