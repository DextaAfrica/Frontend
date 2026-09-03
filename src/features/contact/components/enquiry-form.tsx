"use client";

import * as React from "react";
import { Grid, Stack } from "@/components/layout";
import { Button, Modal } from "@/components/ui";
import { ApiRequestError } from "@/lib/api-error";
import { submitEnquiry } from "../api/submit-enquiry";

const fieldClass =
  "h-12 w-full rounded-lg border border-input bg-background px-4 text-sm text-foreground outline-none transition-shadow placeholder:text-muted-foreground focus:ring-2 focus:ring-ring";
const ERROR_ID = "enquiry-form-error";

export function EnquiryForm() {
  const [status, setStatus] = React.useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [message, setMessage] = React.useState("");
  // A 422 means specific fields failed validation; anything else (network,
  // 502/503 from the delivery webhook) isn't a field problem, so the
  // inputs shouldn't be marked invalid for it.
  const [invalidFields, setInvalidFields] = React.useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setMessage("");
    setInvalidFields(false);
    const form = event.currentTarget;
    const data = new FormData(form);

    try {
      await submitEnquiry({
        firstName: data.get("firstName"),
        lastName: data.get("lastName"),
        email: data.get("email"),
        phone: data.get("phone"),
        interest: data.get("interest"),
        message: data.get("message"),
        consent: data.get("consent") === "on",
        company: data.get("company"),
      });
      form.reset();
      setStatus("success");
    } catch (error) {
      setStatus("error");
      setInvalidFields(
        error instanceof ApiRequestError && error.status === 422,
      );
      setMessage(
        error instanceof Error
          ? error.message
          : "Your enquiry could not be submitted.",
      );
    }
  }

  return (
    <>
      <form onSubmit={submit}>
        <Stack gap="md">
          <Grid columns="two" gap="sm">
            <label className="grid gap-2 text-sm font-semibold">
              First name
              <input
                required
                name="firstName"
                autoComplete="given-name"
                aria-invalid={invalidFields}
                aria-describedby={invalidFields ? ERROR_ID : undefined}
                className={fieldClass}
              />
            </label>
            <label className="grid gap-2 text-sm font-semibold">
              Last name
              <input
                required
                name="lastName"
                autoComplete="family-name"
                aria-invalid={invalidFields}
                aria-describedby={invalidFields ? ERROR_ID : undefined}
                className={fieldClass}
              />
            </label>
          </Grid>
          <label className="grid gap-2 text-sm font-semibold">
            Email address
            <input
              required
              type="email"
              name="email"
              autoComplete="email"
              aria-invalid={invalidFields}
              aria-describedby={invalidFields ? ERROR_ID : undefined}
              className={fieldClass}
            />
          </label>
          <label className="grid gap-2 text-sm font-semibold">
            Phone number
            <input
              required
              type="tel"
              name="phone"
              autoComplete="tel"
              aria-invalid={invalidFields}
              aria-describedby={invalidFields ? ERROR_ID : undefined}
              className={fieldClass}
            />
          </label>
          <label className="grid gap-2 text-sm font-semibold">
            Area of interest
            <select
              required
              name="interest"
              aria-invalid={invalidFields}
              aria-describedby={invalidFields ? ERROR_ID : undefined}
              className={fieldClass}
              defaultValue=""
            >
              <option value="" disabled>
                Select an option
              </option>
              <option>Purchasing a residence</option>
              <option>Investment opportunity</option>
              <option>Partnership</option>
              <option>General enquiry</option>
            </select>
          </label>
          <label className="grid gap-2 text-sm font-semibold">
            Your message
            <textarea
              required
              name="message"
              rows={5}
              aria-invalid={invalidFields}
              aria-describedby={invalidFields ? ERROR_ID : undefined}
              className={`${fieldClass} h-auto py-3`}
            />
          </label>
          <label className="flex items-start gap-3 text-sm text-muted-foreground">
            <input
              required
              name="consent"
              type="checkbox"
              aria-invalid={invalidFields}
              aria-describedby={invalidFields ? ERROR_ID : undefined}
              className="mt-1 accent-primary"
            />
            I consent to Dexta Africa responding to this enquiry and handling my
            information according to its privacy policy.
          </label>
          <label className="sr-only" aria-hidden="true">
            Company
            <input name="company" tabIndex={-1} autoComplete="off" />
          </label>
          <p id={ERROR_ID} role="alert" className="text-sm text-destructive">
            {message}
          </p>
          <Button
            type="submit"
            size="lg"
            className="w-fit"
            disabled={status === "submitting"}
          >
            {status === "submitting" ? "Submitting…" : "Submit enquiry"}
          </Button>
        </Stack>
      </form>
      <Modal
        open={status === "success"}
        onClose={() => setStatus("idle")}
        title="Thank you for getting in touch"
        description="Your enquiry has been received."
      >
        <p className="text-muted-foreground">
          A member of our private client team will respond shortly.
        </p>
        <Button onClick={() => setStatus("idle")} className="w-fit">
          Close
        </Button>
      </Modal>
    </>
  );
}
