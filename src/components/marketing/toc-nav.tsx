"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface TocItem {
  id: string;
  label: string;
}

/**
 * The "On this page" sidebar nav. Tracks which section is actually in view
 * via IntersectionObserver — the active link follows the reader's scroll
 * position rather than just marking whichever link they last clicked.
 */
export function TocNav({
  items,
  className,
}: {
  items: readonly TocItem[];
  className?: string;
}) {
  const [activeId, setActiveId] = React.useState(items[0]?.id);

  React.useEffect(() => {
    const elements = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        const next = visible[0]?.target.id;
        if (next) setActiveId(next);
      },
      { rootMargin: "-15% 0px -70% 0px", threshold: [0, 1] },
    );

    for (const element of elements) observer.observe(element);
    return () => observer.disconnect();
  }, [items]);

  if (!items.length) return null;

  return (
    <nav aria-label="On this page" className={cn("flex flex-col", className)}>
      <p className="mb-3 text-xs font-medium tracking-eyebrow text-muted-foreground uppercase">
        On this page
      </p>
      {items.map((item) => {
        const active = activeId === item.id;
        return (
          <a
            key={item.id}
            href={`#${item.id}`}
            aria-current={active ? "true" : undefined}
            className={cn(
              "border-l-2 py-1.5 pl-4 text-sm transition-colors duration-200",
              active
                ? "border-primary font-medium text-foreground"
                : "border-border text-muted-foreground hover:border-input hover:text-foreground",
            )}
          >
            {item.label}
          </a>
        );
      })}
    </nav>
  );
}
