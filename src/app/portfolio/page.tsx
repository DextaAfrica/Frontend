import type { Metadata } from "next";
import { PortfolioScreen } from "@/features/portfolio";
export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Explore Dexta Africa developments and investment opportunities.",
  alternates: { canonical: "/portfolio" },
};
export default function PortfolioPage() {
  return <PortfolioScreen />;
}
