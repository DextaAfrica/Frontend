"use client";

import * as React from "react";
import { Grid, Stack } from "@/components/layout";
import { Button, Modal } from "@/components/ui";

const fieldClass =
  "h-12 w-full rounded-lg border border-input bg-background px-4 text-sm outline-none transition-shadow placeholder:text-muted-foreground focus:ring-2 focus:ring-ring";
export function EnquiryForm() {
  const [submitted, setSubmitted] = React.useState(false);
  return (
    <>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          setSubmitted(true);
        }}
      >
        <Stack gap="md">
          <Grid columns="two" gap="sm">
            <label className="grid gap-2 text-sm font-semibold">
              First name
              <input
                required
                name="firstName"
                autoComplete="given-name"
                className={fieldClass}
              />
            </label>
            <label className="grid gap-2 text-sm font-semibold">
              Last name
              <input
                required
                name="lastName"
                autoComplete="family-name"
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
              className={fieldClass}
            />
          </label>
          <label className="grid gap-2 text-sm font-semibold">
            Area of interest
            <select name="interest" className={fieldClass} defaultValue="">
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
              name="message"
              rows={5}
              className={`${fieldClass} h-auto py-3`}
            />
          </label>
          <label className="flex items-start gap-3 text-sm text-muted-foreground">
            <input required type="checkbox" className="mt-1 accent-primary" />I
            consent to Dexta Africa responding to this enquiry and handling my
            information according to its privacy policy.
          </label>
          <Button type="submit" size="lg" className="w-fit">
            Submit enquiry
          </Button>
        </Stack>
      </form>
      <Modal
        open={submitted}
        onClose={() => setSubmitted(false)}
        title="Thank you for getting in touch"
        description="Your enquiry has been received."
      >
        <p className="text-muted-foreground">
          A member of our private client team will respond shortly.
        </p>
        <Button onClick={() => setSubmitted(false)} className="w-fit">
          Close
        </Button>
      </Modal>
    </>
  );
}
