export type ScoreBand = "good" | "okay" | "poor" | "unknown";

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
  fetched: boolean;
  https: boolean;
  title: string | null;
  metaDescription: string | null;
  h1: string | null;
  scores: {
    mobile: CategoryScore[];
    desktop: CategoryScore[];
  };
  vitals: {
    lcp: string | null;
    cls: string | null;
    inp: string | null;
  };
  reachability: ReachabilityItem[];
  notes: string[];
  psiAvailable: boolean;
};

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

function analyzeHtml(
  url: string,
  html: string,
): Omit<WebsiteCheckResult, "scores" | "vitals" | "notes" | "psiAvailable"> {
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

type PsiCategory = { score?: number };
type PsiAudit = { displayValue?: string; numericValue?: number };

async function runPsi(url: string, strategy: "mobile" | "desktop") {
  const endpoint = new URL(
    "https://www.googleapis.com/pagespeedonline/v5/runPagespeed",
  );
  endpoint.searchParams.set("url", url);
  endpoint.searchParams.set("strategy", strategy);
  for (const category of [
    "PERFORMANCE",
    "ACCESSIBILITY",
    "BEST_PRACTICES",
    "SEO",
  ]) {
    endpoint.searchParams.append("category", category);
  }
  const key = process.env.PAGESPEED_API_KEY;
  if (key) endpoint.searchParams.set("key", key);

  const response = await fetch(endpoint, {
    cache: "no-store",
    signal: AbortSignal.timeout(45000),
  });
  if (!response.ok) return null;
  return response.json() as Promise<{
    lighthouseResult?: {
      categories?: Record<string, PsiCategory>;
      audits?: Record<string, PsiAudit>;
    };
  }>;
}

function readCategories(
  data: Awaited<ReturnType<typeof runPsi>>,
): CategoryScore[] {
  const cats = data?.lighthouseResult?.categories || {};
  const map: Array<[string, string, string]> = [
    ["performance", "Speed", "performance"],
    ["accessibility", "Accessibility", "accessibility"],
    ["best-practices", "Best practices", "best-practices"],
    ["seo", "SEO basics", "seo"],
  ];
  return map.map(([id, label, key]) => {
    const raw = cats[key]?.score;
    const score = typeof raw === "number" ? Math.round(raw * 100) : null;
    return { id, label, score, band: band(score) };
  });
}

function readVital(audit?: PsiAudit) {
  return audit?.displayValue || null;
}

export async function runWebsiteCheck(url: string): Promise<WebsiteCheckResult> {
  const [mobilePsi, desktopPsi, page] = await Promise.all([
    runPsi(url, "mobile").catch(() => null),
    runPsi(url, "desktop").catch(() => null),
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
              "The page could not be read directly. Speed scores may still come back from Google.",
          },
        ],
      };

  const mobile = readCategories(mobilePsi);
  const desktop = readCategories(desktopPsi);
  const audits = mobilePsi?.lighthouseResult?.audits || {};
  const psiAvailable = Boolean(mobilePsi || desktopPsi);
  const mobileSpeed = mobile.find((item) => item.id === "performance")?.score;
  const notes: string[] = [];

  if (typeof mobileSpeed === "number") {
    if (mobileSpeed >= 90) {
      notes.push(
        "Mobile speed looks solid. That is the version most customers actually use.",
      );
    } else if (mobileSpeed >= 50) {
      notes.push(
        "The site works, but phones are waiting longer than they should. People often leave before the page is useful.",
      );
    } else {
      notes.push(
        "On a phone, this page is slow enough that a lot of people will bounce. That usually matters more than how it looks on a desktop.",
      );
    }
  } else if (!psiAvailable) {
    notes.push(
      "Google’s speed test was not available just now. The homepage checks below still ran.",
    );
  }

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

  if (notes.length === 0) {
    notes.push(
      "The basics look in place. If the site still is not getting calls, the issue is usually the offer, the copy, or how easy the next step is.",
    );
  }

  return {
    ...base,
    scores: { mobile, desktop },
    vitals: {
      lcp: readVital(audits["largest-contentful-paint"]),
      cls: readVital(audits["cumulative-layout-shift"]),
      inp: readVital(audits["interaction-to-next-paint"]),
    },
    notes: notes.slice(0, 5),
    psiAvailable,
  };
}

export function summarizeCheck(result: WebsiteCheckResult) {
  const mobileSpeed =
    result.scores.mobile.find((item) => item.id === "performance")?.score ??
    null;
  const missing = result.reachability
    .filter((item) => !item.ok)
    .map((item) => item.label);

  return {
    url: result.url,
    mobile_speed: mobileSpeed,
    https: result.https,
    title: result.title,
    missing,
    notes: result.notes,
  };
}
