import { NextResponse } from "next/server";
import { sendToolsEvent } from "@/lib/n8n";
import {
  allowRequest,
  clientKey,
  getCached,
  setCached,
} from "@/lib/rate-limit";
import {
  normalizePublicUrl,
  runWebsiteCheck,
  summarizeCheck,
  type WebsiteCheckResult,
} from "@/lib/website-check";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: Request) {
  let body: Record<string, unknown>;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (body.company_site) {
    return NextResponse.json({ ok: true });
  }

  const url = typeof body.url === "string" ? normalizePublicUrl(body.url) : null;
  if (!url) {
    return NextResponse.json(
      { error: "Enter a public website address." },
      { status: 400 },
    );
  }

  const ip = clientKey(request);
  if (!allowRequest(`website-check:${ip}`, 6, 60 * 60 * 1000)) {
    return NextResponse.json(
      { error: "This check is limited to a few runs an hour. Try again later." },
      { status: 429 },
    );
  }

  const cacheKey = `website-check:${url}`;
  const cached = getCached<WebsiteCheckResult>(cacheKey);
  const result = cached ?? (await runWebsiteCheck(url));
  if (!cached) setCached(cacheKey, result, 6 * 60 * 60 * 1000);

  await sendToolsEvent(
    {
      event: "tool_run",
      tool: "website-check",
      current_website: result.url,
      tool_input: { url: result.url },
      tool_result: summarizeCheck(result),
    },
    request,
  );

  return NextResponse.json({ ok: true, result });
}
