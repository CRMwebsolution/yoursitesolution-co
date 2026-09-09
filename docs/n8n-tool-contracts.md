# Shared n8n tools workflow contracts

The website has one private server-side connection to the shared n8n webhook.
Browser requests never receive the webhook URL or bearer token. The n8n Webhook
trigger should use **Using Respond to Webhook Node**, and every branch should end
with **Respond to Webhook → First Incoming Item** so the response is JSON.

## Routing architecture

Route the shared workflow with a Switch expression of
`={{ $json.body.tool }}`. Give each tool its own output, then call a separate n8n
sub-workflow for the tool-specific work. This keeps the entry workflow limited to
authentication, routing, shared error handling, and the final response.

The website API, not the browser, supplies every `tool` value. The allowlist is in
`lib/diagnostic-tools.ts`. A submitted `tool` field is ignored.

Current Switch output values:

| Tool | Switch value | Public status |
| --- | --- | --- |
| PageSpeed website check | `website-check` | Connected |
| SEO essentials check | `seo-check` | Website ready; n8n branch required |
| Social sharing preview | `social-preview-check` | Website ready; n8n branch required |
| Limited broken-link check | `broken-link-check` | Website ready; n8n branch required |
| Domain and email health | `domain-health-check` | Website ready; n8n branch required |

Do not expose the four setup-required tools in `publishedTools` until the matching
branch returns a valid report in production.

## `website-check` (PageSpeed)

Exact request sent by the website:

```json
{
  "tool": "website-check",
  "event": "tool_run",
  "source": "yoursitesolution.com",
  "submitted_at": "2026-09-09T01:23:45.000Z",
  "url": "https://example.com",
  "strategy": "mobile"
}
```

`strategy` is always `mobile` or `desktop`. The current website parser accepts
the following response as either one JSON object or a one-item JSON array:

```json
{
  "ok": true,
  "tool": "website-check",
  "requested_url": "https://example.com",
  "final_url": "https://www.example.com/",
  "strategy": "mobile",
  "analyzed_at": "2026-09-09T01:23:45.000Z",
  "scores": {
    "performance": 92,
    "accessibility": 96,
    "best_practices": 100,
    "seo": 92
  },
  "metrics": [
    "Largest Contentful Paint (LCP): 2.1 s",
    "Cumulative Layout Shift: 0.02"
  ],
  "critical_issues": [],
  "opportunities": [
    "Properly size the largest page images."
  ],
  "good_things": [
    "Text compression is enabled."
  ]
}
```

Scores must come from the returned PageSpeed/Lighthouse categories; do not infer
or invent missing values. The website creates the plain-English summary from
the scores and findings, so `report_text` is optional and is not shown as the
summary.

## Shared diagnostic response

The four setup-required checkers use one response shape. Return a JSON object; a
one-item JSON array and common `report`, `data`, `result`, `output`, `body`, or
`json` wrappers are tolerated.

```json
{
  "ok": true,
  "tool": "seo-check",
  "requested_url": "https://example.com",
  "final_url": "https://www.example.com/",
  "checked_at": "2026-09-09T01:23:45.000Z",
  "summary": "The page has a descriptive title and can be indexed, but its main heading and canonical address need review.",
  "facts": [
    {
      "label": "Page title",
      "value": "Emergency Plumbing in Cincinnati | Example"
    }
  ],
  "findings": [
    {
      "status": "warning",
      "title": "Canonical address differs from the final page",
      "detail": "The page declares https://example.com/home as canonical.",
      "recommendation": "Confirm the preferred public address and update the canonical tag if needed.",
      "url": "https://www.example.com/"
    }
  ],
  "preview": null,
  "disclaimer": "Optional tool-specific limitation. The website supplies a safe default when omitted."
}
```

Required content:

- `tool` must be absent or exactly match the requested tool. A different value is rejected.
- Supply at least one of `summary`, `facts`, `findings`, or `preview`.
- `status` must be `pass`, `warning`, `fail`, or `info`. Common equivalents such as `good`, `problem`, and `broken` are normalized.
- `facts` may contain up to 30 items and `findings` up to 100 items; additional items are discarded by the website.
- Do not return credentials, response headers containing secrets, internal IPs, stack traces, raw API payloads, or private workflow URLs.

## `seo-check`

Exact request sent by the website:

```json
{
  "tool": "seo-check",
  "event": "tool_run",
  "source": "yoursitesolution.com",
  "submitted_at": "2026-09-09T01:23:45.000Z",
  "url": "https://example.com/service"
}
```

Recommended factual checks for the one requested page:

- final URL and HTTP status;
- indexability from HTTP `X-Robots-Tag` and page robots meta;
- title text and length;
- meta description text and length;
- canonical value;
- H1 count and text;
- language declaration;
- viewport declaration;
- structured-data types found;
- basic image-alt counts.

Do not calculate an SEO score, keyword difficulty, rank, traffic estimate, or
probability of ranking. Do not say a page is indexed unless that fact comes from
an authorized index source; `indexable` only means no observed directive
blocked indexing during this request.

## `social-preview-check`

Exact request sent by the website:

```json
{
  "tool": "social-preview-check",
  "event": "tool_run",
  "source": "yoursitesolution.com",
  "submitted_at": "2026-09-09T01:23:45.000Z",
  "url": "https://example.com/service"
}
```

Return observed Open Graph and Twitter/X card values in `facts`. Also return:

```json
{
  "preview": {
    "title": "Observed og:title, with the page title as an explicitly disclosed fallback",
    "description": "Observed og:description, with the meta description as a disclosed fallback",
    "image_url": "https://example.com/public-share-image.jpg",
    "site_name": "Example Business"
  }
}
```

Validate that a returned image address is absolute and publicly reachable. Report
the actual dimensions and content type in `facts` when available. The preview is a
helpful approximation; platforms can cache data and apply different rendering rules.

## `broken-link-check`

Exact request sent by the website:

```json
{
  "tool": "broken-link-check",
  "event": "tool_run",
  "source": "yoursitesolution.com",
  "submitted_at": "2026-09-09T01:23:45.000Z",
  "url": "https://example.com",
  "max_pages": 20,
  "max_links": 250
}
```

The n8n branch must enforce the lower of its own safety limits and the supplied
limits. Crawl same-origin HTML pages only. Count each unique normalized link once.
Return crawl coverage in `facts` (pages visited, unique links checked, skipped
links, elapsed time). Return redirects as `warning`, unreachable or HTTP 4xx/5xx
links as `fail`, and unusual but non-broken outcomes as `info`. Include the
affected absolute URL and the page where it was found in `detail`.

An empty findings list cannot be described as proof that the entire website is
free of broken links.

## `domain-health-check`

Exact request sent by the website:

```json
{
  "tool": "domain-health-check",
  "event": "tool_run",
  "source": "yoursitesolution.com",
  "submitted_at": "2026-09-09T01:23:45.000Z",
  "url": "https://example.com",
  "domain": "example.com"
}
```

Recommended public observations:

- HTTPS connection and certificate expiration date;
- HTTP-to-HTTPS and `www`/apex redirect behavior;
- public MX records;
- SPF record presence and multiple-record conflicts;
- DMARC record presence and published policy;
- optional DKIM lookup only when the user supplies a selector in a future version.

Do not guess a DKIM selector, score deliverability, claim the domain is secure, or
promise inbox placement. DNS-over-HTTPS providers such as Cloudflare or Google can
perform public record lookups without a paid API; document any external endpoint
inside the n8n sub-workflow.

## Network safety for every branch

The website rejects obvious local/private addresses before n8n is called. The n8n
sub-workflow must independently validate every initial URL and redirect target,
resolve hostnames, block loopback/private/link-local/reserved addresses, limit
redirects, cap response bytes and execution time, and only accept HTTP or HTTPS.
Never let a crawler follow a link into an internal network.

Return a controlled JSON error with an appropriate HTTP status for invalid input,
timeouts, blocked targets, or fetch failures. The public website intentionally
converts workflow failures into short customer-facing messages.
