// Data contoh Papan Juara (is_sample = true, tampil berlabel "contoh").
//
//   npm run leaderboard:seed           -> isi 6 skor contoh per game
//   npm run leaderboard:clear-samples  -> hapus SEMUA skor contoh (skor pemain asli tidak disentuh)
//
// Membaca SUPABASE_URL dan SUPABASE_SECRET_KEY dari .env.local (lewat opsi --env-file di package.json).
// Jalankan hapus data contoh sebelum penjurian kalau tidak ingin ada data contoh.
import { createClient } from '@supabase/supabase-js';

const SAMPLES = {
  // Racik Masakan Jawa (maks 700)
  'racik-masakan': [
    ['Mbok Darmi', 585],
    ['Pakde Joyo', 470],
    ['Mas Bagus', 395],
    ['Gendhuk Sari', 310],
    ['Lik Parmin', 220],
    ['Raden Bima', 140],
  ],
  // Dari Kota Mana? (maks 800)
  'dari-kota-mana': [
    ['Ki Darmo', 720],
    ['Mbak Ratri', 640],
    ['Pakde Joyo', 400],
    ['Dimas Arya', 300],
    ['Bu Lastri', 200],
    ['Le Tole', 100],
  ],
  // Kenali Masakanmu (maks 1150)
  'kenali-masakan': [
    ['Raden Ayu', 1062],
    ['Mbok Darmi', 931],
    ['Mas Bagus', 808],
    ['Gendhuk Sari', 615],
    ['Lik Parmin', 503],
    ['Dimas Arya', 300],
  ],
};

function client() {
  const url = process.env.SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SECRET_KEY?.trim();
  if (!url || !key) {
    console.error('SUPABASE_URL atau SUPABASE_SECRET_KEY belum diisi di .env.local.');
    process.exit(1);
  }
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } });
}

async function seed() {
  const supabase = client();
  const rows = Object.entries(SAMPLES).flatMap(([game, list]) =>
    list.map(([nickname, score]) => ({ game, nickname, score, is_sample: true })),
  );
  const { error } = await supabase.from('scores').insert(rows);
  if (error) {
    console.error('Gagal mengisi data contoh:', error.message);
    process.exit(1);
  }
  console.log(`Berhasil menambah ${rows.length} skor contoh.`);
}

async function clearSamples() {
  const supabase = client();
  const { count, error } = await supabase.from('scores').delete({ count: 'exact' }).eq('is_sample', true);
  if (error) {
    console.error('Gagal menghapus data contoh:', error.message);
    process.exit(1);
  }
  console.log(`Berhasil menghapus ${count ?? 0} skor contoh. Skor pemain asli tidak disentuh.`);
}

const command = process.argv[2];
if (command === 'seed') await seed();
else if (command === 'clear') await clearSamples();
else {
  console.error('Pakai: node scripts/leaderboard-samples.mjs seed|clear');
  process.exit(1);
}
