import { LEADERBOARD_SIZE, findLeaderboardGame, type LeaderboardGameId } from '@/lib/leaderboard/games';
import { checkNickname } from '@/lib/leaderboard/nickname';
import { createRateLimiter } from '@/lib/leaderboard/rateLimit';
import {
  gameIdSchema,
  submitScoreSchema,
  type LeaderboardEntry,
  type LeaderboardResponse,
  type ScoresErrorCode,
  type SubmitResponse,
} from '@/lib/leaderboard/schema';
import { SupabaseConfigError, getSupabaseServer, supabaseTimeoutSignal } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

// Satu permainan butuh waktu sekitar satu menit, jadi 6 kiriman per menit sudah longgar untuk pemain sungguhan.
const postLimiter = createRateLimiter(6, 60_000);
const getLimiter = createRateLimiter(60, 60_000);

const NO_STORE = { 'Cache-Control': 'no-store' };

/** Galat yang sudah diterjemahkan ke pesan ramah. Detail teknis hanya masuk log server. */
class ScoresError extends Error {
  constructor(
    readonly status: number,
    readonly code: ScoresErrorCode,
    readonly userMessage: string,
  ) {
    super(userMessage);
  }
}

function clientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  return forwarded?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'lokal';
}

function fail(status: number, code: ScoresErrorCode, message: string, extraHeaders?: Record<string, string>) {
  return Response.json({ ok: false, error: { code, message } }, { status, headers: { ...NO_STORE, ...extraHeaders } });
}

/** Ubah galat dari Supabase menjadi ScoresError tanpa membocorkan detailnya ke pengguna. */
function toScoresError(where: string, err: unknown): ScoresError {
  if (err instanceof ScoresError) return err;
  if (err instanceof SupabaseConfigError) {
    console.error(`[scores] ${where}: konfigurasi Supabase belum lengkap`);
    return new ScoresError(503, 'UNAVAILABLE', 'Papan skor sedang tidak tersedia. Coba lagi nanti, ya.');
  }
  const message = err instanceof Error ? err.message : String((err as { message?: unknown })?.message ?? err);
  if (/AbortError|TimeoutError|aborted|timed? ?out/i.test(message)) {
    console.error(`[scores] ${where}: waktu habis`);
    return new ScoresError(504, 'TIMEOUT', 'Papan skor lambat merespons. Coba lagi sebentar lagi.');
  }
  console.error(`[scores] ${where}: ${message.slice(0, 200)}`);
  return new ScoresError(503, 'UNAVAILABLE', 'Papan skor sedang tidak bisa dihubungi. Coba lagi nanti, ya.');
}

async function fetchTop(game: LeaderboardGameId): Promise<LeaderboardEntry[]> {
  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .rpc('top_scores', { p_game: game, p_limit: LEADERBOARD_SIZE })
    .abortSignal(supabaseTimeoutSignal());
  if (error) throw toScoresError('top_scores', error);

  const rows = Array.isArray(data) ? data : [];
  return rows.map((row: { nickname: string; score: number; is_sample: boolean }, i: number) => ({
    rank: i + 1,
    nickname: String(row.nickname),
    score: Number(row.score),
    isSample: Boolean(row.is_sample),
  }));
}

/** GET /api/scores?game=... -> 10 skor teratas, satu skor terbaik per nama panggilan. */
export async function GET(request: Request) {
  const limit = getLimiter(clientIp(request));
  if (!limit.allowed) {
    return fail(429, 'RATE_LIMITED', 'Terlalu banyak permintaan. Tunggu sebentar, ya.', { 'Retry-After': String(limit.retryAfterSec) });
  }

  const game = gameIdSchema.safeParse(new URL(request.url).searchParams.get('game'));
  if (!game.success) return fail(400, 'INVALID_INPUT', 'Game tidak dikenal.');

  try {
    const entries = await fetchTop(game.data);
    const body: LeaderboardResponse = { ok: true, game: game.data, entries };
    return Response.json(body, { headers: NO_STORE });
  } catch (err) {
    const e = toScoresError('GET', err);
    return fail(e.status, e.code, e.userMessage);
  }
}

/** POST /api/scores { game, nickname, score } -> simpan skor, lalu kembalikan 10 besar dan peringkat pemain. */
export async function POST(request: Request) {
  const limit = postLimiter(clientIp(request));
  if (!limit.allowed) {
    return fail(429, 'RATE_LIMITED', `Kamu baru saja mengirim skor. Coba lagi dalam ${limit.retryAfterSec} detik, ya.`, {
      'Retry-After': String(limit.retryAfterSec),
    });
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return fail(400, 'INVALID_INPUT', 'Data skor tidak bisa dibaca.');
  }

  const parsed = submitScoreSchema.safeParse(raw);
  if (!parsed.success) return fail(400, 'INVALID_INPUT', 'Data skor tidak valid.');

  const { game, score } = parsed.data;
  const gameInfo = findLeaderboardGame(game);
  if (!gameInfo || score > gameInfo.maxScore) return fail(400, 'INVALID_INPUT', 'Skor di luar batas permainan.');

  const nickname = checkNickname(parsed.data.nickname);
  if (!nickname.ok) return fail(422, 'NICKNAME_REJECTED', nickname.message);

  try {
    const supabase = getSupabaseServer();
    const { error } = await supabase
      .from('scores')
      .insert({ nickname: nickname.nickname, game, score })
      .abortSignal(supabaseTimeoutSignal());
    if (error) throw toScoresError('insert', error);

    const entries = await fetchTop(game);
    const mine = entries.find((entry) => entry.nickname.toLowerCase() === nickname.nickname.toLowerCase());
    const body: SubmitResponse = { ok: true, game, nickname: nickname.nickname, score, rank: mine?.rank ?? null, entries };
    return Response.json(body, { status: 201, headers: NO_STORE });
  } catch (err) {
    const e = toScoresError('POST', err);
    return fail(e.status, e.code, e.userMessage);
  }
}
