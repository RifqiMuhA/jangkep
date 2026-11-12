import { GEMINI_MODEL, GeminiError, identifyDish } from "@/lib/bongkar/gemini";
import { REMPAH_NAMES, findKuliner, matchSpices, normalizeName, toDishLink } from "@/lib/bongkar/match";
import { buildBongkarPrompt, buildRecorrectPrompt, sanitizeDishName } from "@/lib/bongkar/prompt";
import { checkRateLimit } from "@/lib/bongkar/rateLimit";
import type { BongkarResponse, Cooking, ErrorCode } from "@/lib/bongkar/schema";
import { DISH_FIELD, IMAGE_FIELD, MAX_IMAGE_BYTES, sniffImageType } from "@/lib/bongkar/upload";

export const maxDuration = 60;

function fail(status: number, code: ErrorCode, message: string, meta?: { latencyMs?: number; attempts?: number }, headers?: HeadersInit) {
  const body: BongkarResponse = { ok: false, error: { code, message }, meta: { model: GEMINI_MODEL, ...meta } };
  return Response.json(body, { status, headers });
}

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "lokal";
}

export async function POST(request: Request) {
  const startedAt = Date.now();

  const limit = checkRateLimit(clientIp(request));
  if (!limit.allowed) {
    return fail(
      429,
      "RATE_LIMITED",
      `Si Podo lagi kewalahan. Coba lagi dalam ${limit.retryAfterSec} detik, ya.`,
      undefined,
      { "Retry-After": String(limit.retryAfterSec) },
    );
  }

  // Tolak lebih awal kalau badan permintaan jelas terlalu besar (sedikit kelonggaran untuk pembungkus multipart).
  const declaredLength = Number(request.headers.get("content-length") ?? 0);
  if (declaredLength > MAX_IMAGE_BYTES + 100_000) {
    return fail(413, "FILE_TOO_LARGE", "Ukuran foto melebihi 4 MB. Pilih foto yang lebih kecil.");
  }

  let file: FormDataEntryValue | null;
  let correctedDish = "";
  try {
    const form = await request.formData();
    file = form.get(IMAGE_FIELD);
    const dishField = form.get(DISH_FIELD);
    if (typeof dishField === "string") correctedDish = sanitizeDishName(dishField);
  } catch {
    return fail(400, "BAD_REQUEST", "Permintaan tidak bisa dibaca. Kirim foto sebagai multipart/form-data.");
  }
  if (!(file instanceof File) || file.size === 0) {
    return fail(400, "BAD_REQUEST", "Fotonya belum dipilih.");
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return fail(413, "FILE_TOO_LARGE", "Ukuran foto melebihi 4 MB. Pilih foto yang lebih kecil.");
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  const mimeType = sniffImageType(bytes);
  if (!mimeType) {
    return fail(415, "UNSUPPORTED_TYPE", "Format tidak didukung. Gunakan foto JPEG, PNG, atau WebP.");
  }

  try {
    const { output, attempts, model } = await identifyDish({
      imageBase64: Buffer.from(bytes).toString("base64"),
      mimeType,
      // Kalau ada koreksi dari pengguna, AI hanya menyusun ulang rempah untuk nama itu.
      prompt: correctedDish ? buildRecorrectPrompt(REMPAH_NAMES, correctedDish) : buildBongkarPrompt(REMPAH_NAMES),
    });
    const dish = correctedDish || output.dish;
    // Dibatasi 12 supaya tampah tidak kepenuhan (AI diminta paling banyak 12, ini pengaman).
    const spices = output.spices.slice(0, 12);
    const { matched, unmatched: unmatchedNames } = matchSpices(spices.map((spice) => spice.name));
    // Bumbu di luar koleksi tetap dibawa beserta keterangan singkat dari AI.
    const peranByName = new Map(spices.map((spice) => [normalizeName(spice.name), spice.peran.trim().slice(0, 240)]));
    const unmatched = unmatchedNames.map((name) => ({ name, peran: peranByName.get(normalizeName(name)) ?? "" }));

    // Cara memasak: utamakan resep tulisan tim di Ensiklopedia, baru perkiraan AI kalau masakannya belum ada.
    const kuliner = findKuliner(dish);
    let cooking: Cooking | undefined;
    if (kuliner && kuliner.instructions.length > 0) {
      cooking = { source: "jangkep", steps: kuliner.instructions };
    } else if (output.steps.length > 0) {
      cooking = {
        source: "ai",
        steps: output.steps.slice(0, 8).map((step) => ({ action: step.action, description: step.description.trim().slice(0, 240) })),
      };
    }

    const body: BongkarResponse = {
      ok: true,
      result: {
        dish,
        confidence: output.confidence,
        // Masakan di Ensiklopedia Jangkep pasti masakan Jawa; foto yang tidak dikenali tidak diberi label.
        masakanJawa: kuliner ? true : output.dish === "Tidak dikenali" && !correctedDish ? undefined : output.masakanJawa,
        notes: output.notes,
        matched,
        unmatched,
        dishLink: kuliner ? toDishLink(kuliner) : undefined,
        cooking,
      },
      meta: { latencyMs: Date.now() - startedAt, model, attempts },
    };
    return Response.json(body);
  } catch (err) {
    const meta = { latencyMs: Date.now() - startedAt, attempts: err instanceof GeminiError ? err.attempts : 0 };
    // Detail teknis hanya ke log server, tidak ke pengguna.
    console.error("[bongkar]", err);

    if (err instanceof GeminiError) {
      switch (err.kind) {
        case "QUOTA":
          return fail(429, "QUOTA_EXCEEDED", "Kuota AI hari ini sedang habis. Coba lagi beberapa saat lagi.", meta);
        case "BUSY":
          return fail(503, "SERVER_ERROR", "AI sedang ramai dipakai. Coba lagi dalam beberapa saat.", meta);
        case "TIMEOUT":
          return fail(504, "TIMEOUT", "AI terlalu lama merespons (server AI sedang lambat). Coba lagi sebentar lagi.", meta);
        case "INVALID_OUTPUT":
          return fail(502, "INVALID_AI_OUTPUT", "Jawaban AI tidak bisa dibaca. Coba lagi dengan foto yang lebih jelas.", meta);
        case "AUTH":
          return fail(500, "SERVER_ERROR", "API key Gemini ditolak Google. Periksa key di .env.local, lalu restart server.", meta);
        case "CONFIG":
          return fail(500, "SERVER_ERROR", "Server belum dikonfigurasi (API key belum diisi).", meta);
      }
    }
    return fail(502, "SERVER_ERROR", "Terjadi gangguan saat menghubungi AI. Coba lagi sebentar lagi.", meta);
  }
}
