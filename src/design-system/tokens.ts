/** Typed names mirror globals.css. Values live in CSS so themes switch without React renders. */
export const tokens = {
  color: [
    "background",
    "foreground",
    "surface",
    "muted",
    "border",
    "primary",
    "success",
    "warning",
    "destructive",
  ],
  spacing: ["xs", "sm", "md", "lg", "xl", "2xl"],
  radius: ["sm", "md", "lg", "xl", "2xl"],
  container: ["narrow", "editorial", "default", "wide", "full"],
  typography: ["hero", "editorial", "metric", "body", "label"],
} as const;

export type ColorToken = (typeof tokens.color)[number];
export type SpacingToken = (typeof tokens.spacing)[number];
export type TypographyToken = (typeof tokens.typography)[number];
