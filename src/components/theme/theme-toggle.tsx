"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Icon, type IconName } from "@/components/ui/icon";
import { useMounted } from "@/hooks/use-mounted";
import { cn } from "@/lib/utils";
import { useTheme, type ThemePreference } from "@/providers/theme-provider";

const options: readonly {
  value: ThemePreference;
  label: string;
  icon: IconName;
}[] = [
  { value: "light", label: "Use light theme", icon: "sun" },
  { value: "dark", label: "Use dark theme", icon: "moon" },
  { value: "system", label: "Use system theme", icon: "system" },
];

export function ThemeToggle({ className }: { className?: string }) {
  const mounted = useMounted();
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = React.useState(false);
  const rootRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;

    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  if (!mounted) {
    return (
      <span
        aria-hidden
        className={cn(
          "block size-[var(--control-height-md)] rounded-[var(--control-radius)] border border-current/15",
          className,
        )}
      />
    );
  }

  return (
    <div ref={rootRef} className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen((current) => !current)}
        aria-label="Change website appearance"
        aria-haspopup="menu"
        aria-expanded={open}
        title="Change appearance"
        className={cn(
          "border-border/80 bg-surface-elevated/90 text-foreground shadow-sm backdrop-blur-md hover:border-primary/40 hover:bg-muted",
          className,
        )}
      >
        <Icon name="palette" />
        <span
          aria-hidden
          className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-primary ring-2 ring-surface-elevated"
        />
      </Button>

      <div
        role="menu"
        aria-label="Color theme"
        className={cn(
          "absolute top-[calc(100%+0.5rem)] right-0 z-[90] flex gap-1 rounded-md border border-border bg-surface-elevated p-1.5 text-foreground shadow-xl transition-[opacity,transform,visibility] duration-200",
          open
            ? "visible translate-y-0 opacity-100"
            : "pointer-events-none invisible -translate-y-1 opacity-0",
        )}
      >
        {options.map((option) => {
          const selected = theme === option.value;

          return (
            <button
              key={option.value}
              type="button"
              role="menuitemradio"
              aria-checked={selected}
              aria-label={option.label}
              title={option.label}
              onClick={() => {
                setTheme(option.value);
                setOpen(false);
              }}
              className={cn(
                "grid size-9 place-items-center rounded-sm transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                selected
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Icon name={option.icon} size={17} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
