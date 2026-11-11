'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { Camera } from 'lucide-react';
import styles from './BongkarFab.module.css';

/** Halaman tempat tombol tidak ditampilkan: halaman Bongkar sendiri, serta Dolan dan Peta Rasa yang punya kontrol layar penuh. */
const HIDDEN_ON = ['/bongkar', '/games', '/maps'];
/** Sapaan otomatis hanya sekali per kunjungan (sesi browser). */
const GREETED_KEY = 'jangkep-bongkar-disapa';
const GREET_DELAY_MS = 2500;
const GREET_DURATION_MS = 6000;

function alreadyGreeted(): boolean {
  try {
    return sessionStorage.getItem(GREETED_KEY) === '1';
  } catch {
    return false;
  }
}

function markGreeted() {
  try {
    sessionStorage.setItem(GREETED_KEY, '1');
  } catch {
    // Penyimpanan diblokir: sapaan mungkin muncul lagi, tidak masalah.
  }
}

/**
 * Tombol mengambang Bongkar Rempah di pojok kanan bawah.
 * Klik langsung membuka /bongkar; saat disorot muncul balon sapaan Si Podo bertema Jawa.
 */
export default function BongkarFab() {
  const pathname = usePathname();
  const hidden = HIDDEN_ON.some((path) => pathname === path || pathname.startsWith(`${path}/`));

  const [hovered, setHovered] = useState(false);
  const [greeting, setGreeting] = useState(false);
  const [tucked, setTucked] = useState(false);
  const showBubble = (hovered || greeting) && !tucked;

  // Sapaan Si Podo sekali per kunjungan.
  useEffect(() => {
    if (hidden || alreadyGreeted()) return;
    const show = window.setTimeout(() => {
      setGreeting(true);
      markGreeted();
    }, GREET_DELAY_MS);
    const hide = window.setTimeout(() => setGreeting(false), GREET_DELAY_MS + GREET_DURATION_MS);
    return () => {
      window.clearTimeout(show);
      window.clearTimeout(hide);
    };
  }, [hidden]);

  // Di ponsel, tombol bersembunyi saat menggulir ke bawah supaya tidak menutupi isi, lalu muncul lagi saat menggulir ke atas.
  useEffect(() => {
    if (hidden) return;
    const mobile = window.matchMedia('(max-width: 768px)');
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (Math.abs(y - lastY) < 12) return;
      setTucked(mobile.matches && y > lastY && y > 120);
      lastY = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [hidden]);

  if (hidden) return null;

  return (
    <div className={`${styles.root} ${tucked ? styles.tucked : ''}`}>
      <AnimatePresence>
        {showBubble && (
          <motion.div
            id="bongkar-fab-bubble"
            className={styles.bubble}
            role="tooltip"
            initial={{ opacity: 0, x: 14, scale: 0.92 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 8, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
          >
            <span className={styles.bubbleAksara} aria-hidden>
              ꦧꦺꦴꦁꦏꦂ ꦉꦩ꧀ꦥꦃ
            </span>
            <span className={styles.bubbleTitle}>Monggo, bongkar rempahe!</span>
            <span className={styles.bubbleText}>Punya foto masakan? Klik aku, tak tebak bumbune.</span>
            <span className={styles.bubbleOrnament} aria-hidden>
              <Image src="/motif/dekor_header_bawah.webp" alt="" width={110} height={21} />
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Animasi masuk (framer-motion) dan goyangan (CSS) di pembungkus terpisah supaya transform-nya tidak bertabrakan */}
      <motion.span
        className={styles.enter}
        initial={{ scale: 0, rotate: -30 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.6 }}
      >
      <span className={styles.wiggle}>
        {/* Medalion bunga khas Jawa yang berputar pelan, dengan pendar emas lembut */}
        <span className={styles.glow} aria-hidden />
        <span className={styles.medallion} aria-hidden>
          <Image src="/motif/motif_bunga_card.webp" alt="" fill sizes="200px" />
        </span>
        <Link
          href="/bongkar"
          className={styles.fab}
          aria-label="Bongkar Rempah: tebak rempah dari foto masakan"
          aria-describedby={showBubble ? 'bongkar-fab-bubble' : undefined}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onFocus={() => setHovered(true)}
          onBlur={() => setHovered(false)}
          onClick={() => {
            setHovered(false);
            setGreeting(false);
          }}
        >
          <span className={styles.podo}>
            <Image src="/kuliner/mascot_kuliner_4.webp" alt="" fill sizes="160px" />
          </span>
          <span className={styles.cameraBadge} aria-hidden>
            <Camera size={13} strokeWidth={2.5} />
          </span>
        </Link>
      </span>
      </motion.span>
    </div>
  );
}
