import { kulinerData, type KulinerItem } from "@/data/kulinerData";
import { rempahData, type Rempah } from "@/data/rempah";
import { REMPAH_ALIASES } from "./aliases";
import type { DishLink, MatchResult, MatchedSpice } from "./schema";

/** Huruf kecil, tanpa tanda baca, tanpa spasi berlebih. "  Daun-Jeruk " -> "daun jeruk" */
export function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/** Peta dari setiap nama/alias yang sudah dinormalisasi ke rempahnya. */
function buildIndex(rempah: Rempah[]): Map<string, Rempah> {
  const index = new Map<string, Rempah>();
  for (const item of rempah) {
    const names = [item.id, item.nama, item.namaJawa, ...(REMPAH_ALIASES[item.id] ?? [])];
    for (const name of names) {
      const key = normalizeName(name);
      // Nama pertama yang mendaftar menang, supaya alias ganda tidak menimpa diam-diam.
      if (key && !index.has(key)) index.set(key, item);
    }
  }
  return index;
}

const REMPAH_INDEX = buildIndex(rempahData);

/**
 * Cocokkan nama rempah dari AI ke data rempah Jangkep.
 * - Cocok lewat id, nama, nama Jawa, atau alias di aliases.ts.
 * - Beberapa nama AI yang menunjuk rempah sama digabung jadi satu entri.
 * - Yang tidak cocok dikembalikan di `unmatched` (tidak dibuang).
 */
export function matchSpices(aiNames: string[]): MatchResult {
  const matchedById = new Map<string, MatchedSpice>();
  const unmatched: string[] = [];
  const seenUnmatched = new Set<string>();

  for (const original of aiNames) {
    const key = normalizeName(original);
    if (!key) continue;

    const item = REMPAH_INDEX.get(key);
    if (item) {
      const entry = matchedById.get(item.id);
      if (entry) entry.aiNames.push(original);
      else {
        matchedById.set(item.id, {
          id: item.id,
          nama: item.nama,
          namaJawa: item.namaJawa,
          asset: item.asset,
          peran: item.peran,
          makanan: item.makanan,
          aiNames: [original],
        });
      }
    } else if (!seenUnmatched.has(key)) {
      seenUnmatched.add(key);
      unmatched.push(original.trim());
    }
  }

  return { matched: [...matchedById.values()], unmatched };
}

/** Nama-nama rempah yang dikirim ke AI di dalam prompt. */
export const REMPAH_NAMES = rempahData.map((item) => item.nama);

/**
 * Kunci pencarian tiap masakan di Ensiklopedia: nama lengkap dan slug.
 * Contoh: "Tengkleng Solo" -> ["tengkleng solo", "tengkleng"].
 */
const DISH_KEYS: { key: string; item: KulinerItem }[] = kulinerData
  .flatMap((item) => [normalizeName(item.name), normalizeName(item.slug)].map((key) => ({ key, item })))
  .filter(({ key }) => key.length > 0)
  // Kunci terpanjang dicek dulu, supaya "sate buntel" tidak tertangkap sebagai "sate".
  .sort((a, b) => b.key.length - a.key.length);

/** Cari masakan di Ensiklopedia Jangkep yang namanya muncul di tebakan AI. */
export function findKuliner(dish: string): KulinerItem | undefined {
  const target = ` ${normalizeName(dish)} `;
  return DISH_KEYS.find(({ key }) => target.includes(` ${key} `))?.item;
}

export function toDishLink(item: KulinerItem): DishLink {
  return { slug: item.slug, name: item.name, image: item.galleryImages[0] };
}

export function findDishLink(dish: string): DishLink | undefined {
  const item = findKuliner(dish);
  return item ? toDishLink(item) : undefined;
}
