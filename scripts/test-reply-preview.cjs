// Contract and failure-path checks. No API requests or email are sent.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');
let count = 0;
function check(fn) { fn(); count++; }
async function checkAsync(fn) { await fn(); count++; }
function load(relative, imports = {}, extra = {}) {
  const compiled = ts.transpileModule(fs.readFileSync(path.join(root, relative), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const module = { exports: {} };
  vm.runInNewContext(compiled, {
    exports: module.exports, module, require: name => imports[name] || require(name),
    URL, Request, Response, AbortController, Error, setTimeout, clearTimeout, console,
    process: { env: {} }, ...extra,
  }, { filename: relative });
  return module.exports;
}
const contract = load('lib/reply-preview.ts');
const input = { business: 'Example Rentals', message: 'I need maintenance reminders based on Optimus GPS mileage.', language: 'en' };
const sample = {
  customer_reply: ['Thanks for your request.', 'Mileage availability needs to be confirmed.', 'Which tracker model do you use?'],
  owner_summary: 'Check mileage data access.', findings: [{ text: 'An official API page was found.', source_ids: ['S1'] }],
  next_step: 'Confirm mileage access.', research: { status: 'completed', sources: [{ id: 'S1', title: 'Vendor API docs', url: 'https://example.com/api' }] },
};
const envelope = { ok: true, version: 1, preview: sample };
check(() => assert(contract.parseReplyPreviewInput(input)));
for (const bad of [null, [], { message: 'short' }, { message: 'x'.repeat(1601) }, { ...input, business: 123 }, { ...input, language: 'xx' }]) {
  check(() => assert.equal(contract.parseReplyPreviewInput(bad), null));
}
check(() => assert(contract.normalizeReplyPreview(envelope)));
check(() => assert(contract.normalizeReplyPreview([envelope])));
for (const bad of [
  { ...envelope, version: 2 }, { ok: true },
  { ...envelope, preview: { ...sample, customer_reply: [] } },
  { ...envelope, preview: { ...sample, findings: [{ text: 'Fake source', source_ids: ['S99'] }] } },
  { ...envelope, preview: { ...sample, research: { status: 'completed', sources: [] } } },
  { ...envelope, preview: { ...sample, research: { status: 'not_needed', sources: [] } } },
  { ...envelope, preview: { ...sample, research: { status: 'completed', sources: [{ id: 'S1', title: 'Bad', url: 'javascript:alert(1)' }] } } },
]) check(() => assert.equal(contract.normalizeReplyPreview(bad), null));
check(() => assert(!('api_key' in contract.normalizeReplyPreview({ ...envelope, preview: { ...sample, api_key: 'private' } }))));

const workflow = JSON.parse(fs.readFileSync(path.join(root, 'docs/workflows/reply-preview.json'), 'utf8'));
const nodes = Object.fromEntries(workflow.nodes.map(node => [node.name, node]));
check(() => assert.equal(workflow.active, false));
check(() => assert.equal(nodes['Preview Webhook'].parameters.authentication, 'headerAuth'));
check(() => assert(!workflow.nodes.some(node => /gmail|sendemail/i.test(node.type))));
for (const [from, outputs] of Object.entries(workflow.connections)) for (const branch of outputs.main) for (const target of branch) {
  check(() => assert(nodes[from] && nodes[target.node]));
}
const results = { 'Preview Webhook': { body: { ...input, tool: 'reply-preview', version: 1, model: 'expensive-model' } } };
function run(name, data = {}) {
  const result = new Function('$json', '$input', '$', nodes[name].parameters.jsCode)(
    data, { first: () => ({ json: data }) }, name => ({ first: () => ({ json: results[name] }) }),
  );
  results[name] = result[0].json;
  return result[0].json;
}
function response(text, extra = []) {
  return { status: 'completed', output: [...extra, { type: 'message', content: [{ type: 'output_text', text: typeof text === 'string' ? text : JSON.stringify(text) }] }] };
}
run('Validate and Plan');
check(() => assert(results['Validate and Plan'].valid));
check(() => assert.equal(results['Validate and Plan'].plan_request.model, 'gpt-6-luna'));
run('Read Preview Plan', response({ needs_research: true, query: 'Optimus GPS API mileage data access' }));
run('Prepare One Lookup', results['Read Preview Plan']);
check(() => assert.equal(results['Prepare One Lookup'].research_request.max_tool_calls, 1));
check(() => assert(!results['Prepare One Lookup'].research_request.input.includes(input.business)));
run('Collect Public Sources', response('Official API page found; mileage is not verified.', [
  { type: 'web_search_call', status: 'completed', action: { sources: [{ title: 'Vendor API docs', url: 'https://example.com/api' }] } },
]));
run('Prepare Short Draft', results['Collect Public Sources']);
check(() => assert(results['Prepare Short Draft'].ready));
const drafted = run('Format Public Preview', response(sample));
check(() => assert(drafted.ok && contract.normalizeReplyPreview(drafted)));
check(() => assert.equal(run('Format Public Preview', response({ ...sample, findings: [{ text: 'Unsupported', source_ids: ['S99'] }] })).ok, false));
run('Collect Public Sources', { error: { message: 'timeout' } });
check(() => assert.equal(run('Prepare Short Draft', results['Collect Public Sources']).ready, false));
run('Read Preview Plan', { error: { message: 'invalid model' } });
run('No Lookup Needed', results['Read Preview Plan']);
check(() => assert.equal(run('Prepare Short Draft', results['No Lookup Needed']).ready, false));
run('Read Preview Plan', response({ needs_research: false, query: '' }));
run('No Lookup Needed', results['Read Preview Plan']);
run('Prepare Short Draft', results['No Lookup Needed']);
check(() => assert.equal(run('Format Public Preview', response({ ...sample, findings: [] })).preview.research.status, 'not_needed'));
run('Read Preview Plan', response({ needs_research: true, query: 'Example Rentals private account' }));
check(() => assert(results['Read Preview Plan'].error));

let requestId = 0;
function request(body = input, overrides = {}) {
  return new Request('https://yoursitesolution.com/api/upgrades/reply-preview', {
    method: 'POST', headers: { origin: 'https://yoursitesolution.com', 'content-type': 'application/json', 'x-forwarded-for': `203.0.113.${++requestId}`, ...overrides },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}
function route(fetch, env = { N8N_REPLY_PREVIEW_WEBHOOK: 'https://n8n.example.com/webhook/preview', N8N_REPLY_PREVIEW_TOKEN: 'test-token' }) {
  const limits = load('lib/rate-limit.ts');
  return load('app/api/upgrades/reply-preview/route.ts', { '@/lib/rate-limit': limits, '@/lib/reply-preview': contract }, { fetch, process: { env } });
}

(async () => {
  let calls = 0;
  const api = route(async (url, options) => {
    calls++;
    check(() => assert.equal(url, 'https://n8n.example.com/webhook/preview'));
    check(() => assert.equal(options.headers.authorization, 'Bearer test-token'));
    const payload = JSON.parse(options.body);
    check(() => assert.equal(payload.tool, 'reply-preview'));
    check(() => assert(!('model' in payload) && !('email' in payload)));
    return Response.json(envelope);
  });
  let result = await api.POST(request({ ...input, model: 'expensive-model', email: 'private@example.com' }));
  check(() => assert.equal(result.status, 200));
  await checkAsync(async () => assert(!JSON.stringify(await result.json()).includes('test-token')));
  result = await api.POST(request(input));
  check(() => assert.equal(result.status, 200));
  check(() => assert.equal(calls, 1));
  await checkAsync(async () => assert.equal((await api.POST(request('bad json'))).status, 400));
  await checkAsync(async () => assert.equal((await api.POST(request({ ...input, company_site: 'bot' }))).status, 400));
  await checkAsync(async () => assert.equal((await api.POST(request(input, { origin: 'https://elsewhere.example' }))).status, 403));
  await checkAsync(async () => assert.equal((await api.POST(request('x'.repeat(6001)))).status, 413));
  const disabled = route(() => { throw new Error('Should not call any webhook'); }, { N8N_LEAD_WEBHOOK: 'https://live-lead.example.com' });
  await checkAsync(async () => assert.equal((await disabled.POST(request())).status, 503));
  const badApi = route(async () => Response.json({ ok: true }));
  await checkAsync(async () => assert.equal((await badApi.POST(request())).status, 502));
  const failingApi = route(async () => { throw new Error('network failed'); });
  await checkAsync(async () => assert.equal((await failingApi.POST(request())).status, 502));
  const timedOutApi = route(async () => { const error = new Error('timeout'); error.name = 'AbortError'; throw error; });
  await checkAsync(async () => assert.equal((await timedOutApi.POST(request())).status, 504));
  const headers = { 'x-forwarded-for': '198.51.100.10' };
  for (let index = 0; index < 3; index++) await checkAsync(async () => {}), assert.equal((await api.POST(request(input, headers))).status, 200);
  await checkAsync(async () => assert.equal((await api.POST(request(input, headers))).status, 429));
  let release;
  const gate = new Promise(resolve => { release = resolve; });
  const busyApi = route(async () => { await gate; return Response.json(envelope); });
  const first = busyApi.POST(request()); const second = busyApi.POST(request());
  // Let both requests finish parsing and enter the mock fetch.
  await new Promise(resolve => setImmediate(resolve));
  await checkAsync(async () => assert.equal((await busyApi.POST(request())).status, 429));
  release(); await Promise.all([first, second]);
  console.log(`Passed ${count} preview contract, workflow, and HTTP-route checks. No live API calls or emails.`);
})().catch(error => { console.error(error); process.exitCode = 1; });
