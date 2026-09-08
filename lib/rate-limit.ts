type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();
const results = new Map<string, { expiresAt: number; value: unknown }>();
const MAX_BUCKETS = 1000;
const MAX_RESULTS = 50;

function removeOldest<T>(map: Map<string, T>) {
  const oldest = map.keys().next().value;
  if (oldest !== undefined) map.delete(oldest);
}

function pruneBuckets(now: number) {
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
  while (buckets.size >= MAX_BUCKETS) removeOldest(buckets);
}

function pruneResults(now: number) {
  for (const [key, result] of results) {
    if (result.expiresAt <= now) results.delete(key);
  }
  while (results.size > MAX_RESULTS) removeOldest(results);
}

export function allowRequest(
  key: string,
  limit: number,
  windowMs: number,
): boolean {
  const now = Date.now();
  const current = buckets.get(key);

  if (!current || current.resetAt <= now) {
    if (!current) pruneBuckets(now);
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (current.count >= limit) return false;
  current.count += 1;
  return true;
}

export function getCached<T>(key: string): T | null {
  pruneResults(Date.now());
  const hit = results.get(key);
  if (!hit) return null;
  return hit.value as T;
}

export function setCached<T>(key: string, value: T, ttlMs: number) {
  pruneResults(Date.now());
  // Reinsert an existing key so the insertion order reflects recent use.
  results.delete(key);
  while (results.size >= MAX_RESULTS) removeOldest(results);
  results.set(key, { value, expiresAt: Date.now() + ttlMs });
}

export function clientKey(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "unknown";
}
