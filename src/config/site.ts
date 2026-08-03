export const siteConfig = {
  name: "Dexta Africa",
  description:
    "Value-driven real estate solutions that turn dreams into addresses.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  navItems: [
    { label: "Projects", href: "/portfolio" },
    { label: "Careers", href: "/careers" },
    { label: "Blog", href: "/journal" },
    { label: "About us", href: "/about" },
    { label: "Contact us", href: "/contact" },
  ],
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
        title: "Company",
        links: [
          { label: "About us", href: "/about" },
          { label: "FAQ", href: "/about" },
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
  social: ["Instagram", "LinkedIn", "Pinterest"],
} as const;

export type SiteConfig = typeof siteConfig;
