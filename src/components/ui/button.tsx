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
  "[&_svg]:pointer-events-none [&_svg]:size-3.5 [&_svg]:shrink-0",
  "[&_svg]:transition-[translate,opacity,scale] [&_svg]:duration-[240ms] [&_svg]:ease-premium",
  // A trailing icon rests behind the label, then leads on interaction.
  "[&_svg:last-child]:-translate-x-0.5 [&_svg:last-child]:opacity-70",
  "group-hover/btn:[&_svg:last-child]:translate-x-[3px] group-hover/btn:[&_svg:last-child]:opacity-100",
  "group-active/btn:[&_svg:last-child]:translate-x-0",
);

/**
 * The house CTA — `primary` / `secondary` / `onMedia` — shares ONE interaction:
 * a brand-red flood that grows from the cursor on hover/focus, the label
 * flipping to white as it fills. That whole treatment (resting palette,
 * border, flood, ink flip, theme differences) lives in globals.css keyed off
 * `data-cta`; the map entries below carry only the motion Tailwind owns (the
 * 2px rise, the shadow). See `.btn-liquid` and `[data-cta]` in globals.css.
 *
 * `neutral` (inverted fill), `outline` (tinted → solid), `destructive`,
 * `ghost` and `link` keep their own self-contained looks.
 */
const CTA_VARIANTS = ["primary", "secondary", "onMedia"] as const;
const hasLiquidFill = (variant: ButtonVariant) =>
  (CTA_VARIANTS as readonly string[]).includes(variant);

const variants: Record<ButtonVariant, string> = {
  primary:
    "shadow-[var(--control-shadow)] hover:-translate-y-0.5 hover:shadow-[var(--control-shadow-glow)] active:translate-y-0 active:shadow-[var(--control-shadow)]",
  secondary:
    "hover:-translate-y-0.5 hover:shadow-[var(--control-shadow-hover)] active:translate-y-0",
  onMedia:
    "hover:-translate-y-0.5 hover:shadow-[var(--control-shadow-glow)] active:translate-y-0",
  // Inverted fill — near-black on paper / near-white on ink.
  neutral:
    "bg-foreground text-background shadow-[var(--control-shadow)] hover:-translate-y-0.5 hover:bg-foreground/90 hover:shadow-[var(--control-shadow-hover)] active:translate-y-0 active:shadow-[var(--control-shadow)]",
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

// Heights, padding and label size are all fluid tokens (see globals.css) so a
// given size stays proportionate to its viewport. `sm` is nav-scale — compact,
// tracked, uppercase — and is used only by the site header.
const sizes: Record<ButtonSize, string> = {
  sm: "h-[var(--control-height-sm)] px-[var(--control-padding-sm)] text-control-compact tracking-control-compact uppercase",
  md: "h-[var(--control-height-md)] px-[var(--control-padding-md)]",
  lg: "h-[var(--control-height-lg)] px-[var(--control-padding-lg)] text-control-lg",
  // A single centred glyph — no tuck, a gentle grow on hover instead.
  icon: "size-[var(--control-height-md)] p-0 [&_svg:last-child]:translate-x-0 [&_svg:last-child]:opacity-100 group-hover/btn:[&_svg:last-child]:translate-x-0 group-hover/btn:[&_svg:last-child]:scale-110",
};

export function buttonClassName({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
} = {}) {
  return cn(
    base,
    variants[variant],
    sizes[size],
    fullWidth && "w-full",
    className,
  );
}

/**
 * Owns the two pointer-driven effects that can't be pure CSS:
 *
 * 1. The click-flash sweep, toggled by a class rather than `:active` —
 *    `:active` only lasts as long as the pointer is down, which on a touch
 *    tap is barely a frame; this way the full sweep plays on every click
 *    however briefly the button was pressed.
 * 2. The house-CTA liquid fill origin: `--btn-x` / `--btn-y` track the cursor
 *    while it's over the button ("like a progress bar") and are left at the
 *    exit point on leave, so the red flood grows from — and retracts toward —
 *    the pointer. `.btn-liquid` in globals.css does the actual animation.
 *    Skipped on coarse pointers (no hover) and under reduced motion.
 */
function useButtonInteraction<T extends HTMLElement>(
  externalRef: React.Ref<T> | undefined,
  variant: ButtonVariant | undefined,
) {
  const ref = React.useRef<T>(null);

  // Both this hook's own DOM access and a caller's forwarded ref (e.g.
  // site-header's menuButtonRef, used for outside-click handling) need the
  // same node. useImperativeHandle is the sanctioned way to forward it: a
  // hand-written callback that writes `externalRef.current = node` mutates
  // a value that arrived via props, which the compiler correctly refuses to
  // allow since it can't prove that's safe for an arbitrary prop.
  React.useImperativeHandle(externalRef, () => ref.current as T, []);

  const flash = React.useCallback(() => {
    // `link` never renders a <FlashSweep>, so there's nothing for this
    // class to animate — see FlashSweep for why.
    if (variant === "link") return;
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
  }, [variant]);

  React.useEffect(() => {
    const el = ref.current;
    if (!el || !el.dataset.cta) return;
    if (
      window.matchMedia("(hover: none)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    let frame = 0;
    const setOrigin = (clientX: number, clientY: number) => {
      const rect = el.getBoundingClientRect();
      el.style.setProperty("--btn-x", `${clientX - rect.left}px`);
      el.style.setProperty("--btn-y", `${clientY - rect.top}px`);
    };
    const onMove = (event: PointerEvent) => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        setOrigin(event.clientX, event.clientY);
      });
    };
    const onLeave = (event: PointerEvent) => {
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
      setOrigin(event.clientX, event.clientY);
    };

    el.addEventListener("pointerenter", onMove);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      el.removeEventListener("pointerenter", onMove);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return { ref, flash };
}

/**
 * The two decorative siblings every non-`link` button carries:
 * - `.btn-liquid` — the red flood, present only for the house-CTA variants
 *   (`primary` / `secondary` / `onMedia`); it must render *before* the label
 *   so it paints behind it (`z-index: -1`).
 * - `.btn-flash-sweep` — the one-shot click streak, on every CTA-shaped chip.
 */
function ButtonEffects({ variant }: { variant: ButtonVariant }) {
  if (variant === "link") return null;
  return (
    <>
      {hasLiquidFill(variant) && <span aria-hidden className="btn-liquid" />}
      <span aria-hidden className="btn-flash-sweep" />
    </>
  );
}

export interface ButtonProps extends React.ComponentProps<"button"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
}
export function Button({
  className,
  variant,
  size,
  fullWidth,
  loading = false,
  disabled,
  children,
  type = "button",
  onClick,
  ref: externalRef,
  ...props
}: ButtonProps) {
  const resolvedVariant = variant ?? "primary";
  const { ref, flash } = useButtonInteraction<HTMLButtonElement>(
    externalRef,
    resolvedVariant,
  );

  return (
    <button
      ref={ref}
      type={type}
      data-ui="button"
      data-cta={hasLiquidFill(resolvedVariant) ? resolvedVariant : undefined}
      aria-busy={loading || undefined}
      disabled={disabled || loading}
      onClick={(event) => {
        flash();
        onClick?.(event);
      }}
      className={buttonClassName({ variant, size, fullWidth, className })}
      {...props}
    >
      {loading && (
        <span
          aria-hidden
          className="size-3.5 animate-spin rounded-full border-2 border-current border-r-transparent"
        />
      )}
      {children}
      <ButtonEffects variant={resolvedVariant} />
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
  fullWidth?: boolean;
  ref?: React.Ref<HTMLAnchorElement>;
}
export function ButtonLink({
  href,
  className,
  variant,
  size,
  fullWidth,
  onClick,
  children,
  ref: externalRef,
  ...props
}: ButtonLinkProps) {
  const resolvedVariant = variant ?? "primary";
  const { ref, flash } = useButtonInteraction<HTMLAnchorElement>(
    externalRef,
    resolvedVariant,
  );

  return (
    <Link
      ref={ref}
      href={href as Route}
      data-ui="button-link"
      data-cta={hasLiquidFill(resolvedVariant) ? resolvedVariant : undefined}
      onClick={(event) => {
        flash();
        onClick?.(event);
      }}
      className={buttonClassName({ variant, size, fullWidth, className })}
      {...props}
    >
      {children}
      <ButtonEffects variant={resolvedVariant} />
    </Link>
  );
}
