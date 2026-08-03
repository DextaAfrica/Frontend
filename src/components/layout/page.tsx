import * as React from "react";
import { cn } from "@/lib/utils";
import { Container } from "./container";
import { Stack } from "./stack";

export function Page({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-layout="page" className={cn("min-w-0", className)} {...props} />
  );
}
export function PageContent({
  className,
  ...props
}: React.ComponentProps<typeof Container>) {
  return <Container className={cn("py-8 sm:py-10", className)} {...props} />;
}
export function PageHeader({
  className,
  ...props
}: React.ComponentProps<"header">) {
  return (
    <header
      className={cn(
        "border-b border-border bg-surface py-8 sm:py-10",
        className,
      )}
      {...props}
    />
  );
}
export function PageHeaderContent({
  className,
  ...props
}: React.ComponentProps<typeof Stack>) {
  return (
    <Stack
      gap="sm"
      className={cn(
        "mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10",
        className,
      )}
      {...props}
    />
  );
}
