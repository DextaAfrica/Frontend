import * as React from "react";
import { cn } from "@/lib/utils";

export function AppShell({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-layout="app-shell"
      className={cn("flex min-h-dvh flex-col", className)}
      {...props}
    />
  );
}

export function AppShellMain({
  className,
  ...props
}: React.ComponentProps<"main">) {
  return <main className={cn("min-w-0 flex-1", className)} {...props} />;
}
