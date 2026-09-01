import type { Metadata } from "next";
import { CareersScreen } from "@/features/careers";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Join a multidisciplinary team building thoughtful, exacting real estate across Nigeria.",
  alternates: { canonical: "/careers" },
};

export default function CareersPage() {
  return <CareersScreen />;
}
