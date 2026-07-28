import { Grid, Page, Section, Stack } from "@/components/layout";
import {
  EditorialHero,
  MarketingHeading,
  MediaPanel,
  ProjectCard,
  QuoteBlock,
} from "@/components/marketing";
import { ButtonLink, Icon } from "@/components/ui";
import { projects } from "@/data/projects";

export function HomeScreen() {
  return (
    <Page>
      <EditorialHero
        eyebrow="Maison Rouge residences"
        title="An address shaped by intention."
        description="We create considered residences where architecture, landscape, and daily life exist in lasting harmony."
        primary={{ label: "Explore our portfolio", href: "/portfolio" }}
        secondary={{ label: "Discover our story", href: "/about" }}
      />
      <Section tone="surface">
        <Grid columns="two" gap="xl" className="items-center">
          <MediaPanel
            label="Architecture composed around light"
            className="min-h-[34rem]"
          />
          <Stack gap="lg">
            <MarketingHeading
              eyebrow="Our philosophy"
              title="Enduring value meets quiet confidence."
              description="We choose clarity over excess and craft over speed. Every line, material, and shared space is considered for how it will feel today—and how beautifully it will endure."
            />
            <ButtonLink href="/about" variant="link">
              Our approach <Icon name="arrow-right" />
            </ButtonLink>
          </Stack>
        </Grid>
      </Section>
      <Section>
        <Stack gap="2xl">
          <MarketingHeading
            eyebrow="The collection"
            title="Distinct places. One exacting standard."
            description="A curated portfolio of residences built around location, proportion, material, and the rituals of everyday life."
          />
          <Grid columns="two" gap="lg">
            {projects.slice(0, 2).map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </Grid>
          <ButtonLink
            href="/portfolio"
            variant="outline"
            size="lg"
            className="mx-auto"
          >
            View complete portfolio
          </ButtonLink>
        </Stack>
      </Section>
      <QuoteBlock
        quote="A truly remarkable home is not defined by spectacle, but by how naturally every detail belongs."
        author="Amara Okoye"
        role="Creative Director"
      />
      <Section>
        <Grid columns="two" gap="xl" className="items-center">
          <Stack gap="lg">
            <MarketingHeading
              eyebrow="A life well considered"
              title="More than a residence."
              description="Private amenities, intuitive service, wellness, dining, and culture come together to make every day feel complete."
            />
            <ButtonLink href="/lifestyle" variant="link">
              Explore the lifestyle <Icon name="arrow-right" />
            </ButtonLink>
          </Stack>
          <MediaPanel
            label="A quieter expression of luxury"
            tone="dusk"
            className="min-h-[30rem]"
          />
        </Grid>
      </Section>
    </Page>
  );
}
