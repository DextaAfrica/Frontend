import { Container, Grid, Page, Section, Stack } from "@/components/layout";
import {
  MarketingHeading,
  MediaHero,
  ProjectCard,
  ServiceLineBand,
} from "@/components/marketing";
import { projects } from "../data/projects";
import { serviceLines } from "../data/service-lines";

export function ProjectsScreen() {
  return (
    <Page>
      <MediaHero
        eyebrow="Our projects"
        title={["*Landmarks* with a lasting", "point of view."]}
        description="Each address responds to its place while sharing our commitment to timeless form, thoughtful living, and enduring value."
        image="/images/project-kingsway.jpg"
        primary={{ label: "Discuss a residence", href: "/contact" }}
      />

      <Section spacing="editorial" tone="default">
        <Stack gap="2xl">
          <Container className="max-w-editorial-heading">
            <MarketingHeading
              eyebrow="What we build"
              title="Three lines of business, one accountable team."
            />
          </Container>
          <Stack gap="2xl">
            {serviceLines.map((line, index) => (
              <ServiceLineBand
                key={line.id}
                eyebrow={line.eyebrow}
                title={line.title}
                description={line.description}
                scope={line.scope}
                image={line.image}
                reverse={index % 2 === 1}
              />
            ))}
          </Stack>
        </Stack>
      </Section>

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
