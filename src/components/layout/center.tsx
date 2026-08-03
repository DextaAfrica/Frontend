import * as React from "react";
import { cn } from "@/lib/utils";

export function Center({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-layout="center"
      className={cn("grid place-items-center", className)}
      {...props}
    />
  );
}
