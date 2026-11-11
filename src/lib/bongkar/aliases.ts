/**
 * Nama lain untuk tiap rempah di src/data/rempah.ts, dipakai saat mencocokkan jawaban AI.
 * Kunci = `id` rempah. `nama` dan `namaJawa` sudah otomatis ikut dicocokkan, jadi tidak perlu ditulis di sini.
 *
 * Disimpan terpisah supaya data rempah yang dipakai halaman lain tidak berubah.
 * Kalau AI sering memakai nama yang belum dikenal, tambahkan di sini.
 */
export const REMPAH_ALIASES: Record<string, string[]> = {
  kluwek: ["keluak", "kluwak", "keluwek", "keluwak", "kepayang", "black nut", "pangium edule"],
  kemiri: ["candlenut", "candle nut", "aleurites moluccanus"],
  "daun-salam": ["salam", "indonesian bay leaf", "salam leaf", "bay leaf", "syzygium polyanthum"],
  serai: ["sereh", "sere", "lemongrass", "lemon grass", "cymbopogon citratus"],
  lengkuas: ["laos", "galangal", "greater galangal", "alpinia galanga"],
  kencur: ["cikur", "aromatic ginger", "sand ginger", "kaempferia galanga"],
  ketumbar: ["tumbar", "coriander", "coriander seed", "coriander seeds", "coriandrum sativum"],
  "gula-merah": ["gula jawa", "gula aren", "palm sugar", "coconut sugar"],
  kunyit: ["kunir", "turmeric", "curcuma longa"],
  jahe: ["jae", "ginger", "zingiber officinale"],
  "bawang-merah": ["brambang", "shallot", "shallots"],
  "daun-jeruk": [
    "daun jeruk purut",
    "jeruk purut",
    "kaffir lime leaf",
    "kaffir lime leaves",
    "makrut lime leaf",
    "makrut lime leaves",
    "lime leaf",
    "lime leaves",
  ],
  pala: ["nutmeg", "myristica fragrans"],
  terasi: ["trasi", "shrimp paste", "belacan"],
  "asam-jawa": ["asem jawa", "asam", "asem", "tamarind", "tamarindus indica"],
  "bunga-lawang": ["pekak", "adas bintang", "star anise", "illicium verum"],
  kapulaga: ["cardamom", "kapol"],
  cengkeh: ["cengkih", "clove", "cloves", "syzygium aromaticum"],
  "kayu-manis": ["cinnamon", "kulit manis"],
  "kayu-secang": ["secang", "sappanwood", "sappan wood", "caesalpinia sappan"],
  "bawang-putih": ["garlic", "bawang putih goreng"],
  cabai: ["cabe", "cabai merah", "cabe merah", "cabai rawit", "cabe rawit", "rawit", "lombok", "cabai merah keriting", "cabai hijau", "chili", "chilli"],
  merica: ["mrica", "lada", "lada putih", "lada hitam", "merica bubuk", "merica putih", "pepper", "white pepper", "black pepper"],
};
