import type { Project } from "@/components/marketing";

/**
 * The same three developments as the homepage's `projects` (see
 * home-page-content.ts) — kept as a separate array because this one carries
 * the richer, detail-page-only fields (tagline, pricing, gallery) that the
 * homepage's card grid never needs. D'Lodge is the one project with real
 * campaign material to draw on; Olumo and Kingsway intentionally stop at
 * what's actually known about them rather than inventing pricing or a
 * photo set that doesn't exist yet.
 */
export const projects: Project[] = [
  {
    slug: "dlodge-apartment",
    name: "D'Lodge Apartments",
    location: "Lekki Peninsula 2, Ajah — Lagos",
    status: "Now selling",
    tagline:
      "The right *key* doesn't just open a house — it opens *opportunities*.",
    description:
      "Ultra-premium 1 & 2 bedroom apartments in the heart of Lekki, built around smart-home technology, world-class amenities, and a genuinely prime address.",
    tone: "ruby",
    image: "/images/project-dlodge.jpg",
    // D1 — the detail page's hero background: the campaign key-drop poster.
    heroImage: "/images/dlodge/d1.webp",
    // A tall poster with its own baked-in text top and bottom — a centred
    // crop on this wide hero frame lands on the hanging-keys silhouettes,
    // not the shot's actual subject. Biased toward the reaching hand and
    // gold pendant instead, and away from the poster's own price/feature
    // text, which this hero already repeats in its own type below.
    heroImagePosition: "center 55%",
    priceFrom: "Starting from ₦15M initial deposit",
    features: [
      "Ultra-premium 1 & 2 bedroom apartments",
      "World-class amenities",
      "Smart building",
      "Prime location",
    ],
    // D2–D8 — every interior finish shot, grouped under its own toggle
    // rather than mixed in with exterior views. Alt text describes what's
    // actually in each render, not a generic placeholder.
    interiorGallery: [
      { src: "/images/dlodge/d2.webp", alt: "D'Lodge fitted kitchen" },
      { src: "/images/dlodge/d3.webp", alt: "D'Lodge living room" },
      { src: "/images/dlodge/d4.webp", alt: "D'Lodge bathroom" },
      { src: "/images/dlodge/d5.webp", alt: "D'Lodge dining area" },
      { src: "/images/dlodge/d6.webp", alt: "D'Lodge TV lounge" },
      {
        src: "/images/dlodge/d7.webp",
        alt: "D'Lodge open kitchen and dining",
      },
      { src: "/images/dlodge/d8.webp", alt: "D'Lodge master bedroom" },
    ],
    // No real exterior set yet — three placeholders from the existing
    // catalogue, tagged by elevation, rather than none, so the toggle and
    // gallery are already live. Only the front one is an honest match — a
    // real front-on render of this building. The other two are stand-ins
    // borrowed from elsewhere in the catalogue (a lifestyle/pool shot, a
    // generic site-visit photo) and don't actually show a building
    // elevation at all; swap them the moment real photography exists,
    // rather than leaving a client looking at a pool photo labeled "Rear
    // Elevation". "Side Elevation" is one entry for now — split it into
    // separate "Left Side Elevation" / "Right Side Elevation" entries once
    // there are two real side shots to tell apart.
    exteriorGallery: [
      { src: "/images/project-dlodge.jpg", alt: "D'Lodge — Front Elevation" },
      {
        src: "/images/project-olumo.jpg",
        alt: "D'Lodge — Side Elevation (placeholder, not the real building)",
      },
      {
        src: "/images/service-site-and-service.png",
        alt: "D'Lodge — Rear Elevation (placeholder, not the real building)",
      },
    ],
  },
  {
    slug: "olumo-county-estate",
    name: "Olumo County Estate",
    location: "Kobape, Ogun State",
    status: "Available plots",
    description:
      "Fully serviced plots inside a secured, master-planned estate — roads, drainage, and utilities already in place before you break ground.",
    tone: "stone",
    image: "/images/project-olumo.jpg",
  },
  {
    slug: "kingsway-estate",
    name: "Kingsway Estate",
    location: "Ijebu-Ode, Ogun State",
    status: "Now selling",
    description:
      "A gated residential estate built around wide roads, green spaces, and long-term value for families and investors alike.",
    tone: "dusk",
    image: "/images/project-kingsway.jpg",
  },
];
