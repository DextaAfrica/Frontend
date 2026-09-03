import Image from "next/image";
import { InfinityLoaderMark } from "@/components/ui";

/**
 * Next.js's route-level loading UI — shown automatically by the App Router
 * for any navigation whose destination segment isn't ready yet, so this is
 * already "integrated for routing to any page" with no extra wiring. Its
 * duration is exactly however long that navigation genuinely takes, which
 * is correct — on this site's fast routes that's often not long enough to
 * register at all, and `<RouteLoaderOverlay>` (mounted site-wide, see
 * `app-provider.tsx`) is what guarantees a same-origin `<Link>` click gets
 * a properly visible moment regardless. This still covers what that
 * overlay structurally can't: a hard/direct navigation with no click to
 * intercept.
 *
 * Always a fixed dark ground — not the page's own light/dark theme — the
 * same choice the hero and CTA band already make for a full-bleed
 * cinematic moment. The wordmark and the infinity mark are both
 * theme-invariant marks for exactly that reason.
 */
export default function Loading() {
  return (
    <section
      className="app-loader"
      aria-label="Loading Dexta Africa"
      aria-live="polite"
    >
      <span className="app-loader__ambient" aria-hidden />

      <Image
        src="/images/dexta-logo-on-dark.svg"
        alt=""
        width={132}
        height={58}
        priority
        className="app-loader__logo"
      />

      <InfinityLoaderMark className="app-loader__mark" />

      <span className="sr-only">Preparing the next page…</span>
    </section>
  );
}
