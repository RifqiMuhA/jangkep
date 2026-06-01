'use client';

import { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { foodsData } from '../../maps/data/foods';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function KulinerDetail() {
  const params = useParams();
  const nama = params.nama as string;
  const food = foodsData.find(f => f.name.toLowerCase().replace(' ', '-') === nama) || foodsData[0];

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  
  const [servings, setServings] = useState(1);

  // Fallback data
  const ingredients = [
    { name: 'Bahan Utama', amount: 500, unit: 'g' },
    { name: 'Bumbu Halus', amount: 100, unit: 'g' },
    { name: 'Santan', amount: 200, unit: 'ml' },
  ];

  return (
    <main style={{ backgroundColor: 'var(--color-krem-mori)' }}>
      {/* Hero Section */}
      <section ref={heroRef} style={{ height: '80vh', position: 'relative', overflow: 'hidden' }}>
        <motion.div style={{ y, position: 'absolute', inset: 0, backgroundColor: 'var(--color-coklat-batik)' }}>
          {/* Image placeholder */}
          <div style={{ position: 'absolute', inset: 0, opacity: 0.5, backgroundImage: 'url(/batik/batik_kawung.webp)', backgroundSize: '150px' }} />
        </motion.div>
        
        {/* Overlay gradient */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, var(--color-hitam-arang) 0%, transparent 60%)' }} />

        <div style={{ position: 'absolute', bottom: 'var(--spacing-48)', left: 'var(--spacing-48)', zIndex: 10 }}>
          <div style={{ display: 'flex', gap: 'var(--spacing-12)', marginBottom: 'var(--spacing-16)' }}>
            <span style={{ backgroundColor: 'var(--color-putih-santan)', color: 'var(--color-coklat-batik)', padding: '4px 12px', borderRadius: 'var(--radius-badges)', fontSize: 'var(--text-caption)', fontWeight: 700 }}>
              {food.city}
            </span>
            <span style={{ backgroundColor: 'var(--color-kuning-kepodang)', color: 'var(--color-coklat-batik)', padding: '4px 12px', borderRadius: 'var(--radius-badges)', fontSize: 'var(--text-caption)', fontWeight: 700 }}>
              SEDANG
            </span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-playfair)', fontSize: 'var(--text-display-md)', color: 'var(--color-krem-mori)', margin: 0 }}>
            {food.name}
          </h1>
        </div>
      </section>

      {/* Breadcrumb */}
      <div style={{ padding: 'var(--spacing-24) var(--spacing-48)', borderBottom: '1px solid var(--color-krem-tua)' }}>
        <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: 'var(--text-caption)', color: 'var(--color-coklat-batik)', opacity: 0.7, margin: 0 }}>
          Beranda / Story Maps / {food.name}
        </p>
      </div>

      <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--section-gap)', padding: 'var(--spacing-96) var(--spacing-48)' }}>
        
        {/* Cerita & Sejarah */}
        <section style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 'var(--spacing-64)' }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-playfair)', fontSize: 'var(--text-heading)', color: 'var(--color-coklat-batik)', marginBottom: 'var(--spacing-24)' }}>
              Riwayat Rasa
            </h2>
            <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: 'var(--text-body-lg)', color: 'var(--color-coklat-batik)', lineHeight: '1.8' }}>
              {food.story} Membawa cerita panjang dari dapur tradisional masyarakat Jawa Tengah, hidangan ini tidak hanya sekadar mengenyangkan, tetapi juga merekatkan kebersamaan. 
              Proses memasak yang panjang dan membutuhkan kesabaran adalah simbol dari karakter budaya yang menjunjung tinggi ketekunan.
            </p>
            <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: 'var(--text-body-lg)', color: 'var(--color-coklat-batik)', lineHeight: '1.8', marginTop: 'var(--spacing-16)' }}>
              Setiap suapan adalah perjalanan melintasi waktu, mengingatkan kita pada kekayaan rempah Nusantara yang telah memikat dunia sejak berabad-abad lalu.
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <blockquote style={{ fontFamily: 'var(--font-playfair)', fontStyle: 'italic', fontSize: '32px', color: 'var(--color-emas-keris)', margin: 0, paddingLeft: 'var(--spacing-24)', borderLeft: '4px solid var(--color-emas-keris)' }}>
              &quot;Bukan sekadar makanan, ini adalah warisan.&quot;
            </blockquote>
          </div>
        </section>

        {/* Ingredients */}
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-32)' }}>
            <h2 style={{ fontFamily: 'var(--font-playfair)', fontSize: 'var(--text-heading)', color: 'var(--color-coklat-batik)', margin: 0 }}>
              Bahan-bahan
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-16)', backgroundColor: 'var(--color-putih-santan)', padding: '8px 16px', borderRadius: 'var(--radius-buttons)', border: '1px solid var(--color-krem-tua)' }}>
              <button onClick={() => setServings(Math.max(1, servings - 1))} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px' }}>-</button>
              <span style={{ fontFamily: 'var(--font-dm-sans)', fontWeight: 700 }}>{servings} Porsi</span>
              <button onClick={() => setServings(servings + 1)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px' }}>+</button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 'var(--spacing-24)' }}>
            {ingredients.map((ing, i) => (
              <div key={i} style={{ backgroundColor: 'var(--color-putih-santan)', padding: 'var(--spacing-24)', borderRadius: 'var(--radius-cards)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-16)', boxShadow: 'var(--shadow-card)' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'var(--color-kuning-kepodang)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
                  🌿
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-dm-sans)', fontWeight: 700, color: 'var(--color-coklat-batik)' }}>{ing.name}</div>
                  <div style={{ fontFamily: 'var(--font-dm-sans)', fontSize: 'var(--text-caption)', color: 'var(--color-krem-tua)' }}>
                    {ing.amount * servings} {ing.unit}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* How to Cook (Jejer Orang) */}
        <section>
          <h2 style={{ fontFamily: 'var(--font-playfair)', fontSize: 'var(--text-heading)', color: 'var(--color-coklat-batik)', marginBottom: 'var(--spacing-48)' }}>
            Langkah Memasak
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-64)' }}>
            {[1, 2, 3].map((step) => (
              <div key={step} style={{ display: 'flex', gap: 'var(--spacing-32)', alignItems: 'center', flexDirection: step % 2 === 0 ? 'row-reverse' : 'row' }}>
                <div style={{ flex: 1, height: '300px', backgroundColor: 'var(--color-coklat-batik)', borderRadius: 'var(--radius-cards)', position: 'relative', overflow: 'hidden' }}>
                  {/* Character Illustration placeholder */}
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '64px' }}>
                    🧑‍🍳
                  </div>
                </div>
                <div style={{ flex: 1.5 }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--color-kuning-kepodang)', color: 'var(--color-coklat-batik)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-playfair)', fontSize: '24px', fontWeight: 700, marginBottom: 'var(--spacing-16)' }}>
                    {step}
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-dm-sans)', fontSize: 'var(--text-subheading)', color: 'var(--color-coklat-batik)', marginBottom: 'var(--spacing-16)' }}>
                    {step === 1 ? 'Menyiapkan Bumbu' : step === 2 ? 'Proses Memasak' : 'Menyajikan'}
                  </h3>
                  <p style={{ fontFamily: 'var(--font-dm-sans)', color: 'var(--color-coklat-batik)', opacity: 0.8, lineHeight: '1.6' }}>
                    Siapkan semua bahan yang telah diukur dengan pas. Masukkan bahan utama dan bumbu halus ke dalam wajan, panaskan dengan api sedang sambil terus diaduk perlahan agar bumbu meresap sempurna.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section style={{ textAlign: 'center', marginTop: 'var(--spacing-64)' }}>
          <h3 style={{ fontFamily: 'var(--font-playfair)', fontSize: 'var(--text-heading)', color: 'var(--color-coklat-batik)', marginBottom: 'var(--spacing-24)' }}>
            Ingin mencoba hal lain?
          </h3>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--spacing-16)' }}>
            <Link href="/maps">
              <button style={{ backgroundColor: 'var(--color-putih-santan)', color: 'var(--color-coklat-batik)', border: '1px solid var(--color-emas-keris)', padding: '16px 32px', borderRadius: 'var(--radius-buttons)', fontFamily: 'var(--font-dm-sans)', fontWeight: 700, cursor: 'pointer' }}>
                Kembali ke Peta
              </button>
            </Link>
            <Link href="/games">
              <button style={{ backgroundColor: 'var(--color-kuning-kepodang)', color: 'var(--color-coklat-batik)', border: 'none', padding: '16px 32px', borderRadius: 'var(--radius-buttons)', fontFamily: 'var(--font-dm-sans)', fontWeight: 700, cursor: 'pointer', boxShadow: 'var(--shadow-button-accent)' }}>
                Mainkan Game
              </button>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
