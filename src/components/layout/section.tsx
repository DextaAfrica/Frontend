import * as React from "react";
import { Container } from "./container";
import { cn } from "@/lib/utils";

type Spacing = "none" | "sm" | "md" | "lg" | "editorial";
type Tone = "default" | "surface" | "brand" | "inverse" | "brandDark";
const spacings: Record<Spacing, string> = {
  none: "py-0",
  sm: "py-10 sm:py-12",
  md: "py-16 sm:py-20",
  lg: "py-20 sm:py-28 lg:py-32",
  editorial: "py-section-editorial",
};
const tones: Record<Tone, string> = {
  default: "bg-background",
  surface: "bg-surface",
  brand: "bg-primary text-primary-foreground",
  inverse: "bg-foreground text-background",
  brandDark: "bg-brand-dark text-brand-light",
};
export interface SectionProps extends React.ComponentProps<"section"> {
  spacing?: Spacing;
  tone?: Tone;
  contained?: boolean;
}
export function Section({
  className,
  spacing = "md",
  tone = "default",
  contained = true,
  children,
  ...props
}: SectionProps) {
  return (
    <section
      className={cn("relative", spacings[spacing], tones[tone], className)}
      {...props}
    >
      {contained ? <Container>{children}</Container> : children}
    </section>
  );
}
