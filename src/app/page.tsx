import { HomeScreen } from "@/features/home";
import { getHomePageContent } from "@/features/home/server/get-home-page-content";

export default async function HomePage() {
  const content = await getHomePageContent();
  return <HomeScreen content={content} />;
}
