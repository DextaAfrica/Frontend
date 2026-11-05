import type { Metadata } from "next";
import { BlogScreen } from "@/features/blog";
import { backendClient } from "@/lib/backend-client";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Perspectives on architecture, material, place, culture, and home.",
  alternates: { canonical: "/blog" },
};

export default async function BlogPage() {
  const articles = await backendClient.journal.list();
  return <BlogScreen articles={articles} />;
}
