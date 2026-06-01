'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import styles from './PromoGamesSection.module.css';

const ambientRempah = [
  { src: '/rempah/rempah-10.webp', name: 'Kayu Manis', w: 180, h: 180, class: styles.amb1 },
  { src: '/rempah/rempah-11.webp', name: 'Cengkeh',    w: 160, h: 160, class: styles.amb2 },
  { src: '/rempah/rempah-3.webp',  name: 'Lengkuas',   w: 220, h: 220, class: styles.amb3 },
  { src: '/rempah/rempah-7.webp',  name: 'Kluwek',     w: 190, h: 190, class: styles.amb4 },
  { src: '/rempah/rempah.webp',    name: 'Jahe',       w: 240, h: 240, class: styles.amb5 },
  { src: '/rempah/rempah-15.webp', name: 'Gula Merah', w: 200, h: 200, class: styles.amb6 },
];

export default function PromoGamesSection() {
  const router = useRouter();

  useEffect(() => {
    let ctx: any;
    const init = async () => {
      const gsap = (await import('gsap')).default;
      
      ctx = gsap.context(() => {
        // 1. Label fade up
        gsap.from('.heroLabel', {
          y: 20, opacity: 0, duration: 0.6, ease: 'power2.out', delay: 0.1
        });

        // 2. Headline — tiap baris stagger
        gsap.from(['.hlRow1', '.hlRow2'], {
          y: 60, opacity: 0, duration: 0.7,
          ease: 'power3.out',
          stagger: 0.12,
          delay: 0.3
        });

        // 3. Subline + button
        gsap.from(['.heroSubline', '.ctaBtn'], {
          y: 30, opacity: 0, duration: 0.6,
          ease: 'power2.out',
          stagger: 0.1,
          delay: 0.85
        });

        // 4. Si Podo fly up dari bawah
        gsap.from('.sipodoWrap', {
          y: 120, opacity: 0, duration: 1.0,
          ease: 'back.out(1.3)',
          delay: 0.5
        });

        // 5. Dekorasi stagger masuk dari luar
        gsap.from('.deco', {
          scale: 0, opacity: 0,
          duration: 0.6,
          ease: 'back.out(1.6)',
          stagger: { each: 0.08, from: 'random' },
          delay: 0.9
        });

        // 6. Rempah ambient fade in pelan
        gsap.from('.amb', {
          opacity: 0, scale: 0.7,
          duration: 1.2,
          ease: 'power2.out',
          stagger: { each: 0.15, from: 'edges' },
          delay: 0.2
        });
      });
    };

    init();
    return () => {
      if (ctx) ctx.revert();
    };
  }, []);

  return (
    <section className={styles.heroSection}>
      
      {/* ── LAYER 3: REMPAH AMBIENT ── */}
      <div className={styles.rempahAmbient}>
        {ambientRempah.map((item, idx) => (
          <div key={idx} className={`${styles.amb} ${item.class || ''} amb`}>
            <Image src={item.src} alt={item.name} width={item.w} height={item.h} style={{ objectFit: 'contain' }} unoptimized priority={idx < 3}/>
          </div>
        ))}
      </div>

      {/* ── LAYER 4: HERO CONTENT ── */}
      <div className={styles.heroContent}>
        {/* Headline */}
        <h1 className={styles.heroHeadline}>
          <div className={`${styles.headlineRow} hlRow1`}>
            <span className={styles.hlTextNormal}>Wis Siap</span>
            <span className={styles.hlTextItalic}>Ngerti</span>
          </div>
          <div className={`${styles.headlineRow} hlRow2`}>
            <span className={styles.hlTextNormal}>Masakan</span>
            <span className={styles.hlTextHighlight}>
              Jawa?
              <svg className={styles.underlineSvg} viewBox="0 0 220 14" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3,9 C45,3 90,13 135,7 C178,2 205,10 217,8" stroke="#F5C400" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </div>
        </h1>

        {/* CTA Button */}
        <button className={`${styles.ctaBtn} ctaBtn`} onClick={() => router.push('/games')}>
          <span className={styles.ctaOrn}>✦</span>
          Ayo Mulai!
        </button>
      </div>

      {/* ── LAYER 5: HAPUS EMOTICON ── */}
      {/* Emoticon dihapus sesuai permintaan */}

      {/* ── LAYER 6: SI PODO ── */}
      <div className={`${styles.sipodoWrap} sipodoWrap`}>
        <Image
          src="/sipodo/games.webp"
          alt="Si Podo"
          width={420}
          height={480}
          className={styles.sipodoImg}
          priority
        />
      </div>

      {/* ── LAYER 7: GROUND CURVE ── */}
      <div className={styles.groundCurve}>
        <img src="/batik/bg-games.png" alt="" className={styles.groundImg} />
      </div>

    </section>
  );
}