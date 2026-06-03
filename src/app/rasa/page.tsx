'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { rempahData, type Rempah } from '@/data/rempah';
import styles from './RasaPage.module.css';
import { X } from 'lucide-react';

const FLAVOR_FILTERS = [
  { label: 'SEMUA', value: null },
  { label: 'AROMATIK', value: 'aromatik' },
  { label: 'HANGAT', value: 'hangat' },
  { label: 'UMAMI', value: 'umami' },
  { label: 'SEGAR', value: 'segar' },
  { label: 'MANIS', value: 'manis' },
  { label: 'PEKAT', value: 'pekat' },
  { label: 'BUMI', value: 'bumi' },
  { label: 'PAHIT', value: 'pahit' },
];

const getFlavorTags = (peran: string): string[] => {
  const tags: string[] = [];
  const text = peran.toLowerCase();
  if (text.includes('hitam') || text.includes('bumi') || text.includes('earthy')) tags.push('BUMI');
  if (text.includes('pahit') || text.includes('anise') || text.includes('getir')) tags.push('PAHIT');
  if (text.includes('gurih') || text.includes('umami') || text.includes('kaldu')) tags.push('UMAMI');
  if (text.includes('segar') || text.includes('asam') || text.includes('sitrus')) tags.push('SEGAR');
  if (text.includes('pedas') || text.includes('hangat')) tags.push('HANGAT');
  if (text.includes('manis') || text.includes('legit')) tags.push('MANIS');
  if (text.includes('aroma') || text.includes('wangi') || text.includes('harum')) tags.push('AROMATIK');
  if (text.includes('pekat') || text.includes('kuat') || text.includes('tajam')) tags.push('PEKAT');
  if (tags.length === 0) tags.push('OTENTIK');
  return tags;
};



const FOOD_ICONS = [
  <svg key="bowl" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><path d="M4 10h16a1 1 0 0 1 1 1v1a7 7 0 0 1-7 7h-4a7 7 0 0 1-7-7v-1a1 1 0 0 1 1-1Z"/><path d="M12 4v3"/></svg>,
  <svg key="pot" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><path d="M4 9h16"/><path d="M4 9v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9"/><path d="M8 4h8a2 2 0 0 1 2 2v3H6V6a2 2 0 0 1 2-2Z"/><path d="M2 12h2"/><path d="M20 12h2"/></svg>,
  <svg key="wok" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><path d="M3 10a9 9 0 0 0 18 0"/><path d="M21 10h-2"/><path d="M5 10H3"/><path d="M21 7v3"/><path d="M3 7v3"/></svg>,
  <svg key="plate" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><path d="M3 14c0 2.2 4 4 9 4s9-1.8 9-4"/><path d="M2 14h20"/></svg>,
  <svg key="claypot" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><path d="M7 6h10"/><path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2"/><path d="M5 11c0-4 2-5 2-5h10s2 1 2 5-3 10-7 10-7-6-7-10Z"/><path d="M5 11h14"/></svg>,
  <svg key="jar" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><path d="M6 7h12"/><path d="M8 4h8"/><path d="M8 4v3"/><path d="M16 4v3"/><path d="M7 7v13a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V7"/></svg>
];

const AKSARA_DICT: Record<string, string> = {
  'kluwek': 'ꦏꦭꦸꦮꦼꦏ꧀',
  'kemiri': 'ꦏꦼꦩꦶꦫꦶ',
  'daun-salam': 'ꦒꦺꦴꦝꦺꦴꦁꦱꦭꦩ꧀',
  'serai': 'ꦱꦼꦫꦺꦃ',
  'lengkuas': 'ꦭꦲꦺꦴꦱ꧀',
  'kencur': 'ꦕꦶꦏꦸꦂ',
  'ketumbar': 'ꦏꦼꦠꦸꦩ꧀ꦧꦂ',
  'gula-merah': 'ꦒꦸꦭꦗꦮ',
  'kunyit': 'ꦏꦸꦤꦶꦂ',
  'jahe': 'ꦗꦲꦺ',
  'bawang-merah': 'ꦧꦿꦩ꧀ꦧꦁ',
  'daun-jeruk': 'ꦒꦺꦴꦝꦺꦴꦁꦗꦼꦫꦸꦏ꧀',
  'pala': 'ꦥꦭ',
  'terasi': 'ꦠꦿꦱꦶ',
  'asam-jawa': 'ꦲꦱꦼꦩ꧀ꦗꦮ',
  'bunga-lawang': 'ꦥꦼꦏꦏ꧀',
  'kapulaga': 'ꦏꦥꦸꦭꦒ',
  'cengkeh': 'ꦕꦼꦁꦏꦺꦃ',
  'kayu-manis': 'ꦏꦪꦸꦩꦤꦶꦱ꧀',
  'kayu-secang': 'ꦱꦼꦕꦁ'
};



export default function RasaPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [selectedRempah, setSelectedRempah] = useState<Rempah | null>(null);
  
  // Pre-calculate tags so we don't do string matching on every render
  const rempahWithTags = useMemo(() => {
    return rempahData.map(r => ({
      ...r,
      tags: getFlavorTags(r.peran),
      lowerTags: getFlavorTags(r.peran).map(t => t.toLowerCase())
    }));
  }, []);

  const filteredRempah = useMemo(() => {
    return rempahWithTags.filter(r => {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = r.nama.toLowerCase().includes(searchLower) ||
                            r.makanan.toLowerCase().includes(searchLower) ||
                            r.peran.toLowerCase().includes(searchLower);
      
      const matchesFilter = activeFilter 
        ? r.lowerTags.includes(activeFilter.toLowerCase())
        : true;

      return matchesSearch && matchesFilter;
    });
  }, [searchQuery, activeFilter, rempahWithTags]);

  useEffect(() => {
    if (selectedRempah) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedRempah]);

  const selectedIndex = selectedRempah ? rempahData.findIndex(r => r.id === selectedRempah.id) : -1;
  const modalLeftClass = selectedIndex !== -1 && (selectedIndex % 4 === 1) ? styles.modalLeftYellow : '';

  return (
    <main className={styles.page}>
      
      <section className={styles.topSection}>
        <div className={styles.hero}>
          <h1 className={styles.titleJawa}>Jejak Rasa Jawa</h1>
          <div className={styles.heroOrnament}>
            <Image src="/motif/dekor_header_bawah.webp" alt="" width={300} height={24} className={styles.ornamentImage} unoptimized />
          </div>
          <p className={styles.subtitle}>
            Menelusuri rempah, aroma, dan warisan rasa yang membentuk kuliner Jawa Tengah.
          </p>
        </div>

        <div className={styles.searchWrapper}>
          <div className={styles.searchContainer}>
            <svg className={styles.searchIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input 
              type="text" 
              placeholder="Cari nama rempah..."
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className={styles.clearSearchStyled} onClick={() => setSearchQuery('')}>
                ×
              </button>
            )}
          </div>
        </div>

        <div className={styles.filterContainer}>
          {FLAVOR_FILTERS.map(f => (
            <button
              key={f.label}
              className={`${styles.filterPill} ${activeFilter === f.value ? styles.active : ''}`}
              onClick={() => setActiveFilter(activeFilter === f.value ? null : f.value)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </section>

      <section className={styles.bottomSection}>
        {/* Transition dipindah ke DALAM bottomSection agar position absolute top: 0 berada tepat di atas bagian gelap */}
        <div className={styles.transitionWrapper}>
          <img src="/games/transisi.webp" alt="" className={styles.transitionImage} />
        </div>

        {/* Texture Overlay */}
        <div className={styles.textureOverlay} />

        <div className={styles.grid}>
          <AnimatePresence>
          {filteredRempah.length > 0 ? (
            filteredRempah.map((r, visibleIndex) => (
              <motion.div 
                layout
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                whileHover={{ y: -8 }}
                transition={{ 
                  duration: 0.3,
                  layout: { type: "tween", ease: "easeInOut", duration: 0.35 }
                }}
                key={r.id}
                className={styles.card}
                onClick={() => setSelectedRempah(r)}
              >
                {/* Overlay texture/glow subtle */}
                <div className={styles.cardOverlay}></div>

                {/* Decorative Aksara overlay */}
                <div className={styles.cardAksaraOverlay}>{AKSARA_DICT[r.id]}</div>

                <div className={styles.cardTopLeft}>
                  <div className={styles.cardHeaderTop}>
                    <span className={styles.cardIndex}>{String(visibleIndex + 1).padStart(2, '0')}</span>
                  </div>
                  <h3 className={styles.cardTitle}>{r.nama}</h3>
                  <span className={styles.cardJawaScientific}>{r.namaJawa}</span>
                </div>
                
                <div className={styles.cardBottomLeft}>
                  <p className={styles.cardDesc}>{r.peran.split('.')[0] + '.'}</p>
                  <div className={styles.cardTags}>
                    {r.tags.slice(0, 3).map(tag => (
                      <span key={tag} className={styles.cardTag}>{tag}</span>
                    ))}
                  </div>
                </div>

                <div className={styles.cardImageBlock}>
                  <Image 
                    src={r.asset} 
                    alt={r.nama} 
                    fill
                    className={styles.cardImage}
                    unoptimized
                  />
                </div>
                
                <div className={styles.cardActionIcon}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div 
              key="not-found"
              layout="position"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
              transition={{ duration: 0.3 }}
              className={`${styles.card} ${styles.notFoundCard}`}
            >
              <div className={styles.cardOverlay}></div>
              
              <div className={styles.notFoundContent}>
                <Image src="/kuliner/mascot_not_found.webp" alt="Mascot Bingung" width={160} height={160} unoptimized />
                <h3>Waduh, Rempahnya Mboten Wonten!</h3>
                <p>Coba gunakan ejaan kata kunci yang lain atau pilih filter rasa yang berbeda untuk menemukan rempah yang kamu cari.</p>
              </div>
            </motion.div>
          )}
          </AnimatePresence>
        </div>
      </section>

      {/* FULLSCREEN MODAL */}
      <div className={`${styles.modalOverlay} ${selectedRempah ? styles.active : ''}`} onClick={() => setSelectedRempah(null)}>
        <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
          <button className={styles.closeButton} onClick={() => setSelectedRempah(null)}>
            <X size={32} strokeWidth={2} />
          </button>
          
          {selectedRempah && (
            <>
              <div className={`${styles.modalLeft} ${modalLeftClass}`}>
                <div className={styles.modalImageWrap}>
                  <Image 
                    src={selectedRempah.asset} 
                    alt={selectedRempah.nama} 
                    fill
                    style={{ objectFit: 'contain' }}
                    unoptimized
                  />
                </div>
              </div>
              
              <div className={styles.modalRight}>
                <h2 className={styles.modalTitle}>{selectedRempah.nama}</h2>
                <span className={styles.modalJawa}>{selectedRempah.namaJawa}</span>

                <div className={styles.modalSectionTitle}>
                  <span className={styles.sectionLabelText}>KARAKTER RASA</span>
                  <span className={styles.sectionLabelLine}></span>
                  <span className={styles.sectionLabelIcon}>◇</span>
                </div>
                <div className={styles.flavorBadges}>
                  {getFlavorTags(selectedRempah.peran).map(tag => (
                    <span key={tag} className={`${styles.badge} ${styles['badge' + tag]}`}>
                      {tag}
                    </span>
                  ))}
                </div>

                <div className={styles.modalSectionTitle}>
                  <span className={styles.sectionLabelText}>CERITA RASA & FILOSOFI</span>
                  <span className={styles.sectionLabelLine}></span>
                  <span className={styles.sectionLabelIcon}>◇</span>
                </div>
                <p className={styles.storyText}>{selectedRempah.peran}</p>

                <div className={styles.modalSectionTitle}>
                  <span className={styles.sectionLabelText}>DIPAKAI DALAM</span>
                  <span className={styles.sectionLabelLine}></span>
                  <span className={styles.sectionLabelIcon}>◇</span>
                </div>
                <div className={styles.foodCards}>
                  {selectedRempah.makanan.split(',').map((food, i) => (
                    <div key={i} className={styles.foodCard}>
                      <span className={styles.foodIcon}>
                        {FOOD_ICONS[i % FOOD_ICONS.length]}
                      </span>
                      <span>{food.trim()}</span>
                    </div>
                  ))}
                </div>

                <div className={styles.modalSectionTitle}>
                  <span className={styles.sectionLabelText}>AKSARA JAWA</span>
                  <span className={styles.sectionLabelLine}></span>
                  <span className={styles.sectionLabelIcon}>◇</span>
                </div>
                <div className={styles.aksaraBlock}>
                  <div className={styles.aksaraScript}>
                    {AKSARA_DICT[selectedRempah.id] || selectedRempah.namaJawa}
                  </div>
                </div>
              </div>

              {/* Cultural Ornament Watermark (Ditaruh di luar modalRight agar tidak kena overflow scroll) */}
              <div className={styles.modalCornerOrnament}>
                <Image
                  src="/motif/decorative-modal-rasa.webp"
                  alt=""
                  fill
                  className={styles.modalCornerImage}
                  unoptimized
                />
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
