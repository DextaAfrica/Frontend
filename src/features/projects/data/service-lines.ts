export interface ServiceLine {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  /** What the line actually covers, shown as a short scope list. */
  scope: readonly string[];
  image: string;
}

/**
 * The three lines of business the `/projects` page is actually organized
 * around — the same three the homepage's services section introduces
 * (`home-page-content.ts`), given the fuller, more detailed treatment this
 * page is built for. "Site Inspection & Monitoring Development" is a
 * distinct line from the homepage's "Site and Service Development" (that
 * one is about *selling* serviced land; this one is the ongoing oversight
 * of an active build) — its copy draws on the accountability language
 * already established elsewhere on the site (the CEO letter, the diaspora
 * investor testimonials), not invented from nothing.
 */
export const serviceLines: readonly ServiceLine[] = [
  {
    id: "residential-development",
    eyebrow: "Building the future",
    title: "Residential Development",
    description:
      "From land acquisition to construction, through to marketing and sales, we transform your vision into a place to call home.",
    scope: [
      "Land acquisition & feasibility",
      "Construction & project delivery",
      "Marketing, sales & handover",
    ],
    image: "/images/dexta-residential.jpg",
  },
  {
    id: "site-inspection-monitoring",
    eyebrow: "Accountable, every step",
    title: "Site Inspection & Monitoring Development",
    description:
      "We don't hand over a plot and disappear. Every active site is inspected on a set schedule and reported back to you — photos, progress notes, and a video walkthrough before allocation — so you always know exactly where things stand, wherever in the world you're watching from.",
    scope: [
      "Scheduled site inspections",
      "Progress reporting & photo updates",
      "Pre-allocation video walkthroughs",
    ],
    image: "/images/service-site-and-service.png",
  },
  {
    id: "hospitality-management",
    eyebrow: "Investment meets lifestyle",
    title: "Hospitality Management",
    description:
      "We design, develop, and manage world-class hospitality spaces — built for modern travelers and structured for investors who want a property that works even when they're not living in it.",
    scope: [
      "Hospitality-grade design & build",
      "Ongoing property management",
      "Guest experience & revenue oversight",
    ],
    image: "/images/service-hospitality.jpg",
  },
];
