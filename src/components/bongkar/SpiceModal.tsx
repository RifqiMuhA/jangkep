'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, X } from 'lucide-react';
import type { MatchedSpice } from '@/lib/bongkar/schema';
import styles from './SpiceModal.module.css';

interface SpiceModalProps {
  spice: MatchedSpice | null;
  onClose: () => void;
}

/** Detail satu rempah, mengikuti pola modal halaman Rasa. */
export default function SpiceModal({ spice, onClose }: SpiceModalProps) {
  useEffect(() => {
    if (!spice) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [spice, onClose]);

  return (
    <AnimatePresence>
      {spice && (
        <motion.div className={styles.overlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <motion.div
            className={styles.content}
            role="dialog"
            aria-modal="true"
            aria-labelledby="spice-modal-title"
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
            onClick={(e) => e.stopPropagation()}
            data-lenis-prevent
          >
            <button type="button" className={styles.close} onClick={onClose} aria-label="Tutup">
              <X size={28} strokeWidth={2} />
            </button>
            <div className={styles.left}>
              <motion.div
                className={styles.imageWrap}
                initial={{ scale: 0.6, rotate: -20, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 180, damping: 14, delay: 0.1 }}
              >
                <Image src={spice.asset} alt={spice.nama} fill sizes="(max-width: 768px) 70vw, 40vw" style={{ objectFit: 'contain' }} />
              </motion.div>
            </div>
            <div className={styles.right}>
              <h2 id="spice-modal-title" className={styles.title}>
                {spice.nama}
              </h2>
              <span className={styles.jawa}>{spice.namaJawa}</span>

              <div className={styles.sectionTitle}>
                <span>CERITA RASA</span>
                <span className={styles.line} />
              </div>
              <p className={styles.text}>{spice.peran}</p>

              <div className={styles.sectionTitle}>
                <span>DIPAKAI DALAM</span>
                <span className={styles.line} />
              </div>
              <div className={styles.chips}>
                {spice.makanan.split(',').map((food) => (
                  <span key={food} className={styles.chip}>
                    {food.trim()}
                  </span>
                ))}
              </div>

              <Link href="/rasa" className={styles.link}>
                Jelajahi semua rempah di halaman Rasa <ArrowRight size={16} strokeWidth={2.25} />
              </Link>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
