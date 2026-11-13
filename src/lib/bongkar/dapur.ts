import { kulinerData } from "@/data/kulinerData";
import { rempahData } from "@/data/rempah";
import { REMPAH_MASAKAN } from "@/data/rempahMasakan";
import { toDishLink } from "./match";
import type { BongkarResult, MatchedSpice } from "./schema";

/** Satu masakan di galeri "dapur Jangkep": hasil bongkarnya sudah disusun dari data tim, tanpa AI. */
export interface DapurDish {
  slug: string;
  name: string;
  image: string;
  result: BongkarResult;
}

const REMPAH_BY_ID = new Map(rempahData.map((item) => [item.id, item]));

/**
 * Susun galeri dapur Jangkep. Dijalankan di server (halaman /bongkar), supaya seluruh data Ensiklopedia
 * tidak ikut terkirim ke browser; yang dikirim hanya hasil yang sudah jadi.
 */
export function buildDapurDishes(): DapurDish[] {
  return kulinerData.flatMap((item) => {
    const matched: MatchedSpice[] = (REMPAH_MASAKAN[item.slug] ?? []).flatMap((id) => {
      const rempah = REMPAH_BY_ID.get(id);
      if (!rempah) return [];
      return [{ id, nama: rempah.nama, namaJawa: rempah.namaJawa, asset: rempah.asset, peran: rempah.peran, makanan: rempah.makanan, aiNames: [rempah.nama] }];
    });
    const image = item.galleryImages[0];
    if (matched.length < 2 || !image) return [];

    return [
      {
        slug: item.slug,
        name: item.name,
        image,
        result: {
          dish: item.name,
          source: "dapur",
          confidence: "tinggi",
          masakanJawa: true,
          matched,
          unmatched: [],
          dishLink: toDishLink(item),
          cooking: item.instructions.length > 0 ? { source: "jangkep", steps: item.instructions } : undefined,
        },
      },
    ];
  });
}
