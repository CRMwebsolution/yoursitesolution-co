import { NextResponse } from "next/server";

export const runtime = "nodejs";

const requiredFields = ["name", "business_name", "email", "form_type"];

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

  const missingField = requiredFields.some(
    (field) => typeof body[field] !== "string" || !body[field]?.toString().trim(),
  );

  if (missingField) {
    return NextResponse.json(
      { error: "Please complete the required fields." },
      { status: 400 },
    );
  }

  const webhook = process.env.N8N_LEAD_WEBHOOK;

  if (!webhook) {
    console.error("N8N_LEAD_WEBHOOK is not configured.");
    return NextResponse.json(
      { error: "The contact form is not configured." },
      { status: 503 },
    );
  }
  const forwarded = await fetch(webhook, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...body,
      submitted_at: new Date().toISOString(),
      page_url: request.headers.get("referer") || "unknown",
      user_agent: request.headers.get("user-agent") || "unknown",
    }),
    cache: "no-store",
  });

  if (!forwarded.ok) {
    return NextResponse.json(
      { error: "The message could not be delivered." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
