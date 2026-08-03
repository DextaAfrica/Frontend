import * as React from "react";
import { cn } from "@/lib/utils";

type BadgeVariant = "brand" | "neutral" | "outline" | "success" | "warning";
const variants: Record<BadgeVariant, string> = {
  brand: "bg-primary-subtle text-primary",
  neutral: "bg-muted text-muted-foreground",
  outline: "border border-border text-foreground",
  success: "bg-success-subtle text-success",
  warning: "bg-warning-subtle text-warning",
};
export interface BadgeProps extends React.ComponentProps<"span"> {
  variant?: BadgeVariant;
}
export function Badge({ className, variant = "brand", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center rounded-full px-2.5 py-1 text-xs font-semibold",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
