import { requestToolsWebhook, unwrapN8nData } from "@/lib/n8n";

export type ScoreBand = "good" | "okay" | "poor" | "unknown";
export type CheckStrategy = "mobile" | "desktop";

export type CategoryScore = {
  id: string;
  label: string;
  score: number | null;
  band: ScoreBand;
};

export type ReachabilityItem = {
  id: string;
  label: string;
  ok: boolean;
  detail: string;
};

export type WebsiteCheckResult = {
  url: string;
  strategy: CheckStrategy;
  fetched: boolean;
  https: boolean;
  title: string | null;
  metaDescription: string | null;
  h1: string | null;
  scores: CategoryScore[];
  vitals: {
    lcp: string | null;
    cls: string | null;
    inp: string | null;
  };
  metrics: string[];
  issues: string[];
  opportunities: string[];
  goodThings: string[];
  reachability: ReachabilityItem[];
  notes: string[];
  psiAvailable: boolean;
};

export function normalizeStrategy(value: unknown): CheckStrategy {
  return value === "desktop" ? "desktop" : "mobile";
}

const PRIVATE_HOST =
  /^(localhost|127\.|10\.|192\.168\.|169\.254\.|0\.0\.0\.0|::1|172\.(1[6-9]|2\d|3[0-1])\.)/i;

export function normalizePublicUrl(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed || trimmed.length > 2048) return null;

  const withProtocol = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;

  try {
    const parsed = new URL(withProtocol);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return null;
    if (PRIVATE_HOST.test(parsed.hostname)) return null;
    parsed.hash = "";
    return parsed.toString();
  } catch {
    return null;
  }
}

function band(score: number | null): ScoreBand {
  if (score === null) return "unknown";
  if (score >= 90) return "good";
  if (score >= 50) return "okay";
  return "poor";
}

function firstMatch(html: string, pattern: RegExp) {
  const match = html.match(pattern);
  return match?.[1]?.replace(/\s+/g, " ").trim() || null;
}

function asStringList(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter(Boolean);
}

function readScore(value: unknown): number | null {
  if (typeof value !== "number" || Number.isNaN(value)) return null;
  const score = value <= 1 ? Math.round(value * 100) : Math.round(value);
  return Math.min(100, Math.max(0, score));
}

function metricValue(metrics: string[], label: string) {
  const row = metrics.find((item) =>
    item.toLowerCase().includes(label.toLowerCase()),
  );
  if (!row) return null;
  const parts = row.split(":");
  return parts.slice(1).join(":").trim() || null;
}

function analyzeHtml(
  url: string,
  html: string,
): Pick<
  WebsiteCheckResult,
  | "url"
  | "fetched"
  | "https"
  | "title"
  | "metaDescription"
  | "h1"
  | "reachability"
> {
  const title = firstMatch(html, /<title[^>]*>([\s\S]*?)<\/title>/i);
  const metaDescription =
    firstMatch(
      html,
      /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["'][^>]*>/i,
    ) ||
    firstMatch(
      html,
      /<meta[^>]+content=["']([^"']*)["'][^>]+name=["']description["'][^>]*>/i,
    );
  const extractedHeading = firstMatch(html, /<h1\b[^>]*>([\s\S]*?)<\/h1>/i);
  const h1 = extractedHeading
    ? extractedHeading.replace(/<[^>]+>/g, "").trim() || null
    : null;
  const hasTel = /href=["']tel:/i.test(html);
  const hasMailto = /href=["']mailto:/i.test(html);
  const hasForm = /<form\b/i.test(html);
  const hasViewport = /name=["']viewport["']/i.test(html);
  const hasHours =
    /\b(hours|open|monday|mon–|mon-|\d{1,2}\s?(am|pm))\b/i.test(html);
  const visiblePhone = /(\+?1[-.\s]?)?(\(?\d{3}\)?[-.\s]\d{3}[-.\s]\d{4})/.test(
    html.replace(/<script[\s\S]*?<\/script>/gi, ""),
  );

  return {
    url,
    fetched: true,
    https: url.startsWith("https://"),
    title,
    metaDescription,
    h1,
    reachability: [
      {
        id: "https",
        label: "Secure connection",
        ok: url.startsWith("https://"),
        detail: url.startsWith("https://")
          ? "The address uses HTTPS."
          : "The address is not on HTTPS.",
      },
      {
        id: "viewport",
        label: "Built for phones",
        ok: hasViewport,
        detail: hasViewport
          ? "A mobile viewport tag is present."
          : "No mobile viewport tag showed up in the homepage HTML.",
      },
      {
        id: "phone",
        label: "Tap-to-call number",
        ok: hasTel,
        detail: hasTel
          ? "A clickable phone link is on the page."
          : visiblePhone
            ? "A phone number appears as text, but it is not a tap-to-call link."
            : "No phone number stood out on the homepage.",
      },
      {
        id: "form",
        label: "Way to get in touch",
        ok: hasForm || hasMailto,
        detail: hasForm
          ? "A form is on the page."
          : hasMailto
            ? "An email link is on the page."
            : "No form or email link was obvious on the homepage.",
      },
      {
        id: "hours",
        label: "Hours mentioned",
        ok: hasHours,
        detail: hasHours
          ? "Hours or opening language appears on the page."
          : "Hours were not obvious from the homepage text.",
      },
      {
        id: "title",
        label: "Page title",
        ok: Boolean(title && title.length > 8 && !/untitled|home page/i.test(title)),
        detail: title ? `Title: ${title}` : "No page title was found.",
      },
    ],
  };
}

function scoresFromAudit(audit: Record<string, unknown> | null): CategoryScore[] {
  const rawScores =
    audit && typeof audit.scores === "object" && audit.scores
      ? (audit.scores as Record<string, unknown>)
      : {};

  const map: Array<[string, string, string[]]> = [
    ["performance", "Speed", ["performance"]],
    ["accessibility", "Accessibility", ["accessibility"]],
    ["best-practices", "Best practices", ["best_practices", "best-practices"]],
    ["seo", "SEO basics", ["seo"]],
  ];

  return map.map(([id, label, keys]) => {
    const score = keys.reduce<number | null>((found, key) => {
      return found ?? readScore(rawScores[key]);
    }, null);
    return { id, label, score, band: band(score) };
  });
}

export async function runWebsiteCheck(
  url: string,
  strategy: CheckStrategy,
  request: Request,
): Promise<WebsiteCheckResult> {
  const [auditResponse, page] = await Promise.all([
    requestToolsWebhook(
      {
        event: "tool_run",
        tool: "website-check",
        action: "run_pagespeed_audit",
        url,
        requested_url: url,
        current_website: url,
        strategy,
      },
      request,
      55000,
    ),
    fetch(url, {
      cache: "no-store",
      redirect: "follow",
      headers: {
        "User-Agent":
          "YourSiteSolutionWebsiteCheck/1.0 (+https://yoursitesolution.com/tools/website-check)",
        Accept: "text/html,application/xhtml+xml",
      },
      signal: AbortSignal.timeout(12000),
    }).catch(() => null),
  ]);

  const html = page && page.ok ? (await page.text()).slice(0, 350000) : "";
  const base = html
    ? analyzeHtml(url, html)
    : {
        url,
        fetched: false,
        https: url.startsWith("https://"),
        title: null,
        metaDescription: null,
        h1: null,
        reachability: [
          {
            id: "fetch",
            label: "Homepage readable",
            ok: false,
            detail:
              "The page could not be read directly. Speed scores may still come back from the audit.",
          },
        ],
      };

  const audit = unwrapN8nData(auditResponse.data);
  const scores = scoresFromAudit(audit);
  const metrics = asStringList(audit?.metrics);
  const issues = asStringList(audit?.critical_issues);
  const opportunities = asStringList(audit?.opportunities);
  const goodThings = asStringList(audit?.good_things);
  const psiAvailable = scores.some((item) => typeof item.score === "number");
  const speed = scores.find((item) => item.id === "performance")?.score;
  const notes: string[] = [];

  if (typeof speed === "number") {
    if (speed >= 90) {
      notes.push(
        strategy === "mobile"
          ? "Mobile speed looks solid. That is the version most customers actually use."
          : "Desktop speed looks solid on this run.",
      );
    } else if (speed >= 50) {
      notes.push(
        strategy === "mobile"
          ? "The site works, but phones are waiting longer than they should. People often leave before the page is useful."
          : "The desktop version works, but it is waiting longer than it should.",
      );
    } else {
      notes.push(
        strategy === "mobile"
          ? "On a phone, this page is slow enough that a lot of people will bounce. That usually matters more than how it looks on a desktop."
          : "On desktop, this page is slow enough that people may leave before it is useful.",
      );
    }
  } else {
    notes.push(
      strategy === "mobile"
        ? "The mobile speed test did not return scores this time. The homepage checks below still ran."
        : "The desktop speed test did not return scores this time. The homepage checks below still ran.",
    );
  }

  notes.push(...issues.slice(0, 2));

  const phone = base.reachability.find((item) => item.id === "phone");
  if (phone && !phone.ok) {
    notes.push(
      "If a customer is on a phone and cannot tap to call, you are making them work to hire you.",
    );
  }

  const contact = base.reachability.find((item) => item.id === "form");
  if (contact && !contact.ok) {
    notes.push(
      "There is no obvious form or email link on the homepage. A visitor who will not call has no next step.",
    );
  }

  if (!base.title) {
    notes.push(
      "The homepage is missing a real page title. That is a basic trust and search signal.",
    );
  }

  const finalUrl =
    typeof audit?.final_url === "string" && audit.final_url.startsWith("http")
      ? audit.final_url
      : url;

  return {
    ...base,
    url: finalUrl,
    strategy,
    scores,
    vitals: {
      lcp: metricValue(metrics, "Largest Contentful Paint"),
      cls: metricValue(metrics, "Cumulative Layout Shift"),
      inp:
        metricValue(metrics, "Interaction to Next Paint") ||
        metricValue(metrics, "Total Blocking Time"),
    },
    metrics,
    issues,
    opportunities,
    goodThings,
    notes: notes.slice(0, 6),
    psiAvailable,
  };
}

export function summarizeCheck(result: WebsiteCheckResult) {
  const speed =
    result.scores.find((item) => item.id === "performance")?.score ?? null;
  const missing = result.reachability
    .filter((item) => !item.ok)
    .map((item) => item.label);

  return {
    url: result.url,
    strategy: result.strategy,
    speed,
    https: result.https,
    title: result.title,
    missing,
    notes: result.notes,
  };
}
