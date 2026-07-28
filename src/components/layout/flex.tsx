import * as React from "react";
import { cn } from "@/lib/utils";

type Direction = "row" | "column" | "responsive";
type Align = "start" | "center" | "end" | "stretch" | "baseline";
type Justify = "start" | "center" | "end" | "between" | "around";
type Gap = "none" | "xs" | "sm" | "md" | "lg" | "xl";
const directions: Record<Direction, string> = {
  row: "flex-row",
  column: "flex-col",
  responsive: "flex-col sm:flex-row",
};
const aligns: Record<Align, string> = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
  baseline: "items-baseline",
};
const justifies: Record<Justify, string> = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
  around: "justify-around",
};
const gaps: Record<Gap, string> = {
  none: "gap-0",
  xs: "gap-1",
  sm: "gap-2",
  md: "gap-4",
  lg: "gap-6",
  xl: "gap-8",
};
export interface FlexProps extends React.ComponentProps<"div"> {
  direction?: Direction;
  align?: Align;
  justify?: Justify;
  gap?: Gap;
  wrap?: boolean;
}
export function Flex({
  className,
  direction = "row",
  align = "stretch",
  justify = "start",
  gap = "md",
  wrap = false,
  ...props
}: FlexProps) {
  return (
    <div
      data-layout="flex"
      className={cn(
        "flex",
        directions[direction],
        aligns[align],
        justifies[justify],
        gaps[gap],
        wrap && "flex-wrap",
        className,
      )}
      {...props}
    />
  );
}
