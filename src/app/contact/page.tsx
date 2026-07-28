import type { Metadata } from "next";
import { ContactScreen } from "@/features/contact";
export const metadata: Metadata = {
  title: "Contact",
  description: "Speak with the Maison Rouge private client team.",
};
export default function ContactPage() {
  return <ContactScreen />;
}
