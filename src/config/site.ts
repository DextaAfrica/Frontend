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
  },
  social: ["Instagram", "LinkedIn", "Pinterest"],
} as const;

export type SiteConfig = typeof siteConfig;
