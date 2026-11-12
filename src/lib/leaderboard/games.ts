/**
 * Daftar game yang boleh masuk leaderboard (whitelist), beserta batas skornya.
 * Dipakai server untuk validasi dan tampilan untuk label tab.
 *
 * Rumus skor (dihitung di halaman game, lihat src/lib/leaderboard/scoring.ts):
 * - Racik Masakan Jawa: 10 per bahan benar + 50 per masakan selesai + sisa detik kalau 5 masakan selesai.
 *   Maks: 5 masakan x 6 bahan (resep terbanyak saat ini) = 30 bahan -> 300 + 250 + 85 detik (60 + 5 x 5 tambahan) = 635.
 * - Dari Kota Mana?: 100 per masakan yang ditemukan + 5 x sisa detik kalau keempatnya ditemukan.
 *   Maks: 4 x 100 + 5 x 80 detik (60 + 4 x 5 tambahan) = 800.
 * - Kenali Masakanmu: 100 per jawaban benar + sisa detik saat menjawab benar (maks 15 per soal).
 *   Maks: 10 x (100 + 15) = 1150.
 *
 * Batas maksimum diberi sedikit kelonggaran supaya penambahan resep tidak langsung membuat skor sah ditolak.
 * Kalau aturan game berubah, perbarui juga angka di sini.
 */
export const LEADERBOARD_GAMES = [
  { id: 'racik-masakan', title: 'Racik Masakan Jawa', href: '/games/game1', maxScore: 700 },
  { id: 'dari-kota-mana', title: 'Dari Kota Mana?', href: '/games/game2', maxScore: 800 },
  { id: 'kenali-masakan', title: 'Kenali Masakanmu', href: '/games/game3', maxScore: 1150 },
] as const;

export type LeaderboardGameId = (typeof LEADERBOARD_GAMES)[number]['id'];

export const LEADERBOARD_GAME_IDS = LEADERBOARD_GAMES.map((game) => game.id) as [LeaderboardGameId, ...LeaderboardGameId[]];

export function findLeaderboardGame(id: string) {
  return LEADERBOARD_GAMES.find((game) => game.id === id);
}

/** Jumlah baris yang ditampilkan di leaderboard. */
export const LEADERBOARD_SIZE = 10;
