import * as React from "react";
import { cn } from "@/lib/utils";

type Columns = "one" | "two" | "three" | "four" | "auto";
type Gap = "sm" | "md" | "lg" | "xl";
const columnsMap: Record<Columns, string> = {
  one: "grid-cols-1",
  two: "grid-cols-1 md:grid-cols-2",
  three: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
  four: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  auto: "grid-cols-[repeat(auto-fit,minmax(min(100%,18rem),1fr))]",
};
const gaps: Record<Gap, string> = {
  sm: "gap-3",
  md: "gap-5",
  lg: "gap-8",
  xl: "gap-12",
};
export interface GridProps extends React.ComponentProps<"div"> {
  columns?: Columns;
  gap?: Gap;
}
export function Grid({
  className,
  columns = "auto",
  gap = "md",
  ...props
}: GridProps) {
  return (
    <div
      data-layout="grid"
      className={cn("grid", columnsMap[columns], gaps[gap], className)}
      {...props}
    />
  );
}
