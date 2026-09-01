import * as React from "react";
import { cn } from "@/lib/utils";

export interface ContainerProps extends React.ComponentProps<"div"> {
  size?: "narrow" | "editorial" | "default" | "wide" | "full";
}

const sizes = {
  narrow: "max-w-3xl",
  editorial: "max-w-editorial",
  default: "max-w-7xl",
  wide: "max-w-wide",
  full: "max-w-none",
} as const;

export function Container({
  className,
  size = "default",
  ...props
}: ContainerProps) {
  return (
    <div
      data-layout="container"
      className={cn(
        "mx-auto w-full px-5 sm:px-8 lg:px-10 xl:px-14",
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}
