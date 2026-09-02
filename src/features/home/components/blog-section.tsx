import Image from "next/image";
import Link from "next/link";
import { Grid, Section } from "@/components/layout";
import {
  EditorialSectionHeading,
  RevealGroup,
  RevealItem,
} from "@/components/marketing";
import { isRemoteAsset } from "@/lib/media";
import type { BlogPostContent, HomePageContent } from "../types/home-page";

export function BlogSection({
  posts,
  heading,
}: {
  posts: readonly BlogPostContent[];
  heading: HomePageContent["blogSection"];
}) {
  return (
    <Section spacing="editorial" tone="default">
      <EditorialSectionHeading
        eyebrow={heading.eyebrow}
        title={heading.title}
        align="center"
      />

      <RevealGroup>
        <Grid columns="three" gap="sm" className="mt-blog-grid gap-y-blog-row">
          {posts.map((post) => (
            <RevealItem as="article" key={post.id}>
              <Link href={post.href} className="group block">
                <div className="blog-media" style={{ position: "relative" }}>
                  <Image
                    src={post.image}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 29vw, (min-width: 768px) 45vw, 100vw"
                    unoptimized={isRemoteAsset(post.image)}
                    className="group-hover:scale-project-media object-cover transition-transform duration-700 ease-premium"
                  />
                </div>
                <h3 className="mt-5 font-display text-xl leading-editorial font-semibold tracking-editorial">
                  {post.title}
                </h3>
                <div className="mt-4 flex flex-wrap gap-x-7 gap-y-2 text-sm text-muted-foreground">
                  <span>• &nbsp; {post.publishedAt}</span>
                  <span>◷ &nbsp; {post.readingTime}</span>
                </div>
              </Link>
            </RevealItem>
          ))}
        </Grid>
      </RevealGroup>
    </Section>
  );
}
