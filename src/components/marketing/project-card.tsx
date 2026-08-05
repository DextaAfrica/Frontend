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
}
export function ProjectCard({ project }: { project: Project }) {
  const href = `/portfolio/${project.slug}`;
  return (
    <Reveal>
      <Card className="group overflow-hidden">
        <MediaPanel
          label={`${project.name}, ${project.location}`}
          tone={project.tone}
          src={project.image}
          className="min-h-80 rounded-none transition-transform duration-700 group-hover:scale-project-media"
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
