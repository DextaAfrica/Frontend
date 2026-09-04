import { Stack } from "@/components/layout";
import {
  Badge,
  ButtonLink,
  Card,
  CardContent,
  CardHeading,
  Eyebrow,
  Icon,
  Text,
} from "@/components/ui";
import { MediaPanel } from "./media-panel";
import { Reveal } from "./reveal";

export interface Project {
  slug: string;
  name: string;
  location: string;
  status: string;
  description: string;
  tone: "ruby" | "stone" | "dusk" | "light";
  image?: string;
  /** A short marketing line for the detail page's hero; falls back to a
   *  generic one when a project doesn't have real campaign copy yet. */
  tagline?: string;
  /** e.g. "Starting from ₦15M initial deposit" — only ever real, supplied
   *  figures, never invented to fill the slot. */
  priceFrom?: string;
  /** Headline selling points, shown as a facts strip on the detail page. */
  features?: readonly string[];
  /** The detail page's hero background. Falls back to `image` when unset —
   *  most projects only have the one photo today. */
  heroImage?: string;
  /** The detail page's product-listing-style photo galleries, grouped the
   *  way a real estate listing actually groups finishes — interior and
   *  exterior are two separate sets a visitor switches between, not one
   *  undifferentiated pile of photos. Either (or both) may be empty while
   *  a project's photo set is still being put together. */
  interiorGallery?: readonly { src: string; alt: string }[];
  exteriorGallery?: readonly { src: string; alt: string }[];
}
export function ProjectCard({ project }: { project: Project }) {
  const href = `/projects/${project.slug}`;
  return (
    <Reveal>
      <Card className="group overflow-hidden">
        <MediaPanel
          label={`${project.name}, ${project.location}`}
          tone={project.tone}
          src={project.image}
          className="group-hover:scale-project-media min-h-80 rounded-none transition-transform duration-700"
        />
        <CardContent className="p-6">
          <Stack gap="md">
            <Badge>{project.status}</Badge>
            <Stack gap="xs">
              <CardHeading size="lg">{project.name}</CardHeading>
              <Eyebrow>{project.location}</Eyebrow>
              <Text className="text-sm">{project.description}</Text>
            </Stack>
            <ButtonLink href={href} variant="link">
              View residence <Icon name="arrow-right" />
            </ButtonLink>
          </Stack>
        </CardContent>
      </Card>
    </Reveal>
  );
}
