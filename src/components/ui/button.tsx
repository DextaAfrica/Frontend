"use client";

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
 * - click      → a bright diagonal streak sweeps across the fill once, on
 *                every click (see `.btn-flash-sweep` in globals.css) — a
 *                deliberate, momentary flash rather than the more common
 *                Material-style ripple, echoing the brand's "on air"/signal
 *                motifs used elsewhere (the hero badge's own light sweep,
 *                the expertise marquee's pulsing dot).
 * - the trailing icon rests tucked and dimmed *behind* the label, slides
 *   forward and brightens on hover, and gathers back to centre on press.
 *
 * All of it animates the `translate` / `scale` / `opacity` properties (never
 * `transform`), so nothing fights the layout, and it is disabled wholesale
 * under `prefers-reduced-motion` (see globals.css).
 *
 * `--control-radius` is 999px — every button is already a full pill, the
 * curviest a non-circular control can be.
 *
 * Fully rounded, and `overflow-hidden` so the click-flash streak clips to
 * that pill shape instead of spilling past the corners.
 */
const base = cn(
  "group/btn relative isolate inline-flex shrink-0 items-center justify-center gap-2 overflow-hidden",
  "rounded-[var(--control-radius)]",
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

/**
 * Two families, deliberately: a filled family (primary/neutral/destructive)
 * for the one action on a screen that matters most, and a bordered family
 * (secondary/onMedia/outline) for everything alongside it — the border is
 * what reads as "this is the other option" at a glance, before anyone
 * reads a word of the label. Every variant still defines a resting state
 * visibly different from its hover state, filled or not.
 */
const variants: Record<ButtonVariant, string> = {
  // Solid brand red. Rest sits on a hairline shadow; hover rises into a calm
  // red glow; press settles back flat.
  primary:
    "bg-primary text-primary-foreground shadow-[var(--control-shadow)] hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-[var(--control-shadow-glow)] active:translate-y-0 active:shadow-[var(--control-shadow)]",
  // Bordered, not filled — the secondary action beside a primary one.
  // Transparent at rest so it never competes with the fill next to it;
  // hover firms the border and lifts a soft fill in behind it.
  secondary:
    "border border-border bg-transparent text-foreground hover:-translate-y-0.5 hover:border-foreground/25 hover:bg-control-hover hover:shadow-[var(--control-shadow-hover)] active:translate-y-0 active:bg-control-pressed",
  // Inverted fill — near-black on paper / near-white on ink.
  neutral:
    "bg-foreground text-background shadow-[var(--control-shadow)] hover:-translate-y-0.5 hover:bg-foreground/90 hover:shadow-[var(--control-shadow-hover)] active:translate-y-0 active:shadow-[var(--control-shadow)]",
  // Sits over photography/video — bordered and glassy at rest (matching the
  // hero badge's own chrome), solidifying to a full brand-red fill on
  // hover/press so the "other option" beside a filled primary CTA is
  // legible against any frame of a video without ever competing with it.
  onMedia:
    "border border-on-media-border bg-on-media-surface text-on-media backdrop-blur-md hover:-translate-y-0.5 hover:border-transparent hover:bg-primary hover:text-primary-foreground hover:shadow-[var(--control-shadow-glow)] active:translate-y-0",
  ghost:
    "text-foreground hover:bg-control-hover active:bg-control-pressed active:scale-[0.98]",
  // A quiet brand-tinted fill at rest that solidifies to the full brand red
  // on hover — the clearest possible off/on read of any variant.
  outline:
    "bg-primary-subtle text-primary hover:-translate-y-0.5 hover:bg-primary hover:text-primary-foreground hover:shadow-[var(--control-shadow-glow)] active:translate-y-0",
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

/**
 * Triggers the click-flash sweep by toggling a class rather than relying on
 * `:active` — `:active` only lasts as long as the pointer is down, which on
 * a touch tap is barely a frame; the animation would never be seen to
 * finish, or on a fast tap might not render at all. This guarantees the
 * full sweep plays out on every click regardless of how briefly the button
 * was actually pressed, on touch exactly as on a mouse.
 */
function useClickFlash<T extends HTMLElement>(externalRef?: React.Ref<T>) {
  const ref = React.useRef<T>(null);

  // Both this hook's own DOM access and a caller's forwarded ref (e.g.
  // site-header's menuButtonRef, used for outside-click handling) need the
  // same node. useImperativeHandle is the sanctioned way to forward it: a
  // hand-written callback that writes `externalRef.current = node` mutates
  // a value that arrived via props, which the compiler correctly refuses to
  // allow since it can't prove that's safe for an arbitrary prop.
  React.useImperativeHandle(externalRef, () => ref.current as T, []);

  const flash = React.useCallback(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    el.classList.remove("btn-flash-active");
    // Force a reflow so a rapid second click restarts the animation instead
    // of the class-add being a no-op because the class was never removed.
    void el.offsetWidth;
    el.classList.add("btn-flash-active");
  }, []);

  return { ref, flash };
}

function FlashSweep() {
  return <span aria-hidden className="btn-flash-sweep" />;
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
  onClick,
  ref: externalRef,
  ...props
}: ButtonProps) {
  const { ref, flash } = useClickFlash<HTMLButtonElement>(externalRef);

  return (
    <button
      ref={ref}
      type={type}
      data-ui="button"
      aria-busy={loading || undefined}
      disabled={disabled || loading}
      onClick={(event) => {
        flash();
        onClick?.(event);
      }}
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
      <FlashSweep />
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
  ref?: React.Ref<HTMLAnchorElement>;
}
export function ButtonLink({
  href,
  className,
  variant,
  size,
  onClick,
  children,
  ref: externalRef,
  ...props
}: ButtonLinkProps) {
  const { ref, flash } = useClickFlash<HTMLAnchorElement>(externalRef);

  return (
    <Link
      ref={ref}
      href={href as Route}
      data-ui="button-link"
      onClick={(event) => {
        flash();
        onClick?.(event);
      }}
      className={buttonClassName({ variant, size, className })}
      {...props}
    >
      {children}
      <FlashSweep />
    </Link>
  );
}
