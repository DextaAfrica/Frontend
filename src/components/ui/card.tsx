import * as React from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: React.ComponentProps<"article">) {
  return (
    <article
      className={cn(
        "rounded-panel border border-border bg-surface-elevated shadow-[var(--control-shadow)] transition-[color,background-color,transform,box-shadow,border-color] duration-500 ease-premium hover:-translate-y-1 hover:border-primary/35 hover:shadow-[var(--card-shadow)]",
        className,
      )}
      {...props}
    />
  );
}
export function CardContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return <div className={cn("p-6 pt-3", className)} {...props} />;
}
