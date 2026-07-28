import * as React from "react";
import { cn } from "@/lib/utils";

export function Heading({ className, ...props }: React.ComponentProps<"h1">) {
  return (
    <h1
      className={cn(
        "text-4xl leading-[1.02] font-light tracking-[-0.04em] text-balance sm:text-6xl lg:text-7xl",
        className,
      )}
      {...props}
    />
  );
}

export function SectionHeading({
  className,
  ...props
}: React.ComponentProps<"h2">) {
  return (
    <h2
      className={cn(
        "text-3xl font-light tracking-[-0.03em] text-balance sm:text-5xl",
        className,
      )}
      {...props}
    />
  );
}

export function CardHeading({
  className,
  ...props
}: React.ComponentProps<"h3">) {
  return (
    <h3
      className={cn("text-lg font-bold tracking-tight", className)}
      {...props}
    />
  );
}

export function Text({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      className={cn(
        "text-base leading-7 text-muted-foreground sm:text-lg",
        className,
      )}
      {...props}
    />
  );
}

export function Eyebrow({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      className={cn(
        "text-xs font-medium tracking-[0.2em] text-primary uppercase",
        className,
      )}
      {...props}
    />
  );
}
