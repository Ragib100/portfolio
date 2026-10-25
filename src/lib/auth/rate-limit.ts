type RateLimitEntry = { count: number; resetAt: number };

const attempts = new Map<string, RateLimitEntry>();
const WINDOW_MS = 60_000;
const MAX_ATTEMPTS = 10;
const MAX_TRACKED_KEYS = 5_000;

export function isAuthRateLimited(key: string, now = Date.now()) {
  if (attempts.size >= MAX_TRACKED_KEYS) {
    for (const [trackedKey, entry] of attempts) {
      if (entry.resetAt <= now) attempts.delete(trackedKey);
    }
  }

  const current = attempts.get(key);

  if (!current || current.resetAt <= now) {
    attempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  current.count += 1;
  return current.count > MAX_ATTEMPTS;
}
