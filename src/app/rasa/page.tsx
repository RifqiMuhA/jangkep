'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { rempahData, type Rempah } from '@/data/rempah';
import styles from './RasaPage.module.css';
import { X } from 'lucide-react';

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

const getGridClass = (index: number) => {
  const pattern = [
    styles.cardFull,   // BIG
    styles.cardHalf,   // SMALL SMALL (left)
    styles.cardHalf,   // SMALL SMALL (right)
    styles.cardSmall,  // SMALL BIG (left small)
    styles.cardLarge,  // SMALL BIG (right big)
    styles.cardFull,   // BIG
    styles.cardHalf,   // SMALL SMALL (left)
    styles.cardHalf    // SMALL SMALL (right)
  ];
  return pattern[index % pattern.length];
};

export default function RasaPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRempah, setSelectedRempah] = useState<Rempah | null>(null);
  
  const filteredRempah = rempahData.filter(r => 
    r.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.makanan.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.peran.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Body scroll lock when modal opens
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

  return (
    <main className={styles.page}>
      {/* Background Decor */}
      <div className={styles.pageBg}>
        <div className={styles.noise} />
        <Image src="/motif/wayang_2.webp" alt="" width={600} height={800} className={styles.wayangShadow} unoptimized />
        <Image src="/motif/wayang_2.webp" alt="" width={600} height={800} className={styles.wayangShadowRight} unoptimized />
        <div className={styles.aksaraBg}>ꦫꦱ</div>
      </div>

      <div className={styles.hero}>
        <h1 className={styles.title}>RASA</h1>
        <p className={styles.subtitle}>
          Ensiklopedia Jejak Rasa Jawa<br/><br/>
          Menelusuri rempah, aroma, dan warisan rasa yang membentuk kuliner Jawa Tengah.
        </p>
      </div>

      <div className={styles.searchContainer}>
        <input 
          type="text" 
          placeholder="Cari rempah atau masakan..."
          className={styles.searchInput}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className={styles.grid}>
        {rempahData.map((r, index) => {
          const isVisible = filteredRempah.some(filtered => filtered.id === r.id);
          // Apply opacity and scale for smooth filter
          const cardStyle: React.CSSProperties = {
            opacity: isVisible ? 1 : 0.1,
            transform: isVisible ? 'scale(1)' : 'scale(0.95)',
            pointerEvents: isVisible ? 'auto' : 'none',
          };

          return (
            <div 
              key={r.id} 
              className={`${styles.card} ${getGridClass(index)}`}
              style={cardStyle}
              onClick={() => isVisible && setSelectedRempah(r)}
            >
              <div className={styles.cardImageWrap}>
                <Image 
                  src={r.asset} 
                  alt={r.nama} 
                  fill
                  className={styles.cardImage}
                  unoptimized
                />
              </div>
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>{r.nama}</h3>
                <span className={styles.cardJawa}>{r.namaJawa}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* FULLSCREEN MODAL */}
      <div className={`${styles.modalOverlay} ${selectedRempah ? styles.active : ''}`} onClick={() => setSelectedRempah(null)}>
        <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
          <button className={styles.closeButton} onClick={() => setSelectedRempah(null)}>
            <X size={32} strokeWidth={2} />
          </button>
          
          {selectedRempah && (
            <>
              <div className={styles.modalLeft}>
                <div className={styles.modalLeftAksara}>{selectedRempah.namaJawa}</div>
                <div className={styles.modalLeftLatin}>{selectedRempah.nama}</div>
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
                
                <div className={styles.modalSectionTitle}>Karakter Rasa</div>
                <div className={styles.flavorBadges}>
                  {getFlavorTags(selectedRempah.peran).map(tag => (
                    <span key={tag} className={styles.badge}>{tag}</span>
                  ))}
                </div>

                <div className={styles.modalSectionTitle}>Cerita Rasa & Filosofi</div>
                <p className={styles.storyText}>{selectedRempah.peran}</p>

                <div className={styles.modalSectionTitle}>Dipakai Dalam</div>
                <div className={styles.foodCards}>
                  {selectedRempah.makanan.split(',').map((food, i) => (
                    <div key={i} className={styles.foodCard}>
                      {food.trim()}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
