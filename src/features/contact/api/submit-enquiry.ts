import { ApiRequestError } from "@/lib/api-error";

export interface EnquiryInput {
  firstName: FormDataEntryValue | null;
  lastName: FormDataEntryValue | null;
  email: FormDataEntryValue | null;
  phone: FormDataEntryValue | null;
  interest: FormDataEntryValue | null;
  message: FormDataEntryValue | null;
  consent: boolean;
  company: FormDataEntryValue | null;
}

export async function submitEnquiry(input: EnquiryInput) {
  const response = await fetch("/api/enquiry", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const payload = (await response.json()) as { message?: string };

  if (!response.ok) {
    throw new ApiRequestError(
      payload.message ?? "Your enquiry could not be submitted.",
      response.status,
    );
  }

  return payload.message;
}
