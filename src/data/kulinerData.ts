export type CookingAction = 'potong' | 'haluskan' | 'tumis' | 'rebus' | 'bakar' | 'goreng' | 'kukus' | 'campur' | 'sajikan' | 'tuang';

export interface CookingStep {
  action: CookingAction;
  description: string;
}

export interface TimelineEvent {
  year: string;
  title: string;
  aksara: string;
  description: string;
}

export interface KulinerItem {
  slug: string;
  name: string;
  category: "Makanan Berat" | "Jajanan" | "Minuman";
  tasteProfile: "Manis" | "Gurih" | "Pedas" | "Segar";
  origin: string;
  shortDescription: string;
  historyTimeline: TimelineEvent[];
  ingredients: { name: string; description: string; }[];
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
    historyTimeline: [
      {
        year: 'Abad ke-18',
        title: 'Era Kerajaan',
        aksara: 'ꦌꦫꦏꦼꦫꦗꦲꦤ꧀',
        description: 'Bakso mulai dikenal dari pengaruh pedagang Tiongkok yang beradaptasi dengan budaya lokal Jawa. Mereka memodifikasi resep asli dengan menggunakan daging sapi mentah segar yang melimpah.'
      },
      {
        year: '1900-an',
        title: 'Masa Kolonial',
        aksara: 'ꦩꦱꦏꦺꦴꦭꦺꦴꦤꦶꦪꦭ꧀',
        description: 'Dijajakan berkeliling dari kampung ke kampung dengan menggunakan pikulan kayu jati. Kuah kaldu mulai disesuaikan lidah lokal dengan penambahan rempah nusantara seperti lada dan bawang putih goreng.'
      },
      {
        year: '1945+',
        title: 'Pasca Kemerdekaan',
        aksara: 'ꦥꦱ꧀ꦕꦏꦼꦩꦼꦂꦢꦺꦏꦲꦤ꧀',
        description: 'Masyarakat Wonogiri yang ulet mulai merantau pasca kemerdekaan. Mereka membawa resep bakso khas ke berbagai pelosok negeri sebagai mata pencaharian utama.'
      },
      {
        year: '1990-an',
        title: 'Era Modernisasi',
        aksara: 'ꦌꦫꦩꦺꦴꦢꦼꦂꦤꦶꦱꦱꦶ',
        description: 'Banyak bermunculan pabrik penggilingan daging modern yang terpusat. Hal ini membuat tekstur bakso Wonogiri semakin konsisten, kenyal, dan mudah diproduksi massal.'
      },
      {
        year: 'Masa Kini',
        title: 'Warisan Nusantara',
        aksara: 'ꦮꦫꦶꦱꦤ꧀ꦤꦸꦱꦤ꧀ꦠꦫ',
        description: 'Bakso Wonogiri telah menjadi primadona kuliner jalanan nomor satu di Indonesia. Ia sangat identik dengan gerobak biru atau kayu khas yang terparkir di setiap sudut kota.'
      }
    ],
    ingredients: [
      { name: 'daging-merah', description: 'Bahan dasar utama daging segar yang memberikan kaldu pekat dan tekstur memuaskan.' },
      { name: 'bawang', description: 'Bumbu aromatik dasar Nusantara yang memberikan wangi khas dan rasa gurih mendalam.' },
      { name: 'tepung', description: 'Bahan penyatu dan pengental yang memberikan tekstur kenyal sempurna.' }
    ],
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
    historyTimeline: [
      {
        year: 'Abad ke-17',
        title: 'Era Kerajaan',
        aksara: 'ꦌꦫꦏꦼꦫꦗꦲꦤ꧀',
        description: 'Nasi Liwet awalnya adalah sajian istimewa dan sakral di dalam keraton Kasunanan Surakarta. Hidangan ini khusus dibuat untuk upacara adat dan ritual suci penolak bala.'
      },
      {
        year: '1900-an',
        title: 'Masa Kolonial',
        aksara: 'ꦩꦱꦏꦺꦴꦭꦺꦴꦤꦶꦪꦭ꧀',
        description: 'Mulai dijual bebas di pinggiran alun-alun oleh abdi dalem yang mencari penghasilan tambahan. Hidangan ini disajikan sederhana menggunakan pincuk daun pisang untuk rakyat jelata.'
      },
      {
        year: '1945+',
        title: 'Pasca Kemerdekaan',
        aksara: 'ꦥꦱ꧀ꦕꦏꦼꦩꦼꦂꦢꦺꦏꦲꦤ꧀',
        description: 'Penjual Nasi Liwet Lesehan mulai menjamur di sepanjang kawasan Keprabon Solo. Mereka biasa buka di malam hari untuk menyajikan santap malam hangat bagi warga yang pulang kerja.'
      },
      {
        year: '1990-an',
        title: 'Era Modernisasi',
        aksara: 'ꦌꦫꦩꦺꦴꦢꦼꦂꦤꦶꦱꦱꦶ',
        description: 'Proses memasak mulai memadukan perlengkapan dapur modern yang efisien. Meski begitu, banyak warung legendaris yang tetap mempertahankan tungku kayu bakar demi menjaga aroma sangit yang khas.'
      },
      {
        year: 'Masa Kini',
        title: 'Warisan Nusantara',
        aksara: 'ꦮꦫꦶꦱꦤ꧀ꦤꦸꦱꦤ꧀ꦠꦫ',
        description: 'Diakui secara nasional sebagai salah satu mahakarya kuliner tradisional kota Solo. Makanan ini selalu menjadi menu wajib yang dicari oleh setiap wisatawan yang berkunjung.'
      }
    ],
    ingredients: [
      { name: 'santan', description: 'Ekstrak kelapa murni yang menyumbang rasa gurih lezat dan kekentalan kuah khas.' },
      { name: 'daging-ayam', description: 'Pilihan protein serbaguna yang mudah meresap bumbu dengan tekstur empuk.' },
      { name: 'bawang', description: 'Bumbu aromatik dasar Nusantara yang memberikan wangi khas dan rasa gurih mendalam.' },
      { name: 'rempah-daun', description: 'Kumpulan daun beraroma (salam, jeruk, serai) penyegar kuah dan hidangan.' },
      { name: 'daun-pisang', description: 'Pembungkus alami yang menyumbang aroma wangi khas saat dikukus atau dibakar.' }
    ],
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
    historyTimeline: [
      {
        year: 'Abad ke-19',
        title: 'Era Kerajaan',
        aksara: 'ꦌꦫꦏꦼꦫꦗꦲꦤ꧀',
        description: 'Budaya sate di Blora mengadaptasi pengaruh kuliner daging panggang dari Timur Tengah. Namun, resepnya dimodifikasi menggunakan daging ayam kampung muda yang sangat melimpah di pedesaan.'
      },
      {
        year: '1900-an',
        title: 'Masa Kolonial',
        aksara: 'ꦩꦱꦏꦺꦴꦭꦺꦴꦤꦶꦪꦭ꧀',
        description: 'Sate Blora mulai disajikan dengan tradisi makan yang sangat unik dan interaktif. Pembeli makan sate beserta kuah lodeh tanpa piring, lalu tusuk sate ditaruh di atas meja untuk dihitung di akhir.'
      },
      {
        year: '1945+',
        title: 'Pasca Kemerdekaan',
        aksara: 'ꦥꦱ꧀ꦕꦏꦼꦩꦼꦂꦢꦺꦏꦲꦤ꧀',
        description: 'Kehadiran pabrik kecap manis lokal skala kecil di Jawa Tengah membawa revolusi rasa. Kecap ini mulai menyempurnakan rasa karamelisasi pada sate saat dibakar di atas arang.'
      },
      {
        year: '1990-an',
        title: 'Era Modernisasi',
        aksara: 'ꦌꦫꦩꦺꦴꦢꦼꦂꦤꦶꦱꦱꦶ',
        description: 'Warung sate legendaris di Blora mulai bermunculan dengan konsep ruang makan yang lebih modern dan luas. Walau begitu, tradisi memanggang menggunakan arang kayu jati tetap dipertahankan ketat.'
      },
      {
        year: 'Masa Kini',
        title: 'Warisan Nusantara',
        aksara: 'ꦮꦫꦶꦱꦤ꧀ꦤꦸꦱꦤ꧀ꦠꦫ',
        description: 'Sate Blora menjadi ikon budaya lokal yang membanggakan dan tak lekang oleh waktu. Kehadirannya selalu identik dengan kuah lodeh gurih yang selalu setia mendampinginya.'
      }
    ],
    ingredients: [
      { name: 'daging-ayam', description: 'Pilihan protein serbaguna yang mudah meresap bumbu dengan tekstur empuk.' },
      { name: 'kacang', description: 'Bahan saus atau taburan yang memberikan tekstur renyah dan profil rasa legit gurih.' },
      { name: 'saus-hitam', description: 'Bumbu fermentasi penambah rasa manis karamel dan warna eksotis.' },
      { name: 'bawang', description: 'Bumbu aromatik dasar Nusantara yang memberikan wangi khas dan rasa gurih mendalam.' },
      { name: 'gula-merah', description: 'Pemanis alami aren yang memberi sentuhan manis legit khas masakan Jawa.' }
    ],
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
    historyTimeline: [
      {
        year: 'Abad ke-18',
        title: 'Era Kerajaan',
        aksara: 'ꦌꦫꦏꦼꦫꦗꦲꦤ꧀',
        description: 'Menjadi lambang kesabaran dan filosofi hidup perlahan orang Jawa (alon-alon waton kelakon). Hal ini dikarenakan proses mengukusnya yang memakan waktu lama, harus perlahan lapis demi lapis.'
      },
      {
        year: '1900-an',
        title: 'Masa Kolonial',
        aksara: 'ꦩꦱꦏꦺꦴꦭꦺꦴꦤꦶꦪꦭ꧀',
        description: 'Pewarna hijau alami dari perasan daun suji dan pandan wangi mulai dipadukan dengan gula rafinasi. Gula putih bersih ini merupakan komoditas baru yang dibawa oleh serikat dagang Eropa.'
      },
      {
        year: '1945+',
        title: 'Pasca Kemerdekaan',
        aksara: 'ꦥꦱ꧀ꦕꦏꦼꦩꦼꦂꦢꦺꦏꦲꦤ꧀',
        description: 'Kue Lapis Jongkong naik kasta menjadi hidangan kue wajib di perkampungan. Jajanan ini tak pernah absen dalam setiap perayaan tradisional seperti hajatan, syukuran, dan hari besar keagamaan.'
      },
      {
        year: '1990-an',
        title: 'Era Modernisasi',
        aksara: 'ꦌꦫꦩꦺꦴꦢꦼꦂꦤꦶꦱꦱꦶ',
        description: 'Kreasi modern di perkotaan mulai menambahkan lapisan dengan varian rasa kekinian seperti cokelat dan mocha. Meskipun begitu, varian rasa pandan kelapa tradisional tetap menjadi primadona terlaris.'
      },
      {
        year: 'Masa Kini',
        title: 'Warisan Nusantara',
        aksara: 'ꦮꦫꦶꦱꦤ꧀ꦤꦸꦱꦤ꧀ꦠꦫ',
        description: 'Jajanan pasar ini tetap lestari dan mampu bertahan di tengah gempuran aneka dessert modern dari luar negeri. Sangat nikmat disajikan sembari minum teh tawar hangat di sore hari.'
      }
    ],
    ingredients: [
      { name: 'tepung', description: 'Bahan penyatu dan pengental yang memberikan tekstur kenyal sempurna.' },
      { name: 'santan', description: 'Ekstrak kelapa murni yang menyumbang rasa gurih lezat dan kekentalan kuah khas.' },
      { name: 'gula-pasir', description: 'Pemanis kristal murni untuk menyeimbangkan rasa rempah dan gurih santan.' },
      { name: 'rempah-daun', description: 'Kumpulan daun beraroma (salam, jeruk, serai) penyegar kuah dan hidangan.' }
    ],
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
    historyTimeline: [
      {
        year: 'Abad ke-16',
        title: 'Era Kerajaan',
        aksara: 'ꦌꦫꦏꦼꦫꦗꦲꦤ꧀',
        description: 'Tempe pertama kali ditemukan secara tak sengaja di wilayah Mataram Kuno. Makanan ini berawal dari inovasi brilian proses fermentasi kacang kedelai hitam liar yang dibungkus daun jati.'
      },
      {
        year: '1900-an',
        title: 'Masa Kolonial',
        aksara: 'ꦩꦱꦏꦺꦴꦭꦺꦴꦤꦶꦪꦭ꧀',
        description: 'Mendoan, yakni olahan tempe yang digoreng setengah matang (mendo), mulai sangat populer di wilayah Banyumas. Hidangan ini menjadi cemilan hangat andalan warga untuk mengusir udara dingin.'
      },
      {
        year: '1945+',
        title: 'Pasca Kemerdekaan',
        aksara: 'ꦥꦱ꧀ꦕꦏꦼꦩꦼꦂꦢꦺꦏꦲꦤ꧀',
        description: 'Tempe diangkat menjadi pahlawan sumber protein nabati utama bagi seluruh masyarakat Indonesia. Khususnya sangat diandalkan pada masa-masa awal kemerdekaan yang serba terbatas dan penuh tantangan ekonomi.'
      },
      {
        year: '1990-an',
        title: 'Era Modernisasi',
        aksara: 'ꦌꦫꦩꦺꦴꦢꦼꦂꦤꦶꦱꦱꦶ',
        description: 'Teknik menggoreng tempe di masyarakat semakin bervariasi mengikuti perkembangan zaman. Hadirnya produk tepung berbumbu siap pakai membuat inovasi tempe goreng krispi menyebar luas ke seluruh negeri.'
      },
      {
        year: 'Masa Kini',
        title: 'Warisan Nusantara',
        aksara: 'ꦮꦫꦶꦱꦤ꧀ꦤꦸꦱꦤ꧀ꦠꦫ',
        description: 'Telah berevolusi dari sekadar makanan kelas jalanan hingga berhasil dihidangkan dengan mewah di restoran bintang lima. Mendoan dan tempe goreng adalah jiwa otentik dari seni kuliner Jawa.'
      }
    ],
    ingredients: [
      { name: 'kedelai', description: 'Sumber protein nabati (tahu/tempe/kecap) yang sangat merakyat.' },
      { name: 'tepung', description: 'Bahan penyatu dan pengental yang memberikan tekstur kenyal sempurna.' },
      { name: 'bawang', description: 'Bumbu aromatik dasar Nusantara yang memberikan wangi khas dan rasa gurih mendalam.' },
      { name: 'sayuran', description: 'Komponen segar penambah tekstur renyah, serat, dan warna alami pada hidangan.' },
      { name: 'cabai', description: 'Bumbu pedas pembangkit selera yang memberikan sensasi hangat dan menantang lidah.' }
    ],
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
    historyTimeline: [
      {
        year: 'Abad ke-16',
        title: 'Era Sunan Kudus',
        aksara: 'ꦌꦫꦏꦼꦫꦗꦲꦤ꧀',
        description: 'Sebagai bentuk penghormatan dan toleransi beragama kepada umat Hindu, Sunan Kudus melarang penyembelihan sapi. Beliau lalu mengganti kaldu sapi dengan daging kerbau yang teksturnya lebih kaya rasa.'
      },
      {
        year: '1900-an',
        title: 'Masa Kolonial',
        aksara: 'ꦩꦱꦏꦺꦴꦭꦺꦴꦤꦶꦪꦭ꧀',
        description: 'Soto mulai dijual keliling secara tradisional menggunakan pikulan bambu rotan di sepanjang area alun-alun. Hidangan kuah segar ini dengan cepat menjadi menu sarapan favorit para pedagang pasar pagi.'
      },
      {
        year: '1945+',
        title: 'Pasca Kemerdekaan',
        aksara: 'ꦥꦱ꧀ꦕꦏꦼꦩꦼꦂꦢꦺꦏꦲꦤ꧀',
        description: 'Para penjual mulai menetap dan mendirikan warung-warung tenda sederhana di pinggir jalan raya Pantura yang strategis. Mereka siap sedia melayani para supir dan pendatang dari lintas daerah siang malam.'
      },
      {
        year: '1990-an',
        title: 'Era Modernisasi',
        aksara: 'ꦌꦫꦩꦺꦴꦢꦼꦂꦤꦶꦱꦱꦶ',
        description: 'Penyajiannya mulai beralih menggunakan mangkuk porselen khas berlambang ayam jago yang diimpor dari Tiongkok. Porsinya yang sengaja dibuat mungil ini justru memancing pembeli untuk makan nambah berkali-kali.'
      },
      {
        year: 'Masa Kini',
        title: 'Warisan Nusantara',
        aksara: 'ꦮꦫꦶꦱꦤ꧀ꦤꦸꦱꦤ꧀ꦠꦫ',
        description: 'Soto Kudus telah resmi menjadi ikon budaya kuliner jalur pantura Jawa Tengah. Kuahnya tidak hanya memadukan harmonisasi rempah nusantara, tetapi juga menceritakan sejarah luhur toleransi tinggi.'
      }
    ],
    ingredients: [
      { name: 'daging-ayam', description: 'Pilihan protein serbaguna yang mudah meresap bumbu dengan tekstur empuk.' },
      { name: 'bawang', description: 'Bumbu aromatik dasar Nusantara yang memberikan wangi khas dan rasa gurih mendalam.' },
      { name: 'rempah-daun', description: 'Kumpulan daun beraroma (salam, jeruk, serai) penyegar kuah dan hidangan.' },
      { name: 'sayuran', description: 'Komponen segar penambah tekstur renyah, serat, dan warna alami pada hidangan.' }
    ],
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
    historyTimeline: [
      {
        year: 'Abad ke-18',
        title: 'Era Kerajaan',
        aksara: 'ꦌꦫꦏꦼꦫꦗꦲꦤ꧀',
        description: 'Hidangan ini bermula dari racikan dapur tradisional yang secara cerdas memanfaatkan hasil bumi lokal. Resepnya menggunakan racikan rempah warisan leluhur yang kala itu sangat bernilai harganya.'
      },
      {
        year: '1900-an',
        title: 'Masa Kolonial',
        aksara: 'ꦩꦱꦏꦺꦴꦭꦺꦴꦤꦶꦪꦭ꧀',
        description: 'Mulai dijajakan secara meluas oleh para pedagang keliling menggunakan gerobak atau pikulan sederhana. Biasanya mereka berpusat di pusat kota, stasiun kereta, dan alun-alun keramaian.'
      },
      {
        year: '1945+',
        title: 'Pasca Kemerdekaan',
        aksara: 'ꦥꦱ꧀ꦕꦏꦼꦩꦼꦂꦢꦺꦏꦲꦤ꧀',
        description: 'Menjadi salah satu comfort food kebanggaan masyarakat lokal di tengah masa-masa transisi kemerdekaan. Makanan ini sukses menyatukan berbagai lapisan sosial ekonomi masyarakat dalam satu meja cita rasa.'
      },
      {
        year: '1990-an',
        title: 'Era Modernisasi',
        aksara: 'ꦌꦫꦩꦺꦴꦢꦼꦂꦤꦶꦱꦱꦶ',
        description: 'Sistem penyajian mulai mengalami penyesuaian menuju arah yang lebih modern dan komersial. Banyak warung permanen sengaja didirikan di pinggir jalan utama untuk melayani lonjakan peminat dari luar kota.'
      },
      {
        year: 'Masa Kini',
        title: 'Warisan Nusantara',
        aksara: 'ꦮꦫꦶꦱꦤ꧀ꦤꦸꦱꦤ꧀ꦠꦫ',
        description: 'Kini kuliner ini telah ditetapkan sebagai warisan mahakarya nusantara yang tak ternilai harganya. Cita rasanya yang otentik selalu dirindukan oleh para perantau dan giat dilestarikan oleh generasi muda.'
      }
    ],
    ingredients: [
      { name: 'umbi-buah', description: 'Bahan karbohidrat atau isian alami penambah tekstur dan cita rasa unik.' },
      { name: 'kelapa-parut', description: 'Serutan daging kelapa untuk pelapis jajanan atau bahan serundeng gurih.' },
      { name: 'gula-pasir', description: 'Pemanis kristal murni untuk menyeimbangkan rasa rempah dan gurih santan.' },
      { name: 'gula-merah', description: 'Pemanis alami aren yang memberi sentuhan manis legit khas masakan Jawa.' },
      { name: 'rempah-daun', description: 'Kumpulan daun beraroma (salam, jeruk, serai) penyegar kuah dan hidangan.' }
    ],
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
    historyTimeline: [
      {
        year: 'Abad ke-18',
        title: 'Era Kerajaan',
        aksara: 'ꦌꦫꦏꦼꦫꦗꦲꦤ꧀',
        description: 'Hidangan ini bermula dari racikan dapur tradisional yang secara cerdas memanfaatkan hasil bumi lokal. Resepnya menggunakan racikan rempah warisan leluhur yang kala itu sangat bernilai harganya.'
      },
      {
        year: '1900-an',
        title: 'Masa Kolonial',
        aksara: 'ꦩꦱꦏꦺꦴꦭꦺꦴꦤꦶꦪꦭ꧀',
        description: 'Mulai dijajakan secara meluas oleh para pedagang keliling menggunakan gerobak atau pikulan sederhana. Biasanya mereka berpusat di pusat kota, stasiun kereta, dan alun-alun keramaian.'
      },
      {
        year: '1945+',
        title: 'Pasca Kemerdekaan',
        aksara: 'ꦥꦱ꧀ꦕꦏꦼꦩꦼꦂꦢꦺꦏꦲꦤ꧀',
        description: 'Menjadi salah satu comfort food kebanggaan masyarakat lokal di tengah masa-masa transisi kemerdekaan. Makanan ini sukses menyatukan berbagai lapisan sosial ekonomi masyarakat dalam satu meja cita rasa.'
      },
      {
        year: '1990-an',
        title: 'Era Modernisasi',
        aksara: 'ꦌꦫꦩꦺꦴꦢꦼꦂꦤꦶꦱꦱꦶ',
        description: 'Sistem penyajian mulai mengalami penyesuaian menuju arah yang lebih modern dan komersial. Banyak warung permanen sengaja didirikan di pinggir jalan utama untuk melayani lonjakan peminat dari luar kota.'
      },
      {
        year: 'Masa Kini',
        title: 'Warisan Nusantara',
        aksara: 'ꦮꦫꦶꦱꦤ꧀ꦤꦸꦱꦤ꧀ꦠꦫ',
        description: 'Kini kuliner ini telah ditetapkan sebagai warisan mahakarya nusantara yang tak ternilai harganya. Cita rasanya yang otentik selalu dirindukan oleh para perantau dan giat dilestarikan oleh generasi muda.'
      }
    ],
    ingredients: [
      { name: 'tepung', description: 'Bahan penyatu dan pengental yang memberikan tekstur kenyal sempurna.' },
      { name: 'gula-pasir', description: 'Pemanis kristal murni untuk menyeimbangkan rasa rempah dan gurih santan.' }
    ],
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
    historyTimeline: [
      {
        year: 'Abad ke-18',
        title: 'Era Kerajaan',
        aksara: 'ꦌꦫꦏꦼꦫꦗꦲꦤ꧀',
        description: 'Hidangan ini bermula dari racikan dapur tradisional yang secara cerdas memanfaatkan hasil bumi lokal. Resepnya menggunakan racikan rempah warisan leluhur yang kala itu sangat bernilai harganya.'
      },
      {
        year: '1900-an',
        title: 'Masa Kolonial',
        aksara: 'ꦩꦱꦏꦺꦴꦭꦺꦴꦤꦶꦪꦭ꧀',
        description: 'Mulai dijajakan secara meluas oleh para pedagang keliling menggunakan gerobak atau pikulan sederhana. Biasanya mereka berpusat di pusat kota, stasiun kereta, dan alun-alun keramaian.'
      },
      {
        year: '1945+',
        title: 'Pasca Kemerdekaan',
        aksara: 'ꦥꦱ꧀ꦕꦏꦼꦩꦼꦂꦢꦺꦏꦲꦤ꧀',
        description: 'Menjadi salah satu comfort food kebanggaan masyarakat lokal di tengah masa-masa transisi kemerdekaan. Makanan ini sukses menyatukan berbagai lapisan sosial ekonomi masyarakat dalam satu meja cita rasa.'
      },
      {
        year: '1990-an',
        title: 'Era Modernisasi',
        aksara: 'ꦌꦫꦩꦺꦴꦢꦼꦂꦤꦶꦱꦱꦶ',
        description: 'Sistem penyajian mulai mengalami penyesuaian menuju arah yang lebih modern dan komersial. Banyak warung permanen sengaja didirikan di pinggir jalan utama untuk melayani lonjakan peminat dari luar kota.'
      },
      {
        year: 'Masa Kini',
        title: 'Warisan Nusantara',
        aksara: 'ꦮꦫꦶꦱꦤ꧀ꦤꦸꦱꦤ꧀ꦠꦫ',
        description: 'Kini kuliner ini telah ditetapkan sebagai warisan mahakarya nusantara yang tak ternilai harganya. Cita rasanya yang otentik selalu dirindukan oleh para perantau dan giat dilestarikan oleh generasi muda.'
      }
    ],
    ingredients: [
      { name: 'tepung', description: 'Bahan penyatu dan pengental yang memberikan tekstur kenyal sempurna.' },
      { name: 'santan', description: 'Ekstrak kelapa murni yang menyumbang rasa gurih lezat dan kekentalan kuah khas.' },
      { name: 'daging-ayam', description: 'Pilihan protein serbaguna yang mudah meresap bumbu dengan tekstur empuk.' },
      { name: 'daun-pisang', description: 'Pembungkus alami yang menyumbang aroma wangi khas saat dikukus atau dibakar.' },
      { name: 'bawang', description: 'Bumbu aromatik dasar Nusantara yang memberikan wangi khas dan rasa gurih mendalam.' },
      { name: 'rempah-biji', description: 'Bumbu inti (ketumbar, merica, kemiri) yang mengunci kekayaan rasa masakan.' }
    ],
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
    historyTimeline: [
      {
        year: 'Abad ke-18',
        title: 'Era Kerajaan',
        aksara: 'ꦌꦫꦏꦼꦫꦗꦲꦤ꧀',
        description: 'Hidangan ini bermula dari racikan dapur tradisional yang secara cerdas memanfaatkan hasil bumi lokal. Resepnya menggunakan racikan rempah warisan leluhur yang kala itu sangat bernilai harganya.'
      },
      {
        year: '1900-an',
        title: 'Masa Kolonial',
        aksara: 'ꦩꦱꦏꦺꦴꦭꦺꦴꦤꦶꦪꦭ꧀',
        description: 'Mulai dijajakan secara meluas oleh para pedagang keliling menggunakan gerobak atau pikulan sederhana. Biasanya mereka berpusat di pusat kota, stasiun kereta, dan alun-alun keramaian.'
      },
      {
        year: '1945+',
        title: 'Pasca Kemerdekaan',
        aksara: 'ꦥꦱ꧀ꦕꦏꦼꦩꦼꦂꦢꦺꦏꦲꦤ꧀',
        description: 'Menjadi salah satu comfort food kebanggaan masyarakat lokal di tengah masa-masa transisi kemerdekaan. Makanan ini sukses menyatukan berbagai lapisan sosial ekonomi masyarakat dalam satu meja cita rasa.'
      },
      {
        year: '1990-an',
        title: 'Era Modernisasi',
        aksara: 'ꦌꦫꦩꦺꦴꦢꦼꦂꦤꦶꦱꦱꦶ',
        description: 'Sistem penyajian mulai mengalami penyesuaian menuju arah yang lebih modern dan komersial. Banyak warung permanen sengaja didirikan di pinggir jalan utama untuk melayani lonjakan peminat dari luar kota.'
      },
      {
        year: 'Masa Kini',
        title: 'Warisan Nusantara',
        aksara: 'ꦮꦫꦶꦱꦤ꧀ꦤꦸꦱꦤ꧀ꦠꦫ',
        description: 'Kini kuliner ini telah ditetapkan sebagai warisan mahakarya nusantara yang tak ternilai harganya. Cita rasanya yang otentik selalu dirindukan oleh para perantau dan giat dilestarikan oleh generasi muda.'
      }
    ],
    ingredients: [
      { name: 'tepung', description: 'Bahan penyatu dan pengental yang memberikan tekstur kenyal sempurna.' },
      { name: 'rempah-daun', description: 'Kumpulan daun beraroma (salam, jeruk, serai) penyegar kuah dan hidangan.' },
      { name: 'santan', description: 'Ekstrak kelapa murni yang menyumbang rasa gurih lezat dan kekentalan kuah khas.' },
      { name: 'gula-merah', description: 'Pemanis alami aren yang memberi sentuhan manis legit khas masakan Jawa.' }
    ],
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
    historyTimeline: [
      {
        year: 'Abad ke-18',
        title: 'Era Kerajaan',
        aksara: 'ꦌꦫꦏꦼꦫꦗꦲꦤ꧀',
        description: 'Hidangan ini bermula dari racikan dapur tradisional yang secara cerdas memanfaatkan hasil bumi lokal. Resepnya menggunakan racikan rempah warisan leluhur yang kala itu sangat bernilai harganya.'
      },
      {
        year: '1900-an',
        title: 'Masa Kolonial',
        aksara: 'ꦩꦱꦏꦺꦴꦭꦺꦴꦤꦶꦪꦭ꧀',
        description: 'Mulai dijajakan secara meluas oleh para pedagang keliling menggunakan gerobak atau pikulan sederhana. Biasanya mereka berpusat di pusat kota, stasiun kereta, dan alun-alun keramaian.'
      },
      {
        year: '1945+',
        title: 'Pasca Kemerdekaan',
        aksara: 'ꦥꦱ꧀ꦕꦏꦼꦩꦼꦂꦢꦺꦏꦲꦤ꧀',
        description: 'Menjadi salah satu comfort food kebanggaan masyarakat lokal di tengah masa-masa transisi kemerdekaan. Makanan ini sukses menyatukan berbagai lapisan sosial ekonomi masyarakat dalam satu meja cita rasa.'
      },
      {
        year: '1990-an',
        title: 'Era Modernisasi',
        aksara: 'ꦌꦫꦩꦺꦴꦢꦼꦂꦤꦶꦱꦱꦶ',
        description: 'Sistem penyajian mulai mengalami penyesuaian menuju arah yang lebih modern dan komersial. Banyak warung permanen sengaja didirikan di pinggir jalan utama untuk melayani lonjakan peminat dari luar kota.'
      },
      {
        year: 'Masa Kini',
        title: 'Warisan Nusantara',
        aksara: 'ꦮꦫꦶꦱꦤ꧀ꦤꦸꦱꦤ꧀ꦠꦫ',
        description: 'Kini kuliner ini telah ditetapkan sebagai warisan mahakarya nusantara yang tak ternilai harganya. Cita rasanya yang otentik selalu dirindukan oleh para perantau dan giat dilestarikan oleh generasi muda.'
      }
    ],
    ingredients: [
      { name: 'umbi-buah', description: 'Bahan karbohidrat atau isian alami penambah tekstur dan cita rasa unik.' },
      { name: 'daging-ayam', description: 'Pilihan protein serbaguna yang mudah meresap bumbu dengan tekstur empuk.' },
      { name: 'seafood', description: 'Hasil tangkapan laut segar penyumbang cita rasa gurih alami dan aroma khas.' },
      { name: 'bawang', description: 'Bumbu aromatik dasar Nusantara yang memberikan wangi khas dan rasa gurih mendalam.' },
      { name: 'saus-hitam', description: 'Bumbu fermentasi penambah rasa manis karamel dan warna eksotis.' },
      { name: 'gula-merah', description: 'Pemanis alami aren yang memberi sentuhan manis legit khas masakan Jawa.' }
    ],
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
    historyTimeline: [
      {
        year: 'Abad ke-18',
        title: 'Era Kerajaan',
        aksara: 'ꦌꦫꦏꦼꦫꦗꦲꦤ꧀',
        description: 'Hidangan ini bermula dari racikan dapur tradisional yang secara cerdas memanfaatkan hasil bumi lokal. Resepnya menggunakan racikan rempah warisan leluhur yang kala itu sangat bernilai harganya.'
      },
      {
        year: '1900-an',
        title: 'Masa Kolonial',
        aksara: 'ꦩꦱꦏꦺꦴꦭꦺꦴꦤꦶꦪꦭ꧀',
        description: 'Mulai dijajakan secara meluas oleh para pedagang keliling menggunakan gerobak atau pikulan sederhana. Biasanya mereka berpusat di pusat kota, stasiun kereta, dan alun-alun keramaian.'
      },
      {
        year: '1945+',
        title: 'Pasca Kemerdekaan',
        aksara: 'ꦥꦱ꧀ꦕꦏꦼꦩꦼꦂꦢꦺꦏꦲꦤ꧀',
        description: 'Menjadi salah satu comfort food kebanggaan masyarakat lokal di tengah masa-masa transisi kemerdekaan. Makanan ini sukses menyatukan berbagai lapisan sosial ekonomi masyarakat dalam satu meja cita rasa.'
      },
      {
        year: '1990-an',
        title: 'Era Modernisasi',
        aksara: 'ꦌꦫꦩꦺꦴꦢꦼꦂꦤꦶꦱꦱꦶ',
        description: 'Sistem penyajian mulai mengalami penyesuaian menuju arah yang lebih modern dan komersial. Banyak warung permanen sengaja didirikan di pinggir jalan utama untuk melayani lonjakan peminat dari luar kota.'
      },
      {
        year: 'Masa Kini',
        title: 'Warisan Nusantara',
        aksara: 'ꦮꦫꦶꦱꦤ꧀ꦤꦸꦱꦤ꧀ꦠꦫ',
        description: 'Kini kuliner ini telah ditetapkan sebagai warisan mahakarya nusantara yang tak ternilai harganya. Cita rasanya yang otentik selalu dirindukan oleh para perantau dan giat dilestarikan oleh generasi muda.'
      }
    ],
    ingredients: [
      { name: 'daging-ayam', description: 'Pilihan protein serbaguna yang mudah meresap bumbu dengan tekstur empuk.' },
      { name: 'santan', description: 'Ekstrak kelapa murni yang menyumbang rasa gurih lezat dan kekentalan kuah khas.' },
      { name: 'sayuran', description: 'Komponen segar penambah tekstur renyah, serat, dan warna alami pada hidangan.' },
      { name: 'cabai', description: 'Bumbu pedas pembangkit selera yang memberikan sensasi hangat dan menantang lidah.' },
      { name: 'daun-pisang', description: 'Pembungkus alami yang menyumbang aroma wangi khas saat dikukus atau dibakar.' },
      { name: 'bawang', description: 'Bumbu aromatik dasar Nusantara yang memberikan wangi khas dan rasa gurih mendalam.' }
    ],
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
    historyTimeline: [
      {
        year: 'Abad ke-18',
        title: 'Era Kerajaan',
        aksara: 'ꦌꦫꦏꦼꦫꦗꦲꦤ꧀',
        description: 'Hidangan ini bermula dari racikan dapur tradisional yang secara cerdas memanfaatkan hasil bumi lokal. Resepnya menggunakan racikan rempah warisan leluhur yang kala itu sangat bernilai harganya.'
      },
      {
        year: '1900-an',
        title: 'Masa Kolonial',
        aksara: 'ꦩꦱꦏꦺꦴꦭꦺꦴꦤꦶꦪꦭ꧀',
        description: 'Mulai dijajakan secara meluas oleh para pedagang keliling menggunakan gerobak atau pikulan sederhana. Biasanya mereka berpusat di pusat kota, stasiun kereta, dan alun-alun keramaian.'
      },
      {
        year: '1945+',
        title: 'Pasca Kemerdekaan',
        aksara: 'ꦥꦱ꧀ꦕꦏꦼꦩꦼꦂꦢꦺꦏꦲꦤ꧀',
        description: 'Menjadi salah satu comfort food kebanggaan masyarakat lokal di tengah masa-masa transisi kemerdekaan. Makanan ini sukses menyatukan berbagai lapisan sosial ekonomi masyarakat dalam satu meja cita rasa.'
      },
      {
        year: '1990-an',
        title: 'Era Modernisasi',
        aksara: 'ꦌꦫꦩꦺꦴꦢꦼꦂꦤꦶꦱꦱꦶ',
        description: 'Sistem penyajian mulai mengalami penyesuaian menuju arah yang lebih modern dan komersial. Banyak warung permanen sengaja didirikan di pinggir jalan utama untuk melayani lonjakan peminat dari luar kota.'
      },
      {
        year: 'Masa Kini',
        title: 'Warisan Nusantara',
        aksara: 'ꦮꦫꦶꦱꦤ꧀ꦤꦸꦱꦤ꧀ꦠꦫ',
        description: 'Kini kuliner ini telah ditetapkan sebagai warisan mahakarya nusantara yang tak ternilai harganya. Cita rasanya yang otentik selalu dirindukan oleh para perantau dan giat dilestarikan oleh generasi muda.'
      }
    ],
    ingredients: [
      { name: 'tepung', description: 'Bahan penyatu dan pengental yang memberikan tekstur kenyal sempurna.' },
      { name: 'santan', description: 'Ekstrak kelapa murni yang menyumbang rasa gurih lezat dan kekentalan kuah khas.' },
      { name: 'gula-pasir', description: 'Pemanis kristal murni untuk menyeimbangkan rasa rempah dan gurih santan.' },
      { name: 'rempah-daun', description: 'Kumpulan daun beraroma (salam, jeruk, serai) penyegar kuah dan hidangan.' },
      { name: 'daun-pisang', description: 'Pembungkus alami yang menyumbang aroma wangi khas saat dikukus atau dibakar.' }
    ],
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
    historyTimeline: [
      {
        year: 'Abad ke-18',
        title: 'Era Kerajaan',
        aksara: 'ꦌꦫꦏꦼꦫꦗꦲꦤ꧀',
        description: 'Hidangan ini bermula dari racikan dapur tradisional yang secara cerdas memanfaatkan hasil bumi lokal. Resepnya menggunakan racikan rempah warisan leluhur yang kala itu sangat bernilai harganya.'
      },
      {
        year: '1900-an',
        title: 'Masa Kolonial',
        aksara: 'ꦩꦱꦏꦺꦴꦭꦺꦴꦤꦶꦪꦭ꧀',
        description: 'Mulai dijajakan secara meluas oleh para pedagang keliling menggunakan gerobak atau pikulan sederhana. Biasanya mereka berpusat di pusat kota, stasiun kereta, dan alun-alun keramaian.'
      },
      {
        year: '1945+',
        title: 'Pasca Kemerdekaan',
        aksara: 'ꦥꦱ꧀ꦕꦏꦼꦩꦼꦂꦢꦺꦏꦲꦤ꧀',
        description: 'Menjadi salah satu comfort food kebanggaan masyarakat lokal di tengah masa-masa transisi kemerdekaan. Makanan ini sukses menyatukan berbagai lapisan sosial ekonomi masyarakat dalam satu meja cita rasa.'
      },
      {
        year: '1990-an',
        title: 'Era Modernisasi',
        aksara: 'ꦌꦫꦩꦺꦴꦢꦼꦂꦤꦶꦱꦱꦶ',
        description: 'Sistem penyajian mulai mengalami penyesuaian menuju arah yang lebih modern dan komersial. Banyak warung permanen sengaja didirikan di pinggir jalan utama untuk melayani lonjakan peminat dari luar kota.'
      },
      {
        year: 'Masa Kini',
        title: 'Warisan Nusantara',
        aksara: 'ꦮꦫꦶꦱꦤ꧀ꦤꦸꦱꦤ꧀ꦠꦫ',
        description: 'Kini kuliner ini telah ditetapkan sebagai warisan mahakarya nusantara yang tak ternilai harganya. Cita rasanya yang otentik selalu dirindukan oleh para perantau dan giat dilestarikan oleh generasi muda.'
      }
    ],
    ingredients: [
      { name: 'kedelai', description: 'Sumber protein nabati (tahu/tempe/kecap) yang sangat merakyat.' },
      { name: 'saus-hitam', description: 'Bumbu fermentasi penambah rasa manis karamel dan warna eksotis.' },
      { name: 'bawang', description: 'Bumbu aromatik dasar Nusantara yang memberikan wangi khas dan rasa gurih mendalam.' },
      { name: 'cabai', description: 'Bumbu pedas pembangkit selera yang memberikan sensasi hangat dan menantang lidah.' },
      { name: 'gula-merah', description: 'Pemanis alami aren yang memberi sentuhan manis legit khas masakan Jawa.' }
    ],
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
    historyTimeline: [
      {
        year: 'Abad ke-18',
        title: 'Era Kerajaan',
        aksara: 'ꦌꦫꦏꦼꦫꦗꦲꦤ꧀',
        description: 'Hidangan ini bermula dari racikan dapur tradisional yang secara cerdas memanfaatkan hasil bumi lokal. Resepnya menggunakan racikan rempah warisan leluhur yang kala itu sangat bernilai harganya.'
      },
      {
        year: '1900-an',
        title: 'Masa Kolonial',
        aksara: 'ꦩꦱꦏꦺꦴꦭꦺꦴꦤꦶꦪꦭ꧀',
        description: 'Mulai dijajakan secara meluas oleh para pedagang keliling menggunakan gerobak atau pikulan sederhana. Biasanya mereka berpusat di pusat kota, stasiun kereta, dan alun-alun keramaian.'
      },
      {
        year: '1945+',
        title: 'Pasca Kemerdekaan',
        aksara: 'ꦥꦱ꧀ꦕꦏꦼꦩꦼꦂꦢꦺꦏꦲꦤ꧀',
        description: 'Menjadi salah satu comfort food kebanggaan masyarakat lokal di tengah masa-masa transisi kemerdekaan. Makanan ini sukses menyatukan berbagai lapisan sosial ekonomi masyarakat dalam satu meja cita rasa.'
      },
      {
        year: '1990-an',
        title: 'Era Modernisasi',
        aksara: 'ꦌꦫꦩꦺꦴꦢꦼꦂꦤꦶꦱꦱꦶ',
        description: 'Sistem penyajian mulai mengalami penyesuaian menuju arah yang lebih modern dan komersial. Banyak warung permanen sengaja didirikan di pinggir jalan utama untuk melayani lonjakan peminat dari luar kota.'
      },
      {
        year: 'Masa Kini',
        title: 'Warisan Nusantara',
        aksara: 'ꦮꦫꦶꦱꦤ꧀ꦤꦸꦱꦤ꧀ꦠꦫ',
        description: 'Kini kuliner ini telah ditetapkan sebagai warisan mahakarya nusantara yang tak ternilai harganya. Cita rasanya yang otentik selalu dirindukan oleh para perantau dan giat dilestarikan oleh generasi muda.'
      }
    ],
    ingredients: [
      { name: 'tepung', description: 'Bahan penyatu dan pengental yang memberikan tekstur kenyal sempurna.' },
      { name: 'kelapa-parut', description: 'Serutan daging kelapa untuk pelapis jajanan atau bahan serundeng gurih.' },
      { name: 'gula-pasir', description: 'Pemanis kristal murni untuk menyeimbangkan rasa rempah dan gurih santan.' },
      { name: 'santan', description: 'Ekstrak kelapa murni yang menyumbang rasa gurih lezat dan kekentalan kuah khas.' },
      { name: 'telur', description: 'Bahan pengikat sekaligus pelengkap hidangan lezat dan kaya protein.' }
    ],
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
    historyTimeline: [
      {
        year: 'Abad ke-18',
        title: 'Era Kerajaan',
        aksara: 'ꦌꦫꦏꦼꦫꦗꦲꦤ꧀',
        description: 'Hidangan ini bermula dari racikan dapur tradisional yang secara cerdas memanfaatkan hasil bumi lokal. Resepnya menggunakan racikan rempah warisan leluhur yang kala itu sangat bernilai harganya.'
      },
      {
        year: '1900-an',
        title: 'Masa Kolonial',
        aksara: 'ꦩꦱꦏꦺꦴꦭꦺꦴꦤꦶꦪꦭ꧀',
        description: 'Mulai dijajakan secara meluas oleh para pedagang keliling menggunakan gerobak atau pikulan sederhana. Biasanya mereka berpusat di pusat kota, stasiun kereta, dan alun-alun keramaian.'
      },
      {
        year: '1945+',
        title: 'Pasca Kemerdekaan',
        aksara: 'ꦥꦱ꧀ꦕꦏꦼꦩꦼꦂꦢꦺꦏꦲꦤ꧀',
        description: 'Menjadi salah satu comfort food kebanggaan masyarakat lokal di tengah masa-masa transisi kemerdekaan. Makanan ini sukses menyatukan berbagai lapisan sosial ekonomi masyarakat dalam satu meja cita rasa.'
      },
      {
        year: '1990-an',
        title: 'Era Modernisasi',
        aksara: 'ꦌꦫꦩꦺꦴꦢꦼꦂꦤꦶꦱꦱꦶ',
        description: 'Sistem penyajian mulai mengalami penyesuaian menuju arah yang lebih modern dan komersial. Banyak warung permanen sengaja didirikan di pinggir jalan utama untuk melayani lonjakan peminat dari luar kota.'
      },
      {
        year: 'Masa Kini',
        title: 'Warisan Nusantara',
        aksara: 'ꦮꦫꦶꦱꦤ꧀ꦤꦸꦱꦤ꧀ꦠꦫ',
        description: 'Kini kuliner ini telah ditetapkan sebagai warisan mahakarya nusantara yang tak ternilai harganya. Cita rasanya yang otentik selalu dirindukan oleh para perantau dan giat dilestarikan oleh generasi muda.'
      }
    ],
    ingredients: [
      { name: 'daging-merah', description: 'Bahan dasar utama daging segar yang memberikan kaldu pekat dan tekstur memuaskan.' },
      { name: 'sayuran', description: 'Komponen segar penambah tekstur renyah, serat, dan warna alami pada hidangan.' },
      { name: 'saus-hitam', description: 'Bumbu fermentasi penambah rasa manis karamel dan warna eksotis.' },
      { name: 'santan', description: 'Ekstrak kelapa murni yang menyumbang rasa gurih lezat dan kekentalan kuah khas.' },
      { name: 'cabai', description: 'Bumbu pedas pembangkit selera yang memberikan sensasi hangat dan menantang lidah.' }
    ],
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
    historyTimeline: [
      {
        year: 'Abad ke-18',
        title: 'Era Kerajaan',
        aksara: 'ꦌꦫꦏꦼꦫꦗꦲꦤ꧀',
        description: 'Hidangan ini bermula dari racikan dapur tradisional yang secara cerdas memanfaatkan hasil bumi lokal. Resepnya menggunakan racikan rempah warisan leluhur yang kala itu sangat bernilai harganya.'
      },
      {
        year: '1900-an',
        title: 'Masa Kolonial',
        aksara: 'ꦩꦱꦏꦺꦴꦭꦺꦴꦤꦶꦪꦭ꧀',
        description: 'Mulai dijajakan secara meluas oleh para pedagang keliling menggunakan gerobak atau pikulan sederhana. Biasanya mereka berpusat di pusat kota, stasiun kereta, dan alun-alun keramaian.'
      },
      {
        year: '1945+',
        title: 'Pasca Kemerdekaan',
        aksara: 'ꦥꦱ꧀ꦕꦏꦼꦩꦼꦂꦢꦺꦏꦲꦤ꧀',
        description: 'Menjadi salah satu comfort food kebanggaan masyarakat lokal di tengah masa-masa transisi kemerdekaan. Makanan ini sukses menyatukan berbagai lapisan sosial ekonomi masyarakat dalam satu meja cita rasa.'
      },
      {
        year: '1990-an',
        title: 'Era Modernisasi',
        aksara: 'ꦌꦫꦩꦺꦴꦢꦼꦂꦤꦶꦱꦱꦶ',
        description: 'Sistem penyajian mulai mengalami penyesuaian menuju arah yang lebih modern dan komersial. Banyak warung permanen sengaja didirikan di pinggir jalan utama untuk melayani lonjakan peminat dari luar kota.'
      },
      {
        year: 'Masa Kini',
        title: 'Warisan Nusantara',
        aksara: 'ꦮꦫꦶꦱꦤ꧀ꦤꦸꦱꦤ꧀ꦠꦫ',
        description: 'Kini kuliner ini telah ditetapkan sebagai warisan mahakarya nusantara yang tak ternilai harganya. Cita rasanya yang otentik selalu dirindukan oleh para perantau dan giat dilestarikan oleh generasi muda.'
      }
    ],
    ingredients: [
      { name: 'daging-merah', description: 'Bahan dasar utama daging segar yang memberikan kaldu pekat dan tekstur memuaskan.' },
      { name: 'santan', description: 'Ekstrak kelapa murni yang menyumbang rasa gurih lezat dan kekentalan kuah khas.' },
      { name: 'bawang', description: 'Bumbu aromatik dasar Nusantara yang memberikan wangi khas dan rasa gurih mendalam.' },
      { name: 'saus-hitam', description: 'Bumbu fermentasi penambah rasa manis karamel dan warna eksotis.' },
      { name: 'daun-pisang', description: 'Pembungkus alami yang menyumbang aroma wangi khas saat dikukus atau dibakar.' }
    ],
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
    historyTimeline: [
      {
        year: 'Abad ke-18',
        title: 'Era Kerajaan',
        aksara: 'ꦌꦫꦏꦼꦫꦗꦲꦤ꧀',
        description: 'Hidangan ini bermula dari racikan dapur tradisional yang secara cerdas memanfaatkan hasil bumi lokal. Resepnya menggunakan racikan rempah warisan leluhur yang kala itu sangat bernilai harganya.'
      },
      {
        year: '1900-an',
        title: 'Masa Kolonial',
        aksara: 'ꦩꦱꦏꦺꦴꦭꦺꦴꦤꦶꦪꦭ꧀',
        description: 'Mulai dijajakan secara meluas oleh para pedagang keliling menggunakan gerobak atau pikulan sederhana. Biasanya mereka berpusat di pusat kota, stasiun kereta, dan alun-alun keramaian.'
      },
      {
        year: '1945+',
        title: 'Pasca Kemerdekaan',
        aksara: 'ꦥꦱ꧀ꦕꦏꦼꦩꦼꦂꦢꦺꦏꦲꦤ꧀',
        description: 'Menjadi salah satu comfort food kebanggaan masyarakat lokal di tengah masa-masa transisi kemerdekaan. Makanan ini sukses menyatukan berbagai lapisan sosial ekonomi masyarakat dalam satu meja cita rasa.'
      },
      {
        year: '1990-an',
        title: 'Era Modernisasi',
        aksara: 'ꦌꦫꦩꦺꦴꦢꦼꦂꦤꦶꦱꦱꦶ',
        description: 'Sistem penyajian mulai mengalami penyesuaian menuju arah yang lebih modern dan komersial. Banyak warung permanen sengaja didirikan di pinggir jalan utama untuk melayani lonjakan peminat dari luar kota.'
      },
      {
        year: 'Masa Kini',
        title: 'Warisan Nusantara',
        aksara: 'ꦮꦫꦶꦱꦤ꧀ꦤꦸꦱꦤ꧀ꦠꦫ',
        description: 'Kini kuliner ini telah ditetapkan sebagai warisan mahakarya nusantara yang tak ternilai harganya. Cita rasanya yang otentik selalu dirindukan oleh para perantau dan giat dilestarikan oleh generasi muda.'
      }
    ],
    ingredients: [
      { name: 'seafood', description: 'Hasil tangkapan laut segar penyumbang cita rasa gurih alami dan aroma khas.' },
      { name: 'santan', description: 'Ekstrak kelapa murni yang menyumbang rasa gurih lezat dan kekentalan kuah khas.' },
      { name: 'cabai', description: 'Bumbu pedas pembangkit selera yang memberikan sensasi hangat dan menantang lidah.' },
      { name: 'bawang', description: 'Bumbu aromatik dasar Nusantara yang memberikan wangi khas dan rasa gurih mendalam.' },
      { name: 'rempah-biji', description: 'Bumbu inti (ketumbar, merica, kemiri) yang mengunci kekayaan rasa masakan.' }
    ],
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
    historyTimeline: [
      {
        year: 'Abad ke-18',
        title: 'Era Kerajaan',
        aksara: 'ꦌꦫꦏꦼꦫꦗꦲꦤ꧀',
        description: 'Hidangan ini bermula dari racikan dapur tradisional yang secara cerdas memanfaatkan hasil bumi lokal. Resepnya menggunakan racikan rempah warisan leluhur yang kala itu sangat bernilai harganya.'
      },
      {
        year: '1900-an',
        title: 'Masa Kolonial',
        aksara: 'ꦩꦱꦏꦺꦴꦭꦺꦴꦤꦶꦪꦭ꧀',
        description: 'Mulai dijajakan secara meluas oleh para pedagang keliling menggunakan gerobak atau pikulan sederhana. Biasanya mereka berpusat di pusat kota, stasiun kereta, dan alun-alun keramaian.'
      },
      {
        year: '1945+',
        title: 'Pasca Kemerdekaan',
        aksara: 'ꦥꦱ꧀ꦕꦏꦼꦩꦼꦂꦢꦺꦏꦲꦤ꧀',
        description: 'Menjadi salah satu comfort food kebanggaan masyarakat lokal di tengah masa-masa transisi kemerdekaan. Makanan ini sukses menyatukan berbagai lapisan sosial ekonomi masyarakat dalam satu meja cita rasa.'
      },
      {
        year: '1990-an',
        title: 'Era Modernisasi',
        aksara: 'ꦌꦫꦩꦺꦴꦢꦼꦂꦤꦶꦱꦱꦶ',
        description: 'Sistem penyajian mulai mengalami penyesuaian menuju arah yang lebih modern dan komersial. Banyak warung permanen sengaja didirikan di pinggir jalan utama untuk melayani lonjakan peminat dari luar kota.'
      },
      {
        year: 'Masa Kini',
        title: 'Warisan Nusantara',
        aksara: 'ꦮꦫꦶꦱꦤ꧀ꦤꦸꦱꦤ꧀ꦠꦫ',
        description: 'Kini kuliner ini telah ditetapkan sebagai warisan mahakarya nusantara yang tak ternilai harganya. Cita rasanya yang otentik selalu dirindukan oleh para perantau dan giat dilestarikan oleh generasi muda.'
      }
    ],
    ingredients: [
      { name: 'tulang-iga', description: 'Bagian sapi penyumbang sari kaldu terenak dengan daging yang lumer.' },
      { name: 'bawang', description: 'Bumbu aromatik dasar Nusantara yang memberikan wangi khas dan rasa gurih mendalam.' },
      { name: 'rempah-biji', description: 'Bumbu inti (ketumbar, merica, kemiri) yang mengunci kekayaan rasa masakan.' },
      { name: 'rempah-daun', description: 'Kumpulan daun beraroma (salam, jeruk, serai) penyegar kuah dan hidangan.' }
    ],
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
    historyTimeline: [
      {
        year: 'Abad ke-18',
        title: 'Era Kerajaan',
        aksara: 'ꦌꦫꦏꦼꦫꦗꦲꦤ꧀',
        description: 'Hidangan ini bermula dari racikan dapur tradisional yang secara cerdas memanfaatkan hasil bumi lokal. Resepnya menggunakan racikan rempah warisan leluhur yang kala itu sangat bernilai harganya.'
      },
      {
        year: '1900-an',
        title: 'Masa Kolonial',
        aksara: 'ꦩꦱꦏꦺꦴꦭꦺꦴꦤꦶꦪꦭ꧀',
        description: 'Mulai dijajakan secara meluas oleh para pedagang keliling menggunakan gerobak atau pikulan sederhana. Biasanya mereka berpusat di pusat kota, stasiun kereta, dan alun-alun keramaian.'
      },
      {
        year: '1945+',
        title: 'Pasca Kemerdekaan',
        aksara: 'ꦥꦱ꧀ꦕꦏꦼꦩꦼꦂꦢꦺꦏꦲꦤ꧀',
        description: 'Menjadi salah satu comfort food kebanggaan masyarakat lokal di tengah masa-masa transisi kemerdekaan. Makanan ini sukses menyatukan berbagai lapisan sosial ekonomi masyarakat dalam satu meja cita rasa.'
      },
      {
        year: '1990-an',
        title: 'Era Modernisasi',
        aksara: 'ꦌꦫꦩꦺꦴꦢꦼꦂꦤꦶꦱꦱꦶ',
        description: 'Sistem penyajian mulai mengalami penyesuaian menuju arah yang lebih modern dan komersial. Banyak warung permanen sengaja didirikan di pinggir jalan utama untuk melayani lonjakan peminat dari luar kota.'
      },
      {
        year: 'Masa Kini',
        title: 'Warisan Nusantara',
        aksara: 'ꦮꦫꦶꦱꦤ꧀ꦤꦸꦱꦤ꧀ꦠꦫ',
        description: 'Kini kuliner ini telah ditetapkan sebagai warisan mahakarya nusantara yang tak ternilai harganya. Cita rasanya yang otentik selalu dirindukan oleh para perantau dan giat dilestarikan oleh generasi muda.'
      }
    ],
    ingredients: [
      { name: 'daging-merah', description: 'Bahan dasar utama daging segar yang memberikan kaldu pekat dan tekstur memuaskan.' },
      { name: 'bawang', description: 'Bumbu aromatik dasar Nusantara yang memberikan wangi khas dan rasa gurih mendalam.' },
      { name: 'saus-hitam', description: 'Bumbu fermentasi penambah rasa manis karamel dan warna eksotis.' },
      { name: 'rempah-biji', description: 'Bumbu inti (ketumbar, merica, kemiri) yang mengunci kekayaan rasa masakan.' }
    ],
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
    historyTimeline: [
      {
        year: 'Abad ke-18',
        title: 'Era Kerajaan',
        aksara: 'ꦌꦫꦏꦼꦫꦗꦲꦤ꧀',
        description: 'Hidangan ini bermula dari racikan dapur tradisional yang secara cerdas memanfaatkan hasil bumi lokal. Resepnya menggunakan racikan rempah warisan leluhur yang kala itu sangat bernilai harganya.'
      },
      {
        year: '1900-an',
        title: 'Masa Kolonial',
        aksara: 'ꦩꦱꦏꦺꦴꦭꦺꦴꦤꦶꦪꦭ꧀',
        description: 'Mulai dijajakan secara meluas oleh para pedagang keliling menggunakan gerobak atau pikulan sederhana. Biasanya mereka berpusat di pusat kota, stasiun kereta, dan alun-alun keramaian.'
      },
      {
        year: '1945+',
        title: 'Pasca Kemerdekaan',
        aksara: 'ꦥꦱ꧀ꦕꦏꦼꦩꦼꦂꦢꦺꦏꦲꦤ꧀',
        description: 'Menjadi salah satu comfort food kebanggaan masyarakat lokal di tengah masa-masa transisi kemerdekaan. Makanan ini sukses menyatukan berbagai lapisan sosial ekonomi masyarakat dalam satu meja cita rasa.'
      },
      {
        year: '1990-an',
        title: 'Era Modernisasi',
        aksara: 'ꦌꦫꦩꦺꦴꦢꦼꦂꦤꦶꦱꦱꦶ',
        description: 'Sistem penyajian mulai mengalami penyesuaian menuju arah yang lebih modern dan komersial. Banyak warung permanen sengaja didirikan di pinggir jalan utama untuk melayani lonjakan peminat dari luar kota.'
      },
      {
        year: 'Masa Kini',
        title: 'Warisan Nusantara',
        aksara: 'ꦮꦫꦶꦱꦤ꧀ꦤꦸꦱꦤ꧀ꦠꦫ',
        description: 'Kini kuliner ini telah ditetapkan sebagai warisan mahakarya nusantara yang tak ternilai harganya. Cita rasanya yang otentik selalu dirindukan oleh para perantau dan giat dilestarikan oleh generasi muda.'
      }
    ],
    ingredients: [
      { name: 'kedelai', description: 'Sumber protein nabati (tahu/tempe/kecap) yang sangat merakyat.' },
      { name: 'seafood', description: 'Hasil tangkapan laut segar penyumbang cita rasa gurih alami dan aroma khas.' },
      { name: 'kacang', description: 'Bahan saus atau taburan yang memberikan tekstur renyah dan profil rasa legit gurih.' },
      { name: 'saus-hitam', description: 'Bumbu fermentasi penambah rasa manis karamel dan warna eksotis.' },
      { name: 'sayuran', description: 'Komponen segar penambah tekstur renyah, serat, dan warna alami pada hidangan.' }
    ],
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
    historyTimeline: [
      {
        year: 'Abad ke-18',
        title: 'Era Kerajaan',
        aksara: 'ꦌꦫꦏꦼꦫꦗꦲꦤ꧀',
        description: 'Hidangan ini bermula dari racikan dapur tradisional yang secara cerdas memanfaatkan hasil bumi lokal. Resepnya menggunakan racikan rempah warisan leluhur yang kala itu sangat bernilai harganya.'
      },
      {
        year: '1900-an',
        title: 'Masa Kolonial',
        aksara: 'ꦩꦱꦏꦺꦴꦭꦺꦴꦤꦶꦪꦭ꧀',
        description: 'Mulai dijajakan secara meluas oleh para pedagang keliling menggunakan gerobak atau pikulan sederhana. Biasanya mereka berpusat di pusat kota, stasiun kereta, dan alun-alun keramaian.'
      },
      {
        year: '1945+',
        title: 'Pasca Kemerdekaan',
        aksara: 'ꦥꦱ꧀ꦕꦏꦼꦩꦼꦂꦢꦺꦏꦲꦤ꧀',
        description: 'Menjadi salah satu comfort food kebanggaan masyarakat lokal di tengah masa-masa transisi kemerdekaan. Makanan ini sukses menyatukan berbagai lapisan sosial ekonomi masyarakat dalam satu meja cita rasa.'
      },
      {
        year: '1990-an',
        title: 'Era Modernisasi',
        aksara: 'ꦌꦫꦩꦺꦴꦢꦼꦂꦤꦶꦱꦱꦶ',
        description: 'Sistem penyajian mulai mengalami penyesuaian menuju arah yang lebih modern dan komersial. Banyak warung permanen sengaja didirikan di pinggir jalan utama untuk melayani lonjakan peminat dari luar kota.'
      },
      {
        year: 'Masa Kini',
        title: 'Warisan Nusantara',
        aksara: 'ꦮꦫꦶꦱꦤ꧀ꦤꦸꦱꦤ꧀ꦠꦫ',
        description: 'Kini kuliner ini telah ditetapkan sebagai warisan mahakarya nusantara yang tak ternilai harganya. Cita rasanya yang otentik selalu dirindukan oleh para perantau dan giat dilestarikan oleh generasi muda.'
      }
    ],
    ingredients: [
      { name: 'tepung', description: 'Bahan penyatu dan pengental yang memberikan tekstur kenyal sempurna.' },
      { name: 'santan', description: 'Ekstrak kelapa murni yang menyumbang rasa gurih lezat dan kekentalan kuah khas.' },
      { name: 'gula-merah', description: 'Pemanis alami aren yang memberi sentuhan manis legit khas masakan Jawa.' },
      { name: 'gula-pasir', description: 'Pemanis kristal murni untuk menyeimbangkan rasa rempah dan gurih santan.' }
    ],
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
    historyTimeline: [
      {
        year: 'Abad ke-18',
        title: 'Era Kerajaan',
        aksara: 'ꦌꦫꦏꦼꦫꦗꦲꦤ꧀',
        description: 'Hidangan ini bermula dari racikan dapur tradisional yang secara cerdas memanfaatkan hasil bumi lokal. Resepnya menggunakan racikan rempah warisan leluhur yang kala itu sangat bernilai harganya.'
      },
      {
        year: '1900-an',
        title: 'Masa Kolonial',
        aksara: 'ꦩꦱꦏꦺꦴꦭꦺꦴꦤꦶꦪꦭ꧀',
        description: 'Mulai dijajakan secara meluas oleh para pedagang keliling menggunakan gerobak atau pikulan sederhana. Biasanya mereka berpusat di pusat kota, stasiun kereta, dan alun-alun keramaian.'
      },
      {
        year: '1945+',
        title: 'Pasca Kemerdekaan',
        aksara: 'ꦥꦱ꧀ꦕꦏꦼꦩꦼꦂꦢꦺꦏꦲꦤ꧀',
        description: 'Menjadi salah satu comfort food kebanggaan masyarakat lokal di tengah masa-masa transisi kemerdekaan. Makanan ini sukses menyatukan berbagai lapisan sosial ekonomi masyarakat dalam satu meja cita rasa.'
      },
      {
        year: '1990-an',
        title: 'Era Modernisasi',
        aksara: 'ꦌꦫꦩꦺꦴꦢꦼꦂꦤꦶꦱꦱꦶ',
        description: 'Sistem penyajian mulai mengalami penyesuaian menuju arah yang lebih modern dan komersial. Banyak warung permanen sengaja didirikan di pinggir jalan utama untuk melayani lonjakan peminat dari luar kota.'
      },
      {
        year: 'Masa Kini',
        title: 'Warisan Nusantara',
        aksara: 'ꦮꦫꦶꦱꦤ꧀ꦤꦸꦱꦤ꧀ꦠꦫ',
        description: 'Kini kuliner ini telah ditetapkan sebagai warisan mahakarya nusantara yang tak ternilai harganya. Cita rasanya yang otentik selalu dirindukan oleh para perantau dan giat dilestarikan oleh generasi muda.'
      }
    ],
    ingredients: [
      { name: 'mie', description: 'Karbohidrat untaian kenyal peninggalan perpaduan budaya.' },
      { name: 'tepung', description: 'Bahan penyatu dan pengental yang memberikan tekstur kenyal sempurna.' },
      { name: 'gula-merah', description: 'Pemanis alami aren yang memberi sentuhan manis legit khas masakan Jawa.' },
      { name: 'bawang', description: 'Bumbu aromatik dasar Nusantara yang memberikan wangi khas dan rasa gurih mendalam.' },
      { name: 'sayuran', description: 'Komponen segar penambah tekstur renyah, serat, dan warna alami pada hidangan.' }
    ],
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
    historyTimeline: [
      {
        year: 'Abad ke-18',
        title: 'Era Kerajaan',
        aksara: 'ꦌꦫꦏꦼꦫꦗꦲꦤ꧀',
        description: 'Hidangan ini bermula dari racikan dapur tradisional yang secara cerdas memanfaatkan hasil bumi lokal. Resepnya menggunakan racikan rempah warisan leluhur yang kala itu sangat bernilai harganya.'
      },
      {
        year: '1900-an',
        title: 'Masa Kolonial',
        aksara: 'ꦩꦱꦏꦺꦴꦭꦺꦴꦤꦶꦪꦭ꧀',
        description: 'Mulai dijajakan secara meluas oleh para pedagang keliling menggunakan gerobak atau pikulan sederhana. Biasanya mereka berpusat di pusat kota, stasiun kereta, dan alun-alun keramaian.'
      },
      {
        year: '1945+',
        title: 'Pasca Kemerdekaan',
        aksara: 'ꦥꦱ꧀ꦕꦏꦼꦩꦼꦂꦢꦺꦏꦲꦤ꧀',
        description: 'Menjadi salah satu comfort food kebanggaan masyarakat lokal di tengah masa-masa transisi kemerdekaan. Makanan ini sukses menyatukan berbagai lapisan sosial ekonomi masyarakat dalam satu meja cita rasa.'
      },
      {
        year: '1990-an',
        title: 'Era Modernisasi',
        aksara: 'ꦌꦫꦩꦺꦴꦢꦼꦂꦤꦶꦱꦱꦶ',
        description: 'Sistem penyajian mulai mengalami penyesuaian menuju arah yang lebih modern dan komersial. Banyak warung permanen sengaja didirikan di pinggir jalan utama untuk melayani lonjakan peminat dari luar kota.'
      },
      {
        year: 'Masa Kini',
        title: 'Warisan Nusantara',
        aksara: 'ꦮꦫꦶꦱꦤ꧀ꦤꦸꦱꦤ꧀ꦠꦫ',
        description: 'Kini kuliner ini telah ditetapkan sebagai warisan mahakarya nusantara yang tak ternilai harganya. Cita rasanya yang otentik selalu dirindukan oleh para perantau dan giat dilestarikan oleh generasi muda.'
      }
    ],
    ingredients: [
      { name: 'umbi-buah', description: 'Bahan karbohidrat atau isian alami penambah tekstur dan cita rasa unik.' },
      { name: 'gula-pasir', description: 'Pemanis kristal murni untuk menyeimbangkan rasa rempah dan gurih santan.' }
    ],
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
    historyTimeline: [
      {
        year: 'Abad ke-18',
        title: 'Era Kerajaan',
        aksara: 'ꦌꦫꦏꦼꦫꦗꦲꦤ꧀',
        description: 'Hidangan ini bermula dari racikan dapur tradisional yang secara cerdas memanfaatkan hasil bumi lokal. Resepnya menggunakan racikan rempah warisan leluhur yang kala itu sangat bernilai harganya.'
      },
      {
        year: '1900-an',
        title: 'Masa Kolonial',
        aksara: 'ꦩꦱꦏꦺꦴꦭꦺꦴꦤꦶꦪꦭ꧀',
        description: 'Mulai dijajakan secara meluas oleh para pedagang keliling menggunakan gerobak atau pikulan sederhana. Biasanya mereka berpusat di pusat kota, stasiun kereta, dan alun-alun keramaian.'
      },
      {
        year: '1945+',
        title: 'Pasca Kemerdekaan',
        aksara: 'ꦥꦱ꧀ꦕꦏꦼꦩꦼꦂꦢꦺꦏꦲꦤ꧀',
        description: 'Menjadi salah satu comfort food kebanggaan masyarakat lokal di tengah masa-masa transisi kemerdekaan. Makanan ini sukses menyatukan berbagai lapisan sosial ekonomi masyarakat dalam satu meja cita rasa.'
      },
      {
        year: '1990-an',
        title: 'Era Modernisasi',
        aksara: 'ꦌꦫꦩꦺꦴꦢꦼꦂꦤꦶꦱꦱꦶ',
        description: 'Sistem penyajian mulai mengalami penyesuaian menuju arah yang lebih modern dan komersial. Banyak warung permanen sengaja didirikan di pinggir jalan utama untuk melayani lonjakan peminat dari luar kota.'
      },
      {
        year: 'Masa Kini',
        title: 'Warisan Nusantara',
        aksara: 'ꦮꦫꦶꦱꦤ꧀ꦤꦸꦱꦤ꧀ꦠꦫ',
        description: 'Kini kuliner ini telah ditetapkan sebagai warisan mahakarya nusantara yang tak ternilai harganya. Cita rasanya yang otentik selalu dirindukan oleh para perantau dan giat dilestarikan oleh generasi muda.'
      }
    ],
    ingredients: [
      { name: 'daging-merah', description: 'Bahan dasar utama daging segar yang memberikan kaldu pekat dan tekstur memuaskan.' },
      { name: 'rempah-biji', description: 'Bumbu inti (ketumbar, merica, kemiri) yang mengunci kekayaan rasa masakan.' },
      { name: 'bawang', description: 'Bumbu aromatik dasar Nusantara yang memberikan wangi khas dan rasa gurih mendalam.' },
      { name: 'kelapa-parut', description: 'Serutan daging kelapa untuk pelapis jajanan atau bahan serundeng gurih.' }
    ],
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
