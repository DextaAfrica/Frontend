"use client";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { useMounted } from "@/hooks/use-mounted";
import { useTheme } from "@/providers/theme-provider";

export function ThemeToggle() {
  const mounted = useMounted();
  const { theme, toggleTheme } = useTheme();
  if (!mounted)
    return (
      <span aria-hidden className="size-10 rounded-lg border border-border" />
    );
  const next = theme === "dark" ? "light" : "dark";
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label={`Switch to ${next} mode`}
      title={`Switch to ${next} mode`}
    >
      <Icon name={theme === "dark" ? "sun" : "moon"} />
    </Button>
  );
}
