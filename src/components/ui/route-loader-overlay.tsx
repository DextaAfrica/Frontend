"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import * as React from "react";
import { InfinityLoaderMark } from "./infinity-loader-mark";

/** Tuned to the loader mark's forming time (see infinity-loader-mark.tsx /
 *  the `.infinity-loader-mark__dot` stagger in globals.css): the overlay
 *  holds until the dots have finished tracing the full figure-eight, so the
 *  "infinity complete = page ready" read always lands. A deliberate floor,
 *  not an accident of timing. */
const MIN_VISIBLE_MS = 2400;
/** A safety net, not a target: if a navigation is somehow never observed as
 *  complete (an aborted transition, a route that errors), this guarantees
 *  the overlay releases itself instead of covering the site forever. */
const SAFETY_TIMEOUT_MS = 8000;

/**
 * `loading.tsx` only ever shows for exactly as long as a navigation
 * actually takes — correct engineering, but on this site's fast, mostly
 * static routes that's often under 100ms, nowhere near long enough to
 * register. This is the complementary piece: a full-bleed overlay that
 * appears the instant a same-origin link is clicked (before Next.js has
 * even started the transition) and holds itself for a guaranteed minimum
 * duration, fully decoupled from how fast the underlying page actually
 * resolves — the same "click loosely intercepted, minimum floor enforced"
 * shape production route-progress indicators (NProgress and its Next.js
 * descendants) use, built directly against `usePathname()` rather than an
 * external dependency.
 *
 * Deliberately click-driven, not a global navigation-events hook — this
 * covers every `<Link>` and plain same-origin `<a>` on the site (which is
 * how every real navigation here happens: nav, footer, every `ButtonLink`).
 * A `router.push()` call with no originating click wouldn't trigger it;
 * none of this codebase's navigation goes through one today.
 *
 * A hard/direct navigation (typed URL, external referrer, browser back)
 * has no click to intercept — `loading.tsx` alone covers that case, and
 * this overlay simply never mounts for it.
 */
export function RouteLoaderOverlay() {
  const pathname = usePathname();
  const [visible, setVisible] = React.useState(false);

  const pathnameRef = React.useRef(pathname);
  const shownAtRef = React.useRef(0);
  const hideTimerRef = React.useRef<number>(undefined);
  const safetyTimerRef = React.useRef<number>(undefined);

  // The navigation this overlay was shown for has now committed — release
  // it once whatever's left of the minimum floor has elapsed.
  React.useEffect(() => {
    const navigated = pathnameRef.current !== pathname;
    pathnameRef.current = pathname;
    if (!navigated) return;

    window.clearTimeout(safetyTimerRef.current);
    const remaining = Math.max(
      0,
      MIN_VISIBLE_MS - (Date.now() - shownAtRef.current),
    );
    hideTimerRef.current = window.setTimeout(
      () => setVisible(false),
      remaining,
    );
  }, [pathname]);

  React.useEffect(() => {
    function onClick(event: MouseEvent) {
      // Only a plain left click claims this — anything a browser would
      // otherwise treat specially (open in new tab, save target, etc.)
      // passes through untouched.
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const anchor = (event.target as HTMLElement | null)?.closest("a");
      if (!anchor) return;
      if (anchor.target && anchor.target !== "_self") return;
      if (anchor.hasAttribute("download")) return;

      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#")) return;

      let url: URL;
      try {
        url = new URL(href, window.location.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;
      if (
        `${url.pathname}${url.search}` ===
        `${window.location.pathname}${window.location.search}`
      ) {
        return;
      }

      shownAtRef.current = Date.now();
      setVisible(true);
      window.clearTimeout(hideTimerRef.current);
      safetyTimerRef.current = window.setTimeout(
        () => setVisible(false),
        SAFETY_TIMEOUT_MS,
      );
    }

    // Capture phase: sees the click before any handler on the link itself
    // (or one that calls preventDefault) gets a chance to run first.
    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.clearTimeout(hideTimerRef.current);
      window.clearTimeout(safetyTimerRef.current);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="route-loader-overlay" role="status" aria-live="polite">
      <span aria-hidden className="route-loader-overlay__ambient" />
      <Image
        src="/images/dexta-logo-on-dark.svg"
        alt=""
        width={132}
        height={58}
        priority
        className="route-loader-overlay__logo"
      />
      <InfinityLoaderMark className="route-loader-overlay__mark" />
      <span className="sr-only">Loading…</span>
    </div>
  );
}
