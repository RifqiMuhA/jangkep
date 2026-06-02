export interface Ingredient {
  id: string;
  name: string;
  image: string;
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  correctIngredients: string[]; // array of ingredient IDs
}

export const ingredients: Ingredient[] = [
  { id: 'bawang', name: 'Bawang', image: '/kuliner/ingredients/bawang.webp' },
  { id: 'cabai', name: 'Cabai', image: '/kuliner/ingredients/cabai.webp' },
  { id: 'daging-ayam', name: 'Daging Ayam', image: '/kuliner/ingredients/daging-ayam.webp' },
  { id: 'daging-merah', name: 'Daging Merah', image: '/kuliner/ingredients/daging-merah.webp' },
  { id: 'daun-pisang', name: 'Daun Pisang', image: '/kuliner/ingredients/daun-pisang.webp' },
  { id: 'gula-merah', name: 'Gula Merah', image: '/kuliner/ingredients/gula-merah.webp' },
  { id: 'gula-pasir', name: 'Gula Pasir', image: '/kuliner/ingredients/gula-pasir.webp' },
  { id: 'kacang', name: 'Kacang', image: '/kuliner/ingredients/kacang.webp' },
  { id: 'kedelai', name: 'Kedelai', image: '/kuliner/ingredients/kedelai.webp' },
  { id: 'kelapa-parut', name: 'Kelapa Parut', image: '/kuliner/ingredients/kelapa-parut.webp' },
  { id: 'mie', name: 'Mie', image: '/kuliner/ingredients/mie.webp' },
  { id: 'rempah-biji', name: 'Rempah Biji', image: '/kuliner/ingredients/rempah-biji.webp' },
  { id: 'rempah-daun', name: 'Rempah Daun', image: '/kuliner/ingredients/rempah-daun.webp' },
  { id: 'santan', name: 'Santan', image: '/kuliner/ingredients/santan.webp' },
  { id: 'saus-hitam', name: 'Saus Hitam', image: '/kuliner/ingredients/saus-hitam.webp' },
  { id: 'sayuran', name: 'Sayuran', image: '/kuliner/ingredients/sayuran.webp' },
  { id: 'seafood', name: 'Seafood', image: '/kuliner/ingredients/seafood.webp' },
  { id: 'telur', name: 'Telur', image: '/kuliner/ingredients/telur.webp' },
  { id: 'tepung', name: 'Tepung', image: '/kuliner/ingredients/tepung.webp' },
  { id: 'tulang-iga', name: 'Tulang Iga', image: '/kuliner/ingredients/tulang-iga.webp' },
  { id: 'umbi-buah', name: 'Umbi/Buah', image: '/kuliner/ingredients/umbi-buah.webp' }
];

export const recipes: Recipe[] = [
  {
    id: 'soto_kudus',
    name: 'Soto Kudus',
    description: 'Soto bening yang gurih, disajikan dengan mangkuk kecil.',
    correctIngredients: ['daging-ayam', 'bawang', 'rempah-daun']
  },
  {
    id: 'tengkleng',
    name: 'Tengkleng Solo',
    description: 'Olahan tulang kambing berkuah gurih berbumbu rempah-rempah.',
    correctIngredients: ['tulang-iga', 'rempah-biji', 'cabai']
  },
  {
    id: 'garang_asem',
    name: 'Garang Asem',
    description: 'Ayam berkuah asam pedas yang dibungkus dengan daun pisang.',
    correctIngredients: ['daging-ayam', 'daun-pisang', 'cabai']
  },
  {
    id: 'dawet_ayu',
    name: 'Dawet Ayu',
    description: 'Minuman hijau manis dengan santan dan gula merah asal Banjarnegara.',
    correctIngredients: ['tepung', 'santan', 'gula-merah']
  },
  {
    id: 'lumpia',
    name: 'Lumpia Semarang',
    description: 'Kudapan berisi rebung (sayuran) khas ibu kota Jawa Tengah.',
    correctIngredients: ['tepung', 'sayuran', 'daging-ayam'] // wrapper, bamboo shoot, chicken
  }
];
