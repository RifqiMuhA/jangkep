'use client';

import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import styles from './VictoryCelebration.module.css';

/** Warna konfeti mengikuti palet Jangkep: kuning kepodang, emas keris, krem, merah bata, hijau daun. */
const COLORS = ['#F5C400', '#B8860B', '#F2EAD3', '#C0392B', '#4A7C3F', '#E8A33D'];
const PIECES_PER_SIDE = 46;
const SOUND_SRC = '/sounds/victory.mp3';

interface Piece {
  id: string;
  side: 'left' | 'right';
  color: string;
  size: number;
  shape: 'rect' | 'circle';
  dx: number;
  peak: number;
  fall: number;
  spin: number;
  delay: number;
  duration: number;
}

function makePieces(): Piece[] {
  const pieces: Piece[] = [];
  for (const side of ['left', 'right'] as const) {
    for (let i = 0; i < PIECES_PER_SIDE; i++) {
      pieces.push({
        id: `${side}-${i}`,
        side,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: 7 + Math.random() * 8,
        shape: Math.random() < 0.3 ? 'circle' : 'rect',
        // Ditembakkan miring ke tengah layar, naik tinggi, lalu jatuh pelan.
        dx: (25 + Math.random() * 45) * (side === 'left' ? 1 : -1),
        peak: 45 + Math.random() * 40,
        fall: 15 + Math.random() * 30,
        spin: (Math.random() < 0.5 ? -1 : 1) * (360 + Math.random() * 540),
        delay: Math.random() * 0.25,
        duration: 2.4 + Math.random() * 1.4,
      });
    }
  }
  return pieces;
}

/**
 * Efek pesta saat permainan selesai: konfeti ditembakkan dari kiri dan kanan bawah, plus suara kemenangan.
 * Dipasang saat layar hasil muncul; suara gagal diputar (misalnya diblokir browser) tidak mengganggu game.
 */
export default function VictoryCelebration() {
  const reduceMotion = useReducedMotion();
  const [pieces] = useState(makePieces);

  useEffect(() => {
    const audio = new Audio(SOUND_SRC);
    audio.volume = 0.6;
    audio.play().catch(() => {
      // Browser bisa menolak memutar suara; abaikan saja.
    });
    return () => {
      audio.pause();
    };
  }, []);

  if (reduceMotion) return null;

  return (
    <div className={styles.layer} aria-hidden>
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          className={`${styles.piece} ${p.side === 'left' ? styles.fromLeft : styles.fromRight} ${p.shape === 'circle' ? styles.circle : ''}`}
          style={{ backgroundColor: p.color, width: p.size, height: p.shape === 'circle' ? p.size : p.size * 1.6 }}
          initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
          animate={{
            x: [0, `${p.dx * 0.7}vw`, `${p.dx}vw`],
            y: [0, `${-p.peak}vh`, `${-p.peak + p.fall + 60}vh`],
            rotate: [0, p.spin * 0.5, p.spin],
            opacity: [1, 1, 0],
          }}
          transition={{ duration: p.duration, delay: p.delay, times: [0, 0.35, 1], ease: ['easeOut', 'easeIn'] }}
        />
      ))}
    </div>
  );
}
