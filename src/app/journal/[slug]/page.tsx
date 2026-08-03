import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleScreen } from "@/features/journal";
import { articles } from "@/data/articles";

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
  const article = articles.find((item) => item.slug === slug);
  return article
    ? { title: article.title, description: article.introduction }
    : {};
}
export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = articles.find((item) => item.slug === slug);
  if (!article) notFound();
  return <ArticleScreen article={article} />;
}
