import * as React from "react";
import { cn } from "@/lib/utils";

export function Page({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-layout="page" className={cn("min-w-0", className)} {...props} />
  );
}
