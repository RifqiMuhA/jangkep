# AntiGravity — Prompt Perbaikan Hero Section "Jangkep"
> Revisi spesifik berdasarkan design reference Figma. Baca seluruh dokumen sebelum implementasi.

---

## Konteks

Hero section website **Jangkep** — platform kuliner Jawa Tengah. Referensi desain Figma sudah final. Implementasi saat ini (AntiGravity) belum sesuai di beberapa poin kritis. Dokumen ini merinci **apa yang harus diubah, bagaimana cara mengubahnya, dan apa yang tidak boleh disentuh.**

---

## 1. TIPOGRAFI — Perubahan Utama

### 1a. Struktur Headline: Dua Baris, Dua Gaya Berbeda

Headline hero terdiri dari **dua baris dengan treatment berbeda total**. Ini bukan dua baris yang identik.

**Baris 1 — "Jangkep Rasane,"**
- Font: `Playfair Display`, weight **700**
- Ukuran: **80px–96px** (sesuaikan agar proporsional di viewport)
- Warna: `#F2EAD3` (Krem Mori) — terang, bersih
- Style: Regular (tidak italic)
- Letter spacing: `-0.02em`
- Line height: `1.15`

**Baris 2 — "Jangkep Critane"**
- Font: **font kaligrafi/dekoratif** bergaya Jawa/retro — bukan Playfair Display, bukan DM Sans. Gunakan font seperti `Pinyon Script`, `Italiana`, atau font display script yang terasa organik dan "tulis tangan elegan". Kalau project sudah punya custom font Javanese dekoratif, gunakan itu.
- Ukuran: **96px–120px** — lebih besar dari baris pertama
- Warna: `#F5C400` (Kuning Kepodang) — kuning bold, kontras tinggi
- Style: Italic / script
- Posisi baseline: sedikit overlap atau sangat dekat dengan baris pertama — kesan editorial, bukan list

**Mengapa?** Di Figma, baris kedua adalah **statement visual** yang "berteriak" dengan warna dan font berbeda. Ini bukan tipografi biasa — ini seperti poster editorial.

### 1b. Alignment Tipografi

- Headline: **rata kiri** (`text-align: left`)
- Posisi horizontal: mulai dari kiri, dengan padding/margin kiri sekitar `48px–64px` dari tepi viewport (atau mengikuti grid container `max-width: 1280px`)
- Posisi vertikal: **tengah vertikal** viewport, sedikit naik dari center — sekitar `45% dari atas`
- **BUKAN center-center** — desain Figma adalah left-aligned, bukan centered seperti implementasi AntiGravity saat ini

### 1c. HAPUS: Aksara Jawa di Sudut Kiri Atas

Elemen dekoratif Aksara Jawa (`Noto Sans Javanese`) yang sebelumnya disimpan di sudut kiri atas **dihapus seluruhnya**. Tidak ada pengganti. Sudut kiri atas harus kosong (atau hanya berisi navbar/logo jika ada).

---

## 2. GAMBAR SI PODO — Penempatan dan Ukuran

### Asset
- File: `dapur-jawa.webp`
- Si Podo adalah maskot berbentuk burung kepodang kuning dengan blangkon batik, memegang mangkok/sendok, pose memasak

### Posisi
- **Tengah layar, overlap dengan headline** — Si Podo berada di layer antara background dan teks, atau di atas teks, posisinya **sentral secara horizontal dan vertikal**
- Referensi Figma: Si Podo berada di **center viewport**, tubuhnya overlap dengan kata "Jangkep Rasane" di baris pertama dan "Jangkep Critane" di baris kedua — gambar maskot menjadi **elemen visual utama hero**, bukan ornamen sudut
- Ukuran: **besar** — tinggi sekitar `55%–65% dari tinggi viewport`. Di viewport 900px berarti sekitar `500px–580px` tinggi gambar
- Horizontal: center (`left: 50%; transform: translateX(-50%)`) atau dikaitkan ke titik visual tengah antara dua baris headline

### Layer Order (z-index)
```
Layer 1 (bawah): Background solid + kawung texture
Layer 2: Radial gradient overlay (baru — lihat bagian 4)
Layer 3: Si Podo image (dapur-jawa.webp)
Layer 4: Teks headline (di atas gambar, teks overlap Si Podo — seperti di Figma)
Layer 5: CTA button
Layer 6 (atas): Dialog bubble + Si Podo versi kecil (sudut kanan bawah)
```

### Efek Gambar
- `object-fit: contain`
- Tidak ada border-radius (hero image selalu `border-radius: 0`)
- Drop shadow subtle agar gambar tidak "terbang": `filter: drop-shadow(0px 24px 48px rgba(26, 10, 2, 0.4))`
- Background gambar harus transparan (`.webp` sudah support transparency)

---

## 3. PARALLAX MOUSE-TRACKING

Implementasikan `mousemove` event di `document` atau hero container. Dua layer yang bergerak dengan kecepatan berbeda:

```javascript
document.addEventListener('mousemove', (e) => {
  const { innerWidth, innerHeight } = window;
  const x = (e.clientX / innerWidth - 0.5);   // -0.5 to 0.5
  const y = (e.clientY / innerHeight - 0.5);  // -0.5 to 0.5

  // Layer teks bergerak lambat (subtle)
  textLayer.style.transform = `translate(${x * 12}px, ${y * 8}px)`;

  // Layer Si Podo bergerak sedikit lebih cepat (kedalaman lebih depan)
  imageLayer.style.transform = `translate(${x * 20}px, ${y * 14}px)`;
});
```

- Gunakan `transition: transform 0.1s ease-out` atau `requestAnimationFrame` dengan lerp untuk gerakan yang smooth dan tidak laggy
- Intensitas: **subtle** — maksimum perpindahan `±20px` untuk gambar, `±12px` untuk teks
- Tidak ada parallax scroll pada hero ini — hanya mouse-tracking

---

## 4. BACKGROUND — Tambahan Radial Gradient

**Jangan ubah background kawung texture yang sudah ada.** Hanya tambahkan layer gradient di atasnya.

Tambahkan `::after` pseudo-element (atau `div` overlay) dengan:

```css
.hero-gradient-overlay {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse 70% 60% at 50% 50%,
    transparent 0%,
    rgba(26, 10, 2, 0.55) 60%,
    rgba(26, 10, 2, 0.85) 100%
  );
  pointer-events: none;
  z-index: 2; /* di atas texture, di bawah konten */
}
```

**Efek yang diharapkan:** Bagian tengah layar relatif lebih terang/transparan, tepi layar (kanan-kiri-atas-bawah) gelap seperti vignette — memaksa fokus mata ke tengah konten.

Warna gelap yang digunakan adalah `#1A0A02` (Hitam Arang) dengan opacity variabel, bukan hitam murni, agar tetap warm.

---

## 5. CTA BUTTON — "Mulai Perjalanan"

Style: **Ghost button dengan border Emas Keris**

```css
.cta-button {
  background: transparent;
  border: 1.5px solid #B8860B;  /* Emas Keris */
  color: #F2EAD3;               /* Krem Mori */
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.02em;
  border-radius: 24px;
  padding: 14px 28px;
  cursor: pointer;
  transition: all 200ms ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.cta-button:hover {
  background: #B8860B;
  color: #F2EAD3;
}
```

- Tambahkan ikon panah `→` di sebelah kanan teks
- Posisi: di bawah headline, margin-top `32px` dari baris terakhir headline
- Alignment: **rata kiri**, sejajar dengan headline

---

## 6. SCROLL INDICATOR

Di bawah layar, tengah horizontal, posisi `bottom: 32px`:

```html
<div class="scroll-indicator">
  <span class="scroll-label">SCROLL</span>
  <div class="scroll-arrow">↓</div>
</div>
```

```css
.scroll-indicator {
  position: absolute;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  z-index: 10;
}

.scroll-label {
  font-family: 'DM Sans', sans-serif;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.2em;
  color: #C8B89A; /* Krem Tua */
  text-transform: uppercase;
}

.scroll-arrow {
  font-size: 16px;
  color: #C8B89A;
  animation: scrollBounce 1.6s ease-in-out infinite;
}

@keyframes scrollBounce {
  0%, 100% { transform: translateY(0); opacity: 1; }
  50%       { transform: translateY(6px); opacity: 0.5; }
}
```

---

## 7. SI PODO DIALOG BUBBLE — Sudut Kanan Bawah

Ini adalah **elemen terpisah** dari gambar Si Podo utama di tengah. Di sudut kanan bawah ada versi Si Podo lebih kecil dengan dialog bubble.

### Struktur HTML
```html
<div class="sipodo-corner">
  <div class="sipodo-bubble">
    Wis siap njelajah Jawa Tengah?
  </div>
  <img src="/assets/sipodo-small.webp" alt="Si Podo" class="sipodo-img" />
</div>
```

### CSS
```css
.sipodo-corner {
  position: fixed;  /* atau absolute jika hero full-screen */
  bottom: 40px;
  right: 40px;
  display: flex;
  align-items: flex-end;
  gap: 10px;
  z-index: 20;
}

.sipodo-bubble {
  background: #FAF7F0;          /* Putih Santan */
  border: 1.5px solid #B8860B;  /* Emas Keris */
  border-radius: 16px;
  padding: 12px 16px;
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #3B1F0C;               /* Coklat Batik */
  max-width: 200px;
  line-height: 1.5;
  position: relative;
  /* Segitiga penunjuk ke kanan bawah (arah Si Podo) */
}

/* Segitiga kecil di sudut kanan bawah bubble */
.sipodo-bubble::after {
  content: '';
  position: absolute;
  bottom: -8px;
  right: 16px;
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-top: 8px solid #B8860B;
}
.sipodo-bubble::before {
  content: '';
  position: absolute;
  bottom: -6px;
  right: 17px;
  width: 0;
  height: 0;
  border-left: 7px solid transparent;
  border-right: 7px solid transparent;
  border-top: 7px solid #FAF7F0;
  z-index: 1;
}

.sipodo-img {
  width: 80px;
  height: auto;
  object-fit: contain;
}
```

### Animasi Masuk
Si Podo corner muncul dengan delay setelah halaman load:
```css
.sipodo-corner {
  animation: sipodoAppear 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) 1.2s both;
}

@keyframes sipodoAppear {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

---

## 8. APA YANG TIDAK BOLEH DIUBAH

| Elemen | Status |
|--------|--------|
| Background Kawung texture | ✅ Pertahankan |
| Warna background `#3B1F0C` (Coklat Batik) | ✅ Pertahankan |
| Keberadaan dua baris headline | ✅ Pertahankan |
| Teks konten "Jangkep Rasane," dan "Jangkep Critane" | ✅ Pertahankan |
| Aksara Jawa di sudut kiri atas | ❌ Hapus |
| Headline center-aligned | ❌ Ubah ke left-aligned |
| Si Podo di sudut (bukan center) | ❌ Pindahkan ke tengah |
| Baris kedua warna putih/krem | ❌ Harus Kuning Kepodang `#F5C400` |
| Baris kedua font sama dengan baris pertama | ❌ Harus font script/kaligrafi berbeda |

---

## 9. CHECKLIST SEBELUM DELIVER

- [ ] Headline baris 1: Playfair Display 700, `#F2EAD3`, left-aligned
- [ ] Headline baris 2: font script dekoratif, `#F5C400`, ukuran lebih besar dari baris 1, left-aligned
- [ ] Aksara Jawa sudut kiri atas: tidak ada
- [ ] Si Podo (`dapur-jawa.webp`): posisi center, ukuran besar, overlap teks
- [ ] Radial gradient vignette overlay di atas kawung texture
- [ ] Mouse-tracking parallax: teks dan gambar bergerak di dua kecepatan berbeda
- [ ] CTA "Mulai Perjalanan": ghost button, border `#B8860B`, text `#F2EAD3`, left-aligned
- [ ] Scroll indicator: animasi bounce, warna `#C8B89A`, posisi bottom center
- [ ] Si Podo corner kanan bawah: dialog bubble "Wis siap njelajah Jawa Tengah?", animasi muncul delay 1.2s
- [ ] Tidak ada elemen yang menggunakan font selain Playfair Display, DM Sans, dan Noto Sans Javanese (jika masih ada)
- [ ] Semua warna menggunakan token dari CSS custom properties yang sudah didefinisikan
