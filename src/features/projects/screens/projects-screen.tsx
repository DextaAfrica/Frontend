import { Grid, Page, Section, Stack } from "@/components/layout";
import {
  EditorialHero,
  MarketingHeading,
  ProjectCard,
} from "@/components/marketing";
import { projects } from "../data/projects";

export function ProjectsScreen() {
  return (
    <Page>
      <EditorialHero
        eyebrow="Our projects"
        title="*Landmarks* with a lasting point of view."
        description="Each address responds to its place while sharing our commitment to timeless form, thoughtful living, and enduring value."
        primary={{ label: "Discuss a residence", href: "/contact" }}
      />
      <Section tone="surface">
        <Stack gap="2xl">
          <MarketingHeading
            eyebrow="The collection"
            title="Now selling and coming soon."
          />
          <Grid columns="two" gap="lg">
            {projects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </Grid>
        </Stack>
      </Section>
    </Page>
  );
}
