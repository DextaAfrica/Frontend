import * as React from "react";
import { cn } from "@/lib/utils";

export function Heading({ className, ...props }: React.ComponentProps<"h1">) {
  return (
    <h1
      className={cn(
        "text-3xl leading-heading font-light tracking-heading text-balance sm:text-5xl lg:text-6xl",
        className,
      )}
      {...props}
    />
  );
}

const sectionHeadingSizes = {
  default: "text-2xl sm:text-4xl",
  compact: "text-xl sm:text-2xl",
} as const;

export function SectionHeading({
  className,
  size = "default",
  ...props
}: React.ComponentProps<"h2"> & { size?: keyof typeof sectionHeadingSizes }) {
  return (
    <h2
      className={cn(
        "font-light tracking-section-heading text-balance",
        sectionHeadingSizes[size],
        className,
      )}
      {...props}
    />
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
  ...props
}: React.ComponentProps<"h3"> & { size?: keyof typeof cardHeadingSizes }) {
  return (
    <h3
      className={cn(
        "font-medium tracking-tight",
        cardHeadingSizes[size],
        className,
      )}
      {...props}
    />
  );
}

export function Text({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      className={cn(
        "text-[0.9375rem] leading-6 text-muted-foreground sm:text-base",
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
        "text-xs font-medium tracking-[0.2em] text-primary uppercase",
        className,
      )}
      {...props}
    />
  );
}

export function EditorialHeading({
  className,
  ...props
}: React.ComponentProps<"h2">) {
  return (
    <h2
      className={cn(
        "font-serif text-editorial leading-editorial font-normal tracking-editorial text-balance",
        className,
      )}
      {...props}
    />
  );
}

export function EditorialEyebrow({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      className={cn(
        "text-sm font-normal tracking-editorial-label uppercase",
        className,
      )}
      {...props}
    />
  );
}

export function HeroHeading({
  className,
  ...props
}: React.ComponentProps<"h1">) {
  return (
    <h1
      className={cn(
        "font-serif text-hero leading-[1.05] font-normal tracking-hero uppercase",
        className,
      )}
      {...props}
    />
  );
}

export function MetricValue({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      className={cn(
        "font-serif text-metric leading-none font-normal uppercase",
        className,
      )}
      {...props}
    />
  );
}
