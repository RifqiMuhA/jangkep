// Skrip evaluasi Bongkar Rempah (dipindah dari project spike).
// Pakai: jalankan server dulu (npm run dev), lalu di terminal lain: npm run eval
// Opsi:  --base http://localhost:3000   alamat server
//        --delay 13000                  jeda antar foto (ms). Bawaan 13 detik karena batas server 5 permintaan/menit.
//        --limit 3                      hanya N kasus pertama
//        --only rawon                   hanya file yang namanya mengandung teks ini
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const EVAL_DIR = path.dirname(fileURLToPath(import.meta.url));
const IMAGES_DIR = path.join(EVAL_DIR, "images");

function arg(name, fallback) {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}
const BASE_URL = arg("base", "http://localhost:3000").replace(/\/$/, "");
const DELAY_MS = Number(arg("delay", "13000"));
const LIMIT = Number(arg("limit", "0"));
const ONLY = arg("only", "");

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const normalize = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
const pct = (num, den) => (den === 0 ? null : Math.round((num / den) * 1000) / 10);
const showPct = (v) => (v === null ? "-" : `${v}%`);
const MIME = { ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp" };

async function postImage(file) {
  const bytes = await readFile(path.join(IMAGES_DIR, file));
  const form = new FormData();
  form.append("image", new Blob([bytes], { type: MIME[path.extname(file).toLowerCase()] ?? "application/octet-stream" }), file);

  const startedAt = Date.now();
  const response = await fetch(`${BASE_URL}/api/bongkar`, { method: "POST", body: form });
  const clientMs = Date.now() - startedAt;
  let body = null;
  try {
    body = await response.json();
  } catch {
    // Badan bukan JSON: ditangani pemanggil sebagai respons tidak valid.
  }
  return { status: response.status, retryAfter: Number(response.headers.get("retry-after") ?? 0), body, clientMs };
}

async function runCase(testCase) {
  let res;
  try {
    res = await postImage(testCase.file);
    // Kena pembatas server sendiri: tunggu lalu coba sekali lagi (ini bukan kegagalan AI).
    if (res.body?.error?.code === "RATE_LIMITED") {
      const waitSec = (res.retryAfter || 60) + 1;
      console.log(`   kena batas permintaan, menunggu ${waitSec} detik...`);
      await sleep(waitSec * 1000);
      res = await postImage(testCase.file);
    }
  } catch (err) {
    return { file: testCase.file, trap: !!testCase.trap, ok: false, errorCode: "NETWORK", errorMessage: String(err?.message ?? err) };
  }

  const base = { file: testCase.file, kondisi: testCase.kondisi ?? "", trap: !!testCase.trap, httpStatus: res.status };
  const body = res.body;

  if (!body || typeof body.ok !== "boolean") {
    return { ...base, ok: false, jsonValid: false, errorCode: "BAD_RESPONSE", errorMessage: "Respons server bukan JSON yang dikenali." };
  }
  if (!body.ok) {
    return {
      ...base,
      ok: false,
      // Hanya INVALID_AI_OUTPUT yang berarti JSON dari AI tidak valid; error lain (kuota, timeout) dihitung terpisah.
      jsonValid: body.error?.code === "INVALID_AI_OUTPUT" ? false : null,
      errorCode: body.error?.code ?? "UNKNOWN",
      errorMessage: body.error?.message ?? "",
      latencyMs: body.meta?.latencyMs ?? res.clientMs,
    };
  }

  const { dish, confidence, notes, matched, unmatched } = body.result;
  const matchedNames = matched.map((m) => m.nama);
  const matchedSet = new Set(matchedNames.map(normalize));
  const expected = testCase.expectedSpices ?? [];
  const found = expected.filter((name) => matchedSet.has(normalize(name)));
  const expectedSet = new Set(expected.map(normalize));

  const accepted = (testCase.acceptedNames?.length ? testCase.acceptedNames : [testCase.expectedDish ?? ""]).map(normalize).filter(Boolean);
  const dishNorm = ` ${normalize(dish)} `;

  return {
    ...base,
    ok: true,
    jsonValid: true,
    model: body.meta.model,
    attempts: body.meta.attempts,
    latencyMs: body.meta.latencyMs,
    dish,
    confidence,
    notes: notes ?? "",
    expectedDish: testCase.expectedDish ?? null,
    dishCorrect: testCase.trap ? null : accepted.some((name) => dishNorm.includes(` ${name} `) || dishNorm.includes(name)),
    trapFlaggedLow: testCase.trap ? confidence === "rendah" : null,
    matchedSpices: matchedNames,
    unmatchedSpices: unmatched.map((u) => (typeof u === "string" ? u : u.name)),
    expectedSpices: expected,
    expectedFound: found.length,
    expectedTotal: expected.length,
    missedSpices: expected.filter((name) => !matchedSet.has(normalize(name))),
    extraSpices: matchedNames.filter((name) => !expectedSet.has(normalize(name))),
  };
}

function summarize(results) {
  const succeeded = results.filter((r) => r.ok);
  const dishes = succeeded.filter((r) => !r.trap);
  const traps = results.filter((r) => r.trap);
  const judgedJson = results.filter((r) => r.jsonValid !== null && r.jsonValid !== undefined);
  const latencies = succeeded.map((r) => r.latencyMs);
  const sum = (list, pick) => list.reduce((total, item) => total + pick(item), 0);

  const errors = {};
  for (const r of results.filter((x) => !x.ok)) errors[r.errorCode] = (errors[r.errorCode] ?? 0) + 1;

  const matchedTotal = sum(succeeded, (r) => r.matchedSpices.length);
  const unmatchedTotal = sum(succeeded, (r) => r.unmatchedSpices.length);

  return {
    totalCases: results.length,
    // Bisa lebih dari satu model kalau model utama sedang ramai dan server memakai model cadangan.
    modelCounts: succeeded.reduce((acc, r) => ({ ...acc, [r.model]: (acc[r.model] ?? 0) + 1 }), {}),
    completedCases: succeeded.length,
    // Dari semua foto masakan (foto yang error dihitung salah).
    dishAccuracyPct: pct(dishes.filter((r) => r.dishCorrect).length, results.filter((r) => !r.trap).length),
    // Hanya dari foto masakan yang berhasil dijawab AI.
    dishAccuracyCompletedPct: pct(dishes.filter((r) => r.dishCorrect).length, dishes.length),
    avgLatencySec: latencies.length ? Math.round(sum(latencies, (v) => v) / latencies.length / 100) / 10 : null,
    maxLatencySec: latencies.length ? Math.round(Math.max(...latencies) / 100) / 10 : null,
    jsonValidPct: pct(judgedJson.filter((r) => r.jsonValid).length, judgedJson.length),
    // Dari semua nama rempah yang ditulis AI, berapa persen yang ada di data kita.
    spicesMatchedPct: pct(matchedTotal, matchedTotal + unmatchedTotal),
    // Dari rempah yang kita harapkan per masakan, berapa persen yang disebut AI.
    expectedSpicesFoundPct: pct(sum(dishes, (r) => r.expectedFound), sum(dishes, (r) => r.expectedTotal)),
    trapFlaggedLowPct: pct(traps.filter((r) => r.trapFlaggedLow).length, traps.filter((r) => r.ok).length),
    retriedCount: succeeded.filter((r) => r.attempts > 1).length,
    errorCount: results.filter((r) => !r.ok).length,
    errorsByCode: errors,
  };
}

async function main() {
  // Nama rempah diambil dari data Jangkep (src/data/rempah.ts) supaya cases.json selalu sejalan.
  const rempahSource = await readFile(path.join(EVAL_DIR, "..", "src", "data", "rempah.ts"), "utf8");
  const known = new Set([...rempahSource.matchAll(/nama: '([^']+)'/g)].map((m) => normalize(m[1])));
  let cases = JSON.parse(await readFile(path.join(EVAL_DIR, "cases.json"), "utf8"));

  for (const c of cases) {
    for (const name of c.expectedSpices ?? []) {
      if (!known.has(normalize(name))) console.warn(`PERINGATAN: "${name}" di ${c.file} tidak ada di src/data/rempah.ts.`);
    }
  }
  if (ONLY) cases = cases.filter((c) => c.file.includes(ONLY));
  if (LIMIT > 0) cases = cases.slice(0, LIMIT);
  if (cases.length === 0) throw new Error("Tidak ada kasus uji yang dijalankan.");

  console.log(`Menguji ${cases.length} foto ke ${BASE_URL} (jeda ${DELAY_MS / 1000} detik per foto).\n`);

  const results = [];
  for (let i = 0; i < cases.length; i++) {
    const c = cases[i];
    console.log(`[${i + 1}/${cases.length}] ${c.file}`);
    const r = await runCase(c);
    results.push(r);
    console.log(r.ok ? `   -> ${r.dish} (${r.confidence}), ${(r.latencyMs / 1000).toFixed(1)} detik` : `   -> ERROR ${r.errorCode}: ${r.errorMessage}`);
    if (i < cases.length - 1) await sleep(DELAY_MS);
  }

  const summary = summarize(results);

  console.log("\nHasil per foto");
  console.table(
    results.map((r) => ({
      foto: r.file,
      "tebakan AI": r.ok ? r.dish : `ERROR ${r.errorCode}`,
      benar: r.trap ? "(jebakan)" : r.ok ? (r.dishCorrect ? "ya" : "TIDAK") : "-",
      keyakinan: r.ok ? r.confidence : "-",
      "rempah harapan": r.ok && !r.trap ? `${r.expectedFound}/${r.expectedTotal}` : "-",
      "tak cocok": r.ok ? r.unmatchedSpices.length : "-",
      detik: r.latencyMs ? (r.latencyMs / 1000).toFixed(1) : "-",
    })),
  );

  console.log("Ringkasan");
  console.table({
    "Model (jumlah jawaban)": Object.entries(summary.modelCounts).map(([m, n]) => `${m}: ${n}`).join(", ") || "-",
    "Jumlah foto": summary.totalCases,
    "Foto yang berhasil dijawab": summary.completedCases,
    "Akurasi nama masakan (semua foto, error = salah)": showPct(summary.dishAccuracyPct),
    "Akurasi nama masakan (hanya yang dijawab)": showPct(summary.dishAccuracyCompletedPct),
    "Rata-rata latensi (detik)": summary.avgLatencySec ?? "-",
    "Latensi maksimum (detik)": summary.maxLatencySec ?? "-",
    "JSON valid": showPct(summary.jsonValidPct),
    "Rempah AI yang cocok dengan data kita": showPct(summary.spicesMatchedPct),
    "Rempah harapan yang disebut AI": showPct(summary.expectedSpicesFoundPct),
    "Foto jebakan ditandai rendah (dari yang dijawab)": showPct(summary.trapFlaggedLowPct),
    "Jumlah coba ulang": summary.retriedCount,
    "Jumlah error": summary.errorCount,
    "Rincian error": Object.keys(summary.errorsByCode).length ? JSON.stringify(summary.errorsByCode) : "-",
  });

  const outFile = path.join(EVAL_DIR, "results.json");
  await writeFile(outFile, JSON.stringify({ ranAt: new Date().toISOString(), baseUrl: BASE_URL, summary, results }, null, 2) + "\n");
  console.log(`Disimpan ke ${outFile}`);
}

main().catch((err) => {
  console.error("Evaluasi gagal:", err?.cause?.code === "ECONNREFUSED" ? `server tidak bisa dihubungi di ${BASE_URL}. Jalankan "npm run dev" dulu.` : err);
  process.exit(1);
});
