export type ReplyPreviewInput = {
  business: string;
  message: string;
  language: "en" | "es";
};

export type ReplyPreview = {
  customer_reply: string[];
  owner_summary: string;
  findings: { text: string; source_ids: string[] }[];
  next_step: string;
  research: {
    status: "completed" | "not_needed";
    sources: { id: string; title: string; url: string }[];
  };
};

function object(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown> : null;
}

export function parseReplyPreviewInput(value: unknown): ReplyPreviewInput | null {
  const body = object(value);
  if (!body || typeof body.message !== "string") return null;
  const message = body.message.trim();
  if (message.length < 20 || message.length > 1600) return null;
  if (body.business !== undefined && typeof body.business !== "string") return null;
  const business = typeof body.business === "string" ? body.business.trim() : "";
  if (business.length > 100) return null;
  if (body.language !== undefined && body.language !== "en" && body.language !== "es") return null;
  return { business, message, language: body.language === "es" ? "es" : "en" };
}

function shortText(value: unknown, max: number): value is string {
  return typeof value === "string" && value.trim().length > 0 && value.length <= max;
}

// Treat even the private workflow response as untrusted input. Only return the
// display contract; API details, raw research, and owner configuration stay out.
export function normalizeReplyPreview(value: unknown): ReplyPreview | null {
  const envelope = object(Array.isArray(value) && value.length === 1 ? value[0] : value);
  if (!envelope || envelope.ok !== true || envelope.version !== 1) return null;
  const preview = object(envelope.preview);
  if (!preview || !Array.isArray(preview.customer_reply)
    || preview.customer_reply.length < 1 || preview.customer_reply.length > 3
    || !preview.customer_reply.every(value => shortText(value, 1200))
    || !shortText(preview.owner_summary, 1200) || !shortText(preview.next_step, 700)
    || !Array.isArray(preview.findings) || preview.findings.length > 3) return null;
  const research = object(preview.research);
  if (!research || !["completed", "not_needed"].includes(String(research.status))
    || !Array.isArray(research.sources) || research.sources.length > 3) return null;
  const sources: ReplyPreview["research"]["sources"] = [];
  for (const item of research.sources) {
    const source = object(item);
    if (!source || !shortText(source.id, 16) || !/^S[1-9]\d*$/.test(source.id)
      || !shortText(source.title, 300) || !shortText(source.url, 2000)) return null;
    try {
      const url = new URL(source.url);
      if (!["https:", "http:"].includes(url.protocol) || url.username || url.password) return null;
    } catch { return null; }
    if (sources.some(item => item.id === source.id)) return null;
    sources.push({ id: source.id, title: source.title, url: source.url });
  }
  if (research.status === "completed" && !sources.length) return null;
  if (research.status === "not_needed" && (sources.length || preview.findings.length)) return null;
  const findings: ReplyPreview["findings"] = [];
  for (const item of preview.findings) {
    const finding = object(item);
    if (!finding || !shortText(finding.text, 700) || !Array.isArray(finding.source_ids)
      || !finding.source_ids.length || finding.source_ids.length > 3
      || !finding.source_ids.every(id => typeof id === "string" && sources.some(source => source.id === id))) return null;
    findings.push({ text: finding.text, source_ids: finding.source_ids as string[] });
  }
  return {
    customer_reply: preview.customer_reply as string[], owner_summary: preview.owner_summary,
    findings, next_step: preview.next_step,
    research: { status: research.status as ReplyPreview["research"]["status"], sources },
  };
}
