export interface Rempah {
  id: string;
  nama: string;
  peran: string;
  makanan: string;
  asset: string;
  width: number;
  height: number;
}

export const rempahData: Rempah[] = [
  {
    id: 'lengkuas',
    nama: 'Lengkuas',
    peran: 'Pemberi rasa hangat pedas & aroma kuat',
    makanan: 'Soto Kudus, Opor, Sayur Labu',
    asset: '/rempah/lengkuas.png',
    width: 130, height: 130
  },
  {
    id: 'kencur',
    nama: 'Kencur',
    peran: 'Pemberi rasa unik khas Jawa',
    makanan: 'Beras Kencur, Urap, Pecel',
    asset: '/rempah/kencur.png',
    width: 100, height: 100
  },
  {
    id: 'serai',
    nama: 'Serai',
    peran: 'Aroma segar & pengusir amis',
    makanan: 'Soto Ayam, Rendang, Gulai',
    asset: '/rempah/serai.png',
    width: 130, height: 130
  },
  {
    id: 'kemiri',
    nama: 'Kemiri',
    peran: 'Pengental bumbu & rasa gurih',
    makanan: 'Rawon, Lodeh, Oseng Mercon',
    asset: '/rempah/kemiri.png',
    width: 90, height: 90
  },
  {
    id: 'gula-merah',
    nama: 'Gula Merah',
    peran: 'Pemberi rasa manis legit khas Jawa',
    makanan: 'Gudeg, Jenang, Dawet',
    asset: '/rempah/gula-merah.png',
    width: 110, height: 110
  },
  {
    id: 'ketumbar',
    nama: 'Ketumbar',
    peran: 'Rasa earthy & aroma khas Jawa',
    makanan: 'Pecel, Sate Maranggi, Gudeg',
    asset: '/rempah/ketumbar.png',
    width: 85, height: 85
  },
  {
    id: 'kluwek',
    nama: 'Kluwek',
    peran: 'Rasa gelap, dalam & khas Rawon',
    makanan: 'Rawon, Brongkos, Soto Rawon',
    asset: '/rempah/kluwek.png',
    width: 95, height: 95
  },
  {
    id: 'daun-salam',
    nama: 'Daun Salam',
    peran: 'Aroma daun herbal khas Indonesia',
    makanan: 'Rendang, Nasi Uduk, Semur',
    asset: '/rempah/daun-salam.png',
    width: 120, height: 120
  }
];
