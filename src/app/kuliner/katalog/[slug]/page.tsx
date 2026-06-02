'use client';

import React, { useRef, use } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import dynamic from 'next/dynamic';
import { kulinerData } from '@/data/kulinerData';
import HistoryTimeline from './HistoryTimeline';
import BatikTransition from '@/components/BatikTransition';
import { ExploreButton } from '@/components/ExploreButton';
import FooterSection from '@/components/beranda/FooterSection';
import styles from './detail.module.css';

const RecipeBook = dynamic(() => import('@/components/RecipeBook'), {
  ssr: false,
  loading: () => <div style={{ height: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3B1F0C' }}>Membuka manuskrip kuno...</div>
});

const CookingMethods = dynamic(() => import('@/components/CookingMethods'), {
  ssr: false,
  loading: () => <div style={{ height: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3B1F0C' }}>Menyiapkan dapur...</div>
});

// Helper mapping functions
const getCategoryStyle = (category: string) => {
  return {};
}

const getTasteStyle = (taste: string) => {
  return {};
}

const getCategoryIcon = (cat: string) => {
  const c = cat.toLowerCase();
  if (c.includes('jajanan') || c.includes('ringan')) return '/kuliner/jajanan.webp';
  if (c.includes('minuman')) return '/kuliner/minuman.webp';
  return '/kuliner/makanan_berat.webp'; // Default: Makanan Berat
};

const getTasteIcon = (taste: string) => {
  const t = taste.toLowerCase();
  if (t.includes('pedas')) return '/kuliner/cabai.webp';
  if (t.includes('manis')) return '/kuliner/madu.webp';
  if (t.includes('segar') || t.includes('asam')) return '/kuliner/lemon.webp';
  return '/kuliner/garam.webp'; // Default: Gurih
};

export default function KulinerDetail({ params }: { params: Promise<{ slug: string }> }) {
  // Unpack params using React.use() as required in Next.js 15
  const resolvedParams = use(params);
  const router = useRouter();

  const item = kulinerData.find(d => d.slug === resolvedParams.slug);

  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const image1Y = useTransform(scrollYProgress, [0, 1], ['0%', '-20%']);
  const image2Y = useTransform(scrollYProgress, [0, 1], ['20%', '-40%']);

  if (!item) {
    return (
      <div className={styles.notFound}>
        <h1>Kuliner tidak ditemukan</h1>
        <button onClick={() => router.back()} className={styles.backBtn} style={{ marginTop: '20px' }}>Kembali</button>
      </div>
    );
  }

  // (History is now handled by HistoryTimeline)

  // Split title for styling (first word dark, rest orange)
  const nameParts = item.name.split(' ');
  const firstName = nameParts[0];
  const restName = nameParts.slice(1).join(' ');

  return (
    <div className={styles.container} ref={containerRef}>
      {/* 1. THE GRAND HERO - EDITORIAL SPLIT LAYOUT */}
      <section className={styles.heroSection}>
        {/* Background Ornament */}
        <div className={styles.heroOrnament}></div>

        <motion.div
          className={styles.breadcrumb}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Link href="/" className={styles.breadcrumbLink}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
          </Link>
          <span className={styles.breadcrumbSeparator}>›</span>
          <Link href="/kuliner/katalog" className={styles.breadcrumbLink}>Kuliner</Link>
          <span className={styles.breadcrumbSeparator}>›</span>
          <Link href="/kuliner/katalog" className={styles.breadcrumbLink}>Katalog</Link>
          <span className={styles.breadcrumbSeparator}>›</span>
          <span className={styles.breadcrumbCurrent}>{item.name}</span>
        </motion.div>

        <div className={styles.heroLeft}>

          <motion.h1
            className={styles.title}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            {firstName} <span className={styles.titleHighlight}>{restName}</span>
          </motion.h1>

          <motion.div
            className={styles.subtitleWrapper}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <span className={`${styles.subtitleOrnament} ${styles.mobileOnly}`}>
              <Image
                src="/motif/motif_highlight_kiri.webp"
                alt="Ornament Kiri"
                width={80}
                height={20}
                className={styles.ornamentImg}
                unoptimized
              />
            </span>
            <span>Cita Rasa {item.tasteProfile} Khas {item.origin}</span>
            <span className={styles.subtitleOrnament}>
              <Image
                src="/motif/motif_highlight_kanan.webp"
                alt="Ornament"
                width={80}
                height={20}
                className={styles.ornamentImg}
                unoptimized
              />
            </span>
          </motion.div>
          <motion.div
            className={styles.subtitleSeparator}
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 150 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          ></motion.div>

          <motion.p
            className={styles.shortDesc}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            {item.shortDescription}
          </motion.p>

          <motion.div
            className={styles.actionCards}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className={styles.actionCard}>
              <div className={styles.actionCardImgPopup}>
                <Image src={getCategoryIcon(item.category)} alt="Kategori" fill unoptimized className={styles.popupImg} />
              </div>
              <div className={styles.actionCardText}>
                <strong>{item.category}</strong>
              </div>
            </div>

            <div className={styles.actionCard}>
              <div className={styles.actionCardImgPopup}>
                <Image src={getTasteIcon(item.tasteProfile)} alt="Rasa" fill unoptimized className={styles.popupImg} />
              </div>
              <div className={styles.actionCardText}>
                <strong>{item.tasteProfile}</strong>
              </div>
            </div>
          </motion.div>
        </div>

        <div className={styles.heroRight}>
          <div className={styles.heroImageFadeMask}>
            <Image
              src={item.galleryImages[0]}
              alt={item.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className={styles.heroImage}
              priority
            />
            {/* Steam Effect Overlay */}
            <div className={styles.steamWrapper}>
              <div className={styles.steam1}></div>
              <div className={styles.steam2}></div>
              <div className={styles.steam3}></div>
            </div>
          </div>

          {/* Location Card Step Shape with Image */}
          <motion.div
            className={styles.locationContainer}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <div className={styles.locationTextPart}>
              <div className={styles.locationIcon}>
                <svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z"></path></svg>
              </div>
              <div className={styles.locationText}>
                <strong>{item.origin},</strong>
                <span>Jawa Tengah</span>
              </div>
            </div>
            <div className={styles.locationMapPart}>
              <div className={styles.locationMapInner}>
                <img
                  src="/kuliner/pemandangan_jateng.webp"
                  alt={`Pemandangan ${item.origin}`}
                  className={styles.locationMapImg}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* TRANSISI WAYANG */}
      <div className={styles.transitionWrapper}>
        <Image 
          src="/motif/transisi_1.webp" 
          alt="Transisi Wayang" 
          fill 
          sizes="100vw"
          className={styles.transitionImage}
          unoptimized 
        />
      </div>

      {/* 2. THE LORE & HISTORY (GSAP Horizontal Timeline) */}
      <HistoryTimeline item={item} />

      {/* 3. ANIMATED DECONSTRUCTED INGREDIENTS */}
      <section className={styles.ingredientsSection}>
        {/* Spinning Side Motifs */}
        <div className={styles.spinningMotifLeft}>
          <Image src="/motif/motif_bunga_2.webp" alt="Motif Bunga Kiri" fill sizes="30vw" className={styles.spinningImage} unoptimized />
        </div>
        <div className={styles.spinningMotifRight}>
          <Image src="/motif/motif_bunga_2.webp" alt="Motif Bunga Kanan" fill sizes="30vw" className={styles.spinningImage} unoptimized />
        </div>

        <motion.div
          className={styles.sectionHeader}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className={styles.dekorWrapper}>
            <Image src="/motif/dekor_header_atas.webp" alt="Dekorasi Atas" width={250} height={40} className={styles.dekorImage} unoptimized />
          </div>
          <h2 className={styles.ingredientsTitle}>Bahan-Bahan</h2>
          <div className={styles.dekorWrapper}>
            <Image src="/motif/dekor_header_bawah.webp" alt="Dekorasi Bawah" width={250} height={40} className={styles.dekorImage} unoptimized />
          </div>
        </motion.div>

        {item.ingredients && <RecipeBook ingredients={item.ingredients} />}
      </section>

      {/* TRANSITION DIVIDER */}
      <BatikTransition />

      {/* 4. HOW TO COOK / CARA MEMASAK */}
      {item.instructions && item.instructions.length > 0 && (
        <CookingMethods instructions={item.instructions} />
      )}

      {/* 5. NEXT JOURNEY */}
      <section className={styles.nextJourney}>
        {/* Motif Tengah (Sangat Transparan) */}
        <Image src="/motif/motif_bunga_card.webp" alt="Motif Latar" width={600} height={600} className={styles.centerMotif} unoptimized />

        {/* Lampu */}
        <Image src="/kuliner/methods/lampu.webp" alt="Lampu Kiri" width={120} height={350} className={styles.lampLeft} unoptimized />
        <Image src="/kuliner/methods/lampu.webp" alt="Lampu Kanan" width={120} height={350} className={styles.lampRight} unoptimized />

        {/* Ornamen Bawah - Array Cekung (Wayang di kiri, Gunungan di kanan) */}
        {/* Lapis 1 (Pojok Besar) */}
        <Image src="/kuliner/methods/bawah_kiri.webp" alt="Ornamen Kiri 1" width={450} height={500} className={styles.ornamentLeft} unoptimized />
        <Image src="/kuliner/methods/bawah_kanan.webp" alt="Ornamen Kanan 1" width={450} height={500} className={styles.ornamentRight} unoptimized />
        
        {/* Lapis 2 (Menengah) */}
        <Image src="/kuliner/methods/bawah_kiri.webp" alt="Ornamen Kiri 2" width={300} height={350} className={styles.ornamentLeftMid} unoptimized />
        <Image src="/kuliner/methods/bawah_kanan.webp" alt="Ornamen Kanan 2" width={300} height={350} className={styles.ornamentRightMid} unoptimized />
        
        {/* Lapis 3 (Kecil Tengah) */}
        <Image src="/kuliner/methods/bawah_kiri.webp" alt="Ornamen Kiri 3" width={200} height={250} className={styles.ornamentLeftInner} unoptimized />
        <Image src="/kuliner/methods/bawah_kanan.webp" alt="Ornamen Kanan 3" width={200} height={250} className={styles.ornamentRightInner} unoptimized />

        <div style={{ display: 'flex', justifyContent: 'center', width: '100%', position: 'relative', zIndex: 10 }}>
          <ExploreButton 
            href="/kuliner/katalog" 
            textDesktop="Kembali ke Katalog" 
            textTablet="Kembali ke Katalog"
            textMobile="Kembali"
            hideMotif={true}
          />
        </div>
      </section>
      <FooterSection />
    </div>
  );
}
