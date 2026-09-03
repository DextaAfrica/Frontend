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
    titleLines: ["We turn intent", "into *ownership*"],
    lede: "A trusted name in African real estate — delivering value-focused services from land acquisition to development and beyond.",
    image: "/images/about/hero-people.png",
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
    title: "Built step by step, and still building.",
    background: "/images/about/journey-bg.png",
    video: {
      poster: "/images/about/journey-video.png",
      // PLACEHOLDER — point this at the real brand film when it's ready.
      href: "https://www.youtube.com/@dextaafrica",
    },
    milestones: [
      {
        // PLACEHOLDER YEARS — confirm the real dates with the client.
        year: "2018",
        text: "Dexta Africa is founded in Lagos with a single mandate: real estate that people can trust, end to end.",
      },
      {
        year: "2020",
        text: "First fully serviced estate handed over; the company is registered with LASERA.",
      },
      {
        year: "2022",
        text: "The portfolio expands across Ogun State, and a diaspora client base takes root.",
      },
      {
        year: "2024",
        text: "Over 150 clients served, and the Dexta Clan learning community opens its doors.",
      },
      {
        year: "Today",
        text: "Multiple active developments in progress — and a standard we keep raising with every one.",
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
    kicker: "We're not done yet. We're just getting started.",
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
    title: "A team that holds delivery to the drawing.",
    members: [
      // PLACEHOLDER NAMES + ROLES — swap for the real team roster.
      {
        name: "Team Member One",
        role: "Head of Development",
        image: "/images/about/team-1.png",
      },
      {
        name: "Team Member Two",
        role: "Head of Sales & Client Relations",
        image: "/images/about/team-2.png",
      },
      {
        name: "Team Member Three",
        role: "Head of Legal & Documentation",
        image: "/images/about/team-3.png",
      },
      {
        name: "Team Member Four",
        role: "Project Delivery Lead",
        image: "/images/about/team-4.png",
      },
      {
        name: "Team Member Five",
        role: "Head of Community",
        image: "/images/about/team-5.png",
      },
      {
        name: "Team Member Six",
        role: "Head of Finance",
        image: "/images/about/team-6.png",
      },
    ],
  },
} satisfies AboutPageContent;
