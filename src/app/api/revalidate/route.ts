import { revalidateTag } from "next/cache";

export async function POST(request: Request) {
  const secret = process.env.CONTENT_REVALIDATION_SECRET;
  const authorization = request.headers.get("authorization");

  if (!secret || authorization !== `Bearer ${secret}`) {
    return Response.json({ message: "Unauthorized." }, { status: 401 });
  }

  revalidateTag("home-page", "max");
  return Response.json({ revalidated: true, tag: "home-page" });
}
