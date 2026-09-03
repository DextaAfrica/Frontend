"use client";

import * as React from "react";
import { Button, Icon } from "@/components/ui";
import { ApiRequestError } from "@/lib/api-error";
import { cn } from "@/lib/utils";
import { subscribeToNewsletter } from "../api/subscribe";

type SubmissionState = "idle" | "submitting" | "success" | "error";

export interface InlineNewsletterFormProps {
  /** Fixed-dark-surface styling for placement on the always-dark footer,
   * instead of the theme-relative styling used on a light/dark-toggling page. */
  onMedia?: boolean;
  className?: string;
  /** "lg" (default) suits a wide column like the footer; "md" a narrower
   * card; "sm" the slim, understated inline field used in the Newsletter
   * section. Drives the input height + text and the button size together. */
  size?: "sm" | "md" | "lg";
}

export function InlineNewsletterForm({
  onMedia = false,
  className,
  size = "lg",
}: InlineNewsletterFormProps = {}) {
  const [status, setStatus] = React.useState<SubmissionState>("idle");
  const [message, setMessage] = React.useState("");
  const [invalidField, setInvalidField] = React.useState(false);

  // Unique per instance: the footer form and the homepage form both mount on
  // the same page, so a fixed id/`for` pairing would collide.
  const uid = React.useId();
  const emailId = `newsletter-email-${uid}`;
  const feedbackId = `newsletter-feedback-${uid}`;

  async function subscribe(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setMessage("");
    setInvalidField(false);

    const form = event.currentTarget;
    const data = new FormData(form);

    try {
      await subscribeToNewsletter({
        email: data.get("email"),
        company: data.get("company"),
        source: "landing_page",
      });

      form.reset();
      setStatus("success");
      setMessage("Thank you. You’re now on the Dexta update list.");
    } catch (error) {
      setStatus("error");
      setInvalidField(error instanceof ApiRequestError && error.status === 422);
      setMessage(
        error instanceof Error
          ? error.message
          : "Subscription could not be completed.",
      );
    }
  }

  return (
    // `@container`: the input row stacks or sits side-by-side based on the
    // width the FORM actually has, not the viewport — so it works the same in
    // the narrow homepage card, the wide footer column, and anywhere else.
    <form
      onSubmit={subscribe}
      className={cn("@container", className)}
      noValidate
    >
      <label htmlFor={emailId} className="sr-only">
        Your email address
      </label>

      <div className="flex flex-col gap-2.5 @[20rem]:flex-row @[20rem]:gap-2">
        <input
          id={emailId}
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="Your email address"
          aria-invalid={invalidField || undefined}
          aria-describedby={message ? feedbackId : undefined}
          // `flex-1` / `min-w-0` are scoped to the row layout only: in the
          // stacked (column) layout `flex-1` would set flex-basis:0 on the
          // main axis and collapse the field's height instead of honouring
          // `h-[…]`.
          className={cn(
            "w-full rounded-[var(--control-radius)] border transition-colors @[20rem]:min-w-0 @[20rem]:flex-1",
            size === "lg" && "h-[var(--control-height-lg)] px-4 text-base",
            size === "md" && "h-[var(--control-height-md)] px-3.5 text-sm",
            size === "sm" && "h-[var(--control-height-sm)] px-3 text-sm",
            onMedia
              ? "border-brand-light/25 bg-brand-light/5 text-on-media placeholder:text-brand-light/50"
              : "border-input bg-background text-foreground placeholder:text-muted-foreground",
            invalidField && "border-destructive",
          )}
        />

        {/* Honeypot: real visitors never see or fill this in — hidden by
            inline style rather than a class, so there's no dependency on a
            utility class resolving correctly for it to stay invisible. */}
        <input
          type="text"
          name="company"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          style={{
            position: "absolute",
            width: 1,
            height: 1,
            padding: 0,
            margin: -1,
            overflow: "hidden",
            clip: "rect(0, 0, 0, 0)",
            whiteSpace: "nowrap",
            border: 0,
          }}
        />

        <Button
          type="submit"
          variant={onMedia ? "onMedia" : "neutral"}
          size={size}
          fullWidth
          className="@[20rem]:w-auto"
          disabled={status === "submitting"}
        >
          {status === "submitting" ? "Subscribing…" : "Subscribe"}
          <Icon name="arrow-right" />
        </Button>
      </div>

      {message && (
        <p
          id={feedbackId}
          role={status === "error" ? "alert" : "status"}
          className={cn(
            "mt-3 text-sm",
            status === "error"
              ? "text-destructive"
              : onMedia
                ? "text-brand-light/70"
                : "text-success",
          )}
        >
          {message}
        </p>
      )}
    </form>
  );
}
