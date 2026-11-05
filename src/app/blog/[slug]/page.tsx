import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { articles, ArticleScreen } from "@/features/blog";
import { backendClient } from "@/lib/backend-client";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return articles.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await backendClient.journal.getBySlug(slug);

  return article
    ? {
        title: article.title,
        description: article.introduction,
        alternates: { canonical: `/blog/${slug}` },
        openGraph: {
          title: article.title,
          description: article.introduction,
          type: "article",
        },
      }
    : {};
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await backendClient.journal.getBySlug(slug);
  if (!article) notFound();
  return <ArticleScreen article={article} />;
}
