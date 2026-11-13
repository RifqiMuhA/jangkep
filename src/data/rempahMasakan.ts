/**
 * Rempah koleksi Jangkep (id di src/data/rempah.ts) yang dipakai tiap masakan Ensiklopedia.
 * Dipakai fitur "Pilih saka dapur Jangkep" di Bongkar Rempah, yang berjalan tanpa AI.
 *
 * DRAF: disusun dari resep umum masakan-masakan ini, mohon diperiksa tim Jangkep.
 * Masakan yang rempah koleksinya kurang dari 2 sengaja tidak dicantumkan (tampahnya akan terlalu kosong),
 * jadi tidak muncul di galeri dapur Jangkep. Tambahkan di sini kalau ingin dimunculkan.
 */
export const REMPAH_MASAKAN: Record<string, string[]> = {
  bakso: ['bawang-putih', 'bawang-merah', 'merica'],
  'nasi-liwet': ['daun-salam', 'serai', 'bawang-merah', 'bawang-putih', 'daun-jeruk'],
  sate: ['bawang-merah', 'bawang-putih', 'cabai', 'gula-merah'],
  'tempe-goreng': ['bawang-putih', 'ketumbar', 'kunyit', 'kemiri', 'cabai'],
  soto: ['kunyit', 'jahe', 'lengkuas', 'serai', 'daun-salam', 'daun-jeruk', 'bawang-merah', 'bawang-putih', 'kemiri', 'merica', 'ketumbar'],
  lemper: ['bawang-merah', 'bawang-putih', 'ketumbar', 'daun-salam', 'lengkuas', 'kemiri'],
  lumpia: ['bawang-putih', 'bawang-merah', 'merica'],
  'garang-asem': ['bawang-merah', 'bawang-putih', 'cabai', 'daun-salam', 'lengkuas'],
  'tahu-petis': ['bawang-putih', 'cabai', 'gula-merah'],
  tongseng: ['bawang-merah', 'bawang-putih', 'kemiri', 'ketumbar', 'kunyit', 'jahe', 'lengkuas', 'serai', 'daun-salam', 'merica', 'cabai'],
  'nasi-gandul': ['bawang-merah', 'bawang-putih', 'kemiri', 'ketumbar', 'lengkuas', 'daun-salam', 'serai', 'gula-merah'],
  'mangut-lele': ['bawang-merah', 'bawang-putih', 'kemiri', 'kunyit', 'jahe', 'lengkuas', 'serai', 'daun-salam', 'daun-jeruk', 'cabai'],
  tengkleng: ['bawang-merah', 'bawang-putih', 'kemiri', 'kunyit', 'jahe', 'lengkuas', 'serai', 'daun-salam', 'daun-jeruk', 'ketumbar', 'merica'],
  'sate-buntel': ['bawang-putih', 'bawang-merah', 'ketumbar', 'merica', 'pala'],
  'tahu-gimbal': ['bawang-putih', 'cabai', 'gula-merah'],
  'mie-ongklok': ['bawang-putih', 'bawang-merah', 'kemiri', 'merica', 'gula-merah'],
  'nasi-grombyang': ['bawang-merah', 'bawang-putih', 'kluwek', 'kemiri', 'ketumbar', 'lengkuas', 'serai', 'daun-salam', 'jahe'],
};
