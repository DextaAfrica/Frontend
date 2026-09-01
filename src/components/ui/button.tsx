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

/**
 * Every interactive state (hover, active, focus) is intentionally designed
 * per theme rather than just inheriting inverted tokens — see the
 * `--control-shadow-*` and `--control-border-strong` custom properties in
 * globals.css, which resolve to a soft neutral lift in light mode and a
 * genuine brand-tinted glow in dark mode. `group/btn` lets the trailing
 * icon nudge on hover across every variant automatically.
 */
const base =
  "group/btn relative inline-flex shrink-0 items-center justify-center gap-2 rounded-[var(--control-radius)] border text-control font-medium tracking-control transition-[color,background-color,border-color,box-shadow,transform] duration-200 ease-premium outline-none select-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:translate-y-0 disabled:scale-100 disabled:border-control-disabled disabled:bg-control-disabled disabled:text-control-disabled-foreground disabled:shadow-none aria-busy:cursor-wait active:scale-[0.96] active:duration-100 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:transition-transform [&_svg]:duration-200 [&_svg]:ease-premium group-hover/btn:[&_svg]:translate-x-1";

const variants: Record<ButtonVariant, string> = {
  // Solid brand red. Light mode lifts with a soft neutral shadow; dark mode
  // lifts into a genuine red glow — the two modes are meant to look
  // different, not just re-colored.
  primary:
    "border-primary bg-primary text-primary-foreground shadow-[var(--control-shadow)] hover:-translate-y-1 hover:scale-[1.02] hover:border-primary-hover hover:bg-primary-hover hover:shadow-[var(--control-shadow-glow)] active:translate-y-0 active:scale-[0.96] active:shadow-[var(--control-shadow)]",
  // A confident outlined pill. Light mode: crisp near-black border on
  // paper-white. Dark mode: the same border logic plus a faint frosted
  // fill (--control-glass) that light mode doesn't have — its own
  // deliberate dark-mode character, not an inverted clone.
  secondary:
    "border-[var(--control-border-strong)] bg-[var(--control-glass)] text-foreground shadow-[var(--control-shadow)] backdrop-blur-sm hover:-translate-y-1 hover:scale-[1.02] hover:border-[var(--control-border-strong-hover)] hover:bg-control-hover hover:shadow-[var(--control-shadow-hover)] active:translate-y-0 active:bg-control-pressed",
  // Fully inverted fill (foreground/background swap) — solid near-black on
  // paper-white in light mode, solid near-white on near-black in dark
  // mode. The starkest, most obviously theme-aware variant.
  neutral:
    "border-foreground bg-foreground text-background shadow-[var(--control-shadow)] hover:-translate-y-1 hover:scale-[1.02] hover:bg-foreground/85 hover:shadow-[var(--control-shadow-hover)] active:translate-y-0",
  // For placement directly over photography/video — always a light pill
  // regardless of site theme, turning brand-red on hover.
  onMedia:
    "border-brand-light bg-brand-light text-brand-dark shadow-[var(--control-shadow)] hover:-translate-y-1 hover:scale-[1.02] hover:border-primary hover:bg-primary hover:text-primary-foreground hover:shadow-[var(--control-shadow-glow)] active:translate-y-0",
  ghost:
    "border-transparent text-foreground shadow-none hover:bg-control-hover active:bg-control-pressed",
  outline:
    "border-primary/35 bg-transparent text-primary hover:-translate-y-1 hover:scale-[1.02] hover:border-primary hover:bg-primary-subtle active:translate-y-0",
  destructive:
    "border-destructive bg-destructive text-destructive-foreground shadow-[var(--control-shadow)] hover:-translate-y-1 hover:scale-[1.02] hover:brightness-90 hover:shadow-[var(--control-shadow-hover)] active:translate-y-0",
  link: "h-auto rounded-none border-transparent p-0 text-primary underline-offset-4 hover:underline active:scale-100",
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
