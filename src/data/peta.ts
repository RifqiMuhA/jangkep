export interface KotaData {
  id: string;
  nama: string;
  makananKhas: string;
  image: string;
  /* SVG path center coordinates (relative to viewBox) */
  cx: number;
  cy: number;
}

export const kotaData: KotaData[] = [
  {
    id: 'semarang',
    nama: 'Semarang',
    makananKhas: 'Lumpia',
    image: '/makanan/lumpia.webp',
    cx: 410,
    cy: 180,
  },
  {
    id: 'solo',
    nama: 'Solo',
    makananKhas: 'Nasi Liwet',
    image: '/makanan/nasi-liwet.webp',
    cx: 520,
    cy: 260,
  },
  {
    id: 'kudus',
    nama: 'Kudus',
    makananKhas: 'Soto Kudus',
    image: '/makanan/gudeg.webp',
    cx: 440,
    cy: 120,
  },
  {
    id: 'banyumas',
    nama: 'Banyumas',
    makananKhas: 'Mendoan',
    image: '/makanan/gudeg.webp',
    cx: 160,
    cy: 300,
  },
  {
    id: 'wonosobo',
    nama: 'Wonosobo',
    makananKhas: 'Mie Ongklok',
    image: '/makanan/gudeg.webp',
    cx: 260,
    cy: 250,
  },
  {
    id: 'magelang',
    nama: 'Magelang',
    makananKhas: 'Kupat Tahu',
    image: '/makanan/gudeg.webp',
    cx: 330,
    cy: 240,
  },
  {
    id: 'pekalongan',
    nama: 'Pekalongan',
    makananKhas: 'Tauto',
    image: '/makanan/gudeg.webp',
    cx: 280,
    cy: 160,
  },
];
