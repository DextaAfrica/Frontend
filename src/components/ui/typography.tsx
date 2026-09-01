import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Accent — the italic Playfair Display treatment reserved for a handful of
 * words inside an otherwise sans headline (e.g. "Building the future of
 * *real estate*"). Never wraps a whole heading: it's a word-level accent,
 * matching the pattern used throughout the approved designs.
 */
export function Accent({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      className={cn("font-serif font-normal italic", className)}
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

const sectionHeadingSizes = {
  default: "text-2xl sm:text-4xl",
  compact: "text-xl sm:text-2xl",
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
  sm: "text-base",
  md: "text-lg",
  lg: "text-xl",
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
        "font-sans text-body-small leading-6 text-muted-foreground sm:text-base",
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
        "font-sans text-xs font-medium tracking-eyebrow text-primary uppercase",
        className,
      )}
      {...props}
    />
  );
}

export function EditorialHeading({
  className,
  children,
  ...props
}: React.ComponentProps<"h2">) {
  return (
    <h2
      className={cn(
        "font-display text-editorial leading-editorial font-semibold tracking-editorial text-balance",
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
        "font-sans text-sm font-normal tracking-editorial-label uppercase",
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
