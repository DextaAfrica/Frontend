import type { Metadata } from "next";
import { ProjectsScreen } from "@/features/projects";
import { backendClient } from "@/lib/backend-client";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Explore Dexta Africa developments and investment opportunities.",
  alternates: { canonical: "/projects" },
};

export default async function ProjectsPage() {
  const projects = await backendClient.portfolio.list();
  return <ProjectsScreen projects={projects} />;
}
