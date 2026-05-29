export type CookingAction = 'potong' | 'haluskan' | 'tumis' | 'rebus' | 'bakar' | 'goreng' | 'kukus' | 'campur' | 'sajikan' | 'tuang';

export interface CookingStep {
  action: CookingAction;
  description: string;
}

export interface KulinerItem {
  slug: string;
  name: string;
  category: "Makanan Berat" | "Jajanan" | "Minuman";
  tasteProfile: "Manis" | "Gurih" | "Pedas" | "Segar";
  origin: string;
  shortDescription: string;
  history: string;
  ingredients: string[];
  instructions: CookingStep[];
  galleryImages: string[];
  locationImage?: string;
}

export const kulinerData: KulinerItem[] = [
  {
    slug: 'bakso',
    name: 'Bakso Wonogiri',
    category: 'Makanan Berat',
    tasteProfile: 'Gurih',
    origin: 'Wonogiri',
    locationImage: 'https://images.unsplash.com/photo-1531093121516-7d6365a28c2e?q=80&w=400',
    shortDescription: 'Bola daging kenyal dengan kuah kaldu sapi pekat yang menghangatkan suasana.',
    history: 'Bakso Wonogiri memiliki ciri khas kuah kaldu sapi yang sangat bening namun kaya rempah. Sejarahnya berawal dari para perantau asal Wonogiri yang memodifikasi resep bakso Tionghoa dengan cita rasa lokal Jawa, menggunakan lebih banyak lada dan bawang putih goreng yang ditumbuk bersama kaldu.',
    ingredients: ['daging-merah', 'bawang', 'tepung'],
    instructions: [
      { action: 'potong', description: 'Potong kasar daging sapi segar agar mudah masuk ke penggilingan.' },
      { action: 'haluskan', description: 'Haluskan daging sapi bersama es batu, garam, dan bawang putih goreng.' },
      { action: 'campur', description: 'Campurkan daging halus dengan sedikit tepung tapioka hingga adonan kalis, lalu bentuk bulat.' },
      { action: 'rebus', description: 'Rebus bola daging dan tulang sapi besar untuk menghasilkan kaldu yang jernih dan berkaldu kuat.' },
      { action: 'sajikan', description: 'Sajikan bakso panas dengan mi, seledri, dan taburan bawang merah goreng.' }
    ],
    galleryImages: ['/kuliner/gallery/bakso_1.webp', '/kuliner/gallery/bakso_2.webp', '/kuliner/gallery/bakso_3.webp']
  },
  {
    slug: 'nasi-liwet',
    name: 'Nasi Liwet Solo',
    category: 'Makanan Berat',
    tasteProfile: 'Gurih',
    origin: 'Solo',
    locationImage: 'https://images.unsplash.com/photo-1588668211190-2bb929cb1ce1?q=80&w=400',
    shortDescription: 'Nasi gurih bersantan yang disajikan dengan suwiran ayam, areh, dan labu siam.',
    history: 'Nasi Liwet merupakan pusaka kuliner dari kota Solo. Proses memasaknya ("ngliwet") menggunakan santan kelapa murni yang dimasak perlahan di atas tungku kayu bakar. Makanan ini dulunya merupakan sajian keraton yang akhirnya turun menjadi makanan merakyat yang bisa dinikmati di sepanjang jalan kota Surakarta pada malam hari.',
    ingredients: ['santan', 'daging-ayam', 'bawang', 'rempah-daun', 'daun-pisang'],
    instructions: [
      { action: 'haluskan', description: 'Haluskan bawang merah, bawang putih, dan sedikit ketumbar untuk bumbu ayam.' },
      { action: 'kukus', description: 'Kukus beras setengah matang, lalu aroni dengan santan, daun salam, dan serai.' },
      { action: 'rebus', description: 'Rebus ayam kampung utuh dengan bumbu hingga sangat empuk, lalu suwir-suwir.' },
      { action: 'tumis', description: 'Tumis irisan labu siam dengan cabai rawit utuh hingga layu dan pedas.' },
      { action: 'sajikan', description: 'Sajikan nasi di pincuk daun pisang, beri suwiran ayam, sayur labu, dan siram areh santan.' }
    ],
    galleryImages: ['/kuliner/gallery/nasi-liwet_1.webp', '/kuliner/gallery/nasi-liwet_2.webp', '/kuliner/gallery/nasi-liwet_3.webp']
  },
  {
    slug: 'sate',
    name: 'Sate Ayam Blora',
    category: 'Makanan Berat',
    tasteProfile: 'Manis',
    origin: 'Blora',
    locationImage: 'https://images.unsplash.com/photo-1501179691627-eeaa65ea017c?q=80&w=400',
    shortDescription: 'Sate ayam kampung empuk bersiram bumbu kacang kental yang legit.',
    history: 'Berbeda dengan sate Madura, Sate Blora menggunakan ayam kampung yang teksturnya lebih liat namun gurih. Keunikannya terletak pada bumbu kacangnya yang sangat halus dan disajikan bersama kuah lodeh tempe. Tradisi menyantap sate di Blora adalah "makan dulu, hitung tusuknya belakangan".',
    ingredients: ['daging-ayam', 'kacang', 'saus-hitam', 'bawang', 'gula-merah'],
    instructions: [
      { action: 'potong', description: 'Potong daging ayam kampung bentuk dadu presisi, lalu tusuk dengan lidi bambu rapi.' },
      { action: 'haluskan', description: 'Haluskan kacang tanah goreng bersama bawang merah goreng dan gula jawa hingga menjadi pasta.' },
      { action: 'rebus', description: 'Rebus bumbu kacang halus dengan sedikit air hingga mengeluarkan minyak alaminya.' },
      { action: 'bakar', description: 'Celupkan sate ke bumbu cair, lalu bakar di atas bara arang hingga matang beraroma asap.' },
      { action: 'sajikan', description: 'Sajikan sate dengan siraman saus kacang kental, kecap manis, dan semangkuk lodeh lompong.' }
    ],
    galleryImages: ['/kuliner/gallery/sate_1.webp', '/kuliner/gallery/sate_2.webp', '/kuliner/gallery/sate_3.webp']
  },
  {
    slug: 'kue-lapis',
    name: 'Kue Lapis Jongkong',
    category: 'Jajanan',
    tasteProfile: 'Manis',
    origin: 'Semarang',
    locationImage: 'https://images.unsplash.com/photo-1516104880521-026040825cbb?q=80&w=400',
    shortDescription: 'Jajanan lapis kenyal dua warna dengan aroma pandan yang wangi menenangkan.',
    history: 'Kue Lapis menjadi lambang ikatan yang erat dan kesabaran, mengingat proses pembuatannya yang harus dikukus selapis demi selapis. Aroma pandan suji dan santan kelapa mendominasi kue basah yang kerap hadir dalam setiap perayaan syukuran masyarakat Jawa Tengah ini.',
    ingredients: ['tepung', 'santan', 'gula-pasir', 'rempah-daun'],
    instructions: [
      { action: 'haluskan', description: 'Haluskan daun pandan dan daun suji, lalu peras untuk mengambil sari air hijaunya.' },
      { action: 'campur', description: 'Campurkan tepung beras, tapioka, santan kelapa, dan gula pasir hingga larut rata.' },
      { action: 'tuang', description: 'Bagi adonan, beri warna hijau pandan pada setengah adonan, dan biarkan putih pada setengah lainnya.' },
      { action: 'kukus', description: 'Kukus selapis adonan hijau, tunggu 5 menit, tumpuk lapis adonan putih, dan ulangi hingga loyang penuh.' },
      { action: 'potong', description: 'Dinginkan kue lapis hingga mengeras kenyal, potong dengan pisau berbalut plastik agar tidak lengket.' }
    ],
    galleryImages: ['/kuliner/gallery/kue-lapis_1.webp', '/kuliner/gallery/kue-lapis_2.webp', '/kuliner/gallery/kue-lapis_3.webp']
  },
  {
    slug: 'tempe-goreng',
    name: 'Tempe Mendoan',
    category: 'Jajanan',
    tasteProfile: 'Gurih',
    origin: 'Banyumas',
    locationImage: 'https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?q=80&w=400',
    shortDescription: 'Tempe berbalut tepung setengah matang yang disajikan panas bersama cabai rawit.',
    history: 'Mendoan berasal dari kata "Mendo" yang dalam dialek Banyumasan berarti setengah matang atau lembek. Tempe mendoan tidak digoreng hingga garing, melainkan hanya sebentar di dalam minyak panas, menghasilkan tekstur layu (mendo) yang justru menjadi primadona kuliner di daerah Purwokerto dan sekitarnya.',
    ingredients: ['kedelai', 'tepung', 'bawang', 'sayuran', 'cabai'],
    instructions: [
      { action: 'potong', description: 'Potong tempe mendoan menjadi lembaran sangat tipis dan lebar. Iris halus daun bawang.' },
      { action: 'haluskan', description: 'Ulek bawang putih, ketumbar sangrai, kemiri, dan garam hingga menjadi bumbu dasar tepung.' },
      { action: 'campur', description: 'Buat adonan pas cairan dengan tepung beras, bumbu ulek, air, dan taburan daun bawang.' },
      { action: 'goreng', description: 'Celupkan tempe satu per satu, goreng cepat dalam minyak sangat panas agar luar matang tapi dalam layu.' },
      { action: 'sajikan', description: 'Angkat saat tepung masih putih (mendo). Sajikan segera dengan cabai rawit hijau utuh atau kecap pedas.' }
    ],
    galleryImages: ['/kuliner/gallery/tempe-goreng_1.webp', '/kuliner/gallery/tempe-goreng_2.webp', '/kuliner/gallery/tempe-goreng_3.webp']
  },
  {
    slug: 'soto',
    name: 'Soto Kudus',
    category: 'Makanan Berat',
    tasteProfile: 'Segar',
    origin: 'Kudus',
    locationImage: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?q=80&w=400',
    shortDescription: 'Soto kaldu bening dengan daging kerbau atau ayam, disajikan di mangkuk keramik kecil.',
    history: 'Soto Kudus memiliki sejarah toleransi beragama yang kuat. Sunan Kudus mengajarkan pengikutnya untuk tidak memotong sapi sebagai bentuk penghormatan kepada umat Hindu kala itu. Sebagai gantinya, Soto Kudus otentik menggunakan daging kerbau, disajikan dalam mangkuk mungil dengan taburan bawang putih goreng.',
    ingredients: ['daging-ayam', 'bawang', 'rempah-daun', 'sayuran'],
    instructions: [
      { action: 'potong', description: 'Potong ayam atau daging kerbau, bersihkan lemaknya agar kuah soto tetap bening saat direbus.' },
      { action: 'rebus', description: 'Rebus daging perlahan dengan api kecil untuk menciptakan kaldu bening yang sarat sari daging.' },
      { action: 'haluskan', description: 'Haluskan bawang merah, putih, dan kemiri, kemudian tumis bersama serai dan daun jeruk.' },
      { action: 'campur', description: 'Masukkan bumbu tumis ke dalam panci kaldu, didihkan sebentar lalu angkat daging untuk disuwir.' },
      { action: 'sajikan', description: 'Sajikan soto di mangkuk kecil dengan nasi, suwiran ayam, taoge renyah, dan taburan bawang putih goreng.' }
    ],
    galleryImages: ['/kuliner/gallery/soto_1.webp', '/kuliner/gallery/soto_2.webp', '/kuliner/gallery/soto_3.webp']
  },
  {
    slug: 'jajanan-pasar',
    name: 'Getuk Lindri',
    category: 'Jajanan',
    tasteProfile: 'Manis',
    origin: 'Magelang',
    locationImage: 'https://images.unsplash.com/photo-1588668211190-2bb929cb1ce1?q=80&w=400',
    shortDescription: 'Olahan singkong manis warna-warni bertabur kelapa parut gurih.',
    history: 'Di masa penjajahan ketika beras sulit didapat, masyarakat Magelang mengolah singkong menjadi Getuk. Getuk Lindri kemudian dikembangkan dengan mesin giling yang membentuknya menyerupai mi panjang yang digulung, diberi warna cerah, dan ditaburi kelapa parut segar sebagai penyeimbang rasa manisnya.',
    ingredients: ['umbi-buah', 'kelapa-parut', 'gula-pasir', 'gula-merah', 'rempah-daun'],
    instructions: [
      { action: 'potong', description: 'Kupas bersih singkong, buang sumbu tengahnya, dan potong kecil-kecil agar cepat empuk.' },
      { action: 'kukus', description: 'Kukus singkong tersebut hingga sangat empuk dan merekah bersama beberapa lembar pandan.' },
      { action: 'haluskan', description: 'Selagi masih panas mengepul, tumbuk singkong hingga halus bersama gula pasir dan mentega.' },
      { action: 'campur', description: 'Bagi adonan menjadi beberapa warna cerah, giling dengan cetakan lindri menyerupai helaian mi tebal.' },
      { action: 'sajikan', description: 'Gulung perlahan adonan mi tersebut, sajikan hangat dengan taburan parutan kelapa muda kukus.' }
    ],
    galleryImages: ['/kuliner/gallery/jajanan-pasar_1.webp', '/kuliner/gallery/jajanan-pasar_2.webp', '/kuliner/gallery/jajanan-pasar_3.webp']
  },
  {
    slug: 'bakpao',
    name: 'Kue Moho',
    category: 'Jajanan',
    tasteProfile: 'Manis',
    origin: 'Solo',
    locationImage: 'https://images.unsplash.com/photo-1588668211190-2bb929cb1ce1?q=80&w=400',
    shortDescription: 'Kudapan kukus menyerupai bakpao dengan rekahan di bagian atasnya.',
    history: 'Merupakan hasil akulturasi budaya Tionghoa dan Jawa di Solo. Kue Moho mirip dengan bakpao atau kue mangkok, namun teksturnya lebih padat dan biasanya diberi rona merah muda jambu. Dinamakan "moho" yang berarti merekah, melambangkan kebahagiaan dan rezeki yang mekar.',
    ingredients: ['tepung', 'gula-pasir'],
    instructions: [
      { action: 'haluskan', description: 'Haluskan gula pasir jika perlu, aktifkan ragi dengan air hangat dan sedikit gula.' },
      { action: 'campur', description: 'Campurkan tepung terigu, larutan ragi, dan santan hangat. Uleni adonan hingga kalis dan lembut.' },
      { action: 'tuang', description: 'Tutup adonan basah dengan kain, diamkan 1 jam hingga mengembang dua kali lipat.' },
      { action: 'kukus', description: 'Bentuk membulat di dalam kertas mangkok, kukus di atas dandang uap besar agar merekah (moho).' },
      { action: 'sajikan', description: 'Sajikan kue hangat-hangat di pagi hari. Tekstur mekar melambangkan melebarnya rezeki.' }
    ],
    galleryImages: ['/kuliner/gallery/bakpao_1.webp', '/kuliner/gallery/bakpao_2.webp', '/kuliner/gallery/bakpao_3.webp']
  },
  {
    slug: 'lemper',
    name: 'Lemper Ayam',
    category: 'Jajanan',
    tasteProfile: 'Gurih',
    origin: 'Solo',
    locationImage: 'https://images.unsplash.com/photo-1588668211190-2bb929cb1ce1?q=80&w=400',
    shortDescription: 'Ketan gurih berisi suwiran ayam bumbu kemiri, dibungkus daun pisang.',
    history: 'Lemper sarat akan makna filosofis Jawa. Tekstur ketan yang lengket melambangkan persaudaraan (paseduluran) yang erat. Pada zaman kerajaan, lemper disajikan dalam upacara adat. Konon namanya singkatan dari "Yen dialem atimu ojo memper" (Jika dipuji hatimu jangan sombong).',
    ingredients: ['tepung', 'santan', 'daging-ayam', 'daun-pisang', 'bawang', 'rempah-biji'],
    instructions: [
      { action: 'haluskan', description: 'Haluskan bawang merah, bawang putih, kemiri, dan ketumbar untuk bumbu ayam isian.' },
      { action: 'kukus', description: 'Kukus ketan setengah matang, siram dengan santan panas, aduk rata lalu kukus kembali hingga pulen sempurna.' },
      { action: 'tumis', description: 'Tumis bumbu halus, masukkan suwiran ayam rebus rebusan, masak hingga ayam mengering dan menyerap bumbu.' },
      { action: 'campur', description: 'Ambil ketan hangat, pipihkan, letakkan ayam di tengah, bulatkan hingga padat dan menempel kuat.' },
      { action: 'bakar', description: 'Bungkus ketan rapat dengan daun pisang, panggang/bakar sebentar permukaannya untuk mengeluarkan aroma daun.' }
    ],
    galleryImages: ['/kuliner/gallery/lemper_1.webp', '/kuliner/gallery/lemper_2.webp', '/kuliner/gallery/lemper_3.webp']
  },
  {
    slug: 'dawet-ayu',
    name: 'Dawet Ayu',
    category: 'Minuman',
    tasteProfile: 'Manis',
    origin: 'Banjarnegara',
    locationImage: 'https://images.unsplash.com/photo-1531093121516-7d6365a28c2e?q=80&w=400',
    shortDescription: 'Minuman es segar dengan butiran dawet hijau pandan dan guyuran gula aren cair.',
    history: 'Berbeda dengan cendol, Dawet Ayu Banjarnegara terbuat dari tepung beras dan tepung gelang (sagu aren) yang dicampur ekstrak daun pandan asli, sehingga wanginya sangat khas. Dinamakan "Ayu" karena konon penjual dawet pertama di Banjarnegara adalah seorang wanita berparas cantik.',
    ingredients: ['tepung', 'rempah-daun', 'santan', 'gula-merah'],
    instructions: [
      { action: 'haluskan', description: 'Haluskan daun pandan dan suji dengan blender lalu saring untuk mengambil sarinya.' },
      { action: 'campur', description: 'Larutkan tepung beras dan sagu aren ke dalam sari pandan hingga tidak ada yang menggumpal.' },
      { action: 'rebus', description: 'Masak adonan tepung perlahan di atas api, aduk tanpa henti hingga adonan kental, mengkilat, dan meletup.' },
      { action: 'potong', description: 'Cetak dawet menembus saringan kawat ke dalam baskom berisi air es dingin agar teksturnya mengunci kenyal.' },
      { action: 'tuang', description: 'Tuang dawet ke gelas, tambahkan es batu, siram dengan santan segar dan kinca gula jawa leleh.' }
    ],
    galleryImages: ['/kuliner/gallery/dawet-ayu_1.webp', '/kuliner/gallery/dawet-ayu_2.webp', '/kuliner/gallery/dawet-ayu_3.webp']
  },
  {
    slug: 'lumpia',
    name: 'Lumpia Semarang',
    category: 'Jajanan',
    tasteProfile: 'Gurih',
    origin: 'Semarang',
    locationImage: 'https://images.unsplash.com/photo-1516104880521-026040825cbb?q=80&w=400',
    shortDescription: 'Gulungan kulit tipis renyah berisi rebung manis gurih, udang, dan telur.',
    history: 'Lumpia Semarang adalah mahakarya perpaduan budaya kuliner Tionghoa (Tjoa Thay Yoe) dan Jawa (Mbok Wasih). Keunikan utamanya terletak pada isian rebung (tunas bambu) yang dimasak perlahan hingga tidak berbau pesing, dipadukan dengan saus kental berbahan dasar bawang putih dan gula jawa.',
    ingredients: ['umbi-buah', 'daging-ayam', 'seafood', 'bawang', 'saus-hitam', 'gula-merah'],
    instructions: [
      { action: 'potong', description: 'Potong rebung menjadi batang korek api yang sangat kecil, cuci berkali-kali untuk menghilangkan pesingnya.' },
      { action: 'rebus', description: 'Rebus potongan rebung sebentar dalam air mendidih untuk menetralisir rasa getir tanah.' },
      { action: 'tumis', description: 'Tumis bawang putih, ebi, ayam cincang, dan rebung dengan kecap manis hingga bumbu meresap kering.' },
      { action: 'campur', description: 'Letakkan isian memanjang di atas kulit lumpia tipis, lipat rapat dan rekatkan tepinya dengan olesan putih telur.' },
      { action: 'goreng', description: 'Goreng di minyak panas terendam hingga kuning keemasan. Sajikan hangat dengan saus kental bawang putih.' }
    ],
    galleryImages: ['/kuliner/gallery/lumpia_1.webp', '/kuliner/gallery/lumpia_2.webp', '/kuliner/gallery/lumpia_3.webp']
  },
  {
    slug: 'garang-asem',
    name: 'Garang Asem Ayam',
    category: 'Makanan Berat',
    tasteProfile: 'Segar',
    origin: 'Demak',
    locationImage: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?q=80&w=400',
    shortDescription: 'Ayam kampung berbumbu asam pedas berkuah santan yang dikukus dalam daun pisang.',
    history: 'Lahir di Demak dan populer di pesisir utara Jawa. Garang asem dimasak tanpa proses penumisan. Ayam kampung mentah dicampur santan, belimbing wuluh (yang memberikan rasa asam segar "garang"), dan cabai utuh, lalu dibungkus tum daun pisang rapat dan dikukus berjam-jam hingga dagingnya lepas dari tulang.',
    ingredients: ['daging-ayam', 'santan', 'sayuran', 'cabai', 'daun-pisang', 'bawang'],
    instructions: [
      { action: 'potong', description: 'Potong ayam kampung muda menjadi banyak bagian kecil. Potong-potong bulat tomat hijau dan belimbing wuluh.' },
      { action: 'haluskan', description: 'Iris tipis bawang merah dan bawang putih (tidak diulek) agar rasa kuahnya *light* dan *clear*.' },
      { action: 'campur', description: 'Campurkan ayam mentah dengan irisan bumbu, belimbing wuluh, cabai rawit setan utuh, dan santan encer segar.' },
      { action: 'tuang', description: 'Pindahkan adonan ayam berkuah ke dalam beberapa rangkap daun pisang, jepit rapat membentuk tum.' },
      { action: 'kukus', description: 'Kukus bungkusan daun perlahan selama 1,5 hingga 2 jam hingga bumbu meresap dan ayam lepas dari tulang.' }
    ],
    galleryImages: ['/kuliner/gallery/garang-asem_1.webp', '/kuliner/gallery/garang-asem_2.webp', '/kuliner/gallery/garang-asem_3.webp']
  },
  {
    slug: 'serabi',
    name: 'Serabi Notosuman',
    category: 'Jajanan',
    tasteProfile: 'Manis',
    origin: 'Solo',
    locationImage: 'https://images.unsplash.com/photo-1588668211190-2bb929cb1ce1?q=80&w=400',
    shortDescription: 'Pancake tradisional khas Jawa yang tipis di pinggir namun lumer dan bersantan di tengah.',
    history: 'Serabi Notosuman telah ada sejak tahun 1923. Berbeda dengan serabi daerah lain yang dimakan menggunakan kuah kinca, serabi Solo langsung dicampur dengan gula dan santan tebal ke dalam adonannya saat dipanggang dalam cetakan tanah liat kecil, membuatnya legit secara instan.',
    ingredients: ['tepung', 'santan', 'gula-pasir', 'rempah-daun', 'daun-pisang'],
    instructions: [
      { action: 'haluskan', description: 'Tumbuk beras berkualitas yang telah direndam semalaman menjadi tepung beras basah yang segar.' },
      { action: 'campur', description: 'Campurkan tepung basah dengan gula, garam, dan santan encer. Pukul-pukul adonan agar memasukkan banyak udara.' },
      { action: 'tuang', description: 'Tuangkan satu sendok sayur adonan ke wajan tanah liat super panas, ratakan memutar membentuk pinggiran renyah.' },
      { action: 'bakar', description: 'Tunggu hingga bagian tengah bersarang lubang-lubang. Beri tambahan santan areh kental di tengah, lalu tutup arang.' },
      { action: 'sajikan', description: 'Cungkil serabi dengan hati-hati, gulung panas-panas menggunakan balutan daun pisang agar lumer.' }
    ],
    galleryImages: ['/kuliner/gallery/serabi_1.webp', '/kuliner/gallery/serabi_2.webp', '/kuliner/gallery/serabi_3.webp']
  },
  {
    slug: 'tahu-petis',
    name: 'Tahu Petis',
    category: 'Jajanan',
    tasteProfile: 'Pedas',
    origin: 'Semarang',
    locationImage: 'https://images.unsplash.com/photo-1516104880521-026040825cbb?q=80&w=400',
    shortDescription: 'Tahu goreng renyah yang diisi dengan saus petis udang kental hitam manis.',
    history: 'Petis merupakan produk pesisir laut Jawa yang kaya rasa. Di Semarang, petis udang berkualitas yang dimasak dengan bawang putih dan gula merah diisikan ke dalam tahu pong (tahu kopong) yang baru saja digoreng panas. Tahu petis ini menjadi primadona kudapan malam.',
    ingredients: ['kedelai', 'saus-hitam', 'bawang', 'cabai', 'gula-merah'],
    instructions: [
      { action: 'potong', description: 'Pilih tahu putih jenis padat lalu rendam sebentar dengan air garam dan bawang putih.' },
      { action: 'goreng', description: 'Goreng tahu terendam dalam minyak panas sampai berkulit tebal, berongga (kopong), dan renyah luar.' },
      { action: 'haluskan', description: 'Ulek bawang putih dan cabai rawit hingga lembut untuk memberikan efek pedas aromatik.' },
      { action: 'tumis', description: 'Tumis bumbu halus sebentar, tuang petis udang berkualitas, air, dan gula jawa. Masak hingga bertekstur pasta kental.' },
      { action: 'sajikan', description: 'Belah satu sisi pinggir tahu selagi panas, sodok atau oleskan isian petis hitam manis ke rongga tahunya.' }
    ],
    galleryImages: ['/kuliner/gallery/tahu-petis_1.webp', '/kuliner/gallery/tahu-petis_2.webp', '/kuliner/gallery/tahu-petis_3.webp']
  },
  {
    slug: 'wingko-babat',
    name: 'Wingko Babat',
    category: 'Jajanan',
    tasteProfile: 'Manis',
    origin: 'Semarang',
    locationImage: 'https://images.unsplash.com/photo-1516104880521-026040825cbb?q=80&w=400',
    shortDescription: 'Kue padat dan kenyal berbahan dasar kelapa muda parut dan tepung ketan panggang.',
    history: 'Meski sangat lekat sebagai oleh-oleh khas Semarang, kue ini sebenarnya berasal dari Babat, Lamongan, Jawa Timur. Wingko menjadi terkenal di Semarang karena para pedagang dari Babat bermigrasi dan menjualnya di sekitar stasiun kereta Tawang Semarang, menjadikannya ikon jajanan stasiun.',
    ingredients: ['tepung', 'kelapa-parut', 'gula-pasir', 'santan', 'telur'],
    instructions: [
      { action: 'haluskan', description: 'Parut daging kelapa yang tidak terlalu tua (setengah baya) membentuk helaian panjang searah.' },
      { action: 'campur', description: 'Campurkan tepung ketan, parutan kelapa, gula, dan sedikit santan hangat. Uleni ringan dengan ujung jari.' },
      { action: 'tuang', description: 'Letakkan adonan ke dalam loyang tipis atau langsung cetak bundar kecil secara merata tanpa ditekan terlalu keras.' },
      { action: 'bakar', description: 'Panggang di atas wajan tembaga berdada datar dengan api sangat kecil, bolak-balik hingga permukaan kecoklatan gosong manis.' },
      { action: 'sajikan', description: 'Angkat saat minyak kelapa menetes wangi. Potong dan kemas dalam balutan kertas roti putih.' }
    ],
    galleryImages: ['/kuliner/gallery/wingko-babat_1.webp', '/kuliner/gallery/wingko-babat_2.webp', '/kuliner/gallery/wingko-babat_3.webp']
  },
  {
    slug: 'tongseng',
    name: 'Tongseng Kambing',
    category: 'Makanan Berat',
    tasteProfile: 'Gurih',
    origin: 'Solo',
    locationImage: 'https://images.unsplash.com/photo-1588668211190-2bb929cb1ce1?q=80&w=400',
    shortDescription: 'Rebusan daging kambing berkuah santan kental dengan irisan tomat, kol, dan kecap manis.',
    history: 'Tongseng konon bermula dari kebiasaan pabrik gula di Jawa Tengah (era kolonial Belanda) yang menyebabkan pasokan gula dan kecap melimpah. Para pedagang sate di Solo menggunakan daging sisa sate dan merebusnya dalam kuah gulai, lalu dicampur kecap, kubis, dan lada.',
    ingredients: ['daging-merah', 'sayuran', 'saus-hitam', 'santan', 'cabai'],
    instructions: [
      { action: 'potong', description: 'Potong kecil-kecil sisa daging sate kambing. Iris tebal lembaran kubis (kol) dan tomat segar merah.' },
      { action: 'haluskan', description: 'Haluskan bumbu halus dasar beraroma (bawang merah, putih, lada, ketumbar, jahe).' },
      { action: 'tumis', description: 'Tumis bumbu halus hingga berminyak, masukkan potongan daging kambing mentah, aduk merata menyerap.' },
      { action: 'tuang', description: 'Guyur dengan kuah gulai santan cair dari tungku terpisah. Tambahkan kecap manis legendaris.' },
      { action: 'campur', description: 'Sesaat sebelum diangkat mematikan api, masukkan kol dan cabai utuh agar layu namun teksturnya tetap krispi.' }
    ],
    galleryImages: ['/kuliner/gallery/tongseng_1.webp', '/kuliner/gallery/tongseng_2.webp', '/kuliner/gallery/tongseng_3.webp']
  },
  {
    slug: 'nasi-gandul',
    name: 'Nasi Gandul',
    category: 'Makanan Berat',
    tasteProfile: 'Gurih',
    origin: 'Pati',
    locationImage: 'https://images.unsplash.com/photo-1501179691627-eeaa65ea017c?q=80&w=400',
    shortDescription: 'Nasi berkuah rempah kecoklatan disajikan di atas piring beralas daun pisang.',
    history: 'Nama "Gandul" berasal dari bahasa Jawa yang berarti menggantung. Pada zaman dahulu, penjual Nasi Gandul berkeliling menjajakan dagangannya menggunakan pikulan bambu yang bergoyang (menggantung/gandul) di bahu. Nasi ini dihidangkan dengan potongan empal sapi dan kuah hangat kental.',
    ingredients: ['daging-merah', 'santan', 'bawang', 'saus-hitam', 'daun-pisang'],
    instructions: [
      { action: 'potong', description: 'Potong besar daging sapi, otot urat, lidah, atau jeroan kesukaan secara proporsional.' },
      { action: 'rebus', description: 'Rebus potongan daging sapi dengan rempah aromatik daun salam hingga perlahan-lahan sangat empuk lembut.' },
      { action: 'haluskan', description: 'Tumbuk kencur, terasi bakar, ketumbar, dan lada. Tumis wangi bumbu halus jintan ini.' },
      { action: 'tuang', description: 'Saring air kaldu daging, satukan dengan tumisan rempah, santan kental, dan kecap manis pekat.' },
      { action: 'sajikan', description: 'Taruh nasi di atas piring yang beralas daun pisang. Beri irisan empal daging, lalu siram kuah cokelat melimpah.' }
    ],
    galleryImages: ['/kuliner/gallery/nasi-gandul_1.webp', '/kuliner/gallery/nasi-gandul_2.webp', '/kuliner/gallery/nasi-gandul_3.webp']
  },
  {
    slug: 'mangut-lele',
    name: 'Mangut Lele',
    category: 'Makanan Berat',
    tasteProfile: 'Pedas',
    origin: 'Magelang',
    locationImage: 'https://images.unsplash.com/photo-1588668211190-2bb929cb1ce1?q=80&w=400',
    shortDescription: 'Ikan lele asap yang dimasak dalam kuah santan kuning yang sangat pedas.',
    history: 'Lele yang digunakan pada Mangut asli bukanlah lele goreng, melainkan lele yang diasap berjam-jam menggunakan batok kelapa. Proses pengasapan ini memberikan aroma *smokey* yang khas saat dimasak perlahan di dalam bumbu santan kuning cabai rawit setan yang super pedas.',
    ingredients: ['seafood', 'santan', 'cabai', 'bawang', 'rempah-biji'],
    instructions: [
      { action: 'potong', description: 'Kerat tipis badan ikan lele besar hasil tangkapan segar setelah dibersihkan utuh kumis dan isinya.' },
      { action: 'bakar', description: 'Asapkan ikan lele jauh di atas bara batok kelapa hingga dagingnya kering kaku matang dan berwarna kehitaman.' },
      { action: 'haluskan', description: 'Ulek cabai merah keriting, kunyit sangrai, kencur, jahe, bawang, dan kemiri.' },
      { action: 'tumis', description: 'Tumis bumbu ulek ini, tuangkan santan kekuningan lalu cemplungkan cabai rawit hijau dan merah sangat pedas utuh-utuh.' },
      { action: 'rebus', description: 'Masukkan perlahan lele asap ke dalam kuah santan mendidih bergelombang, jangan banyak dibalik agar daging tidak hancur.' }
    ],
    galleryImages: ['/kuliner/gallery/mangut-lele_1.webp', '/kuliner/gallery/mangut-lele_2.webp', '/kuliner/gallery/mangut-lele_3.webp']
  },
  {
    slug: 'tengkleng',
    name: 'Tengkleng Solo',
    category: 'Makanan Berat',
    tasteProfile: 'Gurih',
    origin: 'Solo',
    locationImage: 'https://images.unsplash.com/photo-1588668211190-2bb929cb1ce1?q=80&w=400',
    shortDescription: 'Sup iga dan tulang kambing berkuah kuning encer kaya rempah, tanpa santan yang kental.',
    history: 'Tengkleng lahir dari masa sulit penjajahan. Kala itu daging kambing (sate/gulai) hanya dinikmati oleh para priyayi dan orang Belanda. Kaum pribumi akhirnya memasak sisa-sisa tulang dan iga yang hanya menyisakan sedikit daging, menghasilkan sup tulang segar berkuah ringan yang legendaris.',
    ingredients: ['tulang-iga', 'bawang', 'rempah-biji', 'rempah-daun'],
    instructions: [
      { action: 'potong', description: 'Potong-potong tulang iga, tengkorak, dan tulang kaki kambing muda. Cuci di air mengalir deras.' },
      { action: 'rebus', description: 'Lakukan perebusan blanching pertama untuk membuang lemak kotor yang berbuih. Ganti air baru.' },
      { action: 'haluskan', description: 'Giling halus kunyit, ketumbar, jintan, bawang, dan kemiri. Panaskan dan tumis gilingan tersebut.' },
      { action: 'tumis', description: 'Gabungkan rempah tumis ke panci tulang bersama cengkeh, kayu manis, dan kapulaga utuh.' },
      { action: 'campur', description: 'Masak rebusan kuah berjam-jam secara lamban hingga sumsum tulang lumer dan serpihan daging terlepas empuk.' }
    ],
    galleryImages: ['/kuliner/gallery/tengkleng_1.webp', '/kuliner/gallery/tengkleng_2.webp', '/kuliner/gallery/tengkleng_3.webp']
  },
  {
    slug: 'sate-buntel',
    name: 'Sate Buntel',
    category: 'Makanan Berat',
    tasteProfile: 'Manis',
    origin: 'Solo',
    locationImage: 'https://images.unsplash.com/photo-1588668211190-2bb929cb1ce1?q=80&w=400',
    shortDescription: 'Daging kambing cincang yang dibungkus (dibuntel) dengan lemak tipis lalu dibakar.',
    history: 'Sate Buntel merupakan inovasi pedagang Tionghoa-Jawa di Surakarta. Daging cincang dicampur lada dan bawang merah, lalu "dibuntel" (dibungkus) rapat menggunakan *caul fat* (lemak jala kambing) agar saat dibakar sarinya tidak hilang dan bumbunya terkunci sempurna.',
    ingredients: ['daging-merah', 'bawang', 'saus-hitam', 'rempah-biji'],
    instructions: [
      { action: 'haluskan', description: 'Giling kasar daging paha domba/kambing segar bersama lemak padatnya agar tekstur basah terjaga.' },
      { action: 'campur', description: 'Uleni daging lumat tersebut dengan bawang merah parut, kecap manis lada hitam pekat, dan sedikit tepung kanji.' },
      { action: 'potong', description: 'Lilitkan gumpalan besar daging ke batang sate tebal pipih memanjang. Bentangkan lemak jala tipis tembus pandang pembungkus.' },
      { action: 'bakar', description: 'Buntel (selimuti/bungkus) daging erat memakai lemak, bakar di atas api panas tinggi menjilat sate tebalnya.' },
      { action: 'sajikan', description: 'Bakar setengah gosong dan sajikan saat sari daging juicy tumpah meluber dipotong pisau.' }
    ],
    galleryImages: ['/kuliner/gallery/sate-buntel_1.webp', '/kuliner/gallery/sate-buntel_2.webp', '/kuliner/gallery/sate-buntel_3.webp']
  },
  {
    slug: 'tahu-gimbal',
    name: 'Tahu Gimbal',
    category: 'Makanan Berat',
    tasteProfile: 'Gurih',
    origin: 'Semarang',
    locationImage: 'https://images.unsplash.com/photo-1516104880521-026040825cbb?q=80&w=400',
    shortDescription: 'Campuran tahu goreng, rajangan kol, lontong, dan bakwan udang bersiram bumbu kacang petis.',
    history: 'Berasal dari Semarang, kata "Gimbal" bukan merujuk pada rambut, melainkan nama lain dari bakwan udang (udang goreng tepung yang tidak beraturan bentuknya). Tahu Gimbal disajikan dengan bumbu kacang encer bercampur petis udang, memberikan perpaduan rasa manis, gurih, dan legit.',
    ingredients: ['kedelai', 'seafood', 'kacang', 'saus-hitam', 'sayuran'],
    instructions: [
      { action: 'potong', description: 'Iris tipis lembaran kol mentah renyah. Potong lontong ketupat padat bersudut menjadi dadu.' },
      { action: 'goreng', description: 'Goreng tahu seadanya lalu celupkan udang air tawar utuh berbalut adonan tepung ke dalam minyak hingga renyah acak keriting (gimbal).' },
      { action: 'haluskan', description: 'Tumbuk pelan cabai setan, garam, bawang putih krispi, dan gerusan kacang tanah goreng utuh kasar di cobek lebar.' },
      { action: 'campur', description: 'Tuangkan pelan-pelan petis kental hitam legit dan siraman air asam jawa memutar pada bumbu cobek kacang.' },
      { action: 'sajikan', description: 'Tumpuk tahu, kol, lontong, potongan gimbal udang. Siram tumpahan kuah petis di atasnya dengan remah kerupuk.' }
    ],
    galleryImages: ['/kuliner/gallery/tahu-gimbal_1.webp', '/kuliner/gallery/tahu-gimbal_2.webp', '/kuliner/gallery/tahu-gimbal_3.webp']
  },
  {
    slug: 'es-gempol',
    name: 'Es Gempol Pleret',
    category: 'Minuman',
    tasteProfile: 'Manis',
    origin: 'Jepara',
    locationImage: 'https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?q=80&w=400',
    shortDescription: 'Es santan dengan isian gempol (bulatan tepung beras) dan pleret (adon tepung pipih merah).',
    history: 'Es tradisional ini sangat populer di Semarang dan Jepara. Gempol adalah bola-bola putih dari tepung beras, sementara pleret adalah adonan gula aren dan tepung yang dipipihkan (diplintir/dipleret) sehingga bertekstur kenyal manis. Disajikan dingin dengan kuah santan dan sirup gula.',
    ingredients: ['tepung', 'santan', 'gula-merah', 'gula-pasir'],
    instructions: [
      { action: 'campur', description: 'Siram tumpukan tepung beras jemur dengan sesendok cairan air panas mendidih, uleni hingga kalis kenyal rapat.' },
      { action: 'potong', description: 'Buat bulatan utuh mutiara putih (gempol). Sebagian adonan dibubuhi warna ungu/merah lalu dipilin pipih pinggir piring (pleret).' },
      { action: 'rebus', description: 'Cemplungkan gempol dan pleret ke kuali rebusan sampai butiran bulatnya mengambang ringan menandakan matang.' },
      { action: 'tuang', description: 'Didihkan kuah perasan santan murni yang diberi simpul daun pandan dan sejumput garam pemberi kontras.' },
      { action: 'sajikan', description: 'Tuang bola-bola lembut ke wadah mangkuk, siram merata guyuran santan kental dan sirup gula beraroma segar daun.' }
    ],
    galleryImages: ['/kuliner/gallery/es-gempol_1.webp', '/kuliner/gallery/es-gempol_2.webp', '/kuliner/gallery/es-gempol_3.webp']
  },
  {
    slug: 'mie-ongklok',
    name: 'Mie Ongklok',
    category: 'Makanan Berat',
    tasteProfile: 'Gurih',
    origin: 'Wonosobo',
    locationImage: 'https://images.unsplash.com/photo-1531093121516-7d6365a28c2e?q=80&w=400',
    shortDescription: 'Mie kuning rebus dengan kuah kental berbahan pati, disajikan bersama sate sapi dan tempe kemul.',
    history: 'Lahir di udara dingin pegunungan Dieng, Wonosobo. "Ongklok" adalah keranjang anyaman bambu kecil untuk merebus mi. Kuahnya dibuat kental menggunakan campuran pati singkong dan gula jawa, sangat nikmat disantap panas-panas untuk melawan dinginnya udara gunung.',
    ingredients: ['mie', 'tepung', 'gula-merah', 'bawang', 'sayuran'],
    instructions: [
      { action: 'potong', description: 'Rajang kasar lembaran hijau daun kucai dan rajang kubis lebar menyerupai lempengan.' },
      { action: 'haluskan', description: 'Haluskan ebi udang, merica, dan bawang untuk kaldu dasar daging perebus kuah.' },
      { action: 'rebus', description: 'Rebus air kaldu dasar sapi bumbu rempah ebi, lalu taburkan cairan tepung pati ketela untuk membuat kuah lendir kental meluap.' },
      { action: 'kukus', description: 'Atur porsi susunan mie kuning dan sayur di anyaman mangkuk saringan bambu (ongklok). Celup bolak-balik berulang ke panci air mendidih.' },
      { action: 'tuang', description: 'Banting mie layu ke mangkok cina, siram tumpah dengan kuah lendir panas. Temani dengan gigitan sate daging manis.' }
    ],
    galleryImages: ['/kuliner/gallery/mie-ongklok_1.webp', '/kuliner/gallery/mie-ongklok_2.webp', '/kuliner/gallery/mie-ongklok_3.webp']
  },
  {
    slug: 'carica',
    name: 'Manisan Carica',
    category: 'Minuman',
    tasteProfile: 'Segar',
    origin: 'Wonosobo',
    locationImage: 'https://images.unsplash.com/photo-1531093121516-7d6365a28c2e?q=80&w=400',
    shortDescription: 'Manisan pepaya gunung mungil dalam kuah sirup yang asam segar.',
    history: 'Carica adalah kerabat dekat pepaya yang konon hanya bisa tumbuh dan berbuah maksimal di dataran tinggi Dieng (Wonosobo). Daging buahnya bertekstur lebih kenyal dan bijinya diolah menjadi sirup kental yang asam segar, menciptakan pencuci mulut yang sangat menyegarkan.',
    ingredients: ['umbi-buah', 'gula-pasir'],
    instructions: [
      { action: 'potong', description: 'Kupas bersih buah carica mentah bertekstur keras. Belah tengah untuk melepaskan jaring sarang bijinya.' },
      { action: 'rebus', description: 'Bawa biji berselaput ke panci rebus, aduk remas hingga pecah lalu saring memisahkan air asam pewangi aslinya.' },
      { action: 'campur', description: 'Potong bodi daging carica berpola gelombang estetis, cuci bersihkan di larutan air kapur bening yang mengeraskan tekstur luar.' },
      { action: 'tuang', description: 'Rebus perlahan bongkahan buah carica berdampingan bersama air ekstrak asam bijinya dan taburan gula batu kristal.' },
      { action: 'sajikan', description: 'Dinginkan manisan botolan ini ke mesin pendingin. Santap dingin saat cuaca terik melegakan kerongkongan.' }
    ],
    galleryImages: ['/kuliner/gallery/carica_1.webp', '/kuliner/gallery/carica_2.webp', '/kuliner/gallery/carica_3.webp']
  },
  {
    slug: 'nasi-grombyang',
    name: 'Nasi Grombyang',
    category: 'Makanan Berat',
    tasteProfile: 'Gurih',
    origin: 'Pemalang',
    locationImage: 'https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?q=80&w=400',
    shortDescription: 'Nasi campur daging kerbau dengan kuah kaldu rempah melimpah kluwek yang bergoyang-goyang.',
    history: 'Nama "Grombyang" berasal dari penampilannya saat disajikan: porsinya diisi kuah dalam jumlah sangat banyak hingga hampir tumpah dan bergoyang-goyang (grombyang-grombyang). Menggunakan keluak (kluwek) dan daging kerbau sebagai identitas kuliner pesisir Jawa Tengah.',
    ingredients: ['daging-merah', 'rempah-biji', 'bawang', 'kelapa-parut'],
    instructions: [
      { action: 'potong', description: 'Sembelih daging kerbau matang usia dan pisahkan lemak sandung lamur pembuat kenyal.' },
      { action: 'rebus', description: 'Masak rebus tuntas potongan raksasa daging tebal tersebut sampai hancur serat dagingnya mencair.' },
      { action: 'haluskan', description: 'Ulek kluwek hitam kelam yang sudah dipecahkan, gabung sangrai kelapa parut kuning gosong, haluskan berminyak membaur.' },
      { action: 'tumis', description: 'Tumis mendidihkan bumbu kelapa kluwek hitam pekat ke air didihan kerbau berkolesterol tinggi sedap.' },
      { action: 'tuang', description: 'Guyurkan kaldu pekat membanjiri takaran secukupnya nasi piring hingga penuh berombak goyang "grombyang".' }
    ],
    galleryImages: ['/kuliner/gallery/nasi-grombyang_1.webp', '/kuliner/gallery/nasi-grombyang_2.webp', '/kuliner/gallery/nasi-grombyang_3.webp']
  }
];
