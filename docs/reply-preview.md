# Public research-and-reply preview

The `/upgrades#reply-preview` card lets a visitor enter a sample customer inquiry to a local business, run a limited public lookup when applicable, and inspect a customer reply plus a short owner briefing. Example buttons fill the form; they never run a paid request automatically. No visitor email is collected and no email is sent.

This is a separate workflow from the live lead-response automation. The API never falls back to `N8N_LEAD_WEBHOOK`. Importable workflow: [`workflows/reply-preview.json`](./workflows/reply-preview.json).

## Scope and model

- Fixed server/workflow model: `gpt-6-luna`. Visitors cannot choose models, destinations, or token budgets.
- One short planning call; at most one web-search tool call; one short structured draft.
- Three customer paragraphs, a short owner summary, up to two sourced findings, and one next step. No full build brief, quote, or timeline.
- Routine service inquiries such as mowing can skip research. The page labels that honestly; it only says sources were checked when a completed search and traceable URLs exist.
- Research errors return an unavailable result. The preview does not masquerade a fallback acknowledgment as successful research.

OpenAI's model documentation lists GPT-6 Luna at $0.10 input / $0.50 output per million tokens, compared with the original workflow's GPT-4.1 mini rates of $0.40 / $1.60. The web-search call still carries its own fee (published at $0.01/call), plus search-content/model tokens. One search-call limit is not a hard total-dollar cap. Account access and actual delivery need a live test.

Official references: [GPT-6 Luna](https://developers.openai.com/api/docs/models/gpt-6-luna), [web search](https://developers.openai.com/api/docs/guides/tools-web-search), [pricing](https://developers.openai.com/api/docs/pricing).

## Connect the preview

1. Import `docs/workflows/reply-preview.json` into n8n as a NEW workflow. Keep the live contact workflow separate.
2. On **Preview Webhook**, select/create a **Header Auth** credential. Its header name is `Authorization`; its value is `Bearer ` followed by a long random token. Do not commit the token or share it in browser code.
3. Select the existing OpenAI credential on **Plan Preview Research**, **One Public Lookup**, and **Draft Preview**. The account must support `gpt-6-luna` and Responses API web search. The model can be changed in **Validate and Plan**, but any replacement must support the request parameters and search tool.
4. Publish/activate the workflow and copy its Production Webhook URL.
5. Set two SERVER-ONLY Vercel environment variables for the site:
   - `N8N_REPLY_PREVIEW_WEBHOOK`: the new workflow's Production Webhook URL.
   - `N8N_REPLY_PREVIEW_TOKEN`: the same random token, without the `Bearer ` prefix.
6. Redeploy the website so the new values take effect. Add the values to Preview environments too if testing a Vercel branch deployment.
7. On `/upgrades#reply-preview`, choose **Auto repair**, click **Preview the reply**, and verify the real n8n execution: plan → one public lookup → short draft → JSON response. Verify that the page shows the returned paragraphs, owner summary, and real source links. Try **Lawn care** to check the no-lookup path. Confirm that no emails are sent.

The workflow starts inactive and has no saved credentials. Missing website configuration returns a clear unavailable message instead of a fake example or a call to the live lead workflow.

## Contract

The website forwards only these allowlisted values:

```json
{
  "tool": "reply-preview",
  "version": 1,
  "source": "yoursitesolution.com/upgrades",
  "business": "Example Rentals",
  "message": "Can you build maintenance reminders using mileage from my Optimus GPS trackers?",
  "language": "en"
}
```

The webhook responds only after completion, with a JSON object:

```json
{
  "ok": true,
  "version": 1,
  "preview": {
    "customer_reply": ["First paragraph", "Second paragraph", "Third paragraph"],
    "owner_summary": "Short practical briefing",
    "findings": [{"text": "A supported finding", "source_ids": ["S1"]}],
    "next_step": "The next thing to confirm",
    "research": {
      "status": "completed",
      "sources": [{"id": "S1", "title": "Official vendor documentation", "url": "https://example.com/docs"}]
    }
  }
}
```

The example above describes the schema, not a real researched claim. For `not_needed`, both sources and findings are empty. Do not change the webhook to an immediate acknowledgment: the website needs the completed response.

## Limits and verification

- Input length: 20–1,600 characters; optional business name up to 100 characters.
- Existing website rate-limit/cache helper: three requests per client IP per fifteen minutes; ten-minute result cache; two concurrent requests per server instance.
- These controls are in memory, just like the site's other tools. They reset on cold starts and do not constitute an account-wide spend limit. Keep hosting/WAF limits and OpenAI budget monitoring in place for a promoted campaign. Direct access to the n8n workflow requires Header Auth.
- Website timeout: 50 seconds; n8n execution cap: 55 seconds. No automatic retries. The workflow may still run briefly after a client timeout.
- The browser receives only the public display contract. Model prompts, raw research text, credentials, private workflow errors, and live owner details are not returned.
- Submitted data is sample material for the AI provider. The UI asks visitors to avoid private customer details. Query instructions prohibit private data; code removes email/URL/phone patterns and rejects an exact submitted business-name match. This is not general secret detection.
- Model prose remains preliminary. Source-ID validation ensures referenced sources exist, not that every sentence's interpretation is correct. An API's existence never proves that mileage data or a specific account's permission is available.
- HTML is rendered by React from plain text. No generated HTML is executed.

Run `node scripts/test-reply-preview.cjs` for the offline contract, n8n-node behavior, credential isolation, cache/rate limit, invalid output, timeout, and error-path checks. Run `npm run build` for TypeScript and production compilation. These do not prove live model availability, n8n delivery, or mobile browser rendering.

## Future ad concept — Cody's October 29 note

1. “What do you see when a customer sends this contact form?” — picture of the form.
2. “Are you getting these?” — picture of a standard notification email.
3. “You could be getting these.” — picture of an actionable researched briefing.

The stronger future demonstration includes “you currently have this in inventory; you would need to order these parts.” That requires a verified connection to the business's actual inventory and parts catalog. Public web research alone cannot establish stock or required parts. This is recorded for a future ad, not implemented or advertised as part of the current preview. Capture genuine, sanitized results after that integration exists.

## Customer and owner views

Examples represent a customer contacting an auto repair shop, equipment rental company, or lawn care business. The optional business field names the receiving business; the AI replies in that business's voice. The customer sees a service reply. The owner sees the customer summary, sourced public findings, and follow-up checks. Both views appear on the public demo to show what the automation does.

A connected production system can add appointment openings, equipment/parts in stock, and parts to order to the owner-only briefing. This demo does not have live schedule or inventory data and cannot confirm availability or purchasing requirements. Those internal checks must not appear as customer-facing stock counts, purchasing lists, or internal workflow notes.
