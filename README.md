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

The free website check posts `{ url, strategy }` through
`/api/tools/website-check`. Set `N8N_TOOLS_WEBHOOK` to the n8n PageSpeed audit
workflow URL. If that webhook requires a bearer token, also set
`N8N_TOOLS_TOKEN`. Neither value belongs in the repository.

## Content configuration

Public business details, pricing, automation examples, and portfolio publishing
live in `config/site.ts`. Portfolio entries stay out of the navigation and sitemap
until their `published` property is set to `true`.
