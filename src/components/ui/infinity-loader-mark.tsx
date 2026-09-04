import * as React from "react";
import { cn } from "@/lib/utils";

/** How many dots trace the figure-eight. */
const DOT_COUNT = 36;

/**
 * Dots sampled evenly (in parameter, not arc length — they gather a little
 * at the crossover, which reads well) around a Lemniscate of Gerono, fitted
 * to the 120×60 viewBox: `x = 60 + 42·cos t`, `y = 30 + 21·sin 2t`.
 */
const DOTS = Array.from({ length: DOT_COUNT }, (_, index) => {
  const t = (index / DOT_COUNT) * Math.PI * 2;
  return {
    cx: 60 + 42 * Math.cos(t),
    cy: 30 + 21 * Math.sin(2 * t),
  };
});

/**
 * The mark every loading state on the site shares (the route-level
 * `loading.tsx` splash and the client-side `<RouteLoaderOverlay>` both
 * render this): a ring of dots that **form** a true figure-eight one after
 * another, then settle into a slow group breath. The forming *is* the
 * progress cue — when the infinity is whole, the wait is essentially over
 * (`RouteLoaderOverlay`'s minimum-visible floor is tuned to the same
 * duration). A faint static track sits underneath so the shape reads even
 * on the very first frame.
 *
 * Always on a dark ground: this is a theme-*invariant* mark by design (see
 * `--brand-dark` / `--brand-light` / `--primary`, none of which change
 * between light and dark site theme) — a splash screen renders identically
 * in either theme rather than flipping with it.
 *
 * Reduced motion: the dots appear all at once (no staggered forming, no
 * breath) and the track alone pulses gently instead — a loading mark is
 * exempt from "no motion at all" (it conveys required state), but shouldn't
 * run fast, continuous motion for a visitor who asked not to see it.
 */
export function InfinityLoaderMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 60"
      className={cn("infinity-loader-mark", className)}
      aria-hidden="true"
    >
      <path
        className="infinity-loader-mark__track"
        d="M102,30 L100.57,40.5 L96.37,48.19 L89.7,51 L81,48.19 L70.87,40.5 L60,30 L49.13,19.5 L39,11.81 L30.3,9 L23.63,11.81 L19.43,19.5 L18,30 L19.43,40.5 L23.63,48.19 L30.3,51 L39,48.19 L49.13,40.5 L60,30 L70.87,19.5 L81,11.81 L89.7,9 L96.37,11.81 L100.57,19.5 Z"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <g className="infinity-loader-mark__dots">
        {DOTS.map((dot, index) => (
          <circle
            key={index}
            className="infinity-loader-mark__dot"
            cx={dot.cx}
            cy={dot.cy}
            r={2.6}
            style={{ "--i": index } as React.CSSProperties}
          />
        ))}
      </g>
    </svg>
  );
}
