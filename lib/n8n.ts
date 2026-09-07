export type ToolsEvent = {
  event: "tool_run" | "tool_lead";
  tool: "website-check" | "review-text" | "time-check";
  [key: string]: unknown;
};

export async function sendToolsEvent(
  payload: ToolsEvent,
  request: Request,
): Promise<boolean> {
  const webhook =
    process.env.N8N_TOOLS_WEBHOOK ||
    "https://n8n.southernautomate.com/webhook/59c03a5c-8a65-4e97-a760-975fc5eda64b";

  try {
    const forwarded = await fetch(webhook, {
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
    });

    if (!forwarded.ok) {
      const detail = await forwarded.text().catch(() => "");
      console.error(
        `Tools webhook ${forwarded.status}: ${detail.slice(0, 400)}`,
      );
    }

    return forwarded.ok;
  } catch (error) {
    console.error("Tools webhook failed.", error);
    return false;
  }
}
