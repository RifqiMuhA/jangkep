export type FlavorType = 'Pedas' | 'Manis' | 'Gurih' | 'Segar' | 'Legit';

export interface KulinerItem {
  id: string;
  nama: string;
  kota: string;
  deskripsi: string;
  deskripsiSingkat: string;
  flavors: FlavorType[];
  image: string;
  slug: string;
}

export const featuredKuliner: KulinerItem[] = [
  {
    id: 'gudeg',
    nama: 'Gudeg',
    kota: 'Solo / Yogyakarta',
    deskripsi:
      'Warisan kuliner keraton yang memasak nangka muda berjam-jam dalam santan dan gula merah hingga berwarna coklat legam. Setiap suapan menyimpan cerita panjang budaya Jawa.',
    deskripsiSingkat: 'Nangka muda dimasak berjam-jam dalam santan & gula merah',
    flavors: ['Manis', 'Legit', 'Gurih'],
    image: '/makanan/gudeg.webp',
    slug: 'gudeg',
  },
  {
    id: 'nasi-liwet',
    nama: 'Nasi Liwet Solo',
    kota: 'Solo',
    deskripsi:
      'Nasi pulen diaron dalam santan dengan daun salam dan serai, disajikan dengan lauk ayam suwir, telur pindang, dan sambal goreng. Sarapan khas keraton Solo yang menghangatkan.',
    deskripsiSingkat: 'Nasi santan khas Solo dengan ayam suwir & sambal goreng',
    flavors: ['Gurih', 'Legit'],
    image: '/makanan/nasi-liwet.webp',
    slug: 'nasi-liwet',
  },
  {
    id: 'lumpia',
    nama: 'Lumpia Semarang',
    kota: 'Semarang',
    deskripsi:
      'Perpaduan budaya Tionghoa dan Jawa dalam satu gulungan. Kulit tipis renyah membungkus isian rebung dan udang yang gurih manis — simbol akulturasi Semarang.',
    deskripsiSingkat: 'Gulungan renyah berisi rebung & udang khas Semarang',
    flavors: ['Gurih', 'Manis', 'Segar'],
    image: '/makanan/lumpia.webp',
    slug: 'lumpia',
  },
  {
    id: 'tengkleng',
    nama: 'Tengkleng',
    kota: 'Solo',
    deskripsi:
      'Sup tulang kambing berkuah bening penuh rempah. Dulunya makanan rakyat kecil dari sisa tulang yang tak terpakai, kini menjadi ikon kuliner Solo yang dicari pelancong.',
    deskripsiSingkat: 'Sup tulang kambing berkuah bening penuh rempah khas Solo',
    flavors: ['Gurih', 'Pedas', 'Segar'],
    image: '/makanan/tengkleng.webp',
    slug: 'tengkleng',
  },
];
