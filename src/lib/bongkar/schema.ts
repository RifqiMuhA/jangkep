import { z } from "zod";

/** Skema Zod untuk fitur Bongkar Rempah: keluaran AI dan respons /api/bongkar. */

export const confidenceSchema = z.enum(["tinggi", "sedang", "rendah"]);
export type Confidence = z.infer<typeof confidenceSchema>;

/** Keluaran mentah dari AI. Bentuk ini juga yang diminta lewat structured output Gemini. */
export const aiSpiceSchema = z.object({
  name: z.string(),
  /** Satu kalimat singkat tentang peran bumbu ini di hidangan tersebut. */
  peran: z.string(),
});

/** Jenis langkah memasak; sama dengan CookingAction di src/data/kulinerData.ts dan nama gambar di public/kuliner/methods/. */
export const COOKING_ACTIONS = ["potong", "haluskan", "tumis", "rebus", "bakar", "goreng", "kukus", "campur", "tuang", "sajikan"] as const;

export const cookingStepSchema = z.object({
  action: z.enum(COOKING_ACTIONS),
  description: z.string(),
});
export type CookingStepData = z.infer<typeof cookingStepSchema>;

export const aiOutputSchema = z.object({
  dish: z.string(),
  spices: z.array(aiSpiceSchema),
  /** Garis besar cara memasak. Dipakai hanya kalau masakannya tidak ada di Ensiklopedia Jangkep. */
  steps: z.array(cookingStepSchema),
  confidence: confidenceSchema,
  notes: z.string().optional(),
});
export type AiOutput = z.infer<typeof aiOutputSchema>;

/** Rempah dari src/data/rempah.ts yang cocok dengan nama dari AI. */
export const matchedSpiceSchema = z.object({
  id: z.string(),
  nama: z.string(),
  namaJawa: z.string(),
  asset: z.string(),
  peran: z.string(),
  makanan: z.string(),
  /** Nama persis yang ditulis AI (bisa lebih dari satu, misal "kunyit" dan "turmeric"). */
  aiNames: z.array(z.string()),
});
export type MatchedSpice = z.infer<typeof matchedSpiceSchema>;

/** Bumbu yang disebut AI tetapi belum ada di koleksi Jangkep. Keterangannya murni dari AI. */
export const extraSpiceSchema = z.object({
  name: z.string(),
  peran: z.string(),
});
export type ExtraSpice = z.infer<typeof extraSpiceSchema>;

export interface MatchResult {
  matched: MatchedSpice[];
  unmatched: string[];
}

/** Tautan ke halaman Ensiklopedia kalau masakannya ada di katalog Jangkep. */
export const dishLinkSchema = z.object({
  slug: z.string(),
  name: z.string(),
  image: z.string().optional(),
});
export type DishLink = z.infer<typeof dishLinkSchema>;

/** Langkah memasak yang ditampilkan: dari Ensiklopedia Jangkep (ditulis tim) atau perkiraan AI. */
export const cookingSchema = z.object({
  source: z.enum(["jangkep", "ai"]),
  steps: z.array(cookingStepSchema),
});
export type Cooking = z.infer<typeof cookingSchema>;

const metaSchema = z.object({
  latencyMs: z.number().nonnegative(),
  model: z.string(),
  /** Berapa kali AI dipanggil (lebih dari 1 berarti sempat coba ulang atau pindah model). */
  attempts: z.number().int().nonnegative(),
});

export const errorCodeSchema = z.enum([
  "BAD_REQUEST",
  "UNSUPPORTED_TYPE",
  "FILE_TOO_LARGE",
  "RATE_LIMITED",
  "QUOTA_EXCEEDED",
  "TIMEOUT",
  "INVALID_AI_OUTPUT",
  "SERVER_ERROR",
]);
export type ErrorCode = z.infer<typeof errorCodeSchema>;

/** Respons /api/bongkar. */
export const bongkarResponseSchema = z.discriminatedUnion("ok", [
  z.object({
    ok: z.literal(true),
    result: z.object({
      dish: z.string(),
      confidence: confidenceSchema,
      notes: z.string().optional(),
      matched: z.array(matchedSpiceSchema),
      unmatched: z.array(extraSpiceSchema),
      dishLink: dishLinkSchema.optional(),
      cooking: cookingSchema.optional(),
    }),
    meta: metaSchema,
  }),
  z.object({
    ok: z.literal(false),
    error: z.object({
      code: errorCodeSchema,
      message: z.string(),
    }),
    meta: metaSchema.partial().optional(),
  }),
]);
export type BongkarResponse = z.infer<typeof bongkarResponseSchema>;
