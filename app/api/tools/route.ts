import { NextResponse } from "next/server";
import { sendToolsEvent, type ToolsEvent } from "@/lib/n8n";
import { allowRequest, clientKey } from "@/lib/rate-limit";

export const runtime = "nodejs";

const tools = ["website-check", "review-text", "time-check"] as const;
const events = ["tool_run", "tool_lead"] as const;

export async function POST(request: Request) {
  let body: Record<string, unknown>;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid submission." }, { status: 400 });
  }

  if (body.company_site) {
    return NextResponse.json({ ok: true });
  }

  const tool = body.tool;
  const event = body.event;

  if (
    typeof tool !== "string" ||
    !tools.includes(tool as (typeof tools)[number]) ||
    typeof event !== "string" ||
    !events.includes(event as (typeof events)[number])
  ) {
    return NextResponse.json({ error: "Unknown tool event." }, { status: 400 });
  }

  if (event === "tool_lead") {
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const name = typeof body.name === "string" ? body.name.trim() : "";
    if (!email && !name) {
      return NextResponse.json(
        { error: "Add a name or email so I can follow up." },
        { status: 400 },
      );
    }
  }

  if (!allowRequest(`tools:${clientKey(request)}`, 20, 60 * 60 * 1000)) {
    return NextResponse.json(
      { error: "Too many tool submissions from this connection. Try later." },
      { status: 429 },
    );
  }

  const sent = await sendToolsEvent(body as ToolsEvent, request);
  if (!sent) {
    return NextResponse.json(
      { error: "The details could not be delivered." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
