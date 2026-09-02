"use client";

import * as React from "react";
import { Button } from "./button";
import { Icon } from "./icon";
import { Stack } from "@/components/layout/stack";
import { cn } from "@/lib/utils";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}
export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  className,
}: ModalProps) {
  const ref = React.useRef<HTMLDialogElement>(null);
  const titleId = React.useId();
  const descriptionId = React.useId();
  React.useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);
  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onCancel={onClose}
      className={cn(
        // max-height + overflow-y are explicit rather than left to the
        // browser's own <dialog> UA-default sizing, which isn't guaranteed
        // to include scrolling — on a short mobile viewport (or with the
        // on-screen keyboard open) content taller than the dialog now
        // scrolls internally instead of risking being clipped.
        "m-auto max-h-[90svh] w-[min(var(--layout-dialog-viewport-width),var(--container-modal))] overflow-y-auto rounded-panel border border-border bg-background p-0 text-foreground shadow-2xl backdrop:bg-backdrop backdrop:backdrop-blur-sm",
        className,
      )}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
    >
      <Stack gap="lg" className="p-6 sm:p-8">
        <header className="flex items-start justify-between gap-6">
          <Stack gap="xs">
            <h2
              id={titleId}
              className="text-[clamp(1.0625rem,1rem_+_0.28vw,1.25rem)] font-semibold"
            >
              {title}
            </h2>
            {description && (
              <p id={descriptionId} className="text-sm text-muted-foreground">
                {description}
              </p>
            )}
          </Stack>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <Icon name="close" />
          </Button>
        </header>
        {children}
      </Stack>
    </dialog>
  );
}
