"use client";

import * as React from "react";
import { Cluster, Stack } from "@/components/layout";
import { Button, Modal } from "@/components/ui";

const STATE_KEY = "maison-rouge-newsletter";
const OPEN_EVENT = "maison-open-newsletter";
const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

type NewsletterState = {
  status: "dismissed" | "subscribed";
  updatedAt: number;
};

export function NewsletterManager() {
  const [open, setOpen] = React.useState(false);
  const [status, setStatus] = React.useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [message, setMessage] = React.useState("");

  React.useEffect(() => {
    function canPrompt() {
      const raw = localStorage.getItem(STATE_KEY);
      if (!raw) return true;
      try {
        const saved = JSON.parse(raw) as NewsletterState;
        return (
          saved.status !== "subscribed" &&
          Date.now() - saved.updatedAt > THIRTY_DAYS
        );
      } catch {
        return true;
      }
    }
    let timer: number | undefined;
    function schedulePrompt() {
      window.clearTimeout(timer);
      if (!localStorage.getItem("maison-rouge-consent")) return;
      timer = window.setTimeout(() => {
        if (canPrompt()) setOpen(true);
      }, 10000);
    }
    const openNewsletter = () => {
      setStatus("idle");
      setMessage("");
      setOpen(true);
    };
    window.addEventListener(OPEN_EVENT, openNewsletter);
    window.addEventListener("maison-consent-change", schedulePrompt);
    schedulePrompt();
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener(OPEN_EVENT, openNewsletter);
      window.removeEventListener("maison-consent-change", schedulePrompt);
    };
  }, []);

  function close() {
    setOpen(false);
    if (status !== "success")
      localStorage.setItem(
        STATE_KEY,
        JSON.stringify({
          status: "dismissed",
          updatedAt: Date.now(),
        } satisfies NewsletterState),
      );
  }

  async function subscribe(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "");
    const company = String(form.get("company") ?? "");
    const rawConsent = localStorage.getItem("maison-rouge-consent");
    let consent: unknown = null;
    try {
      consent = rawConsent ? (JSON.parse(rawConsent) as unknown) : null;
    } catch {
      consent = null;
    }
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          company,
          source: "newsletter_modal",
          consent,
        }),
      });
      const payload = (await response.json()) as { message: string };
      if (!response.ok) throw new Error(payload.message);
      localStorage.setItem(
        STATE_KEY,
        JSON.stringify({
          status: "subscribed",
          updatedAt: Date.now(),
        } satisfies NewsletterState),
      );
      setMessage("You’re on the list. We’ll share only considered updates.");
      setStatus("success");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Subscription could not be completed.",
      );
      setStatus("error");
    }
  }

  return (
    <Modal
      open={open}
      onClose={close}
      title="A more considered perspective."
      description="Private previews, architectural stories, and new addresses—shared occasionally."
      className="w-[min(94vw,52rem)]"
    >
      <span aria-hidden className="h-px w-16 bg-primary" />
      {status === "success" ? (
        <Stack gap="md">
          <p className="text-xl font-light">{message}</p>
          <Button onClick={close} className="w-fit">
            Continue exploring
          </Button>
        </Stack>
      ) : (
        <form onSubmit={subscribe}>
          <Stack gap="md">
            <label
              className="grid gap-2 text-sm font-medium"
              htmlFor="newsletter-email"
            >
              Email address
              <input
                id="newsletter-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                className="h-12 border border-input bg-background px-4 outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
              />
            </label>
            <label className="sr-only" aria-hidden="true">
              Company
              <input name="company" tabIndex={-1} autoComplete="off" />
            </label>
            {message && (
              <p role="alert" className="text-sm text-destructive">
                {message}
              </p>
            )}
            <Cluster>
              <Button
                type="submit"
                size="lg"
                disabled={status === "submitting"}
              >
                {status === "submitting" ? "Joining…" : "Join the private list"}
              </Button>
              <Button type="button" variant="ghost" onClick={close}>
                Not now
              </Button>
            </Cluster>
            <p className="text-xs leading-5 text-muted-foreground">
              By subscribing, you agree to receive Maison Rouge updates.
              Unsubscribe at any time.
            </p>
          </Stack>
        </form>
      )}
    </Modal>
  );
}

export function NewsletterButton({ className }: { className?: string }) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => window.dispatchEvent(new Event(OPEN_EVENT))}
    >
      Newsletter
    </button>
  );
}
