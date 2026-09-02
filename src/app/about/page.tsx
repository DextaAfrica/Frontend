import type { Metadata } from "next";
import { AboutScreen } from "@/features/about";
import { getAboutPageContent } from "@/features/about/server/get-about-page-content";

export const metadata: Metadata = {
  title: "About",
  description:
    "The people, principles, and journey behind Dexta Africa — value-focused real estate from land acquisition to development and beyond.",
  alternates: { canonical: "/about" },
};

export default async function AboutPage() {
  const content = await getAboutPageContent();
  return <AboutScreen content={content} />;
}
