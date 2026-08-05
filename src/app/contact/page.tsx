import type { Metadata } from "next";
import { ContactScreen } from "@/features/contact";
export const metadata: Metadata = {
  title: "Contact",
  description: "Speak with the Dexta Africa client team.",
  alternates: { canonical: "/contact" },
};
export default function ContactPage() {
  return <ContactScreen />;
}
