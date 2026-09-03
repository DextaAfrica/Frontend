import { ApiRequestError } from "@/lib/api-error";

export interface ChatLeadInput {
  name: string;
  contact: string;
  message: string;
  company: string;
}

export async function submitChatLead(input: ChatLeadInput) {
  const response = await fetch("/api/chat-lead", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const payload = (await response.json()) as { message?: string };

  if (!response.ok) {
    throw new ApiRequestError(
      payload.message ?? "Your message could not be sent.",
      response.status,
    );
  }

  return payload.message;
}
