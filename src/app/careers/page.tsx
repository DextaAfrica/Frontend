import type { Metadata } from "next";
import { CareersScreen } from "@/features/careers";
import { backendClient } from "@/lib/backend-client";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Join a multidisciplinary team building thoughtful, exacting real estate across Nigeria.",
  alternates: { canonical: "/careers" },
};

export default async function CareersPage() {
  const listings = await backendClient.careers.list();
  return <CareersScreen listings={listings} />;
}
