"use client";

import * as React from "react";

const INTERACTIVE_SELECTOR =
  'a, button, input, textarea, select, summary, label, [role="button"], [data-cursor-hover]';

/**
 * Replaces the native pointer with a small dot that trails the cursor with
 * a touch of smoothing, and grows over interactive elements. Uses
 * `mix-blend-mode: difference` against a white dot so it stays visible over
 * both light and dark content, and both themes, without any per-surface
 * styling — genuinely adaptive by construction rather than hand-tuned.
 *
 * Only activates on devices with a real mouse (`hover: hover` and
 * `pointer: fine`) — touch and coarse-pointer devices keep the native
 * cursor untouched, since there's nothing to trail there.
 */
// A one-shot read of a browser capability, not a value that changes while
// mounted (swapping input devices mid-session is rare and not worth
// reacting to live) — useSyncExternalStore gives the correct SSR snapshot
// (false) during hydration and the real value immediately after, without
// the extra render-then-setState-in-effect cycle.
function subscribe() {
  return () => {};
}
function getSnapshot() {
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}
function getServerSnapshot() {
  return false;
}

export function Cursor() {
  const dotRef = React.useRef<HTMLDivElement>(null);
  const enabled = React.useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  React.useEffect(() => {
    if (!enabled) return;
    const dot = dotRef.current;
    if (!dot) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let x = targetX;
    let y = targetY;
    let frame = 0;
    let visible = false;

    const smoothing = reducedMotion ? 1 : 0.22;

    const render = () => {
      x += (targetX - x) * smoothing;
      y += (targetY - y) * smoothing;
      dot.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      frame = window.requestAnimationFrame(render);
    };

    const handleMove = (event: PointerEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;
      if (!visible) {
        visible = true;
        dot.dataset.visible = "true";
      }
    };

    const handleLeave = () => {
      visible = false;
      dot.dataset.visible = "false";
    };

    const handleOver = (event: PointerEvent) => {
      const target = event.target;
      if (target instanceof Element && target.closest(INTERACTIVE_SELECTOR)) {
        dot.dataset.hovering = "true";
      }
    };

    const handleOut = (event: PointerEvent) => {
      const target = event.target;
      if (target instanceof Element && target.closest(INTERACTIVE_SELECTOR)) {
        dot.dataset.hovering = "false";
      }
    };

    window.addEventListener("pointermove", handleMove, { passive: true });
    window.addEventListener("pointerover", handleOver, { passive: true });
    window.addEventListener("pointerout", handleOut, { passive: true });
    document.documentElement.addEventListener("mouseleave", handleLeave);
    frame = window.requestAnimationFrame(render);
    document.documentElement.classList.add("custom-cursor");

    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerover", handleOver);
      window.removeEventListener("pointerout", handleOut);
      document.documentElement.removeEventListener("mouseleave", handleLeave);
      window.cancelAnimationFrame(frame);
      document.documentElement.classList.remove("custom-cursor");
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={dotRef}
      aria-hidden="true"
      data-visible="false"
      data-hovering="false"
      className="cursor-dot"
    />
  );
}
