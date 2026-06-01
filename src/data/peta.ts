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
    nama: 'Kota Semarang',
    makanan: 'Lumpia Semarang',
    deskripsi:
      'Camilan ikonik perpaduan budaya Jawa dan Tionghoa, isian rebung dengan kulit renyah.',
    foto: '/kuliner-beranda/lumpia-semarang.svg',
    logo: '/logo-kabkota/Lambang_Kota_Semarang.png',
    pin: { x: 58, y: 52 },
  },
  {
    id: 'kota-surakarta',
    nama: 'Kota Solo',
    makanan: 'Nasi Liwet',
    deskripsi:
      'Nasi gurih dimasak dengan santan, disajikan dengan areh, ayam opor, dan sambal goreng.',
    foto: '/kuliner-beranda/nasi-liwet.svg',
    logo: '/logo-kabkota/Seal_of_the_City_of_Surakarta.svg.png',
    pin: { x: 71, y: 72 },
  },
  {
    id: 'kudus',
    nama: 'Kudus',
    makanan: 'Soto Kudus',
    deskripsi:
      'Soto bening khas dengan daging kerbau atau ayam, kuah ringan beraroma rempah.',
    foto: '/kuliner-beranda/soto-kudus.svg',
    logo: '/logo-kabkota/Lambang_Kabupaten_Kudus.png',
    pin: { x: 73, y: 44 },
  },
  {
    id: 'banyumas',
    nama: 'Banyumas',
    makanan: 'Mendoan',
    deskripsi:
      'Tempe tipis berlapis tepung bumbu, digoreng setengah matang — renyah di luar, lembut di dalam.',
    foto: '/kuliner-beranda/mendoan.svg',
    logo: '/logo-kabkota/Lambang_Kabupaten_Banyumas.png',
    pin: { x: 21, y: 68 },
  },
  {
    id: 'wonosobo',
    nama: 'Wonosobo',
    makanan: 'Mie Ongklok',
    deskripsi:
      'Mie kuah kental khas pegunungan Dieng, disajikan dengan potongan kol dan daun kucai.',
    foto: '/kuliner-beranda/mie-ongklok.svg',
    logo: '/logo-kabkota/wonosobo.png',
    pin: { x: 43, y: 66 },
  },
  {
    id: 'magelang',
    nama: 'Magelang',
    makanan: 'Kupat Tahu',
    deskripsi:
      'Ketupat dan tahu dipadukan saus kacang manis-gurih khas Magelang.',
    foto: '/kuliner-beranda/kupat-tahu.svg',
    logo: '/logo-kabkota/magelang.png',
    pin: { x: 54, y: 70 },
  },
  {
    id: 'pekalongan',
    nama: 'Pekalongan',
    makanan: 'Tauto',
    deskripsi:
      'Soto khas Pekalongan dengan kuah tauco — perpaduan cita rasa Jawa dan Tionghoa yang unik.',
    foto: '/kuliner-beranda/tauto.svg',
    logo: '/logo-kabkota/Lambang_Kota_Pekalongan.png',
    pin: { x: 35, y: 53 },
  },
  {
    id: 'rembang',
    nama: 'Rembang',
    makanan: 'Sate Kambing Rembang',
    deskripsi:
      'Sate kambing muda dengan bumbu kecap khas pesisir utara Jawa Tengah.',
    foto: '/kuliner-beranda/sate-kambing.svg',
    logo: '/logo-kabkota/Lambang_Kabupaten_Rembang.webp',
    pin: { x: 91, y: 42 },
  },
  {
    id: 'tegal',
    nama: 'Tegal',
    makanan: 'Teh Poci',
    deskripsi:
      'Teh tubruk diseduh dalam poci tanah liat, disajikan dengan gula batu — ritual ngeteh khas Tegal.',
    foto: '/kuliner-beranda/poci-sauto.svg',
    logo: '/logo-kabkota/Shield_of_the_city_of_Tegal.svg.png',
    pin: { x: 20, y: 53 },
  },
  {
    id: 'klaten',
    nama: 'Klaten',
    makanan: 'Ayam Panggang Klaten',
    deskripsi:
      'Ayam kampung dipanggang dengan bumbu Jawa kaya rempah, aroma smoky yang khas.',
    foto: '/kuliner-beranda/ayam-klaten.svg',
    logo: '/logo-kabkota/LOGO_KABUPATEN_KLATEN.png',
    pin: { x: 65, y: 76 },
  },
];
