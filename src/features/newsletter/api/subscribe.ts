export interface NewsletterSubscriptionInput {
  email: FormDataEntryValue | string | null;
  company?: FormDataEntryValue | string | null;
  source: "landing_page" | "newsletter_modal";
  consent?: unknown;
}

export async function subscribeToNewsletter(
  input: NewsletterSubscriptionInput,
) {
  const response = await fetch("/api/newsletter", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const payload = (await response.json()) as { message?: string };

  if (!response.ok) {
    throw new Error(payload.message ?? "Subscription could not be completed.");
  }

  return payload.message;
}
