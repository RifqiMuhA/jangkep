/**
 * Gambar kategori untuk bumbu yang disebut AI tetapi belum ada di koleksi rempah Jangkep
 * (src/data/rempah.ts), memakai ilustrasi bahan yang sudah ada di public/kuliner/.
 * Aturan dicek berurutan; yang pertama cocok dipakai.
 */
const CATEGORY_RULES: { pattern: RegExp; image: string }[] = [
  // Gambar buatan tim (public/bongkar/bumbu/). Pola dipakai supaya variasi nama dari AI ikut kena.
  // Yang lebih spesifik dicek dulu, misalnya "daun bawang" sebelum "daun" dan "bawang".
  { pattern: /\bdaun bawang\b/, image: '/bongkar/bumbu/daun_bawang.webp' },
  { pattern: /\bseledri\b/, image: '/bongkar/bumbu/seledri.webp' },
  { pattern: /\bjeruk nipis\b/, image: '/bongkar/bumbu/jeruk_nipis.webp' },
  { pattern: /\bbombay\b/, image: '/bongkar/bumbu/bawang_bombay.webp' },
  { pattern: /\bkecap\b/, image: '/bongkar/bumbu/kecap.webp' },
  { pattern: /\bpetis\b/, image: '/bongkar/bumbu/petis.webp' },
  { pattern: /\b(jintan|jinten)\b/, image: '/bongkar/bumbu/jintan.webp' },
  { pattern: /\badas\b/, image: '/bongkar/bumbu/adas.webp' },
  { pattern: /\b(daun|kemangi|pandan|sereh|serai|kunci)\b/, image: '/kuliner/ingredients/rempah-daun.webp' },
  { pattern: /\bbawang putih\b/, image: '/bongkar/bumbu/bawang_putih.webp' },
  { pattern: /\b(cabai|cabe|lombok|rawit)\b/, image: '/bongkar/bumbu/cabai.webp' },
  { pattern: /\b(merica|lada)\b/, image: '/bongkar/bumbu/merica.webp' },
  { pattern: /\bsantan\b/, image: '/bongkar/bumbu/santan.webp' },
  // Gambar kategori bawaan halaman Kuliner untuk sisanya.
  { pattern: /\bbawang\b/, image: '/kuliner/ingredients/bawang.webp' },
  { pattern: /\bpaprika\b/, image: '/kuliner/ingredients/cabai.webp' },
  { pattern: /\bkelapa\b/, image: '/kuliner/ingredients/kelapa-parut.webp' },
  { pattern: /\b(saus|tauco|tiram)\b/, image: '/kuliner/ingredients/saus-hitam.webp' },
  { pattern: /\b(kacang|wijen)\b/, image: '/kuliner/ingredients/kacang.webp' },
  { pattern: /\bgula\b/, image: '/kuliner/ingredients/gula-pasir.webp' },
  { pattern: /\bgaram\b/, image: '/kuliner/garam.webp' },
];

/** Biji-bijian dan rempah kering lain yang belum punya gambar khusus memakai gambar rempah biji. */
const DEFAULT_IMAGE = '/kuliner/ingredients/rempah-biji.webp';

/**
 * Gambar khusus per bumbu, buatan tim. Cara menambah:
 * 1. Simpan gambar di public/bongkar/bumbu/, misalnya bawang-putih.webp (latar transparan, seperti gambar rempah lain).
 * 2. Tambahkan satu baris di sini: nama bumbu (huruf kecil) -> path gambar.
 * Bumbu yang belum punya gambar khusus otomatis memakai gambar kategori di atas.
 */
const EXTRA_IMAGES: Record<string, string> = {
  // 'bawang putih': '/bongkar/bumbu/bawang-putih.webp',
  // 'cabai merah': '/bongkar/bumbu/cabai-merah.webp',
};

function imageKey(name: string): string {
  return name.toLowerCase().replace(/\s+/g, ' ').trim();
}

export function extraSpiceImage(name: string): string {
  const key = imageKey(name);
  return EXTRA_IMAGES[key] ?? CATEGORY_RULES.find((rule) => rule.pattern.test(key))?.image ?? DEFAULT_IMAGE;
}

/** "bawang putih" -> "Bawang Putih", supaya nama dari AI rapi seperti nama di koleksi. */
export function titleCase(name: string): string {
  return name.trim().replace(/\s+/g, ' ').replace(/(^|\s)(\p{L})/gu, (_, space: string, letter: string) => space + letter.toUpperCase());
}
