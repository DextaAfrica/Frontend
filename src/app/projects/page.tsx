import type { Metadata } from "next";
import { ProjectsScreen } from "@/features/projects";
export const metadata: Metadata = {
  title: "Projects",
  description:
    "Explore Dexta Africa developments and investment opportunities.",
  alternates: { canonical: "/projects" },
};
export default function ProjectsPage() {
  return <ProjectsScreen />;
}
