export interface KulinerItem {
  slug: string;
  name: string;
  category: "Makanan Berat" | "Jajanan" | "Minuman";
  tasteProfile: "Manis" | "Gurih" | "Pedas" | "Segar";
  origin: string;
  shortDescription: string;
  history: string;
  ingredients: string[];
  galleryImages: ['/kuliner/gallery/sate_1.webp', '/kuliner/gallery/sate_2.webp'];
}

export const kulinerData: KulinerItem[] = [
  // --- 10 MASKOT AWAL ---
  {
    slug: 'bakso',
    name: 'Bakso Wonogiri',
    category: 'Makanan Berat',
    tasteProfile: 'Gurih',
    origin: 'Wonogiri',
    shortDescription: 'Bola daging kenyal dengan kuah kaldu sapi pekat yang menghangatkan suasana.',
    history: 'Bakso Wonogiri memiliki ciri khas kuah kaldu sapi yang sangat bening namun kaya rempah. Sejarahnya berawal dari para perantau asal Wonogiri yang memodifikasi resep bakso Tionghoa dengan cita rasa lokal Jawa, menggunakan lebih banyak lada dan bawang putih goreng yang ditumbuk bersama kaldu.',
    ingredients: ['daging-sapi', 'bawang-putih', 'bawang-merah', 'kaldu-sapi', 'tepung-tapioka'],
    galleryImages: ['/kuliner/gallery/sate_1.webp', '/kuliner/gallery/sate_2.webp']
  },
  {
    slug: 'nasi-liwet',
    name: 'Nasi Liwet Solo',
    category: 'Makanan Berat',
    tasteProfile: 'Gurih',
    origin: 'Solo',
    shortDescription: 'Nasi gurih bersantan yang disajikan dengan suwiran ayam, areh, dan labu siam.',
    history: 'Nasi Liwet merupakan pusaka kuliner dari kota Solo. Proses memasaknya ("ngliwet") menggunakan santan kelapa murni yang dimasak perlahan di atas tungku kayu bakar. Makanan ini dulunya merupakan sajian keraton yang akhirnya turun menjadi makanan merakyat yang bisa dinikmati di sepanjang jalan kota Surakarta pada malam hari.',
    ingredients: ['santan', 'daging-ayam', 'bawang-merah', 'daun-salam', 'serai', 'daun-pisang'],
    galleryImages: ['/kuliner/gallery/sate_1.webp', '/kuliner/gallery/sate_2.webp']
  },
  {
    slug: 'sate',
    name: 'Sate Ayam Blora',
    category: 'Makanan Berat',
    tasteProfile: 'Manis',
    origin: 'Blora',
    shortDescription: 'Sate ayam kampung empuk bersiram bumbu kacang kental yang legit.',
    history: 'Berbeda dengan sate Madura, Sate Blora menggunakan ayam kampung yang teksturnya lebih liat namun gurih. Keunikannya terletak pada bumbu kacangnya yang sangat halus dan disajikan bersama kuah lodeh tempe. Tradisi menyantap sate di Blora adalah "makan dulu, hitung tusuknya belakangan".',
    ingredients: ['daging-ayam', 'kacang-tanah', 'kecap-manis', 'bawang-merah', 'gula-jawa'],
    galleryImages: ['/kuliner/gallery/sate_1.webp', '/kuliner/gallery/sate_2.webp']
  },
  {
    slug: 'kue-lapis',
    name: 'Kue Lapis Jongkong',
    category: 'Jajanan',
    tasteProfile: 'Manis',
    origin: 'Semarang',
    shortDescription: 'Jajanan lapis kenyal dua warna dengan aroma pandan yang wangi menenangkan.',
    history: 'Kue Lapis menjadi lambang ikatan yang erat dan kesabaran, mengingat proses pembuatannya yang harus dikukus selapis demi selapis. Aroma pandan suji dan santan kelapa mendominasi kue basah yang kerap hadir dalam setiap perayaan syukuran masyarakat Jawa Tengah ini.',
    ingredients: ['tepung-beras', 'santan', 'gula-pasir', 'pandan', 'tepung-tapioka'],
    galleryImages: ['/kuliner/gallery/sate_1.webp', '/kuliner/gallery/sate_2.webp']
  },
  {
    slug: 'tempe-goreng',
    name: 'Tempe Mendoan',
    category: 'Jajanan',
    tasteProfile: 'Gurih',
    origin: 'Banyumas',
    shortDescription: 'Tempe berbalut tepung setengah matang yang disajikan panas bersama cabai rawit.',
    history: 'Mendoan berasal dari kata "Mendo" yang dalam dialek Banyumasan berarti setengah matang atau lembek. Tempe mendoan tidak digoreng hingga garing, melainkan hanya sebentar di dalam minyak panas, menghasilkan tekstur layu (mendo) yang justru menjadi primadona kuliner di daerah Purwokerto dan sekitarnya.',
    ingredients: ['tempe', 'tepung-beras', 'bawang-putih', 'daun-bawang', 'cabai-rawit'],
    galleryImages: ['/kuliner/gallery/sate_1.webp', '/kuliner/gallery/sate_2.webp']
  },
  {
    slug: 'soto',
    name: 'Soto Kudus',
    category: 'Makanan Berat',
    tasteProfile: 'Segar',
    origin: 'Kudus',
    shortDescription: 'Soto kaldu bening dengan daging kerbau atau ayam, disajikan di mangkuk keramik kecil.',
    history: 'Soto Kudus memiliki sejarah toleransi beragama yang kuat. Sunan Kudus mengajarkan pengikutnya untuk tidak memotong sapi sebagai bentuk penghormatan kepada umat Hindu kala itu. Sebagai gantinya, Soto Kudus otentik menggunakan daging kerbau, disajikan dalam mangkuk mungil dengan taburan bawang putih goreng.',
    ingredients: ['daging-ayam', 'bawang-putih', 'bawang-merah', 'serai', 'seledri'],
    galleryImages: ['/kuliner/gallery/sate_1.webp', '/kuliner/gallery/sate_2.webp']
  },
  {
    slug: 'jajanan-pasar',
    name: 'Getuk Lindri',
    category: 'Jajanan',
    tasteProfile: 'Manis',
    origin: 'Magelang',
    shortDescription: 'Olahan singkong manis warna-warni bertabur kelapa parut gurih.',
    history: 'Di masa penjajahan ketika beras sulit didapat, masyarakat Magelang mengolah singkong menjadi Getuk. Getuk Lindri kemudian dikembangkan dengan mesin giling yang membentuknya menyerupai mi panjang yang digulung, diberi warna cerah, dan ditaburi kelapa parut segar sebagai penyeimbang rasa manisnya.',
    ingredients: ['singkong', 'kelapa-parut', 'gula-pasir', 'gula-jawa', 'pandan'],
    galleryImages: ['/kuliner/gallery/sate_1.webp', '/kuliner/gallery/sate_2.webp']
  },
  {
    slug: 'bakpao',
    name: 'Kue Moho',
    category: 'Jajanan',
    tasteProfile: 'Manis',
    origin: 'Solo',
    shortDescription: 'Kudapan kukus menyerupai bakpao dengan rekahan di bagian atasnya.',
    history: 'Merupakan hasil akulturasi budaya Tionghoa dan Jawa di Solo. Kue Moho mirip dengan bakpao atau kue mangkok, namun teksturnya lebih padat dan biasanya diberi rona merah muda jambu. Dinamakan "moho" yang berarti merekah, melambangkan kebahagiaan dan rezeki yang mekar.',
    ingredients: ['tepung-terigu', 'gula-pasir', 'ragi', 'pewarna-alami'],
    galleryImages: ['/kuliner/gallery/sate_1.webp', '/kuliner/gallery/sate_2.webp']
  },
  {
    slug: 'lemper',
    name: 'Lemper Ayam',
    category: 'Jajanan',
    tasteProfile: 'Gurih',
    origin: 'Yogyakarta & Solo',
    shortDescription: 'Ketan gurih berisi suwiran ayam bumbu kemiri, dibungkus daun pisang.',
    history: 'Lemper sarat akan makna filosofis Jawa. Tekstur ketan yang lengket melambangkan persaudaraan (paseduluran) yang erat. Pada zaman kerajaan, lemper disajikan dalam upacara adat. Konon namanya singkatan dari "Yen dialem atimu ojo memper" (Jika dipuji hatimu jangan sombong).',
    ingredients: ['tepung-ketan', 'santan', 'daging-ayam', 'daun-pisang', 'bawang-merah', 'kemiri'],
    galleryImages: ['/kuliner/gallery/sate_1.webp', '/kuliner/gallery/sate_2.webp']
  },
  {
    slug: 'dawet-ayu',
    name: 'Dawet Ayu',
    category: 'Minuman',
    tasteProfile: 'Manis',
    origin: 'Banjarnegara',
    shortDescription: 'Minuman es segar dengan butiran dawet hijau pandan dan guyuran gula aren cair.',
    history: 'Berbeda dengan cendol, Dawet Ayu Banjarnegara terbuat dari tepung beras dan tepung gelang (sagu aren) yang dicampur ekstrak daun pandan asli, sehingga wanginya sangat khas. Dinamakan "Ayu" karena konon penjual dawet pertama di Banjarnegara adalah seorang wanita berparas cantik.',
    ingredients: ['tepung-beras', 'pandan', 'santan', 'gula-jawa'],
    galleryImages: ['/kuliner/gallery/sate_1.webp', '/kuliner/gallery/sate_2.webp']
  },
  
  // --- 15 TAMBAHAN KULINER NON-MASKOT ---
  {
    slug: 'lumpia',
    name: 'Lumpia Semarang',
    category: 'Jajanan',
    tasteProfile: 'Gurih',
    origin: 'Semarang',
    shortDescription: 'Gulungan kulit tipis renyah berisi rebung manis gurih, udang, dan telur.',
    history: 'Lumpia Semarang adalah mahakarya perpaduan budaya kuliner Tionghoa (Tjoa Thay Yoe) dan Jawa (Mbok Wasih). Keunikan utamanya terletak pada isian rebung (tunas bambu) yang dimasak perlahan hingga tidak berbau pesing, dipadukan dengan saus kental berbahan dasar bawang putih dan gula jawa.',
    ingredients: ['rebung', 'daging-ayam', 'udang', 'bawang-putih', 'kecap-manis', 'gula-jawa'],
    galleryImages: ['/kuliner/gallery/sate_1.webp', '/kuliner/gallery/sate_2.webp']
  },
  {
    slug: 'garang-asem',
    name: 'Garang Asem Ayam',
    category: 'Makanan Berat',
    tasteProfile: 'Segar',
    origin: 'Demak',
    shortDescription: 'Ayam kampung berbumbu asam pedas berkuah santan yang dikukus dalam daun pisang.',
    history: 'Lahir di Demak dan populer di pesisir utara Jawa. Garang asem dimasak tanpa proses penumisan. Ayam kampung mentah dicampur santan, belimbing wuluh (yang memberikan rasa asam segar "garang"), dan cabai utuh, lalu dibungkus tum daun pisang rapat dan dikukus berjam-jam hingga dagingnya lepas dari tulang.',
    ingredients: ['daging-ayam', 'santan', 'belimbing-wuluh', 'cabai-rawit', 'daun-pisang', 'bawang-merah'],
    galleryImages: ['/kuliner/gallery/sate_1.webp', '/kuliner/gallery/sate_2.webp']
  },
  {
    slug: 'serabi',
    name: 'Serabi Notosuman',
    category: 'Jajanan',
    tasteProfile: 'Manis',
    origin: 'Solo',
    shortDescription: 'Pancake tradisional khas Jawa yang tipis di pinggir namun lumer dan bersantan di tengah.',
    history: 'Serabi Notosuman telah ada sejak tahun 1923. Berbeda dengan serabi daerah lain yang dimakan menggunakan kuah kinca, serabi Solo langsung dicampur dengan gula dan santan tebal ke dalam adonannya saat dipanggang dalam cetakan tanah liat kecil, membuatnya legit secara instan.',
    ingredients: ['tepung-beras', 'santan', 'gula-pasir', 'pandan', 'daun-pisang'],
    galleryImages: ['/kuliner/gallery/sate_1.webp', '/kuliner/gallery/sate_2.webp']
  },
  {
    slug: 'tahu-petis',
    name: 'Tahu Petis',
    category: 'Jajanan',
    tasteProfile: 'Gurih',
    origin: 'Semarang',
    shortDescription: 'Tahu goreng renyah yang diisi dengan saus petis udang kental hitam manis.',
    history: 'Petis merupakan produk pesisir laut Jawa yang kaya rasa. Di Semarang, petis udang berkualitas yang dimasak dengan bawang putih dan gula merah diisikan ke dalam tahu pong (tahu kopong) yang baru saja digoreng panas. Tahu petis ini menjadi primadona kudapan malam.',
    ingredients: ['tahu', 'petis-udang', 'bawang-putih', 'cabai-rawit', 'gula-jawa'],
    galleryImages: ['/kuliner/gallery/sate_1.webp', '/kuliner/gallery/sate_2.webp']
  },
  {
    slug: 'wingko-babat',
    name: 'Wingko Babat',
    category: 'Jajanan',
    tasteProfile: 'Manis',
    origin: 'Semarang',
    shortDescription: 'Kue padat dan kenyal berbahan dasar kelapa muda parut dan tepung ketan panggang.',
    history: 'Meski sangat lekat sebagai oleh-oleh khas Semarang, kue ini sebenarnya berasal dari Babat, Lamongan, Jawa Timur. Wingko menjadi terkenal di Semarang karena para pedagang dari Babat bermigrasi dan menjualnya di sekitar stasiun kereta Tawang Semarang, menjadikannya ikon jajanan stasiun.',
    ingredients: ['tepung-ketan', 'kelapa-parut', 'gula-pasir', 'santan', 'telur'],
    galleryImages: ['/kuliner/gallery/sate_1.webp', '/kuliner/gallery/sate_2.webp']
  },
  {
    slug: 'tongseng',
    name: 'Tongseng Kambing',
    category: 'Makanan Berat',
    tasteProfile: 'Gurih',
    origin: 'Solo',
    shortDescription: 'Rebusan daging kambing berkuah santan kental dengan irisan tomat, kol, dan kecap manis.',
    history: 'Tongseng konon bermula dari kebiasaan pabrik gula di Jawa Tengah (era kolonial Belanda) yang menyebabkan pasokan gula dan kecap melimpah. Para pedagang sate di Solo menggunakan daging sisa sate dan merebusnya dalam kuah gulai, lalu dicampur kecap, kubis, dan lada.',
    ingredients: ['daging-kambing', 'kubis', 'tomat', 'kecap-manis', 'santan', 'cabai-rawit'],
    galleryImages: ['/kuliner/gallery/sate_1.webp', '/kuliner/gallery/sate_2.webp']
  },
  {
    slug: 'nasi-gandul',
    name: 'Nasi Gandul',
    category: 'Makanan Berat',
    tasteProfile: 'Gurih',
    origin: 'Pati',
    shortDescription: 'Nasi berkuah rempah kecoklatan disajikan di atas piring beralas daun pisang.',
    history: 'Nama "Gandul" berasal dari bahasa Jawa yang berarti menggantung. Pada zaman dahulu, penjual Nasi Gandul berkeliling menjajakan dagangannya menggunakan pikulan bambu yang bergoyang (menggantung/gandul) di bahu. Nasi ini dihidangkan dengan potongan empal sapi dan kuah hangat kental.',
    ingredients: ['daging-sapi', 'santan', 'bawang-merah', 'kecap-manis', 'daun-pisang'],
    galleryImages: ['/kuliner/gallery/sate_1.webp', '/kuliner/gallery/sate_2.webp']
  },
  {
    slug: 'mangut-lele',
    name: 'Mangut Lele',
    category: 'Makanan Berat',
    tasteProfile: 'Pedas',
    origin: 'Magelang',
    shortDescription: 'Ikan lele asap yang dimasak dalam kuah santan kuning yang sangat pedas.',
    history: 'Lele yang digunakan pada Mangut asli bukanlah lele goreng, melainkan lele yang diasap berjam-jam menggunakan batok kelapa. Proses pengasapan ini memberikan aroma *smokey* yang khas saat dimasak perlahan di dalam bumbu santan kuning cabai rawit setan yang super pedas.',
    ingredients: ['ikan-lele', 'santan', 'cabai-rawit', 'bawang-merah', 'kemiri'],
    galleryImages: ['/kuliner/gallery/sate_1.webp', '/kuliner/gallery/sate_2.webp']
  },
  {
    slug: 'tengkleng',
    name: 'Tengkleng Solo',
    category: 'Makanan Berat',
    tasteProfile: 'Gurih',
    origin: 'Solo',
    shortDescription: 'Sup iga dan tulang kambing berkuah kuning encer kaya rempah, tanpa santan yang kental.',
    history: 'Tengkleng lahir dari masa sulit penjajahan. Kala itu daging kambing (sate/gulai) hanya dinikmati oleh para priyayi dan orang Belanda. Kaum pribumi akhirnya memasak sisa-sisa tulang dan iga yang hanya menyisakan sedikit daging, menghasilkan sup tulang segar berkuah ringan yang legendaris.',
    ingredients: ['tulang-kambing', 'bawang-merah', 'bawang-putih', 'kunyit', 'serai'],
    galleryImages: ['/kuliner/gallery/sate_1.webp', '/kuliner/gallery/sate_2.webp']
  },
  {
    slug: 'sate-buntel',
    name: 'Sate Buntel',
    category: 'Makanan Berat',
    tasteProfile: 'Manis',
    origin: 'Solo',
    shortDescription: 'Daging kambing cincang yang dibungkus (dibuntel) dengan lemak tipis lalu dibakar.',
    history: 'Sate Buntel merupakan inovasi pedagang Tionghoa-Jawa di Surakarta. Daging cincang dicampur lada dan bawang merah, lalu "dibuntel" (dibungkus) rapat menggunakan *caul fat* (lemak jala kambing) agar saat dibakar sarinya tidak hilang dan bumbunya terkunci sempurna.',
    ingredients: ['daging-kambing', 'bawang-merah', 'kecap-manis', 'merica', 'lemak-jala'],
    galleryImages: ['/kuliner/gallery/sate_1.webp', '/kuliner/gallery/sate_2.webp']
  },
  {
    slug: 'tahu-gimbal',
    name: 'Tahu Gimbal',
    category: 'Makanan Berat',
    tasteProfile: 'Gurih',
    origin: 'Semarang',
    shortDescription: 'Campuran tahu goreng, rajangan kol, lontong, dan bakwan udang bersiram bumbu kacang petis.',
    history: 'Berasal dari Semarang, kata "Gimbal" bukan merujuk pada rambut, melainkan nama lain dari bakwan udang (udang goreng tepung yang tidak beraturan bentuknya). Tahu Gimbal disajikan dengan bumbu kacang encer bercampur petis udang, memberikan perpaduan rasa manis, gurih, dan legit.',
    ingredients: ['tahu', 'udang', 'kacang-tanah', 'petis-udang', 'toge', 'kubis'],
    galleryImages: ['/kuliner/gallery/sate_1.webp', '/kuliner/gallery/sate_2.webp']
  },
  {
    slug: 'es-gempol',
    name: 'Es Gempol Pleret',
    category: 'Minuman',
    tasteProfile: 'Manis',
    origin: 'Jepara',
    shortDescription: 'Es santan dengan isian gempol (bulatan tepung beras) dan pleret (adon tepung pipih merah).',
    history: 'Es tradisional ini sangat populer di Semarang dan Jepara. Gempol adalah bola-bola putih dari tepung beras, sementara pleret adalah adonan gula aren dan tepung yang dipipihkan (diplintir/dipleret) sehingga bertekstur kenyal manis. Disajikan dingin dengan kuah santan dan sirup gula.',
    ingredients: ['tepung-beras', 'santan', 'gula-jawa', 'gula-pasir', 'pewarna-alami'],
    galleryImages: ['/kuliner/gallery/sate_1.webp', '/kuliner/gallery/sate_2.webp']
  },
  {
    slug: 'mie-ongklok',
    name: 'Mie Ongklok',
    category: 'Makanan Berat',
    tasteProfile: 'Gurih',
    origin: 'Wonosobo',
    shortDescription: 'Mie kuning rebus dengan kuah kental berbahan pati, disajikan bersama sate sapi dan tempe kemul.',
    history: 'Lahir di udara dingin pegunungan Dieng, Wonosobo. "Ongklok" adalah keranjang anyaman bambu kecil untuk merebus mi. Kuahnya dibuat kental menggunakan campuran pati singkong dan gula jawa, sangat nikmat disantap panas-panas untuk melawan dinginnya udara gunung.',
    ingredients: ['mie-kuning', 'tepung-tapioka', 'gula-jawa', 'bawang-merah', 'kol'],
    galleryImages: ['/kuliner/gallery/sate_1.webp', '/kuliner/gallery/sate_2.webp']
  },
  {
    slug: 'carica',
    name: 'Manisan Carica',
    category: 'Minuman',
    tasteProfile: 'Segar',
    origin: 'Wonosobo',
    shortDescription: 'Manisan pepaya gunung mungil dalam kuah sirup yang asam segar.',
    history: 'Carica adalah kerabat dekat pepaya yang konon hanya bisa tumbuh dan berbuah maksimal di dataran tinggi Dieng (Wonosobo). Daging buahnya bertekstur lebih kenyal dan bijinya diolah menjadi sirup kental yang asam segar, menciptakan pencuci mulut yang sangat menyegarkan.',
    ingredients: ['buah-carica', 'gula-pasir', 'air'],
    galleryImages: ['/kuliner/gallery/sate_1.webp', '/kuliner/gallery/sate_2.webp']
  },
  {
    slug: 'nasi-grombyang',
    name: 'Nasi Grombyang',
    category: 'Makanan Berat',
    tasteProfile: 'Gurih',
    origin: 'Pemalang',
    shortDescription: 'Nasi campur daging kerbau dengan kuah kaldu rempah melimpah kluwek yang bergoyang-goyang.',
    history: 'Nama "Grombyang" berasal dari penampilannya saat disajikan: porsinya diisi kuah dalam jumlah sangat banyak hingga hampir tumpah dan bergoyang-goyang (grombyang-grombyang). Menggunakan keluak (kluwek) dan daging kerbau sebagai identitas kuliner pesisir Jawa Tengah.',
    ingredients: ['daging-kerbau', 'kluwek', 'bawang-merah', 'bawang-putih', 'kelapa-parut'],
    galleryImages: ['/kuliner/gallery/sate_1.webp', '/kuliner/gallery/sate_2.webp']
  }
];
