"use client";

import * as React from "react";
import { browserEvents, browserStorage } from "@/config/browser-storage";
import { Cluster, Stack } from "@/components/layout";
import { Button, Modal } from "@/components/ui";
import { readBrowserStorage, writeBrowserStorage } from "@/lib/browser-storage";
import { ApiRequestError } from "@/lib/api-error";
import { subscribeToNewsletter } from "../api/subscribe";

const ERROR_ID = "newsletter-modal-error";

const STATE_KEY = browserStorage.newsletter;
const OPEN_EVENT = browserEvents.openNewsletter;
const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

type NewsletterState = {
  status: "dismissed" | "subscribed";
  updatedAt: number;
};

function parseNewsletterState(value: string | null): NewsletterState | null {
  if (!value) return null;
  try {
    const state: unknown = JSON.parse(value);
    if (
      typeof state !== "object" ||
      state === null ||
      !("status" in state) ||
      (state.status !== "dismissed" && state.status !== "subscribed") ||
      !("updatedAt" in state) ||
      typeof state.updatedAt !== "number" ||
      !Number.isFinite(state.updatedAt)
    ) {
      return null;
    }
    return state as NewsletterState;
  } catch {
    return null;
  }
}

export function NewsletterManager() {
  const [open, setOpen] = React.useState(false);
  const [status, setStatus] = React.useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [message, setMessage] = React.useState("");
  const [invalidField, setInvalidField] = React.useState(false);

  React.useEffect(() => {
    function canPrompt() {
      const saved = parseNewsletterState(readBrowserStorage(STATE_KEY));
      if (!saved) return true;
      return (
        saved.status !== "subscribed" &&
        Date.now() - saved.updatedAt > THIRTY_DAYS
      );
    }
    let timer: number | undefined;
    function schedulePrompt() {
      window.clearTimeout(timer);
      if (!readBrowserStorage(browserStorage.consent)) return;
      timer = window.setTimeout(() => {
        if (canPrompt()) setOpen(true);
      }, 10000);
    }
    const openNewsletter = () => {
      setStatus("idle");
      setMessage("");
      setInvalidField(false);
      setOpen(true);
    };
    window.addEventListener(OPEN_EVENT, openNewsletter);
    window.addEventListener(browserEvents.consentChanged, schedulePrompt);
    schedulePrompt();
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener(OPEN_EVENT, openNewsletter);
      window.removeEventListener(browserEvents.consentChanged, schedulePrompt);
    };
  }, []);

  function close() {
    setOpen(false);
    if (status !== "success")
      writeBrowserStorage(
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
    setInvalidField(false);
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "");
    const company = String(form.get("company") ?? "");
    const rawConsent = readBrowserStorage(browserStorage.consent);
    let consent: unknown = null;
    try {
      consent = rawConsent ? (JSON.parse(rawConsent) as unknown) : null;
    } catch {
      consent = null;
    }
    try {
      await subscribeToNewsletter({
        email,
        company,
        source: "newsletter_modal",
        consent,
      });
      writeBrowserStorage(
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
      setInvalidField(error instanceof ApiRequestError && error.status === 422);
      setStatus("error");
    }
  }

  return (
    <Modal
      open={open}
      onClose={close}
      title="A more considered perspective."
      description="Private previews, architectural stories, and new addresses—shared occasionally."
      className="w-[min(var(--layout-dialog-wide-viewport-width),var(--container-dialog-wide))]"
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
                aria-invalid={invalidField}
                aria-describedby={invalidField ? ERROR_ID : undefined}
                className="h-12 border border-input bg-background px-4 outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
              />
            </label>
            <label className="sr-only" aria-hidden="true">
              Company
              <input name="company" tabIndex={-1} autoComplete="off" />
            </label>
            <p id={ERROR_ID} role="alert" className="text-sm text-destructive">
              {message}
            </p>
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
              By subscribing, you agree to receive Dexta Africa updates.
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
