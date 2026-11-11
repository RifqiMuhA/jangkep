/**
 * Pembatas sederhana di memori: maksimal N permintaan per jendela waktu per kunci (IP).
 * Cukup untuk satu proses server. Kalau nanti ada login, ganti dengan batas per akun.
 */
export const RATE_LIMIT_MAX = 5;
export const RATE_LIMIT_WINDOW_MS = 60_000;

const hits = new Map<string, number[]>();

export function checkRateLimit(key: string, now = Date.now()): { allowed: boolean; retryAfterSec: number } {
  const recent = (hits.get(key) ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);

  if (recent.length >= RATE_LIMIT_MAX) {
    hits.set(key, recent);
    const retryAfterSec = Math.ceil((RATE_LIMIT_WINDOW_MS - (now - recent[0])) / 1000);
    return { allowed: false, retryAfterSec };
  }

  recent.push(now);
  hits.set(key, recent);

  // Bersihkan kunci lama supaya Map tidak tumbuh terus.
  if (hits.size > 1000) {
    for (const [k, times] of hits) {
      if (times.every((t) => now - t >= RATE_LIMIT_WINDOW_MS)) hits.delete(k);
    }
  }

  return { allowed: true, retryAfterSec: 0 };
}
