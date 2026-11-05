import { Container, Grid, Page, Section, Stack } from "@/components/layout";
import { MarketingHeading, MediaHero } from "@/components/marketing";
import { Badge, ButtonLink, Icon } from "@/components/ui";
import type { BackendCareerListing } from "@/lib/backend-client";

interface CareersScreenProps {
  listings?: BackendCareerListing[];
}

export function CareersScreen({ listings = [] }: CareersScreenProps) {
  return (
    <Page>
      <MediaHero
        eyebrow="Careers at Dexta Africa"
        title={["A standard of craft", "you can *believe in*."]}
        description="Join a multidisciplinary collective of architects, development managers, and creative strategists shaping landmark residential communities."
        image="/images/dexta-residential.jpg"
        primary={{ label: "View open roles", href: "#open-roles" }}
      />

      <Section tone="surface" spacing="editorial">
        <Stack gap="2xl">
          <Container className="max-w-editorial-heading">
            <MarketingHeading
              eyebrow="Working with us"
              title="Disciplined execution. Lasting impact."
            />
          </Container>
          <Grid columns="three" gap="lg">
            <div className="rounded-xl border border-border bg-background p-8">
              <span className="flex size-10 items-center justify-center rounded-lg bg-primary-subtle text-primary">
                <Icon name="architecture" size={20} />
              </span>
              <h3 className="mt-5 font-display text-lg font-semibold text-foreground">
                Architectural Integrity
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                We design for endurance, climate resilience, and dignity rather
                than fleeting trends.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-background p-8">
              <span className="flex size-10 items-center justify-center rounded-lg bg-primary-subtle text-primary">
                <Icon name="system" size={20} />
              </span>
              <h3 className="mt-5 font-display text-lg font-semibold text-foreground">
                Rigorous Delivery
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Engineering excellence, precise timelines, and full
                accountability to our residents and co-investors.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-background p-8">
              <span className="flex size-10 items-center justify-center rounded-lg bg-primary-subtle text-primary">
                <Icon name="badge-check" size={20} />
              </span>
              <h3 className="mt-5 font-display text-lg font-semibold text-foreground">
                Collective Growth
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Competitive executive reward, continuous mentorship, and direct
                exposure to continent-defining developments.
              </p>
            </div>
          </Grid>
        </Stack>
      </Section>

      <Section id="open-roles" tone="default" spacing="editorial">
        <Stack gap="2xl">
          <Container className="max-w-editorial-heading">
            <MarketingHeading
              eyebrow="Open appointments"
              title="Current leadership & specialist opportunities."
            />
          </Container>

          <Stack gap="lg" className="mx-auto max-w-4xl">
            {listings.map((job) => (
              <div
                key={job.id}
                className="group flex flex-col justify-between gap-6 rounded-2xl border border-border bg-surface p-8 transition-all hover:border-primary/40 hover:shadow-md sm:flex-row sm:items-center"
              >
                <div className="max-w-2xl">
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge>{job.department}</Badge>
                    <span className="text-xs text-muted-foreground">
                      {job.location} · {job.type}
                    </span>
                  </div>
                  <h3 className="mt-3 font-display text-xl font-bold text-foreground transition-colors group-hover:text-primary">
                    {job.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {job.summary}
                  </p>
                  {job.requirements && job.requirements.length > 0 && (
                    <ul className="mt-4 space-y-1.5 text-xs text-muted-foreground">
                      {job.requirements.slice(0, 2).map((req) => (
                        <li key={req} className="flex items-start gap-2">
                          <span className="text-primary">•</span>
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="shrink-0">
                  <ButtonLink
                    href={`/contact?interest=General+enquiry&message=${encodeURIComponent(
                      `I am expressing interest in the ${job.title} role (${job.department}).`,
                    )}`}
                    variant="outline"
                  >
                    Apply now
                  </ButtonLink>
                </div>
              </div>
            ))}
          </Stack>
        </Stack>
      </Section>
    </Page>
  );
}
