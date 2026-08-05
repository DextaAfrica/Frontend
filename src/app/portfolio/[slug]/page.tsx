import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DevelopmentScreen } from "@/features/development";
import { siteConfig } from "@/config/site";
import { projects } from "@/data/projects";

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
  const project = projects.find((item) => item.slug === slug);
  return project
    ? {
        title: project.name,
        description: project.description,
        alternates: { canonical: `/portfolio/${slug}` },
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
  const project = projects.find((item) => item.slug === slug);
  if (!project) notFound();
  return <DevelopmentScreen project={project} />;
}
