import * as React from "react";
import { cn } from "@/lib/utils";

/** Neutral layout boundary. Prefer a semantic component when one exists. */
export function Box({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-layout="box" className={cn(className)} {...props} />;
}
