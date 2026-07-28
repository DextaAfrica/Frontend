export const siteConfig = {
  name: "Maison Rouge",
  description:
    "Considered spaces, enduring design, and a more meaningful way to live.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  navItems: [
    { label: "About", href: "/about" },
    { label: "Portfolio", href: "/portfolio" },
    { label: "Lifestyle", href: "/lifestyle" },
    { label: "Journal", href: "/journal" },
    { label: "Contact", href: "/contact" },
  ],
  contact: {
    phone: "+234 800 000 0000",
    email: "hello@maisonrouge.example",
    address: "12 Kingsway Road, Ikoyi, Lagos",
  },
  social: ["Instagram", "LinkedIn", "Pinterest"],
} as const;

export type SiteConfig = typeof siteConfig;
