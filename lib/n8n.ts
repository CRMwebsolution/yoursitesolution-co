export type ToolsEvent = {
  event: "tool_run" | "tool_lead";
  tool: "website-check" | "review-text" | "time-check";
  [key: string]: unknown;
};

export type ToolsWebhookResult = {
  ok: boolean;
  status: number;
  data: unknown;
};

function toolsWebhookUrl() {
  return (
    process.env.N8N_TOOLS_WEBHOOK ||
    "https://n8n.southernautomate.com/webhook/59c03a5c-8a65-4e97-a760-975fc5eda64b"
  );
}

export function unwrapN8nData(raw: unknown): Record<string, unknown> | null {
  if (Array.isArray(raw)) {
    const first = raw[0];
    if (first && typeof first === "object" && !Array.isArray(first)) {
      return first as Record<string, unknown>;
    }
    return null;
  }

  if (!raw || typeof raw !== "object") return null;
  const record = raw as Record<string, unknown>;
  if (Array.isArray(record.data)) {
    const first = record.data[0];
    if (first && typeof first === "object" && !Array.isArray(first)) {
      return first as Record<string, unknown>;
    }
  }
  return record;
}

export async function requestToolsWebhook(
  payload: ToolsEvent,
  request: Request,
  timeoutMs = 55000,
): Promise<ToolsWebhookResult> {
  try {
    const forwarded = await fetch(toolsWebhookUrl(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source: "yoursitesolution.com",
        channel: "tools",
        form_type: "tools",
        submitted_at: new Date().toISOString(),
        page_url: request.headers.get("referer") || "unknown",
        user_agent: request.headers.get("user-agent") || "unknown",
        ...payload,
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(timeoutMs),
    });

    const text = await forwarded.text();
    let data: unknown = null;
    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        data = { raw: text };
      }
    }

    if (!forwarded.ok) {
      console.error(`Tools webhook ${forwarded.status}: ${text.slice(0, 400)}`);
    }

    return { ok: forwarded.ok, status: forwarded.status, data };
  } catch (error) {
    console.error("Tools webhook failed.", error);
    return { ok: false, status: 0, data: null };
  }
}

export async function sendToolsEvent(
  payload: ToolsEvent,
  request: Request,
): Promise<boolean> {
  const result = await requestToolsWebhook(payload, request, 20000);
  return result.ok;
}
