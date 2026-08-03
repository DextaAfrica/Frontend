import Image from "next/image";
import Link from "next/link";
import { Grid, Section } from "@/components/layout";
import { EditorialSectionHeading } from "@/components/marketing";
import { blogPosts } from "../data/blog-posts";

export function BlogSection() {
  return (
    <Section spacing="editorial" tone="surface">
      <EditorialSectionHeading
        eyebrow="Blog"
        title="Keep up with our updates in one place"
        align="center"
      />

      <Grid columns="three" gap="sm" className="mt-blog-grid gap-y-blog-row">
        {blogPosts.map(([title, image]) => (
          <article key={title}>
            <Link href="/journal" className="group block">
              <div className="relative aspect-[405/264] overflow-hidden rounded-lg">
                <Image
                  src={image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 29vw, (min-width: 640px) 45vw, 100vw"
                  className="object-cover transition-transform duration-700 ease-[var(--ease-premium)] group-hover:scale-[1.02]"
                />
              </div>
              <h3 className="mt-5 font-serif text-xl leading-editorial tracking-editorial">
                {title}
              </h3>
              <div className="mt-4 flex gap-7 text-sm text-muted-foreground">
                <span>• &nbsp; July 28, 2026</span>
                <span>◷ &nbsp; 4 min read</span>
              </div>
            </Link>
          </article>
        ))}
      </Grid>
    </Section>
  );
}
