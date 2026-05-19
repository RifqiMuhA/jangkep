# Jangkep — Style Reference
> Tanah rempah, warisan rasa

**Theme:** warm-light / dark-earth dual

Jangkep mengusung estetika editorial kuliner yang hangat dan organik, terinspirasi dari kain batik Jawa, tanah rempah, dan warisan budaya Jawa Tengah. Bahasa visualnya memadukan tipografi serif elegan dengan ilustrasi flat berwarna penuh, dilapisi grain tekstur motif batik sebagai pengganti noise digital biasa. Warna didominasi oleh Coklat Batik gelap dan Krem Mori terang sebagai dua kutub utama — bergantian antar section — dengan Kuning Kepodang sebagai aksen tunggal yang bold dan memorable. Komponen terasa hangat, bukan steril; berkarakter, bukan generik.

---

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Krem Mori | `#F2EAD3` | `--color-krem-mori` | Background light section, surface card, dialog bubble background |
| Coklat Batik | `#3B1F0C` | `--color-coklat-batik` | Background dark section, teks utama di atas Krem Mori, border kuat |
| Kuning Kepodang | `#F5C400` | `--color-kuning-kepodang` | Aksen utama, CTA button fill, highlight teks, flavor tag aktif, confetti game |
| Emas Keris | `#B8860B` | `--color-emas-keris` | Detail premium, border card, ornamen dekoratif, dialog bubble border, divider |
| Hijau Daun Pisang | `#4A7C3F` | `--color-hijau-daun` | Flavor tag "Segar", aksen nature, badge secondary |
| Krem Tua | `#C8B89A` | `--color-krem-tua` | Teks sekunder di atas Krem Mori, border subtle, muted UI element |
| Putih Santan | `#FAF7F0` | `--color-putih-santan` | Surface paling terang, elevated card di atas Krem Mori |
| Hitam Arang | `#1A0A02` | `--color-hitam-arang` | Teks bold maksimum, graphic fill, elemen kontras tinggi |

### Kombinasi Background Resmi

| Section Type | Background | Text Utama | Aksen |
|---|---|---|---|
| Light section | `#F2EAD3` Krem Mori | `#3B1F0C` Coklat Batik | `#F5C400` Kuning Kepodang |
| Dark section | `#3B1F0C` Coklat Batik | `#F2EAD3` Krem Mori | `#F5C400` Kuning Kepodang |
| Card surface | `#FAF7F0` Putih Santan | `#3B1F0C` Coklat Batik | `#B8860B` Emas Keris |
| Game / interactive | `#3B1F0C` Coklat Batik | `#F2EAD3` Krem Mori | `#F5C400` Kuning Kepodang |

---

## Tokens — Typography

### Playfair Display — Typeface display utama untuk semua headline, nama makanan, judul section besar, dan pull quote. · `--font-playfair`
- **Weights:** 400, 700, 400 Italic, 700 Italic
- **Sizes:** 48px, 64px, 80px, 96px (headline), 24px (pull quote), 20px (section title)
- **Line height:** 1.15 – 1.25
- **Letter spacing:** -0.01em hingga -0.02em pada ukuran besar
- **Role:** Serif klasik berkarakter yang memberi kesan editorial, prestisius, dan kultural. Digunakan eksklusif untuk elemen yang ingin "berbicara keras" secara visual.

### DM Sans — Typeface body untuk semua paragraf, deskripsi, label, UI text, tooltip, dan dialog bubble. · `--font-dm-sans`
- **Weights:** 400, 500, 700
- **Sizes:** 12px, 14px, 16px, 18px
- **Line height:** 1.5 – 1.65
- **Letter spacing:** 0em – 0.01em
- **Role:** Clean, modern, dan sangat readable. Kontras yang ideal dengan Playfair Display. Digunakan untuk semua teks fungsional dan naratif panjang.

### Noto Sans Javanese — Typeface aksen dekoratif untuk aksara Jawa. · `--font-noto-javanese`
- **Weights:** 400
- **Sizes:** 14px – 32px (hanya sebagai ornamen)
- **Role:** Hanya untuk elemen non-fungsional: divider section, footer ornamen, hero tipografi dekoratif. TIDAK digunakan untuk teks yang perlu dibaca. Memperkuat lapisan budaya autentik Jawa Tengah.

### Type Scale

| Role | Font | Size | Weight | Line Height | Token |
|------|------|------|--------|-------------|-------|
| display-xl | Playfair Display | 96px | 700 | 1.15 | `--text-display-xl` |
| display-lg | Playfair Display | 80px | 700 | 1.15 | `--text-display-lg` |
| display-md | Playfair Display | 64px | 700 | 1.2 | `--text-display-md` |
| display-sm | Playfair Display | 48px | 400 | 1.25 | `--text-display-sm` |
| heading | Playfair Display | 32px | 700 | 1.3 | `--text-heading` |
| subheading | DM Sans | 20px | 700 | 1.4 | `--text-subheading` |
| body-lg | DM Sans | 18px | 400 | 1.65 | `--text-body-lg` |
| body | DM Sans | 16px | 400 | 1.6 | `--text-body` |
| body-sm | DM Sans | 14px | 400 | 1.5 | `--text-body-sm` |
| caption | DM Sans | 12px | 500 | 1.43 | `--text-caption` |
| label | DM Sans | 12px | 700 | 1.0 | `--text-label` |
| javanese-ornament | Noto Sans Javanese | 20px | 400 | 1.0 | `--text-javanese` |

---

## Tokens — Texture & Pattern

### Batik Parang
- **Karakter:** Motif diagonal mengalir, kesan dinamis dan bergerak
- **Penerapan:** Hero Beranda, background Story Maps, elemen transisi Barba.js, border atas Footer
- **Ukuran motif:** 32px – 64px tile (sangat kecil untuk efek grain)
- **Opacity:** 8% – 15%
- **Warna:** Disesuaikan dengan background section (Emas Keris di atas Krem Mori, Krem Mori di atas Coklat Batik)
- **CSS:** `background-image: url('/textures/parang-grain.svg'); background-repeat: repeat; opacity: var(--texture-opacity-parang);`

### Batik Kawung
- **Karakter:** Motif geometris simetris, kesan tenang, terstruktur, dan premium
- **Penerapan:** Detail Kuliner, card background, Footer, baju Si Podo
- **Ukuran motif:** 24px – 48px tile
- **Opacity:** 8% – 12%
- **Warna:** Disesuaikan dengan background section
- **CSS:** `background-image: url('/textures/kawung-grain.svg'); background-repeat: repeat; opacity: var(--texture-opacity-kawung);`

### Aturan Tekstur
- Parang dan Kawung **tidak pernah muncul bersamaan** dalam satu viewport
- Parang → halaman/section dinamis dan bergerak (journey)
- Kawung → halaman/section terstruktur dan dibaca (konten)
- Selalu sebagai layer terpisah di atas background solid, bukan menggantikannya
- Grain harus hampir tidak terasa — user tidak perlu sadar melihatnya, tapi akan kehilangan hangatnya jika dihapus

---

## Tokens — Spacing & Shapes

**Base unit:** 8px
**Density:** comfortable-editorial

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 8 | 8px | `--spacing-8` |
| 12 | 12px | `--spacing-12` |
| 16 | 16px | `--spacing-16` |
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 48 | 48px | `--spacing-48` |
| 64 | 64px | `--spacing-64` |
| 96 | 96px | `--spacing-96` |
| 128 | 128px | `--spacing-128` |
| 160 | 160px | `--spacing-160` |

### Border Radius

| Element | Value | Catatan |
|---------|-------|---------|
| images | 8px | Foto makanan di card dan ingredients |
| images-hero | 0px | Foto hero selalu full-bleed tanpa radius |
| buttons | 24px | Pill shape, hangat dan approachable |
| badges / tags | 99px | Full pill untuk flavor tag dan badge |
| cards | 12px | Card kuliner dan story panel |
| tooltips | 8px | Tooltip bahan dan peta |
| dialog-bubble | 16px | Dialog bubble Si Podo dan karakter jejer orang |
| ingredient-photo | 9999px | Foto bahan selalu bulat penuh |

### Shadows

| Name | Value | Token | Penggunaan |
|------|-------|-------|-----------|
| card-warm | `rgba(59, 31, 12, 0.08) 0px 4px 24px 0px` | `--shadow-card` | Card kuliner, story panel |
| card-hover | `rgba(59, 31, 12, 0.18) 0px 8px 32px 0px` | `--shadow-card-hover` | Hover state card |
| tooltip | `rgba(59, 31, 12, 0.12) 0px 2px 12px 0px` | `--shadow-tooltip` | Tooltip bahan dan peta |
| button-accent | `rgba(245, 196, 0, 0.25) 0px 4px 16px 0px` | `--shadow-button-accent` | CTA button Kuning Kepodang saat hover |

### Layout

- **Section gap:** 96px (antar section dalam satu halaman)
- **Card padding:** 24px
- **Container max-width:** 1280px
- **Content max-width:** 800px (untuk teks editorial panjang)
- **Element gap:** 8px
- **Grid columns:** 12 kolom, gutter 24px

---

## Components

### Primary CTA Button
**Role:** Aksi utama — "Mulai Perjalanan", "Lihat Resep Lengkap", "Coba Sekarang"

Background Kuning Kepodang (`#F5C400`), teks Coklat Batik (`#3B1F0C`), font DM Sans 14px weight 700, 24px border-radius, padding 14px 28px. Hover: shadow `--shadow-button-accent` + scale(1.02). Transisi 200ms ease.

### Secondary Button (Ghost)
**Role:** Aksi sekunder — "Kembali ke Peta", "Lihat Semua"

Background transparan, border 1.5px Emas Keris (`#B8860B`), teks Emas Keris, 24px border-radius, padding 14px 28px. Hover: background Emas Keris + teks Krem Mori. Transisi 200ms ease.

### Ghost Light Button
**Role:** Tombol di atas background dark — navigasi, filter

Background transparan, border 1px Krem Mori (`#F2EAD3`) dengan opacity 40%, teks Krem Mori, 24px border-radius. Hover: background Krem Mori opacity 10%.

### Flavor Tag / Badge
**Role:** Label rasa makanan — Pedas, Manis, Gurih, Segar, Legit

Full pill (99px radius), padding 4px 12px, DM Sans 11px weight 700 uppercase, letter-spacing 0.05em. Warna per rasa:
- Pedas → background `#C0392B` teks `#FAF7F0`
- Manis → background `#F5C400` teks `#3B1F0C`
- Gurih → background `#B8860B` teks `#FAF7F0`
- Segar → background `#4A7C3F` teks `#FAF7F0`
- Legit → background `#6B3A2A` teks `#F2EAD3`

### Kuliner Card
**Role:** Featured kuliner di Beranda dan Related di Detail Kuliner

Background Putih Santan (`#FAF7F0`), border 1px Krem Tua (`#C8B89A`), radius 12px, shadow `--shadow-card`. Foto makanan di atas full-width radius 12px 12px 0 0. Konten bawah padding 20px: nama dalam Playfair Display 20px, deskripsi DM Sans 14px, flavor tags. Hover: shadow `--shadow-card-hover` + translateY(-4px). Transisi 250ms ease.

### Story Panel (Maps)
**Role:** Panel informasi yang slide-in saat klik marker peta

Background Krem Mori (`#F2EAD3`) + grain Kawung, lebar 400px di desktop, full-width di mobile. Shadow kiri `rgba(59, 31, 12, 0.2) -8px 0 32px`. Foto hero di atas tanpa radius, konten padding 24px, CTA button di paling bawah.

### Ingredient Card
**Role:** Card bahan di section Ingredients, Detail Kuliner

Foto bulat (border-radius 9999px) ukuran 72px × 72px. Nama bahan DM Sans 13px weight 500 di bawah foto. Jumlah bahan DM Sans 12px weight 400 Krem Tua. Hover → tooltip fun fact muncul di atas dengan background Coklat Batik teks Krem Mori.

### Dialog Bubble (Si Podo & Jejer Orang)
**Role:** Ucapan maskot dan karakter jejer orang memasak

Background Putih Santan (`#FAF7F0`), border 1.5px Emas Keris (`#B8860B`), radius 16px dengan "ekor" segitiga mengarah ke karakter. Teks DM Sans 14px weight 500 Coklat Batik. Maksimal 2–3 baris. Shadow `--shadow-tooltip`.

### Mapbox Marker Custom
**Role:** Pin lokasi kuliner di peta Story Maps

SVG berbentuk piring kecil (24px × 24px) dengan ikon ilustrasi flat makanan di dalamnya. Background Kuning Kepodang, border 2px Coklat Batik, drop shadow ringan. Active state: scale(1.3) + ring Emas Keris.

### Filter Pill (Maps)
**Role:** Filter regional di Story Maps

Background transparan, border 1px Krem Tua, teks Krem Mori (di atas peta dark), radius 99px, padding 8px 16px, DM Sans 13px weight 500. Active: background Kuning Kepodang, teks Coklat Batik, border Kuning Kepodang.

### Cooking Timer (Detail Kuliner)
**Role:** Timer interaktif di dalam langkah How to Cook

Tombol kecil di dalam / di bawah dialog bubble karakter. Background Kuning Kepodang, teks Coklat Batik, radius 8px. Saat aktif: countdown tampil dalam Playfair Display, ring progress Emas Keris mengelilingi angka.

### Progress Bar (How to Cook)
**Role:** Indikator kemajuan membaca langkah memasak

Fixed di top halaman. Height 3px. Background Krem Tua. Fill Kuning Kepodang. Transisi smooth mengikuti posisi scroll.

---

## Motion & Animation

### Prinsip Utama
- Animasi Jangkep terasa **organik dan hangat** — bukan cepat dan teknikal
- Easing favorit: `cubic-bezier(0.25, 0.46, 0.45, 0.94)` (ease-out-quad) untuk reveal, `cubic-bezier(0.4, 0, 0.2, 1)` (ease-in-out) untuk transisi
- Durasi standar: 300ms (micro), 500ms (reveal), 800ms (page transition)
- Tidak ada animasi yang terasa terburu-buru

### Page Transition (Barba.js)
Wipe horizontal dengan motif Batik Parang sebagai "tirai" yang menyapu layar — masuk dari kiri, keluar ke kiri. Durasi 800ms. Warna tirai: Coklat Batik. Di atas tirai ada motif Parang opacity 20%.

### Scroll Reveal (GSAP ScrollTrigger)
Elemen masuk dari bawah: `y: 40, opacity: 0` → `y: 0, opacity: 1`. Stagger antar elemen: 80ms. Trigger saat 80% element masuk viewport.

### Matter.js Physics (Rempah & Bahan)
Gravitasi: 1.2. Restitusi (bouncy): 0.4. Friction: 0.3. Benda terasa "berat berisi" seperti rempah sungguhan, bukan balon.

### Smooth Scroll (Lenis)
Duration: 1.2 detik. Easing: `lerp 0.08`. Membuat seluruh halaman terasa "mengalir" bukan "melompat."

### Hover States
- Card: translateY(-4px) + shadow naik, 250ms
- Button: scale(1.02) + shadow accent, 200ms
- Marker peta: scale(1.3), 150ms
- Ingredient card: tooltip fade in, 200ms

---

## Ilustrasi & Art Direction

### Gaya Utama — Editorial Flat + Grain Batik
Ilustrasi flat modern dengan warna penuh sesuai palet Jangkep, dilapisi grain batik tipis. Tidak realistis, tidak pula terlalu kartun — berada di tengah yang hangat dan berkarakter.

### Karakter "Jejer Orang" (How to Cook)
Karakter manusia Jawa dalam pose memasak yang berbeda: mengulek, menumis, menuang santan, mencicipi, menghidangkan. Pakaian batik Kawung warna Coklat Batik dan Krem Mori dengan aksen Kuning Kepodang. Ekspresi hidup dan bervariasi. Gaya ilustrasi konsisten dengan Si Podo — semi-flat, penuh emosi, bukan rigid. Background tiap karakter transparan agar bisa ditaruh di atas background Krem Mori.

### Si Podo
Konsisten dengan aset yang sudah ada: kuning cerah, aksen hitam, blangkon batik, celana Kawung. Jangan ubah proporsi atau style. Hanya variasikan pose dan ekspresi.

### Foto Asli
Digunakan hanya untuk: hero makanan di Detail Kuliner dan foto langkah memasak di How to Cook. Semua foto diproses dengan: slight warm tone (+10 warmth), contrast +5, saturation -5 agar selaras dengan palet Jangkep dan tidak terlihat "stock photo" dingin.

### Ikon UI
Minimal, outlined, stroke 1.5px warna Coklat Batik atau Krem Mori sesuai background. Ukuran standar 20px × 20px. Tidak ada ikon solid kecuali pada CTA dan state aktif.

---

## Do's and Don'ts

### Do
- Gunakan Krem Mori dan Coklat Batik secara bergantian antar section untuk ritme visual yang dinamis
- Selalu tampilkan Kuning Kepodang sebagai satu-satunya aksen warna bold — jangan encerkan dengan aksen lain yang sama kuatnya
- Pakai Playfair Display hanya untuk elemen yang ingin "berbicara keras" — headline, nama makanan, pull quote
- Terapkan grain batik pada opacity sangat rendah (8–15%) — terasa bukan terlihat
- Pilih Parang untuk context dinamis, Kawung untuk context tenang — konsisten
- Beri foto makanan treatment warm tone agar selaras dengan palet
- Selalu sertakan Si Podo di setiap halaman minimal satu kali — ia adalah wajah brand

### Don't
- Jangan gunakan Parang dan Kawung dalam satu viewport bersamaan
- Jangan tampilkan lebih dari satu warna aksen bold selain Kuning Kepodang dalam satu section
- Jangan gunakan font lain selain Playfair Display, DM Sans, dan Noto Sans Javanese
- Jangan gunakan foto makanan tanpa treatment warm tone — foto dingin/biru akan merusak mood
- Jangan beri border-radius pada foto hero — selalu full-bleed tanpa radius
- Jangan tampilkan Noto Sans Javanese sebagai teks fungsional yang perlu dibaca user
- Jangan gunakan shadow yang keras atau kontras tinggi — semua shadow harus warm dan subtle
- Jangan pakai grain batik opacity lebih dari 20% — akan terlihat seperti wallpaper bukan tekstur
- Jangan ubah style atau proporsi Si Podo dari aset yang sudah ada

---

## Agent Prompt Guide

Quick Color Reference:
```
background-light: #F2EAD3  (Krem Mori)
background-dark:  #3B1F0C  (Coklat Batik)
text-on-light:    #3B1F0C  (Coklat Batik)
text-on-dark:     #F2EAD3  (Krem Mori)
accent-primary:   #F5C400  (Kuning Kepodang)
accent-gold:      #B8860B  (Emas Keris)
accent-green:     #4A7C3F  (Hijau Daun Pisang)
surface-card:     #FAF7F0  (Putih Santan)
text-muted:       #C8B89A  (Krem Tua)
```

Example Component Prompts:

**Buat Primary CTA Button:** background `#F5C400`, teks `#3B1F0C`, DM Sans 14px weight 700, border-radius 24px, padding 14px 28px. Hover: box-shadow `rgba(245, 196, 0, 0.25) 0px 4px 16px` + scale(1.02).

**Buat Kuliner Card:** background `#FAF7F0`, border 1px `#C8B89A`, border-radius 12px. Foto makanan di atas full-width radius 12px 12px 0 0. Di bawah: padding 20px, judul Playfair Display 20px weight 700 `#3B1F0C`, deskripsi DM Sans 14px `#3B1F0C`, flavor tags pill full-radius di bawahnya. Hover: translateY(-4px) + shadow `rgba(59, 31, 12, 0.18) 0px 8px 32px`.

**Buat Flavor Tag "Pedas":** background `#C0392B`, teks `#FAF7F0`, DM Sans 11px weight 700 uppercase letter-spacing 0.05em, border-radius 99px, padding 4px 12px.

**Buat Dialog Bubble Si Podo:** background `#FAF7F0`, border 1.5px `#B8860B`, border-radius 16px, padding 12px 16px. Teks DM Sans 14px weight 500 `#3B1F0C`. Tambahkan segitiga kecil di sudut bawah kiri mengarah ke karakter.

**Buat Section dengan grain Kawung:** background `#F2EAD3`, tambahkan `::before` pseudo-element dengan `background-image: url('/textures/kawung-grain.svg')`, `background-repeat: repeat`, `opacity: 0.10`, `position: absolute`, `inset: 0`, `pointer-events: none`.

---

## CSS Custom Properties

```css
:root {
  /* === COLORS === */
  --color-krem-mori: #F2EAD3;
  --color-coklat-batik: #3B1F0C;
  --color-kuning-kepodang: #F5C400;
  --color-emas-keris: #B8860B;
  --color-hijau-daun: #4A7C3F;
  --color-krem-tua: #C8B89A;
  --color-putih-santan: #FAF7F0;
  --color-hitam-arang: #1A0A02;

  /* Flavor Tag Colors */
  --color-rasa-pedas: #C0392B;
  --color-rasa-manis: #F5C400;
  --color-rasa-gurih: #B8860B;
  --color-rasa-segar: #4A7C3F;
  --color-rasa-legit: #6B3A2A;

  /* === TYPOGRAPHY === */
  --font-playfair: 'Playfair Display', Georgia, 'Times New Roman', serif;
  --font-dm-sans: 'DM Sans', ui-sans-serif, system-ui, sans-serif;
  --font-noto-javanese: 'Noto Sans Javanese', serif;

  /* Type Scale */
  --text-display-xl: 96px;
  --text-display-lg: 80px;
  --text-display-md: 64px;
  --text-display-sm: 48px;
  --text-heading: 32px;
  --text-subheading: 20px;
  --text-body-lg: 18px;
  --text-body: 16px;
  --text-body-sm: 14px;
  --text-caption: 12px;
  --text-label: 12px;
  --text-javanese: 20px;

  /* Line Heights */
  --leading-display: 1.15;
  --leading-heading: 1.3;
  --leading-body: 1.6;
  --leading-body-lg: 1.65;
  --leading-caption: 1.43;

  /* === SPACING === */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-96: 96px;
  --spacing-128: 128px;
  --spacing-160: 160px;

  /* Layout */
  --section-gap: 96px;
  --card-padding: 24px;
  --element-gap: 8px;
  --container-max: 1280px;
  --content-max: 800px;

  /* === BORDER RADIUS === */
  --radius-images: 8px;
  --radius-images-hero: 0px;
  --radius-buttons: 24px;
  --radius-badges: 99px;
  --radius-cards: 12px;
  --radius-tooltips: 8px;
  --radius-bubble: 16px;
  --radius-ingredient-photo: 9999px;

  /* === SHADOWS === */
  --shadow-card: rgba(59, 31, 12, 0.08) 0px 4px 24px 0px;
  --shadow-card-hover: rgba(59, 31, 12, 0.18) 0px 8px 32px 0px;
  --shadow-tooltip: rgba(59, 31, 12, 0.12) 0px 2px 12px 0px;
  --shadow-button-accent: rgba(245, 196, 0, 0.25) 0px 4px 16px 0px;

  /* === TEXTURE === */
  --texture-opacity-parang: 0.10;
  --texture-opacity-kawung: 0.09;
  --texture-parang: url('/textures/parang-grain.svg');
  --texture-kawung: url('/textures/kawung-grain.svg');

  /* === MOTION === */
  --ease-reveal: cubic-bezier(0.25, 0.46, 0.45, 0.94);
  --ease-transition: cubic-bezier(0.4, 0, 0.2, 1);
  --duration-micro: 200ms;
  --duration-reveal: 500ms;
  --duration-page: 800ms;
}
```

---

## Similar Brands / References

- **Gourou Indian Food** (gourouindianfood.fr) — Identitas budaya kuat melalui warna dan tipografi bold, page transition dramatis
- **Thessaloniki Sto Piato** (thessalonikistopiato.gr) — Peta kuliner interaktif, layout editorial resep yang kaya
- **Locavore NXT** (locavorenxt.com) — Galeri kuliner cinematic, fotografi makanan editorial
- **Design Beyond Barriers** (designbeyondbarriers.com) — Karakter doodle yang hidup dan ekspresif sebagai elemen utama
- **Wisprflow** (wisprflow.ai) — Design pattern modern, clean, dan interaktif