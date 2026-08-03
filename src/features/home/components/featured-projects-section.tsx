import Image from "next/image";
import Link from "next/link";
import { Grid, Section } from "@/components/layout";
import { EditorialSectionHeading } from "@/components/marketing";
import { ButtonLink } from "@/components/ui";
import { featuredProjects } from "../data/featured-projects";

export function FeaturedProjectsSection() {
  return (
    <Section spacing="editorial" tone="surface">
      <EditorialSectionHeading
        eyebrow="Featured projects"
        title="Delivering world class projects"
      />

      <Grid columns="two" gap="sm" className="mt-14 gap-y-projects">
        {featuredProjects.map((project, index) => (
          <article
            key={project.name}
            className={
              index === 1
                ? "md:col-start-2 md:mt-24"
                : index === 2
                  ? "md:col-span-2"
                  : undefined
            }
          >
            <Link href="/portfolio" className="group block">
              <div
                className={
                  index === 2
                    ? "relative aspect-[1240/676] overflow-hidden"
                    : "relative aspect-[623/336] overflow-hidden"
                }
              >
                <Image
                  src={project.image}
                  alt={project.name}
                  fill
                  sizes={
                    index === 2 ? "86vw" : "(min-width: 768px) 43vw, 100vw"
                  }
                  className="object-cover transition-transform duration-700 ease-[var(--ease-premium)] group-hover:scale-[1.015]"
                />
              </div>
              <div className="mt-4 flex justify-between gap-6 text-base leading-none">
                <h3 className="font-medium">{project.name}</h3>
                <p className="text-right">{project.location}</p>
              </div>
            </Link>
          </article>
        ))}
      </Grid>

      <ButtonLink
        href="/portfolio"
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
        Explore Projects
      </ButtonLink>
    </Section>
  );
}
