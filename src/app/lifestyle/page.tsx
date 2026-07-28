import type { Metadata } from "next";
import { LifestyleScreen } from "@/features/lifestyle";
export const metadata: Metadata = {
  title: "Lifestyle",
  description:
    "Explore the considered lifestyle behind every Maison Rouge residence.",
};
export default function LifestylePage() {
  return <LifestyleScreen />;
}
