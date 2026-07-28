import type { Metadata } from "next";
import { PortfolioScreen } from "@/features/portfolio";
export const metadata: Metadata = {
  title: "Portfolio",
  description: "Explore the Maison Rouge collection of considered residences.",
};
export default function PortfolioPage() {
  return <PortfolioScreen />;
}
