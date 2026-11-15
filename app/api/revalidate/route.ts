import { revalidateTag } from "next/cache";
import { timingSafeEqual } from "node:crypto";

// Sanity calls this on every publish / unpublish / delete (webhook), so the
// site shows the change in seconds instead of waiting for the cache to expire.
// The webhook sends the shared secret in the "x-revalidate-secret" header.
export async function POST(request: Request) {
  const secret = process.env.REVALIDATE_SECRET;
  const sent = request.headers.get("x-revalidate-secret") ?? "";
  const ok =
    !!secret &&
    sent.length === secret.length &&
    timingSafeEqual(Buffer.from(sent), Buffer.from(secret));
  if (!ok) return Response.json({ revalidated: false }, { status: 401 });

  // expire: 0 → the next visit waits for fresh data instead of seeing old data.
  revalidateTag("site", { expire: 0 });
  return Response.json({ revalidated: true, now: Date.now() });
}
