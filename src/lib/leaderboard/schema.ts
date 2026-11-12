import { z } from 'zod';
import { LEADERBOARD_GAME_IDS } from './games';

/** Skema permintaan dan respons /api/scores. Dipakai server (validasi) dan klien (membaca respons). */

export const gameIdSchema = z.enum(LEADERBOARD_GAME_IDS);

export const submitScoreSchema = z.object({
  game: gameIdSchema,
  nickname: z.string().max(100),
  score: z.number().int().min(0),
});
export type SubmitScoreInput = z.infer<typeof submitScoreSchema>;

export const leaderboardEntrySchema = z.object({
  rank: z.number().int().positive(),
  nickname: z.string(),
  score: z.number().int(),
  isSample: z.boolean(),
});
export type LeaderboardEntry = z.infer<typeof leaderboardEntrySchema>;

export const errorCodeSchema = z.enum(['INVALID_INPUT', 'NICKNAME_REJECTED', 'RATE_LIMITED', 'UNAVAILABLE', 'TIMEOUT']);
export type ScoresErrorCode = z.infer<typeof errorCodeSchema>;

const errorBody = z.object({ ok: z.literal(false), error: z.object({ code: errorCodeSchema, message: z.string() }) });

export const leaderboardResponseSchema = z.discriminatedUnion('ok', [
  z.object({ ok: z.literal(true), game: gameIdSchema, entries: z.array(leaderboardEntrySchema) }),
  errorBody,
]);
export type LeaderboardResponse = z.infer<typeof leaderboardResponseSchema>;

export const submitResponseSchema = z.discriminatedUnion('ok', [
  z.object({
    ok: z.literal(true),
    game: gameIdSchema,
    nickname: z.string(),
    score: z.number().int(),
    /** Peringkat nama ini di 10 besar (skor terbaiknya), atau null kalau belum masuk. */
    rank: z.number().int().positive().nullable(),
    entries: z.array(leaderboardEntrySchema),
  }),
  errorBody,
]);
export type SubmitResponse = z.infer<typeof submitResponseSchema>;
