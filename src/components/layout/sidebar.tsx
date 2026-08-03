import * as React from "react";
import { cn } from "@/lib/utils";

export function SidebarLayout({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-layout="sidebar"
      className={cn(
        "grid min-h-dvh grid-cols-1 lg:grid-cols-[17rem_minmax(0,1fr)]",
        className,
      )}
      {...props}
    />
  );
}
export function Sidebar({
  className,
  ...props
}: React.ComponentProps<"aside">) {
  return (
    <aside
      className={cn("border-r border-border bg-surface", className)}
      {...props}
    />
  );
}
export function SidebarContent({
  className,
  ...props
}: React.ComponentProps<"main">) {
  return <main className={cn("min-w-0", className)} {...props} />;
}
