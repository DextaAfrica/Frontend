"use client";

import * as React from "react";
import type { CSSProperties } from "react";
import { Icon, type IconName } from "@/components/ui/icon";
import { useMounted } from "@/hooks/use-mounted";
import { cn } from "@/lib/utils";
import { useTheme, type ThemePreference } from "@/providers/theme-provider";

const options: readonly {
  value: ThemePreference;
  label: string;
  icon: IconName;
}[] = [
  { value: "light", label: "Light appearance", icon: "sun" },
  { value: "dark", label: "Dark appearance", icon: "moon" },
  { value: "system", label: "Use system appearance", icon: "system" },
];

type ToggleStyle = CSSProperties & { "--thumb-index": number };

export function ThemeToggle({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const mounted = useMounted();
  const { theme, resolvedTheme, setTheme } = useTheme();

  if (!mounted) {
    return (
      <span
        aria-hidden
        className={cn(
          "block h-9 w-[7.25rem] rounded-full border border-border/60 bg-surface-elevated/70",
          className,
        )}
      />
    );
  }

  const activeIndex = Math.max(
    0,
    options.findIndex((option) => option.value === theme),
  );

  return (
    <div
      role="radiogroup"
      aria-label="Website appearance"
      data-resolved-theme={resolvedTheme}
      className={cn("theme-toggle", className)}
      style={{ "--thumb-index": activeIndex } as ToggleStyle}
      {...props}
    >
      <span aria-hidden className="theme-toggle__thumb" />
      {options.map((option) => {
        const selected = theme === option.value;

        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={`${option.label}${
              option.value === "system" ? `, currently ${resolvedTheme}` : ""
            }`}
            title={option.label}
            onClick={() => setTheme(option.value)}
            className="theme-toggle__option"
          >
            <Icon name={option.icon} size={15} strokeWidth={1.85} />
          </button>
        );
      })}
    </div>
  );
}
