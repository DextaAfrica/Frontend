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
        "m-auto w-[min(92vw,40rem)] rounded-[0.4rem] border border-border bg-background p-0 text-foreground shadow-2xl backdrop:bg-black/65 backdrop:backdrop-blur-sm",
        className,
      )}
      aria-labelledby="modal-title"
    >
      <Stack gap="lg" className="p-6 sm:p-8">
        <header className="flex items-start justify-between gap-6">
          <Stack gap="xs">
            <h2 id="modal-title" className="text-2xl font-semibold">
              {title}
            </h2>
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
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
