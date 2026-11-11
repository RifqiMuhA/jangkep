import "server-only";
import { ApiError, GoogleGenAI, createPartFromBase64, createUserContent } from "@google/genai";
import { z } from "zod";
import { aiOutputSchema, type AiOutput } from "./schema";

/**
 * Nama model Gemini. Ganti HANYA di sini, atau timpa lewat GEMINI_MODEL di .env.local
 * (berguna untuk membandingkan model saat evaluasi tanpa mengubah kode).
 *
 * Dicek di dokumentasi resmi Google (aistudio.google.com/docs/models) pada 2026-11-11.
 * Keduanya flash stabil, mendukung input gambar + structured output:
 * - "gemini-3.6-flash": generasi sebelumnya. Hasil ukur 2026-11-11: sekitar 4 detik per foto.
 * - "gemini-3.8-flash": terbaru, tetapi saat diukur sering kelebihan beban (6 sampai >120 detik, kadang 503).
 */
const DEFAULT_GEMINI_MODEL = "gemini-3.6-flash";
export const GEMINI_MODEL = process.env.GEMINI_MODEL?.trim() || DEFAULT_GEMINI_MODEL;

/**
 * Model cadangan, dicoba berurutan kalau model utama sedang ramai (503) atau kuotanya habis di semua key.
 * Timpa lewat GEMINI_FALLBACK_MODELS di .env.local (dipisah koma); isi "none" untuk mematikan.
 * Catatan: akurasi model cadangan belum dievaluasi terpisah.
 */
const DEFAULT_FALLBACK_MODELS = ["gemini-3.5-flash-lite"];

function parseList(value: string): string[] {
  return value
    .split(/[,\s]+/)
    .map((item) => item.trim().replace(/^["']|["']$/g, ""))
    .filter(Boolean);
}

function getModelChain(): string[] {
  const raw = process.env.GEMINI_FALLBACK_MODELS?.trim();
  const fallbacks = raw ? (raw.toLowerCase() === "none" ? [] : parseList(raw)) : DEFAULT_FALLBACK_MODELS;
  return [...new Set([GEMINI_MODEL, ...fallbacks])];
}

/**
 * Batas waktu satu panggilan ke Gemini.
 * Sengaja longgar: waktu respons bisa melonjak saat server Google ramai.
 */
export const GEMINI_TIMEOUT_MS = 45_000;

/** Percobaan per model kalau keluaran AI tidak valid (1 panggilan + 1 coba ulang). */
const MAX_ATTEMPTS = 2;

/** Berapa lama sebuah key diistirahatkan setelah kuotanya habis atau ditolak. */
const KEY_COOLDOWN_MS = 30 * 60_000;

/** Penanda istirahat untuk semua model (dipakai saat key ditolak). */
const ALL_MODELS = "*";

interface KeySlot {
  client: GoogleGenAI;
  /** Per model: key tidak dipakai sampai waktu ini (ms). Kuota gratis dihitung per model. */
  restUntil: Map<string, number>;
}

let keySlots: KeySlot[] | null = null;

/**
 * Daftar key dari GEMINI_API_KEYS (dipisah koma) dan/atau GEMINI_API_KEY. Dibuat sekali, hanya di server.
 * Urutan di .env.local = urutan prioritas.
 */
function getKeySlots(): KeySlot[] {
  if (keySlots) return keySlots;

  const keys = [...new Set(parseList([process.env.GEMINI_API_KEYS ?? "", process.env.GEMINI_API_KEY ?? ""].join(",")))];
  if (keys.length === 0) {
    throw new GeminiError("CONFIG", "GEMINI_API_KEY atau GEMINI_API_KEYS belum diisi di .env.local.");
  }

  keySlots = keys.map((apiKey) => ({ client: new GoogleGenAI({ apiKey }), restUntil: new Map() }));
  return keySlots;
}

export type GeminiErrorKind = "CONFIG" | "AUTH" | "QUOTA" | "BUSY" | "TIMEOUT" | "INVALID_OUTPUT" | "UPSTREAM";

/** Error yang sudah dikelompokkan, supaya route handler bisa memberi pesan ramah. */
export class GeminiError extends Error {
  constructor(
    public readonly kind: GeminiErrorKind,
    message: string,
    public readonly attempts = 0,
  ) {
    super(message);
    this.name = "GeminiError";
  }
}

function classify(err: unknown, attempts: number): GeminiError {
  if (err instanceof GeminiError) return err;
  if (err instanceof ApiError) {
    // Key yang salah ketik dijawab Google dengan 400 "API key not valid", bukan 401.
    if (err.status === 401 || err.status === 403 || (err.status === 400 && /api key/i.test(err.message))) {
      return new GeminiError("AUTH", err.message, attempts);
    }
    if (err.status === 429) return new GeminiError("QUOTA", err.message, attempts);
    if (err.status === 503) return new GeminiError("BUSY", err.message, attempts);
    if (err.status === 408 || err.status === 504) return new GeminiError("TIMEOUT", err.message, attempts);
    return new GeminiError("UPSTREAM", err.message, attempts);
  }
  if (err instanceof Error && (err.name === "AbortError" || err.name === "TimeoutError" || /abort|timed? ?out/i.test(err.message))) {
    return new GeminiError("TIMEOUT", err.message, attempts);
  }
  return new GeminiError("UPSTREAM", err instanceof Error ? err.message : String(err), attempts);
}

/**
 * Jalankan satu panggilan dengan key pertama yang siap untuk model ini. Kalau key itu kehabisan kuota (429)
 * atau ditolak (401/403), istirahatkan lalu lanjut ke key berikutnya. Error lain langsung dilempar ke pemanggil.
 */
async function withKeyFallback<T>(model: string, attempt: number, call: (ai: GoogleGenAI) => Promise<T>): Promise<T> {
  const slots = getKeySlots();
  let lastError: GeminiError | null = null;

  for (let i = 0; i < slots.length; i++) {
    const slot = slots[i];
    const now = Date.now();
    if ((slot.restUntil.get(model) ?? 0) > now || (slot.restUntil.get(ALL_MODELS) ?? 0) > now) continue;

    try {
      return await call(slot.client);
    } catch (err) {
      const classified = classify(err, attempt);
      if (classified.kind !== "QUOTA" && classified.kind !== "AUTH") throw classified;

      slot.restUntil.set(classified.kind === "AUTH" ? ALL_MODELS : model, Date.now() + KEY_COOLDOWN_MS);
      lastError = classified;
      // Hanya nomor urut yang dicatat, bukan isi key.
      console.warn(
        `[gemini] key #${i + 1} dari ${slots.length} ${classified.kind === "QUOTA" ? `kehabisan kuota ${model}` : "ditolak"}, diistirahatkan ${KEY_COOLDOWN_MS / 60_000} menit.`,
      );
    }
  }

  throw lastError ?? new GeminiError("QUOTA", `Semua API key sedang diistirahatkan untuk ${model}.`, attempt);
}

export interface IdentifyInput {
  imageBase64: string;
  mimeType: string;
  prompt: string;
}

export interface IdentifyResult {
  output: AiOutput;
  /** Jumlah panggilan ke Gemini untuk permintaan ini. */
  attempts: number;
  /** Model yang akhirnya menjawab (bisa model cadangan). */
  model: string;
}

/**
 * Kirim foto + prompt ke Gemini dan kembalikan keluaran yang sudah lolos validasi Zod.
 * - JSON tidak valid: coba ulang satu kali di model yang sama.
 * - Kuota satu key habis: pindah ke key berikutnya (withKeyFallback).
 * - Model ramai (503) atau kuotanya habis di semua key: pindah ke model cadangan.
 * - Timeout tidak diulang, supaya pengguna tidak menunggu dua kali lipat.
 */
export async function identifyDish(input: IdentifyInput): Promise<IdentifyResult> {
  const models = getModelChain();
  const contents = createUserContent([createPartFromBase64(input.imageBase64, input.mimeType), input.prompt]);
  const responseJsonSchema = z.toJSONSchema(aiOutputSchema);
  let calls = 0;
  let lastError: GeminiError | null = null;

  for (const model of models) {
    let lastProblem = "";
    let switchModel = false;

    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      calls++;
      let text: string | undefined;
      try {
        const response = await withKeyFallback(model, calls, (ai) =>
          ai.models.generateContent({
            model,
            contents,
            config: { responseMimeType: "application/json", responseJsonSchema, abortSignal: AbortSignal.timeout(GEMINI_TIMEOUT_MS) },
          }),
        );
        text = response.text;
      } catch (err) {
        const classified = classify(err, calls);
        if (classified.kind === "BUSY" || classified.kind === "QUOTA") {
          lastError = classified;
          switchModel = true;
          console.warn(`[gemini] ${model} ${classified.kind === "BUSY" ? "sedang ramai (503)" : "kehabisan kuota"}, mencoba model berikutnya kalau ada.`);
          break;
        }
        throw classified;
      }

      try {
        const parsed = aiOutputSchema.safeParse(JSON.parse(text ?? ""));
        if (parsed.success) return { output: parsed.data, attempts: calls, model };
        lastProblem = parsed.error.message;
      } catch {
        lastProblem = "Keluaran AI bukan JSON.";
      }
    }

    if (!switchModel) throw new GeminiError("INVALID_OUTPUT", lastProblem, calls);
  }

  throw new GeminiError(lastError?.kind ?? "UPSTREAM", lastError?.message ?? "Semua model gagal.", calls);
}
