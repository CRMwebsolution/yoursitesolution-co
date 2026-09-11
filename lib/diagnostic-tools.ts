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
      "This reads the public sharing metadata returned at check time. Social platforms may cache older values or render the same tags differently.",
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
      "This reports public DNS, HTTPS, and redirect observations at check time. It is not a security audit, deliverability guarantee, or substitute for an administrator reviewing the full configuration.",
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
