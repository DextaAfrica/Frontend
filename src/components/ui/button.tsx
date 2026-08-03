import Link from "next/link";
import type { Route } from "next";
import * as React from "react";
import { cn } from "@/lib/utils";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "neutral"
  | "onMedia"
  | "ghost"
  | "outline"
  | "destructive"
  | "link";
export type ButtonSize = "sm" | "md" | "lg" | "icon";

const base =
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-[var(--control-radius)] border border-transparent text-[0.8125rem] font-normal tracking-[0.04em] transition-[color,background-color,border-color,box-shadow,transform] duration-200 outline-none select-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-45 active:translate-y-px aria-busy:cursor-wait [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0";
const variants: Record<ButtonVariant, string> = {
  primary:
    "border-primary bg-primary text-primary-foreground shadow-sm hover:border-primary-hover hover:bg-primary-hover",
  secondary:
    "border border-border bg-surface text-foreground shadow-xs hover:bg-muted",
  neutral: "bg-foreground text-background hover:opacity-85",
  onMedia:
    "border-brand-light bg-brand-light text-brand-dark hover:border-primary hover:bg-primary hover:text-primary-foreground",
  ghost: "text-foreground hover:bg-muted",
  outline:
    "border border-primary/35 bg-transparent text-primary hover:bg-primary-subtle",
  destructive: "bg-destructive text-white shadow-sm hover:opacity-90",
  link: "h-auto rounded-none p-0 text-primary underline-offset-4 hover:underline",
};
const sizes: Record<ButtonSize, string> = {
  sm: "h-[var(--control-height-sm)] px-[var(--control-padding-sm)] text-xs",
  md: "h-[var(--control-height-md)] px-[var(--control-padding-md)]",
  lg: "h-[var(--control-height-lg)] px-[var(--control-padding-lg)] text-sm",
  icon: "size-[var(--control-height-md)] p-0",
};

export function buttonClassName({
  variant = "primary",
  size = "md",
  className,
}: { variant?: ButtonVariant; size?: ButtonSize; className?: string } = {}) {
  return cn(base, variants[variant], sizes[size], className);
}

export interface ButtonProps extends React.ComponentProps<"button"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}
export function Button({
  className,
  variant,
  size,
  loading = false,
  disabled,
  children,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      data-ui="button"
      aria-busy={loading || undefined}
      disabled={disabled || loading}
      className={buttonClassName({ variant, size, className })}
      {...props}
    >
      {loading && (
        <span
          aria-hidden
          className="size-3.5 animate-spin rounded-full border border-current border-r-transparent"
        />
      )}
      {children}
    </button>
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
