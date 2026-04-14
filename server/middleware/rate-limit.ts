interface RateBucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, RateBucket>();

const LIMITS: Record<string, { maxPerWindow: number; windowMs: number }> = {
  "new-marker": { maxPerWindow: 5, windowMs: 60_000 },
  "approve-marker": { maxPerWindow: 20, windowMs: 60_000 },
  "get-markers": { maxPerWindow: 30, windowMs: 60_000 },
};

export function checkRateLimit(socketId: string, event: string): boolean {
  const limit = LIMITS[event];
  if (!limit) return true;

  const key = `${socketId}:${event}`;
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now > bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + limit.windowMs });
    return true;
  }

  if (bucket.count >= limit.maxPerWindow) {
    return false;
  }

  bucket.count += 1;
  return true;
}

export function cleanupSocket(socketId: string): void {
  const prefix = `${socketId}:`;
  buckets.forEach((_v, key) => {
    if (key.startsWith(prefix)) {
      buckets.delete(key);
    }
  });
}
