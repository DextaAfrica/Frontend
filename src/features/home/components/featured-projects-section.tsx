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

/**
 * The homepage portfolio, back to the row/column mosaic the client
 * specifically asked to keep — one large feature card plus two compact ones
 * — but re-built with the glass-badge and frosted-panel language the rest
 * of the site now uses: a "Now Selling" chip with a real light-shimmer over
 * every photo, a Playfair Display project name (`font-serif`, the site's
 * one editorial typeface), and a red brand-accent hairline marking each
 * card's collapsed edge. Palton Morgan's own grid — the reference the brief
 * pointed at — leans on static photography with almost no motion; this
 * pushes further with a slow ambient Ken Burns push on every image and a
 * considered hover reveal, never a flat, static tile.
 */
export function FeaturedProjectsSection({
  projects,
  heading,
}: {
  projects: readonly ProjectContent[];
  heading: HomePageContent["projectsSection"];
}) {
  return (
    <Section
      spacing="editorial"
      tone="surface"
      aria-labelledby="projects-heading"
    >
      <EditorialSectionHeading
        eyebrow={heading.eyebrow}
        title={heading.title}
        headingId="projects-heading"
      />

      <RevealGroup className="project-mosaic mt-14 grid gap-project-grid md:grid-cols-12 md:grid-rows-2">
        {projects.map((project) => (
          <RevealItem
            as="article"
            key={project.id}
            className={cn(
              "aspect-[4/3] min-h-0 md:aspect-auto",
              projectLayouts[project.layout],
            )}
          >
            <div className="group project-card relative size-full overflow-hidden rounded-panel bg-muted focus-within:ring-2 focus-within:ring-ring">
              <div className="project-card-media absolute inset-0">
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
                  className="object-cover"
                />
              </div>
              <span
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20"
              />

              <div className="absolute inset-x-0 top-0 z-10 flex items-start justify-end gap-5 p-project-card">
                <span className="project-badge inline-flex items-center gap-1.5 rounded-full border border-on-media-border bg-on-media-surface px-3 py-1.5 text-status tracking-project-status text-on-media uppercase backdrop-blur-md">
                  <Icon name="badge-check" size={12} />
                  {project.status}
                </span>
              </div>

              <div className="project-card-panel absolute inset-x-0 bottom-0 z-10 p-project-card text-on-media">
                <div className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-end sm:gap-6">
                  <div>
                    <h3 className="font-serif text-project-title leading-editorial font-semibold tracking-editorial">
                      {project.name}
                    </h3>
                    <p className="mt-2 text-sm text-on-media-muted">
                      {project.location}
                    </p>
                    <p className="mt-3 hidden max-w-md text-sm text-on-media/80 sm:block">
                      {project.description}
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
