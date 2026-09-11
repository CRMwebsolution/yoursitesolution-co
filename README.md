# Your Site Solution

Marketing website for [yoursitesolution.com](https://yoursitesolution.com).

## Local development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```

The contact and demo forms post through the server-side `/api/lead` route. Set
`N8N_LEAD_WEBHOOK` in Vercel to the production webhook URL before launch. The
endpoint intentionally stays out of the public repository.

All server-backed tools use the same n8n entry webhook. Set
`N8N_TOOLS_WEBHOOK` to that shared workflow URL. If the webhook requires a
bearer token, also set `N8N_TOOLS_TOKEN`. Neither value belongs in the
repository.

The free PageSpeed website check posts this body to the shared workflow:

```json
{
  "tool": "website-check",
  "event": "tool_run",
  "source": "yoursitesolution.com",
  "submitted_at": "2026-09-08T00:00:00.000Z",
  "url": "https://example.com",
  "strategy": "mobile"
}
```

The n8n Switch should route on `={{ $json.body.tool }}`. Keep each tool's
inputs at the top level of the body. Each output connects to its own named
Edit Fields node, using explicit source-node references in expressions, followed
by the tool-specific nodes in the same workflow. New
server-backed tool routes should call the shared helper in
`lib/tools-workflow.ts` with their own registered tool slug.

The following four live checks are now enabled in the tools hub and sitemap
after the site owner confirmed that their shared-workflow branches work:

- `seo-check`
- `social-preview-check`
- `broken-link-check`
- `domain-health-check`

Their exact request and response contracts and safety requirements are in
[`docs/n8n-tool-contracts.md`](docs/n8n-tool-contracts.md). All branches stay in
one workflow; no sub-workflows are required. Domain health currently checks
public DNS only, not HTTPS, certificate expiration, or email delivery.

The Webhook trigger must use **Using Respond to Webhook Node**. Each successful
branch produces one report item and connects to the same **Respond to Webhook**
node with **Respond With: First Incoming Item** and HTTP status **200**.
The tools API expects a JSON object (a one-item JSON array is
also supported). Do not use **Text** with `={{ $json }}` because an object can
be returned as non-JSON text and cannot be decoded by the site.

## Content configuration

Public business details, pricing, automation examples, and portfolio publishing
live in `config/site.ts`. Portfolio entries stay out of the navigation and sitemap
until their `published` property is set to `true`.
