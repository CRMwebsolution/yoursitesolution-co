export type CheckStrategy = "mobile" | "desktop";

export type AuditFinding = {
  title: string;
  explanation?: string;
  businessImpact?: string;
  recommendation?: string;
};

export type WebsiteCheckReport = {
  url: string;
  testedAt: string;
  strategy: string;
  summary: string;
  metrics: string[];
  scores: {
    performance: number | null;
    accessibility: number | null;
    bestPractices: number | null;
    seo: number | null;
  };
  fixFirst: AuditFinding[];
  worthImproving: AuditFinding[];
  doingWell: AuditFinding[];
  disclaimer: string;
};

export type WebsiteCheckResult = WebsiteCheckReport;

type JsonRecord = Record<string, unknown>;

export function normalizeStrategy(value: unknown): CheckStrategy {
  return value === "desktop" ? "desktop" : "mobile";
}

export function normalizePublicUrl(value: unknown) {
  if (typeof value !== "string" || !value.trim() || value.length > 2048) {
    return null;
  }
  const trimmed = value.trim();
  const withProtocol = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;

  try {
    const url = new URL(withProtocol);
    const hostname = url.hostname.toLowerCase().replace(/\.$/, "");
    const blockedHost =
      hostname === "localhost" ||
      hostname.endsWith(".localhost") ||
      hostname.endsWith(".local") ||
      hostname.endsWith(".internal");
    const blockedIpv4 =
      /^(?:0|10|127|169\.254|192\.168|172\.(?:1[6-9]|2\d|3[01]))(?:\.|$)/.test(
        hostname,
      );
    const blockedIpv6 =
      hostname === "::1" ||
      hostname.startsWith("fc") ||
      hostname.startsWith("fd") ||
      hostname.startsWith("fe80:");
    if (
      !hostname ||
      blockedHost ||
      blockedIpv4 ||
      blockedIpv6 ||
      !["http:", "https:"].includes(url.protocol)
    ) {
      return null;
    }
    url.username = "";
    url.password = "";
    url.hash = "";
    return url.pathname === "/" && !url.search ? url.origin : url.toString();
  } catch {
    return null;
  }
}

function asRecord(value: unknown): JsonRecord {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as JsonRecord)
    : {};
}

function firstString(...values: unknown[]) {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return "";
}

function asStringList(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is string => typeof item === "string" && Boolean(item.trim()))
    .map((item) => item.trim());
}

function normalizeScore(...values: unknown[]): number | null {
  for (const value of values) {
    const parsed =
      typeof value === "number"
        ? value
        : typeof value === "string"
          ? Number(value)
          : Number.NaN;
    if (!Number.isFinite(parsed)) continue;
    const score = parsed >= 0 && parsed <= 1 ? parsed * 100 : parsed;
    return Math.max(0, Math.min(100, Math.round(score)));
  }
  return null;
}

function normalizeFindings(value: unknown): AuditFinding[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((entry) => {
    if (typeof entry === "string" && entry.trim()) {
      return [{ title: entry.trim() }];
    }
    const item = asRecord(entry);
    const title = firstString(item.title, item.heading, item.name, item.issue);
    const explanation = firstString(
      item.explanation,
      item.description,
      item.detail,
      item.message,
    );
    if (!title && !explanation) return [];
    const businessImpact = firstString(
      item.businessImpact,
      item.business_impact,
      item.impact,
    );
    const recommendation = firstString(
      item.recommendation,
      item.suggestedFix,
      item.suggested_fix,
      item.fix,
    );
    return [
      {
        title: title || explanation,
        ...(title && explanation ? { explanation } : {}),
        ...(businessImpact ? { businessImpact } : {}),
        ...(recommendation ? { recommendation } : {}),
      },
    ];
  });
}

function unwrapWebhookResponse(value: unknown): JsonRecord {
  const first = Array.isArray(value) ? value[0] : value;
  const outer = asRecord(first);
  const report = asRecord(outer.report);
  return report.url || report.scores ? report : outer;
}

export function normalizeWebhookResponse(
  value: unknown,
  requestedUrl: string,
  requestedStrategy: CheckStrategy,
): WebsiteCheckReport {
  const source = unwrapWebhookResponse(value);
  const scores = asRecord(source.scores);
  const performance = normalizeScore(
    scores.performance,
    source.performance,
    source.overallPerformance,
    source.overall_performance,
  );
  const accessibility = normalizeScore(scores.accessibility, source.accessibility);
  const bestPractices = normalizeScore(
    scores.bestPractices,
    scores.best_practices,
    source.bestPractices,
    source.best_practices,
  );
  const seo = normalizeScore(scores.seo, source.seo);
  const summaryList = asStringList(source.summary);
  const summary =
    firstString(
      source.overallSummary,
      source.overall_summary,
      source.report_text,
      typeof source.summary === "string" ? source.summary : "",
    ) ||
    (summaryList.length
      ? summaryList.join(" ")
      : "Your website check finished. Review the scores and findings below.");
  const fixFirst = normalizeFindings(
    source.fixFirst ??
      source.fix_first ??
      source.criticalIssues ??
      source.critical_issues,
  );
  const worthImproving = normalizeFindings(
    source.worthImproving ?? source.worth_improving ?? source.opportunities,
  );
  const doingWell = normalizeFindings(
    source.doingWell ?? source.doing_well ?? source.goodThings ?? source.good_things,
  );

  if (
    [performance, accessibility, bestPractices, seo].every((score) => score === null) &&
    !fixFirst.length &&
    !worthImproving.length &&
    !doingWell.length
  ) {
    throw new Error("The analysis service returned an incomplete report.");
  }

  return {
    url: firstString(source.url, source.finalUrl, source.final_url) || requestedUrl,
    testedAt:
      firstString(source.testedAt, source.tested_at, source.analyzed_at) ||
      new Date().toISOString(),
    strategy: firstString(source.strategy) || requestedStrategy,
    summary,
    metrics: asStringList(source.metrics).length
      ? asStringList(source.metrics)
      : summaryList,
    scores: { performance, accessibility, bestPractices, seo },
    fixFirst,
    worthImproving,
    doingWell,
    disclaimer:
      firstString(source.disclaimer) ||
      "This report is a snapshot. Scores can change as internet, server, and website conditions change.",
  };
}
