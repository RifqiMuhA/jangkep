# Jangkep — Project Brief
### Rancangan Website Kuliner Jawa Tengah · Versi Final

---

## Identitas Brand

**Nama:** Jangkep
**Tagline:** *"Jangkep Rasane, Jangkep Critane"* — Lengkap Rasanya, Lengkap Ceritanya
**Konsep:** Website eksplorasi kuliner Jawa Tengah yang immersive dan interaktif. Bukan direktori resep biasa, melainkan perjalanan budaya melalui makanan — dari sejarah, rempah, peta, hingga cara memasak.
**Konteks:** Dibuat untuk lomba web design dengan tema "Culinary Journey: Menjelajahi Rasa dalam Website."

**Struktur URL:**
- `/` → Beranda
- `/maps` → Story Maps
- `/kuliner/[nama]` → Detail Kuliner
- `/games` → Mini Games

---

## Maskot — Si Podo

**Jenis:** Burung Kepodang, maskot resmi Provinsi Jawa Tengah
**Nama:** Si Podo

**Kepribadian:**
Cerewet, penasaran, antusias, suka pamer pengetahuan kuliner. Melompat-lompat saat user benar, pura-pura pingsan dramatis saat salah. Hadir sebagai teman perjalanan — bukan sekadar dekorasi.

**Penampilan:**
Warna kuning cerah dengan aksen hitam khas Kepodang. Blangkon batik miring di kepala. Celana batik Kawung. Kadang membawa sendok kayu atau mangkuk kecil. Gaya ilustrasi doodle semi-flat, ekspresif dan penuh emosi. Aset sudah tersedia.

**Variasi Pose yang Dibutuhkan:**

| Pose | Penggunaan |
|------|-----------|
| Melambai (sudah ada) | Beranda, navigasi umum, footer |
| Melompat gembira | Jawaban benar, skor tinggi, level selesai |
| Kaget / geleng kepala | Jawaban salah, bahan salah di-drop |
| Menunjuk | Tooltip, tutorial, call-to-action |

**Kemunculan Per Halaman:**
- Beranda → sudut kanan bawah, dialog bubble sapaan
- Story Maps → sudut peta saat Auto-Journey aktif
- Detail Kuliner → pojok kecil sebagai pendamping membaca
- Mini Games → host utama, besar dan ekspresif, selalu di layar
- Footer tiap halaman → duduk kecil melambaikan sayap

---

## Identitas Visual

Lihat `design.md` untuk token lengkap, CSS custom properties, component specs, dan do's & don'ts.

**Ringkasan identitas:**
- **Palet:** Coklat Batik `#3B1F0C` + Krem Mori `#F2EAD3` sebagai dua kutub utama, Kuning Kepodang `#F5C400` sebagai aksen tunggal bold
- **Tipografi:** Playfair Display (display) + DM Sans (body) + Noto Sans Javanese (aksen dekoratif)
- **Tekstur:** Batik Parang (section dinamis) dan Batik Kawung (section terstruktur) sebagai grain layer opacity 8–15%
- **Art style:** Editorial flat illustration + grain batik texture + foto asli untuk hero dan how-to-cook
- **Transisi:** Barba.js wipe motif Parang, smooth scroll Lenis

---

## Stack Teknis

| Kebutuhan | Library / Tool |
|---|---|
| Smooth scroll | Lenis |
| Animasi scroll | GSAP + ScrollTrigger |
| Page transition | Barba.js |
| Fisika rempah & bahan | Matter.js |
| Peta interaktif | Mapbox GL JS |
| Custom map style | Mapbox Studio |
| Komponen UI | Aceternity UI + ReactBits + ui-layouts |
| Drag & drop game | HTML5 Drag & Drop API + Touch Events |
| Font | Playfair Display + DM Sans + Noto Sans Javanese |

**Referensi Library:**
- Matter.js → https://www.brm.io/matter-js/
- Barba.js → https://barba.js.org/
- Aceternity UI → https://ui.aceternity.com/
- ReactBits → https://reactbits.dev/
- UI Layouts → https://www.ui-layouts.com/components/

---

## Referensi Desain

| Website | URL | Inspirasi |
|---|---|---|
| Gourou Indian Food | gourouindianfood.fr | Page transition, identitas budaya bold |
| Thessaloniki Sto Piato | thessalonikistopiato.gr | Peta kuliner, layout resep per makanan |
| Locavore NXT | locavorenxt.com/family | Galeri card cinematic |
| Design Beyond Barriers | designbeyondbarriers.com | Karakter doodle ekspresif, jejer orang |
| Wisprflow | wisprflow.ai | Design pattern modern |
| Flying Papers | flyingpapers.com | Maskot animasi bereaksi |

---

## Halaman 1 — Beranda

**Fungsi:** Membangun atmosfer Jawa Tengah sejak detik pertama dan mendorong user menjelajah lebih dalam ke tiga halaman lainnya.

---

### Section 01 — Hero

Full viewport. Background video loop atau foto slideshow berlapis: dapur tradisional Solo di pagi hari, asap mengepul dari kuali, pasar Beringharjo, tangan ibu membatik.

**Konten:**
- Headline besar animasi char-by-char dalam Playfair Display: *"Jangkep Rasane, Jangkep Critane"*
- Aksara Jawa dari kata "Jangkep" sebagai elemen tipografi dekoratif di sudut kiri atas
- Parallax mouse-tracking subtle pada layer teks dan layer foto
- Tombol CTA: *"Mulai Perjalanan"* — border Emas Keris, background transparan
- Scroll indicator beranimasi di bawah
- Si Podo di sudut kanan bawah, dialog bubble DM Sans: *"Wis siap njelajah Jawa Tengah?"*

**Background:** Coklat Batik + grain Parang tipis

---

### Section 02 — Flavor Teaser "Rempah Jawa"

Rempah khas Jawa Tengah melayang bebas dengan fisika Matter.js di atas background Coklat Batik.

**Rempah yang ditampilkan:** Kluwek, kemiri, daun salam, serai, lengkuas, kencur, ketumbar, gula merah

**Interaksi:**
- User bisa klik dan lempar setiap rempah — ada sensasi fisik menyenangkan
- Klik rempah → tooltip muncul: nama rempah, peran di masakan Jawa, contoh makanan yang memakainya

**Teks ambient** muncul saat scroll masuk, Playfair Display Italic: *"Dari rempah-rempah inilah semua dimulai."*

**Background:** Coklat Batik + grain Parang

---

### Section 03 — Mini Peta Teaser

Peta SVG Jawa Tengah per kabupaten/kota di atas background Krem Mori. Ini appetizer visual, bukan fitur utama.

**Interaksi:**
- Hover tiap kota → nama kota + foto thumbnail makanan khas muncul sebagai tooltip

**Data tooltip per kota (contoh):**
Semarang → Lumpia · Solo → Nasi Liwet · Kudus → Soto Kudus · Banyumas → Mendoan · Wonosobo → Mie Ongklok · Magelang → Kupat Tahu · Pekalongan → Tauto

**CTA:** *"Jelajahi Peta Lengkap"* → mengarah ke Story Maps

**Background:** Krem Mori + grain Kawung

---

### Section 04 — Featured Kuliner

Empat makanan ikonik Jawa Tengah dalam card besar bergaya editorial majalah.

**Makanan featured:** Gudeg · Nasi Liwet Solo · Lumpia Semarang · Tengkleng

**Layout:** Asimetris — card pertama lebih besar di kiri, tiga lainnya lebih kecil di kanan

**Interaksi:**
- Hover → card tilt 3D + reveal deskripsi singkat dan flavor tags di overlay gelap
- Klik → Barba.js page transition ke halaman Detail Kuliner makanan tersebut

**Background:** Krem Mori

---

### Section 05 — Promo Games

Ilustrasi bahan masakan Jawa berserakan di canvas dengan animasi floating organik.

**Konten:**
- Si Podo berdiri di tengah memegang sendok kayu, pose menantang/menunjuk
- Dialog bubble DM Sans Bold: *"Ayo, bisa tebak ini masakan apa?"*
- CTA besar Kuning Kepodang ke Mini Games

**Background:** Coklat Batik + grain Parang

---

### Section 06 — Footer

**Konten:**
- Navigasi ke empat halaman dalam grid
- Border atas: Batik Parang tipis opacity rendah
- Quote Jawa dalam Playfair Display Italic: *"Mangan ora mangan sing penting kumpul"*
- Terjemahan DM Sans kecil di bawah quote
- Aksara Jawa dekoratif sebagai ornamen
- Credit sumber data kuliner (Kemenparekraf / Pesona Indonesia)
- Si Podo kecil duduk di pojok kanan bawah, melambaikan sayap

**Background:** Coklat Batik + grain Parang

---

## Halaman 2 — Story Maps

**Fungsi:** Peta interaktif Jawa Tengah level kota/kabupaten. Karena fokus satu provinsi, detail peta jauh lebih bermakna — bisa zoom ke level kecamatan, terrain pegunungan Jawa Tengah terlihat.

---

### Section 01 — Header Filter

Pill filter per sub-wilayah dengan border Emas Keris saat aktif.

**Opsi filter:** Semua | Semarang Raya | Solo Raya | Banyumas & Kedu | Pantura | Muria & Pati

**Interaksi:**
- Klik filter → Mapbox `flyTo()` smooth ke sub-region + pin difilter otomatis
- Search bar: cari nama makanan atau nama kota

---

### Section 02 — Peta Mapbox

**Spesifikasi:**
- Custom map style dari Mapbox Studio: earthy tone coklat tanah, hijau sawah muted, tanpa biru terang generik
- Selaras penuh dengan palet Jangkep
- Marker custom SVG per kota: berbentuk piring kecil dengan ikon ilustrasi flat makanan khasnya
- Daerah dengan banyak makanan: cluster yang mengembang saat zoom in
- Klik marker → `flyTo()` smooth ke kota tersebut
- Terrain 3D opsional: Gunung Merapi, Merbabu, Dieng, Sindoro, Slamet terlihat sebagai kontur

---

### Data Pin Per Kota

| Kota | Makanan |
|------|---------|
| Semarang | Lumpia, Bandeng Presto, Tahu Gimbal, Wingko Babat |
| Solo | Nasi Liwet, Timlo, Serabi Solo, Tengkleng, Selat Solo |
| Kudus | Soto Kudus, Jenang Kudus, Lentog Tanjung |
| Banyumas | Mendoan, Sroto Sokaraja, Gethuk Goreng |
| Magelang | Kupat Tahu Magelang, Sop Senerek |
| Pekalongan | Tauto, Megono |
| Wonosobo | Mie Ongklok, Tempe Kemul |
| Rembang | Sate Serepeh, Lontong Tuyuhan |
| Demak | Nasi Ndoreng |
| Salatiga | Enting-enting Gepuk |

---

### Section 03 — Story Panel

Muncul slide-in dari kanan saat marker diklik. Bottom sheet di mobile.

**Background:** Krem Mori + grain Kawung

**Isi panel (atas ke bawah):**
1. Foto hero makanan full-width tanpa radius
2. Narasi 2–3 paragraf sejarah dan budaya dalam DM Sans
3. Flavor badge berwarna: Manis / Gurih / Pedas / Segar / Legit
4. Nama kota asal
5. Related makanan dari kota yang sama (thumbnail kecil)
6. CTA border Emas Keris: *"Lihat Resep Lengkap"* → Barba.js transition ke Detail Kuliner

---

### Section 04 — Auto-Journey Mode "Tur Bareng Si Podo"

Tombol "Tur Otomatis" di pojok peta.

**Alur:**
Peta berjalan sendiri mengikuti rute Brebes → Rembang melewati 10 stop kota kuliner ikonik. Tiap stop: `flyTo` → story panel auto-buka → Si Podo muncul di sudut dengan dialog tentang kota itu → 6 detik → lanjut otomatis.

**UI Control:** Pause/resume button + progress dots di bawah peta

**Kesan:** Mini-documentary kuliner Jawa Tengah

---

## Halaman 3 — Detail Kuliner

**Fungsi:** Halaman detail per makanan. Layout editorial bergaya majalah kuliner premium.

**URL dinamis:** `/kuliner/gudeg` · `/kuliner/nasi-liwet` · `/kuliner/lumpia` · dst.

**Background dominan:** Krem Mori + grain Kawung

**Motion:** Semua section muncul dengan animasi GSAP ScrollTrigger saat di-scroll

Si Podo hadir kecil di pojok sebagai pendamping membaca.

---

### Section 01 — Hero

Foto makanan full-width dengan parallax scroll — foto bergerak lebih lambat dari kecepatan scroll, menciptakan kedalaman.

**Konten:**
- Nama makanan: Playfair Display besar di kiri bawah
- Overlay: gradient Coklat Batik ke transparan dari bawah
- Badge cepat di bawah nama (DM Sans): kota asal · flavor tags · tingkat kesulitan (Mudah / Sedang / Butuh Kesabaran)
- Breadcrumb: Beranda → Story Maps → Gudeg

---

### Section 02 — Cerita & Sejarah

Layout dua kolom asimetris.

**Kiri:** Narasi editorial panjang dalam DM Sans — asal-usul makanan, hubungan dengan budaya dan sejarah Jawa Tengah, konteks geografis dan sosial.

**Kanan:** Foto suasana atau pull quote besar dalam Playfair Display Italic.

**Elemen tambahan:**
- Satu quote Jawa dibesarkan sebagai elemen tipografi dekoratif full-width
- Aksara Jawa kecil sebagai ornamen divider antar paragraf

**Contoh konten Gudeg:** Kaitan dengan keraton Solo dan Yogya, mengapa warnanya coklat tua dari kluwek, perbedaan Gudeg basah vs kering, peran dalam budaya hajatan Jawa.

---

### Section 03 — Karakter "Jejer Orang" Warga Lokal

Dua karakter ilustrasi flat berwarna sesuai palet Jangkep berdiri di sisi narasi dengan dialog bubble.

**Contoh karakter:** Ibu penjual gudeg pasar + bapak tua pelanggan setia

**Dialog bubble:** DM Sans Bold, border Emas Keris, background Putih Santan. Ibu bercerita cara membuat yang benar, bapak bercerita kenangan makan sejak kecil.

**Background:** Krem Mori + grain Kawung

**Tujuan:** Memberi kesan cerita dituturkan langsung oleh orangnya, bukan sekadar teks editorial.

---

### Section 04 — Ingredients

Grid card per bahan di atas background Krem Mori.

**Tiap card berisi:**
- Foto bulat asli (bukan emoji/ikon vektor) — border-radius 9999px, ukuran 72px × 72px
- Nama bahan: DM Sans 13px weight 500
- Jumlah bahan: DM Sans 12px Krem Tua

**Pengelompokan** dengan divider motif batik tipis warna Emas Keris:
1. Bahan Utama
2. Bumbu Halus
3. Bumbu Cemplung

**Interaksi:**
- Hover tiap bahan → tooltip fun fact singkat (background Coklat Batik, teks Krem Mori)
- Serving adjuster +/− di atas grid → semua angka berubah otomatis dengan animasi counter

**Contoh tooltip Kluwek:** *"Kluwek adalah jiwa dari Rawon dan Gudeg — tanpanya, warna hitam legam itu tidak ada."*

---

### Section 05 — Nutrition Information

Infografis mini berwarna, bukan tabel HTML kering.

**Komponen:**
- Kalori: donut chart progress dari kebutuhan harian 2000 kkal, warna Kuning Kepodang
- Protein, karbohidrat, lemak, serat: horizontal bar warna berbeda, animate masuk dari kiri saat scroll
- Vitamin & mineral: badge pill kecil warna Kuning Kepodang dan Emas Keris
- Toggle per 100g / per porsi: angka berubah dengan animasi

**Disclaimer:** DM Sans 12px Krem Tua — *"Nilai gizi merupakan estimasi per sajian standar."*

---

### Section 06 — How to Cook "Jejer Orang Memasak"

Section paling distinctive. Setiap langkah memasak diwakili satu karakter ilustrasi flat Jawa dalam pose memasak yang berbeda.

**Karakter per langkah (contoh):**
Mengulek bumbu · Menumis · Menuang santan · Mengaduk · Mencicipi · Menghidangkan

**Visual karakter:**
- Pakaian batik Kawung warna Coklat Batik dan Krem Mori, aksen Kuning Kepodang
- Ekspresi hidup dan bervariasi per langkah
- Background transparan di atas Krem Mori + grain Kawung
- Dialog bubble DM Sans Bold, border Emas Keris, berisi instruksi langkah

**Layout:**
- Desktop: karakter berjajar horizontal, user scroll horizontal mengikuti urutan
- Mobile: karakter vertikal dengan layout sticky nomor langkah di kiri

**Fitur tambahan:**
- Langkah dengan waktu lama → cooking timer interaktif di dalam / bawah dialog bubble
- Nama bahan dalam teks di-highlight Kuning Kepodang → hover menampilkan foto bahan dari section Ingredients
- Progress bar fixed di atas layar bergerak seiring langkah dibaca

---

### Section 07 — Related & CTA

**Konten:**
- Tiga makanan lain dari kota yang sama atau profil rasa mirip dalam card horizontal
- Tombol kembali ke Story Maps (dengan pin kota makanan ini sudah aktif)
- CTA ke Mini Games: *"Ayo susun bahan [nama makanan] bareng Si Podo!"*

---

## Halaman 4 — Mini Games

**Fungsi:** Halaman gamifikasi dengan tiga permainan interaktif berbasis drag & drop dan quiz. Ringan, fun, dan edukatif.

**Si Podo** sebagai host penuh — besar, ekspresif, selalu ada di layar.

**Background:** Coklat Batik + grain Parang

**UI pendukung:**
- Progress bar perjalanan antar game di atas halaman
- Badge pencapaian setelah tiap game
- Leaderboard skor lokal dari localStorage

---

### Game 1 — Susun Bahan "Racik Masakan Jawa"
*(Game utama — Drag & Drop)*

**Mekanisme:**
Target foto makanan Jawa Tengah ditampilkan di tengah layar. User drag bahan-bahan yang benar ke dalam wajan dari 10–12 item acak (termasuk decoy).

**Feedback interaksi:**
- Bahan benar → snap ke wajan + animasi satisfying + Si Podo manggut-manggut gembira
- Bahan salah → mental balik dengan fisika Matter.js + Si Podo geleng kepala dramatis
- Semua bahan lengkap → animasi memasak + Si Podo menari + confetti Kuning Kepodang + skor muncul

**Level tersedia:** Gudeg · Nasi Liwet · Lumpia · Mendoan · Tengkleng · Sroto Sokaraja

**Teknis:** HTML5 Drag & Drop API untuk desktop, Touch Events untuk mobile, Matter.js untuk fisika bahan yang mental.

---

### Game 2 — Cocokkan Asal "Dari Kota Mana?"
*(Drag & Drop ke Peta)*

**Layout:**
- Kiri layar: empat foto makanan Jawa Tengah
- Kanan layar: peta SVG Jawa Tengah dengan zona drop per kota

**Mekanisme:** User drag foto makanan ke kota asal yang benar.

**Feedback interaksi:**
- Benar → kota glowing Kuning Kepodang + Si Podo bersorak + narasi singkat kota muncul
- Salah → Si Podo terkejut + foto kembali ke posisi awal

**Aturan:** Timer 60 detik. Skor akhir bisa di-screenshot.

**Nilai tambah:** Game ini memperkuat koneksi visual ke halaman Story Maps.

---

### Game 3 — Tebak Masakan "Kenali Masakanmu"
*(Quiz Visual)*

**Mekanisme:** Foto makanan Jawa Tengah ditampilkan blur/pixelated, makin lama makin clear. User pilih dari empat opsi jawaban.

**Feedback interaksi:**
- Benar → fun fact tentang makanan muncul + Si Podo melompat gembira
- Salah → Si Podo pura-pura pingsan dramatis

**Aturan:** Sepuluh soal total.

**Badge akhir** dalam Playfair Display:
- Skor 1–4 benar → *"Murid Si Podo"*
- Skor 5–7 benar → *"Koki Jawa"*
- Skor 8–10 benar → *"Empu Kuliner Jawa Tengah"*

---

## Alur Koneksi Antar Halaman

```
BERANDA
├── Rempah Matter.js → membangkitkan rasa ingin tahu
├── Mini peta teaser → [klik CTA] →
│
STORY MAPS
├── Klik pin kota → baca story panel
├── [klik "Lihat Resep Lengkap"] →
│
DETAIL KULINER
├── Baca cerita, ingredients, nutrition, how-to-cook
├── [klik "Ayo bareng Si Podo!"] →
│
MINI GAMES
├── Main tiga game, kumpulkan badge
└── Si Podo beri badge → [kembali ke Beranda]
```

Tidak ada halaman yang buntu. Setiap ujung halaman mendorong ke halaman berikutnya secara natural dan kontekstual.

---

## Konten Kuliner — Daftar Makanan

Prioritas konten yang perlu disiapkan untuk launch (Detail Kuliner):

| Makanan | Kota | Kesulitan | Prioritas |
|---------|------|-----------|----------|
| Gudeg | Solo / Jogja border | Butuh Kesabaran | ★★★ |
| Nasi Liwet | Solo | Sedang | ★★★ |
| Lumpia | Semarang | Mudah | ★★★ |
| Tengkleng | Solo | Sedang | ★★★ |
| Mendoan | Banyumas | Mudah | ★★ |
| Soto Kudus | Kudus | Sedang | ★★ |
| Sroto Sokaraja | Banyumas | Sedang | ★★ |
| Mie Ongklok | Wonosobo | Sedang | ★★ |
| Kupat Tahu Magelang | Magelang | Mudah | ★ |
| Tauto | Pekalongan | Sedang | ★ |

---

## Sumber Data yang Direkomendasikan

- Kementerian Pariwisata dan Ekonomi Kreatif (Kemenparekraf)
- Pesona Indonesia — pesona.indonesia.travel
- Wikipedia Indonesia — untuk sejarah dan konteks budaya
- USDA FoodData Central — untuk data nutrisi estimasi
- Cookpad Indonesia — untuk referensi bahan dan takaran