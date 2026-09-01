export const siteConfig = {
  name: "Dexta Africa",
  description:
    "Value-driven real estate solutions that turn dreams into addresses.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  ogImage: "/images/dexta-hero-poster.jpg",
  navItems: [
    { label: "Projects", href: "/projects" },
    { label: "Careers", href: "/careers" },
    { label: "Blog", href: "/blog" },
    { label: "About us", href: "/about" },
    { label: "Contact us", href: "/contact" },
  ],
  navigation: {
    appointmentEyebrow: "Private appointments",
    appointmentDescription:
      "Explore residences shaped by architecture, landscape, and a more considered way of living.",
    appointmentCta: "Book Inspection",
    appointmentHref: "/contact",
  },
  contact: {
    phone: "+234 811 400 0480",
    email: "hi@dextaafrica.com",
    address:
      "House 6a, Block 28, Road 14, Garba Mohammed Lawal Ave, Lekki Peninsula II, Lagos, Nigeria",
    shortCode: "0700-DEXTA-AFRICA",
    supportLabel: "X Support",
    availability: "Our lines are available 24/7",
  },
  footer: {
    groups: [
      {
        title: "Quick Links",
        links: [
          { label: "Projects", href: "/projects" },
          { label: "About Us", href: "/about" },
          { label: "Blog", href: "/blog" },
          { label: "Careers", href: "/careers" },
        ],
      },
      {
        title: "Legal",
        links: [
          { label: "Privacy Policy", href: "/privacy" },
          { label: "Project Delivery", href: "/terms" },
          { label: "Terms of Use", href: "/terms" },
          { label: "Refund Policy", href: "/terms" },
        ],
      },
    ],
  },
  legal: {
    registration: "© Dexta Africa Limited is Registered with LASERA",
  },
  social: [
    { label: "Facebook", href: "https://facebook.com/dextaafrica", icon: "facebook" },
    { label: "Instagram", href: "https://instagram.com/dextaafrica", icon: "instagram" },
    { label: "LinkedIn", href: "https://linkedin.com/company/dextaafrica", icon: "linkedin" },
    { label: "YouTube", href: "https://youtube.com/@dextaafrica", icon: "youtube" },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
