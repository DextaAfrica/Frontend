import * as React from "react";
import { Container } from "./container";
import { cn } from "@/lib/utils";

type Spacing = "none" | "sm" | "md" | "lg" | "editorial";
type Tone = "default" | "surface" | "brand" | "inverse" | "brandDark";
const spacings: Record<Spacing, string> = {
  none: "py-0",
  sm: "py-10 sm:py-12",
  md: "py-16 sm:py-20",
  lg: "py-16 sm:py-20 lg:py-24",
  editorial: "py-section-editorial",
};
const tones: Record<Tone, string> = {
  default: "section-default",
  surface: "section-surface",
  brand: "bg-primary text-primary-foreground",
  inverse: "bg-foreground text-background",
  brandDark: "bg-brand-dark text-brand-light",
};
// "default" and "surface" are quiet, low-contrast tones — one can follow
// another with almost no visible seam (the whole point this fixes), so they
// get a boundary by default. "brand" / "inverse" / "brandDark" are already
// strong, self-evident colour blocks against anything beside them.
const dividerDefaults: Record<Tone, boolean> = {
  default: true,
  surface: true,
  brand: false,
  inverse: false,
  brandDark: false,
};

export interface SectionProps extends React.ComponentProps<"section"> {
  spacing?: Spacing;
  tone?: Tone;
  contained?: boolean;
  /** A hairline top border marking where this section begins. Defaults to
   * on for the two quiet tones, off for the three strong-colour ones —
   * pass explicitly to override either way. */
  divider?: boolean;
}
export function Section({
  className,
  spacing = "md",
  tone = "default",
  contained = true,
  divider,
  children,
  ...props
}: SectionProps) {
  const showDivider = divider ?? dividerDefaults[tone];
  return (
    <section
      className={cn(
        "relative",
        spacings[spacing],
        tones[tone],
        showDivider && "section-divider",
        className,
      )}
      {...props}
    >
      {contained ? <Container>{children}</Container> : children}
    </section>
  );
}
