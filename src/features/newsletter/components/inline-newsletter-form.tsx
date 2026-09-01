"use client";

import * as React from "react";
import { Button, Icon } from "@/components/ui";
import { ApiRequestError } from "@/lib/api-error";
import { cn } from "@/lib/utils";
import { subscribeToNewsletter } from "../api/subscribe";

type SubmissionState = "idle" | "submitting" | "success" | "error";
const ERROR_ID = "inline-newsletter-error";

export interface InlineNewsletterFormProps {
  /** Fixed-dark-surface styling for placement on the always-dark footer,
   * instead of the theme-relative styling used on a light/dark-toggling page. */
  onMedia?: boolean;
  className?: string;
}

export function InlineNewsletterForm({
  onMedia = false,
  className,
}: InlineNewsletterFormProps = {}) {
  const [status, setStatus] = React.useState<SubmissionState>("idle");
  const [message, setMessage] = React.useState("");
  const [invalidField, setInvalidField] = React.useState(false);

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
    <form onSubmit={subscribe} className={cn("mt-13", className)} noValidate>
      <div
        className={cn(
          "flex min-h-newsletter-input flex-col items-stretch gap-2 rounded border p-2 focus-within:ring-2 focus-within:ring-ring sm:flex-row sm:items-center sm:gap-0",
          onMedia
            ? "border-brand-light/25 bg-brand-light/5"
            : "border-input bg-background",
        )}
      >
        <label htmlFor="landing-email" className="sr-only">
          Your email address
        </label>
        <input
          id="landing-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="Your email address"
          aria-invalid={invalidField}
          aria-describedby={invalidField ? ERROR_ID : undefined}
          className={cn(
            "h-12 min-w-0 flex-1 bg-transparent px-2 text-base outline-none sm:text-lg",
            onMedia
              ? "placeholder:text-brand-light/50"
              : "placeholder:text-muted-foreground",
          )}
        />
        <label className="sr-only" aria-hidden="true">
          Company
          <input name="company" tabIndex={-1} autoComplete="off" />
        </label>
        <Button
          type="submit"
          variant={onMedia ? "onMedia" : "neutral"}
          size="lg"
          className="w-full sm:w-newsletter-button"
          disabled={status === "submitting"}
        >
          {status === "submitting" ? "Subscribing…" : "Subscribe"}
          <Icon name="arrow-right" />
        </Button>
      </div>
      <p
        id={ERROR_ID}
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
    </form>
  );
}
