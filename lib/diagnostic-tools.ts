import type { DiagnosticToolSlug } from "@/lib/site-diagnostic";

export const diagnosticToolDefinitions = {
  "seo-check": {
    tool: "seo-check",
    maxPages: 1,
    disclaimer:
      "This checks selected on-page and technical SEO signals on one public page. It does not predict rankings, traffic, indexing, or business results.",
  },
  "social-preview-check": {
    tool: "social-preview-check",
    maxPages: 1,
    disclaimer:
      "This previews public metadata returned at check time. The service may fall back to the regular page title or description when dedicated sharing tags are missing. Social platforms may cache older values, crop images differently, or choose different content.",
  },
  "broken-link-check": {
    tool: "broken-link-check",
    maxPages: 20,
    maxLinks: 250,
    disclaimer:
      "This is a limited public crawl, not proof that every link on the website works. Blocked, authenticated, JavaScript-only, and uncrawled pages may be absent.",
  },
  "domain-health-check": {
    tool: "domain-health-check",
    maxPages: 1,
    disclaimer:
      "This reads public DNS records available at check time. It does not test DKIM, certificate expiration, website availability, email delivery, spam placement, or overall security.",
  },
} as const satisfies Record<
  DiagnosticToolSlug,
  {
    tool: DiagnosticToolSlug;
    maxPages: number;
    maxLinks?: number;
    disclaimer: string;
  }
>;

export function isDiagnosticTool(value: string): value is DiagnosticToolSlug {
  return value in diagnosticToolDefinitions;
}
