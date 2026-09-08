type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();
const results = new Map<string, { expiresAt: number; value: unknown }>();

export function allowRequest(
  key: string,
  limit: number,
  windowMs: number,
): boolean {
  const now = Date.now();
  const current = buckets.get(key);

  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (current.count >= limit) return false;
  current.count += 1;
  return true;
}

export function getCached<T>(key: string): T | null {
  const hit = results.get(key);
  if (!hit) return null;
  if (hit.expiresAt <= Date.now()) {
    results.delete(key);
    return null;
  }
  return hit.value as T;
}

export function setCached<T>(key: string, value: T, ttlMs: number) {
  results.set(key, { value, expiresAt: Date.now() + ttlMs });
}

export function clientKey(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "unknown";
}
