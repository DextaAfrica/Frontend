import type { AboutPageContent } from "../types/about-page";

/**
 * The `/about` page content, shipped with the app. A CMS payload at
 * `${CONTENT_API_URL}/about` overrides this when configured and valid
 * (see `server/get-about-page-content.ts`).
 *
 * PLACEHOLDER copy is marked inline — journey years, team names/roles, and
 * the CEO's exact title are for the client to confirm. Nothing here invents
 * a verifiable fact silently.
 */
export const aboutPageContent = {
  hero: {
    eyebrow: "About Dexta Africa",
    titleLines: ["Building tomorrow,", "*today*"],
    lede: "A trusted name in African real estate — delivering value-focused services from land acquisition to development and beyond.",
    // hero-people.png is a background-removed cutout (transparent above the
    // roofline) meant to be composited onto something else — used directly
    // as a full-bleed hero poster it painted as a large flat black void
    // above the house. This is a plain, fully-painted photo instead.
    image: "/images/about/residential.png",
    // PLACEHOLDER — drop a dedicated About brand film here when it's ready;
    // until then the hero runs as an image background.
    primary: { label: "Explore our projects", href: "/projects" },
    secondary: { label: "Talk to us", href: "/contact" },
  },
  statement: {
    heading: "Value, delivered — then *raised*.",
    paragraphs: [
      "Dexta Africa delivers value-focused real estate services that meet the diverse needs of our clients — from land acquisition, through development, and every step beyond.",
      "We turn intent into ownership, and ownership into lasting wealth, holding every project to the same standard of integrity and craft — whatever its size, wherever it stands.",
    ],
    kicker: "We're not done yet. We're just *getting started*.",
  },
  missionVision: {
    mission: {
      label: "Our mission",
      text: "To deliver real estate services and developments that create measurable, lasting value for every client — grounded in *integrity, quality, and follow-through*.",
      icon: "target",
    },
    vision: {
      label: "Our vision",
      text: "To be Africa's most trusted name in real estate — *the standard others are measured against*, from a single plot of land to a finished skyline.",
      icon: "telescope",
    },
  },
  journey: {
    eyebrow: "Our journey",
    title: "Built step by step, and *still building*.",
    video: {
      // Shares the Dexta Clan brand film; swap for a dedicated one if made.
      id: "Bh60Ut_d0Bo",
      poster: "/images/about/journey-video.png",
    },
    // Three years in — the timeline below compresses the story into that
    // span. Confirm the exact months with the client.
    milestones: [
      {
        year: "2023",
        text: "Dexta Africa is founded in Lagos with a single mandate: real estate that people can trust, end to end.",
      },
      {
        year: "2024",
        text: "The first fully serviced estate is handed over, the company is registered with LASERA, and the portfolio begins expanding across Ogun State.",
      },
      {
        year: "2025",
        text: "A diaspora client base takes root, over 150 clients are served, and the Dexta Clan learning community opens its doors.",
      },
      {
        year: "Today",
        text: "Multiple active developments in progress — and *a standard we keep raising* with every one.",
      },
    ],
  },
  ceo: {
    eyebrow: "A note from our CEO",
    paragraphs: [
      "When we started Dexta Africa, the goal was simple: make real estate in Africa something people could trust — not just the finished building, but every step that leads to it. The search. The paperwork. The promises. The handover.",
      "That belief still runs through everything we do. We acquire land with diligence, develop with intent, and stay accountable long after the keys change hands. Whether you're investing from another continent, buying your first plot, or learning how the market works for the very first time, you should feel the same clarity and the same respect.",
      "What we've built so far — the estates, the partnerships, the families now settled on land we serviced — is proof that this way of working holds. But it's a foundation, not a finish line.",
    ],
    kicker: "We're not done yet. We're just *getting started*.",
    name: "Mr. Olamide Ojo",
    // PLACEHOLDER TITLE — confirm exact wording with the client.
    title: "Founder & Chief Executive Officer",
    portrait: "/images/about/ceo-portrait.jpg",
    signature: "/images/about/signature.png",
    background: "/images/about/ceo-letter-bg.png",
  },
  dextaClan: {
    eyebrow: "Dexta Clan",
    title:
      "A community for everyone learning to build wealth through property.",
    copy: "Dexta Clan is where first-time buyers, diaspora investors, and curious minds learn how African real estate actually works — no jargon, no gatekeeping, just people figuring it out together.",
    benefits: [
      "Live workshops and open Q&As with the Dexta team",
      "Plain-language guides to buying, documentation, and due diligence",
      "Early looks at new estates and serviced plots",
      "A network of people on the same journey as you",
    ],
    cta: { label: "Join the Dexta Clan", href: "/contact" },
  },
  team: {
    eyebrow: "The people behind it",
    title: "A team that holds delivery *to the drawing*.",
    // The real roster is being added one confirmed profile at a time.
    // Members without an `image` render an initials monogram until their
    // portrait is supplied.
    members: [
      {
        name: "Dr. Muibi Kehinde",
        role: "Non-Executive Director",
        image: "/images/DR-MKH-DEXTA-AFRICA.png",
      },
    ],
  },
} satisfies AboutPageContent;
