import { Grid, Page, Section, Stack } from "@/components/layout";
import {
  CtaBand,
  EditorialHero,
  MarketingHeading,
  ProjectGallery,
} from "@/components/marketing";
import type { Project } from "@/components/marketing";
import { Badge, Icon, type IconName } from "@/components/ui";

const factIcons: readonly IconName[] = [
  "architecture",
  "badge-check",
  "system",
  "pin",
];

// A project without real campaign copy of its own still needs a title for
// its hero — this is deliberately generic marketing language, never a
// factual claim, so it's safe to reuse across any project that hasn't
// supplied a `tagline` yet.
const fallbackTagline = (status: string) =>
  status === "Completed"
    ? "An enduring expression of *home*."
    : "Private by nature. *Remarkable* by design.";

/**
 * A project's own page — a product-listing page for real estate: hero,
 * then (only when the project actually has the material) a facts strip and
 * a proper photo gallery, closing on a CTA. Every section past the hero is
 * conditional on the project actually having that content — no invented
 * pricing, unit counts, or amenities standing in for a project that hasn't
 * supplied them.
 */
export function ProjectScreen({ project }: { project: Project }) {
  const hasFacts =
    Boolean(project.priceFrom) || Boolean(project.features?.length);
  const hasGallery = Boolean(project.gallery?.length);

  return (
    <Page>
      <EditorialHero
        eyebrow={`${project.name} · ${project.location}`}
        title={project.tagline ?? fallbackTagline(project.status)}
        description={project.description}
        primary={{ label: "Register your interest", href: "/contact" }}
        secondary={
          hasGallery ? { label: "View gallery", href: "#gallery" } : undefined
        }
      />

      {hasFacts && (
        <Section tone="surface" spacing="sm">
          <Stack gap="lg">
            <div className="flex flex-wrap items-center gap-4">
              <Badge>{project.status}</Badge>
              {project.priceFrom && (
                <p className="font-display text-lg font-semibold text-primary">
                  {project.priceFrom}
                </p>
              )}
            </div>
            {project.features && project.features.length > 0 && (
              <Grid columns="four" gap="lg">
                {project.features.map((feature, index) => (
                  <div key={feature} className="flex items-start gap-3">
                    <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-primary-subtle text-primary">
                      <Icon
                        name={
                          factIcons[index % factIcons.length] ?? "badge-check"
                        }
                        size={18}
                      />
                    </span>
                    <p className="text-sm text-foreground">{feature}</p>
                  </div>
                ))}
              </Grid>
            )}
          </Stack>
        </Section>
      )}

      {hasGallery && project.gallery && (
        <Section id="gallery">
          <Stack gap="xl">
            <MarketingHeading eyebrow="Gallery" title="Inside the residence." />
            <ProjectGallery images={project.gallery} />
          </Stack>
        </Section>
      )}

      <CtaBand
        title={`Ready to make *${project.name}* yours?`}
        ctaLabel="Register your interest"
        ctaHref="/contact"
        image={project.gallery?.[0]?.src ?? project.image}
      />
    </Page>
  );
}
