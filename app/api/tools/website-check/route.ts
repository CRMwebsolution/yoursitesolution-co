import { NextResponse } from "next/server";
import {
  normalizePublicUrl,
  normalizeStrategy,
  normalizeWebhookResponse,
} from "@/lib/website-check";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<
    string,
    unknown
  > | null;
  if (!body) {
    return NextResponse.json(
      { error: "Enter a valid website address and try again." },
      { status: 400 },
    );
  }
  if (body.company_site) return NextResponse.json({ ok: true });

  const url = normalizePublicUrl(body.url);
  const strategy = normalizeStrategy(body.strategy);
  if (!url) {
    return NextResponse.json(
      { error: "Enter a public website address, such as example.com." },
      { status: 400 },
    );
  }

  const webhook = process.env.N8N_TOOLS_WEBHOOK?.trim();
  if (!webhook) {
    return NextResponse.json(
      { error: "The website checker is being connected. Please try again later." },
      { status: 503 },
    );
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 55_000);

  try {
    const response = await fetch(webhook, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({
        url,
        strategy,
        source: "yoursitesolution.com",
        channel: "tools",
        form_type: "tools",
        event: "tool_run",
        tool: "website-check",
      }),
      cache: "no-store",
      signal: controller.signal,
    });

    const result = await response.json().catch(() => null);
    if (!response.ok || !result) {
      return NextResponse.json(
        {
          error:
            "The website could not be analyzed right now. Please try again shortly.",
        },
        { status: response.status === 429 ? 429 : 502 },
      );
    }

    return NextResponse.json(
      { ok: true, report: normalizeWebhookResponse(result, url, strategy) },
      { headers: { "cache-control": "no-store" } },
    );
  } catch (error) {
    const timedOut = error instanceof Error && error.name === "AbortError";
    return NextResponse.json(
      {
        error: timedOut
          ? "The website took too long to analyze. Please wait a moment and try again."
          : error instanceof Error && error.message.includes("incomplete")
            ? "The analysis service returned an incomplete report."
            : "The website could not be analyzed right now. Please try again shortly.",
      },
      { status: timedOut ? 504 : 502 },
    );
  } finally {
    clearTimeout(timeout);
  }
}
