import * as React from "react";
import { cn } from "@/lib/utils";

export function IconBox({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "grid size-11 shrink-0 place-items-center rounded-[0.3rem] bg-primary-subtle text-primary [&_svg]:size-5",
        className,
      )}
      {...props}
    />
  );
}
