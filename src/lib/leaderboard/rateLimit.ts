/**
 * Pembatas permintaan sederhana per IP, disimpan di memori proses.
 * Batasan: di Vercel (serverless) tiap instance punya hitungan sendiri dan hitungan hilang saat instance
 * berganti, jadi ini hanya perlindungan seadanya terhadap kiriman beruntun, bukan pengaman mutlak.
 */
export function createRateLimiter(limit: number, windowMs: number) {
  const hits = new Map<string, number[]>();

  return function check(key: string): { allowed: boolean; retryAfterSec: number } {
    const now = Date.now();
    const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
    if (recent.length >= limit) {
      hits.set(key, recent);
      return { allowed: false, retryAfterSec: Math.max(1, Math.ceil((windowMs - (now - recent[0])) / 1000)) };
    }
    recent.push(now);
    hits.set(key, recent);
    // Bersihkan sesekali supaya Map tidak terus membesar.
    if (hits.size > 5_000) {
      for (const [k, times] of hits) if (times.every((t) => now - t >= windowMs)) hits.delete(k);
    }
    return { allowed: true, retryAfterSec: 0 };
  };
}
