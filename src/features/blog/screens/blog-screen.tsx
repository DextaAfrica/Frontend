import { Page } from "@/components/layout";
import { PageNotReady } from "@/components/marketing";

export function BlogScreen() {
  return (
    <Page>
      <PageNotReady
        eyebrow="Blog"
        title="Our blog isn't ready yet"
        description="We're getting our first pieces together — insights on African real estate, buying with confidence, and building wealth through property."
      />
    </Page>
  );
}
