import type { Metadata } from "next";
import { LifestyleScreen } from "@/features/lifestyle";
export const metadata: Metadata = {
  title: "Lifestyle",
  description:
    "Explore the considered lifestyle behind every Dexta Africa residence.",
  alternates: { canonical: "/lifestyle" },
};
export default function LifestylePage() {
  return <LifestyleScreen />;
}
