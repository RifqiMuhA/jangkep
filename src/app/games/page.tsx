"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './games.module.css';
import { Clock, Camera, MapPin, Star, MousePointer2, Move, RefreshCcw, Eye, X } from 'lucide-react';

const GAMES_DATA = [
  {
    id: 'game1',
    title: 'Racik Masakan Jawa',
    tag: 'Drag & Drop',
    desc: 'Bantu Si Podo meracik bumbu dan bahan yang tepat ke dalam wajan masakan.',
    mascot: '/games/mascot_racik.webp',
    headerImage: '/games/card/card_header_dragdrop.webp',
    rules: [
      { text: 'Pilih bahan yang tepat sesuai resep masakan.', icon: <MousePointer2 size={18} strokeWidth={2.5} /> },
      { text: 'Tarik (drag) bahan tersebut dan lepaskan ke dalam wajan.', icon: <Move size={18} strokeWidth={2.5} /> },
      { text: 'Bahan yang salah akan mental dan membal kembali.', icon: <RefreshCcw size={18} strokeWidth={2.5} /> },
      { text: 'Lengkapi resep secepat mungkin untuk mendapatkan skor tinggi!', icon: <Clock size={18} strokeWidth={2.5} /> }
    ]
  },
  {
    id: 'game2',
    title: 'Dari Kota Mana?',
    tag: 'Peta Buta',
    desc: 'Tarik hidangan kuliner ke kabupaten atau kota asalnya yang benar di peta.',
    mascot: '/games/mascot_kotamana.webp',
    headerImage: '/games/card/card_header_petabuta.webp',
    rules: [
      { text: 'Kamu punya waktu 60 detik.', icon: <Clock size={18} strokeWidth={2.5} /> },
      { text: 'Tarik foto makanan ke atas peta Jawa Tengah.', icon: <Camera size={18} strokeWidth={2.5} /> },
      { text: 'Cocokkan dengan kabupaten/kota tempat makanan itu berasal.', icon: <MapPin size={18} strokeWidth={2.5} /> },
      { text: 'Jawaban benar akan membuat peta menyala!', icon: <Star size={18} strokeWidth={2.5} /> }
    ]
  },
  {
    id: 'game3',
    title: 'Kenali Masakanmu',
    tag: 'Kuis Visual',
    desc: 'Tebak nama masakan dari gambar buram yang perlahan-lahan menjadi jelas.',
    mascot: '/games/mascot_kenali.webp',
    headerImage: '/games/card/card_header_kuisvisual.webp',
    rules: [
      { text: 'Akan muncul sebuah foto masakan Jawa Tengah.', icon: <Camera size={18} strokeWidth={2.5} /> },
      { text: 'Foto sangat buram di awal dan perlahan menjadi jelas.', icon: <Eye size={18} strokeWidth={2.5} /> },
      { text: 'Kamu punya waktu 15 detik per soal untuk menjawab.', icon: <Clock size={18} strokeWidth={2.5} /> },
      { text: 'Tebak secepat mungkin dari 4 pilihan yang tersedia!', icon: <Star size={18} strokeWidth={2.5} /> }
    ]
  }
];

export default function GamesPage() {
  const [selectedGame, setSelectedGame] = useState<typeof GAMES_DATA[0] | null>(null);

  const openModal = (game: typeof GAMES_DATA[0]) => {
    setSelectedGame(game);
    // Prevent background scrolling when modal is open
    if (typeof window !== 'undefined') {
      document.body.style.overflow = 'hidden';
    }
  };

  const closeModal = () => {
    setSelectedGame(null);
    if (typeof window !== 'undefined') {
      document.body.style.overflow = '';
    }
  };

  return (
    <main className={styles.portalBackground}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <h1 className={styles.heroTitle}>Dolan & Sinau</h1>
        <div className={styles.heroOrnament}>
          <img src="/motif/dekor_header_bawah.webp" alt="" className={styles.ornamentImage} />
        </div>
        <p className={styles.heroSubtitle}>
          Uji wawasanmu tentang kekayaan kuliner Jawa Tengah! Bermain<br className={styles.desktopOnlyBreak} />
          bersama Si Podo dan raih skor tertinggi di berbagai tantangan<br className={styles.desktopOnlyBreak} />
          seru.
        </p>
      </section>

      {/* Games Section */}
      <section className={styles.gamesSection}>
        {/* Transition */}
        <div className={styles.transitionWrapper}>
          <img src="/games/transisi.webp" alt="" className={styles.transitionImage} />
        </div>

        {/* Texture Overlay */}
        <div className={styles.textureOverlay} />
        

      {/* Games Etalase */}
      <section className={styles.gamesGrid}>
        {GAMES_DATA.map((game) => (
          <div key={game.id} className={styles.gameCard}>
            <div className={styles.cardHeaderRibbon}>
              <Image src={game.headerImage} alt={game.tag} fill className={styles.ribbonImage} unoptimized />
            </div>

            <div className={styles.cardMascotWrapper}>
              <Image src="/games/card/card_tengah.webp" alt="Background" fill className={styles.cardCenterBg} unoptimized />
              <Image 
                src={game.mascot} 
                alt={game.title} 
                width={220} 
                height={220} 
                className={`${styles.cardMascot} ${styles[`mascot_${game.id}`]}`}
                unoptimized
              />
            </div>
            
            <div className={styles.cardContent}>
              <h2 className={styles.cardTitle}>{game.title}</h2>
              <p className={styles.cardDesc}>{game.desc}</p>
              <button className={styles.cardCta} onClick={() => openModal(game)}>Cara Bermain</button>
            </div>
          </div>
        ))}
        </section>
      </section>

      {/* Modal */}
      <div className={`${styles.modalOverlay} ${selectedGame ? styles.active : ''}`} onClick={closeModal}>
        <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
          <button className={styles.closeButton} onClick={closeModal} aria-label="Tutup">
            <X size={20} strokeWidth={3} />
          </button>
          
          <div className={styles.modalScrollArea}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>{selectedGame?.title}</h3>
            </div>
          
          <div className={styles.modalBody}>
            <div className={styles.modalLeft}>
              <div className={styles.caraBermainBadge}>
                <Image src="/games/modal/motif_highlight_kiri.webp" alt="Ornament Kiri" width={40} height={20} className={styles.highlightOrnament} unoptimized />
                <span>Cara Bermain</span>
                <Image src="/games/modal/motif_highlight_kanan.webp" alt="Ornament Kanan" width={40} height={20} className={styles.highlightOrnament} unoptimized />
              </div>
              <ul className={styles.modalList}>
                {selectedGame?.rules.map((rule, idx) => (
                  <li key={idx}>
                    <div className={styles.ruleIconWrapper}>
                      <Image src="/games/modal/bulat.webp" alt="Icon bg" fill className={styles.ruleIconBg} unoptimized />
                      <div className={styles.ruleIconFront}>{rule.icon}</div>
                    </div>
                    <span>
                      {rule.text.includes('menyala!') || rule.text.includes('detik') ? (
                        <span dangerouslySetInnerHTML={{__html: rule.text.replace('60 detik.', '<span style="color:var(--color-rasa-segar); font-weight:700;">60 detik.</span>').replace('15 detik', '<span style="color:var(--color-rasa-segar); font-weight:700;">15 detik</span>').replace('peta menyala!', '<span style="color:var(--color-rasa-segar); font-weight:700;">peta menyala!</span>')}} />
                      ) : (
                        rule.text
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className={styles.modalRight}>
              <div className={styles.modalMascotWrapper}>
                <Image 
                  src={selectedGame?.mascot || ''} 
                  alt="Mascot" 
                  fill 
                  className={styles.modalMascot} 
                  unoptimized 
                />
              </div>
            </div>
          </div>
          
            <div className={styles.modalAction}>
              <Link href={`/games/${selectedGame?.id}`} className={styles.playButton} onClick={closeModal}>
                Mulai Main!
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
