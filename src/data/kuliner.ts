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
    id: 'soto',
    nama: 'Soto Kudus',
    kota: 'Kudus',
    deskripsi:
      'Soto kaldu bening dengan daging kerbau atau ayam, disajikan di mangkuk keramik kecil bersama taoge dan bawang putih goreng.',
    deskripsiSingkat: 'Soto kaldu bening khas Kudus di mangkuk porselen kecil',
    flavors: ['Segar', 'Gurih'],
    image: '/kuliner/gallery/soto_1.webp',
    slug: 'soto',
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
    id: 'sate',
    nama: 'Sate Ayam Blora',
    kota: 'Blora',
    deskripsi:
      'Sate ayam kampung empuk bersiram bumbu kacang kental yang legit. Biasanya dinikmati dengan cara unik beserta kuah lodeh yang gurih.',
    deskripsiSingkat: 'Sate ayam kampung bumbu kacang legit khas Blora',
    flavors: ['Manis', 'Gurih'],
    image: '/kuliner/gallery/sate_1.webp',
    slug: 'sate',
  },
];
