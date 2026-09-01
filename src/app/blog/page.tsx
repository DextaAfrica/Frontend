import type { Metadata } from "next";
import { JournalScreen } from "@/features/journal";
export const metadata: Metadata = {
  title: "Blog",
  description:
    "Perspectives on architecture, material, place, culture, and home.",
  alternates: { canonical: "/blog" },
};
export default function BlogPage() {
  return <JournalScreen />;
}
