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

export interface ThemeToggleProps extends React.ComponentProps<"div"> {
  /** `segmented` (default) = the 3-option control; `compact` = a single icon
   *  button that cycles through the options — for tight spots like the header. */
  variant?: "segmented" | "compact";
}

export function ThemeToggle({
  className,
  variant = "segmented",
  ...props
}: ThemeToggleProps) {
  const mounted = useMounted();
  const { theme, resolvedTheme, setTheme } = useTheme();

  if (variant === "compact") {
    return (
      <CompactThemeToggle
        mounted={mounted}
        theme={theme}
        resolvedTheme={resolvedTheme}
        setTheme={setTheme}
        className={className}
        {...(props as React.ComponentProps<"button">)}
      />
    );
  }

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

function CompactThemeToggle({
  mounted,
  theme,
  resolvedTheme,
  setTheme,
  className,
  ...props
}: {
  mounted: boolean;
  theme: ThemePreference;
  resolvedTheme: "light" | "dark";
  setTheme: (theme: ThemePreference) => void;
} & React.ComponentProps<"button">) {
  if (!mounted) {
    return (
      <span
        aria-hidden
        className={cn(
          "block size-9 rounded-full border border-border/60 bg-surface-elevated/70",
          className,
        )}
      />
    );
  }

  const nextTheme: ThemePreference =
    theme === "light" ? "dark" : theme === "dark" ? "system" : "light";
  const icon: IconName =
    theme === "light" ? "sun" : theme === "dark" ? "moon" : "system";
  const currentLabel = theme === "system" ? `system (${resolvedTheme})` : theme;

  return (
    <button
      type="button"
      onClick={() => setTheme(nextTheme)}
      data-theme={theme}
      aria-label={`Theme: ${currentLabel}. Switch to ${nextTheme}.`}
      title={`Theme: ${currentLabel}`}
      className={cn("theme-toggle-compact", className)}
      {...props}
    >
      {/* keyed so the glyph re-mounts and replays its rotate-in on each change */}
      <span key={theme} aria-hidden className="theme-toggle-compact__glyph">
        <Icon name={icon} size={16} strokeWidth={1.9} />
      </span>
    </button>
  );
}
