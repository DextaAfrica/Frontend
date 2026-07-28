export const foundations = [
  {
    icon: "palette",
    title: "Semantic design tokens",
    description:
      "Brand, surfaces, content, feedback, borders, and focus states are centrally governed.",
  },
  {
    icon: "architecture",
    title: "Layout vocabulary",
    description:
      "Container, Section, Stack, Flex, Cluster, Grid, Center, Page, and Sidebar primitives.",
  },
  {
    icon: "moon",
    title: "Theme ready",
    description:
      "Light, dark, and system preferences persist without coupling themes to components.",
  },
  {
    icon: "architecture",
    title: "Composable primitives",
    description:
      "Typed component variants keep Figma implementation consistent across every feature.",
  },
] as const satisfies ReadonlyArray<{
  icon: import("@/components/ui").IconName;
  title: string;
  description: string;
}>;
