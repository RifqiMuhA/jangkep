'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { kulinerData } from '@/data/kulinerData';
import styles from './katalog.module.css';

const categories = ['Semua Kategori', 'Makanan Berat', 'Jajanan', 'Minuman'];
const tastes = ['Semua Rasa', 'Manis', 'Gurih', 'Pedas', 'Segar'];

export default function KatalogKuliner() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [activeTaste, setActiveTaste] = useState(tastes[0]);

  const { scrollY } = useScroll();
  const yParallax = useTransform(scrollY, [0, 2000], [0, 400]);

  const cycleCategory = () => {
    const idx = categories.indexOf(activeCategory);
    setActiveCategory(categories[(idx + 1) % categories.length]);
  };

  const cycleTaste = () => {
    const idx = tastes.indexOf(activeTaste);
    setActiveTaste(tastes[(idx + 1) % tastes.length]);
  };

  // Filter logic
  const filteredData = useMemo(() => {
    return kulinerData.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'Semua Kategori' || item.category === activeCategory;
      const matchesTaste = activeTaste === 'Semua Rasa' || item.tasteProfile === activeTaste;

      return matchesSearch && matchesCategory && matchesTaste;
    });
  }, [searchQuery, activeCategory, activeTaste]);

  // Split data into 3 columns for parallax
  const col1 = filteredData.filter((_, i) => i % 3 === 0);
  const col2 = filteredData.filter((_, i) => i % 3 === 1);
  const col3 = filteredData.filter((_, i) => i % 3 === 2);

  return (
    <main className={styles.pageBackground}>
      <div className={styles.splitContainer}>

        {/* Sisi Kiri: Command Center */}
        <aside className={styles.commandCenter}>
          <div className={styles.sentenceWrapper}>
            <motion.div
              className={styles.sentenceText}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.165, 0.84, 0.44, 1] }}
            >
              &quot;Tampilkan <span className={styles.selector} onClick={cycleCategory}>
                <AnimatePresence mode="popLayout">
                  <motion.span
                    key={activeCategory}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    [{activeCategory}]
                  </motion.span>
                </AnimatePresence>
                <span className={styles.cycleHint}>Klik untuk mengganti</span>
              </span> dengan rasa <span className={styles.selector} onClick={cycleTaste}>
                <AnimatePresence mode="popLayout">
                  <motion.span
                    key={activeTaste}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    [{activeTaste}]
                  </motion.span>
                </AnimatePresence>
                <span className={styles.cycleHint}>Klik untuk mengganti</span>
              </span> untuk saya jelajahi.&quot;
            </motion.div>
          </div>

          <motion.div
            className={styles.searchSection}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className={styles.searchContainer}>
              <svg className={styles.searchIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input
                type="text"
                placeholder="Cari nama kuliner atau daerah..."
                className={styles.styledSearch}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button className={styles.clearSearchStyled} onClick={() => setSearchQuery('')}>
                  ×
                </button>
              )}
            </div>
          </motion.div>
        </aside>

        {/* Sisi Kanan: Parallax Playground */}
        <main className={styles.parallaxPlayground}>
          {filteredData.length > 0 ? (
            <div className={styles.parallaxColumns}>

              {/* Kolom 1 */}
              <div className={styles.col}>
                <AnimatePresence mode="popLayout">
                  {col1.map((item, index) => (
                    <motion.div
                      layout
                      key={item.slug}
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 30, delay: Math.min(index * 0.05, 0.3) }}
                    >
                      <CardItem item={item} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Kolom 2 (Parallax) */}
              <motion.div className={styles.col} style={{ y: yParallax, marginTop: '60px' }}>
                <AnimatePresence mode="popLayout">
                  {col2.map((item, index) => (
                    <motion.div
                      layout
                      key={item.slug}
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 30, delay: Math.min(index * 0.05, 0.3) }}
                    >
                      <CardItem item={item} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>

              {/* Kolom 3 */}
              <div className={styles.col} style={{ marginTop: '20px' }}>
                <AnimatePresence mode="popLayout">
                  {col3.map((item, index) => (
                    <motion.div
                      layout
                      key={item.slug}
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 30, delay: Math.min(index * 0.05, 0.3) }}
                    >
                      <CardItem item={item} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={styles.emptyState}
            >
              Maaf, kuliner yang Anda cari tidak dapat ditemukan.
            </motion.div>
          )}
        </main>
      </div>
    </main>
  );
}

// Sub-komponen Card
function CardItem({ item }: { item: any }) {
  return (
    <Link href={`/kuliner/katalog/${item.slug}`} className={styles.neatCard}>
      <div className={styles.cardImageWrapper}>
        <Image
          src={item.galleryImages[0]}
          alt={item.name}
          fill
          sizes="(max-width: 1024px) 50vw, 30vw"
          className={styles.cardImage}
          unoptimized={true}
        />
      </div>
      <div className={styles.cardInfo}>
        {/* Motif Kiri Atas — terpotong setengah */}
        <div className={`${styles.motif} ${styles.motifLeftTop}`}>
          <Image src="/motif/motif_bunga_card.webp" alt="" fill style={{ objectFit: 'contain' }} />
        </div>
        {/* Motif Kiri Bawah — terpotong setengah */}
        <div className={`${styles.motif} ${styles.motifLeftBottom}`}>
          <Image src="/motif/motif_bunga_card.webp" alt="" fill style={{ objectFit: 'contain' }} />
        </div>
        {/* Motif Kiri Tengah — hanya sebagian kecil terlihat */}
        <div className={`${styles.motif} ${styles.motifLeftCenter}`}>
          <Image src="/motif/motif_bunga_card.webp" alt="" fill style={{ objectFit: 'contain' }} />
        </div>
        {/* Motif Kanan Atas — sedang */}
        <div className={`${styles.motif} ${styles.motifRightTop}`}>
          <Image src="/motif/motif_bunga_card.webp" alt="" fill style={{ objectFit: 'contain' }} />
        </div>
        {/* Motif Kanan Bawah — besar */}
        <div className={`${styles.motif} ${styles.motifRightBottom}`}>
          <Image src="/motif/motif_bunga_card.webp" alt="" fill style={{ objectFit: 'contain' }} />
        </div>

        <div className={styles.cardCategoryBadge}>
          {item.category}
        </div>
        <h3 className={styles.cardTitle}>{item.name}</h3>
        <div className={styles.cardOriginText}>
          dari {item.origin}
        </div>
      </div>
    </Link>
  );
}
