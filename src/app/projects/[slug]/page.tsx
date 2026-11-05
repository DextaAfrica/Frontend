import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { projects, ProjectScreen } from "@/features/projects";
import { siteConfig } from "@/config/site";
import { backendClient } from "@/lib/backend-client";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await backendClient.portfolio.getBySlug(slug);

  return project
    ? {
        title: project.name,
        description: project.description,
        alternates: { canonical: `/projects/${slug}` },
        openGraph: {
          title: project.name,
          description: project.description,
          images: [{ url: project.image ?? siteConfig.ogImage }],
        },
      }
    : {};
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await backendClient.portfolio.getBySlug(slug);
  if (!project) notFound();
  return <ProjectScreen project={project} />;
}
