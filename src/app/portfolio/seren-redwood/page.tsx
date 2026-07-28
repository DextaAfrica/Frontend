import type { Metadata } from "next";
import { DevelopmentScreen } from "@/features/development";
export const metadata: Metadata = {
  title: "Seren Redwood",
  description: "Private lagoon-facing residences in Ikoyi, Lagos.",
};
export default function SerenRedwoodPage() {
  return <DevelopmentScreen />;
}
