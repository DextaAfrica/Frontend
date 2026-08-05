import type { Metadata } from "next";
import { JournalScreen } from "@/features/journal";
export const metadata: Metadata = {
  title: "Journal",
  description:
    "Perspectives on architecture, material, place, culture, and home.",
  alternates: { canonical: "/journal" },
};
export default function JournalPage() {
  return <JournalScreen />;
}
