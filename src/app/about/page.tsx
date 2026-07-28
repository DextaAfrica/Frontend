import type { Metadata } from "next";
import { AboutScreen } from "@/features/about";
export const metadata: Metadata = {
  title: "About",
  description: "Discover the philosophy and principles behind Maison Rouge.",
};
export default function AboutPage() {
  return <AboutScreen />;
}
