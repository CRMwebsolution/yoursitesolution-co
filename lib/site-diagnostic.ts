import { normalizePublicUrl } from "@/lib/website-check";

export type DiagnosticToolSlug =
  | "seo-check"
  | "social-preview-check"
  | "broken-link-check"
  | "domain-health-check";

export type DiagnosticStatus = "pass" | "warning" | "fail" | "info";

export type DiagnosticFact = {
  label: string;
  value: string;
};

export type DiagnosticFinding = {
  status: DiagnosticStatus;
  title: string;
  detail: string;
  recommendation?: string;
  url?: string;
};

export type DiagnosticPreview = {
  title: string;
  description: string;
  imageUrl: string;
  siteName: string;
};

export type SiteDiagnosticReport = {
  tool: DiagnosticToolSlug;
  requestedUrl: string;
  finalUrl: string;
  checkedAt: string;
  summary: string;
  facts: DiagnosticFact[];
  findings: DiagnosticFinding[];
  preview: DiagnosticPreview | null;
  disclaimer: string;
};

type JsonRecord = Record<string, unknown>;

function asRecord(value: unknown): JsonRecord {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as JsonRecord)
    : {};
}

function parseJson(value: string) {
  try {
    return JSON.parse(value) as unknown;
  } catch {
    return null;
  }
}

function firstString(maxLength: number, ...values: unknown[]) {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) {
      return value.trim().slice(0, maxLength);
    }
    if (typeof value === "number" || typeof value === "boolean") {
      return String(value).slice(0, maxLength);
    }
  }
  return "";
}

function looksLikeReport(record: JsonRecord) {
  return [
    "summary",
    "facts",
    "findings",
    "checks",
    "issues",
    "preview",
    "requested_url",
  ].some((key) => key in record);
}

function unwrap(value: unknown): JsonRecord {
  let current = value;

  for (let depth = 0; depth < 7; depth += 1) {
    if (typeof current === "string") {
      const parsed = parseJson(current);
      if (parsed === null) return {};
      current = parsed;
      continue;
    }
    if (Array.isArray(current)) {
      current = current[0];
      continue;
    }

    const record = asRecord(current);
    if (!Object.keys(record).length) return {};
    if (looksLikeReport(record)) return record;

    const next = [
      record.report,
      record.data,
      record.result,
      record.output,
      record.body,
      record.json,
    ].find((candidate) => {
      if (Array.isArray(candidate)) return candidate.length > 0;
      if (typeof candidate === "string") return Boolean(candidate.trim());
      return Object.keys(asRecord(candidate)).length > 0;
    });
    if (next === undefined) return record;
    current = next;
  }

  return asRecord(current);
}

function normalizeStatus(value: unknown): DiagnosticStatus {
  const status = firstString(40, value).toLowerCase().replace(/[\s_]+/g, "-");
  if (["pass", "passed", "good", "ok", "success", "working"].includes(status)) {
    return "pass";
  }
  if (["warning", "warn", "needs-attention", "redirect"].includes(status)) {
    return "warning";
  }
  if (["fail", "failed", "problem", "error", "broken", "missing"].includes(status)) {
    return "fail";
  }
  return "info";
}

function normalizeFacts(value: unknown): DiagnosticFact[] {
  if (Array.isArray(value)) {
    return value
      .flatMap((entry) => {
        const item = asRecord(entry);
        const label = firstString(120, item.label, item.name, item.key);
        const factValue = firstString(
          500,
          item.value,
          item.detail,
          item.result,
          item.status,
        );
        return label && factValue ? [{ label, value: factValue }] : [];
      })
      .slice(0, 30);
  }

  return Object.entries(asRecord(value))
    .flatMap(([label, factValue]) => {
      const normalized = firstString(500, factValue);
      return normalized ? [{ label: label.slice(0, 120), value: normalized }] : [];
    })
    .slice(0, 30);
}

function normalizeFindings(...values: unknown[]): DiagnosticFinding[] {
  const source = values.find((value) => Array.isArray(value));
  if (!Array.isArray(source)) return [];

  return source
    .flatMap((entry) => {
      if (typeof entry === "string" && entry.trim()) {
        return [
          {
            status: "info" as const,
            title: entry.trim().slice(0, 240),
            detail: "",
          },
        ];
      }
      const item = asRecord(entry);
      const title = firstString(
        240,
        item.title,
        item.label,
        item.name,
        item.check,
        item.url,
      );
      const detail = firstString(
        2000,
        item.detail,
        item.description,
        item.message,
        item.result,
      );
      if (!title && !detail) return [];
      const findingUrl = normalizePublicUrl(item.url);
      const recommendation = firstString(
        1600,
        item.recommendation,
        item.suggested_fix,
        item.suggestedFix,
        item.next_step,
        item.nextStep,
      );
      return [
        {
          status: normalizeStatus(item.status ?? item.state ?? item.severity),
          title: title || detail.slice(0, 240),
          detail: title ? detail : "",
          ...(recommendation ? { recommendation } : {}),
          ...(findingUrl ? { url: findingUrl } : {}),
        },
      ];
    })
    .slice(0, 100);
}

function normalizePreview(value: unknown): DiagnosticPreview | null {
  const preview = asRecord(value);
  if (!Object.keys(preview).length) return null;
  const imageUrl = normalizePublicUrl(
    preview.image_url ?? preview.imageUrl ?? preview.image,
  );
  const normalized = {
    title: firstString(300, preview.title),
    description: firstString(1000, preview.description),
    imageUrl: imageUrl || "",
    siteName: firstString(160, preview.site_name, preview.siteName),
  };
  return Object.values(normalized).some(Boolean) ? normalized : null;
}

export function normalizeDiagnosticWebhookResponse(
  raw: unknown,
  expectedTool: DiagnosticToolSlug,
  requestedUrl: string,
  fallbackDisclaimer: string,
): SiteDiagnosticReport {
  const report = unwrap(raw);
  const returnedTool = firstString(100, report.tool);
  if (returnedTool && returnedTool !== expectedTool) {
    throw new Error("The diagnostic service returned the wrong tool report.");
  }

  const facts = normalizeFacts(report.facts ?? report.details ?? report.metrics);
  const findings = normalizeFindings(
    report.findings,
    report.checks,
    report.issues,
    report.results,
  );
  const summary = firstString(3000, report.summary, report.what_it_means);
  const preview = normalizePreview(report.preview ?? report.social_preview);
  if (!summary && !facts.length && !findings.length && !preview) {
    throw new Error("The diagnostic service returned an incomplete report.");
  }

  const checkedAtValue = firstString(
    80,
    report.checked_at,
    report.checkedAt,
    report.analyzed_at,
    report.tested_at,
  );
  const checkedAt = Number.isNaN(Date.parse(checkedAtValue))
    ? new Date().toISOString()
    : new Date(checkedAtValue).toISOString();
  const finalUrl =
    normalizePublicUrl(report.final_url ?? report.finalUrl) || requestedUrl;

  return {
    tool: expectedTool,
    requestedUrl,
    finalUrl,
    checkedAt,
    summary:
      summary ||
      `The check returned ${findings.length} ${findings.length === 1 ? "finding" : "findings"} and ${facts.length} ${facts.length === 1 ? "fact" : "facts"}.`,
    facts,
    findings,
    preview,
    disclaimer:
      firstString(2000, report.disclaimer) || fallbackDisclaimer,
  };
}
