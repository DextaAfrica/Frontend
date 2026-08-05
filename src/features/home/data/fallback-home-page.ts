import type { HomePageContent } from "../types/home-page";

export const fallbackHomePageContent = {
  hero: {
    titleLines: ["Your partner in", "building wealth"],
    ctaLabel: "Contact Sales",
    ctaHref: "/contact",
    video: "/media/dexta-hero-desktop.webm",
    mobileVideo: "/media/dexta-hero-mobile.webm",
    poster: "/images/dexta-hero-poster.jpg",
  },
  intro: {
    heading: "Who we are",
    paragraphs: [
      "From site to skyline, Dexta Africa delivers value-driven real estate solutions that turn dreams into addresses.",
      "Whether you're investing, living, or learning, we have the right opportunity for you.",
    ],
  },
  services: [
    {
      id: "residential-development",
      number: "01",
      label: "Building the future",
      title: "Residential Development",
      description:
        "From acquisition to construction, through to marketing and sales, we transform your vision into reality.",
      image: "/images/dexta-residential.jpg",
    },
    {
      id: "site-and-service",
      number: "02",
      label: "Land with purpose",
      title: "Site and Service Development",
      description:
        "Offering strategically located sites with top-tier services, ensuring fully serviced plots that meet standards.",
      image: "/images/service-site-and-service.png",
    },
    {
      id: "hospitality-development",
      number: "03",
      label: "Investment meets lifestyle",
      title: "Hospitality Development",
      description:
        "We design and manage world-class hospitality spaces that are perfect for modern travelers and investors.",
      image: "/images/service-hospitality.jpg",
    },
  ],
  projectsSection: {
    eyebrow: "Featured Projects",
    title: "Projects that speak for themselves",
    ctaLabel: "View all projects",
    ctaHref: "/portfolio",
    cardCtaLabel: "View project",
  },
  projects: [
    {
      id: "dlodge-apartment",
      number: "01",
      name: "D'lodge Apartment",
      location: "Lekki Peninsula 2",
      status: "Now selling",
      image: "/images/project-dlodge.jpg",
      href: "/portfolio",
      layout: "feature",
    },
    {
      id: "olumo-county-estate",
      number: "02",
      name: "Olumo County Estate",
      location: "Kobape, Ogun state",
      status: "Available plots",
      image: "/images/project-olumo.jpg",
      href: "/portfolio",
      layout: "compact",
    },
    {
      id: "kingsway-estate",
      number: "03",
      name: "Kingsway Estate",
      location: "Ijebu-Ode, Ogun State",
      status: "Now selling",
      image: "/images/project-kingsway.jpg",
      href: "/portfolio",
      layout: "compact",
    },
  ],
  testimonialSection: {
    eyebrow: "Testimonials",
    title: "Words from those who trusted us",
  },
  testimonial: {
    id: "shaka-vanessa",
    quote:
      "I’m honestly impressed with the quality of D’lennox project. Everything from the foundation to the structure looks really amazing - exactly as promised. The team was professional and kept me updated at every stage. It’s truly feeling like home already.",
    author: "Shaka Vanessa",
    role: "Realtor",
    portrait: "/images/testimonial-shaka.jpg",
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
      image: "/images/maison-interior.png",
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
    title: "Insights for smarter real estate decisions",
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
    href: "/journal",
    publishedAt: "July 28, 2026",
    readingTime: "4 min read",
  })),
  newsletter: {
    eyebrow: "Stay informed",
    title: "Get the latest updates from Dexta",
  },
} satisfies HomePageContent;
