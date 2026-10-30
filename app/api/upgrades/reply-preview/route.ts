import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { allowRequest, clientKey, getCached, setCached } from "@/lib/rate-limit";
import { normalizeReplyPreview, parseReplyPreviewInput, type ReplyPreview } from "@/lib/reply-preview";

export const runtime = "nodejs";
export const maxDuration = 60;
const WINDOW = 15 * 60 * 1000;
const TIMEOUT = 50_000;
let activeRequests = 0;

function respond(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: { "cache-control": "no-store" } });
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) {
    return respond({ error: "Open this demo on Your Site Solution to try it." }, 403);
  }
  const raw = await request.text().catch(() => "");
  if (raw.length > 6000) return respond({ error: "Keep the sample message under 1,600 characters." }, 413);
  let body: unknown;
  try { body = JSON.parse(raw); } catch { return respond({ error: "Enter a sample request and try again." }, 400); }
  if (body && typeof body === "object" && "company_site" in body && body.company_site) {
    return respond({ error: "This request could not be processed." }, 400);
  }
  const input = parseReplyPreviewInput(body);
  if (!input) return respond({ error: "Enter a sample message of 20–1,600 characters and a business name under 100 characters." }, 400);

  // Dedicated preview destination. Never fall back to the live lead webhook,
  // which sends customer and owner emails.
  const webhook = process.env.N8N_REPLY_PREVIEW_WEBHOOK?.trim();
  const token = process.env.N8N_REPLY_PREVIEW_TOKEN?.trim();
  if (!webhook || !token) return respond({ error: "The live preview is being connected. Please try again shortly or ask Cody for a demonstration." }, 503);
  if (!allowRequest(`reply-preview:${clientKey(request)}`, 3, WINDOW)) {
    return respond({ error: "You have tried this demo three times. Please wait fifteen minutes before trying again." }, 429);
  }
  const cacheKey = `reply-preview:${createHash("sha256").update(JSON.stringify(input)).digest("hex")}`;
  const cached = getCached<ReplyPreview>(cacheKey);
  if (cached) return respond({ ok: true, preview: cached });
  if (activeRequests >= 2) return respond({ error: "The preview is busy. Please try again in a moment." }, 429);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT);
  activeRequests += 1;
  try {
    const response = await fetch(webhook, {
      method: "POST", redirect: "error", cache: "no-store", signal: controller.signal,
      headers: { "content-type": "application/json", accept: "application/json", authorization: `Bearer ${token}` },
      body: JSON.stringify({ ...input, tool: "reply-preview", version: 1, source: "yoursitesolution.com/upgrades" }),
    });
    if (!response.ok) return respond({ error: "The preview could not finish this time. Please try again in a moment." }, response.status === 429 ? 429 : 502);
    const preview = normalizeReplyPreview(await response.json().catch(() => null));
    if (!preview) return respond({ error: "The preview returned an incomplete answer. Please try again." }, 502);
    setCached(cacheKey, preview, 10 * 60 * 1000);
    return respond({ ok: true, preview });
  } catch (error) {
    const timedOut = error instanceof Error && error.name === "AbortError";
    return respond({ error: timedOut ? "That preview took too long. Try a shorter sample message." : "The preview is temporarily unavailable. Please try again later." }, timedOut ? 504 : 502);
  } finally {
    clearTimeout(timeout);
    activeRequests -= 1;
  }
}
