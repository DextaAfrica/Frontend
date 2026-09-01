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
 * Motion is uniform across every variant and lives here, not in globals.css:
 *
 * - hover      → a calm 2px rise + a softer shadow (`--control-shadow-hover`,
 *                or `--control-shadow-glow` for the brand fills).
 * - press      → the whole control compresses to 0.97 on a fast curve.
 * - the trailing icon rests tucked and dimmed *behind* the label, slides
 *   forward and brightens on hover, and gathers back to centre on press.
 *
 * All of it animates the `translate` / `scale` / `opacity` properties (never
 * `transform`), so nothing fights the layout, and it is disabled wholesale
 * under `prefers-reduced-motion` (see globals.css).
 */
const base = cn(
  "group/btn relative isolate inline-flex shrink-0 items-center justify-center gap-2",
  "rounded-[var(--control-radius)] border border-transparent",
  "text-control font-medium tracking-control whitespace-nowrap",
  "transition-[color,background-color,border-color,box-shadow,translate,scale] duration-[240ms] ease-premium",
  "outline-none select-none",
  "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  "active:scale-[0.97] active:duration-[110ms]",
  "disabled:pointer-events-none disabled:translate-none disabled:scale-100 disabled:border-transparent disabled:bg-control-disabled disabled:text-control-disabled-foreground disabled:shadow-none",
  "aria-busy:cursor-wait",
  // Icons: sized, non-interactive, and animated on the compositor.
  "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  "[&_svg]:transition-[translate,opacity,scale] [&_svg]:duration-[240ms] [&_svg]:ease-premium",
  // A trailing icon rests behind the label, then leads on interaction.
  "[&_svg:last-child]:-translate-x-0.5 [&_svg:last-child]:opacity-70",
  "group-hover/btn:[&_svg:last-child]:translate-x-[3px] group-hover/btn:[&_svg:last-child]:opacity-100",
  "group-active/btn:[&_svg:last-child]:translate-x-0",
);

const variants: Record<ButtonVariant, string> = {
  // Solid brand red. Rest sits on a hairline shadow; hover rises into a calm
  // red glow; press settles back flat.
  primary:
    "bg-primary text-primary-foreground shadow-[var(--control-shadow)] hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-[var(--control-shadow-glow)] active:translate-y-0 active:shadow-[var(--control-shadow)]",
  // Outlined pill. One clean border that firms up on hover over a muted wash —
  // no translucent double-lines, no backdrop blur.
  secondary:
    "border-border bg-transparent text-foreground hover:-translate-y-0.5 hover:border-foreground/35 hover:bg-muted hover:shadow-[var(--control-shadow-hover)] active:translate-y-0 active:bg-control-pressed",
  // Inverted fill — near-black on paper / near-white on ink.
  neutral:
    "bg-foreground text-background shadow-[var(--control-shadow)] hover:-translate-y-0.5 hover:bg-foreground/90 hover:shadow-[var(--control-shadow-hover)] active:translate-y-0 active:shadow-[var(--control-shadow)]",
  // Sits over photography/video — a light pill that turns brand-red on hover.
  onMedia:
    "bg-brand-light text-brand-dark shadow-[var(--control-shadow)] hover:-translate-y-0.5 hover:bg-primary hover:text-primary-foreground hover:shadow-[var(--control-shadow-glow)] active:translate-y-0 active:shadow-[var(--control-shadow)]",
  ghost:
    "text-foreground hover:bg-control-hover active:bg-control-pressed active:scale-[0.98]",
  outline:
    "border-primary/40 text-primary hover:-translate-y-0.5 hover:border-primary hover:bg-primary/8 active:translate-y-0",
  destructive:
    "bg-destructive text-destructive-foreground shadow-[var(--control-shadow)] hover:-translate-y-0.5 hover:brightness-95 hover:shadow-[var(--control-shadow-hover)] active:translate-y-0 active:shadow-[var(--control-shadow)]",
  link: "h-auto rounded-none p-0 text-primary underline-offset-4 hover:text-primary-hover hover:underline active:scale-100 [&_svg:last-child]:opacity-100 [&_svg:last-child]:translate-x-0",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-[var(--control-height-sm)] px-[var(--control-padding-sm)] text-xs",
  md: "h-[var(--control-height-md)] px-[var(--control-padding-md)]",
  lg: "h-[var(--control-height-lg)] px-[var(--control-padding-lg)] text-sm",
  // A single centred glyph — no tuck, a gentle grow on hover instead.
  icon: "size-[var(--control-height-md)] p-0 [&_svg:last-child]:translate-x-0 [&_svg:last-child]:opacity-100 group-hover/btn:[&_svg:last-child]:translate-x-0 group-hover/btn:[&_svg:last-child]:scale-110",
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
          className="size-3.5 animate-spin rounded-full border-2 border-current border-r-transparent"
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
