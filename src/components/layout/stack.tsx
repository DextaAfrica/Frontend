import * as React from "react";
import { cn } from "@/lib/utils";

type Gap = "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
type Align = "start" | "center" | "end" | "stretch";
const gaps: Record<Gap, string> = {
  none: "gap-0",
  xs: "gap-1",
  sm: "gap-2",
  md: "gap-4",
  lg: "gap-6",
  xl: "gap-8",
  "2xl": "gap-12",
};
const aligns: Record<Align, string> = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
};
export interface StackProps extends React.ComponentProps<"div"> {
  gap?: Gap;
  align?: Align;
}
export function Stack({
  className,
  gap = "md",
  align = "stretch",
  ...props
}: StackProps) {
  return (
    <div
      data-layout="stack"
      className={cn("flex flex-col", gaps[gap], aligns[align], className)}
      {...props}
    />
  );
}
