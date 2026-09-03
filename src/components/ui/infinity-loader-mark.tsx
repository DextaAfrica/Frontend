import { cn } from "@/lib/utils";

/**
 * The mark every loading state on the site shares (the route-level
 * `loading.tsx` splash and the client-side `<RouteLoaderOverlay>` both
 * render this) — a true figure-eight (a Lemniscate of Gerono, traced from
 * its own parametric equation, not a hand-drawn approximation), not four
 * bouncing balls.
 *
 * A faint static track gives the shape immediately, at any glance, even on
 * a frozen frame; a bright comet — the brand red, with its own glow — races
 * around it on a continuous loop. The dash pattern's *sum* (26 + 234 = 260)
 * is what the `stroke-dashoffset` keyframe travels by, so the loop is
 * mathematically seamless regardless of the path's true rendered length.
 *
 * Always on a dark ground: this is a theme-*invariant* mark by design (see
 * `--brand-dark` / `--brand-light` / `--primary`, none of which change
 * between light and dark site theme) — a splash screen doesn't need to
 * flip with the site's theme to still respect it; it just needs to render
 * identically, correctly, regardless of which theme is active. That's a
 * deliberately more robust guarantee than conditionally swapping colors.
 *
 * Reduced motion: the comet's animation stops and the track alone breathes
 * gently instead (see `globals.css`) — a loading mark is exempt from "no
 * motion at all" (it's conveying required state, not decoration), but
 * still shouldn't run at full, fast motion for a visitor who asked not to
 * see that.
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
      <path
        className="infinity-loader-mark__comet"
        d="M102,30 L100.57,40.5 L96.37,48.19 L89.7,51 L81,48.19 L70.87,40.5 L60,30 L49.13,19.5 L39,11.81 L30.3,9 L23.63,11.81 L19.43,19.5 L18,30 L19.43,40.5 L23.63,48.19 L30.3,51 L39,48.19 L49.13,40.5 L60,30 L70.87,19.5 L81,11.81 L89.7,9 L96.37,11.81 L100.57,19.5 Z"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
