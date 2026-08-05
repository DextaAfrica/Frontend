"use client";

import * as React from "react";
import { Button, Icon } from "@/components/ui";
import { ApiRequestError } from "@/lib/api-error";
import { subscribeToNewsletter } from "../api/subscribe";

type SubmissionState = "idle" | "submitting" | "success" | "error";
const ERROR_ID = "inline-newsletter-error";

export function InlineNewsletterForm() {
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
    <form onSubmit={subscribe} className="mt-13" noValidate>
      <div className="flex min-h-newsletter-input flex-col items-stretch gap-2 rounded border border-input bg-background p-2 focus-within:ring-2 focus-within:ring-ring sm:flex-row sm:items-center sm:gap-0">
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
          className="h-12 min-w-0 flex-1 bg-transparent px-2 text-base outline-none placeholder:text-muted-foreground sm:text-lg"
        />
        <label className="sr-only" aria-hidden="true">
          Company
          <input name="company" tabIndex={-1} autoComplete="off" />
        </label>
        <Button
          type="submit"
          variant="neutral"
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
        className={
          status === "error"
            ? "mt-3 text-sm text-destructive"
            : "mt-3 text-sm text-success"
        }
      >
        {message}
      </p>
    </form>
  );
}
