"use client";

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

export function ThemeToggle({ className }: { className?: string }) {
  const mounted = useMounted();
  const { theme, setTheme } = useTheme();

  if (!mounted) {
    return (
      <span
        aria-hidden
        className={cn(
          "block h-9 w-[6.625rem] rounded-[var(--control-radius)] border border-border/70 bg-surface-elevated/80",
          className,
        )}
      />
    );
  }

  return (
    <div
      role="radiogroup"
      aria-label="Website appearance"
      className={cn(
        "grid h-9 grid-cols-3 gap-0.5 rounded-[var(--control-radius)] border border-border/70 bg-surface-elevated/90 p-0.5 text-foreground shadow-sm backdrop-blur-md",
        className,
      )}
    >
      {options.map((option) => {
        const selected = theme === option.value;

        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={option.label}
            title={option.label}
            onClick={() => setTheme(option.value)}
            className={cn(
              "grid min-w-8 place-items-center rounded-[calc(var(--control-radius)-1px)] transition-[color,background-color,box-shadow] duration-200 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
              selected
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <Icon name={option.icon} size={15} strokeWidth={1.8} />
          </button>
        );
      })}
    </div>
  );
}
