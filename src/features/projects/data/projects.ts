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
    priceFrom: "Starting from ₦15M initial deposit",
    features: [
      "Ultra-premium 1 & 2 bedroom apartments",
      "World-class amenities",
      "Smart building",
      "Prime location",
    ],
    gallery: [
      { src: "/images/dlodge/kitchen.jpg", alt: "D'Lodge fitted kitchen" },
      { src: "/images/dlodge/living-room.jpg", alt: "D'Lodge living room" },
      { src: "/images/dlodge/dining.jpg", alt: "D'Lodge dining area" },
      { src: "/images/dlodge/lounge.jpg", alt: "D'Lodge TV lounge" },
      {
        src: "/images/dlodge/kitchen-dining.jpg",
        alt: "D'Lodge open kitchen and dining",
      },
      { src: "/images/dlodge/bathroom.jpg", alt: "D'Lodge bathroom" },
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
