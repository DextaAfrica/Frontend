"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);
gsap.defaults({ ease: "power3.out" });
ScrollTrigger.config({
  limitCallbacks: true,
  ignoreMobileResize: true,
});

// A web font swapping in changes every text block's height, which shifts
// every ScrollTrigger start/end computed before it landed — most visible on
// mobile, where the swap is slower and sections sit closer to the fold, so a
// reveal can get stuck dim or fire at the wrong scroll point. One refresh
// once the fonts are actually ready re-measures everything. (ScrollTrigger
// already re-refreshes on `load` and `resize` on its own.)
if (typeof document !== "undefined" && "fonts" in document) {
  document.fonts.ready.then(() => ScrollTrigger.refresh());
}

export { gsap, ScrollTrigger, useGSAP };
