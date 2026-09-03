import type { HomePageContent } from "../types/home-page";

/** The site's home page content, shipped with the app. */
export const homePageContent = {
  hero: {
    badge: "Registered with LASERA",
    slides: [
      {
        titleLines: ["Welcome to", "*Dexta Africa*"],
        description:
          "A trusted name in African real estate — every development built on integrity, quality, and lasting value.",
      },
      {
        titleLines: ["Your partner in", "*building* wealth"],
        description:
          "From site to skyline, we deliver value-driven real estate solutions across Nigeria and Africa.",
      },
      {
        titleLines: ["The right", "*opportunity* for you"],
        description:
          "Whether you're investing, living, or learning — there's a place for you at Dexta Africa.",
      },
    ],
    primary: { label: "Explore Our Projects", href: "/projects" },
    secondary: { label: "Talk to an Expert", href: "/contact" },
    video: "/media/dexta-hero-desktop.webm",
    mobileVideo: "/media/dexta-hero-mobile.webm",
    poster: "/images/dexta-hero-poster.jpg",
  },
  intro: {
    heading: "Built on *integrity*, delivered with precision",
    paragraphs: [
      "From site to skyline, Dexta Africa delivers value-driven real estate solutions that turn dreams into *addresses*.",
      "Whether you're investing, living, or learning, we have the right *opportunity* for you.",
    ],
  },
  expertiseSection: {
    eyebrow: "Our Expertise",
    title: "Complete property expertise, *in-house*.",
    description:
      "Eight disciplines, one accountable team — from first land search to final handover and beyond.",
  },
  services: [
    {
      id: "residential-development",
      label: "Building the future",
      title: "Residential Development",
      description:
        "From acquisition to construction, through to marketing and sales, we transform your vision into reality.",
      image: "/images/dexta-residential.jpg",
    },
    {
      id: "site-and-service",
      label: "Land with purpose",
      title: "Site and Service Development",
      description:
        "Offering strategically located sites with top-tier services, ensuring fully serviced plots that meet standards.",
      image: "/images/service-site-and-service.png",
    },
    {
      id: "hospitality-development",
      label: "Investment meets lifestyle",
      title: "Hospitality Development",
      description:
        "We design and manage world-class hospitality spaces that are perfect for modern travelers and investors.",
      image: "/images/service-hospitality.jpg",
    },
  ],
  projectsSection: {
    eyebrow: "Our Portfolio",
    title: "Projects that *speak* for themselves",
    ctaLabel: "View all projects",
    ctaHref: "/projects",
    cardCtaLabel: "View project",
  },
  projects: [
    {
      id: "dlodge-apartment",
      name: "D'Lodge Apartments",
      location: "Lekki Peninsula 2, Ajah",
      status: "Now selling",
      description:
        "Ultra-premium 1 & 2 bedroom apartments in the heart of Lekki, built around smart-home technology, world-class amenities, and a genuinely prime address.",
      image: "/images/project-dlodge.jpg",
      href: "/projects/dlodge-apartment",
    },
    {
      id: "olumo-county-estate",
      name: "Olumo County Estate",
      location: "Kobape, Ogun State",
      status: "Available plots",
      description:
        "Fully serviced plots inside a secured, master-planned estate — roads, drainage, and utilities already in place before you break ground.",
      image: "/images/project-olumo.jpg",
      href: "/projects/olumo-county-estate",
    },
    {
      id: "kingsway-estate",
      name: "Kingsway Estate",
      location: "Ijebu-Ode, Ogun State",
      status: "Now selling",
      description:
        "A gated residential estate built around wide roads, green spaces, and long-term value for families and investors alike.",
      image: "/images/project-kingsway.jpg",
      href: "/projects/kingsway-estate",
    },
  ],
  testimonialSection: {
    eyebrow: "Testimonials",
    title: "Words from those who *trusted* us",
  },
  testimonials: [
    {
      id: "shaka-vanessa",
      quote:
        "I’m honestly impressed with the quality of the D’lennox project. Everything from the foundation to the structure looks amazing — exactly as promised. The team was professional and kept me updated at every stage. It already feels like home.",
      author: "Shaka Vanessa",
      role: "Realtor",
      portrait: "/images/testimonial-shaka.jpg",
    },
    {
      id: "ibrahim-danladi",
      quote:
        "I bought two plots at Olumo County Estate on a payment plan and completed in eight months. The allocation was smooth, the survey and deed came through exactly when they said, and the roads were already graded when I visited. No stories.",
      author: "Ibrahim Danladi",
      role: "Plot owner, Olumo County Estate",
    },
    {
      id: "ngozi-eze",
      quote:
        "I invested from London and never once felt in the dark. I got site photos every fortnight, a video walkthrough before allocation, and my documents couriered to me. Dexta made buying land back home feel like buying anywhere else in the world.",
      author: "Ngozi Eze",
      role: "Diaspora investor",
    },
    {
      id: "tunde-bakare",
      quote:
        "As a first-time buyer the installment plan is what made it possible for me. Everything was written down from day one — the price, the schedule, what happens after the deposit. I always knew exactly where I stood.",
      author: "Tunde Bakare",
      role: "First-time land buyer",
    },
    {
      id: "amara-okonkwo",
      quote:
        "We have partnered with Dexta on three developments now. They hold delivery to the same standard we hold the drawings to, and they protect the design intent right through to handover. That is rare.",
      author: "Amara Okonkwo",
      role: "Principal Architect, Studio Lattice",
    },
  ],
  statisticsSection: {
    eyebrow: "Proof over promises",
    title:
      "Every figure here is a client served, a partnership built, a project *delivered*.",
  },
  statistics: [
    {
      id: "clients",
      value: "150+",
      copy: "Satisfied Clients who trusted us with their real estate journey.",
      highlight: "Clients",
      image: "/images/dexta-residential.jpg",
    },
    {
      id: "partners",
      value: "12+",
      copy: "Partners delivering value through strong collaborations.",
      highlight: "Partners",
      image: "/images/residence-interior.png",
    },
    {
      id: "projects",
      value: "03+",
      copy: "Completed Projects built with quality, purpose, and precision.",
      highlight: "Projects",
      image: "/images/project-kingsway.jpg",
    },
  ],
  blogSection: {
    eyebrow: "Blog",
    title: "Insights for *smarter* real estate decisions",
  },
  blog: (
    [
      [
        "ai-land-acquisition",
        "How to incorporate AI in your land acquisition process in 2026",
        "/images/blog-ai.jpg",
      ],
      [
        "commercial-real-estate",
        "5 signs you're ready to invest in commercial real estate",
        "/images/blog-commercial.jpg",
      ],
      [
        "zoning-laws",
        "Understanding zoning laws before buying your first property",
        "/images/blog-zoning.jpg",
      ],
      [
        "homeownership-costs",
        "The hidden costs of homeownership nobody talks about",
        "/images/blog-homeownership.jpg",
      ],
      [
        "market-forecast",
        "Market forecast: where property values are headed in 2027",
        "/images/blog-forecast.jpg",
      ],
      [
        "mortgage-rates",
        "First-time buyer's guide to navigating mortgage rates",
        "/images/blog-mortgage.jpg",
      ],
    ] as const
  ).map(([id, title, image]) => ({
    id,
    title,
    image,
    href: "/blog",
    publishedAt: "July 28, 2026",
    readingTime: "4 min read",
  })),
  aboutTeaser: {
    eyebrow: "Our story",
    title:
      "There's a team, a method, and a standard behind every Dexta *project*.",
    image: "/images/testimonial-shaka.jpg",
    cta: { label: "Read our story", href: "/about" },
  },
  dextaClan: {
    eyebrow: "Dexta Clan",
    title: "Learning how property works? There's a *place* for you.",
    copy: "Dexta Clan is our learning community for first-time buyers, diaspora investors, and anyone figuring out African real estate — no jargon, no gatekeeping.",
    benefits: [
      "Live workshops and open Q&As with the Dexta team",
      "Plain-language guides to buying, documentation, and due diligence",
      "Early looks at new estates and serviced plots",
    ],
    cta: { label: "Join the Dexta Clan", href: "/contact" },
  },
  newsletter: {
    eyebrow: "Join the insider list",
    title: "The insights investors act on — *before* everyone else does.",
    description:
      "Off-market listings, market intelligence and expert analysis — delivered straight to your inbox. No noise, no spam.",
  },
} satisfies HomePageContent;
