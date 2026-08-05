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
        "m-auto w-[min(var(--layout-dialog-viewport-width),var(--container-modal))] rounded-panel border border-border bg-background p-0 text-foreground shadow-2xl backdrop:bg-backdrop backdrop:backdrop-blur-sm",
        className,
      )}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
    >
      <Stack gap="lg" className="p-6 sm:p-8">
        <header className="flex items-start justify-between gap-6">
          <Stack gap="xs">
            <h2 id={titleId} className="text-2xl font-semibold">
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
