import { NextResponse } from "next/server";
import { diagnosticToolDefinitions, isDiagnosticTool } from "@/lib/diagnostic-tools";
import { normalizeDiagnosticWebhookResponse } from "@/lib/site-diagnostic";
import { allowRequest, clientKey, getCached, setCached } from "@/lib/rate-limit";
import { requestToolsWorkflow } from "@/lib/tools-workflow";
import { normalizePublicUrl } from "@/lib/website-check";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const RATE_LIMIT_WINDOW = 5 * 60 * 1000;
const CACHE_TIME = 10 * 60 * 1000;

export async function POST(
  request: Request,
  context: { params: Promise<{ tool: string }> },
) {
  const { tool: routeTool } = await context.params;
  if (!isDiagnosticTool(routeTool)) {
    return NextResponse.json({ error: "Unknown tool." }, { status: 404 });
  }

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) {
    return NextResponse.json(
      { error: "Enter a valid public website address and try again." },
      { status: 400 },
    );
  }
  if (body.company_site) return NextResponse.json({ ok: true });

  const url = normalizePublicUrl(body.url);
  if (!url) {
    return NextResponse.json(
      { error: "Enter a public website address, such as example.com." },
      { status: 400 },
    );
  }

  const requestKey = clientKey(request);
  if (!allowRequest(`${routeTool}:${requestKey}`, 3, RATE_LIMIT_WINDOW)) {
    return NextResponse.json(
      { error: "You have reached the testing limit. Wait five minutes, then try again." },
      { status: 429 },
    );
  }

  const cacheKey = `${routeTool}:${url}`;
  const cached = getCached<ReturnType<typeof normalizeDiagnosticWebhookResponse>>(cacheKey);
  if (cached) {
    return NextResponse.json(
      { ok: true, report: cached },
      { headers: { "cache-control": "no-store" } },
    );
  }

  const definition = diagnosticToolDefinitions[routeTool];
  const parsedUrl = new URL(url);
  const workflowInput: Record<string, unknown> = { url };
  if (routeTool === "broken-link-check") {
    workflowInput.max_pages = definition.maxPages;
    workflowInput.max_links =
      diagnosticToolDefinitions["broken-link-check"].maxLinks;
  }
  if (routeTool === "domain-health-check") {
    workflowInput.domain = parsedUrl.hostname.replace(/^www\./, "");
  }

  try {
    // `definition.tool` comes from the server-side allowlist above. A browser
    // cannot supply or override the top-level tool value sent to n8n.
    const workflow = await requestToolsWorkflow(
      definition.tool,
      workflowInput,
      55_000,
    );

    if (workflow.error === "not-configured") {
      return NextResponse.json(
        { error: "This live checker is temporarily unavailable. Please try again later." },
        { status: 503 },
      );
    }
    if (workflow.error === "timeout") {
      return NextResponse.json(
        { error: "The live check took too long. Wait a moment, then try again." },
        { status: 504 },
      );
    }
    if (workflow.error === "invalid-response") {
      return NextResponse.json(
        { error: "The checking service returned an unreadable response. Please try again later." },
        { status: 502 },
      );
    }
    if (!workflow.ok || !workflow.data) {
      return NextResponse.json(
        {
          error:
            "The checking service could not complete this request. Please try again later.",
        },
        { status: workflow.status === 429 ? 429 : 502 },
      );
    }

    const report = normalizeDiagnosticWebhookResponse(
      workflow.data,
      definition.tool,
      url,
      definition.disclaimer,
    );
    setCached(cacheKey, report, CACHE_TIME);
    return NextResponse.json(
      { ok: true, report },
      { headers: { "cache-control": "no-store" } },
    );
  } catch (error) {
    console.error(`Diagnostic tool "${routeTool}" failed.`, {
      message: error instanceof Error ? error.message : "Unknown error",
    });
    return NextResponse.json(
      { error: "The n8n branch returned an incomplete or unexpected report." },
      { status: 502 },
    );
  }
}
