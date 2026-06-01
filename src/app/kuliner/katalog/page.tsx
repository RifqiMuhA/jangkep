'use client';

import React, { useState, useMemo, useEffect } from 'react';
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
  const [isCatHovered, setIsCatHovered] = useState(false);
  const [isTasteHovered, setIsTasteHovered] = useState(false);

  const { scrollY } = useScroll();
  const yParallax = useTransform(scrollY, [0, 2000], [0, 400]);

  // Helper untuk mendapatkan 3 item selanjutnya secara memutar
  const getNextItems = (current: string, list: string[], count: number = 3) => {
    const idx = list.indexOf(current);
    const nextItems = [];
    for (let i = 1; i <= count; i++) {
      nextItems.push(list[(idx + i) % list.length]);
    }
    return nextItems;
  };

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

  const [columnCount, setColumnCount] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 480) {
        setColumnCount(1);
      } else if (window.innerWidth <= 768) {
        setColumnCount(2);
      } else {
        setColumnCount(3);
      }
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Split data into columns dynamically based on screen size
  const col1 = filteredData.filter((_, i) => i % columnCount === 0);
  const col2 = columnCount >= 2 ? filteredData.filter((_, i) => i % columnCount === 1) : [];
  const col3 = columnCount >= 3 ? filteredData.filter((_, i) => i % columnCount === 2) : [];

  const getFilterCategoryBadgeClass = (cat: string) => {
    switch (cat) {
      case 'Makanan Berat': return styles.badgeMakananBerat;
      case 'Jajanan': return styles.badgeJajanan;
      case 'Minuman': return styles.badgeMinuman;
      default: return '';
    }
  };

  const getFilterTasteBadgeClass = (taste: string) => {
    switch (taste) {
      case 'Pedas': return styles.badgePedas;
      case 'Gurih': return styles.badgeGurih;
      case 'Segar': return styles.badgeSegar;
      case 'Manis': return styles.badgeManis;
      default: return '';
    }
  };

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
                &quot;Tampilkan <span
                  className={styles.selector}
                  onClick={cycleCategory}
                  onMouseEnter={() => setIsCatHovered(true)}
                  onMouseLeave={() => setIsCatHovered(false)}
                >
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
                  {/* Bubble Menu Radial */}
                  <AnimatePresence>
                    {isCatHovered && (
                      <motion.div
                        className={styles.bubbleMenu}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, transition: { duration: 0.2 } }}
                      >
                        <AnimatePresence mode="popLayout">
                          {getNextItems(activeCategory, categories).map((item, index) => (
                            <motion.div
                              key={item}
                              layout
                              initial={{ opacity: 0, y: 30, scale: 0.8 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: -30, scale: 0.8, transition: { duration: 0.2 } }}
                              transition={{ type: "spring", stiffness: 300, damping: 25 }}
                              className={`${styles.bubbleItem} ${styles[`bubble${index + 1}`]} ${getFilterCategoryBadgeClass(item)}`}
                            /* onClick dihilangkan agar tidak bisa diklik secara individual */
                            >
                              {item}
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </span><br className={styles.desktopBr} />
                dengan rasa <span
                  className={styles.selector}
                  onClick={cycleTaste}
                  onMouseEnter={() => setIsTasteHovered(true)}
                  onMouseLeave={() => setIsTasteHovered(false)}
                >
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
                  {/* Bubble Menu Radial */}
                  <AnimatePresence>
                    {isTasteHovered && (
                      <motion.div
                        className={styles.bubbleMenu}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, transition: { duration: 0.2 } }}
                      >
                        <AnimatePresence mode="popLayout">
                          {getNextItems(activeTaste, tastes).map((item, index) => (
                            <motion.div
                              key={item}
                              layout
                              initial={{ opacity: 0, y: 30, scale: 0.8 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: -30, scale: 0.8, transition: { duration: 0.2 } }}
                              transition={{ type: "spring", stiffness: 300, damping: 25 }}
                              className={`${styles.bubbleItem} ${styles[`bubble${index + 1}`]} ${getFilterTasteBadgeClass(item)}`}
                            /* onClick dihilangkan agar tidak bisa diklik secara individual */
                            >
                              {item}
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </span><br className={styles.desktopBr} />
                untuk saya jelajahi.&quot;
              </motion.div>

              <motion.p
                className={styles.subtitleText}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Temukan <span style={{ fontFamily: 'var(--font-aksara)', color: 'var(--color-coklat-batik, #3B1F0C)' }}>ꦏꦸꦭꦶꦤꦺꦂ</span> (kuliner) terbaik dari berbagai kabupaten Jawa Tengah.
              </motion.p>
            </div>

          <div className={styles.stickyMobileWrapper}>
            {/* Divider */}
            <motion.div
              className={styles.dividerContainer}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <img src="/motif/motif_highlight_kiri.webp" alt="decoration left" className={styles.dividerMotif} />
              <span className={styles.dividerText}>Kuliner Kanggo Seleramu</span>
              <img src="/motif/motif_highlight_kanan.webp" alt="decoration right" className={styles.dividerMotif} />
            </motion.div>

            {/* Visual Filters (Images) */}
            <motion.div
              className={styles.visualFilterContainer}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              {/* Left: Categories */}
              <div className={styles.visualGroup}>
                <div className={styles.visualCategories}>
                  <motion.img
                    src="/kuliner/makanan_berat.webp"
                    alt="Makanan Berat"
                    className={`${styles.filterImg} ${styles.imgMakananBerat}`}
                    onClick={(e) => { e.stopPropagation(); setActiveCategory(activeCategory === 'Makanan Berat' ? 'Semua Kategori' : 'Makanan Berat'); }}
                    animate={{
                      opacity: (activeCategory === 'Semua Kategori' || activeCategory === 'Makanan Berat') ? 1 : 0.4,
                      scale: activeCategory === 'Makanan Berat' ? 1.15 : (activeCategory === 'Semua Kategori' ? 1 : 0.8),
                      filter: (activeCategory === 'Semua Kategori' || activeCategory === 'Makanan Berat') ? 'grayscale(0%)' : 'grayscale(100%)',
                      zIndex: activeCategory === 'Makanan Berat' ? 10 : 1
                    }}
                    whileHover={{ scale: activeCategory === 'Makanan Berat' ? 1.2 : 1.05 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    style={{ cursor: 'pointer' }}
                  />
                  <motion.img
                    src="/kuliner/jajanan.webp"
                    alt="Jajanan"
                    className={`${styles.filterImg} ${styles.imgJajanan}`}
                    onClick={(e) => { e.stopPropagation(); setActiveCategory(activeCategory === 'Jajanan' ? 'Semua Kategori' : 'Jajanan'); }}
                    animate={{
                      opacity: (activeCategory === 'Semua Kategori' || activeCategory === 'Jajanan') ? 1 : 0.4,
                      scale: activeCategory === 'Jajanan' ? 1.15 : (activeCategory === 'Semua Kategori' ? 1 : 0.8),
                      filter: (activeCategory === 'Semua Kategori' || activeCategory === 'Jajanan') ? 'grayscale(0%)' : 'grayscale(100%)',
                      zIndex: activeCategory === 'Jajanan' ? 10 : 2
                    }}
                    whileHover={{ scale: activeCategory === 'Jajanan' ? 1.2 : 1.05 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    style={{ cursor: 'pointer' }}
                  />
                  <motion.img
                    src="/kuliner/minuman.webp"
                    alt="Minuman"
                    className={`${styles.filterImg} ${styles.imgMinuman}`}
                    onClick={(e) => { e.stopPropagation(); setActiveCategory(activeCategory === 'Minuman' ? 'Semua Kategori' : 'Minuman'); }}
                    animate={{
                      opacity: (activeCategory === 'Semua Kategori' || activeCategory === 'Minuman') ? 1 : 0.4,
                      scale: activeCategory === 'Minuman' ? 1.15 : (activeCategory === 'Semua Kategori' ? 1 : 0.8),
                      filter: (activeCategory === 'Semua Kategori' || activeCategory === 'Minuman') ? 'grayscale(0%)' : 'grayscale(100%)',
                      zIndex: activeCategory === 'Minuman' ? 10 : 0
                    }}
                    whileHover={{ scale: activeCategory === 'Minuman' ? 1.2 : 1.05 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    style={{ cursor: 'pointer' }}
                  />
                </div>
                <div className={`${styles.filterBadge} ${activeCategory === 'Makanan Berat' ? styles.badgeMakananBerat : activeCategory === 'Jajanan' ? styles.badgeJajanan : activeCategory === 'Minuman' ? styles.badgeMinuman : ''}`}>{activeCategory}</div>
              </div>

              {/* Right: Tastes on Tampah */}
              <div className={styles.visualGroup}>
                <div className={styles.visualTastes}>
                  <motion.img
                    src="/kuliner/tampah.webp"
                    alt="Tampah"
                    className={`${styles.filterImg} ${styles.imgTampah}`}
                    onClick={(e) => { e.stopPropagation(); setActiveTaste('Semua Rasa'); }}
                    whileHover={{ scale: 1.02 }}
                    style={{ cursor: 'pointer' }}
                  />
                  <motion.img
                    src="/kuliner/cabai.webp"
                    alt="Cabai"
                    className={`${styles.filterImg} ${styles.imgCabai}`}
                    onClick={(e) => { e.stopPropagation(); setActiveTaste(activeTaste === 'Pedas' ? 'Semua Rasa' : 'Pedas'); }}
                    animate={{
                      opacity: (activeTaste === 'Semua Rasa' || activeTaste === 'Pedas') ? 1 : 0.4,
                      scale: activeTaste === 'Pedas' ? 1.2 : (activeTaste === 'Semua Rasa' ? 1 : 0.8),
                      filter: (activeTaste === 'Semua Rasa' || activeTaste === 'Pedas') ? 'grayscale(0%)' : 'grayscale(100%)',
                      zIndex: activeTaste === 'Pedas' ? 20 : 3 /* Cabai di depan lemon */
                    }}
                    whileHover={{ scale: activeTaste === 'Pedas' ? 1.25 : 1.05 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    style={{ cursor: 'pointer' }}
                  />
                  <motion.img
                    src="/kuliner/garam.webp"
                    alt="Garam"
                    className={`${styles.filterImg} ${styles.imgGaram}`}
                    onClick={(e) => { e.stopPropagation(); setActiveTaste(activeTaste === 'Gurih' ? 'Semua Rasa' : 'Gurih'); }}
                    animate={{
                      opacity: (activeTaste === 'Semua Rasa' || activeTaste === 'Gurih') ? 1 : 0.4,
                      scale: activeTaste === 'Gurih' ? 1.2 : (activeTaste === 'Semua Rasa' ? 1 : 0.8),
                      filter: (activeTaste === 'Semua Rasa' || activeTaste === 'Gurih') ? 'grayscale(0%)' : 'grayscale(100%)',
                      zIndex: activeTaste === 'Gurih' ? 20 : 1
                    }}
                    whileHover={{ scale: activeTaste === 'Gurih' ? 1.25 : 1.05 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    style={{ cursor: 'pointer' }}
                  />
                  <motion.img
                    src="/kuliner/lemon.webp"
                    alt="Lemon"
                    className={`${styles.filterImg} ${styles.imgLemon}`}
                    onClick={(e) => { e.stopPropagation(); setActiveTaste(activeTaste === 'Segar' ? 'Semua Rasa' : 'Segar'); }}
                    animate={{
                      opacity: (activeTaste === 'Semua Rasa' || activeTaste === 'Segar') ? 1 : 0.4,
                      scale: activeTaste === 'Segar' ? 1.2 : (activeTaste === 'Semua Rasa' ? 1 : 0.8),
                      filter: (activeTaste === 'Semua Rasa' || activeTaste === 'Segar') ? 'grayscale(0%)' : 'grayscale(100%)',
                      zIndex: activeTaste === 'Segar' ? 20 : 2 /* Lemon di belakang cabai */
                    }}
                    whileHover={{ scale: activeTaste === 'Segar' ? 1.25 : 1.05 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    style={{ cursor: 'pointer' }}
                  />
                  <motion.img
                    src="/kuliner/madu.webp"
                    alt="Madu"
                    className={`${styles.filterImg} ${styles.imgMadu}`}
                    onClick={(e) => { e.stopPropagation(); setActiveTaste(activeTaste === 'Manis' ? 'Semua Rasa' : 'Manis'); }}
                    animate={{
                      opacity: (activeTaste === 'Semua Rasa' || activeTaste === 'Manis') ? 1 : 0.4,
                      scale: activeTaste === 'Manis' ? 1.2 : (activeTaste === 'Semua Rasa' ? 1 : 0.8),
                      filter: (activeTaste === 'Semua Rasa' || activeTaste === 'Manis') ? 'grayscale(0%)' : 'grayscale(100%)',
                      zIndex: activeTaste === 'Manis' ? 20 : 4
                    }}
                    whileHover={{ scale: activeTaste === 'Manis' ? 1.25 : 1.05 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    style={{ cursor: 'pointer' }}
                  />
                </div>
                <div className={`${styles.filterBadge} ${getFilterTasteBadgeClass(activeTaste)}`}>{activeTaste}</div>
              </div>
            </motion.div>

          <motion.div
            className={styles.searchSection}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {/* Mascot Peeking from Search Bar */}
            <div className={styles.mascotPeekingContainer}>
              <div className={styles.floatingQuestions}>
                <span className={`${styles.qMark} ${styles.q1}`}>?</span>
                <span className={`${styles.qMark} ${styles.q2}`}>?</span>
                <span className={`${styles.qMark} ${styles.q3}`}>?</span>
              </div>
              <Image src="/kuliner/mascot_ngintip_1.webp" alt="Mascot Peeking" fill className={`${styles.mascotImg} ${styles.mascot1}`} />
              <Image src="/kuliner/mascot_ngintip_2.webp" alt="Mascot Peeking" fill className={`${styles.mascotImg} ${styles.mascot2}`} />
              <Image src="/kuliner/mascot_ngintip_3.webp" alt="Mascot Peeking" fill className={`${styles.mascotImg} ${styles.mascot3}`} />
            </div>

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
          </div>
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
              {columnCount >= 2 && (
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
              )}

              {/* Kolom 3 */}
              {columnCount >= 3 && (
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
              )}

            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className={styles.emptyState}
            >
              <Image
                src="/kuliner/mascot_not_found.webp"
                alt="Tidak Ditemukan"
                width={150}
                height={150}
                className={styles.notFoundImg}
                unoptimized
              />
              <p className={styles.notFoundText}>Sepurane, kuliner sing sampeyan goleki durung ana. Coba golek sing liyane ya!</p>
            </motion.div>
          )}
        </main>
      </div>
    </main>
  );
}

// Sub-komponen Card
function CardItem({ item }: { item: any }) {
  const getBadgeClass = (category: string) => {
    switch (category) {
      case 'Makanan Berat': return styles.badgeMakananBerat;
      case 'Jajanan': return styles.badgeJajanan;
      case 'Minuman': return styles.badgeMinuman;
      default: return styles.badgeMakananBerat;
    }
  };

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

        <div className={`${styles.cardCategoryBadge} ${getBadgeClass(item.category)}`}>
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
