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
  strategy: CheckStrategy;
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

type JsonRecord = Record<string, unknown>;

const REPORT_KEYS = [
  "scores",
  "performance",
  "overallPerformance",
  "metrics",
  "summary",
  "fixFirst",
  "criticalIssues",
  "opportunities",
] as const;

export function normalizeStrategy(value: unknown): CheckStrategy {
  return typeof value === "string" && value.toLowerCase() === "desktop"
    ? "desktop"
    : "mobile";
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
    if (typeof value === "string" && value.trim()) {
      return value.trim().slice(0, 4000);
    }
  }
  return "";
}

function parseJson(value: string) {
  try {
    return JSON.parse(value) as unknown;
  } catch {
    return null;
  }
}

function looksLikeReport(value: JsonRecord) {
  return REPORT_KEYS.some((key) => key in value);
}

function unwrapWebhookResponse(value: unknown): JsonRecord {
  let current = value;

  for (let depth = 0; depth < 6; depth += 1) {
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

function normalizeScoreValue(value: unknown): number | null {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    const record = asRecord(value);
    return normalizeScoreValue(
      record.score ?? record.value ?? record.numericValue ?? record.numeric_value,
    );
  }

  const parsed =
    typeof value === "number"
      ? value
      : typeof value === "string" && /^\s*\d+(?:\.\d+)?%?\s*$/.test(value)
        ? Number.parseFloat(value)
        : Number.NaN;

  if (!Number.isFinite(parsed)) return null;
  const score = parsed >= 0 && parsed <= 1 ? parsed * 100 : parsed;
  return Math.max(0, Math.min(100, Math.round(score)));
}

function scoreFromList(value: unknown, ids: string[]) {
  if (!Array.isArray(value)) return null;
  const wanted = ids.map((id) => id.toLowerCase().replace(/[_\s]/g, "-"));

  for (const entry of value) {
    const item = asRecord(entry);
    const id = firstString(item.id, item.key, item.name, item.label)
      .toLowerCase()
      .replace(/[_\s]/g, "-");
    if (wanted.includes(id)) {
      return normalizeScoreValue(item.score ?? item.value ?? item.numericValue);
    }
  }

  return null;
}

function firstScore(...values: unknown[]) {
  for (const value of values) {
    const score = normalizeScoreValue(value);
    if (score !== null) return score;
  }
  return null;
}

function normalizeStringList(...values: unknown[]) {
  for (const value of values) {
    if (!Array.isArray(value)) continue;

    const items = value.flatMap((entry) => {
      if (typeof entry === "string" && entry.trim()) return [entry.trim()];
      const item = asRecord(entry);
      const label = firstString(item.label, item.name, item.title, item.metric);
      const metricValue = firstString(
        item.displayValue,
        item.display_value,
        item.value,
      );
      if (label && metricValue) return [`${label}: ${metricValue}`];
      return label ? [label] : [];
    });

    if (items.length) return [...new Set(items)].slice(0, 30);
  }

  return [];
}

function normalizeFindings(...values: unknown[]): AuditFinding[] {
  const value = values.find(
    (candidate) => Array.isArray(candidate) && candidate.length > 0,
  );
  if (!Array.isArray(value)) return [];

  const findings = value.flatMap((entry) => {
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
      item.whyItMatters,
      item.why_it_matters,
    );
    const recommendation = firstString(
      item.recommendation,
      item.suggestedFix,
      item.suggested_fix,
      item.fix,
      item.whatCanHelp,
      item.what_can_help,
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

  return findings
    .filter(
      (finding, index, all) =>
        all.findIndex(
          (candidate) =>
            candidate.title.toLowerCase() === finding.title.toLowerCase(),
        ) === index,
    )
    .slice(0, 20);
}

function generatedSummary(
  strategy: CheckStrategy,
  performance: number | null,
  fixFirst: AuditFinding[],
) {
  const device = strategy === "desktop" ? "desktop" : "mobile";
  const priorities = fixFirst.length
    ? ` The report found ${fixFirst.length} priorit${
        fixFirst.length === 1 ? "y" : "ies"
      } to review first.`
    : "";

  if (performance === null) {
    return `The ${device} check finished. Use the measured details and findings below to decide what is worth addressing.${priorities}`;
  }
  if (performance >= 90) {
    return `This run found strong ${device} performance. Check the other scores and findings before assuming the whole page is finished.${priorities}`;
  }
  if (performance >= 50) {
    return `The page loaded, but this ${device} run found performance that could make some visitors wait longer than they should.${priorities}`;
  }
  return `This ${device} run found slow performance that can get in the way before a visitor reaches the useful part of the page.${priorities}`;
}

function normalizeDate(...values: unknown[]) {
  for (const value of values) {
    if (typeof value !== "string" || !value.trim()) continue;
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) return parsed.toISOString();
  }
  return new Date().toISOString();
}

export function normalizeWebhookResponse(
  value: unknown,
  requestedUrl: string,
  requestedStrategy: CheckStrategy,
): WebsiteCheckReport {
  const source = unwrapWebhookResponse(value);
  const scores = asRecord(source.scores);
  const categories = asRecord(source.categories);
  const lighthouse = asRecord(source.lighthouseResult ?? source.lighthouse_result);
  const lighthouseCategories = asRecord(lighthouse.categories);

  const performance = firstScore(
    scores.performance,
    source.performance,
    source.performanceScore,
    source.performance_score,
    source.overallPerformance,
    source.overall_performance,
    categories.performance,
    lighthouseCategories.performance,
    scoreFromList(source.scores, ["performance", "speed"]),
  );
  const accessibility = firstScore(
    scores.accessibility,
    source.accessibility,
    source.accessibilityScore,
    source.accessibility_score,
    categories.accessibility,
    lighthouseCategories.accessibility,
    scoreFromList(source.scores, ["accessibility"]),
  );
  const bestPractices = firstScore(
    scores.bestPractices,
    scores.best_practices,
    scores["best-practices"],
    source.bestPractices,
    source.best_practices,
    source.bestPracticesScore,
    source.best_practices_score,
    categories.bestPractices,
    categories.best_practices,
    categories["best-practices"],
    lighthouseCategories["best-practices"],
    scoreFromList(source.scores, ["best-practices", "best practices"]),
  );
  const seo = firstScore(
    scores.seo,
    source.seo,
    source.seoScore,
    source.seo_score,
    categories.seo,
    lighthouseCategories.seo,
    scoreFromList(source.scores, ["seo", "seo-basics"]),
  );

  const metrics = normalizeStringList(
    source.metrics,
    source.keyMetrics,
    source.key_metrics,
    Array.isArray(source.summary) ? source.summary : null,
  );
  const fixFirst = normalizeFindings(
    source.fixFirst,
    source.fix_first,
    source.criticalIssues,
    source.critical_issues,
    source.verifiedIssues,
    source.verified_issues,
    source.issues,
  );
  const worthImproving = normalizeFindings(
    source.worthImproving,
    source.worth_improving,
    source.opportunities,
    source.verifiedOpportunities,
    source.verified_opportunities,
  );
  const doingWell = normalizeFindings(
    source.doingWell,
    source.doing_well,
    source.goodThings,
    source.good_things,
    source.passedAudits,
    source.passed_audits,
  );

  if (
    [performance, accessibility, bestPractices, seo].every(
      (score) => score === null,
    ) &&
    !metrics.length &&
    !fixFirst.length &&
    !worthImproving.length &&
    !doingWell.length
  ) {
    throw new Error("The analysis service returned an incomplete report.");
  }

  const strategy = normalizeStrategy(source.strategy || requestedStrategy);
  const explicitSummary = firstString(
    source.overallSummary,
    source.overall_summary,
    source.reportText,
    source.report_text,
    typeof source.summary === "string" ? source.summary : "",
  );
  const responseUrl = normalizePublicUrl(
    firstString(source.url, source.finalUrl, source.final_url),
  );

  return {
    url: responseUrl || requestedUrl,
    testedAt: normalizeDate(
      source.testedAt,
      source.tested_at,
      source.analyzedAt,
      source.analyzed_at,
      source.generatedAt,
      source.generated_at,
    ),
    strategy,
    summary:
      explicitSummary || generatedSummary(strategy, performance, fixFirst),
    metrics,
    scores: { performance, accessibility, bestPractices, seo },
    fixFirst,
    worthImproving,
    doingWell,
    disclaimer:
      firstString(source.disclaimer) ||
      "This automated report is a snapshot. PageSpeed results can move between runs as network, server, and website conditions change.",
  };
}
