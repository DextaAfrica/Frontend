import type { Metadata } from "next";
import { BlogScreen } from "@/features/blog";
export const metadata: Metadata = {
  title: "Blog",
  description:
    "Perspectives on architecture, material, place, culture, and home.",
  alternates: { canonical: "/blog" },
};
export default function BlogPage() {
  return <BlogScreen />;
}
