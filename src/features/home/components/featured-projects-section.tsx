import Image from "next/image";
import Link from "next/link";
import { Grid, Section } from "@/components/layout";
import { EditorialSectionHeading } from "@/components/marketing";
import { ButtonLink } from "@/components/ui";
import { isRemoteAsset } from "@/lib/media";
import type { HomePageContent, ProjectContent } from "../types/home-page";

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

      <Grid columns="two" gap="sm" className="mt-14 gap-y-projects">
        {projects.map((project, index) => (
          <article
            key={project.id}
            className={
              index === 1
                ? "md:col-start-2 md:mt-24"
                : index === 2
                  ? "md:col-span-2"
                  : undefined
            }
          >
            <Link href={project.href} className="group block">
              <div
                className={
                  index === 2
                    ? "project-media project-media-wide"
                    : "project-media"
                }
              >
                <Image
                  src={project.image}
                  alt={project.name}
                  fill
                  sizes={
                    index === 2 ? "86vw" : "(min-width: 768px) 43vw, 100vw"
                  }
                  unoptimized={isRemoteAsset(project.image)}
                  className="object-cover transition-transform duration-700 ease-[var(--ease-premium)] group-hover:scale-[1.015]"
                />
              </div>
              <div className="mt-4 flex flex-col justify-between gap-2 text-sm leading-tight sm:flex-row sm:gap-6 sm:text-base sm:leading-none">
                <h3 className="font-medium">{project.name}</h3>
                <p className="text-right">{project.location}</p>
              </div>
            </Link>
          </article>
        ))}
      </Grid>

      <ButtonLink
        href={heading.ctaHref}
        variant="neutral"
        size="lg"
        className="mx-auto mt-projects w-projects-cta"
      >
        <Image
          src="/images/dexta-arrow.svg"
          alt=""
          width={20}
          height={20}
          className="invert dark:invert-0"
        />
        {heading.ctaLabel}
      </ButtonLink>
    </Section>
  );
}
