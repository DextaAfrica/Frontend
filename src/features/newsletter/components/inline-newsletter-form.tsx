"use client";

import * as React from "react";
import Image from "next/image";
import { Button } from "@/components/ui";

type SubmissionState = "idle" | "submitting" | "success" | "error";

export function InlineNewsletterForm() {
  const [status, setStatus] = React.useState<SubmissionState>("idle");
  const [message, setMessage] = React.useState("");

  async function subscribe(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setMessage("");

    const form = event.currentTarget;
    const data = new FormData(form);

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.get("email"),
          company: data.get("company"),
          source: "landing_page",
        }),
      });
      const payload = (await response.json()) as { message: string };
      if (!response.ok) throw new Error(payload.message);

      form.reset();
      setStatus("success");
      setMessage("Thank you. You’re now on the Dexta update list.");
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "Subscription could not be completed.",
      );
    }
  }

  return (
    <form onSubmit={subscribe} className="mt-13" noValidate>
      <div className="flex min-h-newsletter-input items-center rounded border border-input bg-background p-2 focus-within:ring-2 focus-within:ring-ring">
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
          className="min-w-0 flex-1 bg-transparent px-2 text-lg outline-none placeholder:text-muted-foreground"
        />
        <label className="sr-only" aria-hidden="true">
          Company
          <input name="company" tabIndex={-1} autoComplete="off" />
        </label>
        <Button
          type="submit"
          variant="neutral"
          size="lg"
          className="w-newsletter-button"
          disabled={status === "submitting"}
        >
          <Image
            src="/images/dexta-arrow.svg"
            alt=""
            width={20}
            height={20}
            className="invert dark:invert-0"
          />
          {status === "submitting" ? "Subscribing…" : "Subscribe"}
        </Button>
      </div>
      {message && (
        <p
          role={status === "error" ? "alert" : "status"}
          className={
            status === "error"
              ? "mt-3 text-sm text-destructive"
              : "mt-3 text-sm text-success"
          }
        >
          {message}
        </p>
      )}
    </form>
  );
}
