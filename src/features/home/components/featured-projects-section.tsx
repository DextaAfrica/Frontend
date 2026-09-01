import Image from "next/image";
import { Section } from "@/components/layout";
import {
  EditorialSectionHeading,
  RevealGroup,
  RevealItem,
} from "@/components/marketing";
import { ButtonLink, Icon } from "@/components/ui";
import { isRemoteAsset } from "@/lib/media";
import { cn } from "@/lib/utils";
import type {
  HomePageContent,
  ProjectContent,
  ProjectLayout,
} from "../types/home-page";

const projectLayouts: Record<ProjectLayout, string> = {
  feature: "project-card-feature md:col-span-7 md:row-span-2",
  compact: "project-card-compact md:col-span-5",
};

export function FeaturedProjectsSection({
  projects,
  heading,
}: {
  projects: readonly ProjectContent[];
  heading: HomePageContent["projectsSection"];
}) {
  return (
    <Section spacing="editorial" tone="surface">
      <EditorialSectionHeading
        eyebrow={heading.eyebrow}
        title={heading.title}
      />

      <RevealGroup className="project-mosaic mt-14 grid gap-project-grid md:grid-cols-12 md:grid-rows-2">
        {projects.map((project) => (
          <RevealItem
            as="article"
            key={project.id}
            className={cn("min-h-0", projectLayouts[project.layout])}
          >
            <div className="group project-card relative size-full overflow-hidden bg-muted focus-within:ring-2 focus-within:ring-ring">
              <Image
                src={project.image}
                alt={project.name}
                fill
                sizes={
                  project.layout === "feature"
                    ? "(min-width: 768px) 55vw, 100vw"
                    : "(min-width: 768px) 40vw, 100vw"
                }
                unoptimized={isRemoteAsset(project.image)}
                className="duration-project-media object-cover transition-transform ease-premium group-hover:scale-project-media group-focus-visible:scale-project-media"
              />
              <span
                aria-hidden
                className="project-card-shade absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/25"
              />
              <div className="absolute inset-x-0 top-0 z-10 flex items-start justify-between gap-5 p-project-card text-on-media">
                <span className="font-mono text-xs tracking-project-index text-on-media-muted">
                  {project.number}
                </span>
                <span className="border border-on-media-border bg-on-media-surface px-3 py-1.5 text-status tracking-project-status uppercase backdrop-blur-md">
                  {project.status}
                </span>
              </div>
              <div className="project-card-panel absolute inset-x-0 bottom-0 z-10 bg-brand-light p-project-card text-brand-dark">
                <span className="mb-4 block h-px w-divider bg-brand-dark" />
                <div className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-end sm:gap-6">
                  <div>
                    <h3 className="font-display text-project-title leading-editorial font-semibold tracking-editorial">
                      {project.name}
                    </h3>
                    <p className="mt-2 text-sm text-brand-dark/65">
                      {project.location}
                    </p>
                  </div>
                  <ButtonLink
                    href={project.href}
                    variant="primary"
                    size="sm"
                    className="project-card-action shrink-0"
                    aria-label={`${heading.cardCtaLabel}: ${project.name}`}
                  >
                    {heading.cardCtaLabel}
                    <Icon name="arrow-right" />
                  </ButtonLink>
                </div>
              </div>
            </div>
          </RevealItem>
        ))}
      </RevealGroup>

      <div className="mt-projects flex justify-end">
        <ButtonLink href={heading.ctaHref} variant="neutral" size="lg">
          {heading.ctaLabel}
          <Icon name="arrow-right" />
        </ButtonLink>
      </div>
    </Section>
  );
}
