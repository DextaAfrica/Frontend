import Image from "next/image";
import Link from "next/link";
import { Container, Grid, Page, Section, Stack } from "@/components/layout";
import { MarketingHeading, MediaHero } from "@/components/marketing";
import { Badge, ButtonLink, Icon } from "@/components/ui";
import type { Article } from "../data/articles";
import { articles as defaultArticles } from "../data/articles";

interface BlogScreenProps {
  articles?: Article[];
}

export function BlogScreen({ articles }: BlogScreenProps = {}) {
  const displayArticles =
    articles && articles.length > 0 ? articles : defaultArticles;
  const [featured, ...remaining] = displayArticles;

  return (
    <Page>
      <MediaHero
        eyebrow="The Journal"
        title={["Perspectives on architecture,", "*material*, and place."]}
        description="Essays, design conversations, and architectural insights exploring contemporary living across Nigeria and the continent."
        image="/images/residence-interior.png"
      />

      {featured && (
        <Section tone="surface" spacing="lg">
          <Container className="max-w-6xl">
            <Link
              href={`/blog/${featured.slug}`}
              className="group relative block overflow-hidden rounded-2xl border border-border bg-background transition-all hover:border-primary/40 hover:shadow-xl"
            >
              <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
                <div className="relative aspect-[16/10] overflow-hidden lg:col-span-7">
                  <Image
                    src={featured.image}
                    alt={featured.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent lg:hidden" />
                </div>
                <div className="p-6 lg:col-span-5 lg:p-8">
                  <div className="flex items-center gap-3">
                    <Badge>{featured.category}</Badge>
                    <span className="text-xs text-muted-foreground">
                      {featured.date}
                    </span>
                  </div>
                  <h2 className="mt-4 font-display text-2xl font-bold tracking-tight text-foreground transition-colors group-hover:text-primary md:text-3xl">
                    {featured.title}
                  </h2>
                  <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                    {featured.introduction}
                  </p>
                  <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-primary">
                    <span>Read perspective</span>
                    <Icon name="arrow-right" size={16} />
                  </div>
                </div>
              </div>
            </Link>
          </Container>
        </Section>
      )}

      {remaining.length > 0 && (
        <Section spacing="editorial" tone="default">
          <Stack gap="2xl">
            <Container className="max-w-editorial-heading">
              <MarketingHeading
                eyebrow="Recent writings"
                title="Curated architectural discourse and design notes."
              />
            </Container>
            <Grid columns="three" gap="lg">
              {remaining.map((article) => (
                <Link
                  key={article.slug}
                  href={`/blog/${article.slug}`}
                  className="group flex flex-col overflow-hidden rounded-xl border border-border bg-surface transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden">
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-between p-6">
                    <div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <Badge>{article.category}</Badge>
                        <span>{article.date}</span>
                      </div>
                      <h3 className="mt-4 font-display text-lg font-semibold text-foreground transition-colors group-hover:text-primary">
                        {article.title}
                      </h3>
                      <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                        {article.introduction}
                      </p>
                    </div>
                    <div className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-primary">
                      <span>Explore story</span>
                      <Icon name="arrow-right" size={14} />
                    </div>
                  </div>
                </Link>
              ))}
            </Grid>
          </Stack>
        </Section>
      )}

      <Section tone="surface" spacing="editorial">
        <Container className="max-w-2xl text-center">
          <Stack gap="md" className="items-center">
            <span className="text-xs tracking-widest text-primary uppercase">
              Stay Informed
            </span>
            <h2 className="font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Join the Dexta Africa Journal
            </h2>
            <p className="text-sm text-muted-foreground">
              Receive quarterly architectural briefings, construction updates,
              and private acquisition invitations.
            </p>
            <div className="mt-4">
              <ButtonLink href="/contact" variant="primary">
                Subscribe to dispatches
              </ButtonLink>
            </div>
          </Stack>
        </Container>
      </Section>
    </Page>
  );
}
