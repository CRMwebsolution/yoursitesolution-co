import { NextResponse } from "next/server";
import {
  normalizePublicUrl,
  normalizeStrategy,
  normalizeWebhookResponse,
  type WebsiteCheckReport,
} from "@/lib/website-check";
import {
  allowRequest,
  clientKey,
  getCached,
  setCached,
} from "@/lib/rate-limit";
import { requestToolsWorkflow } from "@/lib/tools-workflow";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 120;

const RATE_LIMIT_WINDOW = 3 * 60 * 1000;
const CACHE_TIME = 15 * 60 * 1000;

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

  const requestKey = clientKey(request);
  if (!allowRequest(`website-check:${requestKey}`, 2, RATE_LIMIT_WINDOW)) {
    return NextResponse.json(
      {
        error:
          "You have reached the testing limit. Wait three minutes, then try again.",
      },
      { status: 429 },
    );
  }

  const cacheKey = `website-check:${strategy}:${url}`;
  const cached = getCached<WebsiteCheckReport>(cacheKey);
  if (cached) {
    return NextResponse.json(
      { ok: true, report: cached },
      { headers: { "cache-control": "no-store" } },
    );
  }

  try {
    const workflow = await requestToolsWorkflow(
      "website-check",
      { url, strategy },
      110_000,
    );

    if (workflow.error === "not-configured") {
      return NextResponse.json(
        {
          error: "The website checker is being connected. Please try again later.",
        },
        { status: 503 },
      );
    }

    if (workflow.error === "timeout") {
      return NextResponse.json(
        {
          error:
            "The website took too long to analyze. Please wait a moment and try again.",
        },
        { status: 504 },
      );
    }

    if (!workflow.ok || !workflow.data) {
      return NextResponse.json(
        {
          error:
            "The website could not be analyzed right now. Please try again shortly.",
        },
        { status: workflow.status === 429 ? 429 : 502 },
      );
    }

    const report = normalizeWebhookResponse(workflow.data, url, strategy);
    setCached(cacheKey, report, CACHE_TIME);

    return NextResponse.json(
      { ok: true, report },
      { headers: { "cache-control": "no-store" } },
    );
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error && error.message.includes("incomplete")
            ? "The analysis service returned an incomplete report."
            : "The website could not be analyzed right now. Please try again shortly.",
      },
      { status: 502 },
    );
  }
}
