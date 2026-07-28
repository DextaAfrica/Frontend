import Link from "next/link";
import type { Route } from "next";
import * as React from "react";
import { cn } from "@/lib/utils";

export type ButtonVariant =
  "primary" | "secondary" | "ghost" | "outline" | "destructive" | "link";
export type ButtonSize = "sm" | "md" | "lg" | "icon";

const base =
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-lg text-sm font-semibold transition-[color,background-color,border-color,box-shadow,transform] outline-none select-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 active:translate-y-px [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0";
const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-primary-foreground shadow-sm hover:bg-primary-hover",
  secondary:
    "border border-border bg-surface text-foreground shadow-xs hover:bg-muted",
  ghost: "text-foreground hover:bg-muted",
  outline:
    "border border-primary/35 bg-transparent text-primary hover:bg-primary-subtle",
  destructive: "bg-destructive text-white shadow-sm hover:opacity-90",
  link: "h-auto rounded-none p-0 text-primary underline-offset-4 hover:underline",
};
const sizes: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-4 py-2",
  lg: "h-12 rounded-xl px-6 text-base",
  icon: "size-10",
};

export function buttonClassName({
  variant = "primary",
  size = "md",
  className,
}: { variant?: ButtonVariant; size?: ButtonSize; className?: string } = {}) {
  return cn(base, variants[variant], sizes[size], className);
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}
export function Button({
  className,
  variant,
  size,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      data-ui="button"
      className={buttonClassName({ variant, size, className })}
      {...props}
    />
  );
}

export interface ButtonLinkProps extends Omit<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  "href"
> {
  href: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
}
export function ButtonLink({
  href,
  className,
  variant,
  size,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      href={href as Route}
      data-ui="button-link"
      className={buttonClassName({ variant, size, className })}
      {...props}
    />
  );
}
