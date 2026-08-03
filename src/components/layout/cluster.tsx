import * as React from "react";
import { cn } from "@/lib/utils";

/** Wrapping horizontal group for actions, tags, and controls. */
export function Cluster({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-layout="cluster"
      className={cn("flex flex-wrap items-center gap-3", className)}
      {...props}
    />
  );
}
