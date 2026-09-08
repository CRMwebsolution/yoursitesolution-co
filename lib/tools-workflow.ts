import type { ToolSlug } from "@/config/tools";

type WorkflowInput = Record<string, unknown>;

export type ToolsWorkflowResult = {
  ok: boolean;
  status: number;
  data: unknown;
  error: "not-configured" | "timeout" | "request-failed" | null;
};

function toolsWebhookUrl() {
  return (
    process.env.N8N_TOOLS_WEBHOOK?.trim() ||
    process.env.N8N_WEBSITE_AUDIT_WEBHOOK_URL?.trim() ||
    ""
  );
}

export function buildToolsWorkflowPayload(
  tool: ToolSlug,
  input: WorkflowInput,
) {
  return {
    ...input,
    tool,
    event: "tool_run" as const,
    source: "yoursitesolution.com" as const,
    submitted_at: new Date().toISOString(),
  };
}

export async function requestToolsWorkflow(
  tool: ToolSlug,
  input: WorkflowInput,
  timeoutMs = 55_000,
): Promise<ToolsWorkflowResult> {
  const webhook = toolsWebhookUrl();
  if (!webhook) {
    console.error("N8N_TOOLS_WEBHOOK is not configured.");
    return { ok: false, status: 0, data: null, error: "not-configured" };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const headers: Record<string, string> = {
      "content-type": "application/json",
      accept: "application/json",
    };
    const token =
      process.env.N8N_TOOLS_TOKEN?.trim() ||
      process.env.N8N_WEBSITE_AUDIT_TOKEN?.trim();
    if (token) headers.authorization = `Bearer ${token}`;

    const response = await fetch(webhook, {
      method: "POST",
      headers,
      body: JSON.stringify(buildToolsWorkflowPayload(tool, input)),
      cache: "no-store",
      signal: controller.signal,
    });

    const responseText = await response.text();
    let data: unknown = null;
    if (responseText) {
      try {
        data = JSON.parse(responseText) as unknown;
      } catch {
        data = responseText;
      }
    }

    return {
      ok: response.ok,
      status: response.status,
      data,
      error: response.ok ? null : "request-failed",
    };
  } catch (error) {
    const timedOut = error instanceof Error && error.name === "AbortError";
    if (!timedOut) console.error("Tools workflow request failed.", error);
    return {
      ok: false,
      status: 0,
      data: null,
      error: timedOut ? "timeout" : "request-failed",
    };
  } finally {
    clearTimeout(timeout);
  }
}

