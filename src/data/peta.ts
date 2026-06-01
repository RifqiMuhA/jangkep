export interface KotaAktif {
  id: string;           // harus sama persis dengan id di SVG
  nama: string;
  makanan: string;
  deskripsi: string;
  foto: string;         // path ke gambar di public/kuliner-beranda/
  logo: string;         // path ke lambang kabupaten/kota
  /** Posisi pin dalam % relatif terhadap viewBox SVG (900×600) */
  pin: { x: number; y: number };
}

export const kotaAktif: KotaAktif[] = [
  {
    id: 'kota-semarang',
    nama: 'Semarang',
    makanan: 'Lumpia Semarang',
    deskripsi: 'Gulungan kulit tipis renyah berisi rebung manis gurih, udang, dan telur.',
    foto: '/kuliner/gallery/lumpia_1.webp',
    logo: '',
    pin: { x: 58, y: 52 },
  },
  {
    id: 'kota-surakarta',
    nama: 'Solo',
    makanan: 'Nasi Liwet Solo',
    deskripsi: 'Nasi gurih bersantan yang disajikan dengan suwiran ayam, areh, dan labu siam.',
    foto: '/kuliner/gallery/nasi-liwet_1.webp',
    logo: '',
    pin: { x: 71, y: 72 },
  },
  {
    id: 'kudus',
    nama: 'Kudus',
    makanan: 'Soto Kudus',
    deskripsi: 'Soto kaldu bening dengan daging kerbau atau ayam, disajikan di mangkuk keramik kecil.',
    foto: '/kuliner/gallery/soto_1.webp',
    logo: '',
    pin: { x: 73, y: 44 },
  },
  {
    id: 'banyumas',
    nama: 'Banyumas',
    makanan: 'Tempe Mendoan',
    deskripsi: 'Tempe berbalut tepung setengah matang yang disajikan panas bersama cabai rawit.',
    foto: '/kuliner/gallery/tempe-goreng_1.webp',
    logo: '',
    pin: { x: 21, y: 68 },
  },
  {
    id: 'wonosobo',
    nama: 'Wonosobo',
    makanan: 'Mie Ongklok',
    deskripsi: 'Mie kuning rebus dengan kuah kental berbahan pati, disajikan bersama sate sapi dan tempe kemul.',
    foto: '/kuliner/gallery/mie-ongklok_1.webp',
    logo: '',
    pin: { x: 43, y: 66 },
  },
  {
    id: 'magelang',
    nama: 'Magelang',
    makanan: 'Getuk Lindri',
    deskripsi: 'Olahan singkong manis warna-warni bertabur kelapa parut gurih.',
    foto: '/kuliner/gallery/jajanan-pasar_1.webp',
    logo: '',
    pin: { x: 54, y: 70 },
  },
  {
    id: 'blora',
    nama: 'Blora',
    makanan: 'Sate Ayam Blora',
    deskripsi: 'Sate ayam kampung empuk bersiram bumbu kacang kental yang legit.',
    foto: '/kuliner/gallery/sate_1.webp',
    logo: '',
    pin: { x: 88, y: 49 },
  },
  {
    id: 'banjarnegara',
    nama: 'Banjarnegara',
    makanan: 'Dawet Ayu',
    deskripsi: 'Minuman es segar dengan butiran dawet hijau pandan dan guyuran gula aren cair.',
    foto: '/kuliner/gallery/dawet-ayu_1.webp',
    logo: '',
    pin: { x: 35, y: 64 },
  },
  {
    id: 'demak',
    nama: 'Demak',
    makanan: 'Garang Asem Ayam',
    deskripsi: 'Ayam kampung berbumbu asam pedas berkuah santan yang dikukus dalam daun pisang.',
    foto: '/kuliner/gallery/garang-asem_1.webp',
    logo: '',
    pin: { x: 63, y: 49 },
  },
  {
    id: 'pati',
    nama: 'Pati',
    makanan: 'Nasi Gandul',
    deskripsi: 'Nasi berkuah rempah kecoklatan disajikan di atas piring beralas daun pisang.',
    foto: '/kuliner/gallery/nasi-gandul_1.webp',
    logo: '',
    pin: { x: 81, y: 39 },
  },
];
