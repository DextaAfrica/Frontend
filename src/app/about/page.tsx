import type { Metadata } from "next";
import { AboutScreen } from "@/features/about";
export const metadata: Metadata = {
  title: "About",
  description: "Discover the philosophy and principles behind Dexta Africa.",
  alternates: { canonical: "/about" },
};
export default function AboutPage() {
  return <AboutScreen />;
}
