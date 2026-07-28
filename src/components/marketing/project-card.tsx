import { Stack } from "@/components/layout";
import {
  Badge,
  ButtonLink,
  Card,
  CardContent,
  CardHeading,
  Icon,
  Text,
} from "@/components/ui";
import { MediaPanel } from "./media-panel";

export interface Project {
  slug: string;
  name: string;
  location: string;
  status: string;
  description: string;
  tone: "ruby" | "stone" | "dusk" | "light";
}
export function ProjectCard({ project }: { project: Project }) {
  const href =
    project.slug === "seren-redwood" ? "/portfolio/seren-redwood" : "/contact";
  return (
    <Card className="group overflow-hidden">
      <MediaPanel
        label={`${project.name}, ${project.location}`}
        tone={project.tone}
        className="min-h-80 rounded-none transition-transform duration-700 group-hover:scale-[1.02]"
      />
      <CardContent className="p-6">
        <Stack gap="md">
          <Badge>{project.status}</Badge>
          <Stack gap="xs">
            <CardHeading className="text-2xl">{project.name}</CardHeading>
            <p className="text-xs font-bold tracking-[0.12em] text-primary uppercase">
              {project.location}
            </p>
            <Text className="text-sm">{project.description}</Text>
          </Stack>
          <ButtonLink href={href} variant="link">
            {project.slug === "seren-redwood"
              ? "View residence"
              : "Register interest"}{" "}
            <Icon name="arrow-right" />
          </ButtonLink>
        </Stack>
      </CardContent>
    </Card>
  );
}
